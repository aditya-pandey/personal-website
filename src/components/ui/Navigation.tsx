"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Moon, Sun, Menu, X } from "lucide-react";

import { AnimatePresence, motion } from "framer-motion";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
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
    { href: "/about", label: "About" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-canvas/90 border-b border-stone/50 transition-colors duration-500">
      <div className="max-w-[1120px] mx-auto px-5 lg:px-8 h-16 flex items-center justify-between relative z-50">
        <Link href="/" onClick={closeMenu} className="font-serif italic text-xl tracking-tight hover:text-accent transition-colors duration-300 shrink-0">
          aditya
        </Link>
        
        <div className="flex items-center gap-4 md:gap-8">
          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-6 text-sm font-sans tracking-wide items-center">
            {links.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className={`hover:text-accent transition-colors duration-300 ${pathname?.startsWith(link.href) ? 'text-accent' : 'text-ink/80'}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

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

      {/* Mobile Menu Overlay - Apple Style */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden absolute top-16 left-0 w-full h-[calc(100dvh-64px)] bg-canvas/95 backdrop-blur-2xl z-40 overflow-y-auto"
          >
            <nav className="flex flex-col px-6 py-4">
              {links.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.4, delay: i * 0.05 + 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="border-b border-stone/30 last:border-0"
                >
                  <Link 
                    href={link.href} 
                    onClick={closeMenu}
                    className={`block py-6 font-serif text-3xl tracking-tight transition-colors duration-300 ${pathname?.startsWith(link.href) ? 'text-accent' : 'text-ink hover:text-accent'}`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
