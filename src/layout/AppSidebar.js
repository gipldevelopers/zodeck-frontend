// src\layout\AppSidebar.js
"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";
import {
  LayoutDashboard,
  Users,
  Target,
  Grid,
  Building2,
  Building,
  Calendar,
  CalendarDays,
  Clock,
  FileText,
  Settings,
  UserCircle,
  ChevronRight,
  X,
  GitBranch,
  Plug,
  FileCheck,
  Shield,
  CalendarCheck,
  Briefcase,
  UserPlus,
  BarChart3,
  FileBarChart,
  ShieldCheck,
  Wallet,
  TrendingUp,
  Banknote,
  Receipt,
  Box,
  FolderKanban,
  DollarSign,
  LogOut
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// Super Admin Navigation Items
const superAdminNavItems = [
  {
    icon: <LayoutDashboard size={18} />,
    name: "Dashboard",
    path: "/super-admin/dashboard",
  },
    {
    icon: <Shield size={20} />,
    name: "Roles & Permissions",
    subItems: [
      { name: "Role Management", path: "/super-admin/roles-permissions" },
      { name: "Add New Role", path: "/super-admin/roles-permissions/add" },
    ],
  },
  {
    icon: <Users size={20} />,
    name: "User Management",
    subItems: [
      { name: "All Users", path: "/super-admin/users" },
    ],
  },
   {
    icon: <CalendarDays size={20} />,
    name: "Policy & Rule",
    subItems: [
      { name: "Policy List", path: "/super-admin/policy-rule" },
      { name: "Add Policy", path: "/super-admin/policy-rule/add" },
    ],
  },
  {
    icon: <Building size={20} />,
    name: "Company & Organization",
    path: "/super-admin/company-orgranization",
  },
 
  {
    icon: <GitBranch size={18} />,
    name: "Workflow Management",
    subItems: [
      { name: "Workflow List", path: "/super-admin/workflow-management" },
      { name: "Add Workflow", path: "/super-admin/workflow-management/add" },
    ],
  },
  {
    icon: <Plug size={18} />,
    name: "Integration Center",
    subItems: [
      { name: "All Integrations", path: "/super-admin/integration-management" },
      { name: "Add Integration", path: "/super-admin/integration-management/add" },
    ],
  },
  {
    icon: <FileCheck size={18} />,
    name: "Policy & Rule",
    subItems: [
      { name: "Policy List", path: "/super-admin/policy-rule" },
      { name: "Add Policy", path: "/super-admin/policy-rule/add" },
    ],
  },
  {
    icon: <Shield size={18} />,
    name: "Roles & Permissions",
    subItems: [
      { name: "Role Management", path: "/super-admin/roles-permissions" },
      { name: "Add New Role", path: "/super-admin/roles-permissions/add" },
    ],
  },
  {
    icon: <Users size={18} />,
    name: "User Management",
    subItems: [
      { name: "All Users", path: "/super-admin/users" },
    ],
  },
];

// HR Admin Navigation Items
const hrNavItems = [
  {
    icon: <LayoutDashboard size={18} />,
    name: "Dashboard",
    path: "/hr/dashboard",
  },
  {
    icon: <Users size={18} />,
    name: "Employee Management",
    subItems: [
      { name: "Employee List", path: "/hr/employees" },
      { name: "Add Employee", path: "/hr/employees/add" },
    ],
  },
  {
    icon: <FolderKanban size={18} />,
    name: "Organization Structure",
    path: "/hr/organization-management",
  },
  {
    icon: <Briefcase size={18} />,
    name: "Workforce Management",
    path: "/hr/workforce",
  },
  {
    icon: <UserPlus size={18} />,
    name: "Onboarding & Exit",
    path: "/hr/onboarding-exit",
  },
  {
    icon: <FileText size={18} />,
    name: "Document Management",
    path: "/hr/document-management",
  },
  {
    icon: <Clock size={18} />,
    name: "Attendance",
    subItems: [
      { name: "Dashboard", path: "/hr/attendance" },
    ],
  },
  {
    icon: <Calendar size={18} />,
    name: "Leave Management",
    subItems: [
      { name: "Dashboard", path: "/hr/leave" },
      { name: "Leave Requests", path: "/hr/leave/requests" },
      { name: "Leave Types", path: "/hr/leave/types" },
      { name: "Leave Calendar", path: "/hr/leave/calendar" },
      { name: "Holiday Calendar", path: "/hr/leave/holidays" },
      { name: "Leave Reports", path: "/hr/leave/reports" },
      { name: "Leave Policies", path: "/hr/leave/policies" },
    ],
  },
  {
    icon: <Target size={18} />,
    name: "Performance Management",
    path: "/hr/performance-management",
  },
  {
    icon: <BarChart3 size={18} />,
    name: "Reports & Analytics",
    path: "/hr/reports-analytics",
  },
  {
    icon: <DollarSign size={18} />,
    name: "Payroll Management",
    subItems: [
      { name: "Payroll Dashboard", path: "/hr/payroll" },
      { name: "Salary Structure", path: "/hr/payroll/salary-structure" },
      { name: "Process Payroll", path: "/hr/payroll/process" },
      { name: "Payslips", path: "/hr/payroll/payslips" },
      { name: "Payroll Reports", path: "/hr/payroll/reports" },
      { name: "Tax Settings", path: "/hr/payroll/tax-settings" },
    ],
  },
  {
    icon: <Box size={18} />,
    name: "Asset Management",
    subItems: [
      { name: "Asset Inventory", path: "/hr/assets" },
      { name: "Add Asset", path: "/hr/assets/add" },
      { name: "Asset Categories", path: "/hr/assets/categories" },
      { name: "Asset Assignments", path: "/hr/assets/assignments" },
      { name: "Maintenance History", path: "/hr/assets/maintenance" },
      { name: "Asset Reports", path: "/hr/assets/reports" },
    ],
  },
];

// Employee Navigation Items
const employeeNavItems = [
  {
    icon: <LayoutDashboard size={18} />,
    name: "Dashboard",
    path: "/employee/dashboard",
  },
  {
    icon: <Clock size={18} />,
    name: "Attendance",
    subItems: [
      { name: "My Attendance", path: "/employee/attendance/my-attendance" },
      { name: "My Leaves", path: "/employee/attendance/my-leaves" },
      { name: "Leave Report", path: "/employee/attendance/leave-summery-details" },
      { name: "Holidays", path: "/employee/attendance/holidays" },
      { name: "Regularization", path: "/employee/attendance/regularization" },
      { name: "Overtime", path: "/employee/attendance/overtime" },
    ],
  },
  {
    icon: <Calendar size={18} />,
    name: "Leave Management",
    subItems: [
      { name: "Request Leave", path: "/employee/leave/request-leave" },
      { name: "Leave Balance", path: "/employee/leave/leave-balance" },
      { name: "Leave History", path: "/employee/leave/leave-history" },
    ],
  },
  {
    icon: <CalendarCheck size={18} />,
    name: "Holiday",
    subItems: [
      { name: "Holiday List", path: "/employee/holiday" }
    ],
  },
  {
    icon: <Wallet size={18} />,
    name: "Payrolls",
    subItems: [
      { name: "Salery Summery", path: "/employee/payslips/salery-summery" },
      { name: "Payslip", path: "/employee/payslips/pay-slips" },
      { name: "Payment History", path: "/employee/payslips/payment-history" },
      { name: "Tax Information", path: "/employee/payslips/tax-info" },
      { name: "Rembursment", path: "/employee/payslips/rembursment" },
    ],
  }, {
    icon: <TrendingUp size={18} />,
    name: "Performance & Goals",
    subItems: [
      { name: "Goals", path: "/employee/performance/goals" },
      { name: "KPIs", path: "/employee/performance/kpis" },
      { name: "Feedback", path: "/employee/performance/feedback" },
      { name: "Skills", path: "/employee/performance/skills" },
      { name: "Training", path: "/employee/performance/training" },
      { name: "Recognition", path: "/employee/performance/recognition" },
    ],
  },
  {
    icon: <Settings size={18} />,
    name: "Settings",
    subItems: [
      { name: "Profile Picture", path: "/employee/settings/profile-picture" },
      { name: "Contact Information", path: "/employee/settings/contact-information" },
      { name: "Password Management", path: "/employee/settings/password-management" },
      { name: "Two-Factor Authentication (2FA)", path: "/employee/settings/two-factor-auth" },
      { name: "Connected Devices", path: "/employee/settings/connected-devices" },
    ],
  },

];


// Finance Admin Navigation Items
const financeAdminNavItems = [
  {
    icon: <Grid size={20} />,
    name: "Dashboard",
    path: "/finance-role/dashboard",
  },
  {
    icon: <Banknote size={20} />,
    name: "Account & Bank Export",
    path: "/finance-role/account-bank-export",
  },
  {
    icon: <Receipt size={20} />,
    name: "Expense Reimbursement",
    path: "/finance-role/expense-reimbursement",
  },
  {
    icon: <DollarSign size={20} />,
    name: "Payroll Cost",
    path: "/finance-role/payroll-cost",
  },
  {
    icon: <FileBarChart size={20} />,
    name: "Reports",
    path: "/finance-role/reports",
  },
];

// Payroll Compliance Navigation Items
const payrollComplianceNavItems = [
  {
    icon: <Grid size={20} />,
    name: "Dashboard",
    path: "/payroll-compliance/dashboard",
  },
  {
    icon: <FileCheck size={20} />,
    name: "Full & Final Settlement",
    path: "/payroll-compliance/full-final-settlement",
  },
  {
    icon: <Settings size={20} />,
    name: "Payroll Processing",
    path: "/payroll-compliance/payroll-processing",
  },
  {
    icon: <FileBarChart size={20} />,
    name: "Payroll Reports",
    path: "/payroll-compliance/payroll-reports",
  },
  {
    icon: <DollarSign size={20} />,
    name: "Salary Structure",
    path: "/payroll-compliance/salary-structure",
  },
  {
    icon: <ShieldCheck size={20} />,
    name: "Statutory Compliance",
    path: "/payroll-compliance/statutory-compliance",
  },
];


const AppSidebar = () => {
  const { user, logout } = useAuth();
  const userRole = user?.systemRole || 'EMPLOYEE';

  const { isExpanded, isMobileOpen, isHovered, setIsHovered, toggleMobileSidebar } = useSidebar();
  const pathname = usePathname();

  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [subMenuHeight, setSubMenuHeight] = useState({});
  const subMenuRefs = useRef({});

  const isActive = useCallback((path) => path === pathname, [pathname]);

  // Check if any submenu item is active for a parent
  const hasActiveSubItem = useCallback((nav) => {
    if (!nav.subItems) return false;
    return nav.subItems.some(subItem => isActive(subItem.path));
  }, [isActive]);

  // Get appropriate navigation items based on user role
  const getNavItems = () => {
    switch (userRole) {
      case "SUPER_ADMIN":
        return superAdminNavItems;
      case "HR_ADMIN":
        return hrNavItems;
      case "PAYROLL_ADMIN":
        return payrollComplianceNavItems;
      case "FINANCE_ADMIN":
        return financeAdminNavItems;
      default:
        return employeeNavItems;
    }
  };

  useEffect(() => {
    let submenuMatched = false;
    const items = getNavItems();

    items.forEach((nav, index) => {
      if (nav.subItems) {
        nav.subItems.forEach((subItem) => {
          if (isActive(subItem.path)) {
            setOpenSubmenu({
              index,
            });
            submenuMatched = true;
          }
        });
      }
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname, isActive, userRole]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index) => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (prevOpenSubmenu?.index === index) {
        return null;
      }
      return { index };
    });
  };

  const renderMenuItems = (navItems) => (
    <ul className="flex flex-col gap-1">
      {navItems.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index)}
              className={`group w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all duration-200 ${hasActiveSubItem(nav) || openSubmenu?.index === index
                  ? "bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400"
                  : "text-gray-600 hover:bg-gray-50/80 dark:text-gray-400 dark:hover:bg-white/5"
                } ${!isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"}`}
            >
              <span
                className={`flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-200 mt-0.5 ${hasActiveSubItem(nav) || openSubmenu?.index === index
                    ? "bg-primary-100 text-primary-600 dark:bg-primary-500/20 dark:text-primary-400"
                    : "bg-gray-100 text-gray-500 group-hover:bg-primary-50 group-hover:text-primary-600 dark:bg-gray-800 dark:text-gray-400 dark:group-hover:bg-primary-500/10 dark:group-hover:text-primary-400"
                  }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <>
                  <span className={`flex-1 text-sm font-medium transition-colors duration-200 leading-tight ${hasActiveSubItem(nav) || openSubmenu?.index === index
                      ? "text-primary-700 dark:text-primary-400"
                      : "text-gray-700 dark:text-gray-300"
                    }`}>
                    {nav.name}
                  </span>
                  <ChevronRight
                    size={14}
                    className={`flex-shrink-0 transition-all duration-200 mt-0.5 ${openSubmenu?.index === index
                        ? "rotate-90 text-primary-600 dark:text-primary-400"
                        : "text-gray-400"
                      }`}
                  />
                </>
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    toggleMobileSidebar();
                  }
                }}
                className={`group w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all duration-200 ${isActive(nav.path)
                    ? "bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400"
                    : "text-gray-600 hover:bg-gray-50/80 dark:text-gray-400 dark:hover:bg-white/5"
                  }`}
              >
                <span
                  className={`flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-200 mt-0.5 ${isActive(nav.path)
                      ? "bg-primary-100 text-primary-600 dark:bg-primary-500/20 dark:text-primary-400"
                      : "bg-gray-100 text-gray-500 group-hover:bg-primary-50 group-hover:text-primary-600 dark:bg-gray-800 dark:text-gray-400 dark:group-hover:bg-primary-500/10 dark:group-hover:text-primary-400"
                    }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className={`flex-1 text-sm font-medium transition-colors duration-200 leading-tight ${isActive(nav.path)
                      ? "text-primary-700 dark:text-primary-400"
                      : "text-gray-700 dark:text-gray-300"
                    }`}>
                    {nav.name}
                  </span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300 ease-in-out"
              style={{
                height:
                  openSubmenu?.index === index
                    ? `${subMenuHeight[`${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-1.5 space-y-0.5 ml-9 pl-2.5 border-l border-primary-100/30 dark:border-gray-700">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.path}
                      onClick={() => {
                        if (window.innerWidth < 1024) {
                          toggleMobileSidebar();
                        }
                      }}
                      className={`block px-2.5 py-1.5 text-xs rounded-md transition-all duration-200 ${isActive(subItem.path)
                          ? "text-primary-700 font-medium dark:text-primary-400"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50/50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-white/5"
                        }`}
                    >
                      {subItem.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}

      {/* My Profile - Always visible for all users */}
      <li>
        <Link
          href={
            userRole === "SUPER_ADMIN" ? "/super-admin/profile" :
              userRole === "HR_ADMIN" ? "/hr/profile" :
                userRole === "PAYROLL_ADMIN" ? "/payroll-compliance/profile" :
                  userRole === "FINANCE_ADMIN" ? "/finance-role/profile" :
                    "/employee/profile"
          }
          onClick={() => {
            if (window.innerWidth < 1024) {
              toggleMobileSidebar();
            }
          }}
          className={`menu-item group w-full ${pathname.includes("profile") ? "menu-item-active" : "menu-item-inactive"
            }`}
        >
          <span
            className={`${pathname.includes("profile")
              ? "menu-item-icon-active"
              : "menu-item-icon-inactive"
              }`}
          >
            <UserCircle size={20} />
          </span>
          {(isExpanded || isHovered || isMobileOpen) && (
            <span className={`menu-item-text font-semibold`}>My Profile</span>
          )}
        </Link>
      </li>
    </ul>
  );

  return (
    <>
      {/* Mobile header toggle button - Removed as AppHeader provides one */
      /* <button
        onClick={toggleMobileSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md"
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button> */}

      <aside
        className={`fixed flex flex-col top-0 left-0 bg-white/95 backdrop-blur-xl dark:bg-gray-900/95 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200/50 dark:border-gray-800 shadow-sm
          /* Mobile: Full screen with backdrop */
          ${isMobileOpen ? "translate-x-0 w-[280px]" : "-translate-x-full w-[280px]"}
          
          /* Tablet: Half width or collapsed */
          md:${isMobileOpen ? "translate-x-0 w-[280px]" : "-translate-x-full w-[280px]"}
          
          /* Desktop: Responsive width */
          lg:translate-x-0 lg:w-auto
          lg:${isExpanded || isHovered ? "lg:w-[280px]" : "lg:w-[80px]"}
        `}
        onMouseEnter={() => !isExpanded && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Close button for mobile/tablet */}
        <div className="lg:hidden flex justify-end p-4 border-b border-gray-200/50 dark:border-gray-800">
          <button
            onClick={toggleMobileSidebar}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
          >
            <X size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <div
          className={`h-16 flex items-center px-4 lg:px-5 border-b border-gray-200/50 dark:border-gray-800 ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
            }`}
        >
          <Link
            href="/"
            className="flex items-center gap-3 transition-all duration-200 hover:opacity-80"
            onClick={() => {
              if (window.innerWidth < 1024) {
                toggleMobileSidebar();
              }
            }}
          >
            {/* Letter Logo - Always visible */}
            <div
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl shadow-sm transition-all duration-200 hover:shadow-md hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--hero-gradient-end)) 100%)'
              }}
            >
              <span className="text-white font-bold text-lg leading-none">Z</span>
            </div>

            {/* Company Name - Only visible when expanded */}
            {(isExpanded || isHovered || isMobileOpen) && (
              <div className="flex flex-col">
                <span
                  className="font-bold text-base leading-tight"
                  style={{
                    fontFamily: 'var(--font-space-grotesk)',
                    color: 'hsl(var(--foreground))'
                  }}
                >
                  Zodeck<span style={{ color: 'hsl(var(--primary))' }}>.</span>
                </span>
                <span className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 leading-tight mt-0.5">
                  {userRole === "SUPER_ADMIN"
                    ? "Super Admin"
                    : userRole === "HR_ADMIN"
                    ? "HR Portal"
                    : userRole === "PAYROLL_ADMIN"
                    ? "Payroll Compliance"
                    : userRole === "FINANCE_ADMIN"
                    ? "Finance Portal"
                    : "Employee Portal"}
                </span>
              </div>
            )}
          </Link>
        </div>
        {/* <div className="h-[1px] w-full bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-500 mb-4"></div> */}

        <div className="flex flex-col overflow-y-auto duration-300 ease-linear custom-scrollbar flex-1 px-3 lg:px-4 py-4">
          <nav>
            {renderMenuItems(getNavItems())}
          </nav>
        </div>

        {/* Employee Profile Card */}
        <div className="border-t border-gray-200/50 dark:border-gray-800 p-3 bg-white dark:bg-gray-900">
          {(isExpanded || isHovered || isMobileOpen) ? (
            <div className="space-y-2.5">
              {/* User Info */}
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-500/10 text-xs font-semibold text-primary-700 dark:text-primary-400">
                  {user?.employee?.firstName
                    ? `${user.employee.firstName.charAt(0).toUpperCase()}${user.employee.lastName ? user.employee.lastName.charAt(0).toUpperCase() : ""}`
                    : user?.email ? user.email.charAt(0).toUpperCase() : "U"}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 truncate leading-tight">
                    {user?.employee?.firstName
                      ? `${user.employee.firstName} ${user.employee.lastName || ""}`
                      : user?.email || "User"}
                  </p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate leading-tight">
                    {userRole === "SUPER_ADMIN"
                      ? "Super Admin"
                      : userRole === "HR_ADMIN"
                      ? "HR Admin"
                      : userRole === "PAYROLL_ADMIN"
                      ? "Payroll Admin"
                      : userRole === "FINANCE_ADMIN"
                      ? "Finance Admin"
                      : "Employee"}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5">
                <Link
                  href={
                    userRole === "SUPER_ADMIN"
                      ? "/super-admin/profile"
                      : userRole === "HR_ADMIN"
                      ? "/hr/profile"
                      : userRole === "PAYROLL_ADMIN"
                      ? "/payroll-compliance/profile"
                      : userRole === "FINANCE_ADMIN"
                      ? "/finance-role/profile"
                      : "/employee/profile"
                  }
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      toggleMobileSidebar();
                    }
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-primary-700 bg-primary-50 border border-primary-200/50 rounded-lg hover:bg-primary-100 hover:border-primary-300 transition-all duration-200 dark:bg-primary-500/10 dark:text-primary-400 dark:border-primary-500/20 dark:hover:bg-primary-500/20"
                >
                  <UserCircle size={14} />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={async () => {
                    if (window.innerWidth < 1024) {
                      toggleMobileSidebar();
                    }
                    await logout();
                  }}
                  className="flex items-center justify-center p-1.5 text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 dark:hover:bg-gray-700"
                  title="Logout"
                >
                  <LogOut size={14} />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-500/10 text-xs font-semibold text-primary-700 dark:text-primary-400">
                {user?.employee?.firstName
                  ? `${user.employee.firstName.charAt(0).toUpperCase()}${user.employee.lastName ? user.employee.lastName.charAt(0).toUpperCase() : ""}`
                  : user?.email ? user.email.charAt(0).toUpperCase() : "U"}
              </span>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default AppSidebar;