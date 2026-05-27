import { ArchivePageLayout } from "@/components/library/ArchivePageLayout";
import { ESSAY_SHELVES, staticArchiveItems } from "@/lib/library-data";

export const metadata = {
  title: "Essays | Library",
  description: "Arguments, provocations, and lasting clarity.",
};

export default function EssaysArchivePage() {
  const allEssays = staticArchiveItems.filter((item) => item.type === "essay");

  return (
    <ArchivePageLayout
      title="Essays & Ideas"
      subtitle="Arguments, provocations, and lasting clarity."
      category="essays"
      allItems={allEssays}
    />
  );
}
