/**
 * MARKETING & PERSUASION HEURISTIC ANALYSIS ENGINE
 * 
 * Deterministic cognitive psychology and conversion copywriting analyzer.
 * Evaluates headlines, value propositions, and CTA buttons across 8 core
 * psychological and linguistic dimensions without external AI black-boxes.
 */

export type CopyType = "headline" | "cta" | "value_prop";

export interface TriggerDetail {
  en: string;
  az: string;
}

export interface PersuasionDimension {
  id: string;
  name: string;
  name_az: string;
  score: number; // 0 to 100
  status: "strong" | "moderate" | "weak";
  summary: string;
  summary_az: string;
  positives: TriggerDetail[];
  improvements: TriggerDetail[];
  detectedTriggers: string[];
}

export interface ActionableSuggestion {
  id: string;
  category: string;
  category_az: string;
  tip: string;
  tip_az: string;
  example: string;
}

export interface PersuasionAnalysis {
  copyType: CopyType;
  inputText: string;
  wordCount: number;
  charCount: number;
  readingTimeSec: number;
  overallScore: number;
  ratingTier: {
    level: "exceptional" | "strong" | "promising" | "needs_work" | "weak";
    label: string;
    label_az: string;
    badgeColor: string;
    description: string;
    description_az: string;
  };
  dimensions: PersuasionDimension[];
  suggestions: ActionableSuggestion[];
  powerWordsDetected: string[];
  frictionWordsDetected: string[];
  vagueWordsDetected: string[];
  pronounBalance: {
    secondPersonCount: number; // you, your
    firstPersonCount: number; // we, our, i, my
    ratioLabel: string;
    isUserCentric: boolean;
  };
}

// Heuristic Dictionaries (English + Azerbaijani roots)
const POWER_WORDS_EN = [
  "proven", "instant", "guaranteed", "effortless", "discover", "unlock", "transform",
  "amplify", "master", "scale", "accelerate", "eliminate", "secret", "free", "launch",
  "maximize", "outperform", "simplify", "elevate", "boost", "dominate", "automated",
  "seamless", "convert", "captivate", "command", "breakthrough", "precision", "exact",
  "definitive", "complete", "streamline", "unlimited", "rock-solid", "fast", "speed"
];

const POWER_WORDS_AZ = [
  "sübut", "anında", "zəmanətli", "zəhmətsiz", "kəşf", "kilidi aç", "dəyiş", "çoxalt",
  "usta", "miqyas", "sürətləndir", "aradan qaldır", "sirr", "pulsuz", "başlat",
  "maksimallaşdır", "üstələ", "sadələşdir", "yüksəlt", "artır", "avtomatlaşdırılmış",
  "çevir", "dəqiq", "tam", "limitsiz", "sürətli"
];

const FRICTION_WORDS_EN = [
  "submit", "register", "fill out", "mandatory", "pay now", "sign contract", "obligation",
  "purchase", "terms apply", "difficult", "process", "wait", "form", "provide details",
  "credit card required", "lengthy", "complex", "costly", "expensive"
];

const FRICTION_WORDS_AZ = [
  "təsdiq et", "qeydiyyatdan keç", "doldur", "məcburi", "indi ödə", "müqavilə", "öhdəlik",
  "al", "şərtlər", "çətin", "proses", "gözlə", "forma", "kart tələb olunur", "baha"
];

const VAGUE_FLUFF_EN = [
  "best", "amazing", "great", "revolutionary", "world-class", "cutting-edge", "ultimate",
  "very", "extremely", "incredible", "super", "unique", "modern", "top-tier", "leading",
  "innovative", "game-changing", "miraculous", "unbelievable", "nice", "good"
];

const VAGUE_FLUFF_AZ = [
  "ən yaxşı", "möhtəşəm", "əla", "inqilabi", "dünya səviyyəli", "son model", "son dərəcə",
  "inanılmaz", "super", "unikal", "müasir", "lider", "innovativ", "yaxşı"
];

