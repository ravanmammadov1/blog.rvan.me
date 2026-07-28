import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { client, urlFor } from "../../../lib/sanityClient";
import { Eyebrow } from "../Eyebrow";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function ToolsSection() {
  const [toolsList, setToolsList] = useState<any[]>([]);

  useEffect(() => {
    // Fetch Tools (latest 4)
    client
      .fetch(`
        *[_type == "tools"] | order(category asc, name asc)[0...4]{
          _id,
          name,
          description,
          icon,
          link,
          category
        }
      `)
      .then((data) => {
        setToolsList(data || []);
      })
      .catch(console.error);
  }, []);

  return (
    <section id="tools" className="px-6 py-28 md:px-10 md:py-40 border-t border-border">
      <div className="mx-auto max-w-[1600px]">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-16 flex items-end justify-between border-b border-border pb-6"
        >
          <div>
            <Eyebrow className="text-muted-foreground">05 / Designer Toolkit</Eyebrow>
            <h2 className="mt-6 text-4xl font-semibold tracking-[-.05em] md:text-6xl">
              Tools of the trade.
            </h2>
          </div>
          <Link
            to="/tools"
            className="group hidden items-center gap-2 text-xs font-bold tracking-[.14em] text-muted-foreground transition-colors hover:text-primary mono md:flex"
          >
            VIEW ALL TOOLS
            <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        {toolsList.length === 0 ? (
          <div className="h-64 rounded-xl border border-border bg-surface flex items-center justify-center text-muted-foreground text-sm">
            No tools available.
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
                className="group rounded-2xl border border-border bg-surface p-6 transition-all duration-300 hover:border-primary/50 hover:bg-surface/80 flex flex-col"
              >
                <div className="flex items-center gap-4 mb-4">
                  {tool.icon && (
                    <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-background flex items-center justify-center text-2xl">
                      {tool.icon}
                    </div>
                  )}
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
                  <p className="text-xs leading-relaxed text-muted-foreground mb-4 flex-1 line-clamp-3">
                    {tool.description}
                  </p>
                )}
                {tool.link && (
                  <a
                    href={tool.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold tracking-[.14em] text-primary mono uppercase hover:underline"
                  >
                    <span>VIEW TOOL</span>
                    <ArrowUpRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                  </a>
                )}
              </motion.article>
            ))}
          </div>
        )}

        <div className="mt-16 flex justify-center md:hidden">
          <Link
            to="/tools"
            className="group inline-flex items-center gap-2 rounded-full border border-border bg-surface px-6 py-3 text-xs font-bold tracking-[.14em] text-foreground transition-colors hover:border-primary mono"
          >
            VIEW ALL TOOLS
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}