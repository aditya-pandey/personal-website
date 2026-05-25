"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

// Standard easing curve inspired by Apple's smooth spring-like bezier
const EASE = [0.21, 0.47, 0.32, 0.98];

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
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
      whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.8, delay, ease: EASE }}
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
        delayChildren: delayChildren,
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
    hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 },
    show: shouldReduceMotion 
      ? { opacity: 1, transition: { duration: 0.8, ease: EASE } }
      : { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
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
      transition: { staggerChildren: shouldReduceMotion ? 0 : 0.08, delayChildren: delay },
    },
  };

  const wordVariant = {
    hidden: shouldReduceMotion 
      ? { opacity: 0 } 
      : { opacity: 0, y: 10, filter: "blur(4px)" },
    show: shouldReduceMotion 
      ? { opacity: 1, transition: { duration: 0.8, ease: EASE } }
      : { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: EASE } },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show" // Animate on mount for hero text
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
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
      animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: EASE }}
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
