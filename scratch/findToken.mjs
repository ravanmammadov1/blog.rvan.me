import fs from "fs";
import path from "path";

function findInDir(dir, pattern) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === "node_modules" || file === ".git" || file === "dist") continue;
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      findInDir(full, pattern);
    } else {
      if (file.endsWith(".json") && file.includes("googleFonts")) continue;
      try {
        const content = fs.readFileSync(full, "utf8");
        if (content.includes("SANITY_API_WRITE_TOKEN") || content.includes("sk") && content.includes("0lqwkcmg")) {
          const lines = content.split("\n");
          lines.forEach((l, idx) => {
            if (l.includes("SANITY") || (l.includes("sk") && l.length > 20)) {
              console.log(`${full}:${idx + 1}: ${l.slice(0, 100)}`);
            }
          });
        }
      } catch (e) {}
    }
  }
}

findInDir(".", "SANITY");
