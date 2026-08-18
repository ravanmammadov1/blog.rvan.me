import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, BookOpen, Wrench, Compass, Sparkles, ArrowRight, CornerDownLeft } from "lucide-react";
import { INTERACTIVE_TOOLS } from "../lib/toolsRegistry";
import { TOPIC_HUBS } from "../../lib/topicHubs";
import { MASTER_EDITORIAL_BLOGS } from "../../lib/editorialBlogRegistry";
import { useLanguage } from "../../lib/i18n/LanguageContext";
import { trackSearchDiscovery } from "../../lib/analytics/events";

interface SearchItem {
  id: string;
  title: string;
  subtitle: string;
  type: "ARTICLE" | "TOOL" | "TOPIC" | "RESOURCE";
  path: string;
  badgeColor: string;
  icon: string;
}

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { getLocalizedPath, language } = useLanguage();
  const isAz = language === "az";

  // Build searchable index from all platform entities
  const searchCorpus: SearchItem[] = useMemo(() => {
    const items: SearchItem[] = [];

    // 1. Topic Hubs
    TOPIC_HUBS.forEach((hub) => {
      items.push({
        id: `topic-${hub.id}`,
        title: isAz ? hub.name_az : hub.name,
        subtitle: isAz ? hub.headline_az : hub.headline,
        type: "TOPIC",
        path: `/topics/${hub.slug}`,
        badgeColor: "text-purple-400 border-purple-500/30 bg-purple-500/10",
        icon: hub.icon || "🧭",
      });
    });

    // 2. Interactive Flagship Tools
    INTERACTIVE_TOOLS.forEach((tool) => {
      items.push({
        id: `tool-${tool.id}`,
        title: isAz ? tool.name_az || tool.name : tool.name,
        subtitle: isAz ? tool.description_az || tool.description : tool.description,
        type: "TOOL",
        path: tool.path,
        badgeColor: "text-sky-400 border-sky-500/30 bg-sky-500/10",
        icon: tool.icon || "⚡",
      });
    });

    // 3. Master Editorial Essays
    MASTER_EDITORIAL_BLOGS.forEach((blog) => {
      const slugStr = typeof blog.slug === "string" ? blog.slug : blog.slug?.current || blog._id;
      items.push({
        id: `blog-${slugStr}`,
        title: isAz && blog.title_az ? blog.title_az : blog.title,
        subtitle: isAz && blog.excerpt_az ? blog.excerpt_az : blog.excerpt,
        type: "ARTICLE",
        path: `/blog/${slugStr}`,
        badgeColor: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
        icon: "📄",
      });
    });

    // 4. Curated Core Resources
    items.push({
      id: "res-fonts",
      title: isAz ? "Google Şriftləri Kataloqu (2,000+ Şrift)" : "Curated Google Fonts Catalog",
      subtitle: isAz ? "Canlı nümayiş, variativ oxlar və CSS kodları" : "Live specimen editor, variable axes & CSS snippets",
      type: "RESOURCE",
      path: "/resources?category=fonts",
      badgeColor: "text-amber-400 border-amber-500/30 bg-amber-500/10",
      icon: "🔤",
    });
    items.push({
      id: "res-icons",
      title: isAz ? "Lucide Vektor İkon Kolleksiyası" : "Lucide Vector Icon Library",
      subtitle: isAz ? "UI/UX dizayn üçün minlərlə təmiz SVG ikon" : "Thousands of clean SVG icons for UI/UX applications",
      type: "RESOURCE",
      path: "/resources?category=icons",
      badgeColor: "text-amber-400 border-amber-500/30 bg-amber-500/10",
      icon: "✨",
    });

    return items;
  }, [isAz]);

  // Filter results
  const filteredResults = useMemo(() => {
    if (!query.trim()) {
      // Return top featured recommendations
      return searchCorpus.slice(0, 8);
    }

    const q = query.toLowerCase().trim();
    return searchCorpus
      .filter((item) => {
        return (
          item.title.toLowerCase().includes(q) ||
          item.subtitle.toLowerCase().includes(q) ||
          item.type.toLowerCase().includes(q)
        );
      })
      .slice(0, 10);
  }, [query, searchCorpus]);

  // Focus input on open & track search opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
      trackSearchDiscovery("search_opened");
    } else {
      setQuery("");
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredResults.length));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredResults.length) % Math.max(1, filteredResults.length));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const selected = filteredResults[selectedIndex];
        if (selected) {
          trackSearchDiscovery("result_selected", {
            resultType: selected.type,
            targetPath: selected.path,
            hasQuery: Boolean(query.trim()),
          });
          navigate(getLocalizedPath(selected.path));
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredResults, selectedIndex, navigate, getLocalizedPath, onClose, query]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-20 sm:pt-28 px-4 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl border border-white/10 bg-neutral-950/95 p-4 shadow-2xl space-y-4 backdrop-blur-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Field */}
        <div className="relative flex items-center border-b border-white/10 pb-3">
          <Search size={18} className="text-primary shrink-0 ml-2" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder={
              isAz
                ? "Məqalələr, alətlər, mövzu habları və ya şriftləri axtarın..."
                : "Search articles, interactive tools, topic hubs, or fonts..."
            }
            className="w-full bg-transparent px-3 py-2 text-sm sm:text-base font-medium text-foreground focus:outline-none placeholder:text-muted-foreground/50"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 text-muted-foreground hover:text-white"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto space-y-1.5 pr-1">
          {filteredResults.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground">
              {isAz ? "Heç bir nəticə tapılmadı." : "No matching articles, tools, or resources found."}
            </div>
          ) : (
            filteredResults.map((item, idx) => {
              const isSelected = idx === selectedIndex;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    trackSearchDiscovery("result_selected", {
                      resultType: item.type,
                      targetPath: item.path,
                      hasQuery: Boolean(query.trim()),
                    });
                    navigate(getLocalizedPath(item.path));
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between gap-3 rounded-xl p-3 text-left transition-all ${
                    isSelected
                      ? "bg-white/10 border border-primary/40 shadow-sm"
                      : "bg-white/[0.02] border border-transparent hover:bg-white/[0.05]"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xl shrink-0">{item.icon}</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-foreground truncate">
                          {item.title}
                        </span>
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border mono shrink-0 ${item.badgeColor}`}>
                          {item.type}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground truncate max-w-md mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 text-muted-foreground">
                    {isSelected && (
                      <span className="text-[10px] mono text-primary flex items-center gap-1">
                        <span>Select</span>
                        <CornerDownLeft size={10} />
                      </span>
                    )}
                    <ArrowRight size={14} className={isSelected ? "text-primary" : "text-muted-foreground/40"} />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer info & shortcut guide */}
        <div className="flex items-center justify-between border-t border-white/10 pt-3 text-[10px] text-muted-foreground/60 mono px-1">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="rounded bg-white/10 px-1 py-0.5">↑</kbd> <kbd className="rounded bg-white/10 px-1 py-0.5">↓</kbd> to navigate
            </span>
            <span>
              <kbd className="rounded bg-white/10 px-1 py-0.5">↵</kbd> to select
            </span>
            <span>
              <kbd className="rounded bg-white/10 px-1 py-0.5">esc</kbd> to close
            </span>
          </div>

          <span className="text-primary font-bold">RVAN ECOSYSTEM SEARCH</span>
        </div>
      </div>
    </div>
  );
}
