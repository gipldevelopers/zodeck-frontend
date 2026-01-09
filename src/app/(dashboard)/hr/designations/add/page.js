"use client";
import Breadcrumb from '@/components/common/Breadcrumb';
import DesignationForm from '../components/DesignationForm';

export default function AddDesignationPage() {
  return (
    <div className="bg-gray-50 min-h-screen dark:bg-gray-900 p-4 sm:p-6">
      {/* Breadcrumb */}
      <Breadcrumb rightContent={null} />

      <div className="bg-white rounded-lg shadow dark:bg-gray-800">
        <DesignationForm />
      </div>
    </div>
  );
}