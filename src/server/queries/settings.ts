import 'server-only';
import { cache } from 'react';
import { inArray } from 'drizzle-orm';
import { connection } from 'next/server';
import { db } from '@/src/db';
import { settings } from '@/src/db/schema';
import { SETTINGS_DEFAULTS, type SettingKey, type SettingsMap } from '@/src/lib/settings-defaults';

function merge<K extends SettingKey>(key: K, stored: unknown): SettingsMap[K] {
  const fallback = SETTINGS_DEFAULTS[key];
  if (stored == null) return fallback;
  if (Array.isArray(fallback)) return (Array.isArray(stored) ? stored : fallback) as SettingsMap[K];
  return { ...fallback, ...(stored as object) } as SettingsMap[K];
}

/** Loads several setting keys in one query; missing keys fall back to defaults. */
export const getSettings = cache(async <K extends SettingKey>(...keys: K[]): Promise<Pick<SettingsMap, K>> => {
  await connection();
  const rows = await db.select().from(settings).where(inArray(settings.key, keys));
  const byKey = new Map(rows.map((r) => [r.key, r.value]));
  return Object.fromEntries(keys.map((k) => [k, merge(k, byKey.get(k))])) as Pick<SettingsMap, K>;
});

export async function getSetting<K extends SettingKey>(key: K): Promise<SettingsMap[K]> {
  return (await getSettings(key))[key];
}
