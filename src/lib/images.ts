import 'server-only';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { IMAGE_ASSETS, type ImageKey, type SiteImage } from './image-assets';

export type { SiteImage };

const cache = new Map<string, boolean>();

function hasFile(file: string): boolean {
  // Re-check on every call in dev so newly generated files show up without a restart.
  if (process.env.NODE_ENV === 'production' && cache.has(file)) return cache.get(file)!;
  const exists = existsSync(path.join(process.cwd(), 'public', file));
  cache.set(file, exists);
  return exists;
}

/** Generated image if present in public/, else its fallback, else null (caller hides the layer). */
export function getImage(key: ImageKey): SiteImage | null {
  const asset = IMAGE_ASSETS[key];
  if (hasFile(asset.file)) return { src: `/${asset.file}`, alt: asset.alt, position: 'position' in asset ? asset.position : undefined };
  const fallback = 'fallback' in asset ? asset.fallback : undefined;
  return fallback ? { src: fallback, alt: asset.alt } : null;
}

/**
 * For images that admins can also set in Pengaturan: a custom admin value wins,
 * then the generated static file, then the original default.
 */
export function pickImage(key: ImageKey, current: string, defaultValue: string): string {
  if (current && current !== defaultValue) return current;
  return getImage(key)?.src ?? defaultValue;
}
