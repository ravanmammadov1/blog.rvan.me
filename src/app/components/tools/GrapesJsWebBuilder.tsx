import React, { useEffect, useRef, useState } from "react";
import grapesjs, { Editor } from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import {
  Monitor,
  Tablet,
  Smartphone,
  Undo,
  Redo,
  Eye,
  Code2,
  Download,
  Trash2,
  Layers,
  Palette,
  LayoutGrid,
  Settings2,
  Copy,
  Check,
  Sparkles,
  Maximize2,
  Minimize2,
  FileCode,
  Zap,
} from "lucide-react";
import { useLanguage } from "../../../lib/i18n/LanguageContext";

// Starter Templates
const STARTER_TEMPLATES: Record<string, { html: string; css: string }> = {
  hero: {
    html: `
      <section class="rvan-hero">
        <div class="rvan-badge">⚡ NEXT-GEN CREATIVE WORKSPACE</div>
        <h1 class="rvan-title">Design Ideas.<br><span class="rvan-gradient">Build the Future.</span></h1>
        <p class="rvan-desc">A high-performance digital ecosystem for modern designers, art directors, and engineers.</p>
        <div class="rvan-btn-group">
          <a href="#" class="rvan-btn rvan-btn-primary">Get Started Now →</a>
          <a href="#" class="rvan-btn rvan-btn-secondary">Explore Features</a>
        </div>
      </section>
    `,
    css: `
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background-color: #0a0a0a; color: #ededed; }
      .rvan-hero { padding: 100px 24px; text-align: center; max-width: 960px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; justify-content: center; }
      .rvan-badge { display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; border-radius: 9999px; background: rgba(97,197,173,0.1); border: 1px solid rgba(97,197,173,0.3); color: #61c5ad; font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 24px; }
      .rvan-title { font-size: 56px; font-weight: 900; line-height: 1.1; letter-spacing: -0.03em; margin-bottom: 20px; color: #ffffff; }
      .rvan-gradient { background: linear-gradient(135deg, #61c5ad 0%, #426fba 50%, #984f9f 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
      .rvan-desc { font-size: 18px; color: #a1a1aa; max-width: 640px; margin-bottom: 36px; line-height: 1.6; }
      .rvan-btn-group { display: flex; flex-wrap: wrap; gap: 16px; justify-content: center; }
      .rvan-btn { padding: 14px 28px; border-radius: 9999px; font-size: 13px; font-weight: 700; text-decoration: none; text-transform: uppercase; letter-spacing: 0.12em; transition: all 0.2s ease; }
      .rvan-btn-primary { background: linear-gradient(135deg, #61c5ad 0%, #426fba 100%); color: #000000; }
      .rvan-btn-secondary { background: rgba(255,255,255,0.05); color: #ffffff; border: 1px solid rgba(255,255,255,0.15); }
      @media (max-width: 768px) { .rvan-title { font-size: 38px; } }
    `,
  },
  features: {
    html: `
      <section class="rvan-features">
        <div class="rvan-section-header">
          <span class="rvan-tag">CORE CAPABILITIES</span>
          <h2>Engineered for High-Velocity Teams</h2>
          <p>Everything you need to conceptualize, prototype, and ship world-class experiences.</p>
        </div>
        <div class="rvan-grid">
          <div class="rvan-card">
            <div class="rvan-card-icon">⚡</div>
            <h3>Sub-Second Speed</h3>
            <p>Optimized bundle splitting, static prerendering, and edge CDN cache delivers instant page loads.</p>
          </div>
          <div class="rvan-card">
            <div class="rvan-card-icon">🎨</div>
            <h3>Design Tokens</h3>
            <p>Unified HSL color systems, fluid typography clamps, and modular UI tokens ready for production.</p>
          </div>
          <div class="rvan-card">
            <div class="rvan-card-icon">🔒</div>
            <h3>Enterprise Ready</h3>
            <p>Built with robust semantic markup, WCAG AAA accessibility, and structured JSON-LD schemas.</p>
          </div>
        </div>
      </section>
    `,
    css: `
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background-color: #0a0a0a; color: #ededed; }
      .rvan-features { padding: 80px 24px; max-width: 1200px; margin: 0 auto; }
      .rvan-section-header { text-align: center; margin-bottom: 56px; }
      .rvan-tag { color: #61c5ad; font-size: 11px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; }
      .rvan-section-header h2 { font-size: 40px; font-weight: 800; color: #fff; margin: 12px 0; letter-spacing: -0.02em; }
      .rvan-section-header p { color: #a1a1aa; font-size: 16px; max-width: 580px; margin: 0 auto; }
      .rvan-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; }
      .rvan-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 32px; transition: transform 0.2s, border-color 0.2s; }
      .rvan-card:hover { transform: translateY(-4px); border-color: rgba(97,197,173,0.4); }
      .rvan-card-icon { font-size: 28px; margin-bottom: 16px; display: inline-block; }
      .rvan-card h3 { font-size: 20px; font-weight: 700; color: #fff; margin-bottom: 10px; }
      .rvan-card p { color: #a1a1aa; font-size: 14px; line-height: 1.6; }
    `,
  },
};

