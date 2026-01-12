"use client";

import { useState, useEffect } from "react";
import { Settings, Loader2, Plus, Filter, Edit } from "lucide-react";
import { performanceManagementService } from "@/services/hr-services/performance-management.service";
import { toast } from "react-hot-toast";
import CreateCycleModal from "./CreateCycleModal";

export default function AppraisalCyclesTab() {
  const [cycles, setCycles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "all",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCycle, setSelectedCycle] = useState(null);

  useEffect(() => {
    fetchCycles();
  }, [filters]);

  const fetchCycles = async () => {
    try {
      setLoading(true);
      const params = {
        status: filters.status !== "all" ? filters.status : "all",
      };
      const response = await performanceManagementService.getAppraisalCycles(params);
      const data = response.success ? response.data : response.data || [];
      setCycles(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching cycles:", error);
      toast.error(error.message || "Failed to fetch appraisal cycles");
      setCycles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleModalSuccess = () => {
    fetchCycles();
    setIsModalOpen(false);
    setSelectedCycle(null);
  };

  const handleEdit = (cycle) => {
    setSelectedCycle(cycle);
    setIsModalOpen(true);
  };

  const getStatusBadge = (status) => {
    const config = {
      DRAFT: { label: "Draft", className: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400" },
      ACTIVE: { label: "Active", className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
      IN_PROGRESS: { label: "In Progress", className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
      COMPLETED: { label: "Completed", className: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400" },
      CANCELLED: { label: "Cancelled", className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
    };
    const statusConfig = config[status] || config.DRAFT;
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.className}`}>
        {statusConfig.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Filters and Actions */}
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="DRAFT">Draft</option>
              <option value="ACTIVE">Active</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
          <button
            onClick={() => {
              setSelectedCycle(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Cycle
          </button>
        </div>
      </div>

      {/* Cycles Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : cycles.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Cycle Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Period
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Goals
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Reviews
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {cycles.map((cycle) => (
                  <tr key={cycle.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{cycle.name}</p>
                        {cycle.description && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{cycle.description}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                      <div>
                        <p>{new Date(cycle.startDate).toLocaleDateString()}</p>
                        <p className="text-xs text-gray-500">to {new Date(cycle.endDate).toLocaleDateString()}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                      {cycle.goalsCount || 0}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                      {cycle.reviewsCount || 0}
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge(cycle.status)}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleEdit(cycle)}
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Settings className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No appraisal cycles found</p>
          </div>
        )}
      </div>

      {/* Create/Edit Cycle Modal */}
      {isModalOpen && (
        <CreateCycleModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedCycle(null);
          }}
          cycle={selectedCycle}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  );
}
