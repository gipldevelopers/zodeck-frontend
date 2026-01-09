"use client";

import Breadcrumb from "@/components/common/Breadcrumb";
import { useState } from "react";

export default function TaxInformationPage() {
  const breadcrumbItems = [
    { label: "Employee", href: "/employee" },
    { label: "Payroll", href: "/employee/payroll" },
    { label: "Tax Information", href: "/employee/payroll/tax-information" },
  ];

  // Mock Payroll Data
  const [payrollData] = useState({
    taxInfo: {
      tds: "$1,200.00",
      ytdTaxableIncome: "$45,000.00",
    },
  });

  const taxSlabs = [
    { range: "Up to $10,000", rate: "0%", description: "No tax" },
    { range: "$10,001 - $20,000", rate: "10%", description: "Standard rate" },
    { range: "$20,001 - $35,000", rate: "15%", description: "Middle bracket" },
    { range: "Above $35,000", rate: "20%", description: "Higher bracket" },
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Breadcrumb items={breadcrumbItems} />

      <div className="mt-8 w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-end pb-2 border-b border-gray-200 dark:border-gray-700">
          <button className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
            View Detailed Summary
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* TDS Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center mb-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Tax Deducted at Source
                  </p>
                </div>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  {payrollData.taxInfo.tds}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Current financial year
                </p>
              </div>
              <div className="rounded-xl p-3 bg-gradient-to-r from-orange-500 to-orange-400 shadow-md flex-shrink-0">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 14l6-6m-5.5 3.5l2.5 2.5 5.5-5.5"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* YTD Taxable Income Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center mb-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    YTD Taxable Income
                  </p>
                </div>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  {payrollData.taxInfo.ytdTaxableIncome}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Year-to-Date
                </p>
              </div>
              <div className="rounded-xl p-3 bg-gradient-to-r from-purple-500 to-purple-400 shadow-md flex-shrink-0">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Documents Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-700 px-5 py-4">
            <h4 className="text-sm font-semibold text-gray-800 dark:text-white">
              Tax Documents
            </h4>
          </div>
          <div className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 mr-4">
                  <svg
                    className="w-5 h-5 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                    Form 16
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Tax deduction certificate for FY 2023-24
                  </p>
                </div>
              </div>
              <button className="flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                Download
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Tax Slabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-700 px-5 py-4">
            <h4 className="text-sm font-semibold text-gray-800 dark:text-white">
              Current Tax Slabs (2023-24)
            </h4>
          </div>
          <div className="p-5 space-y-4">
            {taxSlabs.map((slab, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-800 dark:text-white">
                    {slab.range}
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{slab.description}</p>
                </div>
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                  {slab.rate}
                </span>
              </div>
            ))}
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                * Tax calculations are based on the latest government guidelines
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
