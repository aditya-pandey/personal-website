import { ImageResponse } from "next/og";
import { getPoetryBySlug } from "@/lib/content";

export const alt = "Aditya Pandey | Poetry";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const poem = getPoetryBySlug(slug);

  if (!poem) {
    return new Response("Not Found", { status: 404 });
  }

  // Handle excerpt fallback and size limits
  const rawExcerpt = poem.metadata.excerpt || poem.content.slice(0, 150) + "...";
  const excerpt = rawExcerpt.length > 140 ? rawExcerpt.slice(0, 137) + "..." : rawExcerpt;
  
  const year = new Date(poem.metadata.date).getFullYear();

  return new ImageResponse(
    (
      <div
        style={{
          background: "radial-gradient(circle at 50% 30%, #FAF9F6 0%, #F3EFEA 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "100px",
          border: "20px solid #E6E2D8",
          fontFamily: "Georgia, serif",
          color: "#2C2C2B",
          textAlign: "center",
        }}
      >
        {/* Top Header Label */}
        <div
          style={{
            fontFamily: "system-ui, sans-serif",
            fontSize: "14px",
            textTransform: "uppercase",
            letterSpacing: "0.25em",
            color: "#8C8C8A",
            fontWeight: "500",
          }}
        >
          Poetry Archive &middot; {year}
        </div>

        {/* Center Content Group */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
            marginTop: "-20px",
          }}
        >
          {/* Poem Title */}
          <div
            style={{
              fontSize: "68px",
              fontStyle: "italic",
              lineHeight: "1.2",
              color: "#1A1A1A",
              maxWidth: "800px",
            }}
          >
            {poem.metadata.title}
          </div>

          {/* Excerpt */}
          <div
            style={{
              fontSize: "26px",
              lineHeight: "1.7",
              color: "#5C5C5A",
              maxWidth: "700px",
              fontWeight: "300",
            }}
          >
            {excerpt}
          </div>
        </div>

        {/* Bottom Branding */}
        <div
          style={{
            fontFamily: "system-ui, sans-serif",
            fontSize: "14px",
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            color: "#C5A059",
            fontWeight: "600",
            borderTop: "1px solid #E6E2D8",
            paddingTop: "24px",
            width: "300px",
          }}
        >
          निर्वाण से पहले
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
