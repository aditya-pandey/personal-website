import { getLibrary, getLibraryBySlug } from "@/lib/content";
import { MDXRenderer } from "@/components/ui/MDXRenderer";
import { notFound } from "next/navigation";
import Link from "next/link";

export async function generateStaticParams() {
  const library = getLibrary();
  return library.map((b) => ({ slug: b.slug }));
}

export default async function LibraryPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const book = getLibraryBySlug(slug);

  if (!book) {
    notFound();
  }

  return (
    <div className="w-full max-w-[1120px] mx-auto px-5 lg:px-8 py-[120px]">
      
      <Link href="/library" className="font-sans text-sm text-ink/50 hover:text-accent transition-colors inline-flex items-center gap-2 mb-16">
        &larr; Back to Library
      </Link>

      <header className="max-w-[800px] mx-auto mb-[80px] text-center">
        <h1 className="font-serif text-4xl md:text-5xl lg:text-[48px] tracking-tight leading-[1.1] mb-6">
          {book.metadata.title}
        </h1>
        <p className="font-sans text-lg uppercase tracking-widest text-ink/60">
          By {book.metadata.author}
        </p>
      </header>

      <div className="max-w-[65ch] mx-auto">
        {book.metadata.quote && (
          <blockquote className="border-l-2 border-accent pl-6 italic font-serif text-2xl my-12 text-ink-dark/80">
            &quot;{book.metadata.quote}&quot;
          </blockquote>
        )}
        
        <MDXRenderer source={book.content} />
      </div>
      
    </div>
  );
}
