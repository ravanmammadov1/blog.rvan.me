import { SemanticConcept, GestaltMode, SemioticReport } from "./types";

export function analyzeMetaphorSemiotics(
  conceptA: SemanticConcept,
  conceptB: SemanticConcept,
  mode: GestaltMode,
  depth: number
): SemioticReport {
  // Base calculations
  let baseClosureMs = 280; // milliseconds to mental closure
  let memorability = 88;
  let friction: "Low (Instant)" | "Optimal (Discovery)" | "High (Complex)" = "Optimal (Discovery)";

  switch (mode) {
    case "figure-ground":
      baseClosureMs = Math.round(220 + (100 - depth) * 2.5);
      memorability = 94;
      friction = baseClosureMs < 350 ? "Optimal (Discovery)" : "High (Complex)";
      break;
    case "shared-contour":
      baseClosureMs = Math.round(180 + (100 - depth) * 1.8);
      memorability = 91;
      friction = "Optimal (Discovery)";
      break;
    case "typographic":
      baseClosureMs = Math.round(140 + (100 - depth) * 1.2);
      memorability = 89;
      friction = "Low (Instant)";
      break;
    case "juxtaposition":
      baseClosureMs = Math.round(310 + (100 - depth) * 3);
      memorability = 96;
      friction = "Optimal (Discovery)";
      break;
  }

  const mechanismMap: Record<GestaltMode, { en: string; az: string }> = {
    "figure-ground": {
      en: `The visual cortex first decodes the outer silhouette of "${conceptA.symbolName}", then encounters a micro-second cognitive pause before discovering the nested negative silhouette of "${conceptB.symbolName}". This 'Aha!' moment triggers dopamine-driven long-term memory encoding.`,
      az: `Vizual qabıq əvvəlcə "${conceptA.symbolName_az}" silüetini qavrayır, ardınca mənfi boşluqdakı "${conceptB.symbolName_az}" formasını kəşf edir. Bu 'Evrika!' anı dopamin ifrazı ilə yaddaşda dərin iz buraxır.`,
    },
    "shared-contour": {
      en: `By merging the boundary vectors of "${conceptA.name}" and "${conceptB.name}" into a single continuous contour, cognitive resistance drops to near zero while visual intrigue remains exceptionally high.`,
      az: `"${conceptA.name_az}" və "${conceptB.name_az}" konturlarını vahid axıcı xəttə birləşdirərək, beyin üçün qavrayış müqavimətini minimuma endirir.`,
    },
    "typographic": {
      en: `Leverages the universal affordance of monumental letterforms, using internal counter-space to house the symbolic DNA of "${conceptB.symbolName}". Immediate dual readability on semantic and visual levels.`,
      az: `Monumental şrift anatomiyasının daxili boşluğundan istifadə edərək "${conceptB.symbolName_az}" simvolunu həm mətn, həm də vizual səviyyədə dərhal oxudur.`,
    },
    "juxtaposition": {
      en: `Replaces the expected anatomical core of "${conceptA.symbolName}" with "${conceptB.symbolName}", forcing the viewer to construct a conceptual bridge between disparate domains.`,
      az: `"${conceptA.symbolName_az}" strukturunun mərkəzi hissəsini "${conceptB.symbolName_az}" ilə əvəz edərək, izləyicini konseptual körpü qurmağa sövq edir.`,
    },
  };

  const critiqueMap: Record<GestaltMode, { en: string; az: string }> = {
    "figure-ground": {
      en: `Exceptional for high-end institutional branding, fintech, cybersecurity, and luxury goods where restraint and clever discovery communicate prestige.`,
      az: `Prestij və zəka aşılayan lüks brendinq, kiber-təhlükəsizlik və fintex həlləri üçün mükəmməl seçimdir.`,
    },
    "shared-contour": {
      en: `Ideal for sustainable tech, wellness, bio-computing, and creative platforms seeking natural fluidity and modern elegance.`,
      az: `Ekoloji texnologiyalar, bio-mühəndislik və müasir kreativ platformalar üçün idealdır.`,
    },
    "typographic": {
      en: `Dominates editorial magazine covers, publishing houses, cultural festivals, and poster design where typography is the primary hero.`,
      az: `Jurnal üz qapaqları, mədəniyyət festivalları və editoryal tipoqrafik plakatlar üçün əvəzolunmazdır.`,
    },
    "juxtaposition": {
      en: `High-impact conceptual advertising for campaigns (Apple, Heinz, The Economist) aimed at disrupting category expectations and driving viral memorability.`,
      az: `Apple və The Economist üslubunda yaddaqalan, viral reklam kampaniyaları və konseptual art-direksiya üçün idealdır.`,
    },
  };

  const industries = [
    "Fintech & Security",
    "Conceptual Advertising",
    "Luxury Packaging",
    "Editorial Publishing",
    "AI & Autonomous Systems",
    "Brand Identity & Logo Systems",
  ];

  return {
    primaryConcept: conceptA.name,
    secondaryConcept: conceptB.name,
    gestaltMode: mode,
    mentalClosureMs: baseClosureMs,
    memorabilityScore: memorability,
    cognitiveFriction: friction,
    cognitiveMechanism: mechanismMap[mode].en,
    cognitiveMechanism_az: mechanismMap[mode].az,
    artDirectionCritique: critiqueMap[mode].en,
    artDirectionCritique_az: critiqueMap[mode].az,
    suggestedIndustries: industries,
  };
}
