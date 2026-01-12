"use client";

import { useState, useEffect } from "react";
import {
  FileBarChart,
  FileText,
  Download,
  TrendingUp,
  Calendar,
  Filter,
  BarChart3,
  PieChart,
  LineChart,
  Loader2,
  Eye,
  Printer,
} from "lucide-react";
import Breadcrumb from "@/components/common/Breadcrumb";
import { payrollReportsAnalyticsService } from "@/services/payroll-role-services/reports-analytics.service";
import { toast } from "react-hot-toast";

const reportTypes = [
  {
    id: "payroll-summary",
    label: "Payroll Summary",
    icon: FileText,
    description: "Overall payroll summary report",
    color: "blue",
  },
  {
    id: "tax-report",
    label: "Tax Report",
    icon: FileBarChart,
    description: "TDS and tax compliance report",
    color: "red",
  },
  {
    id: "department-wise",
    label: "Department Wise",
    icon: BarChart3,
    description: "Department-wise payroll breakdown",
    color: "green",
  },
  {
    id: "employee-wise",
    label: "Employee Wise",
    icon: FileText,
    description: "Individual employee payroll details",
    color: "purple",
  },
  {
    id: "statutory",
    label: "Statutory Compliance",
    icon: FileBarChart,
    description: "PF, ESI, PT compliance reports",
    color: "orange",
  },
  {
    id: "reimbursement",
    label: "Reimbursement Report",
    icon: TrendingUp,
    description: "Employee reimbursement statements",
    color: "indigo",
  },
];

