import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { client, urlFor } from "../../../lib/sanityClient";
import { Eyebrow } from "../Eyebrow";
import { useLanguage } from "../../../lib/i18n/LanguageContext";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay, ease: "easeInOut" },
  }),
};

import { INTERACTIVE_TOOLS } from "../../lib/toolsRegistry";
import { buildPeepSvg, PREMADE_PEEPS } from "../tools/openpeeps/peepsAssets";

export default function ToolsSection() {
  const [toolsList, setToolsList] = useState<any[]>([]);
  const { t, getLocalizedPath, language } = useLanguage();

  useEffect(() => {
    // Fetch Tools (latest 4)
    client
      .fetch(`
        *[_type == "tools"] | order(category asc, name asc)[0...4]{
          _id,
          name,
          name_az,
          description,
          description_az,
          icon,
          link,
          category
        }
      `)
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setToolsList(data);
        } else {
          // Fallback to primary creative tool registry
          setToolsList(
            INTERACTIVE_TOOLS.map((tool) => ({
              _id: tool.id,
              name: language === "az" && tool.name_az ? tool.name_az : tool.name,
              description: language === "az" && tool.description_az ? tool.description_az : tool.description,
              icon: tool.icon,
              link: tool.path,
              category: tool.category,
            }))
          );
        }
      })
      .catch(() => {
        setToolsList(
          INTERACTIVE_TOOLS.map((tool) => ({
            _id: tool.id,
            name: language === "az" && tool.name_az ? tool.name_az : tool.name,
            description: language === "az" && tool.description_az ? tool.description_az : tool.description,
            icon: tool.icon,
            link: tool.path,
            category: tool.category,
          }))
        );
      });
  }, [language]);

  return (
    <section id="tools" className="relative px-6 py-28 md:px-10 md:py-40 overflow-hidden">
      {/* Subtle section aurora background */}
      <div 
        className="pointer-events-none absolute inset-0 -z-10 opacity-30"
        style={{
          background: "radial-gradient(circle at 10% 80%, rgba(97,197,173,0.08) 0%, rgba(66,111,186,0.04) 50%, transparent 70%)",
        }}
      />
      <div className="mx-auto max-w-[1600px] relative z-10">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-16 flex items-end justify-between border-b border-white/10 pb-6"
        >
          <div>
            <Eyebrow className="text-muted-foreground">{t("sectionToolsEyebrow", "05 / Designer Toolkit")}</Eyebrow>
            <h2 className="mt-6 text-4xl font-semibold tracking-[-.05em] md:text-6xl text-foreground">
              {t("sectionToolsTitle", "Featured Interactive Tools.")}
            </h2>
          </div>
          <Link
            to={getLocalizedPath("/tools")}
            className="group hidden items-center gap-2 text-xs font-bold tracking-[.14em] text-muted-foreground transition-colors hover:text-primary mono md:flex"
          >
            {t("viewAllUtilities", "VIEW ALL IN-BROWSER UTILITIES")}
            <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        {toolsList.length === 0 ? (
          <div className="h-64 rounded-xl border border-white/10 bg-white/5 glass flex items-center justify-center text-muted-foreground text-sm">
            {t("noFeaturedItems", "No tools available.")}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {toolsList.map((tool, index) => (
              <motion.article
                key={tool._id}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={index * 0.08}
                className="group p-6 aurora-card flex flex-col relative"
              >
                <div className="relative z-10 flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    {tool._id === "open-peeps" || tool.link?.includes("open-peeps") ? (
                      <div
                        className="flex-shrink-0 h-12 w-12 rounded-xl bg-white p-1 border border-white/20 flex items-center justify-center overflow-hidden shadow-md group-hover:scale-110 transition-transform"
                        dangerouslySetInnerHTML={{
                          __html: buildPeepSvg(PREMADE_PEEPS[1]?.config || {
                            mode: "bust",
                            headExpression: "pattern_sweater_smirk",
                            hairStyle: "straight_bob",
                            accessory: "none",
                            bodyPose: "patterned_sweater",
                            skinColor: "#ffffff",
                            hairColor: "#111111",
                            clothingColor: "#111111",
                            backgroundColor: "#ffffff",
                            inkStyle: "bw",
                            flipHorizontal: false,
                            scale: 1,
                          }, 48),
                        }}
                      />
                    ) : tool.icon ? (
                      <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-background border border-white/5 flex items-center justify-center text-2xl overflow-hidden">
                        {typeof tool.icon === "string" ? (
                          tool.icon
                        ) : tool.icon?.asset ? (
                          <img
                            src={urlFor(tool.icon).width(64).height(64).url()}
                            alt=""
                            className="w-7 h-7 object-contain"
                          />
                        ) : (
                          "🧑‍🎨"
                        )}
                      </div>
                    ) : null}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {tool.name}
                      </h3>
                      {tool.category && (
                        <span className="text-[10px] font-bold tracking-wider text-primary mono uppercase mt-1 block">
                          {tool.category}
                        </span>
                      )}
                    </div>
                  </div>
                  {tool.description && (
                    <p className="text-xs leading-relaxed text-muted-foreground/80 mb-4 flex-1 line-clamp-3 font-medium">
                      {tool.description}
                    </p>
                  )}
                </div>
                {tool.link && (
                  <div className="relative z-10 border-t border-white/10 pt-4 mt-2">
                    <a
                      href={tool.link.startsWith("/") ? getLocalizedPath(tool.link) : tool.link}
                      target={tool.link.startsWith("/") ? "_self" : "_blank"}
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold tracking-[.14em] text-primary mono uppercase hover:text-white transition-colors duration-300"
                    >
                      <span>{t("visit", "VIEW TOOL")}</span>
                      <ArrowUpRight size={12} />
                    </a>
                  </div>
                )}
              </motion.article>
            ))}
          </div>
        )}

        <div className="mt-16 flex justify-center md:hidden">
          <Link
            to={getLocalizedPath("/tools")}
            className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-xs font-bold tracking-[.14em] text-foreground transition-all duration-300 hover:bg-white/10 hover:border-white/20 mono"
          >
            {t("viewAllUtilities", "VIEW ALL IN-BROWSER UTILITIES")}
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
