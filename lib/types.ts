export interface Projet {
  id?: string;
  src: string;
  titre: string;
  desc: string;
  cat: string;
  tags: string[];
  lien?: string;
  lienLabel?: string;
}

export interface ExperienceItem {
  type: "work" | "education";
  title: string;
  org: string;
  date: string;
  index: string;
  items?: string[];
  desc?: string;
  tags?: string[];
}

export interface ContactLink {
  label: string;
  value: string;
  href: string;
  icon?: string;
}

export interface SkillBar {
  label: string;
  level: number;
  accent?: boolean;
}