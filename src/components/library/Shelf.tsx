"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ArchiveItem } from "@/lib/library-data";
import { ArtifactCard } from "./ArtifactCard";

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

interface ShelfProps {
  id: string;
  title: string;
  description: string;
  items: ArchiveItem[];
  href?: string;
  maxItems?: number;
}

/**
 * A single horizontal-scrolling shelf of artifact cards.
 * Supports mouse drag-to-scroll, native touch swipe, and chevron-click scrolling.
 * Shows up to maxItems in preview mode, with an "Explore shelf" CTA card at the end.
 */
export function Shelf({ id, title, description, items, href, maxItems }: ShelfProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPointerDown, setIsPointerDown] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const visibleItems = maxItems ? items.slice(0, maxItems) : (expanded ? items : items.slice(0, 8));

  // Check scroll position for subtle edge indicators
  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    const observer = new ResizeObserver(checkScroll);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      observer.disconnect();
    };
  }, [checkScroll, visibleItems.length]);

  // Click-to-scroll helper
  const handleScrollClick = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.75;
    el.scrollTo({
      left: el.scrollLeft + (direction === "left" ? -scrollAmount : scrollAmount),
      behavior: "smooth",
    });
  };

  // Mouse drag handlers that differentiate drag from click
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    
    setIsPointerDown(true);
    setStartX(e.clientX);
    setScrollLeft(el.scrollLeft);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isPointerDown) return;
    const el = scrollRef.current;
    if (!el) return;

    const dx = e.clientX - startX;
    if (!isDragging && Math.abs(dx) > 8) {
      setIsDragging(true);
      el.setPointerCapture(e.pointerId);
    }

    if (isDragging) {
      e.preventDefault();
      el.scrollLeft = scrollLeft - dx * 1.2;
    }
  }, [isPointerDown, isDragging, startX, scrollLeft]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (isDragging) {
      scrollRef.current?.releasePointerCapture(e.pointerId);
      // Suppress next click event so we don't follow link / toggle card note
      const preventClick = (evt: MouseEvent) => {
        evt.preventDefault();
        evt.stopPropagation();
      };
      window.addEventListener("click", preventClick, { capture: true, once: true });
    }
    setIsPointerDown(false);
    setIsDragging(false);
  }, [isDragging]);

  if (items.length === 0) return null;

  // Determine aspect ratio class and specific CTA label based on content type
  const type = items[0]?.type || "book";
  let cardClasses = "";
  let innerStyle: React.CSSProperties = {};
  let ctaLabel = "Explore Shelf";

  if (type === "book") {
    cardClasses = "w-[130px] md:w-[140px]";
    innerStyle = { aspectRatio: "3/4" };
    ctaLabel = "Explore Literature";
  } else if (type === "film") {
    cardClasses = "w-[140px] md:w-[150px]";
    innerStyle = { aspectRatio: "16/10" };
    ctaLabel = "Explore Cinema";
  } else if (type === "music") {
    cardClasses = "w-[130px] md:w-[140px]";
    innerStyle = { aspectRatio: "1/1" };
    ctaLabel = "Explore Soundscapes";
  } else if (type === "essay") {
    cardClasses = "w-[140px] md:w-[150px]";
    innerStyle = { aspectRatio: "4/3" };
    ctaLabel = "Explore Essays";
  }

  return (
    <section className="flex flex-col gap-5 w-full min-w-0">
      {/* Shelf header */}
      <div className="flex items-baseline justify-between gap-4 select-none">
        <div className="flex flex-col gap-1">
          <h2 className="font-serif text-xl md:text-2xl font-semibold text-ink leading-snug">
            {title}
          </h2>
          <p className="font-serif italic text-sm text-ink/50 leading-relaxed">
            {description}
          </p>
        </div>
        {!href && !maxItems && items.length > 8 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="font-sans text-[10px] uppercase tracking-widest font-bold text-accent hover:text-accent/80 transition-colors cursor-pointer whitespace-nowrap"
          >
            {expanded ? "Collapse ↑" : `Open shelf (${items.length}) →`}
          </button>
        )}
      </div>

      {/* Scrollable shelf container */}
      <div className="relative group/shelf">
        {/* Left fade indicator */}
        <div 
          className={`absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-canvas via-canvas/70 to-transparent z-10 pointer-events-none transition-opacity duration-300 ${
            canScrollLeft ? "opacity-100" : "opacity-0"
          }`}
        />
        
        {/* Right fade indicator */}
        <div 
          className={`absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-canvas via-canvas/70 to-transparent z-10 pointer-events-none transition-opacity duration-300 ${
            canScrollRight ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Left scroll chevron */}
        <AnimatePresence>
          {canScrollLeft && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              onClick={() => handleScrollClick("left")}
              className="absolute left-3 top-[50%] -translate-y-[50%] z-20 w-9 h-9 rounded-full bg-canvas/80 dark:bg-canvas/80 backdrop-blur-md border border-stone/20 text-ink/70 hover:text-accent hover:border-accent/40 shadow-sm flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Right scroll chevron */}
        <AnimatePresence>
          {canScrollRight && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              onClick={() => handleScrollClick("right")}
              className="absolute right-3 top-[50%] -translate-y-[50%] z-20 w-9 h-9 rounded-full bg-canvas/80 dark:bg-canvas/80 backdrop-blur-md border border-stone/20 text-ink/70 hover:text-accent hover:border-accent/40 shadow-sm flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>

        <div
          ref={scrollRef}
          className={`flex gap-4 md:gap-5 overflow-x-auto hide-scrollbar shelf-scroll py-2 ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{ userSelect: isDragging ? "none" : "auto" }}
        >
          <AnimatePresence mode="popLayout">
            {visibleItems.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: Math.min(idx * 0.04, 0.3), ease: EASE }}
              >
                <ArtifactCard item={item} />
              </motion.div>
            ))}

            {href && (
              <motion.div
                key={`${id}-explore-cta`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: Math.min(visibleItems.length * 0.04, 0.3), ease: EASE }}
                className="artifact-perspective flex-shrink-0"
              >
                <Link href={href} className="block no-underline">
                  <motion.div
                    className={`artifact-card relative cursor-pointer select-none group/cta bg-surface/40 hover:bg-surface/75 border border-dashed border-ink/15 hover:border-accent/40 rounded-lg flex flex-col justify-center items-center transition-colors duration-300 ${cardClasses}`}
                    whileHover={{ y: -4, rotateX: 1, rotateY: -1 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <div 
                      className="relative w-full h-full flex flex-col justify-center items-center p-4 text-center z-[2]"
                      style={innerStyle}
                    >
                      {/* Paper texture noise overlay */}
                      <div 
                        className="absolute inset-0 opacity-[0.02] pointer-events-none z-[1]"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                        }}
                      />
                      <div className="relative z-[2] flex flex-col items-center gap-1.5 px-2">
                        <span className="font-serif italic text-[13px] md:text-sm text-ink/60 group-hover/cta:text-ink transition-colors duration-300 leading-snug">
                          {ctaLabel}
                        </span>
                        <span className="font-sans text-xs font-semibold text-accent group-hover/cta:translate-x-1.5 transition-transform duration-300">
                          →
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

