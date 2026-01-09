// src/app/(dashboard)/hr/payroll/salary-structure/components/SalaryStructureTable.js
"use client";
import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from '@tanstack/react-table';
import { ChevronUp, ChevronDown, Eye, Edit, Trash2, IndianRupee } from 'lucide-react';
import Pagination from '@/components/common/Pagination';
import SalaryStructureFilters from './SalaryStructureFilters';
import { payrollService } from '../../../../../../services/hr-services/payroll.service';
import { departmentService } from '../../../../../../services/hr-services/departmentService';

export default function SalaryStructureTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [totalItems, setTotalItems] = useState(0);
  const [departments, setDepartments] = useState(['all']);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await departmentService.getAllDepartments();
        if (response.data) {
          const names = response.data.map(d => d.name);
          setDepartments(['all', ...names]);
        }
      } catch (err) {
        console.error('Error fetching departments:', err);
      }
    };
    fetchDepartments();
  }, []);

  useEffect(() => {
    const fetchSalaryStructures = async () => {
      try {
        setLoading(true);
        const response = await payrollService.getAllSalaryStructures({
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
          search: globalFilter,
          status: statusFilter !== 'all' ? statusFilter : '',
          department: departmentFilter !== 'all' ? departmentFilter : ''
        });
        setData(response.data.salaryStructures || []);
        setTotalItems(response.data.pagination?.totalItems || 0);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching salary structures:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSalaryStructures();
  }, [pagination.pageIndex, pagination.pageSize, globalFilter, statusFilter, departmentFilter]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        cell: info => <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{info.row.original.publicId}</span>,
      },
      {
        accessorKey: 'employee',
        header: 'Employee',
        cell: info => (
          <div className="text-left">
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {info.row.original.employee?.firstName} {info.row.original.employee?.lastName}
            </span>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {info.row.original.employee?.employeeId}
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'designation',
        header: 'Designation',
        cell: info => (
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {info.row.original.employee?.designation?.name || '-'}
          </span>
        ),
      },
      {
        accessorKey: 'department',
        header: 'Department',
        cell: info => (
          <span className="text-sm text-gray-600 dark:text-gray-400 text-left block">
            {info.row.original.employee?.department?.name || '-'}
          </span>
        ),
      },
      {
        accessorKey: 'basicSalary',
        header: 'Basic',
        cell: info => (
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {payrollService.formatCurrency(info.getValue())}
          </span>
        ),
      },
      {
        accessorKey: 'totalCTC',
        header: 'Total CTC',
        cell: info => (
          <span className="text-sm font-bold text-green-600 dark:text-green-400">
            {payrollService.formatCurrency(info.getValue())}
          </span>
        ),
      },
      {
        accessorKey: 'effectiveDate',
        header: 'Effective Date',
        cell: info => (
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {payrollService.formatDate(info.getValue())}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: info => {
          const status = info.getValue()?.toUpperCase();
          let statusClass = '';
          if (status === 'ACTIVE') {
            statusClass = 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
          } else {
            statusClass = 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
          }
          return (
            <span className={`px-2.5 py-0.5 rounded-xs text-xs font-medium ${statusClass}`}>
              {status}
            </span>
          );
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: info => (
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleView(info.row.original)}
              className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all duration-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleEdit(info.row.original)}
              className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-all duration-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(info.row.original)}
              className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ),
        enableSorting: false,
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      pagination,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(totalItems / pagination.pageSize),
  });

  const statuses = ['all', 'ACTIVE', 'INACTIVE'];

  const router = useRouter();

  const clearFilters = () => {
    setStatusFilter('all');
    setDepartmentFilter('all');
    setGlobalFilter('');
  };

  const handleView = (structure) => {
    router.push(`/hr/payroll/salary-structure/edit/${structure.id}`); // For now, view is edit
  };

  const handleEdit = (structure) => {
    router.push(`/hr/payroll/salary-structure/edit/${structure.id}`);
  };

  const handleDelete = async (structure) => {
    if (confirm(`Are you sure you want to delete ${structure.employee?.firstName}'s salary structure?`)) {
      try {
        await payrollService.deleteSalaryStructure(structure.id);
        setData(data.filter(item => item.id !== structure.id));
        setTotalItems(prev => prev - 1);
        alert('Salary structure deleted successfully!');
      } catch (err) {
        console.error('Error deleting salary structure:', err);
        alert('Failed to delete salary structure: ' + err.message);
      }
    }
  };

  if (loading && data.length === 0) {
    return (
      <div className="p-4 sm:p-6 text-center">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6 animate-pulse"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 text-center">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 sm:gap-0">
        <div className="text-left">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Salary Structures</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage employee salary components and structures
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg dark:bg-blue-900/30 dark:text-blue-400 w-full sm:w-auto justify-center">
          <IndianRupee size={18} />
          <span className="font-medium">
            Total Items: {totalItems}
          </span>
        </div>
      </div>

      <div className="mb-6">
        <SalaryStructureFilters
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          departmentFilter={departmentFilter}
          setDepartmentFilter={setDepartmentFilter}
          statuses={statuses}
          departments={departments}
          onClearFilters={clearFilters}
        />
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-left">
          {error}
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm relative">
        <div className="min-w-[1000px]">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} className="border-b border-gray-200 dark:border-gray-700">
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      className="px-3 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider dark:text-gray-300"
                    >
                      <div className="flex items-center">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && (
                          <div
                            className="ml-1 cursor-pointer"
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {{
                              asc: <ChevronUp className="w-4 h-4 text-blue-500" />,
                              desc: <ChevronDown className="w-4 h-4 text-blue-500" />,
                            }[header.column.getIsSorted()] ?? (
                                <div className="flex flex-col">
                                  <ChevronUp className="w-3 h-3 -mb-0.5 text-gray-400" />
                                  <ChevronDown className="w-3 h-3 -mt-0.5 text-gray-400" />
                                </div>
                              )}
                          </div>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map(row => (
                  <tr
                    key={row.id}
                    className={`hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-150 ${loading ? 'opacity-50' : ''}`}
                  >
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-3 py-4 whitespace-nowrap">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-3 py-8 text-center text-gray-500 dark:text-gray-400">
                    No salary structures found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {loading && data.length > 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/20 dark:bg-black/20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>

      <Pagination
        currentPage={pagination.pageIndex + 1}
        totalItems={totalItems}
        itemsPerPage={pagination.pageSize}
        onPageChange={(page) => setPagination(prev => ({ ...prev, pageIndex: page - 1 }))}
        onItemsPerPageChange={(size) => setPagination({ pageIndex: 0, pageSize: size })}
        className="mt-6"
      />
    </div>
  );
}
