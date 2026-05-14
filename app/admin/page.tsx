"use client";

import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import type { Projet } from "@/lib/types";
import { useRouter } from "next/navigation";
import {
  Plus, Edit2, Trash2, LogOut, Loader2, Link as LinkIcon,
  Image as ImageIcon, GripVertical, Upload, User, FolderOpen,
  CheckCircle, AlertCircle, X, ChevronRight, Camera,
} from "lucide-react";
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors, DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates,
  rectSortingStrategy, useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// ─── Toast ────────────────────────────────────────────────────────────────────
type ToastType = "success" | "error";
function Toast({ msg, type, onClose }: { msg: string; type: ToastType; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return (
    <div style={{
      position: "fixed", bottom: "2rem", right: "2rem", zIndex: 9999,
      display: "flex", alignItems: "center", gap: "0.6rem",
      background: type === "success" ? "var(--revo-mint)" : "var(--danger)",
      color: "#fff", borderRadius: "12px", padding: "0.75rem 1.25rem",
      fontSize: "0.85rem", fontWeight: 600, boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
      animation: "slideUp 0.3s ease",
    }}>
      {type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
      {msg}
      <button onClick={onClose} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", marginLeft: "0.25rem", display: "flex" }}><X size={14} /></button>
    </div>
  );
}

// ─── Sortable card ─────────────────────────────────────────────────────────────
function SortableProjectCard({
  projet, onEdit, onDelete,
}: {
  projet: Projet & { id: string };
  onEdit: (p: Projet & { id: string }) => void;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: projet.id });
  return (
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 10 : 1, opacity: isDragging ? 0.65 : 1 }}>
      <div style={{
        background: "var(--bg-elevated)", borderRadius: "var(--r-card)", overflow: "hidden",
        border: isDragging ? "2px solid var(--revo-blue)" : "1px solid var(--border)",
        position: "relative", display: "flex", flexDirection: "column",
      }}>
        {/* Drag handle */}
        <div {...attributes} {...listeners} style={{ position: "absolute", top: "0.5rem", left: "0.5rem", zIndex: 10, background: "var(--bg)", border: "1px solid var(--border)", padding: "0.35rem", borderRadius: "8px", cursor: "grab", color: "var(--text-tertiary)", boxShadow: "0 2px 6px rgba(0,0,0,0.12)" }}>
          <GripVertical size={14} />
        </div>
        {/* Image */}
        <div style={{ height: 150, position: "relative", background: "var(--bg-layer)", flexShrink: 0 }}>
          {projet.src ? (
            <Image src={projet.src} alt={projet.titre} fill className="object-cover" sizes="300px" />
          ) : (
            <div style={{ inset: 0, position: "absolute", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-tertiary)" }}>
              <ImageIcon size={32} />
            </div>
          )}
          <span style={{ position: "absolute", top: "0.5rem", right: "0.5rem", background: "var(--revo-blue)", color: "#fff", padding: "0.15rem 0.55rem", borderRadius: "9999px", fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>
            {projet.cat}
          </span>
          {projet.gallery && projet.gallery.length > 0 && (
            <span style={{ position: "absolute", bottom: "0.4rem", right: "0.5rem", background: "rgba(0,0,0,0.6)", color: "#fff", padding: "0.1rem 0.45rem", borderRadius: "9999px", fontSize: "0.55rem", fontWeight: 600, backdropFilter: "blur(4px)" }}>
              +{projet.gallery.length} photos
            </span>
          )}
        </div>
        {/* Content */}
        <div style={{ padding: "1rem 1.1rem", flex: 1, display: "flex", flexDirection: "column" }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "1rem", marginBottom: "0.35rem", lineHeight: 1.3 }}>{projet.titre}</h3>
          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.75rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", flex: 1 }}>{projet.desc}</p>
          {projet.lien && (
            <a href={projet.lien} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", fontSize: "0.72rem", color: "var(--revo-blue)", textDecoration: "none", marginBottom: "0.75rem", pointerEvents: isDragging ? "none" : "auto" }}>
              <LinkIcon size={12} /> {projet.lienLabel || projet.lien.replace("https://", "")}
            </a>
          )}
          <div style={{ display: "flex", gap: "0.75rem", borderTop: "1px solid var(--border)", paddingTop: "0.75rem" }}>
            <button onPointerDown={e => e.stopPropagation()} onClick={() => onEdit(projet)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.35rem", background: "var(--bg)", border: "1px solid var(--border)", padding: "0.45rem", borderRadius: "8px", fontSize: "0.72rem", fontWeight: 600, cursor: "pointer", color: "var(--text)", transition: "border-color 0.2s" }}>
              <Edit2 size={13} /> Éditer
            </button>
            <button onPointerDown={e => e.stopPropagation()} onClick={() => onDelete(projet.id)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.35rem", background: "rgba(226,59,74,0.05)", border: "1px solid rgba(226,59,74,0.15)", padding: "0.45rem", borderRadius: "8px", fontSize: "0.72rem", fontWeight: 600, cursor: "pointer", color: "var(--danger)", transition: "all 0.2s" }}>
              <Trash2 size={13} /> Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Field helper ──────────────────────────────────────────────────────────────
function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, marginBottom: "0.4rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</label>
      {children}
      {hint && <p style={{ fontSize: "0.65rem", color: "var(--text-tertiary)", marginTop: "0.3rem" }}>{hint}</p>}
    </div>
  );
}

// ─── Dashboard ─────────────────────────────────────────────────────────────────
const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
const MAX_SIZE = 5 * 1024 * 1024;

interface ProfileData {
  name: string;
  lastName: string;
  role: string;
  location: string;
  statusLabel: string;
  photoUrl: string;
  pills: string;
  bio: string;
}

const DEFAULT_PROFILE: ProfileData = {
  name: "ABBA SERGE",
  lastName: "MBAITADJIM",
  role: "Data Analyst Junior & IT Support",
  location: "Dakar, Sénégal",
  statusLabel: "Disponible",
  photoUrl: "/photo.jpg",
  pills: "Master Big Data, Data Stratégie, ISM Dakar",
  bio: "Avec une première expérience professionnelle dans le domaine",
};

export default function AdminDashboard() {
  const router = useRouter();

  // tabs: "projects" | "profile"
  const [tab, setTab] = useState<"projects" | "profile">("projects");

  // ── Projects state ──
  const [projets, setProjets] = useState<(Projet & { id: string })[]>([]);
  const [loadingProjets, setLoadingProjets] = useState(true);
  const [filterCat, setFilterCat] = useState("Tous");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    titre: "", desc: "", cat: "Gaming", tags: "", src: "",
    lien: "", lienLabel: "Voir le projet", liveUrl: "", gallery: [] as string[],
  });

  // ── Profile state ──
  const [profile, setProfile] = useState<ProfileData>(DEFAULT_PROFILE);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  // ── Toast ──
  const [toast, setToast] = useState<{ msg: string; type: ToastType } | null>(null);
  const showToast = useCallback((msg: string, type: ToastType = "success") => setToast({ msg, type }), []);

  // ── Fetch projects ──
  const fetchProjets = useCallback(async () => {
    setLoadingProjets(true);
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (Array.isArray(data)) setProjets(data);
    } catch { /* ignore */ }
    setLoadingProjets(false);
  }, []);

  // ── Fetch profile ──
  const fetchProfile = useCallback(async () => {
    setLoadingProfile(true);
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        if (data && Object.keys(data).length > 0) setProfile({ ...DEFAULT_PROFILE, ...data });
      }
    } catch { /* use defaults */ }
    setLoadingProfile(false);
  }, []);

  useEffect(() => { fetchProjets(); fetchProfile(); }, [fetchProjets, fetchProfile]);

  // ── Logout ──
  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  // ── File validation ──
  const validateFile = (f: File) => {
    if (!ALLOWED_MIME.includes(f.type)) return `Type non autorisé : ${f.type}`;
    if (f.size > MAX_SIZE) return `Fichier trop lourd (max 5 Mo)`;
    return null;
  };

  const uploadFile = async (f: File): Promise<string | null> => {
    const err = validateFile(f);
    if (err) { showToast(err, "error"); return null; }
    const ext = f.type.split("/")[1] ?? "jpg";
    const path = `uploads/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("portfolio").upload(path, f);
    if (error) { showToast("Erreur upload : " + error.message, "error"); return null; }
    return supabase.storage.from("portfolio").getPublicUrl(path).data.publicUrl;
  };

  // ── Photo preview ──
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const err = validateFile(f);
    if (err) { showToast(err, "error"); return; }
    setPhotoFile(f);
    setPhotoPreview(URL.createObjectURL(f));
  };

  // ── Save profile ──
  const handleSaveProfile = async () => {
    setSavingProfile(true);
    let finalPhotoUrl = profile.photoUrl;
    if (photoFile) {
      const url = await uploadFile(photoFile);
      if (url) finalPhotoUrl = url;
    }
    const payload = { ...profile, photoUrl: finalPhotoUrl };
    try {
      const res = await fetch("/api/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        setProfile(payload);
        setPhotoFile(null);
        setPhotoPreview(null);
        showToast("Profil sauvegardé !");
      } else {
        showToast(json.error ?? `Erreur ${res.status}`, "error");
      }
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Erreur réseau", "error");
    } finally {
      setSavingProfile(false);
    }
  };

  // ── Project modal ──
  const handleOpenModal = (p?: Projet & { id: string }) => {
    if (p) {
      setEditingId(p.id);
      setFormData({ titre: p.titre, desc: p.desc, cat: p.cat, tags: p.tags?.join(", ") || "", src: p.src, lien: p.lien || "", lienLabel: p.lienLabel || "Voir le projet", liveUrl: p.liveUrl || "", gallery: p.gallery || [] });
    } else {
      setEditingId(null);
      setFormData({ titre: "", desc: "", cat: "Gaming", tags: "", src: "", lien: "", lienLabel: "Voir le projet", liveUrl: "", gallery: [] });
    }
    setFile(null);
    setGalleryFiles([]);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce projet ?")) return;
    const res = await fetch("/api/projects", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) showToast(json.error ?? "Erreur suppression", "error");
    else { showToast("Projet supprimé"); fetchProjets(); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    let finalSrc = formData.src;
    if (file) { const u = await uploadFile(file); if (u) finalSrc = u; }
    const finalGallery = [...formData.gallery];
    for (const gf of galleryFiles) {
      const u = await uploadFile(gf);
      if (u) finalGallery.push(u);
    }
    const payload = {
      titre: formData.titre, desc: formData.desc, cat: formData.cat,
      tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean),
      src: finalSrc, lien: formData.lien || null, lienLabel: formData.lienLabel || null,
      liveUrl: formData.liveUrl || null, gallery: finalGallery,
      ...(!editingId && { position: projets.length }),
    };
    let res: Response;
    if (editingId) {
      res = await fetch("/api/projects", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editingId, ...payload }) });
    } else {
      res = await fetch("/api/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    }
    const json = await res.json().catch(() => ({}));
    setUploading(false);
    if (!res.ok) { showToast(json.error ?? "Erreur serveur", "error"); return; }
    setIsModalOpen(false);
    showToast(editingId ? "Projet mis à jour !" : "Projet créé !");
    fetchProjets();
  };

  // ── DnD ──
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const oldIdx = projets.findIndex(p => p.id === active.id);
    const newIdx = projets.findIndex(p => p.id === over.id);
    const reordered = arrayMove(projets, oldIdx, newIdx).map((p, i) => ({ ...p, position: i }));
    setProjets(reordered);
    await Promise.all(reordered.map(p =>
      fetch("/api/projects", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: p.id, position: p.position }) })
    ));
  };

  const categories = useMemo(() => ["Tous", ...Array.from(new Set(projets.map(p => p.cat)))], [projets]);
  const displayed = filterCat === "Tous" ? projets : projets.filter(p => p.cat === filterCat);

  // ── Render ──
  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* Sidebar + Content layout */}
      <div style={{ display: "flex", minHeight: "100vh" }}>

        {/* Sidebar */}
        <aside style={{ width: 220, background: "var(--bg-elevated)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", padding: "2rem 1rem", gap: "0.25rem", flexShrink: 0 }}>
          <div style={{ marginBottom: "1.5rem", paddingLeft: "0.5rem" }}>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem", letterSpacing: "-0.02em" }}>Admin</p>
            <p style={{ fontSize: "0.65rem", color: "var(--text-tertiary)", marginTop: "0.1rem" }}>sergeportfolio</p>
          </div>

          {([
            { id: "projects", icon: <FolderOpen size={15} />, label: "Projets" },
            { id: "profile", icon: <User size={15} />, label: "Profil & Hero" },
          ] as const).map(item => (
            <button key={item.id} onClick={() => setTab(item.id)} style={{
              display: "flex", alignItems: "center", gap: "0.6rem",
              padding: "0.6rem 0.75rem", borderRadius: "10px", border: "none", cursor: "pointer",
              background: tab === item.id ? "var(--revo-blue)" : "transparent",
              color: tab === item.id ? "#fff" : "var(--text-secondary)",
              fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.82rem",
              textAlign: "left", transition: "all 0.18s",
            }}>
              {item.icon} {item.label}
              {tab === item.id && <ChevronRight size={12} style={{ marginLeft: "auto" }} />}
            </button>
          ))}

          <div style={{ marginTop: "auto" }}>
            <button onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: "0.6rem", width: "100%", padding: "0.6rem 0.75rem", borderRadius: "10px", border: "none", cursor: "pointer", background: "rgba(226,59,74,0.08)", color: "var(--danger)", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.82rem" }}>
              <LogOut size={15} /> Déconnexion
            </button>
          </div>
        </aside>

        {/* Main */}
        <main style={{ flex: 1, padding: "2.5rem", overflowX: "hidden" }}>

          {/* ── TAB: PROJECTS ── */}
          {tab === "projects" && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem" }}>
                <div>
                  <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "1.6rem", letterSpacing: "-0.03em", marginBottom: "0.25rem" }}>Projets</h1>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>{projets.length} projet{projets.length > 1 ? "s" : ""} · Glissez pour réordonner</p>
                </div>
                <button onClick={() => handleOpenModal()} className="btn-primary" style={{ padding: "0.6rem 1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Plus size={15} /> Ajouter
                </button>
              </div>

              {/* Filters */}
              {projets.length > 0 && (
                <div style={{ display: "flex", gap: "0.4rem", marginBottom: "2rem", flexWrap: "wrap" }}>
                  {categories.map(c => (
                    <button key={c} onClick={() => setFilterCat(c)} style={{
                      background: filterCat === c ? "var(--revo-black)" : "transparent",
                      color: filterCat === c ? "#fff" : "var(--text-secondary)",
                      border: filterCat === c ? "1px solid transparent" : "1px solid var(--border)",
                      padding: "0.35rem 1rem", borderRadius: "9999px", fontSize: "0.78rem",
                      fontWeight: 600, cursor: "pointer", transition: "all 0.18s",
                    }}>{c}</button>
                  ))}
                  {filterCat !== "Tous" && <span style={{ fontSize: "0.7rem", color: "var(--text-tertiary)", alignSelf: "center", marginLeft: "0.25rem" }}>Drag & drop désactivé</span>}
                </div>
              )}

              {loadingProjets ? (
                <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}><Loader2 size={28} className="animate-spin" color="var(--revo-blue)" /></div>
              ) : projets.length === 0 ? (
                <div style={{ textAlign: "center", padding: "5rem 2rem", color: "var(--text-tertiary)", background: "var(--bg-elevated)", borderRadius: "var(--r-card)", border: "1px dashed var(--border-strong)" }}>
                  <FolderOpen size={40} style={{ marginBottom: "1rem", opacity: 0.4 }} />
                  <p style={{ fontWeight: 600, marginBottom: "0.5rem" }}>Aucun projet</p>
                  <p style={{ fontSize: "0.82rem" }}>Cliquez sur "Ajouter" pour créer votre premier projet.</p>
                </div>
              ) : filterCat === "Tous" ? (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={projets.map(p => p.id)} strategy={rectSortingStrategy}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>
                      {projets.map(p => <SortableProjectCard key={p.id} projet={p} onEdit={handleOpenModal} onDelete={handleDelete} />)}
                    </div>
                  </SortableContext>
                </DndContext>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>
                  {displayed.map(p => <SortableProjectCard key={p.id} projet={p} onEdit={handleOpenModal} onDelete={handleDelete} />)}
                </div>
              )}
            </>
          )}

          {/* ── TAB: PROFILE ── */}
          {tab === "profile" && (
            <>
              <div style={{ marginBottom: "2rem" }}>
                <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "1.6rem", letterSpacing: "-0.03em", marginBottom: "0.25rem" }}>Profil & Hero</h1>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>Modifiez les informations affichées sur la page d'accueil.</p>
              </div>

              {loadingProfile ? (
                <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}><Loader2 size={28} className="animate-spin" color="var(--revo-blue)" /></div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", maxWidth: 900 }}>

                  {/* Photo */}
                  <div style={{ gridColumn: "1 / -1", background: "var(--bg-elevated)", borderRadius: "var(--r-card)", padding: "1.5rem", border: "1px solid var(--border)" }}>
                    <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1.25rem" }}>Photo de profil</p>
                    <div style={{ display: "flex", alignItems: "center", gap: "2rem", flexWrap: "wrap" }}>
                      {/* Preview */}
                      <div style={{ position: "relative", width: 110, height: 110, borderRadius: "50%", overflow: "hidden", border: "3px solid var(--revo-blue)", flexShrink: 0 }}>
                        <Image
                          src={photoPreview ?? profile.photoUrl}
                          alt="Photo profil"
                          fill
                          className="object-cover object-top"
                          sizes="110px"
                        />
                        <button
                          onClick={() => photoInputRef.current?.click()}
                          style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity 0.2s" }}
                          onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                          onMouseLeave={e => (e.currentTarget.style.opacity = "0")}
                        >
                          <Camera size={22} />
                        </button>
                      </div>
                      <div>
                        <p style={{ fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.35rem" }}>
                          {photoFile ? photoFile.name : "Aucun fichier sélectionné"}
                        </p>
                        <p style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginBottom: "0.75rem" }}>JPEG, PNG, WebP · max 5 Mo</p>
                        <button onClick={() => photoInputRef.current?.click()} style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.5rem 1rem", borderRadius: "9999px", border: "1px solid var(--border)", background: "var(--bg)", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", color: "var(--text)" }}>
                          <Upload size={13} /> Changer la photo
                        </button>
                        <input ref={photoInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhotoChange} />
                      </div>
                      {photoFile && (
                        <button onClick={() => { setPhotoFile(null); setPhotoPreview(null); }} style={{ marginLeft: "auto", background: "none", border: "none", color: "var(--text-tertiary)", cursor: "pointer", fontSize: "0.78rem" }}>Annuler</button>
                      )}
                    </div>
                  </div>

                  {/* Identité */}
                  <div style={{ background: "var(--bg-elevated)", borderRadius: "var(--r-card)", padding: "1.5rem", border: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Identité</p>
                    <Field label="Prénom / Nom affiché">
                      <input value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} className="form-input" style={{ width: "100%" }} placeholder="ABBA SERGE" />
                    </Field>
                    <Field label="Nom de famille (gris au-dessus)">
                      <input value={profile.lastName} onChange={e => setProfile(p => ({ ...p, lastName: e.target.value }))} className="form-input" style={{ width: "100%" }} placeholder="MBAITADJIM" />
                    </Field>
                    <Field label="Rôle / Titre">
                      <input value={profile.role} onChange={e => setProfile(p => ({ ...p, role: e.target.value }))} className="form-input" style={{ width: "100%" }} placeholder="Data Analyst Junior & IT Support" />
                    </Field>
                  </div>

                  {/* Disponibilité */}
                  <div style={{ background: "var(--bg-elevated)", borderRadius: "var(--r-card)", padding: "1.5rem", border: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Badge de statut</p>
                    <Field label="Statut" hint='Ex: "Disponible" ou "En poste"'>
                      <input value={profile.statusLabel} onChange={e => setProfile(p => ({ ...p, statusLabel: e.target.value }))} className="form-input" style={{ width: "100%" }} />
                    </Field>
                    <Field label="Localisation">
                      <input value={profile.location} onChange={e => setProfile(p => ({ ...p, location: e.target.value }))} className="form-input" style={{ width: "100%" }} />
                    </Field>
                    <Field label="Pills (séparés par virgule)" hint="Affiché sous le titre">
                      <input value={profile.pills} onChange={e => setProfile(p => ({ ...p, pills: e.target.value }))} className="form-input" style={{ width: "100%" }} placeholder="Master Big Data, Data Stratégie, ISM Dakar" />
                    </Field>
                  </div>

                  {/* Bouton save */}
                  <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "flex-end", gap: "1rem", paddingTop: "0.5rem", borderTop: "1px solid var(--border)" }}>
                    <button onClick={fetchProfile} disabled={savingProfile} style={{ padding: "0.6rem 1.25rem", borderRadius: "9999px", border: "1px solid var(--border)", background: "transparent", color: "var(--text)", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" }}>
                      Réinitialiser
                    </button>
                    <button onClick={handleSaveProfile} disabled={savingProfile} className="btn-primary" style={{ padding: "0.6rem 1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      {savingProfile ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle size={15} />}
                      {savingProfile ? "Sauvegarde..." : "Sauvegarder"}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

        </main>
      </div>

      {/* ── Modal Projet ── */}
      {isModalOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)" }} onClick={() => setIsModalOpen(false)} />
          <div style={{ position: "relative", width: "100%", maxWidth: 620, background: "var(--bg)", borderRadius: "var(--r-xl)", display: "flex", flexDirection: "column", maxHeight: "92vh", overflow: "hidden", border: "1px solid var(--border)", boxShadow: "0 24px 64px rgba(0,0,0,0.4)" }}>

            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg-elevated)" }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "1.1rem" }}>
                {editingId ? "Modifier le projet" : "Nouveau projet"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: "var(--bg-layer)", border: "none", borderRadius: "8px", padding: "0.3rem", cursor: "pointer", display: "flex", color: "var(--text-secondary)" }}><X size={18} /></button>
            </div>

            <div style={{ padding: "1.5rem", overflowY: "auto" }}>
              <form id="projet-form" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

                <Field label="Titre *">
                  <input required value={formData.titre} onChange={e => setFormData(f => ({ ...f, titre: e.target.value }))} className="form-input" style={{ width: "100%" }} />
                </Field>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <Field label="Catégorie *">
                    <select required value={formData.cat} onChange={e => setFormData(f => ({ ...f, cat: e.target.value }))} className="form-input" style={{ width: "100%", backgroundColor: "var(--bg-elevated)" }}>
                      {["Gaming", "IA Générative", "Canva", "Web", "Data"].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </Field>
                  <Field label="Tags (virgules)">
                    <input value={formData.tags} onChange={e => setFormData(f => ({ ...f, tags: e.target.value }))} placeholder="Design, Web..." className="form-input" style={{ width: "100%" }} />
                  </Field>
                </div>

                <Field label="Description *">
                  <textarea rows={3} required value={formData.desc} onChange={e => setFormData(f => ({ ...f, desc: e.target.value }))} className="form-input" style={{ width: "100%", resize: "vertical" }} />
                </Field>

                {/* Cover */}
                <div style={{ background: "var(--bg-layer)", padding: "1rem", borderRadius: "12px", border: "1px dashed var(--border-strong)" }}>
                  <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem" }}>Image de couverture</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "var(--bg-elevated)", border: "1px solid var(--border)", padding: "0.6rem 0.75rem", borderRadius: "8px", cursor: "pointer", fontSize: "0.82rem" }}>
                      <Upload size={14} color="var(--revo-blue)" />
                      <span style={{ color: file ? "var(--text)" : "var(--text-secondary)" }}>{file ? file.name : "Sélectionner un fichier..."}</span>
                      <input type="file" style={{ display: "none" }} onChange={e => { if (e.target.files?.[0]) setFile(e.target.files[0]); }} accept="image/*" />
                      {file && <button type="button" onClick={e => { e.preventDefault(); setFile(null); }} style={{ marginLeft: "auto", background: "none", border: "none", color: "var(--text-tertiary)", cursor: "pointer" }}><X size={13} /></button>}
                    </label>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
                      <span style={{ fontSize: "0.65rem", color: "var(--text-tertiary)" }}>OU URL</span>
                      <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
                    </div>
                    <input value={file ? "" : formData.src} disabled={!!file} onChange={e => setFormData(f => ({ ...f, src: e.target.value }))} placeholder="https://... ou /projets/image.jpg" className="form-input" style={{ width: "100%", opacity: file ? 0.4 : 1 }} />
                  </div>
                </div>

                {/* Liens */}
                <div style={{ background: "var(--bg-layer)", padding: "1rem", borderRadius: "12px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <Field label="Lien externe">
                    <input value={formData.lien} onChange={e => setFormData(f => ({ ...f, lien: e.target.value }))} placeholder="https://..." className="form-input" style={{ width: "100%" }} />
                  </Field>
                  <Field label="Texte du bouton">
                    <input value={formData.lienLabel} onChange={e => setFormData(f => ({ ...f, lienLabel: e.target.value }))} placeholder="Voir le site" className="form-input" style={{ width: "100%" }} />
                  </Field>
                  <Field label="URL live (iframe preview)" hint="Si différent du lien externe">
                    <input value={formData.liveUrl} onChange={e => setFormData(f => ({ ...f, liveUrl: e.target.value }))} placeholder="https://monsite.com" className="form-input" style={{ width: "100%" }} />
                  </Field>
                </div>

                {/* Gallery */}
                <div style={{ background: "var(--bg-layer)", padding: "1rem", borderRadius: "12px", border: "1px dashed var(--border-strong)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                    <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Galerie additionnelle</p>
                    <span style={{ fontSize: "0.58rem", padding: "0.15rem 0.45rem", background: "var(--revo-blue)", color: "#fff", borderRadius: 9999, fontWeight: 700 }}>{formData.gallery.length + galleryFiles.length}</span>
                  </div>
                  <label style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", background: "var(--bg-elevated)", border: "1px solid var(--border)", padding: "0.75rem", borderRadius: "8px", cursor: "pointer", fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                    <Upload size={14} color="var(--revo-blue)" /> Ajouter des images
                    <input type="file" multiple style={{ display: "none" }} onChange={e => { if (e.target.files) setGalleryFiles(g => [...g, ...Array.from(e.target.files!)]); }} accept="image/*" />
                  </label>
                  {galleryFiles.length > 0 && (
                    <div style={{ marginTop: "0.75rem", display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                      {galleryFiles.map((f, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.3rem", background: "var(--revo-blue)", color: "#fff", padding: "0.25rem 0.5rem", borderRadius: "6px", fontSize: "0.65rem", fontWeight: 600 }}>
                          {f.name.slice(0, 18)}{f.name.length > 18 ? "…" : ""}
                          <button type="button" onClick={() => setGalleryFiles(g => g.filter((_, j) => j !== i))} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", display: "flex" }}><X size={11} /></button>
                        </div>
                      ))}
                    </div>
                  )}
                  {formData.gallery.length > 0 && (
                    <div style={{ marginTop: "0.75rem", display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                      {formData.gallery.map((url, i) => (
                        <div key={url} style={{ position: "relative", width: 56, height: 56, borderRadius: 8, overflow: "hidden", border: "1px solid var(--border)" }}>
                          <Image src={url} alt="" fill className="object-cover" sizes="56px" />
                          <button type="button" onClick={() => setFormData(f => ({ ...f, gallery: f.gallery.filter(u => u !== url) }))} style={{ position: "absolute", top: 0, right: 0, background: "rgba(226,59,74,0.85)", border: "none", color: "#fff", cursor: "pointer", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "0 0 0 6px" }}><X size={10} /></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </form>
            </div>

            <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "flex-end", gap: "0.75rem", background: "var(--bg-elevated)" }}>
              <button type="button" onClick={() => setIsModalOpen(false)} disabled={uploading} style={{ padding: "0.6rem 1.25rem", borderRadius: "9999px", border: "1px solid var(--border)", background: "transparent", color: "var(--text)", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", opacity: uploading ? 0.5 : 1 }}>Annuler</button>
              <button type="submit" form="projet-form" disabled={uploading} className="btn-primary" style={{ padding: "0.6rem 1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                {uploading && <Loader2 size={15} className="animate-spin" />}
                {uploading ? "Envoi..." : editingId ? "Mettre à jour" : "Créer"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 640px) {
          aside { display: none !important; }
          main { padding: 1.25rem !important; }
        }
      `}</style>
    </div>
  );
}