const SOCIAL_PROOF_TRIGGERS_EN = [
  "trusted by", "rated", "stars", "reviews", "teams", "companies", "designers", "engineers",
  "developers", "founders", "customers", "users", "community", "backed by", "verified",
  "award-winning", "featured on", "5-star", "recommended by"
];

const SOCIAL_PROOF_TRIGGERS_AZ = [
  "etibar edir", "reytinq", "ulduz", "rəy", "komandalar", "şirkətlər", "dizaynerlər",
  "mühəndislər", "təsisçilər", "müştərilər", "istifadəçilər", "təsdiqlənmiş", "mükafatlı"
];

const RISK_REVERSAL_TRIGGERS_EN = [
  "no credit card", "free forever", "cancel anytime", "money-back", "30-day", "14-day",
  "zero risk", "guarantee", "100% refund", "no commitment", "free trial", "no strings",
  "secure", "gdpr", "privacy-first", "open-source"
];

const RISK_REVERSAL_TRIGGERS_AZ = [
  "kart tələb olunmur", "həmişə pulsuz", "istənilən vaxt ləğv", "pulun geri qaytarılması",
  "risksiz", "zəmanət", "öhdəliksiz", "pulsuz sınaq", "təhlükəsiz", "açıq mənbəli"
];

const URGENCY_TRIGGERS_EN = [
  "today", "now", "limited", "expires", "closes", "last chance", "spots left", "instant access",
  "ending soon", "only", "deadline", "before it's gone", "immediate", "hurry"
];

const URGENCY_TRIGGERS_AZ = [
  "bu gün", "indi", "məhdud", "bitir", "son şans", "yer qaldı", "dərhal", "tezliklə",
  "tələsin", "təcili"
];

/**
 * Tokenizes text into lowercase words while preserving numbers and symbols.
 */
export function tokenizeText(text: string): string[] {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^\w\s\d$€%+-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 0);
}

/**
 * Deterministic analysis engine calculating persuasion score across 8 dimensions.
 */
