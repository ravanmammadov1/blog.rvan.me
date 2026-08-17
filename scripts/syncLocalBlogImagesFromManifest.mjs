import fs from "fs";

const manifest = JSON.parse(fs.readFileSync("scratch/uploaded_assets_manifest.json", "utf8"));
const map = new Map();
manifest.forEach(item => map.set(item.docId, item));

const files = [
  "src/lib/blogs/articles01to10.ts",
  "src/lib/blogs/articles11to20.ts",
  "src/lib/blogs/articles21to30.ts",
  "src/lib/blogs/articles31to39.ts",
];

for (const filePath of files) {
  let content = fs.readFileSync(filePath, "utf8");

  for (const [docId, item] of map.entries()) {
    if (content.includes(docId)) {
      // Replace the coverImage block or add it if missing
      const coverImageRegex = new RegExp(`(_id:\\s*"${docId}"[\\s\\S]*?coverImage:\\s*{)[^}]+(},\\s*alt:\\s*"[^"]*",\\s*url:\\s*"[^"]*")`, "g");
      
      // Let's replace the asset and url
      const targetPattern = new RegExp(`(_id:\\s*"${docId}"[\\s\\S]*?asset:\\s*{\\s*_type:\\s*"reference",\\s*_ref:\\s*)"[^"]+"(\\s*},\\s*alt:\\s*)"[^"]+"(,\\s*url:\\s*)"[^"]+"`, "g");
      
      if (targetPattern.test(content)) {
        content = content.replace(targetPattern, `$1"${item.assetId}"$2"${item.alt}"$3"${item.assetUrl}"`);
        console.log(`  ✓ Updated asset ref & url for ${docId} in ${filePath}`);
      }
    }
  }

  fs.writeFileSync(filePath, content, "utf8");
}

console.log("Local blog registry files updated with live Sanity asset references!");
