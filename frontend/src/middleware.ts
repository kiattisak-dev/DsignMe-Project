// C:\Users\Admin\Documents\GitHub\DsignMe-Project\frontend\src\middleware.ts
import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes = [
  '/admin/dashboard',
  '/admin/dashboard/contacts',
  '/admin/dashboard/projects',
  '/admin/dashboard/projects/new',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute) {
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};