// Pre-render all 33 Open Doodles SVGs at BUILD TIME into static strings
// so they can be used in the browser without ReactDOMServer
import fs from "fs/promises";
import path from "path";
import React from "react";
import ReactDOMServer from "react-dom/server";
import * as OpenDoodles from "react-open-doodles";

const PLACEHOLDER_ACCENT = "__ACCENT__";
const PLACEHOLDER_INK = "__INK__";

const DOODLE_KEYS = [
  "BalletDoodle", "BikiniDoodle", "ChillingDoodle", "ClumsyDoodle",
  "CoffeeDoodle", "DancingDoodle", "DogJumpDoodle", "DoggieDoodle",
  "FloatDoodle", "GroovyDoodle", "IceCreamDoodle", "JumpingDoodle",
  "LayingDoodle", "LevitateDoodle", "LovingDoodle", "MeditatingDoodle",
  "MoshingDoodle", "PettingDoodle", "PlantDoodle", "ReadingDoodle",
  "ReadingSideDoodle", "RollerSkatingDoodle", "RollingDoodle", "RunningDoodle",
  "SelfieDoodle", "SittingDoodle", "SittingReadingDoodle", "SleekDoodle",
  "SprintingDoodle", "StrollingDoodle", "SwingingDoodle", "UnboxingDoodle",
  "ZombieingDoodle",
];

// Render each doodle with unique placeholder strings, then at runtime
// we just do string.replace() — no ReactDOMServer needed in browser!
const svgTemplates = {};

for (const key of DOODLE_KEYS) {
  const Comp = OpenDoodles[key];
  if (!Comp) {
    console.warn(`Missing component: ${key}`);
    continue;
  }

  // Render with placeholder colors
  const markup = ReactDOMServer.renderToStaticMarkup(
    React.createElement(Comp, { accent: PLACEHOLDER_ACCENT, ink: PLACEHOLDER_INK })
  );

  svgTemplates[key] = markup;
  console.log(`  ✓ ${key} → ${markup.length} chars`);
}

console.log(`\nPre-rendered ${Object.keys(svgTemplates).length} Open Doodles SVGs!\n`);

// ── CATALOG: each doodle gets placed in multiple categories ──

const DOODLE_META = [
  { id: "LovingDoodle", name: "Loving", desc: "Big Heart Embrace", cats: ["People & Work", "Lifestyle & Wellness"] },
  { id: "MeditatingDoodle", name: "Meditating", desc: "Zen Mindfulness", cats: ["Lifestyle & Wellness", "People & Work"] },
  { id: "ReadingDoodle", name: "Reading", desc: "Immersed in Book", cats: ["Science & Education", "People & Work"] },
  { id: "ReadingSideDoodle", name: "Reading Side", desc: "Deep Focus Study", cats: ["Science & Education", "People & Work"] },
  { id: "SittingReadingDoodle", name: "Sitting Reading", desc: "Armchair Literature", cats: ["Science & Education", "Lifestyle & Wellness"] },
  { id: "SittingDoodle", name: "Sitting", desc: "Relaxed Chill Sitting", cats: ["People & Work", "Lifestyle & Wellness"] },
  { id: "CoffeeDoodle", name: "Coffee", desc: "Artisanal Coffee Break", cats: ["Lifestyle & Wellness", "People & Work"] },
  { id: "ChillingDoodle", name: "Chilling", desc: "Casual Workspace Chill", cats: ["People & Work", "Lifestyle & Wellness"] },
  { id: "LayingDoodle", name: "Laying", desc: "Laying on Floor Relaxing", cats: ["Tech & Coding", "Lifestyle & Wellness"] },
  { id: "RollerSkatingDoodle", name: "Roller Skating", desc: "Dynamic Roller Skater", cats: ["Lifestyle & Wellness", "Marketing & Growth"] },
  { id: "DancingDoodle", name: "Dancing", desc: "Spontaneous Dance", cats: ["Lifestyle & Wellness", "Design & Creative"] },
  { id: "GroovyDoodle", name: "Groovy", desc: "Groovy Beats & Music", cats: ["Design & Creative", "Lifestyle & Wellness"] },
  { id: "MoshingDoodle", name: "Moshing", desc: "High Energy Moshing", cats: ["Marketing & Growth", "Lifestyle & Wellness"] },
  { id: "JumpingDoodle", name: "Jumping", desc: "Triumphant Victory Jump", cats: ["Business & Startup", "Marketing & Growth"] },
  { id: "RunningDoodle", name: "Running", desc: "Agile Sprint to Goal", cats: ["Business & Startup", "Marketing & Growth"] },
  { id: "SprintingDoodle", name: "Sprinting", desc: "High Velocity Sprint", cats: ["Marketing & Growth", "Business & Startup"] },
  { id: "RollingDoodle", name: "Rolling", desc: "Playful Ground Rolling", cats: ["Design & Creative", "Lifestyle & Wellness"] },
  { id: "FloatDoodle", name: "Floating", desc: "Zero Gravity Cloud Float", cats: ["Security & Cloud", "Tech & Coding"] },
  { id: "LevitateDoodle", name: "Levitating", desc: "Spatial Metaverse Levitate", cats: ["Tech & Coding", "Security & Cloud"] },
  { id: "BalletDoodle", name: "Ballet", desc: "Precision Design Ballet", cats: ["Design & Creative", "People & Work"] },
  { id: "BikiniDoodle", name: "Bikini", desc: "Summer Beach Sunbathing", cats: ["Lifestyle & Wellness", "People & Work"] },
  { id: "ClumsyDoodle", name: "Clumsy", desc: "Debugging Error Handling", cats: ["Tech & Coding", "People & Work"] },
  { id: "DoggieDoodle", name: "Doggie", desc: "Walking Companion Dog", cats: ["Lifestyle & Wellness", "People & Work"] },
  { id: "DogJumpDoodle", name: "Dog Jump", desc: "Enthusiastic Dog Hug", cats: ["People & Work", "Lifestyle & Wellness"] },
  { id: "PettingDoodle", name: "Petting", desc: "Petting Furry Friend", cats: ["People & Work", "Lifestyle & Wellness"] },
  { id: "PlantDoodle", name: "Plant", desc: "Watering Houseplant Growth", cats: ["Lifestyle & Wellness", "Business & Startup"] },
  { id: "IceCreamDoodle", name: "Ice Cream", desc: "Delightful Customer Treat", cats: ["Finance & E-Commerce", "Lifestyle & Wellness"] },
  { id: "SelfieDoodle", name: "Selfie", desc: "Social Media Selfie Moment", cats: ["Marketing & Growth", "People & Work"] },
  { id: "SleekDoodle", name: "Sleek", desc: "Sleek Executive Pitch", cats: ["Business & Startup", "People & Work"] },
  { id: "StrollingDoodle", name: "Strolling", desc: "Casual Urban Stroll", cats: ["Finance & E-Commerce", "Lifestyle & Wellness"] },
  { id: "SwingingDoodle", name: "Swinging", desc: "Workplace Balance Swing", cats: ["People & Work", "Lifestyle & Wellness"] },
  { id: "UnboxingDoodle", name: "Unboxing", desc: "Delivery Unboxing", cats: ["Finance & E-Commerce", "Marketing & Growth"] },
  { id: "ZombieingDoodle", name: "Zombieing", desc: "Late Night Coding Sentry", cats: ["Tech & Coding", "People & Work"] },
];

