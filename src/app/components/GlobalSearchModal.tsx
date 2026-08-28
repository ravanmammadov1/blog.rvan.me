import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight, CornerDownLeft, FileText, Type, Sparkles } from "lucide-react";
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
  icon: React.ReactNode;
}

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

export default function GlobalSearchModal({ isOpen, onClose, initialQuery }: GlobalSearchModalProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { getLocalizedPath, language } = useLanguage();
  const isAz = language === "az";

  // Build searchable index from all platform entities
  const searchCorpus: SearchItem[] = useMemo(() => {
    const items: SearchItem[] = [];

    // Master Editorial Essays
    MASTER_EDITORIAL_BLOGS.forEach((blog) => {
      const slugStr = typeof blog.slug === "string" ? blog.slug : blog.slug?.current || blog._id;
      items.push({
        id: `blog-${slugStr}`,
        title: isAz && blog.title_az ? blog.title_az : blog.title,
        subtitle: isAz && blog.excerpt_az ? blog.excerpt_az : blog.excerpt,
        type: "ARTICLE",
        path: `/blog/${slugStr}`,
        badgeColor: "text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
        icon: <FileText size={16} className="text-emerald-500" />,
      });
    });

    // Curated Core Resources
    items.push({
      id: "res-fonts",
      title: isAz ? "Google Şriftləri Kataloqu (2,000+ Şrift)" : "Curated Google Fonts Catalog",
      subtitle: isAz ? "Canlı nümayiş, variativ oxlar və CSS kodları" : "Live specimen editor, variable axes & CSS snippets",
      type: "RESOURCE",
      path: "/resources?category=fonts",
      badgeColor: "text-amber-600 dark:text-amber-400 border-amber-500/30 bg-amber-500/10",
      icon: <Type size={16} className="text-amber-500" />,
    });
    items.push({
      id: "res-icons",
      title: isAz ? "Lucide Vektor İkon Kolleksiyası" : "Lucide Vector Icon Library",
      subtitle: isAz ? "UI/UX dizayn üçün minlərlə təmiz SVG ikon" : "Thousands of clean SVG icons for UI/UX applications",
      type: "RESOURCE",
      path: "/resources?category=icons",
      badgeColor: "text-amber-600 dark:text-amber-400 border-amber-500/30 bg-amber-500/10",
      icon: <Sparkles size={16} className="text-amber-500" />,
    });

    return items;
  }, [isAz]);

  // Filter results
  const filteredResults = useMemo(() => {
    if (!query.trim()) {
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
      if (initialQuery !== undefined) {
        setQuery(initialQuery);
      }
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
      trackSearchDiscovery("search_opened");
    } else {
      setQuery("");
    }
  }, [isOpen, initialQuery]);

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
            queryLength: query.trim().length,
            resultCount: filteredResults.length,
          });
          navigate(getLocalizedPath(selected.path));
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredResults, selectedIndex, navigate, getLocalizedPath, onClose, query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.26, ease: "easeOut" } }}
          exit={{ opacity: 0, transition: { duration: 0.16, ease: "easeIn" } }}
          className="fixed inset-0 z-[100] flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/[0.12] dark:bg-black/45 backdrop-blur-xs"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.28, ease: [0.25, 1, 0.5, 1] } }}
            exit={{ opacity: 0, y: -6, scale: 0.985, transition: { duration: 0.16, ease: [0.4, 0, 1, 1] } }}
            className="w-full max-w-2xl rounded-2xl border border-[#DDE1E0] dark:border-white/10 bg-white dark:bg-[#121215] p-4 sm:p-5 shadow-[0_20px_60px_rgba(15,23,42,0.10)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.55)] space-y-3.5 backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Field */}
            <div className="relative flex items-center border-b border-[#DDE1E0] dark:border-white/10 pb-3">
              <Search size={18} className="text-primary shrink-0 ml-1" />
              <input
                ref={inputRef}
                type="text"
                autoComplete="off"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder={
                  isAz
                    ? "Məqalələr, mövzular və resursları axtarın..."
                    : "Search articles, topics, and resources..."
                }
                className="w-full bg-transparent px-3 py-1.5 text-sm sm:text-base font-medium text-[#0F172A] dark:text-foreground focus:outline-none placeholder:text-[#64748B] dark:placeholder:text-muted-foreground/50"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="p-1 text-[#64748B] hover:text-[#0F172A] dark:text-muted-foreground dark:hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Results List */}
            <div className="max-h-[58vh] overflow-y-auto space-y-1.5 pr-1">
              {filteredResults.length === 0 ? (
                <div className="py-10 text-center text-xs text-[#64748B] dark:text-muted-foreground">
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
                          queryLength: query.trim().length,
                          resultCount: filteredResults.length,
                        });
                        navigate(getLocalizedPath(item.path));
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full flex items-center justify-between gap-3 rounded-xl p-3 text-left transition-all duration-150 cursor-pointer ${
                        isSelected
                          ? "bg-primary/10 dark:bg-white/10 border border-primary/50 dark:border-primary/40 shadow-2xs"
                          : "bg-slate-50/70 hover:bg-slate-100/90 dark:bg-white/[0.03] dark:hover:bg-white/[0.07] border border-slate-200/70 hover:border-slate-300 dark:border-white/5 dark:hover:border-white/10"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10">{item.icon}</span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-[13px] font-bold text-[#0F172A] dark:text-foreground truncate">
                              {item.title}
                            </span>
                            <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border mono shrink-0 ${item.badgeColor}`}>
                              {item.type}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#475569] dark:text-muted-foreground truncate max-w-md mt-0.5">
                            {item.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 text-[#64748B] dark:text-muted-foreground">
                        {isSelected && (
                          <span className="text-[10px] mono text-primary font-semibold flex items-center gap-1">
                            <span>Select</span>
                            <CornerDownLeft size={10} />
                          </span>
                        )}
                        <ArrowRight size={14} className={isSelected ? "text-primary" : "opacity-40"} />
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer info & shortcut guide */}
            <div className="flex items-center justify-between border-t border-[#DDE1E0] dark:border-white/10 pt-3 text-[10px] text-[#64748B] dark:text-muted-foreground/70 mono px-1">
              <div className="flex items-center gap-2 sm:gap-3">
                <span>
                  <kbd className="rounded bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 px-1.5 py-0.5 text-slate-700 dark:text-slate-300 font-mono">↑</kbd>{" "}
                  <kbd className="rounded bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 px-1.5 py-0.5 text-slate-700 dark:text-slate-300 font-mono">↓</kbd> navigate
                </span>
                <span>
                  <kbd className="rounded bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 px-1.5 py-0.5 text-slate-700 dark:text-slate-300 font-mono">↵</kbd> select
                </span>
                <span>
                  <kbd className="rounded bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 px-1.5 py-0.5 text-slate-700 dark:text-slate-300 font-mono">esc</kbd> close
                </span>
              </div>

              <span className="text-primary font-bold tracking-wider">RVAN SEARCH</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
