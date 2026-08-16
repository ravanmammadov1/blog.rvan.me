export interface WebTemplate {
  id: string;
  name: string;
  category: "landing" | "marketing" | "social";
  categoryLabel: string;
  description: string;
  badge?: string;
  html: string;
  css: string;
}

export const TEMPLATE_LIBRARY: WebTemplate[] = [
  // ─── 1. LANDING PAGES ───
  {
    id: "saas-landing",
    name: "SaaS Landing Page",
    category: "landing",
    categoryLabel: "Landing Pages",
    description: "High-conversion SaaS product landing page with animated hero, metrics banner, 3-tier feature cards, and CTA.",
    badge: "Popular",
    html: `
      <div class="page-wrap">
        <header class="navbar">
          <div class="nav-logo">⚡ NEXUS.AI</div>
          <nav class="nav-links">
            <a href="#features">Features</a>
            <a href="#metrics">Impact</a>
            <a href="#cta" class="nav-btn">Start Free Trial →</a>
          </nav>
        </header>

        <section class="hero-section">
          <div class="badge">✨ v2.4 ENGINE DEPLOYED</div>
          <h1 class="hero-title">Automate workflows with<br><span class="gradient-text">intelligent generative systems</span></h1>
          <p class="hero-sub">The next-generation automation platform designed for engineering teams that move fast and build scalable architectures.</p>
          <div class="btn-group">
            <a href="#cta" class="btn-primary">Deploy Workspace Free</a>
            <a href="#features" class="btn-secondary">View Interactive Demo</a>
          </div>
        </section>

        <section id="metrics" class="metrics-grid">
          <div class="metric-card">
            <div class="metric-num">99.99%</div>
            <div class="metric-label">Uptime SLA</div>
          </div>
          <div class="metric-card">
            <div class="metric-num">140ms</div>
            <div class="metric-label">Global Edge Latency</div>
          </div>
          <div class="metric-card">
            <div class="metric-num">10M+</div>
            <div class="metric-label">Daily Events Processed</div>
          </div>
        </section>

        <section id="features" class="features-section">
          <div class="section-title">ENGINEERED FOR SCALE</div>
          <h2 class="section-heading">Everything needed to ship enterprise workflows</h2>
          <div class="card-grid">
            <div class="feature-card">
              <div class="feature-icon">🛡️</div>
              <h3>Zero-Trust Security</h3>
              <p>End-to-end encryption with automated compliance auditing and SOC2 certification out-of-the-box.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">⚡</div>
              <h3>Edge Execution</h3>
              <p>Run serverless functions closest to your end users with sub-millisecond cold starts and automatic caching.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">📊</div>
              <h3>Real-Time Telemetry</h3>
              <p>Full-stack observability with streaming distributed traces, error alerts, and live memory profiling.</p>
            </div>
          </div>
        </section>

        <section id="cta" class="cta-banner">
          <h2>Ready to transform your production stack?</h2>
          <p>Join 4,000+ top engineering organizations shipping with Nexus today.</p>
          <a href="#" class="btn-primary">Claim Your Free Account →</a>
        </section>
      </div>
    `,
    css: `
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { background-color: #09090b; color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
      .page-wrap { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
      .navbar { display: flex; justify-content: space-between; align-items: center; padding: 24px 0; border-bottom: 1px solid rgba(255,255,255,0.08); }
      .nav-logo { font-weight: 800; font-size: 16px; letter-spacing: 0.1em; color: #61c5ad; }
      .nav-links { display: flex; align-items: center; gap: 24px; }
      .nav-links a { color: #a1a1aa; text-decoration: none; font-size: 13px; font-weight: 600; transition: color 0.2s; }
      .nav-links a:hover { color: #fff; }
      .nav-btn { padding: 8px 18px; border-radius: 9999px; background: rgba(97,197,173,0.15); border: 1px solid rgba(97,197,173,0.4); color: #61c5ad !important; }
      .hero-section { padding: 90px 0 60px; text-align: center; display: flex; flex-direction: column; align-items: center; }
      .badge { display: inline-flex; align-items: center; padding: 6px 14px; border-radius: 9999px; background: rgba(97,197,173,0.1); border: 1px solid rgba(97,197,173,0.3); color: #61c5ad; font-size: 11px; font-weight: 700; letter-spacing: 0.15em; margin-bottom: 24px; }
      .hero-title { font-size: 52px; font-weight: 900; line-height: 1.15; letter-spacing: -0.03em; color: #ffffff; margin-bottom: 20px; }
      .gradient-text { background: linear-gradient(135deg, #61c5ad 0%, #3b82f6 50%, #a855f7 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
      .hero-sub { font-size: 17px; color: #a1a1aa; max-width: 620px; line-height: 1.6; margin-bottom: 36px; }
      .btn-group { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
      .btn-primary { padding: 14px 28px; border-radius: 9999px; background: #61c5ad; color: #000; font-weight: 800; font-size: 13px; letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none; transition: transform 0.2s; }
      .btn-primary:hover { transform: scale(1.03); }
      .btn-secondary { padding: 14px 28px; border-radius: 9999px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.15); color: #fff; font-weight: 700; font-size: 13px; text-decoration: none; }
      .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; margin: 50px 0; }
      .metric-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 28px; text-align: center; }
      .metric-num { font-size: 38px; font-weight: 900; color: #61c5ad; font-family: monospace; }
      .metric-label { font-size: 12px; color: #a1a1aa; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 6px; }
      .features-section { padding: 70px 0; }
      .section-title { font-size: 11px; font-weight: 800; letter-spacing: 0.2em; color: #61c5ad; text-transform: uppercase; text-align: center; }
      .section-heading { font-size: 34px; font-weight: 800; text-align: center; color: #fff; margin: 12px 0 44px; letter-spacing: -0.02em; }
      .card-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; }
      .feature-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 32px; transition: border-color 0.2s; }
      .feature-card:hover { border-color: rgba(97,197,173,0.4); }
      .feature-icon { font-size: 28px; margin-bottom: 16px; }
      .feature-card h3 { font-size: 19px; font-weight: 700; color: #fff; margin-bottom: 10px; }
      .feature-card p { font-size: 14px; color: #a1a1aa; line-height: 1.6; }
      .cta-banner { background: linear-gradient(135deg, rgba(97,197,173,0.1) 0%, rgba(59,130,246,0.1) 100%); border: 1px solid rgba(97,197,173,0.3); border-radius: 24px; padding: 60px 32px; text-align: center; margin: 60px 0 90px; }
      .cta-banner h2 { font-size: 32px; font-weight: 800; color: #fff; margin-bottom: 12px; }
      .cta-banner p { color: #a1a1aa; font-size: 15px; margin-bottom: 28px; }
      @media (max-width: 768px) { .hero-title { font-size: 34px; } .nav-links { display: none; } }
    `,
  },
  {
    id: "agency-landing",
    name: "Agency Landing Page",
    category: "landing",
    categoryLabel: "Landing Pages",
    description: "Bold brutalist design studio & creative agency showcase with project marquee, service list, and inquiry form.",
    html: `
      <div class="agency-wrap">
        <header class="agency-header">
          <div class="studio-name">ATELIER // 2026</div>
          <div class="location-tag">BAKU / GLOBAL</div>
        </header>

        <section class="agency-hero">
          <span class="mono-label">[ 01 — CREATIVE DIRECTION & PRODUCTION ]</span>
          <h1>WE DESIGN IDENTITY, MOTION & DIGITAL EXPERIENCES THAT COMMAND ATTENTION.</h1>
          <div class="hero-foot">
            <p>Independent studio shaping high-craft brands and digital products for industry leaders.</p>
            <a href="#contact" class="agency-cta">INITIATE BRIEF →</a>
          </div>
        </section>

        <section class="services-list">
          <div class="service-item">
            <span class="num">01</span>
            <div class="service-title">BRAND ARCHITECTURE</div>
            <div class="service-desc">Visual identity systems, typography guidelines, and brand strategy for global ventures.</div>
          </div>
          <div class="service-item">
            <span class="num">02</span>
            <div class="service-title">3D & MOTION DESIGN</div>
            <div class="service-desc">Cinema 4D, Unreal Engine, and WebGL dynamic visual assets that elevate digital products.</div>
          </div>
          <div class="service-item">
            <span class="num">03</span>
            <div class="service-title">FULL-STACK ENGINEERING</div>
            <div class="service-desc">Tailored React, Next.js, and headless CMS web platforms engineered for micro-latency.</div>
          </div>
        </section>
      </div>
    `,
    css: `
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { background-color: #050505; color: #e4e4e7; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
      .agency-wrap { max-width: 1280px; margin: 0 auto; padding: 32px 24px; }
      .agency-header { display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.15); padding-bottom: 20px; font-family: monospace; font-size: 13px; font-weight: 700; letter-spacing: 0.15em; color: #61c5ad; }
      .agency-hero { padding: 80px 0 60px; border-bottom: 1px solid rgba(255,255,255,0.15); }
      .mono-label { font-family: monospace; font-size: 11px; color: #a1a1aa; letter-spacing: 0.2em; display: block; margin-bottom: 24px; }
      .agency-hero h1 { font-size: 48px; font-weight: 900; line-height: 1.05; letter-spacing: -0.04em; color: #fff; max-width: 1100px; margin-bottom: 40px; }
      .hero-foot { display: flex; justify-content: space-between; align-items: flex-end; gap: 32px; flex-wrap: wrap; }
      .hero-foot p { font-size: 18px; color: #a1a1aa; max-width: 500px; line-height: 1.5; }
      .agency-cta { display: inline-flex; align-items: center; padding: 16px 36px; background: #61c5ad; color: #000; font-family: monospace; font-weight: 900; font-size: 13px; letter-spacing: 0.15em; text-decoration: none; border-radius: 9999px; }
      .services-list { padding: 40px 0; }
      .service-item { display: grid; grid-template-columns: 80px 1.5fr 2fr; padding: 36px 0; border-bottom: 1px solid rgba(255,255,255,0.1); align-items: center; gap: 24px; }
      .service-item .num { font-family: monospace; font-size: 14px; color: #61c5ad; }
      .service-title { font-size: 24px; font-weight: 800; color: #fff; letter-spacing: -0.02em; }
      .service-desc { font-size: 15px; color: #a1a1aa; line-height: 1.6; }
      @media (max-width: 768px) { .agency-hero h1 { font-size: 32px; } .service-item { grid-template-columns: 1fr; gap: 12px; } }
    `,
  },
  {
    id: "portfolio-showcase",
    name: "Portfolio Showcase",
    category: "landing",
    categoryLabel: "Landing Pages",
    description: "Sleek designer portfolio with bio card, selected works grid, awards table, and contact banner.",
    html: `
      <div class="portfolio-wrap">
        <section class="intro-hero">
          <div class="profile-chip">
            <span class="status-dot"></span>
            <span>AVAILABLE FOR SELECTIVE COMMISSIONS</span>
          </div>
          <h1>Ravan Mammadov</h1>
          <p class="role-desc">Creative Director, Motion Designer & Front-End Craftsman specializing in dynamic identities and digital experiences.</p>
        </section>

        <section class="work-grid">
          <div class="work-card">
            <div class="work-thumb thumb-1"></div>
            <div class="work-meta">
              <span class="work-cat">3D MOTION & BRAND IDENTITY</span>
              <h3>Chronos Visual Core</h3>
              <p>Generative branding system and realtime motion assets for luxury Swiss horology platform.</p>
            </div>
          </div>
          <div class="work-card">
            <div class="work-thumb thumb-2"></div>
            <div class="work-meta">
              <span class="work-cat">DIGITAL PRODUCT & UI</span>
              <h3>Vortex OS Experience</h3>
              <p>Next-generation spatial operating system interface and fluid interaction mechanics.</p>
            </div>
          </div>
        </section>
      </div>
    `,
    css: `
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { background-color: #0a0a0a; color: #ededed; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
      .portfolio-wrap { max-width: 1140px; margin: 0 auto; padding: 60px 24px; }
      .intro-hero { padding: 40px 0 60px; text-align: left; }
      .profile-chip { display: inline-flex; align-items: center; gap: 8px; font-family: monospace; font-size: 11px; font-weight: 700; color: #61c5ad; background: rgba(97,197,173,0.1); border: 1px solid rgba(97,197,173,0.3); padding: 6px 14px; border-radius: 9999px; margin-bottom: 24px; }
      .status-dot { width: 6px; height: 6px; border-radius: 50%; background: #61c5ad; box-shadow: 0 0 10px #61c5ad; }
      .intro-hero h1 { font-size: 54px; font-weight: 900; letter-spacing: -0.04em; color: #fff; margin-bottom: 16px; }
      .role-desc { font-size: 18px; color: #a1a1aa; max-width: 680px; line-height: 1.6; }
      .work-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); gap: 32px; }
      .work-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; overflow: hidden; transition: transform 0.3s ease; }
      .work-card:hover { transform: translateY(-6px); }
      .work-thumb { height: 260px; background: linear-gradient(135deg, #1f2937, #111827); }
      .thumb-1 { background: radial-gradient(circle at top right, rgba(97,197,173,0.4), #09090b); }
      .thumb-2 { background: radial-gradient(circle at bottom left, rgba(59,130,246,0.4), #09090b); }
      .work-meta { padding: 28px; }
      .work-cat { font-family: monospace; font-size: 10px; font-weight: 700; color: #61c5ad; letter-spacing: 0.15em; display: block; margin-bottom: 8px; }
      .work-meta h3 { font-size: 22px; font-weight: 800; color: #fff; margin-bottom: 8px; }
      .work-meta p { font-size: 14px; color: #a1a1aa; line-height: 1.5; }
      @media (max-width: 768px) { .intro-hero h1 { font-size: 38px; } }
    `,
  },
  {
    id: "product-launch",
    name: "Product Launch",
    category: "landing",
    categoryLabel: "Landing Pages",
    description: "High-impact new product reveal with countdown banner, 3D spec highlights, and pre-order registration.",
    html: `
      <div class="launch-wrap">
        <div class="launch-badge">NOW REVEALING — GEN 3</div>
        <h1 class="launch-title">The Apex Headset</h1>
        <p class="launch-sub">Spatial Audio. True Lossless Wireless. Zero-Latency Ergonomics.</p>
        <div class="launch-hero-img"></div>
        <div class="specs-bar">
          <div class="spec-item"><span class="val">48 hrs</span><span class="lbl">Battery Life</span></div>
          <div class="spec-item"><span class="val">0.8 ms</span><span class="lbl">Latency</span></div>
          <div class="spec-item"><span class="val">Lossless</span><span class="lbl">96kHz / 24-bit</span></div>
        </div>
        <div class="preorder-box">
          <input type="email" placeholder="Enter your email for early access..." class="preorder-input" />
          <button class="preorder-btn">PRE-ORDER NOW</button>
        </div>
      </div>
    `,
    css: `
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { background-color: #070708; color: #ededed; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
      .launch-wrap { max-width: 960px; margin: 0 auto; padding: 80px 24px; text-align: center; }
      .launch-badge { display: inline-block; font-family: monospace; font-size: 11px; font-weight: 700; color: #61c5ad; letter-spacing: 0.2em; margin-bottom: 20px; }
      .launch-title { font-size: 56px; font-weight: 900; letter-spacing: -0.04em; color: #fff; margin-bottom: 12px; }
      .launch-sub { font-size: 18px; color: #a1a1aa; margin-bottom: 40px; }
      .launch-hero-img { height: 320px; border-radius: 28px; background: radial-gradient(circle, rgba(97,197,173,0.2) 0%, rgba(255,255,255,0.02) 70%); border: 1px solid rgba(255,255,255,0.1); margin-bottom: 40px; }
      .specs-bar { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 48px; }
      .spec-item { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 20px; }
      .spec-item .val { font-size: 28px; font-weight: 800; color: #fff; display: block; }
      .spec-item .lbl { font-size: 11px; font-family: monospace; color: #61c5ad; text-transform: uppercase; margin-top: 4px; display: block; }
      .preorder-box { display: flex; gap: 12px; max-width: 520px; margin: 0 auto; }
      .preorder-input { flex: 1; padding: 14px 20px; border-radius: 9999px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.15); color: #fff; font-size: 14px; outline: none; }
      .preorder-btn { padding: 14px 28px; border-radius: 9999px; background: #61c5ad; color: #000; font-weight: 800; font-size: 12px; letter-spacing: 0.1em; border: none; cursor: pointer; }
      @media (max-width: 768px) { .launch-title { font-size: 38px; } .preorder-box { flex-direction: column; } }
    `,
  },
  {
    id: "event-landing",
    name: "Event Landing Page",
    category: "landing",
    categoryLabel: "Landing Pages",
    description: "Design summit & conference landing page with date badge, keynote speaker cards, and ticket registration.",
    html: `
      <div class="event-wrap">
        <div class="event-header">
          <div class="event-date">⚡ OCTOBER 24-26, 2026 // LIVE & VIRTUAL</div>
          <h1 class="event-title">SYNAPSE DESIGN CONF</h1>
          <p class="event-desc">The premier gathering of product designers, motion artists, and creative technologists shaping the spatial computing era.</p>
          <div class="ticket-btn-box">
            <a href="#" class="ticket-btn">RESERVE YOUR PASS →</a>
          </div>
        </div>

        <div class="speakers-section">
          <h2 class="speakers-title">KEYNOTE SPEAKERS</h2>
          <div class="speakers-grid">
            <div class="speaker-card">
              <div class="speaker-avatar"></div>
              <h3>Elena Rostova</h3>
              <p class="speaker-role">VP of Design, Neuralis</p>
            </div>
            <div class="speaker-card">
              <div class="speaker-avatar"></div>
              <h3>Marcus Thorne</h3>
              <p class="speaker-role">Principal Art Director, Hyperion</p>
            </div>
            <div class="speaker-card">
              <div class="speaker-avatar"></div>
              <h3>Kai Tanaka</h3>
              <p class="speaker-role">Lead Motion Engineer, VectorX</p>
            </div>
          </div>
        </div>
      </div>
    `,
    css: `
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { background-color: #0a0a0c; color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
      .event-wrap { max-width: 1100px; margin: 0 auto; padding: 70px 24px; }
      .event-header { text-align: center; padding-bottom: 60px; border-bottom: 1px solid rgba(255,255,255,0.1); }
      .event-date { font-family: monospace; font-size: 12px; font-weight: 700; color: #61c5ad; letter-spacing: 0.18em; margin-bottom: 20px; }
      .event-title { font-size: 56px; font-weight: 900; letter-spacing: -0.04em; color: #fff; margin-bottom: 18px; }
      .event-desc { font-size: 17px; color: #a1a1aa; max-width: 600px; margin: 0 auto 36px; line-height: 1.6; }
      .ticket-btn { display: inline-block; padding: 16px 36px; border-radius: 9999px; background: #61c5ad; color: #000; font-family: monospace; font-weight: 900; font-size: 13px; letter-spacing: 0.12em; text-decoration: none; }
      .speakers-section { padding-top: 60px; }
      .speakers-title { font-size: 12px; font-family: monospace; font-weight: 800; color: #a1a1aa; letter-spacing: 0.2em; text-align: center; margin-bottom: 36px; }
      .speakers-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; }
      .speaker-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 32px; text-align: center; }
      .speaker-avatar { width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #61c5ad, #3b82f6); margin: 0 auto 18px; }
      .speaker-card h3 { font-size: 20px; font-weight: 800; color: #fff; margin-bottom: 6px; }
      .speaker-role { font-size: 13px; color: #a1a1aa; font-family: monospace; }
      @media (max-width: 768px) { .event-title { font-size: 36px; } }
    `,
  },
  {
    id: "newsletter-landing",
    name: "Newsletter Landing Page",
    category: "landing",
    categoryLabel: "Landing Pages",
    description: "Clean editorial newsletter subscription page with issue preview and subscriber testimonial counter.",
    html: `
      <div class="news-wrap">
        <div class="news-icon">✉️</div>
        <span class="news-tag">THE WEEKLY CREATIVE DISPATCH</span>
        <h1 class="news-title">Curated signals at the intersection of design, motion & code</h1>
        <p class="news-desc">Every Sunday morning, join 24,000+ creative directors, front-end architects, and founders for deep insights, curated tools, and visual essays.</p>
        
        <form class="news-form" onsubmit="return false;">
          <input type="email" placeholder="you@company.com" class="news-input" />
          <button type="submit" class="news-submit">JOIN THE DISPATCH →</button>
        </form>
        <div class="news-foot">No spam. One-click unsubscribe anytime. 100% free.</div>
      </div>
    `,
    css: `
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { background-color: #09090b; color: #ededed; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
      .news-wrap { max-width: 760px; margin: 0 auto; padding: 100px 24px; text-align: center; }
      .news-icon { font-size: 40px; margin-bottom: 16px; }
      .news-tag { font-family: monospace; font-size: 11px; font-weight: 700; color: #61c5ad; letter-spacing: 0.2em; display: block; margin-bottom: 20px; }
      .news-title { font-size: 44px; font-weight: 900; letter-spacing: -0.03em; color: #fff; line-height: 1.15; margin-bottom: 20px; }
      .news-desc { font-size: 17px; color: #a1a1aa; line-height: 1.6; margin-bottom: 40px; }
      .news-form { display: flex; gap: 12px; max-width: 500px; margin: 0 auto 16px; }
      .news-input { flex: 1; padding: 15px 22px; border-radius: 9999px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); color: #fff; font-size: 14px; outline: none; }
      .news-submit { padding: 15px 26px; border-radius: 9999px; background: #61c5ad; color: #000; font-weight: 800; font-size: 12px; letter-spacing: 0.1em; border: none; cursor: pointer; }
      .news-foot { font-size: 12px; font-family: monospace; color: #71717a; }
      @media (max-width: 768px) { .news-title { font-size: 32px; } .news-form { flex-direction: column; } }
    `,
  },

  // ─── 2. MARKETING ───
  {
    id: "pricing-section",
    name: "Pricing Section",
    category: "marketing",
    categoryLabel: "Marketing",
    description: "3-tier glassmorphic pricing table with monthly/yearly toggle, popular plan spotlight, and feature checklist.",
    html: `
      <div class="pricing-wrap">
        <div class="pricing-header">
          <span class="p-tag">TRANSPARENT VALUE</span>
          <h2>Simple, predictable plans for every stage</h2>
          <p>Start free, scale seamlessly when your product takes off.</p>
        </div>

        <div class="pricing-grid">
          <div class="p-card">
            <h3>Starter</h3>
            <div class="p-price">$0 <span>/ mo</span></div>
            <p class="p-desc">Ideal for solo creators and side project explorations.</p>
            <ul class="p-features">
              <li>✓ 3 Active Projects</li>
              <li>✓ Standard Edge CDN</li>
              <li>✓ Community Support</li>
            </ul>
            <a href="#" class="p-btn-ghost">Get Started</a>
          </div>

          <div class="p-card p-highlight">
            <div class="p-badge">MOST POPULAR</div>
            <h3>Pro Creator</h3>
            <div class="p-price">$29 <span>/ mo</span></div>
            <p class="p-desc">For high-output designers, developers, and growing teams.</p>
            <ul class="p-features">
              <li>✓ Unlimited Projects</li>
              <li>✓ Sub-millisecond Global Edge</li>
              <li>✓ Real-Time Collaboration</li>
              <li>✓ Priority 24/7 SLA Support</li>
            </ul>
            <a href="#" class="p-btn-primary">Upgrade to Pro →</a>
          </div>

          <div class="p-card">
            <h3>Enterprise</h3>
            <div class="p-price">Custom</div>
            <p class="p-desc">Dedicated infrastructure and custom compliance for organizations.</p>
            <ul class="p-features">
              <li>✓ Dedicated VPC Cluster</li>
              <li>✓ Custom SOC2 Audits</li>
              <li>✓ Tailored Contract & Invoicing</li>
            </ul>
            <a href="#" class="p-btn-ghost">Contact Sales</a>
          </div>
        </div>
      </div>
    `,
    css: `
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { background-color: #0a0a0a; color: #ededed; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
      .pricing-wrap { max-width: 1140px; margin: 0 auto; padding: 80px 24px; }
      .pricing-header { text-align: center; margin-bottom: 56px; }
      .p-tag { font-family: monospace; font-size: 11px; font-weight: 700; color: #61c5ad; letter-spacing: 0.2em; text-transform: uppercase; }
      .pricing-header h2 { font-size: 38px; font-weight: 900; color: #fff; margin: 12px 0 10px; letter-spacing: -0.02em; }
      .pricing-header p { font-size: 16px; color: #a1a1aa; }
      .pricing-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; align-items: stretch; }
      .p-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; padding: 36px; display: flex; flex-direction: column; position: relative; }
      .p-highlight { border-color: rgba(97,197,173,0.5); background: rgba(97,197,173,0.04); box-shadow: 0 0 30px rgba(97,197,173,0.1); }
      .p-badge { position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: #61c5ad; color: #000; font-family: monospace; font-size: 10px; font-weight: 800; padding: 4px 12px; border-radius: 9999px; }
      .p-card h3 { font-size: 22px; font-weight: 800; color: #fff; margin-bottom: 12px; }
      .p-price { font-size: 42px; font-weight: 900; color: #fff; margin-bottom: 8px; }
      .p-price span { font-size: 14px; color: #a1a1aa; font-weight: 500; }
      .p-desc { font-size: 13px; color: #a1a1aa; margin-bottom: 24px; line-height: 1.5; }
      .p-features { list-style: none; margin-bottom: 32px; flex: 1; }
      .p-features li { font-size: 13px; color: #d4d4d8; margin-bottom: 12px; }
      .p-btn-primary { display: block; text-align: center; padding: 14px 24px; border-radius: 9999px; background: #61c5ad; color: #000; font-weight: 800; font-size: 12px; letter-spacing: 0.1em; text-decoration: none; text-transform: uppercase; }
      .p-btn-ghost { display: block; text-align: center; padding: 14px 24px; border-radius: 9999px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.15); color: #fff; font-weight: 700; font-size: 12px; text-decoration: none; }
    `,
  },
  {
    id: "testimonial-section",
    name: "Testimonials Section",
    category: "marketing",
    categoryLabel: "Marketing",
    description: "Grid of verified customer quotes with avatars, company badges, and rating stars.",
    html: `
      <div class="testi-wrap">
        <div class="testi-head">
          <span class="t-tag">VERIFIED ADVOCATES</span>
          <h2>Trusted by leading design & engineering teams</h2>
        </div>
        <div class="testi-grid">
          <div class="t-card">
            <div class="t-stars">★★★★★</div>
            <p class="t-quote">"The speed and polish of the tools blew us away. We cut our landing page iteration cycles from weeks to minutes."</p>
            <div class="t-author">
              <div class="t-avatar"></div>
              <div>
                <h4>Sarah Lin</h4>
                <span>Design Lead @ Horizon</span>
              </div>
            </div>
          </div>
          <div class="t-card">
            <div class="t-stars">★★★★★</div>
            <p class="t-quote">"Every pixel feels deliberate. The clean code export makes bridging design and production effortless."</p>
            <div class="t-author">
              <div class="t-avatar"></div>
              <div>
                <h4>David Kova</h4>
                <span>Founder @ Apex Labs</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
    css: `
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { background-color: #08080a; color: #ededed; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
      .testi-wrap { max-width: 1100px; margin: 0 auto; padding: 80px 24px; }
      .testi-head { text-align: center; margin-bottom: 50px; }
      .t-tag { font-family: monospace; font-size: 11px; font-weight: 700; color: #61c5ad; letter-spacing: 0.2em; }
      .testi-head h2 { font-size: 36px; font-weight: 900; color: #fff; margin-top: 10px; }
      .testi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px; }
      .t-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 32px; }
      .t-stars { color: #61c5ad; font-size: 16px; margin-bottom: 16px; letter-spacing: 2px; }
      .t-quote { font-size: 16px; line-height: 1.6; color: #e4e4e7; margin-bottom: 24px; font-style: italic; }
      .t-author { display: flex; align-items: center; gap: 14px; }
      .t-avatar { width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, #61c5ad, #3b82f6); }
      .t-author h4 { font-size: 15px; font-weight: 700; color: #fff; }
      .t-author span { font-size: 12px; color: #a1a1aa; font-family: monospace; }
    `,
  },
  {
    id: "faq-section",
    name: "FAQ Section",
    category: "marketing",
    categoryLabel: "Marketing",
    description: "Accordion-style frequently asked questions with expandable question cards.",
    html: `
      <div class="faq-wrap">
        <div class="faq-head">
          <span class="f-tag">HELP & ARCHITECTURE</span>
          <h2>Frequently Asked Questions</h2>
        </div>
        <div class="faq-list">
          <div class="faq-item">
            <h3>Can I export clean HTML, CSS and React JSX?</h3>
            <p>Yes, our export engine produces pristine semantic HTML5, scoped CSS styles, and production-ready React JSX components with zero vendor lock-in.</p>
          </div>
          <div class="faq-item">
            <h3>Is my project stored safely?</h3>
            <p>All projects are automatically saved in local browser storage with zero latency and can be downloaded as JSON files or ZIP archives anytime.</p>
          </div>
          <div class="faq-item">
            <h3>Can I use custom fonts and CSS tokens?</h3>
            <p>Absolutely. The built-in style manager allows full control over fluid clamp typography, HSL color tokens, and custom CSS classes.</p>
          </div>
        </div>
      </div>
    `,
    css: `
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { background-color: #0a0a0a; color: #ededed; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
      .faq-wrap { max-width: 840px; margin: 0 auto; padding: 80px 24px; }
      .faq-head { text-align: center; margin-bottom: 48px; }
      .f-tag { font-family: monospace; font-size: 11px; font-weight: 700; color: #61c5ad; letter-spacing: 0.2em; }
      .faq-head h2 { font-size: 36px; font-weight: 900; color: #fff; margin-top: 10px; }
      .faq-list { display: flex; flex-direction: column; gap: 16px; }
      .faq-item { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 24px 28px; }
      .faq-item h3 { font-size: 17px; font-weight: 700; color: #fff; margin-bottom: 10px; }
      .faq-item p { font-size: 14px; color: #a1a1aa; line-height: 1.6; }
    `,
  },
  {
    id: "cta-section",
    name: "CTA Section",
    category: "marketing",
    categoryLabel: "Marketing",
    description: "High-converting action banner with glowing gradient backdrop and dual button triggers.",
    html: `
      <div class="cta-wrap">
        <div class="cta-inner">
          <span class="cta-tag">ACCELERATE PRODUCTION</span>
          <h2>Start building your next digital masterpiece</h2>
          <p>Join thousands of visionary creators shipping faster with our modular visual workspace.</p>
          <div class="cta-actions">
            <a href="#" class="cta-primary">LAUNCH PROJECT NOW →</a>
            <a href="#" class="cta-secondary">DOCUMENTATION</a>
          </div>
        </div>
      </div>
    `,
    css: `
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { background-color: #0a0a0a; color: #ededed; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
      .cta-wrap { max-width: 1060px; margin: 0 auto; padding: 80px 24px; }
      .cta-inner { background: linear-gradient(135deg, rgba(97,197,173,0.15) 0%, rgba(59,130,246,0.15) 100%); border: 1px solid rgba(97,197,173,0.4); border-radius: 28px; padding: 70px 40px; text-align: center; }
      .cta-tag { font-family: monospace; font-size: 11px; font-weight: 700; color: #61c5ad; letter-spacing: 0.2em; display: block; margin-bottom: 16px; }
      .cta-inner h2 { font-size: 40px; font-weight: 900; color: #fff; margin-bottom: 16px; letter-spacing: -0.03em; }
      .cta-inner p { font-size: 16px; color: #a1a1aa; max-width: 580px; margin: 0 auto 36px; line-height: 1.6; }
      .cta-actions { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
      .cta-primary { padding: 16px 36px; border-radius: 9999px; background: #61c5ad; color: #000; font-family: monospace; font-weight: 900; font-size: 12px; letter-spacing: 0.12em; text-decoration: none; }
      .cta-secondary { padding: 16px 36px; border-radius: 9999px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.15); color: #fff; font-family: monospace; font-weight: 700; font-size: 12px; letter-spacing: 0.12em; text-decoration: none; }
      @media (max-width: 768px) { .cta-inner h2 { font-size: 28px; } }
    `,
  },

  // ─── 3. SOCIAL / CONTENT ───
  {
    id: "instagram-post",
    name: "Instagram Post (1:1)",
    category: "social",
    categoryLabel: "Social & Content",
    description: "Square 1080x1080 social media graphic canvas with bold typography, branding chip, and accent gradients.",
    html: `
      <div class="insta-canvas">
        <div class="insta-top">
          <span class="insta-brand">RVAN.ME // INSIGHTS</span>
          <span class="insta-date">ISSUE #42</span>
        </div>
        <div class="insta-center">
          <div class="insta-tag">DESIGN SYSTEM PRINCIPLE</div>
          <h2>"Design is not how it looks. It's how seamlessly it adapts to human intent."</h2>
        </div>
        <div class="insta-bottom">
          <div class="insta-author-box">
            <div class="insta-author-pic"></div>
            <div>
              <strong>Ravan Mammadov</strong>
              <span>Creative Director</span>
            </div>
          </div>
          <span class="insta-swipe">SWIPE →</span>
        </div>
      </div>
    `,
    css: `
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { background-color: #050505; display: flex; justify-content: center; padding: 40px 10px; }
      .insta-canvas { width: 540px; height: 540px; background: #0e0e11; border: 1px solid rgba(255,255,255,0.15); border-radius: 20px; padding: 40px; display: flex; flex-direction: column; justify-content: space-between; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; position: relative; }
      .insta-top { display: flex; justify-content: space-between; font-family: monospace; font-size: 11px; font-weight: 700; color: #61c5ad; }
      .insta-center { margin: auto 0; }
      .insta-tag { font-family: monospace; font-size: 10px; font-weight: 700; color: #a1a1aa; letter-spacing: 0.15em; margin-bottom: 14px; }
      .insta-center h2 { font-size: 26px; font-weight: 800; color: #fff; line-height: 1.35; letter-spacing: -0.02em; }
      .insta-bottom { display: flex; justify-content: space-between; align-items: center; }
      .insta-author-box { display: flex; align-items: center; gap: 10px; }
      .insta-author-pic { width: 36px; height: 36px; border-radius: 50%; background: #61c5ad; }
      .insta-author-box strong { font-size: 12px; color: #fff; display: block; }
      .insta-author-box span { font-size: 10px; color: #a1a1aa; font-family: monospace; }
      .insta-swipe { font-family: monospace; font-size: 11px; font-weight: 700; color: #61c5ad; }
    `,
  },
  {
    id: "instagram-story",
    name: "Instagram Story (9:16)",
    category: "social",
    categoryLabel: "Social & Content",
    description: "Vertical 1080x1920 mobile story layout with countdown sticker, feature bullet points, and swipe up trigger.",
    html: `
      <div class="story-canvas">
        <div class="story-header">
          <span class="story-chip">⚡ NEW RELEASE</span>
          <span class="story-time">TODAY</span>
        </div>
        <div class="story-body">
          <h1>THE NEXT WAVE OF CREATIVE AI</h1>
          <p>Explore 100+ curated design tokens, shaders, and micro-interactions.</p>
        </div>
        <div class="story-footer">
          <div class="swipe-arrow">⌃</div>
          <span class="swipe-text">SWIPE UP TO EXPLORE</span>
        </div>
      </div>
    `,
    css: `
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { background-color: #050505; display: flex; justify-content: center; padding: 40px 10px; }
      .story-canvas { width: 360px; height: 640px; background: radial-gradient(circle at top, #182823 0%, #09090b 80%); border: 1px solid rgba(97,197,173,0.3); border-radius: 28px; padding: 36px 28px; display: flex; flex-direction: column; justify-content: space-between; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
      .story-header { display: flex; justify-content: space-between; font-family: monospace; font-size: 11px; }
      .story-chip { color: #61c5ad; font-weight: 700; }
      .story-time { color: #a1a1aa; }
      .story-body h1 { font-size: 32px; font-weight: 900; color: #fff; line-height: 1.15; margin-bottom: 14px; letter-spacing: -0.03em; }
      .story-body p { font-size: 14px; color: #a1a1aa; line-height: 1.5; }
      .story-footer { text-align: center; }
      .swipe-arrow { font-size: 20px; color: #61c5ad; animation: bounce 1.5s infinite; }
      .swipe-text { font-family: monospace; font-size: 11px; font-weight: 700; color: #fff; letter-spacing: 0.15em; }
    `,
  },
  {
    id: "linkedin-post",
    name: "LinkedIn Post Banner",
    category: "social",
    categoryLabel: "Social & Content",
    description: "Landscape 1200x628 professional LinkedIn carousel cover / article banner.",
    html: `
      <div class="li-canvas">
        <div class="li-tag">ENGINEERING & CRAFT</div>
        <h1>HOW WE SCALED TO 10,000,000 EVENTS WITH ZERO COLD STARTS</h1>
        <div class="li-foot">
          <div class="li-brand">RVAN.ME // ARCHITECTURE SERIES</div>
          <div class="li-read">5 MIN READ →</div>
        </div>
      </div>
    `,
    css: `
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { background-color: #050505; display: flex; justify-content: center; padding: 40px 10px; }
      .li-canvas { width: 600px; height: 314px; background: linear-gradient(135deg, #0e1217 0%, #050505 100%); border: 1px solid rgba(255,255,255,0.12); border-radius: 16px; padding: 36px; display: flex; flex-direction: column; justify-content: space-between; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
      .li-tag { font-family: monospace; font-size: 11px; font-weight: 700; color: #61c5ad; letter-spacing: 0.2em; }
      .li-canvas h1 { font-size: 24px; font-weight: 900; color: #fff; line-height: 1.25; letter-spacing: -0.02em; }
      .li-foot { display: flex; justify-content: space-between; font-family: monospace; font-size: 11px; font-weight: 700; }
      .li-brand { color: #a1a1aa; }
      .li-read { color: #61c5ad; }
    `,
  },
];