export function analyzePersuasion(text: string, type: CopyType = "headline"): PersuasionAnalysis {
  const cleanText = (text || "").trim();
  const tokens = tokenizeText(cleanText);
  const wordCount = tokens.length;
  const charCount = cleanText.length;
  const readingTimeSec = Math.max(1, Math.round(wordCount / 3.5)); // ~210 words/min

  if (wordCount === 0) {
    return createEmptyAnalysis(type);
  }

  const lowerText = cleanText.toLowerCase();

  // 1. Trigger word matching
  const powerWords = [...POWER_WORDS_EN, ...POWER_WORDS_AZ].filter((pw) =>
    lowerText.includes(pw)
  );
  const frictionWords = [...FRICTION_WORDS_EN, ...FRICTION_WORDS_AZ].filter((fw) =>
    lowerText.includes(fw)
  );
  const vagueWords = [...VAGUE_FLUFF_EN, ...VAGUE_FLUFF_AZ].filter((vw) =>
    lowerText.includes(vw)
  );
  const socialProofTriggers = [...SOCIAL_PROOF_TRIGGERS_EN, ...SOCIAL_PROOF_TRIGGERS_AZ].filter((sp) =>
    lowerText.includes(sp)
  );
  const riskReversalTriggers = [...RISK_REVERSAL_TRIGGERS_EN, ...RISK_REVERSAL_TRIGGERS_AZ].filter((rr) =>
    lowerText.includes(rr)
  );
  const urgencyTriggers = [...URGENCY_TRIGGERS_EN, ...URGENCY_TRIGGERS_AZ].filter((ug) =>
    lowerText.includes(ug)
  );

  // 2. Pronoun & Perspective Analysis (You-centric vs We-centric)
  const youCount = tokens.filter((t) => ["you", "your", "yours", "yourself", "sən", "sənin", "siz", "sizin"].includes(t)).length;
  const weCount = tokens.filter((t) => ["we", "our", "ours", "us", "i", "my", "mine", "biz", "bizim", "mən", "mənim"].includes(t)).length;
  const isUserCentric = youCount >= weCount && youCount > 0;
  const pronounRatioLabel = `${youCount} You/Your vs ${weCount} We/Our`;

  // 3. Dimension 1: Clarity & Cognitive Load (0-100)
  let clarityScore = 80;
  const clarityPositives: TriggerDetail[] = [];
  const clarityImprovements: TriggerDetail[] = [];

  if (type === "headline") {
    if (wordCount >= 6 && wordCount <= 12) {
      clarityScore += 20;
      clarityPositives.push({
        en: `Optimal headline length (${wordCount} words) maximizes cognitive retention.`,
        az: `Optimal başlıq uzunluğu (${wordCount} söz) oxucu yaddaşını maksimum dərəcədə saxlayır.`
      });
    } else if (wordCount < 4) {
      clarityScore -= 25;
      clarityImprovements.push({
        en: "Headline is too brief (<4 words). May lack sufficient context or premise.",
        az: "Başlıq həddən artıq qısadır (4 sözdən az). Məzmun konteksti çatışmaya bilər."
      });
    } else if (wordCount > 15) {
      clarityScore -= 25;
      clarityImprovements.push({
        en: "Headline exceeds 15 words. High risk of visual fatigue on mobile screens.",
        az: "Başlıq 15 sözü keçir. Mobil ekranlarda oxucu yorğunluğu riski yüksəkdir."
      });
    }
  } else if (type === "cta") {
    if (wordCount >= 2 && wordCount <= 5) {
      clarityScore += 20;
      clarityPositives.push({
        en: `High-impact CTA length (${wordCount} words). Swift cognitive processing.`,
        az: `Yüksək təsirli CTA uzunluğu (${wordCount} söz). Dərhal dərk olunur.`
      });
    } else if (wordCount === 1) {
      clarityScore -= 10;
      clarityImprovements.push({
        en: "Single-word button. Adding a clear outcome verb boosts click intent.",
        az: "Tək sözlü düymə. Konkret fəaliyyət feli əlavə etmək klik niyyətini artırır."
      });
    } else if (wordCount > 6) {
      clarityScore -= 30;
      clarityImprovements.push({
        en: "CTA is too wordy (>6 words). Buttons should trigger instant action.",
        az: "CTA çox uzundur (6 sözdən çox). Düymələr dərhal qərar verməyə çağırmalıdır."
      });
    }
  } else {
    // Value prop
    if (wordCount >= 12 && wordCount <= 35) {
      clarityScore += 20;
      clarityPositives.push({
        en: `Balanced value proposition scope (${wordCount} words).`,
        az: `Balanslaşdırılmış dəyər təklifi həcmi (${wordCount} söz).`
      });
    } else if (wordCount < 8) {
      clarityScore -= 20;
      clarityImprovements.push({
        en: "Value proposition is sparse. Clarify the core transformation or mechanism.",
        az: "Dəyər təklifi çox qısadır. Əsas nəticəni və mexanizmi dəqiqləşdirin."
      });
    }
  }

  // 4. Dimension 2: Specificity & Concreteness (0-100)
  let specificityScore = 40;
  const specPositives: TriggerDetail[] = [];
  const specImprovements: TriggerDetail[] = [];

  const numberMatches = cleanText.match(/\d+(\.\d+)?%?|\$\d+/g) || [];
  if (numberMatches.length > 0) {
    specificityScore += Math.min(35, numberMatches.length * 20);
    specPositives.push({
      en: `Concrete metrics detected (${numberMatches.join(", ")}). Numbers build instant empirical credibility.`,
      az: `Konkret göstəricilər aşkar edildi (${numberMatches.join(", ")}). Rəqəmlər empirik etibarlılıq yaradır.`
    });
  } else {
    specImprovements.push({
      en: "No quantifiable metrics found. Adding numbers, timeframes, or exact outputs increases trust.",
      az: "Rəqəmsal göstərici tapılmadı. Rəqəm, vaxt və ya konkret nəticə əlavə etmək inamı artırır."
    });
  }

  if (vagueWords.length > 0) {
    specificityScore -= Math.min(30, vagueWords.length * 15);
    specImprovements.push({
      en: `Vague fluff words detected: "${vagueWords.join('", "')}". Replace empty superlatives with concrete proof.`,
      az: `Qeyri-müəyyən tərif sözləri: "${vagueWords.join('", "')}". Şişirdilmiş sözləri real sübutla əvəzləyin.`
    });
  } else {
    specificityScore += 15;
    specPositives.push({
      en: "Zero vague buzzwords detected. Clean, grounded terminology.",
      az: "Boş reklam sözləri aşkarlanmadı. Təmiz və aydın terminologiya."
    });
  }

  // 5. Dimension 3: Value Proposition & Customer-Centricity (0-100)
  let valueScore = 50;
  const valuePositives: TriggerDetail[] = [];
  const valueImprovements: TriggerDetail[] = [];

  if (youCount > 0) {
    valueScore += Math.min(30, youCount * 15);
    valuePositives.push({
      en: `Customer-centric focus with ${youCount} direct references ("you/your").`,
      az: `Müştəriyə yönəlik yanaşma: ${youCount} birbaşa müraciət ("siz/sizin").`
    });
  }

  if (weCount > youCount && weCount > 1) {
    valueScore -= 25;
    valueImprovements.push({
      en: 'Self-focused framing ("We/Our"). Shift the spotlight to what the user gains.',
      az: 'Özünə yönəlik ifadələr ("Biz/Bizim"). Diqqəti istifadəçinin qazancına yönəldin.'
    });
  }

  if (powerWords.length > 0) {
    valueScore += Math.min(25, powerWords.length * 10);
    valuePositives.push({
      en: `High-potency outcome verbs detected: "${powerWords.slice(0, 3).join('", "')}".`,
      az: `Güclü nəticə felləri: "${powerWords.slice(0, 3).join('", "')}".`
    });
  } else {
    valueImprovements.push({
      en: "Lacks transformative action verbs. Use verbs like 'accelerate', 'eliminate', 'master', or 'scale'.",
      az: "Təsirli fəaliyyət felləri çatışmır. 'Sürətləndir', 'sadələşdir', 'çoxalt' kimi fellərdən istifadə edin."
    });
  }

  // 6. Dimension 4: Risk Reversal & Friction Reduction (0-100)
  let frictionScore = 70;
  const frictionPositives: TriggerDetail[] = [];
  const frictionImprovements: TriggerDetail[] = [];

  if (riskReversalTriggers.length > 0) {
    frictionScore += 25;
    frictionPositives.push({
      en: `Clear risk reversal present: "${riskReversalTriggers.join('", "')}". Lowers psychological barrier to entry.`,
      az: `Risk azaldıcı zəmanət: "${riskReversalTriggers.join('", "')}". Qərar vermə baryerini azaldır.`
    });
  } else if (type === "cta") {
    frictionScore -= 20;
    frictionImprovements.push({
      en: "No risk reversal micro-copy (e.g. 'No credit card required', 'Free 14-day trial').",
      az: "Riski azaldan kiçik qeyd yoxdur (məsələn, 'Kart tələb olunmur', 'Tamamilə pulsuz')."
    });
  }

  if (frictionWords.length > 0) {
    frictionScore -= Math.min(35, frictionWords.length * 20);
    frictionImprovements.push({
      en: `High-friction words detected: "${frictionWords.join('", "')}". Signals effort, cost, or commitment.`,
      az: `Yüksək psixoloji müqavimət sözləri: "${frictionWords.join('", "')}". Zəhmət və ya öhdəlik hissi yaradır.`
    });
  } else {
    frictionPositives.push({
      en: "Zero high-friction triggers (e.g. 'submit', 'mandatory', 'pay now').",
      az: "Müqavimət yaradan sözlər yoxdur."
    });
  }

  // 7. Dimension 5: Urgency & Momentum (0-100)
  let urgencyScore = 40;
  const urgencyPositives: TriggerDetail[] = [];
  const urgencyImprovements: TriggerDetail[] = [];

  if (urgencyTriggers.length > 0) {
    urgencyScore += Math.min(45, urgencyTriggers.length * 25);
    urgencyPositives.push({
      en: `Legitimate urgency trigger detected: "${urgencyTriggers.join('", "')}". Encourages immediate action.`,
      az: `Vaxt həssaslığı tətikləyicisi: "${urgencyTriggers.join('", "')}". Dərhal hərəkətə keçməyə təşviq edir.`
    });
  } else {
    urgencyImprovements.push({
      en: "No temporal urgency or momentum. Consider adding a natural timeline or 'instant' trigger.",
      az: "Zaman həssaslığı yoxdur. Təbii zaman həddi və ya 'anında' kimi sözlər əlavə etməyi nəzərdən keçirin."
    });
  }

  // 8. Dimension 6: Social Proof & Credibility (0-100)
  let socialProofScore = 35;
  const proofPositives: TriggerDetail[] = [];
  const proofImprovements: TriggerDetail[] = [];

  if (socialProofTriggers.length > 0) {
    socialProofScore += Math.min(50, socialProofTriggers.length * 30);
    proofPositives.push({
      en: `Social validation markers found: "${socialProofTriggers.join('", "')}".`,
      az: `Sosial sübut göstəriciləri: "${socialProofTriggers.join('", "')}".`
    });
  } else {
    proofImprovements.push({
      en: "No social proof markers (user counts, ratings, client logos, peer endorsements).",
      az: "Sosial sübut yoxdur (istifadəçi sayı, ulduz reytinqi, şirkət adları)."
    });
  }

  // Clamp dimension scores
  const clamp = (val: number) => Math.max(10, Math.min(100, Math.round(val)));

  const finalClarity = clamp(clarityScore);
  const finalSpec = clamp(specificityScore);
  const finalValue = clamp(valueScore);
  const finalFriction = clamp(frictionScore);
  const finalUrgency = clamp(urgencyScore);
  const finalProof = clamp(socialProofScore);

  const getStatus = (score: number): "strong" | "moderate" | "weak" => {
    if (score >= 75) return "strong";
    if (score >= 50) return "moderate";
    return "weak";
  };

  const dimensions: PersuasionDimension[] = [
    {
      id: "clarity",
      name: "Clarity & Cognitive Load",
      name_az: "Aydınlıq və Koqnitiv Yük",
      score: finalClarity,
      status: getStatus(finalClarity),
      summary: finalClarity >= 75 ? "Direct, digestible message structure." : "Contains friction points affecting instant comprehension.",
      summary_az: finalClarity >= 75 ? "Aydın və dərhal anlaşılan mətn strukturu." : "Dərhal başa düşülməyə mane olan nöqtələr var.",
      positives: clarityPositives,
      improvements: clarityImprovements,
      detectedTriggers: []
    },
    {
      id: "specificity",
      name: "Specificity & Concreteness",
      name_az: "Konkretlik və Dəqiqlik",
      score: finalSpec,
      status: getStatus(finalSpec),
      summary: finalSpec >= 70 ? "Grounded with verifiable metrics or concrete terms." : "Relies on generic generalizations rather than measurable outcomes.",
      summary_az: finalSpec >= 70 ? "Ölçülə bilən göstəricilər və konkret ifadələr." : "Ölçülə bilən nəticələr əvəzinə ümumi ifadələrə arxalanır.",
      positives: specPositives,
      improvements: specImprovements,
      detectedTriggers: numberMatches
    },
    {
      id: "value_prop",
      name: "Value & Benefit Orientation",
      name_az: "Dəyər və Nəticə Yönümlülüyü",
      score: finalValue,
      status: getStatus(finalValue),
      summary: finalValue >= 70 ? "Focuses firmly on the user's transformation." : "Skewed toward features or self-descriptions rather than customer value.",
      summary_az: finalValue >= 70 ? "İstifadəçinin qazanacağı nəticəyə fokuslanır." : "Dəyər əvəzinə xüsusiyyətlərin sadalanmasına meyillidir.",
      positives: valuePositives,
      improvements: valueImprovements,
      detectedTriggers: powerWords
    },
    {
      id: "friction",
      name: "Friction & Risk Reversal",
      name_az: "Psixoloji Maneə və Risksizlik",
      score: finalFriction,
      status: getStatus(finalFriction),
      summary: finalFriction >= 75 ? "Low psychological barrier to action." : "Contains words or missing assurances that trigger commitment anxiety.",
      summary_az: finalFriction >= 75 ? "Qərar vermək üçün aşağı psixoloji maneə." : "Öhdəlik qorxusu yaradan sözlər və ya çatışmayan zəmanət var.",
      positives: frictionPositives,
      improvements: frictionImprovements,
      detectedTriggers: riskReversalTriggers
    },
    {
      id: "urgency",
      name: "Momentum & Urgency",
      name_az: "Təciliyyət və Zaman Həssaslığı",
      score: finalUrgency,
      status: getStatus(finalUrgency),
      summary: finalUrgency >= 65 ? "Generates constructive motivation to act now." : "Passive timeline with little reason to convert today.",
      summary_az: finalUrgency >= 65 ? "İndi hərəkətə keçmək üçün təbii motivasiya yaradır." : "Bu gün qərar vermək üçün səbəb azdır.",
      positives: urgencyPositives,
      improvements: urgencyImprovements,
      detectedTriggers: urgencyTriggers
    },
    {
      id: "social_proof",
      name: "Social Proof & Authority",
      name_az: "Sosial Sübut və Nüfuz",
      score: finalProof,
      status: getStatus(finalProof),
      summary: finalProof >= 65 ? "Leverages peer validation and authority signals." : "Operates in a vacuum without evidential validation.",
      summary_az: finalProof >= 65 ? "Nüfuz və digər istifadəçilərin etimadına arxalanır." : "Sübut və ya sosial etibar göstəricisi çatışmır.",
      positives: proofPositives,
      improvements: proofImprovements,
      detectedTriggers: socialProofTriggers
    }
  ];

  // Calculate Weighted Overall Score
  // Weights differ slightly by copy type
  const weights: Record<CopyType, Record<string, number>> = {
    headline: { clarity: 0.25, specificity: 0.25, value_prop: 0.25, friction: 0.1, urgency: 0.1, social_proof: 0.05 },
    cta: { clarity: 0.3, friction: 0.25, value_prop: 0.2, urgency: 0.15, specificity: 0.05, social_proof: 0.05 },
    value_prop: { value_prop: 0.3, clarity: 0.2, specificity: 0.2, social_proof: 0.15, friction: 0.1, urgency: 0.05 }
  };

  const currentWeights = weights[type];
  let weightedTotal = 0;
  dimensions.forEach((d) => {
    const w = currentWeights[d.id] || 0.15;
    weightedTotal += d.score * w;
  });

  const overallScore = clamp(weightedTotal);

  // Determine Rating Tier
  const ratingTier = getRatingTier(overallScore);

  // Generate Concrete Actionable Suggestions
  const suggestions = generateSuggestions(dimensions, type, cleanText);

  return {
    copyType: type,
    inputText: cleanText,
    wordCount,
    charCount,
    readingTimeSec,
    overallScore,
    ratingTier,
    dimensions,
    suggestions,
    powerWordsDetected: powerWords,
    frictionWordsDetected: frictionWords,
    vagueWordsDetected: vagueWords,
    pronounBalance: {
      secondPersonCount: youCount,
      firstPersonCount: weCount,
      ratioLabel: pronounRatioLabel,
      isUserCentric
    }
  };
}

