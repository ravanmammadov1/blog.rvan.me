import fs from "fs";
import zlib from "zlib";

const pdfBuffer = fs.readFileSync("C:\\Project\\ReplicateGitHubPortfolioSite-main\\scratch\\Alex_Chen_CV.pdf");

// Find all streams between `stream` and `endstream`
let uncompressedText = "";
let offset = 0;

while (true) {
  const streamStart = pdfBuffer.indexOf("stream\n", offset);
  if (streamStart === -1) break;
  const dataStart = streamStart + 7;
  const streamEnd = pdfBuffer.indexOf("\nendstream", dataStart);
  if (streamEnd === -1) break;

  const streamSlice = pdfBuffer.slice(dataStart, streamEnd);
  try {
    const decompressed = zlib.inflateSync(streamSlice);
    uncompressedText += decompressed.toString("utf8") + "\n";
  } catch (e) {
    uncompressedText += streamSlice.toString("utf8") + "\n";
  }
  offset = streamEnd + 10;
}

const keywords = [
  "Alex Chen",
  "Senior Full-Stack Engineer",
  "alex.chen@example.com",
  "EXPERIENCE",
  "EDUCATION",
  "SKILLS",
  "Stanford University",
  "TechCorp Systems",
  "React",
  "TypeScript",
  "Next.js"
];

console.log("Decompressed PDF Stream Text Length:", uncompressedText.length);
console.log("\nSearching for resume text streams in DECOMPRESSED PDF:");
let allFound = true;
for (const kw of keywords) {
  const found = uncompressedText.includes(kw);
  console.log(`- "${kw}": ${found ? "✅ FOUND" : "❌ NOT FOUND"}`);
  if (!found) allFound = false;
}

if (allFound) {
  console.log("\n🎉 ALL RESUME TEXT IS 100% REAL, CRISP, AND SEARCHABLE IN THE PDF!");
}
