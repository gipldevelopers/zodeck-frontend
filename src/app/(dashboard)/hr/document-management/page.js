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
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
          >
            <Upload size={18} />
            Upload Document
          </Link>
        }
      />

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Document Management
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
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
