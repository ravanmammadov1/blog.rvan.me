import React from "react";
import { AtsCheckResult } from "../atsEngine";
import { CheckCircle2, AlertCircle, AlertTriangle, X, ShieldCheck, Zap } from "lucide-react";
import { useLanguage } from "../../../../../lib/i18n/LanguageContext";

interface Props {
  result: AtsCheckResult;
  onClose: () => void;
}

export const AtsScoreModal: React.FC<Props> = ({ result, onClose }) => {
  const { language } = useLanguage();
  const isAz = language === "az";

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <span className="px-2 py-0.5 rounded-md bg-red-500/20 text-red-400 font-mono text-[10px] font-bold uppercase">{isAz ? "Kritik" : "Critical"}</span>;
      case "warning":
        return <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400 font-mono text-[10px] font-bold uppercase">{isAz ? "Xəbərdarlıq" : "Warning"}</span>;
      case "suggestion":
        return <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-400 font-mono text-[10px] font-bold uppercase">{isAz ? "Tövsiyə" : "Suggestion"}</span>;
      case "good":
      default:
        return <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold uppercase">{isAz ? "Əla" : "Good"}</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-3xl border border-white/15 bg-neutral-900/98 p-6 shadow-2xl space-y-5 text-foreground max-h-[88vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-primary" />
            <h3 className="text-base font-bold text-white">
              {isAz ? "ATS Uyğunluq & HR Auditi" : "ATS Screening & Recruiter Audit"}
            </h3>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-white p-1 cursor-pointer">
            <X size={18} />
          </button>
        </div>

        {/* Score & Grade Display */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
          <div>
            <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase">
              {isAz ? "Hesablanmış ATS Xalı" : "Calculated ATS Score"}
            </span>
            <div className="text-3xl font-extrabold text-primary tracking-tight mt-0.5">
              {result.score} <span className="text-sm text-neutral-400 font-normal">/ 100</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase">
              {isAz ? "Qiymətləndirmə" : "Readiness Grade"}
            </span>
            <div
              className={`text-sm font-bold mt-0.5 ${
                result.score >= 85 ? "text-emerald-400" : result.score >= 70 ? "text-amber-400" : "text-red-400"
              }`}
            >
              {result.grade}
            </div>
          </div>
        </div>

        {/* Metrics & Verbs Detected */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
            <div className="text-muted-foreground font-mono text-[10px] uppercase">
              {isAz ? "Fəaliyyət Felləri" : "Action Power Verbs"}
            </div>
            <div className="text-base font-bold text-foreground mt-1 flex items-center gap-1.5">
              <Zap size={14} className="text-amber-400" />
              <span>{result.actionVerbCount} {isAz ? "ədəd" : "detected"}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
            <div className="text-muted-foreground font-mono text-[10px] uppercase">
              {isAz ? "Ölçülən Metriklər (%, $)" : "Impact Metrics (%, $)"}
            </div>
            <div className="text-base font-bold text-foreground mt-1 flex items-center gap-1.5">
              <Zap size={14} className="text-emerald-400" />
              <span>{result.metricCount} {isAz ? "ədəd" : "detected"}</span>
            </div>
          </div>
        </div>

        {/* Actionable Improvements / Issues */}
        {result.failedChecks.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <AlertTriangle size={14} /> {isAz ? `Təkmilləşdirmə Sahələri (${result.failedChecks.length})` : `Actionable Improvements (${result.failedChecks.length})`}
            </h4>
            <div className="space-y-2">
              {result.failedChecks.map((item) => (
                <div key={item.id} className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-300">{isAz && item.label_az ? item.label_az : item.label}</span>
                    {getSeverityBadge(item.severity)}
                  </div>
                  <p className="text-[11px] text-neutral-300">
                    {isAz && item.message_az ? item.message_az : item.message}
                  </p>
                  <p className="text-[11px] text-primary/90 font-mono pt-0.5">
                    💡 {isAz && item.fixTip_az ? item.fixTip_az : item.fixTip}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Passed Criteria */}
        {result.passedChecks.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 size={14} /> {isAz ? `Uğurlu Kriteriyalar (${result.passedChecks.length})` : `Passed Criteria (${result.passedChecks.length})`}
            </h4>
            <div className="space-y-1.5">
              {result.passedChecks.map((item) => (
                <div key={item.id} className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
                  <div className="font-bold text-emerald-300">{isAz && item.label_az ? item.label_az : item.label}</div>
                  <div className="text-[11px] text-neutral-300 mt-0.5">
                    {isAz && item.message_az ? item.message_az : item.message}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action button */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-primary text-black font-bold text-xs font-mono hover:bg-primary/90 transition-all cursor-pointer shadow-md"
          >
            {isAz ? "BAŞA DÜŞDÜM, REDAKTƏYƏ DAVAM ET" : "GOT IT, CONTINUE EDITING"}
          </button>
        </div>
      </div>
    </div>
  );
};
