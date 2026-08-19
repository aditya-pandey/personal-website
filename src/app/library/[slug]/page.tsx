import { getLibrary, getLibraryBySlug } from "@/lib/content";
import { MDXRenderer } from "@/components/ui/MDXRenderer";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";

export async function generateStaticParams() {
  const library = getLibrary();
  return library.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const book = getLibraryBySlug(slug);
  if (!book) return {};

  return {
    title: `${book.metadata.title} | Library | Aditya Pandey`,
    description: book.metadata.quote || `Reflections on ${book.metadata.title} by ${book.metadata.author}.`,
    openGraph: {
      title: book.metadata.title,
      description: book.metadata.quote || `Reflections on ${book.metadata.title} by ${book.metadata.author}.`,
      type: "article",
      authors: ["Aditya Pandey"],
    },
    twitter: {
      card: "summary_large_image",
      title: book.metadata.title,
      description: book.metadata.quote || `Reflections on ${book.metadata.title} by ${book.metadata.author}.`,
    }
  };
}

export default async function LibraryPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const book = getLibraryBySlug(slug);

  if (!book) {
    notFound();
  }

  return (
    <div className="w-full max-w-[1120px] mx-auto px-5 lg:px-8 pt-6 pb-12 sm:pt-10 sm:pb-16 md:pt-16 md:pb-24">
      <div className="max-w-[65ch] mx-auto">
        <Link href="/library" className="font-sans text-xs sm:text-sm text-ink/50 hover:text-accent transition-colors inline-flex items-center gap-2 mb-6 sm:mb-8">
          &larr; Back to Library
        </Link>

        <header className="mb-8 sm:mb-12 text-center">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[48px] tracking-tight leading-[1.15] mb-4 sm:mb-6">
            {book.metadata.title}
          </h1>
          <p className="font-sans text-xs sm:text-sm uppercase tracking-widest text-ink/60">
            By {book.metadata.author}
          </p>
        </header>

        <div>
          {book.metadata.quote && (
            <blockquote className="border-l-2 border-accent pl-6 italic font-serif text-xl sm:text-2xl my-8 sm:my-10 text-ink-dark/80">
              &quot;{book.metadata.quote}&quot;
            </blockquote>
          )}
          
          <MDXRenderer source={book.content} />
        </div>
      </div>
    </div>
  );
}
