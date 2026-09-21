import { ImageResponse } from "next/og";

export const alt = "Tharros Canada: Canadian market research for European companies";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#f3f0e8", color: "#11233b", borderTop: "14px solid #ad303a" }}>
        <div style={{ display: "flex", fontSize: 34, letterSpacing: 6, fontWeight: 700 }}>
          THARROS<span style={{ color: "#ad303a", margin: "0 14px" }}>/</span>CANADA
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 78, lineHeight: 1.02, letterSpacing: -2, maxWidth: 960 }}>Understand the Canadian market before you enter it.</div>
          <div style={{ marginTop: 28, fontSize: 30, color: "#415067" }}>Market research for European companies evaluating Canada</div>
        </div>
      </div>
    ),
    size,
  );
}
