# Organic Growth Measurement & Optimization Framework

**Status**: ACTIVE & OPERATIONAL  
**Last Updated**: 2026-08-18  
**Architecture Reference**: [`ADR-014: Four Core Pillar Content Architecture & Organic Heuristic Acquisition`](file:///C:/Project/ReplicateGitHubPortfolioSite-main/AI/DECISIONS.md)

---

## 1. Analytics & Measurement Infrastructure Status

| System | Integration ID / Endpoint | Status | Capability / Scope |
| :--- | :--- | :--- | :--- |
| **Google Tag Manager** | `GTM-TX3NCK38` | Connected | First-party event pipeline, dataLayer dispatcher (consent-gated) |
| **Microsoft Clarity** | `xrujhevj2n` | Connected | Session heatmaps, user rage-click detection, perceptual scroll depth |
| **Vercel Analytics & Speed Insights** | Native Edge Middleware | Connected | Real User Monitoring (RUM), Core Web Vitals (LCP, INP, CLS) |
| **Google Search Console (GSC)** | REST API / Gateway | **UNAVAILABLE** | No API credentials/service account connected in this environment |

> [!NOTE]
> **Search Console Data Policy**: Since GSC is not directly authenticated via API in this build/runtime environment, Search Console data is explicitly marked as **UNAVAILABLE**. No ranking or query impression metrics are fabricated or simulated.

---

## 2. First-Party Product Event Schema (`src/lib/analytics/events.ts`)

All analytics events run through a centralized, consent-aware helper ([`events.ts`](file:///C:/Project/ReplicateGitHubPortfolioSite-main/src/lib/analytics/events.ts)).

### A. Tool Utility Events (`category: "tool_usage"`)
Triggered **only** when a real user interaction or calculation occurs within a flagship utility:
* `tool_ratio_selected`: User changes modular scale harmonic preset (e.g. Major Third 1.25).
* `tool_scale_adjusted`: User interacts with responsive viewport width slider.
* `tool_polarity_swapped`: User swaps foreground and background in APCA contrast workbench.
* `tool_preset_selected`: User tests accessible color preset pairings.
* `tool_tab_switched`: User inspects Typography Matrix, UI Specimen, or Design Tokens.
* `tool_mode_switched`: User switches Persuasion Analyzer between Headline, CTA, and Value Prop.
* `tool_preset_loaded`: User tests empirical copywriting exemplar transformations.

### B. Global Search Discovery (`category: "search_discovery"`)
Triggered during global keyboard command palette interactions (`Cmd+K`):
* `search_search_opened`: Search modal triggered.
* `search_result_selected`: User selects an entity. Metadata captured: `resultType` (`ARTICLE` | `TOOL` | `TOPIC` | `RESOURCE`), `targetPath`, and boolean `hasQuery`.

### C. Content & Ecosystem Bridge Navigation (`category: "content_navigation"`)
Triggered when user traverses topical bridges across essays, tools, and topic hubs:
* `content_bridge_click`: Captures `source_path`, `target_path`, and `bridge_type` (`tool` | `article` | `resource` | `topic`).

---

## 3. Strict Privacy & Consent Rules

1. **Zero Input Exfiltration**: User-entered text in the Persuasion Analyzer, Resume Builder personal details, and contact forms are **NEVER** recorded or sent to telemetry services.
2. **Consent-Gated Execution**: Telemetry scripts (GTM, Clarity, GA4) only execute after `cookie_consent.analytics === true` in `localStorage`.
3. **Aggregated Categorical Signals Only**: Analytics events record solely categorical state (e.g., `score_tier: "high"`, `ratio: "major-third"`), never the underlying user copy.

---

## 4. Content Performance & Conversion Model

```text
┌────────────────────────────────────────────────────────┐
│ 1. DISCOVERY (Organic Entry / Search Intent Match)      │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│ 2. ENGAGEMENT (Deep Read, Specimen Inspection, TOC)     │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│ 3. UTILITY (Interactive Tool Handoff & Value Delivery) │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│ 4. DEPTH (Cross-Hub, Font Specimen, Related Essay Flow) │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│ 5. RETURN (Bookmarked Utility / Repeat Direct Sessions) │
└────────────────────────────────────────────────────────┘
```

---

## 5. Evidence-Based Optimization Heuristics

When live GSC and analytics telemetry reports are reviewed, apply the following deterministic rules:

| Diagnostic Pattern | Root Cause | Prescribed Optimization Action |
| :--- | :--- | :--- |
| **High Impressions + Low CTR** | SERP snippet misalignment or weak headline hook | Refine `<title>` and `<meta name="description">` to explicitly address search intent without changing the URL. |
| **High CTR + Low Engagement (High Bounce)** | Above-the-fold content does not immediately deliver value | Streamline introductory section, elevate key takeaway/summary card above the fold, ensure mobile readability. |
| **High Engagement + Low Tool Usage** | Weak contextual bridge between theory and tool | Upgrade [`EcosystemBridgeCard.tsx`](file:///C:/Project/ReplicateGitHubPortfolioSite-main/src/app/components/blog/EcosystemBridgeCard.tsx) visual contrast and clarify the practical utility of the tool. |
| **High Tool Usage** | High user satisfaction with utility workbench | Add direct related resource discovery cards (e.g., Font Specimen or complementary essay recommendations) at the bottom of the tool. |
