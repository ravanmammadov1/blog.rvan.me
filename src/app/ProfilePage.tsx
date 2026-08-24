import { useEffect, useState, useRef, ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  User as UserIcon,
  Sun,
  Moon,
  Globe,
  Camera,
  RotateCcw,
  Check,
  ShieldCheck,
  Sliders,
  PenTool,
  ArrowRight,
  ExternalLink,
  Briefcase,
  Layers,
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
import {
  getContributorProfile,
  saveContributorProfile,
  ContributorProfile,
  FOUNDER_CONTRIBUTOR_PROFILE,
} from "../services/contributorService";

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE },
  },
};

type SettingsTab = "site" | "profile" | "contributor";

export default function ProfilePage() {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<SettingsTab>("site");
  const [photoSuccessMsg, setPhotoSuccessMsg] = useState("");
  const [cropperOpen, setCropperOpen] = useState(false);
  const [rawUploadedImage, setRawUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Contributor state
  const [contributorProfile, setContributorProfile] = useState<ContributorProfile | null>(null);
  const [isSavingContributor, setIsSavingContributor] = useState(false);
  const [contributorSuccessMsg, setContributorSuccessMsg] = useState("");

  const {
    user,
    signOut,
    userPhoto,
    customAvatar,
    updateCustomAvatar,
    randomizeAvatar,
  } = useAuth();
  const { theme, setTheme } = useTheme();
  const { language, switchLanguage, t, getLocalizedPath } = useLanguage();
  const isAz = language === "az";

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchSiteSettings(language).then((data) => {
      if (data) setSiteSettings(data);
    });

    if (user) {
      getContributorProfile(user.uid).then((prof) => {
        setContributorProfile(prof || {
          ...FOUNDER_CONTRIBUTOR_PROFILE,
          uid: user.uid,
          name: user.displayName || "",
          email: user.email || "",
          profileImage: user.photoURL || "/imports/ravan_1-400.webp",
          status: "approved",
        });
      });
    }
  }, [language, user]);

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

  const handleSaveContributor = async () => {
    if (!user || !contributorProfile) return;
    setIsSavingContributor(true);
    try {
      const saved = await saveContributorProfile(user.uid, contributorProfile);
      setContributorProfile(saved);
      setContributorSuccessMsg(isAz ? "Müəllif profili uğurla yadda saxlanıldı!" : "Contributor profile updated successfully!");
      setTimeout(() => setContributorSuccessMsg(""), 3500);
    } catch (err) {
      console.error("Error saving contributor info:", err);
    } finally {
      setIsSavingContributor(false);
    }
  };

  const userName = user ? (user.displayName || "User") : (isAz ? "Qonaq İstifadəçi" : "Guest User");
  const userEmail = user ? user.email : (isAz ? "Daxil olunmayıb" : "Not signed in");

  return (
    <main className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'Geist', sans-serif" }}>
      <SEO
        title={`${isAz ? "Tənzimləmələr və Profil" : "Settings & Profile"} — Rvan.me`}
        description={isAz ? "Vebsayt dili, görünüş teması, şəxsi profil və müəllif tənzimləmələri." : "Manage site language, appearance theme, personal profile, and author settings."}
        url="https://www.rvan.me/profile"
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
                ? "Vebsayt dili, görünüş, şəxsi profil və müəllif məlumatlarınızı vahid mərkəzdən idarə edin."
                : "Manage your site preferences, appearance theme, profile photo, and public contributor profile."}
            </p>
          </motion.div>

          {/* Unified Navigation Tabs */}
          <div className="mb-10 flex items-center gap-2 border-b border-white/10 pb-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab("site")}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition-all mono uppercase cursor-pointer ${
                activeTab === "site"
                  ? "bg-primary text-black shadow-lg shadow-primary/20"
                  : "border border-white/10 bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10"
              }`}
            >
              <Globe size={14} />
              <span>{isAz ? "1. SAYT VƏ GÖRÜNÜŞ" : "1. SITE & PREFERENCES"}</span>
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition-all mono uppercase cursor-pointer ${
                activeTab === "profile"
                  ? "bg-primary text-black shadow-lg shadow-primary/20"
                  : "border border-white/10 bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10"
              }`}
            >
              <UserIcon size={14} />
              <span>{isAz ? "2. ŞƏXSİ PROFİL VƏ FOTO" : "2. PERSONAL PROFILE"}</span>
            </button>

            <button
              onClick={() => setActiveTab("contributor")}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition-all mono uppercase cursor-pointer ${
                activeTab === "contributor"
                  ? "bg-primary text-black shadow-lg shadow-primary/20"
                  : "border border-white/10 bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10"
              }`}
            >
              <PenTool size={14} />
              <span>{isAz ? "3. KONTRIBUTOR VƏ MÜƏLLİF" : "3. CONTRIBUTOR PROFILE"}</span>
            </button>
          </div>

          {/* TAB 1: SITE & PREFERENCES */}
          {activeTab === "site" && (
            <motion.div variants={fadeUp} initial="hidden" animate="visible" className="grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-xl">
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
                        ? "border-primary bg-primary/10 text-primary shadow-lg shadow-primary/10"
                        : "border-white/10 bg-white/5 text-muted-foreground hover:border-white/20 hover:text-foreground"
                    }`}
                  >
                    <span>🇬🇧 English</span>
                    {language === "en" && <Check size={14} className="text-primary" />}
                  </button>

                  <button
                    onClick={() => switchLanguage("az")}
                    className={`flex items-center justify-center gap-2 rounded-2xl border p-4 text-xs font-bold mono transition-all cursor-pointer ${
                      language === "az"
                        ? "border-primary bg-primary/10 text-primary shadow-lg shadow-primary/10"
                        : "border-white/10 bg-white/5 text-muted-foreground hover:border-white/20 hover:text-foreground"
                    }`}
                  >
                    <span>🇦🇿 Azərbaycan</span>
                    {language === "az" && <Check size={14} className="text-primary" />}
                  </button>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-xl">
                <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-primary mono uppercase mb-4">
                  <Sun size={16} /> {isAz ? "GÖRÜNÜŞ VƏ TEMA" : "APPEARANCE & THEME"}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {isAz ? "Rəng Rejimi" : "Color Theme"}
                </h3>
                <p className="text-xs text-muted-foreground mb-6">
                  {isAz
                    ? "Oxuma rahatlığınıza uyğun olaraq qaranlıq (OLED) və ya açıq tema seçin."
                    : "Switch between calibrated dark mode and high-contrast light mode."}
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setTheme("dark")}
                    className={`flex items-center justify-center gap-2 rounded-2xl border p-4 text-xs font-bold mono transition-all cursor-pointer ${
                      theme === "dark"
                        ? "border-primary bg-primary/10 text-primary shadow-lg shadow-primary/10"
                        : "border-white/10 bg-white/5 text-muted-foreground hover:border-white/20 hover:text-foreground"
                    }`}
                  >
                    <Moon size={15} />
                    <span>Dark Theme</span>
                    {theme === "dark" && <Check size={14} className="text-primary" />}
                  </button>

                  <button
                    onClick={() => setTheme("light")}
                    className={`flex items-center justify-center gap-2 rounded-2xl border p-4 text-xs font-bold mono transition-all cursor-pointer ${
                      theme === "light"
                        ? "border-primary bg-primary/10 text-primary shadow-lg shadow-primary/10"
                        : "border-white/10 bg-white/5 text-muted-foreground hover:border-white/20 hover:text-foreground"
                    }`}
                  >
                    <Sun size={15} />
                    <span>Light Theme</span>
                    {theme === "light" && <Check size={14} className="text-primary" />}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: PERSONAL PROFILE */}
          {activeTab === "profile" && (
            <motion.div variants={fadeUp} initial="hidden" animate="visible" className="grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-xl space-y-6">
                <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-primary mono uppercase">
                  <UserIcon size={16} /> {isAz ? "PROFİL MƏLUMATLARI" : "ACCOUNT IDENTITY"}
                </div>

                <div className="flex items-center gap-4">
                  <img
                    src={userPhoto || "/imports/ravan_1-400.webp"}
                    alt={userName}
                    className="h-20 w-20 rounded-2xl object-cover border-2 border-primary/60 shadow-lg bg-neutral-900"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{userName}</h3>
                    <p className="text-xs text-muted-foreground mono">{userEmail}</p>
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 font-bold mt-2 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <Check size={10} /> {customAvatar ? (isAz ? "Xüsusi Foto" : "Custom Photo") : (isAz ? "Vektor Avatar" : "Vector Avatar")}
                    </span>
                  </div>
                </div>

                {photoSuccessMsg && (
                  <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs font-mono text-emerald-400">
                    {photoSuccessMsg}
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                <div className="space-y-3 pt-2">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="primary"
                    size="md"
                    className="w-full"
                    icon={<Camera size={15} />}
                    iconPosition="left"
                  >
                    {isAz ? "Yeni Foto Yüklə və Kəs" : "Upload & Crop Profile Photo"}
                  </Button>

                  <Button
                    onClick={handleRandomizeCharacter}
                    variant="secondary"
                    size="md"
                    className="w-full"
                    icon={<Sparkles size={15} className="text-primary" />}
                    iconPosition="left"
                  >
                    {isAz ? "Təsadüfi Vektor Avatar 🎲" : "Randomize Character Avatar 🎲"}
                  </Button>

                  {customAvatar && (
                    <Button
                      onClick={handleResetPhoto}
                      variant="ghost"
                      size="sm"
                      className="w-full text-xs text-muted-foreground hover:text-foreground"
                      icon={<RotateCcw size={13} />}
                      iconPosition="left"
                    >
                      {isAz ? "Vektor Avatarına Qayıt" : "Reset to Vector Avatar"}
                    </Button>
                  )}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-primary mono uppercase mb-4">
                    <Layers size={16} /> {isAz ? "AVATAR STUDİOSU" : "VECTOR AVATAR STUDIO"}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {isAz ? "Open Peeps Fərdiləşdirici" : "Open Peeps Character Studio"}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {isAz
                      ? "Öz unikal vektor xarakterinizi saç, eynək, geyim və emosiyalarla interaktiv studiyada dizayn edin."
                      : "Handcraft your personalized modular vector avatar with customizable hairstyles, clothing, eyewear, and facial expressions."}
                  </p>
                </div>

                <div className="pt-6">
                  <Button
                    to={getLocalizedPath("/tools/open-peeps")}
                    variant="secondary"
                    size="lg"
                    className="w-full"
                    icon={<ExternalLink size={15} />}
                    iconPosition="right"
                  >
                    {isAz ? "Avatar Studiyasını Aç" : "Launch Avatar Studio"}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: CONTRIBUTOR */}
          {activeTab === "contributor" && (
            <motion.div variants={fadeUp} initial="hidden" animate="visible" className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-8 md:p-10 backdrop-blur-xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
                  <div>
                    <span className="text-xs font-bold tracking-widest text-primary mono uppercase flex items-center gap-2">
                      <Briefcase size={15} /> {isAz ? "İCTİMAİ MÜƏLLİF PROFİLİ" : "PUBLIC AUTHOR PROFILE"}
                    </span>
                    <h2 className="mt-2 text-2xl font-bold text-foreground">
                      {isAz ? "Peşəkar Müəllif Məlumatları" : "Professional Author Information"}
                    </h2>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      to={getLocalizedPath(`/author/${contributorProfile?.slug || "ravan-mammadov"}`)}
                      className="inline-flex items-center gap-1.5 text-xs font-mono text-primary hover:underline"
                    >
                      {isAz ? "Profilə Bax" : "View Live Profile"} <ExternalLink size={13} />
                    </Link>

                    <Button
                      to={getLocalizedPath("/contributor/dashboard")}
                      variant="primary"
                      size="sm"
                      icon={<PenTool size={14} />}
                      iconPosition="left"
                    >
                      {isAz ? "Müəllif Paneli" : "Open Dashboard"}
                    </Button>
                  </div>
                </div>

                {contributorSuccessMsg && (
                  <div className="mb-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs font-mono text-emerald-400">
                    {contributorSuccessMsg}
                  </div>
                )}

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-xs font-mono text-muted-foreground mb-1.5">
                      {isAz ? "PEŞƏKAR VƏZİFƏ / ROL" : "PROFESSIONAL TITLE / ROLE"}
                    </label>
                    <input
                      type="text"
                      autoComplete="organization-title"
                      value={contributorProfile?.professionalTitle || ""}
                      onChange={(e) =>
                        setContributorProfile((prev) =>
                          prev ? { ...prev, professionalTitle: e.target.value } : null
                        )
                      }
                      placeholder={isAz ? "məs. Baş Kreativ Dizayner" : "e.g. Senior Creative Designer"}
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-muted-foreground mb-1.5">
                      {isAz ? "İŞ YERİ / ŞİRKƏT" : "CURRENT WORKPLACE / COMPANY"}
                    </label>
                    <input
                      type="text"
                      autoComplete="organization-title"
                      value={contributorProfile?.currentWorkplace || ""}
                      onChange={(e) =>
                        setContributorProfile((prev) =>
                          prev ? { ...prev, currentWorkplace: e.target.value } : null
                        )
                      }
                      placeholder={isAz ? "məs. RAM Holding" : "e.g. RAM Holding"}
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-muted-foreground mb-1.5">
                      {isAz ? "ŞƏHƏR VƏ ÖLKƏ" : "LOCATION"}
                    </label>
                    <input
                      type="text"
                      autoComplete="address-level2"
                      value={contributorProfile?.location || ""}
                      onChange={(e) =>
                        setContributorProfile((prev) =>
                          prev ? { ...prev, location: e.target.value } : null
                        )
                      }
                      placeholder={isAz ? "Bakı, Azərbaycan" : "Baku, Azerbaijan"}
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-muted-foreground mb-1.5">
                      {isAz ? "LINKEDIN PROFİLİ" : "LINKEDIN URL"}
                    </label>
                    <input
                      type="url"
                      autoComplete="url"
                      value={contributorProfile?.socialLinks?.linkedin || ""}
                      onChange={(e) =>
                        setContributorProfile((prev) =>
                          prev
                            ? {
                                ...prev,
                                socialLinks: { ...prev.socialLinks, linkedin: e.target.value },
                              }
                            : null
                        )
                      }
                      placeholder="https://linkedin.com/in/..."
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-mono text-muted-foreground mb-1.5">
                      {isAz ? "QISA MÜƏLLİF BİOQRAFİYASI" : "AUTHOR BIO & EDITORIAL MISSION"}
                    </label>
                    <textarea
                      rows={3}
                      autoComplete="off"
                      value={contributorProfile?.bio || ""}
                      onChange={(e) =>
                        setContributorProfile((prev) =>
                          prev ? { ...prev, bio: e.target.value } : null
                        )
                      }
                      placeholder={isAz ? "Tədqiqat sahəniz və dizayn baxışınız..." : "Your creative philosophy and areas of research..."}
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <Button
                    onClick={handleSaveContributor}
                    variant="primary"
                    size="md"
                    disabled={isSavingContributor}
                    icon={<Check size={15} />}
                    iconPosition="left"
                  >
                    {isSavingContributor ? (isAz ? "Saxlanılır..." : "Saving...") : (isAz ? "Məlumatları Saxla" : "Save Profile Details")}
                  </Button>
                </div>
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
