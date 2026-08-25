import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@sanity/client";
import { Resend } from "resend";

// Simple in-memory rate limiting map (IP -> timestamps array)
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS_PER_WINDOW = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const validTimestamps = timestamps.filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS);

  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  validTimestamps.push(now);
  rateLimitMap.set(ip, validTimestamps);
  return false;
}

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

const writeToken = process.env.SANITY_API_WRITE_TOKEN;

if (!writeToken) {
  console.warn("[SubmitArticle] SANITY_API_WRITE_TOKEN environment variable is missing on server.");
}

const sanityClient = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID || "0lqwkcmg",
  dataset: process.env.VITE_SANITY_DATASET || process.env.SANITY_DATASET || "production",
  token: writeToken,
  apiVersion: "2025-01-01",
  useCdn: false,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const clientIp =
      (req.headers["x-forwarded-for"] as string) || req.socket?.remoteAddress || "127.0.0.1";

    // 1. Rate limiting check
    if (isRateLimited(clientIp)) {
      return res.status(429).json({
        error: "Too many submission attempts. Please try again in 15 minutes.",
      });
    }

    const payload = req.body || {};
    const {
      authorName,
      authorEmail,
      authorBio,
      authorWebsite,
      profilePhotoBase64,
      profilePhotoName,
      title,
      language = "en",
      category,
      topic,
      tags,
      excerpt,
      content,
      coverImageBase64,
      coverImageName,
      editorialNote,
      originalWorkConfirmed,
      honeypot,
    } = payload;

    // 2. Honeypot check (anti-spam)
    if (honeypot && String(honeypot).trim() !== "") {
      return res.status(200).json({ success: true, message: "Article submitted successfully." });
    }

    // 3. Field validation
    const trimmedName = typeof authorName === "string" ? authorName.trim() : "";
    const trimmedEmail = typeof authorEmail === "string" ? authorEmail.trim() : "";
    const trimmedBio = typeof authorBio === "string" ? authorBio.trim() : "";
    const trimmedTitle = typeof title === "string" ? title.trim() : "";
    const trimmedExcerpt = typeof excerpt === "string" ? excerpt.trim() : "";
    const trimmedContent = typeof content === "string" ? content.trim() : "";
    const selectedLang = language === "az" ? "Azerbaijani (az)" : "English (en)";
    const selectedCategory = typeof category === "string" && category.trim() ? category.trim() : "Design";

    if (!trimmedName || trimmedName.length < 2) {
      return res.status(400).json({ error: "Please provide your full name (minimum 2 characters)." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      return res.status(400).json({ error: "Please provide a valid email address." });
    }

    if (!trimmedBio || trimmedBio.length < 5) {
      return res.status(400).json({ error: "Please provide a short professional bio." });
    }

    if (!profilePhotoBase64) {
      return res.status(400).json({ error: "Please upload an author profile photo." });
    }

    if (!trimmedTitle || trimmedTitle.length < 3) {
      return res.status(400).json({ error: "Please provide an article title." });
    }

    if (!trimmedExcerpt || trimmedExcerpt.length < 10) {
      return res.status(400).json({ error: "Please provide an excerpt / summary of your article." });
    }

    if (!trimmedContent || trimmedContent.length < 20) {
      return res.status(400).json({ error: "Please provide the complete article content." });
    }

    if (!coverImageBase64) {
      return res.status(400).json({ error: "Please upload a cover image for the article." });
    }

    if (!originalWorkConfirmed) {
      return res.status(400).json({
        error: "You must confirm that this is your original work to submit for publication.",
      });
    }

    // 4. Build Buffers and Attachments
    const attachments: Array<{ filename: string; content: Buffer }> = [];
    let coverBuffer: Buffer | null = null;
    let profileBuffer: Buffer | null = null;

    if (coverImageBase64 && typeof coverImageBase64 === "string") {
      const cleanCoverBase64 = coverImageBase64.replace(/^data:image\/\w+;base64,/, "");
      const ext = coverImageBase64.includes("png") ? "png" : coverImageBase64.includes("webp") ? "webp" : "jpg";
      coverBuffer = Buffer.from(cleanCoverBase64, "base64");
      attachments.push({
        filename: coverImageName || `article_cover.${ext}`,
        content: coverBuffer,
      });
    }

    if (profilePhotoBase64 && typeof profilePhotoBase64 === "string") {
      const cleanProfileBase64 = profilePhotoBase64.replace(/^data:image\/\w+;base64,/, "");
      const ext = profilePhotoBase64.includes("png") ? "png" : profilePhotoBase64.includes("webp") ? "webp" : "jpg";
      profileBuffer = Buffer.from(cleanProfileBase64, "base64");
      attachments.push({
        filename: profilePhotoName || `author_profile.${ext}`,
        content: profileBuffer,
      });
    }

    // 5. Store Persistent Submission Record in Sanity CMS
    let coverAssetRef: string | undefined = undefined;
    let coverAssetUrl: string | undefined = undefined;
    let profileAssetRef: string | undefined = undefined;
    let profileAssetUrl: string | undefined = undefined;
    let savedSubmissionId = `submission-${Date.now()}`;

    try {
      if (coverBuffer) {
        const coverAsset = await sanityClient.assets.upload("image", coverBuffer, {
          filename: coverImageName || "cover.jpg",
        });
        coverAssetRef = coverAsset._id;
        coverAssetUrl = coverAsset.url;
      }

      if (profileBuffer) {
        const profileAsset = await sanityClient.assets.upload("image", profileBuffer, {
          filename: profilePhotoName || "author.jpg",
        });
        profileAssetRef = profileAsset._id;
        profileAssetUrl = profileAsset.url;
      }

      const submissionRecord = await sanityClient.create({
        _id: savedSubmissionId,
        _type: "articleSubmission",
        authorName: trimmedName,
        authorEmail: trimmedEmail,
        authorBio: trimmedBio,
        authorWebsite: authorWebsite || "",
        profilePhotoAssetRef: profileAssetRef,
        profilePhotoUrl: profileAssetUrl,
        title: trimmedTitle,
        slug: slugify(trimmedTitle),
        language: language || "en",
        category: selectedCategory,
        topic: topic || "",
        tags: Array.isArray(tags) ? tags : [],
        excerpt: trimmedExcerpt,
        content: trimmedContent,
        coverImageAssetRef: coverAssetRef,
        coverImageUrl: coverAssetUrl,
        editorialNote: editorialNote || "",
        originalWorkConfirmed: true,
        status: "PENDING",
        submittedAt: new Date().toISOString(),
      });

      savedSubmissionId = submissionRecord._id;
    } catch (sanityErr: any) {
      console.warn("[SubmitArticle] Sanity submission store notice:", sanityErr.message);
    }

    // 6. Resend configuration & recipient setup
    const apiKey = process.env.RESEND_API_KEY;
    const recipientEmail = process.env.ADMIN_EMAIL || "mammadovravan1@gmail.com";
    const fromAddress =
      process.env.RESEND_FROM_EMAIL || "Rvan.me Editorial <onboarding@resend.dev>";

    const timestampStr =
      new Date().toLocaleString("en-US", {
        timeZone: "UTC",
        dateStyle: "full",
        timeStyle: "medium",
      }) + " UTC";

    // Build plain-text fallback
    const plainText = `
NEW ARTICLE SUBMISSION — Rvan.me

==================================================
AUTHOR INFORMATION
==================================================
Name: ${trimmedName}
Email: ${trimmedEmail}
Bio: ${trimmedBio}
Website / Portfolio: ${authorWebsite || "Not provided"}
Profile Photo: Attached (${profilePhotoName || "author_profile.jpg"})

==================================================
ARTICLE INFORMATION
==================================================
Title: ${trimmedTitle}
Language: ${selectedLang}
Category: ${selectedCategory}
Topic: ${topic || "Not specified"}
Tags: ${Array.isArray(tags) ? tags.join(", ") : tags || "None"}
Cover Image: Attached (${coverImageName || "article_cover.jpg"})

EXCERPT / SHORT SUMMARY:
${trimmedExcerpt}

${editorialNote ? `
==================================================
EDITORIAL NOTE
==================================================
${editorialNote}
` : ""}

==================================================
ARTICLE CONTENT
==================================================
${trimmedContent}

==================================================
COPYRIGHT CONFIRMATION: Confirmed by author
SUBMISSION ID: ${savedSubmissionId}
SUBMITTED AT: ${timestampStr}
    `.trim();

    // Build HTML email layout
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f5; color: #18181b; margin: 0; padding: 24px; }
            .card { max-width: 680px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e4e4e7; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
            .header { background: #0a0a0c; color: #ffffff; padding: 32px 32px 24px 32px; border-bottom: 2px solid #61c5ad; }
            .badge { display: inline-block; background: rgba(97, 197, 173, 0.2); color: #61c5ad; border: 1px solid rgba(97, 197, 173, 0.4); font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; padding: 4px 10px; border-radius: 999px; margin-bottom: 12px; }
            .title { font-size: 24px; font-weight: 800; margin: 0; line-height: 1.3; }
            .content { padding: 32px; font-size: 14px; line-height: 1.6; }
            .section-title { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.15em; color: #71717a; border-bottom: 1px solid #e4e4e7; padding-bottom: 6px; margin: 24px 0 14px 0; }
            .author-grid { background: #fafafa; border: 1px solid #e4e4e7; border-radius: 12px; padding: 18px; margin-bottom: 20px; }
            .row { margin-bottom: 8px; }
            .label { font-weight: 700; color: #52525b; font-size: 12px; display: inline-block; width: 130px; }
            .val { color: #18181b; font-weight: 500; }
            .article-body { background: #ffffff; border: 1px solid #e4e4e7; border-radius: 12px; padding: 20px; white-space: pre-wrap; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 13px; line-height: 1.6; color: #27272a; max-height: 500px; overflow-y: auto; }
            .footer { background: #fafafa; border-top: 1px solid #e4e4e7; padding: 20px 32px; font-size: 12px; color: #71717a; text-align: center; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <span class="badge">Rvan.me · Editorial Submission</span>
              <h1 class="title">${escapeHtml(trimmedTitle)}</h1>
            </div>
            <div class="content">
              <div class="section-title">Author Profile</div>
              <div class="author-grid">
                <div class="row"><span class="label">Full Name:</span> <span class="val"><strong>${escapeHtml(trimmedName)}</strong></span></div>
                <div class="row"><span class="label">Email:</span> <span class="val"><a href="mailto:${escapeHtml(trimmedEmail)}" style="color: #61c5ad; text-decoration: none;">${escapeHtml(trimmedEmail)}</a></span></div>
                <div class="row"><span class="label">Bio:</span> <span class="val">${escapeHtml(trimmedBio)}</span></div>
                ${authorWebsite ? `<div class="row"><span class="label">Portfolio / Social:</span> <span class="val"><a href="${escapeHtml(authorWebsite)}" target="_blank" style="color: #61c5ad;">${escapeHtml(authorWebsite)}</a></span></div>` : ""}
                <div class="row"><span class="label">Profile Photo:</span> <span class="val">Attached (${profilePhotoName || "author_profile.jpg"})</span></div>
              </div>

              <div class="section-title">Article Details</div>
              <div class="author-grid">
                <div class="row"><span class="label">Title:</span> <span class="val"><strong>${escapeHtml(trimmedTitle)}</strong></span></div>
                <div class="row"><span class="label">Language:</span> <span class="val">${escapeHtml(selectedLang)}</span></div>
                <div class="row"><span class="label">Category:</span> <span class="val">${escapeHtml(selectedCategory)}</span></div>
                ${topic ? `<div class="row"><span class="label">Topic:</span> <span class="val">${escapeHtml(topic)}</span></div>` : ""}
                ${tags && tags.length > 0 ? `<div class="row"><span class="label">Tags:</span> <span class="val">${Array.isArray(tags) ? escapeHtml(tags.join(", ")) : escapeHtml(tags)}</span></div>` : ""}
                <div class="row"><span class="label">Cover Image:</span> <span class="val">Attached (${coverImageName || "article_cover.jpg"})</span></div>
              </div>

              <div class="section-title">Excerpt / Summary</div>
              <p style="font-size: 14px; line-height: 1.6; color: #3f3f46; font-style: italic; background: #f4f4f5; padding: 14px 18px; border-radius: 8px; border-left: 3px solid #61c5ad; margin: 0 0 20px 0;">
                "${escapeHtml(trimmedExcerpt)}"
              </p>

              ${editorialNote ? `
                <div class="section-title">Author's Note to the Editor</div>
                <p style="font-size: 13px; line-height: 1.5; color: #52525b; background: #fafafa; padding: 12px 16px; border-radius: 8px; margin: 0 0 20px 0; border: 1px solid #e4e4e7;">
                  ${escapeHtml(editorialNote)}
                </p>
              ` : ""}

              <div class="section-title">Full Article Markdown Body</div>
              <div class="article-body">${escapeHtml(trimmedContent)}</div>

              <div style="margin-top: 24px; padding: 12px 16px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; font-size: 12px; color: #166534;">
                ✓ Original work and authorship confirmed by submitter.
              </div>
            </div>
            <div class="footer">
              Submitted to Rvan.me on ${timestampStr} · Submission ID: ${savedSubmissionId}
            </div>
          </div>
        </body>
      </html>
    `;

    // Deliver via Resend
    if (!apiKey) {
      console.warn("[SubmitArticle] Warning: RESEND_API_KEY is not defined in environment.");
      return res.status(200).json({
        success: true,
        submissionId: savedSubmissionId,
        message: "Article submitted successfully (Development mode: RESEND_API_KEY not configured).",
      });
    }

    const resend = new Resend(apiKey);
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: fromAddress,
      to: recipientEmail,
      subject: `New Rvan.me Article Submission — ${trimmedTitle}`,
      text: plainText,
      html: emailHtml,
      replyTo: trimmedEmail,
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    if (emailError) {
      console.error("[SubmitArticle] Resend error:", emailError);
      return res.status(500).json({
        error: "Failed to deliver submission email. Please try again later.",
        details: emailError.message,
      });
    }

    return res.status(200).json({
      success: true,
      submissionId: savedSubmissionId,
      message: "Article submitted successfully.",
      id: emailData?.id,
    });
  } catch (error: any) {
    console.error("[SubmitArticle] Unexpected error:", error);
    return res.status(500).json({
      error: error?.message || "Internal server error while processing article submission.",
    });
  }
}

function escapeHtml(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
