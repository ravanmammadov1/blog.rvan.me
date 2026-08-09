import type { VercelRequest, VercelResponse } from "@vercel/node";
import { saveLinkedInToken } from "../../src/lib/linkedinStorage";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { code, error, error_description } = req.query;

  const protocol = (req.headers["x-forwarded-proto"] as string) || "https";
  const host = (req.headers["x-forwarded-host"] as string) || req.headers.host || "www.rvan.me";
  const adminRedirectBase = `${protocol}://${host}/admin/linkedin`;

  if (error) {
    const errMsg = (error_description as string) || (error as string) || "OAuth error";
    return res.redirect(302, `${adminRedirectBase}?error=${encodeURIComponent(errMsg)}`);
  }

  if (!code || typeof code !== "string") {
    return res.redirect(302, `${adminRedirectBase}?error=${encodeURIComponent("Missing authorization code")}`);
  }

  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return res.redirect(302, `${adminRedirectBase}?error=${encodeURIComponent("Missing client ID or secret in server configuration")}`);
  }

  const redirectUri =
    process.env.LINKEDIN_REDIRECT_URI || `${protocol}://${host}/api/linkedin/callback`;

  try {
    // 1. Exchange code for access token
    const tokenParams = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
      client_secret: clientSecret,
    });

    const tokenRes = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: tokenParams.toString(),
    });

    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      console.error("[linkedin/callback] Access Token Exchange Error:", errText);
      return res.redirect(302, `${adminRedirectBase}?error=${encodeURIComponent("Token exchange failed")}`);
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;
    const refreshToken = tokenData.refresh_token || null;
    const expiresInSeconds = tokenData.expires_in || 5184000; // default ~60 days
    const refreshTokenExpiresInSeconds = tokenData.refresh_token_expires_in || null;
    const scope = tokenData.scope || "w_member_social openid profile email";

    // 2. Fetch authenticated personal profile member URN using userinfo (OpenID Connect)
    const userinfoRes = await fetch("https://api.linkedin.com/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!userinfoRes.ok) {
      const errText = await userinfoRes.text();
      console.error("[linkedin/callback] Userinfo fetch error:", errText);
      return res.redirect(302, `${adminRedirectBase}?error=${encodeURIComponent("Failed to retrieve user profile")}`);
    }

    const userinfo = await userinfoRes.json();
    const memberSub = userinfo.sub; // LinkedIn member ID
    if (!memberSub) {
      return res.redirect(302, `${adminRedirectBase}?error=${encodeURIComponent("Missing member ID in userinfo")}`);
    }

    const memberUrn = `urn:li:person:${memberSub}`;
    const memberName = userinfo.name || `${userinfo.given_name || ""} ${userinfo.family_name || ""}`.trim() || "LinkedIn Member";
    const memberEmail = userinfo.email || "";
    const memberPicture = userinfo.picture || "";

    // 3. Save to server-side secure storage (Sanity CMS)
    await saveLinkedInToken({
      accessToken,
      refreshToken,
      expiresInSeconds,
      refreshTokenExpiresInSeconds,
      memberUrn,
      memberName,
      memberEmail,
      memberPicture,
      scope,
    });

    // 4. Redirect back to admin page with success
    return res.redirect(302, `${adminRedirectBase}?connected=true`);
  } catch (err: any) {
    console.error("[linkedin/callback] Exception in callback handler:", err);
    return res.redirect(302, `${adminRedirectBase}?error=${encodeURIComponent(err.message || "Callback exception")}`);
  }
}
