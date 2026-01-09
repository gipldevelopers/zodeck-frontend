// src/app/(dashboard)/super-admin/users/components/UserTable.js
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
import { ChevronUp, ChevronDown, Edit, Trash2, User, Mail, Shield, Loader2, Key, Eye, UserCheck, UserX, UserCog } from 'lucide-react';
import Pagination from '@/components/common/Pagination';
import UserFilters from './UserFilters';
import { userManagementService } from '@/services/userManagementService';
import { toast } from 'sonner';
import ConfirmationDialog from '@/components/common/ConfirmationDialog';

export default function UserTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
  const [userToDeactivate, setUserToDeactivate] = useState(null);
  const [assignRoleDialogOpen, setAssignRoleDialogOpen] = useState(false);
  const [userToAssignRole, setUserToAssignRole] = useState(null);
  const [selectedRoleForAssign, setSelectedRoleForAssign] = useState('');

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [totalItems, setTotalItems] = useState(0);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [systemRoles, setSystemRoles] = useState([]);

  // Fetch users and roles
  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch users with filters
      const params = {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: globalFilter,
        status: statusFilter !== 'all' ? statusFilter.toUpperCase() : '',
        role: roleFilter !== 'all' ? roleFilter : ''
      };

      const [usersResponse, companyRolesResponse, systemRolesResponse] = await Promise.all([
        userManagementService.getAllUsers(params),
        userManagementService.getCompanyRoles(),
        userManagementService.getSystemRoles()
      ]);

      if (usersResponse.success) {
        const transformedData = usersResponse.data.map(user => ({
          id: user.id,
          publicId: user.publicId,
          name: user.employee
            ? `${user.employee.firstName} ${user.employee.lastName}`
            : user.email.split('@')[0],
          email: user.email,
          employeeId: user.employee?.employeeId || 'N/A',
          systemRole: user.systemRole,
          companyRole: user.companyRole?.displayName || 'No role assigned',
          status: user.isActive ? 'Active' : 'Inactive',
          createdAt: new Date(user.createdAt).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          }),
          isActive: user.isActive,
          hasEmployee: !!user.employee,
          employee: user.employee,
          companyRoleId: user.companyRoleId
        }));

        setData(transformedData);
        setTotalItems(usersResponse.pagination?.totalItems || transformedData.length);
      }

      if (companyRolesResponse.status || companyRolesResponse.success) {
        setAvailableRoles(companyRolesResponse.data?.roles || companyRolesResponse.data || []);
      }

      if (systemRolesResponse.status || systemRolesResponse.success) {
        setSystemRoles(systemRolesResponse.data || []);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error(error.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pagination.pageIndex, pagination.pageSize, globalFilter, statusFilter, roleFilter]);

  // Get unique roles for filter
  const roleOptions = useMemo(() => {
    const roles = ['all'];
    const roleMap = {};

    // Add system roles
    systemRoles.forEach(role => {
      const displayName = role.displayName || role.name;
      if (displayName && !roleMap[displayName]) {
        roleMap[displayName] = true;
        roles.push(displayName);
      }
    });

    // Add company roles
    availableRoles.forEach(role => {
      const displayName = role.displayName || role.name;
      if (displayName && !roleMap[displayName]) {
        roleMap[displayName] = true;
        roles.push(displayName);
      }
    });

    return roles;
  }, [availableRoles, systemRoles]);

  // Handle delete click
  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  // Handle deactivate/activate click
  const handleStatusClick = (user) => {
    setUserToDeactivate(user);
    setDeactivateDialogOpen(true);
  };

  const handleAssignRoleClick = (user) => {
    setUserToAssignRole(user);
    // Determine initial selected value
    // Priority: Company Role -> System Role -> empty
    if (user.companyRoleId) {
      setSelectedRoleForAssign(`company:${user.companyRoleId}`);
    } else if (user.systemRole) {
      setSelectedRoleForAssign(`system:${user.systemRole}`);
    } else {
      setSelectedRoleForAssign('');
    }
    setAssignRoleDialogOpen(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (userToDelete) {
      try {
        await userManagementService.deleteUser(userToDelete.id);
        toast.success('User deleted successfully');
        fetchData(); // Refresh the list
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error(error.message || 'Failed to delete user');
      } finally {
        setDeleteDialogOpen(false);
        setUserToDelete(null);
      }
    }
  };

  // Handle status change confirmation
  const handleStatusConfirm = async () => {
    if (userToDeactivate) {
      try {
        const newStatus = !userToDeactivate.isActive;
        await userManagementService.changeUserStatus(userToDeactivate.id, newStatus);
        toast.success(`User ${newStatus ? 'activated' : 'deactivated'} successfully`);
        fetchData(); // Refresh the list
      } catch (error) {
        console.error('Error changing user status:', error);
        toast.error(error.message || 'Failed to change user status');
      } finally {
        setDeactivateDialogOpen(false);
        setUserToDeactivate(null);
      }
    }
  };

  // Handle validation and submission for Assign Role
  const handleAssignRoleSubmit = async () => {
    if (!userToAssignRole || !selectedRoleForAssign) {
      toast.error("Please select a role");
      return;
    }

    try {
      const [type, roleValue] = selectedRoleForAssign.split(':');

      if (type === 'system') {
        // For system roles, update the user object
        const payload = {
          email: userToAssignRole.email,
          systemRole: roleValue,
          companyRoleId: userToAssignRole.companyRoleId || null,
          employeeId: userToAssignRole.employee?.id || null, // Ensure ID is extracted
          isActive: userToAssignRole.isActive
        };

        await userManagementService.updateUser(userToAssignRole.id, payload);
      } else {
        // For company roles, use Assign Role
        await userManagementService.assignRoleToUser(userToAssignRole.id, {
          companyRoleId: roleValue
        });
      }

      toast.success("Role assigned successfully");
      fetchData();
    } catch (error) {
      console.error("Error assigning role:", error);
      toast.error(error.message || "Failed to assign role");
    } finally {
      setAssignRoleDialogOpen(false);
      setUserToAssignRole(null);
      setSelectedRoleForAssign('');
    }
  };

  // Handle reset password
  const handleResetPassword = async (user) => {
    try {
      const confirmReset = window.confirm(`Reset password for ${user.email}? A temporary password will be generated.`);
      if (!confirmReset) return;

      const response = await userManagementService.resetUserPassword(user.id);
      if (response.success) {
        toast.success('Password reset successful. Temporary password sent to user.');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error(error.message || 'Failed to reset password');
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'User',
        cell: info => (
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <User size={16} />
              </div>
            </div>
            <div className="ml-3">
              <Link
                href={`/super-admin/users/${info.row.original.id}`}
                className="text-sm font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 block"
              >
                {info.getValue()}
              </Link>
              {info.row.original.employeeId !== 'N/A' && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Emp ID: {info.row.original.employeeId}
                </span>
              )}
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: info => (
          <div className="flex items-center">
            <Mail size={14} className="text-gray-400 mr-2" />
            <span className="text-sm text-gray-700 dark:text-gray-300">{info.getValue()}</span>
          </div>
        ),
      },

      {
        accessorKey: 'companyRole',
        header: 'Assigned Role',
        cell: info => {
          const companyRole = info.row.original.companyRole;
          const systemRole = info.row.original.systemRole;

          let roleDisplay = 'No role assigned';
          let isCompanyRole = false;

          // Check for company role first (as it's more specific)
          if (companyRole && companyRole !== 'No role assigned') {
            roleDisplay = companyRole;
            isCompanyRole = true;
          } else if (systemRole) {
            // Fallback to system role
            roleDisplay = systemRole;
          }

          return roleDisplay !== 'No role assigned' ? (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isCompanyRole
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
              }`}>
              {roleDisplay}
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
              {roleDisplay}
            </span>
          );
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: info => {
          const status = info.getValue();
          const isActive = info.row.original.isActive;
          return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isActive
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
              }`}>
              {isActive ? <UserCheck size={12} className="mr-1" /> : <UserX size={12} className="mr-1" />}
              {status}
            </span>
          );
        },
      },

      {
        id: 'actions',
        header: 'Actions',
        cell: info => {
          const user = info.row.original;
          const isCurrentUser = false;

          return (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleAssignRoleClick(user)}
                className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-all duration-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50 group relative"
                title="Assign Role"
              >
                <UserCog className="w-4 h-4" />
                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                  Assign Role
                </span>
              </button>

              <Link
                href={`/super-admin/users/${user.id}`}
                className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all duration-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 group relative"
                title="View Details"
              >
                <Eye className="w-4 h-4" />
                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                  View
                </span>
              </Link>

              <button
                onClick={() => handleResetPassword(user)}
                className="p-1.5 rounded-lg bg-yellow-50 text-yellow-600 hover:bg-yellow-100 transition-all duration-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:hover:bg-yellow-900/50 group relative"
                title="Reset Password"
              >
                <Key className="w-4 h-4" />
                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                  Reset Password
                </span>
              </button>

              <button
                onClick={() => handleStatusClick(user)}
                className={`p-1.5 rounded-lg transition-all duration-200 group relative ${user.isActive
                  ? 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50'
                  : 'bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50'
                  }`}
                title={user.isActive ? 'Deactivate User' : 'Activate User'}
                disabled={isCurrentUser}
              >
                {user.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                  {user.isActive ? 'Deactivate' : 'Activate'}
                </span>
              </button>

              {!isCurrentUser && (
                <button
                  onClick={() => handleDeleteClick(user)}
                  className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 group relative"
                  title="Delete User"
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
    setRoleFilter('all');
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

      {/* Filters Section */}
      <div className="mb-6">
        <UserFilters
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
          statuses={['all', 'Active', 'Inactive']}
          roles={roleOptions}
          onClearFilters={clearFilters}
        />
      </div>

      {/* Results Count */}
      <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Showing {data.length} of {totalItems} users
        {(statusFilter !== 'all' || roleFilter !== 'all' || globalFilter) && (
          <span> (filtered)</span>
        )}
      </div>

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
                        <User className="w-16 h-16 mx-auto" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
                        {loading ? 'Loading users...' : 'No users found'}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-500">
                        {loading ? 'Please wait while we fetch users' : 'Try adjusting your search criteria'}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
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

      {/* Assign Role Dialog */}
      {assignRoleDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Assign Role to {userToAssignRole?.name}
            </h3>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Role
              </label>
              <select
                value={selectedRoleForAssign}
                onChange={(e) => setSelectedRoleForAssign(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Select a role...</option>
                <optgroup label="System Roles">
                  {systemRoles.map(role => (
                    <option key={`system-${role.name}`} value={`system:${role.name}`}>
                      {role.displayName || role.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Company Roles">
                  {availableRoles.map(role => (
                    <option key={`company-${role.id}`} value={`company:${role.id}`}>
                      {role.displayName || role.name}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setAssignRoleDialogOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignRoleSubmit}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Assign Role
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialogs */}
      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete User"
        message={`Are you sure you want to delete "${userToDelete?.name || userToDelete?.email}"? This action cannot be undone.`}
        confirmText="Delete User"
        cancelText="Cancel"
        isDestructive={true}
      />

      <ConfirmationDialog
        isOpen={deactivateDialogOpen}
        onClose={() => setDeactivateDialogOpen(false)}
        onConfirm={handleStatusConfirm}
        title={userToDeactivate?.isActive ? 'Deactivate User' : 'Activate User'}
        message={`Are you sure you want to ${userToDeactivate?.isActive ? 'deactivate' : 'activate'} "${userToDeactivate?.name || userToDeactivate?.email}"?`}
        confirmText={userToDeactivate?.isActive ? 'Deactivate' : 'Activate'}
        cancelText="Cancel"
        isDestructive={userToDeactivate?.isActive}
      />
    </div>
  );
}