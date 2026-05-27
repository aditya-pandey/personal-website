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

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
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
        <div
          className={`absolute ${
            align === "top" ? "bottom-full mb-3" : "top-full mt-3"
          } right-0 z-50 min-w-[170px] bg-canvas/95 dark:bg-surface/95 border border-stone/30 shadow-lg rounded p-1.5 flex flex-col select-none animate-float-up`}
        >
          {/* Copy Link */}
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-2 px-2.5 py-2 text-left font-sans text-xs uppercase tracking-wider text-ink/80 hover:text-accent hover:bg-surface/50 dark:hover:bg-canvas/50 rounded transition-colors duration-200"
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>Copy Link</span>
          </button>

          {/* WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 px-2.5 py-2 text-left font-sans text-xs uppercase tracking-wider text-ink/80 hover:text-accent hover:bg-surface/50 dark:hover:bg-canvas/50 rounded transition-colors duration-200"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>

          {/* Twitter / X */}
          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 px-2.5 py-2 text-left font-sans text-xs uppercase tracking-wider text-ink/80 hover:text-accent hover:bg-surface/50 dark:hover:bg-canvas/50 rounded transition-colors duration-200"
          >
            <XIcon className="w-3.5 h-3.5" />
            <span>Twitter / X</span>
          </a>

          {/* Email */}
          <a
            href={emailUrl}
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 px-2.5 py-2 text-left font-sans text-xs uppercase tracking-wider text-ink/80 hover:text-accent hover:bg-surface/50 dark:hover:bg-canvas/50 rounded transition-colors duration-200"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email</span>
          </a>

          {/* Native Share (if supported) */}
          {hasNativeShare && (
            <>
              <div className="h-[1px] bg-stone/20 my-1" />
              <button
                onClick={triggerNativeShare}
                className="flex items-center gap-2 px-2.5 py-2 text-left font-sans text-xs uppercase tracking-wider text-ink/80 hover:text-accent hover:bg-surface/50 dark:hover:bg-canvas/50 rounded transition-colors duration-200"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>More Options...</span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

