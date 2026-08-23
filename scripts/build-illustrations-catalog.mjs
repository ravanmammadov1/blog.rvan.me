import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const undrawDir = path.join(projectRoot, "public", "illustrations", "undraw");
const outputFile = path.join(projectRoot, "src", "lib", "illustrationsIndex.json");

const files = fs.readdirSync(undrawDir).filter((f) => f.endsWith(".svg"));

function formatTitle(slug) {
  return slug
    .replace(/^undraw-/, "")
    .split("-")
    .map((word) => {
      const lower = word.toLowerCase();
      if (lower === "3d") return "3D";
      if (lower === "ai") return "AI";
      if (lower === "ui") return "UI";
      if (lower === "ux") return "UX";
      if (lower === "vr") return "VR";
      if (lower === "ar") return "AR";
      if (lower === "api") return "API";
      if (lower === "seo") return "SEO";
      if (lower === "pdf") return "PDF";
      if (lower === "iot") return "IoT";
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

function categorize(slug) {
  const s = slug.toLowerCase();
  if (
    s.includes("3d") ||
    s.includes("modeling") ||
    s.includes("render") ||
    s.includes("virtual-reality") ||
    s.includes("augmented-reality") ||
    s.includes("vr-") ||
    s.includes("hologram") ||
    s.includes("metaverse") ||
    s.includes("drone") ||
    s.includes("robot") ||
    s.includes("futuristic") ||
    s.includes("spaceman") ||
    s.includes("space") ||
    s.includes("alien") ||
    s.includes("floating")
  ) {
    return "3D / Modeling";
  }

  if (
    s.includes("abstract") ||
    s.includes("shapes") ||
    s.includes("pattern") ||
    s.includes("wireframe") ||
    s.includes("composition") ||
    s.includes("chaos") ||
    s.includes("void") ||
    s.includes("universe") ||
    s.includes("geometry") ||
    s.includes("elements") ||
    s.includes("concept") ||
    s.includes("grid") ||
    s.includes("dots") ||
    s.includes("curves") ||
    s.includes("layer") ||
    s.includes("blocks") ||
    s.includes("texture")
  ) {
    return "Abstract";
  }

  if (
    s.includes("chat") ||
    s.includes("message") ||
    s.includes("email") ||
    s.includes("mail") ||
    s.includes("call") ||
    s.includes("talk") ||
    s.includes("contact") ||
    s.includes("feedback") ||
    s.includes("speech") ||
    s.includes("conversation") ||
    s.includes("discussion") ||
    s.includes("forum") ||
    s.includes("newsletter") ||
    s.includes("support") ||
    s.includes("notification") ||
    s.includes("mention") ||
    s.includes("inbox") ||
    s.includes("dialogue") ||
    s.includes("voice") ||
    s.includes("audio") ||
    s.includes("broadcast") ||
    s.includes("signal") ||
    s.includes("connect")
  ) {
    return "Communication";
  }

  if (
    s.includes("market") ||
    s.includes("growth") ||
    s.includes("seo") ||
    s.includes("brand") ||
    s.includes("ad-") ||
    s.includes("ads") ||
    s.includes("campaign") ||
    s.includes("target") ||
    s.includes("conversion") ||
    s.includes("funnel") ||
    s.includes("social-media") ||
    s.includes("content") ||
    s.includes("traffic") ||
    s.includes("promotion") ||
    s.includes("launch") ||
    s.includes("sale") ||
    s.includes("discount") ||
    s.includes("influence") ||
    s.includes("audience") ||
    s.includes("viral") ||
    s.includes("trend") ||
    s.includes("ranking") ||
    s.includes("advertis") ||
    s.includes("publicity") ||
    s.includes("pr-") ||
    s.includes("banner")
  ) {
    return "Marketing";
  }

  if (
    s.includes("code") ||
    s.includes("dev") ||
    s.includes("tech") ||
    s.includes("server") ||
    s.includes("cloud") ||
    s.includes("api") ||
    s.includes("data") ||
    s.includes("cyber") ||
    s.includes("security") ||
    s.includes("ai-") ||
    s.includes("bot") ||
    s.includes("algorithm") ||
    s.includes("app") ||
    s.includes("mobile") ||
    s.includes("software") ||
    s.includes("hardware") ||
    s.includes("bug") ||
    s.includes("git") ||
    s.includes("database") ||
    s.includes("network") ||
    s.includes("programming") ||
    s.includes("encryption") ||
    s.includes("sync") ||
    s.includes("online") ||
    s.includes("internet") ||
    s.includes("digital") ||
    s.includes("web") ||
    s.includes("system") ||
    s.includes("computer") ||
    s.includes("file") ||
    s.includes("folder") ||
    s.includes("download") ||
    s.includes("upload") ||
    s.includes("analytics") ||
    s.includes("dashboard") ||
    s.includes("screen") ||
    s.includes("device") ||
    s.includes("browser") ||
    s.includes("login") ||
    s.includes("auth") ||
    s.includes("setup") ||
    s.includes("install") ||
    s.includes("hosting")
  ) {
    return "Technology";
  }

  if (
    s.includes("design") ||
    s.includes("creative") ||
    s.includes("art") ||
    s.includes("draw") ||
    s.includes("ui") ||
    s.includes("ux") ||
    s.includes("prototype") ||
    s.includes("color") ||
    s.includes("font") ||
    s.includes("type") ||
    s.includes("sketch") ||
    s.includes("palette") ||
    s.includes("vector") ||
    s.includes("canvas") ||
    s.includes("graphic") ||
    s.includes("studio") ||
    s.includes("photo") ||
    s.includes("image") ||
    s.includes("camera") ||
    s.includes("filter") ||
    s.includes("icon") ||
    s.includes("visual") ||
    s.includes("illustrat") ||
    s.includes("craft") ||
    s.includes("paint") ||
    s.includes("portfolio") ||
    s.includes("gallery") ||
    s.includes("animation") ||
    s.includes("motion")
  ) {
    return "Design & Creative";
  }

  if (
    s.includes("learn") ||
    s.includes("school") ||
    s.includes("study") ||
    s.includes("book") ||
    s.includes("educat") ||
    s.includes("read") ||
    s.includes("teacher") ||
    s.includes("student") ||
    s.includes("science") ||
    s.includes("research") ||
    s.includes("exam") ||
    s.includes("library") ||
    s.includes("knowledge") ||
    s.includes("course") ||
    s.includes("class") ||
    s.includes("degree") ||
    s.includes("quiz") ||
    s.includes("brain") ||
    s.includes("math") ||
    s.includes("certificate") ||
    s.includes("diploma") ||
    s.includes("academy") ||
    s.includes("professor") ||
    s.includes("lecture") ||
    s.includes("homework") ||
    s.includes("college") ||
    s.includes("university") ||
    s.includes("experiment") ||
    s.includes("lab")
  ) {
    return "Education";
  }

  if (
    s.includes("business") ||
    s.includes("startup") ||
    s.includes("finance") ||
    s.includes("invest") ||
    s.includes("money") ||
    s.includes("bank") ||
    s.includes("pay") ||
    s.includes("crypto") ||
    s.includes("wallet") ||
    s.includes("contract") ||
    s.includes("agreement") ||
    s.includes("presentation") ||
    s.includes("pitch") ||
    s.includes("strategy") ||
    s.includes("metrics") ||
    s.includes("profit") ||
    s.includes("revenue") ||
    s.includes("office") ||
    s.includes("workplace") ||
    s.includes("company") ||
    s.includes("deal") ||
    s.includes("e-commerce") ||
    s.includes("shopping") ||
    s.includes("order") ||
    s.includes("checkout") ||
    s.includes("invoice") ||
    s.includes("billing") ||
    s.includes("trade") ||
    s.includes("stock") ||
    s.includes("enterprise") ||
    s.includes("consulting") ||
    s.includes("card") ||
    s.includes("credit")
  ) {
    return "Business & Startup";
  }

  if (
    s.includes("people") ||
    s.includes("work") ||
    s.includes("team") ||
    s.includes("group") ||
    s.includes("user") ||
    s.includes("collab") ||
    s.includes("friend") ||
    s.includes("avatar") ||
    s.includes("person") ||
    s.includes("meeting") ||
    s.includes("interview") ||
    s.includes("hiring") ||
    s.includes("career") ||
    s.includes("resume") ||
    s.includes("manager") ||
    s.includes("freelanc") ||
    s.includes("remote") ||
    s.includes("job") ||
    s.includes("worker") ||
    s.includes("candidate") ||
    s.includes("profession") ||
    s.includes("leadership") ||
    s.includes("co-working") ||
    s.includes("woman") ||
    s.includes("man") ||
    s.includes("profile")
  ) {
    return "People & Work";
  }

  return "Lifestyle";
}

function generateTags(slug, category) {
  const words = slug.toLowerCase().split("-");
  const baseTags = new Set([...words]);

  if (category === "Design & Creative") {
    ["design", "creative", "ui", "ux", "vector", "art", "portfolio"].forEach((t) => baseTags.add(t));
  } else if (category === "Business & Startup") {
    ["business", "startup", "strategy", "presentation", "office", "finance"].forEach((t) => baseTags.add(t));
  } else if (category === "People & Work") {
    ["people", "work", "team", "collaboration", "office", "career"].forEach((t) => baseTags.add(t));
  } else if (category === "Technology") {
    ["technology", "tech", "software", "app", "digital", "cloud", "data"].forEach((t) => baseTags.add(t));
  } else if (category === "Marketing") {
    ["marketing", "growth", "brand", "strategy", "social media", "advertising"].forEach((t) => baseTags.add(t));
  } else if (category === "Education") {
    ["education", "learning", "knowledge", "study", "research", "books"].forEach((t) => baseTags.add(t));
  } else if (category === "Communication") {
    ["communication", "chat", "message", "support", "connect", "discussion"].forEach((t) => baseTags.add(t));
  } else if (category === "3D / Modeling") {
    ["3d", "modeling", "render", "vr", "future", "technology"].forEach((t) => baseTags.add(t));
  } else if (category === "Abstract") {
    ["abstract", "shapes", "concept", "modern", "minimal", "design"].forEach((t) => baseTags.add(t));
  } else {
    ["lifestyle", "daily", "modern", "people", "activity"].forEach((t) => baseTags.add(t));
  }

  return Array.from(baseTags).slice(0, 10);
}

const catalog = files.map((file) => {
  const slug = file.replace(".svg", "");
  const category = categorize(slug);
  const title = formatTitle(slug);
  const tags = generateTags(slug, category);

  return {
    id: `undraw-${slug}`,
    title,
    slug,
    collection: "unDraw",
    category,
    tags,
    format: "svg",
    src: `/illustrations/undraw/${file}`,
    author: "Katerina Limpitsouni",
    license: "unDraw Open License (Free for Commercial & Personal Use)",
    sourceUrl: "https://undraw.co/illustrations",
  };
});

fs.writeFileSync(outputFile, JSON.stringify(catalog, null, 2));
console.log(`✓ Successfully compiled ${catalog.length} illustrations to src/lib/illustrationsIndex.json`);
