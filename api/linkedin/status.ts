import type { VercelRequest, VercelResponse } from "@vercel/node";
import { refreshLinkedInAccessTokenIfNeeded } from "../../src/lib/linkedinStorage";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const activeToken = await refreshLinkedInAccessTokenIfNeeded();

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
    return res.status(500).json({
      connected: false,
      reconnectRequired: true,
      error: error.message || "Failed to inspect LinkedIn connection status",
    });
  }
}
