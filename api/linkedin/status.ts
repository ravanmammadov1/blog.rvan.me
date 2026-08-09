import type { VercelRequest, VercelResponse } from "@vercel/node";

interface LinkedInTokenDoc {
  _id: string;
  _type: string;
  accessToken: string;
  refreshToken?: string | null;
  expiresAt: number;
  refreshTokenExpiresAt?: number | null;
  memberUrn: string;
  memberName: string;
  memberEmail?: string;
  memberPicture?: string;
  scope?: string;
  updatedAt: string;
}

const SINGLETON_ID = "linkedinTokenSingleton";

async function getStoredLinkedInToken(): Promise<LinkedInTokenDoc | null> {
  try {
    const projectId = process.env.VITE_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID || "0lqwkcmg";
    const dataset = process.env.VITE_SANITY_DATASET || process.env.SANITY_DATASET || "production";
    const token = process.env.SANITY_API_WRITE_TOKEN;

    const query = encodeURIComponent(`*[_id == "${SINGLETON_ID}"][0]`);
    const url = `https://${projectId}.api.sanity.io/v2025-01-01/data/query/${dataset}?query=${query}`;

    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(url, { headers });
    if (!res.ok) {
      console.error("[linkedin/status] Sanity query failed status:", res.status);
      return null;
    }

    const data = await res.json();
    return data.result || null;
  } catch (error) {
    console.error("[linkedin/status] Error reading token from Sanity:", error);
    return null;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const activeToken = await getStoredLinkedInToken();

    if (!activeToken || !activeToken.accessToken) {
      return res.status(200).json({
        connected: false,
        reconnectRequired: true,
        message: "No active LinkedIn authorization found. Please connect your account.",
      });
    }

    const now = Date.now();
    const msRemaining = activeToken.expiresAt - now;
    const daysRemaining = Math.max(0, Math.floor(msRemaining / (1000 * 60 * 60 * 24)));

    return res.status(200).json({
      connected: true,
      reconnectRequired: false,
      memberName: activeToken.memberName,
      memberUrn: activeToken.memberUrn,
      memberEmail: activeToken.memberEmail || "",
      memberPicture: activeToken.memberPicture || "",
      expiresAt: activeToken.expiresAt,
      daysRemaining,
      hasRefreshToken: Boolean(activeToken.refreshToken),
      updatedAt: activeToken.updatedAt,
      scope: activeToken.scope,
    });
  } catch (error: any) {
    console.error("[linkedin/status] Error checking connection status:", error);
    return res.status(200).json({
      connected: false,
      reconnectRequired: true,
      error: error.message || "Failed to inspect LinkedIn connection status",
    });
  }
}
