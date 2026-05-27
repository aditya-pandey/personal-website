import Link from "next/link";
import { getThoughts, getPoetry, getCurrentReading, MDXDocument } from "@/lib/content";
import { FadeIn, TextReveal, StaggerContainer, StaggerItem } from "@/components/ui/Motion";

function getReadingTime(content: string): string {
  const words = content.trim().split(/\s+/).length;
  const wpm = 200; // Average reading speed for prose
  const minutes = Math.ceil(words / wpm);
  return `${minutes} min read`;
}

function getPoemDescription(poem: MDXDocument): string {
  if (poem.metadata.excerpt && poem.metadata.excerpt !== "." && poem.metadata.excerpt.trim() !== "") {
    return poem.metadata.excerpt;
  }
  // Fallback: extract the first stanza and make it a single-line excerpt
  const firstStanza = poem.content.split(/\n\s*\n/).map((s: string) => s.trim()).filter(Boolean)[0] || "";
  return firstStanza.replace(/\n+/g, " ").trim();
}

export default function Home() {
  const thoughts = getThoughts().slice(0, 1); // Retrieve only 1 thought to keep columns symmetrical and clean
  const poem = getPoetry()[0];
  const currentReading = getCurrentReading();

  return (
    <div className="w-full py-20 md:py-28 lg:py-36 poetry-reading-bg flex flex-col items-center">
      <div className="w-full max-w-[1120px] mx-auto px-5 lg:px-8">
        <div className="flex flex-col gap-20 md:gap-28">
          
          {/* Level 1: Hero Section (Name and About) */}
          <div className="flex flex-col items-center justify-center max-w-[800px] mx-auto text-center">
            <section className="flex flex-col gap-8 select-none w-full">
              <div className="flex flex-col items-center w-full">
                <TextReveal 
                  text="Aditya Pandey" 
                  className="font-serif text-4xl md:text-5xl lg:text-[56px] tracking-tight leading-[1.1] mb-6 text-ink font-semibold justify-center"
                />
                <FadeIn delay={0.4} className="flex flex-col items-center w-full">
                  <p className="font-serif italic text-xl md:text-2xl lg:text-[23px] text-ink/80 leading-[1.5] max-w-[36ch] mb-6 text-center">
                    Writing, observing, building. 
                    Somewhere between technology and stories.
                  </p>
                  <p className="font-serif text-sm md:text-[15px] text-ink/60 leading-[1.7] max-w-[62ch] mb-8 text-center font-light">
                    Writer and observer who loves technology, books, poetry, cinema, and music. Working in Customer Experience and MarTech, exploring the intersections of code, literature, and art.
                  </p>
                  <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-[11px] font-sans uppercase tracking-widest font-semibold text-ink/45 select-none">
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
          
          {/* Level 2: Grid containing Recent Thoughts, Currently Reading, Featured Poem */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-20 border-t border-stone/20 pt-16 md:pt-20">
            
            {/* Column 1: Recent Thoughts */}
            <FadeIn delay={0.2} className="flex flex-col gap-6">
              <div className="flex items-baseline justify-between select-none">
                <h2 className="font-sans text-xs uppercase tracking-widest font-bold text-ink/40">
                  Recent Thoughts
                </h2>
                <Link href="/thoughts" className="font-sans text-xs uppercase tracking-widest font-semibold text-ink/50 hover:text-accent transition-colors">
                  View all &rarr;
                </Link>
              </div>
              
              <StaggerContainer className="flex flex-col gap-6 pl-5 border-l border-accent/25">
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
              <FadeIn delay={0.3} className="flex flex-col gap-6">
                <div className="flex items-baseline justify-between select-none">
                  <h2 className="font-sans text-xs uppercase tracking-widest font-bold text-ink/40">
                    Currently Reading
                  </h2>
                  <Link href="/library" className="font-sans text-xs uppercase tracking-widest font-semibold text-ink/50 hover:text-accent transition-colors">
                    Library &rarr;
                  </Link>
                </div>
                <div className="pl-5 border-l border-accent/25 flex flex-col gap-1.5">
                  <h3 className="font-serif text-lg md:text-xl font-semibold text-ink leading-snug">{currentReading.title}</h3>
                  <p className="font-sans text-xs uppercase tracking-widest text-ink/40 font-semibold">{currentReading.author}</p>
                  {currentReading.note && (
                    <p className="font-serif italic text-ink/75 text-sm leading-[1.6] mt-2 pl-3 border-l border-stone/20">
                      &ldquo;{currentReading.note}&rdquo;
                    </p>
                  )}
                </div>
              </FadeIn>
            )}

            {/* Column 3: Featured Poem */}
            {poem && (
              <FadeIn delay={0.4} className="flex flex-col gap-6">
                <div className="flex items-baseline justify-between select-none">
                  <h2 className="font-sans text-xs uppercase tracking-widest font-bold text-ink/40">
                    Featured Poem
                  </h2>
                  <Link href="/poetry" className="font-sans text-xs uppercase tracking-widest font-semibold text-ink/50 hover:text-accent transition-colors">
                    Archive &rarr;
                  </Link>
                </div>
                
                <div className="pl-5 border-l border-accent/25 flex flex-col gap-1.5">
                  <Link href={`/poetry/${poem.slug}`} className="group block">
                    <h3 className="font-serif text-lg md:text-xl text-ink group-hover:text-accent transition-colors duration-300 leading-tight">
                      {poem.metadata.title}
                    </h3>
                    <p className="font-sans text-xs uppercase tracking-widest text-ink/40 font-semibold mt-0.5 select-none">
                      {poem.metadata.tags?.[0] ? `${poem.metadata.tags[0]} · ` : ""}{new Date(poem.metadata.date).getFullYear()}
                    </p>
                  </Link>
                  
                  <p className="font-serif italic text-ink/75 text-sm leading-[1.6] mb-2">
                    {getPoemDescription(poem)}
                  </p>
                  
                  <Link 
                    href={`/poetry/${poem.slug}`} 
                    className="inline-block font-sans text-xs uppercase tracking-widest font-semibold text-ink/50 hover:text-accent transition-colors duration-300"
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
