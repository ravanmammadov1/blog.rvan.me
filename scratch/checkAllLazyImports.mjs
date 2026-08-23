import fs from "fs";
import path from "path";

const rootDir = "C:\\Project\\ReplicateGitHubPortfolioSite-main\\src\\app";

function checkLazyImportsInFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const lazyMatches = [...content.matchAll(/lazy\s*\(\s*\(\)\s*=>\s*import\s*\(\s*["']([^"']+)["']\s*\)\s*\)/g)];
  for (const match of lazyMatches) {
    const importPath = match[1];
    const fileDir = path.dirname(filePath);
    let resolvedPath = path.resolve(fileDir, importPath);
    if (!fs.existsSync(resolvedPath)) {
      if (fs.existsSync(resolvedPath + ".tsx")) resolvedPath += ".tsx";
      else if (fs.existsSync(resolvedPath + ".ts")) resolvedPath += ".ts";
      else if (fs.existsSync(resolvedPath + "/index.tsx")) resolvedPath += "/index.tsx";
      else if (fs.existsSync(resolvedPath + "/index.ts")) resolvedPath += "/index.ts";
    }

    if (fs.existsSync(resolvedPath)) {
      const targetContent = fs.readFileSync(resolvedPath, "utf8");
      const hasDefault = /export\s+default\b/.test(targetContent);
      console.log(`[${path.basename(filePath)}] lazy import("${importPath}") -> ${path.basename(resolvedPath)} | hasDefault: ${hasDefault}`);
      if (!hasDefault) {
        console.error(`  ❌ CRITICAL ERROR: ${resolvedPath} has NO default export!`);
      }
    } else {
      console.error(`  ❌ CANNOT RESOLVE: ${importPath} from ${filePath}`);
    }
  }
}

console.log("Checking App.tsx...");
checkLazyImportsInFile(path.join(rootDir, "App.tsx"));

console.log("\nChecking HomePage.tsx...");
checkLazyImportsInFile(path.join(rootDir, "HomePage.tsx"));

console.log("\nChecking ToolDetailPage.tsx...");
checkLazyImportsInFile(path.join(rootDir, "pages", "ToolDetailPage.tsx"));
