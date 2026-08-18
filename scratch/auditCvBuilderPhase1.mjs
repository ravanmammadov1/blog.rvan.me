import fs from "fs";
import path from "path";

const rootDir = "C:\\Project\\ReplicateGitHubPortfolioSite-main\\src";

// 1. Search for eval, new Function, Function( in src
function searchFiles(dir, matchers) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== "node_modules" && entry.name !== ".git") {
        results.push(...searchFiles(fullPath, matchers));
      }
    } else if (/\.(tsx?|jsx?|mjs|cjs|html)$/.test(entry.name)) {
      const content = fs.readFileSync(fullPath, "utf8");
      for (const [key, regex] of Object.entries(matchers)) {
        let match;
        while ((match = regex.exec(content)) !== null) {
          const lines = content.slice(0, match.index).split("\n");
          results.push({
            type: key,
            file: fullPath.replace("C:\\Project\\ReplicateGitHubPortfolioSite-main\\", ""),
            line: lines.length,
            match: match[0],
            snippet: lines[lines.length - 1] + content.slice(match.index, match.index + 80).split("\n")[0]
          });
        }
      }
    }
  }
  return results;
}

const evalMatches = searchFiles(rootDir, {
  eval: /\beval\s*\(/g,
  newFunction: /\bnew\s+Function\s*\(/g,
  functionConstructor: /\bFunction\s*\([^)]*\)\s*\(/g,
  setTimeoutString: /\bsetTimeout\s*\(\s*["'`]/g,
  setIntervalString: /\bsetInterval\s*\(\s*["'`]/g,
});

console.log("=== EVAL / FUNCTION SEARCH RESULTS ===");
console.log(JSON.stringify(evalMatches, null, 2));

// 2. Search for inputs without id or name in resumebuilder
const rbDir = path.join(rootDir, "app", "components", "tools", "resumebuilder");
const inputMatches = searchFiles(rbDir, {
  inputTag: /<input\b[^>]*>/g,
  textareaTag: /<textarea\b[^>]*>/g,
  selectTag: /<select\b[^>]*>/g
});

console.log("\n=== FORM INPUTS IN RESUMEBUILDER ===");
for (const inp of inputMatches) {
  const tag = inp.match;
  const hasId = /\bid=["']/.test(tag);
  const hasName = /\bname=["']/.test(tag);
  if (!hasId || !hasName) {
    console.log(`[Missing id/name] ${inp.file}:${inp.line} -> hasId: ${hasId}, hasName: ${hasName}`);
    console.log(`   ${tag.slice(0, 100)}...`);
  }
}
