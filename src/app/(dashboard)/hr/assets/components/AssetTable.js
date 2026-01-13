// src/app/(dashboard)/hr/assets/components/AssetTable.js
"use client";
import { useState } from 'react';
import {
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  QrCode,
} from 'lucide-react';
import { useRouter } from "next/navigation";
import CustomDropdown from '../../leave/components/CustomDropdown';

export default function AssetTable({
  assets,
  loading,
  filters,
  onFilterChange,
  onDeleteAsset,
  deletingId,
}) {

  const router = useRouter();

  const handleFilterChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      status: 'all',
      category: 'all',
      condition: 'all',
      search: ''
    });
  };

  const statusColors = {
    available: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    assigned: 'bg-brand-100 text-brand-800 dark:bg-brand-900/30 dark:text-brand-400',
    maintenance: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    retired: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
  };


  const conditionColors = {
    excellent: 'text-green-600 dark:text-green-400',
    good: 'text-brand-600 dark:text-brand-400',
    fair: 'text-yellow-600 dark:text-yellow-400',
    poor: 'text-red-600 dark:text-red-400'
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow dark:bg-gray-800 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow dark:bg-gray-800">
      {/* Filters */}
      <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col gap-4">
          <div className="w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search assets..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 flex-shrink-0 relative">
              <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <CustomDropdown
                value={filters.status}
                onChange={(value) => handleFilterChange('status', value)}
                options={[
                  { value: 'all', label: 'All Status' },
                  { value: 'available', label: 'Available' },
                  { value: 'assigned', label: 'Assigned' },
                  { value: 'maintenance', label: 'Maintenance' },
                  { value: 'retired', label: 'Retired' }
                ]}
                placeholder="All Status"
                className="min-w-[150px]"
              />
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 relative">
              <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <CustomDropdown
                value={filters.category}
                onChange={(value) => handleFilterChange('category', value)}
                options={[
                  { value: 'all', label: 'All Categories' },
                  { value: 'Laptop', label: 'Laptop' },
                  { value: 'Mobile Phone', label: 'Mobile Phone' },
                  { value: 'Tablet', label: 'Tablet' },
                  { value: 'Monitor', label: 'Monitor' },
                  { value: 'Furniture', label: 'Furniture' },
                  { value: 'Accessory', label: 'Accessory' }
                ]}
                placeholder="All Categories"
                className="min-w-[150px]"
              />
            </div>
            <button
              onClick={clearFilters}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600 flex items-center justify-center flex-shrink-0"
            >
              <Filter className="w-4 h-4 mr-2" /> Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-brand-50 to-brand-100/50 dark:from-brand-500/10 dark:to-brand-500/5">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                Asset
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                Serial Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                Condition
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                Current Value
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
            {assets.map((asset) => (
              <tr key={asset.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {asset.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {asset.model}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {asset.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {asset.serialNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[asset.status]}`}>
                    {asset.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <span className={conditionColors[asset.condition]}>
                    {asset.condition}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {asset.currentValue}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">

                    <button
                      onClick={() => router.push(`/hr/assets/view/${asset.id}`)}
                      className="text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => router.push(`/hr/assets/edit/${asset.id}`)}
                      className="text-green-600 hover:text-green-900"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      disabled={deletingId === asset.id}
                      onClick={() => onDeleteAsset(asset.id)}
                      className="disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>

                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700 dark:text-gray-400">
            Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
            <span className="font-medium">{assets.length}</span> results
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600">
              Previous
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}