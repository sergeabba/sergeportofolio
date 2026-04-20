import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';
import { verifyToken } from '@/lib/auth';

export async function GET() {
  // Block in production — this route is only for initial development seeding
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Route désactivée en production' }, { status: 403 });
  }

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const secret = process.env.ADMIN_PASSWORD;
    if (!secret) {
      return NextResponse.json({ error: 'Configuration serveur manquante' }, { status: 500 });
    }

    const valid = await verifyToken(token, secret);
    if (!valid) {
      return NextResponse.json({ error: 'Token invalide' }, { status: 401 });
    }

    // Read existing projects from Supabase to check what already exists
    const { data: existing } = await supabase.from('projets').select('titre');
    const existingTitles = new Set((existing || []).map((p: { titre: string }) => p.titre));

    const newProjets = [
      {
        src: "/projets/gaming/gaming-2.jpg",
        titre: "Trombinoscope Guilde Otaku",
        desc: "Un trombinoscope interactif créé pour une guilde communautaire regroupant des passionnés de culture Otaku.",
        cat: "Gaming",
        tags: ["Web", "Communauté", "Design"],
        lien: "https://guilde-otaku.vercel.app/",
        lienLabel: "Visiter le site"
      },
    ].filter(p => !existingTitles.has(p.titre)); // Avoid duplicates

    if (newProjets.length === 0) {
      return NextResponse.json({ success: true, message: 'Aucun nouveau projet à insérer.' });
    }

    const { data, error } = await supabase
      .from('projets')
      .insert(newProjets)
      .select();

    if (error) {
      console.error("Supabase Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `${newProjets.length} projet(s) insérés avec succès.`,
      data
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue';
    console.error("Seed error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
