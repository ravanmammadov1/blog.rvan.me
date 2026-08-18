import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight, Sparkles, Wrench, Compass, BookOpen, Layers } from "lucide-react";
import { useLanguage } from "../../../lib/i18n/LanguageContext";
import { trackContentBridgeClick } from "../../../lib/analytics/events";

export interface EcosystemBridgeProps {
  type: "tool" | "resource" | "article";
  title: string;
  description: string;
  href: string;
  badge?: string;
  ctaText?: string;
  topic?: string;
  className?: string;
}

export default function EcosystemBridgeCard({
  type,
  title,
  description,
  href,
  badge,
  ctaText,
  topic,
  className = "",
}: EcosystemBridgeProps) {
  const { getLocalizedPath, language } = useLanguage();
  const location = useLocation();

  const isAz = language === "az";

  // Dynamic iconography and styling based on recommendation type
  const getMeta = () => {
    switch (type) {
      case "tool":
        return {
          icon: <Wrench size={16} className="text-emerald-400" />,
          defaultBadge: isAz ? "İNTERAKTİV ALƏT" : "INTERACTIVE TOOL",
          defaultCta: isAz ? "Aləti Sına" : "Launch Tool",
          borderHover: "hover:border-emerald-500/50 hover:shadow-emerald-500/5",
          badgeBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
          buttonBg: "bg-emerald-500 text-black hover:bg-emerald-400",
        };
      case "resource":
        return {
          icon: <Compass size={16} className="text-sky-400" />,
          defaultBadge: isAz ? "KREATİV RESURS" : "CURATED RESOURCE",
          defaultCta: isAz ? "Resursu Kəşf Et" : "Explore Specimen",
          borderHover: "hover:border-sky-500/50 hover:shadow-sky-500/5",
          badgeBg: "bg-sky-500/10 text-sky-400 border-sky-500/20",
          buttonBg: "bg-sky-500 text-black hover:bg-sky-400",
        };
      case "article":
      default:
        return {
          icon: <BookOpen size={16} className="text-primary" />,
          defaultBadge: isAz ? "ƏLAQƏLİ MƏQALƏ" : "COMPLEMENTARY STUDY",
          defaultCta: isAz ? "Məqaləni Oxu" : "Read Essay",
          borderHover: "hover:border-primary/50 hover:shadow-primary/5",
          badgeBg: "bg-primary/10 text-primary border-primary/20",
          buttonBg: "bg-primary text-black hover:bg-primary/90",
        };
    }
  };

  const meta = getMeta();
  const resolvedBadge = badge || meta.defaultBadge;
  const resolvedCta = ctaText || meta.defaultCta;
  const localizedHref = getLocalizedPath(href);

  return (
    <aside
      aria-label={resolvedBadge}
      className={`my-10 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-6 backdrop-blur-xl transition-all duration-300 ${meta.borderHover} shadow-lg ${className}`}
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        {/* Left info column */}
        <div className="space-y-2.5 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-wider mono uppercase ${meta.badgeBg}`}
            >
              {meta.icon}
              {resolvedBadge}
            </span>
            {topic && (
              <span className="text-[11px] font-medium text-muted-foreground mono">
                • {topic}
              </span>
            )}
          </div>

          <h3 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
            {title}
          </h3>

          <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>

        {/* Right CTA button */}
        <div className="shrink-0 pt-2 sm:pt-0">
          <Link
            to={localizedHref}
            onClick={() => {
              trackContentBridgeClick(location.pathname, href, type);
            }}
            className={`group inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold tracking-wider mono uppercase transition-all duration-200 ${meta.buttonBg} shadow-md`}
          >
            <span>{resolvedCta}</span>
            <ArrowUpRight
              size={15}
              className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>
      </div>
    </aside>
  );
}
