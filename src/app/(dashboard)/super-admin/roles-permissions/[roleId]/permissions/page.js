// src/app/(dashboard)/super-admin/roles-permissions/[roleId]/permissions/page.js
"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Breadcrumb from '@/components/common/Breadcrumb';
import PermissionManager from "../../components/PermissionManager";
import RoleHeader from "../../components/RoleHeader";
import roleService from "@/services/super-admin-services/user-roleService";
import { toast } from "sonner";

export default function RolePermissionsPage() {
  const params = useParams();
  const router = useRouter();
  const [role, setRole] = useState(null);
  const [isSystemRole, setIsSystemRole] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const response = await roleService.getRoleById(params.roleId);
        if (response.status || response.success) {
          const roleData = response.data;

          // Determine if this is a system role
          const systemRole = roleData.isSystem === true || roleData.isEditable !== undefined;
          setIsSystemRole(systemRole);

          let status = 'Active';

          // Check if it's a system role
          if (systemRole) {
            // System role - use isEditable to determine status
            status = roleData.isEditable === false ? 'System' : 'Active';
          } else {
            // Company role - has status field
            if (roleData.status) {
              status = roleData.status.charAt(0) + roleData.status.slice(1).toLowerCase();
            } else {
              // Fallback to isActive
              status = roleData.isActive ? 'Active' : 'Inactive';
            }
          }

          setRole({
            ...roleData,
            createdDate: new Date(roleData.createdAt).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            }),
            status: status
          });
        }
      } catch (error) {
        console.error("Error fetching role:", error);
        toast.error(error.message || 'Failed to fetch role');
        router.push('/super-admin/roles-permissions');
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, [params.roleId, router]);

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen dark:bg-gray-900 p-4 sm:p-6">
        <Breadcrumb rightContent={null} />
        <div className="animate-pulse bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-8"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen dark:bg-gray-900">
      <Breadcrumb
        items={[
          { label: "Roles & Permissions", href: "/super-admin/roles-permissions" },
          { label: role?.name || "Role", href: `/super-admin/roles-permissions/${params.roleId}` },
          { label: "Permissions" }
        ]}
      />

      <div className="space-y-6">
        {/* Role Header */}
        <div className="bg-white rounded-lg shadow dark:bg-gray-800">
          <RoleHeader role={role} loading={loading} />
        </div>

        {/* Permission Manager (Editable) */}
        <div className="bg-white rounded-lg shadow dark:bg-gray-800">
          <PermissionManager
            roleId={params.roleId}
            roleName={role?.name}
            isSystem={isSystemRole}
          />
        </div>
      </div>
    </div>
  );
}