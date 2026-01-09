"use client";
import React, { useEffect, useState } from "react";
import Breadcrumb from "@/components/common/Breadcrumb";
import { employeeHolidayService } from "@/services/employee/holiday.service";

export default function HolidayPage() {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    const params = {
      year: new Date().getFullYear()
    }
    const fetchHolidays = async () => {
      try {
        setLoading(true);

        const response = await employeeHolidayService.getEmployeeHolidays(params);
        setHolidays(response?.data || response || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHolidays();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-500">
        Error loading holidays: {error}
      </div>
    );
  }

  return (
    <div className="">
      <Breadcrumb
        title="Holiday"
        subtitle={`Check upcoming holidays for ${new Date().getFullYear()}`}
      />

      {/* Table Card */}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow-md rounded-lg mt-6">
        <table className="w-full border border-gray-300 dark:border-gray-700">
          {/* Title Row inside table */}
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th
                colSpan={2}
                className="px-6 py-4 text-lg font-semibold text-gray-900 dark:text-gray-100 text-left border-b border-gray-300 dark:border-gray-600"
              >
                Holiday List – {new Date().getFullYear()}
              </th>
            </tr>
            <tr className="bg-gray-50 dark:bg-gray-700">
              <th className="px-6 py-3 text-sm font-bold text-gray-700 dark:text-gray-300 text-left border border-gray-300 dark:border-gray-600">
                Holiday Date
              </th>
              <th className="px-6 py-3 text-sm font-bold text-gray-700 dark:text-gray-300 text-left border border-gray-300 dark:border-gray-600">
                Holiday Name
              </th>
            </tr>
          </thead>
          <tbody>
            {holidays.length > 0 ? (
              holidays.map((holiday, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-3 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600">
                    {/* Access properties based on API response. Usually it might be holiday_date or date */}
                    {holiday.date ? new Date(holiday.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-') : "N/A"}
                  </td>
                  <td className="px-6 py-3 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600">
                    {/* Access properties based on API response. Usually it might be holiday_name or name or title */}
                    {holiday.name || holiday.title || "N/A"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="px-6 py-3 text-center text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-600">
                  No holidays found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
