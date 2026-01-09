"use client";

import { useState, useMemo } from "react";
import {
  addDays,
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  getMonth,
} from "date-fns";

// Dummy team leave data
const dummyLeaves = [
  { id: "L-001", name: "Alice", department: "HR", type: "Sick Leave", status: "Approved", start: "2025-09-03", end: "2025-09-04" },
  { id: "L-002", name: "Bob", department: "IT", type: "Vacation", status: "Pending", start: "2025-09-10", end: "2025-09-12" },
  { id: "L-003", name: "Charlie", department: "Finance", type: "Personal Time", status: "Rejected", start: "2025-09-15", end: "2025-09-15" },
  { id: "L-004", name: "David", department: "HR", type: "Sick Leave", status: "Approved", start: "2025-09-18", end: "2025-09-19" },
  { id: "L-005", name: "Eva", department: "IT", type: "Vacation", status: "Pending", start: "2025-09-22", end: "2025-09-24" },
  { id: "L-006", name: "Frank", department: "Finance", type: "Personal Time", status: "Approved", start: "2025-09-26", end: "2025-09-26" },
];

// Months array
const months = [
  { name: "January", value: 0 }, { name: "February", value: 1 }, { name: "March", value: 2 },
  { name: "April", value: 3 }, { name: "May", value: 4 }, { name: "June", value: 5 },
  { name: "July", value: 6 }, { name: "August", value: 7 }, { name: "September", value: 8 },
  { name: "October", value: 9 }, { name: "November", value: 10 }, { name: "December", value: 11 },
];

const leaveColors = {
  "Sick Leave": "bg-green-200 text-green-800",
  Vacation: "bg-blue-200 text-blue-800",
  "Personal Time": "bg-yellow-200 text-yellow-800",
};

export default function TeamCalendar({ selectedMonth }) {
  const today = new Date();
  const currentMonthValue = today.getMonth();
  const currentYear = today.getFullYear();

  const [currentMonth, setCurrentMonth] = useState(new Date(selectedMonth));
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Navigation handlers
  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));

  const startMonth = startOfMonth(currentMonth);
  const endMonth = endOfMonth(currentMonth);
  const startDate = startOfWeek(startMonth);
  const endDate = endOfWeek(endMonth);

  const calendarDays = [];
  let day = startDate;
  while (day <= endDate) {
    calendarDays.push(day);
    day = addDays(day, 1);
  }

  const getFilteredLeaves = (day) => {
    return dummyLeaves.filter((leave) => {
      const withinDay = new Date(leave.start) <= day && day <= new Date(leave.end);
      const departmentMatch = departmentFilter === "All" || leave.department === departmentFilter;
      const statusMatch = statusFilter === "All" || leave.status === statusFilter;
      return withinDay && departmentMatch && statusMatch;
    });
  };

  // Unique departments for filter
  const departments = ["All", ...Array.from(new Set(dummyLeaves.map((l) => l.department)))];
  const statuses = ["All", "Approved", "Pending", "Rejected"];

  return (
    <div>
{/* Filters */}
<div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-end justify-between flex-wrap">
  
  {/* Department Filter */}
  <div className="flex flex-col flex-1 min-w-[180px]">
    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department / Team / Employee</label>
    <select
      value={departmentFilter}
      onChange={(e) => setDepartmentFilter(e.target.value)}
      className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
    >
      {departments.map((d) => (
        <option key={d} value={d}>{d}</option>
      ))}
    </select>
  </div>

  {/* Leave Status Filter */}
  <div className="flex flex-col flex-1 min-w-[150px]">
    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Leave Status</label>
    <select
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
      className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
    >
      {statuses.map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  </div>

  {/* Month Filter */}
  <div className="flex flex-col flex-1 min-w-[200px]">
    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Month</label>
    <select
      value={currentMonth.getMonth()}
      onChange={(e) => setCurrentMonth(new Date(currentYear, Number(e.target.value)))}
      className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
    >
      {months.map((m) => (
        <option key={m.value} value={m.value} disabled={m.value > new Date().getMonth()}>
          {m.name}
        </option>
      ))}
    </select>
  </div>
</div>




      {/* Weekdays */}
      <div className="grid grid-cols-7 gap-2 text-center font-semibold text-gray-700 dark:text-gray-300 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((dayItem, idx) => {
          const leaves = getFilteredLeaves(dayItem);
          return (
            <div
              key={idx}
              className={`border border-gray-200 dark:border-gray-600 p-2 h-28 flex flex-col gap-1 rounded-lg shadow-sm ${
                isSameMonth(dayItem, currentMonth)
                  ? "bg-white dark:bg-gray-800"
                  : "bg-gray-100 dark:bg-gray-800/50"
              }`}
            >
              <div
                className={`text-sm font-medium ${
                  isSameDay(dayItem, today)
                    ? "bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {format(dayItem, "d")}
              </div>

              {/* Leaves */}
              <div className="flex flex-col gap-1 overflow-y-auto max-h-20">
                {leaves.map((leave) => (
                  <div
                    key={leave.id}
                    className={`text-xs font-semibold px-1 rounded ${leaveColors[leave.type]}`}
                    title={`${leave.name} - ${leave.type}`}
                  >
                    {leave.name} ({leave.type})
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
