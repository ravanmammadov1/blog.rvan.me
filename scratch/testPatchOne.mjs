import { createClient } from "@sanity/client";

const token = "skqxIS8YhYqY9jyUT327FyNAY9f5Yfd5AyD7ZVBipyqRTNximGZyXws2YVj8Kohbxz0MTC61poqCOok5m";

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

const testBody = [
  createBlock("Why Do Your Eyes Look at Certain Things First?", "h2"),
  createBlock("Before you consciously decide to read a headline, analyze an image, or click a button, your visual cortex has already made hundreds of subconscious decisions. Within the first 50 milliseconds of landing on a webpage or viewing a poster, your brain processes spatial layout, luminance contrast, and dominant focal points. This is not accidental—it is the direct consequence of millions of years of evolutionary survival mechanisms applied to modern interface design."),
  createBlock("1. The 50-Millisecond Biological Filter", "h3"),
  createBlock("Human vision is not a camera that captures an entire scene with uniform clarity. Only the fovea centralis—a tiny 1.5mm region in the center of the retina—possesses the photoreceptor density required for sharp, high-resolution focus. Everything outside this narrow 2-degree cone is processed in low resolution by peripheral vision, tuned specifically to detect high contrast, motion, and sudden anomalies."),
  createBlock("When a user encounters a digital composition, their peripheral vision scans the canvas for contrast anchors. Elements with high luminance contrast, large physical scale, or human faces trigger immediate saccadic eye movements. Designers who understand this biological filter do not ask users to search; they command the subconscious eye to land on the primary focal point instantly."),
  createBlock("2. The Gutenberg Diagram and Western Reading Gravity", "h3"),
  createBlock("In cultures that read left-to-right and top-to-bottom, visual processing follows a predictable path termed Reading Gravity. First described by Gutenberg, this natural eye flow moves from the Primary Optical Area (top-left) diagonally across the page toward the Terminal Area (bottom-right)."),
  createBlock("When design elements align with reading gravity, cognitive friction drops to near zero. Placing critical value propositions in the top-left and primary calls-to-action (CTAs) in the terminal bottom-right creates a frictionless reading momentum that feels entirely natural to the reader."),
  createBlock("3. F-Patterns, Z-Patterns, and Visual Scanners", "h3"),
  createBlock("Pioneering eye-tracking research conducted by Nielsen Norman Group revealed that users rarely read web pages word-for-word. Instead, they scan in distinct geometric patterns:"),
  createBlock("• The F-Pattern: Common on text-dense editorial and documentation layouts. Users scan horizontally across the top headline, move down the left margin to read a shorter horizontal bar, and finally scan vertically down the left edge."),
  createBlock("• The Z-Pattern: Dominant on visual landing pages and promotional banners. The eye sweeps horizontally across the header, cuts diagonally across the central hero illustration, and completes its journey along the bottom CTA bar."),
  createBlock("4. The Six Levers of Visual Weight", "h3"),
  createBlock("To control the order in which information is digested, master designers manipulate six fundamental properties of visual weight:"),
  createBlock("1. Scale and Proportion: Larger elements command attention first, establishing the root node of the cognitive hierarchy."),
  createBlock("2. Luminance and Contrast: High-contrast elements against deep backgrounds trigger immediate retinal activation."),
  createBlock("3. Chromatic Isolation (The Von Restorff Effect): An accent color surrounded by neutral tones creates an unignorable anomaly."),
  createBlock("4. Spatial Proximity and Whitespace: Generous whitespace around an object isolates it, magnifying its perceived importance."),
  createBlock("5. Gaze Direction and Faces: Human beings are hardwired to look where other humans are looking. An image of a face gazing at a headline will reflexively cause the user to look at that exact headline."),
  createBlock("6. Depth and Layering: Drop shadows, z-index elevation, and blur gradients indicate priority in the third visual dimension."),
  createBlock("Conclusion: Designing for the Biological Eye", "h3"),
  createBlock("Mastering visual hierarchy is not about making headlines bigger or adding bright colors arbitrarily. It is about orchestrating an intentional visual journey where the viewer never has to wonder what to look at next. When hierarchy is executed with surgical precision, design ceases to be decoration and becomes effortless communication."),
];

const res = await client
  .patch("blog-visual-hierarchy-masterclass")
  .set({
    title: "Why Do Your Eyes Look at Certain Things First?",
    title_az: "Gözlərimiz Niyə İlk Olaraq Müəyyən Elementlərə Baxır?",
    category: "Design Psychology",
    category_az: "Dizayn Psixologiyası",
    excerpt: "The science of visual hierarchy: How human biology, evolutionary survival reflexes, and scanning patterns dictate where our attention lands in the first 50 milliseconds.",
    excerpt_az: "Vizual iyerarxiya elmi: İnsan biologiyası, təkamül refleksləri və skan etmə nümunələri ilk 50 millisaniyədə diqqətimizi necə idarə edir.",
    body: testBody,
    body_az: testBody,
    tags: ["Visual Hierarchy", "Design Psychology", "Eye Tracking", "UX Design", "Cognitive Science"],
    readTime: "8 min read",
    featured: true,
    publishDate: "2026-03-01",
    _updatedAt: new Date().toISOString(),
  })
  .commit();

console.log("SUCCESS! Updated doc:", res._id, "| Title:", res.title);
