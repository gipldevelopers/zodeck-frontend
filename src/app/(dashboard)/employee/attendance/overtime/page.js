"use client";

import React, { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Search, Filter, X, Calendar, Clock, CheckCircle, AlertCircle, Plus, ChevronUp, ChevronDown, FileText } from "lucide-react";

// Common components
import Breadcrumb from "../../../../../components/common/Breadcrumb";
import Pagination from "../../../../../components/common/Pagination";
import BreadcrumbRightContent from "../components/BreadcrumbRightContent";

export default function Overtime() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Dummy Overtime Data
  const [data, setData] = useState([
    { id: 1, date: "2025-01-08", hours: 3, reason: "Client delivery deadline", status: "Approved", approvedBy: "Manager A" },
    { id: 2, date: "2025-01-15", hours: 2, reason: "System upgrade", status: "Pending", approvedBy: "-" },
    { id: 3, date: "2025-02-05", hours: 4, reason: "Critical project work", status: "Approved", approvedBy: "Manager B" },
    { id: 4, date: "2025-02-20", hours: 1.5, reason: "Team support", status: "Rejected", approvedBy: "Manager A" },
    { id: 5, date: "2025-03-02", hours: 2.5, reason: "Urgent bug fix", status: "Pending", approvedBy: "-" },
  ]);

  // Form state
  const [form, setForm] = useState({
    date: "",
    hours: "",
    reason: "",
  });

  // Search + Filter
  const filteredData = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return data.filter((item) => {
      const matchesSearch =
        !q ||
        item.date.toLowerCase().includes(q) ||
        item.reason.toLowerCase().includes(q) ||
        item.status.toLowerCase().includes(q) ||
        item.approvedBy.toLowerCase().includes(q);

      const matchesStatus = statusFilter === "All" || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [data, searchQuery, statusFilter]);

  // Table columns
  const columns = useMemo(
    () => [
      { 
        accessorKey: "date", 
        header: "Date",
        enableSorting: true,
        cell: info => (
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-primary-500" />
            <span className="font-medium text-gray-700 dark:text-gray-300">{info.getValue()}</span>
          </div>
        )
      },
      { 
        accessorKey: "hours", 
        header: "Hours",
        enableSorting: true,
        cell: info => (
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-primary-500" />
            <span className="text-gray-700 dark:text-gray-300 font-medium">{info.getValue()}h</span>
          </div>
        )
      },
      { 
        accessorKey: "reason", 
        header: "Reason",
        enableSorting: true,
        cell: info => (
          <span className="text-gray-600 dark:text-gray-400">{info.getValue()}</span>
        )
      },
      {
        accessorKey: "status",
        header: "Status",
        enableSorting: true,
        cell: (info) => {
          const status = info.getValue();
          const statusConfig = {
            "Approved": { bg: "bg-primary-50 dark:bg-primary-500/10", text: "text-primary-700 dark:text-primary-400", border: "border-primary-200 dark:border-primary-500/30", icon: CheckCircle },
            "Pending": { bg: "bg-amber-50 dark:bg-amber-500/10", text: "text-amber-700 dark:text-amber-400", border: "border-amber-200 dark:border-amber-500/30", icon: Clock },
            "Rejected": { bg: "bg-red-50 dark:bg-red-500/10", text: "text-red-700 dark:text-red-400", border: "border-red-200 dark:border-red-500/30", icon: AlertCircle },
          };
          const config = statusConfig[status] || { bg: "bg-gray-50 dark:bg-gray-800", text: "text-gray-700 dark:text-gray-400", border: "border-gray-200 dark:border-gray-700", icon: AlertCircle };
          const Icon = config.icon;
          return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border ${config.bg} ${config.text} ${config.border}`}>
              <Icon size={12} />
              {status}
            </span>
          );
        },
      },
      { 
        accessorKey: "approvedBy", 
        header: "Approved By",
        enableSorting: true,
        cell: info => (
          <span className="text-gray-600 dark:text-gray-400">{info.getValue()}</span>
        )
      },
    ],
    []
  );

  // React Table instance
  const table = useReactTable({
    data: filteredData,
    columns,
    state: { pagination, sorting },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submit
 const handleSubmit = (e) => {
  e.preventDefault();
  const newRequest = {
    id: data.length + 1,
    date: form.date,
    hours: form.hours,
    reason: form.reason,
    status: "Pending",   // ✅ Always pending for new requests
    approvedBy: "-",     // ✅ Not approved yet
  };
  setData((prev) => [newRequest, ...prev]); // unshift to top
  setIsModalOpen(false);
  setForm({ date: "", hours: "", reason: "" });  // Reset form
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Breadcrumb
          customTitle="Overtime"
          subtitle="Track and manage your overtime requests"
          rightContent={<BreadcrumbRightContent selectedDate={selectedDate} setSelectedDate={setSelectedDate} />}
        />

        {/* Filters + Search */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-primary-100/50 dark:border-gray-700 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-wrap gap-3 w-full lg:w-auto">
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-primary-500 text-white rounded-xl hover:bg-primary-600 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <Plus size={16} />
                New Overtime
              </button>

              <div className="relative flex-1 lg:flex-initial min-w-[140px]">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full appearance-none pl-10 pr-8 py-2.5 border border-primary-200/50 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 dark:focus:border-primary-500 transition-all duration-200 text-sm cursor-pointer"
                >
                  <option value="All">All Status</option>
                  <option value="Approved">Approved</option>
                  <option value="Pending">Pending</option>
                  <option value="Rejected">Rejected</option>
                </select>
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
            </div>

            <div className="relative flex-1 lg:flex-initial min-w-[250px] w-full lg:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              <input
                type="text"
                placeholder="Search by date, reason, status..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-primary-200/50 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 dark:focus:border-primary-500 transition-all duration-200 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-primary-100/50 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gradient-to-r from-primary-50/50 to-primary-50/30 dark:from-gray-800 dark:to-gray-800 border-b border-primary-100/50 dark:border-gray-700">
                {table.getHeaderGroups().map((hg) => (
                  <tr key={hg.id}>
                    {hg.headers.map((header) => {
                      const canSort = header.column.getCanSort?.() ?? false;
                      return (
                        <th
                          key={header.id}
                          className={`px-5 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider ${
                            canSort ? "cursor-pointer hover:bg-primary-50/50 dark:hover:bg-gray-700/50 transition-colors" : ""
                          }`}
                          {...(canSort ? { onClick: header.column.getToggleSortingHandler() } : {})}
                        >
                          <div className="flex items-center gap-2">
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {canSort && (
                              <span className="text-gray-400">
                                {header.column.getIsSorted() === 'asc' ? (
                                  <ChevronUp size={14} />
                                ) : header.column.getIsSorted() === 'desc' ? (
                                  <ChevronDown size={14} />
                                ) : (
                                  <div className="flex flex-col -space-y-1">
                                    <ChevronUp size={10} className="text-gray-300" />
                                    <ChevronDown size={10} className="text-gray-300" />
                                  </div>
                                )}
                              </span>
                            )}
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                ))}
              </thead>

              <tbody className="divide-y divide-primary-100/30 dark:divide-gray-700">
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="hover:bg-primary-50/30 dark:hover:bg-gray-700/30 transition-colors duration-150">
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-5 py-4 text-sm">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length} className="text-center py-16">
                      <div className="flex flex-col items-center gap-3">
                        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full">
                          <FileText size={32} className="text-gray-400" />
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">No overtime records found</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500">Try adjusting your filters</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={pagination.pageIndex + 1}
          totalItems={filteredData.length}
          itemsPerPage={pagination.pageSize}
          onPageChange={(page) => table.setPageIndex(page - 1)}
          onItemsPerPageChange={(size) => {
            table.setPageSize(size);
            table.setPageIndex(0);
            setPagination({ pageIndex: 0, pageSize: size });
          }}
          className="mt-6"
        />

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg border border-primary-100/50 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 rounded-xl">
                  <Plus size={18} />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  New Overtime Request
                </h2>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date</label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-primary-200/50 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 dark:focus:border-primary-500 transition-all duration-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Hours</label>
                <input
                  type="number"
                  name="hours"
                  value={form.hours}
                  onChange={handleChange}
                  placeholder="e.g. 3"
                  required
                  min="0.5"
                  step="0.5"
                  className="w-full px-4 py-2.5 border border-primary-200/50 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 dark:focus:border-primary-500 transition-all duration-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Reason</label>
                <textarea
                  name="reason"
                  value={form.reason}
                  onChange={handleChange}
                  placeholder="Provide justification for overtime"
                  required
                  rows={4}
                  className="w-full px-4 py-2.5 border border-primary-200/50 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 dark:focus:border-primary-500 transition-all duration-200 text-sm resize-none"
                ></textarea>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 text-sm font-medium bg-primary-500 text-white rounded-xl hover:bg-primary-600 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
