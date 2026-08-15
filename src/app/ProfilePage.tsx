import { useEffect, useState, useRef, ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Sparkles,
  User as UserIcon,
  Sun,
  Moon,
  Zap,
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
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../lib/i18n/LanguageContext";
import { useExperience } from "../context/ExperienceContext";
import AuthModal from "./components/AuthModal";

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay, ease: EASE },
  }),
};

export default function ProfilePage() {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [photoSuccessMsg, setPhotoSuccessMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { user, signOut, userPhoto, customAvatar, updateCustomAvatar } = useAuth();
  const { theme, setTheme } = useTheme();
  const { language, switchLanguage, t, getLocalizedPath } = useLanguage();
  const { settings, toggleAnimations, toggleCursorEffects, toggleBackgroundEffects } = useExperience();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchSiteSettings().then((data) => {
      if (data) setSiteSettings(data);
    });
  }, []);

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
      setPhotoSuccessMsg("Profile photo updated successfully!");
      setTimeout(() => setPhotoSuccessMsg(""), 3500);
    };
    reader.readAsDataURL(file);
  };

  const handleResetPhoto = () => {
    updateCustomAvatar(null);
    setPhotoSuccessMsg("Reset to default profile photo.");
    setTimeout(() => setPhotoSuccessMsg(""), 3500);
  };

  const userInitial = user?.displayName ? user.displayName.charAt(0).toUpperCase() : "U";
  const userName = user?.displayName || "Ravan Mammadov";
  const userEmail = user?.email || "mammadovravan1@gmail.com";

  return (
    <main
      className="min-h-screen bg-background text-foreground"
      style={{ fontFamily: "'Geist', sans-serif" }}
    >
      <SEO
        title="My Profile & Settings — Rvan.me"
        description="Private user settings, profile photo customizer, interface theme, language preferences, and account control panel."
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
              <Sparkles size={14} /> USER CONTROL PANEL
            </span>
            <h1 className="mt-3 text-4xl font-extrabold tracking-[-.05em] md:text-6xl text-foreground">
              SETTINGS
            </h1>
            <p className="mt-3 text-sm md:text-base text-muted-foreground max-w-2xl font-medium leading-relaxed">
              Manage your personal profile details, profile picture, interface appearance, language preferences, and account controls.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* 1. USER PROFILE & AVATAR CARD */}
            <div className="rounded-3xl border border-white/15 bg-white/5 p-6 md:p-8 backdrop-blur-2xl shadow-xl flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[.18em] text-primary mono mb-4 flex items-center gap-2">
                  <UserIcon size={14} /> PROFILE
                </div>

                {/* Profile Photo Display */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                  <div className="relative group/avatar">
                    {userPhoto ? (
                      <img
                        src={userPhoto}
                        alt={userName}
                        className="h-16 w-16 rounded-2xl object-cover border-2 border-primary/60 shadow-[0_0_20px_rgba(97,197,173,0.3)] shrink-0"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-2xl bg-primary text-black font-extrabold flex items-center justify-center text-xl shadow-[0_0_20px_rgba(97,197,173,0.3)] shrink-0">
                        {userInitial}
                      </div>
                    )}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-lg bg-primary text-black shadow-md hover:scale-110 transition-transform cursor-pointer"
                      title="Change photo"
                    >
                      <Camera size={12} />
                    </button>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-base font-bold text-white truncate">{userName}</p>
                    <p className="text-xs text-muted-foreground truncate mono mt-0.5">{userEmail}</p>
                    {customAvatar && (
                      <span className="inline-flex items-center gap-1 text-[9px] font-mono text-emerald-400 font-bold mt-1">
                        <Check size={10} /> Custom Photo
                      </span>
                    )}
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
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary/10 border border-primary/40 px-4 py-2.5 text-xs font-mono font-bold text-primary hover:bg-primary hover:text-black transition-all"
                  >
                    <Camera size={14} /> Change Profile Photo
                  </button>

                  {customAvatar && (
                    <button
                      onClick={handleResetPhoto}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-xs font-mono text-muted-foreground hover:text-white hover:bg-white/10 transition-all"
                    >
                      <RotateCcw size={13} /> Reset Photo
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10">
                <Link
                  to={getLocalizedPath("/profile")}
                  className="w-full flex items-center justify-between rounded-xl bg-white/10 border border-white/15 px-4 py-3 text-xs font-mono font-bold text-foreground hover:border-primary/50 hover:bg-white/20 transition-all text-left"
                >
                  <span>View My Profile</span>
                  <ArrowUpRight size={14} className="text-primary" />
                </Link>
              </div>
            </div>

            {/* 2. APPEARANCE CARD */}
            <div className="rounded-3xl border border-white/15 bg-white/5 p-6 md:p-8 backdrop-blur-2xl shadow-xl flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[.18em] text-primary mono mb-4 flex items-center gap-2">
                  <Sun size={14} /> APPEARANCE
                </div>
                <p className="text-xs text-muted-foreground font-mono mb-4">
                  Select your preferred visual aesthetic theme.
                </p>
                <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-black/40 border border-white/10">
                  <button
                    onClick={() => setTheme("dark")}
                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-mono font-bold transition-all ${
                      theme === "dark" ? "bg-primary text-black shadow-lg" : "text-muted-foreground hover:text-white"
                    }`}
                  >
                    <Moon size={14} /> Dark
                  </button>
                  <button
                    onClick={() => setTheme("light")}
                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-mono font-bold transition-all ${
                      theme === "light" ? "bg-primary text-black shadow-lg" : "text-muted-foreground hover:text-white"
                    }`}
                  >
                    <Sun size={14} /> Light
                  </button>
                </div>
              </div>
              <div className="mt-4 text-[10px] font-mono text-muted-foreground/60 text-right uppercase">
                Active: {theme} mode
              </div>
            </div>

            {/* 3. LANGUAGE CARD */}
            <div className="rounded-3xl border border-white/15 bg-white/5 p-6 md:p-8 backdrop-blur-2xl shadow-xl flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[.18em] text-primary mono mb-4 flex items-center gap-2">
                  <Globe size={14} /> LANGUAGE
                </div>
                <p className="text-xs text-muted-foreground font-mono mb-4">
                  Choose your preferred website language.
                </p>
                <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-black/40 border border-white/10">
                  <button
                    onClick={() => switchLanguage("en")}
                    className={`py-3 px-4 rounded-xl text-xs font-mono font-bold transition-all ${
                      language === "en" ? "bg-primary text-black shadow-lg" : "text-muted-foreground hover:text-white"
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => switchLanguage("az")}
                    className={`py-3 px-4 rounded-xl text-xs font-mono font-bold transition-all ${
                      language === "az" ? "bg-primary text-black shadow-lg" : "text-muted-foreground hover:text-white"
                    }`}
                  >
                    Azərbaycan
                  </button>
                </div>
              </div>
              <div className="mt-4 text-[10px] font-mono text-muted-foreground/60 text-right uppercase">
                Active: {language === "az" ? "Azərbaycan dili" : "English"}
              </div>
            </div>

            {/* 4. EXPERIENCE CARD */}
            <div className="rounded-3xl border border-white/15 bg-white/5 p-6 md:p-8 backdrop-blur-2xl shadow-xl lg:col-span-2 flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[.18em] text-primary mono mb-4 flex items-center gap-2">
                  <Zap size={14} /> EXPERIENCE & PERFORMANCE
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {/* Animations Toggle */}
                  <div className="p-4 rounded-2xl border border-white/10 bg-white/5 flex flex-col justify-between">
                    <div>
                      <p className="text-xs font-bold text-white font-mono">Animations</p>
                      <p className="text-[10px] text-muted-foreground mt-1">UI motion & smooth keyframe transitions</p>
                    </div>
                    <button
                      onClick={toggleAnimations}
                      className={`mt-4 w-full py-2 px-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                        settings.animations ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40" : "bg-white/5 text-muted-foreground border border-white/10"
                      }`}
                    >
                      {settings.animations ? "ENABLED" : "DISABLED"}
                    </button>
                  </div>

                  {/* Cursor Effects Toggle */}
                  <div className="p-4 rounded-2xl border border-white/10 bg-white/5 flex flex-col justify-between">
                    <div>
                      <p className="text-xs font-bold text-white font-mono">Cursor Effects</p>
                      <p className="text-[10px] text-muted-foreground mt-1">Custom interactive pointer visuals</p>
                    </div>
                    <button
                      onClick={toggleCursorEffects}
                      className={`mt-4 w-full py-2 px-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                        settings.cursorEffects ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40" : "bg-white/5 text-muted-foreground border border-white/10"
                      }`}
                    >
                      {settings.cursorEffects ? "ENABLED" : "DISABLED"}
                    </button>
                  </div>

                  {/* Background Effects Toggle */}
                  <div className="p-4 rounded-2xl border border-white/10 bg-white/5 flex flex-col justify-between">
                    <div>
                      <p className="text-xs font-bold text-white font-mono">Background Effects</p>
                      <p className="text-[10px] text-muted-foreground mt-1">Ambient laser grid & 3D glows</p>
                    </div>
                    <button
                      onClick={toggleBackgroundEffects}
                      className={`mt-4 w-full py-2 px-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                        settings.backgroundEffects ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40" : "bg-white/5 text-muted-foreground border border-white/10"
                      }`}
                    >
                      {settings.backgroundEffects ? "ENABLED" : "DISABLED"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. ACCOUNT CARD */}
            <div className="rounded-3xl border border-white/15 bg-white/5 p-6 md:p-8 backdrop-blur-2xl shadow-xl flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[.18em] text-primary mono mb-4 flex items-center gap-2">
                  <ShieldCheck size={14} /> ACCOUNT & AUTHENTICATION
                </div>
                <p className="text-xs text-muted-foreground font-mono mb-6">
                  {user ? "Signed in as " + user.email : "Currently browsing as a guest."}
                </p>
              </div>
              {user ? (
                <button
                  onClick={() => signOut()}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-xs font-mono font-bold text-red-400 uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                >
                  <LogOut size={14} /> SIGN OUT
                </button>
              ) : (
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-primary/50 bg-primary/10 px-4 py-3 text-xs font-mono font-bold text-primary uppercase tracking-widest hover:bg-primary hover:text-black transition-all"
                >
                  SIGN IN WITH GOOGLE
                </button>
              )}
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
