// src/app/(dashboard)/employee/attendance/holidays/page.js
"use client";

import { useState, useMemo } from "react";
import Breadcrumb from "@/components/common/Breadcrumb";
import BreadcrumbRightContent from "../components/BreadcrumbRightContent";
import { Calendar, Search } from "lucide-react";

// --- Dummy holiday data (ISO dates for better parsing)
const holidayData = [
  { id: "H-001", date: "2025-01-01", name: "New Year's Day", type: "Public Holiday", day: "Wednesday" },
  { id: "H-002", date: "2025-01-26", name: "Republic Day", type: "Public Holiday", day: "Sunday" },
  { id: "H-003", date: "2025-02-14", name: "Valentine's Day", type: "Optional Holiday", day: "Friday" },
  { id: "H-004", date: "2025-03-25", name: "Good Friday", type: "Public Holiday", day: "Tuesday" },
  { id: "H-005", date: "2025-08-15", name: "Independence Day", type: "Public Holiday", day: "Friday" },
  { id: "H-006", date: "2025-10-31", name: "Halloween", type: "Optional Holiday", day: "Friday" },
  { id: "H-007", date: "2025-12-25", name: "Christmas Day", type: "Public Holiday", day: "Thursday" },
];

// --- Filters component
function HolidayFilters({ monthFilter, setMonthFilter, typeFilter, setTypeFilter, searchQuery, setSearchQuery, onClearFilters }) {
  const months = ["All","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const types = ["All","Public Holiday","Optional Holiday"];
  const hasActiveFilters = monthFilter !== "All" || typeFilter !== "All" || searchQuery !== "";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text"
          placeholder="Search holidays..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 border rounded-lg shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Dropdown filters */}
      <div className="flex gap-3">
        <select
          className="border px-3 py-2 rounded-lg shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          value={monthFilter}
          onChange={e => setMonthFilter(e.target.value)}
        >
          {months.map(m => <option key={m} value={m}>{m}</option>)}
        </select>

        <select
          className="border px-3 py-2 rounded-lg shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
        >
          {types.map(t => <option key={t} value={t}>{t}</option>)}
        </select>

        {hasActiveFilters && (
          <button
            className="px-3 py-2 text-sm font-medium text-red-600 hover:text-red-800 dark:text-red-400"
            onClick={onClearFilters}
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

// --- Main Holidays Page
export default function Holidays() {
  const [monthFilter, setMonthFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());

  const filteredData = useMemo(() => holidayData.filter(h => {
    const monthMatch = monthFilter === "All" || new Date(h.date).toLocaleString("default", { month: "short" }) === monthFilter;
    const typeMatch = typeFilter === "All" || h.type === typeFilter;
    const searchMatch = h.name.toLowerCase().includes(searchQuery.toLowerCase());
    return monthMatch && typeMatch && searchMatch;
  }), [monthFilter, typeFilter, searchQuery]);

  return (
    <div className="bg-gray-50 min-h-screen dark:bg-gray-900">
      <Breadcrumb
        title="Holidays"
        subtitle="Check upcoming holidays"
        rightContent={<BreadcrumbRightContent selectedDate={selectedDate} setSelectedDate={setSelectedDate} />}
      />

      <HolidayFilters
        monthFilter={monthFilter}
        setMonthFilter={setMonthFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onClearFilters={() => { setMonthFilter("All"); setTypeFilter("All"); setSearchQuery(""); }}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
  {filteredData.length > 0 ? filteredData.map(holiday => (
    <div
      key={holiday.id}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition"
    >
      {/* Date & Day */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-14 h-14 flex flex-col items-center justify-center rounded-lg bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400 font-semibold">
          <span>{new Date(holiday.date).toLocaleDateString("default", { day: "2-digit" })}</span>
          <span className="text-xs">{new Date(holiday.date).toLocaleDateString("default", { month: "short" })}</span>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{holiday.day}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{holiday.date}</p>
        </div>
      </div>

      {/* Name */}
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">{holiday.name}</h3>

      {/* Tag */}
      <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
        holiday.type === "Public Holiday"
          ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
      }`}>
        {holiday.type}
      </span>
    </div>
  )) : (
    <p className="text-gray-500 dark:text-gray-400 col-span-full text-center mt-6">No holidays found.</p>
  )}
</div>

    </div>
  );
}
