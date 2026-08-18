import { SemanticConcept, GestaltMode, CanvasTransformConfig, ColorPalette } from "./types";

export interface RenderedGestaltSvg {
  viewBox: string;
  svgContent: string;
  maskId: string;
  clipId: string;
}

export function generateGestaltVector(
  conceptA: SemanticConcept,
  conceptB: SemanticConcept,
  mode: GestaltMode,
  config: CanvasTransformConfig,
  palette: ColorPalette
): RenderedGestaltSvg {
  const uniqueId = `metaphor-${conceptA.id}-${conceptB.id}-${mode}`.replace(/[^a-zA-Z0-9-_]/g, "");
  const maskId = `mask-${uniqueId}`;
  const clipId = `clip-${uniqueId}`;

  const scaleA = config.scaleA || 1;
  const scaleB = config.scaleB || 1;
  const offX = config.offsetX || 0;
  const offY = config.offsetY || 0;
  const rotA = config.rotationA || 0;
  const rotB = config.rotationB || 0;
  const depth = (config.negativeSpaceDepth ?? 50) / 100;
  const radius = config.cornerRadius || 0;

  let svgBody = "";

  switch (mode) {
    case "figure-ground": {
      // Figure-Ground Inversion (Rubin / FedEx Arrow effect)
      // Concept A serves as the outer container silhouette.
      // Concept B is subtracted from Concept A via SVG <mask>.
      svgBody = `
        <defs>
          <mask id="${maskId}">
            <!-- White reveals container -->
            <rect width="100" height="100" fill="#ffffff" rx="${radius}" ry="${radius}" />
            <g transform="translate(50,50) rotate(${rotA}) scale(${scaleA}) translate(-50,-50)">
              <path d="${conceptA.primaryPath}" fill="#ffffff" />
            </g>
            <!-- Black punches out negative space object B -->
            <g transform="translate(50,50) translate(${offX},${offY}) rotate(${rotB}) scale(${scaleB * depth * 0.9}) translate(-50,-50)">
              <path d="${conceptB.primaryPath}" fill="#000000" />
            </g>
          </mask>
        </defs>

        <!-- Base Background Glow / Secondary Base -->
        <rect width="100" height="100" fill="${palette.background}" rx="${radius}" ry="${radius}" />
        
        <!-- Negative space shape subtle underlay in secondary tone -->
        <g transform="translate(50,50) translate(${offX},${offY}) rotate(${rotB}) scale(${scaleB * depth * 0.9}) translate(-50,-50)" opacity="0.35">
          <path d="${conceptB.primaryPath}" fill="${palette.secondary}" />
        </g>

        <!-- Masked Primary Silhouette A with punched-out B -->
        <rect width="100" height="100" fill="${palette.primary}" mask="url(#${maskId})" />
        
        <!-- Accent focal node -->
        <circle cx="${50 + offX}" cy="${50 + offY}" r="1.5" fill="${palette.accent}" opacity="0.9" />
      `;
      break;
    }

    case "shared-contour": {
      // Morphological Hybrid: Both contours merge into one continuous form
      svgBody = `
        <defs>
          <linearGradient id="contour-grad-${uniqueId}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${palette.primary}" />
            <stop offset="60%" stop-color="${palette.accent}" />
            <stop offset="100%" stop-color="${palette.primary}" />
          </linearGradient>
        </defs>

        <rect width="100" height="100" fill="${palette.background}" rx="${radius}" ry="${radius}" />

        <!-- Concept A Contour Base -->
        <g transform="translate(50,50) rotate(${rotA}) scale(${scaleA * 0.9}) translate(-50,-50)">
          <path 
            d="${conceptA.primaryPath}" 
            fill="none" 
            stroke="${palette.secondary}" 
            stroke-width="${config.strokeWidth || 3}" 
            stroke-dasharray="2 3"
            stroke-linecap="round"
            stroke-linejoin="round"
            opacity="0.4"
          />
          <path 
            d="${conceptA.cutoutPath}" 
            fill="${palette.secondary}" 
            opacity="0.15"
          />
        </g>

        <!-- Merged Hero Hybrid Path with Glowing Shared Gradient -->
        <g transform="translate(50,50) translate(${offX},${offY}) rotate(${rotB}) scale(${scaleB * 0.95}) translate(-50,-50)">
          <path 
            d="${conceptB.primaryPath}" 
            fill="${palette.primary}" 
            fill-opacity="${0.85}"
            stroke="url(#contour-grad-${uniqueId})" 
            stroke-width="${config.strokeWidth || 2.5}" 
            stroke-linecap="round" 
            stroke-linejoin="round"
          />
        </g>
      `;
      break;
    }

    case "typographic": {
      // Letterform Concealment: A typographic glyph holds the conceptual cutout
      svgBody = `
        <defs>
          <mask id="${maskId}">
            <rect width="100" height="100" fill="#000000" />
            <!-- Massive Monumental Letterform Stem -->
            <path d="M22,15 L78,15 L78,32 L58,32 L58,85 L42,85 L42,32 L22,32 Z" fill="#ffffff" />
            <!-- Negative space punched into letter center -->
            <g transform="translate(50,50) translate(${offX},${offY}) rotate(${rotB}) scale(${scaleB * 0.55}) translate(-50,-50)">
              <path d="${conceptB.primaryPath}" fill="#000000" />
            </g>
          </mask>
        </defs>

        <rect width="100" height="100" fill="${palette.background}" rx="${radius}" ry="${radius}" />

        <!-- Outer Framing Box -->
        <rect x="5" y="5" width="90" height="90" fill="none" stroke="${palette.secondary}" stroke-width="0.75" opacity="0.4" />

        <!-- Typographic Monument with Negative cutout -->
        <rect width="100" height="100" fill="${palette.primary}" mask="url(#${maskId})" />

        <!-- Accent reveal indicator -->
        <g transform="translate(50,50) translate(${offX},${offY}) rotate(${rotB}) scale(${scaleB * 0.55}) translate(-50,-50)">
          <path d="${conceptA.cutoutPath}" fill="none" stroke="${palette.accent}" stroke-width="1.5" opacity="0.8" />
        </g>
      `;
      break;
    }

    case "juxtaposition":
    default: {
      // Surreal Replacement: Node swap
      svgBody = `
        <rect width="100" height="100" fill="${palette.background}" rx="${radius}" ry="${radius}" />

        <!-- Base Concept A Structure -->
        <g transform="translate(50,50) rotate(${rotA}) scale(${scaleA * 0.85}) translate(-50,-50)">
          <path d="${conceptA.primaryPath}" fill="${palette.secondary}" opacity="0.6" />
          <path d="${conceptA.primaryPath}" fill="none" stroke="${palette.text}" stroke-width="1.5" opacity="0.3" />
        </g>

        <!-- Surreal Node Replacement: Concept B glowing in the focal core -->
        <g transform="translate(50,50) translate(${offX},${offY}) rotate(${rotB}) scale(${scaleB * 0.55 * depth}) translate(-50,-50)">
          <path d="${conceptB.primaryPath}" fill="${palette.accent}" />
          <path d="${conceptB.cutoutPath}" fill="${palette.background}" opacity="0.85" />
        </g>
      `;
      break;
    }
  }

  return {
    viewBox: "0 0 100 100",
    svgContent: svgBody,
    maskId,
    clipId,
  };
}
