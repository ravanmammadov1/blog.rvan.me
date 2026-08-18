import { UNIFIED_TEMPLATES } from "../src/app/components/tools/resumebuilder/resumeTypes";
import fs from "fs";

const previewFile = fs.readFileSync("C:\\Project\\ReplicateGitHubPortfolioSite-main\\src\\app\\components\\tools\\resumebuilder\\templates\\ResumePreview.tsx", "utf8");

console.log(`Unified templates count: ${UNIFIED_TEMPLATES.length}`);

let allMatched = true;
for (const t of UNIFIED_TEMPLATES) {
  const inPreview = previewFile.includes(`"${t.id}"`);
  console.log(`Template: [${t.id}] "${t.name}" -> In Preview Router: ${inPreview}`);
  if (!inPreview) {
    console.error(`  ❌ MISSING in ResumePreview: ${t.id}`);
    allMatched = false;
  }
}

if (allMatched) {
  console.log("✅ All template IDs are 100% consistent and accounted for!");
}
