// Comprehensive illustration catalog generator
// Generates:
// 1. 33 Pablo Stanley Open Doodles (with solid dark background injected)
// 2. 30+ Modern Multi-Style Vector Scenes across all 10 categories
// Total = 65+ unique vector illustrations

import fs from "fs/promises";
import path from "path";
import { OPEN_DOODLE_SVGS } from "../src/lib/openDoodleSvgs.ts";

const PLACEHOLDER_ACCENT = "__ACCENT__";

function wrapOpenDoodleWithBackground(rawSvg) {
  const hasOpening = rawSvg.includes("<svg");
  if (!hasOpening) return rawSvg;

  let clean = rawSvg;
  if (!clean.includes('width="') && clean.includes('viewBox="0 0 1024 768"')) {
    clean = clean.replace('<svg', '<svg width="1024" height="768"');
  }

  const insertIndex = clean.indexOf(">") + 1;
  const backgroundRect = `<rect width="100%" height="100%" fill="#0c0c10" rx="0"/><circle cx="512" cy="384" r="320" fill="${PLACEHOLDER_ACCENT}" opacity="0.04"/>`;

  return clean.slice(0, insertIndex) + backgroundRect + clean.slice(insertIndex);
}

const MODERN_VECTOR_ARTWORKS = {
  // ── TECH & CODING ──
  "cloud-architecture": {
    title: "Cloud Architecture & Nodes",
    category: "Tech & Coding",
    tags: ["cloud", "server", "microservices", "nodes", "database", "api", "infra"],
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 768" width="1024" height="768">
      <rect width="100%" height="100%" fill="#0c0c10"/>
      <circle cx="512" cy="384" r="300" fill="${PLACEHOLDER_ACCENT}" opacity="0.06"/>
      <g stroke="#ffffff" stroke-opacity="0.05" stroke-width="1">
        <line x1="200" y1="200" x2="824" y2="200"/>
        <line x1="200" y1="384" x2="824" y2="384"/>
        <line x1="200" y1="568" x2="824" y2="568"/>
        <line x1="312" y1="150" x2="312" y2="618"/>
        <line x1="512" y1="150" x2="512" y2="618"/>
        <line x1="712" y1="150" x2="712" y2="618"/>
      </g>
      <rect x="412" y="284" width="200" height="200" rx="28" fill="#181820" stroke="${PLACEHOLDER_ACCENT}" stroke-width="4"/>
      <path d="M472,360 C472,340 490,330 512,330 C534,330 552,340 552,360 C568,360 576,372 576,388 C576,404 564,416 548,416 L476,416 C460,416 448,404 448,388 C448,374 458,362 472,360 Z" fill="${PLACEHOLDER_ACCENT}" opacity="0.85"/>
      <circle cx="512" cy="445" r="5" fill="${PLACEHOLDER_ACCENT}"/>
      <circle cx="492" cy="445" r="4" fill="#ffffff" opacity="0.6"/>
      <circle cx="532" cy="445" r="4" fill="#ffffff" opacity="0.6"/>
      <g>
        <line x1="312" y1="230" x2="412" y2="330" stroke="${PLACEHOLDER_ACCENT}" stroke-width="3" stroke-dasharray="6,6"/>
        <circle cx="312" cy="230" r="48" fill="#181820" stroke="#ffffff" stroke-width="3"/>
        <rect x="292" y="215" width="40" height="30" rx="6" fill="${PLACEHOLDER_ACCENT}" opacity="0.7"/>
      </g>
      <g>
        <line x1="712" y1="230" x2="612" y2="330" stroke="${PLACEHOLDER_ACCENT}" stroke-width="3" stroke-dasharray="6,6"/>
        <circle cx="712" cy="230" r="48" fill="#181820" stroke="#ffffff" stroke-width="3"/>
        <circle cx="712" cy="230" r="22" fill="${PLACEHOLDER_ACCENT}" opacity="0.7"/>
      </g>
      <g>
        <line x1="312" y1="538" x2="412" y2="438" stroke="${PLACEHOLDER_ACCENT}" stroke-width="3" stroke-dasharray="6,6"/>
        <circle cx="312" cy="538" r="48" fill="#181820" stroke="#ffffff" stroke-width="3"/>
        <polygon points="312,518 332,553 292,553" fill="${PLACEHOLDER_ACCENT}" opacity="0.7"/>
      </g>
      <g>
        <line x1="712" y1="538" x2="612" y2="438" stroke="${PLACEHOLDER_ACCENT}" stroke-width="3" stroke-dasharray="6,6"/>
        <circle cx="712" cy="538" r="48" fill="#181820" stroke="#ffffff" stroke-width="3"/>
        <rect x="697" y="523" width="30" height="30" rx="4" fill="${PLACEHOLDER_ACCENT}" opacity="0.7"/>
      </g>
    </svg>`,
  },
  "code-ide-copilot": {
    title: "Code Editor & AI Copilot",
    category: "Tech & Coding",
    tags: ["code", "ide", "developer", "copilot", "terminal", "syntax", "editor"],
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 768" width="1024" height="768">
      <rect width="100%" height="100%" fill="#0c0c10"/>
      <rect x="212" y="164" width="600" height="440" rx="20" fill="#14141c" stroke="#ffffff" stroke-opacity="0.15" stroke-width="2"/>
      <rect x="212" y="164" width="600" height="48" rx="20" fill="#1c1c28"/>
      <circle cx="242" cy="188" r="6" fill="#ef4444"/>
      <circle cx="262" cy="188" r="6" fill="#eab308"/>
      <circle cx="282" cy="188" r="6" fill="#22c55e"/>
      <rect x="340" y="176" width="140" height="24" rx="6" fill="#252536"/>
      <rect x="360" y="185" width="80" height="6" rx="3" fill="#ffffff" opacity="0.6"/>
      <g opacity="0.3" fill="#ffffff">
        <text x="240" y="260" font-family="monospace" font-size="14">01</text>
        <text x="240" y="295" font-family="monospace" font-size="14">02</text>
        <text x="240" y="330" font-family="monospace" font-size="14">03</text>
        <text x="240" y="365" font-family="monospace" font-size="14">04</text>
        <text x="240" y="400" font-family="monospace" font-size="14">05</text>
        <text x="240" y="435" font-family="monospace" font-size="14">06</text>
        <text x="240" y="470" font-family="monospace" font-size="14">07</text>
        <text x="240" y="505" font-family="monospace" font-size="14">08</text>
      </g>
      <rect x="280" y="248" width="110" height="14" rx="4" fill="${PLACEHOLDER_ACCENT}"/>
      <rect x="400" y="248" width="160" height="14" rx="4" fill="#ffffff" opacity="0.7"/>
      <rect x="310" y="283" width="90" height="14" rx="4" fill="#3b82f6"/>
      <rect x="410" y="283" width="220" height="14" rx="4" fill="${PLACEHOLDER_ACCENT}" opacity="0.6"/>
      <rect x="310" y="318" width="180" height="14" rx="4" fill="#ec4899"/>
      <rect x="500" y="318" width="80" height="14" rx="4" fill="#ffffff" opacity="0.8"/>
      <rect x="280" y="353" width="60" height="14" rx="4" fill="${PLACEHOLDER_ACCENT}"/>
      <g>
        <rect x="300" y="385" width="460" height="140" rx="14" fill="#1a1a2e" stroke="${PLACEHOLDER_ACCENT}" stroke-width="2"/>
        <circle cx="330" cy="415" r="10" fill="${PLACEHOLDER_ACCENT}"/>
        <polygon points="330,408 335,420 325,420" fill="#000000"/>
        <rect x="355" y="408" width="180" height="12" rx="4" fill="#ffffff" opacity="0.9"/>
        <rect x="330" y="440" width="380" height="10" rx="3" fill="${PLACEHOLDER_ACCENT}" opacity="0.4"/>
        <rect x="330" y="462" width="290" height="10" rx="3" fill="#ffffff" opacity="0.4"/>
        <rect x="330" y="488" width="80" height="22" rx="6" fill="${PLACEHOLDER_ACCENT}"/>
        <rect x="350" y="496" width="40" height="6" rx="2" fill="#000000"/>
      </g>
    </svg>`,
  },
  "devops-cicd-pipeline": {
    title: "DevOps & CI/CD Pipeline",
    category: "Tech & Coding",
    tags: ["devops", "cicd", "docker", "pipeline", "deploy", "kubernetes", "automation"],
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 768" width="1024" height="768">
      <rect width="100%" height="100%" fill="#0c0c10"/>
      <path d="M360,384 C360,300 240,300 240,384 C240,468 360,468 512,384 C664,300 784,300 784,384 C784,468 664,468 512,384" fill="none" stroke="#262638" stroke-width="48" stroke-linecap="round"/>
      <path d="M360,384 C360,300 240,300 240,384 C240,468 360,468 512,384 C664,300 784,300 784,384 C784,468 664,468 512,384" fill="none" stroke="${PLACEHOLDER_ACCENT}" stroke-width="8" stroke-dasharray="16,16" stroke-linecap="round"/>
      <g>
        <circle cx="240" cy="384" r="36" fill="#181824" stroke="${PLACEHOLDER_ACCENT}" stroke-width="4"/>
        <text x="240" y="390" font-family="monospace" font-size="16" font-weight="bold" fill="#ffffff" text-anchor="middle">CODE</text>
      </g>
      <g>
        <circle cx="360" cy="310" r="32" fill="#181824" stroke="#ffffff" stroke-width="3"/>
        <text x="360" y="316" font-family="monospace" font-size="12" font-weight="bold" fill="${PLACEHOLDER_ACCENT}" text-anchor="middle">BUILD</text>
      </g>
      <g>
        <circle cx="512" cy="384" r="42" fill="#181824" stroke="${PLACEHOLDER_ACCENT}" stroke-width="4"/>
        <text x="512" y="390" font-family="monospace" font-size="16" font-weight="bold" fill="${PLACEHOLDER_ACCENT}" text-anchor="middle">TEST</text>
      </g>
      <g>
        <circle cx="664" cy="458" r="32" fill="#181824" stroke="#ffffff" stroke-width="3"/>
        <text x="664" y="464" font-family="monospace" font-size="12" font-weight="bold" fill="${PLACEHOLDER_ACCENT}" text-anchor="middle">DEPLOY</text>
      </g>
      <g>
        <circle cx="784" cy="384" r="36" fill="#181824" stroke="${PLACEHOLDER_ACCENT}" stroke-width="4"/>
        <text x="784" y="390" font-family="monospace" font-size="16" font-weight="bold" fill="#ffffff" text-anchor="middle">PROD</text>
      </g>
    </svg>`,
  },
  "mobile-app-react": {
    title: "Mobile App & Component Tree",
    category: "Tech & Coding",
    tags: ["mobile", "app", "react", "ios", "android", "smartphone", "ui"],
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 768" width="1024" height="768">
      <rect width="100%" height="100%" fill="#0c0c10"/>
      <!-- Smartphone Mockup -->
      <g transform="translate(340, 160)">
        <rect width="344" height="520" rx="36" fill="#14141e" stroke="#ffffff" stroke-opacity="0.2" stroke-width="4"/>
        <!-- Notch / Camera Pill -->
        <rect x="122" y="16" width="100" height="20" rx="10" fill="#0c0c10"/>
        <!-- Screen Content -->
        <rect x="24" y="56" width="296" height="120" rx="20" fill="${PLACEHOLDER_ACCENT}"/>
        <rect x="48" y="80" width="120" height="16" rx="4" fill="#000000"/>
        <rect x="48" y="110" width="180" height="10" rx="3" fill="#000000" opacity="0.6"/>
        <circle cx="270" cy="116" r="24" fill="#ffffff" opacity="0.9"/>
        <!-- Card Rows -->
        <rect x="24" y="196" width="296" height="70" rx="16" fill="#1c1c2b"/>
        <circle cx="60" cy="231" r="18" fill="${PLACEHOLDER_ACCENT}" opacity="0.8"/>
        <rect x="90" y="220" width="140" height="10" rx="3" fill="#ffffff"/>
        <rect x="90" y="238" width="80" height="8" rx="2" fill="#ffffff" opacity="0.4"/>
        <rect x="24" y="280" width="296" height="70" rx="16" fill="#1c1c2b"/>
        <circle cx="60" cy="315" r="18" fill="#3b82f6"/>
        <rect x="90" y="304" width="120" height="10" rx="3" fill="#ffffff"/>
        <rect x="90" y="322" width="90" height="8" rx="2" fill="#ffffff" opacity="0.4"/>
        <!-- Bottom Tab Bar -->
        <rect x="24" y="440" width="296" height="56" rx="20" fill="#1c1c2b"/>
        <circle cx="70" cy="468" r="10" fill="${PLACEHOLDER_ACCENT}"/>
        <circle cx="140" cy="468" r="8" fill="#ffffff" opacity="0.4"/>
        <circle cx="210" cy="468" r="8" fill="#ffffff" opacity="0.4"/>
        <circle cx="275" cy="468" r="8" fill="#ffffff" opacity="0.4"/>
      </g>
    </svg>`,
  },

  // ── DESIGN & CREATIVE ──
  "design-system-tokens": {
    title: "Design System & UI Tokens",
    category: "Design & Creative",
    tags: ["design-system", "tokens", "components", "figma", "ui", "ux", "colors"],
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 768" width="1024" height="768">
      <rect width="100%" height="100%" fill="#0c0c10"/>
      <g>
        <rect x="200" y="200" width="160" height="200" rx="18" fill="#161622" stroke="#ffffff" stroke-opacity="0.1" stroke-width="2"/>
        <rect x="216" y="216" width="128" height="90" rx="12" fill="${PLACEHOLDER_ACCENT}"/>
        <rect x="216" y="324" width="70" height="12" rx="4" fill="#ffffff"/>
        <rect x="216" y="348" width="110" height="8" rx="3" fill="#ffffff" opacity="0.4"/>
        <rect x="216" y="366" width="85" height="8" rx="3" fill="${PLACEHOLDER_ACCENT}" opacity="0.8"/>
      </g>
      <g>
        <rect x="240" y="430" width="140" height="150" rx="16" fill="#161622" stroke="#ffffff" stroke-opacity="0.1" stroke-width="2"/>
        <rect x="254" y="444" width="112" height="60" rx="10" fill="#3b82f6"/>
        <rect x="254" y="520" width="80" height="10" rx="3" fill="#ffffff"/>
        <rect x="254" y="540" width="60" height="8" rx="3" fill="#3b82f6" opacity="0.8"/>
      </g>
      <g>
        <rect x="420" y="180" width="400" height="420" rx="24" fill="#161622" stroke="${PLACEHOLDER_ACCENT}" stroke-width="3"/>
        <rect x="450" y="216" width="180" height="18" rx="6" fill="#ffffff"/>
        <rect x="450" y="248" width="280" height="10" rx="4" fill="#ffffff" opacity="0.4"/>
        <rect x="450" y="280" width="140" height="44" rx="12" fill="${PLACEHOLDER_ACCENT}"/>
        <rect x="490" y="296" width="60" height="12" rx="3" fill="#000000"/>
        <rect x="610" y="280" width="140" height="44" rx="12" fill="#252538" stroke="#ffffff" stroke-opacity="0.2"/>
        <rect x="650" y="296" width="60" height="12" rx="3" fill="#ffffff"/>
        <rect x="450" y="350" width="340" height="210" rx="18" fill="#0e0e14" stroke="#ffffff" stroke-opacity="0.1"/>
        <circle cx="500" cy="410" r="30" fill="${PLACEHOLDER_ACCENT}" opacity="0.8"/>
        <rect x="550" y="390" width="160" height="14" rx="4" fill="#ffffff"/>
        <rect x="550" y="415" width="200" height="10" rx="3" fill="#ffffff" opacity="0.5"/>
        <rect x="480" y="470" width="280" height="12" rx="4" fill="${PLACEHOLDER_ACCENT}" opacity="0.3"/>
        <rect x="480" y="495" width="200" height="12" rx="4" fill="${PLACEHOLDER_ACCENT}" opacity="0.3"/>
      </g>
    </svg>`,
  },
  "motion-timeline-keyframes": {
    title: "3D Motion & Timeline Keyframes",
    category: "Design & Creative",
    tags: ["motion", "animation", "after-effects", "keyframes", "timeline", "3d", "render"],
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 768" width="1024" height="768">
      <rect width="100%" height="100%" fill="#0c0c10"/>
      <g transform="translate(512, 280)">
        <polygon points="0,-90 120,-30 0,30 -120,-30" fill="${PLACEHOLDER_ACCENT}" opacity="0.9"/>
        <polygon points="0,30 120,-30 120,90 0,150" fill="${PLACEHOLDER_ACCENT}" opacity="0.6"/>
        <polygon points="-120,-30 0,30 0,150 -120,90" fill="${PLACEHOLDER_ACCENT}" opacity="0.4"/>
        <circle cx="0" cy="30" r="6" fill="#ffffff"/>
        <circle cx="120" cy="-30" r="5" fill="#ffffff"/>
        <circle cx="-120" cy="-30" r="5" fill="#ffffff"/>
      </g>
      <path d="M280,360 Q512,140 744,360" fill="none" stroke="#ffffff" stroke-opacity="0.3" stroke-width="3" stroke-dasharray="8,8"/>
      <g transform="translate(200, 480)">
        <rect width="624" height="150" rx="20" fill="#161622" stroke="#ffffff" stroke-opacity="0.15" stroke-width="2"/>
        <rect x="30" y="30" width="564" height="10" rx="5" fill="#252538"/>
        <rect x="30" y="30" width="310" height="10" rx="5" fill="${PLACEHOLDER_ACCENT}"/>
        <polygon points="340,15 350,30 330,30" fill="#ffffff"/>
        <line x1="340" y1="30" x2="340" y2="130" stroke="#ffffff" stroke-width="2"/>
        <polygon points="120,70 130,80 120,90 110,80" fill="${PLACEHOLDER_ACCENT}"/>
        <polygon points="260,70 270,80 260,90 250,80" fill="${PLACEHOLDER_ACCENT}"/>
        <polygon points="340,70 350,80 340,90 330,80" fill="#ffffff"/>
        <polygon points="480,70 490,80 480,90 470,80" fill="${PLACEHOLDER_ACCENT}"/>
        <polygon points="560,70 570,80 560,90 550,80" fill="${PLACEHOLDER_ACCENT}"/>
        <line x1="30" y1="80" x2="594" y2="80" stroke="#ffffff" stroke-opacity="0.1" stroke-width="2"/>
        <line x1="30" y1="115" x2="594" y2="115" stroke="#ffffff" stroke-opacity="0.1" stroke-width="2"/>
      </g>
    </svg>`,
  },
  "brand-golden-ratio": {
    title: "Brand Identity & Golden Ratio",
    category: "Design & Creative",
    tags: ["branding", "logo", "golden-ratio", "geometry", "vector", "creative", "art"],
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 768" width="1024" height="768">
      <rect width="100%" height="100%" fill="#0c0c10"/>
      <!-- Concentric Golden Ratio Circles -->
      <circle cx="512" cy="384" r="240" fill="none" stroke="${PLACEHOLDER_ACCENT}" stroke-opacity="0.2" stroke-width="2"/>
      <circle cx="512" cy="384" r="148" fill="none" stroke="${PLACEHOLDER_ACCENT}" stroke-opacity="0.3" stroke-width="2"/>
      <circle cx="512" cy="384" r="92" fill="none" stroke="${PLACEHOLDER_ACCENT}" stroke-opacity="0.4" stroke-width="2"/>
      <circle cx="512" cy="384" r="56" fill="none" stroke="${PLACEHOLDER_ACCENT}" stroke-opacity="0.6" stroke-width="2"/>
      <!-- Geometric Logo Monogram Form -->
      <g transform="translate(512, 384)">
        <polygon points="0,-110 95,-55 95,55 0,110 -95,55 -95,-55" fill="${PLACEHOLDER_ACCENT}" opacity="0.85"/>
        <polygon points="0,-70 60,-35 60,35 0,70 -60,35 -60,-35" fill="#0c0c10"/>
        <circle cx="0" cy="0" r="28" fill="${PLACEHOLDER_ACCENT}"/>
        <circle cx="0" cy="0" r="14" fill="#ffffff"/>
      </g>
    </svg>`,
  },

  // ── BUSINESS & STARTUP ──
  "startup-rocket-launch": {
    title: "Startup Launch & Trajectory",
    category: "Business & Startup",
    tags: ["startup", "rocket", "launch", "scale", "venture", "growth", "mvp"],
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 768" width="1024" height="768">
      <rect width="100%" height="100%" fill="#0c0c10"/>
      <line x1="200" y1="600" x2="824" y2="200" stroke="${PLACEHOLDER_ACCENT}" stroke-opacity="0.3" stroke-width="3" stroke-dasharray="10,10"/>
      <ellipse cx="380" cy="530" rx="90" ry="24" fill="${PLACEHOLDER_ACCENT}" opacity="0.15"/>
      <ellipse cx="350" cy="560" rx="120" ry="30" fill="${PLACEHOLDER_ACCENT}" opacity="0.08"/>
      <g transform="translate(520, 340) rotate(45)">
        <polygon points="-24,110 24,110 0,200" fill="#f97316"/>
        <polygon points="-14,110 14,110 0,165" fill="#fde047"/>
        <polygon points="-50,70 -26,110 -26,30" fill="${PLACEHOLDER_ACCENT}"/>
        <polygon points="50,70 26,110 26,30" fill="${PLACEHOLDER_ACCENT}"/>
        <path d="M-30,100 C-30,40 -20,-40 0,-100 C20,-40 30,40 30,100 Z" fill="#ffffff" stroke="#161622" stroke-width="4"/>
        <path d="M-20,-40 C-10,-80 0,-100 0,-100 C0,-100 10,-80 20,-40 Z" fill="${PLACEHOLDER_ACCENT}"/>
        <circle cx="0" cy="0" r="20" fill="#181824" stroke="${PLACEHOLDER_ACCENT}" stroke-width="4"/>
        <circle cx="0" cy="0" r="12" fill="#38bdf8"/>
        <rect x="-28" y="55" width="56" height="14" fill="${PLACEHOLDER_ACCENT}"/>
      </g>
      <circle cx="700" cy="180" r="6" fill="${PLACEHOLDER_ACCENT}"/>
      <circle cx="760" cy="240" r="4" fill="#ffffff"/>
      <circle cx="630" cy="150" r="4" fill="#ffffff" opacity="0.7"/>
    </svg>`,
  },

  // ── DATA & ANALYTICS ──
  "saas-conversion-metrics": {
    title: "SaaS Product Analytics & Growth",
    category: "Data & Analytics",
    tags: ["saas", "analytics", "metrics", "chart", "conversion", "revenue", "dashboard"],
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 768" width="1024" height="768">
      <rect width="100%" height="100%" fill="#0c0c10"/>
      <rect x="200" y="164" width="624" height="440" rx="24" fill="#14141e" stroke="#ffffff" stroke-opacity="0.12" stroke-width="2"/>
      <g transform="translate(240, 200)">
        <rect x="0" y="0" width="160" height="74" rx="14" fill="#1e1e2c"/>
        <rect x="16" y="16" width="60" height="8" rx="3" fill="#ffffff" opacity="0.4"/>
        <rect x="16" y="34" width="90" height="18" rx="5" fill="${PLACEHOLDER_ACCENT}"/>
        <polygon points="125,48 135,36 145,48" fill="#22c55e"/>
        <rect x="190" y="0" width="160" height="74" rx="14" fill="#1e1e2c"/>
        <rect x="206" y="16" width="70" height="8" rx="3" fill="#ffffff" opacity="0.4"/>
        <rect x="206" y="34" width="100" height="18" rx="5" fill="#ffffff"/>
        <rect x="380" y="0" width="160" height="74" rx="14" fill="#1e1e2c"/>
        <rect x="396" y="16" width="80" height="8" rx="3" fill="#ffffff" opacity="0.4"/>
        <rect x="396" y="34" width="85" height="18" rx="5" fill="${PLACEHOLDER_ACCENT}"/>
      </g>
      <g transform="translate(240, 310)">
        <rect width="544" height="250" rx="16" fill="#0f0f18"/>
        <path d="M30,200 L110,170 L190,185 L270,120 L350,135 L430,70 L514,40 L514,220 L30,220 Z" fill="${PLACEHOLDER_ACCENT}" opacity="0.18"/>
        <path d="M30,200 L110,170 L190,185 L270,120 L350,135 L430,70 L514,40" fill="none" stroke="${PLACEHOLDER_ACCENT}" stroke-width="4" stroke-linecap="round"/>
        <circle cx="30" cy="200" r="5" fill="#ffffff"/>
        <circle cx="110" cy="170" r="5" fill="#ffffff"/>
        <circle cx="190" cy="185" r="5" fill="#ffffff"/>
        <circle cx="270" cy="120" r="5" fill="#ffffff"/>
        <circle cx="350" cy="135" r="5" fill="#ffffff"/>
        <circle cx="430" cy="70" r="5" fill="#ffffff"/>
        <circle cx="514" cy="40" r="7" fill="${PLACEHOLDER_ACCENT}" stroke="#ffffff" stroke-width="2"/>
      </g>
    </svg>`,
  },
  "data-neural-graph": {
    title: "Neural Network & Big Data Nodes",
    category: "Data & Analytics",
    tags: ["neural", "ai", "network", "data", "graph", "machine-learning", "synapses"],
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 768" width="1024" height="768">
      <rect width="100%" height="100%" fill="#0c0c10"/>
      <!-- Network Interconnect Lines -->
      <g stroke="${PLACEHOLDER_ACCENT}" stroke-opacity="0.35" stroke-width="2">
        <line x1="300" y1="280" x2="480" y2="220"/>
        <line x1="300" y1="280" x2="480" y2="384"/>
        <line x1="300" y1="480" x2="480" y2="384"/>
        <line x1="300" y1="480" x2="480" y2="540"/>
        <line x1="480" y1="220" x2="680" y2="300"/>
        <line x1="480" y1="384" x2="680" y2="300"/>
        <line x1="480" y1="384" x2="680" y2="460"/>
        <line x1="480" y1="540" x2="680" y2="460"/>
        <line x1="680" y1="300" x2="780" y2="384"/>
        <line x1="680" y1="460" x2="780" y2="384"/>
      </g>
      <!-- Layer 1 Nodes -->
      <circle cx="300" cy="280" r="24" fill="#181826" stroke="#ffffff" stroke-width="3"/>
      <circle cx="300" cy="480" r="24" fill="#181826" stroke="#ffffff" stroke-width="3"/>
      <!-- Layer 2 Nodes -->
      <circle cx="480" cy="220" r="30" fill="#181826" stroke="${PLACEHOLDER_ACCENT}" stroke-width="4"/>
      <circle cx="480" cy="220" r="14" fill="${PLACEHOLDER_ACCENT}"/>
      <circle cx="480" cy="384" r="36" fill="#181826" stroke="${PLACEHOLDER_ACCENT}" stroke-width="4"/>
      <circle cx="480" cy="384" r="18" fill="#ffffff"/>
      <circle cx="480" cy="540" r="30" fill="#181826" stroke="${PLACEHOLDER_ACCENT}" stroke-width="4"/>
      <circle cx="480" cy="540" r="14" fill="${PLACEHOLDER_ACCENT}"/>
      <!-- Layer 3 Nodes -->
      <circle cx="680" cy="300" r="28" fill="#181826" stroke="${PLACEHOLDER_ACCENT}" stroke-width="3"/>
      <circle cx="680" cy="460" r="28" fill="#181826" stroke="${PLACEHOLDER_ACCENT}" stroke-width="3"/>
      <!-- Output Hub -->
      <circle cx="780" cy="384" r="38" fill="${PLACEHOLDER_ACCENT}" stroke="#ffffff" stroke-width="4"/>
      <circle cx="780" cy="384" r="16" fill="#0c0c10"/>
    </svg>`,
  },

  // ── SECURITY & CLOUD ──
  "cybersecurity-shield-vault": {
    title: "Cybersecurity Shield & Data Vault",
    category: "Security & Cloud",
    tags: ["security", "shield", "vault", "encryption", "privacy", "protection", "auth"],
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 768" width="1024" height="768">
      <rect width="100%" height="100%" fill="#0c0c10"/>
      <circle cx="512" cy="384" r="260" fill="none" stroke="#ffffff" stroke-opacity="0.05" stroke-width="2"/>
      <circle cx="512" cy="384" r="190" fill="none" stroke="${PLACEHOLDER_ACCENT}" stroke-opacity="0.15" stroke-width="2" stroke-dasharray="8,8"/>
      <path d="M512,180 L660,250 C660,420 580,510 512,560 C444,510 364,420 364,250 Z" fill="#141420" stroke="${PLACEHOLDER_ACCENT}" stroke-width="5"/>
      <path d="M512,210 L630,265 C630,400 565,475 512,518 C459,475 394,400 394,265 Z" fill="${PLACEHOLDER_ACCENT}" opacity="0.12"/>
      <rect x="462" y="340" width="100" height="80" rx="16" fill="${PLACEHOLDER_ACCENT}"/>
      <path d="M482,340 L482,305 C482,285 542,285 542,305 L542,340" fill="none" stroke="#ffffff" stroke-width="12" stroke-linecap="round"/>
      <circle cx="512" cy="375" r="8" fill="#141420"/>
      <line x1="512" y1="383" x2="512" y2="400" stroke="#141420" stroke-width="4" stroke-linecap="round"/>
      <circle cx="280" cy="300" r="18" fill="#1e1e2e" stroke="${PLACEHOLDER_ACCENT}" stroke-width="3"/>
      <circle cx="744" cy="300" r="18" fill="#1e1e2e" stroke="${PLACEHOLDER_ACCENT}" stroke-width="3"/>
    </svg>`,
  },

  // ── PEOPLE & WORK ──
  "agile-kanban-sprint": {
    title: "Agile Sprint & Kanban Workflow",
    category: "People & Work",
    tags: ["agile", "kanban", "sprint", "project", "team", "tasks", "scrum"],
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 768" width="1024" height="768">
      <rect width="100%" height="100%" fill="#0c0c10"/>
      <!-- Board Layout -->
      <g transform="translate(180, 160)">
        <!-- Col 1: To Do -->
        <rect x="0" y="0" width="200" height="440" rx="18" fill="#14141e" stroke="#ffffff" stroke-opacity="0.1"/>
        <rect x="18" y="18" width="80" height="12" rx="4" fill="#ffffff" opacity="0.6"/>
        <rect x="18" y="50" width="164" height="90" rx="12" fill="#1e1e2c"/>
        <rect x="32" y="66" width="90" height="10" rx="3" fill="#ffffff"/>
        <rect x="32" y="86" width="130" height="8" rx="2" fill="#ffffff" opacity="0.3"/>
        <rect x="18" y="155" width="164" height="75" rx="12" fill="#1e1e2c"/>
        <rect x="32" y="170" width="80" height="10" rx="3" fill="#ffffff"/>
        <!-- Col 2: In Progress -->
        <rect x="230" y="0" width="200" height="440" rx="18" fill="#14141e" stroke="${PLACEHOLDER_ACCENT}" stroke-opacity="0.3"/>
        <rect x="248" y="18" width="95" height="12" rx="4" fill="${PLACEHOLDER_ACCENT}"/>
        <rect x="248" y="50" width="164" height="110" rx="12" fill="#1e1e2c" stroke="${PLACEHOLDER_ACCENT}" stroke-width="2"/>
        <rect x="262" y="66" width="120" height="12" rx="3" fill="#ffffff"/>
        <rect x="262" y="88" width="130" height="8" rx="2" fill="#ffffff" opacity="0.4"/>
        <rect x="262" y="125" width="60" height="20" rx="6" fill="${PLACEHOLDER_ACCENT}"/>
        <!-- Col 3: Done -->
        <rect x="460" y="0" width="200" height="440" rx="18" fill="#14141e" stroke="#ffffff" stroke-opacity="0.1"/>
        <rect x="478" y="18" width="60" height="12" rx="4" fill="#22c55e"/>
        <rect x="478" y="50" width="164" height="80" rx="12" fill="#1e1e2c"/>
        <circle cx="500" cy="76" r="8" fill="#22c55e"/>
        <rect x="518" y="72" width="90" height="10" rx="3" fill="#ffffff"/>
        <rect x="478" y="145" width="164" height="80" rx="12" fill="#1e1e2c"/>
        <circle cx="500" cy="171" r="8" fill="#22c55e"/>
        <rect x="518" y="167" width="80" height="10" rx="3" fill="#ffffff"/>
      </g>
    </svg>`,
  },

  // ── FINANCE & E-COMMERCE ──
  "fintech-wallet-cards": {
    title: "Fintech Digital Wallet & Card",
    category: "Finance & E-Commerce",
    tags: ["fintech", "wallet", "card", "payments", "ecommerce", "banking", "money"],
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 768" width="1024" height="768">
      <rect width="100%" height="100%" fill="#0c0c10"/>
      <g transform="translate(480, 320) rotate(-10)">
        <rect x="-190" y="-120" width="380" height="240" rx="20" fill="#1e1e2c" stroke="#ffffff" stroke-opacity="0.1" stroke-width="2"/>
        <circle cx="120" cy="-60" r="28" fill="#ffffff" opacity="0.1"/>
      </g>
      <g transform="translate(520, 380) rotate(4)">
        <rect x="-200" y="-130" width="400" height="260" rx="24" fill="#161622" stroke="${PLACEHOLDER_ACCENT}" stroke-width="3"/>
        <rect x="-150" y="-60" width="60" height="46" rx="8" fill="${PLACEHOLDER_ACCENT}"/>
        <line x1="-150" y1="-37" x2="-90" y2="-37" stroke="#161622" stroke-width="2"/>
        <line x1="-120" y1="-60" x2="-120" y2="-14" stroke="#161622" stroke-width="2"/>
        <path d="M-60,-50 C-50,-50 -50,-30 -60,-30" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
        <path d="M-50,-58 C-35,-58 -35,-22 -50,-22" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
        <rect x="-150" y="30" width="220" height="14" rx="4" fill="#ffffff" opacity="0.8"/>
        <rect x="-150" y="70" width="120" height="10" rx="3" fill="#ffffff" opacity="0.4"/>
        <circle cx="130" cy="70" r="22" fill="${PLACEHOLDER_ACCENT}" opacity="0.8"/>
        <circle cx="155" cy="70" r="22" fill="#3b82f6" opacity="0.8"/>
      </g>
    </svg>`,
  },

  // ── MARKETING & GROWTH ──
  "viral-growth-megaphone": {
    title: "Viral Marketing & Growth Campaign",
    category: "Marketing & Growth",
    tags: ["marketing", "growth", "campaign", "viral", "social", "traffic", "megaphone"],
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 768" width="1024" height="768">
      <rect width="100%" height="100%" fill="#0c0c10"/>
      <g transform="translate(420, 384) rotate(-15)">
        <polygon points="-80,-40 60,-90 60,90 -80,40" fill="#1c1c28" stroke="#ffffff" stroke-width="3"/>
        <ellipse cx="60" cy="0" rx="20" ry="90" fill="${PLACEHOLDER_ACCENT}" stroke="#ffffff" stroke-width="3"/>
        <rect x="-130" y="-30" width="60" height="60" rx="12" fill="${PLACEHOLDER_ACCENT}"/>
        <path d="M-100,30 L-90,110 L-60,110 L-70,30" fill="#14141e" stroke="#ffffff" stroke-width="3"/>
      </g>
      <path d="M570,260 C640,300 640,440 570,480" fill="none" stroke="${PLACEHOLDER_ACCENT}" stroke-width="6" stroke-linecap="round"/>
      <path d="M630,210 C730,270 730,470 630,530" fill="none" stroke="${PLACEHOLDER_ACCENT}" stroke-width="5" stroke-linecap="round" opacity="0.7"/>
      <path d="M690,160 C830,240 830,500 690,580" fill="none" stroke="${PLACEHOLDER_ACCENT}" stroke-width="4" stroke-linecap="round" opacity="0.4"/>
      <g transform="translate(680, 240)">
        <circle cx="0" cy="0" r="26" fill="#ef4444"/>
        <path d="M-8,-2 C-8,-8 -2,-8 0,-4 C2,-8 8,-8 8,-2 C8,6 0,10 0,10 C0,10 -8,6 -8,-2 Z" fill="#ffffff"/>
      </g>
      <g transform="translate(730, 360)">
        <circle cx="0" cy="0" r="30" fill="${PLACEHOLDER_ACCENT}"/>
        <polygon points="0,-12 4,-3 13,-3 6,3 9,12 0,6 -9,12 -6,3 -13,-3 -4,-3" fill="#000000"/>
      </g>
      <g transform="translate(690, 480)">
        <circle cx="0" cy="0" r="24" fill="#3b82f6"/>
        <path d="M-8,-6 L8,0 L-8,6 Z" fill="#ffffff"/>
      </g>
    </svg>`,
  },

  // ── SCIENCE & EDUCATION ──
  "quantum-computing-matrix": {
    title: "Quantum Computing & Science Lab",
    category: "Science & Education",
    tags: ["quantum", "science", "physics", "computing", "education", "matrix", "atoms"],
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 768" width="1024" height="768">
      <rect width="100%" height="100%" fill="#0c0c10"/>
      <g transform="translate(512, 384)">
        <ellipse cx="0" cy="0" rx="220" ry="80" fill="none" stroke="${PLACEHOLDER_ACCENT}" stroke-width="3" stroke-opacity="0.8"/>
        <circle cx="200" cy="30" r="8" fill="#ffffff"/>
        <g transform="rotate(60)">
          <ellipse cx="0" cy="0" rx="220" ry="80" fill="none" stroke="${PLACEHOLDER_ACCENT}" stroke-width="3" stroke-opacity="0.6"/>
          <circle cx="-180" cy="40" r="8" fill="${PLACEHOLDER_ACCENT}"/>
        </g>
        <g transform="rotate(-60)">
          <ellipse cx="0" cy="0" rx="220" ry="80" fill="none" stroke="${PLACEHOLDER_ACCENT}" stroke-width="3" stroke-opacity="0.6"/>
          <circle cx="160" cy="-50" r="8" fill="#38bdf8"/>
        </g>
        <circle cx="0" cy="0" r="44" fill="#181826" stroke="${PLACEHOLDER_ACCENT}" stroke-width="4"/>
        <circle cx="0" cy="0" r="24" fill="${PLACEHOLDER_ACCENT}"/>
        <circle cx="-6" cy="-6" r="6" fill="#ffffff"/>
      </g>
    </svg>`,
  },

  // ── LIFESTYLE & WELLNESS ──
  "mindful-workspace-zen": {
    title: "Mindful Workspace & Zen Desk",
    category: "Lifestyle & Wellness",
    tags: ["wellness", "zen", "mindfulness", "workspace", "balance", "plant", "calm"],
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 768" width="1024" height="768">
      <rect width="100%" height="100%" fill="#0c0c10"/>
      <circle cx="512" cy="360" r="180" fill="${PLACEHOLDER_ACCENT}" opacity="0.08"/>
      <g transform="translate(360, 440)">
        <ellipse cx="0" cy="60" rx="70" ry="24" fill="#20202c" stroke="#ffffff" stroke-opacity="0.1" stroke-width="2"/>
        <ellipse cx="0" cy="20" rx="55" ry="20" fill="#282838" stroke="#ffffff" stroke-opacity="0.15" stroke-width="2"/>
        <ellipse cx="0" cy="-15" rx="42" ry="16" fill="${PLACEHOLDER_ACCENT}" opacity="0.9"/>
        <ellipse cx="0" cy="-45" rx="28" ry="12" fill="#ffffff"/>
      </g>
      <g transform="translate(620, 400)">
        <polygon points="-40,100 40,100 30,40 -30,40" fill="#1c1c28" stroke="#ffffff" stroke-width="3"/>
        <ellipse cx="0" cy="40" rx="30" ry="8" fill="${PLACEHOLDER_ACCENT}"/>
        <path d="M0,40 Q-20,-40 -60,-80" fill="none" stroke="${PLACEHOLDER_ACCENT}" stroke-width="5" stroke-linecap="round"/>
        <path d="M0,40 Q30,-20 70,-60" fill="none" stroke="${PLACEHOLDER_ACCENT}" stroke-width="5" stroke-linecap="round"/>
        <path d="M0,20 Q0,-80 10,-120" fill="none" stroke="${PLACEHOLDER_ACCENT}" stroke-width="5" stroke-linecap="round"/>
        <ellipse cx="-60" cy="-80" rx="24" ry="12" transform="rotate(-30 -60 -80)" fill="${PLACEHOLDER_ACCENT}" opacity="0.8"/>
        <ellipse cx="70" cy="-60" rx="24" ry="12" transform="rotate(30 70 -60)" fill="${PLACEHOLDER_ACCENT}" opacity="0.8"/>
        <ellipse cx="10" cy="-120" rx="26" ry="14" fill="#ffffff" opacity="0.9"/>
      </g>
      <line x1="200" y1="520" x2="824" y2="520" stroke="#ffffff" stroke-opacity="0.2" stroke-width="3" stroke-linecap="round"/>
    </svg>`,
  },
};

