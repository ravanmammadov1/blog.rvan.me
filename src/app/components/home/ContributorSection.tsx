import { motion } from "framer-motion";
import { ArrowUpRight, UserCheck, Compass, Users } from "lucide-react";
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

  const benefits = [
    {
      icon: UserCheck,
      title: isAz ? "PROFİLİNİZİ QURUN" : "BUILD YOUR PROFILE",
      desc: isAz
        ? "Rvan.me-də öz şəxsi müəllif səhifənizi və bioqrafiyanızı yaradın."
        : "Your own dedicated author page and public creative portfolio on Rvan.me.",
    },
    {
      icon: Compass,
      title: isAz ? "KƏŞF OLUNUN" : "GET DISCOVERED",
      desc: isAz
        ? "Yazılarınız Rvan.me, axtarış sistemləri və sosial paylaşımlar vasitəsilə oxunsun."
        : "Your work can be discovered through Rvan.me, search engines, and social channels.",
    },
    {
      icon: Users,
      title: isAz ? "İCMAYLA BİRLƏŞİN" : "JOIN THE COMMUNITY",
      desc: isAz
        ? "Azərbaycanın inkişaf edən dizayn və yaradıcı peşəkarlar icmasının bir hissəsi olun."
        : "Become part of Azerbaijan's growing community of designers, marketers and creators.",
    },
  ];

  return (
    <section id="contributor" className="relative px-6 py-20 md:px-10 md:py-28 border-t border-border/60 bg-transparent">
      <div className="mx-auto max-w-[1280px] relative z-10">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="p-8 md:p-12 rounded-2xl border border-border bg-card space-y-10"
        >
          {/* Top Header & Copy */}
          <div className="max-w-3xl space-y-4">
            <Eyebrow className="text-primary tracking-[.2em]">
              {isAz ? "İCMA VƏ MÜƏLLİFLİK" : "COMMUNITY & PERSPECTIVES"}
            </Eyebrow>

            <h2 className="text-3xl font-bold tracking-tight md:text-5xl text-foreground">
              {isAz ? "Fikirləriniz görülməyə layiqdir." : "Your ideas deserve to be seen."}
            </h2>

            <p className="text-base md:text-lg leading-relaxed text-muted-foreground font-normal">
              {isAz
                ? "Bildiklərinizi paylaşın. Peşəkar kimliyinizi qurun. Öz adınız və profilinizlə nəşr olun."
                : "Share what you know. Build your professional identity. Get published under your name."}
            </p>
          </div>

          {/* 3 Value Pillars / Benefit Cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b, i) => (
              <div
                key={b.title}
                className="p-6 rounded-xl border border-border bg-surface/50 space-y-3"
              >
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 text-primary">
                  <b.icon size={16} />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mono">
                  {b.title}
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                  {b.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Action Row */}
          <div className="pt-2 flex flex-wrap items-center gap-4 border-t border-border pt-6">
            <Button
              to={getLocalizedPath("/contact#contributor-application")}
              variant="primary"
              size="md"
              icon={<ArrowUpRight size={15} />}
            >
              {isAz ? "MÜƏLLİF OLUN" : "BECOME A CONTRIBUTOR"}
            </Button>
            <span className="text-xs text-muted-foreground mono">
              {isAz
                ? "Dizaynerlər, marketoloqlar və kreativ mütəxəssislər üçün açıq platforma"
                : "Open for designers, marketers, and creative professionals across Azerbaijan"}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
