import { ImageResponse } from "next/og";

export const alt = "Aditya Pandey | Experiments & Projects";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
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
          border: "20px solid #E6E2D8",
          fontFamily: "system-ui, -apple-system, sans-serif",
          color: "#2C2C2B",
          position: "relative",
        }}
      >
        {/* Subtle grid lines background overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            pointerEvents: "none",
            opacity: 0.15,
          }}
        >
          <div style={{ width: "100%", height: "1px", background: "#2C2C2B" }} />
          <div style={{ width: "100%", height: "1px", background: "#2C2C2B" }} />
          <div style={{ width: "100%", height: "1px", background: "#2C2C2B" }} />
          <div style={{ width: "100%", height: "1px", background: "#2C2C2B" }} />
        </div>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            justifyContent: "space-between",
            pointerEvents: "none",
            opacity: 0.15,
          }}
        >
          <div style={{ width: "1px", height: "100%", background: "#2C2C2B" }} />
          <div style={{ width: "1px", height: "100%", background: "#2C2C2B" }} />
          <div style={{ width: "1px", height: "100%", background: "#2C2C2B" }} />
          <div style={{ width: "1px", height: "100%", background: "#2C2C2B" }} />
        </div>

        {/* Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Tagline */}
          <div
            style={{
              fontSize: "14px",
              fontFamily: "monospace",
              textTransform: "uppercase",
              letterSpacing: "0.3em",
              color: "#C5A059",
              fontWeight: "bold",
            }}
          >
            CONCEPTS / DESIGN / CODE
          </div>

          {/* Page Title */}
          <div
            style={{
              fontSize: "60px",
              lineHeight: "1.1",
              fontWeight: "800",
              color: "#1A1A1A",
              letterSpacing: "-0.02em",
              marginTop: "16px",
            }}
          >
            Experiments & Projects
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: "24px",
              lineHeight: "1.6",
              color: "#5C5C5A",
              maxWidth: "750px",
              marginTop: "10px",
            }}
          >
            A curated space for creative engineering, prototyping interactive concepts, and pursuing structured code design experiments.
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #E6E2D8",
            paddingTop: "32px",
            fontSize: "14px",
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            color: "#8C8C8A",
          }}
        >
          <div>Aditya Pandey</div>
          <div style={{ fontFamily: "monospace" }}>aditya-projects // index_</div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
