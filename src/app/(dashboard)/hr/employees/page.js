// src/app/(dashboard)/hr/employees/page.js
"use client";
import { PlusCircle } from 'lucide-react';
import EmployeeTable from './components/EmployeesTable';
import EmployeeStatsCards from './components/EmployeeStatsCards';
import Breadcrumb from '@/components/common/Breadcrumb';
import Link from 'next/link';

export default function EmployeeDirectory() {
  return (
    <div className="bg-gray-50 min-h-screen dark:bg-gray-900 p-3 sm:p-6 space-y-6">

      {/* Breadcrumb with Add Employee button */}
      <Breadcrumb
        rightContent={
          <Link
            href="/hr/employees/add"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-white hover:bg-brand-600 
                       dark:bg-brand-500 dark:hover:bg-brand-600 transition-colors shadow-sm hover:shadow-md font-semibold"
          >
            <PlusCircle size={18} /> Add Employee
          </Link>
        }
      />

      <EmployeeStatsCards />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
        <EmployeeTable />
      </div>
    </div>
  );
}