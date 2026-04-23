import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const AUTH_PREFIXES = ['/login', '/signup']

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const session = request.cookies.get('__session')
  const role = request.cookies.get('__role')
  const isAuthenticated = Boolean(session?.value)
  const userRole = role?.value

  // Authenticated users don't need auth pages — send them home
  if (AUTH_PREFIXES.some((p) => pathname.startsWith(p)) && isAuthenticated) {
    const destination = userRole === 'manager' ? '/manager' : '/employee'
    return NextResponse.redirect(new URL(destination, request.url))
  }

  // Unauthenticated users can't access protected routes
  if (
    (pathname.startsWith('/employee') || pathname.startsWith('/manager')) &&
    !isAuthenticated
  ) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Employees can't access manager routes
  if (pathname.startsWith('/manager') && userRole !== 'manager') {
    return NextResponse.redirect(new URL('/employee', request.url))
  }

  // Managers can't access employee routes
  if (pathname.startsWith('/employee') && userRole === 'manager') {
    return NextResponse.redirect(new URL('/manager', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
