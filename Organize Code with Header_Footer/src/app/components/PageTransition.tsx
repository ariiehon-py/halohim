import { motion } from "motion/react";
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
  delay?: number;
}

export function PageTransition({ children, delay = 0 }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.43, 0.13, 0.23, 0.96],
      }}
    >
      {children}
    </motion.div>
  );
}

export function FadeInUp({ children, delay = 0 }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.43, 0.13, 0.23, 0.96],
      }}
    >
      {children}
    </motion.div>
  );
}
