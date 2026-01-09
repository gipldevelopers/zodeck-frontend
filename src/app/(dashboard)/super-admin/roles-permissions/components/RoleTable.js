// src/app/(dashboard)/super-admin/roles-permissions/components/RoleTable.js
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
import { ChevronUp, ChevronDown, Edit, Trash2, Shield, Loader2, Settings } from 'lucide-react';
import Pagination from '@/components/common/Pagination';
import RoleFilters from './RoleFilter';
import { roleService } from '@/services/super-admin-services/user-roleService';
import { toast } from 'sonner';
import ConfirmationDialog from '@/components/common/ConfirmationDialog';

export default function RoleTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [totalItems, setTotalItems] = useState(0);
  const [hoveredRow, setHoveredRow] = useState(null);

  // Fetch roles from API
  const fetchRoles = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: globalFilter,
        roleType: 'all', // matches API requirement
        status: statusFilter !== 'all' ? statusFilter.toUpperCase() : ''
      };

      const response = await roleService.getAllRoles(params);

      // Handle response structure: { status: true, data: { roles: [], pagination: {} } }
      if (response.status || response.success) {
        const rolesData = response.data?.roles || [];
        const paginationData = response.data?.pagination || {};

        const transformedData = rolesData.map(role => ({
          id: role.id,
          name: role.name,
          displayName: role.displayName || role.name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
          createdDate: new Date(role.createdAt).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          }),
          // FIX: Handle both system and company roles
          status: role.isSystem ?
            (role.isEditable === false ? 'System' : 'Active') :
            (role.isActive ? 'Active' : 'Inactive'),
          userCount: role._count?.users || 0,
          description: role.description || '',
          isSystem: role.isSystem || false
        }));

        setData(transformedData);
        setTotalItems(paginationData.total || rolesData.length);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
      toast.error(error.message || 'Failed to fetch roles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, [pagination.pageIndex, pagination.pageSize, globalFilter, statusFilter]);

  // Handle delete click
  const handleDeleteClick = (role) => {
    setRoleToDelete(role);
    setDeleteDialogOpen(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (roleToDelete) {
      try {
        await roleService.deleteRole(roleToDelete.id);
        toast.success('Role deleted successfully');
        fetchRoles(); // Refresh the list
      } catch (error) {
        console.error('Error deleting role:', error);
        toast.error(error.message || 'Failed to delete role');
      } finally {
        setDeleteDialogOpen(false);
        setRoleToDelete(null);
      }
    }
  };

  // Handle delete cancellation
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setRoleToDelete(null);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'displayName',
        header: 'Role Name',
        cell: info => (
          <div>
            <div className="flex items-center">
              <Link
                href={`/super-admin/roles-permissions/${info.row.original.id}`}
                className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 block"
              >
                {info.getValue()}
              </Link>
              {info.row.original.isSystem && (
                <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full dark:bg-blue-900/30 dark:text-blue-300 flex items-center">
                  <Settings className="w-3 h-3 mr-1" /> System
                </span>
              )}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400 block">
              {info.row.original.description}
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'createdDate',
        header: 'Created Date',
        cell: info => <span className="text-sm text-gray-600 dark:text-gray-400">{info.getValue()}</span>,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: info => {
          const status = info.getValue();
          const statusClass = status === 'Active'
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
        accessorKey: 'userCount',
        header: 'Users',
        cell: info => (
          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
            {info.getValue()} users
          </span>
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: info => {
          const role = info.row.original;
          const isSystemRole = role.isSystem;

          return (
            <div className="flex items-center gap-3">
              {/* PERMISSIONS - Always visible */}
              <Link
                href={`/super-admin/roles-permissions/${role.id}/permissions`}
                className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all duration-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 group relative"
                title="Permissions"
              >
                <Shield className="w-4 h-4" />
                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                  Permissions
                </span>
              </Link>

              {/* EDIT - Only for non-system roles */}
              {!isSystemRole && (
                <Link
                  href={`/super-admin/roles-permissions/edit/${role.id}`}
                  className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-all duration-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50 group relative"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                  <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                    Edit
                  </span>
                </Link>
              )}

              {/* DELETE - Only for non-system roles with no users */}
              {!isSystemRole && role.userCount === 0 && (
                <button
                  onClick={() => handleDeleteClick(role)}
                  className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 group relative"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                    Delete
                  </span>
                </button>
              )}
            </div>
          );
        },
        enableSorting: false,
      },
    ],
    []
  );

  // Clear all filters
  const clearFilters = () => {
    setStatusFilter('all');
    setGlobalFilter('');
  };

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
    pageCount: Math.ceil(totalItems / pagination.pageSize),
    manualPagination: true,
  });

  return (
    <div className="p-4 sm:p-6">
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      )}

      {/* Header with Create Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Role Management</h1>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 dark:bg-blue-900/20 dark:border-blue-800">
        <h3 className="font-medium text-blue-800 dark:text-blue-300 flex items-center">
          <Settings className="w-4 h-4 mr-2" /> About System Roles
        </h3>
        <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
          System roles are predefined and essential for HRMS functionality. They cannot be edited or deleted but their permissions can be managed.
        </p>
      </div>

      {/* Filters Section */}
      <div className="mb-6">
        <RoleFilters
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          statuses={['all', 'Active', 'Inactive']}
          onClearFilters={clearFilters}
        />
      </div>

      {/* Results Count */}
      {/* <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Showing {data.length} of {totalItems} roles
        {(statusFilter !== 'all' || globalFilter) && (
          <span> (filtered)</span>
        )}
      </div> */}

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="min-w-[800px] md:min-w-full">
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
                    <div className="flex flex-col items-center justify-center py-8">
                      <div className="text-gray-400 dark:text-gray-500 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
                        {loading ? 'Loading roles...' : 'No roles found'}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-500">
                        {loading ? 'Please wait while we fetch roles' : 'Try adjusting your search criteria or create a new role'}
                      </p>
                    </div>
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

      {/* Confirmation Dialog - MOVED OUTSIDE THE TABLE */}
      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Role"
        message={`Are you sure you want to delete the "${roleToDelete?.displayName}" role?`}
        confirmText="Delete Role"
        cancelText="Cancel"
        isDestructive={true}
      />
    </div>
  );
}