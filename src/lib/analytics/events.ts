/**
 * First-Party Product Analytics & Growth Measurement Engine
 * 
 * Provides privacy-first, consent-aware instrumentation for core user interactions,
 * tool utility, search discovery, and contextual ecosystem pathways.
 * 
 * Strict Privacy Rules:
 * 1. ZERO private user input, draft copy, or resume data is ever collected or dispatched.
 * 2. Only high-level interaction metadata and aggregated category signals are recorded.
 * 3. Events dispatch ONLY when analytics consent is verified in localStorage or window context.
 */

export interface AnalyticsEventPayload {
  eventName: string;
  category: "tool_usage" | "search_discovery" | "content_navigation";
  action: string;
  label?: string;
  value?: number;
  metadata?: Record<string, string | number | boolean>;
}

/**
 * Checks whether the visitor has granted analytics cookies/telemetry consent.
 */
function hasAnalyticsConsent(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const rawConsent = localStorage.getItem("cookie_consent");
    if (rawConsent) {
      const parsed = JSON.parse(rawConsent);
      return Boolean(parsed.analytics);
    }
  } catch {
    // If parsing fails, fail-safe to false
    return false;
  }
  return false;
}

/**
 * Dispatches a sanitized first-party analytics event to dataLayer and Microsoft Clarity.
 */
export function trackEvent({
  eventName,
  category,
  action,
  label,
  value,
  metadata = {},
}: AnalyticsEventPayload): void {
  if (typeof window === "undefined") return;
  if (!hasAnalyticsConsent()) return;

  // 1. Google Analytics 4 via gtag & dataLayer
  if (typeof (window as any).gtag === "function") {
    try {
      (window as any).gtag("event", eventName, {
        event_category: category,
        event_action: action,
        event_label: label,
        value: value,
        ...metadata,
      });
    } catch {}
  }

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({
      event: eventName,
      event_category: category,
      event_action: action,
      event_label: label,
      value: value,
      ...metadata,
      timestamp: Date.now(),
    });
  }

  // 2. Microsoft Clarity custom event tagging
  if (typeof window.clarity === "function") {
    try {
      window.clarity("event", eventName);
      if (label) {
        window.clarity("set", `${category}_${action}`, label);
      }
    } catch {
      // Non-blocking fail-safe
    }
  }
}

/**
 * Tracks verified flagship tool utility events (when user interacts with calculators/workbenches).
 */
export function trackToolUsage(
  toolId: "typography-scale" | "contrast-matrix" | "persuasion-analyzer" | "resume-builder" | "open-peeps",
  action: string,
  metadata: Record<string, string | number | boolean> = {}
): void {
  trackEvent({
    eventName: `tool_${action}`,
    category: "tool_usage",
    action: action,
    label: toolId,
    metadata: {
      tool_id: toolId,
      ...metadata,
    },
  });
}

/**
 * Tracks global ecosystem search discovery actions (Cmd+K).
 * Strict Privacy: Never stores raw user-entered query strings.
 * Only collects aggregate anonymous signals: queryLength, resultCount, hasQuery.
 */
export function trackSearchDiscovery(
  action: "search_opened" | "result_selected",
  metadata: {
    resultType?: "ARTICLE" | "TOOL" | "TOPIC" | "RESOURCE";
    targetPath?: string;
    hasQuery?: boolean;
    queryLength?: number;
    resultCount?: number;
  } = {}
): void {
  trackEvent({
    eventName: `search_${action}`,
    category: "search_discovery",
    action: action,
    label: metadata.resultType || "search",
    metadata: {
      has_query: Boolean(metadata.hasQuery),
      query_length: metadata.queryLength ?? 0,
      result_count: metadata.resultCount ?? 0,
      target_path: metadata.targetPath || "",
      result_type: metadata.resultType || "",
    },
  });
}

/**
 * Tracks cross-ecosystem navigation (e.g. Article -> Tool, Font -> Tool, Topic -> Article).
 */
export function trackContentBridgeClick(
  sourcePath: string,
  targetPath: string,
  bridgeType: "tool" | "article" | "resource" | "topic"
): void {
  trackEvent({
    eventName: "content_bridge_click",
    category: "content_navigation",
    action: "bridge_navigation",
    label: `${bridgeType}:${targetPath}`,
    metadata: {
      source_path: sourcePath,
      target_path: targetPath,
      bridge_type: bridgeType,
    },
  });
}
