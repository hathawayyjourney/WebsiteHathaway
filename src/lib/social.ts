import type { SocialSettings } from '@/src/lib/settings-defaults';
import type { SocialIconName } from '@/src/components/ui/SocialIcon';

export type SocialLink = { icon: SocialIconName; name: string; href: string };

/**
 * Social accounts filled in Admin → Pengaturan → Media Sosial, in display order.
 * Empty ones are dropped: a "#" link is a dead link for visitors and crawlers.
 */
export function socialLinks(social: SocialSettings): SocialLink[] {
  const all: SocialLink[] = [
    { icon: 'instagram', name: 'Instagram', href: social.instagram },
    { icon: 'facebook', name: 'Facebook', href: social.facebook },
    { icon: 'youtube', name: 'YouTube', href: social.youtube },
    { icon: 'tiktok', name: 'TikTok', href: social.tiktok },
  ];
  return all.filter((item) => item.href);
}
