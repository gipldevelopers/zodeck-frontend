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
    'my-attendance': 'My Attendance',
    'my-leaves': 'My Leaves',
    'leave-summery-details': 'Leave Summary Details',
    'regularization': 'Regularization',
    'overtime': 'Overtime',
    'holidays': 'Holidays',
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

const Breadcrumb = ({ customTitle, subtitle, rightContent, items }) => {
  const pathname = usePathname();

  const generateBreadcrumbs = () => {
    // If items prop is provided, use it directly with home icon
    if (items && Array.isArray(items)) {
      const breadcrumbs = [
        {
          href: '/',
          label: <Home className="w-4 h-4" />,
          isCurrent: false,
          isIcon: true,
        },
      ];
      
      items.forEach((item, index) => {
        breadcrumbs.push({
          href: item.href,
          label: item.label,
          isCurrent: index === items.length - 1,
          isIcon: false,
        });
      });
      
      return breadcrumbs;
    }

    // Otherwise, auto-generate from pathname
    const paths = pathname.split('/').filter(Boolean);
    const filteredPaths = paths.filter(
      (path) => !breadcrumbConfig.hiddenPaths.includes(path)
    );

    const breadcrumbs = [
      {
        href: '/',
        label: <Home className="w-4 h-4" />,
        isCurrent: false,
        isIcon: true,
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
        isIcon: false,
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

  return (
    <nav className="overflow-x-auto" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 text-sm">
        {breadcrumbs.map((breadcrumb, index) => (
          <li
            key={index}
            className="flex items-center"
          >
            {breadcrumb.isCurrent ? (
              <span
                aria-current="page"
                className="text-gray-700 dark:text-gray-300 font-medium"
              >
                {breadcrumb.label}
              </span>
            ) : (
              <Link
                href={breadcrumb.href}
                className={`transition-colors duration-200 font-medium ${
                  breadcrumb.isIcon 
                    ? "text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 flex items-center"
                    : "text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                }`}
              >
                {breadcrumb.label}
              </Link>
            )}

            {index < breadcrumbs.length - 1 && (
              <span className="mx-2 text-gray-400 dark:text-gray-500">/</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
