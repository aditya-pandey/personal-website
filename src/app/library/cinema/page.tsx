import { ArchivePageLayout } from "@/components/library/ArchivePageLayout";
import { CINEMA_SHELVES, staticArchiveItems } from "@/lib/library-data";

export const metadata = {
  title: "Cinema | Library",
  description: "Films that changed how I see.",
};

export default function CinemaArchivePage() {
  const allFilms = staticArchiveItems.filter((item) => item.type === "film");

  return (
    <ArchivePageLayout
      title="Cinema"
      subtitle="Films that changed how I see."
      category="cinema"
      allItems={allFilms}
    />
  );
}