const CONTEXTS = [
  "Core Scene", "Startup MVP", "Enterprise Workflow", "Creative Studio",
  "Remote Team", "SaaS Showcase", "Mobile First", "Community Spirit",
  "Growth Engine", "Deep Work", "Innovation Lab", "Digital Transform",
  "Customer Delight", "Agile Sprint", "Future Vision",
];

const ALL_CATEGORIES = [
  "Tech & Coding", "Design & Creative", "Business & Startup", "Data & Analytics",
  "Security & Cloud", "People & Work", "Finance & E-Commerce", "Marketing & Growth",
  "Science & Education", "Lifestyle & Wellness",
];

const catalogItems = [];

// For each doodle, create entries across its categories and contexts
DOODLE_META.forEach((doodle) => {
  // Place in its natural categories
  doodle.cats.forEach((cat) => {
    CONTEXTS.forEach((ctx, ctxIdx) => {
      const id = `${doodle.id.toLowerCase()}-${cat.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${ctx.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
      catalogItems.push({
        id,
        title: `${doodle.desc} — ${ctx}`,
        category: cat,
        tags: ["open-doodles", doodle.name.toLowerCase(), cat.toLowerCase(), ctx.toLowerCase().replace(/ /g, "-"), "hand-drawn", "vector", "sketch"],
        doodleKey: doodle.id,
      });
    });
  });

  // Also place in extra categories for broader coverage
  ALL_CATEGORIES.forEach((cat) => {
    if (!doodle.cats.includes(cat)) {
      // Pick a subset of contexts for cross-category entries
      const subset = CONTEXTS.filter((_, i) => (i + doodle.id.length) % 4 === 0);
      subset.forEach((ctx) => {
        const id = `${doodle.id.toLowerCase()}-${cat.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${ctx.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
        catalogItems.push({
          id,
          title: `${doodle.desc} — ${ctx}`,
          category: cat,
          tags: ["open-doodles", doodle.name.toLowerCase(), cat.toLowerCase(), ctx.toLowerCase().replace(/ /g, "-"), "hand-drawn", "vector"],
          doodleKey: doodle.id,
        });
      });
    }
  });
});

console.log(`Total catalog entries: ${catalogItems.length}`);

// ── Write two output files ──

// 1. Pre-rendered SVG templates (static strings with placeholder colors)
const svgFileContent = `// AUTO-GENERATED: Pre-rendered Open Doodles SVG templates
// DO NOT EDIT — run \`node scripts/build-illustrations-catalog.mjs\` to regenerate

export const OPEN_DOODLE_SVGS: Record<string, string> = ${JSON.stringify(svgTemplates, null, 2)};
`;

await fs.writeFile(
  path.join(process.cwd(), "src/lib/openDoodleSvgs.ts"),
  svgFileContent,
  "utf8"
);
console.log("✓ Wrote src/lib/openDoodleSvgs.ts (pre-rendered SVG templates)");

// 2. Catalog metadata
const catalogFileContent = `// AUTO-GENERATED: Open Doodles Illustration Catalog
// DO NOT EDIT — run \`node scripts/build-illustrations-catalog.mjs\` to regenerate

export interface RawIllustrationItem {
  id: string;
  title: string;
  category: string;
  tags: string[];
  doodleKey: string;
}

export const RAW_ILLUSTRATION_CATALOG: RawIllustrationItem[] = ${JSON.stringify(catalogItems, null, 2)};
`;

await fs.writeFile(
  path.join(process.cwd(), "src/lib/illustrationCatalog.ts"),
  catalogFileContent,
  "utf8"
);
console.log("✓ Wrote src/lib/illustrationCatalog.ts (catalog metadata)");

console.log("\n🎉 Done! Both files generated successfully.");
