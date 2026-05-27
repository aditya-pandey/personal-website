"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  BookOpen, 
  Film, 
  Music, 
  FileText, 
  Sparkles, 
  BookMarked,
  CornerDownLeft
} from "lucide-react";

interface SearchItem {
  id: string;
  title: string;
  excerpt: string;
  type: "thought" | "poetry" | "experiment" | "library";
  link: string;
  tags: string[];
  date?: string;
  creator?: string;
  libraryType?: "book" | "film" | "music" | "essay";
}

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

function getItemIcon(item: SearchItem) {
  if (item.type === "thought") return FileText;
  if (item.type === "poetry") return Sparkles;
  if (item.type === "experiment") return BookMarked;
  
  // Library type mappings
  if (item.libraryType === "book") return BookOpen;
  if (item.libraryType === "film") return Film;
  if (item.libraryType === "music") return Music;
  if (item.libraryType === "essay") return FileText;
  
  return BookOpen;
}

export function CommandMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState<SearchItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // 1. Fetch Search Index on Mount
  useEffect(() => {
    fetch("/api/search")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setItems(data);
        }
      })
      .catch((err) => console.error("Error loading search index:", err));
  }, []);

  // 2. Keyboard shortcut for Toggle (⌘K / Ctrl+K) and Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // 3. Focus input when menu opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      setSearchQuery("");
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // 4. Filtering logic
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) {
      // Return a set of default curated items or everything sorted
      return items.slice(0, 8);
    }
    
    const query = searchQuery.toLowerCase().trim();
    return items.filter((item) => {
      const titleMatch = item.title.toLowerCase().includes(query);
      const excerptMatch = item.excerpt.toLowerCase().includes(query);
      const tagsMatch = item.tags.some((tag) => tag.toLowerCase().includes(query));
      const creatorMatch = item.creator?.toLowerCase().includes(query) || false;
      return titleMatch || excerptMatch || tagsMatch || creatorMatch;
    });
  }, [items, searchQuery]);

  // 5. Reset selection on query change
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  // 6. Keyboard navigation (Arrows + Enter)
  useEffect(() => {
    if (!isOpen || filteredItems.length === 0) return;

    const handleNav = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        const selected = filteredItems[selectedIndex];
        if (selected) {
          triggerAction(selected);
        }
      }
    };

    window.addEventListener("keydown", handleNav);
    return () => window.removeEventListener("keydown", handleNav);
  }, [isOpen, filteredItems, selectedIndex]);

  // 7. Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.querySelector("[data-active='true']");
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIndex]);

  const triggerAction = (item: SearchItem) => {
    setIsOpen(false);
    
    if (item.link.startsWith("http")) {
      window.open(item.link, "_blank", "noopener,noreferrer");
    } else {
      router.push(item.link);
    }
  };

  return (
    <>
      {/* Floating search icon overlay in Navigation or bottom-right corner if needed.
          We will also render a search trigger inside the main desktop Navigation. */}
      
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4 select-none">
            {/* Backdrop Blur/Dimming */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-canvas/60 dark:bg-canvas/70 backdrop-blur-[6px]"
            />
            
            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -10 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="relative w-full max-w-xl bg-surface border border-stone/55 shadow-2xl rounded-lg overflow-hidden flex flex-col max-h-[70vh]"
            >
              {/* Search Header */}
              <div className="flex items-center gap-3 px-4 border-b border-stone/30 py-3 bg-canvas/30">
                <Search className="w-4 h-4 text-ink/40" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Type to search thoughts, poems, archives..."
                  className="flex-grow bg-transparent border-0 outline-none text-sm text-ink placeholder:italic placeholder:text-ink/30 font-sans"
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="font-sans text-[10px] uppercase tracking-widest font-bold text-ink/45 hover:text-accent border border-stone/40 px-2 py-1 rounded"
                >
                  esc
                </button>
              </div>

              {/* Search Results List */}
              <div 
                ref={listRef}
                className="flex-grow overflow-y-auto py-2 divide-y divide-stone/10 max-h-[50vh]"
              >
                {filteredItems.length > 0 ? (
                  filteredItems.map((item, idx) => {
                    const Icon = getItemIcon(item);
                    const isActive = idx === selectedIndex;
                    
                    return (
                      <div
                        key={`${item.type}-${item.id}`}
                        data-active={isActive}
                        onClick={() => triggerAction(item)}
                        className={`group px-4 py-3 flex items-center justify-between cursor-pointer transition-colors duration-200 ${
                          isActive 
                            ? "bg-ink/5 dark:bg-ink/10" 
                            : "hover:bg-ink/5 dark:hover:bg-ink/10"
                        }`}
                      >
                        <div className="flex items-start gap-3.5 max-w-[85%]">
                          <div className="mt-1">
                            <Icon className={`w-3.5 h-3.5 transition-colors ${
                              isActive ? "text-accent" : "text-ink/35 group-hover:text-accent"
                            }`} />
                          </div>
                          
                          <div className="flex flex-col gap-0.5">
                            <div className="flex items-baseline gap-2 flex-wrap">
                              <span className={`font-serif text-sm md:text-base leading-snug transition-colors duration-200 ${
                                isActive ? "text-accent font-semibold" : "text-ink"
                              }`}>
                                {item.title}
                              </span>
                              
                              <span className="font-sans text-[8px] uppercase tracking-wider text-ink/30 px-1 py-0.5 rounded border border-stone/20">
                                {item.type}
                              </span>
                            </div>
                            
                            {item.excerpt && (
                              <p className="font-serif italic text-xs text-ink/55 line-clamp-1">
                                {item.excerpt}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 font-sans text-[10px] uppercase tracking-widest text-ink/40">
                          {item.creator && (
                            <span className="max-w-[100px] truncate">{item.creator}</span>
                          )}
                          {isActive && (
                            <CornerDownLeft className="w-3 h-3 text-accent transition-transform animate-pulse" />
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12">
                    <p className="font-serif italic text-sm text-ink/40">
                      The archive stays quiet.
                    </p>
                  </div>
                )}
              </div>

              {/* Search Footer */}
              <div className="px-4 py-2 bg-canvas/30 border-t border-stone/30 flex items-center justify-between text-[9px] font-sans uppercase tracking-widest text-ink/40 font-semibold select-none">
                <div className="flex gap-4">
                  <span>&uarr;&darr; to navigate</span>
                  <span>&middot;</span>
                  <span>&crarr; to select</span>
                </div>
                <span>⌘K / CTRL+K to toggle</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
