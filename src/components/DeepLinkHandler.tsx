"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function DeepLinkHandler() {
  const pathname = usePathname();
  const [toast, setToast] = useState<string | null>(null);

  // 1. Listen for toast notifications
  useEffect(() => {
    const handleToast = (e: Event) => {
      const customEvent = e as CustomEvent<{ message: string }>;
      setToast(customEvent.detail?.message || "Action completed.");
    };

    window.addEventListener("literary-toast", handleToast);
    return () => {
      window.removeEventListener("literary-toast", handleToast);
    };
  }, []);

  // Auto-clear toast alert
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // 2. Deep linking, dynamic ID mapping, and scroll-to logic
  useEffect(() => {
    const processFragments = () => {
      // Find both thoughts (inside article) and poetry (inside .poetry-body)
      const container = document.querySelector("article, .poetry-body");
      if (!container) return;

      // Select target block elements inside the container
      const elements = container.querySelectorAll("p, blockquote");
      elements.forEach((el, idx) => {
        if (!el.id) {
          el.id = `fragment-${idx + 1}`;
        }
      });

      // Handle deep-linking scroll-to and highlight if hash exists
      const hash = window.location.hash;
      if (hash && hash.startsWith("#fragment-")) {
        const targetId = hash.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          // Add a short delay to let layout settle and fonts load
          setTimeout(() => {
            targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
            targetElement.classList.add("highlighted-fragment");
            
            // Clean up class after animation completes
            setTimeout(() => {
              targetElement.classList.remove("highlighted-fragment");
            }, 3500);
          }, 300);
        }
      }
    };

    // Run on initial mount or route navigation
    processFragments();

    // Listen for hashchange events (for intra-page deep-linking navigation)
    window.addEventListener("hashchange", processFragments);
    return () => {
      window.removeEventListener("hashchange", processFragments);
    };
  }, [pathname]);

  return (
    <>
      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-ink/95 dark:bg-canvas/95 text-canvas dark:text-ink px-5 py-2.5 rounded shadow-xl font-sans text-xs uppercase tracking-widest font-semibold border border-stone/30 pointer-events-none animate-float-up">
          {toast}
        </div>
      )}
    </>
  );
}
