"use client";

import React, { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";

// Common components
import Breadcrumb from "../../../../../components/common/Breadcrumb";
import Pagination from "../../../../../components/common/Pagination";
import BreadcrumbRightContent from "../components/BreadcrumbRightContent";

export default function Overtime() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
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
      { accessorKey: "date", header: "Date" },
      { accessorKey: "hours", header: "Hours" },
      { accessorKey: "reason", header: "Reason" },
      {
        accessorKey: "status",
        header: "Status",
        cell: (info) => {
          const status = info.getValue();
          const color =
            status === "Approved"
              ? "bg-green-100 text-green-700"
              : status === "Pending"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700";
          return <span className={`px-2 py-1 text-xs rounded-full ${color}`}>{status}</span>;
        },
      },
      { accessorKey: "approvedBy", header: "Approved By" },
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
    <div className="bg-gray-50 min-h-screen dark:bg-gray-900">
      <Breadcrumb
        title="Overtime"
        subtitle="Track and manage your overtime requests"
        rightContent={<BreadcrumbRightContent selectedDate={selectedDate} setSelectedDate={setSelectedDate} />}
      />

      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
          >
            + New Overtime
          </button>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm dark:bg-gray-800 dark:text-gray-300"
          >
            <option value="All">All</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search by date, reason, status, approver..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-2 w-72 border rounded-lg text-sm dark:bg-gray-800 dark:text-gray-300"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-700">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => {
                  const canSort = header.column.getCanSort?.() ?? false;
                  return (
                    <th
                      key={header.id}
                      className={`px-4 py-3 text-left font-semibold select-none ${canSort ? "cursor-pointer" : ""}`}
                      onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                    >
                      <div className="flex items-center gap-2">
                        <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                        {canSort && (
                          <span className="text-xs text-gray-400">
                            {header.column.getIsSorted() ? (header.column.getIsSorted() === "asc" ? "🔼" : "🔽") : ""}
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/40">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 align-top">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4">
        <Pagination
          currentPage={pagination.pageIndex + 1}
          totalItems={filteredData.length}
          itemsPerPage={pagination.pageSize}
          onPageChange={(page) => table.setPageIndex(page - 1)}
          onItemsPerPageChange={(size) => {
            table.setPageSize(size);
            table.setPageIndex(0);
          }}
        />
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              New Overtime Request
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-300">Date</label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 dark:text-gray-300">Hours</label>
                <input
                  type="number"
                  name="hours"
                  value={form.hours}
                  onChange={handleChange}
                  placeholder="e.g. 3"
                  required
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 dark:text-gray-300">Reason</label>
                <textarea
                  name="reason"
                  value={form.reason}
                  onChange={handleChange}
                  placeholder="Provide justification for overtime"
                  required
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                ></textarea>
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
  );
}
