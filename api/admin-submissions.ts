import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@sanity/client";
import { Resend } from "resend";

const writeToken = process.env.SANITY_API_WRITE_TOKEN;

if (!writeToken) {
  console.warn("[AdminSubmissions] SANITY_API_WRITE_TOKEN environment variable is missing on server.");
}

const sanityClient = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID || "0lqwkcmg",
  dataset: process.env.VITE_SANITY_DATASET || process.env.SANITY_DATASET || "production",
  token: writeToken,
  apiVersion: "2025-01-01",
  useCdn: false,
});

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

function parseMarkdownToBlocks(text: string) {
  if (!text) return [];
  const paragraphs = text.split(/\n\s*\n/);
  return paragraphs
    .map((p, index) => {
      const trimmed = p.trim();
      if (!trimmed) return null;

      let style = "normal";
      let cleanText = trimmed;

      if (trimmed.startsWith("### ")) {
        style = "h3";
        cleanText = trimmed.replace(/^###\s+/, "");
      } else if (trimmed.startsWith("## ")) {
        style = "h2";
        cleanText = trimmed.replace(/^##\s+/, "");
      } else if (trimmed.startsWith("# ")) {
        style = "h2";
        cleanText = trimmed.replace(/^#\s+/, "");
      } else if (trimmed.startsWith("> ")) {
        style = "blockquote";
        cleanText = trimmed.replace(/^>\s+/, "");
      }

      return {
        _key: `block_${Date.now()}_${index}`,
        _type: "block",
        style,
        children: [
          {
            _key: `span_${Date.now()}_${index}`,
            _type: "span",
            marks: [],
            text: cleanText,
          },
        ],
        markDefs: [],
      };
    })
    .filter(Boolean);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // ── 1. GET: Fetch all real submissions ──
    if (req.method === "GET") {
      const submissions = await sanityClient.fetch(
        `*[_type == "articleSubmission"] | order(submittedAt desc) {
          _id,
          _type,
          authorName,
          authorEmail,
          authorBio,
          authorWebsite,
          profilePhotoUrl,
          profilePhotoAssetRef,
          title,
          slug,
          language,
          category,
          topic,
          tags,
          excerpt,
          content,
          coverImageUrl,
          coverImageAssetRef,
          editorialNote,
          editorialReviewNote,
          originalWorkConfirmed,
          status,
          submittedAt,
          publishedAt,
          publishedBlogId
        }`
      );

      return res.status(200).json({
        success: true,
        submissions: submissions || [],
      });
    }

    // ── 2. POST: Handle admin editorial actions ──
    if (req.method === "POST") {
      const { action, submissionId, editorialNote } = req.body || {};

      if (!submissionId) {
        return res.status(400).json({ error: "Missing submissionId." });
      }

      // Fetch the target submission
      const submission = await sanityClient.fetch(
        `*[_type == "articleSubmission" && _id == $id][0]`,
        { id: submissionId }
      );

      if (!submission) {
        return res.status(404).json({ error: "Submission not found in Sanity database." });
      }

      const resendApiKey = process.env.RESEND_API_KEY;
      const resendFrom =
        process.env.RESEND_FROM_EMAIL || "Rvan.me Editorial <onboarding@resend.dev>";
      const resend = resendApiKey ? new Resend(resendApiKey) : null;

      // ── ACTION A: APPROVE AND PUBLISH TO SANITY CMS ──
      if (action === "approve_and_publish") {
        const generatedSlug = submission.slug || slugify(submission.title) || `article-${Date.now()}`;
        const blocks = parseMarkdownToBlocks(submission.content || submission.excerpt || "");
        const wordCount = (submission.content || "").split(/\s+/).length;
        const readTime = `${Math.max(2, Math.ceil(wordCount / 180))} min read`;
        const blogDocId = `blog-${generatedSlug}`;

        // Build cover image object
        let coverImageObj: any = undefined;
        if (submission.coverImageAssetRef) {
          coverImageObj = {
            _type: "image",
            alt: submission.title,
            asset: {
              _type: "reference",
              _ref: submission.coverImageAssetRef,
            },
          };
        } else if (submission.coverImageUrl) {
          coverImageObj = {
            _type: "image",
            alt: submission.title,
            url: submission.coverImageUrl,
          };
        }

        // Create or replace Sanity blog document
        const publishedBlog = await sanityClient.createOrReplace({
          _id: blogDocId,
          _type: "blog",
          title: submission.title,
          title_az: submission.language === "az" ? submission.title : undefined,
          slug: {
            _type: "slug",
            current: generatedSlug,
          },
          category: submission.category || "Design",
          category_az: submission.language === "az" ? submission.category : undefined,
          excerpt: submission.excerpt,
          excerpt_az: submission.language === "az" ? submission.excerpt : undefined,
          body: blocks,
          coverImage: coverImageObj,
          authorName: submission.authorName,
          tags: Array.isArray(submission.tags) ? submission.tags : [],
          publishDate: new Date().toISOString().split("T")[0],
          readTime,
          featured: false,
          seo: {
            metaTitle: `${submission.title} — Rvan.me`,
            metaDescription: submission.excerpt,
          },
        });

        // Update submission status in Sanity
        await sanityClient
          .patch(submissionId)
          .set({
            status: "PUBLISHED",
            publishedAt: new Date().toISOString(),
            publishedBlogId: publishedBlog._id,
            editorialReviewNote: editorialNote || "Approved and published on Rvan.me.",
          })
          .commit();

        // Send confirmation email to author via Resend
        if (resend && submission.authorEmail) {
          const liveUrl = `https://www.rvan.me/blog/${generatedSlug}`;
          try {
            await resend.emails.send({
              from: resendFrom,
              to: submission.authorEmail,
              subject: `Your article has been published on Rvan.me — ${submission.title}`,
              html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #111;">
                  <h2 style="color: #61c5ad; margin-bottom: 8px;">Congratulations! Your article is live on Rvan.me</h2>
                  <p>Dear ${escapeHtml(submission.authorName)},</p>
                  <p>We are delighted to inform you that your article, <strong>"${escapeHtml(submission.title)}"</strong>, has been approved by the editorial team and is now published on Rvan.me under your byline.</p>
                  <div style="margin: 24px 0;">
                    <a href="${liveUrl}" style="background-color: #61c5ad; color: #000; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">View Your Published Article</a>
                  </div>
                  <p style="font-size: 13px; color: #666;">Article URL: <a href="${liveUrl}">${liveUrl}</a></p>
                  <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
                  <p style="font-size: 12px; color: #888;">Rvan.me Editorial Team · Baku, Azerbaijan</p>
                </div>
              `,
            });
          } catch (e: any) {
            console.warn("[AdminSubmissions] Resend author notification email warning:", e.message);
          }
        }

        return res.status(200).json({
          success: true,
          message: "Article published live to Sanity CMS!",
          blogId: publishedBlog._id,
          slug: generatedSlug,
        });
      }

      // ── ACTION B: REQUEST EDITORIAL CHANGES ──
      if (action === "request_changes") {
        const note = editorialNote || "Please review editorial feedback and revise your draft.";

        await sanityClient
          .patch(submissionId)
          .set({
            status: "CHANGES_REQUESTED",
            editorialReviewNote: note,
          })
          .commit();

        if (resend && submission.authorEmail) {
          try {
            await resend.emails.send({
              from: resendFrom,
              to: submission.authorEmail,
              subject: `Editorial Feedback on your Rvan.me submission — ${submission.title}`,
              html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #111;">
                  <h2 style="color: #333; margin-bottom: 8px;">Editorial Feedback on Your Submission</h2>
                  <p>Dear ${escapeHtml(submission.authorName)},</p>
                  <p>Thank you for submitting <strong>"${escapeHtml(submission.title)}"</strong> to Rvan.me. Our editorial team reviewed your draft and would love to publish it with a few revisions.</p>
                  <div style="background-color: #f7f7f8; border-left: 4px solid #61c5ad; padding: 16px; margin: 20px 0; border-radius: 4px;">
                    <strong style="display: block; margin-bottom: 6px; font-size: 12px; text-transform: uppercase; color: #555;">Editor's Notes:</strong>
                    <p style="margin: 0; white-space: pre-wrap; font-size: 14px; line-height: 1.5;">${escapeHtml(note)}</p>
                  </div>
                  <p>Please reply directly to this email with your updated draft or revised materials when ready.</p>
                  <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
                  <p style="font-size: 12px; color: #888;">Rvan.me Editorial Team · Baku, Azerbaijan</p>
                </div>
              `,
            });
          } catch (e: any) {
            console.warn("[AdminSubmissions] Resend change request warning:", e.message);
          }
        }

        return res.status(200).json({
          success: true,
          message: "Revision request recorded and sent to author.",
        });
      }

      // ── ACTION C: REJECT SUBMISSION ──
      if (action === "reject") {
        const note =
          editorialNote ||
          "Thank you for your submission. While it does not fit our current editorial priorities, we appreciate your interest in Rvan.me.";

        await sanityClient
          .patch(submissionId)
          .set({
            status: "REJECTED",
            editorialReviewNote: note,
          })
          .commit();

        if (resend && submission.authorEmail) {
          try {
            await resend.emails.send({
              from: resendFrom,
              to: submission.authorEmail,
              subject: `Update regarding your Rvan.me submission — ${submission.title}`,
              html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #111;">
                  <h2 style="color: #333; margin-bottom: 8px;">Rvan.me Editorial Update</h2>
                  <p>Dear ${escapeHtml(submission.authorName)},</p>
                  <p>Thank you for giving us the opportunity to consider <strong>"${escapeHtml(submission.title)}"</strong> for publication on Rvan.me.</p>
                  <p>After careful editorial review, we have decided not to proceed with publishing this piece at this time as it does not align with our current editorial calendar and thematic focus.</p>
                  ${
                    editorialNote
                      ? `<div style="background-color: #f7f7f8; padding: 14px; margin: 16px 0; border-radius: 6px; font-size: 13px; color: #444;"><strong>Editor's Note:</strong><br/>${escapeHtml(editorialNote)}</div>`
                      : ""
                  }
                  <p>We truly appreciate your interest in Rvan.me and welcome you to submit future ideas.</p>
                  <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
                  <p style="font-size: 12px; color: #888;">Rvan.me Editorial Team · Baku, Azerbaijan</p>
                </div>
              `,
            });
          } catch (e: any) {
            console.warn("[AdminSubmissions] Resend rejection warning:", e.message);
          }
        }

        return res.status(200).json({
          success: true,
          message: "Submission status updated to Rejected.",
        });
      }

      // ── ACTION D: DELETE RECORD ──
      if (action === "delete") {
        await sanityClient.delete(submissionId);
        return res.status(200).json({
          success: true,
          message: "Submission record removed permanently.",
        });
      }

      return res.status(400).json({ error: `Unknown action: ${action}` });
    }

    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  } catch (error: any) {
    console.error("[AdminSubmissions] Server error:", error);
    return res.status(500).json({
      error: error?.message || "Internal server error in admin submissions handler.",
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
