import { useEffect, useState } from "react";
import { List, ChevronDown } from "lucide-react";
import { useLanguage } from "../../../lib/i18n/LanguageContext";

interface HeadingItem {
  id: string;
  text: string;
  level: string;
}

interface TableOfContentsProps {
  body?: any[];
  content?: any[];
  isMobile?: boolean;
}

export default function TableOfContents({ body, content, isMobile = false }: TableOfContentsProps) {
  const blocks = body || content || [];
  const [headings, setHeadings] = useState<HeadingItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const { language } = useLanguage();

  const tocTitle = language === "az" ? "Mündəricat" : "Table of Contents";

  useEffect(() => {
    if (!blocks || !Array.isArray(blocks)) return;

    const extractedHeadings: HeadingItem[] = [];

    blocks.forEach((block) => {
      if (
        block._type === "block" &&
        ["h1", "h2", "h3"].includes(block.style) &&
        Array.isArray(block.children)
      ) {
        const text = block.children.map((c: any) => c.text).join("");
        if (text.trim()) {
          const id = text
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-");
          extractedHeadings.push({
            id,
            text,
            level: block.style,
          });
        }
      }
    });

    setHeadings(extractedHeadings);
  }, [blocks]);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-15% 0px -65% 0px" }
    );

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      if (isMobile) setMobileOpen(false);
    }
  };

  // Mobile Accordion View (< lg)
  if (isMobile) {
    return (
      <nav
        className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-4 shadow-sm"
        aria-label="Table of Contents"
      >
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex w-full items-center justify-between text-xs font-bold uppercase tracking-[.18em] text-primary mono focus:outline-none"
        >
          <span className="flex items-center gap-2">
            <List size={14} />
            <span>{tocTitle}</span>
          </span>
          <ChevronDown
            size={16}
            className={`transition-transform duration-300 ${mobileOpen ? "rotate-180" : ""}`}
          />
        </button>

        {mobileOpen && (
          <ul className="mt-4 space-y-2 border-t border-white/10 pt-3 text-xs">
            {headings.map((h) => {
              const isActive = activeId === h.id;
              const isSubheading = h.level === "h3";

              return (
                <li
                  key={h.id}
                  className={`${isSubheading ? "pl-3" : "pl-0"}`}
                >
                  <button
                    onClick={() => scrollToHeading(h.id)}
                    className={`block w-full text-left transition-colors duration-200 py-1 ${
                      isActive
                        ? "font-bold text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {h.text}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </nav>
    );
  }

  // Desktop Sticky Sidebar View (lg+)
  return (
    <nav
      className="rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-2xl p-6 shadow-xl relative overflow-hidden"
      aria-label="Table of Contents"
    >
      <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-primary mono pb-3 border-b border-white/10">
        <List size={14} />
        <span>{tocTitle}</span>
      </div>

      <ul className="space-y-2 text-xs max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
        {headings.map((h) => {
          const isActive = activeId === h.id;
          const isSubheading = h.level === "h3";

          return (
            <li
              key={h.id}
              className={`transition-all duration-200 ${isSubheading ? "pl-3.5" : "pl-0"}`}
            >
              <button
                onClick={() => scrollToHeading(h.id)}
                className={`group flex items-start gap-2 text-left transition-colors duration-200 py-1.5 leading-relaxed ${
                  isActive
                    ? "font-bold text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span
                  className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 transition-colors ${
                    isActive ? "bg-primary" : "bg-white/20 group-hover:bg-white/50"
                  }`}
                />
                <span>{h.text}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
