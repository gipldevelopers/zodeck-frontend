"use client";
import React, { useState, useMemo } from "react";
import Breadcrumb from "@/components/common/Breadcrumb";
import { Calendar, Search, Filter, X, Gift, Clock, TrendingUp, CalendarDays, ChevronUp, ChevronDown } from "lucide-react";
import { format, isPast, isToday, isFuture, parseISO, startOfYear, endOfYear, isWithinInterval } from "date-fns";

// Dummy mock holiday data
const mockHolidays = [
  { id: "H-001", date: "2025-01-01", name: "New Year's Day", type: "Public Holiday", day: "Wednesday" },
  { id: "H-002", date: "2025-01-26", name: "Republic Day", type: "Public Holiday", day: "Sunday" },
  { id: "H-003", date: "2025-02-14", name: "Valentine's Day", type: "Optional Holiday", day: "Friday" },
  { id: "H-004", date: "2025-03-08", name: "International Women's Day", type: "Optional Holiday", day: "Saturday" },
  { id: "H-005", date: "2025-03-25", name: "Good Friday", type: "Public Holiday", day: "Tuesday" },
  { id: "H-006", date: "2025-04-14", name: "Ambedkar Jayanti", type: "Public Holiday", day: "Monday" },
  { id: "H-007", date: "2025-05-01", name: "Labour Day", type: "Public Holiday", day: "Thursday" },
  { id: "H-008", date: "2025-08-15", name: "Independence Day", type: "Public Holiday", day: "Friday" },
  { id: "H-009", date: "2025-10-02", name: "Gandhi Jayanti", type: "Public Holiday", day: "Thursday" },
  { id: "H-010", date: "2025-10-31", name: "Halloween", type: "Optional Holiday", day: "Friday" },
  { id: "H-011", date: "2025-11-14", name: "Children's Day", type: "Optional Holiday", day: "Friday" },
  { id: "H-012", date: "2025-12-25", name: "Christmas Day", type: "Public Holiday", day: "Thursday" },
];

