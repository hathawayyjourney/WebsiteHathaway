import 'server-only';
import { drizzle, type MySql2Database } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';

// Reuse one pool across hot reloads in dev.
const globalForDb = globalThis as unknown as { mysqlPool?: mysql.Pool };

function createPool() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is not set');
  return mysql.createPool({ uri: url, connectionLimit: 5, dateStrings: true });
}

const pool = globalForDb.mysqlPool ?? createPool();
if (process.env.NODE_ENV !== 'production') globalForDb.mysqlPool = pool;

export const db: MySql2Database<typeof schema> = drizzle(pool, { schema, mode: 'default' });
