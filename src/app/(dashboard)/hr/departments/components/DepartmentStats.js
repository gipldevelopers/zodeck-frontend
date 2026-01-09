// src/app/(dashboard)/hr/departments/components/DepartmentStats.js
"use client";
import { Users, TrendingUp, Target, Award } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function DepartmentStats({ department }) {
  const [animatedCount, setAnimatedCount] = useState(0);

  useEffect(() => {
    if (department && department.employeeCount > 0) {
      // Animate the employee count
      let start = 0;
      const end = department.employeeCount;
      const duration = 1500; // ms
      const incrementTime = 30; // ms
      
      const steps = Math.ceil(duration / incrementTime);
      const increment = Math.ceil(end / steps);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          start = end;
          clearInterval(timer);
        }
        setAnimatedCount(start);
      }, incrementTime);
      
      return () => clearInterval(timer);
    }
  }, [department]);

  if (!department) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center">
          <div className="bg-blue-100 p-3 rounded-lg dark:bg-blue-900/30 mr-4">
            <Users className="text-blue-600 dark:text-blue-400" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Employees</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{animatedCount}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center">
          <div className="bg-green-100 p-3 rounded-lg dark:bg-green-900/30 mr-4">
            <TrendingUp className="text-green-600 dark:text-green-400" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Productivity</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">87%</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center">
          <div className="bg-purple-100 p-3 rounded-lg dark:bg-purple-900/30 mr-4">
            <Target className="text-purple-600 dark:text-purple-400" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Goals Met</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">92%</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center">
          <div className="bg-yellow-100 p-3 rounded-lg dark:bg-yellow-900/30 mr-4">
            <Award className="text-yellow-600 dark:text-yellow-400" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Satisfaction</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">94%</p>
          </div>
        </div>
      </div>
    </div>
  );
}