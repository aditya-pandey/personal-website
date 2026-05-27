import Link from "next/link";
import { getThoughts, getPoetry, getCurrentReading } from "@/lib/content";
import { FadeIn, TextReveal, StaggerContainer, StaggerItem } from "@/components/ui/Motion";

function getReadingTime(content: string): string {
  const words = content.trim().split(/\s+/).length;
  const wpm = 200; // Average reading speed for prose
  const minutes = Math.ceil(words / wpm);
  return `${minutes} min read`;
}

function getPoemDescription(poem: any): string {
  if (poem.metadata.excerpt && poem.metadata.excerpt !== "." && poem.metadata.excerpt.trim() !== "") {
    return poem.metadata.excerpt;
  }
  // Fallback: extract the first stanza and make it a single-line excerpt
  const firstStanza = poem.content.split(/\n\s*\n/).map((s: string) => s.trim()).filter(Boolean)[0] || "";
  return firstStanza.replace(/\n+/g, " ").trim();
}

export default function Home() {
  const thoughts = getThoughts().slice(0, 2); // Retrieve thoughts only, limited to 2 to fit desktop viewport
  const poem = getPoetry()[0];
  const currentReading = getCurrentReading();

  return (
    <div className="w-full min-h-[calc(100vh-64px)] poetry-reading-bg flex items-center py-12 md:py-20">
      <div className="w-full max-w-[1120px] mx-auto px-5 lg:px-8">
        <div className="flex flex-col gap-12 md:gap-16">
          
          {/* Level 1: Hero Section (Name and About + Portrait) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center">
            
            {/* Left: Text Info */}
            <div className="md:col-span-7 flex flex-col">
              <section className="flex flex-col gap-6 select-none">
                <div className="flex flex-col">
                  <TextReveal 
                    text="Aditya Pandey" 
                    className="font-serif text-4xl md:text-5xl lg:text-[50px] tracking-tight leading-[1.1] mb-4 text-ink font-semibold"
                  />
                  <FadeIn delay={0.4}>
                    <p className="font-serif italic text-xl md:text-2xl text-ink/80 leading-[1.5] max-w-[32ch] mb-4">
                      Writing, observing, building. 
                      Somewhere between technology and stories.
                    </p>
                    <p className="font-serif text-sm md:text-base text-ink/65 leading-[1.6] max-w-[48ch] mb-6">
                      Writer and observer who loves technology, books, poetry, cinema, and music. Working in Customer Experience and MarTech, exploring the intersections of code, literature, and art.
                    </p>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-sans uppercase tracking-widest font-semibold text-ink/50 select-none">
                      <a href="mailto:adityadpandey@gmail.com" className="hover:text-accent transition-colors">
                        Email
                      </a>
                      <span>&middot;</span>
                      <a href="https://www.linkedin.com/in/adityapandey99/" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                        LinkedIn
                      </a>
                      <span>&middot;</span>
                      <a href="https://github.com/aditya-pandey" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                        GitHub
                      </a>
                      <span>&middot;</span>
                      <a href="https://x.com/aditya___pandey" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                        X
                      </a>
                    </div>
                  </FadeIn>
                </div>
              </section>
            </div>

            {/* Right: Blended Sketch Portrait */}
            <div className="md:col-span-5 flex justify-center md:justify-end items-center select-none pointer-events-none">
              <FadeIn delay={0.6} className="w-full max-w-[340px] md:max-w-none flex justify-center md:justify-end">
                <img
                  src="/sitting.png"
                  alt="Aditya Pandey"
                  className="w-[85%] md:w-[80%] lg:w-[95%] h-auto object-contain rounded-lg opacity-85 dark:opacity-25 dark:invert transition-all duration-700"
                  style={{
                    maskImage: "radial-gradient(circle at 50% 50%, black 30%, rgba(0,0,0,0.85) 55%, rgba(0,0,0,0.3) 75%, transparent 100%)",
                    WebkitMaskImage: "radial-gradient(circle at 50% 50%, black 30%, rgba(0,0,0,0.85) 55%, rgba(0,0,0,0.3) 75%, transparent 100%)"
                  }}
                />
              </FadeIn>
            </div>

          </div>
          
          {/* Level 2: Grid containing Recent Thoughts, Currently Reading, Featured Poem */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-14 border-t border-stone/25 pt-10">
            
            {/* Column 1: Recent Thoughts */}
            <FadeIn delay={0.2} className="flex flex-col gap-4">
              <div className="flex items-baseline justify-between select-none">
                <h2 className="font-sans text-xs uppercase tracking-widest font-bold text-ink/45">
                  Recent Thoughts
                </h2>
                <Link href="/thoughts" className="font-sans text-xs uppercase tracking-widest font-semibold text-ink/50 hover:text-accent transition-colors">
                  View all &rarr;
                </Link>
              </div>
              
              <StaggerContainer className="flex flex-col gap-6 pl-4 border-l border-accent/20">
                {thoughts.map((thought) => (
                  <StaggerItem key={thought.slug}>
                    <Link 
                      href={`/thoughts/${thought.slug}`} 
                      className="group flex flex-col transition-all duration-300"
                    >
                      <span className="font-sans text-xs uppercase tracking-widest font-bold text-accent mb-1 select-none">
                        {thought.metadata.tags?.[0] || "Thought"}
                      </span>
                      
                      <h3 className="font-serif text-lg md:text-xl tracking-tight text-ink group-hover:text-accent transition-colors duration-300 leading-tight">
                        {thought.metadata.title}
                      </h3>
                      
                      <span className="font-sans text-xs text-ink/40 uppercase tracking-wider mt-1 mb-2 select-none">
                        {new Date(thought.metadata.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                        <span className="mx-1.5">&middot;</span>
                        {getReadingTime(thought.content)}
                      </span>
                      
                      {thought.metadata.excerpt && (
                        <p className="font-serif text-ink/75 text-sm leading-[1.6] line-clamp-3">
                          {thought.metadata.excerpt}
                        </p>
                      )}
                    </Link>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </FadeIn>

            {/* Column 2: Currently Reading */}
            {currentReading && (
              <FadeIn delay={0.3} className="flex flex-col gap-4">
                <div className="flex items-baseline justify-between select-none">
                  <h2 className="font-sans text-xs uppercase tracking-widest font-bold text-ink/45">
                    Currently Reading
                  </h2>
                  <Link href="/library" className="font-sans text-xs uppercase tracking-widest font-semibold text-ink/50 hover:text-accent transition-colors">
                    Library &rarr;
                  </Link>
                </div>
                <div className="pl-4 border-l border-accent/20">
                  <h3 className="font-serif text-lg md:text-xl font-semibold text-ink leading-snug">{currentReading.title}</h3>
                  <p className="font-sans text-xs uppercase tracking-widest text-ink/40 font-semibold mt-0.5">{currentReading.author}</p>
                  {currentReading.note && (
                    <p className="font-serif italic text-ink/70 text-sm leading-relaxed mt-2 pl-3 border-l border-stone/20">
                      &ldquo;{currentReading.note}&rdquo;
                    </p>
                  )}
                </div>
              </FadeIn>
            )}

            {/* Column 3: Featured Poem */}
            {poem && (
              <FadeIn delay={0.4} className="flex flex-col gap-4">
                <div className="flex items-baseline justify-between select-none">
                  <h2 className="font-sans text-xs uppercase tracking-widest font-bold text-ink/45">
                    Featured Poem
                  </h2>
                  <Link href="/poetry" className="font-sans text-xs uppercase tracking-widest font-semibold text-ink/50 hover:text-accent transition-colors">
                    Archive &rarr;
                  </Link>
                </div>
                
                <div className="pl-4 border-l border-accent/20">
                  <Link href={`/poetry/${poem.slug}`} className="group block mb-3">
                    <h3 className="font-serif text-lg md:text-xl text-ink group-hover:text-accent transition-colors duration-300 leading-tight">
                      {poem.metadata.title}
                    </h3>
                    <p className="font-sans text-xs uppercase tracking-widest text-ink/40 font-semibold mt-0.5 select-none">
                      {poem.metadata.tags?.[0] ? `${poem.metadata.tags[0]} · ` : ""}{new Date(poem.metadata.date).getFullYear()}
                    </p>
                  </Link>
                  
                  <p className="font-serif italic text-ink/75 text-sm leading-[1.6] mb-4">
                    {getPoemDescription(poem)}
                  </p>
                  
                  <Link 
                    href={`/poetry/${poem.slug}`} 
                    className="inline-block mt-1 font-sans text-xs uppercase tracking-widest font-semibold text-ink/50 hover:text-accent transition-colors duration-300"
                  >
                    Read full poem &rarr;
                  </Link>
                </div>
              </FadeIn>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
