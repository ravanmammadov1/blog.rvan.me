import React from "react";
import { ApcaEvaluation } from "../../../../lib/accessibility/apcaEngine";
import { Layout, Check, Sparkles, Send, ArrowRight, User } from "lucide-react";
import { useLanguage } from "../../../../lib/i18n/LanguageContext";

interface ApcaLiveUiSpecimenProps {
  evaluation: ApcaEvaluation;
}

export default function ApcaLiveUiSpecimen({ evaluation }: ApcaLiveUiSpecimenProps) {
  const { language } = useLanguage();
  const isAz = language === "az";

  const { fgHex, bgHex } = evaluation;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl shadow-xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <Layout size={18} className="text-primary" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-foreground mono">
            {isAz ? "CANLI İNTERFEYS NÜMUNƏSİ (UI PREVIEW)" : "LIVE UI COMPONENT SANDBOX"}
          </h3>
        </div>
        <span className="text-[11px] text-muted-foreground mono">
          {isAz ? "Seçilmiş rənglərlə real interfeys elementləri" : "Real UI elements rendered in your colors"}
        </span>
      </div>

      {/* Simulated Live UI Card Canvas */}
      <div
        className="rounded-2xl p-6 sm:p-8 transition-colors duration-300 border border-white/10 shadow-2xl space-y-6"
        style={{ backgroundColor: bgHex, color: fgHex }}
      >
        {/* 1. Pill Badge & Meta Line */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider border"
            style={{
              borderColor: `${fgHex}40`,
              backgroundColor: `${fgHex}15`,
              color: fgHex,
            }}
          >
            <Sparkles size={13} />
            <span>{isAz ? "Kreativ Dizayn Sistemi" : "Design Systems"}</span>
          </div>

          <div className="text-xs opacity-75 mono">
            {isAz ? "Nəşr tarixi: Avqust 2026 · 5 dəqiqəlik mütaliə" : "Published August 2026 · 5 min read"}
          </div>
        </div>

        {/* 2. Large Heading */}
        <div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            {isAz
              ? "Perseptual Kontrast və Rəng Əlçatanlığı"
              : "Designing for Perceptual Lightness Contrast"}
          </h2>
          <p className="mt-3 text-sm sm:text-base leading-relaxed opacity-90 font-medium">
            {isAz
              ? "İnsan gözü ağ və qara fonlarda mətni eyni cür qavramır. APCA alqoritmi işıq saçma fizikasını və gözün təbii xüsusiyyətlərini nəzərə alaraq rəqəmsal məhsullar üçün dəqiq vizual nizam yaradır."
              : "Human vision perceives spatial contrast non-linearly. Unlike simple luminance math, APCA models retinal cones and cortical response, ensuring fluid legibility across bright sunlit displays and OLED dark modes."}
          </p>
        </div>

        {/* 3. Interactive UI Elements: Buttons & Input */}
        <div className="pt-4 border-t" style={{ borderColor: `${fgHex}25` }}>
          <div className="grid gap-4 sm:grid-cols-2 items-center">
            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Inverted Primary Button */}
              <button
                className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-opacity hover:opacity-90 shadow-md"
                style={{ backgroundColor: fgHex, color: bgHex }}
              >
                <span>{isAz ? "Təsdiq Et" : "Get Started"}</span>
                <ArrowRight size={14} />
              </button>

              {/* Outlined Secondary Button */}
              <button
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider border transition-colors hover:bg-white/5"
                style={{ borderColor: `${fgHex}50`, color: fgHex }}
              >
                <span>{isAz ? "Ətraflı Bax" : "Learn More"}</span>
              </button>
            </div>

            {/* Input Field Simulation */}
            <div className="relative">
              <input
                type="text"
                readOnly
                value={isAz ? "user@example.com (Daxil edildi)" : "user@example.com (Input active)"}
                className="w-full rounded-xl px-4 py-2.5 text-xs font-medium border outline-none bg-transparent"
                style={{
                  borderColor: `${fgHex}40`,
                  color: fgHex,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
