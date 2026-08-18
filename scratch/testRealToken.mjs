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
  console.log("Checking Sanity count...");
  const count = await client.fetch('count(*[_type == "blog"])');
  console.log("Total blogs count:", count);

  console.log("Testing patch on a blog document...");
  const patchRes = await client.patch("blog-visual-hierarchy-masterclass").set({
    _updatedAt: new Date().toISOString()
  }).commit();
  console.log("SUCCESS! Sanity write patch successful on:", patchRes._id);
} catch (e) {
  console.error("Sanity test error:", e);
}
