import React from "react";
import { ResumeData, ResumeThemeConfig } from "../resumeTypes";
import { Sb2novTemplate } from "./Sb2novTemplate";
import { ModerncvTemplate } from "./ModerncvTemplate";
import { OnyxTemplate } from "./OnyxTemplate";
import { LeafishTemplate } from "./LeafishTemplate";
import { DarkSidebarTemplate } from "./DarkSidebarTemplate";
import { Modern2ColTemplate } from "./Modern2ColTemplate";
import { SoftBannerTemplate } from "./SoftBannerTemplate";
import { ClassicHarvardTemplate } from "./ClassicHarvardTemplate";
import { ModernTechTemplate } from "./ModernTechTemplate";

interface ResumePreviewProps {
  data: ResumeData;
  theme: ResumeThemeConfig;
  onUpdate?: (newData: ResumeData) => void;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ data, theme, onUpdate }) => {
  const getFontFamily = () => {
    switch (theme.fontFamily) {
      case "serif":
        return "'Merriweather', 'Georgia', serif";
      case "mono":
        return "'JetBrains Mono', 'Fira Code', monospace";
      case "sans":
      default:
        return "'Geist', 'Inter', system-ui, -apple-system, sans-serif";
    }
  };

  const renderTemplate = () => {
    switch (theme.template) {
      case "sb2nov":
        return <Sb2novTemplate data={data} theme={theme} onUpdate={onUpdate} />;
      case "moderncv":
        return <ModerncvTemplate data={data} theme={theme} onUpdate={onUpdate} />;
      case "onyx":
        return <OnyxTemplate data={data} theme={theme} onUpdate={onUpdate} />;
      case "leafish":
        return <LeafishTemplate data={data} theme={theme} onUpdate={onUpdate} />;
      case "dark-sidebar":
        return <DarkSidebarTemplate data={data} theme={theme} onUpdate={onUpdate} />;
      case "modern-2col":
        return <Modern2ColTemplate data={data} theme={theme} onUpdate={onUpdate} />;
      case "soft-banner":
        return <SoftBannerTemplate data={data} theme={theme} onUpdate={onUpdate} />;
      case "classic-harvard":
        return <ClassicHarvardTemplate data={data} theme={theme} />;
      case "modern-tech":
      default:
        return <ModernTechTemplate data={data} theme={theme} />;
    }
  };

  return (
    <>
      {/* Dedicated Print Media Stylesheet */}
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
            size: ${theme.paperSize === "letter" ? "letter" : "A4"};
            margin: 0;
          }
        }
      `}</style>

      <div
        id="printable-resume"
        className="w-full max-w-[850px] mx-auto bg-white text-neutral-900 rounded-xl shadow-2xl transition-all duration-300 border border-neutral-300 print:rounded-none print:border-none print:shadow-none overflow-hidden"
        style={{
          fontFamily: getFontFamily(),
          minHeight: "1050px",
        }}
      >
        {renderTemplate()}
      </div>
    </>
  );
};
