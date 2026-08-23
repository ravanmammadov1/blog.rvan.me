import React from "react";
import { ResumeData, ResumeThemeConfig } from "../resumeTypes";
import { TEMPLATE_REGISTRY } from "../resumeTemplates";
import { FONT_FAMILY_CONFIG } from "../themeTokens";
import { TemplateErrorBoundary } from "../editor/TemplateErrorBoundary";

interface ResumePreviewProps {
  data: ResumeData;
  theme: ResumeThemeConfig;
  isThumbnail?: boolean;
  onUpdate?: (newData: ResumeData) => void;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({
  data,
  theme,
  isThumbnail = false,
  onUpdate,
}) => {
  const getFontFamily = () => {
    return FONT_FAMILY_CONFIG[theme.fontFamily] || FONT_FAMILY_CONFIG.sans;
  };

  const templateDef = TEMPLATE_REGISTRY[theme.template] || TEMPLATE_REGISTRY["tech-cv"];
  const TemplateComponent = templateDef.component;

  return (
    <TemplateErrorBoundary fallbackTemplateId="tech-cv">
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
          }
          @page {
            size: A4 portrait;
            margin: 0;
          }
        }
      `}</style>

      <div
        id="printable-resume"
        className="w-full bg-white text-neutral-900 overflow-hidden relative shadow-sm"
        style={{
          fontFamily: getFontFamily(),
          minHeight: isThumbnail ? "auto" : "1050px",
        }}
      >
        <TemplateComponent
          data={data}
          theme={theme}
          isThumbnail={isThumbnail}
          onUpdate={onUpdate}
        />
      </div>
    </TemplateErrorBoundary>
  );
};

export default ResumePreview;
