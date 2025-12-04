import { NextRequest, NextResponse } from 'next/server';

export const locales = ['en', 'es', 'zh'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export function getLocale(request: NextRequest): Locale {
  // Check if locale is in the pathname
  const pathname = request.nextUrl.pathname;
  const pathnameLocale = pathname.split('/')[1];
  
  if (locales.includes(pathnameLocale as Locale)) {
    return pathnameLocale as Locale;
  }

  // Check Accept-Language header
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const preferredLocale = acceptLanguage
      .split(',')
      .map((lang) => lang.split(';')[0].trim().toLowerCase())
      .find((lang) => {
        if (lang.startsWith('zh')) return 'zh';
        if (lang.startsWith('es')) return 'es';
        if (lang.startsWith('en')) return 'en';
        return null;
      });

    if (preferredLocale) {
      if (preferredLocale.startsWith('zh')) return 'zh';
      if (preferredLocale.startsWith('es')) return 'es';
      if (preferredLocale.startsWith('en')) return 'en';
    }
  }

  // Check cookie
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLocale && locales.includes(cookieLocale as Locale)) {
    return cookieLocale as Locale;
  }

  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip middleware for static files, API routes, and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|webp|avif)$/)
  ) {
    return NextResponse.next();
  }

  const pathnameLocale = pathname.split('/')[1];
  const isLocaleInPath = locales.includes(pathnameLocale as Locale);

  // If locale is already in path, continue
  if (isLocaleInPath) {
    return NextResponse.next();
  }

  // Get the locale
  const locale = getLocale(request);

  // Redirect to locale-prefixed path
  const newUrl = new URL(`/${locale}${pathname}`, request.url);
  
  // Preserve query parameters
  newUrl.search = request.nextUrl.search;

  return NextResponse.redirect(newUrl);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico)$).*)',
  ],
};
