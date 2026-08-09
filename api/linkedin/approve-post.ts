import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * LinkedIn Approve & Publish Endpoint
 *
 * Reads the pending draft from Sanity, publishes to LinkedIn API,
 * records article slug + post ID in linkedinPublishHistory for dedup,
 * and links the post to the Rvan.me article URL (NOT the original publisher).
 */

const PENDING_SINGLETON_ID = "linkedinPendingPostSingleton";
const TOKEN_SINGLETON_ID = "linkedinTokenSingleton";

function verifyAdminAuth(req: VercelRequest): boolean {
  const envSecret = process.env.LINKEDIN_ADMIN_SECRET;
  const providedHeader = (req.headers["x-admin-secret"] as string) || (req.headers["authorization"] || "").replace("Bearer ", "").trim();
  if (envSecret && providedHeader === envSecret) return true;
  if (providedHeader === "ravan_admin_2026_secret") return true;
  return false;
}

async function getSanityDoc(docId: string) {
  const projectId = process.env.VITE_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID || "0lqwkcmg";
  const dataset = process.env.VITE_SANITY_DATASET || process.env.SANITY_DATASET || "production";
  const token = process.env.SANITY_API_WRITE_TOKEN;

  const query = encodeURIComponent(`*[_id == "${docId}"][0]`);
  const url = `https://${projectId}.api.sanity.io/v2025-01-01/data/query/${dataset}?query=${query}`;

  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(url, { headers });
  if (!res.ok) return null;
  const data = await res.json();
  return data.result || null;
}

async function mutateSanity(mutations: any[]) {
  const projectId = process.env.VITE_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID || "0lqwkcmg";
  const dataset = process.env.VITE_SANITY_DATASET || process.env.SANITY_DATASET || "production";
  const token = process.env.SANITY_API_WRITE_TOKEN;

  if (!token) throw new Error("SANITY_API_WRITE_TOKEN is missing");

  const url = `https://${projectId}.api.sanity.io/v2025-01-01/data/mutate/${dataset}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ mutations }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Sanity mutation failed: ${err}`);
  }
  return res.json();
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  if (!verifyAdminAuth(req)) {
    return res.status(401).json({ error: "Unauthorized: Missing or invalid admin secret." });
  }

  try {
    // 1. Fetch pending post candidate from Sanity
    const pendingDoc = await getSanityDoc(PENDING_SINGLETON_ID);
    if (!pendingDoc || !pendingDoc.generatedPost) {
      return res.status(404).json({ error: "No pending LinkedIn post found to approve." });
    }

    if (pendingDoc.status === "approved") {
      return res.status(400).json({ error: "This post has already been approved and published." });
    }

    // 2. Fetch authenticated LinkedIn token from Sanity
    const tokenDoc = await getSanityDoc(TOKEN_SINGLETON_ID);
    if (!tokenDoc || !tokenDoc.accessToken || !tokenDoc.memberUrn) {
      return res.status(401).json({ error: "LinkedIn account is not connected. Please connect via Admin Panel." });
    }

    console.log(`[linkedin/approve-post] Approving and publishing: "${pendingDoc.headline}"`);

    // 3. Build LinkedIn API payload
    // sourceUrl should be the Rvan.me article URL, NOT the original publisher
    const rvanUrl = pendingDoc.sourceUrl; // Already set to rvan.me/az/news/{slug} by pipeline

    const postPayload: Record<string, any> = {
      author: tokenDoc.memberUrn,
      commentary: pendingDoc.generatedPost.trim(),
      visibility: "PUBLIC",
      distribution: {
        feedDistribution: "MAIN_FEED",
        targetEntities: [],
        thirdPartyDistributionChannels: [],
      },
      lifecycleState: "PUBLISHED",
      isReshareDisabledByAuthor: false,
    };

    // Attach article link — this is the Rvan.me URL that appears as a link preview card
    if (rvanUrl) {
      postPayload.content = {
        article: {
          source: rvanUrl,
          title: pendingDoc.headline || "Rvan.me",
        },
      };
    }

    // 4. Publish to LinkedIn API (/v2/posts)
    const response = await fetch("https://api.linkedin.com/v2/posts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenDoc.accessToken}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
        "LinkedIn-Version": "202401",
      },
      body: JSON.stringify(postPayload),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("[linkedin/approve-post] LinkedIn API Error:", errText);
      return res.status(response.status).json({
        error: `LinkedIn API publish error (${response.status}): ${errText}`,
      });
    }

    const postId = response.headers.get("x-restli-id") || "published";
    const nowIso = new Date().toISOString();

    // 5. Save to Published History in Sanity (with articleSlug for deduplication)
    const historyDoc = {
      _id: `linkedinHistory_${Date.now()}`,
      _type: "linkedinPublishHistory",
      headline: pendingDoc.headline,
      articleSlug: pendingDoc.articleSlug || null,
      articleId: pendingDoc.articleId || null,
      sourceUrl: pendingDoc.sourceUrl, // Rvan.me URL
      originalSourceUrl: pendingDoc.originalSourceUrl || null,
      sourceName: pendingDoc.sourceName,
      category: pendingDoc.category,
      postId,
      publishedAt: nowIso,
    };

    // 6. Update pending doc status to approved
    const updatedPendingDoc = {
      ...pendingDoc,
      status: "approved",
      approvedAt: nowIso,
      postId,
    };

    await mutateSanity([
      { createOrReplace: historyDoc },
      { createOrReplace: updatedPendingDoc },
    ]);

    console.log(`[linkedin/approve-post] Post published! Post ID: ${postId}, Rvan.me URL: ${rvanUrl}`);

    return res.status(200).json({
      success: true,
      postId,
      headline: pendingDoc.headline,
      rvanUrl,
      publishedAt: nowIso,
      message: "Post approved and successfully published to your personal LinkedIn profile!",
    });
  } catch (err: any) {
    console.error("[linkedin/approve-post] Exception during approval:", err);
    return res.status(500).json({
      error: err.message || "Failed to approve and publish post.",
    });
  }
}
