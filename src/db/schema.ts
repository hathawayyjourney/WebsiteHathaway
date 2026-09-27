import {
  mysqlTable,
  int,
  varchar,
  text,
  bigint,
  boolean,
  date,
  timestamp,
  json,
  decimal,
  mysqlEnum,
  primaryKey,
  index,
} from 'drizzle-orm/mysql-core';

import {
  ROLES,
  REGIONS,
  PACKAGE_STATUS,
  PACKAGE_BADGES,
  SCHEDULE_STATUS,
  GALLERY_KINDS,
  TESTIMONIAL_STATUS,
  FAQ_GROUPS,
  type ItineraryItem,
  type HotelInfo,
  type TransportInfo,
  type TermSection,
} from './enums';

export * from './enums';

const timestamps = {
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
};

// ---------- Auth ----------

export const users = mysqlTable('users', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 120 }).notNull(),
  email: varchar('email', { length: 191 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  role: mysqlEnum('role', ROLES).notNull().default('ADMIN'),
  active: boolean('active').notNull().default(true),
  ...timestamps,
});

// ---------- Catalog ----------

export const categories = mysqlTable('categories', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 120 }).notNull().unique(),
  sort: int('sort').notNull().default(0),
});

export const destinations = mysqlTable(
  'destinations',
  {
    id: int('id').autoincrement().primaryKey(),
    name: varchar('name', { length: 120 }).notNull(),
    slug: varchar('slug', { length: 140 }).notNull().unique(),
    region: mysqlEnum('region', REGIONS).notNull(),
    country: varchar('country', { length: 120 }),
    image: varchar('image', { length: 500 }),
    description: text('description'),
    information: text('information'),
    bestTime: varchar('best_time', { length: 255 }),
    travelTips: text('travel_tips'),
    featured: boolean('featured').notNull().default(false),
    sort: int('sort').notNull().default(0),
    seoTitle: varchar('seo_title', { length: 191 }),
    metaDescription: varchar('meta_description', { length: 300 }),
    ...timestamps,
  },
  (t) => [index('destinations_region_idx').on(t.region)],
);

export const packages = mysqlTable(
  'packages',
  {
    id: int('id').autoincrement().primaryKey(),
    code: varchar('code', { length: 40 }),
    name: varchar('name', { length: 191 }).notNull(),
    slug: varchar('slug', { length: 191 }).notNull().unique(),
    categoryId: int('category_id').references(() => categories.id, { onDelete: 'set null' }),
    durationDays: int('duration_days').notNull(),
    countriesLabel: varchar('countries_label', { length: 60 }),
    departureLabel: varchar('departure_label', { length: 60 }),
    summary: varchar('summary', { length: 300 }),
    description: text('description'),
    price: bigint('price', { mode: 'number' }).notNull(),
    promoPrice: bigint('promo_price', { mode: 'number' }),
    childPrice: bigint('child_price', { mode: 'number' }),
    singleSupplement: bigint('single_supplement', { mode: 'number' }),
    deposit: bigint('deposit', { mode: 'number' }),
    thumbnail: varchar('thumbnail', { length: 500 }).notNull(),
    videoUrl: varchar('video_url', { length: 500 }),
    rating: decimal('rating', { precision: 2, scale: 1, mode: 'number' }),
    badge: mysqlEnum('badge', PACKAGE_BADGES),
    featured: boolean('featured').notNull().default(false),
    status: mysqlEnum('status', PACKAGE_STATUS).notNull().default('DRAFT'),
    includes: json('includes').$type<string[]>(),
    excludes: json('excludes').$type<string[]>(),
    hotels: json('hotels').$type<HotelInfo[]>(),
    transports: json('transports').$type<TransportInfo[]>(),
    terms: json('terms').$type<TermSection[]>(),
    sort: int('sort').notNull().default(0),
    seoTitle: varchar('seo_title', { length: 191 }),
    metaDescription: varchar('meta_description', { length: 300 }),
    ...timestamps,
  },
  (t) => [index('packages_status_idx').on(t.status), index('packages_category_idx').on(t.categoryId)],
);

export const packageDestinations = mysqlTable(
  'package_destinations',
  {
    packageId: int('package_id')
      .notNull()
      .references(() => packages.id, { onDelete: 'cascade' }),
    destinationId: int('destination_id')
      .notNull()
      .references(() => destinations.id, { onDelete: 'cascade' }),
  },
  (t) => [primaryKey({ columns: [t.packageId, t.destinationId] })],
);

