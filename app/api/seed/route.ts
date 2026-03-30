import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // 1. Lire le fichier data.json actuel
    const dataPath = path.join(process.cwd(), 'public', 'projets', 'data.json');
    const fileContents = fs.readFileSync(dataPath, 'utf8');
    const projets = JSON.parse(fileContents);

    // 2. Ajouter le nouveau projet Guilde Otaku
    projets.push({
      src: "/projets/gaming/gaming-2.jpg", // placeholder, can be changed later in admin
      titre: "Trombinoscope Guilde Otaku",
      desc: "Un trombinoscope interactif créé pour une guilde communautaire regroupant des passionnés de culture Otaku.",
      cat: "Gaming",
      tags: ["Web", "Communauté", "Design"],
      lien: "https://guilde-otaku.vercel.app/",
      lienLabel: "Visiter le site"
    });

    // 3. Insérer dans Supabase
    const { data, error } = await supabase
      .from('projets')
      .insert(projets)
      .select();

    if (error) {
      console.error("Supabase Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `${projets.length} projets insérés avec succès.`,
      data
    });
  } catch (err: any) {
    console.error("Seed error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
