'use client';

import { Home } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const breadcrumbConfig = {
  defaultTransform: (path) =>
    path
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
  specialPaths: {
    '': 'Home',
    dashboard: 'Dashboard',
    employee: 'Employee',
    employees: 'Employees',
    attendance: 'Attendance',
    leave: 'Leave',
    payslips: 'Payslips',
    profile: 'Profile',
    payroll: 'Payroll',
    recruitment: 'Recruitment',
    report: 'Reports',
    department: 'Department',
    designation: 'Designation',
    new: 'Add New',
    edit: 'Edit',
  },
  hiddenPaths: ['hr'],
  idPaths: ['id'],
};

const Breadcrumb = ({ customTitle, rightContent }) => {
  const pathname = usePathname();

  const generateBreadcrumbs = () => {
    const paths = pathname.split('/').filter(Boolean);
    const filteredPaths = paths.filter(
      (path) => !breadcrumbConfig.hiddenPaths.includes(path)
    );

    const breadcrumbs = [
      {
        href: '/',
        label: <Home className="w-4 h-4" />,
        isCurrent: false,
      },
    ];

    let accumulatedPath = '';
    for (let i = 0; i < filteredPaths.length; i++) {
      const path = filteredPaths[i];
      accumulatedPath += `/${path}`;

      let label;
      const isIdPath =
        !isNaN(path) &&
        i > 0 &&
        breadcrumbConfig.idPaths.includes(filteredPaths[i - 1]);

      if (isIdPath) {
        label =
          i < filteredPaths.length - 1 && filteredPaths[i + 1] === 'edit'
            ? 'Edit'
            : 'Details';
      } else if (breadcrumbConfig.specialPaths[path]) {
        label = breadcrumbConfig.specialPaths[path];
      } else {
        label = breadcrumbConfig.defaultTransform(path);
      }

      breadcrumbs.push({
        href: accumulatedPath,
        label,
        isCurrent: i === filteredPaths.length - 1,
      });
    }

    if (filteredPaths.length === 1 && filteredPaths[0] === 'employees') {
      breadcrumbs.push({
        href: pathname,
        label: 'Employee List',
        isCurrent: true,
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  let pageTitle = 'Dashboard';
  if (customTitle) {
    pageTitle = customTitle;
  } else if (breadcrumbs.length > 1) {
    pageTitle = breadcrumbs[breadcrumbs.length - 1].label;
  }

  return (
    <div className="my-auto mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      {/* Left side */}
      <div>
        <h2 className="mb-1 text-lg md:text-xl font-semibold text-gray-800 dark:text-white">
          {pageTitle}
        </h2>

        <nav className="overflow-x-auto">
          <ol className="breadcrumb mb-0 flex flex-wrap items-center text-sm whitespace-nowrap">
            {breadcrumbs.map((breadcrumb, index) => (
              <li
                key={index}
                className="breadcrumb-item flex items-center text-gray-600 dark:text-gray-400"
              >
                {/* ONLY HOME IS CLICKABLE */}
                {index === 0 ? (
                  <Link
                    href={breadcrumb.href}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors flex items-center"
                  >
                    {breadcrumb.label}
                  </Link>
                ) : (
                  <span
                    aria-current={breadcrumb.isCurrent ? 'page' : undefined}
                    className={breadcrumb.isCurrent ? 'font-medium' : ''}
                  >
                    {breadcrumb.label}
                  </span>
                )}

                {index < breadcrumbs.length - 1 && (
                  <span className="mx-2 text-gray-400">/</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>

      {/* Right side */}
      {rightContent && <div className="shrink-0">{rightContent}</div>}
    </div>
  );
};

export default Breadcrumb;
