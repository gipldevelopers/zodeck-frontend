// src/app/(dashboard)/hr/designations/components/DesignationTable.js
"use client";
import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import { ChevronUp, ChevronDown, Eye, Edit, Trash2, Users, Loader2 } from 'lucide-react';
import Pagination from '@/components/common/Pagination';
import DesignationFilters from './DesignationFilters';
import { designationService } from '@/services/hr-services/designationService';
import { toast } from 'sonner';
import ConfirmationDialog from '@/components/common/ConfirmationDialog';

export default function DesignationTable() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [hoveredRow, setHoveredRow] = useState(null);
  const [hoveredAction, setHoveredAction] = useState(null);
  const [totalItems, setTotalItems] = useState(0);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [designationToDelete, setDesignationToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch designations from API
  const fetchDesignations = async () => {
    try {
      setIsLoading(true);
      const params = {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: globalFilter,
        status: statusFilter !== 'all' ? statusFilter : '',
        department: departmentFilter !== 'all' ? departmentFilter : ''
      };
      
      const response = await designationService.getAllDesignations(params);
      setData(response.data || []);
      setTotalItems(response.pagination?.totalItems || 0);
    } catch (error) {
      console.error('Error fetching designations:', error);
      toast.error(error.message || 'Failed to fetch designations');
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDesignations();
  }, [pagination.pageIndex, pagination.pageSize, globalFilter, statusFilter, departmentFilter, levelFilter]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: '#',
        cell: info => <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{info.row.index + 1 + (pagination.pageIndex * pagination.pageSize)}</span>,
      },
      {
        accessorKey: 'name',
        header: 'Designation Name',
        cell: info => (
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {info.getValue()}
          </span>
        ),
      },
      {
        accessorKey: 'level',
        header: 'Level',
        cell: info => (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
            {info.getValue()}
          </span>
        ),
      },
      {
        accessorKey: 'department',
        header: 'Department',
        cell: info => (
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {info.row.original.department?.name || info.row.original.department}
          </span>
        ),
      },
      {
        accessorKey: 'experience',
        header: 'Experience (Yrs)',
        cell: info => (
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {info.row.original.minExperience || 0} - {info.row.original.maxExperience || 0}
          </span>
        ),
      },
      {
        accessorKey: 'employeeCount',
        header: 'Employees',
        cell: info => (
          <div className="flex items-center">
            <Users size={14} className="text-blue-600 dark:text-blue-400 mr-1" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              {info.getValue()}
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: info => {
          const status = info.getValue();
          const statusClass = status === 'ACTIVE' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
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
            <Link
              href={`/hr/designations/view/${info.row.original.id}`}
              className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all duration-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 group relative"
              title="View"
            >
              <Eye className="w-4 h-4" />
              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                View
              </span>
            </Link>
            
            <Link
              href={`/hr/designations/edit/${info.row.original.id}`}
              className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-all duration-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50 group relative"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                Edit
              </span>
            </Link>
            
            <button
              onMouseEnter={() => setHoveredAction(`${info.row.id}-delete`)}
              onMouseLeave={() => setHoveredAction(null)}
              onClick={() => handleDeleteClick(info.row.original)}
              className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 group relative"
              title="Delete"
              disabled={isDeleting}
            >
              {isDeleting && designationToDelete?.id === info.row.original.id ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                Delete
              </span>
            </button>
          </div>
        ),
        enableSorting: false,
      },
    ],
    [pagination.pageIndex, pagination.pageSize, isDeleting, designationToDelete]
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
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(totalItems / pagination.pageSize),
  });

  // Get unique values for filter dropdowns
  const statuses = useMemo(() => {
    return ['all', 'ACTIVE', 'INACTIVE'];
  }, []);

  const levels = useMemo(() => {
    return ['all', 'L1', 'L2', 'L3', 'L4', 'L5', 'L6'];
  }, []);

  // Clear all filters
  const clearFilters = () => {
    setStatusFilter('all');
    setDepartmentFilter('all');
    setLevelFilter('all');
    setGlobalFilter('');
    table.setPageIndex(0);
  };

  // Handle delete designation - Open confirmation dialog
  const handleDeleteClick = (designation) => {
    setDesignationToDelete(designation);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!designationToDelete) return;

    setIsDeleting(true);
    try {
      await designationService.deleteDesignation(designationToDelete.id);
      toast.success('Designation deleted successfully');
      fetchDesignations(); // Refresh the data
    } catch (error) {
      console.error('Error deleting designation:', error);
      toast.error(error.message || 'Failed to delete designation');
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setDesignationToDelete(null);
    }
  };

  // Handle search with debounce
  const handleSearch = (value) => {
    setGlobalFilter(value);
    table.setPageIndex(0);
  };

  if (isLoading && data.length === 0) {
    return (
      <div className="p-4 sm:p-6">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <span className="ml-2 text-gray-600 dark:text-gray-400">Loading designations...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      {/* Filters Section */}
      <div className="mb-6">
        <DesignationFilters
          globalFilter={globalFilter}
          setGlobalFilter={handleSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          departmentFilter={departmentFilter}
          setDepartmentFilter={setDepartmentFilter}
          levelFilter={levelFilter}
          setLevelFilter={setLevelFilter}
          statuses={statuses}
          levels={levels}
          onClearFilters={clearFilters}
        />
      </div>

      {/* Results Count */}
      {/* <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Showing {data.length} of {totalItems} designations
        {(statusFilter !== 'all' || departmentFilter !== 'all' || levelFilter !== 'all' || globalFilter) && (
          <span> (filtered)</span>
        )}
      </div> */}

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="min-w-[1000px] md:min-w-full">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} className="border-b border-gray-200 dark:border-gray-700">
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      className="px-3 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider dark:text-gray-300"
                      {...(header.column.getCanSort() ? {
                        onClick: header.column.getToggleSortingHandler(),
                        className: "px-3 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider cursor-pointer dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-150"
                      } : {})}
                    >
                      <div className="flex items-center">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && (
                          <>
                            {{
                              asc: <ChevronUp className="ml-1 w-4 h-4 text-blue-500" />,
                              desc: <ChevronDown className="ml-1 w-4 h-4 text-blue-500" />,
                            }[header.column.getIsSorted()] ?? (
                              <div className="ml-1 flex flex-col">
                                <ChevronUp className="w-3 h-3 -mb-0.5 text-gray-400" />
                                <ChevronDown className="w-3 h-3 -mt-0.5 text-gray-400" />
                              </div>
                            )}
                          </>
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
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-150"
                    onMouseEnter={() => setHoveredRow(row.id)}
                    onMouseLeave={() => setHoveredRow(null)}
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
                    {globalFilter || statusFilter !== 'all' || departmentFilter !== 'all' || levelFilter !== 'all'
                      ? 'No designations found matching your filters.' 
                      : 'No designations found.'
                    }
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Component */}
      <Pagination
        currentPage={table.getState().pagination.pageIndex + 1}
        totalItems={totalItems}
        itemsPerPage={table.getState().pagination.pageSize}
        onPageChange={(page) => table.setPageIndex(page - 1)}
        onItemsPerPageChange={(size) => {
          table.setPageSize(size);
          table.setPageIndex(0);
        }}
        className="mt-6"
      />

      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setDesignationToDelete(null);
        }}
        onConfirm={handleDelete}
        title="Delete Designation"
        message={
          designationToDelete 
            ? `Are you sure you want to delete the "${designationToDelete.name}" designation?`
            : "Are you sure you want to delete this designation?"
        }
        confirmText={isDeleting ? "Deleting..." : "Delete Designation"}
        cancelText="Cancel"
        isDestructive={true}
        closeOnConfirm={false}
      />
    </div>
  );
}