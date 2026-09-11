import { ImageResponse } from "next/og";

export const alt = "Divyansh Raj — Java Full-Stack · AI Portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "64px 72px",
          background: "linear-gradient(160deg, #0c0f14 0%, #121820 50%, #0a0d12 100%)",
          color: "#f1f5f9",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 28,
            color: "#38bdf8",
            fontWeight: 600,
            marginBottom: 16,
          }}
        >
          Java Full-Stack · Spring Boot & Angular
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            marginBottom: 24,
          }}
        >
          Divyansh Raj
        </div>
        <div style={{ fontSize: 32, color: "#94a3b8", maxWidth: 900, lineHeight: 1.35 }}>
          Ask about SlantPOS, SaaS products & AWS deploys — chat or voice on
          ai.divyanshraj.in
        </div>
        <div
          style={{
            display: "flex",
            gap: 32,
            marginTop: 48,
            fontSize: 26,
            color: "#e2e8f0",
          }}
        >
          <span>3+ yrs production</span>
          <span>5 shipped products</span>
          <span>3 live deployments</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
