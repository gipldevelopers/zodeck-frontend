// // src\app\(dashboard)\super-admin\roles-permissions\add\page.js
// "use client";
// import Breadcrumb from '@/components/common/Breadcrumb';
// import RoleForm from '../components/RoleForm';

// export default function AddRolePage() {
//   return (
//     <div className="bg-gray-50 min-h-screen dark:bg-gray-900">
//       {/* Breadcrumb */}
//       <Breadcrumb 
//         items={[
//           { label: 'Dashboard', href: '/dashboard' },
//           { label: 'Super Admin', href: '/super-admin' },
//           { label: 'Roles & Permissions', href: '/super-admin/roles-permissions' },
//           { label: 'Add Role', href: '#' }
//         ]}
//         rightContent={null} 
//       />
      
//       <div className="bg-white rounded-lg shadow dark:bg-gray-800 mt-4">
//         <RoleForm />
//       </div>
//     </div>
//   );
// }

"use client";
import Breadcrumb from '@/components/common/Breadcrumb';
import RoleForm from '../components/RoleForm';
import { ShieldPlus } from 'lucide-react';

export default function AddRolePage() {
  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 pb-12 relative">
      {/* Background Decor */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-gray-900 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem] dark:bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Breadcrumb 
            items={[
              { label: 'Super Admin', href: '/super-admin' },
              { label: 'Roles & Permissions', href: '/super-admin/roles-permissions' },
              { label: 'New Role', href: '#' }
            ]}
          />
          <div className="mt-4 flex items-center gap-3">
            <div className="p-3 bg-blue-600 rounded-xl shadow-lg shadow-blue-600/20">
              <ShieldPlus className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                Define New Role
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Create a new functional role and assign granular permissions in the next step.
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <RoleForm />
      </div>
    </div>
  );
}