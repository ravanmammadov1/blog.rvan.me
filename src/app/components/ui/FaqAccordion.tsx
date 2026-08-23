import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowRight, ArrowUpRight } from "lucide-react";
import { FaqItem } from "../../../data/faqData";
import { useLanguage } from "../../../lib/i18n/LanguageContext";
import { Eyebrow } from "../Eyebrow";

interface FaqAccordionProps {
  items: FaqItem[];
  title?: string;
  eyebrow?: string;
  description?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  showNumbers?: boolean;
  className?: string;
  containerClassName?: string;
  defaultOpenIndex?: number | null;
}

const EASE = [0.22, 1, 0.36, 1] as const;

export default function FaqAccordion({
  items,
  title,
  eyebrow,
  description,
  viewAllHref,
  viewAllLabel,
  showNumbers = true,
  className = "",
  containerClassName = "",
  defaultOpenIndex = null,
}: FaqAccordionProps) {
  const [openId, setOpenId] = useState<string | number | null>(
    defaultOpenIndex !== null && items[defaultOpenIndex] ? items[defaultOpenIndex].id : null
  );
  const { language, getLocalizedPath } = useLanguage();
  const isAz = language === "az";

  const toggle = (id: string | number) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className={`relative w-full ${containerClassName}`}>
      <div className={`mx-auto w-full ${className}`}>
        {/* Optional Header */}
        {(title || eyebrow || description) && (
          <div className="mb-10 sm:mb-12 space-y-3">
            {eyebrow && (
              <Eyebrow className="text-primary tracking-[.2em]">
                {eyebrow}
              </Eyebrow>
            )}
            {title && (
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Accordion List */}
        <div className="divide-y divide-border border-y border-border">
          {items.map((item, idx) => {
            const isOpen = openId === item.id;
            const itemNumber = idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`;
            const question = isAz ? item.qAz : item.qEn;
            const answer = isAz ? item.aAz : item.aEn;
            const bullets = isAz ? item.bulletsAz : item.bulletsEn;
            const answerParagraphs = Array.isArray(answer) ? answer : [answer];

            return (
              <div key={item.id} className="transition-colors">
                <button
                  type="button"
                  onClick={() => toggle(item.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${item.id}`}
                  className="w-full py-5 sm:py-6 flex items-start justify-between gap-4 sm:gap-6 text-left group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
                >
                  <div className="flex items-baseline gap-3.5 sm:gap-5 min-w-0">
                    {showNumbers && (
                      <span className="font-mono text-xs sm:text-sm font-bold text-muted-foreground group-hover:text-primary transition-colors shrink-0 pt-0.5">
                        {itemNumber}
                      </span>
                    )}
                    <h3 className="text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                      {question}
                    </h3>
                  </div>

                  <div
                    className={`h-7 w-7 sm:h-8 sm:w-8 rounded-full border border-border flex items-center justify-center shrink-0 transition-transform duration-300 mt-0.5 ${
                      isOpen
                        ? "rotate-180 bg-primary text-primary-foreground border-primary"
                        : "text-muted-foreground group-hover:border-primary/50"
                    }`}
                  >
                    <ChevronDown size={14} />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${item.id}`}
                      role="region"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <div className={`pb-6 text-xs sm:text-sm leading-relaxed text-muted-foreground max-w-3xl space-y-3.5 ${showNumbers ? "pl-7 sm:pl-10" : "pl-1"}`}>
                        {answerParagraphs.map((para, pIdx) => (
                          <p key={pIdx} className="leading-relaxed">
                            {para}
                          </p>
                        ))}

                        {bullets && bullets.length > 0 && (
                          <ul className="space-y-2 pt-1">
                            {bullets.map((bullet: string, bIdx: number) => (
                              <li key={bIdx} className="flex items-start gap-2.5">
                                <span className="text-primary font-bold mt-0.5 text-xs">▪</span>
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Optional View All FAQ CTA Link */}
        {viewAllHref && (
          <div className="pt-8 flex justify-start">
            <Link
              to={getLocalizedPath(viewAllHref)}
              className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-primary hover:text-foreground transition-colors group"
            >
              <span>{viewAllLabel || (isAz ? "BÜTÜN SUALLARA BAX" : "VIEW ALL FAQS")}</span>
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
