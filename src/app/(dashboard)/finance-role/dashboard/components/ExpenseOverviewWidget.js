"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Receipt, Clock, CheckCircle2, AlertCircle, Loader2, ArrowRight } from "lucide-react";

export default function ExpenseOverviewWidget() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const mockData = {
        pendingApprovals: 12,
        approvedThisMonth: 45,
        totalApprovedAmount: 125000,
        pendingAmount: 35000,
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
          <Receipt className="w-6 h-6" />
        </motion.div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-foreground">Expense Overview</h3>
          <p className="text-sm text-muted-foreground">Current Month Status</p>
        </div>
      </motion.div>

      <div className="space-y-6 relative z-10">
        {/* Pending Approvals */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 rounded-xl bg-warning/10 border border-warning/20 hover:bg-warning/15 transition-colors cursor-pointer group/item"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/20 text-warning">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Pending Approvals</p>
                <p className="text-xs text-muted-foreground">Awaiting your review</p>
              </div>
            </div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="opacity-0 group-hover/item:opacity-100 transition-opacity"
            >
              <ArrowRight className="w-5 h-5 text-warning" />
            </motion.div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <motion.p
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
                className="text-3xl font-extrabold text-warning"
              >
                {data.pendingApprovals}
              </motion.p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatCurrency(data.pendingAmount)} pending
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-warning text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-all"
            >
              Review
            </motion.button>
          </div>
        </motion.div>

        {/* Approved Expenses */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="p-4 rounded-xl bg-success/10 border border-success/20"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-success/20 text-success">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Approved Expenses</p>
              <p className="text-xs text-muted-foreground">Current month</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-end justify-between">
              <motion.p
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: "spring" }}
                className="text-3xl font-extrabold text-success"
              >
                {data.approvedThisMonth}
              </motion.p>
              <span className="text-xs text-muted-foreground mb-1">expenses</span>
            </div>
            <p className="text-lg font-bold text-foreground">
              {formatCurrency(data.totalApprovedAmount)}
            </p>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-center p-3 rounded-lg bg-muted/30"
          >
            <p className="text-xs text-muted-foreground mb-1">Total Expenses</p>
            <p className="text-lg font-bold text-foreground">
              {data.pendingApprovals + data.approvedThisMonth}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-center p-3 rounded-lg bg-muted/30"
          >
            <p className="text-xs text-muted-foreground mb-1">Total Amount</p>
            <p className="text-lg font-bold text-foreground">
              {formatCurrency(data.totalApprovedAmount + data.pendingAmount)}
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