function getRatingTier(score: number) {
  if (score >= 88) {
    return {
      level: "exceptional" as const,
      label: "High-Converting Master Copy",
      label_az: "Yüksək Təsirli Usta Mətn",
      badgeColor: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10",
      description: "Exceptional balance of specificity, outcome-orientation, and low cognitive resistance. Ready for high-stakes production campaigns.",
      description_az: "Konkretlik, nəticə yönümlülük və minimum koqnitiv müqavimət balansı. İstehsalat kampaniyaları üçün tam hazırdır."
    };
  }
  if (score >= 72) {
    return {
      level: "strong" as const,
      label: "Strong & Persuasive Copy",
      label_az: "Güclü və İnamlı Mətn",
      badgeColor: "text-sky-400 border-sky-400/30 bg-sky-400/10",
      description: "Solid communicative clarity and customer value with minor optimization headroom in specificity or risk reduction.",
      description_az: "Aydın çatdırılma və dəyər təklifi. Konkret rəqəmlər və ya zəmanət əlavə etməklə daha da gücləndirilə bilər."
    };
  }
  if (score >= 55) {
    return {
      level: "promising" as const,
      label: "Promising with Improvement Levers",
      label_az: "İnkişaf Potensialı Olan Mətn",
      badgeColor: "text-amber-400 border-amber-400/30 bg-amber-400/10",
      description: "Functional core message, but suffers from vague phrasing, weak active verbs, or unaddressed user friction.",
      description_az: "Əsas fikir aydındır, lakin qeyri-müəyyən sözlər və ya zəif fəaliyyət felləri konversiyanı azaldır."
    };
  }
  if (score >= 38) {
    return {
      level: "needs_work" as const,
      label: "Needs Clearer Value & Framing",
      label_az: "Əsaslı Təkmilləşdirmə Tələb Olunur",
      badgeColor: "text-orange-400 border-orange-400/30 bg-orange-400/10",
      description: "High cognitive effort or passive corporate tone. Requires concrete numbers, 'you'-oriented framing, and active verbs.",
      description_az: "Passiv korporativ dil və ya yüksək zehni yük. Konkret rəqəmlər və birbaşa müştəri faydası əlavə edilməlidir."
    };
  }
  return {
    level: "weak" as const,
    label: "Low Impact / High Resistance",
    label_az: "Zəif Təsir / Yüksək Müqavimət",
    badgeColor: "text-rose-500 border-rose-500/30 bg-rose-500/10",
    description: "Lacks demonstrable value, specific outcomes, or persuasive momentum. Needs restructuring from the ground up.",
    description_az: "Dəyər, konkret nəticə və ya inandırıcı təkan çatışmır. Mətn yenidən qurulmalıdır."
  };
}

