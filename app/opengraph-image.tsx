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
          background: "#f7f4ee",
          color: "#17161a",
        }}
      >
        <div style={{ display: "flex", fontSize: 26, letterSpacing: 4, color: "rgba(23,22,26,0.55)" }}>
          PORTFOLIO · DAKAR, SÉNÉGAL
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 92, lineHeight: 1.05, letterSpacing: -2 }}>
            Des&nbsp;<span style={{ color: "#b93d0b" }}>mots</span>&nbsp;qui se lisent,
          </div>
          <div style={{ display: "flex", fontSize: 92, lineHeight: 1.05, letterSpacing: -2 }}>
            des&nbsp;<span style={{ color: "#1f4fd1" }}>chiffres</span>&nbsp;qui prouvent.
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 40, fontWeight: 700 }}>Mbaitadjim Abba Serge</div>
            <div style={{ fontSize: 30, color: "rgba(23,22,26,0.7)", marginTop: 8 }}>
              Rédacteur web &amp; Data analyst
            </div>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ width: 22, height: 22, borderRadius: 11, background: "#b93d0b" }} />
            <div style={{ width: 22, height: 22, borderRadius: 11, background: "#1f4fd1" }} />
          </div>
        </div>
      </div>
    ),
    size
  );
}
