export interface LinkedInTokenDoc {
  _id: string;
  _type: string;
  accessToken: string;
  refreshToken?: string | null;
  expiresAt: number; // epoch ms
  refreshTokenExpiresAt?: number | null; // epoch ms
  memberUrn: string; // urn:li:person:...
  memberName: string;
  memberEmail?: string;
  memberPicture?: string;
  scope?: string;
  updatedAt: string;
}

const SINGLETON_ID = "linkedinTokenSingleton";

function getSanityConfig() {
  const projectId = process.env.VITE_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID || "0lqwkcmg";
  const dataset = process.env.VITE_SANITY_DATASET || process.env.SANITY_DATASET || "production";
  const token = process.env.SANITY_API_WRITE_TOKEN;
  return { projectId, dataset, token };
}

export async function getStoredLinkedInToken(): Promise<LinkedInTokenDoc | null> {
  try {
    const { projectId, dataset, token } = getSanityConfig();
    const query = encodeURIComponent(`*[_id == "${SINGLETON_ID}"][0]`);
    const url = `https://${projectId}.api.sanity.io/v2025-01-01/data/query/${dataset}?query=${query}`;

    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(url, { headers });
    if (!res.ok) {
      console.error("[linkedinStorage] Sanity query failed status:", res.status);
      return null;
    }

    const data = await res.json();
    return data.result || null;
  } catch (error) {
    console.error("[linkedinStorage] Error reading token from Sanity:", error);
    return null;
  }
}

export async function saveLinkedInToken(data: {
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

  const { projectId, dataset, token } = getSanityConfig();

  if (!token) {
    console.warn("[linkedinStorage] SANITY_API_WRITE_TOKEN is missing on server");
    throw new Error("SANITY_API_WRITE_TOKEN environment variable is not configured on server.");
  }

  const url = `https://${projectId}.api.sanity.io/v2025-01-01/data/mutate/${dataset}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      mutations: [
        {
          createOrReplace: doc,
        },
      ],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error(`[linkedinStorage] Sanity mutation HTTP ${res.status}:`, errText);
    throw new Error(`Sanity write failed (${res.status}): ${errText}`);
  }

  return doc;
}

export async function refreshLinkedInAccessTokenIfNeeded(): Promise<LinkedInTokenDoc | null> {
  const currentToken = await getStoredLinkedInToken();
  if (!currentToken || !currentToken.accessToken) {
    return null;
  }

  const now = Date.now();
  // Buffer of 5 minutes before actual expiration
  const isExpired = currentToken.expiresAt - 5 * 60 * 1000 <= now;

  if (!isExpired) {
    return currentToken;
  }

  // If token is expired but we have a refresh token
  if (currentToken.refreshToken) {
    const clientId = process.env.LINKEDIN_CLIENT_ID;
    const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      console.warn("[linkedinStorage] Cannot refresh token: Missing LINKEDIN_CLIENT_ID or LINKEDIN_CLIENT_SECRET");
      return null;
    }

    try {
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
        console.error("[linkedinStorage] Refresh token request failed:", errText);
        return null;
      }

      const tokenData = await response.json();

      return await saveLinkedInToken({
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token || currentToken.refreshToken,
        expiresInSeconds: tokenData.expires_in,
        refreshTokenExpiresInSeconds: tokenData.refresh_token_expires_in,
        memberUrn: currentToken.memberUrn,
        memberName: currentToken.memberName,
        memberEmail: currentToken.memberEmail,
        memberPicture: currentToken.memberPicture,
        scope: tokenData.scope || currentToken.scope,
      });
    } catch (err) {
      console.error("[linkedinStorage] Exception during token refresh:", err);
      return null;
    }
  }

  // No refresh token available or refresh failed
  return null;
}
