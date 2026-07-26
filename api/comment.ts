import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@sanity/client";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Allow OPTIONS preflight for CORS just in case
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  const { action, postId, authorName, authorEmail, commentText, commentId, voteType } = req.body || {};

  if (!process.env.SANITY_API_WRITE_TOKEN) {
    console.error("SANITY_API_WRITE_TOKEN is missing on server side.");
    return res.status(500).json({ error: "Server Configuration Error: Write token is missing." });
  }

  const client = createClient({
    projectId: process.env.VITE_SANITY_PROJECT_ID || "0lqwkcmg",
    dataset: process.env.VITE_SANITY_DATASET || "production",
    token: process.env.SANITY_API_WRITE_TOKEN,
    apiVersion: "2025-01-01",
    useCdn: false,
  });

  try {
    if (action === "submit") {
      // 1. Submit comment validation
      if (!postId) {
        return res.status(400).json({ error: "Missing postId reference." });
      }
      if (!authorName || authorName.trim().length < 2) {
        return res.status(400).json({ error: "Author Name must be at least 2 characters." });
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!authorEmail || !emailRegex.test(authorEmail)) {
        return res.status(400).json({ error: "Please provide a valid email address." });
      }
      if (!commentText || commentText.trim().length < 4) {
        return res.status(400).json({ error: "Comment text must be at least 4 characters." });
      }

      // 2. Create comment document
      const doc = {
        _type: "comment",
        relatedPost: {
          _type: "reference",
          _ref: postId,
        },
        authorName: authorName.trim(),
        authorEmail: authorEmail.trim(),
        commentText: commentText.trim(),
        status: "pending",
        likes: 0,
        dislikes: 0,
        createdAt: new Date().toISOString(),
      };

      const result = await client.create(doc);
      return res.status(200).json({ success: true, docId: result._id });

    } else if (action === "vote") {
      // 1. Vote validation
      if (!commentId) {
        return res.status(400).json({ error: "Missing commentId for voting." });
      }
      if (voteType !== "like" && voteType !== "dislike") {
        return res.status(400).json({ error: "Invalid voteType. Must be 'like' or 'dislike'." });
      }

      // 2. Increment vote count
      const field = voteType === "like" ? "likes" : "dislikes";
      const result = await client.patch(commentId).inc({ [field]: 1 }).commit();
      return res.status(200).json({ success: true, likes: result.likes, dislikes: result.dislikes });

    } else {
      return res.status(400).json({ error: "Invalid action type. Expected 'submit' or 'vote'." });
    }
  } catch (sanityErr: any) {
    console.error("Sanity Mutation Error:", sanityErr);
    return res.status(500).json({
      error: `Sanity Mutation Failed: ${sanityErr.message || "Unknown error"}`
    });
  }
}
