import React, { useState } from "react";
import { Copy, Check, Search, Globe, Share2 } from "lucide-react";

export const SeoMetaGenerator: React.FC = () => {
  const [title, setTitle] = useState("Ravan Mammadov — Creative Director & Product Designer");
  const [description, setDescription] = useState("Portfolio & curated knowledge hub featuring 1,000+ free fonts, AI tools, remote jobs, and interactive web utilities.");
  const [url, setUrl] = useState("https://www.rvan.me");
  const [ogImage, setOgImage] = useState("https://www.rvan.me/og-cover.jpg");
  const [twitterHandle, setTwitterHandle] = useState("@ravanmammadov");
  const [copied, setCopied] = useState(false);

  const generatedTags = `<!-- Primary Meta Tags -->
<title>${title}</title>
<meta name="title" content="${title}" />
<meta name="description" content="${description}" />
<link rel="canonical" href="${url}" />

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:url" content="${url}" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:image" content="${ogImage}" />

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:url" content="${url}" />
<meta property="twitter:title" content="${title}" />
<meta property="twitter:description" content="${description}" />
<meta property="twitter:image" content="${ogImage}" />
<meta property="twitter:site" content="${twitterHandle}" />`;

  const copyTags = () => {
    navigator.clipboard.writeText(generatedTags);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-6 shadow-2xl space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Search className="text-primary" size={20} /> SEO Meta Tag & OpenGraph Card Generator
          </h3>
          <p className="text-xs text-muted-foreground/80 font-medium mt-0.5">
            Generate production SEO HTML tags and test live search & social share card previews.
          </p>
        </div>
        <button
          onClick={copyTags}
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-xs font-bold text-black uppercase tracking-wider hover:bg-white transition-all shadow-lg shadow-primary/20 shrink-0"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? "COPIED TAGS!" : "COPY META TAGS HTML"}
        </button>
      </div>

      {/* Form inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.01]">
        <div>
          <label htmlFor="meta-title" className="block text-[10px] font-bold tracking-widest text-muted-foreground mono uppercase mb-1.5 flex justify-between">
            <span>Meta Title</span> <span className={`${title.length > 60 ? "text-red-400" : "text-emerald-400"}`}>{title.length}/60 chars</span>
          </label>
          <input
            id="meta-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-md border border-white/10 bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="canonical-url" className="block text-[10px] font-bold tracking-widest text-muted-foreground mono uppercase mb-1.5">Canonical URL</label>
          <input
            id="canonical-url"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full rounded-md border border-white/10 bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="meta-description" className="block text-[10px] font-bold tracking-widest text-muted-foreground mono uppercase mb-1.5 flex justify-between">
            <span>Meta Description</span> <span className={`${description.length > 160 ? "text-red-400" : "text-emerald-400"}`}>{description.length}/160 chars</span>
          </label>
          <textarea
            id="meta-description"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-md border border-white/10 bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="og-image-url" className="block text-[10px] font-bold tracking-widest text-muted-foreground mono uppercase mb-1.5">OG Cover Image URL</label>
          <input
            id="og-image-url"
            type="text"
            value={ogImage}
            onChange={(e) => setOgImage(e.target.value)}
            className="w-full rounded-md border border-white/10 bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="twitter-handle" className="block text-[10px] font-bold tracking-widest text-muted-foreground mono uppercase mb-1.5">Twitter Handle</label>
          <input
            id="twitter-handle"
            type="text"
            value={twitterHandle}
            onChange={(e) => setTwitterHandle(e.target.value)}
            className="w-full rounded-md border border-white/10 bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      {/* Previews */}
      <div className="space-y-4">
        <span className="text-[10px] font-bold tracking-widest text-muted-foreground mono uppercase">Search & Social Card Previews</span>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Google Search Preview */}
          <div className="p-4 rounded-xl border border-white/10 bg-black/40">
            <span className="text-[10px] font-bold text-muted-foreground mono block mb-2 flex items-center gap-1">
              <Globe size={11} /> Google Search Snippet
            </span>
            <span className="text-[11px] text-muted-foreground/70 block truncate mb-0.5">{url}</span>
            <h4 className="text-base font-medium text-blue-400 truncate hover:underline cursor-pointer">{title}</h4>
            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{description}</p>
          </div>

          {/* Social Share OG Preview */}
          <div className="p-4 rounded-xl border border-white/10 bg-black/40">
            <span className="text-[10px] font-bold text-muted-foreground mono block mb-2 flex items-center gap-1">
              <Share2 size={11} /> OpenGraph / Social Card Preview
            </span>
            <div className="rounded-lg border border-white/10 bg-surface overflow-hidden">
              <div className="h-28 bg-white/5 flex items-center justify-center text-xs text-muted-foreground font-mono">
                {ogImage ? <img src={ogImage} alt="OG Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} /> : "OG Image Preview"}
              </div>
              <div className="p-3">
                <span className="text-[9px] font-bold text-muted-foreground uppercase mono">{new URL(url || "https://rvan.me").hostname}</span>
                <h5 className="text-xs font-semibold text-foreground truncate mt-0.5">{title}</h5>
                <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">{description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* HTML Output */}
      <div className="relative rounded-xl border border-white/10 bg-black/60 p-4 font-mono text-xs text-emerald-400 overflow-x-auto">
        <pre>{generatedTags}</pre>
      </div>
    </div>
  );
};
export default SeoMetaGenerator;
