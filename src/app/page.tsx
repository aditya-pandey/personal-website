import Image from "next/image";
import Link from "next/link";
import { getThoughts, getPoetry, getCurrentReading } from "@/lib/content";

export default function Home() {
  const thoughts = getThoughts().slice(0, 3);
  const poem = getPoetry()[0];
  const currentReading = getCurrentReading();

  return (
    <div className="w-full max-w-[1120px] mx-auto px-5 lg:px-8 py-16 md:py-[120px] flex flex-col gap-16 md:gap-[120px]">
      
      {/* Intro Section */}
      <section className="flex flex-col md:flex-row gap-8 md:gap-12 items-start md:items-center">
        <div className="w-32 h-32 md:w-48 md:h-48 flex-shrink-0 rounded-full overflow-hidden border border-stone/50 p-1">
          <div className="w-full h-full relative rounded-full overflow-hidden bg-surface">
            <Image
              src="/portrait.png"
              alt="Aditya Pandey"
              fill
              className="object-cover grayscale contrast-125"
            />
          </div>
        </div>
        <div className="max-w-2xl">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-[48px] tracking-tight leading-[1.1] mb-6">
            Aditya Pandey
          </h1>
          <p className="font-sans text-lg md:text-xl text-ink/80 leading-[1.7]">
            A digital sanctuary for thoughts, poetry, and experiments. An ongoing archive of intellectual curiosity and literary exploration, built for slow reading and deliberate interaction.
          </p>
        </div>
      </section>

      {/* Featured Thoughts */}
      <section>
        <div className="flex items-baseline justify-between mb-8 border-b border-stone/50 pb-4">
          <h2 className="font-serif text-2xl md:text-3xl">Recent Thoughts</h2>
          <Link href="/thoughts" className="font-sans text-sm tracking-wide text-ink/60 hover:text-accent transition-colors">
            View all &rarr;
          </Link>
        </div>
        <div className="flex flex-col gap-6">
          {thoughts.map((thought) => (
            <Link key={thought.slug} href={`/thoughts/${thought.slug}`} className="group flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8 p-4 -mx-4 rounded-lg hover:bg-surface transition-colors duration-300">
              <span className="font-sans text-sm text-ink/50 min-w-[100px]">
                {new Date(thought.metadata.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
              </span>
              <div>
                <h3 className="font-serif text-xl md:text-2xl group-hover:text-accent transition-colors">
                  {thought.metadata.title}
                </h3>
                {thought.metadata.excerpt && (
                  <p className="font-sans text-ink/70 mt-2 line-clamp-2">
                    {thought.metadata.excerpt}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Two Column Layout for Poetry & Reading */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-8">
        
        {/* Featured Poem */}
        {poem && (
          <div>
            <div className="flex items-baseline justify-between mb-8 border-b border-stone/50 pb-4">
              <h2 className="font-serif text-2xl md:text-3xl">Poetry</h2>
              <Link href="/poetry" className="font-sans text-sm tracking-wide text-ink/60 hover:text-accent transition-colors">
                Archive &rarr;
              </Link>
            </div>
            <Link href={`/poetry/${poem.slug}`} className="block group p-6 rounded-lg border border-stone/30 bg-surface/50 hover:bg-surface transition-colors duration-300">
              <h3 className="font-serif text-2xl mb-4 group-hover:text-accent transition-colors">{poem.metadata.title}</h3>
              {poem.metadata.excerpt && (
                <div className="font-sans text-ink/80 leading-[1.6]">
                  {poem.metadata.excerpt}
                </div>
              )}
            </Link>
          </div>
        )}

        {/* Current Reading */}
        {currentReading && (
          <div>
            <div className="flex items-baseline justify-between mb-8 border-b border-stone/50 pb-4">
              <h2 className="font-serif text-2xl md:text-3xl">Currently Reading</h2>
              <Link href="/library" className="font-sans text-sm tracking-wide text-ink/60 hover:text-accent transition-colors">
                Library &rarr;
              </Link>
            </div>
            <div className="flex flex-col gap-4 p-6 rounded-lg border border-stone/30 bg-surface/50">
              <h3 className="font-serif text-2xl">{currentReading.title}</h3>
              <p className="font-sans text-sm uppercase tracking-widest text-ink/60">{currentReading.author}</p>
              <p className="font-sans text-ink/80 mt-2 italic border-l-2 border-accent pl-4">
                "{currentReading.note}"
              </p>
            </div>
          </div>
        )}
      </section>

    </div>
  );
}
