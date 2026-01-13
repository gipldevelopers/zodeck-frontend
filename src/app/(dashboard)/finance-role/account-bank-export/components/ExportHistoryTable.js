"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  FileText,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Loader2,
} from "lucide-react";

export default function ExportHistoryTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const timer = setTimeout(() => {
      const mockData = [
        {
          id: 1,
          fileName: "payroll_export_20260115.csv",
          exportType: "Payroll Transfer",
          account: "HDFC Bank",
          date: "2026-01-15",
          records: 125,
          amount: 2450000,
          format: "CSV",
          status: "completed",
          generatedBy: "Finance Manager",
        },
        {
          id: 2,
          fileName: "reimbursement_export_20260114.xlsx",
          exportType: "Expense Reimbursement",
          account: "ICICI Bank",
          date: "2026-01-14",
          records: 45,
          amount: 125000,
          format: "Excel",
          status: "completed",
          generatedBy: "Finance Manager",
        },
        {
          id: 3,
          fileName: "bonus_export_20260113.csv",
          exportType: "Bonus Payment",
          account: "HDFC Bank",
          date: "2026-01-13",
          records: 80,
          amount: 850000,
          format: "CSV",
          status: "completed",
          generatedBy: "Finance Manager",
        },
        {
          id: 4,
          fileName: "payroll_export_20260112.txt",
          exportType: "Payroll Transfer",
          account: "Axis Bank",
          date: "2026-01-12",
          records: 0,
          amount: 0,
          format: "TXT",
          status: "failed",
          generatedBy: "Finance Manager",
        },
        {
          id: 5,
          fileName: "advance_export_20260111.csv",
          exportType: "Salary Advance",
          account: "HDFC Bank",
          date: "2026-01-11",
          records: 12,
          amount: 150000,
          format: "CSV",
          status: "processing",
          generatedBy: "Finance Manager",
        },
      ];
      setData(mockData);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: {
        icon: CheckCircle2,
        bg: "bg-success/10",
        text: "text-success",
        border: "border-success/20",
        label: "Completed",
      },
      processing: {
        icon: Clock,
        bg: "bg-warning/10",
        text: "text-warning",
        border: "border-warning/20",
        label: "Processing",
      },
      failed: {
        icon: XCircle,
        bg: "bg-destructive/10",
        text: "text-destructive",
        border: "border-destructive/20",
        label: "Failed",
      },
    };

    const config = statusConfig[status] || statusConfig.processing;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border}`}
      >
        <Icon className="w-3.5 h-3.5" />
        {config.label}
      </span>
    );
  };

  const filteredData = data.filter((item) => {
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesSearch =
      item.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.exportType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.account.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const filterTabs = [
    { id: "all", label: "All", count: data.length },
    {
      id: "completed",
      label: "Completed",
      count: data.filter((e) => e.status === "completed").length,
    },
    {
      id: "processing",
      label: "Processing",
      count: data.filter((e) => e.status === "processing").length,
    },
    {
      id: "failed",
      label: "Failed",
      count: data.filter((e) => e.status === "failed").length,
    },
  ];

  if (loading) {
    return (
      <div className="glass-card rounded-2xl p-6 premium-shadow flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-6 premium-shadow"
    >
      {/* Header with Filters */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary shadow-md border border-primary/10"
          >
            <FileText className="w-6 h-6" />
          </motion.div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Export History</h3>
            <p className="text-sm text-muted-foreground">View and download previous export files</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="flex flex-wrap gap-2">
            {filterTabs.map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  statusFilter === tab.id
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-muted/50 text-foreground hover:bg-muted"
                }`}
              >
                {tab.label}
                <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-card/20 text-xs">
                  {tab.count}
                </span>
              </motion.button>
            ))}
          </div>

          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search exports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 pl-9 pr-4 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                File Name
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Type
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Account
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Date
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Records
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Amount
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <AnimatePresence>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center gap-3"
                    >
                      <FileText className="w-12 h-12 text-muted-foreground opacity-50" />
                      <p className="text-muted-foreground">No export files found</p>
                    </motion.div>
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-primary" />
                        <span className="text-sm font-semibold text-foreground">
                          {item.fileName}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-muted text-xs text-muted-foreground">
                          {item.format}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-foreground">{item.exportType}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-foreground">{item.account}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {formatDate(item.date)}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm font-semibold text-foreground">
                        {item.records}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm font-bold text-foreground">
                        {item.amount > 0 ? formatCurrency(item.amount) : "-"}
                      </span>
                    </td>
                    <td className="py-4 px-4">{getStatusBadge(item.status)}</td>
                    <td className="py-4 px-4">
                      {item.status === "completed" && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </motion.button>
                      )}
                    </td>
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
