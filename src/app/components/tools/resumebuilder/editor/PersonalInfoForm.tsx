import React from "react";
import { ResumeData } from "../resumeTypes";
import { User, Mail, Phone, MapPin, Globe, Linkedin, Github, Briefcase } from "lucide-react";

interface Props {
  data: ResumeData;
  onChange: (newData: ResumeData) => void;
}

export const PersonalInfoForm: React.FC<Props> = ({ data, onChange }) => {
  const info = data.personalInfo;

  const handleChange = (field: keyof typeof info, val: string) => {
    onChange({
      ...data,
      personalInfo: {
        ...info,
        [field]: val,
      },
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-bold text-foreground">
        <User size={16} className="text-primary" />
        <span>Personal & Contact Information</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="text-[11px] font-mono font-bold text-muted-foreground uppercase">Full Name *</label>
          <div className="relative mt-1">
            <input
              type="text"
              value={info.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              placeholder="e.g. Alex Rivera"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-mono font-bold text-muted-foreground uppercase">Professional Title *</label>
          <div className="relative mt-1">
            <input
              type="text"
              value={info.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="e.g. Senior Full-Stack Software Engineer"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-mono font-bold text-muted-foreground uppercase flex items-center gap-1">
            <Mail size={11} /> Email Address *
          </label>
          <div className="relative mt-1">
            <input
              type="email"
              value={info.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="e.g. alex@example.com"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-mono font-bold text-muted-foreground uppercase flex items-center gap-1">
            <Phone size={11} /> Phone Number *
          </label>
          <div className="relative mt-1">
            <input
              type="tel"
              value={info.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="e.g. +1 (555) 234-5678"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-mono font-bold text-muted-foreground uppercase flex items-center gap-1">
            <MapPin size={11} /> Location (City, Country / State) *
          </label>
          <div className="relative mt-1">
            <input
              type="text"
              value={info.location}
              onChange={(e) => handleChange("location", e.target.value)}
              placeholder="e.g. San Francisco, CA (Open to Remote)"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-mono font-bold text-muted-foreground uppercase flex items-center gap-1">
            <Globe size={11} /> Portfolio / Website URL
          </label>
          <div className="relative mt-1">
            <input
              type="url"
              value={info.website}
              onChange={(e) => handleChange("website", e.target.value)}
              placeholder="e.g. https://alexrivera.dev"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-mono font-bold text-muted-foreground uppercase flex items-center gap-1">
            <Linkedin size={11} /> LinkedIn URL / Profile
          </label>
          <div className="relative mt-1">
            <input
              type="text"
              value={info.linkedin}
              onChange={(e) => handleChange("linkedin", e.target.value)}
              placeholder="e.g. https://linkedin.com/in/alexrivera"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-mono font-bold text-muted-foreground uppercase flex items-center gap-1">
            <Github size={11} /> GitHub / Repository URL
          </label>
          <div className="relative mt-1">
            <input
              type="text"
              value={info.github}
              onChange={(e) => handleChange("github", e.target.value)}
              placeholder="e.g. https://github.com/alexrivera"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
