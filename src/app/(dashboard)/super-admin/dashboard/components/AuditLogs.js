// src/app/(dashboard)/super-admin/dashboard/components/AuditLogs.js
"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

const AuditLogs = () => {
  const [recentLogs, setRecentLogs] = useState([]);
  const [logStats, setLogStats] = useState({
    total: 1247,
    today: 89,
    critical: 3,
    warnings: 12
  });

  useEffect(() => {
    // Mock audit log data
    const mockLogs = [
      {
        id: 1,
        type: 'security',
        level: 'high',
        message: 'Multiple failed login attempts from suspicious IP',
        timestamp: '2 minutes ago',
        user: 'system'
      },
      {
        id: 2,
        type: 'user',
        level: 'medium',
        message: 'User permissions modified for employee #4572',
        timestamp: '5 minutes ago',
        user: 'admin@company.com'
      },
      {
        id: 3,
        type: 'system',
        level: 'low',
        message: 'Automatic backup completed successfully',
        timestamp: '12 minutes ago',
        user: 'system'
      },
      {
        id: 4,
        type: 'database',
        level: 'medium',
        message: 'Unusual query pattern detected',
        timestamp: '18 minutes ago',
        user: 'app-server'
      }
    ];
    setRecentLogs(mockLogs);
  }, []);

  const getLevelColor = (level) => {
    switch(level) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getLevelIcon = (level) => {
    switch(level) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'security': return '🛡️';
      case 'user': return '👤';
      case 'system': return '⚙️';
      case 'database': return '💾';
      default: return '📋';
    }
  };

  return (
    <div className="card bg-white dark:bg-gray-800 rounded-lg shadow-sm border-0 overflow-hidden">
      <div className="card-header px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <h5 className="text-base font-semibold text-gray-800 dark:text-white">
          Audit Logs
        </h5>
        <Link
          href="/super-admin/audit-logs"
          className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
        >
          View All
        </Link>
      </div>

      <div className="card-body p-4">
        {/* Log Statistics */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { label: 'Total Logs', value: logStats.total, color: 'text-gray-600' },
            { label: "Today's Logs", value: logStats.today, color: 'text-blue-600' },
            { label: 'Critical', value: logStats.critical, color: 'text-red-600' },
            { label: 'Warnings', value: logStats.warnings, color: 'text-yellow-600' }
          ].map((stat, index) => (
            <div key={index} className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
              <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Recent Logs */}
        <div className="space-y-3">
          {recentLogs.map((log) => (
            <div key={log.id} className="flex items-start space-x-3 p-2 bg-gray-50 dark:bg-gray-700 rounded">
              <div className="flex-shrink-0">
                <span className="text-sm">{getTypeIcon(log.type)}</span>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(log.level)}`}>
                    <span className="mr-1">{getLevelIcon(log.level)}</span>
                    {log.level}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {log.timestamp}
                  </span>
                </div>
                
                <p className="text-sm text-gray-800 dark:text-white mb-1">
                  {log.message}
                </p>
                
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  By: {log.user}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-4 flex space-x-2">
          <button className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs py-2 px-3 rounded border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600">
            Export Logs
          </button>
          <button className="flex-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs py-2 px-3 rounded border border-blue-200 dark:border-blue-800 hover:bg-blue-200 dark:hover:bg-blue-900/30">
            Filter Logs
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;