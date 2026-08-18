/**
 * Direct High-Resolution A4 PDF Exporter
 * Generates and downloads an exact 1:1 single or multi-page A4 PDF directly
 * to the user's computer without opening the browser's print dialog.
 */
export async function downloadResumeAsPdf(
  elementId: string,
  filename: string
): Promise<boolean> {
  if (typeof window === "undefined") return false;

  const originalElement = document.getElementById(elementId);
  if (!originalElement) {
    console.error(`Element #${elementId} not found`);
    return false;
  }

  // 1. Dynamic import of html2pdf to ensure zero bundle overhead when not exporting
  let html2pdf: any;
  try {
    const module = await import("html2pdf.js");
    html2pdf = module.default || module;
  } catch (err) {
    console.error("Failed to load html2pdf module:", err);
    return false;
  }

  // 2. Create a clean, off-screen isolated clone
  const clone = originalElement.cloneNode(true) as HTMLElement;

  // 3. Remove all editing controls, helper buttons, borders, and hovers in clone
  const editControls = clone.querySelectorAll(
    "button, .print\\:hidden, [data-canvas-control], .canvas-edit-divider"
  );
  editControls.forEach((el) => el.remove());

  // Remove contenteditable attributes so no focus rings or editing styles remain
  const editables = clone.querySelectorAll("[contenteditable]");
  editables.forEach((el) => {
    el.removeAttribute("contenteditable");
    el.removeAttribute("data-empty");
  });

  // Remove all outline/ring classes from interactive elements
  const allElements = clone.querySelectorAll("*");
  allElements.forEach((el) => {
    el.classList.remove("ring-2", "ring-primary", "hover:outline", "hover:outline-1", "hover:outline-dashed");
  });

  // 4. Force exact A4 dimensions & remove any outer shadows / borders
  clone.style.width = "794px"; // Standard A4 width at 96 DPI (210mm)
  clone.style.minHeight = "1123px"; // Standard A4 height at 96 DPI (297mm)
  clone.style.maxHeight = "none";
  clone.style.transform = "none";
  clone.style.margin = "0";
  clone.style.boxShadow = "none";
  clone.style.border = "none";
  clone.style.borderRadius = "0";
  clone.style.backgroundColor = "#ffffff";
  clone.style.color = "#000000";
  clone.style.boxSizing = "border-box";
  clone.style.position = "fixed";
  clone.style.top = "-99999px";
  clone.style.left = "-99999px";
  clone.style.zIndex = "-9999";

  document.body.appendChild(clone);

  // 5. Configure html2pdf options
  const cleanFilename = filename.endsWith(".pdf") ? filename : `${filename}.pdf`;

  const opt = {
    margin: 0,
    filename: cleanFilename,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2, // 2x resolution (192 DPI) for razor-sharp typography
      useCORS: true,
      letterRendering: true,
      logging: false,
      scrollY: 0,
      scrollX: 0,
      windowWidth: 794,
      backgroundColor: "#ffffff",
    },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "portrait",
      compress: true,
    },
    pagebreak: { mode: ["avoid-all", "css", "legacy"] },
  };

  try {
    await html2pdf().set(opt).from(clone).save();
    return true;
  } catch (error) {
    console.error("PDF generation failed:", error);
    return false;
  } finally {
    if (document.body.contains(clone)) {
      document.body.removeChild(clone);
    }
  }
}
