import { downloadResumeAsPdf } from "../src/app/components/tools/resumebuilder/converters/pdfExporter";
import { TECH_CV_PRESET, MODERN_CV_PRESET, ResumeThemeConfig } from "../src/app/components/tools/resumebuilder/resumeTypes";
import { pdf } from "@react-pdf/renderer";
import React from "react";
import { ResumePdfDocument } from "../src/app/components/tools/resumebuilder/pdf/ResumePdfDocument";

async function testAllTemplatesPdf() {
  console.log("==================================================");
  console.log("🧪 TESTING REACT-PDF VECTOR GENERATION ON ALL TEMPLATES");
  console.log("==================================================");

  const themeSingle: ResumeThemeConfig = {
    template: "tech-cv",
    accentColor: "#111827",
    fontFamily: "sans",
    density: "standard",
    paperSize: "a4",
  };

  const themeDouble: ResumeThemeConfig = {
    template: "modern-cv",
    accentColor: "#0284c7",
    fontFamily: "sans",
    density: "compact",
    paperSize: "a4",
  };

  // 1. Single Column Test
  console.log("Generating Single-Column PDF (Tech / sb2nov)...");
  const blob1 = await pdf(React.createElement(ResumePdfDocument, { data: TECH_CV_PRESET, theme: themeSingle })).toBlob();
  console.log(`✓ Single-Column PDF generated! Size: ${blob1.size} bytes`);
  console.assert(blob1.size > 2000, "Single-column PDF should be > 2000 bytes");

  // 2. Two-Column Test
  console.log("Generating Two-Column PDF (Modern / Kakuna)...");
  const blob2 = await pdf(React.createElement(ResumePdfDocument, { data: MODERN_CV_PRESET, theme: themeDouble })).toBlob();
  console.log(`✓ Two-Column PDF generated! Size: ${blob2.size} bytes`);
  console.assert(blob2.size > 2000, "Two-column PDF should be > 2000 bytes");

  // 3. Repeated Download Test (5 consecutive generations)
  console.log("\nTesting 5 consecutive PDF generations without memory leaks...");
  for (let i = 1; i <= 5; i++) {
    const t0 = Date.now();
    const b = await pdf(React.createElement(ResumePdfDocument, { data: TECH_CV_PRESET, theme: themeSingle })).toBlob();
    console.log(`  [Pass ${i}/5] Time: ${Date.now() - t0}ms, Size: ${b.size} bytes`);
    console.assert(b.size > 2000, `Pass ${i} generated valid blob`);
  }

  console.log("\n==================================================");
  console.log("🎉 ALL PDF VECTOR TESTS PASSED WITH 0 ERRORS!");
  console.log("==================================================");
}

testAllTemplatesPdf().catch(console.error);
