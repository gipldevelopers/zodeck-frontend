"use client";

import { useState, useMemo, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import EmployeeLeaveService from "@/services/employee/leave.service";
import { format } from "date-fns";

export default function LeaveHistoryTable() {
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaveHistory();
  }, []);

  const fetchLeaveHistory = async () => {
    try {
      setLoading(true);
      const response = await EmployeeLeaveService.getLeaveHistory();
      setData(response.data || response || []);
    } catch (error) {
      console.error("Failed to fetch leave history", error);
    } finally {
      setLoading(false);
    }
  };

  const statuses = useMemo(
    () => ["all", "Approved", "Pending", "Rejected"],
    []
  );

  const filteredData = useMemo(() => {
    let result = [...data];
    if (globalFilter) {
      const term = globalFilter.toLowerCase();
      result = result.filter(
        (d) =>
          d.leaveType?.toLowerCase().includes(term) ||
          d.reason?.toLowerCase().includes(term) ||
          d.status?.toLowerCase().includes(term)
      );
    }
    if (statusFilter !== "all") {
      result = result.filter((d) => d.status === statusFilter);
    }
    return result;
  }, [globalFilter, statusFilter, data]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "createdAt",
        header: "Submitted",
        cell: (info) => info.getValue() ? format(new Date(info.getValue()), "dd MMM yyyy") : "-"
      },
      { accessorKey: "leaveType.name", header: "Leave Type", cell: info => info.getValue() || info.row.original.leaveType },
      {
        accessorKey: "startDate",
        header: "Start Date",
        cell: (info) => info.getValue() ? format(new Date(info.getValue()), "dd MMM yyyy") : "-"
      },
      {
        accessorKey: "endDate",
        header: "End Date",
        cell: (info) => info.getValue() ? format(new Date(info.getValue()), "dd MMM yyyy") : "-"
      },
      {
        accessorKey: "days", header: "Days", cell: (info) => {
          // Calculate days if not provided, or use 'duration'
          if (info.row.original.duration) return info.row.original.duration;

          if (info.row.original.startDate && info.row.original.endDate) {
            const start = new Date(info.row.original.startDate);
            const end = new Date(info.row.original.endDate);
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
            return diffDays;
          }
          return "-";
        }
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: (info) => {
          const status = info.getValue();
          const statusClass =
            status === "APPROVED" || status === "Approved"
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
              : status === "PENDING" || status === "Pending"
                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
          return (
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold uppercase ${statusClass}`}
            >
              {status}
            </span>
          );
        },
      },
      { accessorKey: "reason", header: "Reason" },
    ],
    []
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    pageCount: Math.ceil(filteredData.length / pagination.pageSize),
  });

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded w-full"></div>
          <div className="h-64 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by type, reason, or status..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full sm:w-72 p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s === "all" ? "All Status" : s}
              </option>
            ))}
          </select>
        </div>

        {(globalFilter || statusFilter !== "all") && (
          <button
            onClick={() => {
              setGlobalFilter("");
              setStatusFilter("all");
              setPagination({ pageIndex: 0, pageSize: 5 });
            }}
            className="text-red-600 hover:text-red-800 dark:text-red-400 font-medium transition sm:mt-0 mt-2"
          >
            Clear
          </button>
        )}
      </div>


      {/* Table */}
      <div className="overflow-x-auto rounded-lg">
        <table className="w-full text-sm min-w-[700px] border border-gray-200 dark:border-gray-600">
          <thead className="bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const sorted = header.column.getIsSorted();
                  return (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className="px-4 py-3 text-left text-gray-700 dark:text-gray-300 font-semibold uppercase tracking-wide text-xs cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-1">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        <span>
                          {sorted === "asc"
                            ? "▲"
                            : sorted === "desc"
                              ? "▼"
                              : "⇅"}
                        </span>
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
                <tr
                  key={row.id}
                  className="bg-gray-50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-all rounded-lg"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-4 py-3 text-gray-600 dark:text-gray-200"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-6 text-gray-500 dark:text-gray-400"
                >
                  No leave history found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Prev
          </button>
          <span className="text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Next
          </button>
        </div>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
            table.setPageIndex(0);
          }}
          className="p-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {[5, 10, 20].map((size) => (
            <option key={size} value={size}>
              {size} / page
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
