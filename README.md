# 🚀 Modern Data Portfolio & Dashboard

Un portfolio haute performance conçu pour un **Data Analyst & Prompt Engineer**. Construit avec **Next.js 16**, **Framer Motion** et une architecture modulaire inspirée du design system de Revolut.

![Aperçu du Portfolio](https://github.com/sergeabba/portofolio/raw/main/public/og-image.jpg)

## 🛠️ Stack Technique

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Styling**: Vanilla CSS + CSS Variables (Design System custom)
- **Base de données**: [Supabase](https://supabase.com/) (Gestion des projets & admin)
- **Typographie**: Aeonik Pro & Inter (via Geist)
- **Déploiement**: [Vercel](https://vercel.com/)

## ✨ Fonctionnalités Clés

- **Bento Stats**: Statistiques dynamiques (Expérience, Projets, Skills).
- **Project Showcase**: Filtrage par catégorie (Data, IA, Gaming).
- **CV Interactif**: Visualisation du parcours professionnel et académique.
- **Support Multi-images**: Gestion de galeries complexes via Supabase Storage.
- **Mode Admin**: Interface sécurisée pour gérer les projets en temps réel.
- **Optimisation SEO**: Balises dynamiques et structure sémantique.

## 📊 Projets Phares Intégrés

1. **Wemoov Dashboard**: Analyse des performances de flotte via Power BI.
2. **Vehicle Analysis**: Nettoyage et EDA de données massives (Python/Pandas).
3. **Spark Streaming**: Pipeline de traitement de logs en temps réel (PySpark).

## 🚀 Installation & Développement

```bash
# Cloner le dépôt
git clone https://github.com/sergeabba/portofolio.git

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

---
Propulsé par l'innovation et la donnée. Créé par **Mbaitadjim Abba Serge**.

## Configuration (sécurité Supabase)

1. Copier `.env.example` en `.env.local` et renseigner les variables, **dont `SUPABASE_SERVICE_ROLE_KEY`**
   (Supabase > Project Settings > API). Ajouter la même variable sur Vercel.
2. Exécuter `supabase/schema.sql` dans Supabase > SQL Editor : la clé publique (anon) devient lecture seule,
   les envois de fichiers passent par `/api/upload`, et la limitation de débit est partagée entre instances.
3. La page d'accueil est rendue côté serveur et régénérée toutes les 10 minutes, ou immédiatement après
   une modification dans `/admin`.
