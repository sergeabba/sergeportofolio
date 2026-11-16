export interface Projet {
  id?: string;
  src: string;
  titre: string;
  desc: string;
  cat: string;
  tags: string[];
  lien?: string | null;
  lienLabel?: string | null;
  liveUrl?: string | null;
  gallery?: string[] | null;
  position?: number | null;
}

export interface ExperienceItem {
  type: "work" | "education";
  title: string;
  org: string;
  place?: string;
  date: string;
  current?: boolean;
  note?: string;
  items?: string[];
  desc?: string;
  tags?: string[];
}

export interface ContactLink {
  label: string;
  value: string;
  href: string;
}

export interface SkillTag {
  label: string;
  icon?: string;
}

export interface SkillCategory {
  id: string;
  title: string;
  icon: string;
  tags: SkillTag[];
  position?: number;
}

export interface PublicProfile {
  photoUrl: string | null;
}
