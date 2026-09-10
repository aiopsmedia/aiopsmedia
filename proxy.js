import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

const publicPaths = [
  '/',
  '/login',
  '/api/auth',
  '/api/contact',
  '/api/seed',
  '/api/sitemap',
  '/api/health',
  '/blog',
  '/services',
  '/products',
  '/about',
  '/contact',
  '/pricing',
  '/case-studies',
  '/industries',
  '/usa',
  '/uk',
  '/uae',
  '/estimate',
  '/book-consultation',
  '/resources',
  '/technology',
  '/careers',
  '/search',
  '/landing',
  '/privacy-policy',
  '/terms-conditions',
  '/cookies-policy',
  '/data-protection',
  '/refund-policy',
];

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  const isPublicPath = publicPaths.some((path) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  });

  if (isPublicPath) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const session = await auth();

    if (!session) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    const userRole = session.user?.role;
    const allowedRoles = [
      'SUPER_ADMIN',
      'ADMIN',
      'MANAGER',
      'SALES',
      'FINANCE',
      'HR',
      'EDITOR',
      'EMPLOYEE',
      'VIEWER',
    ];

    if (!allowedRoles.includes(userRole)) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
