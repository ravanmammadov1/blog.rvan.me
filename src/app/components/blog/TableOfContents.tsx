import { useEffect, useState } from "react";
import { List } from "lucide-react";

interface HeadingItem {
  id: string;
  text: string;
  level: string;
}

interface TableOfContentsProps {
  body: any[];
}

export default function TableOfContents({ body }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<HeadingItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (!body || !Array.isArray(body)) return;

    const extractedHeadings: HeadingItem[] = [];

    body.forEach((block) => {
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
  }, [body]);

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
      { rootMargin: "-20% 0px -60% 0px" }
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
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav
      className="rounded-2xl border border-border bg-card p-6 backdrop-blur-md shadow-sm"
      aria-label="Table of Contents"
    >
      <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-primary mono">
        <List size={14} />
        <span>Table of Contents</span>
      </div>

      <ul className="space-y-2.5 text-sm">
        {headings.map((h) => {
          const isActive = activeId === h.id;
          const isSubheading = h.level === "h3";

          return (
            <li
              key={h.id}
              className={`${isSubheading ? "pl-4" : "pl-0"}`}
            >
              <button
                onClick={() => scrollToHeading(h.id)}
                className={`text-left transition-colors duration-200 hover:text-primary ${
                  isActive
                    ? "font-semibold text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {h.text}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
