import type { ExperienceItem, ContactLink, Projet, SkillCategory } from "./types";

export const SITE_URL = "https://sergeportfolio.vercel.app";
export const CV_LINK = "/cv.pdf";
export const FULL_NAME = "Mbaitadjim Abba Serge";
export const HEADLINE = "Rédacteur web & Data analyst";

export const NAV_LINKS = [
  { id: "apropos", label: "À propos" },
  { id: "expertises", label: "Expertises" },
  { id: "realisations", label: "Réalisations" },
  { id: "parcours", label: "Parcours" },
  { id: "contact", label: "Contact" },
] as const;

/* ── Les deux métiers, présentés à égalité ── */
export const PILLARS = [
  {
    id: "redaction",
    title: "Rédaction web",
    lead: "Des textes clairs, utiles et pensés pour être trouvés sur Google comme lus sur mobile.",
    items: [
      "Contenus pour sites, marketplaces et réseaux sociaux",
      "Annonces et pages optimisées pour le référencement",
      "Brochures, dépliants et affiches",
      "Animation des pages de l'entreprise sur les réseaux",
    ],
    tools: ["WordPress", "SEO", "Canva", "Photoshop"],
    layers: [
      { label: "Articles & pages", sub: "SEO · WordPress" },
      { label: "Annonces", sub: "site · marketplace" },
      { label: "Réseaux sociaux", sub: "publications · visuels" },
    ],
  },
  {
    id: "data",
    title: "Analyse de données",
    lead: "Des données nettoyées, structurées et mises en forme pour que les décisions reposent sur des faits.",
    items: [
      "Tableaux de bord et rapports Power BI",
      "Nettoyage et analyse avec Python, Pandas et SQL",
      "Suivi du chiffre d'affaires, des coûts et des performances",
      "Bases de données centralisées et fiables",
    ],
    tools: ["Power BI", "Python", "SQL", "Excel"],
    layers: [
      { label: "Restitution", sub: "Power BI · rapports" },
      { label: "Analyse", sub: "Python · Pandas" },
      { label: "Collecte", sub: "SQL · Excel" },
    ],
  },
] as const;

export const CROSSOVER = {
  title: "Quand les deux se rencontrent",
  text:
    "Je choisis les sujets à partir de ce que les gens cherchent vraiment, je mesure ce que mes contenus produisent, et je sais transformer un tableau de chiffres en une page que tout le monde comprend.",
  points: [
    { title: "Contenus guidés par la donnée", text: "Sujets et mots-clés choisis à partir des recherches réelles." },
    { title: "Suivi de performance", text: "Audience et engagement mesurés pour ajuster ce qui est publié." },
    { title: "Data storytelling", text: "Infographies et textes qui rendent les chiffres lisibles." },
  ],
};

export const EXPERIENCES: ExperienceItem[] = [
  {
    type: "work",
    title: "Rédacteur web & Community manager",
    org: "Marketing Sambe",
    place: "Dakar",
    date: "Oct. 2026 — aujourd'hui",
    current: true,
    note: "Recruté à l'issue de mon stage (juin — septembre 2026).",
    items: [
      "Rédaction des contenus du site, du marketplace et des réseaux sociaux.",
      "Rédaction et mise en ligne des annonces.",
      "Conception de supports de communication : brochures, dépliants, affiches.",
      "Création de visuels : infographies, graphiques.",
      "Gestion des pages réseaux sociaux de l'entreprise, en lien avec les équipes marketing et communication.",
    ],
    tags: ["Rédaction web", "SEO", "Réseaux sociaux", "Création visuelle"],
  },
  {
    type: "work",
    title: "Data analyst (stage)",
    org: "Wemoov",
    place: "Dakar",
    date: "Juin 2024 — oct. 2025",
    items: [
      "Analyse des données de consommation des véhicules et optimisation des ressources.",
      "Suivi du chiffre d'affaires et évaluation des performances des chauffeurs.",
      "Rapports et tableaux de bord pour faciliter la prise de décision.",
      "Consolidation des données dans une base centralisée des opérations.",
      "Mise à jour et gestion du site web sous WordPress.",
    ],
    tags: ["Power BI", "Python", "SQL", "Excel", "WordPress"],
  },
  {
    type: "education",
    title: "Master Big Data & Data Stratégie",
    org: "Digital Campus (Groupe ISM)",
    place: "Dakar",
    date: "2021 — 2023",
    tags: ["Big Data", "Spark", "Hadoop", "Data Strategy"],
  },
  {
    type: "education",
    title: "Licence Informatique Appliquée à la Gestion d'Entreprise",
    org: "École d'Ingénieurs ISM",
    place: "Dakar",
    date: "2018 — 2021",
  },
  {
    type: "education",
    title: "Baccalauréat littéraire",
    org: "Lycée Saint-Étienne",
    place: "N'Djamena, Tchad",
    date: "2018",
  },
];

