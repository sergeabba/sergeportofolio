import { ImageResponse } from "next/og";

export const alt = "Mbaitadjim Abba Serge — Rédacteur web & Data analyst";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#ffffff",
          color: "#0a0a0a",
        }}
      >
        <div style={{ display: "flex", fontSize: 26, letterSpacing: 4, color: "rgba(23,22,26,0.55)" }}>
          PORTFOLIO · DAKAR, SÉNÉGAL
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 150, fontWeight: 700, lineHeight: 0.98, letterSpacing: -7 }}>
          <div style={{ display: "flex" }}>Des mots.</div>
          <div style={{ display: "flex", color: "#4f46e5" }}>Des chiffres.</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 40, fontWeight: 700 }}>Mbaitadjim Abba Serge</div>
            <div style={{ fontSize: 30, color: "rgba(23,22,26,0.7)", marginTop: 8 }}>
              Rédacteur web &amp; Data analyst
            </div>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ width: 22, height: 22, borderRadius: 11, background: "#2563eb" }} />
            <div style={{ width: 22, height: 22, borderRadius: 11, background: "#7c3aed" }} />
          </div>
        </div>
      </div>
    ),
    size
  );
}
