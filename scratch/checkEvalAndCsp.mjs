import fs from "fs";
import path from "path";

const root = "C:\\Project\\ReplicateGitHubPortfolioSite-main";

function searchEvalInDir(dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== ".git" && entry.name !== "node_modules") {
        results.push(...searchEvalInDir(fullPath));
      }
    } else if (/\.(html|ts|js|tsx|jsx|json)$/.test(entry.name)) {
      const content = fs.readFileSync(fullPath, "utf8");
      if (/\beval\s*\(/.test(content) || /\bnew\s+Function\s*\(/.test(content)) {
        results.push(fullPath.replace(root, ""));
      }
    }
  }
  return results;
}

console.log("Files containing eval / new Function:", searchEvalInDir(root));

// Check index.html CSP meta tag
const indexHtml = fs.readFileSync(path.join(root, "index.html"), "utf8");
console.log("\nIndex.html CSP check:");
const cspMatch = indexHtml.match(/<meta[^>]*http-equiv=["']Content-Security-Policy["'][^>]*>/i);
if (cspMatch) {
  console.log(cspMatch[0]);
} else {
  console.log("No CSP meta tag in index.html");
}
