import fs from "fs";
import path from "path";

const root = "C:\\Project\\ReplicateGitHubPortfolioSite-main\\src";

function searchInFiles(dir, text) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== "node_modules" && entry.name !== ".git") {
        searchInFiles(fullPath, text);
      }
    } else if (/\.(tsx?|jsx?|html)$/.test(entry.name)) {
      const content = fs.readFileSync(fullPath, "utf8");
      if (content.toLowerCase().includes(text.toLowerCase())) {
        console.log(`Found "${text}" in: ${fullPath.replace(root, "")}`);
      }
    }
  }
}

searchInFiles(root, "Founder Biography");
searchInFiles(root, "Founder");
