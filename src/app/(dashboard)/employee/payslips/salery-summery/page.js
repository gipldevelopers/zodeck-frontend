"use client";

import { useState } from "react";
import Breadcrumb from "@/components/common/Breadcrumb";
import {
  ArrowDownToLine,
  Banknote,
  CalendarDays,
  CreditCard,
  LineChart,
  PiggyBank,
} from "lucide-react";

export default function SalarySummaryPage() {
  const breadcrumbItems = [
    { label: "Employee", href: "/employee" },
    { label: "Payroll", href: "/employee/payroll" },
    { label: "Salary Summary", href: "/employee/payroll/salary-summary" },
  ];

  const [payrollData] = useState({
    salarySummary: {
      grossPay: "$6,350.00",
      deductions: "$1,350.00",
      netPay: "$5,000.00",
    },
    paymentDate: "July 30, 2024",
    breakdown: {
      earnings: [
        { label: "Basic Salary", value: "$4,200.00" },
        { label: "HRA", value: "$1,300.00" },
        { label: "Conveyance", value: "$200.00" },
        { label: "Medical Allowance", value: "$150.00" },
        { label: "Performance Bonus", value: "$500.00", highlight: true },
      ],
      deductions: [
        { label: "PF", value: "-$650.00" },
        { label: "Professional Tax", value: "-$200.00" },
        { label: "Income Tax", value: "-$420.00" },
        { label: "Health Insurance", value: "-$80.00" },
      ],
    },
    paymentMethod: {
      type: "Direct Deposit",
      account: "**** **** **** 4567",
    },
    ytd: {
      earnings: "$57,150.00",
      taxes: "$11,340.00",
    },
  });

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Breadcrumb items={breadcrumbItems} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-end md:items-center mb-8">
        <div className="mt-4 md:mt-0 flex items-center gap-3">
          <span className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-sm text-gray-700 dark:text-gray-300 font-medium">
            <CalendarDays className="w-4 h-4" />
            July 2024
          </span>
          <button className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition">
            <ArrowDownToLine className="w-4 h-4" />
            Download Payslip
          </button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Gross Pay */}
        <div className="bg-gradient-to-r from-green-400 to-green-500 text-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm font-semibold">Gross Pay</p>
            <Banknote className="w-6 h-6" />
          </div>
          <p className="text-3xl font-bold">{payrollData.salarySummary.grossPay}</p>
          <span className="mt-2 inline-block bg-white/20 px-2 py-1 text-xs rounded-full">
            +2.5% from last month
          </span>
        </div>

        {/* Deductions */}
        <div className="bg-gradient-to-r from-red-400 to-red-500 text-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm font-semibold">Deductions</p>
            <PiggyBank className="w-6 h-6" />
          </div>
          <p className="text-3xl font-bold">{payrollData.salarySummary.deductions}</p>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <span className="bg-white/20 px-2 py-1 rounded-full">Tax: $420</span>
            <span className="bg-white/20 px-2 py-1 rounded-full">PF: $230</span>
          </div>
        </div>

        {/* Net Pay */}
        <div className="bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm font-semibold">Net Pay</p>
            <CreditCard className="w-6 h-6" />
          </div>
          <p className="text-3xl font-bold">{payrollData.salarySummary.netPay}</p>
          <span className="mt-2 inline-block bg-white/20 px-2 py-1 text-xs rounded-full">
            Paid on {payrollData.paymentDate}
          </span>
        </div>
      </div>

      {/* Salary Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Earnings */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow transition">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            Earnings
          </h3>
          <div className="space-y-3">
            {payrollData.breakdown.earnings.map((item, i) => (
              <div key={i} className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">{item.label}</span>
                <span
                  className={`font-medium ${
                    item.highlight
                      ? "text-green-600 dark:text-green-400"
                      : "text-gray-900 dark:text-white"
                  }`}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t mt-4 pt-2 flex justify-between font-semibold text-gray-900 dark:text-white">
            <span>Total Earnings</span>
            <span>{payrollData.salarySummary.grossPay}</span>
          </div>
        </div>

        {/* Deductions */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow transition">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            Deductions
          </h3>
          <div className="space-y-3">
            {payrollData.breakdown.deductions.map((item, i) => (
              <div key={i} className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">{item.label}</span>
                <span className="text-red-600 dark:text-red-400 font-medium">{item.value}</span>
              </div>
            ))}
          </div>
          <div className="border-t mt-4 pt-2 flex justify-between font-semibold text-gray-900 dark:text-white">
            <span>Total Deductions</span>
            <span>{payrollData.salarySummary.deductions}</span>
          </div>
          <div className="border-t mt-2 pt-2 flex justify-between font-bold text-blue-600 dark:text-blue-400">
            <span>Net Pay</span>
            <span>{payrollData.salarySummary.netPay}</span>
          </div>
        </div>
      </div>

      {/* Payment & YTD */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Payment Method */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow transition flex flex-col gap-4">
          <h4 className="text-md font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
            <CreditCard className="w-4 h-4 text-gray-500" />
            Payment Method
          </h4>
          <div className="flex items-center gap-4">
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
              <CreditCard className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">{payrollData.paymentMethod.type}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{payrollData.paymentMethod.account}</p>
            </div>
          </div>
        </div>

        {/* YTD Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow transition flex flex-col gap-4">
          <h4 className="text-md font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
            <LineChart className="w-4 h-4 text-gray-500" />
            Year-to-Date Summary
          </h4>
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Earnings</p>
              <p className="font-medium text-gray-900 dark:text-white">{payrollData.ytd.earnings}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Taxes Paid</p>
              <p className="font-medium text-gray-900 dark:text-white">{payrollData.ytd.taxes}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
