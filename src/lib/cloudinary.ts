import 'server-only';
import { createHash } from 'node:crypto';

export function cloudinaryConfig() {
  const { CLOUDINARY_CLOUD_NAME: cloudName, CLOUDINARY_API_KEY: apiKey, CLOUDINARY_API_SECRET: apiSecret } = process.env;
  if (!cloudName || !apiKey || !apiSecret) return null;
  return { cloudName, apiKey, apiSecret, folder: process.env.CLOUDINARY_FOLDER || 'hathaway' };
}

/** Signature for a direct browser → Cloudinary upload (params sorted alphabetically). */
export function signUpload(params: Record<string, string | number>, apiSecret: string): string {
  const toSign = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join('&');
  return createHash('sha1').update(toSign + apiSecret).digest('hex');
}
