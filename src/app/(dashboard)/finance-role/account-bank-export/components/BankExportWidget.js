"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, FileText, Calendar, CheckCircle2, Loader2, AlertCircle } from "lucide-react";

export default function BankExportWidget() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exportData, setExportData] = useState({
    accountId: "",
    exportType: "payroll",
    format: "csv",
    date: new Date().toISOString().split("T")[0],
  });
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const mockData = {
        lastExport: {
          date: "2026-01-15",
          fileName: "payroll_export_20260115.csv",
          account: "HDFC Bank",
          records: 125,
          amount: 2450000,
          status: "completed",
        },
        pendingExports: 0,
        exportFormats: ["CSV", "Excel", "TXT"],
        exportTypes: [
          { id: "payroll", label: "Payroll Transfer" },
          { id: "reimbursement", label: "Expense Reimbursement" },
          { id: "bonus", label: "Bonus Payment" },
          { id: "advance", label: "Salary Advance" },
        ],
      };
      setData(mockData);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card rounded-2xl p-6 h-full flex items-center justify-center premium-shadow"
      >
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </motion.div>
    );
  }

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

  const handleGenerateExport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      alert("Export file generated successfully!");
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="glass-card glass-card-hover rounded-2xl p-6 h-full premium-shadow premium-shadow-hover relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 w-40 h-40 bg-accent/5 rounded-full blur-3xl -mr-20 -mt-20 transition-all group-hover:bg-accent/10"></div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-3 mb-6 relative z-10"
      >
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="p-3 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 text-accent shadow-md border border-accent/10"
        >
          <Download className="w-6 h-6" />
        </motion.div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-foreground">Generate Bank Export</h3>
          <p className="text-sm text-muted-foreground">Create export files for bank transfers</p>
        </div>
      </motion.div>

      <div className="space-y-4 relative z-10">
        {/* Export Form */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">
              Export Type
            </label>
            <select
              value={exportData.exportType}
              onChange={(e) => setExportData({ ...exportData, exportType: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {data.exportTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">
              File Format
            </label>
            <div className="flex gap-2">
              {data.exportFormats.map((format) => (
                <motion.button
                  key={format}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setExportData({ ...exportData, format: format.toLowerCase() })}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    exportData.format === format.toLowerCase()
                      ? "bg-primary text-white shadow-lg"
                      : "bg-muted/50 text-foreground hover:bg-muted"
                  }`}
                >
                  {format}
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">
              Export Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="date"
                value={exportData.date}
                onChange={(e) => setExportData({ ...exportData, date: e.target.value })}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerateExport}
            disabled={isGenerating}
            className="w-full px-4 py-3 bg-gradient-to-r from-primary via-teal-500 to-emerald-500 text-white rounded-lg font-bold shadow-lg hover:shadow-primary/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                Generate Export File
              </>
            )}
          </motion.button>
        </div>

        {/* Last Export Info */}
        {data.lastExport && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="pt-4 border-t border-border"
          >
            <p className="text-xs font-semibold text-muted-foreground mb-3">Last Export</p>
            <div className="p-4 rounded-xl bg-muted/30 border border-border">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">
                    {data.lastExport.fileName}
                  </span>
                </div>
                {data.lastExport.status === "completed" ? (
                  <CheckCircle2 className="w-4 h-4 text-success" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-warning" />
                )}
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                <div>
                  <p className="text-muted-foreground">Date</p>
                  <p className="font-semibold text-foreground">
                    {formatDate(data.lastExport.date)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Records</p>
                  <p className="font-semibold text-foreground">{data.lastExport.records}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Account</p>
                  <p className="font-semibold text-foreground">{data.lastExport.account}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Amount</p>
                  <p className="font-semibold text-foreground">
                    {formatCurrency(data.lastExport.amount)}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
