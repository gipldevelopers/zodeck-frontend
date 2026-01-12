"use client";

import { useState } from "react";
import { Clock, TrendingDown, TrendingUp, Calendar, Users } from "lucide-react";
import LateArrivalsTable from "./LateArrivalsTable";
import EarlyLeavesTable from "./EarlyLeavesTable";

export default function LateEarlyTrackingTab() {
  const [activeView, setActiveView] = useState("late");

  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveView("late")}
          className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 ${
            activeView === "late"
              ? "border-orange-600 text-orange-600 dark:text-orange-400"
              : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Late Arrivals
        </button>
        <button
          onClick={() => setActiveView("early")}
          className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 ${
            activeView === "early"
              ? "border-purple-600 text-purple-600 dark:text-purple-400"
              : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          <TrendingDown className="w-4 h-4" />
          Early Leaves
        </button>
      </div>

      {/* Content */}
      {activeView === "late" ? <LateArrivalsTable /> : <EarlyLeavesTable />}
    </div>
  );
}
