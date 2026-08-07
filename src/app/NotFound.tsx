import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import SEO from "./components/SEO";

export default function NotFound() {
  return (
    <main
      className="min-h-screen bg-background text-foreground grid place-items-center px-6 py-24"
      style={{ fontFamily: "'Geist', sans-serif" }}
    >
      <SEO
        title="Page Not Found — Ravan Mammadov"
        description="The requested page could not be found. Return to Ravan Mammadov's portfolio."
        noIndex
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-xl text-center"
      >
        <p className="eyebrow text-primary mb-4">404 ERROR</p>
        <h1 className="text-6xl md:text-8xl font-semibold tracking-tighter mb-6">
          Lost in motion.
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed mb-10">
          The page you are looking for doesn't exist, has been moved, or is temporarily unavailable.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-3 rounded-full border border-border bg-surface px-8 py-4 text-xs font-bold tracking-widest text-foreground hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all mono uppercase"
        >
          <ArrowLeft size={16} /> RETURN TO HOME
        </Link>
      </motion.div>
    </main>
  );
}
