import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const width = 1200;
const height = 630;

const svg = `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Brand Gradient -->
    <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#61c5ad" />
      <stop offset="50%" stop-color="#6099df" />
      <stop offset="100%" stop-color="#bc66c5" />
    </linearGradient>

    <!-- Background Radial Gradients -->
    <radialGradient id="bgGlow1" cx="20%" cy="30%" r="50%">
      <stop offset="0%" stop-color="#61c5ad" stop-opacity="0.16" />
      <stop offset="100%" stop-color="#07090e" stop-opacity="0" />
    </radialGradient>

    <radialGradient id="bgGlow2" cx="80%" cy="70%" r="55%">
      <stop offset="0%" stop-color="#bc66c5" stop-opacity="0.18" />
      <stop offset="100%" stop-color="#07090e" stop-opacity="0" />
    </radialGradient>

    <radialGradient id="bgGlow3" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#6099df" stop-opacity="0.12" />
      <stop offset="100%" stop-color="#07090e" stop-opacity="0" />
    </radialGradient>

    <linearGradient id="cardBorder" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#61c5ad" stop-opacity="0.4" />
      <stop offset="50%" stop-color="#2a3348" stop-opacity="0.6" />
      <stop offset="100%" stop-color="#bc66c5" stop-opacity="0.4" />
    </linearGradient>

    <!-- Subtle Grid Pattern -->
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#ffffff" stroke-width="1" stroke-opacity="0.03" />
    </pattern>
  </defs>

  <!-- Base Dark Space Background -->
  <rect width="100%" height="100%" fill="#07090e" />

  <!-- Ambient Glow Layers -->
  <rect width="100%" height="100%" fill="url(#bgGlow1)" />
  <rect width="100%" height="100%" fill="url(#bgGlow2)" />
  <rect width="100%" height="100%" fill="url(#bgGlow3)" />

  <!-- Grid overlay -->
  <rect width="100%" height="100%" fill="url(#grid)" />

  <!-- Ambient Star Dots -->
  <circle cx="120" cy="90" r="1.5" fill="#ffffff" opacity="0.6" />
  <circle cx="340" cy="140" r="1.2" fill="#61c5ad" opacity="0.7" />
  <circle cx="980" cy="110" r="1.5" fill="#ffffff" opacity="0.5" />
  <circle cx="1100" cy="220" r="1.2" fill="#bc66c5" opacity="0.7" />
  <circle cx="80" cy="480" r="1.2" fill="#ffffff" opacity="0.4" />
  <circle cx="1060" cy="520" r="1.5" fill="#6099df" opacity="0.6" />
  <circle cx="220" cy="560" r="1.5" fill="#ffffff" opacity="0.5" />
  <circle cx="650" cy="80" r="1.2" fill="#61c5ad" opacity="0.5" />
  <circle cx="840" cy="450" r="1.5" fill="#ffffff" opacity="0.4" />

  <!-- Inner Card Frame -->
  <rect x="40" y="40" width="1120" height="550" rx="24" fill="#0d111a" fill-opacity="0.65" stroke="url(#cardBorder)" stroke-width="1.5" />

  <!-- Top Pill Badge -->
  <g transform="translate(80, 85)">
    <rect x="0" y="0" width="460" height="34" rx="17" fill="#61c5ad" fill-opacity="0.08" stroke="#61c5ad" stroke-opacity="0.3" stroke-width="1" />
    <circle cx="18" cy="17" r="4" fill="#61c5ad" />
    <text x="32" y="22" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" font-size="11" font-weight="700" letter-spacing="2.5" fill="#61c5ad">CREATIVE PUBLICATION &amp; PLATFORM</text>
  </g>

  <!-- Main Headline -->
  <g transform="translate(80, 185)">
    <text x="0" y="50" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" font-size="54" font-weight="800" fill="#ffffff" letter-spacing="-1.5">
      Deconstructing visual strategy.
    </text>

    <!-- Sub-headline in Brand Gradient -->
    <text x="0" y="115" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" font-size="54" font-weight="800" fill="url(#brandGradient)" letter-spacing="-1.5">
      Decoding brands &amp; visual culture.
    </text>

    <!-- Description Paragraph -->
    <text x="0" y="185" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" font-size="20" font-weight="400" fill="#94a3b8" letter-spacing="0.2">
      An independent publication exploring design, marketing, branding, AI &amp; creativity.
    </text>
  </g>

  <!-- Bottom Divider Line -->
  <line x1="80" y1="480" x2="1120" y2="480" stroke="#232d42" stroke-width="1" />

  <!-- Bottom Footer / Brand Identity -->
  <g transform="translate(80, 525)">
    <!-- Logo Mark -->
    <rect x="0" y="-18" width="36" height="36" rx="10" fill="#141a29" stroke="url(#brandGradient)" stroke-width="1.5" />
    <text x="18" y="6" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" font-size="18" font-weight="800" fill="#ffffff" text-anchor="middle">R</text>

    <!-- Brand Name -->
    <text x="48" y="5" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" font-size="18" font-weight="800" fill="#ffffff" letter-spacing="1.5">RVAN.ME</text>

    <!-- Pill Tagline -->
    <text x="175" y="4" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" font-size="12" font-weight="600" fill="#64748b" letter-spacing="1.5">EDITORIAL &amp; KNOWLEDGE HUB</text>
  </g>

  <!-- URL on Right Bottom -->
  <g transform="translate(1120, 528)">
    <circle cx="-135" cy="0" r="3.5" fill="#61c5ad" />
    <text x="0" y="5" font-family="'Courier New', Courier, monospace, monospace" font-size="15" font-weight="700" fill="#cbd5e1" text-anchor="end" letter-spacing="1.2">https://rvan.me</text>
  </g>
</svg>
`;

async function generateOgImages() {
  const svgBuffer = Buffer.from(svg);
  const publicDir = path.resolve("public");

  // Generate public/og-image.jpg (JPEG format, 1200x630, high quality)
  await sharp(svgBuffer)
    .jpeg({ quality: 95, chromaSubsampling: "4:4:4" })
    .toFile(path.join(publicDir, "og-image.jpg"));

  // Also generate public/og-image.png for PNG-seeking crawlers
  await sharp(svgBuffer)
    .png({ compressionLevel: 9 })
    .toFile(path.join(publicDir, "og-image.png"));

  console.log("✓ Successfully generated new Rvan.me branded OG images (1200x630):");
  console.log("  - public/og-image.jpg");
  console.log("  - public/og-image.png");
}

generateOgImages().catch(console.error);
