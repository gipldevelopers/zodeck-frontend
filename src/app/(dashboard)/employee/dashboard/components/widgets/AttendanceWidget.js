"use client";
import { Clock, AlertCircle, CheckCircle } from 'lucide-react';

export default function AttendanceWidget({ data }) {
    if (!data) return <div className="animate-pulse h-32 bg-gray-100 rounded-lg"></div>;

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 h-full">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <Clock size={20} />
                </div>
                <h3 className="font-bold text-gray-800 dark:text-white">Attendance Status</h3>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Today's Punch</span>
                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${data.punchStatus === 'Checked In' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {data.punchStatus || 'Not Punched'}
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Working Hours</span>
                    <span className="font-mono font-bold text-gray-800 dark:text-white">{data.workingHours || '00:00'}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-700">
                    <span className="text-sm text-gray-500">Status</span>
                    <div className="flex items-center gap-1">
                        {data.status === 'On Time' ? <CheckCircle size={14} className="text-green-500" /> : <AlertCircle size={14} className="text-orange-500" />}
                        <span className={`text-sm font-medium ${data.status === 'On Time' ? 'text-green-600' : 'text-orange-600'}`}>{data.status}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
