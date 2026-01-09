"use client";

import React, { useState } from "react";
import Breadcrumb from "@/components/common/Breadcrumb";

export default function PaymentHistoryPage() {
  const [payments, setPayments] = useState([
    { date: "Aug 28, 2025", method: "Bank Transfer", amount: 2500, status: "Completed" },
    { date: "Jul 28, 2025", method: "UPI", amount: 2450, status: "Completed" },
    { date: "Jun 28, 2025", method: "Bank Transfer", amount: 2490, status: "Pending" },
    { date: "May 28, 2025", method: "Cheque", amount: 2510, status: "Failed" },
  ]);

  const breadcrumbItems = [
    { label: "Employee", href: "/employee" },
    { label: "Payroll", href: "/employee/payroll" },
    { label: "Payment History", href: "/employee/payroll/payment-history" },
  ];

  const totalPaid = payments
    .filter(p => p.status === "Completed")
    .reduce((acc, p) => acc + p.amount, 0);
  const avgPayment = payments.length ? (totalPaid / payments.length).toFixed(2) : 0;

  const handleExport = () => alert("Exporting payment history...");
  const handleFilter = () => alert("Filter payments (dummy action)");

  return (
    <div className="space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Breadcrumb items={breadcrumbItems} />

      {/* Header with Actions */}
      <div className="flex items-center justify-end pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-3">
          <button
            onClick={handleExport}
            className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition"
          >
            Export
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
          <button
            onClick={handleFilter}
            className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 transition"
          >
            Filter
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow hover:shadow-lg transition flex items-center gap-4">
          <div className="bg-gradient-to-r from-green-500 to-green-400 text-white rounded-full p-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Paid</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">${totalPaid.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow hover:shadow-lg transition flex items-center gap-4">
          <div className="bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-full p-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Payments</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{payments.length}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow hover:shadow-lg transition flex items-center gap-4">
          <div className="bg-gradient-to-r from-purple-500 to-purple-400 text-white rounded-full p-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Payment</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">${avgPayment}</p>
          </div>
        </div>
      </div>

      {/* Payment List */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <h4 className="text-sm font-semibold text-gray-800 dark:text-white">Recent Transactions</h4>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {payments.map((payment, index) => (
            <div
              key={index}
              className="px-6 py-4 flex items-center justify-between transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-lg ${
                    payment.status === "Completed"
                      ? "bg-green-50 dark:bg-green-900/20 text-green-500"
                      : payment.status === "Pending"
                      ? "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-500"
                      : "bg-red-50 dark:bg-red-900/20 text-red-500"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">{payment.date}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {payment.method} •{" "}
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        payment.status === "Completed"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                          : payment.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                      }`}
                    >
                      {payment.status}
                    </span>
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-800 dark:text-white">${payment.amount.toLocaleString()}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Net pay</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* View All */}
      <div className="flex justify-center">
        <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition">
          View All Transactions
        </button>
      </div>
    </div>
  );
}
