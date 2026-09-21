import { ImageResponse } from "next/og";

export const alt = "Tharros Canada: Canadian market research for European companies";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#f4f1ea", color: "#1c1d1f", borderTop: "14px solid #9e3a35" }}>
        <div style={{ display: "flex", fontSize: 34, letterSpacing: 6, fontWeight: 700 }}>
          THARROS<span style={{ color: "#9e3a35", margin: "0 14px" }}>/</span>CANADA
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 78, lineHeight: 1.02, letterSpacing: -2, maxWidth: 960 }}>Understand the Canadian market before you enter it.</div>
          <div style={{ marginTop: 28, fontSize: 30, color: "#45484d" }}>Market research for European companies evaluating Canada</div>
        </div>
      </div>
    ),
    size,
  );
}
