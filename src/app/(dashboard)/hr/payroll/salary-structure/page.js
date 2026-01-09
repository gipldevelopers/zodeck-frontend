// src/app/(dashboard)/hr/payroll/salary-structure/page.js
"use client";
import { PlusCircle } from 'lucide-react';
import Breadcrumb from '@/components/common/Breadcrumb';
import SalaryStructureTable from './components/SalaryStructureTable';
import Link from 'next/link';

export default function SalaryStructure() {
  return (
    <div className="bg-gray-50 min-h-screen dark:bg-gray-900 p-4 sm:p-6">
      {/* Breadcrumb with Add Salary Structure button */}
      <Breadcrumb
        pageTitle="Salary Structure"
        rightContent={
          <Link
            href="/hr/payroll/salary-structure/add"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition w-full sm:w-auto justify-center"
          >
            <PlusCircle size={18} /> Add Salary Structure
          </Link>
        }
      />

      <div className="bg-white rounded-lg shadow dark:bg-gray-800 mt-6">
        <SalaryStructureTable />
      </div>
    </div>
  );
}