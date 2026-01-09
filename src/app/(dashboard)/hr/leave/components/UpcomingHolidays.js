import React from "react";
import { Calendar } from 'lucide-react';

const UpcomingHolidays = () => {
  const holidays = [
    { id: 1, name: "New Year's Day", date: "January 1, 2025", daysLeft: 92 },
    { id: 2, name: "Republic Day", date: "January 26, 2025", daysLeft: 117 },
    { id: 3, name: "Holi", date: "March 14, 2025", daysLeft: 164 },
    { id: 4, name: "Independence Day", date: "August 15, 2025", daysLeft: 279 },
    { id: 5, name: "Diwali", date: "October 23, 2025", daysLeft: 348 },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-6">
      <div className="flex items-center mb-6">
        <Calendar className="h-5 w-5 text-blue-500 mr-2" />
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Upcoming Holidays
        </h2>
      </div>

      <div className="space-y-4">
        {holidays.map((holiday) => (
          <div key={holiday.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <h3 className="text-sm font-medium text-gray-800 dark:text-white">
                {holiday.name}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                {holiday.date}
              </p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {holiday.daysLeft} days
              </span>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 border border-dashed border-gray-300 dark:border-gray-600 rounded-md hover:border-blue-300 dark:hover:border-blue-600 transition-colors">
        View All Holidays
      </button>
    </div>
  );
};

export default UpcomingHolidays;