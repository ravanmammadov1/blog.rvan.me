import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
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
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const clientIp = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "127.0.0.1";

    if (isRateLimited(clientIp)) {
      return res.status(429).json({
        error: "Too many report attempts. Please try again later.",
      });
    }

    const {
      articleId,
      articleTitle,
      articleUrl,
      authorName,
      reason,
      details,
      reporterUid,
      reporterEmail,
      reporterName,
      honeypot,
    } = req.body || {};

    if (honeypot && String(honeypot).trim() !== "") {
      return res.status(200).json({ success: true, message: "Report submitted successfully." });
    }

    if (!articleTitle || !reason) {
      return res.status(400).json({ error: "Article title and report reason are required." });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn("RESEND_API_KEY is not configured.");
      return res.status(200).json({
        success: true,
        message: "Report logged (Development Mode: RESEND_API_KEY missing).",
      });
    }

    const resend = new Resend(apiKey);
    const timestampStr =
      new Date().toLocaleString("en-US", {
        timeZone: "UTC",
        dateStyle: "full",
        timeStyle: "medium",
      }) + " UTC";

    const fromAddress = process.env.RESEND_FROM_EMAIL || "Rvan.me Reports <onboarding@resend.dev>";
    const recipientEmail = "mammadovravan1@gmail.com";

    const reasonLabels: Record<string, string> = {
      spam: "Spam / Unsolicited Content",
      plagiarism: "Plagiarism / Copied Content",
      misleading: "Misleading Information",
      offensive: "Offensive / Inappropriate Content",
      copyright: "Copyright Concern",
      ai_low_effort: "Mass AI / Low-Effort Content",
      promotional: "Promotional Spam / Covert Advertising",
      other: "Other Policy Violation",
    };

    const readableReason = reasonLabels[reason] || reason;

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #111; line-height: 1.6; background-color: #f9f9f9; padding: 20px; }
            .card { background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 32px; max-width: 600px; margin: 0 auto; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
            .header { border-bottom: 2px solid #ef4444; padding-bottom: 16px; margin-bottom: 24px; }
            .title { font-size: 20px; font-weight: 700; color: #991b1b; margin: 0; }
            .badge { display: inline-block; background: #fee2e2; color: #991b1b; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 700; margin-top: 8px; }
            .label { font-size: 11px; font-weight: 700; letter-spacing: 0.1em; color: #64748b; text-transform: uppercase; margin-top: 16px; }
            .value { font-size: 15px; color: #1e293b; margin-top: 4px; font-weight: 500; }
            .message-box { background: #fef2f2; border-left: 4px solid #ef4444; padding: 16px; border-radius: 4px; margin-top: 8px; font-size: 14px; color: #334155; white-space: pre-wrap; }
            .footer { margin-top: 24px; padding-top: 16px; border-top: 1px solid #f1f5f9; font-size: 12px; color: #94a3b8; }
            .link-btn { display: inline-block; margin-top: 16px; background: #0f172a; color: #fff; text-decoration: none; padding: 10px 18px; border-radius: 8px; font-size: 13px; font-weight: 600; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <h1 class="title">⚠️ New Article Content Report</h1>
              <div class="badge">REASON: ${readableReason}</div>
            </div>

            <div class="label">Article Title</div>
            <div class="value"><strong>${articleTitle}</strong></div>

            ${authorName ? `<div class="label">Article Author</div><div class="value">${authorName}</div>` : ""}

            <div class="label">Report Reason</div>
            <div class="value">${readableReason}</div>

            ${
              details
                ? `<div class="label">Reporter's Additional Details</div><div class="message-box">${details}</div>`
                : ""
            }

            <div class="label">Reported By</div>
            <div class="value">${reporterName || "Anonymous User"} ${reporterEmail ? `(${reporterEmail})` : ""}${reporterUid ? ` [UID: ${reporterUid}]` : ""}</div>

            <div class="label">Article URL</div>
            <div class="value"><a href="${articleUrl || "https://www.rvan.me"}" target="_blank">${articleUrl || "https://www.rvan.me"}</a></div>

            ${articleUrl ? `<a href="${articleUrl}" class="link-btn" target="_blank">Review Article on Rvan.me →</a>` : ""}

            <div class="footer">
              Received on ${timestampStr} via Rvan.me Content Safety System
            </div>
          </div>
        </body>
      </html>
    `;

    const { data: emailData, error: emailError } = await resend.emails.send({
      from: fromAddress,
      to: [recipientEmail],
      subject: `[Rvan.me Report] ${readableReason} - "${articleTitle}"`,
      html: emailHtml,
    });

    if (emailError) {
      console.error("Resend report email error:", emailError);
      return res.status(500).json({ error: "Failed to dispatch notification email." });
    }

    return res.status(200).json({
      success: true,
      message: "Report submitted and sent to editorial review successfully.",
      id: emailData?.id,
    });
  } catch (error: any) {
    console.error("Server error handling report submission:", error);
    return res.status(500).json({
      error: error?.message || "Internal server error.",
    });
  }
}
