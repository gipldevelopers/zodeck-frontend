// // src/app/(dashboard)/super-admin/users/page.js
// "use client";
// import Breadcrumb from '@/components/common/Breadcrumb';
// import UserTable from './components/UserTable';
// import { PlusCircle } from 'lucide-react';
// import Link from 'next/link';

// export default function UsersPage() {
//   return (
//     <div className="">
//       {/* Breadcrumb with Add User button */}
//       <Breadcrumb
//         rightContent={
//           <Link
//             href="/super-admin/users/add"
//             className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
//           >
//             <PlusCircle size={18} /> Add User
//           </Link>
//         }
//       />

//       <div className="bg-white rounded-lg shadow dark:bg-gray-800 mt-4">
//         <UserTable />
//       </div>
//     </div>
//   );
// }

"use client";
import Breadcrumb from '@/components/common/Breadcrumb';
import UserTable from './components/UserTable';
import { UserPlus, Users } from 'lucide-react';
import Link from 'next/link';

export default function UsersPage() {
  return (
    <div className="min-h-screen space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Breadcrumb />
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mt-2">
            User Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Oversee user accounts, assign roles, and manage access permissions.
          </p>
        </div>

        {/* Primary Action */}
        <Link
          href="/super-admin/users/add"
          className="group inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 hover:scale-105 active:scale-95"
        >
          <UserPlus className="h-4 w-4" />
          <span>Add New User</span>
        </Link>
      </div>

      {/* Info Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900 to-gray-800 p-6 shadow-lg border border-gray-700">
        <div className="absolute top-0 right-0 p-4 opacity-10">
           <Users size={120} className="text-white" />
        </div>
        <div className="relative z-10 text-white">
           <h3 className="text-lg font-semibold">Total Oversight</h3>
           <p className="text-gray-300 text-sm mt-1 max-w-xl">
             Manage both system administrators and company employees from a single view. 
             Use filters to quickly isolate specific roles or status groups.
           </p>
        </div>
      </div>

      {/* Main Content */}
      <UserTable />
    </div>
  );
}