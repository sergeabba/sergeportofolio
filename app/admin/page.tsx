"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Plus, Edit2, Trash2, LogOut, Loader2, Link as LinkIcon, Image as ImageIcon, GripVertical, Upload } from "lucide-react";

// DND Kit
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// --- Composant Carte Triable ---
function SortableProjectCard({ projet, handleOpenModal, handleDelete }: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: projet.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.7 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div style={{ background: "var(--bg-elevated)", borderRadius: "var(--r-card)", overflow: "hidden", border: isDragging ? "2px solid var(--revo-blue)" : "1px solid var(--border)", position: "relative" }}>
        
        {/* Poignée Drag */}
        <div {...attributes} {...listeners} style={{ position: "absolute", top: "0.5rem", left: "0.5rem", zIndex: 10, background: "var(--bg)", border: "1px solid var(--border)", padding: "0.4rem", borderRadius: "8px", cursor: "grab", color: "var(--text)", boxShadow: "0 2px 5px rgba(0,0,0,0.2)" }}>
          <GripVertical size={16} />
        </div>

        <div style={{ height: 160, position: "relative", background: "var(--bg-layer)" }}>
          {projet.src && (
            <img src={projet.src} alt={projet.titre} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          )}
          <span style={{ position: "absolute", top: "0.5rem", right: "0.5rem", background: "#ffffff", color: "#191c1f", padding: "0.2rem 0.6rem", borderRadius: "9999px", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>
            {projet.cat}
          </span>
        </div>

        <div style={{ padding: "1.25rem" }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "1.1rem", marginBottom: "0.5rem" }}>{projet.titre}</h3>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{projet.desc}</p>
          
          {projet.lien && (
            <a href={projet.lien} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem", color: "var(--revo-blue)", textDecoration: "none", marginBottom: "1rem", pointerEvents: isDragging ? "none" : "auto" }}>
              <LinkIcon size={14} /> {projet.lienLabel || "Lien externe"}
            </a>
          )}

          <div style={{ display: "flex", gap: "1rem", borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>
            <button onPointerDown={(e) => e.stopPropagation()} onClick={() => handleOpenModal(projet)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", background: "var(--bg)", border: "1px solid var(--border)", padding: "0.5rem", borderRadius: "8px", fontSize: "0.75rem", fontWeight: 500, cursor: "pointer", color: "var(--text)" }}>
              <Edit2 size={14} /> Éditer
            </button>
            <button onPointerDown={(e) => e.stopPropagation()} onClick={() => handleDelete(projet.id)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", background: "rgba(226,59,74,0.05)", border: "1px solid rgba(226,59,74,0.15)", padding: "0.5rem", borderRadius: "8px", fontSize: "0.75rem", fontWeight: 500, cursor: "pointer", color: "var(--danger)" }}>
              <Trash2 size={14} /> Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Dashboard ---
export default function AdminDashboard() {
  const [projets, setProjets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [filterCat, setFilterCat] = useState<string>("Tous");
  
  const [file, setFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  
  const router = useRouter();

  const [formData, setFormData] = useState({
    titre: "", desc: "", cat: "Gaming", tags: "", src: "", lien: "", lienLabel: "Voir le projet", gallery: [] as string[]
  });

  const fetchProjets = async () => {
    setLoading(true);
    // On trie par 'position' Ascendant
    let { data, error } = await supabase.from('projets').select('*').order('position', { ascending: true, nullsFirst: false });
    if (error) {
       const fallback = await supabase.from('projets').select('*').order('created_at', { ascending: false });
       data = fallback.data;
    }
    if (data) setProjets(data);
    setLoading(false);
  };

  useEffect(() => { fetchProjets(); }, []);

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const handleOpenModal = (projet?: any) => {
    if (projet) {
      setEditingId(projet.id);
      setFormData({
        titre: projet.titre, desc: projet.desc, cat: projet.cat,
        tags: projet.tags?.join(", ") || "", src: projet.src,
        lien: projet.lien || "", lienLabel: projet.lienLabel || "Voir le projet",
        gallery: projet.gallery || []
      });
    } else {
      setEditingId(null);
      setFormData({
        titre: "", desc: "", cat: "Gaming", tags: "", src: "", lien: "", lienLabel: "Voir le projet", gallery: []
      });
    }
    setFile(null); // Reset cover
    setGalleryFiles([]); // Reset gallery
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Voulez-vous vraiment supprimer ce projet ?")) {
      await supabase.from('projets').delete().eq('id', id);
      fetchProjets();
    }
  };

  // Upload Fichier
  const handleFileUpload = async (fileToUpload: File) => {
    const fileExt = fileToUpload.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { error: uploadError } = await supabase.storage.from('portfolio').upload(filePath, fileToUpload);

    if (uploadError) {
      alert("Erreur lors de l'upload de : " + fileToUpload.name + " - " + uploadError.message);
      return null;
    }

    const { data } = supabase.storage.from('portfolio').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    
    let finalSrc = formData.src;
    
    if (file) {
      const uploadedUrl = await handleFileUpload(file);
      if (uploadedUrl) finalSrc = uploadedUrl;
    }

    let finalGalleryUrls = [...formData.gallery];
    if (galleryFiles.length > 0) {
       for (const gFile of galleryFiles) {
          const uploadedUrl = await handleFileUpload(gFile);
          if (uploadedUrl) finalGalleryUrls.push(uploadedUrl);
       }
    }

    const tagsArray = formData.tags.split(",").map(t => t.trim()).filter(Boolean);
    const payload = {
      titre: formData.titre, desc: formData.desc, cat: formData.cat,
      tags: tagsArray, src: finalSrc, lien: formData.lien || null,
      lienLabel: formData.lienLabel || null,
      gallery: finalGalleryUrls,
      // Nouveau projet = position à la fin
      ...( !editingId && { position: projets.length } )
    };

    if (editingId) await supabase.from('projets').update(payload).eq('id', editingId);
    else await supabase.from('projets').insert([payload]);
    
    setUploading(false);
    setIsModalOpen(false);
    fetchProjets();
  };

  // --- DND Handlers ---
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = projets.findIndex((item) => item.id === active.id);
      const newIndex = projets.findIndex((item) => item.id === over?.id);
      
      const newItems = arrayMove(projets, oldIndex, newIndex);
      
      // Mise à jour de l'UI localement pour la fluidité
      const reorderedItems = newItems.map((item, idx) => ({ ...item, position: idx }));
      setProjets(reorderedItems);

      // Mise à jour de Supabase en arrière plan
      const updates = reorderedItems.map(item => supabase.from('projets').update({ position: item.position }).eq('id', item.id));
      await Promise.all(updates);
    }
  };

  const categories = useMemo(() => {
    const cats = new Set(projets.map(p => p.cat));
    return ["Tous", ...Array.from(cats)];
  }, [projets]);

  const displayedProjets = filterCat === "Tous" ? projets : projets.filter(p => p.cat === filterCat);

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", padding: "clamp(2rem, 5vw, 4rem) 0" }}>
      <div className="container" style={{ maxWidth: 1100 }}>
        {/* Header */}
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "2rem", marginBottom: "2rem", borderBottom: "1px solid var(--border)" }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "1.8rem", letterSpacing: "-0.03em" }}>Admin Dashboard</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Uploadez, déplacez et gérez vos réalisations.</p>
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button onClick={() => handleOpenModal()} className="btn-primary" style={{ padding: "0.6rem 1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Plus size={16} /> Ajouter
            </button>
            <button onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem 1.25rem", borderRadius: "9999px", background: "rgba(226,59,74,0.1)", color: "var(--danger)", border: "none", cursor: "pointer", fontWeight: 500, fontSize: "0.85rem" }}>
              <LogOut size={16} /> Déconnexion
            </button>
          </div>
        </header>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}><Loader2 className="animate-spin" size={32} color="var(--revo-blue)" /></div>
        ) : (
          <>
            {/* Category Filter */}
            {projets.length > 0 && (
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem", flexWrap: "wrap", alignItems: "center" }}>
                {categories.map(c => (
                  <button key={c} onClick={() => setFilterCat(c)} style={{ background: filterCat === c ? "var(--revo-black)" : "transparent", color: filterCat === c ? "#ffffff" : "var(--text-secondary)", border: filterCat === c ? "1px solid transparent" : "1px solid var(--border)", padding: "0.4rem 1.2rem", borderRadius: "9999px", fontSize: "0.8rem", fontWeight: 500, cursor: "pointer", transition: "all 0.2s" }}>
                    {c}
                  </button>
                ))}
                {filterCat !== "Tous" && <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginLeft: "0.5rem" }}>Le drag & drop est désactivé lors du filtrage.</div>}
              </div>
            )}

            {/* Projets Grid avec réorganisation */}
            {filterCat === "Tous" ? (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={projets.map(p => p.id)} strategy={rectSortingStrategy}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
                    {projets.map((p) => (
                      <SortableProjectCard key={p.id} projet={p} handleOpenModal={handleOpenModal} handleDelete={handleDelete} />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
                {displayedProjets.map((p) => (
                  <SortableProjectCard key={p.id} projet={p} handleOpenModal={handleOpenModal} handleDelete={handleDelete} />
                ))}
              </div>
            )}
              
            {projets.length === 0 && (
              <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "4rem", color: "var(--text-tertiary)", background: "var(--bg-elevated)", borderRadius: "var(--r-card)" }}>
                Aucun projet enregistré.
              </div>
            )}
          </>
        )}

        {/* Modal Apparition */}
        {isModalOpen && (
          <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }} onClick={() => setIsModalOpen(false)} />
            <div style={{ position: "relative", width: "100%", maxWidth: 600, background: "var(--bg)", borderRadius: "var(--r-card)", display: "flex", flexDirection: "column", maxHeight: "90vh", overflow: "hidden", border: "1px solid var(--border)" }}>
              {/* Header Modal */}
              <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg-elevated)" }}>
                <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "1.2rem" }}>
                  {editingId ? "Modifier le projet" : "Nouveau projet"}
                </h2>
                <button onClick={() => setIsModalOpen(false)} style={{ background: "none", border: "none", fontSize: "1.5rem", color: "var(--text-secondary)", cursor: "pointer" }}>&times;</button>
              </div>

              {/* Formulaire */}
              <div style={{ padding: "1.5rem", overflowY: "auto" }}>
                <form id="projet-form" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, marginBottom: "0.4rem", color: "var(--text-secondary)" }}>Titre *</label>
                    <input required value={formData.titre} onChange={e => setFormData({...formData, titre: e.target.value})} className="form-input" style={{ width: "100%" }} />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, marginBottom: "0.4rem", color: "var(--text-secondary)" }}>Catégorie *</label>
                      <select required value={formData.cat} onChange={e => setFormData({...formData, cat: e.target.value})} className="form-input" style={{ width: "100%", backgroundColor: "var(--bg-elevated)" }}>
                        <option value="Gaming">Gaming</option>
                        <option value="IA Générative">IA Générative</option>
                        <option value="Canva">Canva</option>
                        <option value="Web">Web</option>
                        <option value="Data">Data</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, marginBottom: "0.4rem", color: "var(--text-secondary)" }}>Tags (par virgules)</label>
                      <input value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} placeholder="Design, Web..." className="form-input" style={{ width: "100%" }} />
                    </div>
                  </div>

                  {/* Upload Image ou URL */}
                  <div style={{ background: "rgba(226,59,74,0.03)", padding: "1rem", borderRadius: "12px", border: "1px dashed var(--border-strong)" }}>
                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, marginBottom: "0.6rem", color: "var(--text-secondary)" }}>Couverture Principale (Image ou Vidéo)</label>
                    
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                      {/* Choix 1: Fichier local */}
                      <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "var(--bg-elevated)", border: "1px solid var(--border)", padding: "0.6rem", borderRadius: "8px", cursor: "pointer", fontSize: "0.85rem" }}>
                        <Upload size={16} style={{ color: "var(--revo-blue)" }} />
                        <span style={{ color: file ? "var(--text)" : "var(--text-secondary)" }}>
                          {file ? file.name : "Sélectionner un fichier depuis l'ordinateur..."}
                        </span>
                        <input type="file" style={{ display: "none" }} onChange={(e) => { if (e.target.files?.[0]) setFile(e.target.files[0]); }} accept="image/*,video/*" />
                      </label>

                      <div style={{ textAlign: "center", fontSize: "0.75rem", color: "var(--text-tertiary)" }}>OU</div>

                      {/* Choix 2: Lien direct */}
                      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                        <ImageIcon size={16} style={{ position: "absolute", left: "0.75rem", color: "var(--text-tertiary)" }} />
                        <input value={file ? "" : formData.src} disabled={!!file} onChange={e => setFormData({...formData, src: e.target.value})} placeholder={file ? "Lien désactivé car fichier sélectionné" : "Coller un lien HTTPs direct (/images/test.jpg)"} className="form-input" style={{ width: "100%", paddingLeft: "2.5rem" }} />
                      </div>
                    </div>
                  </div>

                  {/* Galerie Upload */}
                  <div style={{ background: "var(--bg-layer)", padding: "1rem", borderRadius: "12px", border: "1px dashed var(--border-strong)" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.75rem", fontWeight: 600, marginBottom: "0.6rem", color: "var(--text-secondary)" }}>Galerie Additionnelle <span style={{ fontSize: "0.65rem", padding: "0.2rem 0.5rem", background: "var(--revo-blue)", color: "#fff", borderRadius: 9999 }}>NOUVEAU</span></label>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginBottom: "0.75rem" }}>Images à afficher en dessous dans la présentation détaillée du projet.</p>
                    
                    <label style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "0.5rem", background: "var(--bg-elevated)", border: "1px solid var(--border)", padding: "1rem", borderRadius: "8px", cursor: "pointer", fontSize: "0.85rem", textAlign: "center" }}>
                      <Upload size={16} style={{ color: "var(--revo-blue)" }} />
                      <span style={{ color: "var(--text-secondary)" }}>Ajouter des images...</span>
                      <input type="file" multiple style={{ display: "none" }} onChange={(e) => { if (e.target.files) setGalleryFiles([...galleryFiles, ...Array.from(e.target.files)]); }} accept="image/*" />
                    </label>

                    {/* Aperçu Fichiers Selectionnés */}
                    {galleryFiles.length > 0 && (
                      <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                        {galleryFiles.map((f, i) => (
                           <div key={i} style={{ fontSize: "0.7rem", display: "flex", alignItems: "center", gap: "0.3rem", background: "var(--revo-black)", color: "#fff", padding: "0.3rem 0.6rem", borderRadius: "8px" }}>
                              {f.name} <button type="button" onClick={() => setGalleryFiles(galleryFiles.filter((_, idx) => idx !== i))} style={{ background: "transparent", border: "none", color: "#fff", cursor: "pointer" }}>&times;</button>
                           </div>
                        ))}
                      </div>
                    )}

                    {/* Fichiers Déjà en Ligne */}
                    {formData.gallery.length > 0 && (
                      <div style={{ marginTop: "1rem" }}>
                         <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>Images actuellement rattachées au projet ({formData.gallery.length}) :</p>
                         <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                            {formData.gallery.map((url, i) => (
                               <div key={url} style={{ position: "relative", width: 60, height: 60, borderRadius: 8, overflow: "hidden", border: "1px solid var(--border)" }}>
                                  <img src={url} alt="Gallery item" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                  <button type="button" onClick={() => setFormData({...formData, gallery: formData.gallery.filter(u => u !== url)})} style={{ position: "absolute", top: 0, right: 0, background: "rgba(226,59,74,0.8)", border: "none", color: "#fff", cursor: "pointer", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", borderRadius: "0 0 0 8px" }}>&times;</button>
                               </div>
                            ))}
                         </div>
                      </div>
                    )}
                  </div>

                  <div style={{ background: "var(--bg-layer)", padding: "1rem", borderRadius: "12px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, marginBottom: "0.4rem", color: "var(--text-secondary)" }}>Lien externe</label>
                      <input value={formData.lien} onChange={e => setFormData({...formData, lien: e.target.value})} placeholder="https://..." className="form-input" style={{ width: "100%" }} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, marginBottom: "0.4rem", color: "var(--text-secondary)" }}>Texte du bouton</label>
                      <input value={formData.lienLabel} onChange={e => setFormData({...formData, lienLabel: e.target.value})} placeholder="Voir le site" className="form-input" style={{ width: "100%" }} />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, marginBottom: "0.4rem", color: "var(--text-secondary)" }}>Description *</label>
                    <textarea rows={3} required value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} className="form-input" style={{ width: "100%" }} />
                  </div>
                </form>
              </div>

              {/* Footer Modal */}
              <div style={{ padding: "1.25rem 1.5rem", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "flex-end", gap: "0.75rem", background: "var(--bg-elevated)" }}>
                <button type="button" disabled={uploading} onClick={() => setIsModalOpen(false)} className="btn-ghost" style={{ padding: "0.6rem 1.25rem", border: "1px solid var(--border)", background: "transparent", color: "var(--text)", opacity: uploading ? 0.5 : 1 }}>Annuler</button>
                <button type="submit" disabled={uploading} form="projet-form" className="btn-primary" style={{ padding: "0.6rem 1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  {uploading ? <Loader2 size={16} className="animate-spin" /> : null}
                  {uploading ? "Envoi en cours..." : (editingId ? "Mettre à jour" : "Créer le projet")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
