// src/app/(dashboard)/hr/departments/page.js
"use client";
import Breadcrumb from '@/components/common/Breadcrumb';
import DepartmentTable from './components/DepartmentTable';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import DepartmentMainStats from './components/DepartmentMainStats';

export default function DepartmentPage() {
  return (
    <div className="bg-gray-50 min-h-screen dark:bg-gray-900">
      {/* Breadcrumb with Add Department button */}
      <Breadcrumb
        rightContent={
          <Link
            href="/hr/departments/add"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
          >
            <PlusCircle size={18} /> Add Department
          </Link>
        }
      />

      {/* Department Stats */}
      <DepartmentMainStats />

      <div className="bg-white rounded-lg shadow dark:bg-gray-800">
        <DepartmentTable />
      </div>
    </div>
  );
}