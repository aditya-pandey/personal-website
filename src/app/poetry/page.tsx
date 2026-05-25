import Link from "next/link";
import Image from "next/image";
import { getPoetry } from "@/lib/content";

export const metadata = {
  title: "Poetry | Aditya Pandey",
  description: "An archive of poetry and emotional explorations.",
};

export default function PoetryIndex() {
  const poetry = getPoetry();

  return (
    <div className="w-full max-w-[1120px] mx-auto px-5 lg:px-8 py-16 md:py-[120px]">
      <div className="max-w-[800px] mx-auto">
        <header className="mb-12 md:mb-[80px] border-b border-stone/50 pb-8 text-center">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-[48px] tracking-tight leading-[1.1] mb-6">
            Poetry
          </h1>
          <p className="font-sans text-lg md:text-xl text-ink/80 leading-[1.7] max-w-[50ch] mx-auto">
            An emotional archive. Sparse, rhythmic, and deeply felt.
          </p>
        </header>

        {/* Book Promo Section */}
        <section className="mb-16 md:mb-[120px] p-8 md:p-12 rounded-xl border border-stone/30 bg-surface/50 flex flex-col md:flex-row gap-8 md:gap-16 items-center">
          <div className="w-48 md:w-64 flex-shrink-0 shadow-xl overflow-hidden rounded-sm">
            <Image 
              src="/book_cover.png" 
              alt="निर्वाण से पहले — The Collection" 
              width={300} 
              height={450} 
              className="w-full h-auto object-cover" 
            />
          </div>
          <div className="flex flex-col">
            <h2 className="font-serif text-3xl md:text-4xl mb-4 text-ink">
              <span className="font-devanagari">निर्वाण से पहले</span> <span className="opacity-60 font-sans font-light">&mdash;</span> The Collection
            </h2>
            <p className="font-sans text-base md:text-lg text-ink/80 leading-[1.7] mb-8">
              A definitive collection of verses exploring the transient nature of existence and the depth of human emotions. This volume brings together a lifetime of contemplative thoughts and lyrical expressions.
            </p>
            <div className="flex flex-col gap-3">
              <span className="font-sans text-xs uppercase tracking-widest text-ink/50 font-semibold">Available At</span>
              <div className="flex gap-6 items-center">
                <a href="https://www.amazon.in/dp/9369531718" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-sans text-sm md:text-base text-ink/80 hover:text-accent transition-colors">
                  <svg className="w-5 h-5 text-ink/70" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12c0 4.418 3.582 8 8 8s8-3.582 8-8-3.582-8-8-8-8 3.582-8 8z" />
                    <path d="M8 12.5s1 1 3 1 3-1 3-1" />
                    <path d="M11 13.5l.5.5.5-.5" />
                    <text x="12" y="11.5" fontFamily="sans-serif" fontSize="5" textAnchor="middle" fontWeight="bold" fill="currentColor">a</text>
                  </svg>
                  Amazon
                </a>
                <a href="https://www.flipkart.com/9789369531714/p/itm23f74b4d5e557" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-sans text-sm md:text-base text-ink/80 hover:text-accent transition-colors">
                  <svg className="w-5 h-5 text-ink/70" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l1.5-3h15L21 9v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" />
                    <path d="M3 9h18" />
                    <path d="M9 13v2a3 3 0 0 0 6 0v-2" />
                    <text x="12" y="8" fontFamily="sans-serif" fontSize="4" textAnchor="middle" fontWeight="bold" fill="currentColor">F</text>
                  </svg>
                  Flipkart
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {poetry.map((poem) => (
          <article key={poem.slug} className="group flex flex-col p-8 rounded-lg border border-stone/30 hover:bg-surface/50 transition-colors duration-300">
            <Link href={`/poetry/${poem.slug}`} className="flex flex-col h-full text-center md:text-left gap-4">
              <h2 className="font-serif text-2xl group-hover:text-accent transition-colors">
                {poem.metadata.title}
              </h2>
              {poem.metadata.excerpt && (
                <p className="font-sans text-lg text-ink/80 leading-[1.6] flex-grow">
                  {poem.metadata.excerpt}
                </p>
              )}
              <div className="mt-4 pt-4 border-t border-stone/30 flex justify-between items-center w-full">
                <time className="font-sans text-xs uppercase tracking-widest text-ink/40">
                  {new Date(poem.metadata.date).toLocaleDateString("en-US", { year: "numeric" })}
                </time>
                <span className="font-sans text-xs uppercase tracking-widest text-ink/40 group-hover:text-accent transition-colors">&rarr; Read</span>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