function generateSuggestions(
  dimensions: PersuasionDimension[],
  type: CopyType,
  originalText: string
): ActionableSuggestion[] {
  const suggestions: ActionableSuggestion[] = [];

  const specDim = dimensions.find((d) => d.id === "specificity");
  const valueDim = dimensions.find((d) => d.id === "value_prop");
  const frictionDim = dimensions.find((d) => d.id === "friction");
  const urgencyDim = dimensions.find((d) => d.id === "urgency");

  // Specificity suggestion
  if (specDim && specDim.score < 70) {
    suggestions.push({
      id: "spec-lever",
      category: "Empirical Specificity",
      category_az: "Empirik Dəqiqlik",
      tip: "Anchor the promise to a measurable quantity or timeframe (e.g. 'in 48 hours', 'Save 12 hrs/week', '500+ design teams').",
      tip_az: "Vədi ölçülə bilən kəmiyyət və ya zaman həddinə bağlayın (məsələn, '48 saat ərzində', 'Həftədə 12 saat qənaət', '500+ dizayn komandası').",
      example: `Instead of "Build faster design systems", try "Ship design systems 3x faster with 0 token drift."`
    });
  }

  // Value suggestion
  if (valueDim && valueDim.score < 70) {
    suggestions.push({
      id: "value-lever",
      category: "Customer Transformation",
      category_az: "Müştəri Nəticəsi",
      tip: "Switch from feature bragging to first/second-person outcome verbs ('You get...', 'Unlock your...').",
      tip_az: "Xüsusiyyət tərifindən birbaşa nəticəyə keçin ('Siz əldə edirsiniz...', 'Zəhmətsiz idarə edin').",
      example: `Instead of "Our tool has advanced APCA algorithms", try "Never fail an accessibility audit again with deterministic APCA contrast."`
    });
  }

  // CTA Friction suggestion
  if (type === "cta" && frictionDim && frictionDim.score < 80) {
    suggestions.push({
      id: "cta-friction",
      category: "Frictionless Action Verb",
      category_az: "Müqavimətsiz Fəaliyyət Feli",
      tip: "Replace friction words with value-claiming triggers ('Get My Free Blueprint' instead of 'Submit').",
      tip_az: "Müqavimət yaradan sözləri dəyər qazanma felləri ilə əvəzləyin ('Rezyumemi İndi Yarat' əvəzinə 'Göndər').",
      example: `Instead of "Submit Form", try "Get Instant Access (Free)"`
    });
  }

  // General psychological trigger suggestion
  if (urgencyDim && urgencyDim.score < 60 && type !== "value_prop") {
    suggestions.push({
      id: "urgency-lever",
      category: "Constructive Momentum",
      category_az: "Hərəkətə Təkan",
      tip: "Inject natural momentum without artificial countdown timers ('Start Building Today', 'Instant Download').",
      tip_az: "Süni tələskənlik olmadan təbii zaman təkanı əlavə edin ('Bu Gün Başlayın', 'Dərhal Yükləyin').",
      example: `Add 'Instant' or 'Today' to clarify that reward delivery is immediate.`
    });
  }

  return suggestions;
}

