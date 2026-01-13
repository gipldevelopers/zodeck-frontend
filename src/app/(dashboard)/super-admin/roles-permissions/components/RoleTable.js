// // src/app/(dashboard)/super-admin/roles-permissions/components/RoleTable.js
// "use client";
// import { useState, useMemo, useEffect } from 'react';
// import Link from 'next/link';
// import {
//   useReactTable,
//   getCoreRowModel,
//   getSortedRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   flexRender,
// } from '@tanstack/react-table';
// import { ChevronUp, ChevronDown, Edit, Trash2, Shield, Loader2, Settings } from 'lucide-react';
// import Pagination from '@/components/common/Pagination';
// import RoleFilters from './RoleFilter';
// import { roleService } from '@/services/super-admin-services/user-roleService';
// import { toast } from 'sonner';
// import ConfirmationDialog from '@/components/common/ConfirmationDialog';

// export default function RoleTable() {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [sorting, setSorting] = useState([]);
//   const [globalFilter, setGlobalFilter] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [roleToDelete, setRoleToDelete] = useState(null);
//   const [pagination, setPagination] = useState({
//     pageIndex: 0,
//     pageSize: 10,
//   });
//   const [totalItems, setTotalItems] = useState(0);
//   const [hoveredRow, setHoveredRow] = useState(null);

//   // Fetch roles from API
//   const fetchRoles = async () => {
//     try {
//       setLoading(true);
//       const params = {
//         page: pagination.pageIndex + 1,
//         limit: pagination.pageSize,
//         search: globalFilter,
//         roleType: 'all', // matches API requirement
//         status: statusFilter !== 'all' ? statusFilter.toUpperCase() : ''
//       };

//       const response = await roleService.getAllRoles(params);

//       // Handle response structure: { status: true, data: { roles: [], pagination: {} } }
//       if (response.status || response.success) {
//         const rolesData = response.data?.roles || [];
//         const paginationData = response.data?.pagination || {};

//         const transformedData = rolesData.map(role => ({
//           id: role.id,
//           name: role.name,
//           displayName: role.displayName || role.name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
//           createdDate: new Date(role.createdAt).toLocaleDateString('en-GB', {
//             day: '2-digit',
//             month: 'short',
//             year: 'numeric'
//           }),
//           // FIX: Handle both system and company roles
//           status: role.isSystem ?
//             (role.isEditable === false ? 'System' : 'Active') :
//             (role.isActive ? 'Active' : 'Inactive'),
//           userCount: role._count?.users || 0,
//           description: role.description || '',
//           isSystem: role.isSystem || false
//         }));

//         setData(transformedData);
//         setTotalItems(paginationData.total || rolesData.length);
//       }
//     } catch (error) {
//       console.error('Error fetching roles:', error);
//       toast.error(error.message || 'Failed to fetch roles');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRoles();
//   }, [pagination.pageIndex, pagination.pageSize, globalFilter, statusFilter]);

//   // Handle delete click
//   const handleDeleteClick = (role) => {
//     setRoleToDelete(role);
//     setDeleteDialogOpen(true);
//   };

//   // Handle delete confirmation
//   const handleDeleteConfirm = async () => {
//     if (roleToDelete) {
//       try {
//         await roleService.deleteRole(roleToDelete.id);
//         toast.success('Role deleted successfully');
//         fetchRoles(); // Refresh the list
//       } catch (error) {
//         console.error('Error deleting role:', error);
//         toast.error(error.message || 'Failed to delete role');
//       } finally {
//         setDeleteDialogOpen(false);
//         setRoleToDelete(null);
//       }
//     }
//   };

//   // Handle delete cancellation
//   const handleDeleteCancel = () => {
//     setDeleteDialogOpen(false);
//     setRoleToDelete(null);
//   };

//   const columns = useMemo(
//     () => [
//       {
//         accessorKey: 'displayName',
//         header: 'Role Name',
//         cell: info => (
//           <div>
//             <div className="flex items-center">
//               <Link
//                 href={`/super-admin/roles-permissions/${info.row.original.id}`}
//                 className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 block"
//               >
//                 {info.getValue()}
//               </Link>
//               {info.row.original.isSystem && (
//                 <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full dark:bg-blue-900/30 dark:text-blue-300 flex items-center">
//                   <Settings className="w-3 h-3 mr-1" /> System
//                 </span>
//               )}
//             </div>
//             <span className="text-sm text-gray-600 dark:text-gray-400 block">
//               {info.row.original.description}
//             </span>
//           </div>
//         ),
//       },
//       {
//         accessorKey: 'createdDate',
//         header: 'Created Date',
//         cell: info => <span className="text-sm text-gray-600 dark:text-gray-400">{info.getValue()}</span>,
//       },
//       {
//         accessorKey: 'status',
//         header: 'Status',
//         cell: info => {
//           const status = info.getValue();
//           const statusClass = status === 'Active'
//             ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
//             : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
//           return (
//             <span className={`px-2.5 py-0.5 rounded-xs text-xs font-medium ${statusClass}`}>
//               {status}
//             </span>
//           );
//         },
//       },
//       {
//         accessorKey: 'userCount',
//         header: 'Users',
//         cell: info => (
//           <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
//             {info.getValue()} users
//           </span>
//         ),
//       },
//       {
//         id: 'actions',
//         header: 'Actions',
//         cell: info => {
//           const role = info.row.original;
//           const isSystemRole = role.isSystem;

