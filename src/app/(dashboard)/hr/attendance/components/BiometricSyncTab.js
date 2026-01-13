"use client";

import { useState, useEffect } from "react";
import {
  Database,
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { attendanceService } from "@/services/hr-services/attendace.service";
import { toast } from "react-hot-toast";

export default function BiometricSyncTab() {
  const [syncStatus, setSyncStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBiometricSyncStatus();
  }, []);

  const fetchBiometricSyncStatus = async () => {
    try {
      setLoading(true);
      const response = await attendanceService.getBiometricSyncStatus();
      const statusData = response.success ? response.data : response;
      setSyncStatus(statusData);
    } catch (error) {
      console.error("Error fetching biometric sync status:", error);
      toast.error("Failed to load biometric sync status");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      ACTIVE: {
        label: "Active",
        className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
        icon: <CheckCircle className="w-4 h-4" />,
      },
      INACTIVE: {
        label: "Inactive",
        className: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
        icon: <XCircle className="w-4 h-4" />,
      },
      ERROR: {
        label: "Error",
        className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
        icon: <AlertTriangle className="w-4 h-4" />,
      },
    };

    const config = statusConfig[status] || {
      label: status,
      className: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
      icon: <Activity className="w-4 h-4" />,
    };

    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}
      >
        {config.icon}
        {config.label}
      </span>
    );
  };

  const formatSyncFrequency = (freq) => {
    const freqMap = {
      HOURLY: "Every Hour",
      DAILY: "Daily",
      WEEKLY: "Weekly",
      MANUAL: "Manual",
    };
    return freqMap[freq] || freq;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    );
  }

  if (!syncStatus) {
    return (
      <div className="text-center py-12">
        <Database className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500 dark:text-gray-400">No biometric sync status available</p>
      </div>
    );
  }

  const integrations = syncStatus.integrations || [];
  const statistics = syncStatus.syncStatistics || {};

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="bg-gradient-to-r from-brand-50 to-brand-100/50 dark:from-brand-500/20 dark:to-brand-500/10 border-2 border-brand-200 dark:border-brand-500/30 rounded-lg p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-brand-100 dark:bg-brand-500/20 rounded-lg flex-shrink-0">
            <Activity className="w-5 h-5 text-brand-600 dark:text-brand-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-brand-700 dark:text-brand-400">
              Biometric Sync Monitoring (View-Only)
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              This section displays biometric integration status and sync monitoring information.
              All data is read-only and automatically updated from the biometric system.
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-brand-50 to-brand-100/50 dark:from-brand-500/20 dark:to-brand-500/10 p-5 rounded-xl border-2 border-brand-200 dark:border-brand-500/30 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-brand-100 dark:bg-brand-500/20 rounded-lg">
              <RefreshCw className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            </div>
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Total Syncs</p>
          </div>
          <p className="text-3xl font-bold text-brand-600 dark:text-brand-400">
            {statistics.totalSyncs || 0}
          </p>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Successful</p>
          </div>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {statistics.successfulSyncs || 0}
          </p>
        </div>
        <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
          <div className="flex items-center gap-3 mb-2">
            <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Failed</p>
          </div>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            {statistics.failedSyncs || 0}
          </p>
        </div>
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
          </div>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {statistics.successRate ? `${statistics.successRate}%` : "N/A"}
          </p>
        </div>
      </div>

      {/* Biometric Integrations */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <div className="p-2 bg-brand-100 dark:bg-brand-500/20 rounded-lg">
            <Database className="w-5 h-5 text-brand-600 dark:text-brand-400" />
          </div>
          Biometric Integrations
        </h3>

        {integrations.length === 0 ? (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
            <div className="p-4 bg-brand-50 dark:bg-brand-500/10 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <Database className="w-10 h-10 text-brand-500 dark:text-brand-400" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No biometric integrations configured
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrations.map((integration) => (
              <div
                key={integration.id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                      {integration.name}
                    </h4>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(integration.status)}
                      <span className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                        {integration.environment || "PRODUCTION"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Sync Frequency:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatSyncFrequency(integration.syncFrequency)}
                    </span>
                  </div>

                  {integration.lastSyncAt && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Last Sync:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {new Date(integration.lastSyncAt).toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  )}

                  {integration.nextSyncAt && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Next Sync:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {new Date(integration.nextSyncAt).toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  )}
                </div>

                {/* Recent Logs */}
                {integration.recentLogs && integration.recentLogs.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                      RECENT SYNC LOGS
                    </p>
                    <div className="space-y-2">
                      {integration.recentLogs.slice(0, 3).map((log, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between text-xs p-2 bg-gray-50 dark:bg-gray-700 rounded"
                        >
                          <span className="text-gray-600 dark:text-gray-400">
                            {log.message || "Sync completed"}
                          </span>
                          <span className="text-gray-500 dark:text-gray-500">
                            {log.timestamp
                              ? new Date(log.timestamp).toLocaleTimeString("en-GB", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "-"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sync Logs */}
      {syncStatus.recentSyncLogs && syncStatus.recentSyncLogs.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <div className="p-2 bg-brand-100 dark:bg-brand-500/20 rounded-lg">
              <Activity className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            </div>
            Recent Sync Logs
          </h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {syncStatus.recentSyncLogs.map((log, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm"
              >
                <div className="flex items-center gap-3">
                  {log.status === "SUCCESS" ? (
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                  )}
                  <span className="text-gray-900 dark:text-white">{log.message || "Sync log"}</span>
                </div>
                <span className="text-gray-500 dark:text-gray-400">
                  {log.timestamp
                    ? new Date(log.timestamp).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "-"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
