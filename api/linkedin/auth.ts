import type { VercelRequest, VercelResponse } from "@vercel/node";
import crypto from "crypto";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const clientId = process.env.LINKEDIN_CLIENT_ID;

  if (!clientId) {
    return res.status(500).json({
      error: "LINKEDIN_CLIENT_ID environment variable is missing on server.",
    });
  }

  const protocol = (req.headers["x-forwarded-proto"] as string) || "https";
  const host = (req.headers["x-forwarded-host"] as string) || req.headers.host || "www.rvan.me";
  const redirectUri =
    process.env.LINKEDIN_REDIRECT_URI || `${protocol}://${host}/api/linkedin/callback`;

  const state = crypto.randomBytes(16).toString("hex");

  const scope = encodeURIComponent("w_member_social openid profile email");
  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&state=${state}&scope=${scope}`;

  // Redirect user to LinkedIn authorization page
  res.writeHead(302, { Location: authUrl });
  return res.end();
}
