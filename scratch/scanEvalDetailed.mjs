import fs from "fs";
import path from "path";

function scanDirectory(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const full = path.join(dir, file.name);
    if (file.isDirectory()) {
      if (file.name !== "node_modules" && file.name !== ".git") {
        scanDirectory(full);
      }
    } else if (file.name.endsWith(".js") || file.name.endsWith(".mjs")) {
      const text = fs.readFileSync(full, "utf8");
      
      // Match eval( not preceded by a dot or property
      const evalCalls = text.match(/(?<![\.\w$])eval\s*\(/g);
      const newFuncCalls = text.match(/\bnew\s+Function\s*\(/g);
      
      if (evalCalls || newFuncCalls) {
        console.log(`[EVAL ALERT] in ${full}`);
        if (evalCalls) console.log(`  eval() count: ${evalCalls.length}`);
        if (newFuncCalls) console.log(`  new Function() count: ${newFuncCalls.length}`);
        
        // Show context
        let idx = 0;
        while ((idx = text.indexOf("eval(", idx + 1)) !== -1) {
          if (idx > 0 && text[idx - 1] !== ".") {
            console.log(`    Context around eval: ${text.substring(Math.max(0, idx - 50), Math.min(text.length, idx + 80))}`);
            break;
          }
        }
        idx = 0;
        while ((idx = text.indexOf("new Function(", idx + 1)) !== -1) {
          console.log(`    Context around new Function: ${text.substring(Math.max(0, idx - 50), Math.min(text.length, idx + 80))}`);
          break;
        }
      }
    }
  }
}

console.log("Scanning dist directory...");
if (fs.existsSync("C:\\Project\\ReplicateGitHubPortfolioSite-main\\dist")) {
  scanDirectory("C:\\Project\\ReplicateGitHubPortfolioSite-main\\dist");
}
console.log("Scan complete.");
