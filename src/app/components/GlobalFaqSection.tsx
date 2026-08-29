import { FaqItem, GLOBAL_FAQS } from "../../data/faqData";
import FaqAccordion from "./ui/FaqAccordion";
import { useLanguage } from "../../lib/i18n/LanguageContext";

interface GlobalFaqSectionProps {
  items?: FaqItem[];
  title?: string;
  eyebrow?: string;
  description?: string;
  className?: string;
}

/**
 * Global site-wide FAQ section positioned immediately before the Footer.
 * Unified across public pages with #faq anchor support.
 */
export default function GlobalFaqSection({
  items,
  title,
  eyebrow,
  description,
  className = "",
}: GlobalFaqSectionProps) {
  const { language } = useLanguage();
  const isAz = language === "az";

  const defaultItems = items || GLOBAL_FAQS.slice(0, 6);

  return (
    <section
      id="faq"
      className={`relative px-4 sm:px-6 md:px-10 py-16 sm:py-24 lg:py-28 border-b border-border/40 scroll-mt-20 ${className}`}
    >
      <div className="mx-auto max-w-[1200px]">
        <FaqAccordion
          items={defaultItems}
          eyebrow={eyebrow || (isAz ? "TEZ-TEZ VERİLƏN SUALLAR" : "FREQUENTLY ASKED QUESTIONS")}
          title={title || (isAz ? "Platforma və Nəşr Haqqında" : "Platform & Editorial FAQ")}
          description={
            description ||
            (isAz
              ? "Rvan.me nəşriyyatı, məqalə təqdimatı, resurslar və alətlər haqqında ən çox verilən suallar:"
              : "Frequently asked questions regarding our publication, editorial submissions, tools, and creative ecosystem:")
          }
          viewAllHref="/faq"
          viewAllLabel={isAz ? "BÜTÜN SUALLARA BAX (10)" : "VIEW ALL FAQS (10)"}
          showNumbers={true}
        />
      </div>
    </section>
  );
}
