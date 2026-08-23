import React from "react";
import { pdf } from "@react-pdf/renderer";
import { ResumePdfDocument } from "../pdf/ResumePdfDocument";
import { ResumeData, ResumeThemeConfig } from "../resumeTypes";

/**
 * Downloads a resume as a crisp, native vector PDF document using @react-pdf/renderer.
 * - 0 HTML2Canvas / DOM rasterization
 * - 0 CSS color parsing errors (oklch, color-mix, etc.)
 * - 0 Eval / CSP issues
 * - Clean asynchronous Blob -> Object URL -> Download -> Revoke lifecycle
 */
export async function downloadResumeAsPdf(
  data: ResumeData,
  theme: ResumeThemeConfig,
  customFilename?: string
): Promise<boolean> {
  const name = data.personalInfo.fullName?.trim() || "Resume";
  const cleanName = name.replace(/[^a-zA-Z0-9_\-]/g, "_");
  const filename = customFilename ? (customFilename.endsWith(".pdf") ? customFilename : `${customFilename}.pdf`) : `${cleanName}_CV.pdf`;

  try {
    const docElement = React.createElement(ResumePdfDocument, { data, theme });
    const blob = await pdf(docElement).toBlob();

    if (!blob || blob.size === 0) {
      throw new Error("Generated PDF blob is empty.");
    }

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.style.display = "none";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    // Release memory safely
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 2000);

    return true;
  } catch (error: any) {
    console.error("[PDF EXPORT ERROR]", error);
    console.error("[PDF EXPORT ERROR MESSAGE]", error?.message);
    console.error("[PDF EXPORT ERROR STACK]", error?.stack);
    throw error;
  }
}
