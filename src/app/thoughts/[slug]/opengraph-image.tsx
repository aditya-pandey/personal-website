import { ImageResponse } from "next/og";
import { getThoughtBySlug } from "@/lib/content";

export const alt = "Aditya Pandey | Thoughts";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const thought = getThoughtBySlug(slug);

  if (!thought) {
    return new Response("Not Found", { status: 404 });
  }

  // Slice excerpt to fit safely
  const rawExcerpt = thought.metadata.excerpt || thought.content.slice(0, 150) + "...";
  const excerpt = rawExcerpt.length > 160 ? rawExcerpt.slice(0, 157) + "..." : rawExcerpt;
  
  const formattedDate = new Date(thought.metadata.date).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    day: "numeric",
  });

  return new ImageResponse(
    (
      <div
        style={{
          background: "#FAF9F6",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "90px",
          border: "24px solid #E6E2D8",
          fontFamily: "Georgia, serif",
          color: "#2C2C2B",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Metadata Stamp */}
          <div
            style={{
              fontFamily: "system-ui, sans-serif",
              fontSize: "16px",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              color: "#C5A059",
              fontWeight: "600",
            }}
          >
            Thought / {formattedDate}
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: "64px",
              lineHeight: "1.15",
              fontWeight: "400",
              color: "#1A1A1A",
              maxWidth: "950px",
            }}
          >
            {thought.metadata.title}
          </div>

          {/* Excerpt */}
          <div
            style={{
              fontSize: "24px",
              lineHeight: "1.6",
              color: "#5C5C5A",
              marginTop: "16px",
              maxWidth: "850px",
              fontStyle: "italic",
            }}
          >
            {excerpt}
          </div>
        </div>

        {/* Footer Branding */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #E6E2D8",
            paddingTop: "32px",
            fontFamily: "system-ui, sans-serif",
            fontSize: "14px",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            color: "#8C8C8A",
          }}
        >
          <div>Aditya Pandey</div>
          <div>technology & stories</div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
