// src/app/(dashboard)/hr/assets/page.js
"use client";
import { useState, useEffect } from 'react';
import { Plus, Download } from 'lucide-react';
import AssetTable from './components/AssetTable';
import AssetStats from './components/AssetStats';
import Breadcrumb from '@/components/common/Breadcrumb';
import Link from 'next/link';
import { assetService } from '../../../../services/hr-services/asset.service';

export default function AssetInventory() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    condition: 'all',
    search: ''
  });

  useEffect(() => {
    const fetchAssets = async () => {
      setLoading(true);
      try {
        const response = await assetService.getAllAssets();

        // backend → frontend mapping
        const formattedAssets = response.data.assets.map(asset => ({
          id: asset.id,
          name: asset.name,
          category: asset.category,
          serialNumber: asset.serialNumber,
          model: asset.model,
          manufacturer: asset.manufacturer,
          purchaseDate: asset.purchaseDate,
          purchaseCost: asset.purchaseCost,
          currentValue: asset.currentValue,
          status: asset.status.toLowerCase(), // IMPORTANT
          condition: asset.condition.toLowerCase(),
          location: asset.location,
          warrantyExpiry: asset.warrantyExpiry,
          maintenanceSchedule: asset.maintenanceSchedule,
          notes: asset.notes,
          assignedTo: asset.assignedTo,
          createdAt: asset.createdAt,
          updatedAt: asset.updatedAt
        }));

        setAssets(formattedAssets);
      } catch (error) {
        console.error("Fetch assets error:", error.message);
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, []);


  const handleDeleteAsset = async (assetId) => {
  if (!confirm("Are you sure you want to delete this asset?")) return;

  try {
    setDeletingId(assetId);
    await assetService.deleteAsset(assetId);
    setAssets((prev) => prev.filter((a) => a.id !== assetId));
  } catch (err) {
    alert(err.message);
  } finally {
    setDeletingId(null);
  }
};

  const filteredAssets = assets.filter(asset => {
    if (filters.status !== 'all' && asset.status !== filters.status) return false;
    if (filters.category !== 'all' && asset.category !== filters.category) return false;
    if (filters.condition !== 'all' && asset.condition !== filters.condition) return false;
    if (filters.search && !asset.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="bg-gray-50 min-h-screen dark:bg-gray-900 p-4 sm:p-6">
      <Breadcrumb
        rightContent={
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <Link
              href="/hr/assets/add"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
            >
              <Plus size={18} /> Add Asset
            </Link>
            <button className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 transition">
              <Download size={18} /> Export
            </button>
          </div>
        }
      />

      <AssetStats />
      <AssetTable
        assets={filteredAssets}
        loading={loading}
        filters={filters}
        onFilterChange={setFilters}
        onDeleteAsset={handleDeleteAsset}
        deletingId={deletingId}
      />
    </div>
  );
}