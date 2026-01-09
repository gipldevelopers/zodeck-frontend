"use client";
import { Clock, FileText, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function PendingRequestsWidget({ data }) {
    if (!data) return <div className="animate-pulse h-32 bg-gray-100 rounded-lg"></div>;

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 h-full">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                    <Clock size={20} />
                </div>
                <h3 className="font-bold text-gray-800 dark:text-white">Pending Requests</h3>
            </div>

            <div className="space-y-3">
                <Link href="/employee/leave/requests" className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group">
                    <div className="flex items-center gap-3">
                        <FileText size={18} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Leave Requests</span>
                    </div>
                    <div className="flex items-center gap-2">
                        {data.leaveRequests > 0 && (
                            <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-0.5 rounded-full">{data.leaveRequests}</span>
                        )}
                        <ChevronRight size={16} className="text-gray-400" />
                    </div>
                </Link>

                <Link href="/employee/attendance/requests" className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group">
                    <div className="flex items-center gap-3">
                        <Clock size={18} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Attendance Correction</span>
                    </div>
                    <div className="flex items-center gap-2">
                        {data.attendanceRequests > 0 && (
                            <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-0.5 rounded-full">{data.attendanceRequests}</span>
                        )}
                        <ChevronRight size={16} className="text-gray-400" />
                    </div>
                </Link>
            </div>
        </div>
    );
}
