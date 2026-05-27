"use client";

import { FadeIn } from "./ui/Motion";

interface WriteBackProps {
  title: string;
}

export function WriteBack({ title }: WriteBackProps) {
  const emailSubject = encodeURIComponent(`Regarding “${title}”`);
  const emailHref = `mailto:adityadpandey@gmail.com?subject=${emailSubject}`;
  const linkedinHref = "https://www.linkedin.com/in/adityapandey99/";

  return (
    <FadeIn delay={0.2} className="flex flex-col gap-4 border-t border-stone/20 pt-12 select-none">
      <p className="font-serif italic text-lg text-ink/75 leading-relaxed">
        If this piece stayed with you, feel free to write back.
      </p>
      <div className="flex gap-4 text-xs font-sans uppercase tracking-widest font-semibold text-ink/50">
        <a 
          href={emailHref}
          className="relative hover:text-accent transition-colors duration-300 after:absolute after:bottom-[-2px] after:left-0 after:right-0 after:h-[1px] after:bg-accent after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left after:duration-300"
        >
          Email
        </a>
        <span>&middot;</span>
        <a 
          href={linkedinHref}
          target="_blank"
          rel="noopener noreferrer"
          className="relative hover:text-accent transition-colors duration-300 after:absolute after:bottom-[-2px] after:left-0 after:right-0 after:h-[1px] after:bg-accent after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left after:duration-300"
        >
          LinkedIn
        </a>
      </div>
    </FadeIn>
  );
}
