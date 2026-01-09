// src/app/(dashboard)/hr/departments/add/page.js
"use client";
import Breadcrumb from '@/components/common/Breadcrumb';
import DepartmentForm from '../components/DepartmentForm';

export default function AddDepartmentPage() {
  return (
    <div className="bg-gray-50 min-h-screen dark:bg-gray-900">
      {/* Breadcrumb */}
      <Breadcrumb rightContent={null} />
      
      <div className="bg-white rounded-lg shadow dark:bg-gray-800">
        <DepartmentForm />
      </div>
    </div>
  );
}