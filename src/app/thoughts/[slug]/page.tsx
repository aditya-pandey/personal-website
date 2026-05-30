import { getThoughts, getThoughtBySlug } from "@/lib/content";
import { MDXRenderer } from "@/components/ui/MDXRenderer";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ShareButton } from "@/components/ShareButton";
import { WriteBack } from "@/components/WriteBack";
import { Metadata } from "next";

export async function generateStaticParams() {
  const thoughts = getThoughts();
  return thoughts.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const thought = getThoughtBySlug(slug);
  if (!thought) return {};

  return {
    title: `${thought.metadata.title} | Aditya Pandey`,
    description: thought.metadata.excerpt || "An essay/reflection by Aditya Pandey.",
    openGraph: {
      title: thought.metadata.title,
      description: thought.metadata.excerpt || "An essay/reflection by Aditya Pandey.",
      type: "article",
      publishedTime: thought.metadata.date,
      authors: ["Aditya Pandey"],
    },
    twitter: {
      card: "summary_large_image",
      title: thought.metadata.title,
      description: thought.metadata.excerpt || "An essay/reflection by Aditya Pandey.",
    }
  };
}

export default async function ThoughtPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const thought = getThoughtBySlug(slug);

  if (!thought) {
    notFound();
  }

  return (
    <div className="w-full max-w-[1120px] mx-auto px-5 lg:px-8 py-[120px]">
      
      <Link href="/thoughts" className="font-sans text-sm text-ink/50 hover:text-accent transition-colors inline-flex items-center gap-2 mb-16">
        &larr; Back to Thoughts
      </Link>

      <header className="max-w-[65ch] mx-auto mb-[80px]">
        <h1 className="font-serif text-4xl md:text-5xl lg:text-[48px] tracking-tight leading-[1.1] mb-6">
          {thought.metadata.title}
        </h1>
        <div className="flex items-center flex-wrap gap-x-4 gap-y-2 font-sans text-sm text-ink/60 uppercase tracking-widest border-t border-stone/50 pt-6 mt-12">
          <time>{new Date(thought.metadata.date).toLocaleDateString("en-US", { month: "long", year: "numeric", day: "numeric" })}</time>
          {thought.metadata.tags && thought.metadata.tags.length > 0 && (
            <>
              <span>&middot;</span>
              <span>{thought.metadata.tags.join(", ")}</span>
            </>
          )}
          <span>&middot;</span>
          <ShareButton title={thought.metadata.title} label="Share" className="text-sm font-sans uppercase tracking-widest text-ink/60 font-normal hover:text-accent" />
        </div>
      </header>

      <MDXRenderer source={thought.content} />
      
      <div className="max-w-[65ch] mx-auto mt-16 md:mt-24">
        <WriteBack title={thought.metadata.title} />
      </div>
      
    </div>
  );
}
