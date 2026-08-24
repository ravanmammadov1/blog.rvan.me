import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

import { fetchProjectBySlug, fetchSiteSettings } from "../lib/sanityQueries";
import { urlFor } from "../lib/sanityClient";
import { ProjectItem, SiteSettings } from "../types/cms";
import { getFallbackProject } from "../lib/portfolioFallback";
import SEO from "./components/SEO";
import SiteHeader from "./components/SiteHeader";
import Footer from "./components/Footer";
import { useLanguage } from "../lib/i18n/LanguageContext";

function projectImage(project: ProjectItem | ReturnType<typeof getFallbackProject>) {
  if (!project) return undefined;
  if ("coverImage" in project && project.coverImage) {
    return urlFor(project.coverImage)?.width(1600).format("webp").auto("format").url();
  }
  return "image" in project ? project.image : undefined;
}

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [project, setProject] = useState<ProjectItem | null>(null);
  const [loading, setLoading] = useState(true);
  const { t, getLocalizedPath } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchSiteSettings().then(setSiteSettings);
    if (!slug) {
      setLoading(false);
      return;
    }
    fetchProjectBySlug(slug).then((item) => {
      setProject(item);
      setLoading(false);
    });
  }, [slug]);

  const fallback = getFallbackProject(slug);
  if (loading) {
    return <main className="grid min-h-screen place-items-center bg-background text-foreground" aria-busy="true">Loading case study…</main>;
  }

  if (!project && !fallback) {
    return (
      <main className="grid min-h-screen place-items-center bg-background px-6 text-foreground">
        <SEO title="Project Not Found — Ravan Mammadov" noIndex />
        <div className="text-center">
          <h1 className="text-4xl font-semibold">{t("projectNotFound", "Project Not Found")}</h1>
          <p className="mt-4 text-muted-foreground">{t("projectNotFoundDesc", "This case study is unavailable or has been removed.")}</p>
          <Link to={getLocalizedPath("/work")} className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-bold uppercase tracking-widest text-black mono">
            <ArrowLeft size={15} /> {t("backToWork", "Back to work")}
          </Link>
        </div>
      </main>
    );
  }

  const current = project || fallback!;
  const title = current.title;
  const description = current.description || `Explore the ${title} creative design case study by Ravan Mammadov.`;
  const image = projectImage(current);
  const tags = "tags" in current ? current.tags || [] : [];
  const projectSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `https://www.rvan.me/work/${slug}#creative-work`,
    name: title,
    description,
    url: `https://www.rvan.me/work/${slug}`,
    image: image ? [image] : [],
    creator: { "@id": "https://www.rvan.me/#person" },
    keywords: tags,
    about: tags.map((tag) => ({ "@type": "Thing", name: tag })),
  };

  return (
    <main className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'Geist', sans-serif" }}>
      <SEO
        title={`${title} — Creative Design Case Study | Ravan Mammadov`}
        description={description}
        image={image}
        url={`https://www.rvan.me/work/${slug}`}
        jsonLd={projectSchema}
      />
      <SiteHeader siteSettings={siteSettings} />

      <article className="px-6 pb-24 pt-32 md:px-10 md:pt-44">
        <div className="mx-auto max-w-[1280px]">
          <nav aria-label="Breadcrumb" className="mb-10 text-xs font-bold tracking-widest text-muted-foreground mono uppercase">
            <ol className="flex flex-wrap items-center gap-2">
              <li><Link to={getLocalizedPath("/")} className="hover:text-primary">{t("home", "Home")}</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link to={getLocalizedPath("/work")} className="hover:text-primary">{t("work", "Work")}</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-foreground">{title}</li>
            </ol>
          </nav>

          <p className="eyebrow text-primary">Creative case study · {current.year || "Selected work"}</p>
          <h1 className="mt-5 max-w-5xl text-5xl font-semibold tracking-[-.06em] md:text-8xl">{title}</h1>
          <p className="mt-8 max-w-3xl text-xl leading-relaxed text-muted-foreground">{description}</p>

          {image && (
            <figure className="mt-16 overflow-hidden rounded-3xl border border-[#DDE1E0] dark:border-white/10 bg-white dark:bg-white/5 shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-none">
              <img src={image} alt={`${title} ${current.type || "creative design"} project`} width={1600} height={1000} fetchPriority="high" decoding="async" className="h-auto w-full object-cover" />
              <figcaption className="px-6 py-4 text-xs text-muted-foreground mono">{current.type || "Creative design and visual direction"}</figcaption>
            </figure>
          )}

          <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_2fr]">
            <aside className="space-y-6">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mono">{t("role", "Role")}</h2>
                <p className="mt-2 font-semibold">Senior Creative Designer</p>
              </div>
              <div>
                <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mono">{t("focus", "Focus")}</h2>
                <div className="mt-2 flex flex-wrap gap-2">
                  {tags.map((tag) => <span key={tag} className="rounded-full border border-[#DDE1E0] dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-1 text-xs text-muted-foreground shadow-2xs">{tag}</span>)}
                </div>
              </div>
              <Link to={getLocalizedPath("/contact")} className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-primary mono uppercase hover:underline">
                {t("btnGetInTouch", "Discuss a similar project")} <ArrowUpRight size={14} />
              </Link>
            </aside>

            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <h2>{t("modalOverview", "Overview")}</h2>
              <p>{description}</p>
              <h2>{t("creativeDirection", "Creative direction")}</h2>
              <p>This project brings together strategic visual thinking, graphic design, and motion-led storytelling to create a consistent experience across campaign and digital touchpoints.</p>
              <h2>{t("needDesignSystem", "Need a design system that moves?")}</h2>
              <p>Ravan works with ambitious teams on brand identity, motion design, marketing creative, and visual systems from Baku and worldwide.</p>
            </div>
          </div>

          <div className="mt-16 border-t border-[#DDE1E0] dark:border-white/10 pt-8">
            <Link to={getLocalizedPath("/work")} className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-primary mono uppercase hover:underline">
              <ArrowLeft size={15} /> {t("backToWork", "Back to selected work")}
            </Link>
          </div>
        </div>
      </article>
      <Footer siteSettings={siteSettings} />
    </main>
  );
}
