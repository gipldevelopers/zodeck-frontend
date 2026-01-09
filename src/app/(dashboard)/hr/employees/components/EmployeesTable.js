// src\app\(dashboard)\hr\employees\components\EmployeesTable.js
"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { ChevronUp, ChevronDown, Eye, Edit, Trash2 } from "lucide-react";
import Pagination from "@/components/common/Pagination";
import EmployeeFilters from "./EmployeeFilters";
import employeeService from "@/services/hr-services/employeeService"; // adjust path

export default function EmployeeTable() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [designationFilter, setDesignationFilter] = useState("all");

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // =============================
  // FETCH EMPLOYEES
  // =============================
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await employeeService.getAllEmployees({
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
        });

        const formattedData = response.data.map(emp => ({
          id: emp.employeeId,
          name: `${emp.firstName} ${emp.lastName}`,
          email: emp.email,
          phone: emp.phone || "-",
          designation: emp.designation?.name || "-",
          joiningDate: emp.joiningDate
            ? new Date(emp.joiningDate).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
            : "-",
          status:
            emp.status === "ACTIVE"
              ? "Active"
              : emp.status === "ON_LEAVE"
                ? "On Leave"
                : "Inactive",
          image: emp.profileImage || "/images/users/default-avatar.png",
          raw: emp, // keep full object for actions
        }));

        setData(formattedData);
      } catch (error) {
        console.error("Failed to fetch employees:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [pagination.pageIndex, pagination.pageSize]);

  // =============================
  // COLUMNS
  // =============================
  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "Emp ID",
        cell: info => (
          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
            {info.getValue()}
          </span>
        ),
      },
      {
        accessorKey: "name",
        header: "Name",
        cell: info => (
          <div className="flex items-center">
            <img
              src={info.row.original.image}
              alt={info.getValue()}
              className="w-8 h-8 rounded-full mr-3 object-cover"
            />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {info.getValue()}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "phone",
        header: "Phone",
      },
      {
        accessorKey: "designation",
        header: "Designation",
      },
      {
        accessorKey: "joiningDate",
        header: "Joining Date",
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: info => {
          const status = info.getValue();
          const styles =
            status === "Active"
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
              : status === "On Leave"
                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";

          return (
            <span className={`px-2.5 py-0.5 rounded-xs text-xs font-medium ${styles}`}>
              {status}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        enableSorting: false,
        cell: info => (
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleView(info.row.original.raw)}
              className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleEdit(info.row.original.raw)}
              className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(info.row.original.raw)}
              className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  // =============================
  // FILTERED DATA
  // =============================
  const filteredData = useMemo(() => {
    let result = [...data];

    if (globalFilter) {
      const term = globalFilter.toLowerCase();
      result = result.filter(emp =>
        emp.name.toLowerCase().includes(term) ||
        emp.email.toLowerCase().includes(term) ||
        emp.id.toLowerCase().includes(term)
      );
    }

    if (statusFilter !== "all") {
      result = result.filter(emp => emp.status === statusFilter);
    }

    if (designationFilter !== "all") {
      result = result.filter(emp => emp.designation === designationFilter);
    }

    return result;
  }, [data, globalFilter, statusFilter, designationFilter]);

  // =============================
  // TABLE
  // =============================
  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // =============================
  // FILTER OPTIONS
  // =============================
  const statuses = useMemo(() => {
    return ["all", ...new Set(data.map(emp => emp.status))];
  }, [data]);

  const designations = useMemo(() => {
    return ["all", ...new Set(data.map(emp => emp.designation))];
  }, [data]);

  const clearFilters = () => {
    setGlobalFilter("");
    setStatusFilter("all");
    setDesignationFilter("all");
  };

  // =============================
  // ACTION HANDLERS
  // =============================
  const handleView = emp => {
    router.push(`/hr/employees/${emp.id}`);
  };

  const handleEdit = emp => {
    router.push(`/hr/employees/edit/${emp.id}`);
  };
  const handleDelete = async (employee) => {
    const confirmDelete = confirm(
      `Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`
    );

    if (!confirmDelete) return;

    try {
      await employeeService.deleteEmployee(employee.id); // numeric DB id
      // Remove from UI immediately
      setData(prev =>
        prev.filter(item => item.raw.id !== employee.id)
      );
      alert("Employee deleted successfully");
      // refresh the page
      window.location.reload();
    } catch (error) {
      console.error("Delete failed:", error.message);
      alert(error.message || "Failed to delete employee");
    }
  };


  // =============================
  // UI
  // =============================
  if (loading) {
    return <div className="p-6 text-gray-500">Loading employees...</div>;
  }

  return (
    <div className="p-3 sm:p-6">
      <EmployeeFilters
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        designationFilter={designationFilter}
        setDesignationFilter={setDesignationFilter}
        statuses={statuses}
        designations={designations}
        onClearFilters={clearFilters}
      />

      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 mt-6">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900">
            {table.getHeaderGroups().map(hg => (
              <tr key={hg.id}>
                {hg.headers.map(header => (
                  <th key={header.id} className="px-3 py-3 text-left text-sm font-semibold">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-3 py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={pagination.pageIndex + 1}
        totalItems={filteredData.length}
        itemsPerPage={pagination.pageSize}
        onPageChange={page => table.setPageIndex(page - 1)}
        onItemsPerPageChange={size => {
          table.setPageSize(size);
          table.setPageIndex(0);
        }}
        className="mt-6"
      />
    </div>
  );
}
