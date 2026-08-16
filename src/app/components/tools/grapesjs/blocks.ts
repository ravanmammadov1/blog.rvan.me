import { BlockManager } from "grapesjs";

export function registerCustomBlocks(bm: BlockManager) {
  // ─── 1. LAYOUT BLOCKS ───
  bm.add("layout-section", {
    label: "Section Container",
    category: "Layout",
    content: `
      <section style="padding: 60px 24px; max-width: 1200px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h2 style="font-size: 32px; font-weight: 800; color: #fff; margin-bottom: 8px;">Section Title</h2>
          <p style="color: #a1a1aa; font-size: 15px;">Subtitle or section description goes here.</p>
        </div>
        <div><!-- Insert elements inside section --></div>
      </section>
    `,
  });

  bm.add("layout-1-col", {
    label: "1 Column Full",
    category: "Layout",
    content: `<div style="padding: 32px 20px; max-width: 1000px; margin: 0 auto; width: 100%;"><h3>Full Width Column</h3><p>Add your text or components here.</p></div>`,
  });

  bm.add("layout-2-col", {
    label: "2 Columns Flex",
    category: "Layout",
    content: `
      <div style="display: flex; flex-wrap: wrap; gap: 24px; padding: 24px 0; width: 100%;">
        <div style="flex: 1 1 300px; padding: 24px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px;">
          <h4 style="font-size: 18px; font-weight: 700; color: #fff; margin-bottom: 8px;">Left Column</h4>
          <p style="font-size: 14px; color: #a1a1aa;">Customizable left side content.</p>
        </div>
        <div style="flex: 1 1 300px; padding: 24px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px;">
          <h4 style="font-size: 18px; font-weight: 700; color: #fff; margin-bottom: 8px;">Right Column</h4>
          <p style="font-size: 14px; color: #a1a1aa;">Customizable right side content.</p>
        </div>
      </div>
    `,
  });

  bm.add("layout-3-col", {
    label: "3 Columns Grid",
    category: "Layout",
    content: `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; padding: 24px 0; width: 100%;">
        <div style="padding: 24px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px;">
          <h4 style="font-size: 18px; font-weight: 700; color: #fff; margin-bottom: 8px;">Card 1</h4>
          <p style="font-size: 14px; color: #a1a1aa;">Card description 1.</p>
        </div>
        <div style="padding: 24px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px;">
          <h4 style="font-size: 18px; font-weight: 700; color: #fff; margin-bottom: 8px;">Card 2</h4>
          <p style="font-size: 14px; color: #a1a1aa;">Card description 2.</p>
        </div>
        <div style="padding: 24px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px;">
          <h4 style="font-size: 18px; font-weight: 700; color: #fff; margin-bottom: 8px;">Card 3</h4>
          <p style="font-size: 14px; color: #a1a1aa;">Card description 3.</p>
        </div>
      </div>
    `,
  });

  bm.add("layout-flex-row", {
    label: "Flex Row (Between)",
    category: "Layout",
    content: `
      <div style="display: flex; justify-content: space-between; align-items: center; gap: 16px; padding: 16px 0; width: 100%;">
        <div><h4 style="color: #fff; font-size: 16px;">Left Content</h4></div>
        <div><a href="#" style="color: #61c5ad; font-size: 13px; font-weight: 700; text-decoration: none;">Action Link →</a></div>
      </div>
    `,
  });

  // ─── 2. CONTENT BLOCKS ───
  bm.add("content-heading-1", {
    label: "Heading H1",
    category: "Content",
    content: `<h1 style="font-size: 48px; font-weight: 900; letter-spacing: -0.03em; color: #ffffff; margin-bottom: 16px; line-height: 1.1;">Transforming Digital Craft</h1>`,
  });

  bm.add("content-heading-2", {
    label: "Heading H2",
    category: "Content",
    content: `<h2 style="font-size: 32px; font-weight: 800; letter-spacing: -0.02em; color: #ffffff; margin-bottom: 12px;">Next Generation Features</h2>`,
  });

  bm.add("content-paragraph", {
    label: "Paragraph",
    category: "Content",
    content: `<p style="font-size: 16px; line-height: 1.6; color: #a1a1aa; margin-bottom: 16px;">Precision engineered interfaces and design tokens created for modern creators.</p>`,
  });

  bm.add("content-badge", {
    label: "Status Badge",
    category: "Content",
    content: `<span style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 9999px; background: rgba(97,197,173,0.1); border: 1px solid rgba(97,197,173,0.3); color: #61c5ad; font-size: 11px; font-weight: 700; font-family: monospace; letter-spacing: 0.15em; text-transform: uppercase;">⚡ v2.0 PRODUCTION READY</span>`,
  });

  bm.add("content-button", {
    label: "Primary Button",
    category: "Content",
    content: `<a href="#" style="display: inline-block; padding: 14px 32px; border-radius: 9999px; background: #61c5ad; color: #000; font-weight: 800; font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; text-decoration: none;">GET STARTED NOW →</a>`,
  });

  bm.add("content-divider", {
    label: "Subtle Divider",
    category: "Content",
    content: `<hr style="border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 32px 0;" />`,
  });

  // ─── 3. MARKETING BLOCKS ───
  bm.add("mkt-hero", {
    label: "Hero Block",
    category: "Marketing",
    content: `
      <div style="padding: 80px 24px; text-align: center; max-width: 900px; margin: 0 auto;">
        <span style="font-family: monospace; font-size: 11px; font-weight: 700; color: #61c5ad; letter-spacing: 0.2em; display: block; margin-bottom: 16px;">THE CREATIVE SUITE</span>
        <h1 style="font-size: 50px; font-weight: 900; color: #fff; margin-bottom: 18px; letter-spacing: -0.03em; line-height: 1.1;">Build Faster.<br><span style="color: #61c5ad;">Ship with Polish.</span></h1>
        <p style="font-size: 17px; color: #a1a1aa; margin-bottom: 32px; line-height: 1.6;">Everything designers and engineers need to craft world-class web experiences.</p>
        <div style="display: flex; gap: 16px; justify-content: center;">
          <a href="#" style="padding: 14px 32px; border-radius: 9999px; background: #61c5ad; color: #000; font-weight: 800; text-decoration: none; font-size: 12px; letter-spacing: 0.1em;">EXPLORE NOW →</a>
        </div>
      </div>
    `,
  });

  bm.add("mkt-stats", {
    label: "Stats Counter Grid",
    category: "Marketing",
    content: `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; padding: 40px 0; max-width: 1000px; margin: 0 auto; text-align: center;">
        <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 24px;">
          <div style="font-size: 36px; font-weight: 900; color: #61c5ad; font-family: monospace;">100k+</div>
          <div style="font-size: 12px; color: #a1a1aa; text-transform: uppercase; margin-top: 4px;">Active Developers</div>
        </div>
        <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 24px;">
          <div style="font-size: 36px; font-weight: 900; color: #61c5ad; font-family: monospace;">99.9%</div>
          <div style="font-size: 12px; color: #a1a1aa; text-transform: uppercase; margin-top: 4px;">Uptime Reliability</div>
        </div>
        <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 24px;">
          <div style="font-size: 36px; font-weight: 900; color: #61c5ad; font-family: monospace;">&lt;10ms</div>
          <div style="font-size: 12px; color: #a1a1aa; text-transform: uppercase; margin-top: 4px;">Edge Cold Start</div>
        </div>
      </div>
    `,
  });

  bm.add("mkt-logo-cloud", {
    label: "Logo Cloud",
    category: "Marketing",
    content: `
      <div style="padding: 40px 0; text-align: center;">
        <p style="font-family: monospace; font-size: 11px; font-weight: 700; color: #71717a; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 24px;">POWERING CREATIVE TEAMS AT</p>
        <div style="display: flex; justify-content: center; align-items: center; gap: 40px; flex-wrap: wrap; opacity: 0.6;">
          <span style="font-weight: 900; font-size: 18px; color: #fff; letter-spacing: 0.1em;">ACME CORP</span>
          <span style="font-weight: 900; font-size: 18px; color: #fff; letter-spacing: 0.1em;">VERTEX AI</span>
          <span style="font-weight: 900; font-size: 18px; color: #fff; letter-spacing: 0.1em;">HYPERION</span>
          <span style="font-weight: 900; font-size: 18px; color: #fff; letter-spacing: 0.1em;">NEXUS LABS</span>
        </div>
      </div>
    `,
  });

  // ─── 4. MEDIA BLOCKS ───
  bm.add("media-image", {
    label: "Rounded Media Image",
    category: "Media",
    content: `<img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80" alt="Visual asset" style="width: 100%; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1); object-fit: cover; max-height: 480px;" />`,
  });

  bm.add("media-gallery", {
    label: "2x2 Image Gallery",
    category: "Media",
    content: `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; padding: 24px 0;">
        <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80" style="width: 100%; height: 220px; border-radius: 16px; object-fit: cover;" />
        <img src="https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=600&q=80" style="width: 100%; height: 220px; border-radius: 16px; object-fit: cover;" />
      </div>
    `,
  });
}
