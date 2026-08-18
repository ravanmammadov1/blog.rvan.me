import { useEffect, useState, useRef, ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Sparkles,
  User as UserIcon,
  Sun,
  Moon,
  LogOut,
  Globe,
  Camera,
  RotateCcw,
  Check,
  ShieldCheck
} from "lucide-react";

import { fetchSiteSettings } from "../lib/sanityQueries";
import { SiteSettings } from "../types/cms";
import SEO from "./components/SEO";
import SiteHeader from "./components/SiteHeader";
import Footer from "./components/Footer";
import ScrollToTopButton from "./components/ScrollToTopButton";
import { Button } from "./components/ui/Button";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../lib/i18n/LanguageContext";
import AuthModal from "./components/AuthModal";

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE },
  },
};

export default function ProfilePage() {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [photoSuccessMsg, setPhotoSuccessMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    user,
    signOut,
    userPhoto,
    customAvatar,
    updateCustomAvatar,
    avatarConfig,
    updateAvatarConfig,
    randomizeAvatar,
  } = useAuth();
  const { theme, setTheme } = useTheme();
  const { language, switchLanguage, t, getLocalizedPath } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchSiteSettings(language).then((data) => {
      if (data) setSiteSettings(data);
    });
  }, [language]);

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
      setPhotoSuccessMsg(t("profileUpdated", "Profile photo updated successfully!"));
      setTimeout(() => setPhotoSuccessMsg(""), 3500);
    };
    reader.readAsDataURL(file);
  };

  const handleRandomizeCharacter = () => {
    randomizeAvatar();
    if (customAvatar) {
      updateCustomAvatar(null);
    }
    setPhotoSuccessMsg(language === "az" ? "Yeni xarakter avatarı təsadüfi yaradıldı və yadda saxlanıldı!" : "New character avatar generated & saved to profile!");
    setTimeout(() => setPhotoSuccessMsg(""), 3500);
  };

  const handleResetPhoto = () => {
    updateCustomAvatar(null);
    setPhotoSuccessMsg(language === "az" ? "Xarakter avatarına qaytarıldı." : "Switched back to your vector character avatar.");
    setTimeout(() => setPhotoSuccessMsg(""), 3500);
  };

  const userInitial = user?.displayName ? user.displayName.charAt(0).toUpperCase() : "G";
  const userName = user ? (user.displayName || "User") : t("guestUser", "Guest User");
  const userEmail = user ? user.email : t("notSignedIn", "Not signed in");

  return (
    <main
      className="min-h-screen bg-background text-foreground"
      style={{ fontFamily: "'Geist', sans-serif" }}
    >
      <SEO
        title={`${t("settingsTitle", "Settings")} — Rvan.me`}
        description={t("settingsDescription", "Private user settings, profile photo customizer, interface theme, language preferences, and account control panel.")}
        url="https://www.rvan.me/profile"
      />

      <SiteHeader siteSettings={siteSettings} />

      {/* Ambient background glows */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden opacity-30" aria-hidden="true">
        <div
          className="absolute -top-[15%] left-[10%] h-[700px] w-[700px] rounded-full"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(97,197,173,0.1) 0%, rgba(66,111,186,0.04) 50%, transparent 75%)",
            filter: "blur(90px)",
          }}
        />
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          SETTINGS & PRIVATE USER PROFILE PANEL
      ───────────────────────────────────────────────────────────────────────────── */}
      <section className="px-6 pt-28 pb-20 md:px-10 md:pt-36 relative z-10">
        <div className="mx-auto max-w-[1600px]">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mb-10">
            <span className="text-xs font-bold tracking-[0.2em] text-primary mono uppercase flex items-center gap-2">
              <Sparkles size={14} /> {t("userControlPanel", "USER CONTROL PANEL")}
            </span>
            <h1 className="mt-3 text-4xl font-extrabold tracking-[-.05em] md:text-6xl text-foreground">
              {t("settingsTitle", "SETTINGS")}
            </h1>
            <p className="mt-3 text-sm md:text-base text-muted-foreground max-w-2xl font-medium leading-relaxed">
              {t("settingsDescription", "Manage your personal profile details, profile picture, interface appearance, language preferences, and account controls.")}
            </p>
          </motion.div>

          {/* Unauthenticated User Warning Banner */}
          {!user && (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="mb-8 rounded-2xl border border-primary/30 bg-primary/5 p-4 md:p-6 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-primary uppercase tracking-wider">
                  <ShieldCheck size={16} /> {t("guestProfileBanner", "Guest Session Avatar Active")}
                </div>
                <p className="mt-1 text-xs md:text-sm text-muted-foreground font-medium">
                  {t("guestProfileDesc", "Your browsing session is represented by a unique vector character. Sign in with Google to sync your character identity permanently across all devices.")}
                </p>
              </div>
              <Button
                onClick={() => setAuthModalOpen(true)}
                variant="primary"
                size="sm"
                className="shrink-0"
              >
                {t("signInWithGoogle", "SIGN IN WITH GOOGLE")}
              </Button>
            </motion.div>
          )}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* 1. USER PROFILE & AVATAR CARD */}
            <div className="rounded-3xl border border-white/15 bg-white/5 p-6 md:p-8 backdrop-blur-2xl shadow-xl flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[.18em] text-primary mono mb-4 flex items-center gap-2">
                  <UserIcon size={14} /> {t("profileCardTitle", "PROFILE & AVATAR")}
                </div>

                {/* Profile Photo Display */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                  <div className="relative group/avatar">
                    {userPhoto ? (
                      <img
                        src={userPhoto}
                        alt={userName}
                        className="h-20 w-20 rounded-2xl object-cover border-2 border-primary/60 shadow-[0_0_25px_rgba(97,197,173,0.3)] shrink-0 bg-[#09090b]"
                      />
                    ) : (
                      <div className="h-20 w-20 rounded-2xl bg-primary text-black font-extrabold flex items-center justify-center text-xl shadow-[0_0_20px_rgba(97,197,173,0.3)] shrink-0">
                        {userInitial}
                      </div>
                    )}
                    <button
                      onClick={handleRandomizeCharacter}
                      className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-lg bg-primary text-black shadow-md hover:scale-110 transition-transform cursor-pointer"
                      title={language === "az" ? "Təsadüfi Avatar Yarat" : "Randomize Avatar"}
                    >
                      <Sparkles size={13} />
                    </button>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-base font-bold text-white truncate">{userName}</p>
                    <p className="text-xs text-muted-foreground truncate mono mt-0.5">{userEmail}</p>
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 font-bold mt-1.5 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <Check size={10} /> {customAvatar ? (language === "az" ? "Xüsusi Foto" : "Custom Photo") : (language === "az" ? "Xarakter Avatarı" : "Character Avatar")}
                    </span>
                  </div>
                </div>

                {photoSuccessMsg && (
                  <div className="mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-2.5 text-[11px] font-mono text-emerald-400 font-medium">
                    {photoSuccessMsg}
                  </div>
                )}

                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/webp, image/gif"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button
                    onClick={handleRandomizeCharacter}
                    variant="outline"
                    size="sm"
                    className="w-full"
                    icon={<Sparkles size={14} className="text-primary" />}
                    iconPosition="left"
                  >
                    {language === "az" ? "TƏSADÜFİ AVATAR 🎲" : "RANDOMIZE CHARACTER 🎲"}
                  </Button>

                  <Button
                    to={getLocalizedPath("/tools/open-peeps")}
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    icon={<ArrowUpRight size={14} className="text-primary" />}
                    iconPosition="right"
                  >
                    {language === "az" ? "STUDİODA FƏRDLƏŞDİR" : "CUSTOMIZE IN AVATAR STUDIO"}
                  </Button>

                  {user ? (
                    <>
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        variant="ghost"
                        size="sm"
                        className="w-full text-xs text-muted-foreground hover:text-white"
                        icon={<Camera size={13} />}
                        iconPosition="left"
                      >
                        {t("changeProfilePhoto", "Upload Custom Image")}
                      </Button>

                      {customAvatar && (
                        <Button
                          onClick={handleResetPhoto}
                          variant="ghost"
                          size="sm"
                          className="w-full text-xs text-primary hover:text-white"
                          icon={<RotateCcw size={13} />}
                          iconPosition="left"
                        >
                          {language === "az" ? "Xarakter Avatarına Qayıt" : "Reset to Vector Avatar"}
                        </Button>
                      )}
                    </>
                  ) : (
                    <Button
                      onClick={() => setAuthModalOpen(true)}
                      variant="primary"
                      size="sm"
                      className="w-full mt-2"
                    >
                      {t("signInWithGoogle", "SIGN IN WITH GOOGLE")}
                    </Button>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10">
                <Button
                  to={getLocalizedPath("/tools/open-peeps")}
                  variant="secondary"
                  size="md"
                  className="w-full justify-between"
                  icon={<ArrowUpRight size={14} className="text-primary" />}
                >
                  {language === "az" ? "Xarakter Redaktorunu Aç" : "Open Character Builder"}
                </Button>
              </div>
            </div>

            {/* 2. APPEARANCE CARD */}
            <div className="rounded-3xl border border-white/15 bg-white/5 p-6 md:p-8 backdrop-blur-2xl shadow-xl flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[.18em] text-primary mono mb-4 flex items-center gap-2">
                  <Sun size={14} /> {t("appearanceCardTitle", "APPEARANCE")}
                </div>
                <p className="text-xs text-muted-foreground font-mono mb-4">
                  {t("appearanceDesc", "Select your preferred visual aesthetic theme.")}
                </p>
                <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-black/40 border border-white/10">
                  <button
                    onClick={() => setTheme("dark")}
                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-mono font-bold transition-all ${
                      theme === "dark" ? "bg-primary text-black" : "text-muted-foreground hover:text-white"
                    }`}
                  >
                    <Moon size={14} /> {t("darkTheme", "Dark")}
                  </button>
                  <button
                    onClick={() => setTheme("light")}
                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-mono font-bold transition-all ${
                      theme === "light" ? "bg-primary text-black" : "text-muted-foreground hover:text-white"
                    }`}
                  >
                    <Sun size={14} /> {t("lightTheme", "Light")}
                  </button>
                </div>
              </div>
              <div className="mt-4 text-[10px] font-mono text-muted-foreground/60 text-right uppercase">
                {language === "az" ? `AKTİV: ${theme === "dark" ? "QARANLIQ" : "İŞIQLI"} REJİMİ` : `ACTIVE: ${theme.toUpperCase()} MODE`}
              </div>
            </div>

            {/* 3. LANGUAGE CARD */}
            <div className="rounded-3xl border border-white/15 bg-white/5 p-6 md:p-8 backdrop-blur-2xl shadow-xl flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[.18em] text-primary mono mb-4 flex items-center gap-2">
                  <Globe size={14} /> {t("languageCardTitle", "LANGUAGE")}
                </div>
                <p className="text-xs text-muted-foreground font-mono mb-4">
                  {t("languageDesc", "Choose your preferred website language.")}
                </p>
                <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-black/40 border border-white/10">
                  <button
                    onClick={() => switchLanguage("en")}
                    className={`py-3 px-4 rounded-xl text-xs font-mono font-bold transition-all ${
                      language === "en" ? "bg-primary text-black" : "text-muted-foreground hover:text-white"
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => switchLanguage("az")}
                    className={`py-3 px-4 rounded-xl text-xs font-mono font-bold transition-all ${
                      language === "az" ? "bg-primary text-black" : "text-muted-foreground hover:text-white"
                    }`}
                  >
                    Azərbaycan
                  </button>
                </div>
              </div>
              <div className="mt-4 text-[10px] font-mono text-muted-foreground/60 text-right uppercase">
                {language === "az" ? "AKTİV: AZƏRBAYCAN DİLİ" : "ACTIVE: ENGLISH"}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer siteSettings={siteSettings} />
      <ScrollToTopButton />
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </main>
  );
}
