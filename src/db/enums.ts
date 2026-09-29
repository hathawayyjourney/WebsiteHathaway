// Plain constants shared by schema, server and client code (no drizzle imports here).
export const ROLES = ['SUPER_ADMIN', 'ADMIN'] as const;
export const REGIONS = ['INDONESIA', 'ASIA', 'EROPA', 'TIMUR_TENGAH', 'AFRIKA', 'AMERIKA', 'LAINNYA'] as const;
export const PACKAGE_STATUS = ['DRAFT', 'PUBLISHED'] as const;
export const PACKAGE_BADGES = ['HOT DEAL', 'BEST SELLER', 'POPULAR', 'FAVORITE', 'PROMO'] as const;
export const SCHEDULE_STATUS = ['OPEN', 'LIMITED', 'FULL', 'SOLD_OUT', 'CLOSED'] as const;
export const GALLERY_KINDS = ['FOTO', 'VIDEO_TOUR', 'VIDEO_TESTIMONI'] as const;
export const PHOTO_CATEGORIES = ['Foto Grup', 'Foto Destinasi', 'Foto Hotel', 'Foto Aktivitas'] as const;
export const TESTIMONIAL_STATUS = ['DRAFT', 'PUBLISHED', 'HIDDEN'] as const;
export const FAQ_GROUPS = ['Booking', 'Payment', 'Tour', 'Visa', 'Hotel', 'Cancellation', 'Refund', 'General'] as const;

export type Role = (typeof ROLES)[number];
export type Region = (typeof REGIONS)[number];
export type ScheduleStatus = (typeof SCHEDULE_STATUS)[number];
export type GalleryKind = (typeof GALLERY_KINDS)[number];

// JSON column shapes
export type ItineraryItem = { time?: string; location?: string; activity: string; meal?: string };
export type HotelInfo = { name: string; star?: number; location?: string; roomType?: string };
export type TransportInfo = { type: string; detail: string };
export type TermSection = { title: string; content: string };