//           return (
//             <div className="flex items-center gap-3">
//               {/* PERMISSIONS - Always visible */}
//               <Link
//                 href={`/super-admin/roles-permissions/${role.id}/permissions`}
//                 className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all duration-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 group relative"
//                 title="Permissions"
//               >
//                 <Shield className="w-4 h-4" />
//                 <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
//                   Permissions
//                 </span>
//               </Link>

//               {/* EDIT - Only for non-system roles */}
//               {!isSystemRole && (
//                 <Link
//                   href={`/super-admin/roles-permissions/edit/${role.id}`}
//                   className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-all duration-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50 group relative"
//                   title="Edit"
//                 >
//                   <Edit className="w-4 h-4" />
//                   <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
//                     Edit
//                   </span>
//                 </Link>
//               )}

//               {/* DELETE - Only for non-system roles with no users */}
//               {!isSystemRole && role.userCount === 0 && (
//                 <button
//                   onClick={() => handleDeleteClick(role)}
//                   className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 group relative"
//                   title="Delete"
//                 >
//                   <Trash2 className="w-4 h-4" />
//                   <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
//                     Delete
//                   </span>
//                 </button>
//               )}
//             </div>
//           );
//         },
//         enableSorting: false,
//       },
//     ],
//     []
//   );

//   // Clear all filters
//   const clearFilters = () => {
//     setStatusFilter('all');
//     setGlobalFilter('');
//   };

//   const table = useReactTable({
//     data,
//     columns,
//     state: {
//       sorting,
//       globalFilter,
//       pagination,
//     },
//     onSortingChange: setSorting,
//     onGlobalFilterChange: setGlobalFilter,
//     onPaginationChange: setPagination,
//     getCoreRowModel: getCoreRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     pageCount: Math.ceil(totalItems / pagination.pageSize),
//     manualPagination: true,
//   });

//   return (
//     <div className="p-4 sm:p-6">
//       {loading && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
//         </div>
//       )}

//       {/* Header with Create Button */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Role Management</h1>
//       </div>

//       {/* Info Box */}
//       <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 dark:bg-blue-900/20 dark:border-blue-800">
//         <h3 className="font-medium text-blue-800 dark:text-blue-300 flex items-center">
//           <Settings className="w-4 h-4 mr-2" /> About System Roles
//         </h3>
//         <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
//           System roles are predefined and essential for HRMS functionality. They cannot be edited or deleted but their permissions can be managed.
//         </p>
//       </div>

//       {/* Filters Section */}
//       <div className="mb-6">
//         <RoleFilters
//           globalFilter={globalFilter}
//           setGlobalFilter={setGlobalFilter}
//           statusFilter={statusFilter}
//           setStatusFilter={setStatusFilter}
//           statuses={['all', 'Active', 'Inactive']}
//           onClearFilters={clearFilters}
//         />
//       </div>

//       {/* Results Count */}
//       {/* <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
//         Showing {data.length} of {totalItems} roles
//         {(statusFilter !== 'all' || globalFilter) && (
//           <span> (filtered)</span>
//         )}
//       </div> */}