export default function GrapesJsWebBuilder() {
  const { language } = useLanguage();
  const editorRef = useRef<Editor | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<"blocks" | "styles" | "layers" | "traits">("blocks");
  const [activeDevice, setActiveDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [codeModalOpen, setCodeModalOpen] = useState(false);
  const [codeType, setCodeType] = useState<"html" | "css">("html");
  const [exportedHtml, setExportedHtml] = useState("");
  const [exportedCss, setExportedCss] = useState("");
  const [copied, setCopied] = useState(false);

  // Initialize GrapesJS Editor
  useEffect(() => {
    if (!containerRef.current || editorRef.current) return;

    const editor = grapesjs.init({
      container: containerRef.current,
      fromElement: false,
      height: "100%",
      width: "auto",
      storageManager: {
        type: "local",
        autosave: true,
        autoload: true,
        stepsBeforeSave: 1,
        options: {
          local: { key: "rvan_grapesjs_project" },
        },
      },
      deviceManager: {
        devices: [
          { name: "desktop", width: "" },
          { name: "tablet", width: "768px", widthMedia: "992px" },
          { name: "mobile", width: "375px", widthMedia: "480px" },
        ],
      },
      panels: { defaults: [] }, // We use our custom modern React toolbar and sidebar
      blockManager: {
        appendTo: "#gjs-blocks-container",
      },
      styleManager: {
        appendTo: "#gjs-styles-container",
        sectors: [
          {
            name: "Dimension",
            open: true,
            buildProps: ["width", "min-width", "max-width", "height", "min-height", "max-height", "margin", "padding"],
          },
          {
            name: "Typography",
            open: false,
            buildProps: ["font-family", "font-size", "font-weight", "letter-spacing", "color", "line-height", "text-align", "text-decoration"],
          },
          {
            name: "Layout & Flexbox",
            open: false,
            buildProps: ["display", "flex-direction", "justify-content", "align-items", "flex-wrap", "gap"],
          },
          {
            name: "Decorations",
            open: false,
            buildProps: ["background-color", "border-radius", "border", "box-shadow", "opacity"],
          },
          {
            name: "Extra",
            open: false,
            buildProps: ["transition", "perspective", "transform"],
          },
        ],
      },
      layerManager: {
        appendTo: "#gjs-layers-container",
      },
      traitManager: {
        appendTo: "#gjs-traits-container",
      },
    });

    // Add Built-in Pre-styled Blocks
    const bm = editor.BlockManager;

    // 1. Structural Grid Blocks
    bm.add("section-1-col", {
      label: "1 Column Section",
      category: "Layout",
      content: `<div style="padding: 40px 20px; max-width: 1200px; margin: 0 auto;"><h2>Container Heading</h2><p>Add your content here...</p></div>`,
      attributes: { class: "gjs-block-custom" },
    });

    bm.add("section-2-col", {
      label: "2 Columns Grid",
      category: "Layout",
      content: `
        <div style="display: flex; flex-wrap: wrap; gap: 24px; padding: 40px 20px; max-width: 1200px; margin: 0 auto;">
          <div style="flex: 1 1 300px; padding: 24px; background: rgba(255,255,255,0.03); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);">
            <h3>Column 1</h3>
            <p>Edit left column content.</p>
          </div>
          <div style="flex: 1 1 300px; padding: 24px; background: rgba(255,255,255,0.03); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);">
            <h3>Column 2</h3>
            <p>Edit right column content.</p>
          </div>
        </div>
      `,
    });

    bm.add("section-3-col", {
      label: "3 Columns Grid",
      category: "Layout",
      content: `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; padding: 40px 20px; max-width: 1200px; margin: 0 auto;">
          <div style="padding: 24px; background: rgba(255,255,255,0.03); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);"><h3>Card 1</h3><p>Description 1</p></div>
          <div style="padding: 24px; background: rgba(255,255,255,0.03); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);"><h3>Card 2</h3><p>Description 2</p></div>
          <div style="padding: 24px; background: rgba(255,255,255,0.03); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);"><h3>Card 3</h3><p>Description 3</p></div>
        </div>
      `,
    });

    // 2. Typography & Elements
    bm.add("heading-h1", {
      label: "Main Heading (H1)",
      category: "Typography",
      content: `<h1 style="font-size: 44px; font-weight: 800; color: #ffffff; letter-spacing: -0.02em; margin-bottom: 16px;">Headline Text</h1>`,
    });

    bm.add("paragraph-text", {
      label: "Paragraph",
      category: "Typography",
      content: `<p style="font-size: 16px; line-height: 1.6; color: #a1a1aa; margin-bottom: 16px;">High-performance digital copy crafted for clarity and engagement.</p>`,
    });

    bm.add("button-primary", {
      label: "Pill Button",
      category: "Components",
      content: `<a href="#" style="display: inline-block; padding: 12px 28px; border-radius: 9999px; background: linear-gradient(135deg, #61c5ad 0%, #426fba 100%); color: #000; font-weight: 700; text-decoration: none; font-size: 13px; letter-spacing: 0.1em; text-transform: uppercase;">Button Action</a>`,
    });

    bm.add("image-block", {
      label: "Responsive Image",
      category: "Media",
      content: `<img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80" alt="Sample" style="width: 100%; border-radius: 20px; object-fit: cover; max-height: 480px;" />`,
    });

    bm.add("cta-banner", {
      label: "CTA Banner",
      category: "Sections",
      content: `
        <div style="background: linear-gradient(135deg, rgba(97,197,173,0.1) 0%, rgba(152,79,159,0.1) 100%); border: 1px solid rgba(97,197,173,0.3); border-radius: 24px; padding: 60px 32px; text-align: center; margin: 40px auto; max-width: 1000px;">
          <h2 style="font-size: 32px; font-weight: 800; color: #fff; margin-bottom: 12px;">Ready to Elevate Your Project?</h2>
          <p style="color: #a1a1aa; font-size: 16px; margin-bottom: 24px;">Start building modular experiences today with zero friction.</p>
          <a href="#" style="display: inline-block; padding: 14px 32px; border-radius: 9999px; background: #61c5ad; color: #000; font-weight: 800; text-decoration: none;">Get in Touch →</a>
        </div>
      `,
    });

    // Check if initial storage is empty; if so, load hero starter
    editor.on("load", () => {
      const wrapper = editor.getWrapper();
      if (!wrapper || wrapper.components().length === 0) {
        editor.setComponents(STARTER_TEMPLATES.hero.html);
        editor.setStyle(STARTER_TEMPLATES.hero.css);
      }
    });

    editorRef.current = editor;

    return () => {
      editor.destroy();
      editorRef.current = null;
    };
  }, []);

  // Device switcher
  const handleSetDevice = (device: "desktop" | "tablet" | "mobile") => {
    if (!editorRef.current) return;
    editorRef.current.setDevice(device);
    setActiveDevice(device);
  };

  // Actions
  const handleUndo = () => editorRef.current?.UndoManager.undo();
  const handleRedo = () => editorRef.current?.UndoManager.redo();
  const handleClear = () => {
    if (window.confirm(language === "az" ? "Bütün kətanı təmizləmək istədiyinizdən əminsiniz?" : "Are you sure you want to clear the entire canvas?")) {
      editorRef.current?.setComponents("");
      editorRef.current?.setStyle("");
    }
  };

  const handlePreview = () => {
    if (!editorRef.current) return;
    const isPreview = editorRef.current.Commands.isActive("preview");
    if (isPreview) {
      editorRef.current.stopCommand("preview");
    } else {
      editorRef.current.runCommand("preview");
    }
  };

  const handleOpenCodeModal = () => {
    if (!editorRef.current) return;
    setExportedHtml(editorRef.current.getHtml());
    setExportedCss(editorRef.current.getCss() || "");
    setCodeModalOpen(true);
  };

  const handleDownload = () => {
    if (!editorRef.current) return;
    const html = editorRef.current.getHtml();
    const css = editorRef.current.getCss() || "";
    const fullDoc = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Created with Rvan.me Visual Builder</title>
  <style>
${css}
  </style>
</head>
<body>
${html}
</body>
</html>`;

    const blob = new Blob([fullDoc], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rvan-webpage.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLoadTemplate = (templateKey: string) => {
    if (!editorRef.current) return;
    const tmpl = STARTER_TEMPLATES[templateKey];
    if (tmpl) {
      editorRef.current.setComponents(tmpl.html);
      editorRef.current.setStyle(tmpl.css);
    }
  };

  const handleCopyCode = () => {
    const textToCopy = codeType === "html" ? exportedHtml : exportedCss;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex flex-col bg-[#0d0d0e] text-[#ededed] border border-white/10 rounded-3xl overflow-hidden shadow-2xl transition-all ${
      isFullscreen ? "fixed inset-4 z-50 rounded-2xl" : "h-[860px] w-full"
    }`}>
      {/* ── TOP CONTROL TOOLBAR ── */}
      <div className="h-16 border-b border-white/10 bg-black/60 backdrop-blur-xl px-4 md:px-6 flex items-center justify-between gap-3 shrink-0">
        {/* Left: Branding & Templates */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-primary tracking-wider uppercase">
            <Zap size={15} className="text-primary" />
            <span className="hidden sm:inline">GRAPESJS BUILDER</span>
          </div>

          <div className="h-4 w-px bg-white/10 hidden sm:block" />

          {/* Quick Template Switcher */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleLoadTemplate("hero")}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono text-muted-foreground hover:text-white transition"
              title="Load Dark Hero Template"
            >
              Hero
            </button>
            <button
              onClick={() => handleLoadTemplate("features")}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono text-muted-foreground hover:text-white transition"
              title="Load Features Grid Template"
            >
              Features
            </button>
          </div>
        </div>

        {/* Center: Responsive Device Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-white/5 border border-white/10">
          <button
            onClick={() => handleSetDevice("desktop")}
            className={`p-1.5 rounded-lg transition ${activeDevice === "desktop" ? "bg-primary text-black" : "text-muted-foreground hover:text-white"}`}
            title="Desktop View (100%)"
          >
            <Monitor size={15} />
          </button>
          <button
            onClick={() => handleSetDevice("tablet")}
            className={`p-1.5 rounded-lg transition ${activeDevice === "tablet" ? "bg-primary text-black" : "text-muted-foreground hover:text-white"}`}
            title="Tablet View (768px)"
          >
            <Tablet size={15} />
          </button>
          <button
            onClick={() => handleSetDevice("mobile")}
            className={`p-1.5 rounded-lg transition ${activeDevice === "mobile" ? "bg-primary text-black" : "text-muted-foreground hover:text-white"}`}
            title="Mobile View (375px)"
          >
            <Smartphone size={15} />
          </button>
        </div>

        {/* Right: Actions (Undo, Redo, Code, Export, Fullscreen) */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleUndo}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-muted-foreground hover:text-white transition"
            title="Undo"
          >
            <Undo size={14} />
          </button>
          <button
            onClick={handleRedo}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-muted-foreground hover:text-white transition"
            title="Redo"
          >
            <Redo size={14} />
          </button>
          <button
            onClick={handlePreview}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-muted-foreground hover:text-white transition"
            title="Preview Mode"
          >
            <Eye size={14} />
          </button>
          <button
            onClick={handleOpenCodeModal}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-primary hover:bg-primary/10 transition flex items-center gap-1 text-xs font-mono font-bold"
            title="View Code (HTML / CSS)"
          >
            <Code2 size={14} />
            <span className="hidden md:inline">CODE</span>
          </button>
          <button
            onClick={handleDownload}
            className="p-2 rounded-xl bg-primary text-black font-bold text-xs font-mono hover:scale-105 transition flex items-center gap-1"
            title="Download index.html"
          >
            <Download size={14} />
            <span className="hidden md:inline">EXPORT</span>
          </button>
          <button
            onClick={handleClear}
            className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 border border-white/10 text-muted-foreground hover:text-rose-400 transition"
            title="Clear Canvas"
          >
            <Trash2 size={14} />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-muted-foreground hover:text-white transition"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </div>

      {/* ── WORKSPACE BODY: CANVAS + SIDEBAR ── */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Canvas Area */}
        <div className="flex-1 h-full bg-[#050505] overflow-hidden relative">
          <div ref={containerRef} className="h-full w-full" />
        </div>

        {/* Sidebar Manager Tabs & Panel */}
        <div className="w-80 md:w-88 border-l border-white/10 bg-[#0f0f11] flex flex-col shrink-0">
          {/* Sidebar Tab Selector */}
          <div className="grid grid-cols-4 border-b border-white/10 bg-black/40 p-1">
            <button
              onClick={() => setActiveTab("blocks")}
              className={`flex flex-col items-center gap-1 py-2 rounded-lg text-[10px] font-mono font-bold uppercase transition ${
                activeTab === "blocks" ? "bg-primary text-black" : "text-muted-foreground hover:text-white"
              }`}
              title="Drag and drop elements"
            >
              <LayoutGrid size={13} />
              <span>Blocks</span>
            </button>
            <button
              onClick={() => setActiveTab("styles")}
              className={`flex flex-col items-center gap-1 py-2 rounded-lg text-[10px] font-mono font-bold uppercase transition ${
                activeTab === "styles" ? "bg-primary text-black" : "text-muted-foreground hover:text-white"
              }`}
              title="Style selected element"
            >
              <Palette size={13} />
              <span>Styles</span>
            </button>
            <button
              onClick={() => setActiveTab("layers")}
              className={`flex flex-col items-center gap-1 py-2 rounded-lg text-[10px] font-mono font-bold uppercase transition ${
                activeTab === "layers" ? "bg-primary text-black" : "text-muted-foreground hover:text-white"
              }`}
              title="DOM Layers tree"
            >
              <Layers size={13} />
              <span>Layers</span>
            </button>
            <button
              onClick={() => setActiveTab("traits")}
              className={`flex flex-col items-center gap-1 py-2 rounded-lg text-[10px] font-mono font-bold uppercase transition ${
                activeTab === "traits" ? "bg-primary text-black" : "text-muted-foreground hover:text-white"
              }`}
              title="Component properties"
            >
              <Settings2 size={13} />
              <span>Traits</span>
            </button>
          </div>

          {/* Tab Content Containers */}
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <div id="gjs-blocks-container" className={activeTab === "blocks" ? "block" : "hidden"} />
            <div id="gjs-styles-container" className={activeTab === "styles" ? "block" : "hidden"} />
            <div id="gjs-layers-container" className={activeTab === "layers" ? "block" : "hidden"} />
            <div id="gjs-traits-container" className={activeTab === "traits" ? "block" : "hidden"} />
          </div>
        </div>
      </div>

      {/* ── CODE EXPORT MODAL ── */}
      {codeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[#121214] border border-white/15 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode size={16} className="text-primary" />
                <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  Generated Source Code
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex rounded-lg bg-black/40 border border-white/10 p-0.5">
                  <button
                    onClick={() => setCodeType("html")}
                    className={`px-3 py-1 text-xs font-mono font-bold rounded-md transition ${
                      codeType === "html" ? "bg-primary text-black" : "text-muted-foreground hover:text-white"
                    }`}
                  >
                    HTML
                  </button>
                  <button
                    onClick={() => setCodeType("css")}
                    className={`px-3 py-1 text-xs font-mono font-bold rounded-md transition ${
                      codeType === "css" ? "bg-primary text-black" : "text-muted-foreground hover:text-white"
                    }`}
                  >
                    CSS
                  </button>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-mono font-bold text-white transition flex items-center gap-1.5"
                >
                  {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  <span>{copied ? "COPIED" : "COPY"}</span>
                </button>
                <button
                  onClick={() => setCodeModalOpen(false)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white text-xs font-mono"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-4 flex-1 overflow-auto bg-black/60 font-mono text-xs text-zinc-300 leading-relaxed">
              <pre className="whitespace-pre-wrap">{codeType === "html" ? exportedHtml : exportedCss}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
