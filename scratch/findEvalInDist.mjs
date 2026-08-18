import fs from "fs";
import path from "path";

const distDir = "C:\\Project\\ReplicateGitHubPortfolioSite-main\\dist\\assets";

if (fs.existsSync(distDir)) {
  const files = fs.readdirSync(distDir);
  for (const f of files) {
    if (f.endsWith(".js")) {
      const content = fs.readFileSync(path.join(distDir, f), "utf8");
      // Search for eval( or new Function( or Function(
      const evalMatches = content.match(/\b(eval|new Function|Function)\s*\(/g);
      if (evalMatches) {
        console.log(`File: ${f} has ${evalMatches.length} occurrences: ${evalMatches.slice(0, 5).join(", ")}`);
        
        // Find snippets
        let idx = 0;
        while ((idx = content.indexOf("eval(", idx + 1)) !== -1) {
          console.log(`  Snippet around eval: ${content.substring(Math.max(0, idx - 40), Math.min(content.length, idx + 60))}`);
          break;
        }
        idx = 0;
        while ((idx = content.indexOf("new Function(", idx + 1)) !== -1) {
          console.log(`  Snippet around new Function: ${content.substring(Math.max(0, idx - 40), Math.min(content.length, idx + 60))}`);
          break;
        }
      }
    }
  }
} else {
  console.log("dist/assets does not exist");
}
