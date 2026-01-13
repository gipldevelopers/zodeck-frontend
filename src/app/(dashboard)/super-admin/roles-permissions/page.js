// // src/app/(dashboard)/super-admin/roles-permissions/page.js
// "use client";
// import Breadcrumb from '@/components/common/Breadcrumb';
// import RoleTable from './components/RoleTable';
// import { PlusCircle } from 'lucide-react';
// import Link from 'next/link';

// export default function RolesPermissionsPage() {
//   return (
//     <div className="">
//       {/* Breadcrumb with Add Role button */}
//       <Breadcrumb
//         rightContent={
//           <Link
//             href="/super-admin/roles-permissions/add"
//             className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 transition"
//           >
//             <PlusCircle size={18} /> Add New Role
//           </Link>
//         }
//       />

//       <div className="bg-white rounded-lg shadow dark:bg-gray-800">
//         <RoleTable />
//       </div>
//     </div>
//   );
// }

"use client";
import Breadcrumb from '@/components/common/Breadcrumb';
import RoleTable from './components/RoleTable';
import { Plus, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function RolesPermissionsPage() {
  return (
    <div className="min-h-screen space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Breadcrumb />
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mt-2">
            Roles & Permissions
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage system access, define user roles, and configure granular permissions.
          </p>
        </div>

        {/* Primary Action */}
        <Link
          href="/super-admin/roles-permissions/add"
          className="group inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-gray-900/20 transition-all hover:bg-blue-600 hover:scale-105 hover:shadow-blue-600/30 dark:bg-white dark:text-gray-900 dark:hover:bg-blue-500 dark:hover:text-white"
        >
          <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
          <span>Create New Role</span>
        </Link>
      </div>

      {/* Info Banner - Styled Modern */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 shadow-lg">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10 blur-xl"></div>
        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-24 w-24 rounded-full bg-black/10 blur-xl"></div>
        <div className="relative flex items-start gap-4 text-white">
          <div className="rounded-lg bg-white/20 p-2 backdrop-blur-sm">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-lg">System Integrity</h3>
            <p className="mt-1 text-blue-100 text-sm max-w-2xl">
              System roles (Admin, Manager) are protected to ensure platform stability. 
              You can modify their permissions, but they cannot be deleted or renamed.
            </p>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <RoleTable />
    </div>
  );
}