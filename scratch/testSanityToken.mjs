import fs from "fs";
import { createClient } from "@sanity/client";

// Read token manually from .env.production.local
const envContent = fs.readFileSync(".env.production.local", "utf8");
let token = "";
for (const line of envContent.split("\n")) {
  if (line.startsWith("SANITY_API_WRITE_TOKEN=")) {
    token = line.split("=")[1].trim().replace(/^["']|["']$/g, "");
  }
}

console.log("Found token:", !!token, "Length:", token.length);

const client = createClient({
  projectId: "0lqwkcmg",
  dataset: "production",
  apiVersion: "2025-01-01",
  token: token,
  useCdn: false,
});

try {
  const result = await client.fetch('count(*[_type == "blog"])');
  console.log("Sanity read test count:", result);

  // Test write permissions with a dummy patch on a test doc or fetch user
  console.log("Testing write permissions...");
  const patchTest = await client.patch("blog-visual-hierarchy-masterclass").set({
    _updatedAt: new Date().toISOString()
  }).commit();
  console.log("Write success! Updated doc:", patchTest._id);
} catch (e) {
  console.error("Sanity error:", e);
}
