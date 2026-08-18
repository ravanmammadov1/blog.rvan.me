import React from "react";
import { ResumeData, ResumeThemeConfig } from "../resumeTypes";
import { AwesomeCvTemplate } from "./AwesomeCvTemplate";
import { DeedyResumeTemplate } from "./DeedyResumeTemplate";
import { AltaCvTemplate } from "./AltaCvTemplate";
import { Modern2ColTemplate } from "./Modern2ColTemplate";
import { DarkSidebarTemplate } from "./DarkSidebarTemplate";
import { Sb2novTemplate } from "./Sb2novTemplate";
import { ModerncvTemplate } from "./ModerncvTemplate";
import { OnyxTemplate } from "./OnyxTemplate";
import { SoftBannerTemplate } from "./SoftBannerTemplate";
import { ClassicHarvardTemplate } from "./ClassicHarvardTemplate";
import { QuotationTemplate } from "./QuotationTemplate";
import { DeveloperCompactTemplate } from "./DeveloperCompactTemplate";
import { SwissEditorialTemplate } from "./SwissEditorialTemplate";
import { CorporateCleanTemplate } from "./CorporateCleanTemplate";
import { CompactAtsTemplate } from "./CompactAtsTemplate";
import { ModernTechTemplate } from "./ModernTechTemplate";
import { LeafishTemplate } from "./LeafishTemplate";
import { MinimalTemplate } from "./MinimalTemplate";
import { ExecutiveTemplate } from "./ExecutiveTemplate";
import { FONT_FAMILY_CONFIG } from "../themeTokens";

interface ResumePreviewProps {
  data: ResumeData;
  theme: ResumeThemeConfig;
  onUpdate?: (newData: ResumeData) => void;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ data, theme, onUpdate }) => {
  const getFontFamily = () => {
    return FONT_FAMILY_CONFIG[theme.fontFamily] || FONT_FAMILY_CONFIG.sans;
  };

  const renderTemplate = () => {
    switch (theme.template) {
      // 0. Premier Open-Source LaTeX & Modern Adaptations
      case "awesome-cv":
        return <AwesomeCvTemplate data={data} theme={theme} />;
      case "deedy-cv":
        return <DeedyResumeTemplate data={data} theme={theme} />;
      case "altacv":
        return <AltaCvTemplate data={data} theme={theme} />;

      // 1. ATS / Classic
      case "tech-cv":
        return <Sb2novTemplate data={data} theme={theme} onUpdate={onUpdate} />;
      case "minimal-cv":
        return <ClassicHarvardTemplate data={data} theme={theme} />;
      case "classic-ats-cv":
        return <MinimalTemplate data={data} theme={theme} onUpdate={onUpdate} />;
      case "corporate-cv":
        return <CorporateCleanTemplate data={data} theme={theme} onUpdate={onUpdate} />;
      case "compact-ats-cv":
        return <CompactAtsTemplate data={data} theme={theme} onUpdate={onUpdate} />;

      // 2. Modern
      case "modern-cv":
        return <Modern2ColTemplate data={data} theme={theme} onUpdate={onUpdate} />;
      case "modern-minimal-cv":
        return <ModernTechTemplate data={data} theme={theme} onUpdate={onUpdate} />;
      case "editorial-cv":
        return <SwissEditorialTemplate data={data} theme={theme} onUpdate={onUpdate} />;
      case "nordic-cv":
        return <SoftBannerTemplate data={data} theme={theme} onUpdate={onUpdate} />;
      case "clean-modern-cv":
        return <LeafishTemplate data={data} theme={theme} onUpdate={onUpdate} />;

      // 3. Tech & Engineering
      case "developer-cv":
        return <DeveloperCompactTemplate data={data} theme={theme} onUpdate={onUpdate} />;
      case "engineering-cv":
        return <ExecutiveTemplate data={data} theme={theme} onUpdate={onUpdate} />;
      case "academic-cv":
        return <ClassicHarvardTemplate data={data} theme={theme} />;

      // 4. Executive
      case "professional-cv":
        return <DarkSidebarTemplate data={data} theme={theme} onUpdate={onUpdate} />;
      case "executive-cv":
        return <ModerncvTemplate data={data} theme={theme} onUpdate={onUpdate} />;
      case "quotation-cv":
        return <QuotationTemplate data={data} theme={theme} onUpdate={onUpdate} />;

      // 5. Creative
      case "creative-cv":
        return <OnyxTemplate data={data} theme={theme} onUpdate={onUpdate} />;

      // 6. Blank / Fallback
      case "blank-cv":
      default:
        return <Sb2novTemplate data={data} theme={theme} onUpdate={onUpdate} />;
    }
  };

  return (
    <>
      {/* Dedicated Print Media & Page Break Protection Stylesheet */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-resume, #printable-resume * {
            visibility: visible !important;
          }
          #printable-resume {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
            background: white !important;
            color: black !important;
          }
          @page {
            size: A4 portrait;
            margin: 0;
          }
        }
        /* Orphan & Break Protection for Clean Multi-page Export */
        #printable-resume h1,
        #printable-resume h2,
        #printable-resume h3,
        #printable-resume [data-section-header] {
          break-after: avoid !important;
          page-break-after: avoid !important;
        }
        #printable-resume article,
        #printable-resume .resume-item-card,
        #printable-resume [data-item-card] {
          break-inside: avoid !important;
          page-break-inside: avoid !important;
        }
        #printable-resume ul {
          break-inside: auto !important;
        }
        #printable-resume li {
          break-inside: avoid !important;
          page-break-inside: avoid !important;
        }
      `}</style>

      <div
        id="printable-resume"
        className="w-full max-w-[850px] mx-auto bg-white text-neutral-900 rounded-xl shadow-2xl transition-all duration-300 border border-neutral-300 print:rounded-none print:border-none print:shadow-none overflow-hidden"
        style={{
          fontFamily: getFontFamily(),
          minHeight: "1050px",
          boxSizing: "border-box",
          ["--resume-accent" as any]: theme.accentColor || "#111827",
        }}
      >
        {renderTemplate()}
      </div>
    </>
  );
};
