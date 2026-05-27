"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Moon, Sun, Menu, X, Search } from "lucide-react";

import { AnimatePresence, motion } from "framer-motion";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-8 h-8" />; // Placeholder to avoid layout shift
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-full text-ink/60 hover:text-accent hover:bg-surface/50 transition-colors focus:outline-none"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const links = [
    { href: "/thoughts", label: "Thoughts" },
    { href: "/poetry", label: "Poetry" },
    { href: "/experiments", label: "Experiments" },
    { href: "/library", label: "Library" },
  ];

  const isPoetryReading = pathname?.startsWith("/poetry/") && pathname !== "/poetry";

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-500 ${
        isOpen
          ? "bg-transparent border-b border-transparent"
          : isPoetryReading 
            ? "bg-transparent border-b-0 opacity-40 hover:opacity-100 hover:backdrop-blur-md hover:bg-canvas/90" 
            : "backdrop-blur-md bg-canvas/90 border-b border-stone/50"
      }`}
    >
      <div className="max-w-[1120px] mx-auto px-5 lg:px-8 h-16 flex items-center justify-between relative z-50">
        <Link href="/" onClick={closeMenu} className="font-serif italic text-xl tracking-tight hover:text-accent transition-colors duration-300 shrink-0">
          aditya
        </Link>
        
        <div className="flex items-center gap-4 md:gap-8">
          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-8 text-sm font-sans tracking-wider items-center select-none">
            {links.map((link) => {
              const isActive = pathname?.startsWith(link.href);
              return (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  className={`relative py-1 transition-colors duration-300 ${
                    isActive ? "text-ink font-medium" : "text-ink/65 hover:text-ink"
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <motion.div 
                      layoutId="nav-active-underline"
                      className="absolute left-0 right-0 bottom-0 h-[1.5px] bg-accent"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <button
            onClick={() => {
              const event = new KeyboardEvent("keydown", {
                key: "k",
                metaKey: true,
                bubbles: true,
                cancelable: true
              });
              window.dispatchEvent(event);
            }}
            className="p-2 rounded-full text-ink/60 hover:text-accent hover:bg-surface/50 transition-colors focus:outline-none select-none cursor-pointer flex items-center justify-center gap-1.5"
            title="Search"
            aria-label="Open search command menu"
          >
            <Search className="w-4 h-4" />
            <span className="hidden lg:inline text-[10px] font-sans uppercase tracking-widest font-bold text-ink/40 leading-none">
              Search
            </span>
          </button>

          <ThemeToggle />

          {/* Mobile Hamburger Button */}
          <button 
            className="md:hidden p-2 -mr-2 text-ink/80 hover:text-accent transition-colors focus:outline-none" 
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay - Fullscreen Editorial */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden fixed inset-0 w-full h-screen bg-canvas/98 dark:bg-canvas/99 backdrop-blur-xl z-40 flex flex-col justify-between py-24 select-none"
          >
            {/* Centered links */}
            <nav className="flex flex-col items-center justify-center flex-grow gap-8">
              {links.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ duration: 0.6, delay: i * 0.06 + 0.15, ease: [0.23, 1, 0.32, 1] }}
                >
                  <Link 
                    href={link.href} 
                    onClick={closeMenu}
                    className={`font-serif text-3xl tracking-tight transition-all duration-300 hover:text-accent ${
                      pathname?.startsWith(link.href) ? "text-accent italic font-medium" : "text-ink"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Bottom Tagline */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, delay: links.length * 0.06 + 0.2, ease: [0.23, 1, 0.32, 1] }}
              className="text-center px-6"
            >
              <span className="font-serif italic text-sm tracking-wide text-ink/40 select-none block">
                “Writing, observing, building.”
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