function createEmptyAnalysis(type: CopyType): PersuasionAnalysis {
  return {
    copyType: type,
    inputText: "",
    wordCount: 0,
    charCount: 0,
    readingTimeSec: 0,
    overallScore: 0,
    ratingTier: {
      level: "weak",
      label: "Awaiting Copy Input",
      label_az: "Mətn Daxil Edilməsini Gözləyir",
      badgeColor: "text-muted-foreground border-white/10 bg-white/5",
      description: "Enter a headline, value proposition, or CTA button copy to evaluate its cognitive impact.",
      description_az: "Koqnitiv təsirini yoxlamaq üçün başlıq, dəyər təklifi və ya CTA mətni daxil edin."
    },
    dimensions: [],
    suggestions: [],
    powerWordsDetected: [],
    frictionWordsDetected: [],
    vagueWordsDetected: [],
    pronounBalance: {
      secondPersonCount: 0,
      firstPersonCount: 0,
      ratioLabel: "0 You vs 0 We",
      isUserCentric: false
    }
  };
}

/**
 * Curated Presets for one-click testing across diverse copywriting styles.
 */
export interface PersuasionPreset {
  id: string;
  name: string;
  name_az: string;
  type: CopyType;
  text: string;
  category: "High Converting" | "Vague / Weak" | "High Friction CTA" | "Outcome Focused";
}

