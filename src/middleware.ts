import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const hostname = request.headers.get('host') || ''

  // 1. Check for subdomains
  const isVendorSubdomain = hostname.startsWith('vendors.') || hostname === 'vendors.localhost:3000'
  const isAdminSubdomain = hostname.startsWith('admins.') || hostname === 'admins.localhost:3000'

  // 2. Rewrite URL for subdomains
  if (isVendorSubdomain && !url.pathname.startsWith('/vendor')) {
    url.pathname = `/vendor${url.pathname === '/' ? '' : url.pathname}`
    return NextResponse.rewrite(url)
  }

  if (isAdminSubdomain && !url.pathname.startsWith('/admin')) {
    url.pathname = `/admin${url.pathname === '/' ? '' : url.pathname}`
    return NextResponse.rewrite(url)
  }

  // 3. For normal paths or after rewrites, run the auth middleware
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
