import fs from "fs";
import path from "path";
import crypto from "crypto";

const ROOT = process.cwd();
const PUBLIC_ILLUSTRATIONS_DIR = path.join(ROOT, "public", "illustrations");
const OUTPUT_INDEX_PATH = path.join(ROOT, "src", "lib", "illustrationsIndex.json");

// Category keyword dictionary for smart automatic classification
const CATEGORY_RULES = [
  {
    category: "Marketing & Growth",
    keywords: ["market", "ad", "ads", "seo", "campaign", "viral", "email", "conversion", "funnel", "promote", "target", "growth", "influencer", "tweet", "social", "post", "broadcast", "audience", "brand", "sale", "deals"],
  },
  {
    category: "Tech & Coding",
    keywords: ["code", "coding", "developer", "program", "software", "api", "app", "bug", "server", "terminal", "database", "devops", "git", "deploy", "robot", "cyber", "computer", "algorithm", "source", "script", "hacker", "ide", "react", "vue", "web", "linux", "cloud", "stack", "mobile", "ios", "android", "device", "internet"],
  },
  {
    category: "Data & Analytics",
    keywords: ["analytics", "data", "chart", "graph", "metrics", "report", "stats", "statistics", "insight", "dashboard", "trend", "neural", "diagram", "tracking", "pie", "bar", "matrix", "analysis", "visualize"],
  },
  {
    category: "Finance & E-Commerce",
    keywords: ["finance", "payment", "card", "wallet", "money", "bank", "coin", "crypto", "bitcoin", "shop", "shopping", "store", "cart", "purchase", "order", "delivery", "invoice", "checkout", "ecommerce", "price", "transfer", "bill", "cash", "credit"],
  },
  {
    category: "Design & Creative",
    keywords: ["design", "designer", "creative", "art", "artist", "draw", "drawing", "paint", "sketch", "doodle", "wireframe", "prototype", "color", "palette", "visual", "motion", "photo", "camera", "graphic", "illustration", "ui", "ux", "typography", "font", "3d", "vector", "ballet", "groov", "music"],
  },
  {
    category: "Security & Cloud",
    keywords: ["security", "secure", "lock", "unlock", "key", "shield", "password", "protect", "vault", "auth", "authentication", "privacy", "guard", "firewall", "safe", "encrypt", "verify", "verified", "cloud", "hosting", "backup"],
  },
  {
    category: "Science & Education",
    keywords: ["science", "study", "studying", "learn", "learning", "book", "school", "student", "teacher", "teach", "physics", "math", "degree", "research", "quantum", "class", "exam", "grade", "read", "reading", "lecture", "university", "college", "atom", "molecule", "lab"],
  },
  {
    category: "Business & Startup",
    keywords: ["business", "startup", "office", "work", "working", "job", "career", "meeting", "pitch", "leader", "leadership", "strategy", "enterprise", "contract", "handshake", "company", "co-workers", "boss", "interview", "resume", "hiring", "deal", "success", "mission", "rocket", "launch", "mvp"],
  },
  {
    category: "People & Work",
    keywords: ["people", "person", "team", "together", "pair", "collaborate", "collaboration", "remote", "woman", "man", "avatar", "character", "user", "conversation", "chat", "friend", "friends", "crowd", "colleague", "talk", "discuss", "discussion", "community"],
  },
  {
    category: "Lifestyle & Wellness",
    keywords: ["coffee", "walk", "walking", "run", "running", "sprint", "outdoor", "sport", "yoga", "meditat", "health", "fitness", "travel", "traveling", "vacation", "summer", "winter", "nature", "food", "eat", "relax", "chill", "dog", "cat", "pet", "plant", "garden", "home", "sleep", "dance", "game", "play", "party"],
  },
];

