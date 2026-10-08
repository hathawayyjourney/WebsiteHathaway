import type { MetadataRoute } from 'next';
import { DEFAULT_DESCRIPTION, SITE_NAME } from '@/src/lib/seo';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: 'Hathaway',
    description: DEFAULT_DESCRIPTION,
    lang: 'id',
    start_url: '/',
    display: 'standalone',
    background_color: '#F4F8FC',
    theme_color: '#082A63',
    // Generated with favicon.io (public/android-chrome-*.png).
    icons: [
      { src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
