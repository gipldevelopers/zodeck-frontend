"use client";
import Breadcrumb from '@/components/common/Breadcrumb';
import OrganizationChart from '../components/chart/OrganizationChart';
import ChartControls from '../components/chart/ChartControls';
import ChartLegend from '../components/chart/ChartLegend';
import { Network } from 'lucide-react';

export default function OrganizationChartPage() {
  return (
    <div className="bg-gray-50 min-h-screen dark:bg-gray-900">
      <Breadcrumb
        rightContent={null}
      />

      <div className="bg-white rounded-lg shadow dark:bg-gray-800 p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 mr-3">
              <Network className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Organization Chart
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Visualize your company structure and reporting relationships
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <ChartControls />

        {/* Chart Container */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mt-4 min-h-[600px]">
          <OrganizationChart />
        </div>
      </div>
    </div>
  );
}