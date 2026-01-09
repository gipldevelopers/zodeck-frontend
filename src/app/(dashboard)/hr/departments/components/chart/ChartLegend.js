"use client";
import { User, Users, Building, Circle } from 'lucide-react';

export default function ChartLegend() {
  const legendItems = [
    {
      icon: <User size={16} />,
      label: "Individual Contributor",
      color: "bg-blue-100 border-blue-300"
    },
    {
      icon: <Users size={16} />,
      label: "Manager with Team",
      color: "bg-green-100 border-green-300"
    },
    {
      icon: <Building size={16} />,
      label: "Department Head",
      color: "bg-purple-100 border-purple-300"
    },
    {
      icon: <Circle size={16} className="text-green-500" />,
      label: "Active",
      color: "bg-green-100 border-green-300"
    },
    {
      icon: <Circle size={16} className="text-yellow-500" />,
      label: "On Leave",
      color: "bg-yellow-100 border-yellow-300"
    },
    {
      icon: <Circle size={16} className="text-gray-500" />,
      label: "Inactive",
      color: "bg-gray-100 border-gray-300"
    }
  ];

  return (
    <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Chart Legend</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {legendItems.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div className={`p-1 rounded border ${item.color}`}>
              {item.icon}
            </div>
            <span className="text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          💡 <strong>Tip:</strong> Click on any employee card to view detailed contact information. 
          Use the expand/collapse buttons to show or hide reporting lines.
        </p>
      </div>
    </div>
  );
}