"use client";
import { Calendar, Briefcase } from 'lucide-react';

export default function LeaveWidget({ data }) {
    if (!data) return <div className="animate-pulse h-32 bg-gray-100 rounded-lg"></div>;

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 h-full">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                    <Briefcase size={20} />
                </div>
                <h3 className="font-bold text-gray-800 dark:text-white">Leave Summary</h3>
            </div>

            <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                    {data.balances?.map((leave, idx) => (
                        <div key={idx} className="bg-gray-50 dark:bg-gray-700 p-2 rounded text-center">
                            <span className="block text-xl font-bold text-gray-800 dark:text-white">{leave.balance}</span>
                            <span className="text-[10px] uppercase text-gray-500 font-semibold">{leave.type}</span>
                        </div>
                    ))}
                </div>

                <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                    <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Upcoming Approved</h4>
                    {data.upcomingLeaves?.length > 0 ? (
                        <div className="space-y-2">
                            {data.upcomingLeaves.map((leave, idx) => (
                                <div key={idx} className="flex items-center justify-between text-sm bg-green-50 dark:bg-green-900/20 p-2 rounded border border-green-100 dark:border-green-800">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} className="text-green-600" />
                                        <span className="text-gray-700 dark:text-gray-300">{leave.date}</span>
                                    </div>
                                    <span className="text-xs font-bold text-green-700">{leave.type}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400 italic text-center py-2">No upcoming leaves</p>
                    )}
                </div>
            </div>
        </div>
    );
}
