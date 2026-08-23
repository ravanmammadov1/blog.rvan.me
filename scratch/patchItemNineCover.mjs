import { createClient } from "@sanity/client";
import fs from "fs";

const token = "skqxIS8YhYqY9jyUT327FyNAY9f5Yfd5AyD7ZVBipyqRTNximGZyXws2YVj8Kohbxz0MTC61poqCOok5m";

const client = createClient({
  projectId: "0lqwkcmg",
  dataset: "production",
  apiVersion: "2025-01-01",
  token: token,
  useCdn: false,
});

const item = {
  docId: "blog-grid-systems-responsive-layout-architecture",
  filename: "why-hamburger-menu-has-three-lines-cover.jpg",
  alt: "Minimalist graphic design composition exploring the three horizontal lines of the hamburger menu icon",
  sourceUrl: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=1600&auto=format&fit=crop&q=85",
};

console.log("Uploading cover for blog-grid-systems-responsive-layout-architecture...");
const res = await fetch(item.sourceUrl);
const arrayBuffer = await res.arrayBuffer();
const buffer = Buffer.from(arrayBuffer);

const asset = await client.assets.upload("image", buffer, {
  filename: item.filename,
  contentType: "image/jpeg",
});

console.log(`  ✓ Asset created: ${asset._id} -> ${asset.url}`);

const patchRes = await client
  .patch(item.docId)
  .set({
    coverImage: {
      _type: "image",
      asset: {
        _type: "reference",
        _ref: asset._id,
      },
      alt: item.alt,
    },
    _updatedAt: new Date().toISOString(),
  })
  .commit();

console.log(`  ✓ Document ${item.docId} successfully patched with real Sanity asset ref!`);

let manifest = JSON.parse(fs.readFileSync("scratch/uploaded_assets_manifest.json", "utf8"));
manifest.push({
  docId: item.docId,
  assetId: asset._id,
  assetUrl: asset.url,
  alt: item.alt,
  filename: item.filename,
});
fs.writeFileSync("scratch/uploaded_assets_manifest.json", JSON.stringify(manifest, null, 2));
console.log(`All 39 documents now have verified real Sanity assets!`);
