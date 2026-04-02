"use client";

export default function Footer() {
  return (
    <footer style={{ padding: "1.75rem 0" }}>
      <div
        className="container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "0.75rem",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.78rem",
            color: "var(--text-faint)",
          }}
        >
          © {new Date().getFullYear()} · Mbaitadjim Abba Serge — Le Don
        </span>
        <div style={{ display: "flex", gap: "1.25rem", alignItems: "center" }}>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.7rem",
              color: "var(--text-faint)",
              opacity: 0.6,
            }}
          >
            Next.js · Tailwind · Framer Motion
          </span>
          <div
            style={{
              width: 4,
              height: 4,
              borderRadius: "50%",
              background: "var(--primary)",
              opacity: 0.4,
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.7rem",
              color: "var(--text-faint)",
              opacity: 0.6,
            }}
          >
            Dakar, Sénégal 🇸🇳
          </span>
        </div>
      </div>
    </footer>
  );
}