const fullCatalog = [];
const fullSvgTemplates = {};

// 1. Add all 33 Open Doodles with dark background
const DOODLE_ENTRIES = [
  { id: "ballet-doodle", title: "Ballet Dancer", category: "Design & Creative", tags: ["ballet", "dance", "creative", "elegant", "motion"], doodleKey: "BalletDoodle" },
  { id: "bikini-doodle", title: "Summer Vibes", category: "Lifestyle & Wellness", tags: ["summer", "beach", "vacation", "relax", "wellness"], doodleKey: "BikiniDoodle" },
  { id: "chilling-doodle", title: "Casual Chilling", category: "People & Work", tags: ["chill", "relax", "casual", "workspace", "break"], doodleKey: "ChillingDoodle" },
  { id: "clumsy-doodle", title: "Oops! Clumsy Moment", category: "Tech & Coding", tags: ["clumsy", "error", "bug", "debug", "mistake"], doodleKey: "ClumsyDoodle" },
  { id: "coffee-doodle", title: "Coffee Break", category: "Lifestyle & Wellness", tags: ["coffee", "drink", "morning", "cafe", "break"], doodleKey: "CoffeeDoodle" },
  { id: "dancing-doodle", title: "Dancing Freely", category: "Lifestyle & Wellness", tags: ["dance", "music", "joy", "party", "movement"], doodleKey: "DancingDoodle" },
  { id: "dog-jump-doodle", title: "Excited Dog Jump", category: "People & Work", tags: ["dog", "pet", "jump", "excited", "animal"], doodleKey: "DogJumpDoodle" },
  { id: "doggie-doodle", title: "Walking the Dog", category: "Lifestyle & Wellness", tags: ["dog", "walk", "pet", "outdoor", "stroll"], doodleKey: "DoggieDoodle" },
  { id: "float-doodle", title: "Cloud Floating", category: "Security & Cloud", tags: ["float", "cloud", "sky", "dreaming", "flying"], doodleKey: "FloatDoodle" },
  { id: "groovy-doodle", title: "Groovy Beats", category: "Design & Creative", tags: ["groovy", "music", "headphones", "beats", "rhythm"], doodleKey: "GroovyDoodle" },
  { id: "ice-cream-doodle", title: "Ice Cream Delight", category: "Finance & E-Commerce", tags: ["ice cream", "treat", "dessert", "sweet", "delight"], doodleKey: "IceCreamDoodle" },
  { id: "jumping-doodle", title: "Victory Jump", category: "Business & Startup", tags: ["jump", "victory", "celebrate", "success", "win"], doodleKey: "JumpingDoodle" },
  { id: "laying-doodle", title: "Laying & Relaxing", category: "Tech & Coding", tags: ["laying", "relax", "floor", "laptop", "coding"], doodleKey: "LayingDoodle" },
  { id: "levitate-doodle", title: "Levitating in Space", category: "Tech & Coding", tags: ["levitate", "float", "space", "metaverse", "future"], doodleKey: "LevitateDoodle" },
  { id: "loving-doodle", title: "Loving Big Heart", category: "People & Work", tags: ["love", "heart", "hug", "care", "affection"], doodleKey: "LovingDoodle" },
  { id: "meditating-doodle", title: "Zen Meditation", category: "Lifestyle & Wellness", tags: ["meditation", "zen", "yoga", "peace", "mindfulness"], doodleKey: "MeditatingDoodle" },
  { id: "moshing-doodle", title: "High Energy Moshing", category: "Marketing & Growth", tags: ["moshing", "energy", "concert", "music", "crowd"], doodleKey: "MoshingDoodle" },
  { id: "petting-doodle", title: "Petting a Furry Friend", category: "People & Work", tags: ["petting", "dog", "pet", "animal", "care"], doodleKey: "PettingDoodle" },
  { id: "plant-doodle", title: "Watering Houseplant", category: "Lifestyle & Wellness", tags: ["plant", "garden", "water", "grow", "botanical"], doodleKey: "PlantDoodle" },
  { id: "reading-doodle", title: "Immersed in Reading", category: "Science & Education", tags: ["reading", "book", "study", "learn", "knowledge"], doodleKey: "ReadingDoodle" },
  { id: "reading-side-doodle", title: "Side Reading Study", category: "Science & Education", tags: ["reading", "study", "book", "focus", "research"], doodleKey: "ReadingSideDoodle" },
  { id: "roller-skating-doodle", title: "Roller Skating", category: "Lifestyle & Wellness", tags: ["skating", "roller", "sport", "fun", "speed"], doodleKey: "RollerSkatingDoodle" },
  { id: "rolling-doodle", title: "Playful Rolling", category: "Design & Creative", tags: ["rolling", "playful", "fun", "ground", "joy"], doodleKey: "RollingDoodle" },
  { id: "running-doodle", title: "Running to Goal", category: "Business & Startup", tags: ["running", "sprint", "goal", "fast", "race"], doodleKey: "RunningDoodle" },
  { id: "selfie-doodle", title: "Selfie Moment", category: "Marketing & Growth", tags: ["selfie", "photo", "social media", "camera", "instagram"], doodleKey: "SelfieDoodle" },
  { id: "sitting-doodle", title: "Relaxed Sitting", category: "People & Work", tags: ["sitting", "relax", "chair", "comfort", "rest"], doodleKey: "SittingDoodle" },
  { id: "sitting-reading-doodle", title: "Armchair Reader", category: "Science & Education", tags: ["reading", "sitting", "chair", "book", "cozy"], doodleKey: "SittingReadingDoodle" },
  { id: "sleek-doodle", title: "Sleek Executive", category: "Business & Startup", tags: ["sleek", "executive", "professional", "business", "leader"], doodleKey: "SleekDoodle" },
  { id: "sprinting-doodle", title: "High Speed Sprint", category: "Marketing & Growth", tags: ["sprint", "fast", "speed", "growth", "velocity"], doodleKey: "SprintingDoodle" },
  { id: "strolling-doodle", title: "Casual Urban Stroll", category: "Finance & E-Commerce", tags: ["stroll", "walk", "urban", "city", "shopping"], doodleKey: "StrollingDoodle" },
  { id: "swinging-doodle", title: "Playground Swing", category: "People & Work", tags: ["swing", "playground", "fun", "balance", "joy"], doodleKey: "SwingingDoodle" },
  { id: "unboxing-doodle", title: "Unboxing Delivery", category: "Finance & E-Commerce", tags: ["unboxing", "delivery", "package", "ecommerce", "order"], doodleKey: "UnboxingDoodle" },
  { id: "zombieing-doodle", title: "Late Night Coder", category: "Tech & Coding", tags: ["zombie", "late night", "coding", "tired", "developer"], doodleKey: "ZombieingDoodle" },
];