/**
 * Compétences par défaut. L'admin peut les remplacer (clé "skills" en base).
 * `icon` reste utilisé par l'admin ; le site public ne l'affiche pas.
 */
export const DEFAULT_SKILLS: SkillCategory[] = [
  {
    id: "redaction",
    title: "Rédaction & contenu",
    icon: "Pen",
    tags: ["Rédaction web", "SEO", "Copywriting", "Annonces", "Community management", "WordPress", "Calendrier éditorial"].map((label) => ({ label })),
  },
  {
    id: "data",
    title: "Data & analyse",
    icon: "BarChart3",
    tags: ["Power BI", "SQL", "Python", "Pandas", "NumPy", "Excel", "Google Sheets", "Matplotlib", "Seaborn"].map((label) => ({ label })),
  },
  {
    id: "bigdata",
    title: "Big Data",
    icon: "Database",
    tags: ["Spark", "PySpark", "Écosystème Hadoop", "Linux", "Shell"].map((label) => ({ label })),
  },
  {
    id: "creation",
    title: "Création visuelle & IA",
    icon: "Palette",
    tags: ["Canva", "Photoshop", "Illustrator", "Figma", "Midjourney", "Prompt engineering", "CapCut"].map((label) => ({ label })),
  },
];

export const LANGUAGES = [
  { label: "Français", level: "Langue maternelle" },
  { label: "Anglais", level: "B2" },
];

export const CONTACT_EMAIL = "abbaserge2@gmail.com";

export const CONTACT_LINKS: ContactLink[] = [
  { label: "Email", value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
  { label: "Téléphone", value: "+221 78 546 08 74", href: "tel:+221785460874" },
  { label: "LinkedIn", value: "in/sergeabba", href: "https://linkedin.com/in/sergeabba" },
  { label: "GitHub", value: "sergeabba", href: "https://github.com/sergeabba" },
];

export const SOCIAL_GAMING: ContactLink[] = [
  { label: "YouTube", value: "@thelegendofdon4125", href: "https://www.youtube.com/@thelegendofdon4125" },
  { label: "Facebook", value: "The Legend of Don", href: "https://www.facebook.com/thelegendofdon" },
];

/** Projets affichés si la base est vide ou indisponible (images présentes dans /public). */
export const FALLBACK_PROJECTS: Projet[] = [
  {
    src: "/projets/gaming/persona.png",
    titre: "La série Persona",
    desc: "Miniature YouTube — le J-RPG qui fait parler ton double intérieur.",
    cat: "Gaming",
    tags: ["YouTube", "Miniature", "Design"],
    lien: "https://www.youtube.com/@thelegendofdon4125",
    lienLabel: "Voir la chaîne",
  },
  {
    src: "/projets/gaming/sonic.jpg",
    titre: "Sonic the Hedgehog",
    desc: "Miniature YouTube — l'histoire d'un hérisson plus rapide que le temps.",
    cat: "Gaming",
    tags: ["YouTube", "Miniature", "Design"],
    lien: "https://www.youtube.com/@thelegendofdon4125",
    lienLabel: "Voir la chaîne",
  },
  {
    src: "/projets/gaming/gaming-2.jpg",
    titre: "Trombinoscope Guilde Otaku",
    desc: "Trombinoscope interactif pour une guilde communautaire de passionnés de culture otaku.",
    cat: "Gaming",
    tags: ["Web", "Communauté", "Design"],
    lien: "https://guilde-otaku.vercel.app/",
    lienLabel: "Visiter le site",
  },
  {
    src: "/projets/ia/ia-1.jpg",
    titre: "Création IA générative",
    desc: "Visuel généré avec Midjourney à partir d'un travail de prompt engineering.",
    cat: "IA Générative",
    tags: ["Midjourney", "Prompt", "IA"],
  },
  {
    src: "/projets/canva/aizen.jpg",
    titre: "Affiche Aizen",
    desc: "Création graphique réalisée sur Canva.",
    cat: "Canva",
    tags: ["Canva", "Affiche", "Graphisme"],
  },
  {
    src: "/projets/canva/arion.jpg",
    titre: "Affiche Arion",
    desc: "Création graphique réalisée sur Canva.",
    cat: "Canva",
    tags: ["Canva", "Affiche", "Graphisme"],
  },
];
