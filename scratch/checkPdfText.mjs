import fs from "fs";

const pdfBuffer = fs.readFileSync("C:\\Project\\ReplicateGitHubPortfolioSite-main\\scratch\\Alex_Chen_CV.pdf");
const pdfText = pdfBuffer.toString("latin1");

console.log("PDF File Size:", pdfBuffer.length);
console.log("PDF Header:", pdfText.substring(0, 8));

// Check for standard PDF objects and strings
const keywords = [
  "Alex Chen",
  "Senior Full-Stack Engineer",
  "alex.chen@example.com",
  "Experience",
  "Education",
  "Skills",
  "Projects",
  "Stanford University",
  "TechCorp Systems"
];

console.log("\nSearching for resume text streams in generated PDF:");
for (const kw of keywords) {
  const found = pdfText.includes(kw);
  console.log(`- "${kw}": ${found ? "FOUND" : "NOT FOUND"}`);
}
