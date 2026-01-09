// src/app/(dashboard)/super-admin/roles-permissions/page.js
"use client";
import Breadcrumb from '@/components/common/Breadcrumb';
import RoleTable from './components/RoleTable';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function RolesPermissionsPage() {
  return (
    <div className="">
      {/* Breadcrumb with Add Role button */}
      <Breadcrumb
        rightContent={
          <Link
            href="/super-admin/roles-permissions/add"
            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 transition"
          >
            <PlusCircle size={18} /> Add New Role
          </Link>
        }
      />

      <div className="bg-white rounded-lg shadow dark:bg-gray-800">
        <RoleTable />
      </div>
    </div>
  );
}