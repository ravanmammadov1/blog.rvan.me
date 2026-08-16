import React from "react";
import { motion } from "framer-motion";
import { Quote, Sparkles, ExternalLink } from "lucide-react";
import { TestimonialItem } from "../../types/cms";
import { urlFor } from "../../lib/sanityClient";
import { Eyebrow } from "./Eyebrow";

interface TestimonialsSectionProps {
  testimonials: TestimonialItem[];
  title?: string;
  eyebrow?: string;
  subtitle?: string;
}

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: EASE },
  }),
};

export default function TestimonialsSection({
  testimonials,
  title = "What Leaders & Collaborators Say.",
  eyebrow = "CLIENT & PEER REVIEWS",
  subtitle = "Feedback from art directors, brand managers, and creative teams on motion direction, brand architecture, and campaign execution.",
}: TestimonialsSectionProps) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="px-6 py-20 md:px-10 md:py-28 relative z-10 border-t border-white/10 bg-white/[0.01]">
      <div className="mx-auto max-w-[1600px]">
        {/* Section Header */}
        <div className="mb-14 text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold tracking-widest text-primary mono uppercase flex items-center justify-center gap-1.5 mb-3">
            <Sparkles size={14} /> {eyebrow}
          </span>
          <h2 className="text-3xl font-bold tracking-tight md:text-5xl text-foreground">
            {title}
          </h2>
          <p className="mt-4 text-sm text-muted-foreground font-medium leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item, index) => {
            const photoUrl = item.photo ? urlFor(item.photo)?.width(160).height(160).url() : null;
            const initials = item.name
              ? item.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()
              : "RM";

            return (
              <motion.div
                key={item._id || index}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={index * 0.1}
                className="p-8 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl hover:border-primary/40 hover:bg-white/[0.04] transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                      <Quote size={16} />
                    </div>
                    {item.linkedURL && (
                      <a
                        href={item.linkedURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                        aria-label={`View profile for ${item.name}`}
                      >
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>

                  <p className="text-sm md:text-base text-muted-foreground/90 leading-relaxed font-medium mb-8 italic">
                    "{item.quote}"
                  </p>
                </div>

                <div className="flex items-center gap-3.5 pt-4 border-t border-white/10">
                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt={item.name}
                      width={44}
                      height={44}
                      className="h-11 w-11 rounded-full object-cover border border-white/20"
                    />
                  ) : (
                    <div className="h-11 w-11 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-xs font-bold text-primary mono">
                      {initials}
                    </div>
                  )}

                  <div>
                    <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs text-muted-foreground font-medium">
                      {item.role ? `${item.role} · ` : ""}{item.company || "Creative Partner"}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
