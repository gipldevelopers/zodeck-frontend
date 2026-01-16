'use client';

import React, { useState, useEffect } from "react";
import Breadcrumb from '@/components/common/Breadcrumb';
import { UserCheck, Plus, Search, CheckCircle2, Clock, XCircle, ArrowRight, Eye, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function OnboardingFlowPage() {
  const [onboardingFlows, setOnboardingFlows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchFlows = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setOnboardingFlows([
          { id: 1, companyName: 'Acme Corp', status: 'In Progress', progress: 60, steps: 5, completedSteps: 3, startDate: '2024-01-10' },
          { id: 2, companyName: 'Tech Solutions', status: 'Pending', progress: 0, steps: 5, completedSteps: 0, startDate: '2024-01-15' },
          { id: 3, companyName: 'Global Industries', status: 'Completed', progress: 100, steps: 5, completedSteps: 5, startDate: '2024-01-05' },
        ]);
      } catch (error) {
        console.error("Failed to fetch onboarding flows:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFlows();
  }, []);

  const filteredFlows = onboardingFlows.filter(flow =>
    flow.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed': return <CheckCircle2 size={20} className="text-green-600 dark:text-green-400" />;
      case 'In Progress': return <Clock size={20} className="text-blue-600 dark:text-blue-400" />;
      case 'Pending': return <XCircle size={20} className="text-gray-400" />;
      default: return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'In Progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'Pending': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        <div className="flex items-center justify-between">
          <Breadcrumb 
            items={[
              { label: 'Master Admin', href: '/master-admin/dashboard' },
              { label: 'Onboarding Flow', href: '/master-admin/onboarding-flow' }
            ]}
          />
          <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            <Plus size={20} />
            <span>Create Flow</span>
          </button>
        </div>

        {/* Search */}
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search onboarding flows..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Onboarding Flows Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFlows.length > 0 ? (
              filteredFlows.map((flow) => (
                <div key={flow.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <UserCheck size={20} className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{flow.companyName}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Started: {flow.startDate}</p>
                      </div>
                    </div>
                    {getStatusIcon(flow.status)}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{flow.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            flow.status === 'Completed' 
                              ? 'bg-green-600 dark:bg-green-500' 
                              : 'bg-blue-600 dark:bg-blue-500'
                          }`}
                          style={{ width: `${flow.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        {flow.completedSteps} of {flow.steps} steps completed
                      </span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(flow.status)}`}>
                        {flow.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/master-admin/onboarding-flow/${flow.id}`}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300"
                        title="View Details"
                      >
                        <Eye size={16} />
                        <span>View Details</span>
                      </Link>
                      <Link
                        href={`/master-admin/onboarding-flow/${flow.id}/edit`}
                        className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        title="Edit"
                      >
                        <Pencil size={16} className="text-gray-600 dark:text-gray-400" />
                      </Link>
                      <button
                        className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        title="Delete"
                        onClick={() => {
                          // TODO: Add delete confirmation and API call
                          if (confirm('Are you sure you want to delete this onboarding flow?')) {
                            console.log('Delete flow:', flow.id);
                          }
                        }}
                      >
                        <Trash2 size={16} className="text-red-600 dark:text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
                No onboarding flows found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
