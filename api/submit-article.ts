import type { VercelRequest, VercelResponse } from "@vercel/node";
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
      title,
      language = "en",
      category,
      topic,
      tags,
      excerpt,
      content,
      coverImageUrl,
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

    if (!trimmedTitle || trimmedTitle.length < 3) {
      return res.status(400).json({ error: "Please provide an article title." });
    }

    if (!trimmedExcerpt || trimmedExcerpt.length < 10) {
      return res.status(400).json({ error: "Please provide an excerpt / summary of your article." });
    }

    if (!trimmedContent || trimmedContent.length < 20) {
      return res.status(400).json({ error: "Please provide the complete article content." });
    }

    if (!originalWorkConfirmed) {
      return res.status(400).json({
        error: "You must confirm that this is your original work to submit for publication.",
      });
    }

    // 4. Resend configuration & recipient setup
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
NEW ARTICLE SUBMISSION

Author: ${trimmedName}
Email: ${trimmedEmail}
Language: ${selectedLang}
Category: ${selectedCategory}
Topic: ${topic || "Not specified"}
Website: ${authorWebsite || "Not provided"}
Bio: ${trimmedBio}

EDITORIAL NOTE:
${editorialNote || "No editorial note provided."}

ARTICLE TITLE:
${trimmedTitle}

EXCERPT:
${trimmedExcerpt}

COVER IMAGE URL:
${coverImageUrl || "None (Editorial team to select or upload)"}

TAGS:
${Array.isArray(tags) ? tags.join(", ") : tags || "None"}

ARTICLE CONTENT:
--------------------------------------------------
${trimmedContent}
--------------------------------------------------

COPYRIGHT CONFIRMATION:
Confirmed (Original work of author)

SUBMITTED AT:
${timestampStr}
    `.trim();

    // Build HTML email layout
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a; line-height: 1.6; background-color: #f8fafc; padding: 24px 12px; margin: 0; }
            .container { background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; padding: 32px; max-width: 680px; margin: 0 auto; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.05); }
            .header { border-bottom: 2px solid #0f172a; padding-bottom: 20px; margin-bottom: 24px; }
            .badge { display: inline-block; background: #f1f5f9; color: #0f172a; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 12px; }
            .title { font-size: 22px; font-weight: 800; color: #0f172a; margin: 0 0 6px 0; line-height: 1.25; }
            .author-sub { font-size: 14px; color: #64748b; margin: 0; }
            .section-label { font-size: 11px; font-weight: 700; letter-spacing: 0.08em; color: #64748b; text-transform: uppercase; margin-top: 20px; margin-bottom: 6px; }
            .value-box { background: #f8fafc; border: 1px solid #f1f5f9; border-radius: 8px; padding: 12px 16px; font-size: 14px; color: #1e293b; }
            .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 12px; }
            .content-box { background: #ffffff; border: 1px solid #e2e8f0; border-left: 4px solid #0f172a; border-radius: 8px; padding: 20px; font-size: 14px; color: #1e293b; white-space: pre-wrap; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; line-height: 1.65; max-height: 800px; overflow-y: auto; }
            .note-box { background: #fffbeb; border: 1px solid #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 14px 16px; font-size: 13px; color: #92400e; margin-top: 8px; }
            .footer { margin-top: 32px; padding-top: 20px; border-top: 1px solid #f1f5f9; font-size: 12px; color: #94a3b8; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="badge">Rvan.me Editorial Intake</div>
              <h1 class="title">${escapeHtml(trimmedTitle)}</h1>
              <p class="author-sub">Submitted by <strong>${escapeHtml(trimmedName)}</strong> &lt;<a href="mailto:${escapeHtml(trimmedEmail)}">${escapeHtml(trimmedEmail)}</a>&gt;</p>
            </div>

            <div class="section-label">Author Details</div>
            <div class="value-box">
              <strong>Name:</strong> ${escapeHtml(trimmedName)}<br>
              <strong>Email:</strong> ${escapeHtml(trimmedEmail)}<br>
              <strong>Bio:</strong> ${escapeHtml(trimmedBio)}<br>
              ${authorWebsite ? `<strong>Website / Portfolio:</strong> <a href="${escapeHtml(authorWebsite)}" target="_blank">${escapeHtml(authorWebsite)}</a>` : ""}
            </div>

            <div class="meta-grid">
              <div>
                <div class="section-label">Language</div>
                <div class="value-box"><strong>${escapeHtml(selectedLang)}</strong></div>
              </div>
              <div>
                <div class="section-label">Category & Topic</div>
                <div class="value-box"><strong>${escapeHtml(selectedCategory)}</strong> ${topic ? `· ${escapeHtml(topic)}` : ""}</div>
              </div>
            </div>

            ${coverImageUrl ? `
              <div class="section-label">Cover Image URL</div>
              <div class="value-box"><a href="${escapeHtml(coverImageUrl)}" target="_blank">${escapeHtml(coverImageUrl)}</a></div>
            ` : ""}

            ${editorialNote ? `
              <div class="section-label">Note to Editor</div>
              <div class="note-box">${escapeHtml(editorialNote)}</div>
            ` : ""}

            <div class="section-label">Excerpt / Short Summary</div>
            <div class="value-box" style="font-style: italic;">
              ${escapeHtml(trimmedExcerpt)}
            </div>

            <div class="section-label">Article Content</div>
            <div class="content-box">${escapeHtml(trimmedContent)}</div>

            <div class="section-label">Copyright & Integrity</div>
            <div class="value-box" style="font-size: 12px;">
              ✓ Author confirmed original work and right to submit for publication.<br>
              <strong>Submitted:</strong> ${timestampStr}
            </div>

            <div class="footer">
              Rvan.me Editorial Intake System · Evaluated manually in Sanity CMS
            </div>
          </div>
        </body>
      </html>
    `;

    if (!apiKey) {
      console.warn("RESEND_API_KEY environment variable is missing. Article logged locally in development mode.");
      return res.status(200).json({
        success: true,
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
