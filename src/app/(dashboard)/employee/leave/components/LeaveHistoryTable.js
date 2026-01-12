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
import { Search, Filter, X, Calendar, ChevronUp, ChevronDown, CheckCircle, Clock, AlertCircle, FileText } from "lucide-react";
import Pagination from "@/components/common/Pagination";

export default function LeaveHistoryTable() {
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
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
        enableSorting: true,
        cell: (info) => (
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-primary-500" />
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {info.getValue() ? format(new Date(info.getValue()), "dd MMM yyyy") : "-"}
            </span>
          </div>
        )
      },
      { 
        accessorKey: "leaveType.name", 
        header: "Leave Type",
        enableSorting: true,
        cell: info => (
          <span className="text-gray-700 dark:text-gray-300 font-medium">
            {info.getValue() || info.row.original.leaveType}
          </span>
        )
      },
      {
        accessorKey: "startDate",
        header: "Start Date",
        enableSorting: true,
        cell: (info) => (
          <span className="text-gray-600 dark:text-gray-400">
            {info.getValue() ? format(new Date(info.getValue()), "dd MMM yyyy") : "-"}
          </span>
        )
      },
      {
        accessorKey: "endDate",
        header: "End Date",
        enableSorting: true,
        cell: (info) => (
          <span className="text-gray-600 dark:text-gray-400">
            {info.getValue() ? format(new Date(info.getValue()), "dd MMM yyyy") : "-"}
          </span>
        )
      },
      {
        accessorKey: "days", 
        header: "Days",
        enableSorting: true,
        cell: (info) => {
          // Calculate days if not provided, or use 'duration'
          let days = info.row.original.duration;

          if (!days && info.row.original.startDate && info.row.original.endDate) {
            const start = new Date(info.row.original.startDate);
            const end = new Date(info.row.original.endDate);
            const diffTime = Math.abs(end - start);
            days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
          }
          return (
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              {days || "-"}
            </span>
          );
        }
      },
      {
        accessorKey: "status",
        header: "Status",
        enableSorting: true,
        cell: (info) => {
          const status = info.getValue();
          const statusConfig = {
            "APPROVED": { bg: "bg-primary-50 dark:bg-primary-500/10", text: "text-primary-700 dark:text-primary-400", border: "border-primary-200 dark:border-primary-500/30", icon: CheckCircle },
            "Approved": { bg: "bg-primary-50 dark:bg-primary-500/10", text: "text-primary-700 dark:text-primary-400", border: "border-primary-200 dark:border-primary-500/30", icon: CheckCircle },
            "PENDING": { bg: "bg-amber-50 dark:bg-amber-500/10", text: "text-amber-700 dark:text-amber-400", border: "border-amber-200 dark:border-amber-500/30", icon: Clock },
            "Pending": { bg: "bg-amber-50 dark:bg-amber-500/10", text: "text-amber-700 dark:text-amber-400", border: "border-amber-200 dark:border-amber-500/30", icon: Clock },
            "REJECTED": { bg: "bg-red-50 dark:bg-red-500/10", text: "text-red-700 dark:text-red-400", border: "border-red-200 dark:border-red-500/30", icon: AlertCircle },
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
        accessorKey: "reason", 
        header: "Reason",
        enableSorting: true,
        cell: info => (
          <span className="text-gray-600 dark:text-gray-400">{info.getValue() || "-"}</span>
        )
      },
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
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-primary-100/50 dark:border-gray-700 shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl w-full"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-primary-100/50 dark:border-gray-700 shadow-sm overflow-hidden">
      {/* Filters */}
      <div className="p-5 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-wrap gap-3 w-full lg:w-auto">
            <div className="relative flex-1 lg:flex-initial min-w-[250px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              <input
                type="text"
                placeholder="Search by type, reason, or status..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-primary-200/50 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 dark:focus:border-primary-500 transition-all duration-200 text-sm"
              />
            </div>
            <div className="relative flex-1 lg:flex-initial min-w-[140px]">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full appearance-none pl-10 pr-8 py-2.5 border border-primary-200/50 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 dark:focus:border-primary-500 transition-all duration-200 text-sm cursor-pointer"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s === "all" ? "All Status" : s}
                  </option>
                ))}
              </select>
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>

          {(globalFilter || statusFilter !== "all") && (
            <button
              onClick={() => {
                setGlobalFilter("");
                setStatusFilter("all");
                setPagination({ pageIndex: 0, pageSize: 10 });
              }}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors duration-200"
            >
              <X size={16} />
              Clear
            </button>
          )}
        </div>
      </div>


      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="bg-gradient-to-r from-primary-50/50 to-primary-50/30 dark:from-gray-800 dark:to-gray-800 border-b border-primary-100/50 dark:border-gray-700">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
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
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
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
                <tr
                  key={row.id}
                  className="hover:bg-primary-50/30 dark:hover:bg-gray-700/30 transition-colors duration-150"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-5 py-4 text-sm"
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
                  className="text-center py-16"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full">
                      <FileText size={32} className="text-gray-400" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">No leave history found</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">Try adjusting your filters</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-5 border-t border-gray-200 dark:border-gray-700">
        <Pagination
          currentPage={pagination.pageIndex + 1}
          totalItems={filteredData.length}
          itemsPerPage={pagination.pageSize}
          onPageChange={(page) => {
            table.setPageIndex(page - 1);
            setPagination({ ...pagination, pageIndex: page - 1 });
          }}
          onItemsPerPageChange={(size) => {
            table.setPageSize(size);
            table.setPageIndex(0);
            setPagination({ pageIndex: 0, pageSize: size });
          }}
        />
      </div>
    </div>
  );
}
