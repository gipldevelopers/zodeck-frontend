"use client";

import { useState, useEffect } from "react";
import Breadcrumb from "@/components/common/Breadcrumb";

// --- Hardcoded Feedback Data
const initialFeedback = [
  { id: 1, from: "Manager", comment: "Excellent work on Project A. Keep up the great effort!", type: "Positive" },
  { id: 2, from: "Peer", comment: "Great collaboration in team tasks. Very reliable and proactive.", type: "Positive" },
  { id: 3, from: "Manager", comment: "Timely updates on documentation and reports are appreciated.", type: "Neutral" },
  { id: 4, from: "Peer", comment: "Strong communication skills and attention to detail.", type: "Positive" },
  { id: 5, from: "Manager", comment: "Exceeded expectations in handling customer tickets efficiently.", type: "Positive" },
  { id: 6, from: "Manager", comment: "Needs improvement in time management.", type: "Improvement" },
];

// --- Filters Component
function FeedbackFilters({ searchQuery, setSearchQuery, onClearFilters }) {
  const hasActiveFilters = searchQuery !== "";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div className="relative flex-1">
        <input
          type="text"
          placeholder="Search feedback..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-4 pr-4 py-2 border rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500"
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

// --- Single Feedback Card (New UI)
function FeedbackCard({ feedback, delay = 0 }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  // Type-based border colors
  const typeColors = {
    Positive: "border-green-400",
    Neutral: "border-yellow-400",
    Improvement: "border-red-400",
  };

  return (
    <div
      className={`transform transition duration-700 ease-out rounded-xl p-5 shadow-md dark:shadow-gray-900 border-l-4 ${
        typeColors[feedback.type] || "border-indigo-400"
      } bg-white dark:bg-gray-800 opacity-0 ${visible ? "opacity-100" : ""}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="font-semibold text-gray-800 dark:text-gray-100">{feedback.from}</span>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
          feedback.type === "Positive"
            ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
            : feedback.type === "Neutral"
            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
            : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
        }`}>
          {feedback.type}
        </span>
      </div>
      <p className="text-gray-700 dark:text-gray-200">{feedback.comment}</p>
    </div>
  );
}

// --- Main Feedback Page
export default function FeedbackPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const breadcrumbItems = [
    { label: "Employee", href: "/employee" },
    { label: "Performance", href: "/employee/performance" },
    { label: "Feedback", href: "/employee/performance/feedback" },
  ];

  const filteredFeedback = initialFeedback.filter(
    (f) =>
      f.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Breadcrumb title="Feedback" subtitle="View received feedback" />

      <FeedbackFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onClearFilters={() => setSearchQuery("")}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFeedback.length > 0 ? (
          filteredFeedback.map((f, index) => <FeedbackCard key={f.id} feedback={f} delay={index * 150} />)
        ) : (
          <p className="text-gray-500 dark:text-gray-400 col-span-full text-center mt-6">
            No feedback found.
          </p>
        )}
      </div>
    </div>
  );
}
