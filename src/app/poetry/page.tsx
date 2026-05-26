import Link from "next/link";
import Image from "next/image";
import { getPoetry } from "@/lib/content";
import { FadeIn, TextReveal, StaggerContainer, StaggerItem, HoverCard } from "@/components/ui/Motion";

export const metadata = {
  title: "Poetry | Aditya Pandey",
  description: "An archive of poetry and emotional writing.",
};

export default function Poetry() {
  const poetry = getPoetry();

  return (
    <div className="w-full max-w-[1120px] mx-auto px-5 lg:px-8 py-16 md:py-[120px]">
      <div className="max-w-[800px] mx-auto">
        <header className="mb-12 md:mb-[80px] border-b border-stone/50 pb-8 text-center">
          <TextReveal 
            text="Poetry" 
            className="font-serif text-4xl md:text-5xl lg:text-[48px] tracking-tight leading-[1.1] mb-6 justify-center"
          />
          <FadeIn delay={0.2}>
            <p className="font-sans text-lg md:text-xl text-ink/80 leading-[1.7] max-w-[50ch] mx-auto">
              An emotional archive. Sparse, rhythmic, and deeply felt.
            </p>
          </FadeIn>
        </header>

        {/* Book Promo Section */}
        <FadeIn delay={0.4}>
          <section className="mb-16 md:mb-[120px] p-8 md:p-12 rounded-xl border border-stone/30 bg-surface/50 flex flex-col md:flex-row gap-8 md:gap-16 items-center">
            <div className="w-48 md:w-64 flex-shrink-0 shadow-xl overflow-hidden rounded-sm">
              <Image 
                src="/book_cover.png" 
                alt="Nirvana se Pehle Book Cover"
                width={300}
                height={450}
                className="w-full h-auto object-cover"
              />
            </div>
            <div>
              <h2 className="font-serif text-3xl md:text-4xl mb-4 text-ink">निर्वाण से पहले</h2>
              <p className="font-sans text-lg text-ink/80 leading-[1.7] mb-8">
                A collection of Hindi poetry exploring love, loss, and the silent spaces between human connection. Available now on Amazon and Flipkart.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="https://www.amazon.in/dp/9369531718" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-ink text-canvas font-sans text-sm tracking-wide rounded hover:bg-ink/90 transition-colors shadow-sm">
                  Buy on Amazon
                </a>
                <a href="https://www.flipkart.com/9789369531714/p/itm23f74b4d5e557" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-surface border border-stone text-ink font-sans text-sm tracking-wide rounded hover:bg-stone/20 transition-colors">
                  Buy on Flipkart
                </a>
              </div>
            </div>
          </section>
        </FadeIn>
      </div>

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {poetry.map((poem) => (
          <StaggerItem key={poem.slug} className="h-full">
            <HoverCard className="h-full">
              <Link href={`/poetry/${poem.slug}`} className="group flex flex-col h-full p-6 md:p-8 rounded-xl border border-stone/30 hover:border-stone/60 bg-surface/30 hover:bg-surface/80 transition-colors duration-500">
                <h3 className="font-serif text-2xl mb-4 group-hover:text-accent transition-colors duration-500">
                  {poem.metadata.title}
                </h3>
                {poem.metadata.excerpt && (
                  <p className="font-sans text-ink/70 leading-[1.6] mb-8 flex-grow">
                    {poem.metadata.excerpt}
                  </p>
                )}
                <span className="font-sans text-xs uppercase tracking-widest text-ink/40 pt-6 border-t border-stone/30 mt-auto">
                  {new Date(poem.metadata.date).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </span>
              </Link>
            </HoverCard>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  );
}
