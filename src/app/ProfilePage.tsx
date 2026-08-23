import { useEffect, useState, useRef, ChangeEvent } from "react";
import { motion } from "framer-motion";
import {
  User as UserIcon,
  Sun,
  Moon,
  LogOut,
  Globe,
  Camera,
  RotateCcw,
  Check,
  ShieldCheck,
  Sparkles,
  Palette,
  Loader2,
  Sliders,
  ChevronDown,
  ChevronUp,
  PenTool,
  Send,
  FileText,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getSubmissionsByAuthor } from "../services/contributorService";
import { ArticleSubmission } from "../types/contributor";
import ArticleSubmissionModal from "./components/contributor/ArticleSubmissionModal";

import { fetchSiteSettings } from "../lib/sanityQueries";
import { SiteSettings } from "../types/cms";
import SEO from "./components/SEO";
import SiteHeader from "./components/SiteHeader";
import Footer from "./components/Footer";
import ScrollToTopButton from "./components/ScrollToTopButton";
import { Button } from "./components/ui/Button";
import { Eyebrow } from "./components/Eyebrow";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../lib/i18n/LanguageContext";
import AuthModal from "./components/AuthModal";
import {
  EXPRESSIONS,
  HAIR_STYLES,
  ACCESSORIES,
  SKIN_TONES,
  HAIR_COLORS,
  CLOTHING_COLORS,
  PeepConfig,
} from "../lib/peepsAssets";
import {
  generateDeterministicPeep,
  getUserAvatarConfig,
} from "../lib/avatarEngine";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function ProfilePage() {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [photoSuccessMsg, setPhotoSuccessMsg] = useState("");
  const [bioText, setBioText] = useState("");
  const [bioSaved, setBioSaved] = useState(false);
  const [showAvatarStudio, setShowAvatarStudio] = useState(false);
  const [submissions, setSubmissions] = useState<ArticleSubmission[]>([]);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    user,
    profile,
    loading: authLoading,
    signOut,
    userPhoto,
    customAvatar,
    updateCustomAvatar,
    avatarConfig,
    updateAvatarConfig,
    updateBio,
  } = useAuth();

  const { theme, setTheme } = useTheme();
  const { language, switchLanguage, t, getLocalizedPath } = useLanguage();
  const isAz = language === "az";

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchSiteSettings(language).then((data) => {
      if (data) setSiteSettings(data);
    });
  }, [language]);

  useEffect(() => {
    if (user?.uid) {
      setSubmissions(getSubmissionsByAuthor(user.uid));
    }
  }, [user?.uid]);

  const refreshSubmissions = () => {
    if (user?.uid) {
      setSubmissions(getSubmissionsByAuthor(user.uid));
    }
  };

  useEffect(() => {
    if (profile?.bio) {
      setBioText(profile.bio);
    }
  }, [profile?.bio]);

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB limit. Please choose a smaller image.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64Url = reader.result as string;
      updateCustomAvatar(base64Url);
      setPhotoSuccessMsg(isAz ? "Profil şəkli uğurla yeniləndi!" : "Profile photo updated successfully!");
      setTimeout(() => setPhotoSuccessMsg(""), 3500);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveBio = (e: React.FormEvent) => {
    e.preventDefault();
    updateBio(bioText);
    setBioSaved(true);
    setTimeout(() => setBioSaved(false), 3000);
  };

  const handleResetToGooglePhoto = () => {
    updateCustomAvatar(null);
    updateAvatarConfig(null);
    setPhotoSuccessMsg(isAz ? "Google profil şəklinə qaytarıldı." : "Reset to your Google account photo.");
    setTimeout(() => setPhotoSuccessMsg(""), 3500);
  };

  const activePeepConfig: PeepConfig =
    avatarConfig || (user ? getUserAvatarConfig(user.uid) : generateDeterministicPeep("guest"));

  const handleUpdatePeepField = (field: keyof PeepConfig, value: any) => {
    const updated = { ...activePeepConfig, [field]: value };
    // If user was using custom photo, clear it to activate vector avatar
    if (customAvatar) {
      updateCustomAvatar(null);
    }
    updateAvatarConfig(updated);
    setPhotoSuccessMsg(isAz ? "Vektor avatar yeniləndi!" : "Vector avatar customized & saved!");
    setTimeout(() => setPhotoSuccessMsg(""), 3500);
  };

  const handleRandomizeVector = () => {
    if (!user) return;
    const randomConfig = generateDeterministicPeep(`random_${Date.now()}_${Math.random()}`);
    if (customAvatar) {
      updateCustomAvatar(null);
    }
    updateAvatarConfig(randomConfig);
    setPhotoSuccessMsg(isAz ? "Yeni vektor avatar yaradıldı!" : "New vector avatar generated & saved!");
    setTimeout(() => setPhotoSuccessMsg(""), 3500);
  };

  const userInitial = user?.displayName ? user.displayName.charAt(0).toUpperCase() : "G";
  const userName = user ? (user.displayName || "User") : t("guestUser", "Guest Visitor");
  const userEmail = user ? user.email : t("notSignedIn", "Not signed in");

  return (
    <main
      className="min-h-screen bg-background text-foreground"
      style={{ fontFamily: "'Geist', sans-serif" }}
    >
      <SEO
        title={`${t("settingsTitle", "Settings")} — Rvan.me`}
        description={t(
          "settingsDescription",
          "Private user settings, profile photo customizer, interface theme, language preferences, and account control panel."
        )}
        url="https://www.rvan.me/profile"
      />

      <SiteHeader siteSettings={siteSettings} />

      <section className="px-6 pt-28 pb-20 md:px-10 md:pt-36 relative z-10">
        <div className="mx-auto max-w-[1600px]">
          {/* Header */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mb-10">
            <Eyebrow className="text-primary tracking-[.2em] mb-2">
              {isAz ? "İSTİFADƏÇİ İDARƏETMƏ PANİELİ" : "USER CONTROL PANEL"}
            </Eyebrow>
            <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-5xl text-foreground">
              {t("settingsTitle", "Settings & Profile")}
            </h1>
            <p className="mt-3 text-sm md:text-base text-muted-foreground max-w-2xl font-normal leading-relaxed">
              {t(
                "settingsDescription",
                "Manage your personal profile details, profile picture, interface appearance, language preferences, and account controls."
              )}
            </p>
          </motion.div>

          {/* Loading Auth State */}
          {authLoading ? (
            <div className="h-96 rounded-2xl border border-border bg-card flex flex-col items-center justify-center gap-3 text-muted-foreground">
              <Loader2 size={24} className="animate-spin text-primary" />
              <span className="text-xs mono uppercase tracking-wider">{isAz ? "YÜKLƏNİR..." : "INITIALIZING PROFILE..."}</span>
            </div>
          ) : !user ? (
            /* Unauthenticated Visitor State */
            <div className="space-y-8">
              <div className="rounded-2xl border border-border bg-card p-8 md:p-12 text-center max-w-2xl mx-auto space-y-6">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
                  <UserIcon size={26} />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-foreground">
                    {isAz ? "Hesabınıza Daxil Olun" : "Sign In with Google"}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {isAz
                      ? "Profil parametrlərinizi tənzimləmək, xüsusi profil şəkli seçmək və rəy bildirmək üçün Google ilə daxil olun."
                      : "Sign in with your Google account to access your personal profile, customize your avatar, manage preferences, and participate in article discussions."}
                  </p>
                </div>
                <Button
                  onClick={() => setAuthModalOpen(true)}
                  variant="primary"
                  size="lg"
                  className="mx-auto"
                >
                  {t("signInWithGoogle", "SIGN IN WITH GOOGLE")}
                </Button>
              </div>

              {/* Preferences Accessible for Guests */}
              <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
                {/* Appearance */}
                <div className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-primary mono uppercase tracking-wider">
                    <Sun size={14} /> {t("appearanceCardTitle", "APPEARANCE")}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t("appearanceDesc", "Select your preferred visual aesthetic theme.")}
                  </p>
                  <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-muted/50 border border-border">
                    <button
                      onClick={() => setTheme("dark")}
                      className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all ${
                        theme === "dark" ? "bg-card text-foreground border border-border shadow-sm" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Moon size={13} /> {t("darkTheme", "Dark")}
                    </button>
                    <button
                      onClick={() => setTheme("light")}
                      className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all ${
                        theme === "light" ? "bg-card text-foreground border border-border shadow-sm" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Sun size={13} /> {t("lightTheme", "Light")}
                    </button>
                  </div>
                </div>

                {/* Language */}
                <div className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-primary mono uppercase tracking-wider">
                    <Globe size={14} /> {t("languageCardTitle", "LANGUAGE")}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t("languageDesc", "Choose your preferred website language.")}
                  </p>
                  <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-muted/50 border border-border font-mono text-xs">
                    <button
                      onClick={() => switchLanguage("en")}
                      className={`py-2.5 px-3 rounded-lg font-bold transition-all ${
                        language === "en" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => switchLanguage("az")}
                      className={`py-2.5 px-3 rounded-lg font-bold transition-all ${
                        language === "az" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Azərbaycan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Authenticated User Dashboard */
            <div className="grid gap-8 lg:grid-cols-12 items-start">
              {/* Left Column: Profile & Avatar Management */}
              <div className="lg:col-span-8 space-y-8">
                {/* 1. Profile Picture & Identity Card */}
                <div className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-border">
                    <div className="flex items-center gap-2 text-xs font-bold text-primary mono uppercase tracking-wider">
                      <UserIcon size={14} /> {isAz ? "PROFİL VƏ ŞƏKİL" : "PROFILE & AVATAR"}
                    </div>
                    <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Check size={11} /> {isAz ? "DOĞRULANMIŞ HESAB" : "VERIFIED GOOGLE ACCOUNT"}
                    </span>
                  </div>

                  {photoSuccessMsg && (
                    <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs font-mono text-emerald-600 dark:text-emerald-400 font-medium">
                      {photoSuccessMsg}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    {/* Avatar Display */}
                    <div className="relative">
                      {userPhoto ? (
                        <img
                          src={userPhoto}
                          alt={userName}
                          className="h-24 w-24 rounded-2xl object-cover border-2 border-border bg-surface shrink-0 shadow-sm"
                        />
                      ) : (
                        <div className="h-24 w-24 rounded-2xl bg-primary text-primary-foreground font-bold flex items-center justify-center text-2xl shrink-0 shadow-sm">
                          {userInitial}
                        </div>
                      )}
                    </div>

                    <div className="space-y-1.5 min-w-0 flex-1">
                      <h2 className="text-xl font-bold text-foreground truncate">{userName}</h2>
                      <p className="text-xs text-muted-foreground mono truncate">{userEmail}</p>
                      <p className="text-[11px] text-muted-foreground/80 mono pt-1">
                        {customAvatar
                          ? (isAz ? "Fərdi yüklənmiş şəkil aktivdir" : "Custom uploaded photo is active")
                          : avatarConfig
                          ? (isAz ? "Fərdiləşdirilmiş vektor avatar aktivdir" : "Customized vector avatar is active")
                          : (isAz ? "Google profil şəkli aktivdir" : "Google account photo is active")}
                      </p>
                    </div>
                  </div>

                  {/* Photo Actions */}
                  <div className="flex flex-wrap gap-3 pt-2">
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      variant="primary"
                      size="sm"
                      icon={<Camera size={13} />}
                      iconPosition="left"
                    >
                      {isAz ? "FOTO YÜKLƏ" : "UPLOAD IMAGE"}
                    </Button>

                    <Button
                      onClick={() => setShowAvatarStudio(!showAvatarStudio)}
                      variant="secondary"
                      size="sm"
                      icon={showAvatarStudio ? <ChevronUp size={13} /> : <Sliders size={13} />}
                      iconPosition="right"
                    >
                      {showAvatarStudio
                        ? (isAz ? "VEKTOR REDAKTORU BAĞLA" : "HIDE VECTOR BUILDER")
                        : (isAz ? "VEKTOR AVATAR YARAT" : "CUSTOMIZE VECTOR AVATAR")}
                    </Button>

                    {(customAvatar || avatarConfig) && (
                      <Button
                        onClick={handleResetToGooglePhoto}
                        variant="ghost"
                        size="sm"
                        icon={<RotateCcw size={13} />}
                        iconPosition="left"
                      >
                        {isAz ? "GOOGLE ŞƏKLİNƏ QAYIT" : "RESET TO GOOGLE PHOTO"}
                      </Button>
                    )}

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png, image/jpeg, image/webp"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </div>

                  {/* Integrated Vector Avatar Customizer Accordion */}
                  {showAvatarStudio && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pt-6 border-t border-border space-y-6"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-bold text-foreground">
                            {isAz ? "Vektor Avatar Redaktoru" : "Vector Avatar Builder"}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {isAz
                              ? "İfadə, saç forması və rəngləri seçərək öz fərdi avatarınızı qurun."
                              : "Choose your hair style, expression, and colors to craft a unique profile avatar."}
                          </p>
                        </div>

                        <Button
                          onClick={handleRandomizeVector}
                          variant="secondary"
                          size="sm"
                          icon={<Sparkles size={13} className="text-primary" />}
                        >
                          {isAz ? "TƏSADÜFİ 🎲" : "RANDOMIZE 🎲"}
                        </Button>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        {/* Expression */}
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mono mb-2">
                            {isAz ? "İfadələr" : "Expression"}
                          </label>
                          <select
                            value={activePeepConfig.headExpression}
                            onChange={(e) => handleUpdatePeepField("headExpression", e.target.value)}
                            className="w-full rounded-xl border border-border bg-input px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                          >
                            {EXPRESSIONS.map((exp) => (
                              <option key={exp.id} value={exp.id}>
                                {exp.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Hair Style */}
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mono mb-2">
                            {isAz ? "Saç Forması" : "Hair Style"}
                          </label>
                          <select
                            value={activePeepConfig.hairStyle}
                            onChange={(e) => handleUpdatePeepField("hairStyle", e.target.value)}
                            className="w-full rounded-xl border border-border bg-input px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                          >
                            {HAIR_STYLES.map((hair) => (
                              <option key={hair.id} value={hair.id}>
                                {hair.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Accessories */}
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mono mb-2">
                            {isAz ? "Aksessuar" : "Accessory"}
                          </label>
                          <select
                            value={activePeepConfig.accessory}
                            onChange={(e) => handleUpdatePeepField("accessory", e.target.value)}
                            className="w-full rounded-xl border border-border bg-input px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                          >
                            {ACCESSORIES.map((acc) => (
                              <option key={acc.id} value={acc.id}>
                                {acc.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Skin Tone */}
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mono mb-2">
                            {isAz ? "Dəri Rəngi" : "Skin Tone"}
                          </label>
                          <div className="flex gap-2 flex-wrap">
                            {SKIN_TONES.map((color) => (
                              <button
                                key={color.value}
                                type="button"
                                onClick={() => handleUpdatePeepField("skinColor", color.value)}
                                style={{ backgroundColor: color.value }}
                                className={`h-6 w-6 rounded-full border-2 transition-transform ${
                                  activePeepConfig.skinColor === color.value
                                    ? "border-primary scale-110 shadow-sm"
                                    : "border-transparent hover:scale-105"
                                }`}
                                title={color.label}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* 2. Bio & Information Card */}
                <div className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-border">
                    <div className="flex items-center gap-2 text-xs font-bold text-primary mono uppercase tracking-wider">
                      {isAz ? "HAQQIMDA VƏ BIO" : "ABOUT & BIO"}
                    </div>
                  </div>

                  <form onSubmit={handleSaveBio} className="space-y-4">
                    <div>
                      <label htmlFor="bio" className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mono mb-2">
                        {isAz ? "Qısa Təqdimat (Bio)" : "Short Bio / Perspective"}
                      </label>
                      <textarea
                        id="bio"
                        rows={3}
                        value={bioText}
                        onChange={(e) => setBioText(e.target.value)}
                        placeholder={
                          isAz
                            ? "Dizayn, marketinq və ya yaradıcı sahədə fəaliyyətiniz barədə qısa qeyd..."
                            : "Share a brief note about your creative work, design focus, or perspectives..."
                        }
                        className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors resize-none"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <Button type="submit" variant="secondary" size="sm">
                        {isAz ? "YADDA SAXLA" : "SAVE BIO"}
                      </Button>
                      {bioSaved && (
                        <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                          <Check size={12} /> {isAz ? "Yadda saxlanıldı!" : "Saved successfully!"}
                        </span>
                      )}
                    </div>
                  </form>
                </div>

                {/* 3. Contributor & Community Publishing Hub */}
                <div className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-primary mono uppercase tracking-wider">
                      <PenTool size={14} /> {isAz ? "MÜƏLLİFLİK VƏ NƏŞR MƏRKƏZİ" : "CONTRIBUTOR & WRITING HUB"}
                    </div>
                    <button
                      onClick={() => setSubmitModalOpen(true)}
                      className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold uppercase mono tracking-wider hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
                    >
                      <Send size={12} />
                      <span>{isAz ? "YENİ MƏQALƏ TƏQDİM ET" : "SUBMIT DRAFT"}</span>
                    </button>
                  </div>

                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed font-normal">
                    {isAz
                      ? "Rvan.me-də məqalələrinizi öz adınızla nəşr edin, peşəkar fikirlərinizi Azərbaycanın yaradıcı icması ilə bölüşün."
                      : "Publish your articles under your name on Rvan.me, sharing your insights with Azerbaijan's creative community."}
                  </p>

                  {/* Submissions List */}
                  <div className="space-y-3">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mono">
                      {isAz ? "Təqdim Etdiyiniz Məqalələr" : "Your Submitted Drafts"} ({submissions.length})
                    </div>

                    {submissions.length > 0 ? (
                      <div className="space-y-2.5">
                        {submissions.map((sub) => (
                          <div
                            key={sub.id}
                            className="p-4 rounded-xl border border-border bg-surface/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                          >
                            <div className="space-y-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-foreground truncate">{sub.title}</span>
                                <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                                  {sub.category}
                                </span>
                              </div>
                              <div className="text-[11px] text-muted-foreground mono flex items-center gap-2">
                                <span>{new Date(sub.createdAt).toLocaleDateString()}</span>
                                <span>•</span>
                                <span>AI: {sub.aiDisclosure === "none" ? "Yoxdur" : sub.aiDisclosure === "assisted" ? "Köməkçi" : "Geniş"}</span>
                              </div>
                            </div>

                            <div className="shrink-0 flex items-center gap-2">
                              <span
                                className={`text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-md border ${
                                  sub.status === "PUBLISHED"
                                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                    : sub.status === "APPROVED"
                                    ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                    : sub.status === "CHANGES_REQUESTED"
                                    ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                    : sub.status === "REJECTED"
                                    ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                                    : "bg-primary/10 text-primary border-primary/20"
                                }`}
                              >
                                {sub.status === "SUBMITTED"
                                  ? (isAz ? "Baxışda" : "SUBMITTED")
                                  : sub.status === "UNDER_REVIEW"
                                  ? (isAz ? "Redaksiya Yoxlayır" : "UNDER REVIEW")
                                  : sub.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 rounded-xl border border-border/80 bg-surface/30 text-center space-y-2">
                        <FileText size={24} className="mx-auto text-muted-foreground/60" />
                        <p className="text-xs text-muted-foreground">
                          {isAz
                            ? "Hələlik heç bir məqalə təqdim etməmisiniz. İlk layihənizi redaksiyamıza göndərin."
                            : "You haven't submitted any drafts yet. Submit your first article draft for editorial review."}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Preferences & Account Card */}
              <div className="lg:col-span-4 space-y-8">
                {/* 4. Appearance */}
                <div className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-primary mono uppercase tracking-wider">
                    <Sun size={14} /> {t("appearanceCardTitle", "APPEARANCE")}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t("appearanceDesc", "Select your preferred visual aesthetic theme.")}
                  </p>
                  <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-muted/50 border border-border">
                    <button
                      onClick={() => setTheme("dark")}
                      className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all ${
                        theme === "dark" ? "bg-card text-foreground border border-border shadow-sm" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Moon size={13} /> {t("darkTheme", "Dark")}
                    </button>
                    <button
                      onClick={() => setTheme("light")}
                      className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all ${
                        theme === "light" ? "bg-card text-foreground border border-border shadow-sm" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Sun size={13} /> {t("lightTheme", "Light")}
                    </button>
                  </div>
                </div>

                {/* 5. Language */}
                <div className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-primary mono uppercase tracking-wider">
                    <Globe size={14} /> {t("languageCardTitle", "LANGUAGE")}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t("languageDesc", "Choose your preferred website language.")}
                  </p>
                  <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-muted/50 border border-border font-mono text-xs">
                    <button
                      onClick={() => switchLanguage("en")}
                      className={`py-2.5 px-3 rounded-lg font-bold transition-all ${
                        language === "en" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => switchLanguage("az")}
                      className={`py-2.5 px-3 rounded-lg font-bold transition-all ${
                        language === "az" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Azərbaycan
                    </button>
                  </div>
                </div>

                {/* 6. Account Controls */}
                <div className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-primary mono uppercase tracking-wider">
                    <ShieldCheck size={14} /> {isAz ? "HESAB MƏLUMATLARI" : "ACCOUNT"}
                  </div>
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div>
                      <span className="font-bold text-foreground">Provider:</span> Google OAuth
                    </div>
                    <div>
                      <span className="font-bold text-foreground">Email:</span> {userEmail}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border">
                    <button
                      onClick={signOut}
                      className="w-full flex items-center justify-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-xs font-bold text-destructive hover:bg-destructive hover:text-white transition-colors mono uppercase tracking-wider cursor-pointer"
                    >
                      <LogOut size={14} /> {t("signOut", "SIGN OUT")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer siteSettings={siteSettings} />
      <ScrollToTopButton />
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <ArticleSubmissionModal
        isOpen={submitModalOpen}
        onClose={() => setSubmitModalOpen(false)}
        onSubmitted={refreshSubmissions}
      />
    </main>
  );
}