export const packageImages = mysqlTable('package_images', {
  id: int('id').autoincrement().primaryKey(),
  packageId: int('package_id')
    .notNull()
    .references(() => packages.id, { onDelete: 'cascade' }),
  url: varchar('url', { length: 500 }).notNull(),
  caption: varchar('caption', { length: 191 }),
  sort: int('sort').notNull().default(0),
});

export const itineraryDays = mysqlTable('itinerary_days', {
  id: int('id').autoincrement().primaryKey(),
  packageId: int('package_id')
    .notNull()
    .references(() => packages.id, { onDelete: 'cascade' }),
  dayNo: int('day_no').notNull(),
  title: varchar('title', { length: 191 }).notNull(),
  items: json('items').$type<ItineraryItem[]>(),
  hotel: varchar('hotel', { length: 191 }),
  transport: varchar('transport', { length: 191 }),
});

// Status is set manually by admin (client decision) — no automatic quota logic.
export const schedules = mysqlTable(
  'schedules',
  {
    id: int('id').autoincrement().primaryKey(),
    packageId: int('package_id')
      .notNull()
      .references(() => packages.id, { onDelete: 'cascade' }),
    departureDate: date('departure_date', { mode: 'string' }).notNull(),
    returnDate: date('return_date', { mode: 'string' }),
    quota: int('quota'),
    seatsLeft: int('seats_left'),
    status: mysqlEnum('status', SCHEDULE_STATUS).notNull().default('OPEN'),
    note: varchar('note', { length: 191 }),
    ...timestamps,
  },
  (t) => [index('schedules_package_idx').on(t.packageId), index('schedules_date_idx').on(t.departureDate)],
);

// ---------- Content ----------

export const gallery = mysqlTable('gallery', {
  id: int('id').autoincrement().primaryKey(),
  kind: mysqlEnum('kind', GALLERY_KINDS).notNull(),
  category: varchar('category', { length: 60 }),
  title: varchar('title', { length: 191 }),
  imageUrl: varchar('image_url', { length: 500 }).notNull(),
  videoUrl: varchar('video_url', { length: 500 }),
  sort: int('sort').notNull().default(0),
  published: boolean('published').notNull().default(true),
  ...timestamps,
});

export const testimonials = mysqlTable('testimonials', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 120 }).notNull(),
  photo: varchar('photo', { length: 500 }),
  packageId: int('package_id').references(() => packages.id, { onDelete: 'set null' }),
  packageLabel: varchar('package_label', { length: 191 }),
  rating: int('rating').notNull().default(5),
  review: text('review').notNull(),
  videoUrl: varchar('video_url', { length: 500 }),
  date: date('date', { mode: 'string' }),
  status: mysqlEnum('status', TESTIMONIAL_STATUS).notNull().default('DRAFT'),
  featured: boolean('featured').notNull().default(false),
  ...timestamps,
});

export const teams = mysqlTable('teams', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 120 }).notNull(),
  position: varchar('position', { length: 120 }).notNull(),
  bio: text('bio'),
  photo: varchar('photo', { length: 500 }),
  sort: int('sort').notNull().default(0),
});

export const legalDocuments = mysqlTable('legal_documents', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 120 }).notNull(),
  number: varchar('number', { length: 120 }),
  fileUrl: varchar('file_url', { length: 500 }),
  sort: int('sort').notNull().default(0),
});

export const partners = mysqlTable('partners', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 120 }).notNull(),
  logo: varchar('logo', { length: 500 }).notNull(),
  url: varchar('url', { length: 500 }),
  sort: int('sort').notNull().default(0),
});

export const faqs = mysqlTable('faqs', {
  id: int('id').autoincrement().primaryKey(),
  group: mysqlEnum('group', FAQ_GROUPS).notNull().default('General'),
  question: varchar('question', { length: 300 }).notNull(),
  answer: text('answer').notNull(),
  sort: int('sort').notNull().default(0),
  published: boolean('published').notNull().default(true),
  ...timestamps,
});

export const contactMessages = mysqlTable('contact_messages', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 120 }).notNull(),
  whatsapp: varchar('whatsapp', { length: 30 }).notNull(),
  email: varchar('email', { length: 191 }),
  subject: varchar('subject', { length: 191 }),
  message: text('message').notNull(),
  isRead: boolean('is_read').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Key/value store for site-wide config (contact, social, home sections, company profile, WA templates).
export const settings = mysqlTable('settings', {
  key: varchar('key', { length: 64 }).primaryKey(),
  value: json('value').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});
