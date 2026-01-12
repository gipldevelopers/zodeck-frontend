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
import employeeService from "@/services/hr-services/employeeService";
import { departmentService } from "@/services/hr-services/departmentService";
import { designationService } from "@/services/hr-services/designationService";

export default function EmployeeTable() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [designationOptions, setDesignationOptions] = useState([]);

  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [designationFilter, setDesignationFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Fetch departments and designations for filter dropdowns
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [deptsResponse, designationsResponse] = await Promise.all([
          departmentService.getAllDepartments(),
          designationService.getAllDesignations()
        ]);
        
        const departments = deptsResponse.data?.departments || deptsResponse.data || [];
        const designations = designationsResponse.data?.designations || designationsResponse.data || [];
        
        setDepartmentOptions(departments);
        setDesignationOptions(designations);
      } catch (error) {
        console.error("Failed to fetch dropdown data:", error);
      }
    };
    fetchDropdownData();
  }, []);

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
        setLoading(true);
        // Build query parameters according to API
        // Find department ID if department name is selected
        let departmentId = "";
        if (departmentFilter !== "all") {
          const dept = departmentOptions.find(d => d.name === departmentFilter || d.id?.toString() === departmentFilter);
          departmentId = dept?.id?.toString() || departmentFilter;
        }

        // Find designation ID if designation name is selected
        let designationId = "";
        if (designationFilter !== "all") {
          const desig = designationOptions.find(d => d.name === designationFilter || d.id?.toString() === designationFilter);
          designationId = desig?.id?.toString() || designationFilter;
        }

        const params = {
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
          search: globalFilter || "",
          status: statusFilter !== "all" ? statusFilter : "all",
          department: departmentId,
          designation: designationId,
        };

        const response = await employeeService.getAllEmployees(params);
        
        // Handle API response structure: { success: true, data: [...], pagination: {...} }
        const employees = response.success ? (response.data || []) : (response.data?.employees || response.data || []);
        const paginationInfo = response.pagination || response.data?.pagination || {};

        const formattedData = employees.map(emp => ({
          id: emp.employeeId, // Use employeeId for display (string like "EMP20260005")
          name: `${emp.firstName} ${emp.lastName}`,
          email: emp.email,
          phone: emp.phone || "-",
          department: emp.department?.name || "-",
          designation: emp.designation?.name || "-",
          joiningDate: emp.joiningDate
            ? new Date(emp.joiningDate).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
            : "-",
          status: emp.status || "ACTIVE", // Keep API status value
          image: emp.profileImage || "/images/users/default-avatar.png",
          raw: emp, // keep full object for actions (includes numeric id for delete operations)
        }));

        setData(formattedData);
        setTotalItems(paginationInfo.totalItems || paginationInfo.total || employees.length);
        setTotalPages(paginationInfo.totalPages || Math.ceil((paginationInfo.totalItems || paginationInfo.total || employees.length) / (paginationInfo.itemsPerPage || pagination.pageSize)));
      } catch (error) {
        console.error("Failed to fetch employees:", error.message);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [pagination.pageIndex, pagination.pageSize, globalFilter, statusFilter, designationFilter, departmentFilter, departmentOptions, designationOptions]);

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
        accessorKey: "department",
        header: "Department",
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: info => {
          const status = info.getValue();
          // Map API status values to display labels
          const statusMap = {
            ACTIVE: { label: "Active", style: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
            PROBATION: { label: "Probation", style: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
            NOTICE_PERIOD: { label: "Notice Period", style: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" },
            RESIGNED: { label: "Resigned", style: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400" },
            TERMINATED: { label: "Terminated", style: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
            SUSPENDED: { label: "Suspended", style: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
            RETIRED: { label: "Retired", style: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400" },
          };

          const statusInfo = statusMap[status] || { label: status, style: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400" };

          return (
            <span className={`px-2.5 py-0.5 rounded-xs text-xs font-medium ${statusInfo.style}`}>
              {statusInfo.label}
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

  // Use data directly since filtering is done on backend
  const filteredData = data;

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
  // Status options from API (static list)
  const statuses = useMemo(() => {
    const apiStatuses = ["ACTIVE", "PROBATION", "NOTICE_PERIOD", "RESIGNED", "TERMINATED", "SUSPENDED", "RETIRED"];
    return ["all", ...apiStatuses];
  }, []);

  const designations = useMemo(() => {
    // Use designation options from API for filter dropdown
    return ["all", ...designationOptions.map(desig => desig.name)];
  }, [designationOptions]);

  const departments = useMemo(() => {
    // Use department options from API for filter dropdown
    return ["all", ...departmentOptions.map(dept => dept.name)];
  }, [departmentOptions]);

  const clearFilters = () => {
    setGlobalFilter("");
    setStatusFilter("all");
    setDesignationFilter("all");
    setDepartmentFilter("all");
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  };

  // =============================
  // ACTION HANDLERS
  // =============================
  const handleView = emp => {
    const employee = emp.raw || emp;
    // Use numeric id for routing (API uses numeric id in routes)
    router.push(`/hr/employees/${employee.id}`);
  };

  const handleEdit = emp => {
    const employee = emp.raw || emp;
    // Use numeric id for routing (API uses numeric id in routes)
    router.push(`/hr/employees/edit/${employee.id}`);
  };
  const handleDelete = async (employee) => {
    const emp = employee.raw || employee;
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${emp.firstName} ${emp.lastName}?`
    );

    if (!confirmDelete) return;

    try {
      // Use the numeric DB id from raw object (response has both id and employeeId)
      const employeeId = emp.id; // numeric id from API
      await employeeService.deleteEmployee(employeeId);
      
      // Remove from UI immediately
      setData(prev =>
        prev.filter(item => {
          const itemEmp = item.raw || item;
          return itemEmp.id !== employeeId;
        })
      );
      alert("Employee deleted successfully");
      
      // Refresh data to get updated list
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
        departmentFilter={departmentFilter}
        setDepartmentFilter={setDepartmentFilter}
        statuses={statuses}
        designations={designations}
        departments={departments}
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
        totalItems={totalItems}
        totalPages={totalPages}
        itemsPerPage={pagination.pageSize}
        onPageChange={page => {
          setPagination(prev => ({ ...prev, pageIndex: page - 1 }));
        }}
        onItemsPerPageChange={size => {
          setPagination({ pageIndex: 0, pageSize: size });
        }}
        className="mt-6"
      />
    </div>
  );
}
