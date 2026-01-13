"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Sparkles,
} from "lucide-react";
import Breadcrumb from "@/components/common/Breadcrumb";
import { toast } from "react-hot-toast";
import dynamic from 'next/dynamic';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const reportTypes = [
  {
    id: "payroll-summary",
    label: "Payroll Summary",
    icon: FileText,
    description: "Overall payroll summary report",
    color: "primary",
  },
  {
    id: "tax-report",
    label: "Tax Report",
    icon: FileBarChart,
    description: "TDS and tax compliance report",
    color: "destructive",
  },
  {
    id: "department-wise",
    label: "Department Wise",
    icon: BarChart3,
    description: "Department-wise payroll breakdown",
    color: "success",
  },
  {
    id: "employee-wise",
    label: "Employee Wise",
    icon: FileText,
    description: "Individual employee payroll details",
    color: "accent",
  },
  {
    id: "statutory",
    label: "Statutory Compliance",
    icon: FileBarChart,
    description: "PF, ESI, PT compliance reports",
    color: "warning",
  },
  {
    id: "reimbursement",
    label: "Reimbursement Report",
    icon: TrendingUp,
    description: "Employee reimbursement statements",
    color: "primary",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

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
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const today = new Date();
      const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1);
      
      const mockReports = [
        {
          id: 1,
          name: "Payroll Summary - January 2024",
          type: "payroll-summary",
          generatedDate: lastMonth.toISOString(),
          period: "January 2024",
          status: "COMPLETED",
          fileSize: "2.5 MB",
          format: "PDF",
        },
        {
          id: 2,
          name: "Tax Report - January 2024",
          type: "tax-report",
          generatedDate: new Date(lastMonth.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          period: "January 2024",
          status: "COMPLETED",
          fileSize: "1.8 MB",
          format: "PDF",
        },
        {
          id: 3,
          name: "Department Wise - January 2024",
          type: "department-wise",
          generatedDate: new Date(lastMonth.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          period: "January 2024",
          status: "COMPLETED",
          fileSize: "3.2 MB",
          format: "Excel",
        },
      ];
      
      setReports(mockReports);
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
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const mockAnalytics = {
        totalPayroll: 2500000,
        totalEmployees: 200,
        averageSalary: 12500,
        departmentBreakdown: [
          { department: "Engineering", amount: 850000, employees: 65 },
          { department: "Sales", amount: 650000, employees: 45 },
          { department: "HR", amount: 400000, employees: 30 },
          { department: "Marketing", amount: 350000, employees: 35 },
          { department: "Finance", amount: 250000, employees: 25 },
        ],
        totalReports: 15,
        reportsThisMonth: 3,
        totalDistributed: 2500000,
      };
      
      setAnalytics(mockAnalytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
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
      toast.success(`Downloading ${report.name}...`);
    } catch (error) {
      console.error("Error downloading report:", error);
      toast.error("Failed to download report");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const selectedReport = reportTypes.find((r) => r.id === selectedReportType);

  // Department breakdown chart
  const departmentChartOptions = {
    chart: {
      type: 'donut',
      toolbar: { show: false },
      fontFamily: 'inherit',
    },
    labels: analytics?.departmentBreakdown?.map(d => d.department) || [],
    colors: ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--success))', 'hsl(var(--warning))', 'hsl(var(--destructive))'],
    dataLabels: {
      enabled: true,
      formatter: (val) => val.toFixed(0) + '%'
    },
    legend: { position: 'bottom' },
    tooltip: {
      theme: 'light',
      style: {
        fontSize: '12px',
        fontFamily: 'inherit',
        color: 'var(--foreground)'
      },
      y: {
        formatter: (val) => formatCurrency(val)
      }
    }
  };

  const departmentChartSeries = analytics?.departmentBreakdown?.map(d => d.amount) || [];

  // Payroll trend chart
  const trendChartOptions = {
    chart: {
      type: 'line',
      toolbar: { show: false },
      fontFamily: 'inherit',
    },
    stroke: { curve: 'smooth', width: 3 },
    dataLabels: { enabled: false },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    },
    yaxis: {
      labels: {
        formatter: (val) => formatCurrency(val)
      }
    },
    colors: ['hsl(var(--primary))'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 100]
      }
    },
    tooltip: {
      theme: 'light',
      style: {
        fontSize: '12px',
        fontFamily: 'inherit',
        color: 'var(--foreground)'
      },
      y: {
        formatter: (val) => formatCurrency(val)
      }
    }
  };

  const trendChartSeries = [{
    name: 'Total Payroll',
    data: [2000000, 2200000, 2100000, 2400000, 2300000, 2500000]
  }];

  return (
    <div className="bg-background min-h-screen p-4 sm:p-6">
      <Breadcrumb />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-4 mb-6 glass-card rounded-2xl p-6 premium-shadow relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-primary/10 transition-all"></div>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="p-4 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary shadow-lg border border-primary/10"
            >
              <FileBarChart className="w-8 h-8" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold text-gradient-primary">
                Payroll Reports
              </h1>
              <p className="text-muted-foreground mt-1">
                Generate, view, and download comprehensive payroll reports
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"
      >
        {[
          { label: "Total Reports", value: analytics?.totalReports || 0, icon: FileText, color: "primary" },
          { label: "This Month", value: analytics?.reportsThisMonth || 0, icon: TrendingUp, color: "success" },
          { label: "Total Distributed", value: formatCurrency(analytics?.totalDistributed || 0), icon: BarChart3, color: "accent" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.7 + index * 0.1, type: "spring", stiffness: 200 }}
            whileHover={{ y: -8, scale: 1.03 }}
            className="glass-card glass-card-hover rounded-2xl p-6 premium-shadow premium-shadow-hover relative overflow-hidden group border border-border/20"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.2,
              }}
              className={`absolute top-0 right-0 w-32 h-32 bg-${stat.color}/10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-${stat.color}/15 transition-all`}
            />
            <div className="flex items-center gap-4 relative z-10">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.8 + index * 0.1, type: "spring", stiffness: 300 }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                className={`p-4 rounded-xl bg-${stat.color}/20 text-${stat.color} border-2 border-${stat.color}/30 shadow-lg`}
              >
                <stat.icon className="w-7 h-7" />
              </motion.div>
              <div>
                <p className="text-sm font-semibold text-muted-foreground mb-2">{stat.label}</p>
                <motion.p
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 + index * 0.1, type: "spring" }}
                  className="text-3xl font-extrabold text-foreground"
                >
                  {stat.value}
                </motion.p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8"
      >
        {/* Report Generation Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Report Type Selection */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.9, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.01 }}
            className="glass-card rounded-2xl p-6 premium-shadow border border-border/20"
          >
            <h3 className="text-xl font-bold text-foreground mb-4">
              Select Report Type
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {reportTypes.map((report, index) => {
                const Icon = report.icon;
                const isSelected = selectedReportType === report.id;

                return (
                  <motion.button
                    key={report.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedReportType(report.id)}
                    className={`p-4 rounded-xl border-2 transition-all text-left relative overflow-hidden ${
                      isSelected
                        ? `border-${report.color} bg-${report.color}/10 shadow-lg`
                        : "border-border hover:border-primary/50 bg-card"
                    }`}
                  >
                    {isSelected && (
                      <motion.div
                        layoutId="selectedReport"
                        className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                    <div className="flex items-start gap-3 relative z-10">
                      <div className={`p-2 rounded-lg ${isSelected ? `bg-${report.color}/20` : "bg-muted"}`}>
                        <Icon className={`w-5 h-5 ${isSelected ? `text-${report.color}` : "text-muted-foreground"}`} />
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-semibold mb-1 ${isSelected ? "text-foreground" : "text-foreground"}`}>
                          {report.label}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {report.description}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Report Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-xl p-6 premium-shadow"
          >
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-bold text-foreground">Report Filters</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Period
                </label>
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-xl bg-card text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="annual">Annual</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-xl bg-card text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                >
                  <option value="all">All Departments</option>
                  <option value="engineering">Engineering</option>
                  <option value="marketing">Marketing</option>
                  <option value="hr">Human Resources</option>
                </select>
              </div>
            </div>

            <AnimatePresence>
              {period === "custom" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"
                >
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Start Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="date"
                        value={dateRange.startDate}
                        onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                        className="w-full pl-10 pr-3 py-2 border border-border rounded-xl bg-card text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      End Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="date"
                        value={dateRange.endDate}
                        onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                        className="w-full pl-10 pr-3 py-2 border border-border rounded-xl bg-card text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGenerateReport}
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
            </motion.button>
          </motion.div>

          {/* Recent Reports */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-xl p-6 premium-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-foreground">Recent Reports</h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-sm text-primary hover:underline font-medium"
              >
                View All
              </motion.button>
            </div>

            {loading && reports.length === 0 ? (
              <div className="flex justify-center items-center h-32">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : reports.length > 0 ? (
              <div className="space-y-3">
                {reports.map((report, index) => (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.01, x: 5 }}
                    className="glass-card rounded-lg p-4 border border-border/50 hover:border-primary/50 transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="p-2 rounded-lg text-primary">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-foreground">
                            {report.name}
                          </p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            <span>{report.period}</span>
                            <span>•</span>
                            <span>{report.format}</span>
                            <span>•</span>
                            <span>{report.fileSize}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDownloadReport(report)}
                          className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileBarChart className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">No reports generated yet</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Analytics Sidebar */}
        <div className="space-y-6">
          {/* Department Breakdown Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-xl p-6 premium-shadow"
          >
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-primary" />
              Department Breakdown
            </h3>
            {analytics?.departmentBreakdown && (
              <ReactApexChart 
                options={departmentChartOptions} 
                series={departmentChartSeries} 
                type="donut" 
                height={300} 
              />
            )}
          </motion.div>

          {/* Payroll Trend */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-xl p-6 premium-shadow"
          >
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <LineChart className="w-5 h-5 text-primary" />
              Payroll Trend
            </h3>
            <ReactApexChart 
              options={trendChartOptions} 
              series={trendChartSeries} 
              type="area" 
              height={250} 
            />
          </motion.div>

          {/* Quick Insights */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card rounded-xl p-6 premium-shadow"
          >
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Quick Insights
            </h3>
            <div className="space-y-4">
              {[
                { label: "Average Payroll", value: "₹8,50,000", change: "+5.2%", color: "success" },
                { label: "Tax Deducted", value: "₹2,45,000", change: "Current month", color: "primary" },
                { label: "Statutory Payments", value: "₹1,85,000", change: "PF + ESI + PT", color: "accent" },
              ].map((insight, index) => (
                <motion.div
                  key={insight.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 bg-gradient-to-br from-${insight.color}/10 to-${insight.color}/5 rounded-lg border border-${insight.color}/20`}
                >
                  <p className="text-xs text-muted-foreground mb-1">{insight.label}</p>
                  <p className="text-lg font-bold text-foreground">{insight.value}</p>
                  <p className={`text-xs mt-1 ${insight.color === 'success' ? 'text-success' : 'text-muted-foreground'}`}>
                    {insight.change}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Export Options */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-card rounded-xl p-6 premium-shadow"
          >
            <h3 className="text-lg font-bold text-foreground mb-4">
              Export Format
            </h3>
            <div className="space-y-2">
              {[
                { icon: FileText, label: "PDF Format", desc: "Best for viewing and printing", color: "destructive" },
                { icon: BarChart3, label: "Excel Format", desc: "For data analysis and editing", color: "success" },
                { icon: FileBarChart, label: "CSV Format", desc: "For import into other systems", color: "primary" },
              ].map((format, index) => (
                <motion.button
                  key={format.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="w-full p-3 text-left rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-all flex items-center gap-3"
                >
                  <format.icon className={`w-5 h-5 text-${format.color}`} />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{format.label}</p>
                    <p className="text-xs text-muted-foreground">{format.desc}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