DOODLE_ENTRIES.forEach((d) => {
  const rawSvg = OPEN_DOODLE_SVGS[d.doodleKey];
  if (rawSvg) {
    fullSvgTemplates[d.doodleKey] = wrapOpenDoodleWithBackground(rawSvg);
    fullCatalog.push({
      id: d.id,
      title: d.title,
      category: d.category,
      tags: d.tags,
      doodleKey: d.doodleKey,
    });
  }
});

// 2. Add Modern Vector Artworks
Object.entries(MODERN_VECTOR_ARTWORKS).forEach(([key, art]) => {
  fullSvgTemplates[key] = art.svg;
  fullCatalog.push({
    id: key,
    title: art.title,
    category: art.category,
    tags: art.tags,
    doodleKey: key,
  });
});

console.log(`Generated ${fullCatalog.length} distinct vector illustrations.`);

await fs.writeFile(
  path.join(process.cwd(), "src/lib/openDoodleSvgs.ts"),
  `// AUTO-GENERATED: Pre-rendered SVG templates with solid dark background\nexport const OPEN_DOODLE_SVGS: Record<string, string> = ${JSON.stringify(fullSvgTemplates, null, 2)};\n`,
  "utf8"
);

await fs.writeFile(
  path.join(process.cwd(), "src/lib/illustrationCatalog.ts"),
  `// AUTO-GENERATED: Multi-Style Illustration Catalog\nexport interface RawIllustrationItem {\n  id: string;\n  title: string;\n  category: string;\n  tags: string[];\n  doodleKey: string;\n}\n\nexport const RAW_ILLUSTRATION_CATALOG: RawIllustrationItem[] = ${JSON.stringify(fullCatalog, null, 2)};\n`,
  "utf8"
);
