import { getPoetry, getPoetryBySlug } from "@/lib/content";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { HTMLAttributes } from "react";

export async function generateStaticParams() {
  const poetry = getPoetry();
  return poetry.map((p) => ({ slug: p.slug }));
}

// Custom components for poetry to use devanagari font and center-aligned layout
const poetryComponents = {
  p: (props: HTMLAttributes<HTMLParagraphElement>) => (
    <p className="font-devanagari text-xl md:text-2xl leading-[2] mb-8 text-ink/90 whitespace-pre-wrap" {...props} />
  ),
  br: () => <br />,
};

export default async function PoetryPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const poem = getPoetryBySlug(slug);

  if (!poem) {
    notFound();
  }

  return (
    <div className="w-full max-w-[800px] mx-auto px-5 lg:px-8 py-16 md:py-[120px] flex flex-col items-center text-center">
      
      <Link href="/poetry" className="font-sans text-sm text-ink/50 hover:text-accent transition-colors mb-12 md:mb-16">
        &larr; Back to Archive
      </Link>

      <header className="mb-[80px]">
        <h1 className="font-serif text-3xl md:text-4xl lg:text-[40px] tracking-tight leading-[1.2] mb-6">
          {poem.metadata.title}
        </h1>
        <time className="block font-sans text-sm text-ink/40 uppercase tracking-widest border-t border-stone/50 pt-6 mt-8 w-16 mx-auto">
          {new Date(poem.metadata.date).toLocaleDateString("en-US", { year: "numeric" })}
        </time>
      </header>

      <div className="flex flex-col items-center justify-center w-full">
        <div className="inline-block text-left">
          <MDXRemote source={poem.content} components={poetryComponents} />
        </div>
      </div>
      
    </div>
  );
}
