import React from "react";
import { ResumeData } from "../resumeTypes";
import { useAuth } from "../../../../../hooks/useAuth";
import { User, Mail, Phone, MapPin, Globe, Linkedin, Github, Camera, Trash2, Eye, EyeOff, Sparkles, RefreshCw } from "lucide-react";

interface Props {
  data: ResumeData;
  onChange: (newData: ResumeData) => void;
}

export const PersonalInfoForm: React.FC<Props> = ({ data, onChange }) => {
  const info = data.personalInfo;
  const { randomizeAvatar, avatarSvgUri } = useAuth();

  const handleChange = (field: keyof typeof info, val: any) => {
    onChange({
      ...data,
      personalInfo: {
        ...info,
        [field]: val,
      },
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === "string") {
        handleChange("photoUrl", event.target.result);
        handleChange("showPhoto", true);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyCharacter = () => {
    if (avatarSvgUri) {
      handleChange("photoUrl", avatarSvgUri);
      handleChange("showPhoto", true);
    }
  };

  const handleRegenerateCharacter = () => {
    randomizeAvatar();
    if (avatarSvgUri) {
      handleChange("photoUrl", avatarSvgUri);
      handleChange("showPhoto", true);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2 text-sm font-bold text-foreground">
          <User size={16} className="text-primary" />
          <span>Personal & Contact Information</span>
        </div>

        {/* Photo Toggle */}
        <button
          type="button"
          onClick={() => handleChange("showPhoto", !info.showPhoto)}
          className={`flex items-center gap-1.5 text-xs font-mono px-3 py-1 rounded-xl border transition-all cursor-pointer ${
            info.showPhoto
              ? "bg-primary/10 border-primary/30 text-primary font-bold"
              : "bg-white/5 border-white/10 text-muted-foreground"
          }`}
        >
          {info.showPhoto ? <Eye size={12} /> : <EyeOff size={12} />}
          <span>{info.showPhoto ? "Photo Enabled" : "Photo Hidden"}</span>
        </button>
      </div>

      {/* Profile Photo & Character System */}
      {info.showPhoto && (
        <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-primary/40 bg-neutral-800 shrink-0 shadow-lg">
            {info.photoUrl ? (
              <img src={info.photoUrl} alt={info.fullName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-400">
                <User size={30} />
              </div>
            )}
          </div>

          <div className="space-y-1.5 flex-1 text-center sm:text-left">
            <div className="text-xs font-bold text-foreground">Profile Image & Character Avatar</div>
            <p className="text-[11px] text-muted-foreground">
              Use your customized Open Peeps character avatar or upload a real headshot photo.
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              <button
                type="button"
                onClick={handleApplyCharacter}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-black font-mono font-bold text-[11px] hover:bg-primary/90 transition-all cursor-pointer"
              >
                <Sparkles size={12} />
                <span>Use Character</span>
              </button>

              <button
                type="button"
                onClick={handleRegenerateCharacter}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-[11px] transition-all cursor-pointer"
                title="Create a new character style"
              >
                <RefreshCw size={11} />
                <span>Regenerate 🎲</span>
              </button>

              <label htmlFor="personal-photo-upload" className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-[11px] transition-all cursor-pointer">
                <Camera size={12} />
                <span>Upload Real Photo</span>
                <input id="personal-photo-upload" name="personalPhotoUpload" type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>

              {info.photoUrl && (
                <button
                  type="button"
                  onClick={() => handleChange("photoUrl", "")}
                  className="flex items-center gap-1 text-[11px] font-mono text-red-400 hover:text-red-300 px-2 py-1 transition-colors cursor-pointer"
                >
                  <Trash2 size={12} /> Remove
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label htmlFor="personal-full-name" className="text-[11px] font-mono font-bold text-muted-foreground uppercase">Full Name *</label>
          <div className="relative mt-1">
            <input
              id="personal-full-name"
              name="fullName"
              type="text"
              autoComplete="name"
              value={info.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              placeholder="e.g. Richard Sanchez"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label htmlFor="personal-title" className="text-[11px] font-mono font-bold text-muted-foreground uppercase">Professional Title *</label>
          <div className="relative mt-1">
            <input
              id="personal-title"
              name="title"
              type="text"
              autoComplete="organization-title"
              value={info.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="e.g. Accounting Executive / Project Manager"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label htmlFor="personal-email" className="text-[11px] font-mono font-bold text-muted-foreground uppercase flex items-center gap-1">
            <Mail size={11} /> Email Address *
          </label>
          <div className="relative mt-1">
            <input
              id="personal-email"
              name="email"
              type="email"
              autoComplete="email"
              value={info.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="e.g. richard@example.com"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label htmlFor="personal-phone" className="text-[11px] font-mono font-bold text-muted-foreground uppercase flex items-center gap-1">
            <Phone size={11} /> Phone Number *
          </label>
          <div className="relative mt-1">
            <input
              id="personal-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              value={info.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="e.g. +1 (555) 234-5678"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label htmlFor="personal-location" className="text-[11px] font-mono font-bold text-muted-foreground uppercase flex items-center gap-1">
            <MapPin size={11} /> Location (City, Country / State) *
          </label>
          <div className="relative mt-1">
            <input
              id="personal-location"
              name="location"
              type="text"
              autoComplete="address-level2"
              value={info.location}
              onChange={(e) => handleChange("location", e.target.value)}
              placeholder="e.g. New York, NY or London, UK"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label htmlFor="personal-website" className="text-[11px] font-mono font-bold text-muted-foreground uppercase flex items-center gap-1">
            <Globe size={11} /> Portfolio / Website URL
          </label>
          <div className="relative mt-1">
            <input
              id="personal-website"
              name="website"
              type="url"
              autoComplete="url"
              value={info.website}
              onChange={(e) => handleChange("website", e.target.value)}
              placeholder="e.g. https://richardsanchez.com"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label htmlFor="personal-linkedin" className="text-[11px] font-mono font-bold text-muted-foreground uppercase flex items-center gap-1">
            <Linkedin size={11} /> LinkedIn URL / Profile
          </label>
          <div className="relative mt-1">
            <input
              id="personal-linkedin"
              name="linkedin"
              type="text"
              value={info.linkedin}
              onChange={(e) => handleChange("linkedin", e.target.value)}
              placeholder="e.g. https://linkedin.com/in/richard"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label htmlFor="personal-github" className="text-[11px] font-mono font-bold text-muted-foreground uppercase flex items-center gap-1">
            <Github size={11} /> GitHub / Repository URL
          </label>
          <div className="relative mt-1">
            <input
              id="personal-github"
              name="github"
              type="text"
              value={info.github}
              onChange={(e) => handleChange("github", e.target.value)}
              placeholder="e.g. https://github.com/richard"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
