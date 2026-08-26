import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@sanity/client";

const spamKeywords = [
  "viagra", "cialis", "levitra", "casino", "porn", "sex", "gambling", "crypto",
  "bitcoin", "etherium", "solana", "invest", "earn money", "make money", "passive income",
  "buy followers", "seo services", "backlinks", "cheap price", "dating", "girls", "cams"
];

const profanityList = [
  "fuck", "shit", "asshole", "bitch", "cunt", "dick", "cock", "pussy", "bastard"
];

function analyzeComment(authorName: string, authorEmail: string, text: string): "approved" | "pending" | "declined" {
  let score = 0;
  const lowerText = text.toLowerCase();
  const lowerName = authorName.toLowerCase();
  const lowerEmail = authorEmail.toLowerCase();

  // 1. Check valid email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(authorEmail)) {
    return "declined"; // Invalid email format is rejected immediately
  }

  // 2. Check for links
  const hasLinks = /https?:\/\/[^\s]+|www\.[^\s]+|\b[a-z0-9]+(?:\.[a-z0-9]+)*\.(?:com|net|org|xyz|ru|biz|info|cc|top|club|click|gq|cf|ml|tk|ga)\b/i.test(text);
  if (hasLinks) {
    score += 5; // Direct rejection trigger or high suspicious score
  }

  // 3. Length check
  if (text.length >= 500) {
    score += 2;
  }

  // 4. Check profanity
  const hasProfanity = profanityList.some(word => lowerText.includes(word));
  if (hasProfanity) {
    score += 3;
  }

  // 5. Check spam keywords
  const hasSpamKeywords = spamKeywords.some(word => lowerText.includes(word) || lowerName.includes(word) || lowerEmail.includes(word));
  if (hasSpamKeywords) {
    score += 5; // Instant rejection score
  }

  // 6. Suspicious patterns (multiple exclamations, all caps)
  const isAllCaps = text === text.toUpperCase() && text.length > 10;
  if (isAllCaps) {
    score += 2;
  }
  const hasMultipleExclamations = /!!!/i.test(text);
  if (hasMultipleExclamations) {
    score += 1;
  }

  // 7. Temporary/Spam email domains
  const spamDomains = ["mailinator.com", "tempmail.com", "yopmail.com", "sharklasers.com", "guerrillamail.com", "10minutemail.com"];
  const emailDomain = authorEmail.split("@")[1] || "";
  if (spamDomains.includes(emailDomain)) {
    score += 4;
  }

  // Final Decision Matrix
  if (score >= 5) {
    return "declined"; // Obvious spam
  } else if (score > 0) {
    return "pending"; // Suspicious, send to Pending
  } else {
    return "approved"; // Automatically approve
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Allow OPTIONS preflight for CORS
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  const writeToken = process.env.SANITY_API_WRITE_TOKEN;

  if (!writeToken) {
    console.warn("[comment] SANITY_API_WRITE_TOKEN environment variable is missing on server.");
  }

  const client = createClient({
    projectId: process.env.VITE_SANITY_PROJECT_ID || "0lqwkcmg",
    dataset: process.env.VITE_SANITY_DATASET || "production",
    token: writeToken,
    apiVersion: "2025-01-01",
    useCdn: false,
  });

  if (req.method === "GET") {
    const { postId, all } = req.query;

    // Admin query: fetch all comments
    if (all === "true" || !postId) {
      try {
        const query = `*[_type == "comment"] | order(createdAt desc){
          _id,
          postId,
          authorName,
          authorEmail,
          authorPhoto,
          commentText,
          status,
          likes,
          dislikes,
          createdAt
        }`;
        const comments = await client.fetch(query);
        return res.status(200).json({ comments: comments || [] });
      } catch (e: any) {
        console.warn("Error fetching all comments from Sanity:", e.message);
        return res.status(200).json({ comments: [] });
      }
    }

    if (!postId || typeof postId !== "string") {
      return res.status(200).json({ comments: [] });
    }

    try {
      const query = `*[_type == "comment" && (relatedPost._ref == $postId || postId == $postId) && status != "declined"] | order(createdAt desc){
        _id,
        postId,
        authorName,
        authorEmail,
        authorPhoto,
        commentText,
        status,
        likes,
        dislikes,
        createdAt
      }`;
      const comments = await client.fetch(query, { postId });
      return res.status(200).json({ comments: comments || [] });
    } catch (e: any) {
      console.warn("Error fetching comments from Sanity:", e.message);
      return res.status(200).json({ comments: [] });
    }
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const {
    action,
    postId,
    authorName,
    authorEmail,
    authorPhoto,
    commentText,
    commentId,
    voteType,
    reactionType,
    status: newStatus,
  } = req.body || {};

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
      if (!commentText || commentText.trim().length < 2) {
        return res.status(400).json({ error: "Comment text must be at least 2 characters." });
      }

      // 2. Analyze comment for smart moderation
      const status = analyzeComment(authorName, authorEmail, commentText);

      // 3. Create comment document
      const doc = {
        _type: "comment",
        postId,
        authorName: authorName.trim(),
        authorEmail: authorEmail.trim(),
        authorPhoto: authorPhoto || null,
        commentText: commentText.trim(),
        status,
        likes: 0,
        dislikes: 0,
        createdAt: new Date().toISOString(),
      };

      const result = await client.create(doc);
      return res.status(200).json({ success: true, docId: result._id, status });

    } else if (action === "approve") {
      if (!commentId) {
        return res.status(400).json({ error: "Missing commentId for approval." });
      }
      const result = await client.patch(commentId).set({ status: "approved" }).commit();
      return res.status(200).json({ success: true, message: "Comment approved successfully.", comment: result });

    } else if (action === "decline") {
      if (!commentId) {
        return res.status(400).json({ error: "Missing commentId for decline." });
      }
      const result = await client.patch(commentId).set({ status: "declined" }).commit();
      return res.status(200).json({ success: true, message: "Comment declined.", comment: result });

    } else if (action === "edit") {
      if (!commentId || !commentText) {
        return res.status(400).json({ error: "Missing commentId or commentText for edit." });
      }
      const result = await client.patch(commentId).set({ commentText: commentText.trim() }).commit();
      return res.status(200).json({ success: true, message: "Comment updated successfully.", comment: result });

    } else if (action === "delete") {
      if (!commentId) {
        return res.status(400).json({ error: "Missing commentId for deletion." });
      }
      await client.delete(commentId);
      return res.status(200).json({ success: true, message: "Comment deleted successfully." });

    } else if (action === "vote") {
      if (!commentId) {
        return res.status(400).json({ error: "Missing commentId for voting." });
      }
      if (voteType !== "like" && voteType !== "dislike") {
        return res.status(400).json({ error: "Invalid voteType. Must be 'like' or 'dislike'." });
      }

      const field = voteType === "like" ? "likes" : "dislikes";
      try {
        const result = await client.patch(commentId).inc({ [field]: 1 }).commit();
        return res.status(200).json({ success: true, likes: result.likes, dislikes: result.dislikes });
      } catch (err) {
        return res.status(200).json({ success: true });
      }

    } else if (action === "react") {
      return res.status(200).json({ success: true, reaction: reactionType });
    } else {
      return res.status(400).json({ error: "Invalid action type." });
    }
  } catch (sanityErr: any) {
    console.error("Sanity Mutation Error:", sanityErr);
    return res.status(500).json({
      error: `Sanity Mutation Failed: ${sanityErr.message || "Unknown error"}`
    });
  }
}
