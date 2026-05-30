"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArchiveItem,
  BOOK_SHELVES,
  CINEMA_SHELVES,
  MUSIC_SHELVES,
  ESSAY_SHELVES,
} from "@/lib/library-data";
import { Shelf } from "./Shelf";
import { FadeIn } from "@/components/ui/Motion";
import { BookOpen, Film, Music, FileText } from "lucide-react";

interface ArchivePageLayoutProps {
  title: string;
  subtitle: string;
  category: "books" | "cinema" | "music" | "essays";
  allItems: ArchiveItem[];
  backHref?: string;
  backLabel?: string;
}

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

function getIconComponent(type: "book" | "film" | "music" | "essay") {
  switch (type) {
    case "book":
      return BookOpen;
    case "film":
      return Film;
    case "music":
      return Music;
    case "essay":
      return FileText;
    default:
      return BookOpen;
  }
}

export function ArchivePageLayout({
  title,
  subtitle,
  category,
  allItems,
  backHref = "/library",
  backLabel = "Library",
}: ArchivePageLayoutProps) {
  // Resolve the shelf configurations on the client side
  const shelfConfigs = useMemo(() => {
    switch (category) {
      case "books":
        return BOOK_SHELVES;
      case "cinema":
        return CINEMA_SHELVES;
      case "music":
        return MUSIC_SHELVES;
      case "essays":
        return ESSAY_SHELVES;
      default:
        return [];
    }
  }, [category]);

  // Build dynamic shelves
  const shelves = useMemo(() => {
    return shelfConfigs.map((shelf) => ({
      ...shelf,
      items: allItems.filter(shelf.filter),
    }));
  }, [allItems, shelfConfigs]);

  // Search & filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Extract unique tags present in this archive, excluding the type tags
  const availableTags = useMemo(() => {
    const tagsSet = new Set<string>();
    allItems.forEach((item) => {
      item.tags.forEach((tag) => {
        const lower = tag.toLowerCase();
        if (
          !["book", "film", "music", "essay", "literature", "cinema"].includes(
            lower
          )
        ) {
          tagsSet.add(tag);
        }
      });
    });
    return Array.from(tagsSet).sort();
  }, [allItems]);

  const isSearchActive = useMemo(() => {
    return searchQuery.trim().length > 0 || selectedTag !== null;
  }, [searchQuery, selectedTag]);

  const filteredItems = useMemo(() => {
    let result = [...allItems];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((item) => {
        const titleMatch = item.title.toLowerCase().includes(query);
        const creatorMatch = item.creator.toLowerCase().includes(query);
        const noteMatch = item.note?.toLowerCase().includes(query) || false;
        const tagsMatch = item.tags.some((tag) =>
          tag.toLowerCase().includes(query)
        );
        const yearMatch = item.year?.includes(query) || false;
        return titleMatch || creatorMatch || noteMatch || tagsMatch || yearMatch;
      });
    }

    if (selectedTag) {
      const tagLower = selectedTag.toLowerCase();
      result = result.filter((item) =>
        item.tags.some((t) => t.toLowerCase() === tagLower)
      );
    }

    return result;
  }, [allItems, searchQuery, selectedTag]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedTag(null);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-12 md:py-20 flex flex-col gap-10 md:gap-14 min-w-0">
      {/* Breadcrumbs & Header */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 font-sans text-xs uppercase tracking-widest text-ink/40 select-none">
          <Link href="/library" className="hover:text-accent transition-colors">
            Library
          </Link>
          <span>/</span>
          <span className="text-ink/70 font-semibold">{title}</span>
        </div>
        <div className="flex flex-col gap-2 select-none">
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-ink leading-tight">
            {title}
          </h1>
          <p className="font-serif italic text-base md:text-lg text-ink/50 leading-relaxed">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-6 select-none border-b border-stone/20 pb-8">
        {/* Search input */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search within ${title.toLowerCase()}...`}
            className="w-full bg-transparent border-b border-stone/30 focus:border-ink/50 focus:outline-none py-2 text-base font-sans tracking-wide transition-colors duration-300 placeholder:italic placeholder:text-ink/30"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-ink/40 hover:text-accent font-sans text-xs uppercase tracking-widest font-semibold cursor-pointer transition-colors duration-200"
            >
              clear
            </button>
          )}
        </div>

        {/* Tag filter row */}
        {availableTags.length > 0 && (
          <div className="flex flex-wrap gap-x-2 gap-y-1.5 items-center text-xs font-sans uppercase tracking-widest text-ink/40 font-semibold">
            <span>Filter Tag:</span>
            <button
              onClick={() => setSelectedTag(null)}
              className={`hover:text-accent transition-colors cursor-pointer ${
                selectedTag === null ? "text-accent font-bold" : "text-ink/40"
              }`}
            >
              All
            </button>
            {availableTags.map((tag) => (
              <span key={tag} className="flex gap-2 items-center">
                <span className="text-stone/40 font-normal">&middot;</span>
                <button
                  onClick={() => setSelectedTag(tag)}
                  className={`hover:text-accent transition-colors cursor-pointer ${
                    selectedTag === tag ? "text-accent font-bold" : "text-ink/40"
                  }`}
                >
                  {tag}
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Main content area — shelves vs search results */}
      <div className="relative min-h-[300px]">
        <AnimatePresence mode="popLayout">
          {!isSearchActive ? (
            <motion.div
              key="shelves-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="flex flex-col gap-14 md:gap-18 w-full min-w-0"
            >
              {shelves.map((shelf, idx) => (
                <FadeIn key={shelf.id} delay={0.1 + idx * 0.08} className="w-full min-w-0">
                  <Shelf
                    id={shelf.id}
                    title={shelf.title}
                    description={shelf.description}
                    items={shelf.items}
                  />
                </FadeIn>
              ))}
            </motion.div>
          ) : (
            /* Search results — unified flat list */
            <motion.div
              key="search-results"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="flex flex-col gap-6"
            >
              {/* Results header */}
              <div className="flex justify-between items-baseline border-b border-stone/20 pb-4 select-none">
                <h2 className="font-serif italic text-base md:text-lg text-ink/70">
                  {filteredItems.length === 1
                    ? "1 item surfaced"
                    : `${filteredItems.length} items surfaced`}
                </h2>
                <button
                  onClick={resetFilters}
                  className="font-sans text-[10px] uppercase tracking-widest font-bold text-accent hover:underline cursor-pointer"
                >
                  Clear all
                </button>
              </div>

              {/* Results list */}
              {filteredItems.length > 0 ? (
                <div className="flex flex-col border-t border-stone/20">
                  {filteredItems.map((item) => {
                    const IconComponent = getIconComponent(item.type);
                    return (
                      <div
                        key={item.id}
                        className="group py-5 border-b border-stone/20 flex flex-col sm:flex-row sm:items-baseline sm:justify-between px-1 hover:bg-surface/10 transition-colors duration-300"
                      >
                        <div className="flex items-start gap-4">
                          <div className="mt-1">
                            <IconComponent className="w-3.5 h-3.5 text-ink/35 select-none" />
                          </div>
                          <div className="flex flex-col gap-1">
                            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                              {item.link ? (
                                <Link
                                  href={item.link}
                                  className="font-serif text-base text-ink group-hover:text-accent transition-colors duration-300 leading-snug"
                                >
                                  {item.title}
                                </Link>
                              ) : (
                                <span className="font-serif text-base text-ink leading-snug">
                                  {item.title}
                                </span>
                              )}
                            </div>
                            {item.note && (
                              <p className="font-serif italic text-xs md:text-sm text-ink/65 leading-relaxed pl-3 border-l border-stone/20 mt-1">
                                {item.note}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 font-sans text-xs uppercase tracking-widest text-ink/50 sm:text-right mt-2 sm:mt-0 select-none">
                          <span>
                            {item.type === "film"
                              ? `Dir. ${item.creator}`
                              : item.creator}
                          </span>
                          {item.year && (
                            <>
                              <span>&middot;</span>
                              <span className="text-[10px] text-ink/35 font-semibold">
                                {item.year}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="font-serif italic text-lg text-ink/50">
                    The archive stays quiet.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="mt-4 font-sans text-xs uppercase tracking-widest font-semibold text-accent hover:underline cursor-pointer"
                  >
                    Reset filters
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Back button */}
      <div className="mt-10 border-t border-stone/20 pt-8 flex select-none">
        <Link
          href={backHref}
          className="font-sans text-xs uppercase tracking-widest font-bold text-accent hover:text-accent/80 transition-colors flex items-center gap-1.5"
        >
          ← Back to {backLabel}
        </Link>
      </div>
    </div>
  );
}

