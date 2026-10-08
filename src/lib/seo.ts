import type { Metadata } from 'next';
import type { SiteImage } from '@/src/lib/image-assets';

// Shared SEO helpers: one place for the site URL, page metadata and schema.org ids.

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/+$/, '');
export const SITE_NAME = 'Hathaway Journey';
export const DEFAULT_TITLE = 'Hathaway Journey – Paket Tour Luar Negeri & Travel Terpercaya';
export const DEFAULT_DESCRIPTION =
  'Paket tour luar negeri ke Asia, Eropa, dan Timur Tengah bersama Hathaway Journey. Itinerary lengkap, harga transparan, booking mudah via WhatsApp.';

/** app/opengraph-image.jpg. Listed explicitly: a page that sets its own `openGraph` would otherwise drop it. */
export const DEFAULT_OG_IMAGE = {
  url: '/opengraph-image.jpg',
  width: 1200,
  height: 630,
  alt: 'Hathaway Journey — Explore More, Create Memories',
};

/** schema.org @id of the business, so pages can reference it instead of repeating it. */
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;

/** "/paket-tour" → "https://domain/paket-tour"; absolute URLs are returned unchanged. */
export function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

/** Trims long text to a meta description (≈160 chars) on a word boundary. */
export function toDescription(text: string | null | undefined, max = 160): string | undefined {
  const clean = text?.replace(/\s+/g, ' ').trim();
  if (!clean) return undefined;
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).replace(/\s+\S*$/, '')}…`;
}

type PageMetadataInput = {
  title?: string;
  description?: string;
  /** Canonical path, e.g. "/paket-tour". */
  path: string;
  /** Share image; defaults to the site-wide app/opengraph-image.jpg. */
  image?: SiteImage | string | null;
  noindex?: boolean;
};

/**
 * Full metadata for a public page. Next.js merges `openGraph`/`twitter` shallowly per segment,
 * so every page sets the complete objects here instead of relying on the root layout.
 */
export function pageMetadata({ title, description = DEFAULT_DESCRIPTION, path, image, noindex }: PageMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = typeof image === 'string' ? image : image?.src;
  const images = imageUrl ? [{ url: imageUrl, alt: (typeof image === 'object' && image?.alt) || title || SITE_NAME }] : [DEFAULT_OG_IMAGE];
  const shareTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;

  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      locale: 'id_ID',
      siteName: SITE_NAME,
      url,
      title: shareTitle,
      description,
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title: shareTitle,
      description,
      images: images.map((i) => i.url),
    },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
