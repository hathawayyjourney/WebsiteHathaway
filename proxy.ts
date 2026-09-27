import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE, verifySession } from '@/src/server/auth/jwt';

// Optimistic check only: real authorization happens in requireUser() on every admin page/action.
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await verifySession(request.cookies.get(SESSION_COOKIE)?.value);

  if (pathname === '/admin/login') {
    return session ? NextResponse.redirect(new URL('/admin', request.url)) : NextResponse.next();
  }
  if (!session) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
