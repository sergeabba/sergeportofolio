import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";

/* ── Outfit  bold display headings ── */
const outfit = Outfit({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-display",
  display: "swap",
});

/* ── Instrument Serif  elegant italic for first name ── */
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
  variable: "--font-serif",
  display: "swap",
});

/* ── Plus Jakarta Sans  clean body ── */
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sergeabba.com"),
  title: "Mbaitadjim Abba Serge  Le Don · Portfolio",
  description:
    "Data Analyst Junior · Big Data · IA Générative · Prompt Engineering  Dakar, Sénégal. Portfolio professionnel.",
  keywords: ["Data Analyst", "Big Data", "IA Générative", "Prompt Engineering", "Power BI", "Python", "Dakar", "Sénégal", "Portfolio"],
  authors: [{ name: "Mbaitadjim Abba Serge" }],
  openGraph: {
    title: "Mbaitadjim Abba Serge  Le Don",
    description: "Data Analyst Junior · Big Data · IA Générative  Dakar, Sénégal",
    locale: "fr_FR",
    type: "website",
    siteName: "Portfolio Le Don",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Mbaitadjim Abba Serge  Portfolio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mbaitadjim Abba Serge  Le Don",
    description: "Data Analyst Junior · Big Data · IA Générative",
    images: ["/og-image.jpg"],
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Mbaitadjim Abba Serge",
  alternateName: "Le Don",
  jobTitle: "Data Analyst Junior",
  url: "https://sergeabba.com",
  address: { "@type": "PostalAddress", addressLocality: "Dakar", addressCountry: "SN" },
  alumniOf: { "@type": "EducationalOrganization", name: "ISM Digital Campus" },
  knowsAbout: ["Big Data", "Data Analysis", "Artificial Intelligence", "Prompt Engineering"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${jakarta.variable} ${outfit.variable} ${instrumentSerif.variable}`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className="dark">{children}</body>
    </html>
  );
}


