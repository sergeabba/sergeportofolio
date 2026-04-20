import type { ExperienceItem, ContactLink, SkillBar as SkillBarType, Projet } from "./types";

export const CV_LINK = "/cv.pdf";

export const NAV_LINKS = [
  { id: "bio", label: "Accueil" },
  { id: "quisuisje", label: "À propos" },
  { id: "competences", label: "Skills" },
  { id: "realisations", label: "Réalisations" },
  { id: "experience", label: "Parcours" },
  { id: "contact", label: "Contact" },
] as const;

export const HERO_ROLES = [
  "Data Analyst",
  "Prompt Engineer",
  "Développeur Web & Mobile",
  "Big Data Specialist",
  "Créateur de contenu gaming",
];

export const SKILL_CATEGORIES: { title: string; icon: string; tags: string[]; tagIcons?: Record<string, string> }[] = [
  {
    title: "Analyse & Visu. Données",
    icon: "ph-chart-bar",
    tags: ["SQL", "Pandas", "NumPy", "SciPy", "Power BI", "Matplotlib", "Seaborn", "Geoplotlib"],
    tagIcons: { "SQL": "ph-database", "Pandas": "ph-table", "NumPy": "ph-calculator", "Power BI": "ph-chart-polar", "Matplotlib": "ph-chart-line", "Seaborn": "ph-chart-donut" },
  },
  {
    title: "IA Générative & Prompt",
    icon: "ph-brain",
    tags: ["Midjourney", "NanoBanana Pro", "DALL-E", "Sora", "Suno", "Riffusion"],
    tagIcons: { "Midjourney": "ph-magic-wand", "DALL-E": "ph-image", "Sora": "ph-video", "Suno": "ph-music-note" },
  },
  {
    title: "Programmation",
    icon: "ph-code",
    tags: ["Python", "C++", "C"],
    tagIcons: { "Python": "ph-logo-python", "C++": "ph-file-cpp" },
  },
  {
    title: "Systèmes & OS",
    icon: "ph-desktop",
    tags: ["Windows", "Linux Mint", "VirtualBox", "Scripting Shell", "Spark", "PySpark"],
    tagIcons: { "Linux Mint": "ph-linux-logo", "Windows": "ph-windows-logo", "Spark": "ph-lightning", "VirtualBox": "ph-hard-drives" },
  },
  {
    title: "Design & UI/UX",
    icon: "ph-pen-nib",
    tags: ["Photoshop", "Illustrator", "Adobe XD", "Figma", "Canva"],
    tagIcons: { "Figma": "ph-figma-logo", "Photoshop": "ph-image", "Illustrator": "ph-pencil-simple", "Canva": "ph-palette" },
  },
  {
    title: "Bureautique & Réseaux",
    icon: "ph-file-text",
    tags: ["Word", "Excel", "Sheets", "TikTok IA & Gaming"],
    tagIcons: { "Excel": "ph-table", "Sheets": "ph-table", "Word": "ph-file-doc" },
  },
];

export const TOOL_ENVIRONMENT = [
  { name: "VS Code", icon: "ph-vscode-logo" },
  { name: "Git", icon: "ph-git-branch" },
  { name: "GitHub", icon: "ph-github-logo" },
  { name: "Vercel", icon: "ph-triangle" },
  { name: "Figma", icon: "ph-figma-logo" },
  { name: "Supabase", icon: "ph-database" },
  { name: "Next.js", icon: "ph-globe" },
  { name: "React", icon: "ph-atom" },
  { name: "Node.js", icon: "ph-nodejs-logo" },
  { name: "Terminal", icon: "ph-terminal" },
  { name: "Docker", icon: "ph-package" },
  { name: "Postman", icon: "ph-send" },
];

export const SKILL_BARS = {
  data: [
    { label: "Power BI", level: 85 },
    { label: "Python & Pandas", level: 75 },
    { label: "SQL", level: 75 },
    { label: "Excel / Google Sheets", level: 88 },
    { label: "Big Data  Spark, PySpark", level: 65 },
  ],
  creative: [
    { label: "IA Générative & Prompt Engineering", level: 92, accent: true },
    { label: "Canva / Photoshop / Illustrator", level: 85, accent: true },
    { label: "WordPress", level: 82, accent: true },
    { label: "Figma / Adobe XD", level: 75, accent: true },
    { label: "Windows / Linux (usage avancé)", level: 80, accent: true },
  ],
  all: [
    { label: "Power BI", level: 85 },
    { label: "Python & Pandas", level: 75 },
    { label: "SQL", level: 75 },
    { label: "Excel / Google Sheets", level: 88 },
    { label: "Big Data Spark, PySpark", level: 65 },
    { label: "IA Générative & Prompt Engineering", level: 92, accent: true },
    { label: "Canva / Photoshop / Illustrator", level: 85, accent: true },
  ] as SkillBarType[],
};

