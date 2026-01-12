// src/app/(dashboard)/layout.js
"use client";
import AuthGuard from "@/components/auth/AuthGuard";
import { useAuth } from "@/context/AuthContext";
import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import HRMSLoader from "@/components/common/HRMSLoader";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({ children }) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/signin');
    }
  }, [isAuthenticated, loading, router]); // Added router to dependencies

  // Show loading state while checking authentication
  if (loading) {
    return <HRMSLoader text="Initializing dashboard..." variant="fullscreen" size="md" />;
  }

  // Return null during redirect to avoid flash of content
  if (!isAuthenticated) {
    return null;
  }

  // Dynamic class for main content margin based on sidebar state
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
      ? "lg:ml-[260px]"
      : "lg:ml-[90px]";

  return (
    <AuthGuard requireAuth={true}>
      {/* <ErrorBoundary> */}
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Sidebar and Backdrop */}
        <AppSidebar /> {/* Removed userRole prop - AppSidebar now uses useAuth() */}
        <Backdrop />

        {/* Main Content Area */}
        <div
          className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}
        >
          {/* Header */}
          <AppHeader user={user} />

          {/* Page Content */}
          <main className="p-4 mx-auto max-w-screen-2xl md:p-6 2xl:p-10">
            {children}
          </main>
        </div>
      </div>
      {/* </ErrorBoundary> */}
    </AuthGuard>
  );
}