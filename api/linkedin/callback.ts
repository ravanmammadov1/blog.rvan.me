import type { VercelRequest, VercelResponse } from "@vercel/node";
import { saveLinkedInToken } from "../_lib/linkedinStorage";

function safeRedirect(res: VercelResponse, url: string) {
  res.writeHead(302, { Location: url });
  res.end();
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { code, error, error_description } = req.query;
  const adminRedirectBase = "https://www.rvan.me/admin/linkedin";
  const redirectUri = "https://www.rvan.me/api/linkedin/callback";

  // Check 1: Did LinkedIn return an OAuth error query param?
  if (error) {
    const errMsg = (error_description as string) || (error as string) || "LinkedIn OAuth error";
    console.error("[linkedin/callback] LinkedIn returned OAuth error:", errMsg);
    return safeRedirect(res, `${adminRedirectBase}?error=${encodeURIComponent(errMsg)}`);
  }

  // Check 2: Was authorization code provided?
  if (!code || typeof code !== "string") {
    console.error("[linkedin/callback] Missing authorization code in query params");
    return safeRedirect(res, `${adminRedirectBase}?error=${encodeURIComponent("Missing authorization code from LinkedIn")}`);
  }

  // Check 3: Inspect server-side environment variables
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    const envErr = `Missing server env variables: ${!clientId ? 'LINKEDIN_CLIENT_ID ' : ''}${!clientSecret ? 'LINKEDIN_CLIENT_SECRET' : ''}`.trim();
    console.error("[linkedin/callback]", envErr);
    return safeRedirect(res, `${adminRedirectBase}?error=${encodeURIComponent(envErr)}`);
  }

  try {
    // 1. Exchange code for access token
    console.log("[linkedin/callback] Initiating token exchange with redirect_uri:", redirectUri);
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
      console.error(`[linkedin/callback] Access Token Exchange HTTP ${tokenRes.status}:`, errText);
      return safeRedirect(res, `${adminRedirectBase}?error=${encodeURIComponent(`Token exchange failed (${tokenRes.status}): ${errText.substring(0, 150)}`)}`);
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;
    const refreshToken = tokenData.refresh_token || null;
    const expiresInSeconds = tokenData.expires_in || 5184000; // default ~60 days
    const refreshTokenExpiresInSeconds = tokenData.refresh_token_expires_in || null;
    const scope = tokenData.scope || "w_member_social openid profile email";

    if (!accessToken) {
      console.error("[linkedin/callback] Token response missing access_token");
      return safeRedirect(res, `${adminRedirectBase}?error=${encodeURIComponent("LinkedIn token response missing access_token")}`);
    }

    console.log("[linkedin/callback] Token exchange successful. Fetching OpenID userinfo...");

    // 2. Fetch authenticated personal profile member URN using userinfo (OpenID Connect)
    const userinfoRes = await fetch("https://api.linkedin.com/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!userinfoRes.ok) {
      const errText = await userinfoRes.text();
      console.error(`[linkedin/callback] Userinfo HTTP ${userinfoRes.status}:`, errText);
      return safeRedirect(res, `${adminRedirectBase}?error=${encodeURIComponent(`Failed to retrieve profile (${userinfoRes.status}): ${errText.substring(0, 150)}`)}`);
    }

    const userinfo = await userinfoRes.json();
    const memberSub = userinfo.sub; // LinkedIn member ID
    if (!memberSub) {
      console.error("[linkedin/callback] Userinfo missing 'sub' identifier:", JSON.stringify(userinfo));
      return safeRedirect(res, `${adminRedirectBase}?error=${encodeURIComponent("Missing member ID (sub) in LinkedIn profile")}`);
    }

    const memberUrn = `urn:li:person:${memberSub}`;
    const memberName = userinfo.name || `${userinfo.given_name || ""} ${userinfo.family_name || ""}`.trim() || "LinkedIn Member";
    const memberEmail = userinfo.email || "";
    const memberPicture = userinfo.picture || "";

    console.log(`[linkedin/callback] Profile retrieved: ${memberName} (${memberUrn}). Saving token...`);

    // 3. Save to server-side secure storage (Sanity CMS)
    try {
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
      console.log("[linkedin/callback] Token successfully saved to Sanity CMS.");
    } catch (sanityErr: any) {
      const sanityErrMsg = sanityErr?.message || String(sanityErr);
      console.error("[linkedin/callback] Sanity token storage error:", sanityErrMsg);
      return safeRedirect(res, `${adminRedirectBase}?error=${encodeURIComponent(`LinkedIn connected, but failed to save token to Sanity: ${sanityErrMsg.substring(0, 150)}`)}`);
    }

    // 4. Redirect back to admin page with success
    return safeRedirect(res, `${adminRedirectBase}?connected=true`);
  } catch (err: any) {
    const errMsg = err?.message || String(err);
    console.error("[linkedin/callback] Uncaught exception in callback handler:", err);
    return safeRedirect(res, `${adminRedirectBase}?error=${encodeURIComponent(`Callback exception: ${errMsg.substring(0, 150)}`)}`);
  }
}
