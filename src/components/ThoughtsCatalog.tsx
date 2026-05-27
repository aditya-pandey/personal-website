"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MDXDocument, BaseMetadata } from "@/lib/content";

const PRIMARY_CATEGORIES = ["Technology", "Systems"];
const SECONDARY_CATEGORIES = [
  "Human Behavior",
  "Internet Culture",
  "Philosophy",
  "Literature",
  "Observations"
];

// Combine all for full-text tags validation
interface ThoughtsCatalogProps {
  initialThoughts: MDXDocument<BaseMetadata>[];
}

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

function getReadingTime(content: string): string {
  const words = content.trim().split(/\s+/).length;
  const wpm = 200; // Average reading speed for prose
  const minutes = Math.ceil(words / wpm);
  return `${minutes} min read`;
}

export function ThoughtsCatalog({ initialThoughts }: ThoughtsCatalogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"latest" | "oldest">("latest");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Close dropdown on click outside
  useEffect(() => {
    if (!isDropdownOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".category-dropdown-container")) {
        setIsDropdownOpen(false);
      }
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, [isDropdownOpen]);

  // Client-side filtering & sorting
  const filteredThoughts = useMemo(() => {
    let result = [...initialThoughts];

    // 1. Text Search Filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((thought) => {
        const titleMatch = thought.metadata.title.toLowerCase().includes(query);
        const excerptMatch = thought.metadata.excerpt?.toLowerCase().includes(query) || false;
        const tagsMatch = thought.metadata.tags?.some(tag => tag.toLowerCase().includes(query)) || false;
        const contentMatch = thought.content.toLowerCase().includes(query);
        return titleMatch || excerptMatch || tagsMatch || contentMatch;
      });
    }

    // 2. Category/Tag Filter
    if (selectedCategory) {
      const catLower = selectedCategory.toLowerCase();
      result = result.filter((thought) => {
        return thought.metadata.tags?.some(tag => tag.toLowerCase() === catLower) || false;
      });
    }

    // 3. Sorting
    result.sort((a, b) => {
      const dateA = new Date(a.metadata.date || "").getTime();
      const dateB = new Date(b.metadata.date || "").getTime();
      return sortBy === "latest" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [initialThoughts, searchQuery, selectedCategory, sortBy]);

  const isSecondaryActive = useMemo(() => {
    return selectedCategory !== null && SECONDARY_CATEGORIES.includes(selectedCategory);
  }, [selectedCategory]);

  const dropdownLabel = useMemo(() => {
    return isSecondaryActive ? `${selectedCategory} ↓` : "More ↓";
  }, [selectedCategory, isSecondaryActive]);

  return (
    <div className="w-full flex flex-col">
      {/* Search Input Bar */}
      <div className="relative mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search thoughts..."
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

      {/* Filter and Sort Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone/20 pb-4 text-xs font-sans uppercase tracking-widest text-ink/40 font-semibold mb-12 select-none">
        {/* Categories */}
        <div className="flex flex-wrap gap-x-2 gap-y-1.5 items-center">
          <span>Filter:</span>
          
          <button
            onClick={() => {
              setSelectedCategory(null);
              setIsDropdownOpen(false);
            }}
            className={`hover:text-accent transition-colors cursor-pointer ${
              selectedCategory === null ? "text-accent font-bold" : "text-ink/40"
            }`}
          >
            All
          </button>
          
          {PRIMARY_CATEGORIES.map((cat) => (
            <span key={cat} className="flex gap-2 items-center">
              <span className="text-stone/40 font-normal">&middot;</span>
              <button
                onClick={() => {
                  setSelectedCategory(cat);
                  setIsDropdownOpen(false);
                }}
                className={`hover:text-accent transition-colors cursor-pointer ${
                  selectedCategory === cat ? "text-accent font-bold" : "text-ink/40"
                }`}
              >
                {cat}
              </button>
            </span>
          ))}

          {/* Secondary Categories Dropdown */}
          <span className="flex gap-2 items-center relative category-dropdown-container">
            <span className="text-stone/40 font-normal">&middot;</span>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`hover:text-accent transition-colors cursor-pointer flex items-center gap-1 ${
                isSecondaryActive ? "text-accent font-bold" : "text-ink/40"
              }`}
            >
              {dropdownLabel}
            </button>
            
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                  className="absolute left-0 mt-6 top-full w-48 bg-surface border border-stone/40 rounded shadow-lg z-50 py-1.5 flex flex-col items-start"
                >
                  {SECONDARY_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-ink/5 hover:text-accent transition-colors cursor-pointer text-[10px] uppercase tracking-widest font-semibold ${
                        selectedCategory === cat ? "text-accent font-bold" : "text-ink/60"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </span>
        </div>

        {/* Sorting */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span>Sort:</span>
          <button
            onClick={() => setSortBy(sortBy === "latest" ? "oldest" : "latest")}
            className="text-ink/60 hover:text-accent transition-colors font-bold cursor-pointer"
          >
            {sortBy === "latest" ? "Latest ↓" : "Oldest ↑"}
          </button>
        </div>
      </div>

      {/* Thoughts List Container */}
      <div className="min-h-[200px] relative">
        <AnimatePresence mode="popLayout">
          {filteredThoughts.length > 0 ? (
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="flex flex-col gap-12"
            >
              {filteredThoughts.map((thought) => (
                <motion.article
                  key={thought.slug}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="group"
                >
                  <Link
                    href={`/thoughts/${thought.slug}`}
                    className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-12"
                  >
                    <div className="font-sans text-[11px] uppercase tracking-widest text-ink/40 font-semibold min-w-[140px] select-none">
                      <span>{new Date(thought.metadata.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
                      <span className="mx-1.5 text-stone/40">&middot;</span>
                      <span>{getReadingTime(thought.content)}</span>
                    </div>
                    <div className="flex-grow">
                      <h2 className="font-serif text-2xl md:text-3xl mb-2 group-hover:text-accent transition-colors">
                        {thought.metadata.title}
                      </h2>
                      {thought.metadata.excerpt && (
                        <p className="font-serif text-[17px] text-ink/70 leading-[1.6] max-w-[65ch]">
                          {thought.metadata.excerpt}
                        </p>
                      )}
                    </div>
                  </Link>
                </motion.article>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="text-center py-16"
            >
              <p className="font-serif italic text-lg text-ink/50">
                No matching fragments found.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory(null);
                }}
                className="mt-4 font-sans text-xs uppercase tracking-widest font-semibold text-accent hover:underline cursor-pointer"
              >
                Reset Filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
