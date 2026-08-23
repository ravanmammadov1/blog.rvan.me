import { createClient } from "@sanity/client";

const token = "skqxIS8YhYqY9jyUT327FyNAY9f5Yfd5AyD7ZVBipyqRTNximGZyXws2YVj8Kohbxz0MTC61poqCOok5m";

const client = createClient({
  projectId: "0lqwkcmg",
  dataset: "production",
  apiVersion: "2025-01-01",
  token: token,
  useCdn: false,
});

try {
  console.log("Testing Sanity Asset upload...");
  // Create a 1x1 png buffer or download a test image
  const res = await fetch("https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80");
  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const asset = await client.assets.upload("image", buffer, {
    filename: "test-visual-hierarchy-cover.webp",
    contentType: "image/webp",
  });

  console.log("SUCCESS! Real Sanity Asset created:", asset._id, "URL:", asset.url);
} catch (e) {
  console.error("Sanity asset upload error:", e);
}