export default function PayrollReportsPage() {
  const [selectedReportType, setSelectedReportType] = useState("payroll-summary");
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });
  const [period, setPeriod] = useState("monthly");
  const [department, setDepartment] = useState("all");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetchReports();
    fetchAnalytics();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await payrollReportsAnalyticsService.getPayrollReports({
        page: 1,
        limit: 10,
      });
      const data = response.success ? response.data : response;
      const reportsData = data?.reports || data?.data || [];
      setReports(Array.isArray(reportsData) ? reportsData : []);
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error(error.message || "Failed to fetch reports");
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await payrollReportsAnalyticsService.getPayrollAnalytics();
      const data = response.success ? response.data : response;
      setAnalytics(data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast.error(error.message || "Failed to fetch analytics");
      // Fallback data
      setAnalytics({
        totalReports: 0,
        reportsThisMonth: 0,
        totalDistributed: 0,
      });
    }
  };

  const handleGenerateReport = async () => {
    try {
      setLoading(true);
      // Simulate API call - Replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("Report generated successfully");
      fetchReports();
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async (report) => {
    try {
      // Simulate download - Replace with actual API
      toast.success(`Downloading ${report.name}...`);
    } catch (error) {
      console.error("Error downloading report:", error);
      toast.error("Failed to download report");
    }
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: "bg-blue-100 dark:bg-blue-900/30",
        text: "text-blue-600 dark:text-blue-400",
        button: "bg-blue-600 hover:bg-blue-700",
      },
      red: {
        bg: "bg-red-100 dark:bg-red-900/30",
        text: "text-red-600 dark:text-red-400",
        button: "bg-red-600 hover:bg-red-700",
      },
      green: {
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-600 dark:text-green-400",
        button: "bg-green-600 hover:bg-green-700",
      },
      purple: {
        bg: "bg-purple-100 dark:bg-purple-900/30",
        text: "text-purple-600 dark:text-purple-400",
        button: "bg-purple-600 hover:bg-purple-700",
      },
      orange: {
        bg: "bg-orange-100 dark:bg-orange-900/30",
        text: "text-orange-600 dark:text-orange-400",
        button: "bg-orange-600 hover:bg-orange-700",
      },
      indigo: {
        bg: "bg-indigo-100 dark:bg-indigo-900/30",
        text: "text-indigo-600 dark:text-indigo-400",
        button: "bg-indigo-600 hover:bg-indigo-700",
      },
    };
    return colors[color] || colors.blue;
  };

  const selectedReport = reportTypes.find((r) => r.id === selectedReportType);

  return (
    <div className="bg-gray-50 min-h-screen dark:bg-gray-900 p-4 sm:p-6">
      <Breadcrumb />

      {/* Header */}
      <div className="mt-4 mb-6 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-5 shadow-sm dark:border-blue-900/40 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950/40">
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
            <FileBarChart className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payroll Reports</h1>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Generate, view, and download comprehensive payroll reports
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Reports</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analytics?.totalReports || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">This Month</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analytics?.reportsThisMonth || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Distributed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ₹{(analytics?.totalDistributed || 0).toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Generation Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Report Type Selection */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Select Report Type
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {reportTypes.map((report) => {
                const Icon = report.icon;
                const colorClasses = getColorClasses(report.color);
                const isSelected = selectedReportType === report.id;

                return (
                  <button
                    key={report.id}
                    onClick={() => setSelectedReportType(report.id)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      isSelected
                        ? `border-${report.color}-500 dark:border-${report.color}-400 ${colorClasses.bg}`
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${isSelected ? colorClasses.bg : "bg-gray-100 dark:bg-gray-700"}`}>
                        <Icon className={`w-5 h-5 ${isSelected ? colorClasses.text : "text-gray-500 dark:text-gray-400"}`} />
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-semibold mb-1 ${isSelected ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"}`}>
                          {report.label}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {report.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Report Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Report Filters</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Period
                </label>
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="annual">Annual</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">All Departments</option>
                  <option value="engineering">Engineering</option>
                  <option value="marketing">Marketing</option>
                  <option value="hr">Human Resources</option>
                </select>
              </div>
            </div>

            {period === "custom" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Start Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      value={dateRange.startDate}
                      onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    End Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      value={dateRange.endDate}
                      onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleGenerateReport}
              disabled={loading}
              className={`w-full py-3 ${selectedReport ? getColorClasses(selectedReport.color).button : "bg-blue-600 hover:bg-blue-700"} text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Report...
                </>
              ) : (
                <>
                  <FileBarChart className="w-5 h-5" />
                  Generate {selectedReport?.label || "Report"}
                </>
              )}
            </button>
          </div>

          {/* Recent Reports */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Reports</h3>
              <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium">
                View All
              </button>
            </div>

            {loading && reports.length === 0 ? (
              <div className="flex justify-center items-center h-32">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : reports.length > 0 ? (
              <div className="space-y-3">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {report.name}
                          </p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                            <span>{report.period}</span>
                            <span>•</span>
                            <span>{report.format}</span>
                            <span>•</span>
                            <span>{report.size}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDownloadReport(report)}
                          className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileBarChart className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                <p className="text-sm text-gray-500 dark:text-gray-400">No reports generated yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Analytics Sidebar */}
        <div className="space-y-6">
          {/* Quick Analytics */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Insights
            </h3>
            <div className="space-y-4">
              <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Average Payroll</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">₹8,50,000</p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">↑ 5.2% from last month</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Tax Deducted</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">₹2,45,000</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Current month</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Statutory Payments</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">₹1,85,000</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">PF + ESI + PT</p>
              </div>
            </div>
          </div>

          {/* Export Options */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Export Format
            </h3>
            <div className="space-y-2">
              <button className="w-full p-3 text-left rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex items-center gap-3">
                <FileText className="w-5 h-5 text-red-600 dark:text-red-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">PDF Format</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Best for viewing and printing</p>
                </div>
              </button>
              <button className="w-full p-3 text-left rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex items-center gap-3">
                <BarChart3 className="w-5 h-5 text-green-600 dark:text-green-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Excel Format</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">For data analysis and editing</p>
                </div>
              </button>
              <button className="w-full p-3 text-left rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex items-center gap-3">
                <FileBarChart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">CSV Format</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">For import into other systems</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
