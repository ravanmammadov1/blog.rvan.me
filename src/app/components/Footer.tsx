import { Link } from "react-router-dom";
import { useCookieConsent } from "../context/CookieConsentContext";
import { SiteSettings } from "../../types/cms";

interface FooterProps {
  siteSettings?: SiteSettings | null;
}

export default function Footer({ siteSettings }: FooterProps) {
  const { openPreferences } = useCookieConsent();

  return (
    <footer className="px-6 py-10 md:px-10 border-t border-border bg-background text-foreground">
      <div className="mx-auto flex max-w-[1600px] flex-col justify-between gap-6 text-[10px] font-bold tracking-[.18em] text-muted-foreground mono sm:flex-row sm:items-center">
        <span>© {new Date().getFullYear()} RAVAN MAMMADOV STUDIO</span>
        
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
            rel="noreferrer"
            className="transition-colors hover:text-primary"
          >
            BEHANCE
          </a>
          <a
            href={siteSettings?.socialLinks?.linkedin || "https://www.linkedin.com/in/ravanmammadov1/"}
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-primary"
          >
            LINKEDIN
          </a>
          <a
            href={siteSettings?.socialLinks?.instagram || "https://www.instagram.com/ravanimate/"}
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-primary"
          >
            INSTAGRAM
          </a>
        </div>
      </div>
    </footer>
  );
}
