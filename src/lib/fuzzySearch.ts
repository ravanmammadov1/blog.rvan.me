// Comprehensive Synonym Dictionary for Icon & Illustration Search Expansion
const SYNONYMS: Record<string, string[]> = {
  // Bell & Alert
  cowbell: ["bell", "alert", "notification", "ring", "chime"],
  bell: ["cowbell", "alert", "notification", "ring", "chime", "alarm"],
  alarm: ["bell", "clock", "timer", "alert", "notification"],

  // Mail & Communication
  mail: ["email", "envelope", "letter", "inbox", "message", "send", "post"],
  email: ["mail", "envelope", "letter", "inbox", "message", "send"],
  envelope: ["mail", "email", "letter", "inbox"],
  chat: ["message", "comment", "discussion", "talk", "bubble", "speech"],
  message: ["chat", "comment", "discussion", "mail", "inbox"],

  // Settings & Controls
  settings: ["setting", "config", "options", "cog", "gear", "preferences", "sliders", "tune"],
  setting: ["settings", "config", "options", "cog", "gear", "preferences"],
  gear: ["settings", "cog", "config", "engine", "options"],
  cog: ["gear", "settings", "config"],

  // Trash & Delete
  trash: ["delete", "bin", "garbage", "rubbish", "remove", "clean"],
  bin: ["trash", "delete", "garbage", "remove"],
  delete: ["trash", "bin", "remove", "cross"],

  // Edit & Pencil
  edit: ["pencil", "pen", "write", "modify", "draw", "change"],
  pencil: ["edit", "pen", "write", "modify", "draw"],
  pen: ["pencil", "edit", "write", "draw"],

  // Security & Lock
  lock: ["padlock", "security", "protect", "privacy", "safe", "vault", "shield"],
  security: ["lock", "shield", "protect", "cyber", "firewall", "safe"],
  shield: ["security", "protect", "lock", "defense", "badge"],

  // User & People
  user: ["person", "people", "profile", "account", "avatar", "human", "member"],
  person: ["user", "people", "profile", "account", "avatar"],
  profile: ["user", "person", "account", "avatar"],
  avatar: ["user", "profile", "person"],

  // Search & Find
  search: ["find", "lookup", "magnifier", "glass", "zoom", "inspect", "query"],
  find: ["search", "lookup", "magnifier"],

  // Heart & Favorite
  heart: ["like", "love", "favorite", "favourite", "wishlist"],
  like: ["heart", "love", "thumb", "favorite"],

  // Star & Rating
  star: ["favorite", "rating", "review", "bookmark", "award"],

  // Phone & Mobile
  phone: ["mobile", "cell", "call", "smartphone", "contact", "telephone"],
  mobile: ["phone", "cell", "smartphone", "app"],

  // Money & E-Commerce
  money: ["cash", "coin", "dollar", "currency", "price", "pay", "payment", "bank", "wealth"],
  cash: ["money", "coin", "dollar", "pay", "payment"],
  dollar: ["money", "cash", "currency", "price"],
  pay: ["payment", "money", "cash", "credit-card"],
  cart: ["shopping", "store", "buy", "shop", "ecommerce", "basket"],

  // Code & Tech
  code: ["dev", "developer", "programming", "script", "terminal", "brackets", "html", "css"],
  dev: ["code", "developer", "programming"],
  terminal: ["code", "console", "cli", "command"],

  // AI & Robot
  ai: ["bot", "robot", "brain", "intelligence", "sparkles", "neural"],
  robot: ["ai", "bot", "automaton"],
  sparkles: ["ai", "magic", "stars", "clean"],

  // Analytics & Data
  analytics: ["data", "chart", "graph", "metrics", "stats", "dashboard"],
  chart: ["analytics", "graph", "metrics", "data", "bar"],
};

// Levenshtein distance for fuzzy typo matching (1-2 character distance)
function levenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Smart Fuzzy & Synonym Matcher
 * Matches query against target string or array of tags:
 * 1. Exact / Substring Match
 * 2. Compound Word Partial Match (e.g. "cowbell" matching "bell")
 * 3. Synonym Dictionary Match (e.g. "cowbell" expanding to "bell", "notification")
 * 4. Typo Tolerance (Levenshtein distance <= 2 for queries with len >= 4)
 */
export function isFuzzyMatch(
  rawQuery: string,
  targetText: string,
  targetTags: string[] = []
): boolean {
  if (!rawQuery.trim()) return true;

  const q = rawQuery.trim().toLowerCase();
  const targetLower = targetText.toLowerCase();
  const allTargetTokens = [
    targetLower,
    ...targetTags.map((t) => t.toLowerCase()),
    ...targetLower.split(/[\s-_]+/),
  ];

  // 1. Direct Substring / Includes Check
  if (targetLower.includes(q)) return true;
  if (allTargetTokens.some((tok) => tok.includes(q) || q.includes(tok))) return true;

  // 2. Synonym Expansion Check
  const expandedSynonyms = SYNONYMS[q] || [];
  for (const syn of expandedSynonyms) {
    if (targetLower.includes(syn)) return true;
    if (allTargetTokens.some((tok) => tok.includes(syn))) return true;
  }

  // Also check if any word in query matches a synonym
  const queryWords = q.split(/[\s-_]+/);
  for (const qw of queryWords) {
    const syns = SYNONYMS[qw] || [];
    for (const syn of syns) {
      if (allTargetTokens.some((tok) => tok.includes(syn))) return true;
    }
  }

  // 3. Typo Tolerance via Levenshtein Distance (Allowed distance <= 2 for words >= 4 chars)
  if (q.length >= 3) {
    const maxAllowedDist = q.length <= 4 ? 1 : 2;
    for (const tok of allTargetTokens) {
      if (Math.abs(tok.length - q.length) <= maxAllowedDist) {
        const dist = levenshteinDistance(q, tok);
        if (dist <= maxAllowedDist) return true;
      }
    }
  }

  return false;
}
