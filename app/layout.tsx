import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/lib/theme";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-outfit",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
  variable: "--font-serif-var",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sergeabba.com"),
  title: {
    default: "Mbaitadjim Abba Serge — Data Analyst Junior · Portfolio",
    template: "%s | Mbaitadjim Abba Serge",
  },
  description:
    "Data Analyst Junior spécialisé en Big Data, IA Générative et Prompt Engineering. Portfolio professionnel de Mbaitadjim Abba Serge — Dakar, Sénégal.",
  keywords: [
    "Data Analyst",
    "Big Data",
    "IA Générative",
    "Prompt Engineering",
    "Power BI",
    "Python",
    "SQL",
    "Pandas",
    "Data Visualization",
    "Dakar",
    "Sénégal",
    "Portfolio",
    "Mbaitadjim Abba Serge",
  ],
  authors: [{ name: "Mbaitadjim Abba Serge", url: "https://sergeabba.com" }],
  creator: "Mbaitadjim Abba Serge",
  publisher: "Mbaitadjim Abba Serge",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://sergeabba.com",
    siteName: "Portfolio — Mbaitadjim Abba Serge",
    title: "Mbaitadjim Abba Serge — Data Analyst Junior",
    description: "Data Analyst Junior spécialisé en Big Data, IA Générative et Prompt Engineering — Dakar, Sénégal",
    countryName: "Sénégal",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Mbaitadjim Abba Serge — Data Analyst Junior Portfolio",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mbaitadjim Abba Serge — Data Analyst Junior",
    description: "Data Analyst Junior spécialisé en Big Data, IA Générative et Prompt Engineering — Dakar, Sénégal",
    images: ["/og-image.jpg"],
    creator: "@sergeabba",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
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
    <html
      lang="fr"
      className={`${jakarta.variable} ${outfit.variable} ${instrumentSerif.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        style={{
          fontFamily: "var(--font-body, sans-serif)",
          fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"',
        }}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}