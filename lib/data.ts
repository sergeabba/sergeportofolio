import type { ExperienceItem, ContactLink } from "./types";

export const NAV_LINKS = [
  { id: "bio", label: "Bio" },
  { id: "quisuisje", label: "À propos" },
  { id: "competences", label: "Compétences" },
  { id: "realisations", label: "Réalisations" },
  { id: "experience", label: "Parcours" },
  { id: "contact", label: "Contact" },
] as const;

export const HERO_ROLES = [
  "Data Analyst",
  "Prompt Engineer",
  "Développeur Web & Mobile",
  "Big Data Specialist",
  "Créateur de contenu",
];

export const SKILL_CATEGORIES = [
  {
    title: "Data & Big Data",
    tags: ["Power BI", "Python", "Pandas", "NumPy", "SQL", "Spark", "PySpark", "Excel"],
  },
  {
    title: "IA Générative",
    tags: ["Midjourney", "DALL-E", "Sora", "Kling", "Runway", "Suno", "ChatGPT"],
  },
  {
    title: "Graphisme & Design",
    tags: ["Canva", "Photoshop", "Illustrator", "Figma", "Adobe XD"],
  },
  {
    title: "No-Code & Web",
    tags: ["WordPress", "Elementor", "Notion", "Google Sites"],
  },
  {
    title: "Systèmes & OS",
    tags: ["Windows", "Linux", "WSL", "Terminal", "Git"],
  },
  {
    title: "Contenu & Réseaux",
    tags: ["TikTok", "YouTube", "Community Mgmt", "Vidéo"],
  },
];

export const EXPERIENCES: ExperienceItem[] = [
  {
    type: "work",
    title: "Stage Data Analyse",
    org: "Wemoov",
    date: "Juin 2024 – Oct. 2025",
    index: "01",
    items: [
      "Analyse des données de consommation des véhicules et optimisation des ressources",
      "Suivi du chiffre d'affaires et évaluation des performances des chauffeurs",
      "Création de rapports et tableaux de bord pour la prise de décision",
      "Gestion et mise à jour du site web via WordPress",
      "Consolidation des données et structuration d'une base centralisée",
    ],
    tags: ["Python", "SQL", "Power BI", "WordPress"],
  },
  {
    type: "education",
    title: "Master Big Data & Data Stratégie",
    org: "ISM / Digital Campus",
    date: "2021 – 2023",
    index: "02",
    desc: "Formation de spécialiste en data, couvrant l'ensemble des aspects d'analyse et de traitement de la donnée au service de la stratégie d'entreprise. Acquisition de compétences techniques avancées, gestion de projets data complexes et maîtrise des stratégies de communication.",
  },
  {
    type: "education",
    title: "Licence LIAGE",
    org: "École d'Ingénieurs ISM",
    date: "2018 – 2021",
    index: "03",
    desc: "Licence en Informatique Appliquée à la Gestion d'Entreprise.",
  },
];

export const CONTACT_LINKS: ContactLink[] = [
  { label: "Email", value: "serge-mbaitadjim.abba@ism.edu.sn", href: "mailto:serge-mbaitadjim.abba@ism.edu.sn" },
  { label: "Téléphone", value: "78 546 08 74", href: "tel:+221785460874" },
  { label: "LinkedIn", value: "@sergeabba", href: "https://linkedin.com/in/sergeabba" },
  { label: "GitHub", value: "github.com/sergeabba", href: "https://github.com/sergeabba" },
  { label: "YouTube Gaming", value: "@thelegendofdon4125", href: "https://www.youtube.com/@thelegendofdon4125" },
  { label: "Facebook Gaming", value: "The Legend of Don", href: "https://www.facebook.com/thelegendofdon/followers" },
  { label: "Curriculum Vitae", value: "Télécharger le CV (PDF)", href: "/cv.pdf" },
];

export const FILTER_CATEGORIES = ["Tous", "Gaming", "IA Générative", "Canva"];
