import Link from "next/link";
import { getExperiments } from "@/lib/content";
import { FadeIn, TextReveal, StaggerContainer, StaggerItem, HoverCard } from "@/components/ui/Motion";
import { ShareButton } from "@/components/ShareButton";

export const metadata = {
  title: "Experiments | Aditya Pandey",
  description: "A showcase of ideas, concepts, and projects.",
};

export default function ExperimentsIndex() {
  const experiments = getExperiments();

  return (
    <div className="w-full max-w-[1120px] mx-auto px-5 lg:px-8 py-16 md:py-[120px]">
      <header className="mb-12 md:mb-[120px] border-b border-stone/50 pb-8">
        <TextReveal 
          text="Experiments & Projects" 
          className="font-serif text-4xl md:text-5xl lg:text-[48px] tracking-tight leading-[1.1] mb-6"
        />
        <FadeIn delay={0.2}>
          <p className="font-sans text-lg md:text-xl text-ink/80 leading-[1.7] max-w-[65ch]">
            A minimal showcase focusing on ideas, concepts, curiosity, and the process of creation.
          </p>
        </FadeIn>
      </header>

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {experiments.map((exp) => (
          <StaggerItem key={exp.slug} className="h-full">
            <HoverCard className="h-full">
              <article className="group flex flex-col h-full p-6 rounded-lg border border-stone/30 hover:bg-surface/55 hover:border-stone/60 transition-colors duration-500">
                <Link 
                  href={exp.metadata.link || "#"} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col flex-grow mb-6"
                >
                  <h2 className="font-serif text-2xl group-hover:text-accent transition-colors duration-500 mb-3">
                    {exp.metadata.title}
                  </h2>
                  {exp.metadata.excerpt && (
                    <p className="font-sans text-ink/80 leading-[1.6] flex-grow">
                      {exp.metadata.excerpt}
                    </p>
                  )}
                </Link>
                
                <div className="flex items-center justify-between text-xs font-sans uppercase tracking-widest text-ink/40 pt-4 border-t border-stone/30">
                  <time>{new Date(exp.metadata.date).toLocaleDateString("en-US", { year: "numeric" })}</time>
                  <div className="flex items-center gap-3">
                    <ShareButton title={exp.metadata.title} url={exp.metadata.link} label="Share" className="font-normal" align="top" />
                    <span>&middot;</span>
                    <a 
                      href={exp.metadata.link || "#"} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-accent font-semibold transition-colors duration-500"
                    >
                      View &rarr;
                    </a>
                  </div>
                </div>
              </article>
            </HoverCard>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  );
}
