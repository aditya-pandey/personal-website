"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArchiveItem, staticArchiveItems, PREVIEW_SHELVES } from "@/lib/library-data";
import { FadeIn } from "./ui/Motion";
import { Shelf } from "./library/Shelf";
import { BookOpen, Film, Music, FileText } from "lucide-react";

interface LibraryCatalogProps {
  currentReading: any;
  dynamicItems: ArchiveItem[];
}

const MEDIA_TYPES = [
  { value: "book", label: "Books" },
  { value: "film", label: "Films" },
  { value: "music", label: "Music" },
  { value: "essay", label: "Essays" },
];

const TAGS = [
  "Literature",
  "Philosophy",
  "Cinema",
  "Technology",
  "Music",
  "Poetry",
  "Design",
];

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

export function LibraryCatalog({ currentReading, dynamicItems }: LibraryCatalogProps) {
  // Combine dynamic books with static archive items
  const allItems = useMemo(() => {
    const dynamicIds = new Set(dynamicItems.map((item) => item.id));
    const filteredStatic = staticArchiveItems.filter((item) => !dynamicIds.has(item.id));
    return [...dynamicItems, ...filteredStatic];
  }, [dynamicItems]);

  // Build shelf data from PREVIEW_SHELVES config
  const shelves = useMemo(() => {
    return PREVIEW_SHELVES.map((shelf) => ({
      ...shelf,
      items: allItems.filter(shelf.filter),
    }));
  }, [allItems]);

  // Search & filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const isSearchActive = useMemo(() => {
    return searchQuery.trim().length > 0 || selectedType !== null || selectedTag !== null;
  }, [searchQuery, selectedType, selectedTag]);

  const filteredItems = useMemo(() => {
    let result = [...allItems];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((item) => {
        const titleMatch = item.title.toLowerCase().includes(query);
        const creatorMatch = item.creator.toLowerCase().includes(query);
        const noteMatch = item.note?.toLowerCase().includes(query) || false;
        const tagsMatch = item.tags.some((tag) => tag.toLowerCase().includes(query));
        const yearMatch = item.year?.includes(query) || false;
        return titleMatch || creatorMatch || noteMatch || tagsMatch || yearMatch;
      });
    }

    if (selectedType) {
      result = result.filter((item) => item.type === selectedType);
    }

    if (selectedTag) {
      const tagLower = selectedTag.toLowerCase();
      result = result.filter((item) =>
        item.tags.some((t) => t.toLowerCase() === tagLower)
      );
    }

    return result;
  }, [allItems, searchQuery, selectedType, selectedTag]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedType(null);
    setSelectedTag(null);
  };

  return (
    <div className="w-full flex flex-col gap-12 md:gap-16">
      {/* Search and Filters — editorial, minimal */}
      <div className="flex flex-col gap-6 select-none border-b border-stone/20 pb-8">
        {/* Search input */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search the archive..."
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

        {/* Filter row */}
        <div className="flex flex-col gap-3 text-xs font-sans uppercase tracking-widest text-ink/40 font-semibold">
          {/* Media types */}
          <div className="flex flex-wrap gap-x-2 gap-y-1.5 items-center">
            <span>Type:</span>
            <button
              onClick={() => setSelectedType(null)}
              className={`hover:text-accent transition-colors cursor-pointer ${
                selectedType === null ? "text-accent font-bold" : "text-ink/40"
              }`}
            >
              All
            </button>
            {MEDIA_TYPES.map((type) => (
              <span key={type.value} className="flex gap-2 items-center">
                <span className="text-stone/40 font-normal">&middot;</span>
                <button
                  onClick={() => setSelectedType(type.value)}
                  className={`hover:text-accent transition-colors cursor-pointer ${
                    selectedType === type.value
                      ? "text-accent font-bold"
                      : "text-ink/40"
                  }`}
                >
                  {type.label}
                </button>
              </span>
            ))}
          </div>

          {/* Topic tags */}
          <div className="flex flex-wrap gap-x-2 gap-y-1.5 items-center">
            <span>Tag:</span>
            <button
              onClick={() => setSelectedTag(null)}
              className={`hover:text-accent transition-colors cursor-pointer ${
                selectedTag === null ? "text-accent font-bold" : "text-ink/40"
              }`}
            >
              All
            </button>
            {TAGS.map((tag) => (
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
        </div>
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
              className="flex flex-col gap-16 md:gap-20"
            >
              {/* Desk Status: Currently Reading & Last Watched */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
                {currentReading?.reading && (
                  <FadeIn delay={0.2} className="flex flex-col gap-3">
                    <h2 className="font-sans text-xs uppercase tracking-widest font-bold text-ink/40 select-none">
                      Currently Reading
                    </h2>
                    <div className="pl-4 border-l border-accent/25">
                      <h3 className="font-serif text-xl font-semibold text-ink leading-snug">
                        {currentReading.reading.title}
                      </h3>
                      <p className="font-sans text-xs uppercase tracking-widest text-ink/40 font-semibold mt-0.5 select-none">
                        {currentReading.reading.author}
                      </p>
                      {currentReading.reading.note && (
                        <p className="font-serif italic text-sm md:text-base text-ink/70 leading-relaxed mt-2 pl-3 border-l border-stone/20">
                          &ldquo;{currentReading.reading.note}&rdquo;
                        </p>
                      )}
                    </div>
                  </FadeIn>
                )}

                {currentReading?.watched && (
                  <FadeIn delay={0.3} className="flex flex-col gap-3">
                    <h2 className="font-sans text-xs uppercase tracking-widest font-bold text-ink/40 select-none">
                      Last Watched
                    </h2>
                    <div className="pl-4 border-l border-accent/25">
                      <h3 className="font-serif text-xl font-semibold text-ink leading-snug">
                        {currentReading.watched.title}
                      </h3>
                      <p className="font-sans text-xs uppercase tracking-widest text-ink/40 font-semibold mt-0.5 select-none">
                        Dir. {currentReading.watched.director} &middot;{" "}
                        {currentReading.watched.year}
                      </p>
                      {currentReading.watched.note && (
                        <p className="font-serif italic text-sm md:text-base text-ink/70 leading-relaxed mt-2 pl-3 border-l border-stone/20">
                          &ldquo;{currentReading.watched.note}&rdquo;
                        </p>
                      )}
                    </div>
                  </FadeIn>
                )}
              </section>

              {/* Thematic Shelves */}
              <div className="flex flex-col gap-14 md:gap-18 border-t border-stone/25 pt-12">
                {shelves.map((shelf, idx) => (
                  <FadeIn key={shelf.id} delay={0.1 + idx * 0.08}>
                    <Shelf
                      id={shelf.id}
                      title={shelf.title}
                      description={shelf.description}
                      items={shelf.items}
                      href={shelf.href}
                      maxItems={6}
                    />
                  </FadeIn>
                ))}
              </div>
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
                    ? "1 fragment surfaced from the archive"
                    : `${filteredItems.length} fragments surfaced from the archive`}
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
                              <span className="font-sans text-[9px] uppercase tracking-wider text-ink/40 font-semibold px-1.5 py-0.5 rounded border border-stone/20 select-none">
                                {item.type}
                              </span>
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
    </div>
  );
}
