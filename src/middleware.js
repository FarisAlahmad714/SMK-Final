// src/middleware.js
import { NextResponse } from 'next/server'

export function middleware(request) {
  const isAdminPage = request.nextUrl.pathname.startsWith('/admin')
  const isLoginPage = request.nextUrl.pathname === '/admin'
  const hasAdminSession = request.cookies.has('admin-session')

  if (isAdminPage && !isLoginPage && !hasAdminSession) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  if (isLoginPage && hasAdminSession) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*'
}