"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Mot de passe incorrect");
      }
    } catch {
      setError("Erreur de connexion. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--revo-black)", padding: "1rem" }}>
      {/* Background orb */}
      <div style={{ position: "fixed", width: 600, height: 600, borderRadius: "50%", background: "var(--revo-blue)", opacity: 0.05, filter: "blur(120px)", top: "10%", left: "50%", transform: "translateX(-50%)", pointerEvents: "none" }} />

      <div style={{ position: "relative", width: "100%", maxWidth: 400 }}>
        {/* Logo area */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ width: 48, height: 48, borderRadius: "14px", background: "var(--revo-blue)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
            <Lock size={22} color="#fff" />
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "1.5rem", color: "#fff", letterSpacing: "-0.03em" }}>Administration</h1>
          <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.45)", marginTop: "0.25rem" }}>sergeportfolio.vercel.app</p>
        </div>

        {/* Card */}
        <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: "20px", padding: "2rem", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(12px)" }}>
          {error && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "rgba(226,59,74,0.12)", color: "#f87171", border: "1px solid rgba(226,59,74,0.25)", borderRadius: "10px", padding: "0.75rem 1rem", fontSize: "0.82rem", fontWeight: 600, marginBottom: "1.25rem" }}>
              <AlertCircle size={14} /> {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoFocus
                placeholder="••••••••"
                style={{
                  width: "100%", padding: "0.75rem 1rem", borderRadius: "10px",
                  background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
                  color: "#fff", fontSize: "0.9rem", outline: "none",
                  fontFamily: "var(--font-body)", boxSizing: "border-box",
                  transition: "border-color 0.2s",
                }}
                onFocus={e => (e.currentTarget.style.borderColor = "var(--revo-blue)")}
                onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "0.85rem", borderRadius: "10px",
                background: loading ? "rgba(73,79,223,0.6)" : "var(--revo-blue)",
                color: "#fff", border: "none", cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "0.9rem",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                transition: "background 0.2s",
              }}
            >
              {loading ? <><Loader2 size={16} className="animate-spin" /> Connexion…</> : "Se connecter →"}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.72rem", color: "rgba(255,255,255,0.2)" }}>
          Accès réservé · Portfolio Admin
        </p>
      </div>
    </div>
  );
}
