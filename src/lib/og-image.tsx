import { readFileSync } from "node:fs";
import { ImageResponse } from "next/og";

function readFontFile(relativePath: string): ArrayBuffer {
  const buffer = readFileSync(new URL(relativePath, import.meta.url));
  return buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength,
  ) as ArrayBuffer;
}

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const colors = {
  ivory: "#ffffff",
  ivoryLight: "#ffffff",
  ink: "#151515",
  inkSoft: "#4f4a4b",
  slate: "#625c5e",
  softBlack: "#151515",
  onDark: "#ffffff",
  onDarkSoft: "#ded9db",
  red: "#782c3d",
  rule: "#d9d3d5",
  ruleDark: "#65565b",
} as const;

let fontData: { sans: ArrayBuffer } | null = null;

function loadOgFonts() {
  if (!fontData) {
    fontData = {
      sans: readFontFile("../assets/og-fonts/schibsted-grotesk.ttf"),
    };
  }
  return fontData;
}

export type OgMeta = { label: string; value: string };

export type OgCardProps = {
  tone: "dark" | "light";
  eyebrow: string;
  title: string;
  description?: string;
  meta: OgMeta[];
};

export function renderOgImage({ tone, eyebrow, title, description, meta }: OgCardProps) {
  const { sans } = loadOgFonts();
  const dark = tone === "dark";
  const bg = dark ? colors.softBlack : colors.ivory;
  const fg = dark ? colors.onDark : colors.ink;
  const fgSoft = dark ? colors.onDarkSoft : colors.inkSoft;
  const rule = dark ? colors.ruleDark : colors.rule;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "56px 72px 48px",
        background: bg,
        color: fg,
        fontFamily: "Schibsted Grotesk",
        borderTop: `14px solid ${colors.red}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 28,
            letterSpacing: -0.8,
            fontWeight: 700,
          }}
        >
          THARROS<span style={{ color: colors.red, margin: "0 12px" }}>/</span>
          <span
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              fontSize: 16,
              letterSpacing: -0.2,
              lineHeight: 1.1,
            }}
          >
            <span>Canada</span>
            <span>Student research</span>
          </span>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 16,
            letterSpacing: 2,
            fontWeight: 700,
            color: fgSoft,
            textTransform: "uppercase",
          }}
        >
          {eyebrow}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", maxWidth: 980 }}>
        <div
          style={{
            display: "flex",
            fontFamily: "Schibsted Grotesk",
            fontWeight: 700,
            fontSize: title.length > 40 ? 60 : 74,
            lineHeight: 1.04,
            letterSpacing: -1.5,
            color: fg,
          }}
        >
          {title}
        </div>
        {description && (
          <div
            style={{
              display: "flex",
              marginTop: 24,
              fontSize: 24,
              lineHeight: 1.5,
              color: fgSoft,
              maxWidth: 860,
            }}
          >
            {description}
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 56, paddingTop: 20, borderTop: `1px solid ${rule}` }}>
        {meta.map((item) => (
          <div key={item.label} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span
              style={{
                display: "flex",
                fontSize: 13,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                color: fgSoft,
              }}
            >
              {item.label}
            </span>
            <span style={{ display: "flex", fontSize: 18, fontWeight: 650, color: fg }}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>,
    {
      ...ogSize,
      fonts: [{ name: "Schibsted Grotesk", data: sans, style: "normal", weight: 700 }],
    },
  );
}