//       {/* Table */}
//       <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
//         <div className="min-w-[800px] md:min-w-full">
//           <table className="w-full">
//             <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
//               {table.getHeaderGroups().map(headerGroup => (
//                 <tr key={headerGroup.id} className="border-b border-gray-200 dark:border-gray-700">
//                   {headerGroup.headers.map(header => (
//                     <th
//                       key={header.id}
//                       className="px-3 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider dark:text-gray-300"
//                       {...(header.column.getCanSort() ? {
//                         onClick: header.column.getToggleSortingHandler(),
//                         className: "px-3 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider cursor-pointer dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-150"
//                       } : {})}
//                     >
//                       <div className="flex items-center">
//                         {flexRender(header.column.columnDef.header, header.getContext())}
//                         {header.column.getCanSort() && (
//                           <>
//                             {{
//                               asc: <ChevronUp className="ml-1 w-4 h-4 text-blue-500" />,
//                               desc: <ChevronDown className="ml-1 w-4 h-4 text-blue-500" />,
//                             }[header.column.getIsSorted()] ?? (
//                                 <div className="ml-1 flex flex-col">
//                                   <ChevronUp className="w-3 h-3 -mb-0.5 text-gray-400" />
//                                   <ChevronDown className="w-3 h-3 -mt-0.5 text-gray-400" />
//                                 </div>
//                               )}
//                           </>
//                         )}
//                       </div>
//                     </th>
//                   ))}
//                 </tr>
//               ))}
//             </thead>
//             <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
//               {table.getRowModel().rows.length > 0 ? (
//                 table.getRowModel().rows.map(row => (
//                   <tr
//                     key={row.id}
//                     className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-150"
//                     onMouseEnter={() => setHoveredRow(row.id)}
//                     onMouseLeave={() => setHoveredRow(null)}
//                   >
//                     {row.getVisibleCells().map(cell => (
//                       <td key={cell.id} className="px-3 py-4 whitespace-nowrap">
//                         {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                       </td>
//                     ))}
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan={columns.length} className="px-3 py-8 text-center text-gray-500 dark:text-gray-400">
//                     <div className="flex flex-col items-center justify-center py-8">
//                       <div className="text-gray-400 dark:text-gray-500 mb-4">
//                         <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                         </svg>
//                       </div>
//                       <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
//                         {loading ? 'Loading roles...' : 'No roles found'}
//                       </h3>
//                       <p className="text-gray-500 dark:text-gray-500">
//                         {loading ? 'Please wait while we fetch roles' : 'Try adjusting your search criteria or create a new role'}
//                       </p>
//                     </div>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Pagination Component */}
//       <Pagination
//         currentPage={table.getState().pagination.pageIndex + 1}
//         totalItems={totalItems}
//         itemsPerPage={table.getState().pagination.pageSize}
//         onPageChange={(page) => table.setPageIndex(page - 1)}
//         onItemsPerPageChange={(size) => {
//           table.setPageSize(size);
//           table.setPageIndex(0);
//         }}
//         className="mt-6"
//       />

