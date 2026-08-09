import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const url = request.nextUrl.clone();
  const { pathname } = url;

  const isAdminDomain = host.startsWith('admin.');
  const sessionToken = request.cookies.get('tanavi_session')?.value;

  // Ignore internal assets, static files, and API endpoints
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Handle Admin Domain (admin.tanavidesigns.com)
  if (isAdminDomain) {
    if (pathname === '/admin/login' || pathname === '/login') {
      if (sessionToken) {
        url.pathname = '/admin';
        return NextResponse.redirect(url);
      }
      url.pathname = '/admin/login';
      return NextResponse.rewrite(url);
    }

    // Require authentication for all admin domain pages
    if (!sessionToken) {
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }

    if (pathname === '/' || !pathname.startsWith('/admin')) {
      url.pathname = '/admin';
      return NextResponse.rewrite(url);
    }
  }

  // Handle Main Domain (/admin paths)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!sessionToken) {
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
