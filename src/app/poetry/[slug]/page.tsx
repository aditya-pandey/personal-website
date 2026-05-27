import { getPoetry, getPoetryBySlug } from "@/lib/content";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { HTMLAttributes } from "react";
import { FadeIn } from "@/components/ui/Motion";
import { ShareButton } from "@/components/ShareButton";
import { WriteBack } from "@/components/WriteBack";

export async function generateStaticParams() {
  const poetry = getPoetry();
  return poetry.map((p) => ({ slug: p.slug }));
}

// Custom components for poetry to use devanagari font with stanza spacing
const poetryComponents = {
  p: (props: HTMLAttributes<HTMLParagraphElement>) => (
    <p 
      className="font-devanagari text-lg md:text-[19px] leading-[1.8] mb-8 md:mb-10 text-ink/90 dark:text-ink/95 whitespace-pre-wrap tracking-wide font-light" 
      {...props} 
    />
  ),
  br: () => <br className="my-1" />,
};

export default async function PoetryPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const poem = getPoetryBySlug(slug);

  if (!poem) {
    notFound();
  }

  const year = new Date(poem.metadata.date).getFullYear();
  let editorialMeta = `Written in ${year}`;
  if (poem.slug === "antarman") {
    editorialMeta = `From "निर्वाण से पहले" · ${year}`;
  } else if (poem.metadata.tags?.includes("reflection")) {
    editorialMeta = `Poetry Archive · ${year}`;
  }

  const poems = getPoetry();
  const currentIndex = poems.findIndex((p) => p.slug === slug);
  const nextPoem = poems[(currentIndex + 1) % poems.length];
  const navLabels = [
    "Continue wandering",
    "Another fragment",
    "Read another poem",
  ];
  const label = navLabels[currentIndex % navLabels.length];

  return (
    <div className="w-full min-h-[calc(100vh-64px)] flex flex-col items-center justify-between py-16 md:py-24 px-5 poetry-reading-bg overflow-hidden">
      <FadeIn className="w-full flex flex-col items-center flex-grow max-w-[680px]">
        {/* Top Navigation */}
        <Link 
          href="/poetry" 
          className="font-sans text-xs uppercase tracking-widest text-ink/40 hover:text-accent transition-colors duration-300 font-semibold mb-16 select-none"
        >
          ← Return to Archive
        </Link>

        {/* Poem Header */}
        <header className="mb-16 md:mb-20 text-center select-none flex flex-col items-center">
          <h1 className="font-serif text-3xl md:text-5xl tracking-tight leading-[1.2] mb-6 text-ink">
            {poem.metadata.title}
          </h1>
          <div className="flex items-center gap-4 font-sans text-xs uppercase tracking-widest text-ink/40 font-semibold">
            <span>{editorialMeta}</span>
            <span>&middot;</span>
            <ShareButton title={poem.metadata.title} label="Share Poem" />
          </div>
        </header>

        {/* Poem Body (asymmetrical left border) */}
        <div className="poetry-body w-full max-w-[580px] text-left mb-16 pl-6 sm:pl-8 border-l border-accent/25 dark:border-accent/40">
          <MDXRemote source={poem.content} components={poetryComponents} />
        </div>

        {/* Write Back Section */}
        <div className="w-full max-w-[580px] mb-16">
          <WriteBack title={poem.metadata.title} />
        </div>

        {/* Bottom Navigation */}
        <div className="w-full max-w-[580px] border-t border-stone/30 pt-12 mt-auto flex flex-col sm:flex-row justify-between items-center gap-6 select-none">
          <Link 
            href="/poetry" 
            className="font-sans text-xs uppercase tracking-widest text-ink/40 hover:text-accent transition-colors duration-300 font-semibold"
          >
            ← Archive Index
          </Link>
          <Link 
            href={`/poetry/${nextPoem.slug}`}
            className="font-serif italic text-lg text-ink hover:text-accent flex items-center gap-2 group transition-colors duration-300"
          >
            <span>{label}</span>
            <span className="font-sans text-xs not-italic group-hover:translate-x-1 transition-transform duration-300">
              &rarr;
            </span>
          </Link>
        </div>
      </FadeIn>
    </div>
  );
}

