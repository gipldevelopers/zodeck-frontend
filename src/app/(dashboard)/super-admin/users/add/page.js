// src/app/(dashboard)/super-admin/users/add/page.js
"use client";
import Breadcrumb from '@/components/common/Breadcrumb';
import UserForm from '../components/UserForm';

export default function AddUserPage() {
  return (
    <div className="bg-gray-50 min-h-screen dark:bg-gray-900">
      {/* Breadcrumb */}
      <Breadcrumb 
        items={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Super Admin', href: '/super-admin' },
          { label: 'User Management', href: '/super-admin/users' },
          { label: 'Add User', href: '#' }
        ]}
        rightContent={null} 
      />
      
      <div className="bg-white rounded-lg shadow dark:bg-gray-800 mt-4">
        <UserForm />
      </div>
    </div>
  );
}