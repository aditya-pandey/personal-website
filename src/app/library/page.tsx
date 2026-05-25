import Link from "next/link";
import { getLibrary, getCurrentReading } from "@/lib/content";
import { FadeIn, TextReveal, StaggerContainer, StaggerItem, HoverCard } from "@/components/ui/Motion";

export const metadata = {
  title: "Library | Aditya Pandey",
  description: "A curated editorial-style reading archive.",
};

export default function LibraryIndex() {
  const library = getLibrary();
  const currentReading = getCurrentReading();

  return (
    <div className="w-full max-w-[1120px] mx-auto px-5 lg:px-8 py-16 md:py-[120px]">
      <header className="mb-12 md:mb-[120px] border-b border-stone/50 pb-8">
        <TextReveal 
          text="Library" 
          className="font-serif text-4xl md:text-5xl lg:text-[48px] tracking-tight leading-[1.1] mb-6"
        />
        <FadeIn delay={0.2}>
          <p className="font-sans text-lg md:text-xl text-ink/80 leading-[1.7] max-w-[65ch]">
            An archive of books that have shaped my thinking, and what I am reading right now.
          </p>
        </FadeIn>
      </header>

      {currentReading && (
        <FadeIn delay={0.3}>
          <section className="mb-24">
            <div className="flex items-baseline justify-between mb-8 border-b border-stone/50 pb-4">
              <h2 className="font-serif text-2xl md:text-3xl">Currently Reading</h2>
            </div>
            <HoverCard>
              <div className="flex flex-col md:flex-row gap-8 items-start p-8 rounded-lg border border-stone/30 bg-surface/50">
                {currentReading.cover && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={currentReading.cover} alt={currentReading.title} className="w-32 md:w-48 shadow-lg" />
                )}
                <div>
                  <h3 className="font-serif text-3xl mb-2">{currentReading.title}</h3>
                  <p className="font-sans text-sm uppercase tracking-widest text-ink/60 mb-6">{currentReading.author}</p>
                  <p className="font-sans text-ink/80 text-lg leading-[1.7] border-l-2 border-accent pl-6 italic">
                    {currentReading.note}
                  </p>
                </div>
              </div>
            </HoverCard>
          </section>
        </FadeIn>
      )}

      <section>
        <FadeIn delay={0.1}>
          <div className="flex items-baseline justify-between mb-8 border-b border-stone/50 pb-4">
            <h2 className="font-serif text-2xl md:text-3xl">Archive</h2>
          </div>
        </FadeIn>
        <StaggerContainer className="flex flex-col">
          {library.map((book) => (
            <StaggerItem key={book.slug}>
              <Link href={`/library/${book.slug}`} className="group flex flex-col md:flex-row md:items-center justify-between py-6 border-b border-stone/30 hover:bg-surface/30 px-4 -mx-4 transition-colors duration-300">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-12">
                  <time className="font-sans text-sm text-ink/50 min-w-[100px]">
                    {new Date(book.metadata.date).toLocaleDateString("en-US", { year: "numeric", month: "long" })}
                  </time>
                  <h3 className="font-serif text-2xl group-hover:text-accent transition-colors">
                    {book.metadata.title}
                  </h3>
                </div>
                <span className="font-sans text-sm uppercase tracking-widest text-ink/50 mt-2 md:mt-0">
                  {book.metadata.author}
                </span>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

    </div>
  );
}
