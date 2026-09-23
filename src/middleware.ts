import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Static legacy WordPress and URL aliases mapping with status codes
const KNOWN_LEGACY_REDIRECTS: Record<string, { to: string; status: number }> = {
  '/wp-admin': { to: '/admin', status: 301 },
  '/wp-admin/': { to: '/admin', status: 301 },
  '/wp-login.php': { to: '/admin/login', status: 301 },
  '/feed': { to: '/yangiliklar', status: 301 },
  '/feed/': { to: '/yangiliklar', status: 301 },
  '/category/yangiliklar': { to: '/yangiliklar', status: 301 },
  '/category/yangiliklar/': { to: '/yangiliklar', status: 301 },
  '/category/elonlar': { to: '/elonlar', status: 301 },
  '/category/elonlar/': { to: '/elonlar', status: 301 },
  '/sample-page': { to: '/maktab-haqida', status: 301 },
  '/sample-page/': { to: '/maktab-haqida', status: 301 },
  '/maktab-profili': { to: '/school-profile', status: 301 },
  '/maktab-profili/': { to: '/school-profile', status: 301 },
  '/haqimizda': { to: '/maktab-haqida', status: 301 },
  '/haqimizda/': { to: '/maktab-haqida', status: 301 },
  '/pedagoglar': { to: '/oqituvchilar', status: 301 },
  '/pedagoglar/': { to: '/oqituvchilar', status: 301 },
  '/yangiliklar-va-elonlar': { to: '/yangiliklar', status: 301 },
  '/yangiliklar-va-elonlar/': { to: '/yangiliklar', status: 301 },
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  // 1. Check known legacy redirects immediately (301 Permanent)
  const legacyMatch = KNOWN_LEGACY_REDIRECTS[pathname]
  if (legacyMatch) {
    const destinationUrl = new URL(legacyMatch.to + search, request.url)
    return NextResponse.redirect(destinationUrl, { status: legacyMatch.status })
  }

  // 2. Admin Authentication Guard
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('payload-token')?.value
    const isAuthPage = pathname === '/admin/login' || pathname === '/admin/reset-password'

    if (!token && !isAuthPage) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    if (token && isAuthPage) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, favicon.svg
     * - media files
     */
    '/((?!_next/static|_next/image|favicon.ico|favicon.svg|media/).*)',
  ],
}
