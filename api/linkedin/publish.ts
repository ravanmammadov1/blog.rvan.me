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

function verifyAdminAuth(req: VercelRequest): boolean {
  const expectedSecret = process.env.LINKEDIN_ADMIN_SECRET || "ravan_admin_2026_secret";
  const providedHeader = (req.headers["x-admin-secret"] as string) || (req.headers["authorization"] || "").replace("Bearer ", "").trim();
  return providedHeader === expectedSecret;
}

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
      console.error("[linkedin/publish] Sanity query failed status:", res.status);
      return null;
    }

    const data = await res.json();
    return data.result || null;
  } catch (error) {
    console.error("[linkedin/publish] Error reading token from Sanity:", error);
    return null;
  }
}

async function saveLinkedInToken(data: {
  accessToken: string;
  refreshToken?: string | null;
  expiresInSeconds: number;
  refreshTokenExpiresInSeconds?: number | null;
  memberUrn: string;
  memberName: string;
  memberEmail?: string;
  memberPicture?: string;
  scope?: string;
}): Promise<LinkedInTokenDoc> {
  const SINGLETON_ID = "linkedinTokenSingleton";
  const projectId = process.env.VITE_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID || "0lqwkcmg";
  const dataset = process.env.VITE_SANITY_DATASET || process.env.SANITY_DATASET || "production";
  const token = process.env.SANITY_API_WRITE_TOKEN;

  if (!token) {
    throw new Error("SANITY_API_WRITE_TOKEN environment variable is missing.");
  }

  const now = Date.now();
  const expiresAt = now + data.expiresInSeconds * 1000;
  const refreshTokenExpiresAt = data.refreshTokenExpiresInSeconds
    ? now + data.refreshTokenExpiresInSeconds * 1000
    : null;

  const doc: LinkedInTokenDoc = {
    _id: SINGLETON_ID,
    _type: "linkedinToken",
    accessToken: data.accessToken,
    refreshToken: data.refreshToken || null,
    expiresAt,
    refreshTokenExpiresAt,
    memberUrn: data.memberUrn,
    memberName: data.memberName,
    memberEmail: data.memberEmail || "",
    memberPicture: data.memberPicture || "",
    scope: data.scope || "w_member_social openid profile email",
    updatedAt: new Date().toISOString(),
  };

  const url = `https://${projectId}.api.sanity.io/v2025-01-01/data/mutate/${dataset}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      mutations: [{ createOrReplace: doc }],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Sanity write failed (${res.status}): ${errText}`);
  }

  return doc;
}

async function refreshLinkedInTokenIfNeeded(): Promise<LinkedInTokenDoc | null> {
  const currentToken = await getStoredLinkedInToken();
  if (!currentToken || !currentToken.accessToken) {
    return null;
  }

  const now = Date.now();
  const fiveDaysInMs = 5 * 24 * 60 * 60 * 1000;
  const needsRefresh = currentToken.expiresAt - fiveDaysInMs <= now;

  if (!needsRefresh) {
    return currentToken;
  }

  if (currentToken.refreshToken) {
    const clientId = process.env.LINKEDIN_CLIENT_ID;
    const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      console.warn("[linkedin/publish] Cannot refresh token: Missing LINKEDIN_CLIENT_ID or LINKEDIN_CLIENT_SECRET");
      return currentToken;
    }

    try {
      console.log("[linkedin/publish] Token near expiry or expired. Executing token refresh...");
      const params = new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: currentToken.refreshToken,
        client_id: clientId,
        client_secret: clientSecret,
      });

      const response = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("[linkedin/publish] Token refresh HTTP failed:", response.status, errText);
        return currentToken;
      }

      const tokenData = await response.json();
      const updatedDoc = await saveLinkedInToken({
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token || currentToken.refreshToken,
        expiresInSeconds: tokenData.expires_in || 5184000,
        refreshTokenExpiresInSeconds: tokenData.refresh_token_expires_in || null,
        memberUrn: currentToken.memberUrn,
        memberName: currentToken.memberName,
        memberEmail: currentToken.memberEmail,
        memberPicture: currentToken.memberPicture,
        scope: tokenData.scope || currentToken.scope,
      });

      console.log("[linkedin/publish] Token successfully refreshed and updated in Sanity!");
      return updatedDoc;
    } catch (err) {
      console.error("[linkedin/publish] Exception during automatic token refresh:", err);
      return currentToken;
    }
  }

  return currentToken;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // 1. Authorization Gate
  if (!verifyAdminAuth(req)) {
    return res.status(401).json({
      error: "Unauthorized: Invalid or missing admin authentication secret.",
    });
  }

  try {
    const { commentary, linkUrl, linkTitle } = req.body || {};

    if (!commentary || typeof commentary !== "string" || !commentary.trim()) {
      return res.status(400).json({ error: "Post commentary text is required." });
    }

    const activeToken = await refreshLinkedInTokenIfNeeded();

    if (!activeToken || !activeToken.accessToken) {
      return res.status(401).json({
        error: "LinkedIn connection is missing or expired. Please connect your account first.",
        reconnectRequired: true,
      });
    }

    if (!activeToken.memberUrn || !activeToken.memberUrn.startsWith("urn:li:person:")) {
      return res.status(400).json({
        error: `Invalid personal member URN '${activeToken.memberUrn}'. Posting must be on behalf of a personal profile.`,
      });
    }

    // Construct payload for LinkedIn Posts API (/v2/posts)
    const postPayload: Record<string, any> = {
      author: activeToken.memberUrn,
      commentary: commentary.trim(),
      visibility: "PUBLIC",
      distribution: {
        feedDistribution: "MAIN_FEED",
        targetEntities: [],
        thirdPartyDistributionChannels: [],
      },
      lifecycleState: "PUBLISHED",
      isReshareDisabledByAuthor: false,
    };

    // Attach article link if provided
    if (linkUrl && typeof linkUrl === "string" && linkUrl.trim()) {
      postPayload.content = {
        article: {
          source: linkUrl.trim(),
          title: (linkTitle && typeof linkTitle === "string") ? linkTitle.trim() : commentary.trim().substring(0, 80),
        },
      };
    }

    const response = await fetch("https://api.linkedin.com/v2/posts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${activeToken.accessToken}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
        "LinkedIn-Version": "202401",
      },
      body: JSON.stringify(postPayload),
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error("[linkedin/publish] API Error Response:", errBody);
      return res.status(response.status).json({
        error: `LinkedIn API error (${response.status}): ${errBody}`,
        rawResponse: errBody,
      });
    }

    const postId = response.headers.get("x-restli-id") || "published";
    let responseData = {};
    try {
      responseData = await response.json();
    } catch (e) {
      // response might be empty 201 Created with Header only
    }

    return res.status(200).json({
      success: true,
      postId,
      authorUrn: activeToken.memberUrn,
      message: "Successfully published post on personal LinkedIn profile!",
      publishedAt: new Date().toISOString(),
      details: responseData,
    });
  } catch (err: any) {
    console.error("[linkedin/publish] Exception during post publication:", err);
    return res.status(500).json({
      error: err.message || "An unexpected error occurred while publishing to LinkedIn.",
    });
  }
}
