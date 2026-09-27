import type { Metadata } from 'next';
import GalleryClient from '@/src/components/gallery/GalleryClient';
import { getGallery } from '@/src/server/queries/content';

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Kumpulan momen indah perjalanan dan testimoni dari pelanggan Hathaway Journey.',
};

const VIDEO_TAB = { VIDEO_TOUR: 'VIDEO TOUR', VIDEO_TESTIMONI: 'VIDEO TESTIMONI' } as const;

export default async function GalleryPage() {
  const items = await getGallery();
  const photos = items
    .filter((i) => i.kind === 'FOTO')
    .map((i) => ({ id: i.id, category: i.category ?? 'Foto Destinasi', url: i.imageUrl, title: i.title }));
  const videos = items
    .filter((i) => i.kind !== 'FOTO')
    .map((i) => ({ id: i.id, type: VIDEO_TAB[i.kind as keyof typeof VIDEO_TAB], title: i.title ?? '', thumb: i.imageUrl, videoUrl: i.videoUrl }));

  return <GalleryClient photos={photos} videos={videos} />;
}
