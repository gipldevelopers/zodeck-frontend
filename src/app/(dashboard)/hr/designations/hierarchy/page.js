// src/app/(dashboard)/hr/designations/hierarchy/page.js
"use client";
import Breadcrumb from '@/components/common/Breadcrumb';
import { Network, TrendingUp, IndianRupee, Clock } from 'lucide-react';

export default function DesignationHierarchyPage() {
  // Mock data for designation hierarchy
  const designationLevels = [
    {
      level: 'L1',
      name: 'Entry Level',
      designations: [
        { title: 'Junior Developer', minSalary: 50000, maxSalary: 70000, avgPromotionTime: '1-2 years' },
        { title: 'HR Assistant', minSalary: 35000, maxSalary: 50000, avgPromotionTime: '1-2 years' },
      ]
    },
    {
      level: 'L2',
      name: 'Individual Contributor',
      designations: [
        { title: 'Software Engineer', minSalary: 70000, maxSalary: 95000, avgPromotionTime: '2-3 years' },
        { title: 'HR Specialist', minSalary: 50000, maxSalary: 65000, avgPromotionTime: '2-3 years' },
      ]
    },
    {
      level: 'L3',
      name: 'Senior Contributor',
      designations: [
        { title: 'Senior Software Engineer', minSalary: 95000, maxSalary: 120000, avgPromotionTime: '3-4 years' },
        { title: 'HR Manager', minSalary: 65000, maxSalary: 85000, avgPromotionTime: '3-4 years' },
      ]
    },
    {
      level: 'L4',
      name: 'Leadership',
      designations: [
        { title: 'Tech Lead', minSalary: 120000, maxSalary: 150000, avgPromotionTime: '4-5 years' },
        { title: 'HR Director', minSalary: 85000, maxSalary: 110000, avgPromotionTime: '4-5 years' },
      ]
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen dark:bg-gray-900 p-4 sm:p-6">
      <Breadcrumb rightContent={null} />

      <div className="bg-white rounded-lg shadow dark:bg-gray-800 p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 mr-3">
            <Network className="text-blue-600 dark:text-blue-400" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Designation Hierarchy
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Career progression paths and compensation structure
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center">
              <TrendingUp size={16} className="text-blue-500 mr-2" />
              <span className="text-gray-600 dark:text-gray-300">Career progression path</span>
            </div>
            {/* <div className="flex items-center">
              <IndianRupee size={16} className="text-green-500 mr-2" />
              <span className="text-gray-600 dark:text-gray-300">Salary range</span>
            </div> */}
            <div className="flex items-center">
              <Clock size={16} className="text-purple-500 mr-2" />
              <span className="text-gray-600 dark:text-gray-300">Average promotion time</span>
            </div>
          </div>
        </div>

        {/* Hierarchy Visualization */}
        <div className="space-y-4">
          {designationLevels.map((level, index) => (
            <div key={level.level} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {level.level} - {level.name}
                  </h3>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Level {parseInt(level.level.substring(1))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {level.designations.map((designation) => (
                  <div key={designation.title} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      {designation.title}
                    </h4>
                    <div className="space-y-2 text-sm">
                      {/* <div className="flex items-center text-green-600 dark:text-green-400">
                        <IndianRupee size={14} className="mr-1" />
                        <span>${designation.minSalary.toLocaleString()} - ${designation.maxSalary.toLocaleString()}</span>
                      </div> */}
                      <div className="flex items-center text-purple-600 dark:text-purple-400">
                        <Clock size={14} className="mr-1" />
                        <span>Promotion: {designation.avgPromotionTime}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Connector line between levels */}
              {index < designationLevels.length - 1 && (
                <div className="flex justify-center mt-4">
                  <div className="h-6 w-0.5 bg-gray-300 dark:bg-gray-600"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Additional Information */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">How to use this hierarchy</h3>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>• Understand career progression paths within your organization</li>
            <li>• Plan employee development and promotion timelines</li>
            <li>• Ensure fair compensation across levels and departments</li>
            <li>• Identify skills needed for advancement to next levels</li>
          </ul>
        </div>
      </div>
    </div>
  );
}