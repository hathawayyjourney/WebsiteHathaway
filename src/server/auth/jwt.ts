// Edge/Node-safe JWT helpers shared by proxy.ts and server code.
import { SignJWT, jwtVerify } from 'jose';
import type { Role } from '@/src/db/enums';

export const SESSION_COOKIE = 'hj_session';
export const SESSION_TTL_SECONDS = 60 * 60 * 12; // 12 hours

export type SessionPayload = { userId: number; role: Role };

function key() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error('SESSION_SECRET must be set (min 32 chars)');
  return new TextEncoder().encode(secret);
}

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(key());
}

export async function verifySession(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key(), { algorithms: ['HS256'] });
    if (typeof payload.userId !== 'number' || typeof payload.role !== 'string') return null;
    return { userId: payload.userId, role: payload.role as Role };
  } catch {
    return null;
  }
}
