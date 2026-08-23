import fs from "fs";
import path from "path";

function searchDir(dir, pattern) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const f of files) {
    const full = path.join(dir, f.name);
    if (f.isDirectory()) {
      if (f.name !== "node_modules" && f.name !== ".git" && f.name !== "dist") {
        searchDir(full, pattern);
      }
    } else if (f.name.endsWith(".tsx") || f.name.endsWith(".ts") || f.name.endsWith(".jsx") || f.name.endsWith(".js")) {
      const content = fs.readFileSync(full, "utf8");
      if (pattern.test(content)) {
        console.log(`Match in: ${full}`);
        const lines = content.split("\n");
        lines.forEach((l, idx) => {
          if (pattern.test(l)) {
            console.log(`  Line ${idx + 1}: ${l.trim()}`);
          }
        });
      }
    }
  }
}

console.log("--- SEARCHING FOR lazy( ---");
searchDir("C:\\Project\\ReplicateGitHubPortfolioSite-main\\src", /\blazy\s*\(/);

console.log("\n--- SEARCHING FOR dynamic import( in routes / tools ---");
searchDir("C:\\Project\\ReplicateGitHubPortfolioSite-main\\src", /import\s*\(/);
