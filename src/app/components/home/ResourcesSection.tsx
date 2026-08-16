import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Type, Sparkles, Image as ImageIcon } from "lucide-react";
import { Eyebrow } from "../Eyebrow";
import { fetchHomeShowcaseResources, fetchUnifiedResources, SharedResourceItem, ResourceCategoryKey } from "../../../lib/resourceEngine";
import type { IconItem } from "../../../lib/iconEngine";
import { ILLUSTRATION_CATALOG } from "../../../lib/illustrationEngine";
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

const EASE = "easeInOut";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: EASE },
  }),
};

const CATEGORY_ICONS: Record<ResourceCategoryKey, React.ReactNode> = {
  fonts: <Type size={14} />,
  icons: <Sparkles size={14} />,
  illustrations: <ImageIcon size={14} />,
};

export const HOME_RESOURCE_CATEGORIES: Record<ResourceCategoryKey, { label: string }> = {
  fonts: { label: "Fonts" },
  icons: { label: "Icons" },
  illustrations: { label: "Illustrations" },
};

export default function ResourcesSection() {
  const [resources, setResources] = useState<SharedResourceItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<ResourceCategoryKey>("fonts");
  const { t, getLocalizedPath } = useLanguage();

  const categoryLabels: Record<ResourceCategoryKey, string> = {
    fonts: t("fonts", "Fonts"),
    icons: t("icons", "Icons"),
    illustrations: t("illustrations", "Illustrations"),
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
    return ILLUSTRATION_CATALOG.slice(0, 4);
  }, []);

  return (
    <section id="resources" className="relative px-6 py-28 md:px-10 md:py-40 overflow-hidden">
      {/* Subtle section background */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-30"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(6,182,212,0.07) 0%, rgba(59,130,246,0.04) 50%, transparent 70%)",
        }}
      />
      <div className="mx-auto max-w-[1600px] relative z-10">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between border-b border-white/10 pb-6 gap-6"
        >
          <div>
            <Eyebrow className="text-muted-foreground">{t("sectionResourcesEyebrow", "04 / Unified Creative Ecosystem")}</Eyebrow>
            <h2 className="mt-6 text-4xl font-semibold tracking-[-.05em] md:text-6xl text-foreground">
              {t("sectionResourcesTitle", "Knowledge & Assets.")}
            </h2>
          </div>

          <Button
            to={getLocalizedPath(`/resources?category=${activeCategory}`)}
            variant="secondary"
            size="md"
            icon={<ArrowUpRight size={14} className="text-primary" />}
          >
            {t("exploreAllResources", "BROWSE ALL RESOURCES")}
          </Button>
        </motion.div>

        {/* Category Tabs: FONTS | ICONS | ILLUSTRATIONS */}
        <div className="mb-10 flex flex-wrap gap-2">
          {(Object.keys(HOME_RESOURCE_CATEGORIES) as ResourceCategoryKey[]).map((catKey) => {
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
                  category: item.type || "Sans-Serif",
                  designer: item.authorName || "Google Fonts",
                  foundry: item.source,
                  license: item.license || "SIL Open Font License",
                  description: item.description,
                  url: item.url,
                }}
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
          <div className="grid gap-6 sm:grid-cols-2">
            {showcaseIllustrations.map((illustration) => (
              <IllustrationSpecimenCard
                key={illustration.id}
                illustration={illustration}
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