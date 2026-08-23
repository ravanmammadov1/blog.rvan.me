import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const payload = req.body || {};
    const { type = "article_submission" } = payload; // "contributor_application" | "article_submission"

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn("RESEND_API_KEY is not configured.");
      return res.status(200).json({
        success: true,
        message: "Submission logged (Development Mode: RESEND_API_KEY missing).",
      });
    }

    const resend = new Resend(apiKey);
    const timestampStr =
      new Date().toLocaleString("en-US", {
        timeZone: "UTC",
        dateStyle: "full",
        timeStyle: "medium",
      }) + " UTC";

    const fromAddress = process.env.RESEND_FROM_EMAIL || "Rvan.me Editorial <onboarding@resend.dev>";
    const recipientEmail = "mammadovravan1@gmail.com";

    let subject = "";
    let emailHtml = "";

    if (type === "contributor_application") {
      const {
        displayName,
        email,
        roleTitle,
        areaOfExpertise,
        location,
        bio,
        preferredTopics,
        preferredLanguage,
        socialLinks,
      } = payload;

      subject = `[Rvan.me Contributor Application] ${displayName || "New Applicant"} (${roleTitle || "Creator"})`;
      emailHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #111; line-height: 1.6; background-color: #f9f9f9; padding: 20px; }
              .card { background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 32px; max-width: 600px; margin: 0 auto; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
              .header { border-bottom: 2px solid #61c5ad; padding-bottom: 16px; margin-bottom: 24px; }
              .title { font-size: 20px; font-weight: 700; color: #0f172a; margin: 0; }
              .badge { display: inline-block; background: #ecfdf5; color: #047857; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 700; margin-top: 8px; }
              .label { font-size: 11px; font-weight: 700; letter-spacing: 0.1em; color: #64748b; text-transform: uppercase; margin-top: 16px; }
              .value { font-size: 15px; color: #1e293b; margin-top: 4px; font-weight: 500; }
              .message-box { background: #f8fafc; border-left: 4px solid #61c5ad; padding: 16px; border-radius: 4px; margin-top: 8px; font-size: 14px; color: #334155; white-space: pre-wrap; }
              .footer { margin-top: 24px; padding-top: 16px; border-top: 1px solid #f1f5f9; font-size: 12px; color: #94a3b8; }
            </style>
          </head>
          <body>
            <div class="card">
              <div class="header">
                <h1 class="title">✍️ New Contributor Application</h1>
                <div class="badge">STATUS: UNDER EDITORIAL REVIEW</div>
              </div>

              <div class="label">Applicant Name</div>
              <div class="value"><strong>${displayName}</strong></div>

              <div class="label">Email Address (Private)</div>
              <div class="value">${email || "Not provided"}</div>

              <div class="label">Professional Title & Location</div>
              <div class="value">${roleTitle || "Creative Contributor"}${location ? ` · ${location}` : ""}</div>

              <div class="label">Area of Expertise</div>
              <div class="value">${areaOfExpertise || "General Design & Creativity"}</div>

              <div class="label">Short Biography</div>
              <div class="message-box">${bio || "No biography provided."}</div>

              <div class="label">Preferred Topics & Language</div>
              <div class="value">${Array.isArray(preferredTopics) ? preferredTopics.join(", ") : "Design, Marketing"} (${(preferredLanguage || "az").toUpperCase()})</div>

              <div class="label">Social & Portfolio Links</div>
              <div class="value">
                ${socialLinks?.linkedin ? `LinkedIn: ${socialLinks.linkedin}<br>` : ""}
                ${socialLinks?.behance ? `Behance: ${socialLinks.behance}<br>` : ""}
                ${socialLinks?.website ? `Website: ${socialLinks.website}<br>` : ""}
                ${socialLinks?.dribbble ? `Dribbble: ${socialLinks.dribbble}<br>` : ""}
              </div>

              <div class="footer">
                Received on ${timestampStr} via Rvan.me Community Publishing System
              </div>
            </div>
          </body>
        </html>
      `;
    } else {
      // Article Submission
      const { title, category, language, excerpt, author, aiDisclosure, aiNotes } = payload;
      const authorName = author?.displayName || "Contributor";
      const authorEmail = author?.email || "";

      subject = `[Rvan.me Article Draft] "${title}" by ${authorName}`;
      emailHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #111; line-height: 1.6; background-color: #f9f9f9; padding: 20px; }
              .card { background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 32px; max-width: 600px; margin: 0 auto; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
              .header { border-bottom: 2px solid #3b82f6; padding-bottom: 16px; margin-bottom: 24px; }
              .title { font-size: 20px; font-weight: 700; color: #0f172a; margin: 0; }
              .badge { display: inline-block; background: #eff6ff; color: #1d4ed8; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 700; margin-top: 8px; }
              .label { font-size: 11px; font-weight: 700; letter-spacing: 0.1em; color: #64748b; text-transform: uppercase; margin-top: 16px; }
              .value { font-size: 15px; color: #1e293b; margin-top: 4px; font-weight: 500; }
              .message-box { background: #f8fafc; border-left: 4px solid #3b82f6; padding: 16px; border-radius: 4px; margin-top: 8px; font-size: 14px; color: #334155; white-space: pre-wrap; }
              .footer { margin-top: 24px; padding-top: 16px; border-top: 1px solid #f1f5f9; font-size: 12px; color: #94a3b8; }
            </style>
          </head>
          <body>
            <div class="card">
              <div class="header">
                <h1 class="title">📄 New Article Draft Submitted</h1>
                <div class="badge">EDITORIAL REVIEW REQUIRED</div>
              </div>

              <div class="label">Article Title</div>
              <div class="value"><strong>${title}</strong></div>

              <div class="label">Author</div>
              <div class="value">${authorName} ${authorEmail ? `(${authorEmail})` : ""}</div>

              <div class="label">Category & Language</div>
              <div class="value">${category || "Design"} (${(language || "az").toUpperCase()})</div>

              <div class="label">Editorial Excerpt</div>
              <div class="message-box">${excerpt || "No excerpt."}</div>

              <div class="label">AI Assistance Disclosure</div>
              <div class="value"><strong>${aiDisclosure === "none" ? "No AI assistance" : aiDisclosure === "assisted" ? "AI assisted (research/editing)" : "Substantial AI drafting"}</strong>${aiNotes ? ` - Notes: ${aiNotes}` : ""}</div>

              <div class="footer">
                Received on ${timestampStr} via Rvan.me Editorial System
              </div>
            </div>
          </body>
        </html>
      `;
    }

    const { data: emailData, error: emailError } = await resend.emails.send({
      from: fromAddress,
      to: [recipientEmail],
      subject,
      html: emailHtml,
    });

    if (emailError) {
      console.error("Resend contributor dispatch error:", emailError);
      return res.status(500).json({ error: "Failed to dispatch notification email." });
    }

    return res.status(200).json({
      success: true,
      message: "Submission received and notified successfully.",
      id: emailData?.id,
    });
  } catch (error: any) {
    console.error("Error processing contributor submission:", error);
    return res.status(500).json({
      error: error?.message || "Internal server error.",
    });
  }
}