// ✅ Données alignées avec le CV
export const EXPERIENCES: ExperienceItem[] = [
  {
    type: "work",
    title: "Stage  Data Analyse",
    org: "Wemoov",
    date: "Juin 2024 – Octobre 2025",
    index: "01",
    items: [
      "Analyse des données de consommation des véhicules et optimisation des ressources.",
      "Suivi du chiffre d'affaires et évaluation des performances des chauffeurs.",
      "Création de rapports et tableaux de bord pour faciliter la prise de décision.",
      "Mise à jour et gestion du site web via WordPress.",
      "Consolidation des données et structuration d'une base centralisée des opérations.",
    ],
    tags: ["Python", "SQL", "Power BI", "WordPress", "Excel"],
  },
  {
    type: "education",
    title: "Master  Big Data & Data Stratégie",
    org: "Digital Campus",
    date: "2021 – 2023",
    index: "02",
    desc: "Master en Big Data & Data Stratégie au sein de Digital Campus (Groupe ISM).",
    tags: ["Big Data", "Data Strategy", "Spark", "Ecosysteme Hadoop"],
  },
  {
    type: "education",
    title: "Licence  LIAGE",
    org: "École d'Ingénieurs ISM",
    date: "2018 – 2021",
    index: "03",
    desc: "Licence en Informatique Appliquée à la Gestion d'Entreprise.",
    tags: ["Informatique", "Gestion", "Développement"],
  },
  {
    type: "education",
    title: "Baccalauréat Littéraire",
    org: "Lycée Saint Etienne (Ndjamena, Tchad)",
    date: "2017 – 2018",
    index: "04",
    desc: "Obtention du baccalauréat Littéraire.",
    tags: ["Littéraire", "Général"],
  },
];

export const CONTACT_LINKS: ContactLink[] = [
  {
    label: "Email",
    value: "abbaserge2@gmail.com",
    href: "mailto:abbaserge2@gmail.com",
    icon: "Email",
  },
  {
    label: "Téléphone",
    value: "78 546 08 74",
    href: "tel:+221785460874",
    icon: "Tel",
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/sergeabba",
    href: "https://linkedin.com/in/sergeabba",
    icon: "in",
  },
  {
    label: "GitHub",
    value: "github.com/sergeabba",
    href: "https://github.com/sergeabba",
    icon: "gh",
  },
  {
    label: "YouTube Gaming",
    value: "@thelegendofdon4125",
    href: "https://www.youtube.com/@thelegendofdon4125",
    icon: "YT",
  },
  {
    label: "Facebook Gaming",
    value: "The Legend of Don",
    href: "https://www.facebook.com/thelegendofdon/followers",
    icon: "f",
  },
];

export const FILTER_CATEGORIES = ["Tous", "Gaming", "IA Générative", "Canva", "Data"];

export const ABOUT_FACTS = [
  { key: "Formation", val: "Master Big Data & Data Stratégie" },
  { key: "École", val: "Digital Campus" },
  { key: "Stack", val: "Python · SQL · Power BI · IA Gen" },
  { key: "Passion", val: "Gaming · IA · Création de contenu" },
  { key: "Langues", val: "Français (natif) · Anglais (B2)" },
];


export const MARQUEE_SKILLS = [
  "Power BI", "Python", "SQL", "Pandas", "Spark",
  "IA Générative", "Prompt Engineering", "Figma", "Photoshop",
  "Windows", "Linux Mint", "VirtualBox", "Big Data",
];

export const MARQUEE_ICONS: Record<string, string> = {
  "Power BI": "ph-chart-polar",
  "Python": "ph-code",
  "SQL": "ph-database",
  "Pandas": "ph-table",
  "Spark": "ph-lightning",
  "IA Générative": "ph-brain",
  "Prompt Engineering": "ph-sparkle",
  "Figma": "ph-pen-nib",
  "Photoshop": "ph-image",
  "Data Visualization": "ph-chart-bar",
  "WordPress": "ph-globe",
  "Windows": "ph-windows-logo",
  "Linux Mint": "ph-linux-logo",
  "VirtualBox": "ph-hard-drives",
  "Big Data": "ph-stack",
};

// Nouveaux projets DATA pour équilibrer portfolio
export const PROJETS_DATA: Projet[] = [
  {
    "src": "/projets/data/wemoov-dashboard.jpg",
    "titre": "Dashboard Power BI Wemoov",
    "desc": "Tableau de bord interactif pour analyse performances chauffeurs et CA véhicules (stage Wemoov).",
    "cat": "Data",
    "tags": ["Power BI", "Data Viz", "Analyse", "Business Intel"],
    "lien": "https://github.com/sergeabba/wemoov-dashboard",
    "lienLabel": "Voir GitHub"
  },
  {
    "src": "/projets/data/pandas-analysis.jpg",
    "titre": "Analyse Pandas Véhicules",
    "desc": "Script Python Pandas pour nettoyage/analyse données consommation carburant (100k+ lignes).",
    "cat": "Data",
    "tags": ["Python", "Pandas", "Data Cleaning", "EDA"],
    "lien": "https://github.com/sergeabba/vehicle-analysis",
    "lienLabel": "Code source"
  },
  {
    "src": "/projets/data/spark-bigdata.jpg",
    "titre": "Spark Streaming Log Analysis",
    "desc": "Pipeline PySpark pour traitement temps réel logs applicatifs (projet Master Big Data).",
    "cat": "Data",
    "tags": ["PySpark", "Big Data", "Linux", "Streaming"],
    "lien": "https://github.com/sergeabba/spark-logs",
    "lienLabel": "Dépôt GitHub"
  }
];
