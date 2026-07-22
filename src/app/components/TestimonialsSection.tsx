import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Quote, ExternalLink } from "lucide-react";
import { fetchTestimonials } from "../../lib/sanityQueries";
import { urlFor } from "../../lib/sanityClient";
import { TestimonialItem } from "../../types/cms";

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay, ease: EASE },
  }),
};

// Fallback testimonials if CMS hasn't populated testimonials yet
const defaultTestimonials: TestimonialItem[] = [
  {
    _id: "1",
    name: "Alexey V.",
    role: "Creative Director",
    company: "Automotive Campaign Lead",
    quote:
      "Ravan brings a rare mix of motion craftsmanship and strategic clarity. The creative direction for our automotive launch exceeded every benchmark.",
  },
  {
    _id: "2",
    name: "Leyla M.",
    role: "Marketing Manager",
    company: "Digital Growth Studio",
    quote:
      "Every frame moves with intent. Working with Ravan elevated our brand identity into a cohesive, high-performing visual experience.",
  },
];

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);

  useEffect(() => {
    fetchTestimonials().then((data) => {
      if (data && data.length > 0) {
        setTestimonials(data);
      } else {
        setTestimonials(defaultTestimonials);
      }
    });
  }, []);

  return (
    <section className="bg-surface border-y border-border px-6 py-28 md:px-10 md:py-36">
      <div className="mx-auto max-w-[1600px]">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <p className="eyebrow text-primary mb-3">05 / TRUST & COLLABORATION</p>
            <h2 className="text-4xl font-semibold tracking-[-.05em] md:text-6xl max-w-2xl">
              What collaborators say.
            </h2>
          </div>
          <span className="text-xs font-medium text-muted-foreground mono">
            PROVEN CLIENT IMPACT
          </span>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2">
          {testimonials.map((item, index) => {
            const photoUrl = item.photo ? urlFor(item.photo)?.url() : null;

            return (
              <motion.article
                key={item._id}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={index * 0.1}
                className="group flex flex-col justify-between rounded-xl border border-border bg-background p-8 transition-all duration-300 hover:border-primary/50"
              >
                <div>
                  <Quote className="text-primary opacity-60 mb-6" size={32} />
                  <p className="text-lg md:text-xl leading-relaxed text-foreground font-medium">
                    "{item.quote}"
                  </p>
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-border/60 pt-6">
                  <div className="flex items-center gap-4">
                    {photoUrl ? (
                      <img
                        src={photoUrl}
                        alt={item.name}
                        className="h-12 w-12 rounded-full object-cover border border-border"
                      />
                    ) : (
                      <div className="grid h-12 w-12 place-items-center rounded-full border border-border bg-surface text-primary font-bold text-sm">
                        {item.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="text-sm font-semibold tracking-tight text-foreground">
                        {item.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {item.role} {item.company ? `· ${item.company}` : ""}
                      </p>
                    </div>
                  </div>

                  {item.linkedURL && (
                    <a
                      href={item.linkedURL}
                      target="_blank"
                      rel="noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                      aria-label={`${item.name} profile`}
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
