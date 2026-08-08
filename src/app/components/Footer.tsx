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
      <div className="relative z-10 mx-auto flex max-w-[1600px] flex-col justify-between gap-6 text-[10px] font-bold tracking-[.18em] text-muted-foreground mono sm:flex-row sm:items-center">
        <span>© {new Date().getFullYear()} Rvan.me · Ravan Mammadov Studio</span>


        
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link to="/resources" className="transition-colors hover:text-primary">
            RESOURCES
          </Link>
          <Link to="/news" className="transition-colors hover:text-primary">
            NEWS
          </Link>
          <Link to="/tools" className="transition-colors hover:text-primary">
            TOOLS
          </Link>
          <Link to="/blog" className="transition-colors hover:text-primary">
            BLOG
          </Link>
          <Link to="/about" className="transition-colors hover:text-primary">
            ABOUT
          </Link>
          <Link to="/contact" className="transition-colors hover:text-primary">
            CONTACT
          </Link>
          <span className="text-border">·</span>
          <Link to="/privacy-policy" className="transition-colors hover:text-primary">
            PRIVACY POLICY
          </Link>
          <Link to="/cookie-policy" className="transition-colors hover:text-primary">
            COOKIE POLICY
          </Link>
          <Link to="/terms" className="transition-colors hover:text-primary">
            TERMS
          </Link>
          <button
            onClick={openPreferences}
            type="button"
            className="p-0 border-none bg-transparent text-[10px] font-bold tracking-[.18em] text-muted-foreground hover:text-primary transition-colors mono uppercase cursor-pointer"
          >
            COOKIES
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
