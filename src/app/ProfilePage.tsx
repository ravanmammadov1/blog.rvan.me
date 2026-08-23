import { useEffect, useState, useRef, ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  Loader2,
  Lock,
  ArrowUpRight,
  PenTool,
  BookOpen,
  Share2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

import { fetchSiteSettings } from "../lib/sanityQueries";
import { SiteSettings } from "../types/cms";
import SEO from "./components/SEO";
import SiteHeader from "./components/SiteHeader";
import Footer from "./components/Footer";
import ScrollToTopButton from "./components/ScrollToTopButton";
import { Eyebrow } from "./components/Eyebrow";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../lib/i18n/LanguageContext";
import AuthModal from "./components/AuthModal";
import AvatarCropModal from "./components/profile/AvatarCropModal";
import {
  getContributorStatus,
  getContributorApplication,
  submitContributorApplication,
} from "../services/contributorService";
import { ContributorApplication, ContributorStatus } from "../types/contributor";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function ProfilePage() {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Avatar Upload & Crop states
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [selectedImageSrc, setSelectedImageSrc] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [photoSuccessMsg, setPhotoSuccessMsg] = useState("");
  const [photoErrorMsg, setPhotoErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile Identity states
  const [displayNameInput, setDisplayNameInput] = useState("");
  const [nameSaving, setNameSaving] = useState(false);
  const [nameSaved, setNameSaved] = useState(false);

  // Bio state
  const [bioText, setBioText] = useState("");
  const [bioSaving, setBioSaving] = useState(false);
  const [bioSaved, setBioSaved] = useState(false);

  // Contributor state
  const [contributorStatus, setContributorStatus] = useState<ContributorStatus>("NONE");
  const [application, setApplication] = useState<ContributorApplication | null>(null);

  // Contributor Profile Editor form state
  const [authorName, setAuthorName] = useState("");
  const [authorRoleTitle, setAuthorRoleTitle] = useState("");
  const [authorLocation, setAuthorLocation] = useState("");
  const [authorShowLocation, setAuthorShowLocation] = useState(true);
  const [authorBio, setAuthorBio] = useState("");
  const [authorLinkedin, setAuthorLinkedin] = useState("");
  const [authorBehance, setAuthorBehance] = useState("");
  const [authorWebsite, setAuthorWebsite] = useState("");
  const [authorSaving, setAuthorSaving] = useState(false);
  const [authorSaved, setAuthorSaved] = useState(false);

  const {
    user,
    profile,
    loading: authLoading,
    signOut,
    userPhoto,
    customAvatar,
    updateCustomAvatar,
    uploadAvatarBlob,
    updateBio,
    updateDisplayName,
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

  // Load user profile and contributor records
  useEffect(() => {
    if (user?.uid) {
      setDisplayNameInput(user.displayName || profile?.displayName || "");
      setBioText(profile?.bio || "");

      const status = getContributorStatus(user.uid);
      const app = getContributorApplication(user.uid);

      setContributorStatus(status);
      setApplication(app);

      if (app) {
        setAuthorName(app.displayName || user.displayName || "");
        setAuthorRoleTitle(app.roleTitle || "");
        setAuthorLocation(app.location || "");
        setAuthorShowLocation(app.showLocation !== false);
        setAuthorBio(app.bio || "");
        setAuthorLinkedin(app.socialLinks?.linkedin || "");
        setAuthorBehance(app.socialLinks?.behance || "");
        setAuthorWebsite(app.socialLinks?.website || "");
      }
    } else {
      setContributorStatus("NONE");
      setApplication(null);
    }
  }, [user?.uid, profile?.displayName, profile?.bio]);

  // 1. Photo selection & crop trigger
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoErrorMsg("");
    setPhotoSuccessMsg("");

    // Validate type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setPhotoErrorMsg(
        isAz
          ? "Dəstəklənməyən fayl formatı. Zəhmət olmasa JPG, PNG və ya WEBP seçin."
          : "Unsupported file format. Please select JPG, PNG, or WEBP."
      );
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Validate size (max 8MB)
    if (file.size > 8 * 1024 * 1024) {
      setPhotoErrorMsg(
        isAz
          ? "Şəkil ölçüsü 8MB-dan çoxdur. Zəhmət olmasa daha kiçik fayl seçin."
          : "Image size exceeds 8MB limit. Please choose a smaller file."
      );
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Read and open crop modal
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImageSrc(reader.result as string);
      setCropModalOpen(true);
    };
    reader.onerror = () => {
      setPhotoErrorMsg(
        isAz ? "Faylı oxumaq mümkün olmadı." : "Failed to read image file."
      );
    };
    reader.readAsDataURL(file);

    // Reset input so re-selecting same file works
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // 2. Save cropped avatar
  const handleSaveCroppedAvatar = async (croppedDataUrl: string, croppedBlob: Blob) => {
    setIsUploadingPhoto(true);
    setPhotoErrorMsg("");

    try {
      await uploadAvatarBlob(croppedBlob);
      setCropModalOpen(false);
      setSelectedImageSrc(null);
      setPhotoSuccessMsg(
        isAz ? "Profil şəkli uğurla yeniləndi!" : "Profile photo updated successfully!"
      );
      setTimeout(() => setPhotoSuccessMsg(""), 3500);
    } catch (err: any) {
      console.error("Avatar upload failed:", err);
      setPhotoErrorMsg(
        isAz
          ? "Şəkli yükləmək mümkün olmadı. Zəhmət olmasa yenidən cəhd edin."
          : "Couldn't upload your photo. Please try again."
      );
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // 3. Reset to Google photo
  const handleResetToGooglePhoto = () => {
    updateCustomAvatar(null);
    setPhotoSuccessMsg(
      isAz ? "Google profil şəklinə qaytarıldı." : "Reset to your Google account photo."
    );
    setTimeout(() => setPhotoSuccessMsg(""), 3500);
  };

  // 4. Save Display Name
  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayNameInput.trim()) return;

    setNameSaving(true);
    try {
      await updateDisplayName(displayNameInput.trim());
      setNameSaved(true);
      setTimeout(() => setNameSaved(false), 2500);
    } catch (err) {
      console.error("Name save error:", err);
    } finally {
      setNameSaving(false);
    }
  };

  // 5. Save Bio
  const handleSaveBio = (e: React.FormEvent) => {
    e.preventDefault();
    setBioSaving(true);
    updateBio(bioText.trim());
    setTimeout(() => {
      setBioSaving(false);
      setBioSaved(true);
      setTimeout(() => setBioSaved(false), 2500);
    }, 300);
  };

  // 6. Save Contributor Author Profile
  const handleSaveAuthorProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !application) return;

    setAuthorSaving(true);
    try {
      const updatedApp: ContributorApplication = {
        ...application,
        displayName: authorName.trim() || application.displayName,
        roleTitle: authorRoleTitle.trim() || application.roleTitle,
        location: authorLocation.trim(),
        showLocation: authorShowLocation,
        bio: authorBio.trim() || application.bio,
        socialLinks: {
          ...application.socialLinks,
          linkedin: authorLinkedin.trim() || undefined,
          behance: authorBehance.trim() || undefined,
          website: authorWebsite.trim() || undefined,
        },
        photoURL: userPhoto,
        updatedAt: new Date().toISOString(),
      };

      await submitContributorApplication(updatedApp);
      setApplication(updatedApp);
      setAuthorSaved(true);
      setTimeout(() => setAuthorSaved(false), 3000);
    } catch (err) {
      console.error("Failed to save author profile:", err);
    } finally {
      setAuthorSaving(false);
    }
  };

  const isContributor = contributorStatus !== "NONE";
  const userInitial = user?.displayName ? user.displayName.charAt(0).toUpperCase() : "G";

  return (
    <div className="relative min-h-screen bg-background text-foreground" style={{ fontFamily: "'Geist', sans-serif" }}>
      <SEO
        title={isAz ? "İstifadəçi Profili və Tənzimləmələr — Rvan.me" : "User Profile & Settings — Rvan.me"}
        description={
          isAz
            ? "Rvan.me istifadəçi profili, şəxsi kimlik, avatar, görünüş və müəlliflik tənzimləmələri."
            : "Manage your Rvan.me profile, avatar, appearance, language, and contributor publishing preferences."
        }
        url="https://www.rvan.me/profile"
      />

      <SiteHeader siteSettings={siteSettings} />

      <main className="relative z-10 pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="mx-auto max-w-4xl px-6 md:px-10 space-y-12">
          {/* Header Section */}
          <div className="space-y-2 border-b border-border pb-8">
            <Eyebrow className="text-primary tracking-[.2em]">
              {isAz ? "ŞƏXSİ KABİNET" : "CENTRAL CONTROL PANEL"}
            </Eyebrow>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
              {isAz ? "Profil və Tənzimləmələr" : "Profile & Settings"}
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              {isAz
                ? "Şəxsi məlumatlarınızı, görünüş rejimini, dili və müəlliflik statusunuzu buradan idarə edin."
                : "Manage your identity, avatar, appearance, language, and contributor publishing preferences."}
            </p>
          </div>

          {/* SIGNED OUT STATE */}
          {!user ? (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="rounded-3xl border border-border bg-card p-8 sm:p-12 text-center space-y-6 shadow-sm"
            >
              <div className="mx-auto h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
                <UserIcon size={32} />
              </div>
              <div className="space-y-2 max-w-md mx-auto">
                <h2 className="text-xl font-bold text-foreground">
                  {isAz ? "Hesaba Daxil Olunmayıb" : "You are not signed in"}
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {isAz
                    ? "Profilinizi fərdiləşdirmək, avatarınızı dəyişmək, məqalələrə şərh yazmaq və müəlliflik kabinetinə daxil olmaq üçün Google hesabınızla daxil olun."
                    : "Sign in with your Google account to customize your profile, change avatar, comment on articles, and manage publishing."}
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs uppercase mono tracking-wider hover:opacity-90 transition-opacity cursor-pointer shadow-lg shadow-primary/20"
                >
                  {isAz ? "GOOGLE İLƏ DAXİL OL" : "SIGN IN WITH GOOGLE"}
                </button>
              </div>
            </motion.div>
          ) : (
            /* SIGNED IN USER CONTROL PANEL */
            <div className="space-y-10">
              {/* 1. PROFILE & IDENTITY */}
              <motion.section
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="p-6 sm:p-8 rounded-3xl border border-border bg-card shadow-sm space-y-6"
              >
                <div className="flex items-center gap-2 border-b border-border pb-4">
                  <UserIcon size={16} className="text-primary" />
                  <h2 className="text-base font-bold text-foreground mono uppercase tracking-wider">
                    {isAz ? "1. Profil və Şəxsi Kimlik" : "1. Profile & Identity"}
                  </h2>
                </div>

                {/* Feedback Alerts */}
                {photoSuccessMsg && (
                  <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
                    <Check size={14} className="shrink-0" />
                    <span>{photoSuccessMsg}</span>
                  </div>
                )}
                {photoErrorMsg && (
                  <div className="p-3.5 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive text-xs flex items-center gap-2">
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{photoErrorMsg}</span>
                  </div>
                )}

                {/* Avatar Display & Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  <div className="relative group shrink-0">
                    {userPhoto ? (
                      <img
                        src={userPhoto}
                        alt={user.displayName || "User"}
                        className="h-24 w-24 rounded-2xl object-cover border-2 border-border bg-surface shadow-md"
                      />
                    ) : (
                      <div className="h-24 w-24 rounded-2xl bg-primary text-primary-foreground font-bold flex items-center justify-center text-3xl shadow-md">
                        {userInitial}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-primary text-primary-foreground shadow-lg hover:scale-105 transition-transform cursor-pointer"
                      title={isAz ? "Şəkli Dəyiş" : "Change Photo"}
                    >
                      <Camera size={14} />
                    </button>
                  </div>

                  <div className="space-y-2 min-w-0 flex-1">
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-foreground mono uppercase tracking-wider">
                        {isAz ? "Profil Şəkli" : "Avatar Picture"}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {customAvatar
                          ? (isAz ? "Fərdi kəsilmiş şəkil aktivdir" : "Custom cropped photo is active")
                          : (isAz ? "Google profil şəkliniz istifadə olunur" : "Google profile photo is active")}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold uppercase mono tracking-wider hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
                      >
                        <Camera size={13} />
                        <span>{isAz ? "ŞƏKİL YÜKLƏ" : "UPLOAD PHOTO"}</span>
                      </button>

                      {customAvatar && (
                        <button
                          type="button"
                          onClick={handleResetToGooglePhoto}
                          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-surface text-xs font-bold uppercase mono text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                        >
                          <RotateCcw size={12} />
                          <span>{isAz ? "GOOGLE ŞƏKLİNƏ QAYTAR" : "RESET TO GOOGLE"}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Hidden File Input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/jpg"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                {/* Display Name & Email fields */}
                <div className="grid gap-4 sm:grid-cols-2 pt-4 border-t border-border">
                  <form onSubmit={handleSaveName} className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-foreground mono">
                      {isAz ? "Görünən Adınız" : "Display Name"}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={displayNameInput}
                        onChange={(e) => setDisplayNameInput(e.target.value)}
                        className="flex-1 rounded-xl border border-border bg-surface px-3.5 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                      />
                      <button
                        type="submit"
                        disabled={nameSaving}
                        className="px-3.5 py-2 rounded-xl bg-muted text-foreground border border-border text-xs font-bold uppercase mono hover:bg-surface transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                      >
                        {nameSaving ? (
                          <Loader2 size={13} className="animate-spin" />
                        ) : nameSaved ? (
                          <span className="text-emerald-500 font-bold">✓</span>
                        ) : (
                          <span>{isAz ? "YADDA SAXLA" : "SAVE"}</span>
                        )}
                      </button>
                    </div>
                  </form>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-foreground mono flex items-center gap-1.5">
                      <Lock size={12} className="text-primary" />
                      <span>{isAz ? "E-poçt Ünvanı (Məxfi)" : "Email Address (Private)"}</span>
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={user.email || ""}
                      className="w-full rounded-xl border border-border bg-muted/50 px-3.5 py-2 text-sm text-muted-foreground cursor-not-allowed font-mono select-none"
                    />
                  </div>
                </div>
              </motion.section>

              {/* 2. ABOUT & BIO */}
              <motion.section
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="p-6 sm:p-8 rounded-3xl border border-border bg-card shadow-sm space-y-4"
              >
                <div className="flex items-center gap-2 border-b border-border pb-4">
                  <PenTool size={16} className="text-primary" />
                  <h2 className="text-base font-bold text-foreground mono uppercase tracking-wider">
                    {isAz ? "2. Haqqınızda və Qısa Bio" : "2. About & Bio"}
                  </h2>
                </div>

                <form onSubmit={handleSaveBio} className="space-y-3">
                  <p className="text-xs text-muted-foreground">
                    {isAz
                      ? "Şərhlərdə və profilinizdə görünəcək qısa təqdimatınız."
                      : "Brief description visible across comments and profile interactions."}
                  </p>
                  <textarea
                    rows={3}
                    value={bioText}
                    onChange={(e) => setBioText(e.target.value)}
                    placeholder={
                      isAz
                        ? "Dizayn, brendinq və texnologiya ilə maraqlanan oxucu..."
                        : "Designer, reader, and creative enthusiast..."
                    }
                    className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none resize-none leading-relaxed"
                  />

                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      disabled={bioSaving}
                      className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold uppercase mono tracking-wider hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 shadow-sm"
                    >
                      {bioSaving ? (
                        <>
                          <Loader2 size={13} className="animate-spin" />
                          <span>{isAz ? "YADDA SAXLANILIR..." : "SAVING..."}</span>
                        </>
                      ) : bioSaved ? (
                        <>
                          <Check size={13} />
                          <span>{isAz ? "YADDA SAXLANILDI ✓" : "SAVED ✓"}</span>
                        </>
                      ) : (
                        <span>{isAz ? "BİONU YADDA SAXLA" : "SAVE BIO"}</span>
                      )}
                    </button>
                  </div>
                </form>
              </motion.section>

              {/* 3. APPEARANCE & LANGUAGE */}
              <motion.section
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="grid gap-6 sm:grid-cols-2"
              >
                {/* Appearance Card */}
                <div className="p-6 sm:p-8 rounded-3xl border border-border bg-card shadow-sm space-y-4">
                  <div className="flex items-center gap-2 border-b border-border pb-3">
                    <Sun size={16} className="text-primary" />
                    <h3 className="text-sm font-bold text-foreground mono uppercase tracking-wider">
                      {isAz ? "Görünüş Rejimi" : "Appearance"}
                    </h3>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    {isAz ? "Saytın vizual parlaqlıq rejimini seçin:" : "Select your preferred visual mode:"}
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setTheme("dark")}
                      className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-xs font-bold mono uppercase transition-all cursor-pointer ${
                        theme === "dark"
                          ? "border-primary bg-primary text-primary-foreground shadow-sm"
                          : "border-border bg-surface text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Moon size={14} />
                      <span>{isAz ? "Tünd" : "Dark"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTheme("light")}
                      className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-xs font-bold mono uppercase transition-all cursor-pointer ${
                        theme === "light"
                          ? "border-primary bg-primary text-primary-foreground shadow-sm"
                          : "border-border bg-surface text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Sun size={14} />
                      <span>{isAz ? "Açıq" : "Light"}</span>
                    </button>
                  </div>
                </div>

                {/* Language Card */}
                <div className="p-6 sm:p-8 rounded-3xl border border-border bg-card shadow-sm space-y-4">
                  <div className="flex items-center gap-2 border-b border-border pb-3">
                    <Globe size={16} className="text-primary" />
                    <h3 className="text-sm font-bold text-foreground mono uppercase tracking-wider">
                      {isAz ? "İnterfeys Dili" : "Interface Language"}
                    </h3>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    {isAz ? "Saytın əsas təqdimat dilini seçin:" : "Select your primary reading language:"}
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => switchLanguage("az")}
                      className={`flex items-center justify-center py-3 px-4 rounded-xl border text-xs font-bold mono uppercase transition-all cursor-pointer ${
                        language === "az"
                          ? "border-primary bg-primary text-primary-foreground shadow-sm"
                          : "border-border bg-surface text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Azərbaycan dili
                    </button>

                    <button
                      type="button"
                      onClick={() => switchLanguage("en")}
                      className={`flex items-center justify-center py-3 px-4 rounded-xl border text-xs font-bold mono uppercase transition-all cursor-pointer ${
                        language === "en"
                          ? "border-primary bg-primary text-primary-foreground shadow-sm"
                          : "border-border bg-surface text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      English
                    </button>
                  </div>
                </div>
              </motion.section>

              {/* 4. CONTRIBUTOR & WRITING HUB */}
              <motion.section
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="p-6 sm:p-8 rounded-3xl border border-border bg-card shadow-sm space-y-6"
              >
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div className="flex items-center gap-2">
                    <BookOpen size={16} className="text-primary" />
                    <h2 className="text-base font-bold text-foreground mono uppercase tracking-wider">
                      {isAz ? "4. Müəlliflik və Nəşr Mərkəzi" : "4. Contributor & Writing Hub"}
                    </h2>
                  </div>

                  {isContributor && (
                    <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-md border border-primary/30 bg-primary/10 text-primary">
                      {contributorStatus === "VERIFIED" ? (isAz ? "TƏSDİQLƏNMİŞ MÜƏLLİF" : "VERIFIED AUTHOR") : (isAz ? "MÜƏLLİF" : "APPROVED CONTRIBUTOR")}
                    </span>
                  )}
                </div>

                {!isContributor ? (
                  /* Regular User: Invitation to become a contributor */
                  <div className="p-6 rounded-2xl border border-border bg-surface/50 space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-foreground">
                        {isAz ? "Rvan.me Müəllifi Olun" : "Become a Contributor"}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {isAz
                          ? "Dizayn, marketinq, brendinq və kreativ sənaye üzrə fikirlərinizi minlərlə oxucu ilə paylaşın və öz peşəkar ictimai müəllif səhifənizi qurun."
                          : "Publish your ideas, case studies, and insights across Azerbaijan's creative community and build your verified author portfolio."}
                      </p>
                    </div>

                    <Link
                      to={getLocalizedPath("/contributor")}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs uppercase mono tracking-wider hover:opacity-90 transition-opacity shadow-sm"
                    >
                      <span>{isAz ? "MÜƏLLİFLİK HAQQINDA ƏTRAFLI" : "LEARN ABOUT CONTRIBUTING"}</span>
                      <ArrowUpRight size={14} />
                    </Link>
                  </div>
                ) : (
                  /* Active Contributor: Workspace Links & In-place Author Profile Editor */
                  <div className="space-y-6">
                    {/* Quick Access Action Cards */}
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Link
                        to={getLocalizedPath("/contributor")}
                        className="flex items-center justify-between p-4 rounded-2xl border border-border bg-surface hover:border-primary/40 hover:bg-primary/5 transition-all group"
                      >
                        <div>
                          <div className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                            {isAz ? "Müəllif Kabinetini Aç" : "Open Contributor Dashboard"}
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            {isAz ? "Məqalələr, qaralamalar və oxucu analitikası" : "Articles, drafts, and real insights"}
                          </div>
                        </div>
                        <ArrowUpRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                      </Link>

                      {application?.slug && (
                        <Link
                          to={getLocalizedPath(`/author/${application.slug}`)}
                          className="flex items-center justify-between p-4 rounded-2xl border border-border bg-surface hover:border-primary/40 hover:bg-primary/5 transition-all group"
                        >
                          <div>
                            <div className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                              {isAz ? "İctimai Müəllif Səhifəsinə Bax" : "View Public Author Profile"}
                            </div>
                            <div className="text-[11px] text-muted-foreground">
                              {`/author/${application.slug}`}
                            </div>
                          </div>
                          <ExternalLink size={15} className="text-muted-foreground group-hover:text-primary transition-colors" />
                        </Link>
                      )}
                    </div>

                    {/* In-place Author Profile Form */}
                    <form onSubmit={handleSaveAuthorProfile} className="p-6 rounded-2xl border border-border bg-surface/30 space-y-4">
                      <div className="flex items-center justify-between border-b border-border pb-3">
                        <span className="text-xs font-bold font-mono uppercase text-foreground">
                          {isAz ? "İctimai Müəllif Profilini Redaktə Et" : "Edit Public Author Information"}
                        </span>
                        {authorSaved && (
                          <span className="text-xs font-mono font-bold text-emerald-500">
                            {isAz ? "Yeniləndi ✓" : "Updated ✓"}
                          </span>
                        )}
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold uppercase tracking-wider text-foreground mono">
                            {isAz ? "Müəllif Adı" : "Public Author Name"}
                          </label>
                          <input
                            type="text"
                            value={authorName}
                            onChange={(e) => setAuthorName(e.target.value)}
                            className="w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold uppercase tracking-wider text-foreground mono">
                            {isAz ? "Peşəkar Vəzifə / Titul" : "Professional Title"}
                          </label>
                          <input
                            type="text"
                            value={authorRoleTitle}
                            onChange={(e) => setAuthorRoleTitle(e.target.value)}
                            placeholder="e.g. Brand Designer / Creative Strategist"
                            className="w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold uppercase tracking-wider text-foreground mono">
                            {isAz ? "Məkan / Şəhər" : "Location / City"}
                          </label>
                          <input
                            type="text"
                            value={authorLocation}
                            onChange={(e) => setAuthorLocation(e.target.value)}
                            placeholder="Baku, Azerbaijan"
                            className="w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                          />
                        </div>

                        <div className="flex items-center gap-2 pt-6">
                          <input
                            type="checkbox"
                            id="profShowLoc"
                            checked={authorShowLocation}
                            onChange={(e) => setAuthorShowLocation(e.target.checked)}
                            className="rounded border-border text-primary"
                          />
                          <label htmlFor="profShowLoc" className="text-xs text-muted-foreground cursor-pointer">
                            {isAz ? "Məkanı ictimai profildə göstər" : "Display location on public author page"}
                          </label>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-foreground mono">
                          {isAz ? "İctimai Müəllif Bioqrafiyası" : "Public Author Biography"}
                        </label>
                        <textarea
                          rows={2}
                          value={authorBio}
                          onChange={(e) => setAuthorBio(e.target.value)}
                          className="w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none resize-none"
                        />
                      </div>

                      <div className="grid gap-3 sm:grid-cols-3 pt-2">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mono">
                            LinkedIn URL
                          </label>
                          <input
                            type="url"
                            value={authorLinkedin}
                            onChange={(e) => setAuthorLinkedin(e.target.value)}
                            placeholder="https://linkedin.com/in/..."
                            className="w-full rounded-xl border border-border bg-surface px-3 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mono">
                            Behance URL
                          </label>
                          <input
                            type="url"
                            value={authorBehance}
                            onChange={(e) => setAuthorBehance(e.target.value)}
                            placeholder="https://behance.net/..."
                            className="w-full rounded-xl border border-border bg-surface px-3 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mono">
                            Website URL
                          </label>
                          <input
                            type="url"
                            value={authorWebsite}
                            onChange={(e) => setAuthorWebsite(e.target.value)}
                            placeholder="https://..."
                            className="w-full rounded-xl border border-border bg-surface px-3 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          type="submit"
                          disabled={authorSaving}
                          className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold uppercase mono tracking-wider hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 shadow-sm"
                        >
                          {authorSaving ? (
                            <>
                              <Loader2 size={13} className="animate-spin" />
                              <span>{isAz ? "YADDA SAXLANILIR..." : "SAVING..."}</span>
                            </>
                          ) : authorSaved ? (
                            <>
                              <Check size={13} />
                              <span>{isAz ? "YENİLƏNDİ ✓" : "UPDATED ✓"}</span>
                            </>
                          ) : (
                            <span>{isAz ? "MÜƏLLİF PROFİLİNİ YADDA SAXLA" : "SAVE AUTHOR PROFILE"}</span>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </motion.section>

              {/* 5. ACCOUNT & LOGOUT */}
              <motion.section
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="p-6 sm:p-8 rounded-3xl border border-border bg-card shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-foreground mono uppercase tracking-wider">
                      {isAz ? "Google Hesabı ilə Bağlantı" : "Connected Google Account"}
                    </div>
                    <div className="text-xs text-muted-foreground font-mono mt-0.5">
                      {user.email}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => signOut()}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive text-xs font-bold uppercase mono hover:bg-destructive/20 transition-colors cursor-pointer"
                  >
                    <LogOut size={14} />
                    <span>{isAz ? "HESABDAN ÇIXIŞ" : "SIGN OUT"}</span>
                  </button>
                </div>
              </motion.section>
            </div>
          )}
        </div>
      </main>

      <Footer siteSettings={siteSettings} />
      <ScrollToTopButton />

      {/* Modals */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <AvatarCropModal
        isOpen={cropModalOpen}
        onClose={() => {
          setCropModalOpen(false);
          setSelectedImageSrc(null);
        }}
        imageSrc={selectedImageSrc}
        onSave={handleSaveCroppedAvatar}
        isUploading={isUploadingPhoto}
      />
    </div>
  );
}
