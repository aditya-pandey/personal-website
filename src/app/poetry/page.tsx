import Link from "next/link";
import Image from "next/image";
import { getPoetry } from "@/lib/content";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/Motion";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Poetry | Aditya Pandey",
  description: "An archive of poetry and emotional writing.",
};

function getReadingTime(content: string): string {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  // Slower poetry reading pace: ~80 words per minute.
  // This translates to ~0.75 seconds per word.
  const totalSeconds = Math.max(30, Math.round(words * 0.75));
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")} READ`;
}

export default function Poetry() {
  const poetry = getPoetry();

  return (
    <div className="w-full min-h-[calc(100vh-64px)] flex flex-col lg:flex-row">
      {/* Left Pane - Book Promo (Sticky on Desktop) */}
      <div className="w-full lg:w-[40%] xl:w-[35%] bg-surface border-b lg:border-b-0 lg:border-r border-stone/30 lg:sticky lg:top-16 lg:h-[calc(100vh-64px)] flex flex-col justify-between p-6 sm:p-10 lg:p-14 xl:p-16 overflow-y-auto">
        <FadeIn className="flex flex-col h-full justify-between gap-12">
          {/* Framed Image */}
          <div className="aspect-square w-full bg-ink/5 dark:bg-ink/10 flex items-center justify-center p-8 relative rounded-md border border-stone/20 overflow-hidden shadow-inner group">
            <div className="w-full h-full relative flex items-center justify-center">
              <Image 
                src="/book_cover.png" 
                alt="निर्वाण से पहले Book Cover"
                width={200}
                height={300}
                className="h-full w-auto object-contain shadow-2xl transition-transform duration-700 ease-out group-hover:scale-[1.03] select-none"
                priority
              />
            </div>
          </div>

          {/* Book Information */}
          <div>
            <h2 className="font-serif italic text-3xl md:text-4xl text-ink leading-tight mb-2">
              निर्वाण से पहले
            </h2>
            <p className="font-sans text-xs uppercase tracking-widest text-ink/50 mb-6 font-medium">
              Selected Poems (2020—2026)
            </p>
            <p className="font-sans text-ink/70 leading-[1.7] mb-8 text-sm md:text-base">
              A collection of Hindi poetry exploring love, loss, and the silent spaces between human connection. Available now.
            </p>
            <div className="flex flex-wrap gap-4 select-none">
              <a 
                href="https://www.amazon.in/dp/9369531718" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="px-5 py-2.5 bg-ink text-canvas font-sans text-xs uppercase tracking-widest font-semibold hover:bg-ink/90 transition-colors shadow-sm"
              >
                Buy on Amazon
              </a>
              <a 
                href="https://www.flipkart.com/9789369531714/p/itm23f74b4d5e557" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="px-5 py-2.5 bg-transparent border border-stone-400 dark:border-stone-600 text-ink font-sans text-xs uppercase tracking-widest font-semibold hover:bg-surface transition-colors"
              >
                Buy on Flipkart
              </a>
            </div>
          </div>
        </FadeIn>
      </div>

      {/* Right Pane - Poetry Index */}
      <div className="w-full lg:w-[60%] xl:w-[65%] bg-canvas flex flex-col p-6 sm:p-10 lg:p-14 xl:p-16">
        <FadeIn delay={0.1} className="w-full">
          <div className="flex justify-between items-center border-b border-stone/30 pb-4 mb-4 select-none">
            <span className="font-sans text-xs uppercase tracking-widest text-ink/50 font-semibold">
              POETRY INDEX / {String(poetry.length).padStart(3, "0")} ENTRIES
            </span>
          </div>
        </FadeIn>

        <StaggerContainer className="flex flex-col" delayChildren={0.2}>
          {poetry.map((poem, index) => {
            const readTime = getReadingTime(poem.content);
            const year = new Date(poem.metadata.date).getFullYear();
            
            return (
              <StaggerItem key={poem.slug}>
                <Link 
                  href={`/poetry/${poem.slug}`}
                  className="group grid grid-cols-[1.5rem_1fr_auto] sm:grid-cols-[1.5rem_1fr_6rem_auto] md:grid-cols-[2rem_1fr_4rem_6rem_2rem] items-center gap-4 py-6 border-b border-stone/30 hover:bg-surface/30 px-4 -mx-4 transition-all duration-300"
                >
                  {/* Number */}
                  <span className="font-sans text-xs text-ink/40 w-8 select-none font-medium">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  
                  {/* Title */}
                  <span className="font-serif text-lg md:text-xl text-ink group-hover:text-accent transition-colors duration-300 truncate pr-4">
                    {poem.metadata.title}
                  </span>

                  {/* Year */}
                  <span className="font-sans text-xs text-ink/50 w-12 text-center hidden md:inline font-medium">
                    {year}
                  </span>

                  {/* Reading Time */}
                  <span className="font-sans text-xs text-ink/50 tracking-wider w-24 text-right hidden sm:inline font-medium">
                    {readTime}
                  </span>

                  {/* Arrow */}
                  <div className="w-8 flex justify-end">
                    <ArrowRight className="w-4 h-4 text-ink/30 group-hover:text-ink group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </div>
  );
}

