// src\components\auth\AuthGuard.js
"use client";
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthGuard({ children, requireAuth = true }) {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // If authentication is required but user is not authenticated
      if (requireAuth && !isAuthenticated) {
        router.push('/signin');
      }
      
      // If user is authenticated but trying to access auth pages (like signin)
      if (!requireAuth && isAuthenticated && user) {
        // Redirect based on user system role - THIS IS NECESSARY!
        // const userRole = user.role?.name || user.role;
        //  const userRole = user.systemRole || user.role?.name || user.role;
         const userRole = user.systemRole;
        let redirectPath = '/employee/dashboard';
        
        if (userRole === 'HR_ADMIN') {
          redirectPath = '/hr/dashboard';
        } else if (userRole === 'SUPER_ADMIN') {
          redirectPath = '/super-admin/dashboard';
        }
        
        console.log('AuthGuard redirecting authenticated user to:', redirectPath, 'for role:', userRole);
        router.push(redirectPath);
      }
    }
  }, [isAuthenticated, loading, requireAuth, router, user]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If redirecting, show nothing briefly
  if ((requireAuth && !isAuthenticated) || (!requireAuth && isAuthenticated)) {
    return null;
  }

  return children;
}