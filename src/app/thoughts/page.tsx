import Link from "next/link";
import { getThoughts } from "@/lib/content";
import { FadeIn, TextReveal, StaggerContainer, StaggerItem } from "@/components/ui/Motion";

export const metadata = {
  title: "Thoughts | Aditya Pandey",
  description: "An archive of observations, essays, and systems thinking.",
};

export default function ThoughtsIndex() {
  const thoughts = getThoughts();

  return (
    <div className="w-full max-w-[800px] mx-auto px-5 lg:px-8 py-16 md:py-[120px]">
      <header className="mb-12 md:mb-[120px] border-b border-stone/50 pb-8">
        <TextReveal 
          text="Thoughts" 
          className="font-serif text-4xl md:text-5xl lg:text-[48px] tracking-tight leading-[1.1] mb-6"
        />
        <FadeIn delay={0.2}>
          <p className="font-sans text-lg md:text-xl text-ink/80 leading-[1.7] max-w-[65ch]">
            A collection of essays, observations, and internet culture writing. Structured as an ongoing intellectual archive.
          </p>
        </FadeIn>
      </header>

      <StaggerContainer className="flex flex-col gap-12">
        {thoughts.map((thought) => (
          <StaggerItem key={thought.slug}>
            <article className="group">
              <Link href={`/thoughts/${thought.slug}`} className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-12">
                <time className="font-sans text-sm text-ink/50 min-w-[120px]">
                  {new Date(thought.metadata.date).toLocaleDateString("en-US", { month: "long", year: "numeric", day: "numeric" })}
                </time>
                <div>
                  <h2 className="font-serif text-2xl md:text-3xl mb-3 group-hover:text-accent transition-colors">
                    {thought.metadata.title}
                  </h2>
                  {thought.metadata.excerpt && (
                    <p className="font-sans text-lg text-ink/80 leading-[1.6]">
                      {thought.metadata.excerpt}
                    </p>
                  )}
                </div>
              </Link>
            </article>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  );
}
