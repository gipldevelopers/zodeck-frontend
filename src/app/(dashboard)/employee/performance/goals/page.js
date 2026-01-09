"use client";

import { useState, useMemo, useEffect } from "react";
import Breadcrumb from "@/components/common/Breadcrumb";

// --- Hardcoded Goals Data
const initialGoals = [
  { id: 1, name: "Complete Project A", progress: 75, due: "2025-09-30", priority: "High", status: "In Progress" },
  { id: 2, name: "Update Documentation", progress: 100, due: "2025-09-15", priority: "Medium", status: "Completed" },
  { id: 3, name: "Improve Skills in React", progress: 50, due: "2025-10-10", priority: "High", status: "In Progress" },
  { id: 4, name: "Attend Team Workshops", progress: 80, due: "2025-10-05", priority: "Low", status: "In Progress" },
  { id: 5, name: "Prepare Quarterly Report", progress: 30, due: "2025-09-25", priority: "High", status: "Pending" },
  { id: 6, name: "Client Feedback Review", progress: 60, due: "2025-09-28", priority: "Medium", status: "In Progress" },
];

// --- Filters Component
function GoalsFilters({ searchQuery, setSearchQuery, onClearFilters }) {
  const hasActiveFilters = searchQuery !== "";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div className="relative flex-1">
        <input
          type="text"
          placeholder="Search goals..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-3 pr-3 py-2 border rounded-lg shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500"
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

// --- Single Goal Card with animated progress bar
function GoalCard({ goal, delay = 0 }) {
  const statusColors = {
    "Completed": "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100",
    "In Progress": "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100",
    "Pending": "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100",
  };

  const priorityColors = {
    High: "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100",
    Medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100",
    Low: "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100",
  };

  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => setAnimatedProgress(goal.progress), delay);
    return () => clearTimeout(timeout);
  }, [goal.progress, delay]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{goal.name}</h3>
      <div className="flex items-center gap-2 mb-3">
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[goal.status]}`}>
          {goal.status}
        </span>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityColors[goal.priority]}`}>
          {goal.priority} Priority
        </span>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Due Date: {goal.due}</p>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
        <div
          className="h-3 rounded-full bg-indigo-600 dark:bg-indigo-400 transition-all duration-1000 ease-out"
          style={{ width: `${animatedProgress}%` }}
        ></div>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300">{animatedProgress}% Complete</p>
    </div>
  );
}

// --- Main Goals Page
export default function GoalsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGoals = useMemo(
    () =>
      initialGoals.filter((goal) =>
        goal.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [searchQuery]
  );

  return (
    <div className="bg-gray-50 min-h-screen dark:bg-gray-900">
      <Breadcrumb title="Goals" subtitle="Track your performance goals" />

      <GoalsFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onClearFilters={() => setSearchQuery("")}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGoals.length > 0 ? (
          filteredGoals.map((goal, index) => (
            <GoalCard key={goal.id} goal={goal} delay={index * 200} />
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400 col-span-full text-center mt-6">
            No goals found.
          </p>
        )}
      </div>
    </div>
  );
}