//       {/* Confirmation Dialog - MOVED OUTSIDE THE TABLE */}
//       <ConfirmationDialog
//         isOpen={deleteDialogOpen}
//         onClose={handleDeleteCancel}
//         onConfirm={handleDeleteConfirm}
//         title="Delete Role"
//         message={`Are you sure you want to delete the "${roleToDelete?.displayName}" role?`}
//         confirmText="Delete Role"
//         cancelText="Cancel"
//         isDestructive={true}
//       />
//     </div>
//   );
// }

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
import { 
  ChevronUp, ChevronDown, Edit, Trash2, Shield, Loader2, 
  Settings, Users, Lock, MoreHorizontal, LayoutGrid, 
  Search
} from 'lucide-react';
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

  // Fetch roles from API (Logic preserved exactly)
  const fetchRoles = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: globalFilter,
        roleType: 'all',
        status: statusFilter !== 'all' ? statusFilter.toUpperCase() : ''
      };

      const response = await roleService.getAllRoles(params);

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

  // Handlers (Preserved)
  const handleDeleteClick = (role) => {
    setRoleToDelete(role);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (roleToDelete) {
      try {
        await roleService.deleteRole(roleToDelete.id);
        toast.success('Role deleted successfully');
        fetchRoles();
      } catch (error) {
        console.error('Error deleting role:', error);
        toast.error(error.message || 'Failed to delete role');
      } finally {
        setDeleteDialogOpen(false);
        setRoleToDelete(null);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setRoleToDelete(null);
  };

  const clearFilters = () => {
    setStatusFilter('all');
    setGlobalFilter('');
  };

  // --- UI Column Definitions ---
  const columns = useMemo(
    () => [
      {
        accessorKey: 'displayName',
        header: 'Role Detail',
        cell: info => {
            const isSystem = info.row.original.isSystem;
            return (
              <div className="flex items-start gap-4">
                {/* Visual Icon for Role Type */}
                <div className={`
                  flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border
                  ${isSystem 
                    ? 'bg-purple-50 border-purple-100 text-purple-600 dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-300' 
                    : 'bg-white border-gray-200 text-gray-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400'}
                `}>
                  {isSystem ? <Lock size={18} /> : <LayoutGrid size={18} />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/super-admin/roles-permissions/${info.row.original.id}`}
                      className="font-semibold text-gray-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400 transition-colors"
                    >
                      {info.getValue()}
                    </Link>
                    {isSystem && (
                      <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10 dark:bg-purple-400/10 dark:text-purple-400 dark:ring-purple-400/30">
                        System
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1 max-w-xs">
                    {info.row.original.description || "No description provided"}
                  </p>
                </div>
              </div>
            );
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: info => {
          const status = info.getValue();
          const isActive = status === 'Active';
          return (
            <div className="flex items-center gap-2">
              <span className={`relative flex h-2.5 w-2.5`}>
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isActive ? 'bg-green-400' : 'bg-gray-400'}`}></span>
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isActive ? 'bg-green-500' : 'bg-gray-500'}`}></span>
              </span>
              <span className={`text-sm font-medium ${isActive ? 'text-green-700 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                {status}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: 'userCount',
        header: 'Assigned Users',
        cell: info => (
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
             <div className="flex -space-x-2 overflow-hidden">
                {/* Mock avatars for visual flair, logically represented by the count */}
                <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-gray-800 bg-gray-200 flex items-center justify-center text-[10px] font-bold">
                    <Users size={12}/>
                </div>
             </div>
             <span className="text-sm font-medium">{info.getValue()} Users</span>
          </div>
        ),
      },
      {
        accessorKey: 'createdDate',
        header: 'Created On',
        cell: info => <span className="text-sm text-gray-500 font-medium font-mono">{info.getValue()}</span>,
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: info => {
          const role = info.row.original;
          const isSystemRole = role.isSystem;

          return (
            <div className="flex items-center gap-2 justify-end">
              {/* Manage Permissions */}
              <Link
                href={`/super-admin/roles-permissions/${role.id}/permissions`}
                className="group flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-800 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 transition-all"
                title="Manage Permissions"
              >
                <Shield size={16} />
              </Link>

              {/* Edit Role */}
              {!isSystemRole && (
                <Link
                  href={`/super-admin/roles-permissions/edit/${role.id}`}
                  className="group flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:border-amber-200 hover:bg-amber-50 hover:text-amber-600 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-amber-800 dark:hover:bg-amber-900/30 dark:hover:text-amber-400 transition-all"
                  title="Edit Role"
                >
                  <Edit size={16} />
                </Link>
              )}

              {/* Delete Role */}
              {!isSystemRole && role.userCount === 0 ? (
                <button
                  onClick={() => handleDeleteClick(role)}
                  className="group flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-red-800 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-all"
                  title="Delete Role"
                >
                  <Trash2 size={16} />
                </button>
              ) : !isSystemRole ? (
                 <div className="h-8 w-8" /> // Spacer
              ) : null}
            </div>
          );
        },
        enableSorting: false,
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter, pagination },
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
    <div className="space-y-6">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-2xl flex flex-col items-center">
             <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-2" />
             <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Updating...</span>
          </div>
        </div>
      )}

      {/* Filters */}
      <RoleFilters
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        statuses={['all', 'Active', 'Inactive']}
        onClearFilters={clearFilters}
      />

      {/* Table Container */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-xl shadow-gray-200/50 dark:shadow-none overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50 dark:bg-gray-900/50">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      className="px-6 py-5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={`flex items-center gap-2 ${header.column.getCanSort() ? 'cursor-pointer select-none group' : ''}`}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getCanSort() && (
                            <div className="flex flex-col opacity-0 group-hover:opacity-100 transition-opacity">
                               <ChevronUp size={10} className={header.column.getIsSorted() === 'asc' ? 'text-blue-600' : 'text-gray-300'} />
                               <ChevronDown size={10} className={header.column.getIsSorted() === 'desc' ? 'text-blue-600' : 'text-gray-300'} />
                            </div>
                          )}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map(row => (
                  <tr
                    key={row.id}
                    className="group hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors duration-200"
                  >
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-6 py-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="h-16 w-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                        <Search className="h-6 w-6 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">No roles found</h3>
                      <p className="text-gray-500 dark:text-gray-400 mt-1 max-w-sm">
                         We couldn't find any roles matching your current filters. Try adjusting your search criteria.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Footer Pagination Area */}
        <div className="border-t border-gray-100 dark:border-gray-700 p-4 bg-gray-50/30 dark:bg-gray-900/30">
           <Pagination
             currentPage={table.getState().pagination.pageIndex + 1}
             totalItems={totalItems}
             itemsPerPage={table.getState().pagination.pageSize}
             onPageChange={(page) => table.setPageIndex(page - 1)}
             onItemsPerPageChange={(size) => {
               table.setPageSize(size);
               table.setPageIndex(0);
             }}
           />
        </div>
      </div>

      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Role"
        message={`Are you sure you want to delete the "${roleToDelete?.displayName}" role? This action cannot be undone.`}
        confirmText="Yes, Delete it"
        cancelText="Cancel"
        isDestructive={true}
      />
    </div>
  );
}