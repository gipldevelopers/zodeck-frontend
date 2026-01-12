"use client";
import React, { useState, useMemo } from "react";
import { FileEdit, Search, Filter, Calendar, Clock, CheckCircle, AlertCircle, ChevronUp, ChevronDown, FileText, Edit } from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";

import Breadcrumb from "../../../../../components/common/Breadcrumb";
import Pagination from "../../../../../components/common/Pagination";
import BreadcrumbRightContent from "../components/BreadcrumbRightContent";

export default function Regularization() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState([]);
  const [data, setData] = useState([
    { id: 1, date: "2025-01-05", inTime: "10:15 AM", outTime: "06:45 PM", reason: "Came late due to traffic", status: "Approved" },
    { id: 2, date: "2025-01-10", inTime: "09:45 AM", outTime: "05:30 PM", reason: "System issue, forgot to punch", status: "Pending" },
    { id: 3, date: "2025-02-03", inTime: "09:10 AM", outTime: "06:00 PM", reason: "Forgot punch-in, manual correction", status: "Rejected" },
    { id: 4, date: "2025-02-15", inTime: "10:00 AM", outTime: "06:30 PM", reason: "Came late, request adjustment", status: "Approved" },
    { id: 5, date: "2025-03-01", inTime: "09:05 AM", outTime: "05:50 PM", reason: "Missed punch-out, corrected", status: "Pending" },
    { id: 6, date: "2025-03-08", inTime: "09:25 AM", outTime: "06:10 PM", reason: "Technical issue at gate", status: "Approved" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [formData, setFormData] = useState({ inTime: "", outTime: "", reason: "" });

  // Search + Filter
  const filteredData = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return data.filter((item) => {
      const matchesSearch =
        !q ||
        item.date.toLowerCase().includes(q) ||
        item.reason.toLowerCase().includes(q) ||
        item.status.toLowerCase().includes(q);

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
        accessorKey: "inTime", 
        header: "In Time",
        enableSorting: true,
        cell: info => (
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-primary-500" />
            <span className="text-gray-700 dark:text-gray-300 font-medium">{info.getValue()}</span>
          </div>
        )
      },
      { 
        accessorKey: "outTime", 
        header: "Out Time",
        enableSorting: true,
        cell: info => (
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-primary-500" />
            <span className="text-gray-700 dark:text-gray-300 font-medium">{info.getValue()}</span>
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
        header: "Action",
        cell: ({ row }) => (
          <button
            onClick={() => {
              setSelectedRow(row.original);
              setFormData({ inTime: row.original.inTime, outTime: row.original.outTime, reason: "" });
              setIsModalOpen(true);
            }}
            className="p-2 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-500/10 text-primary-600 dark:text-primary-400 transition-colors duration-200"
            title="Edit"
          >
            <Edit size={16} />
          </button>
        ),
      },
    ],
    []
  );

  // React Table
  const table = useReactTable({
    data: filteredData,
    columns,
    state: { pagination, sorting },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    pageCount: Math.ceil(filteredData.length / pagination.pageSize),
  });

  // Handle Form Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedRow) return;

    setData((prev) =>
      prev.map((row) =>
        row.id === selectedRow.id
          ? { ...row, inTime: formData.inTime, outTime: formData.outTime, reason: formData.reason, status: "Pending" }
          : row
      )
    );
    setIsModalOpen(false);
    setSelectedRow(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Breadcrumb
          customTitle="Regularization"
          subtitle="Manage your attendance regularization requests"
          rightContent={<BreadcrumbRightContent selectedDate={selectedDate} setSelectedDate={setSelectedDate} />}
        />

        {/* Filters + Search */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-primary-100/50 dark:border-gray-700 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
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
                        <p className="text-gray-500 dark:text-gray-400 font-medium">No regularization records found</p>
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
      {isModalOpen && selectedRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md border border-primary-100/50 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 rounded-xl">
                  <FileEdit size={18} />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Regularization Request
                </h2>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Date (read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date</label>
                <input
                  type="text"
                  value={selectedRow.date}
                  readOnly
                  className="w-full px-4 py-2.5 border border-primary-200/50 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 text-sm cursor-not-allowed"
                />
              </div>

              {/* In Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">In Time</label>
                <input
                  type="text"
                  value={formData.inTime}
                  onChange={(e) => setFormData({ ...formData, inTime: e.target.value })}
                  placeholder="e.g. 09:00 AM"
                  required
                  className="w-full px-4 py-2.5 border border-primary-200/50 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 dark:focus:border-primary-500 transition-all duration-200 text-sm"
                />
              </div>

              {/* Out Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Out Time</label>
                <input
                  type="text"
                  value={formData.outTime}
                  onChange={(e) => setFormData({ ...formData, outTime: e.target.value })}
                  placeholder="e.g. 06:00 PM"
                  required
                  className="w-full px-4 py-2.5 border border-primary-200/50 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 dark:focus:border-primary-500 transition-all duration-200 text-sm"
                />
              </div>

              {/* Reason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Reason</label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  required
                  rows={4}
                  placeholder="Provide reason for regularization..."
                  className="w-full px-4 py-2.5 border border-primary-200/50 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 dark:focus:border-primary-500 transition-all duration-200 text-sm resize-none"
                />
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
