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
  isToday,
  getMonth,
} from "date-fns";
import { Calendar, Filter, Users, ChevronLeft, ChevronRight, CheckCircle, Clock, AlertCircle } from "lucide-react";

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
  "Sick Leave": {
    bg: "bg-primary-50 dark:bg-primary-500/10",
    text: "text-primary-700 dark:text-primary-400",
    border: "border-primary-200 dark:border-primary-500/30"
  },
  Vacation: {
    bg: "bg-blue-50 dark:bg-blue-500/10",
    text: "text-blue-700 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-500/30"
  },
  "Personal Time": {
    bg: "bg-amber-50 dark:bg-amber-500/10",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-500/30"
  },
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
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-primary-100/50 dark:border-gray-700 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-wrap gap-3 w-full lg:w-auto">
            {/* Department Filter */}
            <div className="relative flex-1 lg:flex-initial min-w-[180px]">
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="w-full appearance-none pl-10 pr-8 py-2.5 border border-primary-200/50 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 dark:focus:border-primary-500 transition-all duration-200 text-sm cursor-pointer"
              >
                {departments.map((d) => (
                  <option key={d} value={d}>{d === "All" ? "All Departments" : d}</option>
                ))}
              </select>
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>

            {/* Leave Status Filter */}
            <div className="relative flex-1 lg:flex-initial min-w-[150px]">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full appearance-none pl-10 pr-8 py-2.5 border border-primary-200/50 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 dark:focus:border-primary-500 transition-all duration-200 text-sm cursor-pointer"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>{s === "All" ? "All Status" : s}</option>
                ))}
              </select>
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>

            {/* Month Filter */}
            <div className="relative flex-1 lg:flex-initial min-w-[200px]">
              <select
                value={currentMonth.getMonth()}
                onChange={(e) => setCurrentMonth(new Date(currentYear, Number(e.target.value)))}
                className="w-full appearance-none pl-10 pr-8 py-2.5 border border-primary-200/50 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 dark:focus:border-primary-500 transition-all duration-200 text-sm cursor-pointer"
              >
                {months.map((m) => (
                  <option key={m.value} value={m.value} disabled={m.value > new Date().getMonth()}>
                    {m.name}
                  </option>
                ))}
              </select>
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>

          {/* Month Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={prevMonth}
              className="p-2 border border-primary-200/50 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 hover:bg-primary-50 dark:hover:bg-primary-500/10 hover:border-primary-300 dark:hover:border-primary-500/50 transition-colors duration-200"
            >
              <ChevronLeft size={18} className="text-gray-700 dark:text-gray-300" />
            </button>
            <div className="px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white min-w-[150px] text-center">
              {format(currentMonth, "MMMM yyyy")}
            </div>
            <button
              onClick={nextMonth}
              className="p-2 border border-primary-200/50 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 hover:bg-primary-50 dark:hover:bg-primary-500/10 hover:border-primary-300 dark:hover:border-primary-500/50 transition-colors duration-200"
            >
              <ChevronRight size={18} className="text-gray-700 dark:text-gray-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-primary-100/50 dark:border-gray-700 shadow-sm p-6">




        {/* Weekdays */}
        <div className="grid grid-cols-7 gap-2 mb-3">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((dayItem, idx) => {
            const leaves = getFilteredLeaves(dayItem);
            const isCurrentMonth = isSameMonth(dayItem, currentMonth);
            const isTodayDate = isToday(dayItem);
            return (
              <div
                key={idx}
                className={`border rounded-xl p-2 h-28 sm:h-32 flex flex-col gap-1 transition-all duration-200 ${
                  isCurrentMonth
                    ? "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-500/50"
                    : "bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700 text-gray-400"
                } ${isTodayDate && isCurrentMonth ? "ring-2 ring-primary-500 ring-offset-2" : ""}`}
              >
                <div
                  className={`text-sm font-semibold ${
                    isTodayDate && isCurrentMonth
                      ? "text-primary-600 dark:text-primary-400"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {format(dayItem, "d")}
                </div>

                {/* Leaves */}
                <div className="flex flex-col gap-1 overflow-y-auto max-h-20 flex-1">
                  {leaves.map((leave) => {
                    const colorConfig = leaveColors[leave.type] || leaveColors["Sick Leave"];
                    const statusIcon = leave.status === "Approved" ? CheckCircle : 
                                     leave.status === "Pending" ? Clock : AlertCircle;
                    const StatusIcon = statusIcon;
                    return (
                      <div
                        key={leave.id}
                        className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${colorConfig.bg} ${colorConfig.text} ${colorConfig.border}`}
                        title={`${leave.name} - ${leave.type} (${leave.status})`}
                      >
                        <div className="flex items-center gap-1 truncate">
                          <StatusIcon size={8} />
                          <span className="truncate">{leave.name}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