function titleFromFilename(filename) {
  const base = path.basename(filename, path.extname(filename));
  // Replace hyphens, underscores, dots with space
  const words = base.replace(/[-_.]/g, " ").replace(/\s+/g, " ").trim().split(" ");
  return words
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

function slugFromFilename(filename) {
  return path.basename(filename, path.extname(filename)).toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function determineCategory(title, slug) {
  const text = (title + " " + slug).toLowerCase();

  for (const rule of CATEGORY_RULES) {
    for (const kw of rule.keywords) {
      if (text.includes(kw)) {
        return rule.category;
      }
    }
  }

  return "Business & Startup";
}

function generateTags(title, slug, category, collection) {
  const words = (title + " " + slug).toLowerCase().split(/[\s-_]+/);
  const stopWords = new Set(["a", "an", "the", "in", "on", "at", "to", "for", "of", "with", "by", "and", "or", "is", "svg", "undraw"]);
  const cleanWords = words.filter((w) => w.length > 2 && !stopWords.has(w));
  
  const categoryWords = category.toLowerCase().split(/[\s&]+/);
  const tagsSet = new Set([...cleanWords, ...categoryWords, collection.toLowerCase()]);
  return Array.from(tagsSet).slice(0, 8);
}

function computeFileHash(filePath) {
  const buffer = fs.readFileSync(filePath);
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

async function buildIllustrationLibrary() {
  console.log("=========================================");
  console.log("BUILDING OPEN-SOURCE ILLUSTRATION LIBRARY");
  console.log("=========================================");

  const collections = [
    {
      dir: path.join(PUBLIC_ILLUSTRATIONS_DIR, "undraw"),
      name: "unDraw",
      author: "Katerina Limpitsouni",
      license: "unDraw Open License (Free for Commercial & Personal)",
      sourceUrl: "https://undraw.co",
      prefix: "undraw",
      webSubpath: "/illustrations/undraw",
    },
    {
      dir: path.join(PUBLIC_ILLUSTRATIONS_DIR, "open-doodles"),
      name: "Open Doodles",
      author: "Pablo Stanley",
      license: "CC0 1.0 Universal Public Domain",
      sourceUrl: "https://opendoodles.com",
      prefix: "doodle",
      webSubpath: "/illustrations/open-doodles",
    },
  ];

  const seenHashes = new Set();
  const seenIds = new Set();
  const catalog = [];
  let totalScanned = 0;
  let duplicateCount = 0;

  const collectionCounts = {};
  const categoryCounts = {};

  for (const col of collections) {
    collectionCounts[col.name] = 0;
    if (!fs.existsSync(col.dir)) {
      console.warn(`Directory not found: ${col.dir}`);
      continue;
    }

    const files = fs.readdirSync(col.dir).filter((f) => f.endsWith(".svg"));
    console.log(`\nScanning collection: ${col.name} (${files.length} files found)`);

    for (const file of files) {
      totalScanned++;
      const filePath = path.join(col.dir, file);
      const hash = computeFileHash(filePath);

      // Check for duplicate content
      if (seenHashes.has(hash)) {
        duplicateCount++;
        continue;
      }
      seenHashes.add(hash);

      const title = titleFromFilename(file);
      let slug = slugFromFilename(file);
      let id = `${col.prefix}-${slug}`;

      // Guarantee unique ID
      if (seenIds.has(id)) {
        id = `${id}-${totalScanned}`;
      }
      seenIds.add(id);

      const category = determineCategory(title, slug);
      const tags = generateTags(title, slug, category, col.name);
      const src = `${col.webSubpath}/${file}`;

      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      collectionCounts[col.name]++;

      catalog.push({
        id,
        title,
        slug,
        collection: col.name,
        category,
        tags,
        format: "svg",
        src,
        author: col.author,
        license: col.license,
        sourceUrl: col.sourceUrl,
        hash,
      });
    }
  }

  // Sort catalog cleanly by title
  catalog.sort((a, b) => a.title.localeCompare(b.title));

  // Write output JSON
  fs.mkdirSync(path.dirname(OUTPUT_INDEX_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_INDEX_PATH, JSON.stringify(catalog, null, 2), "utf8");

  console.log("\n-----------------------------------------");
  console.log(`TOTAL SCANNED:      ${totalScanned}`);
  console.log(`DUPLICATES REMOVED: ${duplicateCount}`);
  console.log(`UNIQUE ASSETS:      ${catalog.length}`);
  console.log("-----------------------------------------");
  console.log("\nBy Collection:");
  for (const [colName, count] of Object.entries(collectionCounts)) {
    console.log(`  - ${colName.padEnd(20)}: ${count} assets`);
  }
  console.log("\nBy Category:");
  for (const [catName, count] of Object.entries(categoryCounts)) {
    console.log(`  - ${catName.padEnd(25)}: ${count} assets`);
  }
  console.log("-----------------------------------------");
  console.log(`✓ Output written to: ${OUTPUT_INDEX_PATH}`);
  console.log("=========================================\n");
}

buildIllustrationLibrary();
