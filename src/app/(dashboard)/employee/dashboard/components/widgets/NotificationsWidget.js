"use client";
import { Bell, CheckCircle, Info } from 'lucide-react';

export default function NotificationsWidget({ data }) {
    if (!data) return <div className="animate-pulse h-32 bg-gray-100 rounded-lg"></div>;

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 h-full">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                    <Bell size={20} />
                </div>
                <h3 className="font-bold text-gray-800 dark:text-white">Notifications</h3>
            </div>

            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {data.length > 0 ? (
                    data.map((notif, idx) => (
                        <div key={idx} className="flex gap-3 hover:bg-gray-50 p-2 rounded transition-colors">
                            <div className="mt-1 flex-shrink-0">
                                {notif.type === 'announcement' ? (
                                    <Info size={16} className="text-blue-500" />
                                ) : (
                                    <CheckCircle size={16} className="text-green-500" />
                                )}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-800 dark:text-white">{notif.title}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{notif.message}</p>
                                <span className="text-[10px] text-gray-400 mt-1 block">{notif.time}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-gray-400 text-sm italic">
                        No new notifications.
                    </div>
                )}
            </div>
        </div>
    );
}
