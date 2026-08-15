/**
 * Encapsulated PostScript (EPS) Vector Exporter
 * Converts SVG vector data into standalone, Adobe Illustrator-compatible EPS vector files.
 */

function hexToRgbNormalized(hex: string): { r: number; g: number; b: number } {
  let cleanHex = hex.replace("#", "").trim();
  if (cleanHex.length === 3) {
    cleanHex = cleanHex
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const num = parseInt(cleanHex, 16) || 0;
  const r = ((num >> 16) & 255) / 255;
  const g = ((num >> 8) & 255) / 255;
  const b = (num & 255) / 255;
  return {
    r: Number(r.toFixed(3)),
    g: Number(g.toFixed(3)),
    b: Number(b.toFixed(3)),
  };
}

export function convertSvgToEps(svgContent: string, width = 800, height = 600): string {
  const lines: string[] = [
    `%!PS-Adobe-3.0 EPSF-3.0`,
    `%%BoundingBox: 0 0 ${width} ${height}`,
    `%%Title: Vector Illustration`,
    `%%Creator: Rvan.me Vector Engine`,
    `%%Pages: 1`,
    `%%EndComments`,
    ``,
    `gsave`,
    `0 ${height} translate 1 -1 scale`, // Flip Y coordinate for PostScript origin
    ``,
  ];

  // Match fill colors and basic vector primitives
  const fillRegex = /fill="(#[a-fA-F0-9]{3,6}|rgba?\([^)]+\))"/g;
  const rectRegex = /<rect[^>]+x="([^"]+)"[^>]+y="([^"]+)"[^>]+width="([^"]+)"[^>]+height="([^"]+)"[^>]*fill="([^"]+)"/g;
  const circleRegex = /<circle[^>]+cx="([^"]+)"[^>]+cy="([^"]+)"[^>]+r="([^"]+)"[^>]*fill="([^"]+)"/g;

  // Process rectangles
  let rectMatch;
  while ((rectMatch = rectRegex.exec(svgContent)) !== null) {
    const [, x, y, w, h, fill] = rectMatch;
    if (fill !== "none" && !fill.includes("url")) {
      const rgb = hexToRgbNormalized(fill);
      lines.push(`${rgb.r} ${rgb.g} ${rgb.b} setrgbcolor`);
      lines.push(`newpath ${x} ${y} ${w} ${h} rectfill`);
    }
  }

  // Process circles
  let circleMatch;
  while ((circleMatch = circleRegex.exec(svgContent)) !== null) {
    const [, cx, cy, r, fill] = circleMatch;
    if (fill !== "none" && !fill.includes("url")) {
      const rgb = hexToRgbNormalized(fill);
      lines.push(`${rgb.r} ${rgb.g} ${rgb.b} setrgbcolor`);
      lines.push(`newpath ${cx} ${cy} ${r} 0 360 arc fill`);
    }
  }

  lines.push(`grestore`);
  lines.push(`%%EOF`);

  return lines.join("\n");
}

export function downloadEpsFile(svgString: string, filename: string) {
  const epsString = convertSvgToEps(svgString);
  const blob = new Blob([epsString], { type: "application/postscript" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.eps`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
