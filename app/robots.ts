import type { MetadataRoute } from 'next';
import { absoluteUrl, SITE_URL } from '@/src/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api'] },
    sitemap: absoluteUrl('/sitemap.xml'),
    host: SITE_URL,
  };
}
