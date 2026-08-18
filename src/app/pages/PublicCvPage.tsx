import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Printer,
  Calendar,
  Clock,
  Laptop,
  Smartphone,
  Tablet,
  Share2,
  ExternalLink,
  ShieldCheck,
  ArrowLeft,
  Edit3,
  BarChart3,
  Lock,
  Globe,
  Loader2,
  Check,
} from "lucide-react";

import {
  getPublicCvBySlug,
  recordCvView,
  PublicCvRecord,
  saveUserCv,
} from "../../lib/cvStorage";
import { downloadResumeAsPdf } from "../components/tools/resumebuilder/converters/pdfExporter";
import { ResumePreview } from "../components/tools/resumebuilder/templates/ResumePreview";
import { ResumeEditorProvider } from "../components/tools/resumebuilder/context/ResumeEditorContext";
import SEO from "../components/SEO";
import SiteHeader from "../components/SiteHeader";
import Footer from "../components/Footer";
import { useAuth } from "../../hooks/useAuth";
import { useLanguage } from "../../lib/i18n/LanguageContext";
import { Button } from "../components/ui/Button";

export default function PublicCvPage() {
  const { publicSlug } = useParams<{ publicSlug: string }>();
  const [cvRecord, setCvRecord] = useState<PublicCvRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const { user } = useAuth();
  const { t, getLocalizedPath, language } = useLanguage();
  const isAz = language === "az";

  // Load CV and log anonymous view
  useEffect(() => {
    window.scrollTo(0, 0);
    if (!publicSlug) {
      setLoading(false);
      return;
    }

    getPublicCvBySlug(publicSlug)
      .then((data) => {
        setCvRecord(data);

        // Record view if not owner
        if (data) {
          const isOwner = user?.uid && user.uid === data.userId;
          if (!isOwner) {
            let device: "mobile" | "tablet" | "desktop" = "desktop";
            if (window.innerWidth < 640) device = "mobile";
            else if (window.innerWidth < 1024) device = "tablet";

            let referrer = "Direct";
            if (document.referrer) {
              try {
                const refUrl = new URL(document.referrer);
                if (refUrl.hostname.includes("linkedin")) referrer = "LinkedIn";
                else if (refUrl.hostname.includes("google")) referrer = "Google";
                else if (refUrl.hostname.includes("twitter") || refUrl.hostname.includes("t.co")) referrer = "Twitter/X";
                else referrer = refUrl.hostname.replace("www.", "");
              } catch (e) {}
            }

            recordCvView(publicSlug, { device, referrer });
          }
        }
      })
      .finally(() => setLoading(false));
  }, [publicSlug, user?.uid]);

  const isOwner = useMemo(() => {
    return Boolean(user?.uid && cvRecord?.userId && user.uid === cvRecord.userId);
  }, [user?.uid, cvRecord?.userId]);

  const handleDownloadPdf = async () => {
    if (!cvRecord) return;
    setIsGeneratingPdf(true);
    const cleanName = cvRecord.resumeData?.personalInfo?.fullName
      ? cvRecord.resumeData.personalInfo.fullName.replace(/[^a-zA-Z0-9_-]/g, "_")
      : "Resume";
    const filename = `${cleanName}_CV.pdf`;

    await downloadResumeAsPdf("printable-resume", filename);
    setIsGeneratingPdf(false);
  };

  const handleCopyPublicUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleToggleDiscoverability = async () => {
    if (!cvRecord || !isOwner || !user?.uid) return;
    const newDiscoverableState = !cvRecord.isDiscoverable;
    await saveUserCv(
      user.uid,
      cvRecord.resumeData,
      cvRecord.theme,
      {
        cvId: cvRecord.id,
        title: cvRecord.title,
        publicSlug: cvRecord.publicSlug,
        isPublic: true,
        isDiscoverable: newDiscoverableState,
        userDisplayName: cvRecord.userDisplayName,
        userEmail: cvRecord.userEmail,
        userPhoto: cvRecord.userPhoto,
      }
    );
    setCvRecord((prev) => (prev ? { ...prev, isDiscoverable: newDiscoverableState } : prev));
  };

  const name = cvRecord?.resumeData?.personalInfo?.fullName || "Professional Resume";
  const headline = cvRecord?.resumeData?.personalInfo?.title || "Curriculum Vitae";
  const createdDate = cvRecord?.createdAt
    ? new Date(cvRecord.createdAt).toLocaleDateString(isAz ? "az-AZ" : "en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";
  const updatedDate = cvRecord?.updatedAt
    ? new Date(cvRecord.updatedAt).toLocaleDateString(isAz ? "az-AZ" : "en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  return (
    <main
      className="min-h-screen bg-background text-foreground flex flex-col justify-between"
      style={{ fontFamily: "'Geist', sans-serif" }}
    >
      {/* Strict SEO & Safety: Defaults to noindex unless explicitly made discoverable */}
      <SEO
        title={`${name} — ${headline} | Rvan.me`}
        description={`Interactive CV of ${name}, ${headline}.`}
        url={`https://www.rvan.me/cv/${publicSlug || "sample"}`}
        noIndex={!cvRecord?.isDiscoverable}
      />

      <SiteHeader />

      {loading ? (
        <div className="flex-1 flex items-center justify-center py-40">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
              {isAz ? "CV YÜKLƏNİR..." : "LOADING CV..."}
            </p>
          </div>
        </div>
      ) : !cvRecord ? (
        <div className="flex-1 mx-auto max-w-xl px-6 py-32 text-center space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground">
            <Lock size={24} />
          </div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            {isAz ? "CV Tapılmadı və ya Şəxsidir" : "CV Not Found or Private"}
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {isAz
              ? "Axtardığınız CV mövcud deyil, silinib və ya müəllif tərəfindən şəxsi rejimə keçirilib."
              : "The CV you are looking for does not exist, has been deleted, or is set to private by its creator."}
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Button to={getLocalizedPath("/tools/resume-builder")} variant="primary" size="md">
              {isAz ? "ÖZ CV-Nİ YARAT" : "BUILD YOUR OWN CV"}
            </Button>
            <Button to={getLocalizedPath("/")} variant="secondary" size="md">
              {isAz ? "ANA SƏHİFƏ" : "BACK HOME"}
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* ── TOP CREATOR / VIEWER BAR ── */}
          <div className="pt-24 pb-6 px-4 sm:px-6 md:px-10 border-b border-border/60 bg-card/40 backdrop-blur-xl sticky top-0 z-40">
            <div className="mx-auto max-w-[1400px] flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Creator Profile Preview */}
              <div className="flex items-center gap-3.5">
                {cvRecord.userPhoto ? (
                  <img
                    src={cvRecord.userPhoto}
                    alt={name}
                    className="w-11 h-11 rounded-full object-cover border border-white/20 shadow-md shrink-0"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-primary text-black font-extrabold flex items-center justify-center text-sm shrink-0">
                    {name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-base sm:text-lg font-bold text-foreground leading-snug">
                      {name}
                    </h1>
                    {cvRecord.isDiscoverable && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase flex items-center gap-1">
                        <Globe size={10} /> Public
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground font-medium truncate max-w-xs sm:max-w-md">
                    {headline} • <span className="mono text-[11px]">{isAz ? `Yeniləndi: ${updatedDate}` : `Updated: ${updatedDate}`}</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center flex-wrap gap-2.5">
                {/* Share Link */}
                <button
                  onClick={handleCopyPublicUrl}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-white/15 bg-white/5 text-xs font-mono font-bold text-foreground hover:bg-white/10 transition-all cursor-pointer"
                  title="Copy shareable link"
                >
                  {copiedLink ? <Check size={13} className="text-emerald-400" /> : <Share2 size={13} />}
                  <span>{copiedLink ? (isAz ? "KOPYALANDI" : "COPIED") : (isAz ? "LİNKİ PAYLAŞ" : "SHARE LINK")}</span>
                </button>

                {/* Owner Analytics & Controls Button */}
                {isOwner && (
                  <>
                    <button
                      onClick={() => setShowAnalyticsModal(true)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-mono font-bold hover:bg-primary/20 transition-all cursor-pointer"
                      title="View CV Analytics"
                    >
                      <BarChart3 size={13} />
                      <span>
                        {cvRecord.analytics?.totalViews || 0} {isAz ? "BAXIŞ" : "VIEWS"}
                      </span>
                    </button>

                    <Link
                      to={getLocalizedPath(`/tools/resume-builder?cvId=${cvRecord.id}`)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-white/20 bg-white/10 text-xs font-mono font-bold text-foreground hover:bg-white/15 transition-all cursor-pointer"
                    >
                      <Edit3 size={13} />
                      <span>{isAz ? "REDAKTƏ ET" : "EDIT CV"}</span>
                    </Link>
                  </>
                )}

                {/* Download PDF Button */}
                <button
                  onClick={handleDownloadPdf}
                  disabled={isGeneratingPdf}
                  className="flex items-center gap-2 px-5 py-2 rounded-full bg-primary text-black text-xs font-mono font-extrabold hover:bg-primary/90 shadow-md shadow-primary/25 transition-all cursor-pointer shrink-0 disabled:opacity-70"
                >
                  {isGeneratingPdf ? <Loader2 size={13} className="animate-spin" /> : <Printer size={13} />}
                  <span>
                    {isGeneratingPdf
                      ? (isAz ? "YÜKLƏNİR..." : "GENERATING...")
                      : (isAz ? "PDF ENDİR" : "DOWNLOAD PDF")}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* ── MAIN A4 DOCUMENT CONTAINER ── */}
          <div className="flex-1 py-12 px-4 sm:px-6 md:px-10 flex justify-center bg-neutral-950/40">
            <div className="w-full max-w-[850px] shadow-2xl rounded-2xl overflow-hidden border border-border/80">
              <ResumeEditorProvider
                initialData={cvRecord.resumeData}
                initialTheme={cvRecord.theme}
              >
                <ResumePreview
                  data={cvRecord.resumeData}
                  theme={cvRecord.theme}
                />
              </ResumeEditorProvider>
            </div>
          </div>

          {/* ── OWNER ANALYTICS & PRIVACY MODAL ── */}
          <AnimatePresence>
            {showAnalyticsModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full max-w-lg rounded-3xl border border-white/15 bg-neutral-900 p-6 sm:p-8 shadow-2xl text-foreground space-y-6"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-2 text-primary font-mono text-sm font-bold">
                      <BarChart3 size={18} />
                      <span>{isAz ? "CV BAXIŞ ANALİTİKASI" : "CV AUDIENCE ANALYTICS"}</span>
                    </div>
                    <button
                      onClick={() => setShowAnalyticsModal(false)}
                      className="p-1 rounded-full text-muted-foreground hover:text-white transition-colors cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Stats Overview Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl border border-white/10 bg-white/5 space-y-1">
                      <span className="text-[10px] font-mono uppercase text-muted-foreground">
                        {isAz ? "Ümumi Baxış Sayı" : "Total Views"}
                      </span>
                      <p className="text-3xl font-extrabold text-primary mono">
                        {cvRecord.analytics?.totalViews || 0}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl border border-white/10 bg-white/5 space-y-1">
                      <span className="text-[10px] font-mono uppercase text-muted-foreground">
                        {isAz ? "Son Baxış Zamanı" : "Last Viewed"}
                      </span>
                      <p className="text-xs font-mono text-foreground pt-2 truncate">
                        {cvRecord.analytics?.lastViewedAt
                          ? new Date(cvRecord.analytics.lastViewedAt).toLocaleString()
                          : (isAz ? "Hələ baxılmayıb" : "No views yet")}
                      </p>
                    </div>
                  </div>

                  {/* Device Breakdown */}
                  <div className="p-4 rounded-2xl border border-white/10 bg-white/5 space-y-3">
                    <span className="text-xs font-mono uppercase font-bold text-muted-foreground">
                      {isAz ? "Cihaz Növləri" : "Device Breakdown"}
                    </span>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs mono">
                      <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                        <Laptop size={14} className="mx-auto mb-1 text-primary" />
                        <span>Desktop</span>
                        <p className="font-bold text-sm text-white">
                          {cvRecord.analytics?.deviceBreakdown?.desktop || 0}
                        </p>
                      </div>
                      <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                        <Smartphone size={14} className="mx-auto mb-1 text-primary" />
                        <span>Mobile</span>
                        <p className="font-bold text-sm text-white">
                          {cvRecord.analytics?.deviceBreakdown?.mobile || 0}
                        </p>
                      </div>
                      <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                        <Tablet size={14} className="mx-auto mb-1 text-primary" />
                        <span>Tablet</span>
                        <p className="font-bold text-sm text-white">
                          {cvRecord.analytics?.deviceBreakdown?.tablet || 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Privacy & Discoverability Toggle */}
                  <div className="p-4 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-mono font-bold block text-foreground">
                        {isAz ? "Axtarış Sistemlərində Kəşf Edilmə" : "Search Engine Discoverability"}
                      </span>
                      <span className="text-[11px] text-muted-foreground block leading-relaxed">
                        {cvRecord.isDiscoverable
                          ? (isAz ? "CV Google və axtarış sistemləri tərəfindən indekslənir." : "CV is currently indexable by search engines.")
                          : (isAz ? "CV noindex qorunmasındadır (gizlidir)." : "Protected with noindex, nofollow (private).")}
                      </span>
                    </div>
                    <button
                      onClick={handleToggleDiscoverability}
                      className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${
                        cvRecord.isDiscoverable
                          ? "bg-emerald-500 text-black"
                          : "bg-white/10 text-muted-foreground hover:text-white"
                      }`}
                    >
                      {cvRecord.isDiscoverable ? "INDEXABLE" : "NOINDEX"}
                    </button>
                  </div>

                  <div className="pt-2 text-right">
                    <Button onClick={() => setShowAnalyticsModal(false)} variant="secondary" size="sm">
                      {isAz ? "BAĞLA" : "CLOSE"}
                    </Button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </>
      )}

      <Footer />
    </main>
  );
}
