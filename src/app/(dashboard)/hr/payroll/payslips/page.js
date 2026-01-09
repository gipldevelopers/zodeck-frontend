// src/app/(dashboard)/hr/payroll/payslips/page.js
"use client";
import { Download, PlusCircle } from 'lucide-react';
import Breadcrumb from '@/components/common/Breadcrumb';
import PayslipTable from './components/PayslipTable';
import Link from 'next/link';

export default function Payslips() {
  const handleBulkDownload = () => {
    alert('Bulk download functionality is being implemented. Please select individual payslips for now.');
  };

  return (
    <div className="bg-gray-50 min-h-screen dark:bg-gray-900 p-4 sm:p-6 text-left">
      {/* Breadcrumb with action buttons */}
      <Breadcrumb
        pageTitle="Payslips"
        rightContent={
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleBulkDownload}
              className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 transition w-full sm:w-auto justify-center font-medium"
            >
              <Download size={18} />
              Bulk Download
            </button>
            <Link
              href="/hr/payroll/process"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition w-full sm:w-auto justify-center font-medium"
            >
              <PlusCircle size={18} /> Generate Payslips
            </Link>
          </div>
        }
      />

      <div className="bg-white rounded-lg shadow dark:bg-gray-800 mt-6">
        <PayslipTable />
      </div>
    </div>
  );
}