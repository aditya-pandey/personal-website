import { ArchivePageLayout } from "@/components/library/ArchivePageLayout";
import { MUSIC_SHELVES, staticArchiveItems } from "@/lib/library-data";

export const metadata = {
  title: "Music | Library",
  description: "What plays when the room goes quiet.",
};

export default function MusicArchivePage() {
  const allMusic = staticArchiveItems.filter((item) => item.type === "music");

  return (
    <ArchivePageLayout
      title="Music"
      subtitle="What plays when the room goes quiet."
      category="music"
      allItems={allMusic}
    />
  );
}
