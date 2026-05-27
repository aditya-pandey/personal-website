import { NextResponse } from "next/server";
import { getThoughts, getPoetry, getExperiments, getLibrary } from "@/lib/content";
import { staticArchiveItems } from "@/lib/library-data";

export async function GET() {
  try {
    const thoughts = getThoughts().map((t) => ({
      id: t.slug,
      title: t.metadata.title,
      excerpt: t.metadata.excerpt || "",
      type: "thought",
      link: `/thoughts/${t.slug}`,
      tags: t.metadata.tags || [],
      date: t.metadata.date,
    }));

    const poetry = getPoetry().map((p) => ({
      id: p.slug,
      title: p.metadata.title,
      excerpt: p.metadata.excerpt || "",
      type: "poetry",
      link: `/poetry/${p.slug}`,
      tags: p.metadata.tags || [],
      date: p.metadata.date,
    }));

    const experiments = getExperiments().map((e) => ({
      id: e.slug,
      title: e.metadata.title,
      excerpt: e.metadata.excerpt || "",
      type: "experiment",
      link: e.metadata.link || "/experiments",
      tags: e.metadata.tags || [],
      date: e.metadata.date,
    }));

    const library = getLibrary().map((l) => ({
      id: l.slug,
      title: l.metadata.title,
      excerpt: l.metadata.quote || l.metadata.reflection || "",
      type: "library",
      link: `/library/${l.slug}`,
      tags: l.metadata.tags || [],
      creator: l.metadata.author,
      libraryType: "book",
    }));

    const staticLib = staticArchiveItems.map((s) => ({
      id: s.id,
      title: s.title,
      excerpt: s.note || "",
      type: "library",
      link: s.link || "/library",
      tags: s.tags || [],
      creator: s.creator,
      libraryType: s.type,
    }));

    const allItems = [
      ...thoughts,
      ...poetry,
      ...experiments,
      ...library,
      ...staticLib,
    ];

    return NextResponse.json(allItems);
  } catch (error) {
    console.error("Failed to build search index:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
