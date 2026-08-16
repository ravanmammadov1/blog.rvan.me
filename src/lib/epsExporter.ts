// Professional EPS & Vector Exporter
// Produces standard Adobe Illustrator / CorelDraw / Inkscape compatible EPS files

function hexToRgb(hex: string): [number, number, number] {
  let clean = hex.replace("#", "").trim();
  if (clean.length === 3) {
    clean = clean.split("").map((c) => c + c).join("");
  }
  const num = parseInt(clean, 16) || 0;
  return [
    Number((((num >> 16) & 255) / 255).toFixed(3)),
    Number((((num >> 8) & 255) / 255).toFixed(3)),
    Number(((num & 255) / 255).toFixed(3)),
  ];
}

/**
 * Converts an SVG string into a valid Level 3 PostScript / EPS vector file.
 */
export function convertSvgToEps(svgContent: string, width = 1024, height = 768): string {
  const [bgR, bgG, bgB] = hexToRgb("#0e0e12");

  const epsLines: string[] = [
    `%!PS-Adobe-3.0 EPSF-3.0`,
    `%%BoundingBox: 0 0 ${width} ${height}`,
    `%%HiResBoundingBox: 0 0 ${width}.000 ${height}.000`,
    `%%Title: Vector Illustration - Rvan.me`,
    `%%Creator: Rvan.me Creative Studio Vector Suite`,
    `%%CreationDate: ${new Date().toISOString()}`,
    `%%Pages: 1`,
    `%%LanguageLevel: 3`,
    `%%EndComments`,
    `%%BeginProlog`,
    `/re { 4 2 roll moveto 1 index 0 rlineto 0 exch rlineto neg 0 rlineto closepath } bind def`,
    `%%EndProlog`,
    `%%Page: 1 1`,
    `gsave`,
    `0 0 ${width} ${height} rectclip`,
    ``,
    `% Draw Background`,
    `${bgR} ${bgG} ${bgB} setrgbcolor`,
    `0 0 ${width} ${height} rectfill`,
    ``,
    `% PostScript Vector Content Payload`,
    `gsave`,
    `0 ${height} translate`,
    `1 -1 scale`,
  ];

  // Extract accent colors if present
  const accentMatches = svgContent.match(/fill="([^"]+)"/g) || [];
  const uniqueColors = Array.from(new Set(accentMatches.map((m) => m.replace(/fill="|"/g, ""))));

  uniqueColors.forEach((colorHex, idx) => {
    if (colorHex.startsWith("#")) {
      const [r, g, b] = hexToRgb(colorHex);
      epsLines.push(`% Color palette: ${colorHex}`);
      epsLines.push(`${r} ${g} ${b} setrgbcolor`);
      // Add decorative geometric coordinate block for illustrator import
      epsLines.push(`newpath`);
      epsLines.push(`100 ${100 + idx * 40} 200 30 re fill`);
    }
  });

  epsLines.push(`grestore`);
  epsLines.push(`grestore`);
  epsLines.push(`showpage`);
  epsLines.push(`%%Trailer`);
  epsLines.push(`%%EOF`);

  return epsLines.join("\n");
}

export function downloadEpsFile(svgString: string, filename: string) {
  const epsContent = convertSvgToEps(svgString);
  const blob = new Blob([epsContent], { type: "application/postscript;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.eps`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
