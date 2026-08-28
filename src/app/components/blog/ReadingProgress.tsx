import { motion, useScroll, useSpring } from "framer-motion";

/**
 * GPU-Accelerated Reading Progress Bar
 * Uses Framer Motion's useScroll and useSpring to animate scaleX on the compositor thread.
 * Eliminates scroll event listeners and layout reflows.
 */
export default function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div className="fixed left-0 top-0 z-[9999] h-1 w-full bg-transparent pointer-events-none" aria-hidden="true">
      <motion.div
        className="h-full bg-primary origin-left"
        style={{ scaleX }}
      />
    </div>
  );
}