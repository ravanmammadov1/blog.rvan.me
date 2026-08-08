import { Link } from "react-router-dom";
import { useCookieConsent } from "../context/CookieConsentContext";
import { SiteSettings } from "../../types/cms";

interface FooterProps {
  siteSettings?: SiteSettings | null;
}

export default function Footer({ siteSettings }: FooterProps) {
  const { openPreferences } = useCookieConsent();

  return (
    <footer className="relative px-6 py-10 md:px-10 border-t border-border bg-background text-foreground overflow-hidden">
      {/* Subtle aurora glow at the bottom */}
      <div 
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-full opacity-30"
        style={{
          background: "radial-gradient(ellipse at 50% 100%, rgba(16,185,129,0.1) 0%, rgba(59,130,246,0.05) 50%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div className="relative z-10 mx-auto max-w-[1600px] mb-8 pb-8 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1 max-w-xl">
          <span className="text-xs font-bold text-foreground tracking-widest mono uppercase">Rvan.me</span>
          <p className="text-xs text-muted-foreground font-medium leading-relaxed">
            Sign in with Google to save resources, bookmarks and personalize your experience.
          </p>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-bold tracking-[.18em] mono">
          <Link to="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors uppercase">
            Privacy Policy
          </Link>
          <span className="text-white/20">·</span>
          <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors uppercase">
            Terms of Service
          </Link>
        </div>
      </div>

      <div className="relative z-10 mx-auto flex max-w-[1600px] flex-col justify-between gap-6 text-[10px] font-bold tracking-[.18em] text-muted-foreground mono sm:flex-row sm:items-center">
        <span>© {new Date().getFullYear()} Rvan.me · Ravan Mammadov Studio</span>

        
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link to="/privacy-policy" className="transition-colors hover:text-primary">
            PRIVACY POLICY
          </Link>
          <Link to="/cookie-policy" className="transition-colors hover:text-primary">
            COOKIE POLICY
          </Link>
          <Link to="/terms" className="transition-colors hover:text-primary">
            TERMS OF SERVICE
          </Link>
          <Link to="/resources" className="transition-colors hover:text-primary">
            RESOURCES
          </Link>
          <button
            onClick={openPreferences}
            type="button"
            className="p-0 border-none bg-transparent text-[10px] font-bold tracking-[.18em] text-muted-foreground hover:text-primary transition-colors mono uppercase cursor-pointer"
          >
            COOKIE PREFERENCES
          </button>
          
          <span className="text-border">·</span>

          <a
            href={siteSettings?.socialLinks?.behance || "https://www.behance.net/mammadovravan"}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-primary"
          >
            BEHANCE
          </a>
          <a
            href={siteSettings?.socialLinks?.linkedin || "https://www.linkedin.com/in/ravanmammadov1/"}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-primary"
          >
            LINKEDIN
          </a>
          <a
            href={siteSettings?.socialLinks?.instagram || "https://www.instagram.com/ravanimate/"}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-primary"
          >
            INSTAGRAM
          </a>
        </div>
      </div>
    </footer>
  );
}
