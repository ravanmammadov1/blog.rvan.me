import React from "react";
import { ResumeData, ResumeThemeConfig } from "../resumeTypes";
import { ModernTechTemplate } from "./ModernTechTemplate";
import { ClassicHarvardTemplate } from "./ClassicHarvardTemplate";
import { ExecutiveTemplate } from "./ExecutiveTemplate";
import { MinimalTemplate } from "./MinimalTemplate";
import { CreativeTemplate } from "./CreativeTemplate";

interface ResumePreviewProps {
  data: ResumeData;
  theme: ResumeThemeConfig;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ data, theme }) => {
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

  const getDensityPadding = () => {
    switch (theme.density) {
      case "compact":
        return "p-6 md:p-8 space-y-3";
      case "relaxed":
        return "p-10 md:p-14 space-y-6";
      case "standard":
      default:
        return "p-8 md:p-12 space-y-4";
    }
  };

  const renderTemplate = () => {
    switch (theme.template) {
      case "classic-harvard":
        return <ClassicHarvardTemplate data={data} theme={theme} />;
      case "executive":
        return <ExecutiveTemplate data={data} theme={theme} />;
      case "minimal":
        return <MinimalTemplate data={data} theme={theme} />;
      case "creative":
        return <CreativeTemplate data={data} theme={theme} />;
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
            padding: 20mm !important;
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
        className={`w-full max-w-[850px] mx-auto bg-white text-neutral-900 rounded-xl shadow-2xl transition-all duration-300 border border-neutral-300 print:rounded-none print:border-none print:shadow-none ${getDensityPadding()}`}
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
