import type { Metadata, Viewport } from "next";
import { Inter_Tight } from "next/font/google";
import "./globals.css";
import { FULL_NAME, HEADLINE, SITE_URL, CONTACT_EMAIL } from "@/lib/data";

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
});

const DESCRIPTION =
  "Rédacteur web chez Marketing Sambe et data analyst (Master Big Data & Data Stratégie). Des contenus clairs et optimisés SEO, des données qui éclairent les décisions — Dakar, Sénégal.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${FULL_NAME} — ${HEADLINE}`,
    template: `%s | ${FULL_NAME}`,
  },
  description: DESCRIPTION,
  keywords: [
    "Rédacteur web", "Rédaction web", "SEO", "Community manager", "Copywriting",
    "Data Analyst", "Power BI", "Python", "SQL", "Big Data",
    "Dakar", "Sénégal", "Portfolio", FULL_NAME,
  ],
  authors: [{ name: FULL_NAME, url: SITE_URL }],
  creator: FULL_NAME,
  alternates: { canonical: "/" },
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    type: "profile",
    locale: "fr_FR",
    url: SITE_URL,
    siteName: FULL_NAME,
    title: `${FULL_NAME} — ${HEADLINE}`,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${FULL_NAME} — ${HEADLINE}`,
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#ffffff" };

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: FULL_NAME,
  jobTitle: ["Rédacteur web", "Data analyst"],
  worksFor: { "@type": "Organization", name: "Marketing Sambe" },
  url: SITE_URL,
  email: `mailto:${CONTACT_EMAIL}`,
  address: { "@type": "PostalAddress", addressLocality: "Dakar", addressCountry: "SN" },
  alumniOf: [
    { "@type": "EducationalOrganization", name: "Digital Campus (Groupe ISM)" },
    { "@type": "EducationalOrganization", name: "École d'Ingénieurs ISM" },
  ],
  knowsAbout: ["Rédaction web", "SEO", "Community management", "Analyse de données", "Power BI", "Python", "SQL", "Big Data"],
  sameAs: ["https://linkedin.com/in/sergeabba", "https://github.com/sergeabba"],
};

// Active les animations uniquement si JavaScript fonctionne (sinon tout reste visible).
const themeScript = `(function(){var d=document.documentElement;d.classList.add('js');setTimeout(function(){if(!d.classList.contains('reveal-ready'))d.classList.add('reveal-off')},2500)})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fr"
      className={interTight.variable}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
