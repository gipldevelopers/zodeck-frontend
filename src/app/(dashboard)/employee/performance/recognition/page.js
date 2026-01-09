"use client";

import { useState, useEffect } from "react";
import Breadcrumb from "@/components/common/Breadcrumb";
import { Award, Star, Crown } from "lucide-react";

/**
 * RecognitionItem
 * simple certificate-style card with built-in stagger animation (no framer-motion)
 */
function RecognitionItem({ recognition, index = 0 }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // stagger appearance by index
    const t = setTimeout(() => setVisible(true), index * 150);
    return () => clearTimeout(t);
  }, [index]);

  return (
    <div
      className={`relative bg-white dark:bg-gray-800 border-2 border-yellow-400 rounded-xl shadow-lg p-6 flex flex-col items-center text-center
        transform transition-all duration-700 ease-out hover:scale-[1.02] ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      aria-live="polite"
    >
      {/* Decorative crown */}
      <div className="absolute -top-5 bg-yellow-400 rounded-full p-2 shadow-md">
        <Crown className="w-6 h-6 text-white" />
      </div>

      {/* Award icon */}
      <div className="w-14 h-14 flex items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-700 mb-4 mt-4">
        <Award className="w-8 h-8 text-yellow-600 dark:text-yellow-200" />
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
        {recognition.name}
      </h3>

      {/* Subtitle */}
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1">
        <Star className="w-4 h-4 text-yellow-500" />
        Recognition of Excellence
      </p>
    </div>
  );
}

/**
 * RecognitionPage
 */
export default function RecognitionPage() {
  const breadcrumbItems = [
    { label: "Employee", href: "/employee" },
    { label: "Performance", href: "/employee/performance" },
    { label: "Recognition", href: "/employee/performance/recognition" },
  ];

  const [recognitions] = useState([
    { id: 1, name: "Employee of the Month - August" },
    { id: 2, name: "Best Team Player Award" },
    { id: 3, name: "Top Innovator Award" },
    { id: 4, name: "Leadership Excellence Award" },
  ]);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-6">
      <Breadcrumb items={breadcrumbItems} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
        {recognitions.length > 0 ? (
          recognitions.map((rec, i) => (
            <RecognitionItem key={rec.id} recognition={rec} index={i} />
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400 col-span-full text-center mt-6">
            No recognitions found.
          </p>
        )}
      </div>
    </div>
  );
}
