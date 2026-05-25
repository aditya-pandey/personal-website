"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

// Standard easing curve inspired by Apple's smooth spring-like bezier
const EASE = [0.21, 0.47, 0.32, 0.98] as const;

interface MotionProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: React.ElementType;
}

export function FadeIn({ children, delay = 0, className = "" }: MotionProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.8, delay: shouldReduceMotion ? 0 : delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({ children, className = "", delayChildren = 0.1, staggerChildren = 0.1 }: MotionProps & { delayChildren?: number, staggerChildren?: number }) {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : staggerChildren,
        delayChildren: shouldReduceMotion ? 0 : delayChildren,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = "" }: MotionProps) {
  const shouldReduceMotion = useReducedMotion();

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: shouldReduceMotion ? 0 : 0.8, ease: EASE } },
  };

  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}

export function HoverCard({ children, className = "" }: MotionProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      whileHover={shouldReduceMotion ? {} : { y: -4, scale: 1.01 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function TextReveal({ text, delay = 0, className = "" }: { text: string, delay?: number, className?: string }) {
  const shouldReduceMotion = useReducedMotion();
  const words = text.split(" ");

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: shouldReduceMotion ? 0 : 0.08, delayChildren: shouldReduceMotion ? 0 : delay },
    },
  };

  const wordVariant = {
    hidden: { opacity: 0, y: 10, filter: "blur(4px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: shouldReduceMotion ? 0 : 0.8, ease: EASE } },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-10px" }}
      className={`flex flex-wrap gap-x-[0.25em] ${className}`}
    >
      {words.map((word, i) => (
        <motion.span key={i} variants={wordVariant} className="inline-block">
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
}

export function ParallaxImage({ children, className = "" }: MotionProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: shouldReduceMotion ? 0 : 1.2, ease: EASE }}
      className={className}
    >
      {/* Subtle continuous float effect */}
      <motion.div
        animate={shouldReduceMotion ? {} : { y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
