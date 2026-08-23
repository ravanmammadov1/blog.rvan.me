import React from "react";

/**
 * HeroAtmosphere
 * Clean, subtle architectural grid and fine geometric vector lines.
 * Strictly avoids blurred blobs, glowing halos, or decorative clutter to ensure pure editorial readability.
 */
export default function HeroAtmosphere() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* ── Precision hairline grid overlay ── */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(currentColor 1px, transparent 1px),
            linear-gradient(90deg, currentColor 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* ── Subtle diagonal architectural rule line ── */}
      <div
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(45deg, currentColor 1px, transparent 1px)`,
          backgroundSize: "160px 160px",
        }}
      />
    </div>
  );
}
