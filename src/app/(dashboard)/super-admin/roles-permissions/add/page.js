// src\app\(dashboard)\super-admin\roles-permissions\add\page.js
"use client";
import Breadcrumb from '@/components/common/Breadcrumb';
import RoleForm from '../components/RoleForm';

export default function AddRolePage() {
  return (
    <div className="bg-gray-50 min-h-screen dark:bg-gray-900">
      {/* Breadcrumb */}
      <Breadcrumb 
        items={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Super Admin', href: '/super-admin' },
          { label: 'Roles & Permissions', href: '/super-admin/roles-permissions' },
          { label: 'Add Role', href: '#' }
        ]}
        rightContent={null} 
      />
      
      <div className="bg-white rounded-lg shadow dark:bg-gray-800 mt-4">
        <RoleForm />
      </div>
    </div>
  );
}