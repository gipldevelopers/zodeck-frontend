"use client";
import React, { useState, useMemo } from "react";
import { FileEdit } from "lucide-react";
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
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
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
      { accessorKey: "date", header: "Date" },
      { accessorKey: "inTime", header: "In Time" },
      { accessorKey: "outTime", header: "Out Time" },
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
      {
        header: "Action",
        cell: ({ row }) => (
          <button
            onClick={() => {
              setSelectedRow(row.original);
              setFormData({ inTime: row.original.inTime, outTime: row.original.outTime, reason: "" });
              setIsModalOpen(true);
            }}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <FileEdit className="w-5 h-5 text-blue-600" /> {/* 👈 icon instead of button */}
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
    <div className="bg-gray-50 min-h-screen dark:bg-gray-900">
      <Breadcrumb
        title="Regularization"
        subtitle="Manage your attendance regularization requests"
        rightContent={<BreadcrumbRightContent selectedDate={selectedDate} setSelectedDate={setSelectedDate} />}
      />

      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        <div className="flex items-center gap-3">
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
            placeholder="Search by date, reason, status..."
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
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left font-semibold select-none"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
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
      {isModalOpen && selectedRow && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Regularization Request</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Date (read-only) */}
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-300">Date</label>
                <input
                  type="text"
                  value={selectedRow.date}
                  readOnly
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              {/* In Time */}
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-300">In Time</label>
                <input
                  type="text"
                  value={formData.inTime}
                  onChange={(e) => setFormData({ ...formData, inTime: e.target.value })}
                  required
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              {/* Out Time */}
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-300">Out Time</label>
                <input
                  type="text"
                  value={formData.outTime}
                  onChange={(e) => setFormData({ ...formData, outTime: e.target.value })}
                  required
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              {/* Reason */}
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-300">Reason</label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  required
                  rows={3}
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
  );
}
