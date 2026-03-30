"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Plus, Edit2, Trash2, LogOut, Loader2, Link as LinkIcon, Image as ImageIcon } from "lucide-react";
import type { Projet } from "@/lib/types";

export default function AdminDashboard() {
  const [projets, setProjets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const router = useRouter();

  const [formData, setFormData] = useState({
    titre: "",
    desc: "",
    cat: "Gaming",
    tags: "",
    src: "",
    lien: "",
    lienLabel: "Voir le projet"
  });

  const fetchProjets = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('projets').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      setProjets(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProjets();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const handleOpenModal = (projet?: any) => {
    if (projet) {
      setEditingId(projet.id);
      setFormData({
        titre: projet.titre,
        desc: projet.desc,
        cat: projet.cat,
        tags: projet.tags?.join(", ") || "",
        src: projet.src,
        lien: projet.lien || "",
        lienLabel: projet.lienLabel || "Voir le projet"
      });
    } else {
      setEditingId(null);
      setFormData({
        titre: "",
        desc: "",
        cat: "Gaming",
        tags: "",
        src: "",
        lien: "",
        lienLabel: "Voir le projet"
      });
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Voulez-vous vraiment supprimer ce projet ?")) {
      await supabase.from('projets').delete().eq('id', id);
      fetchProjets();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArray = formData.tags.split(",").map(t => t.trim()).filter(Boolean);
    
    const payload = {
      titre: formData.titre,
      desc: formData.desc,
      cat: formData.cat,
      tags: tagsArray,
      src: formData.src,
      lien: formData.lien || null,
      "lienLabel": formData.lienLabel || null
    };

    if (editingId) {
      await supabase.from('projets').update(payload).eq('id', editingId);
    } else {
      await supabase.from('projets').insert([payload]);
    }
    
    setIsModalOpen(false);
    fetchProjets();
  };

  return (
    <div className="min-h-screen bg-[var(--bg-surface)] p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-2xl shadow-sm border border-[var(--border)]">
          <div>
            <h1 className="text-xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}>Admin Dashboard</h1>
            <p className="text-sm" style={{ color: "var(--text-faint)" }}>Gérez vos réalisations et liens facilement.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2 px-4 py-2 text-sm rounded-xl">
              <Plus size={16} /> Ajouter un projet
            </button>
            <button onClick={handleLogout} className="btn-ghost flex items-center gap-2 px-4 py-2 text-sm rounded-xl text-red-600 hover:bg-red-50">
              <LogOut size={16} /> Déconnexion
            </button>
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-[var(--primary)]" size={40} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projets.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl border border-[var(--border)] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-40 bg-gray-100 relative">
                  {p.src && (
                    <img src={p.src} alt={p.titre} className="w-full h-full object-cover" />
                  )}
                  <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-bold text-[var(--primary)] shadow-sm">
                    {p.cat}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-[var(--text)] mb-1 truncate">{p.titre}</h3>
                  <p className="text-sm text-[var(--text-muted)] line-clamp-2 mb-3">{p.desc}</p>
                  
                  {p.lien && (
                    <a href={p.lien} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-blue-600 hover:underline mb-3 truncate">
                      <LinkIcon size={12} /> {p.lienLabel || p.lien}
                    </a>
                  )}

                  <div className="flex justify-between items-center pt-3 border-t border-[var(--border)]">
                    <button onClick={() => handleOpenModal(p)} className="flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors">
                      <Edit2 size={14} /> Éditer
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-red-500 transition-colors">
                      <Trash2 size={14} /> Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {projets.length === 0 && (
              <div className="col-span-full text-center py-12 text-[var(--text-muted)] bg-white rounded-2xl border border-dashed border-[var(--border)]">
                Aucun projet trouvé. Cliquez sur Ajouter un projet pour commencer.
              </div>
            )}
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
              <div className="p-5 border-b border-[var(--border)] flex justify-between items-center bg-[var(--bg-surface)]">
                <h2 className="text-lg font-bold" style={{ fontFamily: "var(--font-display)" }}>
                  {editingId ? "Modifier le projet" : "Nouveau projet"}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-[var(--text-muted)] hover:text-black">
                  &times;
                </button>
              </div>
              
              <div className="p-5 overflow-y-auto">
                <form id="projet-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-[var(--text-muted)]">Titre *</label>
                    <input required value={formData.titre} onChange={e => setFormData({...formData, titre: e.target.value})} className="w-full px-3 py-2 border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-[var(--text-muted)]">Catégorie *</label>
                    <select required value={formData.cat} onChange={e => setFormData({...formData, cat: e.target.value})} className="w-full px-3 py-2 border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)]">
                      <option value="Gaming">Gaming</option>
                      <option value="IA Générative">IA Générative</option>
                      <option value="Canva">Canva</option>
                      <option value="Web">Web</option>
                      <option value="Data">Data</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1 text-[var(--text-muted)]">Image / Aperçu (URL) *</label>
                    <div className="flex gap-2 items-center relative">
                      <ImageIcon size={16} className="absolute left-3 text-[var(--text-faint)]" />
                      <input required value={formData.src} onChange={e => setFormData({...formData, src: e.target.value})} placeholder="/projets/image.jpg ou https://..." className="w-full pl-9 pr-3 py-2 border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 border border-[var(--border)] p-3 rounded-xl bg-gray-50/50">
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-[var(--text-muted)]">Lien externe personnalisé</label>
                      <input value={formData.lien} onChange={e => setFormData({...formData, lien: e.target.value})} placeholder="https://..." className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[var(--primary)]" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-[var(--text-muted)]">Texte du bouton lien</label>
                      <input value={formData.lienLabel} onChange={e => setFormData({...formData, lienLabel: e.target.value})} placeholder="Voir le site" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[var(--primary)]" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1 text-[var(--text-muted)]">Description *</label>
                    <textarea required rows={3} value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} className="w-full px-3 py-2 border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1 text-[var(--text-muted)]">Tags (séparés par des virgules)</label>
                    <input value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} placeholder="Design, Web, IA..." className="w-full px-3 py-2 border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
                  </div>
                </form>
              </div>

              <div className="p-5 border-t border-[var(--border)] bg-gray-50 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-[var(--text-muted)] hover:text-black">
                  Annuler
                </button>
                <button type="submit" form="projet-form" className="btn-primary px-6 py-2 rounded-xl text-sm">
                  {editingId ? "Enregistrer" : "Créer le projet"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
