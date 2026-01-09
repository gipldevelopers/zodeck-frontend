"use client";

import { useState, useMemo, useEffect } from "react";
import Breadcrumb from "@/components/common/Breadcrumb";

// --- Hardcoded KPI Data
const initialKPIs = [
  { id: 1, name: "Tasks Completed", value: 45, target: 50, category: "Productivity" },
  { id: 2, name: "Customer Tickets Resolved", value: 30, target: 40, category: "Support" },
  { id: 3, name: "Sales Calls Made", value: 75, target: 100, category: "Sales" },
  { id: 4, name: "Code Reviews Done", value: 20, target: 25, category: "Quality" },
  { id: 5, name: "Team Meetings Attended", value: 10, target: 12, category: "Collaboration" },
];

// --- KPI Filters
function KPIFilters({ searchQuery, setSearchQuery, onClearFilters }) {
  const hasActiveFilters = searchQuery !== "";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div className="relative flex-1">
        <input
          type="text"
          placeholder="Search KPIs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-4 pr-4 py-2 border rounded-lg shadow-sm 
            dark:bg-gray-800 dark:border-gray-600 dark:text-white 
            focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {hasActiveFilters && (
        <button
          className="px-3 py-2 text-sm font-medium text-red-600 hover:text-red-800 dark:text-red-400"
          onClick={onClearFilters}
        >
          Clear
        </button>
      )}
    </div>
  );
}

// --- KPI Card with animated circular progress
function KPICard({ kpi, delay = 0 }) {
  const progress = Math.min((kpi.value / kpi.target) * 100, 100);
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => setAnimatedProgress(progress), delay);
    return () => clearTimeout(timeout);
  }, [progress, delay]);

  const strokeColor =
    progress >= 100 ? "#16a34a" : progress >= 70 ? "#facc15" : "#dc2626";

  const circleStyle = {
    strokeDasharray: 2 * Math.PI * 30,
    strokeDashoffset: 2 * Math.PI * 30 * (1 - animatedProgress / 100),
    transition: "stroke-dashoffset 1.2s ease-out",
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{kpi.name}</h3>
        <span className="px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200 rounded-full">
          {kpi.category}
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* Circular progress */}
        <svg className="w-16 h-16" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="30" stroke="#e5e7eb" strokeWidth="8" fill="none" />
          <circle
            cx="40"
            cy="40"
            r="30"
            stroke={strokeColor}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            style={circleStyle}
            transform="rotate(-90 40 40)"
          />
          <text
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            className="text-sm font-bold text-gray-900 dark:text-gray-100"
          >
            {Math.round(animatedProgress)}%
          </text>
        </svg>

        {/* KPI Details */}
        <div>
          <p className="text-gray-600 dark:text-gray-300 mb-1">
            {kpi.value} / {kpi.target} Completed
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Progress towards target
          </p>
        </div>
      </div>
    </div>
  );
}

// --- Main KPI Page
export default function KPIsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredKPIs = useMemo(
    () =>
      initialKPIs.filter((kpi) =>
        kpi.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [searchQuery]
  );

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Breadcrumb title="KPIs" subtitle="Track your key performance indicators" />

      <KPIFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onClearFilters={() => setSearchQuery("")}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredKPIs.length > 0 ? (
          filteredKPIs.map((kpi, index) => (
            <KPICard key={kpi.id} kpi={kpi} delay={index * 200} /> // staggered animation
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400 col-span-full text-center mt-6">
            No KPIs found.
          </p>
        )}
      </div>
    </div>
  );
}
