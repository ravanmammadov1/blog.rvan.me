import { useEffect, useState, useRef, ChangeEvent } from "react";
import { motion } from "framer-motion";
import {
  User as UserIcon,
  Sun,
  Moon,
  Globe,
  Languages,
  Dices,
  Camera,
  RotateCcw,
  Check,
  Sliders,
  Trash2,
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
import ImageCropperModal from "./components/profile/ImageCropperModal";

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE },
  },
};

type SettingsTab = "site" | "profile";

export default function ProfilePage() {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<SettingsTab>("site");
  const [photoSuccessMsg, setPhotoSuccessMsg] = useState("");
  const [cropperOpen, setCropperOpen] = useState(false);
  const [rawUploadedImage, setRawUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const {
    user,
    deleteAccount,
    userPhoto,
    customAvatar,
    updateCustomAvatar,
    randomizeAvatar,
  } = useAuth();
  const { theme, setTheme } = useTheme();
  const { language, switchLanguage, t } = useLanguage();
  const isAz = language === "az";

  const handleDeleteAccount = async () => {
    const confirmMsg = isAz
      ? "Hesabınızı və bütün fərdi profil məlumatlarınızı birdəfəlik silmək istədiyinizdən əminsiniz? Bu əməliyyat geri qaytarıla bilməz."
      : "Are you sure you want to permanently delete your account and personal profile data? This action cannot be undone.";
    if (!window.confirm(confirmMsg)) return;
    try {
      setIsDeletingAccount(true);
      await deleteAccount();
      alert(isAz ? "Hesabınız uğurla silindi." : "Your account has been deleted successfully.");
    } catch (e: any) {
      alert(e?.message || "Failed to delete account. Please sign in again and retry.");
    } finally {
      setIsDeletingAccount(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchSiteSettings(language).then((data) => {
      if (data) setSiteSettings(data);
    });
  }, [language]);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert(isAz ? "Fayl ölçüsü 8MB həddini aşır. Zəhmət olmasa daha kiçik şəkil seçin." : "File size exceeds 8MB. Please choose a smaller image.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setRawUploadedImage(reader.result as string);
      setCropperOpen(true);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleCropComplete = (croppedBase64: string) => {
    updateCustomAvatar(croppedBase64);
    setPhotoSuccessMsg(isAz ? "Profil şəkli uğurla yeniləndi!" : "Profile photo updated successfully!");
    setTimeout(() => setPhotoSuccessMsg(""), 3500);
  };

  const handleRandomizeCharacter = () => {
    randomizeAvatar();
    if (customAvatar) {
      updateCustomAvatar(null);
    }
    setPhotoSuccessMsg(isAz ? "Yeni xarakter avatarı yaradıldı!" : "New character avatar generated & saved!");
    setTimeout(() => setPhotoSuccessMsg(""), 3500);
  };

  const handleResetPhoto = () => {
    updateCustomAvatar(null);
    setPhotoSuccessMsg(isAz ? "Vektor xarakter avatarına qaytarıldı." : "Switched back to vector character avatar.");
    setTimeout(() => setPhotoSuccessMsg(""), 3500);
  };

  const userName = user ? (user.displayName || "User") : (isAz ? "Qonaq İstifadəçi" : "Guest User");
  const userEmail = user ? user.email : (isAz ? "Daxil olunmayıb" : "Not signed in");

  return (
    <main className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'Geist', sans-serif" }}>
      <SEO
        title={`${isAz ? "Tənzimləmələr və Profil" : "Settings & Profile"} — Rvan.me`}
        description={isAz ? "Vebsayt dili, görünüş teması və şəxsi profil tənzimləmələri." : "Manage site language, appearance theme, and personal profile settings."}
        url="https://blog.rvan.me/profile"
      />

      <SiteHeader siteSettings={siteSettings} />

      <section className="px-6 pt-28 pb-20 md:px-10 md:pt-36 relative z-10">
        <div className="mx-auto max-w-[1400px]">
          {/* Header */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mb-8">
            <span className="text-xs font-bold tracking-[0.2em] text-primary mono uppercase flex items-center gap-2">
              <Sliders size={14} /> {isAz ? "İDARƏETMƏ VƏ TƏNZİMLƏMƏLƏR" : "USER CONTROL & SETTINGS"}
            </span>
            <h1 className="mt-2 text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
              {isAz ? "Tənzimləmələr" : "Settings"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground max-w-2xl font-medium">
              {isAz
                ? "Vebsayt dili, görünüş və şəxsi profil məlumatlarınızı idarə edin."
                : "Manage your site preferences, appearance theme, and profile photo."}
            </p>
          </motion.div>

          {/* Unified Navigation Tabs */}
          <div className="mb-10 flex items-center gap-2 border-b border-[#DDE1E0] dark:border-white/10 pb-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab("site")}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition-all mono uppercase cursor-pointer ${
                activeTab === "site"
                  ? "bg-primary text-black shadow-md shadow-primary/20 font-extrabold"
                  : "border border-[#DDE1E0] dark:border-white/10 bg-white/90 dark:bg-white/5 text-muted-foreground hover:text-foreground hover:bg-slate-50 dark:hover:bg-white/10"
              }`}
            >
              <Globe size={14} />
              <span>{isAz ? "1. SAYT VƏ GÖRÜNÜŞ" : "1. SITE & PREFERENCES"}</span>
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition-all mono uppercase cursor-pointer ${
                activeTab === "profile"
                  ? "bg-primary text-black shadow-md shadow-primary/20 font-extrabold"
                  : "border border-[#DDE1E0] dark:border-white/10 bg-white/90 dark:bg-white/5 text-muted-foreground hover:text-foreground hover:bg-slate-50 dark:hover:bg-white/10"
              }`}
            >
              <UserIcon size={14} />
              <span>{isAz ? "2. ŞƏXSİ PROFİL VƏ FOTO" : "2. PERSONAL PROFILE"}</span>
            </button>
          </div>

          {/* TAB 1: SITE & PREFERENCES */}
          {activeTab === "site" && (
            <motion.div variants={fadeUp} initial="hidden" animate="visible" className="grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl border border-[#DDE1E0] dark:border-white/10 bg-white dark:bg-white/[0.02] p-8 shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-none backdrop-blur-xl">
                <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-primary mono uppercase mb-4">
                  <Globe size={16} /> {isAz ? "DİL SEÇİMİ" : "LANGUAGE"}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {isAz ? "İnterfeys Dili" : "Interface Language"}
                </h3>
                <p className="text-xs text-muted-foreground mb-6">
                  {isAz
                    ? "Rvan.me nəşrinin bütün məqalə, resurs və alətlərini seçilmiş dildə oxuyun."
                    : "Select your preferred language for all articles, tools, and specimens."}
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => switchLanguage("en")}
                    className={`flex items-center justify-center gap-2 rounded-2xl border p-4 text-xs font-bold mono transition-all cursor-pointer ${
                      language === "en"
                        ? "border-primary bg-primary/10 text-primary shadow-md shadow-primary/10"
                        : "border-[#DDE1E0] dark:border-white/10 bg-slate-50/80 dark:bg-white/5 text-foreground dark:text-muted-foreground hover:bg-slate-100 dark:hover:bg-white/10 hover:border-primary/40 hover:text-foreground"
                    }`}
                  >
                    <Languages size={15} className="text-primary" />
                    <span>English</span>
                    {language === "en" && <Check size={14} className="text-primary ml-auto" />}
                  </button>

                  <button
                    onClick={() => switchLanguage("az")}
                    className={`flex items-center justify-center gap-2 rounded-2xl border p-4 text-xs font-bold mono transition-all cursor-pointer ${
                      language === "az"
                        ? "border-primary bg-primary/10 text-primary shadow-md shadow-primary/10"
                        : "border-[#DDE1E0] dark:border-white/10 bg-slate-50/80 dark:bg-white/5 text-foreground dark:text-muted-foreground hover:bg-slate-100 dark:hover:bg-white/10 hover:border-primary/40 hover:text-foreground"
                    }`}
                  >
                    <Globe size={15} className="text-primary" />
                    <span>Azərbaycan</span>
                    {language === "az" && <Check size={14} className="text-primary ml-auto" />}
                  </button>
                </div>
              </div>

              <div className="rounded-3xl border border-[#DDE1E0] dark:border-white/10 bg-white dark:bg-white/[0.02] p-8 shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-none backdrop-blur-xl">
                <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-primary mono uppercase mb-4">
                  <Sun size={16} /> {isAz ? "GÖRÜNÜŞ VƏ TEMA" : "APPEARANCE & THEME"}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {isAz ? "Vizual İnterfeys" : "Color Theme"}
                </h3>
                <p className="text-xs text-muted-foreground mb-6">
                  {isAz
                    ? "İstədiyiniz vizual kontrastı seçin. Seçiminiz brauzerinizdə yadda saxlanılır."
                    : "Choose light or dark aesthetic. Your preference will be saved locally."}
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setTheme("dark")}
                    className={`flex items-center justify-center gap-2 rounded-2xl border p-4 text-xs font-bold mono transition-all cursor-pointer ${
                      theme === "dark"
                        ? "border-primary bg-primary/10 text-primary shadow-md shadow-primary/10"
                        : "border-[#DDE1E0] dark:border-white/10 bg-slate-50/80 dark:bg-white/5 text-foreground dark:text-muted-foreground hover:bg-slate-100 dark:hover:bg-white/10 hover:border-primary/40 hover:text-foreground"
                    }`}
                  >
                    <Moon size={15} className="text-primary" />
                    <span>{isAz ? "Qaranlıq (Dark)" : "Dark Mode"}</span>
                    {theme === "dark" && <Check size={14} className="text-primary ml-auto" />}
                  </button>

                  <button
                    onClick={() => setTheme("light")}
                    className={`flex items-center justify-center gap-2 rounded-2xl border p-4 text-xs font-bold mono transition-all cursor-pointer ${
                      theme === "light"
                        ? "border-primary bg-primary/10 text-primary shadow-md shadow-primary/10"
                        : "border-[#DDE1E0] dark:border-white/10 bg-slate-50/80 dark:bg-white/5 text-foreground dark:text-muted-foreground hover:bg-slate-100 dark:hover:bg-white/10 hover:border-primary/40 hover:text-foreground"
                    }`}
                  >
                    <Sun size={15} className="text-primary" />
                    <span>{isAz ? "İşıqlı (Light)" : "Light Mode"}</span>
                    {theme === "light" && <Check size={14} className="text-primary ml-auto" />}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: PERSONAL PROFILE & PHOTO */}
          {activeTab === "profile" && (
            <motion.div variants={fadeUp} initial="hidden" animate="visible" className="space-y-6">
              <div className="rounded-3xl border border-[#DDE1E0] dark:border-white/10 bg-white dark:bg-white/[0.02] p-8 md:p-10 shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-none backdrop-blur-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-[#DDE1E0] dark:border-white/10 pb-8 mb-8">
                  <div className="flex items-center gap-5">
                    <div className="relative group">
                      <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-primary/60 bg-black p-1 shadow-lg shadow-primary/20 shrink-0">
                        {userPhoto ? (
                          <img
                            src={userPhoto}
                            alt={userName}
                            className="h-full w-full object-cover rounded-full"
                          />
                        ) : (
                          <div className="h-full w-full rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-2xl">
                            {userName.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 p-2 rounded-full bg-primary text-black shadow-md hover:scale-110 transition-transform cursor-pointer"
                        title={isAz ? "Yeni şəkil yüklə" : "Upload new photo"}
                      >
                        <Camera size={14} />
                      </button>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-2xl font-bold text-foreground">{userName}</h3>
                      <p className="text-xs font-mono text-muted-foreground">{userEmail}</p>
                      {user && (
                        <div className="pt-1 flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            ● {isAz ? "Google İlə Daxil Olunub" : "Signed In with Google"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      accept="image/*"
                      className="hidden"
                    />

                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      variant="primary"
                      size="sm"
                      icon={<Camera size={14} />}
                      iconPosition="left"
                    >
                      {isAz ? "Foto Yüklə" : "Upload Photo"}
                    </Button>

                    <Button
                      onClick={handleRandomizeCharacter}
                      variant="outline"
                      size="sm"
                      icon={<Dices size={14} />}
                      iconPosition="left"
                    >
                      {isAz ? "Xarakter Seç" : "Randomize Character"}
                    </Button>

                    {customAvatar && (
                      <Button
                        onClick={handleResetPhoto}
                        variant="secondary"
                        size="sm"
                        icon={<RotateCcw size={14} />}
                        iconPosition="left"
                      >
                        {isAz ? "Sıfırla" : "Reset"}
                      </Button>
                    )}
                  </div>
                </div>

                {photoSuccessMsg && (
                  <div className="mb-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs font-mono text-emerald-600 dark:text-emerald-400">
                    {photoSuccessMsg}
                  </div>
                )}

                {/* Profile Information details */}
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="p-5 rounded-2xl border border-[#DDE1E0] dark:border-white/10 bg-slate-50/80 dark:bg-white/5 space-y-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase mono tracking-wider">
                      {isAz ? "İSTİFADƏÇİ ADI" : "DISPLAY NAME"}
                    </span>
                    <p className="text-sm font-semibold text-foreground">{userName}</p>
                  </div>

                  <div className="p-5 rounded-2xl border border-[#DDE1E0] dark:border-white/10 bg-slate-50/80 dark:bg-white/5 space-y-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase mono tracking-wider">
                      {isAz ? "E-POÇT ÜNVANI" : "EMAIL ADDRESS"}
                    </span>
                    <p className="text-sm font-semibold text-foreground font-mono">{userEmail}</p>
                  </div>
                </div>
              </div>

              {/* Danger Zone: Account Deletion */}
              <div className="rounded-3xl border border-rose-500/20 bg-rose-500/[0.02] p-8 md:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-rose-500 mono uppercase tracking-wider">
                    {isAz ? "HESABIN SİLİNMƏSİ" : "DANGER ZONE"}
                  </span>
                  <h4 className="text-base font-bold text-foreground">
                    {isAz ? "Hesabı və Fərdi Məlumatları Sil" : "Delete Account & Data"}
                  </h4>
                  <p className="text-xs text-muted-foreground max-w-lg leading-relaxed">
                    {isAz
                      ? "Hesabınızı, saxlanılan fərdi avatarınızı və lokal profil məlumatlarınızı birdəfəlik silin. Bu əməliyyat geri qaytarıla bilməz."
                      : "Permanently remove your authenticated account, customized profile avatar, and local profile data."}
                  </p>
                </div>

                <button
                  type="button"
                  disabled={isDeletingAccount}
                  onClick={handleDeleteAccount}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-rose-500/40 text-rose-500 hover:bg-rose-500 hover:text-white dark:hover:text-black transition-colors text-xs font-bold uppercase mono tracking-wider disabled:opacity-50 shrink-0 cursor-pointer"
                >
                  <Trash2 size={14} />
                  <span>{isDeletingAccount ? (isAz ? "Silinir..." : "Deleting...") : (isAz ? "Hesabı Sil" : "Delete Account")}</span>
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Image Cropper Modal */}
      <ImageCropperModal
        isOpen={cropperOpen}
        imageSrc={rawUploadedImage}
        onClose={() => setCropperOpen(false)}
        onCropComplete={handleCropComplete}
      />

      <Footer siteSettings={siteSettings} />
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <ScrollToTopButton />
    </main>
  );
}
