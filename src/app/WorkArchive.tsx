import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

import { fetchProjects, fetchSiteSettings } from "../lib/sanityQueries";
import { urlFor } from "../lib/sanityClient";
import { ProjectItem, SiteSettings } from "../types/cms";
import { getFallbackProject, PORTFOLIO_FALLBACK_PROJECTS } from "../lib/portfolioFallback";
import SEO from "./components/SEO";
import SiteHeader from "./components/SiteHeader";
import Footer from "./components/Footer";
import PageHero from "./components/PageHero";
import { useLanguage } from "../lib/i18n/LanguageContext";

function getProjectImage(project: ProjectItem) {
  return project.coverImage ? urlFor(project.coverImage)?.width(1200).format("webp").auto("format").url() : undefined;
}

export default function WorkArchive() {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const { t, getLocalizedPath } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchSiteSettings().then(setSiteSettings);
    fetchProjects().then((items) => setProjects(items || []));
  }, []);

  const displayProjects = projects.length > 0
    ? projects.map((project) => ({
        ...project,
        slug: project.slug?.current || "",
        image: getProjectImage(project),
        tags: project.tags || [],
      })).filter((project) => project.slug)
    : PORTFOLIO_FALLBACK_PROJECTS;

  return (
    <main className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'Geist', sans-serif" }}>
      <SEO
        title="Creative Portfolio — Motion, Brand & Graphic Design | Ravan Mammadov"
        description="Explore selected motion design, brand identity, graphic design, and marketing creative case studies by Ravan Mammadov in Baku, Azerbaijan."
        url="https://www.rvan.me/work"
      />
      <SiteHeader siteSettings={siteSettings} />

      {/* Unified Page Hero */}
      <PageHero
        title={t("sectionWorkTitleMain", "Motion, Brand &")}
        accentText={t("sectionWorkTitleAccent", "Graphic Case Studies.")}
        gradientVariant="creative"
        description={t("sectionWorkDesc", "A selection of creative campaigns, brand systems, 3D visuals, and marketing design work by senior creative designer Ravan Mammadov.")}
      />

      <section className="px-6 pb-24 md:px-10">
        <div className="mx-auto max-w-[1600px]">
          <div className="grid gap-8 lg:grid-cols-3">
            {displayProjects.map((project, index) => {
              const fallback = getFallbackProject(project.slug);
              const image = project.image || fallback?.image;
              const detailPath = getLocalizedPath(`/work/${project.slug}`);
              return (
                <article key={project.slug} className="group overflow-hidden rounded-3xl border border-[#DDE1E0] dark:border-white/10 bg-white dark:bg-white/5 shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-none">
                  <Link to={detailPath} className="block">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      {image && (
                        <img
                          src={image}
                          alt={`${project.title} ${project.type || "creative design case study"}`}
                          width={1200}
                          height={900}
                          loading={index === 0 ? "eager" : "lazy"}
                          fetchPriority={index === 0 ? "high" : "auto"}
                          decoding="async"
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" aria-hidden="true" />
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <p className="text-xs font-bold tracking-widest text-primary mono uppercase">0{index + 1} · {project.year || "Selected work"}</p>
                        <h2 className="mt-2 text-2xl font-semibold text-white">{project.title}</h2>
                      </div>
                    </div>
                  </Link>
                  <div className="p-6">
                    <p className="text-sm font-semibold text-foreground">{project.type || "Creative case study"}</p>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{project.description || fallback?.description}</p>
                    <Link to={detailPath} className="mt-6 inline-flex items-center gap-2 text-xs font-bold tracking-widest text-primary mono uppercase hover:underline">
                      {t("readArticle", "Read case study")} <ArrowUpRight size={14} />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

          <section className="mt-24 rounded-3xl border border-[#DDE1E0] dark:border-white/10 bg-white dark:bg-white/5 p-8 md:p-12 shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-none" aria-labelledby="work-cta-heading">
            <h2 id="work-cta-heading" className="text-3xl font-semibold tracking-tight md:text-5xl">{t("sectionContactTitle", "Have a project in motion?")}</h2>
            <p className="mt-4 max-w-2xl text-muted-foreground">{t("sectionContactSubtitle", "Let's discuss motion design, brand identity, graphic design, or a marketing campaign for your next launch.")}</p>
            <Link to={getLocalizedPath("/contact")} className="mt-8 inline-flex items-center gap-3 rounded-full bg-primary px-7 py-4 text-xs font-bold tracking-widest text-black mono uppercase hover:bg-white">
              {t("btnGetInTouch", "Start a project")} <ArrowUpRight size={16} />
            </Link>
          </section>
        </div>
      </section>
      <Footer siteSettings={siteSettings} />
    </main>
  );
}
