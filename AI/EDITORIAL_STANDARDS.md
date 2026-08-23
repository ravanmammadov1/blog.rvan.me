# Rvan.me Editorial Quality Standards & Writing Philosophy

**Status**: ACTIVE & AUTHORITATIVE  
**Scope**: All editorial essays, pillar guides, and micro-studies across English and Azerbaijani publications.

---

## 1. Editorial Voice & Personality

The publication's voice must reflect the perspective of a seasoned art director, design systems engineer, and behavioral psychologist:

* **Intelligent & Curious**: Treats the reader as an ambitious, knowledgeable professional. Never talks down or explains basic definitions condescendingly.
* **Observant & Grounded**: Begins with real-world artifacts, typography specimens, product interfaces, and cultural phenomena rather than abstract theory.
* **Slightly Provocative**: Challenges superficial design trends, empty buzzwords, and cargo-cult design systems practices.
* **Concise & Rhythmic**: Every sentence must earn its place. Eliminates passive fluff, redundant transitional phrases, and filler paragraphs.

### Banned Generic Openings (Strictly Prohibited)
* ❌ *"Design plays a crucial role in modern digital experiences..."*
* ❌ *"In today's fast-paced digital world..."*
* ❌ *"Typography is an essential element of branding..."*
* ❌ *"Whether you're a designer, marketer, or developer..."*
* ❌ *"Understanding this concept can help optimize your conversions..."*

### Approved Hook Patterns
* ✅ **The Visual Contrast Hook**: *"Two buttons can use the exact same hex code `#0066FF` and feel completely different. The difference is the 12 pixels of surrounding padding and the font weight."*
* ✅ **The Historical Paradox Hook**: *"In 1957, a Swiss foundry set out to create a typeface with zero personality. Within twenty years, it became the visual signature of every corporate giant in North America."*
* ✅ **The Cognitive Conflict Hook**: *"Ask someone why they bought a luxury watch, and they will talk about craftsmanship. Put them in an fMRI scanner, and their brain lights up in regions associated with social status signaling."*

---

## 2. Article Structure Philosophy

Structure must serve the central thesis, not conform to a rigid SEO template. Choose the pattern that best unfolds the argument:

### Pattern A: The Perceptual Breakdown (Design Psychology & Visuals)
1. **Concrete Observation**: A surprising visual contrast or UI anomaly.
2. **Cognitive / Biological Mechanism**: How the human visual cortex or brain processes the stimulus.
3. **Real-World Case Study**: Concrete product teardown (e.g. Apple, Stripe, Linear, Figma).
4. **Actionable Design Rule**: Deterministic rules for layout, spacing, scale, or color.

### Pattern B: The Behavioral Economics Teardown (Marketing & Pricing)
1. **The Irrational User Action**: Why people make counterintuitive purchasing choices.
2. **The Underlying Heuristic**: Kahneman, Ariely, or Cialdini behavioral economics principle.
3. **Comparative Examples**: The broken execution vs. the high-converting execution.
4. **Practical Implementation**: Micro-copy rewrites, pricing table architecture, risk-reversal placement.

### Pattern C: The Historical & Semiotic Study (Typography & Icons)
1. **The Origin Story**: The engineering or cultural constraint that created the original artifact.
2. **Skeuomorphic Transition**: How the physical object transitioned into software GUI.
3. **Modern Relevance**: Why the metaphor endures or where modern design systems break it.
4. **Future Outlook**: How variable fonts or spatial interfaces are reshaping the convention.

---

## 3. Factual Rigor & Evidence Discipline

To maintain academic and professional credibility, all claims must be explicitly categorized:

```text
┌─────────────────────────────────────────────────────────┐
│ 1. ESTABLISHED RESEARCH (Peer-reviewed optical / cognitive findings) │
├─────────────────────────────────────────────────────────┤
│ 2. DESIGN SYSTEM HEURISTIC (Industry standard best practice)        │
├─────────────────────────────────────────────────────────┤
│ 3. EDITORIAL INTERPRETATION (Original critique / observation)       │
└─────────────────────────────────────────────────────────┘
```

* **Zero Fabricated Statistics**: Never invent percentages (e.g., *"increases conversion by 34.2%"*) or fabricate user research studies.
* **Attribution Integrity**: When referencing foundational research (Kahneman, Wertheimer, von Restorff, Weber-Fechner, APCA 0.98G), cite the core mechanism accurately.
* **Transparent Limitations**: Distinguish between strict legal standards (e.g., WCAG 2.1 AA) and perceptual ergonomic models (e.g., APCA).

---

## 4. Editorial Imagery & Conceptual Art Standards

Images are visual arguments, not decorative page fillers.

* **Conceptual Relevance**: Every cover image or inline visual must visually demonstrate the thesis (e.g., a type specimen composition for typography, a salience hierarchy diagram for visual attention).
* **Gemini Generation Criteria**:
  - Prefer clean, conceptual, high-contrast graphic art, isometric typography, and minimalist UI wireframe teardowns.
  - Reject generic AI clichés (glowing brains, floating holographic interfaces, robotic hands, meaningless neon spirals).
* **Technical Integrity**: High-resolution WebP format with descriptive, accessible `alt` text and responsive `srcset`.

---

## 5. SEO & Intent-First Optimization

1. **Search Intent Over Keyword Density**: Answer the reader's underlying question with unmatched depth and clarity.
2. **Title Crafting**:
   - Clear, punchy, high-CTR titles incorporating primary curiosity or problem triggers.
   - Format: `[Compelling Proposition or Question] — Rvan.me` or `[Topic]: [Specific Focus] — Rvan.me`.
3. **Meta Description Standards**:
   - Actionable 140–160 character summaries outlining the specific case studies, mechanisms, and tools covered.

---

## 6. Contextual Ecosystem Interlinking

Every essay must connect to the broader platform ecosystem without feeling forced:

* **Primary Anchor**: Link to the relevant **Topic Hub** (`/topics/typography`, `/topics/design-psychology`, `/topics/marketing-psychology`, `/topics/accessibility`).
* **Tool Workbench Handoff**: Connect theory to action via [`EcosystemBridgeCard.tsx`](file:///C:/Project/ReplicateGitHubPortfolioSite-main/src/app/components/blog/EcosystemBridgeCard.tsx) (`/tools/typography-scale`, `/tools/contrast-matrix`, `/tools/persuasion-analyzer`, `/tools/resume-builder`).
* **Related Deep Dives**: Provide 3–4 reciprocal curated links to sibling essays in the same topical cluster.

---

## 7. Content Quality Lifecycle Thresholds

| Decision | Criteria Threshold |
| :--- | :--- |
| **KEEP** | Score $\ge 7/10$ across quality, originality, and usefulness. Contains authentic observations, tight writing, and strong ecosystem relevance. |
| **REWRITE** | Strong topic or search intent ($S \ge 7$), but current writing quality ($W \le 6$) or depth ($Q \le 6$) suffers from generic AI summarization. Rebuild around real teardowns. |
| **DELETE** | Weak originality ($O \le 4$), low utility ($U \le 4$), and redundant thematic repetition. Prune to maintain high publication density. |
