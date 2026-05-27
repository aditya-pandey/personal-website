import fs from "fs";
import path from "path";
import { getLibrary } from "@/lib/content";
import { LibraryCatalog } from "@/components/LibraryCatalog";
import { TextReveal, FadeIn } from "@/components/ui/Motion";
import { ArchiveItem } from "@/lib/library-data";

export const metadata = {
  title: "Library & Influences | Aditya Pandey",
  description: "A curated digital sanctuary of books, cinema, music, essays, and ideas that shaped my perspective.",
};

export default function LibraryIndex() {
  const dynamicBooks = getLibrary();
  
  // Read current-reading.json directly to get both reading and last watched status
  let currentReading = null;
  try {
    const filePath = path.join(process.cwd(), "content", "library", "current-reading.json");
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      currentReading = JSON.parse(raw);
    }
  } catch (error) {
    console.error("Error reading current-reading.json:", error);
  }

  // Map dynamic books from content/library/*.mdx into ArchiveItem format
  const dynamicItems: ArchiveItem[] = dynamicBooks.map((book) => ({
    id: book.slug,
    title: book.metadata.title,
    creator: book.metadata.author,
    type: "book",
    tags: book.metadata.tags || ["Literature"],
    year: book.metadata.date ? new Date(book.metadata.date).getFullYear().toString() : undefined,
    note: book.metadata.quote ? `“${book.metadata.quote.slice(0, 100)}...”` : undefined,
    link: `/library/${book.slug}`,
  }));

  return (
    <div className="w-full max-w-[1120px] mx-auto px-5 lg:px-8 py-16 md:py-24 flex flex-col gap-12">
      {/* Title Header */}
      <header className="border-b border-stone/30 pb-8 select-none">
        <TextReveal 
          text="Library" 
          className="font-serif text-4xl md:text-5xl lg:text-[48px] tracking-tight leading-[1.1] mb-6"
        />
        <FadeIn delay={0.2}>
          <p className="font-serif italic text-lg md:text-xl text-ink/80 leading-[1.6] max-w-[65ch]">
            Books, films, music, essays, and ideas that stayed with me.
          </p>
        </FadeIn>
      </header>

      {/* Simplified Library Catalog (Editorial Layers + Stacked Compact Archives) */}
      <LibraryCatalog currentReading={currentReading} dynamicItems={dynamicItems} />
    </div>
  );
}
