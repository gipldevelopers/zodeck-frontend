// src\layout\AppSidebar.js
"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";
import {
  Grid,
  Users,
  Target,
  Building,
  Calendar,
  Clock,
  FileText,
  Settings,
  UserCircle,
  ChevronDown,
  MoreHorizontal,
  Briefcase,
  Presentation,
  CreditCard,
  Package,
  Shield,
  CalendarDays,
  X,
  GitBranch,
  Network,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const superAdminNavItems = [
  {
    icon: <Grid size={20} />,
    name: "Dashboard",
    path: "/super-admin/dashboard",
  },
  {
    icon: <Building size={20} />,
    name: "Company & Organization",
    path: "/super-admin/company-orgranization",
  },
  {
    icon: <GitBranch size={20} />,
    name: "Workflow Management",
    subItems: [
      { name: "Workflow List", path: "/super-admin/workflow-management" },
      { name: "Add Workflow", path: "/super-admin/workflow-management/add" },
    ],
  },
  {
    icon: <Network size={20} />,
    name: "Integration Center",
    subItems: [
      { name: "All Integrations", path: "/super-admin/integration-management" },
      { name: "Add Integration", path: "/super-admin/integration-management/add" },
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
];

const hrNavItems = [
  {
    icon: <Grid size={20} />,
    name: "Dashboard",
    path: "/hr/dashboard",
  },
  {
    icon: <Users size={20} />,
    name: "Employee Management",
    subItems: [
      { name: "Employee List", path: "/hr/employees" },
      { name: "Add Employee", path: "/hr/employees/add" },
    ],
  },
  {
    icon: <Building size={20} />,
    name: "Department",
    subItems: [
      { name: "Department List", path: "/hr/departments" },
      { name: "Add Department", path: "/hr/departments/add" },
      { name: "Organization Chart", path: "/hr/departments/chart" },
    ],
  },
  {
    icon: <Briefcase size={20} />,
    name: "Designation",
    subItems: [
      { name: "Designation List", path: "/hr/designations" },
      { name: "Add Designation", path: "/hr/designations/add" },
      { name: "Designation Hierarchy", path: "/hr/designations/hierarchy" },
    ],
  },
  {
    icon: <Presentation size={20} />,
    name: "Attendance",
    subItems: [
      { name: "Dashboard", path: "/hr/attendance" },
    ],
  },
  {
    icon: <Calendar size={20} />,
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
    icon: <CreditCard size={20} />,
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
    icon: <Package size={20} />,
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

const employeeNavItems = [
  {
    icon: <Grid size={20} />,
    name: "Dashboard",
    path: "/employee/dashboard",
  },
  {
    icon: <Clock size={20} />,
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
    icon: <Calendar size={20} />,
    name: "Leave Management",
    subItems: [
      { name: "Request Leave", path: "/employee/leave/request-leave" },
      { name: "Leave Balance", path: "/employee/leave/leave-balance" },
      { name: "Leave History", path: "/employee/leave/leave-history" },
    ],
  },
  {
    icon: <CalendarDays size={20} />,
    name: "Holiday",
    subItems: [
      { name: "Holiday List", path: "/employee/holiday" }
    ],
  },
  {
    icon: <FileText size={20} />,
    name: "Payrolls",
    subItems: [
      { name: "Salery Summery", path: "/employee/payslips/salery-summery" },
      { name: "Payslip", path: "/employee/payslips/pay-slips" },
      { name: "Payment History", path: "/employee/payslips/payment-history" },
      { name: "Tax Information", path: "/employee/payslips/tax-info" },
      { name: "Rembursment", path: "/employee/payslips/rembursment" },
    ],
  },
  {
    icon: <Settings size={20} />,
    name: "Settings",
    subItems: [
      { name: "Profile Picture", path: "/employee/settings/profile-picture" },
      { name: "Contact Information", path: "/employee/settings/contact-information" },
      { name: "Password Management", path: "/employee/settings/password-management" },
      { name: "Two-Factor Authentication (2FA)", path: "/employee/settings/two-factor-auth" },
      { name: "Connected Devices", path: "/employee/settings/connected-devices" },
    ],
  },
  {
    icon: <Target size={20} />,
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
];

const AppSidebar = () => {
  const { user } = useAuth();
  const userRole = user?.systemRole || 'EMPLOYEE';

  const { isExpanded, isMobileOpen, isHovered, setIsHovered, toggleMobileSidebar } = useSidebar();
  const pathname = usePathname();

  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [subMenuHeight, setSubMenuHeight] = useState({});
  const subMenuRefs = useRef({});

  const isActive = useCallback((path) => path === pathname, [pathname]);

  // Get appropriate navigation items based on user role
  const getNavItems = () => {
    switch (userRole) {
      case "SUPER_ADMIN":
        return superAdminNavItems;
      case "HR_ADMIN":
        return hrNavItems;
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
    <ul className="flex flex-col gap-2">
      {navItems.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index)}
              className={`menu-item group w-full ${openSubmenu?.index === index
                ? "menu-item-active"
                : "menu-item-inactive"
                } cursor-pointer ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
                }`}
            >
              <span
                className={`${openSubmenu?.index === index
                  ? "menu-item-icon-active"
                  : "menu-item-icon-inactive"
                  }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className={`menu-item-text font-semibold`}>{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDown
                  size={20}
                  className={`ml-auto transition-transform duration-200 ${openSubmenu?.index === index
                    ? "rotate-180 text-brand-500"
                    : ""
                    }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                onClick={() => {
                  // Close sidebar on mobile when clicking a link
                  if (window.innerWidth < 1024) {
                    toggleMobileSidebar();
                  }
                }}
                className={`menu-item group w-full ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                  }`}
              >
                <span
                  className={`${isActive(nav.path)
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                    }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className={`menu-item-text font-semibold`}>{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.index === index
                    ? `${subMenuHeight[`${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-1 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.path}
                      onClick={() => {
                        // Close sidebar on mobile when clicking a submenu link
                        if (window.innerWidth < 1024) {
                          toggleMobileSidebar();
                        }
                      }}
                      className={`menu-dropdown-item ${isActive(subItem.path)
                        ? "menu-dropdown-item-active"
                        : "menu-dropdown-item-inactive"
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
        className={`fixed flex flex-col top-0 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
          /* Mobile: Full screen with backdrop */
          ${isMobileOpen ? "translate-x-0 w-[280px]" : "-translate-x-full w-[280px]"}
          
          /* Tablet: Half width or collapsed */
          md:${isMobileOpen ? "translate-x-0 w-[280px]" : "-translate-x-full w-[280px]"}
          
          /* Desktop: Responsive width */
          lg:translate-x-0 lg:w-auto
          lg:${isExpanded || isHovered ? "lg:w-[290px]" : "lg:w-[90px]"}
        `}
        onMouseEnter={() => !isExpanded && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Close button for mobile/tablet */}
        <div className="lg:hidden flex justify-end p-4">
          <button
            onClick={toggleMobileSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X size={24} />
          </button>
        </div>

        <div
          className={`h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800 border-dashed ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
            }`}
        >
          <Link href="/" onClick={() => {
            if (window.innerWidth < 1024) {
              toggleMobileSidebar();
            }
          }}>
            {isExpanded || isHovered || isMobileOpen ? (
              <>
                <Image
                  className="dark:hidden"
                  src="/images/logo/GHR.PNG"
                  alt="Logo"
                  width={150}
                  height={40}
                  style={{ width: 'auto', height: 'auto' }}
                  priority
                />
                <Image
                  className="hidden dark:block"
                  src="/images/logo/GHR2.PNG"
                  alt="Logo"
                  width={150}
                  height={40}
                  style={{ width: 'auto', height: 'auto' }}
                />
              </>
            ) : (
              <Image
                src="/images/logo/GHR-COLLAPSED.PNG"
                alt="Logo"
                width={32}
                height={32}
                style={{ width: 'auto', height: 'auto' }}
              />
            )}
          </Link>
        </div>
        {/* <div className="h-[1px] w-full bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-500 mb-4"></div> */}

        <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar flex-1 px-4 mt-4">
          <nav className="mb-6">
            <div className="flex flex-col gap-4">
              <div>
                <h2
                  className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                    }`}
                >
                  {isExpanded || isHovered || isMobileOpen ? (
                    userRole === "SUPER_ADMIN" ? "Super Admin Portal" :
                      userRole === "HR_ADMIN" ? "HR Management" :
                        "Employee Portal"
                  ) : (
                    <MoreHorizontal size={16} />
                  )}
                </h2>
                {renderMenuItems(getNavItems())}
              </div>
            </div>
          </nav>
        </div>

        {/* Mobile footer info (optional) */}
        <div className="lg:hidden p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            <p>Version 1.0.0</p>
            <p className="mt-1">© 2024 Your Company</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AppSidebar;