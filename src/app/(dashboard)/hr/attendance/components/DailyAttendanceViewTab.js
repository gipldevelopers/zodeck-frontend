"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, Users, CheckCircle, XCircle, AlertCircle, Loader2, Timer, Edit } from "lucide-react";
import { attendanceService } from "@/services/hr-services/attendace.service";
import { toast } from "react-hot-toast";
import CorrectAttendanceModal from "./CorrectAttendanceModal";

export default function DailyAttendanceViewTab() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [dailyView, setDailyView] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [isCorrectionModalOpen, setIsCorrectionModalOpen] = useState(false);

  const fetchDailyView = async () => {
    try {
      setLoading(true);
      const response = await attendanceService.getDailyAttendanceView({ date: selectedDate });
      const viewData = response.success ? response.data : response;
      setDailyView(viewData);
    } catch (error) {
      console.error("Error fetching daily attendance view:", error);
      toast.error("Failed to load daily attendance view");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDailyView();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const summary = dailyView?.summary || {};
  const records = dailyView?.records || [];

  const getStatusBadge = (status) => {
    const statusConfig = {
      PRESENT: {
        label: "Present",
        className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      },
      ABSENT: {
        label: "Absent",
        className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      },
      LATE: {
        label: "Late",
        className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      },
      HALF_DAY: {
        label: "Half Day",
        className: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
      },
      EARLY_LEAVE: {
        label: "Early Leave",
        className: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
      },
      HOLIDAY: {
        label: "Holiday",
        className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      },
      WEEKEND: {
        label: "Weekend",
        className: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
      },
    };

    const config = statusConfig[status] || {
      label: status,
      className: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
    };

    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Date Selector */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Select Date:
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Employees</p>
          </div>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {summary.totalEmployees || 0}
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Present</p>
          </div>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {summary.present || 0}
          </p>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 p-4 rounded-xl border border-red-200 dark:border-red-800">
          <div className="flex items-center gap-3 mb-2">
            <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Absent</p>
          </div>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            {summary.absent || 0}
          </p>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 p-4 rounded-xl border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Late</p>
          </div>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {summary.late || 0}
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-xl border border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Early Leave</p>
          </div>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {summary.earlyLeave || 0}
          </p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-4 rounded-xl border border-orange-200 dark:border-orange-800">
          <div className="flex items-center gap-3 mb-2">
            <Timer className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Overtime</p>
          </div>
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {summary.overtime || 0}
          </p>
        </div>
      </div>

      {/* Attendance Records Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Employee
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Department
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Check In
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Check Out
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Total Hours
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Metrics
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {records.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    <Users className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                    <p className="text-sm">No attendance records found for this date</p>
                  </td>
                </tr>
              ) : (
                records.map((record) => (
                  <tr
                    key={record.employee?.id || record.employee?.publicId}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {record.employee?.name || "-"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {record.employee?.employeeId || "-"}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {record.employee?.department || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {record.attendance?.checkIn || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {record.attendance?.checkOut || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {record.metrics?.productionHours && record.metrics.productionHours !== "00:00" 
                        ? record.metrics.productionHours 
                        : "-"}
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge(record.attendance?.status || (record.attendance === null ? "ABSENT" : "PRESENT"))}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1 text-xs">
                        {record.metrics?.late && record.metrics.late !== "--" && (
                          <span className="text-yellow-600 dark:text-yellow-400">
                            Late: {record.metrics.late}
                          </span>
                        )}
                        {record.metrics?.earlyLeave && record.metrics.earlyLeave !== "--" && (
                          <span className="text-purple-600 dark:text-purple-400">
                            Early: {record.metrics.earlyLeave}
                          </span>
                        )}
                        {record.metrics?.overtime && record.metrics.overtime !== "--" && (
                          <span className="text-orange-600 dark:text-orange-400">
                            OT: {record.metrics.overtime}
                          </span>
                        )}
                        {record.metrics?.isCorrected && (
                          <span className="text-blue-600 dark:text-blue-400">Corrected</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => {
                          setSelectedAttendance({ ...record, raw: record });
                          setIsCorrectionModalOpen(true);
                        }}
                        className="p-2 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors dark:bg-orange-900/30 dark:text-orange-400"
                        title="Correct Attendance"
                      >
                        <Edit className="w-4 h-4" />
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
          setSelectedAttendance(null);
        }}
        attendance={selectedAttendance}
        onUpdate={() => {
          fetchDailyView();
          setIsCorrectionModalOpen(false);
          setSelectedAttendance(null);
        }}
      />
    </div>
  );
}