export const PERSUASION_PRESETS: PersuasionPreset[] = [
  {
    id: "saas-hero-strong",
    name: "High-Converting SaaS Hero",
    name_az: "Yüksək Təsirli SaaS Başlığı",
    type: "headline",
    text: "Ship enterprise design systems 3x faster with zero token drift.",
    category: "High Converting"
  },
  {
    id: "vague-corporate-hero",
    name: "Vague Corporate Pitch",
    name_az: "Qeyri-Müəyyən Korporativ Başlıq",
    type: "headline",
    text: "We provide the best, world-class, cutting-edge creative solutions for modern brands.",
    category: "Vague / Weak"
  },
  {
    id: "cta-high-converting",
    name: "Frictionless Outcome CTA",
    name_az: "Müqavimətsiz Nəticə Düyməsi",
    type: "cta",
    text: "Get My Free Vector Kit (No Card Required)",
    category: "High Converting"
  },
  {
    id: "cta-high-friction",
    name: "High-Friction Generic CTA",
    name_az: "Yüksək Müqavimətli Ümumi Düymə",
    type: "cta",
    text: "Submit Form and Register Now",
    category: "High Friction CTA"
  },
  {
    id: "value-prop-proof",
    name: "Evidence-Backed Value Prop",
    name_az: "Sübuta Əsaslanan Dəyər Təklifi",
    type: "value_prop",
    text: "Trusted by 14,000+ engineers to eliminate accessibility violations before code review. Free 14-day trial, cancel anytime.",
    category: "Outcome Focused"
  }
];
