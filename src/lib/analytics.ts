// GA4 event helper (no-op when GA is not configured). FSD bab 31 event names.
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export type AnalyticsEvent =
  | 'view_package'
  | 'search_package'
  | 'click_whatsapp'
  | 'click_booking_wa'
  | 'view_destination'
  | 'submit_contact';

export function track(event: AnalyticsEvent, params: Record<string, unknown> = {}) {
  if (typeof window !== 'undefined') window.gtag?.('event', event, params);
}
