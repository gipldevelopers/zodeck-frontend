"use client";

import { useState, useEffect } from "react";
import { Edit, Calendar, Clock, User, FileText, Loader2, Search, Filter, Eye } from "lucide-react";
import { attendanceService } from "@/services/hr-services/attendace.service";
import { toast } from "react-hot-toast";
import Pagination from "@/components/common/Pagination";
import CorrectAttendanceModal from "./CorrectAttendanceModal";

export default function AttendanceCorrectionsTab() {
  const [corrections, setCorrections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedCorrection, setSelectedCorrection] = useState(null);
  const [isCorrectionModalOpen, setIsCorrectionModalOpen] = useState(false);

  useEffect(() => {
    fetchCorrections();
  }, [pagination.pageIndex, pagination.pageSize, startDate, endDate]);

  const fetchCorrections = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      };

      const response = await attendanceService.getAttendanceCorrections(params);
      const correctionsData = response.success
        ? response.data?.corrections || response.data?.data || []
        : response.data?.corrections || response.data?.data || [];
      const paginationInfo = response.pagination || response.data?.pagination || {};

      // Filter by search term if provided
      const filtered = searchTerm
        ? correctionsData.filter((correction) => {
            const empName = `${correction.employee?.firstName || ""} ${correction.employee?.lastName || ""}`.toLowerCase();
            const reason = (correction.reason || "").toLowerCase();
            return empName.includes(searchTerm.toLowerCase()) || reason.includes(searchTerm.toLowerCase());
          })
        : correctionsData;

      setCorrections(Array.isArray(filtered) ? filtered : []);
      setTotalItems(paginationInfo.totalItems || filtered.length || 0);
      setTotalPages(paginationInfo.totalPages || Math.ceil((paginationInfo.totalItems || filtered.length || 0) / pagination.pageSize));
    } catch (error) {
      console.error("Error fetching corrections:", error);
      toast.error("Failed to load attendance corrections");
      setCorrections([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading && corrections.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by employee name or reason..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  fetchCorrections();
                }
              }}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all"
            />
          </div>
        </div>
        <div>
          <input
            type="date"
            placeholder="Start Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all"
          />
        </div>
        <div>
          <input
            type="date"
            placeholder="End Date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all"
          />
        </div>
      </div>

      {/* Corrections Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-brand-50 to-brand-100/50 dark:from-brand-500/10 dark:to-brand-500/5">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Employee
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Original
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Corrected
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Reason
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Corrected At
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {corrections.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    <Edit className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                    <p className="text-sm">No attendance corrections found</p>
                  </td>
                </tr>
              ) : (
                corrections.map((correction) => (
                  <tr key={correction.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {correction.employee?.firstName} {correction.employee?.lastName}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {correction.employee?.employeeId}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {correction.date
                        ? new Date(correction.date).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        <p>Status: {correction.originalStatus || correction.status || "-"}</p>
                        <p>
                          {correction.originalCheckIn && `In: ${correction.originalCheckIn}`}
                          {correction.originalCheckOut && ` Out: ${correction.originalCheckOut}`}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-brand-100 text-brand-800 dark:bg-brand-900/30 dark:text-brand-400">
                          {correction.status || correction.currentStatus}
                        </span>
                        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          {correction.checkIn && <p>In: {correction.checkIn}</p>}
                          {correction.checkOut && <p>Out: {correction.checkOut}</p>}
                          {correction.totalHours && <p>Hours: {correction.totalHours}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="max-w-xs">
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {correction.reason || correction.notes || "-"}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">
                      {correction.updatedAt
                        ? new Date(correction.updatedAt).toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => {
                          setSelectedCorrection(correction);
                          setIsCorrectionModalOpen(true);
                        }}
                        className="p-2 rounded-lg bg-brand-50 text-brand-600 hover:bg-brand-100 transition-colors shadow-sm hover:shadow dark:bg-brand-900/30 dark:text-brand-400"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Correct Attendance Modal */}
      <CorrectAttendanceModal
        isOpen={isCorrectionModalOpen}
        onClose={() => {
          setIsCorrectionModalOpen(false);
          setSelectedCorrection(null);
        }}
        attendance={selectedCorrection}
        onUpdate={() => {
          fetchCorrections();
          setIsCorrectionModalOpen(false);
          setSelectedCorrection(null);
        }}
      />

      {totalPages > 1 && (
        <Pagination
          currentPage={pagination.pageIndex + 1}
          totalItems={totalItems}
          totalPages={totalPages}
          itemsPerPage={pagination.pageSize}
          onPageChange={(page) => {
            setPagination((prev) => ({ ...prev, pageIndex: page - 1 }));
          }}
          onItemsPerPageChange={(size) => {
            const validSize = Math.min(Math.max(1, size), 100);
            setPagination({ pageIndex: 0, pageSize: validSize });
          }}
        />
      )}
    </div>
  );
}
