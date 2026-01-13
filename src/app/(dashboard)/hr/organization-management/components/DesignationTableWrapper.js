"use client";

import { useState, useMemo, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { ChevronUp, ChevronDown, Eye, Edit, Trash2 } from "lucide-react";
import Pagination from "@/components/common/Pagination";
import { organizationService } from "@/services/hr-services/organization.service";
import { toast } from "react-hot-toast";
import Link from "next/link";

export default function DesignationTableWrapper() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [departments, setDepartments] = useState([]);

  // Fetch departments for filter
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        // Use max limit of 100 as per API validation (max: 100)
        const response = await organizationService.getAllDepartments({ limit: 100, page: 1 });
        const depts = response.success ? response.data || [] : response.data?.departments || [];
        setDepartments(depts);
      } catch (error) {
        console.error("Failed to fetch departments:", error);
        toast.error("Failed to load departments for filter");
      }
    };
    fetchDepartments();
  }, []);

  // Fetch designations from API
  const fetchDesignations = async () => {
    try {
      setLoading(true);
      // Ensure limit doesn't exceed API maximum of 100
      const validLimit = Math.min(Math.max(1, pagination.pageSize), 100);
      const params = {
        page: pagination.pageIndex + 1,
        limit: validLimit,
        search: globalFilter || "",
        status: statusFilter !== "all" ? statusFilter : "all",
        department: departmentFilter !== "all" ? departmentFilter : "all",
      };

      const response = await organizationService.getAllDesignations(params);

      // Handle API response structure
      const designations = response.success
        ? response.data || []
        : response.data?.designations || response.data || [];
      const paginationInfo = response.pagination || response.data?.pagination || {};

      const formattedData = designations.map((desig) => ({
        id: desig.id,
        name: desig.name || "Unnamed Designation",
        level: desig.level || "-",
        code: desig.code || "-",
        departmentName: desig.department?.name || "-",
        departmentId: desig.department?.id || null,
        orgLevel: desig.orgLevel || 0,
        employeeCount: desig.employeeCount || 0,
        status: desig.status || "ACTIVE",
        raw: desig,
      }));

      setData(formattedData);
      setTotalItems(paginationInfo.totalItems || paginationInfo.total || 0);
      setTotalPages(
        paginationInfo.totalPages ||
          Math.ceil((paginationInfo.totalItems || paginationInfo.total || 0) / pagination.pageSize)
      );
    } catch (error) {
      console.error("Error fetching designations:", error);
      toast.error(error.message || "Failed to fetch designations");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesignations();
  }, [pagination.pageIndex, pagination.pageSize, globalFilter, statusFilter, departmentFilter]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "#",
        cell: (info) => (
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {info.row.index + 1 + pagination.pageIndex * pagination.pageSize}
          </span>
        ),
      },
      {
        accessorKey: "name",
        header: "Designation Name",
        cell: (info) => (
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {info.getValue()}
          </span>
        ),
      },
      {
        accessorKey: "level",
        header: "Level",
        cell: (info) => (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-brand-100 text-brand-800 dark:bg-brand-500/30 dark:text-brand-400">
            {info.getValue()}
          </span>
        ),
      },
      {
        accessorKey: "departmentName",
        header: "Department",
        cell: (info) => (
          <span className="text-sm text-gray-600 dark:text-gray-400">{info.getValue()}</span>
        ),
      },
      {
        accessorKey: "orgLevel",
        header: "Org Level",
        cell: (info) => (
          <span className="text-sm text-gray-600 dark:text-gray-400">{info.getValue()}</span>
        ),
      },
      {
      accessorKey: "employeeCount",
      header: "Employees",
      cell: (info) => (
        <span className="text-sm font-semibold text-brand-600 dark:text-brand-400">
          {info.getValue()}
        </span>
      ),
    },
      {
        accessorKey: "status",
        header: "Status",
        cell: (info) => {
          const status = info.getValue();
          const statusClass =
            status === "ACTIVE"
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
          return (
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClass}`}>
              {status}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        enableSorting: false,
        cell: (info) => (
          <div className="flex items-center gap-2">
            <Link
              href={`/hr/organization-management/designations/view/${info.row.original.id}`}
              className="p-2 rounded-lg bg-brand-50 text-brand-600 hover:bg-brand-100 transition-colors dark:bg-brand-900/30 dark:text-brand-400 shadow-sm hover:shadow"
              title="View"
            >
              <Eye className="w-4 h-4" />
            </Link>
            <Link
              href={`/hr/organization-management/designations/edit/${info.row.original.id}`}
              className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors dark:bg-emerald-900/30 dark:text-emerald-400 shadow-sm hover:shadow"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </Link>
            <button
              onClick={async () => {
                if (
                  window.confirm(
                    `Are you sure you want to delete "${info.row.original.name}"?`
                  )
                ) {
                  try {
                    await organizationService.deleteDesignation(info.row.original.id);
                    toast.success("Designation deleted successfully");
                    fetchDesignations();
                  } catch (error) {
                    toast.error(error.message || "Failed to delete designation");
                  }
                }
              }}
              className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors dark:bg-rose-900/30 dark:text-rose-400 shadow-sm hover:shadow"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ),
      },
    ],
    [pagination.pageIndex, pagination.pageSize]
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: totalPages,
  });

  if (loading && data.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 sm:p-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search designations..."
            value={globalFilter}
            onChange={(e) => {
              setGlobalFilter(e.target.value);
              setPagination((prev) => ({ ...prev, pageIndex: 0 }));
            }}
            className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={departmentFilter}
            onChange={(e) => {
              setDepartmentFilter(e.target.value);
              setPagination((prev) => ({ ...prev, pageIndex: 0 }));
            }}
            className="px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all"
          >
            <option value="all">All Departments</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPagination((prev) => ({ ...prev, pageIndex: 0 }));
            }}
            className="px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all"
          >
            <option value="all">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-brand-50 to-brand-100/50 dark:from-brand-500/10 dark:to-brand-500/5">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3.5 text-left text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={`flex items-center gap-2 ${
                          header.column.getCanSort()
                            ? "cursor-pointer select-none hover:text-brand-600 dark:hover:text-brand-400"
                            : ""
                        }`}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && (
                          <span className="flex flex-col">
                            <ChevronUp
                              className={`w-3 h-3 ${
                                header.column.getIsSorted() === "asc"
                                  ? "text-brand-600 dark:text-brand-400"
                                  : "text-gray-400"
                              }`}
                            />
                            <ChevronDown
                              className={`w-3 h-3 -mt-1 ${
                                header.column.getIsSorted() === "desc"
                                  ? "text-brand-600 dark:text-brand-400"
                                  : "text-gray-400"
                              }`}
                            />
                          </span>
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                >
                  No designations found
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-100 dark:border-gray-700"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={pagination.pageIndex + 1}
        totalItems={totalItems}
        totalPages={totalPages}
        itemsPerPage={pagination.pageSize}
        onPageChange={(page) => {
          setPagination((prev) => ({ ...prev, pageIndex: page - 1 }));
        }}
        onItemsPerPageChange={(size) => {
          // API limit validation: max 100 items per page
          const validSize = Math.min(Math.max(1, size), 100);
          setPagination({ pageIndex: 0, pageSize: validSize });
        }}
      />
    </div>
  );
}
