import { motion } from "framer-motion";
import { ArrowUpRight, PenTool } from "lucide-react";
import { Eyebrow } from "../Eyebrow";
import { Button } from "../ui/Button";
import { useLanguage } from "../../../lib/i18n/LanguageContext";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function ContributorSection() {
  const { getLocalizedPath, language } = useLanguage();
  const isAz = language === "az";

  return (
    <section id="contributor" className="relative px-6 py-20 md:px-10 md:py-28 border-t border-border bg-background">
      <div className="mx-auto max-w-[1600px] relative z-10">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="p-8 md:p-12 rounded-2xl border border-border bg-card"
        >
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-md border border-border bg-muted/40 px-3 py-1 text-xs font-bold tracking-wider text-muted-foreground mono uppercase">
              <PenTool size={13} className="text-primary" />
              <span>{isAz ? "İCMA VƏ MÜƏLLİFLİK" : "COMMUNITY & PERSPECTIVES"}</span>
            </div>

            <h2 className="text-3xl font-bold tracking-tight md:text-5xl text-foreground">
              {isAz ? "Paylaşmağa dəyər ideyanız var?" : "Have something worth sharing?"}
            </h2>

            <p className="text-base md:text-lg leading-relaxed text-muted-foreground font-normal">
              {isAz
                ? "Rvan.me dizaynerlərin, marketoloqların və kreativ mütəxəssislərin ideyaları üçün öz səhifələrini açır. Baxış bucağınızı paylaşın, məqalə təqdim edin və nəşrin bir hissəsi olun."
                : "Rvan.me is opening its pages to ideas from designers, marketers and creative professionals. Share your perspective, submit an article, and become part of the publication."}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Button
                to={getLocalizedPath("/contact")}
                variant="primary"
                size="md"
                icon={<ArrowUpRight size={15} />}
              >
                {isAz ? "MÜƏLLİF OLUN" : "BECOME A CONTRIBUTOR"}
              </Button>
              <span className="text-xs text-muted-foreground mono">
                {isAz ? "Yazı təklifləri və redaksiya müraciətləri açıqdır" : "Open for article pitches & editorial proposals"}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
