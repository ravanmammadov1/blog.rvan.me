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
    const clientIp = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "127.0.0.1";

    // Rate limit check
    if (isRateLimited(clientIp)) {
      return res.status(429).json({
        error: "Too many submission attempts. Please try again in 15 minutes.",
      });
    }

    const { name, email, projectDetails, honeypot } = req.body || {};

    // 1. Honeypot check (anti-spam)
    if (honeypot && String(honeypot).trim() !== "") {
      // Quietly return success to fool spam bots without sending email
      return res.status(200).json({ success: true, message: "Message submitted successfully." });
    }

    // 2. Field validation
    const trimmedName = typeof name === "string" ? name.trim() : "";
    const trimmedEmail = typeof email === "string" ? email.trim() : "";
    const trimmedMessage = typeof projectDetails === "string" ? projectDetails.trim() : "";

    if (!trimmedName || trimmedName.length < 2) {
      return res.status(400).json({ error: "Please provide a valid name (minimum 2 characters)." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      return res.status(400).json({ error: "Please provide a valid email address." });
    }

    if (!trimmedMessage || trimmedMessage.length < 5) {
      return res.status(400).json({ error: "Please describe your project or message (minimum 5 characters)." });
    }

    // 3. Resend configuration & dispatch
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn("RESEND_API_KEY environment variable is not configured.");
      // In development / unconfigured environments, log submission gracefully
      return res.status(200).json({
        success: true,
        message: "Message received (Development Mode: RESEND_API_KEY missing).",
      });
    }

    const resend = new Resend(apiKey);
    const timestampStr = new Date().toLocaleString("en-US", {
      timeZone: "UTC",
      dateStyle: "full",
      timeStyle: "medium",
    }) + " UTC";

    const fromAddress = process.env.RESEND_FROM_EMAIL || "Ravan Portfolio <onboarding@resend.dev>";
    const recipientEmail = "mammadovravan1@gmail.com";

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #111; line-height: 1.6; background-color: #f9f9f9; padding: 20px; }
            .card { background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 32px; max-width: 600px; margin: 0 auto; shadow: 0 4px 6px rgba(0,0,0,0.05); }
            .header { border-bottom: 2px solid #e8fd52; padding-bottom: 16px; margin-bottom: 24px; }
            .title { font-size: 20px; font-weight: 700; color: #000; margin: 0; }
            .label { font-size: 11px; font-weight: 700; letter-spacing: 0.1em; color: #64748b; text-transform: uppercase; margin-top: 16px; }
            .value { font-size: 15px; color: #1e293b; margin-top: 4px; font-weight: 500; }
            .message-box { background: #f8fafc; border-left: 4px solid #e8fd52; padding: 16px; border-radius: 4px; margin-top: 8px; font-size: 15px; color: #334155; white-space: pre-wrap; }
            .footer { margin-top: 24px; padding-top: 16px; border-top: 1px solid #f1f5f9; font-size: 12px; color: #94a3b8; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <h2 class="title">New Portfolio Project Inquiry</h2>
            </div>

            <div class="label">Sender Name</div>
            <div class="value">${escapeHtml(trimmedName)}</div>

            <div class="label">Email Address</div>
            <div class="value"><a href="mailto:${escapeHtml(trimmedEmail)}" style="color: #2563eb;">${escapeHtml(trimmedEmail)}</a></div>

            <div class="label">Project Details & Message</div>
            <div class="message-box">${escapeHtml(trimmedMessage)}</div>

            <div class="label">Submission Timestamp</div>
            <div class="value">${timestampStr}</div>

            <div class="footer">
              Submitted via <a href="https://rvan.me">rvan.me</a> portfolio contact form.
            </div>
          </div>
        </body>
      </html>
    `;

    const data = await resend.emails.send({
      from: fromAddress,
      to: recipientEmail,
      subject: `New Project Inquiry from ${trimmedName}`,
      replyTo: trimmedEmail,
      html: emailHtml,
    });

    if (data.error) {
      console.error("Resend API error:", data.error);
      return res.status(500).json({ error: "Failed to dispatch email notification." });
    }

    return res.status(200).json({
      success: true,
      message: "Your project inquiry has been sent successfully!",
      id: data.data?.id,
    });
  } catch (error: any) {
    console.error("Serverless handler error:", error);
    return res.status(500).json({ error: error.message || "An unexpected error occurred." });
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
