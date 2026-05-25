import Link from "next/link";
import { getExperiments } from "@/lib/content";

export const metadata = {
  title: "Experiments | Aditya Pandey",
  description: "A showcase of ideas, systems, and projects.",
};

export default function ExperimentsIndex() {
  const experiments = getExperiments();

  return (
    <div className="w-full max-w-[1120px] mx-auto px-5 lg:px-8 py-16 md:py-[120px]">
      <header className="mb-12 md:mb-[120px] border-b border-stone/50 pb-8">
        <h1 className="font-serif text-4xl md:text-5xl lg:text-[48px] tracking-tight leading-[1.1] mb-6">
          Experiments & Projects
        </h1>
        <p className="font-sans text-lg md:text-xl text-ink/80 leading-[1.7] max-w-[65ch]">
          A minimal showcase focusing on ideas, systems, curiosity, and the process of creation.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {experiments.map((exp) => (
          <article key={exp.slug} className="group flex flex-col p-6 rounded-lg border border-stone/30 hover:bg-surface/50 transition-colors duration-300">
            <Link 
              href={exp.metadata.link || "#"} 
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col h-full"
            >
              <h2 className="font-serif text-2xl group-hover:text-accent transition-colors mb-3">
                {exp.metadata.title}
              </h2>
              {exp.metadata.excerpt && (
                <p className="font-sans text-ink/80 leading-[1.6] flex-grow">
                  {exp.metadata.excerpt}
                </p>
              )}
              
              <div className="flex items-center justify-between text-xs font-sans uppercase tracking-widest text-ink/40 mt-6 pt-4 border-t border-stone/30">
                <time>{new Date(exp.metadata.date).toLocaleDateString("en-US", { year: "numeric" })}</time>
                <span className="group-hover:text-accent transition-colors">&rarr; View Project</span>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
