export interface IconItem {
  id: string;
  name: string;
  category: string;
  tags: string[];
  componentName: string;
}

export const ICON_CATEGORIES = [
  "All",
  "Interface & UI",
  "Arrows & Navigation",
  "Communication & Social",
  "Code & Development",
  "Media & Devices",
  "Files & Folders",
  "E-Commerce & Finance",
  "Design & Shapes",
  "Security & System",
] as const;

export type IconCategory = typeof ICON_CATEGORIES[number];

export const LUCIDE_ICON_CATALOG: IconItem[] = [
  // ── Interface & UI ──
  { id: "icon-search", name: "Search", category: "Interface & UI", componentName: "Search", tags: ["search", "find", "magnifying", "glass", "lookup", "query"] },
  { id: "icon-heart", name: "Heart", category: "Interface & UI", componentName: "Heart", tags: ["heart", "like", "love", "favorite", "bookmark"] },
  { id: "icon-user", name: "User", category: "Interface & UI", componentName: "User", tags: ["user", "person", "account", "profile", "avatar", "member"] },
  { id: "icon-users", name: "Users", category: "Interface & UI", componentName: "Users", tags: ["users", "group", "team", "people", "community"] },
  { id: "icon-settings", name: "Settings", category: "Interface & UI", componentName: "Settings", tags: ["settings", "cog", "gear", "options", "preferences", "config"] },
  { id: "icon-sliders", name: "Sliders", category: "Interface & UI", componentName: "Sliders", tags: ["sliders", "controls", "adjust", "filter", "settings"] },
  { id: "icon-sliders-horizontal", name: "SlidersHorizontal", category: "Interface & UI", componentName: "SlidersHorizontal", tags: ["sliders", "controls", "tune", "equalizer"] },
  { id: "icon-bell", name: "Bell", category: "Interface & UI", componentName: "Bell", tags: ["bell", "notification", "alert", "reminder", "ring"] },
  { id: "icon-bookmark", name: "Bookmark", category: "Interface & UI", componentName: "Bookmark", tags: ["bookmark", "save", "favorite", "ribbon", "tag"] },
  { id: "icon-calendar", name: "Calendar", category: "Interface & UI", componentName: "Calendar", tags: ["calendar", "date", "schedule", "event", "time"] },
  { id: "icon-clock", name: "Clock", category: "Interface & UI", componentName: "Clock", tags: ["clock", "time", "hour", "history", "recent", "watch"] },
  { id: "icon-check", name: "Check", category: "Interface & UI", componentName: "Check", tags: ["check", "tick", "confirm", "done", "success", "correct"] },
  { id: "icon-check-circle-2", name: "CheckCircle2", category: "Interface & UI", componentName: "CheckCircle2", tags: ["check", "circle", "success", "verified"] },
  { id: "icon-x", name: "X", category: "Interface & UI", componentName: "X", tags: ["x", "close", "cross", "cancel", "remove", "delete"] },
  { id: "icon-plus", name: "Plus", category: "Interface & UI", componentName: "Plus", tags: ["plus", "add", "create", "new", "more"] },
  { id: "icon-minus", name: "Minus", category: "Interface & UI", componentName: "Minus", tags: ["minus", "subtract", "remove", "less", "decrease"] },
  { id: "icon-eye", name: "Eye", category: "Interface & UI", componentName: "Eye", tags: ["eye", "view", "preview", "visible", "show"] },
  { id: "icon-eye-off", name: "EyeOff", category: "Interface & UI", componentName: "EyeOff", tags: ["eye", "off", "hidden", "hide", "private", "secret"] },
  { id: "icon-refresh-cw", name: "RefreshCw", category: "Interface & UI", componentName: "RefreshCw", tags: ["refresh", "rotate", "sync", "update", "reload"] },
  { id: "icon-sparkles", name: "Sparkles", category: "Interface & UI", componentName: "Sparkles", tags: ["sparkles", "stars", "ai", "magic", "clean", "shine"] },
  { id: "icon-star", name: "Star", category: "Interface & UI", componentName: "Star", tags: ["star", "rating", "favorite", "review", "score"] },
  { id: "icon-flame", name: "Flame", category: "Interface & UI", componentName: "Flame", tags: ["flame", "fire", "hot", "trending", "popular"] },

  // ── Arrows & Navigation ──
  { id: "icon-arrow-up-right", name: "ArrowUpRight", category: "Arrows & Navigation", componentName: "ArrowUpRight", tags: ["arrow", "up", "right", "external", "link", "goto"] },
  { id: "icon-arrow-right", name: "ArrowRight", category: "Arrows & Navigation", componentName: "ArrowRight", tags: ["arrow", "right", "forward", "next", "proceed"] },
  { id: "icon-arrow-left", name: "ArrowLeft", category: "Arrows & Navigation", componentName: "ArrowLeft", tags: ["arrow", "left", "back", "previous", "return"] },
  { id: "icon-arrow-up", name: "ArrowUp", category: "Arrows & Navigation", componentName: "ArrowUp", tags: ["arrow", "up", "top", "scroll"] },
  { id: "icon-arrow-down", name: "ArrowDown", category: "Arrows & Navigation", componentName: "ArrowDown", tags: ["arrow", "down", "bottom"] },
  { id: "icon-chevron-down", name: "ChevronDown", category: "Arrows & Navigation", componentName: "ChevronDown", tags: ["chevron", "down", "dropdown", "expand"] },
  { id: "icon-chevron-up", name: "ChevronUp", category: "Arrows & Navigation", componentName: "ChevronUp", tags: ["chevron", "up", "collapse"] },
  { id: "icon-chevron-right", name: "ChevronRight", category: "Arrows & Navigation", componentName: "ChevronRight", tags: ["chevron", "right", "next"] },
  { id: "icon-chevron-left", name: "ChevronLeft", category: "Arrows & Navigation", componentName: "ChevronLeft", tags: ["chevron", "left", "back"] },
  { id: "icon-compass", name: "Compass", category: "Arrows & Navigation", componentName: "Compass", tags: ["compass", "navigation", "explore", "direction", "location"] },
  { id: "icon-map-pin", name: "MapPin", category: "Arrows & Navigation", componentName: "MapPin", tags: ["map", "pin", "location", "place", "address", "marker"] },
  { id: "icon-external-link", name: "ExternalLink", category: "Arrows & Navigation", componentName: "ExternalLink", tags: ["external", "link", "open", "url", "redirect"] },

  // ── Communication & Social ──
  { id: "icon-mail", name: "Mail", category: "Communication & Social", componentName: "Mail", tags: ["mail", "email", "letter", "envelope", "contact", "message"] },
  { id: "icon-message-square", name: "MessageSquare", category: "Communication & Social", componentName: "MessageSquare", tags: ["message", "comment", "chat", "feedback", "talk"] },
  { id: "icon-send", name: "Send", category: "Communication & Social", componentName: "Send", tags: ["send", "submit", "paperplane", "post"] },
  { id: "icon-share-2", name: "Share2", category: "Communication & Social", componentName: "Share2", tags: ["share", "social", "export", "network"] },
  { id: "icon-globe", name: "Globe", category: "Communication & Social", componentName: "Globe", tags: ["globe", "world", "web", "internet", "language", "i18n"] },
  { id: "icon-phone", name: "Phone", category: "Communication & Social", componentName: "Phone", tags: ["phone", "call", "contact", "mobile"] },
  { id: "icon-thumbs-up", name: "ThumbsUp", category: "Communication & Social", componentName: "ThumbsUp", tags: ["thumbs", "up", "like", "agree", "vote"] },

  // ── Code & Development ──
  { id: "icon-code", name: "Code", category: "Code & Development", componentName: "Code", tags: ["code", "brackets", "developer", "html", "script"] },
  { id: "icon-terminal", name: "Terminal", category: "Code & Development", componentName: "Terminal", tags: ["terminal", "command", "cli", "shell", "console"] },
  { id: "icon-cpu", name: "Cpu", category: "Code & Development", componentName: "Cpu", tags: ["cpu", "chip", "processor", "hardware", "ai", "core"] },
  { id: "icon-database", name: "Database", category: "Code & Development", componentName: "Database", tags: ["database", "storage", "sql", "server", "data"] },
  { id: "icon-git-branch", name: "GitBranch", category: "Code & Development", componentName: "GitBranch", tags: ["git", "branch", "vcs", "code", "fork"] },
  { id: "icon-git-fork", name: "GitFork", category: "Code & Development", componentName: "GitFork", tags: ["git", "fork", "repository"] },
  { id: "icon-github", name: "Github", category: "Code & Development", componentName: "Github", tags: ["github", "git", "repo", "open-source"] },
  { id: "icon-layers", name: "Layers", category: "Code & Development", componentName: "Layers", tags: ["layers", "stack", "design", "components", "architecture"] },
  { id: "icon-package", name: "Package", category: "Code & Development", componentName: "Package", tags: ["package", "npm", "box", "library", "module"] },
  { id: "icon-workflow", name: "Workflow", category: "Code & Development", componentName: "Workflow", tags: ["workflow", "pipeline", "nodes", "automation"] },
  { id: "icon-zap", name: "Zap", category: "Code & Development", componentName: "Zap", tags: ["zap", "lightning", "fast", "speed", "power", "quick"] },

  // ── Media & Devices ──
  { id: "icon-monitor", name: "Monitor", category: "Media & Devices", componentName: "Monitor", tags: ["monitor", "desktop", "screen", "display"] },
  { id: "icon-smartphone", name: "Smartphone", category: "Media & Devices", componentName: "Smartphone", tags: ["smartphone", "mobile", "phone", "device"] },
  { id: "icon-laptop", name: "Laptop", category: "Media & Devices", componentName: "Laptop", tags: ["laptop", "computer", "notebook"] },
  { id: "icon-camera", name: "Camera", category: "Media & Devices", componentName: "Camera", tags: ["camera", "photo", "image", "picture", "snapshot"] },
  { id: "icon-image", name: "Image", category: "Media & Devices", componentName: "Image", tags: ["image", "picture", "photo", "media", "graphic"] },
  { id: "icon-video", name: "Video", category: "Media & Devices", componentName: "Video", tags: ["video", "movie", "film", "record", "clip"] },
  { id: "icon-music", name: "Music", category: "Media & Devices", componentName: "Music", tags: ["music", "audio", "song", "sound", "note"] },
  { id: "icon-mic", name: "Mic", category: "Media & Devices", componentName: "Mic", tags: ["mic", "microphone", "audio", "voice", "record"] },
  { id: "icon-volume-2", name: "Volume2", category: "Media & Devices", componentName: "Volume2", tags: ["volume", "sound", "speaker", "audio"] },

  // ── Files & Folders ──
  { id: "icon-file-text", name: "FileText", category: "Files & Folders", componentName: "FileText", tags: ["file", "text", "document", "paper", "page", "article"] },
  { id: "icon-folder", name: "Folder", category: "Files & Folders", componentName: "Folder", tags: ["folder", "directory", "files", "storage"] },
  { id: "icon-download", name: "Download", category: "Files & Folders", componentName: "Download", tags: ["download", "save", "export", "get", "arrow"] },
  { id: "icon-upload", name: "Upload", category: "Files & Folders", componentName: "Upload", tags: ["upload", "import", "publish"] },
  { id: "icon-copy", name: "Copy", category: "Files & Folders", componentName: "Copy", tags: ["copy", "duplicate", "clone", "clipboard"] },
  { id: "icon-edit-3", name: "Edit3", category: "Files & Folders", componentName: "Edit3", tags: ["edit", "pencil", "pen", "write", "modify"] },
  { id: "icon-trash-2", name: "Trash2", category: "Files & Folders", componentName: "Trash2", tags: ["trash", "delete", "remove", "bin"] },

  // ── E-Commerce & Finance ──
  { id: "icon-shopping-bag", name: "ShoppingBag", category: "E-Commerce & Finance", componentName: "ShoppingBag", tags: ["shopping", "bag", "store", "buy", "cart"] },
  { id: "icon-shopping-cart", name: "ShoppingCart", category: "E-Commerce & Finance", componentName: "ShoppingCart", tags: ["shopping", "cart", "store", "ecommerce", "trolley"] },
  { id: "icon-credit-card", name: "CreditCard", category: "E-Commerce & Finance", componentName: "CreditCard", tags: ["card", "payment", "credit", "bank", "money", "pay"] },
  { id: "icon-dollar-sign", name: "DollarSign", category: "E-Commerce & Finance", componentName: "DollarSign", tags: ["dollar", "money", "cash", "finance", "currency"] },
  { id: "icon-tag", name: "Tag", category: "E-Commerce & Finance", componentName: "Tag", tags: ["tag", "label", "price", "category", "badge"] },
  { id: "icon-percent", name: "Percent", category: "E-Commerce & Finance", componentName: "Percent", tags: ["percent", "discount", "offer", "sale"] },

  // ── Design & Shapes ──
  { id: "icon-palette", name: "Palette", category: "Design & Shapes", componentName: "Palette", tags: ["palette", "color", "paint", "art", "design", "theme"] },
  { id: "icon-type", name: "Type", category: "Design & Shapes", componentName: "Type", tags: ["type", "text", "font", "typography", "letter"] },
  { id: "icon-grid", name: "Grid", category: "Design & Shapes", componentName: "Grid", tags: ["grid", "layout", "columns", "spacing", "flex"] },
  { id: "icon-waves", name: "Waves", category: "Design & Shapes", componentName: "Waves", tags: ["waves", "svg", "water", "sound", "curve"] },
  { id: "icon-circle", name: "Circle", category: "Design & Shapes", componentName: "Circle", tags: ["circle", "shape", "round", "dot"] },
  { id: "icon-square", name: "Square", category: "Design & Shapes", componentName: "Square", tags: ["square", "shape", "box", "rectangle"] },
  { id: "icon-triangle", name: "Triangle", category: "Design & Shapes", componentName: "Triangle", tags: ["triangle", "shape", "delta"] },

  // ── Security & System ──
  { id: "icon-shield", name: "Shield", category: "Security & System", componentName: "Shield", tags: ["shield", "security", "protect", "guard", "safe"] },
  { id: "icon-shield-check", name: "ShieldCheck", category: "Security & System", componentName: "ShieldCheck", tags: ["shield", "check", "verified", "secure", "auth"] },
  { id: "icon-lock", name: "Lock", category: "Security & System", componentName: "Lock", tags: ["lock", "private", "secure", "password", "key"] },
  { id: "icon-unlock", name: "Unlock", category: "Security & System", componentName: "Unlock", tags: ["unlock", "open", "public", "access"] },
  { id: "icon-key", name: "Key", category: "Security & System", componentName: "Key", tags: ["key", "passcode", "access", "auth", "token"] },
  { id: "icon-alert-circle", name: "AlertCircle", category: "Security & System", componentName: "AlertCircle", tags: ["alert", "warning", "error", "info", "notice"] },
];

export function searchLucideIcons(
  query: string,
  activeCategory: string = "All"
): IconItem[] {
  let result = LUCIDE_ICON_CATALOG;

  if (activeCategory !== "All") {
    result = result.filter((item) => item.category === activeCategory);
  }

  if (query.trim()) {
    const q = query.toLowerCase();
    result = result.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.componentName.toLowerCase().includes(q) ||
        item.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }

  return result;
}
