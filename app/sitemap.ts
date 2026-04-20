import { MetadataRoute } from 'next';

/**
 * Sitemap généré dynamiquement pour le portfolio
 * URL: https://sergeportfolio.vercel.app/sitemap.xml
 *
 * Note: Le site est une SPA (Single Page App). Les ancres (#section) sont ignorées
 * par les moteurs de recherche, donc seule l'URL racine est référencée.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://sergeportfolio.vercel.app';
  const lastModified = new Date('2026-04-20');

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}
