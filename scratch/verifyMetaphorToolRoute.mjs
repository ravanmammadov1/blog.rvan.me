import fs from "fs";

const paths = [
  "dist/tools/visual-metaphor-canvas/index.html",
  "dist/az/tools/visual-metaphor-canvas/index.html",
];

for (const p of paths) {
  if (fs.existsSync(p)) {
    const html = fs.readFileSync(p, "utf8");
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i);
    console.log(`✓ Path: ${p}`);
    console.log(`  Title: ${titleMatch ? titleMatch[1] : "N/A"}`);
    console.log(`  Desc:  ${descMatch ? descMatch[1].slice(0, 80) : "N/A"}...`);
  } else {
    console.error(`✗ Missing: ${p}`);
  }
}
