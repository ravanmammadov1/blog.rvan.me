import fs from "fs";

const files = [
  "C:\\Project\\ReplicateGitHubPortfolioSite-main\\src\\app\\components\\tools\\OpenPeepsBuilder.tsx",
  "C:\\Project\\ReplicateGitHubPortfolioSite-main\\src\\app\\components\\tools\\ResumeBuilder.tsx",
  "C:\\Project\\ReplicateGitHubPortfolioSite-main\\src\\app\\components\\tools\\typography\\TypographyScaleCalculator.tsx",
  "C:\\Project\\ReplicateGitHubPortfolioSite-main\\src\\app\\components\\tools\\contrast\\ApcaContrastCalculator.tsx",
  "C:\\Project\\ReplicateGitHubPortfolioSite-main\\src\\app\\components\\tools\\persuasion\\PersuasionAnalyzer.tsx",
];

for (const f of files) {
  const content = fs.readFileSync(f, "utf8");
  const hasDefault = /export\s+default\b/.test(content);
  const namedExports = content.match(/export\s+(const|function|class)\s+([a-zA-Z0-9_]+)/g) || [];
  console.log(`File: ${f.split("\\").pop()}`);
  console.log(`  has default export: ${hasDefault}`);
  console.log(`  named exports: ${namedExports.join(", ")}`);
}
