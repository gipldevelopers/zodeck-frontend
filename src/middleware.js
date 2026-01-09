// src/middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;
  
  // If no token and trying to access protected routes, redirect to signin
  if (!token && pathname.startsWith('/dashboard')) {
    const loginUrl = new URL('/signin', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Get user role from cookie
  const userRole = request.cookies.get('userRole')?.value;

  // If no role but has token, we might need to decode it
  // (Add your JWT decoding logic here if needed)

  // Role-based route protection
  if (userRole) {
    console.log(`Middleware: User role=${userRole}, Path=${pathname}`);
    
    // 1. EMPLOYEE restrictions
    if (userRole === 'EMPLOYEE') {
      if (pathname.startsWith('/hr/') || pathname.startsWith('/super-admin/')) {
        console.log('Redirecting employee to employee dashboard');
        return NextResponse.redirect(new URL('/employee/dashboard', request.url));
      }
    }
    
    // 2. HR_ADMIN restrictions
    else if (userRole === 'HR_ADMIN') {
      if (pathname.startsWith('/employee/')) {
        console.log('Redirecting HR admin to HR dashboard');
        return NextResponse.redirect(new URL('/hr/dashboard', request.url));
      }
      if (pathname.startsWith('/super-admin/')) {
        console.log('Redirecting HR admin to HR dashboard (super admin access denied)');
        return NextResponse.redirect(new URL('/hr/dashboard', request.url));
      }
    }
    
    // 3. SUPER_ADMIN restrictions
    else if (userRole === 'SUPER_ADMIN') {
      if (pathname.startsWith('/employee/')) {
        console.log('Redirecting Super Admin to super admin dashboard');
        return NextResponse.redirect(new URL('/super-admin/dashboard', request.url));
      }
      // Super Admin CAN access HR routes, so no restriction here
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/employee/:path*',
    '/hr/:path*',
    '/super-admin/:path*',
    '/dashboard/:path*'
  ],
};