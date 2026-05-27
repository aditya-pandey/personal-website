import { getThoughts } from "@/lib/content";
import { ThoughtsCatalog } from "@/components/ThoughtsCatalog";
import { FadeIn, TextReveal } from "@/components/ui/Motion";

export const metadata = {
  title: "Thoughts | Aditya Pandey",
  description: "An archive of observations, essays, and reflections.",
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

      <ThoughtsCatalog initialThoughts={thoughts} />
    </div>
  );
}
