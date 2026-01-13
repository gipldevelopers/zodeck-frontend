"use client";

import { Upload, FileText } from "lucide-react";
import Breadcrumb from "@/components/common/Breadcrumb";
import DocumentStatsCards from "./components/DocumentStatsCards";
import DocumentTable from "./components/DocumentTable";
import Link from "next/link";

export default function DocumentManagementPage() {
  return (
    <div className="bg-gray-50 min-h-screen dark:bg-gray-900 p-3 sm:p-6">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "HR", href: "/hr" },
          { label: "Document Management", href: "/hr/document-management" },
        ]}
        rightContent={
          <Link
            href="/hr/employees"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-white hover:bg-brand-600 transition-all shadow-sm hover:shadow-md font-semibold"
          >
            <Upload size={18} />
            Upload Document
          </Link>
        }
      />

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-3">
          <div className="p-3 bg-gradient-to-br from-brand-100 to-brand-200 dark:from-brand-500/20 dark:to-brand-500/10 rounded-xl shadow-sm">
            <FileText className="w-7 h-7 text-brand-600 dark:text-brand-400" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              Document Management
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage employee-related documents with categorization, expiry tracking, and role-based access
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <DocumentStatsCards />

      {/* Documents Table */}
      <div className="bg-white rounded-lg shadow dark:bg-gray-800">
        <DocumentTable />
      </div>
    </div>
  );
}
