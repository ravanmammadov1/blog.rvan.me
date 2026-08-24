import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Briefcase,
  Share2,
  BookOpen,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Send,
  Sparkles,
  Lock,
  Globe,
  Camera,
  Eye,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import { useLanguage } from "../../../lib/i18n/LanguageContext";
import { submitContributorApplication } from "../../../services/contributorService";
import { ContributorApplication } from "../../../types/contributor";

interface ContributorApplicationWizardProps {
  onSuccess: (app: ContributorApplication) => void;
  onCancel?: () => void;
}

const TOPIC_OPTIONS = [
  { id: "design", labelAz: "Dizayn və Şəbəkə Arxitekturası", labelEn: "Design & Visual Systems" },
  { id: "marketing", labelAz: "Marketinq və Böyümə", labelEn: "Marketing & Growth" },
  { id: "branding", labelAz: "Brend Kimliyi və Strategiya", labelEn: "Brand Identity & Strategy" },
  { id: "ai-creativity", labelAz: "Süni İntellekt və Yaradıcılıq", labelEn: "AI & Creative Tools" },
  { id: "creative-industry", labelAz: "Kreativ Sənaye və Karyera", labelEn: "Creative Industry & Workflows" },
];

export default function ContributorApplicationWizard({
  onSuccess,
  onCancel,
}: ContributorApplicationWizardProps) {
  const { user, userPhoto } = useAuth();
  const { language } = useLanguage();
  const isAz = language === "az";

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1: About You
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [photoURL, setPhotoURL] = useState(userPhoto || user?.photoURL || "");
  const [age, setAge] = useState<string>("");
  const [location, setLocation] = useState("Baku, Azerbaijan");
  const [showLocation, setShowLocation] = useState(true);
  const [bio, setBio] = useState("");

  // Step 2: Your Work
  const [roleTitle, setRoleTitle] = useState("");
  const [areaOfExpertise, setAreaOfExpertise] = useState("Brand Design & Visual Culture");
  const [yearsOfExperience, setYearsOfExperience] = useState("3+ years");
  const [currentRole, setCurrentRole] = useState("");

  // Step 3: Social Presence
  const [linkedin, setLinkedin] = useState("");
  const [behance, setBehance] = useState("");
  const [dribbble, setDribbble] = useState("");
  const [instagram, setInstagram] = useState("");
  const [website, setWebsite] = useState("");
  const [twitter, setTwitter] = useState("");

  // Step 4: Your Voice
  const [selectedTopics, setSelectedTopics] = useState<string[]>(["design", "branding"]);
  const [preferredLang, setPreferredLang] = useState<"az" | "en" | "tr">(isAz ? "az" : "en");

  const toggleTopic = (id: string) => {
    setSelectedTopics((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    setError(null);
    if (currentStep === 1) {
      if (!displayName.trim() || !bio.trim()) {
        setError(isAz ? "Ad və qısa bioqrafiya mütləq daxil edilməlidir." : "Full name and biography are required.");
        return;
      }
    }
    if (currentStep === 2) {
      if (!roleTitle.trim()) {
        setError(isAz ? "Peşəkar vəzifə/ad mütləq daxil edilməlidir." : "Professional title is required.");
        return;
      }
    }
    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setError(null);
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmitApplication = async () => {
    if (!user) {
      setError(isAz ? "Daxil olunmayıb." : "Not authenticated.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const slug = displayName
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "") || `author-${user.uid.substring(0, 6)}`;

    try {
      const app = await submitContributorApplication({
        uid: user.uid,
        email: user.email,
        age: age ? Number(age) || age : undefined,
        displayName: displayName.trim(),
        slug,
        photoURL: photoURL || null,
        roleTitle: roleTitle.trim(),
        areaOfExpertise: areaOfExpertise.trim(),
        yearsOfExperience: yearsOfExperience.trim(),
        currentRole: currentRole.trim(),
        location: location.trim(),
        showLocation,
        bio: bio.trim(),
        socialLinks: {
          linkedin: linkedin.trim() || undefined,
          behance: behance.trim() || undefined,
          dribbble: dribbble.trim() || undefined,
          instagram: instagram.trim() || undefined,
          website: website.trim() || undefined,
          twitter: twitter.trim() || undefined,
        },
        preferredTopics: selectedTopics,
        preferredLanguage: preferredLang,
        isVerifiedAuthor: false,
      });

      onSuccess(app);
    } catch (err: any) {
      setError(err?.message || "Failed to submit application.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { num: 1, label: isAz ? "Haqqınızda" : "About You", icon: User },
    { num: 2, label: isAz ? "Peşəniz" : "Your Work", icon: Briefcase },
    { num: 3, label: isAz ? "Linklər" : "Social Presence", icon: Share2 },
    { num: 4, label: isAz ? "Baxışınız" : "Your Voice", icon: BookOpen },
    { num: 5, label: isAz ? "Önizləmə" : "Review & Preview", icon: Eye },
  ];

  return (
    <div className="rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-xl max-w-4xl mx-auto space-y-8">
      {/* Wizard Step Bar */}
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[.18em] text-primary mono">
              {isAz ? "MÜƏLLİFLİK MÜRACİƏTİ" : "CONTRIBUTOR APPLICATION"}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mt-0.5">
              {isAz ? "Müəllif Kabinetinizi Qurun" : "Set Up Your Contributor Profile"}
            </h2>
          </div>
          <span className="text-xs font-mono text-muted-foreground font-bold">
            {currentStep} / 5
          </span>
        </div>

        {/* Step Progress Indicators */}
        <div className="grid grid-cols-5 gap-2 pt-4">
          {steps.map((s) => (
            <div
              key={s.num}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentStep >= s.num ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive text-xs flex items-center gap-2">
          <AlertCircle size={15} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {currentStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            className="space-y-6"
          >
            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground">
                {isAz ? "1. Şəxsi Məlumatlar və Bio" : "1. Personal Information & Bio"}
              </h3>
              <p className="text-xs text-muted-foreground">
                {isAz
                  ? "Rvan.me-də oxuculara görünəcək əsas adınız və qısa təqdimatınız."
                  : "Your core author name and public background presentation."}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground mono">
                  {isAz ? "Tam Adınız" : "Full Name"} *
                </label>
                <input
                  type="text"
                  required
                  autoComplete="name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Nigar Əliyeva"
                  className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground mono flex items-center gap-1.5">
                  <Lock size={11} className="text-primary" />
                  <span>{isAz ? "Yaş (Məxfi / Redaksiya)" : "Age (Private / Editorial)"}</span>
                </label>
                <input
                  type="number"
                  autoComplete="off"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder={isAz ? "Məsələn: 26 (yalnız redaksiya üçündür)" : "e.g. 26 (private to editorial)"}
                  className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
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
                  autoComplete="address-level2"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Baku, Azerbaijan"
                  className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="showLoc"
                  checked={showLocation}
                  onChange={(e) => setShowLocation(e.target.checked)}
                  className="rounded border-border text-primary"
                />
                <label htmlFor="showLoc" className="text-xs text-muted-foreground cursor-pointer">
                  {isAz ? "Məkanımı ictimai profilimdə göstər" : "Display location on public author profile"}
                </label>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground mono">
                {isAz ? "Qısa Bioqrafiya" : "Short Biography"} *
              </label>
              <textarea
                rows={3}
                required
                autoComplete="off"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder={
                  isAz
                    ? "Brend dizaynı, rəqəmsal vizual sistemlər və marketinq strategiyası üzrə fəaliyyət göstərən dizayner..."
                    : "Designer exploring visual identity systems, digital craft, and marketing creative..."
                }
                className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none resize-none leading-relaxed"
              />
            </div>
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            className="space-y-6"
          >
            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground">
                {isAz ? "2. Peşəkar Sahəniz və Təcrübəniz" : "2. Professional Experience & Focus"}
              </h3>
              <p className="text-xs text-muted-foreground">
                {isAz
                  ? "Oxucuların və redaksiyanın sizin ixtisas sahənizi dəqiq anlaması üçün."
                  : "Help readers and editors understand your professional domain."}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground mono">
                  {isAz ? "Peşəkar Titul / Vəzifə" : "Professional Title"} *
                </label>
                <input
                  type="text"
                  required
                  autoComplete="organization-title"
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  placeholder="e.g. Senior Brand Designer / Marketing Strategist"
                  className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground mono">
                  {isAz ? "İxtisaslaşma Sahəsi" : "Area of Expertise"}
                </label>
                <input
                  type="text"
                  autoComplete="off"
                  value={areaOfExpertise}
                  onChange={(e) => setAreaOfExpertise(e.target.value)}
                  placeholder="e.g. Visual Identity & Typography"
                  className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground mono">
                  {isAz ? "Təcrübə Səviyyəsi" : "Years / Level of Experience"}
                </label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                >
                  <option value="1-3 years">1–3 years / Junior-Mid</option>
                  <option value="3-5 years">3–5 years / Mid-Senior</option>
                  <option value="5-8 years">5–8 years / Senior</option>
                  <option value="8+ years">8+ years / Lead / Director</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground mono">
                  {isAz ? "Hazırkı Şirkət / Fəaliyyət" : "Current Role / Company (Optional)"}
                </label>
                <input
                  type="text"
                  autoComplete="organization-title"
                  value={currentRole}
                  onChange={(e) => setCurrentRole(e.target.value)}
                  placeholder="e.g. Freelance / Creative Agency"
                  className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          </motion.div>
        )}

        {currentStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            className="space-y-6"
          >
            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground">
                {isAz ? "3. Sosial və Peşəkar Portfolionuz" : "3. Social & Professional Links"}
              </h3>
              <p className="text-xs text-muted-foreground">
                {isAz
                  ? "Oxucuların sizin digər işlərinizlə tanış ola bilməsi üçün linkləri əlavə edin."
                  : "Links that will be featured on your public author profile."}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground mono">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  autoComplete="url"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full rounded-xl border border-border bg-surface px-4 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground mono">
                  Behance URL
                </label>
                <input
                  type="url"
                  autoComplete="url"
                  value={behance}
                  onChange={(e) => setBehance(e.target.value)}
                  placeholder="https://behance.net/username"
                  className="w-full rounded-xl border border-border bg-surface px-4 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground mono">
                  Personal Website / Portfolio
                </label>
                <input
                  type="url"
                  autoComplete="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://yourportfolio.com"
                  className="w-full rounded-xl border border-border bg-surface px-4 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground mono">
                  Dribbble / Instagram (Optional)
                </label>
                <input
                  type="text"
                  autoComplete="url"
                  value={dribbble || instagram}
                  onChange={(e) => {
                    setDribbble(e.target.value);
                    setInstagram(e.target.value);
                  }}
                  placeholder="https://dribbble.com/username or @handle"
                  className="w-full rounded-xl border border-border bg-surface px-4 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          </motion.div>
        )}

        {currentStep === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            className="space-y-6"
          >
            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground">
                {isAz ? "4. Yazmaq İstədiyiniz Mövzular və Dil" : "4. Topics & Preferred Language"}
              </h3>
              <p className="text-xs text-muted-foreground">
                {isAz
                  ? "Rvan.me-də əsasən hansı mövzularda məqalələr paylaşmaq istəyirsiniz?"
                  : "Which topics and languages align best with your perspective?"}
              </p>
            </div>

            {/* Topics Checkboxes */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground mono">
                {isAz ? "Əsas Mövzular" : "Primary Topics"}
              </label>
              <div className="grid gap-2 sm:grid-cols-2">
                {TOPIC_OPTIONS.map((opt) => (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() => toggleTopic(opt.id)}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between text-xs font-bold transition-all cursor-pointer ${
                      selectedTopics.includes(opt.id)
                        ? "border-primary bg-primary/10 text-foreground shadow-sm"
                        : "border-border bg-surface text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span>{isAz ? opt.labelAz : opt.labelEn}</span>
                    {selectedTopics.includes(opt.id) && <CheckCircle2 size={15} className="text-primary" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Preferred Language */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground mono">
                {isAz ? "Əsas Yazı Dili" : "Preferred Language"}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { code: "az", label: "Azərbaycan Dili" },
                  { code: "en", label: "English" },
                  { code: "tr", label: "Türkçe" },
                ].map((l) => (
                  <button
                    type="button"
                    key={l.code}
                    onClick={() => setPreferredLang(l.code as any)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold mono uppercase transition-all cursor-pointer ${
                      preferredLang === l.code
                        ? "border-primary bg-primary text-primary-foreground shadow-sm"
                        : "border-border bg-surface text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {currentStep === 5 && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            className="space-y-6"
          >
            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground">
                {isAz ? "5. Məlumatların Yoxlanılması və İctimai Önizləmə" : "5. Public Author Profile Preview"}
              </h3>
              <p className="text-xs text-muted-foreground">
                {isAz
                  ? "Təsdiq etməzdən əvvəl profilinizin Rvan.me-də necə görünəcəyinə baxın."
                  : "Review how your public author card and presence will appear."}
              </p>
            </div>

            {/* Privacy notice banner */}
            <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 flex items-center gap-3">
              <Lock size={16} className="text-primary shrink-0" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong className="text-foreground">{isAz ? "Məxfilik:" : "Privacy Guarantee:"}</strong>{" "}
                {isAz
                  ? "E-poçt ünvanınız və yaşınız heç vaxt ictimaiyyətə göstərilmir, yalnız redaksiya əlaqəsi üçün saxlanılır."
                  : "Your email and exact age are strictly private to our editorial team and never displayed publicly."}
              </p>
            </div>

            {/* Live Public Author Card Preview */}
            <div className="p-6 rounded-2xl border-2 border-border bg-card space-y-4 shadow-sm">
              <div className="text-[10px] font-bold uppercase tracking-[.18em] text-primary mono">
                {isAz ? "İCTİMAİ MÜƏLLİF KARTININ ÖNİZLƏMƏSİ" : "LIVE PUBLIC AUTHOR CARD PREVIEW"}
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                {photoURL ? (
                  <img
                    src={photoURL}
                    alt={displayName}
                    className="h-20 w-20 rounded-2xl object-cover border border-border bg-surface shrink-0"
                  />
                ) : (
                  <div className="h-20 w-20 rounded-2xl bg-primary text-primary-foreground font-bold flex items-center justify-center text-xl shrink-0">
                    {displayName.charAt(0) || "U"}
                  </div>
                )}

                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-lg font-bold text-foreground">{displayName || "Your Name"}</h4>
                    <span className="text-[10px] font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                      AUTHOR
                    </span>
                  </div>
                  <p className="text-xs font-medium text-muted-foreground">
                    {roleTitle || "Creative Contributor"}
                    {showLocation && location ? ` · ${location}` : ""}
                  </p>
                  <p className="text-xs text-muted-foreground/90 leading-relaxed pt-1">
                    {bio || "Your biography will appear here."}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="pt-4 border-t border-border flex items-center justify-between gap-3">
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={handlePrev}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border text-xs font-bold uppercase mono text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <ArrowLeft size={13} />
            <span>{isAz ? "GERİ" : "BACK"}</span>
          </button>
        ) : onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl border border-border text-xs font-bold uppercase mono text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            {isAz ? "LƏĞV ET" : "CANCEL"}
          </button>
        ) : (
          <div />
        )}

        {currentStep < 5 ? (
          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold uppercase mono tracking-wider hover:opacity-90 transition-opacity cursor-pointer"
          >
            <span>{isAz ? "NÖVBƏTİ" : "NEXT STEP"}</span>
            <ArrowRight size={13} />
          </button>
        ) : (
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleSubmitApplication}
            className="flex items-center gap-2 px-8 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold uppercase mono tracking-wider hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer shadow-lg shadow-primary/20"
          >
            <Send size={13} />
            <span>{isSubmitting ? (isAz ? "GÖNDƏRİLİR..." : "SUBMITTING...") : (isAz ? "MÜRACİƏTİ TƏSDİQLƏ" : "COMPLETE APPLICATION")}</span>
          </button>
        )}
      </div>
    </div>
  );
}
