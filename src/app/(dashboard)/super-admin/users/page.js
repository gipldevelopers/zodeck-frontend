// src/app/(dashboard)/super-admin/users/page.js
"use client";
import Breadcrumb from '@/components/common/Breadcrumb';
import UserTable from './components/UserTable';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function UsersPage() {
  return (
    <div className="">
      {/* Breadcrumb with Add User button */}
      <Breadcrumb
        rightContent={
          <Link
            href="/super-admin/users/add"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
          >
            <PlusCircle size={18} /> Add User
          </Link>
        }
      />

      <div className="bg-white rounded-lg shadow dark:bg-gray-800 mt-4">
        <UserTable />
      </div>
    </div>
  );
}