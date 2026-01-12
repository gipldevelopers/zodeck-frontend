"use client";

import React, { useState } from "react";
import { Eye, Download, ArrowUpDown, Calendar, FileText } from "lucide-react";
import Breadcrumb from "@/components/common/Breadcrumb";

export default function PayslipsPage() {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  const [year, setYear] = useState(currentYear);
  const [sortConfig, setSortConfig] = useState({ key: "month", direction: "asc" });

  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];

  // Dummy salary data for multiple months
  const salaryData = {
    2025: {
      0: { basic: 40000, overtime: 3000, bonus: 2000, commission: 1000, tax: 5000, pf: 2000, leave: 10 },
      1: { basic: 40000, overtime: 5000, bonus: 3000, commission: 2000, tax: 6000, pf: 2000, leave: 8 },
      2: { basic: 42000, overtime: 4000, bonus: 2500, commission: 1500, tax: 6500, pf: 2100, leave: 7 },
      3: { basic: 43000, overtime: 2000, bonus: 1000, commission: 1200, tax: 5500, pf: 2100, leave: 6 },
      4: { basic: 44000, overtime: 3500, bonus: 1500, commission: 1300, tax: 5800, pf: 2200, leave: 5 },
      5: { basic: 45000, overtime: 3000, bonus: 2000, commission: 1500, tax: 6000, pf: 2200, leave: 4 },
    },
  };

  const getPayslipRows = () => {
    const yearData = salaryData[year] || {};
    return Object.keys(yearData)
      .filter((m) => Number(m) <= currentMonth) // show only till current month
      .map((m) => {
        const data = yearData[m];
        const gross = data.basic + data.overtime + data.bonus + data.commission;
        const deductions = data.tax + data.pf;
        const netPay = gross - deductions;
        const ytd = Object.entries(yearData)
          .filter(([idx]) => Number(idx) <= Number(m))
          .reduce(
            (sum, [, d]) => sum + d.basic + d.overtime + d.bonus + d.commission,
            0
          );
        return {
          month: Number(m),
          year,
          gross,
          deductions,
          netPay,
          leave: data.leave,
          ytd,
        };
      });
  };

  let rows = getPayslipRows();

  // Sorting
  if (sortConfig !== null) {
    rows.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };

  const breadcrumbItems = [
    { label: "Employee", href: "/employee" },
    { label: "Payslips", href: "/employee/payslips" },
  ];

  const totalGross = rows.reduce((sum, row) => sum + row.gross, 0);
  const totalDeductions = rows.reduce((sum, row) => sum + row.deductions, 0);
  const totalNetPay = rows.reduce((sum, row) => sum + row.netPay, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50/30 via-white to-primary-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <Breadcrumb items={breadcrumbItems} />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-primary-100/50 dark:border-gray-700 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Gross</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{totalGross.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-primary-100/50 dark:border-gray-700 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Deductions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{totalDeductions.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-500/20 flex items-center justify-center">
                <FileText className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-primary-100/50 dark:border-gray-700 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Net Pay</p>
                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">₹{totalNetPay.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-primary-100/50 dark:border-gray-700 p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-2 flex-1">
              <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Year:</label>
              <div className="relative flex-1 sm:flex-initial sm:w-48">
                <select
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full appearance-none border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 px-4 py-2 pr-8 text-sm text-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {[currentYear - 1, currentYear].map((yr) => (
                    <option key={yr} value={yr}>{yr}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400 dark:text-gray-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payslip Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-primary-100/50 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gradient-to-r from-primary-50 to-primary-100/50 dark:from-gray-700 dark:to-gray-800">
                <tr>
                  {[
                    { key: "month", label: "Month" },
                    { key: "year", label: "Year" },
                    { key: "gross", label: "Gross Earnings" },
                    { key: "deductions", label: "Deductions" },
                    { key: "netPay", label: "Net Pay" },
                    { key: "leave", label: "Leave Balance" },
                    { key: "ytd", label: "YTD Earnings" },
                  ].map((col) => (
                    <th
                      key={col.key}
                      className="px-5 py-4 text-left font-semibold text-gray-700 dark:text-gray-200 cursor-pointer select-none hover:bg-primary-100/50 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => requestSort(col.key)}
                    >
                      <div className="flex items-center gap-2">
                        {col.label}
                        <ArrowUpDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      </div>
                    </th>
                  ))}
                  <th className="px-5 py-4 text-center font-semibold text-gray-700 dark:text-gray-200">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {rows.length > 0 ? (
                  rows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-primary-50/30 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-5 py-4 font-medium text-gray-900 dark:text-gray-100">{months[row.month]}</td>
                      <td className="px-5 py-4 text-gray-600 dark:text-gray-400">{row.year}</td>
                      <td className="px-5 py-4 text-gray-700 dark:text-gray-300 font-medium">₹{row.gross.toLocaleString()}</td>
                      <td className="px-5 py-4 text-red-600 dark:text-red-400 font-medium">₹{row.deductions.toLocaleString()}</td>
                      <td className="px-5 py-4 text-primary-600 dark:text-primary-400 font-semibold">₹{row.netPay.toLocaleString()}</td>
                      <td className="px-5 py-4 text-gray-600 dark:text-gray-400">{row.leave} days</td>
                      <td className="px-5 py-4 text-gray-700 dark:text-gray-300 font-medium">₹{row.ytd.toLocaleString()}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button className="p-2 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-500/20 text-primary-600 dark:text-primary-400 transition-colors" title="View">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-500/20 text-primary-600 dark:text-primary-400 transition-colors" title="Download">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-5 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">No payslips found for this year</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
