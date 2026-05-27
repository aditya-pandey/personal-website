import { getLibrary } from "@/lib/content";
import { ArchivePageLayout } from "@/components/library/ArchivePageLayout";
import { BOOK_SHELVES, staticArchiveItems, ArchiveItem } from "@/lib/library-data";

export const metadata = {
  title: "Books | Library",
  description: "Novels, philosophy, poetry, and the worlds they leave behind.",
};

export default function BooksArchivePage() {
  const dynamicBooks = getLibrary();
  const dynamicItems: ArchiveItem[] = dynamicBooks.map((book) => ({
    id: book.slug,
    title: book.metadata.title,
    creator: book.metadata.author,
    type: "book",
    tags: book.metadata.tags || ["Literature"],
    year: book.metadata.date
      ? new Date(book.metadata.date).getFullYear().toString()
      : undefined,
    note: book.metadata.quote
      ? `“${book.metadata.quote.slice(0, 100)}...”`
      : undefined,
    link: `/library/${book.slug}`,
  }));

  const dynamicIds = new Set(dynamicItems.map((item) => item.id));
  const filteredStatic = staticArchiveItems.filter(
    (item) => item.type === "book" && !dynamicIds.has(item.id)
  );
  const allBooks = [...dynamicItems, ...filteredStatic];

  return (
    <ArchivePageLayout
      title="Books"
      subtitle="Novels, philosophy, poetry, and the worlds they leave behind."
      category="books"
      allItems={allBooks}
    />
  );
}
