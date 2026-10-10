import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const hostname = request.headers.get('host') || ''
  const isVendorSubdomain = hostname.startsWith('vendors.') || hostname === 'vendors.localhost:3000'
  const isAdminSubdomain = hostname.startsWith('admins.') || hostname === 'admins.localhost:3000'

  // Determine logical path (after imaginary rewrite)
  let logicalPathname = request.nextUrl.pathname
  if (isVendorSubdomain && !logicalPathname.startsWith('/vendor')) {
    logicalPathname = `/vendor${logicalPathname === '/' ? '' : logicalPathname}`
  } else if (isAdminSubdomain && !logicalPathname.startsWith('/admin')) {
    logicalPathname = `/admin${logicalPathname === '/' ? '' : logicalPathname}`
  }

  const isAuthPage = logicalPathname.startsWith('/vendor/login') || logicalPathname.startsWith('/vendor/register');
  const isVendorRoute = logicalPathname.startsWith('/vendor');

  if (isVendorRoute) {
    if (!user && !isAuthPage) {
      const url = request.nextUrl.clone()
      url.pathname = isVendorSubdomain ? '/login' : '/vendor/login'
      return NextResponse.redirect(url)
    }

    if (user && isAuthPage) {
      const url = request.nextUrl.clone()
      url.pathname = isVendorSubdomain ? '/' : '/vendor'
      return NextResponse.redirect(url)
    }
  }

  // If no auth redirect was needed, and we are on a subdomain, we must return the rewrite
  if (isVendorSubdomain && !request.nextUrl.pathname.startsWith('/vendor')) {
    const rewriteUrl = request.nextUrl.clone()
    rewriteUrl.pathname = `/vendor${request.nextUrl.pathname === '/' ? '' : request.nextUrl.pathname}`
    
    // Create a new rewrite response but copy the cookies from supabaseResponse
    const rewriteResponse = NextResponse.rewrite(rewriteUrl)
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      rewriteResponse.cookies.set(cookie.name, cookie.value)
    })
    return rewriteResponse
  }

  if (isAdminSubdomain && !request.nextUrl.pathname.startsWith('/admin')) {
    const rewriteUrl = request.nextUrl.clone()
    rewriteUrl.pathname = `/admin${request.nextUrl.pathname === '/' ? '' : request.nextUrl.pathname}`
    
    const rewriteResponse = NextResponse.rewrite(rewriteUrl)
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      rewriteResponse.cookies.set(cookie.name, cookie.value)
    })
    return rewriteResponse
  }

  return supabaseResponse
}
