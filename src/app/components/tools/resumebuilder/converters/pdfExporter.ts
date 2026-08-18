/**
 * Direct High-Resolution A4 PDF Exporter
 * Generates and downloads an exact 1:1 single or multi-page A4 PDF directly
 * to the user's computer without opening the browser's print dialog,
 * and with 100% protection against modern CSS "oklch" parse errors in html2canvas.
 */

// Canvas context for normalizing modern color formats (oklch, lab, etc.) into standard RGB/Hex
const colorCanvas = typeof document !== "undefined" ? document.createElement("canvas") : null;
const colorCtx = colorCanvas ? colorCanvas.getContext("2d") : null;

function sanitizeOklchColor(colorStr: string): string {
  if (!colorStr || typeof colorStr !== "string") return colorStr;
  if (!colorStr.includes("oklch") && !colorStr.includes("lab") && !colorStr.includes("color(")) {
    return colorStr;
  }
  if (!colorCtx) return "#111827";

  try {
    colorCtx.fillStyle = colorStr;
    return colorCtx.fillStyle; // Automatically converts to #rrggbb or rgb(r, g, b)
  } catch (e) {
    return "#111827";
  }
}

function sanitizeDomColors(element: HTMLElement) {
  const allNodes = Array.from(element.querySelectorAll("*"));
  allNodes.push(element);

  const colorProps = [
    "color",
    "background-color",
    "border-color",
    "border-top-color",
    "border-bottom-color",
    "border-left-color",
    "border-right-color",
    "outline-color",
    "text-decoration-color",
    "fill",
    "stroke",
  ];

  allNodes.forEach((node) => {
    if (node instanceof HTMLElement || node instanceof SVGElement) {
      try {
        const computed = window.getComputedStyle(node);
        colorProps.forEach((prop) => {
          const val = computed.getPropertyValue(prop);
          if (val && (val.includes("oklch") || val.includes("lab") || val.includes("color("))) {
            const sanitized = sanitizeOklchColor(val);
            node.style.setProperty(prop, sanitized, "important");
          }
        });
      } catch (err) {}
    }
  });
}

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
    throw new Error("Failed to initialize PDF generator module.");
  }

  // 2. Create a clean, off-screen isolated clone
  const clone = originalElement.cloneNode(true) as HTMLElement;

  // 3. Remove all interactive editing controls, helper buttons, dividers and hovers
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

  // Remove all interactive ring / outline classes
  const allElements = clone.querySelectorAll("*");
  allElements.forEach((el) => {
    el.classList.remove(
      "ring-2",
      "ring-primary",
      "hover:outline",
      "hover:outline-1",
      "hover:outline-dashed",
      "cursor-pointer",
      "cursor-text"
    );
  });

  // 4. Force exact A4 dimensions & remove any outer shadows / borders
  clone.style.width = "794px"; // Exact A4 width at 96 DPI (210mm)
  clone.style.minHeight = "1123px"; // Exact A4 height at 96 DPI (297mm)
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

  // 5. Sanitize all oklch colors in the cloned DOM tree
  sanitizeDomColors(clone);

  // 6. Configure html2pdf options
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
      onclone: (clonedDoc: Document) => {
        const clonedBody = clonedDoc.body;
        if (clonedBody) {
          sanitizeDomColors(clonedBody);
        }
      },
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
    // Generate as Blob -> Object URL -> direct browser download trigger -> revoke
    const pdfBlob: Blob = await html2pdf().set(opt).from(clone).output("blob");
    const blobUrl = URL.createObjectURL(pdfBlob);

    const downloadAnchor = document.createElement("a");
    downloadAnchor.href = blobUrl;
    downloadAnchor.download = cleanFilename;
    downloadAnchor.style.display = "none";
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);

    setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
    }, 2500);

    return true;
  } catch (error) {
    console.error("PDF generation failed:", error);
    throw error;
  } finally {
    if (document.body.contains(clone)) {
      document.body.removeChild(clone);
    }
  }
}
