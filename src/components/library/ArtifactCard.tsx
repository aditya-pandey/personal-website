"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArchiveItem } from "@/lib/library-data";

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

/**
 * Media-specific conceptual card for the Library archive.
 * Each media type gets a distinct visual treatment — no real images,
 * just typography, color, and atmosphere.
 */
export function ArtifactCard({ item }: { item: ArchiveItem }) {
  const [showNote, setShowNote] = useState(false);

  const cardContent = (
    <motion.div
      className="artifact-card relative flex-shrink-0 cursor-pointer select-none group"
      whileHover={{ y: -4, rotateX: 1, rotateY: -1 }}
      transition={{ duration: 0.3, ease: EASE }}
      onClick={() => setShowNote(!showNote)}
      style={{ transformStyle: "preserve-3d" }}
    >
      <CardVisual item={item} />

      {/* "Why it stayed" note overlay */}
      <AnimatePresence>
        {showNote && item.note && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="absolute inset-0 bg-canvas/95 dark:bg-canvas/95 backdrop-blur-sm flex flex-col justify-end p-5 rounded-lg z-10"
          >
            <p className="font-sans text-[10px] uppercase tracking-widest font-bold text-accent mb-2 select-none">
              Why it stayed
            </p>
            <p className="font-serif italic text-sm text-ink/80 leading-relaxed">
              {item.note}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  if (item.link) {
    // Wrap in link but allow click-to-reveal note
    return (
      <div className="artifact-perspective">
        {cardContent}
      </div>
    );
  }

  return (
    <div className="artifact-perspective">
      {cardContent}
    </div>
  );
}

/** 
 * Renders the media-specific visual treatment for a card.
 */
function CardVisual({ item }: { item: ArchiveItem }) {
  switch (item.type) {
    case "book":
      return <BookCard item={item} />;
    case "film":
      return <FilmCard item={item} />;
    case "music":
      return <MusicCard item={item} />;
    case "essay":
      return <EssayCard item={item} />;
    default:
      return <BookCard item={item} />;
  }
}

/**
 * Book: Warm paper object with left-edge spine accent.
 * Portrait aspect ratio (3:4), serif title, sans author.
 */
function BookCard({ item }: { item: ArchiveItem }) {
  return (
    <div className="relative w-[200px] md:w-[220px] rounded-lg overflow-hidden transition-shadow duration-300 group-hover:shadow-lg group-hover:shadow-stone/20 dark:group-hover:shadow-black/20">
      {/* Spine accent */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-accent/60 z-[2]" />
      
      {/* Card body */}
      <div 
        className="relative flex flex-col justify-end p-5 bg-surface"
        style={{ aspectRatio: "3/4" }}
      >
        {/* Paper texture noise overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none z-[1]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Year — top right */}
        {item.year && (
          <span className="absolute top-4 right-4 font-sans text-[10px] tracking-wider text-ink/25 font-semibold select-none z-[2]">
            {item.year}
          </span>
        )}

        {/* Content */}
        <div className="relative z-[2] flex flex-col gap-1.5">
          <h3 className="font-serif text-base md:text-lg font-semibold text-ink leading-snug">
            {item.title}
          </h3>
          <p className="font-sans text-[11px] uppercase tracking-widest text-ink/45 font-semibold">
            {item.creator}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Film: Cinematic dark gradient, 16:9 ratio, atmospheric grain.
 * Director credit with "Dir." prefix.
 */
function FilmCard({ item }: { item: ArchiveItem }) {
  return (
    <div className="relative w-[280px] md:w-[300px] rounded-lg overflow-hidden transition-shadow duration-300 group-hover:shadow-lg group-hover:shadow-stone/20 dark:group-hover:shadow-black/20">
      <div 
        className="relative flex flex-col justify-end p-5"
        style={{ 
          aspectRatio: "16/10",
          background: "linear-gradient(145deg, #1a1a1a 0%, #2a2520 40%, #1e1e1e 100%)",
        }}
      >
        {/* Film grain overlay */}
        <div 
          className="absolute inset-0 opacity-[0.06] pointer-events-none z-[1]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Subtle warm gradient wash */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-[1]" />

        {/* Year — top right */}
        {item.year && (
          <span className="absolute top-4 right-4 font-sans text-[10px] tracking-wider text-white/25 font-semibold select-none z-[2]">
            {item.year}
          </span>
        )}

        {/* Content */}
        <div className="relative z-[2] flex flex-col gap-1.5">
          <h3 className="font-serif text-base md:text-lg font-semibold text-white/90 leading-snug">
            {item.title}
          </h3>
          <p className="font-sans text-[11px] uppercase tracking-widest text-white/40 font-semibold">
            Dir. {item.creator}{item.year ? ` · ${item.year}` : ""}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Music: Square with circular inner element (vinyl-inspired),
 * ambient radial gradient, centered typography.
 */
function MusicCard({ item }: { item: ArchiveItem }) {
  return (
    <div className="relative w-[200px] md:w-[220px] rounded-lg overflow-hidden transition-shadow duration-300 group-hover:shadow-lg group-hover:shadow-stone/20 dark:group-hover:shadow-black/20">
      <div 
        className="relative flex flex-col items-center justify-center p-5 bg-surface"
        style={{ aspectRatio: "1/1" }}
      >
        {/* Ambient radial gradient */}
        <div 
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            background: "radial-gradient(circle at 50% 50%, var(--theme-accent) 0%, transparent 70%)",
            opacity: 0.06,
          }}
        />

        {/* Vinyl circle */}
        <div className="relative z-[2] w-[60%] aspect-square rounded-full border border-stone/30 flex items-center justify-center mb-4">
          <div className="w-[30%] aspect-square rounded-full bg-accent/20 border border-accent/30" />
        </div>

        {/* Content — centered */}
        <div className="relative z-[2] flex flex-col items-center gap-1 text-center">
          <h3 className="font-serif text-sm md:text-base font-semibold text-ink leading-snug">
            {item.title}
          </h3>
          <p className="font-sans text-[10px] uppercase tracking-widest text-ink/40 font-semibold">
            {item.creator}
          </p>
        </div>

        {/* Year — bottom right */}
        {item.year && (
          <span className="absolute bottom-3 right-4 font-sans text-[10px] tracking-wider text-ink/20 font-semibold select-none z-[2]">
            {item.year}
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * Essay: Archival document aesthetic — dashed top border,
 * monospaced metadata, clean serif title.
 */
function EssayCard({ item }: { item: ArchiveItem }) {
  return (
    <div className="relative w-[220px] md:w-[240px] rounded-lg overflow-hidden transition-shadow duration-300 group-hover:shadow-lg group-hover:shadow-stone/20 dark:group-hover:shadow-black/20">
      <div 
        className="relative flex flex-col justify-between p-5 bg-surface"
        style={{ aspectRatio: "4/3" }}
      >
        {/* Dashed top border */}
        <div className="absolute top-0 left-5 right-5 h-px border-t border-dashed border-ink/15" />

        {/* Paper texture */}
        <div 
          className="absolute inset-0 opacity-[0.02] pointer-events-none z-[1]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Type label — top */}
        <div className="relative z-[2]">
          <span className="font-mono text-[9px] uppercase tracking-widest text-ink/30 font-medium select-none">
            Essay · {item.year || ""}
          </span>
        </div>

        {/* Content — bottom */}
        <div className="relative z-[2] flex flex-col gap-1.5 mt-auto">
          <h3 className="font-serif text-sm md:text-base font-semibold text-ink leading-snug">
            {item.title}
          </h3>
          <p className="font-sans text-[11px] uppercase tracking-widest text-ink/45 font-semibold">
            {item.creator}
          </p>
        </div>
      </div>
    </div>
  );
}