export default function HolidayPage() {
  const [holidays] = useState(mockHolidays);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [monthFilter, setMonthFilter] = useState("All");
  const [viewMode, setViewMode] = useState("list"); // "list" or "upcoming"

  const currentYear = new Date().getFullYear();

  const filteredHolidays = useMemo(() => {
    return holidays.filter(holiday => {
      const holidayDate = parseISO(holiday.date);
      const monthMatch = monthFilter === "All" || format(holidayDate, "MMM") === monthFilter;
      const typeMatch = typeFilter === "All" || holiday.type === typeFilter;
      const searchMatch = !searchQuery || holiday.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (viewMode === "upcoming") {
        return isFuture(holidayDate) || isToday(holidayDate);
      }
      
      return monthMatch && typeMatch && searchMatch;
    });
  }, [holidays, searchQuery, typeFilter, monthFilter, viewMode]);

  const stats = useMemo(() => {
    const total = holidays.length;
    const passed = holidays.filter(h => isPast(parseISO(h.date))).length;
    const upcoming = holidays.filter(h => isFuture(parseISO(h.date)) || isToday(parseISO(h.date))).length;
    const publicHolidays = holidays.filter(h => h.type === "Public Holiday").length;
    
    return { total, passed, upcoming, publicHolidays };
  }, [holidays]);

  const months = ["All", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const types = ["All", "Public Holiday", "Optional Holiday"];

  const hasActiveFilters = monthFilter !== "All" || typeFilter !== "All" || searchQuery !== "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
      <Breadcrumb
          customTitle="Holidays"
          subtitle={`View all holidays for ${currentYear}`}
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-primary-100/50 dark:border-gray-700 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2 bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 rounded-lg">
                <CalendarDays size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide truncate">
                  Total Holidays
                </p>
              </div>
            </div>
            <div className="space-y-1">
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">For {currentYear}</p>
            </div>
            <div className="mt-4 h-1 border-primary-200 dark:border-primary-500/30 border-t"></div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-primary-100/50 dark:border-gray-700 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg">
                <Clock size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide truncate">
                  Upcoming
                </p>
              </div>
            </div>
            <div className="space-y-1">
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.upcoming}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">Holidays ahead</p>
            </div>
            <div className="mt-4 h-1 border-emerald-200 dark:border-emerald-500/30 border-t"></div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-primary-100/50 dark:border-gray-700 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg">
                <TrendingUp size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide truncate">
                  Passed
                </p>
              </div>
            </div>
            <div className="space-y-1">
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.passed}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">Already celebrated</p>
            </div>
            <div className="mt-4 h-1 border-blue-200 dark:border-blue-500/30 border-t"></div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-primary-100/50 dark:border-gray-700 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg">
                <Gift size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide truncate">
                  Public Holidays
                </p>
              </div>
            </div>
            <div className="space-y-1">
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.publicHolidays}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">Official holidays</p>
            </div>
            <div className="mt-4 h-1 border-amber-200 dark:border-amber-500/30 border-t"></div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-primary-100/50 dark:border-gray-700 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-wrap gap-3 w-full lg:w-auto">
              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-xl">
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    viewMode === "list"
                      ? "bg-white dark:bg-gray-800 text-primary-700 dark:text-primary-400 shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  }`}
                >
                  All Holidays
                </button>
                <button
                  onClick={() => setViewMode("upcoming")}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    viewMode === "upcoming"
                      ? "bg-white dark:bg-gray-800 text-primary-700 dark:text-primary-400 shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  }`}
                >
                  Upcoming
                </button>
              </div>

              {/* Search */}
              <div className="relative flex-1 lg:flex-initial min-w-[250px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                <input
                  type="text"
                  placeholder="Search holidays..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-primary-200/50 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 dark:focus:border-primary-500 transition-all duration-200 text-sm"
                />
              </div>

              {/* Month Filter */}
              <div className="relative flex-1 lg:flex-initial min-w-[120px]">
                <select
                  className="w-full appearance-none pl-10 pr-8 py-2.5 border border-primary-200/50 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 dark:focus:border-primary-500 transition-all duration-200 text-sm cursor-pointer"
                  value={monthFilter}
                  onChange={e => setMonthFilter(e.target.value)}
                >
                  {months.map(m => <option key={m} value={m}>{m === "All" ? "All Months" : m}</option>)}
                </select>
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>

              {/* Type Filter */}
              <div className="relative flex-1 lg:flex-initial min-w-[140px]">
                <select
                  className="w-full appearance-none pl-10 pr-8 py-2.5 border border-primary-200/50 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 dark:focus:border-primary-500 transition-all duration-200 text-sm cursor-pointer"
                  value={typeFilter}
                  onChange={e => setTypeFilter(e.target.value)}
                >
                  {types.map(t => <option key={t} value={t}>{t === "All" ? "All Types" : t}</option>)}
                </select>
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
            </div>

            {hasActiveFilters && (
              <button
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors duration-200"
                onClick={() => {
                  setSearchQuery("");
                  setTypeFilter("All");
                  setMonthFilter("All");
                }}
              >
                <X size={16} />
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Holidays Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredHolidays.length > 0 ? filteredHolidays.map(holiday => {
            const holidayDate = parseISO(holiday.date);
            const isPastHoliday = isPast(holidayDate) && !isToday(holidayDate);
            const isTodayHoliday = isToday(holidayDate);
            const isUpcomingHoliday = isFuture(holidayDate);

            return (
              <div
                key={holiday.id}
                className={`bg-white dark:bg-gray-800 rounded-2xl border p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ${
                  isTodayHoliday
                    ? "border-primary-500 ring-2 ring-primary-500/20 shadow-lg"
                    : isPastHoliday
                    ? "border-gray-200 dark:border-gray-700 opacity-75"
                    : "border-primary-100/50 dark:border-gray-700"
                }`}
              >
                {/* Date Badge */}
                <div className="flex items-start gap-3 mb-4">
                  <div className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl font-semibold border ${
                    isTodayHoliday
                      ? "bg-primary-500 text-white border-primary-600"
                      : isPastHoliday
                      ? "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600"
                      : "bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400 border-primary-200/50 dark:border-primary-500/20"
                  }`}>
                    <span className="text-lg leading-tight">{format(holidayDate, "d")}</span>
                    <span className="text-[10px] uppercase leading-tight">{format(holidayDate, "MMM")}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{holiday.day}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{format(holidayDate, "yyyy")}</p>
                  </div>
                  {isTodayHoliday && (
                    <span className="px-2 py-1 text-[10px] font-semibold bg-primary-500 text-white rounded-full">
                      Today
                    </span>
                  )}
                </div>

                {/* Name */}
                <h3 className={`text-base font-semibold mb-3 line-clamp-2 ${
                  isTodayHoliday
                    ? "text-primary-700 dark:text-primary-400"
                    : "text-gray-900 dark:text-white"
                }`}>
                  {holiday.name}
                </h3>

                {/* Tag */}
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border ${
                  holiday.type === "Public Holiday"
                    ? "bg-primary-50 text-primary-700 border-primary-200 dark:bg-primary-500/10 dark:text-primary-400 dark:border-primary-500/30"
                    : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30"
                }`}>
                  <Gift size={12} />
                  {holiday.type}
                </span>
              </div>
            );
          }) : (
            <div className="col-span-full bg-white dark:bg-gray-800 rounded-2xl border border-primary-100/50 dark:border-gray-700 p-12 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full">
                  <Calendar size={32} className="text-gray-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-medium">No holidays found</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">Try adjusting your filters</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
