"use client";

import { useState } from "react";
import Breadcrumb from "@/components/common/Breadcrumb";

export default function ReimbursementsPage() {
  const breadcrumbItems = [
    { label: "Employee", href: "/employee" },
    { label: "Payroll", href: "/employee/payroll" },
    { label: "Reimbursements", href: "/employee/payroll/reimbursements" },
  ];

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock Payroll Data
  const [payrollData] = useState({
    reimbursements: {
      pending: 2,
      approved: 5,
      totalReimbursed: "$2,450.00",
      pendingClaims: [
        { type: "Travel Expense", amount: "$120.00", date: "2023-09-05" },
        { type: "Client Lunch", amount: "$80.00", date: "2023-09-10" },
      ],
      approvedClaims: [
        { type: "Hotel Stay", amount: "$450.00", date: "2023-08-20" },
        { type: "Conference Fee", amount: "$300.00", date: "2023-08-15" },
        { type: "Team Dinner", amount: "$150.00", date: "2023-07-25" },
      ],
    },
  });

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Breadcrumb items={breadcrumbItems} />

      <div className="mt-8 w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start gap-4 pb-2 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full sm:w-auto"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Submit New Claim
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Pending Claims */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
            <div className="flex items-center">
              <div className="rounded-xl p-3 bg-gradient-to-r from-yellow-500 to-yellow-400 shadow-md flex-shrink-0 mr-3">
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Pending Claims
                </p>
                <p className="font-semibold text-gray-800 dark:text-white">
                  {payrollData.reimbursements.pending}
                </p>
              </div>
            </div>
          </div>

          {/* Approved Claims */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
            <div className="flex items-center">
              <div className="rounded-xl p-3 bg-gradient-to-r from-green-500 to-green-400 shadow-md flex-shrink-0 mr-3">
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Approved Claims
                </p>
                <p className="font-semibold text-gray-800 dark:text-white">
                  {payrollData.reimbursements.approved}
                </p>
              </div>
            </div>
          </div>

          {/* Total Reimbursed */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
            <div className="flex items-center">
              <div className="rounded-xl p-3 bg-gradient-to-r from-blue-500 to-blue-400 shadow-md flex-shrink-0 mr-3">
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
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Total Reimbursed
                </p>
                <p className="font-semibold text-gray-800 dark:text-white">
                  {payrollData.reimbursements.totalReimbursed}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Claims Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Pending Claims */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="border-b border-gray-200 dark:border-gray-700 px-5 py-4 bg-yellow-50 dark:bg-yellow-900/20">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-gray-800 dark:text-white flex items-center">
                  <svg
                    className="w-4 h-4 text-yellow-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Pending Claims
                </h4>
                <span className="bg-yellow-100 dark:bg-yellow-800/30 text-yellow-800 dark:text-yellow-300 text-xs font-bold px-2 py-1 rounded-full">
                  {payrollData.reimbursements.pending}
                </span>
              </div>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {payrollData.reimbursements.pendingClaims.length > 0 ? (
                payrollData.reimbursements.pendingClaims.map((claim, index) => (
                  <div
                    key={index}
                    className="px-5 py-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-white">
                          {claim.type}
                        </p>
                        <div className="flex items-center mt-2">
                          <span className="text-xs font-medium text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded-full">
                            Pending Review
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-800 dark:text-white">
                          {claim.amount}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {claim.date}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                        View Details
                      </button>
                      <button className="text-xs text-red-600 dark:text-red-400 hover:underline">
                        Cancel
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-5 py-8 text-center">
                  <svg
                    className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto"
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
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    No pending claims
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Approved Claims */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="border-b border-gray-200 dark:border-gray-700 px-5 py-4 bg-green-50 dark:bg-green-900/20">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-gray-800 dark:text-white flex items-center">
                  <svg
                    className="w-4 h-4 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Approved Claims
                </h4>
                <span className="bg-green-100 dark:bg-green-800/30 text-green-800 dark:text-green-300 text-xs font-bold px-2 py-1 rounded-full">
                  {payrollData.reimbursements.approved}
                </span>
              </div>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {payrollData.reimbursements.approvedClaims.length > 0 ? (
                payrollData.reimbursements.approvedClaims.map((claim, index) => (
                  <div
                    key={index}
                    className="px-5 py-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-white">
                          {claim.type}
                        </p>
                        <div className="flex items-center mt-2">
                          <span className="text-xs font-medium text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                            Approved
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-800 dark:text-white">
                          {claim.amount}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {claim.date}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                        View Receipt
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-5 py-8 text-center">
                  <svg
                    className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto"
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
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    No approved claims
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Form */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-md p-6 transform transition-all duration-300 ease-out scale-95 opacity-0 animate-fadeInUp">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Submit New Claim
              </h3>

              <form className="space-y-4">
  {/* Claim Type */}
  <div>
    <label className="text-sm text-gray-600 dark:text-gray-300">
      Claim Type <span className="text-red-500">*</span>
    </label>
    <input
      type="text"
      placeholder="e.g. Travel Expense"
      required
      className="w-full mt-1 px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
    />
  </div>

  {/* Category */}
  <div>
    <label className="text-sm text-gray-600 dark:text-gray-300">
      Category <span className="text-red-500">*</span>
    </label>
    <select
      required
      className="w-full mt-1 px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
    >
      <option value="">Select category</option>
      <option value="travel">Travel</option>
      <option value="meals">Meals</option>
      <option value="supplies">Office Supplies</option>
      <option value="training">Training</option>
      <option value="other">Other</option>
    </select>
  </div>

  {/* Amount */}
  <div>
    <label className="text-sm text-gray-600 dark:text-gray-300">
      Amount <span className="text-red-500">*</span>
    </label>
    <input
      type="number"
      placeholder="e.g. 120"
      required
      className="w-full mt-1 px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
    />
  </div>

  {/* Date */}
  <div>
    <label className="text-sm text-gray-600 dark:text-gray-300">
      Date <span className="text-red-500">*</span>
    </label>
    <input
      type="date"
      required
      className="w-full mt-1 px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
    />
  </div>

  {/* Payment Method */}
  <div>
    <label className="text-sm text-gray-600 dark:text-gray-300">
      Payment Method <span className="text-red-500">*</span>
    </label>
    <select
      required
      className="w-full mt-1 px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
    >
      <option value="">Select payment method</option>
      <option value="credit">Credit Card</option>
      <option value="cash">Cash</option>
      <option value="bank">Bank Transfer</option>
      <option value="other">Other</option>
    </select>
  </div>

  {/* Description */}
  <div>
    <label className="text-sm text-gray-600 dark:text-gray-300">
      Description <span className="text-red-500">*</span>
    </label>
    <textarea
      placeholder="Provide a brief description of the expense"
      required
      rows={3}
      className="w-full mt-1 px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
    />
  </div>

  {/* Upload Receipt */}
  <div>
    <label className="text-sm text-gray-600 dark:text-gray-300">
      Upload Receipt <span className="text-red-500">*</span>
    </label>
    <input
      type="file"
      accept="image/*,.pdf"
      required
      className="w-full mt-1 text-sm text-gray-600 dark:text-gray-300"
    />
  </div>

  {/* Buttons */}
  <div className="flex justify-end space-x-2 pt-3">
    <button
      type="button"
      onClick={() => setIsModalOpen(false)}
      className="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
    >
      Cancel
    </button>
    <button
      type="submit"
      className="px-4 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
    >
      Submit
    </button>
  </div>
</form>

            </div>
          </div>
        )}
      </div>

      {/* Tailwind keyframes for fade-up */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
