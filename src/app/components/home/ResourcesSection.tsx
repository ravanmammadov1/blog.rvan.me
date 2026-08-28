import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Type, Sparkles, Palette } from "lucide-react";
import { Eyebrow } from "../Eyebrow";
import { fetchHomeShowcaseResources, fetchUnifiedResources, SharedResourceItem, ResourceCategoryKey } from "../../../lib/resourceEngine";
import type { IconItem } from "../../../lib/iconEngine";
import { ILLUSTRATIONS_CATALOG } from "../../../lib/illustrationsData";
import { IconSpecimenCard } from "../content/IconSpecimenCard";
import { FontSpecimenCard } from "../content/FontSpecimenCard";
import { IllustrationSpecimenCard } from "../content/IllustrationSpecimenCard";
import { useLanguage } from "../../../lib/i18n/LanguageContext";
import { Button } from "../ui/Button";

const SHOWCASE_ICONS: IconItem[] = [
  { id: "icon-sparkles", name: "Sparkles", componentName: "Sparkles", category: "General", tags: ["magic", "star", "ai"] },
  { id: "icon-layers", name: "Layers", componentName: "Layers", category: "Design", tags: ["stack", "design", "ui"] },
  { id: "icon-zap", name: "Zap", componentName: "Zap", category: "General", tags: ["fast", "energy", "lightning"] },
  { id: "icon-globe", name: "Globe", componentName: "Globe", category: "General", tags: ["world", "web", "internet"] },
  { id: "icon-type", name: "Type", componentName: "Type", category: "Design", tags: ["font", "text", "typography"] },
  { id: "icon-palette", name: "Palette", componentName: "Palette", category: "Design", tags: ["color", "art", "paint"] },
  { id: "icon-cpu", name: "Cpu", componentName: "Cpu", category: "Development", tags: ["processor", "chip", "tech"] },
  { id: "icon-compass", name: "Compass", componentName: "Compass", category: "General", tags: ["navigation", "direction", "explore"] },
];

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: EASE },
  }),
};

export type HomeResourceCategoryKey = "fonts" | "icons" | "illustrations";

const CATEGORY_ICONS: Record<HomeResourceCategoryKey, React.ReactNode> = {
  fonts: <Type size={14} />,
  icons: <Sparkles size={14} />,
  illustrations: <Palette size={14} />,
};

export const HOME_RESOURCE_CATEGORIES: Record<HomeResourceCategoryKey, { label: string }> = {
  fonts: { label: "Fonts" },
  icons: { label: "Icons" },
  illustrations: { label: "Illustrations" },
};

export default function ResourcesSection() {
  const [resources, setResources] = useState<SharedResourceItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<HomeResourceCategoryKey>("fonts");
  const { t, getLocalizedPath, language } = useLanguage();
  const isAz = language === "az";

  const categoryLabels: Record<HomeResourceCategoryKey, string> = {
    fonts: t("fonts", "Fonts"),
    icons: t("icons", "Icons"),
    illustrations: isAz ? "İllüstrasiyalar" : "Illustrations",
  };

  useEffect(() => {
    fetchHomeShowcaseResources().then((items) => {
      if (items && items.length > 0) {
        setResources(items);
      }
    });

    fetchUnifiedResources()
      .then((items) => {
        if (items && items.length > 0) {
          setResources(items);
        }
      })
      .catch(() => {});
  }, []);

  const showcaseFonts = useMemo(() => {
    return resources.filter((r) => r.category === "fonts").slice(0, 4);
  }, [resources]);

  const showcaseIcons = useMemo(() => {
    return SHOWCASE_ICONS;
  }, []);

  const showcaseIllustrations = useMemo(() => {
    return ILLUSTRATIONS_CATALOG.slice(0, 4);
  }, []);

  return (
    <section id="resources" className="relative px-6 py-20 md:px-10 md:py-28 border-t border-border bg-surface/40">
      <div className="mx-auto max-w-[1280px] relative z-10">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between border-b border-border pb-6 gap-6"
        >
          <div>
            <Eyebrow className="text-primary tracking-[.2em]">{isAz ? "KURASİYA EDİLMİŞ KATALOQ" : "CURATED DIRECTORY"}</Eyebrow>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl text-foreground">
              {isAz ? "Resurslar" : "Resources"}
            </h2>
            <p className="mt-2 text-xs md:text-sm text-muted-foreground font-medium max-w-xl">
              {isAz
                ? "Dizaynerlər, marketoloqlar və kreativ mütəxəssislər üçün seçilmiş faydalı açıq mənbəli resurslar, şriftlər, ikonlar və dizayn aktivləri."
                : "Rvan.me curates useful open-source fonts, vector icons, 3D assets, and design kits for designers, marketers, and creative professionals."}
            </p>
          </div>

          <Button
            to={getLocalizedPath("/resources")}
            variant="secondary"
            size="md"
            icon={<ArrowUpRight size={14} className="text-primary" />}
          >
            {isAz ? "BÜTÜN RESURSLARA BAX" : "EXPLORE ALL RESOURCES"}
          </Button>
        </motion.div>

        {/* Category Tabs: FONTS | ICONS | ILLUSTRATIONS */}
        <div className="mb-10 flex flex-wrap gap-2">
          {(Object.keys(HOME_RESOURCE_CATEGORIES) as HomeResourceCategoryKey[]).map((catKey) => {
            const isActive = activeCategory === catKey;
            return (
              <Button
                key={catKey}
                onClick={() => setActiveCategory(catKey)}
                variant="filter"
                active={isActive}
                size="sm"
                icon={CATEGORY_ICONS[catKey]}
                iconPosition="left"
              >
                {categoryLabels[catKey] || HOME_RESOURCE_CATEGORIES[catKey].label}
              </Button>
            );
          })}
        </div>

        {/* Resource Cards Display */}
        {activeCategory === "fonts" ? (
          <div className="grid gap-6 sm:grid-cols-2">
            {showcaseFonts.map((item, idx) => (
              <FontSpecimenCard
                key={item.id}
                font={{
                  family: item.title,
                  category: (item.type as any) || "Sans Serif",
                  designer: item.authorName || "Google Fonts",
                  foundry: item.source,
                  license: item.license || "SIL Open Font License",
                  description: item.description,
                } as any}
                previewText="Design systems engineered for precision & elegance."
                fontSizePx={26}
                idx={idx}
                fadeUpVariants={fadeUp}
              />
            ))}
          </div>
        ) : activeCategory === "icons" ? (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {showcaseIcons.map((iconItem) => (
              <IconSpecimenCard
                key={iconItem.id}
                iconItem={iconItem}
                iconSize={28}
                strokeWidth={2}
                iconColor="#61c5ad"
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
            {showcaseIllustrations.map((illItem) => (
              <IllustrationSpecimenCard
                key={illItem.id}
                illustration={illItem}
                accentColor="#61c5ad"
              />
            ))}
          </div>
        )}

        {/* Bottom CTA Button */}
        <div className="mt-12 text-center">
          <Button
            to={getLocalizedPath(`/resources?category=${activeCategory}`)}
            variant="primary"
            size="lg"
            icon={<ArrowUpRight size={14} />}
          >
            EXPLORE FULL {activeCategory.toUpperCase()} ARCHIVE
          </Button>
        </div>
      </div>
    </section>
  );
}