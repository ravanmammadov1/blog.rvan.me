import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Flag, AlertCircle, CheckCircle2, Send, ShieldAlert } from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import { useLanguage } from "../../../lib/i18n/LanguageContext";
import { submitArticleReport } from "../../../services/contributorService";
import { ReportReason } from "../../../types/contributor";

interface ReportArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  articleId: string;
  articleTitle: string;
  articleUrl?: string;
  authorName?: string;
}

export default function ReportArticleModal({
  isOpen,
  onClose,
  articleId,
  articleTitle,
  articleUrl,
  authorName,
}: ReportArticleModalProps) {
  const { user } = useAuth();
  const { language } = useLanguage();
  const isAz = language === "az";

  const [reason, setReason] = useState<ReportReason>("spam");
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reportReasons: { id: ReportReason; labelAz: string; labelEn: string }[] = [
    { id: "spam", labelAz: "Spam və ya kommersiya səs-küyü", labelEn: "Spam or unsolicited promotion" },
    { id: "plagiarism", labelAz: "Plagiat və ya icazəsiz kopyalanmış məzmun", labelEn: "Plagiarism or copied content" },
    { id: "misleading", labelAz: "Yanıltıcı və ya yalan məlumat", labelEn: "Misleading or inaccurate information" },
    { id: "copyright", labelAz: "Müəllif hüququ pozuntusu", labelEn: "Copyright or IP concern" },
    { id: "ai_low_effort", labelAz: "Kütləvi AI / Zəif keyfiyyətli məzmun", labelEn: "Mass AI-generated / low-effort content" },
    { id: "offensive", labelAz: "Qeyri-etik və ya təhqiramiz məzmun", labelEn: "Offensive or inappropriate content" },
    { id: "other", labelAz: "Digər redaksiya narahatlığı", labelEn: "Other editorial concern" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await submitArticleReport({
        articleId,
        articleTitle,
        articleUrl: articleUrl || (typeof window !== "undefined" ? window.location.href : ""),
        authorName,
        reason,
        details: details.trim() || undefined,
        reporterUid: user?.uid || undefined,
        reporterEmail: user?.email || undefined,
        reporterName: user?.displayName || undefined,
      });

      setSuccess(true);
    } catch (err: any) {
      setError(err?.message || "Failed to submit report.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setReason("spam");
    setDetails("");
    setSuccess(false);
    setError(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl p-6 text-foreground z-10 my-8 overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-border pb-3.5 mb-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center shrink-0">
                  <ShieldAlert size={16} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    {isAz ? "Məqaləni Şikayət Edin" : "Report Article"}
                  </h3>
                  <p className="text-[11px] text-muted-foreground truncate max-w-[280px]">
                    {articleTitle}
                  </p>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="rounded-lg border border-border p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {success ? (
              <div className="py-8 text-center space-y-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500">
                  <CheckCircle2 size={28} />
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-base font-bold text-foreground">
                    {isAz ? "Şikayətiniz Qəbul Olundu" : "Report Received"}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed max-w-sm mx-auto">
                    {isAz
                      ? "Məlumat üçün təşəkkür edirik. Redaksiya heyətimiz məqaləni ən qısa zamanda nəzərdən keçirəcək."
                      : "Thank you for helping maintain editorial quality. Our team will review this report promptly."}
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    onClick={handleClose}
                    className="px-5 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs uppercase mono cursor-pointer hover:opacity-90 transition-opacity"
                  >
                    {isAz ? "BAĞLA" : "DONE"}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive text-xs flex items-center gap-2">
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-foreground mono">
                    {isAz ? "Şikayətin Səbəbi" : "Reason for Report"} *
                  </label>
                  <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                    {reportReasons.map((r) => (
                      <label
                        key={r.id}
                        className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                          reason === r.id
                            ? "border-rose-500/40 bg-rose-500/5 text-foreground font-semibold"
                            : "border-border bg-surface/50 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <input
                          type="radio"
                          name="reportReason"
                          value={r.id}
                          checked={reason === r.id}
                          onChange={() => setReason(r.id)}
                          className="text-rose-500"
                        />
                        <span>{isAz ? r.labelAz : r.labelEn}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-foreground mono">
                    {isAz ? "Əlavə Təfərrüatlar (İxtiyari)" : "Additional Details (Optional)"}
                  </label>
                  <textarea
                    rows={3}
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder={
                      isAz
                        ? "Zəhmət olmasa problemi qısaca təsvir edin..."
                        : "Please provide any relevant details or sources..."
                    }
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none resize-none"
                  />
                </div>

                <div className="pt-2 border-t border-border flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-3.5 py-2 rounded-xl border border-border text-xs font-bold uppercase mono text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                  >
                    {isAz ? "LƏĞV ET" : "CANCEL"}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold uppercase mono tracking-wider hover:bg-rose-700 transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
                  >
                    <Flag size={12} />
                    <span>{isSubmitting ? (isAz ? "GÖNDƏRİLİR..." : "SUBMITTING...") : (isAz ? "ŞİKAYƏTİ GÖNDƏR" : "SUBMIT REPORT")}</span>
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
