import React from "react";
import { Calendar } from 'lucide-react';

const NextHoliday = () => {
  const nextHoliday = {
    name: "New Year's Day",
    date: "January 1, 2025",
    daysLeft: 92,
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-6 h-full flex flex-col">
      <div className="flex items-center mb-4">
        <Calendar className="h-5 w-5 text-blue-500 mr-2" />
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Next Holiday
        </h2>
      </div>

      <div className="flex flex-col justify-between flex-grow">
        <div className="text-center mb-4">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
            <h3 className="text-lg font-bold mb-1">{nextHoliday.name}</h3>
            <p className="text-blue-100 text-sm mb-3">{nextHoliday.date}</p>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm">
              <span className="text-xs font-semibold">In {nextHoliday.daysLeft} days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NextHoliday;