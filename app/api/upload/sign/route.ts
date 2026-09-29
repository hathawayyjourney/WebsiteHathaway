import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/src/server/auth/session';
import { cloudinaryConfig, signUpload } from '@/src/lib/cloudinary';

export async function POST() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const config = cloudinaryConfig();
  if (!config) return NextResponse.json({ error: 'Cloudinary belum dikonfigurasi' }, { status: 503 });

  const timestamp = Math.round(Date.now() / 1000);
  const params = { folder: config.folder, timestamp };
  return NextResponse.json({
    cloudName: config.cloudName,
    apiKey: config.apiKey,
    folder: config.folder,
    timestamp,
    signature: signUpload(params, config.apiSecret),
  });
}
