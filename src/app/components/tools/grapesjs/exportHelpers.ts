import JSZip from "jszip";

export function formatHtmlDocument(html: string, css: string, title: string = "Created with RVAN.ME Visual Web Builder"): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="stylesheet" href="styles.css">
  <style>
${css}
  </style>
</head>
<body>
${html}
</body>
</html>`;
}

/**
 * Converts standard HTML into a clean React JSX functional component string.
 */
export function convertToReactJsx(html: string, css: string, componentName: string = "ExportedWebPage"): string {
  let jsx = html;

  // Replace class with className
  jsx = jsx.replace(/\sclass=/g, " className=");
  // Replace for with htmlFor
  jsx = jsx.replace(/\sfor=/g, " htmlFor=");
  // Replace tabindex with tabIndex
  jsx = jsx.replace(/\stabindex=/g, " tabIndex=");
  // Replace onclick with onClick
  jsx = jsx.replace(/\sonclick=/g, " onClick=");

  // Self-close void tags
  const voidTags = ["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"];
  voidTags.forEach((tag) => {
    const regex = new RegExp(`<(${tag}[^>]*?)(?<!/)>`, "gi");
    jsx = jsx.replace(regex, "<$1 />");
  });

  return `import React from "react";

/**
 * ${componentName}
 * Generated with RVAN.ME GrapesJS Visual Web Builder
 */
export default function ${componentName}() {
  return (
    <>
      <style>{\`
${css}
      \`}</style>

      ${jsx.split("\n").map((line) => "      " + line).join("\n").trim()}
    </>
  );
}
`;
}

/**
 * Generates a Tailwind CSS approximation preview.
 */
export function generateTailwindPreview(html: string): string {
  let tw = html;

  // Basic attribute fixes
  tw = tw.replace(/\sclass=/g, " className=");

  // Style replacements for common patterns
  tw = tw.replace(/style="[^"]*display:\s*flex[^"]*"/gi, 'className="flex"');
  tw = tw.replace(/style="[^"]*display:\s*grid[^"]*"/gi, 'className="grid"');
  tw = tw.replace(/style="[^"]*text-align:\s*center[^"]*"/gi, 'className="text-center"');
  tw = tw.replace(/style="[^"]*border-radius:\s*9999px[^"]*"/gi, 'className="rounded-full"');
  tw = tw.replace(/style="[^"]*border-radius:\s*16px[^"]*"/gi, 'className="rounded-2xl"');
  tw = tw.replace(/style="[^"]*border-radius:\s*24px[^"]*"/gi, 'className="rounded-3xl"');
  tw = tw.replace(/style="[^"]*font-weight:\s*800[^"]*"/gi, 'className="font-extrabold"');
  tw = tw.replace(/style="[^"]*font-weight:\s*700[^"]*"/gi, 'className="font-bold"');

  return `<!-- ==========================================================
  GENERATED TAILWIND CSS PREVIEW
  Note: This is an automated semantic Tailwind utility preview.
  Review and refine spacing/color tokens for your specific theme config.
========================================================== -->

${tw}
`;
}

/**
 * Generates and downloads a complete ZIP archive bundle containing:
 * - index.html
 * - styles.css
 * - README.md
 */
export async function downloadZipBundle(projectName: string, html: string, css: string): Promise<void> {
  const zip = new JSZip();
  const safeName = (projectName || "rvan-web-project").toLowerCase().replace(/[^a-z0-9_-]+/gi, "-");

  // 1. index.html
  const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${projectName}</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
${html}
</body>
</html>`;
  zip.file("index.html", fullHtml);

  // 2. styles.css
  zip.file("styles.css", css || "/* No custom CSS generated */");

  // 3. README.md
  const readme = `# ${projectName}

Generated with **RVAN.ME GrapesJS Visual Web Builder** on ${new Date().toLocaleDateString()}.

## 🚀 Quick Start

1. Open \`index.html\` in any web browser to preview your site immediately.
2. Edit \`styles.css\` to tweak theme variables, typography, or animations.
3. Deploy to Vercel, Netlify, Cloudflare Pages, or GitHub Pages by dragging this folder into your hosting provider.

## 📦 Assets & Customization
- Built with standard semantic HTML5 & responsive modern CSS.
- Zero runtime dependencies required.
`;
  zip.file("README.md", readme);

  // Generate and trigger download
  const content = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(content);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${safeName}-bundle.zip`;
  a.click();
  URL.revokeObjectURL(url);
}
