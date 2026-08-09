import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const url = request.nextUrl.clone();
  const { pathname } = url;

  // Check if host is admin domain
  const isAdminDomain = host.startsWith('admin.');

  if (isAdminDomain) {
    // Ignore internal next assets, static files, and API endpoints
    if (
      pathname.startsWith('/_next') ||
      pathname.startsWith('/api') ||
      pathname.startsWith('/favicon') ||
      pathname.includes('.')
    ) {
      return NextResponse.next();
    }

    // On admin subdomain, if accessing root '/', '/account' or any non-admin route,
    // rewrite to the Admin Console
    if (pathname === '/' || !pathname.startsWith('/admin')) {
      url.pathname = '/admin';
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
