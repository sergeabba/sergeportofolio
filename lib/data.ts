import type { ExperienceItem, ContactLink } from "./types";

export const NAV_LINKS = [
  { id: "bio",          label: "Accueil" },
  { id: "quisuisje",   label: "À propos" },
  { id: "competences", label: "Skills" },
  { id: "realisations",label: "Réalisations" },
  { id: "experience",  label: "Parcours" },
  { id: "contact",     label: "Contact" },
] as const;

export const HERO_ROLES = [
  "Data Analyst",
  "Prompt Engineer",
  "Développeur Web & Mobile",
  "Big Data Specialist",
  "Créateur de contenu gaming",
];

export const SKILL_CATEGORIES = [
  {
    title: "Data & Big Data",
    tags: ["Power BI", "Python", "Pandas", "NumPy", "SQL", "Spark", "PySpark", "Excel"],
  },
  {
    title: "IA Générative",
    tags: ["Midjourney", "DALL-E", "Sora", "Kling", "Runway", "Suno", "ChatGPT", "Claude"],
  },
  {
    title: "Graphisme & Design",
    tags: ["Canva", "Photoshop", "Illustrator", "Figma", "Adobe XD"],
  },
  {
    title: "No-Code & Web",
    tags: ["WordPress", "Elementor", "Notion", "Google Sites", "Next.js"],
  },
  {
    title: "Systèmes & OS",
    tags: ["Windows", "Linux", "WSL", "Terminal", "Git", "GitHub"],
  },
  {
    title: "Contenu & Réseaux",
    tags: ["TikTok", "YouTube", "Community Mgmt", "Vidéo", "Streaming"],
  },
];

export const SKILL_BARS = {
  data: [
    { label: "Power BI", level: 85 },
    { label: "Python & Pandas", level: 75 },
    { label: "SQL", level: 75 },
    { label: "Excel / Google Sheets", level: 88 },
    { label: "Big Data — Spark, PySpark", level: 65 },
  ],
  creative: [
    { label: "IA Générative & Prompt Engineering", level: 92, accent: true },
    { label: "Canva / Photoshop / Illustrator", level: 85, accent: true },
    { label: "WordPress", level: 82, accent: true },
    { label: "Figma / Adobe XD", level: 75, accent: true },
    { label: "Windows / Linux (usage avancé)", level: 80, accent: true },
  ],
};

// ✅ Date corrigée (stage 2024)
export const EXPERIENCES: ExperienceItem[] = [
  {
    type: "work",
    title: "Stage — Data Analyse",
    org: "Wemoov",
    date: "Juin – Oct. 2024",
    index: "01",
    items: [
      "Analyse des données de consommation des véhicules et optimisation des ressources",
      "Suivi du chiffre d'affaires et évaluation des performances des chauffeurs",
      "Création de rapports et tableaux de bord Power BI pour la prise de décision",
      "Gestion et mise à jour du site web via WordPress",
      "Consolidation des données et structuration d'une base centralisée",
    ],
    tags: ["Python", "SQL", "Power BI", "WordPress", "Excel"],
  },
  {
    type: "education",
    title: "Master — Big Data & Data Stratégie",
    org: "ISM Digital Campus · Dakar",
    date: "2021 – 2023",
    index: "02",
    desc: "Formation de spécialiste data couvrant l'analyse, le traitement et la stratégie autour de la donnée. Acquisition de compétences avancées en Python, Spark, SQL et visualisation, avec une approche project-based.",
    tags: ["Big Data", "Python", "Spark", "SQL", "Data Strategy"],
  },
  {
    type: "education",
    title: "Licence LIAGE",
    org: "École d'Ingénieurs ISM · Dakar",
    date: "2018 – 2021",
    index: "03",
    desc: "Licence en Informatique Appliquée à la Gestion d'Entreprise — bases solides en développement, systèmes d'information et gestion de projet.",
    tags: ["Informatique", "Gestion", "Développement"],
  },
];

export const CONTACT_LINKS: ContactLink[] = [
  {
    label: "Email",
    value: "serge-mbaitadjim.abba@ism.edu.sn",
    href: "mailto:serge-mbaitadjim.abba@ism.edu.sn",
    icon: "✉",
  },
  {
    label: "Téléphone",
    value: "+221 78 546 08 74",
    href: "tel:+221785460874",
    icon: "☎",
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
    icon: "▶",
  },
  {
    label: "Facebook Gaming",
    value: "The Legend of Don",
    href: "https://www.facebook.com/thelegendofdon/followers",
    icon: "f",
  },
];

export const FILTER_CATEGORIES = ["Tous", "Gaming", "IA Générative", "Canva"];

export const ABOUT_FACTS = [
  { key: "Formation",  val: "Master Big Data & Data Stratégie" },
  { key: "École",      val: "ISM Digital Campus — Dakar" },
  { key: "Stack",      val: "Python · SQL · Power BI · IA Gen" },
  { key: "Passion",    val: "Gaming · IA · Création de contenu" },
  { key: "Langues",    val: "Français (natif) · Anglais (B2)" },
];