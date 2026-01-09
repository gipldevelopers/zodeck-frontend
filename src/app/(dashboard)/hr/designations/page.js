"use client";
import Breadcrumb from '@/components/common/Breadcrumb';
import DesignationTable from './components/DesignationTable';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function DesignationPage() {
  return (
    <div className="bg-gray-50 min-h-screen dark:bg-gray-900 p-4 sm:p-6">
      {/* Breadcrumb with Add Designation button */}
      <Breadcrumb
        rightContent={
          <Link
            href="/hr/designations/add"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
          >
            <PlusCircle size={18} /> Add Designation
          </Link>
        }
      />

      <div className="bg-white rounded-lg shadow dark:bg-gray-800">
        <DesignationTable />
      </div>
    </div>
  );
}