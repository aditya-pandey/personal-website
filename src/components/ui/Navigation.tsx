"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

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
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-canvas/90 border-b border-stone/50">
      <div className="max-w-[1120px] mx-auto px-5 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" onClick={closeMenu} className="font-serif italic text-xl tracking-tight hover:text-accent transition-colors duration-300 shrink-0">
          aditya
        </Link>
        
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

        {/* Mobile Hamburger Button */}
        <button 
          className="md:hidden p-2 -mr-2 text-ink/80 hover:text-accent transition-colors focus:outline-none" 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-canvas border-b border-stone/50 shadow-xl">
          <nav className="flex flex-col px-5 py-8 gap-6 font-sans text-lg tracking-wide">
            {links.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                onClick={closeMenu}
                className={`hover:text-accent transition-colors duration-300 ${pathname?.startsWith(link.href) ? 'text-accent' : 'text-ink/80'}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
