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
  Sliders,
  BarChart3,
  FileText,
  Clock,
  Plus,
  Send,
  UserCheck,
  Shield,
  Layers,
  ChevronRight,
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
import ContributorApplicationWizard from "./components/contributor/ContributorApplicationWizard";
import ArticleSubmissionModal from "./components/contributor/ArticleSubmissionModal";
import {
  getContributorStatus,
  getContributorApplication,
  submitContributorApplication,
  getSubmissionsByAuthor,
  getContributorAggregatedAnalytics,
} from "../services/contributorService";
import {
  ContributorApplication,
  ContributorStatus,
  ArticleSubmission,
} from "../types/contributor";

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
  },
};

type SettingsSection =
  | "profile"
  | "public-identity"
  | "preferences"
  | "contributor"
  | "my-articles"
  | "insights"
  | "account";

export default function ProfilePage() {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<SettingsSection>("profile");

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
  const [submissions, setSubmissions] = useState<ArticleSubmission[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [showApplyWizard, setShowApplyWizard] = useState(false);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);

  // Contributor Public Identity Form state
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

  const loadUserData = () => {
    if (user?.uid) {
      setDisplayNameInput(user.displayName || profile?.displayName || "");
      setBioText(profile?.bio || "");

      const status = getContributorStatus(user.uid);
      const app = getContributorApplication(user.uid);
      const subs = getSubmissionsByAuthor(user.uid);

      setContributorStatus(status);
      setApplication(app);
      setSubmissions(subs);

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
      setSubmissions([]);
    }
  };

  useEffect(() => {
    loadUserData();
  }, [user?.uid, profile?.displayName, profile?.bio]);

  const isContributor = contributorStatus !== "NONE";
  const analytics = user?.uid ? getContributorAggregatedAnalytics(user.uid) : null;

  // 1. Photo selection & crop trigger
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoErrorMsg("");
    setPhotoSuccessMsg("");

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

    if (file.size > 8 * 1024 * 1024) {
      setPhotoErrorMsg(
        isAz
          ? "Şəkil ölçüsü 8MB-dan çoxdur. Zəhmət olmasa daha kiçik fayl seçin."
          : "Image size exceeds 8MB limit. Please choose a smaller file."
      );
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

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

  // 6. Save Public Identity (Contributor)
  const handleSavePublicIdentity = async (e: React.FormEvent) => {
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
      console.error("Failed to save public identity:", err);
    } finally {
      setAuthorSaving(false);
    }
  };

  const handleApplicationSuccess = (newApp: ContributorApplication) => {
    setApplication(newApp);
    setContributorStatus("APPROVED");
    setShowApplyWizard(false);
    loadUserData();
  };

  const filteredSubmissions = submissions.filter((s) => {
    if (statusFilter === "ALL") return true;
    return s.status === statusFilter;
  });

  const userInitial = user?.displayName ? user.displayName.charAt(0).toUpperCase() : "U";

  // Sidebar navigation structure
  const navSections = [
    {
      groupAz: "ŞƏXSİ",
      groupEn: "PERSONAL",
      items: [
        { id: "profile", labelAz: "Profil və Şəkil", labelEn: "Profile", icon: UserIcon },
        ...(isContributor
          ? [{ id: "public-identity", labelAz: "İctimai Müəllif Kimliyi", labelEn: "Public Identity", icon: UserCheck }]
          : []),
      ],
    },
    {
      groupAz: "SAYT TƏNZİMLƏMƏLƏRİ",
      groupEn: "SITE PREFERENCES",
      items: [
        { id: "preferences", labelAz: "Görünüş və Dil", labelEn: "Appearance & Language", icon: Sliders },
      ],
    },
    {
      groupAz: "MÜƏLLİFLİK",
      groupEn: "CONTRIBUTOR",
      items: [
        { id: "contributor", labelAz: "Müəlliflik Statusu", labelEn: "Contributor Status", icon: BookOpen },
        ...(isContributor
          ? [
              { id: "my-articles", labelAz: "Məqalələrim", labelEn: "My Articles", icon: FileText, count: submissions.length },
              { id: "insights", labelAz: "Oxucu Analitikası", labelEn: "Article Insights", icon: BarChart3 },
            ]
          : []),
      ],
    },
    {
      groupAz: "HESAB",
      groupEn: "ACCOUNT",
      items: [
        { id: "account", labelAz: "Google Hesabı", labelEn: "Google Account", icon: Shield },
      ],
    },
  ];

  return (
    <div className="relative min-h-screen bg-background text-foreground" style={{ fontFamily: "'Geist', sans-serif" }}>
      <SEO
        title={isAz ? "Tənzimləmələr — Rvan.me" : "Settings — Rvan.me"}
        description={
          isAz
            ? "Rvan.me mərkəzi hesab və tənzimləmələr paneli: şəxsi profil, görünüş, dil və müəlliflik idarəetməsi."
            : "Central Rvan.me settings control center: manage identity, appearance, language, and contributor publishing."
        }
        url="https://www.rvan.me/profile"
      />

      <SiteHeader siteSettings={siteSettings} />

      <main className="relative z-10 pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="mx-auto max-w-6xl px-6 md:px-10 space-y-8">
          {/* Header Bar */}
          <div className="space-y-1 border-b border-border pb-6">
            <Eyebrow className="text-primary tracking-[.2em]">
              {isAz ? "MƏRKƏZİ HESAB VƏ TƏNZİMLƏMƏLƏR" : "CENTRAL ACCOUNT & SETTINGS"}
            </Eyebrow>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
              {isAz ? "Tənzimləmələr" : "Settings"}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {isAz
                ? "Şəxsi məlumatlarınızı, görünüş rejimini, dili və müəlliflik fəaliyyətinizi tək bir mərkəzdən idarə edin."
                : "Manage your personal profile, site preferences, and contributor publishing from one unified place."}
            </p>
          </div>

          {/* SIGNED OUT STATE */}
          {!user ? (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="rounded-3xl border border-border bg-card p-8 sm:p-12 text-center space-y-6 shadow-sm max-w-lg mx-auto"
            >
              <div className="mx-auto h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
                <UserIcon size={32} />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-foreground">
                  {isAz ? "Hesaba Daxil Olunmayıb" : "You are not signed in"}
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {isAz
                    ? "Tənzimləmələrinizə daxil olmaq və profilinizi idarə etmək üçün Google hesabınızla daxil olun."
                    : "Sign in with your Google account to access your settings, profile, and publishing preferences."}
                </p>
              </div>

              <button
                onClick={() => setAuthModalOpen(true)}
                className="px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs uppercase mono tracking-wider hover:opacity-90 transition-opacity cursor-pointer shadow-lg shadow-primary/20"
              >
                {isAz ? "GOOGLE İLƏ DAXİL OL" : "SIGN IN WITH GOOGLE"}
              </button>
            </motion.div>
          ) : (
            /* SIGNED IN TWO-COLUMN GOOGLE ACCOUNT-STYLE SETTINGS LAYOUT */
            <div className="grid gap-8 lg:grid-cols-12 items-start">
              {/* Left Sidebar Navigation */}
              <aside className="lg:col-span-4 rounded-3xl border border-border bg-card p-4 sm:p-5 shadow-sm space-y-6 sticky top-28">
                {/* User Summary Badge */}
                <div className="flex items-center gap-3 p-2 border-b border-border pb-4">
                  {userPhoto ? (
                    <img
                      src={userPhoto}
                      alt={user.displayName || "User"}
                      className="h-11 w-11 rounded-full object-cover border border-border shrink-0 shadow-sm"
                    />
                  ) : (
                    <div className="h-11 w-11 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-base shrink-0">
                      {userInitial}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-foreground truncate">
                      {user.displayName || "User"}
                    </div>
                    <div className="text-[11px] text-muted-foreground truncate font-mono">
                      {user.email}
                    </div>
                  </div>
                </div>

                {/* Navigation Sections */}
                <div className="space-y-5">
                  {navSections.map((sec, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mono px-3">
                        {isAz ? sec.groupAz : sec.groupEn}
                      </div>

                      <div className="space-y-1">
                        {sec.items.map((item) => {
                          const Icon = item.icon;
                          const isActive = activeSection === item.id;
                          return (
                            <button
                              key={item.id}
                              onClick={() => {
                                setShowApplyWizard(false);
                                setActiveSection(item.id as SettingsSection);
                              }}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                                isActive
                                  ? "bg-primary text-primary-foreground shadow-sm"
                                  : "text-foreground hover:bg-muted"
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <Icon size={14} className={isActive ? "text-primary-foreground" : "text-primary"} />
                                <span>{isAz ? item.labelAz : item.labelEn}</span>
                              </div>

                              {"count" in item && item.count !== undefined && (
                                <span
                                  className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                                    isActive
                                      ? "bg-black/20 text-primary-foreground"
                                      : "bg-surface border border-border text-muted-foreground"
                                  }`}
                                >
                                  {item.count}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Sign Out Action at Bottom of Nav */}
                <div className="pt-2 border-t border-border">
                  <button
                    type="button"
                    onClick={() => signOut()}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-destructive hover:bg-destructive/10 transition-colors text-left mono uppercase cursor-pointer"
                  >
                    <LogOut size={13} />
                    <span>{isAz ? "HESABDAN ÇIXIŞ" : "SIGN OUT"}</span>
                  </button>
                </div>
              </aside>

              {/* Right Content Panel */}
              <div className="lg:col-span-8 space-y-6">
                {/* 1. PERSONAL -> PROFILE & AVATAR */}
                {activeSection === "profile" && (
                  <motion.section
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    className="p-6 sm:p-8 rounded-3xl border border-border bg-card shadow-sm space-y-6"
                  >
                    <div className="border-b border-border pb-4">
                      <h2 className="text-lg font-bold text-foreground">
                        {isAz ? "Şəxsi Profil və Şəkil" : "Personal Profile & Photo"}
                      </h2>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {isAz ? "Adınız, şərhlərdə görünən bioqrafiyanız və fərdi profil şəkliniz." : "Your name, public comment bio, and custom avatar photo."}
                      </p>
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

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/jpg"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>

                    {/* Display Name */}
                    <form onSubmit={handleSaveName} className="space-y-1.5 pt-4 border-t border-border">
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
                          className="px-4 py-2 rounded-xl bg-muted text-foreground border border-border text-xs font-bold uppercase mono hover:bg-surface transition-colors cursor-pointer shrink-0 disabled:opacity-50"
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

                    {/* Bio */}
                    <form onSubmit={handleSaveBio} className="space-y-2 pt-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-foreground mono">
                        {isAz ? "Qısa Bioqrafiya" : "Short Bio"}
                      </label>
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
                )}

                {/* 2. PERSONAL -> PUBLIC IDENTITY (Contributor Only) */}
                {activeSection === "public-identity" && isContributor && (
                  <motion.section
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    className="p-6 sm:p-8 rounded-3xl border border-border bg-card shadow-sm space-y-6"
                  >
                    <div className="flex items-center justify-between border-b border-border pb-4">
                      <div>
                        <h2 className="text-lg font-bold text-foreground">
                          {isAz ? "İctimai Müəllif Kimliyi" : "Public Author Identity"}
                        </h2>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {isAz ? "İctimai müəllif səhifənizdə və məqalə kartlarınızda göstərilən məlumatlar." : "Information displayed on your public author profile and article cards."}
                        </p>
                      </div>

                      {application?.slug && (
                        <Link
                          to={getLocalizedPath(`/author/${application.slug}`)}
                          className="inline-flex items-center gap-1 text-xs font-mono text-primary hover:underline"
                        >
                          <span>{isAz ? "Səhifəyə Bax" : "View Live"}</span>
                          <ExternalLink size={12} />
                        </Link>
                      )}
                    </div>

                    <form onSubmit={handleSavePublicIdentity} className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold uppercase tracking-wider text-foreground mono">
                            {isAz ? "Müəllif Adı" : "Public Author Name"}
                          </label>
                          <input
                            type="text"
                            value={authorName}
                            onChange={(e) => setAuthorName(e.target.value)}
                            className="w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold uppercase tracking-wider text-foreground mono">
                            {isAz ? "Peşəkar Titul / Vəzifə" : "Professional Title"}
                          </label>
                          <input
                            type="text"
                            value={authorRoleTitle}
                            onChange={(e) => setAuthorRoleTitle(e.target.value)}
                            placeholder="e.g. Senior Brand Designer"
                            className="w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
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
                            className="w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                          />
                        </div>

                        <div className="flex items-center gap-2 pt-6">
                          <input
                            type="checkbox"
                            id="pubLocToggle"
                            checked={authorShowLocation}
                            onChange={(e) => setAuthorShowLocation(e.target.checked)}
                            className="rounded border-border text-primary"
                          />
                          <label htmlFor="pubLocToggle" className="text-xs text-muted-foreground cursor-pointer">
                            {isAz ? "Məkanı ictimai profildə göstər" : "Display location on public author profile"}
                          </label>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-foreground mono">
                          {isAz ? "İctimai Müəllif Bioqrafiyası" : "Public Author Biography"}
                        </label>
                        <textarea
                          rows={3}
                          value={authorBio}
                          onChange={(e) => setAuthorBio(e.target.value)}
                          className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none resize-none leading-relaxed"
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
                            className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
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
                            className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
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
                            className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-3">
                        <button
                          type="submit"
                          disabled={authorSaving}
                          className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold uppercase mono tracking-wider hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 shadow-sm"
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
                            <span>{isAz ? "KİMLİYİ YADDA SAXLA" : "SAVE PUBLIC IDENTITY"}</span>
                          )}
                        </button>
                      </div>
                    </form>
                  </motion.section>
                )}

                {/* 3. SITE PREFERENCES (Appearance & Language) */}
                {activeSection === "preferences" && (
                  <motion.section
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    className="p-6 sm:p-8 rounded-3xl border border-border bg-card shadow-sm space-y-6"
                  >
                    <div className="border-b border-border pb-4">
                      <h2 className="text-lg font-bold text-foreground">
                        {isAz ? "Sayt Tənzimləmələri" : "Site Preferences"}
                      </h2>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {isAz ? "Görünüş rejimi və interfeys dilinizi tənzimləyin." : "Manage visual theme mode and interface language."}
                      </p>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      {/* Appearance */}
                      <div className="p-5 rounded-2xl border border-border bg-surface/50 space-y-3">
                        <div className="flex items-center gap-2">
                          <Sun size={15} className="text-primary" />
                          <h3 className="text-xs font-bold text-foreground mono uppercase tracking-wider">
                            {isAz ? "Görünüş Rejimi" : "Appearance"}
                          </h3>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setTheme("dark")}
                            className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl border text-xs font-bold mono uppercase transition-all cursor-pointer ${
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
                            className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl border text-xs font-bold mono uppercase transition-all cursor-pointer ${
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

                      {/* Language */}
                      <div className="p-5 rounded-2xl border border-border bg-surface/50 space-y-3">
                        <div className="flex items-center gap-2">
                          <Globe size={15} className="text-primary" />
                          <h3 className="text-xs font-bold text-foreground mono uppercase tracking-wider">
                            {isAz ? "İnterfeys Dili" : "Language"}
                          </h3>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => switchLanguage("az")}
                            className={`flex items-center justify-center py-3 px-3 rounded-xl border text-xs font-bold mono uppercase transition-all cursor-pointer ${
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
                            className={`flex items-center justify-center py-3 px-3 rounded-xl border text-xs font-bold mono uppercase transition-all cursor-pointer ${
                              language === "en"
                                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                                : "border-border bg-surface text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            English
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.section>
                )}

                {/* 4. CONTRIBUTOR -> STATUS & ONBOARDING */}
                {activeSection === "contributor" && (
                  <motion.section
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    className="p-6 sm:p-8 rounded-3xl border border-border bg-card shadow-sm space-y-6"
                  >
                    <div className="flex items-center justify-between border-b border-border pb-4">
                      <div>
                        <h2 className="text-lg font-bold text-foreground">
                          {isAz ? "Müəlliflik Statusu" : "Contributor Status"}
                        </h2>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {isAz ? "Rvan.me-də məqalə nəşr etmək və icmaya qoşulmaq." : "Publish articles and join Azerbaijan's creative community on Rvan.me."}
                        </p>
                      </div>

                      {isContributor && (
                        <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-md border border-primary/30 bg-primary/10 text-primary">
                          {contributorStatus === "VERIFIED" ? (isAz ? "TƏSDİQLƏNMİŞ MÜƏLLİF" : "VERIFIED AUTHOR") : (isAz ? "MÜƏLLİF" : "APPROVED CONTRIBUTOR")}
                        </span>
                      )}
                    </div>

                    {!isContributor ? (
                      /* Regular User */
                      showApplyWizard ? (
                        <ContributorApplicationWizard
                          onSuccess={handleApplicationSuccess}
                          onCancel={() => setShowApplyWizard(false)}
                        />
                      ) : (
                        <div className="p-6 rounded-2xl border border-border bg-surface/40 space-y-4">
                          <div className="space-y-1">
                            <h3 className="text-base font-bold text-foreground">
                              {isAz ? "Rvan.me Müəllifi Olun" : "Become a Contributor"}
                            </h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              {isAz
                                ? "«Fikirlərinizi Rvan.me-də paylaşın və öz peşəkar ictimai kimliyinizi qurun. Dizayn, marketinq, brendinq və texnologiya sahəsində ideyalarınız dəyərlidir.»"
                                : "“Share your ideas on Rvan.me and build your professional identity. Your perspective in design, branding, and creative technology has value.”"}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => setShowApplyWizard(true)}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs uppercase mono tracking-wider hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
                          >
                            <span>{isAz ? "MÜƏLLİFLİK MÜRACİƏTİ ET" : "BECOME A CONTRIBUTOR"}</span>
                            <ArrowUpRight size={14} />
                          </button>
                        </div>
                      )
                    ) : (
                      /* Approved Contributor Overview */
                      <div className="space-y-6">
                        <div className="p-6 rounded-2xl border border-primary/20 bg-primary/5 space-y-3">
                          <div className="text-xs font-bold text-primary mono uppercase tracking-wider">
                            {isAz ? "MÜƏLLİF PROFİLİNİZ AKTİVDİR" : "YOUR CONTRIBUTOR PROFILE IS ACTIVE"}
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {isAz
                              ? "Siz Rvan.me-də məqalə qaralamaları hazırlaya, redaksiyaya göndərə və dərc olunmuş yazılarınızın oxucu statistikasını izləyə bilərsiniz."
                              : "You can create drafts, submit articles for review, and track real reader engagement."}
                          </p>

                          <div className="flex flex-wrap items-center gap-3 pt-2">
                            <button
                              type="button"
                              onClick={() => setSubmitModalOpen(true)}
                              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold uppercase mono tracking-wider hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
                            >
                              <Plus size={13} />
                              <span>{isAz ? "YENİ MƏQALƏ QARALAMASI" : "NEW ARTICLE DRAFT"}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setActiveSection("my-articles")}
                              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border bg-surface text-xs font-bold uppercase mono text-foreground hover:bg-muted transition-colors cursor-pointer"
                            >
                              <FileText size={13} />
                              <span>{isAz ? "MƏQALƏLƏRİMƏ BAX" : "VIEW MY ARTICLES"}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.section>
                )}

                {/* 5. CONTRIBUTOR -> MY ARTICLES */}
                {activeSection === "my-articles" && isContributor && (
                  <motion.section
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    className="p-6 sm:p-8 rounded-3xl border border-border bg-card shadow-sm space-y-6"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
                      <div>
                        <h2 className="text-lg font-bold text-foreground">
                          {isAz ? "Məqalələrim və Qaralamalar" : "My Articles & Drafts"}
                        </h2>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {isAz ? "Yazdığınız bütün qaralamaların, baxışda olan və nəşr edilmiş məqalələrin statusu." : "All your drafts, under-review submissions, and published articles."}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSubmitModalOpen(true)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold uppercase mono tracking-wider hover:opacity-90 transition-opacity cursor-pointer shadow-sm self-start sm:self-auto"
                      >
                        <Plus size={13} />
                        <span>{isAz ? "YENİ QARALAMA" : "NEW DRAFT"}</span>
                      </button>
                    </div>

                    {/* Filter Pills */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2">
                      {["ALL", "SUBMITTED", "UNDER_REVIEW", "CHANGES_REQUESTED", "PUBLISHED"].map((st) => (
                        <button
                          key={st}
                          onClick={() => setStatusFilter(st)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold mono uppercase transition-all cursor-pointer ${
                            statusFilter === st
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "bg-surface border border-border text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {st === "ALL"
                            ? (isAz ? "HAMISI" : "ALL")
                            : st === "SUBMITTED"
                            ? (isAz ? "GÖNDƏRİLƏNLƏR" : "SUBMITTED")
                            : st === "UNDER_REVIEW"
                            ? (isAz ? "BAXIŞDA" : "UNDER REVIEW")
                            : st === "CHANGES_REQUESTED"
                            ? (isAz ? "DÜZƏLİŞ TƏLƏBİ" : "CHANGES REQUESTED")
                            : (isAz ? "NƏŞR OLUNANLAR" : "PUBLISHED")}
                        </button>
                      ))}
                    </div>

                    {/* Submissions List */}
                    {filteredSubmissions.length > 0 ? (
                      <div className="space-y-4">
                        {filteredSubmissions.map((sub) => (
                          <div
                            key={sub.id}
                            className="p-5 rounded-2xl border border-border bg-surface/50 space-y-3"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-2">
                                  <h4 className="text-sm font-bold text-foreground">{sub.title}</h4>
                                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                                    {sub.category}
                                  </span>
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-1">{sub.excerpt}</p>
                              </div>

                              <span
                                className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border self-start sm:self-auto ${
                                  sub.status === "PUBLISHED"
                                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                    : sub.status === "CHANGES_REQUESTED"
                                    ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                    : "bg-primary/10 text-primary border-primary/20"
                                }`}
                              >
                                {sub.status}
                              </span>
                            </div>

                            {/* Editorial feedback note if changes requested */}
                            {sub.editorialFeedback && (
                              <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-1">
                                <div className="text-[10px] font-bold font-mono text-amber-600 dark:text-amber-400 uppercase flex items-center gap-1">
                                  <AlertCircle size={12} />
                                  <span>{isAz ? "Redaksiya Qeydi:" : "Editorial Note:"}</span>
                                </div>
                                <p className="text-xs text-muted-foreground">{sub.editorialFeedback}</p>
                              </div>
                            )}

                            <div className="flex items-center justify-between border-t border-border pt-3 text-[11px] font-mono text-muted-foreground">
                              <span>{new Date(sub.createdAt).toLocaleDateString()}</span>
                              {sub.status === "PUBLISHED" && sub.publishedSlug && (
                                <Link
                                  to={getLocalizedPath(`/blog/${sub.publishedSlug}`)}
                                  className="inline-flex items-center gap-1 text-primary font-bold hover:underline"
                                >
                                  <span>{isAz ? "Oxu" : "View"}</span>
                                  <ArrowUpRight size={11} />
                                </Link>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-10 text-center text-xs text-muted-foreground">
                        {isAz ? "Bu filtr üzrə məqalə tapılmadı." : "No articles found in this filter."}
                      </div>
                    )}
                  </motion.section>
                )}

                {/* 6. CONTRIBUTOR -> INSIGHTS */}
                {activeSection === "insights" && isContributor && (
                  <motion.section
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    className="p-6 sm:p-8 rounded-3xl border border-border bg-card shadow-sm space-y-6"
                  >
                    <div className="border-b border-border pb-4">
                      <h2 className="text-lg font-bold text-foreground">
                        {isAz ? "Oxucu Analitikası" : "Article Insights"}
                      </h2>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {isAz ? "Yalnız sizin məqalələrinizə aid olan real oxucu baxışları və qarşılıqlı əlaqə." : "Real verified impressions and engagement for your published articles."}
                      </p>
                    </div>

                    {/* Stats summary */}
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="p-4 rounded-2xl border border-border bg-surface/50 space-y-1">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mono">
                          {isAz ? "Ümumi Baxışlar" : "Total Views"}
                        </div>
                        <div className="text-2xl font-extrabold text-foreground">
                          {analytics?.totalViews || 0}
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl border border-border bg-surface/50 space-y-1">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mono">
                          {isAz ? "Şərhlər" : "Comments"}
                        </div>
                        <div className="text-2xl font-extrabold text-foreground">
                          {analytics?.totalComments || 0}
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl border border-border bg-surface/50 space-y-1">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mono">
                          {isAz ? "Paylaşımlar" : "Shares"}
                        </div>
                        <div className="text-2xl font-extrabold text-foreground">
                          {analytics?.totalShares || 0}
                        </div>
                      </div>
                    </div>

                    {/* 14-day chart */}
                    {analytics?.dailyViews && analytics.dailyViews.length > 0 ? (
                      <div className="p-4 rounded-2xl border border-border bg-surface/30 space-y-3">
                        <div className="text-xs font-bold text-foreground mono uppercase tracking-wider">
                          {isAz ? "Son 14 Günlük Tarixçə" : "14-Day Timeline"}
                        </div>
                        <div className="h-32 flex items-end gap-2 pt-6">
                          {analytics.dailyViews.map((d) => {
                            const maxViews = Math.max(...analytics.dailyViews.map((v) => v.views), 1);
                            const heightPct = Math.max(12, (d.views / maxViews) * 100);
                            return (
                              <div key={d.date} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                                <span className="text-[9px] font-mono text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                                  {d.views}
                                </span>
                                <div
                                  style={{ height: `${heightPct}%` }}
                                  className="w-full rounded-t bg-primary/80 group-hover:bg-primary transition-colors"
                                />
                                <span className="text-[8px] font-mono text-muted-foreground truncate w-full text-center">
                                  {d.date.split("-").slice(1).join("/")}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="py-8 text-center text-xs text-muted-foreground">
                        {isAz ? "Hələlik analitik məlumat qeydə alınmayıb." : "No analytics recorded yet."}
                      </div>
                    )}
                  </motion.section>
                )}

                {/* 7. ACCOUNT -> GOOGLE ACCOUNT & SECURITY */}
                {activeSection === "account" && (
                  <motion.section
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    className="p-6 sm:p-8 rounded-3xl border border-border bg-card shadow-sm space-y-6"
                  >
                    <div className="border-b border-border pb-4">
                      <h2 className="text-lg font-bold text-foreground">
                        {isAz ? "Google Hesabı və Təhlükəsizlik" : "Google Account & Security"}
                      </h2>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {isAz ? "Bağlı Google autentifikasiya məlumatları və sessiya idarəetməsi." : "Connected Google OAuth authentication details and session controls."}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 rounded-2xl border border-border bg-surface/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="text-xs font-bold text-foreground mono uppercase tracking-wider">
                            {isAz ? "E-poçt Ünvanı" : "Email Address"}
                          </div>
                          <div className="text-sm text-muted-foreground font-mono mt-0.5">
                            {user.email}
                          </div>
                        </div>

                        <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 self-start sm:self-auto">
                          GOOGLE VERIFIED
                        </span>
                      </div>

                      <div className="p-4 rounded-2xl border border-border bg-surface/50 flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-foreground mono uppercase tracking-wider">
                            {isAz ? "Autentifikasiya Provayderi" : "Auth Provider"}
                          </div>
                          <div className="text-xs text-muted-foreground font-mono mt-0.5">
                            Google Firebase OAuth 2.0
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-border flex justify-end">
                        <button
                          type="button"
                          onClick={() => signOut()}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive text-xs font-bold uppercase mono hover:bg-destructive/20 transition-colors cursor-pointer"
                        >
                          <LogOut size={14} />
                          <span>{isAz ? "HESABDAN ÇIXIŞ" : "SIGN OUT"}</span>
                        </button>
                      </div>
                    </div>
                  </motion.section>
                )}
              </div>
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
      <ArticleSubmissionModal
        isOpen={submitModalOpen}
        onClose={() => setSubmitModalOpen(false)}
        onSubmitted={loadUserData}
      />
    </div>
  );
}
