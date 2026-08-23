import { motion } from "framer-motion";
import { ArrowUpRight, PenTool, Sparkles } from "lucide-react";
import { Eyebrow } from "../Eyebrow";
import { Button } from "../ui/Button";
import { useLanguage } from "../../../lib/i18n/LanguageContext";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function ContributorSection() {
  const { getLocalizedPath, language } = useLanguage();
  const isAz = language === "az";

  return (
    <section id="contributor" className="relative px-6 py-24 md:px-10 md:py-32 border-t border-white/10 bg-white/[0.005]">
      <div className="mx-auto max-w-[1600px] relative z-10">
        <div className="p-8 md:p-14 rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.03] via-white/[0.01] to-transparent backdrop-blur-2xl aurora-card">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3.5 py-1 text-[11px] font-bold tracking-wider text-purple-400 mono uppercase">
              <PenTool size={13} />
              <span>{isAz ? "İCMAL VƏ MÜƏLLİFLİK" : "COMMUNITY & PERSPECTIVES"}</span>
            </div>

            <h2 className="text-3xl font-bold tracking-tight md:text-5xl text-foreground">
              {isAz ? "Paylaşmağa dəyər ideyanız var?" : "Have something worth sharing?"}
            </h2>

            <p className="text-base md:text-lg leading-relaxed text-muted-foreground font-medium">
              {isAz
                ? "Rvan.me dizaynerlərin, marketoloqların və kreativ mütəxəssislərin ideyaları üçün öz səhifələrini açır. Baxış bucağınızı paylaşın, məqalə təqdim edin və nəşrin bir hissəsi olun."
                : "Rvan.me is opening its pages to ideas from designers, marketers and creative professionals. Share your perspective, submit an article, and become part of the publication."}
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Button
                to={getLocalizedPath("/contact")}
                variant="primary"
                size="md"
                icon={<ArrowUpRight size={15} />}
              >
                {isAz ? "MÜƏLLİF OLUN" : "BECOME A CONTRIBUTOR"}
              </Button>
              <span className="text-xs text-muted-foreground mono flex items-center gap-2">
                <Sparkles size={14} className="text-primary" />
                {isAz ? "Yazı təklifləri və redaksiya müraciətləri açıqdır" : "Open for article pitches & editorial proposals"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
