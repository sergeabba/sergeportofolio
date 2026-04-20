import { MetadataRoute } from 'next';

/**
 * Robots.txt généré dynamiquement
 * URL: https://sergeportfolio.vercel.app/robots.txt
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    ],
    sitemap: 'https://sergeportfolio.vercel.app/sitemap.xml',
    host: 'https://sergeportfolio.vercel.app',
  };
}
