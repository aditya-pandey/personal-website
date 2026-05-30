"use client";

import { useState, useEffect, useRef } from "react";
import { Share2, Link2, MessageCircle, X as XIcon, Mail, ExternalLink } from "lucide-react";

interface ShareButtonProps {
  title: string;
  text?: string;
  url?: string;
  label?: string;
  className?: string;
  align?: "top" | "bottom";
}

export function ShareButton({
  title,
  text = "",
  url = "",
  label = "↗ Share",
  className = "",
  align = "bottom",
}: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentUrl = url || (typeof window !== "undefined" ? window.location.href : "");

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const trackShare = (method: string) => {
    if (typeof window !== "undefined" && window.gtag) {
      let contentType = "page";
      const path = window.location.pathname;
      if (path.startsWith("/thoughts/")) contentType = "thought";
      else if (path.startsWith("/poetry/")) contentType = "poetry";
      else if (path.startsWith("/experiments")) contentType = "experiment";
      else if (path.startsWith("/library")) contentType = "library";

      window.gtag("event", "share", {
        method: method,
        content_type: contentType,
        item_id: title,
        url: currentUrl,
      });
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      trackShare("copy_link");
      window.dispatchEvent(
        new CustomEvent("literary-toast", {
          detail: { message: "Link copied quietly." },
        })
      );
      setIsOpen(false);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const triggerNativeShare = async () => {
    if (navigator.share) {
      try {
        trackShare("native_share");
        await navigator.share({
          title,
          text: text || `Read this: ${title}`,
          url: currentUrl,
        });
        window.dispatchEvent(
          new CustomEvent("literary-toast", {
            detail: { message: "Shared softly." },
          })
        );
        setIsOpen(false);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Native share failed:", err);
        }
      }
    }
  };

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} — ${currentUrl}`)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(currentUrl)}`;
  const emailUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`I wanted to share this with you:\n\n${title}\n${currentUrl}`)}`;

  const hasNativeShare = typeof navigator !== "undefined" && !!navigator.share;

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`font-sans text-xs uppercase tracking-widest text-ink/40 hover:text-accent font-semibold transition-colors duration-300 flex items-center gap-1.5 focus:outline-none select-none ${className}`}
        aria-expanded={isOpen}
        aria-label={`Share options for ${title}`}
      >
        <Share2 className="w-3.5 h-3.5" />
        <span>{label}</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop on mobile to dismiss menu easily */}
          <div
            className="fixed inset-0 bg-ink/10 dark:bg-black/30 backdrop-blur-[1px] z-40 sm:hidden"
            onClick={() => setIsOpen(false)}
          />
          <div
            className={`
              fixed bottom-0 left-0 right-0 max-w-none w-full bg-canvas/98 dark:bg-surface/98 border-t border-stone/30 rounded-t-xl p-4 pb-8 flex flex-col gap-2 z-50 shadow-2xl
              sm:absolute sm:bottom-auto sm:left-auto sm:right-0 sm:top-auto sm:w-auto sm:min-w-[170px] sm:bg-canvas/95 sm:dark:bg-surface/95 sm:border sm:rounded sm:p-1.5 sm:gap-0 sm:shadow-lg
              ${align === "top" ? "sm:bottom-full sm:mb-3 sm:top-auto" : "sm:top-full sm:mt-3 sm:bottom-auto"}
              select-none animate-slide-up-sheet sm:animate-dropdown-fade
            `}
          >
            {/* Header for mobile bottom sheet */}
            <div className="flex items-center justify-between border-b border-stone/20 pb-2 mb-1 sm:hidden">
              <span className="font-sans text-[10px] uppercase tracking-widest text-ink/40 font-bold">Share Page</span>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-1 text-ink/40 hover:text-ink transition-colors"
                aria-label="Close share sheet"
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-3 sm:gap-2 px-3 py-3 sm:px-2.5 sm:py-2 text-left font-sans text-sm sm:text-xs uppercase tracking-wider text-ink/80 hover:text-accent hover:bg-surface/50 dark:hover:bg-canvas/50 rounded transition-colors duration-200"
            >
              <Link2 className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
              <span>Copy Link</span>
            </button>

            {/* WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                setIsOpen(false);
                trackShare("whatsapp");
              }}
              className="flex items-center gap-3 sm:gap-2 px-3 py-3 sm:px-2.5 sm:py-2 text-left font-sans text-sm sm:text-xs uppercase tracking-wider text-ink/80 hover:text-accent hover:bg-surface/50 dark:hover:bg-canvas/50 rounded transition-colors duration-200"
            >
              <MessageCircle className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
              <span>WhatsApp</span>
            </a>

            {/* Twitter / X */}
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                setIsOpen(false);
                trackShare("twitter");
              }}
              className="flex items-center gap-3 sm:gap-2 px-3 py-3 sm:px-2.5 sm:py-2 text-left font-sans text-sm sm:text-xs uppercase tracking-wider text-ink/80 hover:text-accent hover:bg-surface/50 dark:hover:bg-canvas/50 rounded transition-colors duration-200"
            >
              <XIcon className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
              <span>Twitter / X</span>
            </a>

            {/* Email */}
            <a
              href={emailUrl}
              onClick={() => {
                setIsOpen(false);
                trackShare("email");
              }}
              className="flex items-center gap-3 sm:gap-2 px-3 py-3 sm:px-2.5 sm:py-2 text-left font-sans text-sm sm:text-xs uppercase tracking-wider text-ink/80 hover:text-accent hover:bg-surface/50 dark:hover:bg-canvas/50 rounded transition-colors duration-200"
            >
              <Mail className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
              <span>Email</span>
            </a>

            {/* Native Share (if supported) */}
            {hasNativeShare && (
              <>
                <div className="h-[1px] bg-stone/20 my-1" />
                <button
                  onClick={triggerNativeShare}
                  className="flex items-center gap-3 sm:gap-2 px-3 py-3 sm:px-2.5 sm:py-2 text-left font-sans text-sm sm:text-xs uppercase tracking-wider text-ink/80 hover:text-accent hover:bg-surface/50 dark:hover:bg-canvas/50 rounded transition-colors duration-200"
                >
                  <ExternalLink className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                  <span>More Options...</span>
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

