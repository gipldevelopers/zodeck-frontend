"use client";

import { useState, useEffect, useMemo } from "react";
import Breadcrumb from "@/components/common/Breadcrumb";
import { Star, Code, Users, Zap } from "lucide-react";

// --- Hardcoded Skills Data
const initialSkills = [
  { id: 1, name: "React.js", level: 90, category: "Frontend", icon: <Code size={20} /> },
  { id: 2, name: "Communication", level: 70, category: "Soft Skill", icon: <Users size={20} /> },
  { id: 3, name: "Node.js", level: 80, category: "Backend", icon: <Code size={20} /> },
  { id: 4, name: "Team Management", level: 60, category: "Leadership", icon: <Users size={20} /> },
  { id: 5, name: "TypeScript", level: 75, category: "Frontend", icon: <Zap size={20} /> },
];

// --- Filters Component
function SkillsFilters({ searchQuery, setSearchQuery, onClearFilters }) {
  const hasActiveFilters = searchQuery !== "";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <input
        type="text"
        placeholder="Search skills..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="flex-1 pl-4 pr-4 py-2 border rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500"
      />
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

// --- Single Skill Card with animated progress bar
function SkillCard({ skill, delay = 0 }) {
  const [animatedLevel, setAnimatedLevel] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => setAnimatedLevel(skill.level), delay);
    return () => clearTimeout(timeout);
  }, [skill.level, delay]);

  const getLevelText = (lvl) => (lvl >= 85 ? "Expert" : lvl >= 65 ? "Intermediate" : "Beginner");

  const progressColor =
    skill.level >= 85
      ? "bg-green-500 dark:bg-green-400"
      : skill.level >= 65
      ? "bg-yellow-400 dark:bg-yellow-500"
      : "bg-red-500 dark:bg-red-400";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 p-6 transition-all">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-200 dark:bg-indigo-700 rounded-xl text-indigo-800 dark:text-indigo-100">
            {skill.icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{skill.name}</h3>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{skill.category}</p>
          </div>
        </div>
        <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{skill.level}%</span>
      </div>

      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
        <div
          className={`h-3 rounded-full ${progressColor} transition-all duration-1000 ease-out`}
          style={{ width: `${animatedLevel}%` }}
        ></div>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400">{getLevelText(skill.level)}</p>
    </div>
  );
}

// --- Main Skills Page
export default function SkillsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const breadcrumbItems = [
    { label: "Employee", href: "/employee" },
    { label: "Performance", href: "/employee/performance" },
    { label: "Skills", href: "/employee/performance/skills" },
  ];

  const filteredSkills = useMemo(
    () =>
      initialSkills.filter((skill) =>
        skill.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [searchQuery]
  );

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-6">
      <Breadcrumb title="Skills" subtitle="Track your skill levels" />

      <SkillsFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onClearFilters={() => setSearchQuery("")}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSkills.length > 0 ? (
          filteredSkills.map((skill, index) => (
            <SkillCard key={skill.id} skill={skill} delay={index * 200} />
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400 col-span-full text-center mt-6">
            No skills found.
          </p>
        )}
      </div>
    </div>
  );
}
