import 'server-only';
import { cache } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { db } from '@/src/db';
import { users } from '@/src/db/schema';
import type { Role } from '@/src/db/enums';
import { SESSION_COOKIE, SESSION_TTL_SECONDS, signSession, verifySession } from './jwt';

export async function createSession(userId: number, role: Role) {
  const token = await signSession({ userId, role });
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function deleteSession() {
  (await cookies()).delete(SESSION_COOKIE);
}

/** Current admin user (re-checked against the DB so deactivated users lose access immediately). */
export const getCurrentUser = cache(async () => {
  const session = await verifySession((await cookies()).get(SESSION_COOKIE)?.value);
  if (!session) return null;
  const [user] = await db
    .select({ id: users.id, name: users.name, email: users.email, role: users.role, active: users.active })
    .from(users)
    .where(eq(users.id, session.userId))
    .limit(1);
  return user?.active ? user : null;
});

export type CurrentUser = NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;

/**
 * Authorization gate for admin pages and server actions.
 * Always call this inside every admin Server Action — proxy.ts is only an optimistic check.
 */
export async function requireUser(role?: Role): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect('/admin/login');
  if (role === 'SUPER_ADMIN' && user.role !== 'SUPER_ADMIN') redirect('/admin?forbidden=1');
  return user;
}
