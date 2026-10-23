'use client';

import { useEffect } from 'react';
import { track } from '@/src/lib/analytics';

/**
 * Sends a GA4 `click_whatsapp` event for any link marked `data-wa="<location>"` (floating button,
 * header, hero, CTA, FAQ). One delegated listener, so those links can stay server-rendered.
 * Booking buttons track their own events and are not marked, to avoid double counting.
 */
export default function WhatsAppClickTracker() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.<HTMLAnchorElement>('a[data-wa]');
      if (link) track('click_whatsapp', { location: link.dataset.wa, page: window.location.pathname });
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);
  return null;
}
