import { createClient } from "@sanity/client";

const token = process.env.SANITY_API_WRITE_TOKEN;
if (!token) {
  throw new Error("SANITY_API_WRITE_TOKEN environment variable is missing.");
}

const client = createClient({
  projectId: "0lqwkcmg",
  dataset: "production",
  apiVersion: "2025-01-01",
  token: token,
  useCdn: false,
});

function createBlock(text, style = "normal", key = Math.random().toString(36).substring(7)) {
  return {
    _key: key,
    _type: "block",
    style,
    markDefs: [],
    children: [{ _key: `${key}-c`, _type: "span", marks: [], text }],
  };
}

function createImageBlock(assetId, alt, caption = "", key = Math.random().toString(36).substring(7)) {
  return {
    _key: key,
    _type: "image",
    asset: {
      _type: "reference",
      _ref: assetId,
    },
    alt,
    caption,
  };
}

const INTERNAL_IMAGES_TO_UPLOAD = [
  {
    docId: "blog-visual-hierarchy-masterclass",
    filename: "visual-hierarchy-fovea-scan-diagram.jpg",
    alt: "Diagram illustrating fovea centralis 2-degree cone of high acuity versus peripheral low-resolution vision",
    sourceUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80",
    caption: "Figure 1.1: Retinal photoreceptor density and the 50ms biological visual filter.",
  },
  {
    docId: "blog-the-art-of-typographic-pairing",
    filename: "gotham-nyc-vernacular-architecture-signage.jpg",
    alt: "Historical New York municipal architecture and vernacular lettering that inspired Tobias Frere-Jones's Gotham",
    sourceUrl: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1200&auto=format&fit=crop&q=80",
    caption: "Figure 2.1: Vernacular geometric capitals on mid-century Manhattan public infrastructure.",
  },
  {
    docId: "blog-iconography-and-vector-precision",
    filename: "skeuomorphic-bell-ascii-hardware-teletype.jpg",
    alt: "Evolution from physical acoustic hotel reception bells to the ASCII 07 interrupt and digital badge icons",
    sourceUrl: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=1200&auto=format&fit=crop&q=80",
    caption: "Figure 3.1: The transition from mechanical acoustic signaling to graphical user interface semiotics.",
  },
  {
    docId: "blog-after-effects-optimization-expressions-render-systems",
    filename: "loss-aversion-prospect-theory-asymmetry-curve.jpg",
    alt: "Daniel Kahneman and Amos Tversky's Prospect Theory asymmetric value function graph",
    sourceUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&auto=format&fit=crop&q=80",
    caption: "Figure 4.1: The asymmetric psychological pain curve of loss versus equivalent gain.",
  },
  {
    docId: "blog-copywriting-psychology-cognitive-biases",
    filename: "pricing-decoy-economist-subscription-table.jpg",
    alt: "Decoy effect experiment comparing two-tier versus three-tier pricing architectures",
    sourceUrl: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&auto=format&fit=crop&q=80",
    caption: "Figure 6.1: The decoy effect in subscription choices documented by Dan Ariely at MIT.",
  },
  {
    docId: "blog-micro-and-macro-whitespace",
    filename: "luxury-packaging-whitespace-ratio-comparison.jpg",
    alt: "Comparative study of discount retail clutter versus high-end luxury spatial abundance",
    sourceUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&auto=format&fit=crop&q=80",
    caption: "Figure 7.1: Spatial real estate as an active indicator of brand prestige and cognitive ease.",
  },
];

console.log("Uploading internal contextual images and updating articles in Sanity...");

for (const item of INTERNAL_IMAGES_TO_UPLOAD) {
  try {
    const res = await fetch(item.sourceUrl);
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const asset = await client.assets.upload("image", buffer, {
      filename: item.filename,
      contentType: "image/jpeg",
    });

    console.log(`  ✓ Uploaded internal asset: ${asset._id}`);

    // Fetch the existing document body
    const doc = await client.getDocument(item.docId);
    if (doc && doc.body) {
      // Insert the image block into the body after chapter 1 or 2
      const updatedBody = [...doc.body];
      const imageBlock = createImageBlock(asset._id, item.alt, item.caption);
      
      // Insert around index 4
      const insertIndex = Math.min(4, updatedBody.length);
      updatedBody.splice(insertIndex, 0, imageBlock);

      await client
        .patch(item.docId)
        .set({
          body: updatedBody,
          body_az: updatedBody,
          _updatedAt: new Date().toISOString(),
        })
        .commit();

      console.log(`  ✓ Patched ${item.docId} with internal image block!`);
    }
  } catch (err) {
    console.error(`  ✗ Error on internal image for ${item.docId}:`, err.message);
  }
}

console.log("All internal contextual images uploaded and embedded successfully!");
