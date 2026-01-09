"use client";

import React, { useState } from "react";
import { Eye, Download, ArrowUpDown } from "lucide-react";
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

  return (
    <div className="space-y-6">
      <Breadcrumb items={breadcrumbItems} />

      {/* Year Filter Only */}
      <div className="flex justify-start">
        <div className="flex items-center gap-2">
          <label className="text-gray-700 dark:text-gray-300 font-medium">Year:</label>
          <div className="relative inline-block w-64">
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="block w-full appearance-none border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 px-4 py-2 pr-8 text-sm text-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
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

      {/* Payslip Table */}
      <div className="overflow-x-auto rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 mt-4">
        <table className="min-w-full text-sm divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900">
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
                  className="px-5 py-3 text-left font-semibold text-gray-700 dark:text-gray-200 cursor-pointer select-none"
                  onClick={() => requestSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.label} <ArrowUpDown className="w-4 h-4 text-gray-500" />
                  </div>
                </th>
              ))}
              <th className="px-5 py-3 text-center font-semibold text-gray-700 dark:text-gray-200">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {rows.map((row, idx) => (
              <tr key={idx} className="hover:bg-indigo-50 dark:hover:bg-gray-800 transition-all duration-200">
                <td className="px-5 py-3 font-medium text-gray-800 dark:text-gray-200">{months[row.month]}</td>
                <td className="px-5 py-3 text-gray-600 dark:text-gray-300">{row.year}</td>
                <td className="px-5 py-3 text-gray-600 dark:text-gray-300">₹{row.gross.toLocaleString()}</td>
                <td className="px-5 py-3 text-gray-600 dark:text-gray-300">₹{row.deductions.toLocaleString()}</td>
                <td className="px-5 py-3 text-gray-600 dark:text-gray-300">₹{row.netPay.toLocaleString()}</td>
                <td className="px-5 py-3 text-gray-600 dark:text-gray-300">{row.leave} days</td>
                <td className="px-5 py-3 text-gray-600 dark:text-gray-300">₹{row.ytd.toLocaleString()}</td>
                <td className="px-5 py-3 text-center flex justify-center gap-3">
                  <button className="p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 transition">
                    <Eye className="w-5 h-5 text-blue-600" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-green-100 dark:hover:bg-green-900 transition">
                    <Download className="w-5 h-5 text-green-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
