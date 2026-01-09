"use client";

import React, { useState, useMemo } from "react";
import Breadcrumb from "@/components/common/Breadcrumb";

import {
  addDays,
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
} from "date-fns";

export default function AttendanceCalendar() {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const years = [currentYear, currentYear - 1, currentYear - 2];
  const months = [
    { name: "January", value: 0 },
    { name: "February", value: 1 },
    { name: "March", value: 2 },
    { name: "April", value: 3 },
    { name: "May", value: 4 },
    { name: "June", value: 5 },
    { name: "July", value: 6 },
    { name: "August", value: 7 },
    { name: "September", value: 8 },
    { name: "October", value: 9 },
    { name: "November", value: 10 },
    { name: "December", value: 11 },
  ];

  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  // Dummy attendance data with punch in/out & total hours
  const attendanceData = useMemo(
    () => ({
      [`${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-01`]: {
        status: "OnTime",
        punchIn: "09:00 AM",
        punchOut: "06:00 PM",
        total: "9h 0m",
      },
      [`${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-02`]: {
        status: "Late",
        punchIn: "09:45 AM",
        punchOut: "06:00 PM",
        total: "8h 15m",
      },
      [`${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-03`]: {
        status: "Absent",
        punchIn: "--",
        punchOut: "--",
        total: "--",
      },
      [`${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-04`]: {
        status: "OnTime",
        punchIn: "09:05 AM",
        punchOut: "06:00 PM",
        total: "8h 55m",
      },
      [`${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-05`]: {
        status: "WFH",
        punchIn: "09:00 AM",
        punchOut: "06:00 PM",
        total: "9h 0m",
      },
      // ... add more days as needed
    }),
    [currentMonth, currentYear]
  );

  const statusColors = {
    OnTime: "bg-green-200 text-green-800",
    Late: "bg-orange-200 text-orange-800",
    Absent: "bg-red-200 text-red-800",
    WFH: "bg-blue-200 text-blue-800",
    SickLeave: "bg-yellow-200 text-yellow-800",
  };

const generateCalendar = () => {
  const monthStart = startOfMonth(new Date(selectedYear, selectedMonth));
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const rows = [];
  let days = [];
  let day = startDate;

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const dateStr = format(day, "yyyy-MM-dd");
      const data = attendanceData[dateStr] || null;

      let content;
      if (data) {
        if (data.status === "Absent") {
          content = <div className="font-semibold">Absent</div>;
        } else {
          content = (
            <div className="text-[10px] mt-1 text-center">
              <div>Punch In: {data.punchIn}</div>
              <div>Punch Out: {data.punchOut}</div>
              <div>Total: {data.total}</div>
            </div>
          );
        }
      } else {
        content = null; // No data, leave blank
      }

      days.push(
        <div
          key={day}
          className={`border h-24 flex flex-col items-center justify-center text-xs font-medium rounded-md p-1 ${
            !isSameMonth(day, monthStart)
              ? "bg-gray-100 dark:bg-gray-800 text-gray-400"
              : data
              ? statusColors[data.status]
              : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          }`}
        >
          <div className="font-semibold">{format(day, "d")}</div>
          {content}
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div key={day} className="grid grid-cols-7 gap-1 mb-1">
        {days}
      </div>
    );
    days = [];
  }
  return rows;
};


  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-100 dark:border-gray-700">
      <Breadcrumb
        title="My Attendance"
        subtitle="View your attendance records"
      />
      <div className="flex items-center justify-end mb-4 flex-wrap gap-2">
        <div className="flex gap-2">
          <select
            className="px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-300"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <select
            className="px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-300"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          >
            {months.map((m) => {
              const isDisabled =
                parseInt(selectedYear) > currentYear ||
                (parseInt(selectedYear) === currentYear && m.value > currentMonth);
              return (
                <option
                  key={m.value}
                  value={m.value}
                  disabled={isDisabled}
                  className={isDisabled ? "text-gray-400" : ""}
                >
                  {m.name}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-1 mb-1 text-center text-xs font-semibold text-gray-600 dark:text-gray-300">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* Calendar */}
      <div>{generateCalendar()}</div>

      {/* Legend */}
      <div className="flex gap-4 mt-4 text-sm flex-wrap">
        {Object.entries(statusColors).map(([status, color]) => (
          <div key={status} className="flex items-center gap-1">
            <span className={`w-4 h-4 ${color} rounded-md`}></span> {status}
          </div>
        ))}
      </div>
    </div>
  );
}
