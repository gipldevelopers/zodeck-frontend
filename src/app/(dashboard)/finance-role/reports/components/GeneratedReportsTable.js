"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  FileText,
  Calendar,
  CheckCircle2,
  Clock,
  Search,
  Loader2,
  Eye,
  Trash2,
} from "lucide-react";

export default function GeneratedReportsTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    const timer = setTimeout(() => {
      const mockData = [
        {
          id: 1,
          name: "Financial Summary - January 2026",
          type: "Financial Summary",
          date: "2026-01-15",
          format: "PDF",
          size: "2.4 MB",
          status: "completed",
          generatedBy: "Finance Manager",
        },
        {
          id: 2,
          name: "Expense Report - Q4 2025",
          type: "Expense Report",
          date: "2026-01-14",
          format: "Excel",
          size: "1.8 MB",
          status: "completed",
          generatedBy: "Finance Manager",
        },
        {
          id: 3,
          name: "Payroll Report - December 2025",
          type: "Payroll Report",
          date: "2026-01-13",
          format: "PDF",
          size: "3.2 MB",
          status: "completed",
          generatedBy: "Finance Manager",
        },
        {
          id: 4,
          name: "Tax Report - FY 2025-26",
          type: "Tax Report",
          date: "2026-01-12",
          format: "PDF",
          size: "4.1 MB",
          status: "processing",
          generatedBy: "Finance Manager",
        },
        {
          id: 5,
          name: "Department Analysis - January 2026",
          type: "Department Analysis",
          date: "2026-01-11",
          format: "Excel",
          size: "1.5 MB",
          status: "completed",
          generatedBy: "Finance Manager",
        },
        {
          id: 6,
          name: "Cost Center Report - Q4 2025",
          type: "Cost Center Report",
          date: "2026-01-10",
          format: "CSV",
          size: "856 KB",
          status: "completed",
          generatedBy: "Finance Manager",
        },
      ];
      setData(mockData);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    if (status === "completed") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border bg-success/10 text-success border-success/20">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Completed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border bg-warning/10 text-warning border-warning/20">
        <Clock className="w-3.5 h-3.5" />
        Processing
      </span>
    );
  };

  const getFormatBadge = (format) => {
    const formatColors = {
      PDF: "bg-destructive/10 text-destructive border-destructive/20",
      Excel: "bg-success/10 text-success border-success/20",
      CSV: "bg-primary/10 text-primary border-primary/20",
    };

    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${
          formatColors[format] || "bg-muted text-muted-foreground border-border"
        }`}
      >
        {format}
      </span>
    );
  };

  const filteredData = data.filter((item) => {
    const matchesType = typeFilter === "all" || item.type === typeFilter;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const uniqueTypes = ["all", ...new Set(data.map((item) => item.type))];

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
            <h3 className="text-lg font-bold text-foreground">Generated Reports</h3>
            <p className="text-sm text-muted-foreground">View and download your reports</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="flex flex-wrap gap-2">
            {uniqueTypes.slice(0, 4).map((type) => (
              <motion.button
                key={type}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTypeFilter(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  typeFilter === type
                    ? "bg-primary text-white shadow-lg"
                    : "bg-muted/50 text-foreground hover:bg-muted"
                }`}
              >
                {type === "all" ? "All" : type.split(" ")[0]}
              </motion.button>
            ))}
          </div>

          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search reports..."
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
                Report Name
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Type
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Date
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Format
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Size
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
                  <td colSpan={7} className="py-12 text-center">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center gap-3"
                    >
                      <FileText className="w-12 h-12 text-muted-foreground opacity-50" />
                      <p className="text-muted-foreground">No reports found</p>
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
                        <span className="text-sm font-semibold text-foreground">{item.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-foreground">{item.type}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{formatDate(item.date)}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">{getFormatBadge(item.format)}</td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-muted-foreground">{item.size}</span>
                    </td>
                    <td className="py-4 px-4">{getStatusBadge(item.status)}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {item.status === "completed" && (
                          <>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                              title="View"
                            >
                              <Eye className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 rounded-lg hover:bg-success/10 text-success transition-colors"
                              title="Download"
                            >
                              <Download className="w-4 h-4" />
                            </motion.button>
                          </>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
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
