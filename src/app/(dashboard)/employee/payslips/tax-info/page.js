"use client";

import Breadcrumb from "@/components/common/Breadcrumb";
import { useState } from "react";
import { FileText, Download, TrendingUp, DollarSign, Receipt, Info } from "lucide-react";

export default function TaxInformationPage() {
  const breadcrumbItems = [
    { label: "Employee", href: "/employee" },
    { label: "Payslips", href: "/employee/payslips" },
    { label: "Tax Information", href: "/employee/payslips/tax-info" },
  ];

  // Mock Payroll Data
  const [payrollData] = useState({
    taxInfo: {
      tds: "₹1,200.00",
      ytdTaxableIncome: "₹45,000.00",
    },
  });

  const taxSlabs = [
    { range: "Up to ₹2,50,000", rate: "0%", description: "No tax" },
    { range: "₹2,50,001 - ₹5,00,000", rate: "5%", description: "Standard rate" },
    { range: "₹5,00,001 - ₹10,00,000", rate: "20%", description: "Middle bracket" },
    { range: "Above ₹10,00,000", rate: "30%", description: "Higher bracket" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50/30 via-white to-primary-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <Breadcrumb items={breadcrumbItems} />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tax Information</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">View your tax details and documents</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 bg-primary-50 dark:bg-primary-500/10 hover:bg-primary-100 dark:hover:bg-primary-500/20 rounded-lg transition-colors">
            View Detailed Summary
            <FileText className="w-4 h-4" />
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* TDS Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-primary-100/50 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Tax Deducted at Source
                  </p>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {payrollData.taxInfo.tds}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Current financial year
                </p>
              </div>
              <div className="w-14 h-14 rounded-lg bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                <Receipt className="w-7 h-7 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>

          {/* YTD Taxable Income Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-primary-100/50 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    YTD Taxable Income
                  </p>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {payrollData.taxInfo.ytdTaxableIncome}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Year-to-Date
                </p>
              </div>
              <div className="w-14 h-14 rounded-lg bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-7 h-7 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Documents Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-primary-100/50 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-primary-50 to-primary-100/50 dark:from-gray-700 dark:to-gray-800 px-6 py-4 border-b border-primary-200 dark:border-gray-700">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              Tax Documents
            </h4>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 p-4 rounded-lg transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Form 16
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Tax deduction certificate for FY 2023-24
                  </p>
                </div>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 bg-primary-50 dark:bg-primary-500/10 hover:bg-primary-100 dark:hover:bg-primary-500/20 rounded-lg transition-colors">
                Download
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Tax Slabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-primary-100/50 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-primary-50 to-primary-100/50 dark:from-gray-700 dark:to-gray-800 px-6 py-4 border-b border-primary-200 dark:border-gray-700">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Info className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              Current Tax Slabs (2023-24)
            </h4>
          </div>
          <div className="p-6 space-y-4">
            {taxSlabs.map((slab, idx) => (
              <div key={idx} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
                <div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {slab.range}
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{slab.description}</p>
                </div>
                <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                  {slab.rate}
                </span>
              </div>
            ))}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-start gap-2">
                <Info className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                Tax calculations are based on the latest government guidelines
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
