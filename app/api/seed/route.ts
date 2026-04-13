import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

async function verifyToken(token: string, secret: string): Promise<boolean> {
  const encoder = new TextEncoder()
  const keyData = encoder.encode(secret)
  const key = await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['verify'])
  const data = encoder.encode('admin-session')
  const tokenBytes = new Uint8Array(token.match(/.{2}/g)!.map(b => parseInt(b, 16)))
  return crypto.subtle.verify('HMAC', key, tokenBytes, data)
}

export async function GET() {
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
