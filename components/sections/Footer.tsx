"use client";

export default function Footer() {
  return (
    <footer style={{ padding: "1.5rem 0", background: "var(--bg)" }}>
      <div className="container" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", textAlign: "center" }}>
        <span style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", color: "var(--text-faint)" }}>
          © {new Date().getFullYear()} · Mbaitadjim Abba Serge  Le Don
        </span>
        <span className="label-tag" style={{ color: "rgba(37,99,235,0.35)" }}>
          {/* Label additionnel possible ici */}
        </span>
      </div>
    </footer>
  );
}
