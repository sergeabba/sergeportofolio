import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mbaitadjim Abba Serge — Le Don · Portfolio",
  description:
    "Data Analyst · Big Data · IA Générative · Prompt Engineering — Dakar, Sénégal. Portfolio professionnel.",
  keywords: [
    "Data Analyst", "Big Data", "IA Générative", "Prompt Engineering",
    "Dakar", "Sénégal", "Portfolio",
  ],
  authors: [{ name: "Mbaitadjim Abba Serge" }],
  openGraph: {
    title: "Mbaitadjim Abba Serge — Le Don",
    description: "Data Analyst · Big Data · IA Générative — Dakar, Sénégal",
    locale: "fr_FR",
    type: "website",
    siteName: "Portfolio Le Don",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Mbaitadjim Abba Serge — Le Don — Portfolio Data & IA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mbaitadjim Abba Serge — Le Don",
    description: "Data Analyst · Big Data · IA Générative",
    images: ["/og-image.jpg"],
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Mbaitadjim Abba Serge",
  alternateName: "Le Don",
  jobTitle: "Data Analyst",
  url: "https://sergeabba.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Dakar",
    addressCountry: "SN",
  },
  alumniOf: { "@type": "EducationalOrganization", name: "ISM Digital Campus" },
  knowsAbout: ["Big Data", "Data Analysis", "Artificial Intelligence", "Prompt Engineering"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}