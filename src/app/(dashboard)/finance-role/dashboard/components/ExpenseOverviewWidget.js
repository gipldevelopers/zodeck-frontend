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
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, scale: 1.01 }}
      className="glass-card glass-card-hover rounded-3xl p-6 sm:p-8 h-full premium-shadow premium-shadow-hover relative overflow-hidden group border border-accent/10"
    >
      {/* Animated Background Effects */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-0 right-0 w-60 h-60 bg-accent/10 rounded-full blur-3xl -mr-30 -mt-30 transition-all group-hover:bg-accent/20"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.05, 0.15, 0.05],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-0 left-0 w-48 h-48 bg-warning/10 rounded-full blur-3xl -ml-24 -mb-24"
      />

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        className="flex items-center gap-4 mb-8 relative z-10"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.15, rotate: 10 }}
          className="p-4 rounded-2xl bg-gradient-to-br from-accent/30 via-accent/20 to-accent/10 text-accent shadow-xl border-2 border-accent/20 relative overflow-hidden"
        >
          <motion.div
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          />
          <Receipt className="w-7 h-7 relative z-10" />
        </motion.div>
        <div className="flex-1">
          <motion.h3
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-xl font-extrabold text-foreground mb-1"
          >
            Expense Overview
          </motion.h3>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-sm text-muted-foreground"
          >
            Current Month Status
          </motion.p>
        </div>
      </motion.div>

      <div className="space-y-6 relative z-10">
        {/* Pending Approvals */}
        <motion.div
          initial={{ opacity: 0, x: -30, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.03, x: 5 }}
          className="relative p-5 rounded-2xl bg-gradient-to-br from-warning/15 via-warning/10 to-warning/5 border-2 border-warning/30 hover:border-warning/40 transition-all cursor-pointer group/item shadow-lg overflow-hidden"
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 bg-warning/10 rounded-full blur-2xl"
          />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="p-3 rounded-xl bg-warning/30 text-warning shadow-md border border-warning/40"
                >
                  <Clock className="w-5 h-5" />
                </motion.div>
                <div>
                  <p className="text-sm font-bold text-foreground">Pending Approvals</p>
                  <p className="text-xs text-muted-foreground">Awaiting your review</p>
                </div>
              </div>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                whileHover={{ scale: 1.2, x: 5 }}
                className="opacity-0 group-hover/item:opacity-100 transition-opacity"
              >
                <ArrowRight className="w-5 h-5 text-warning" />
              </motion.div>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <motion.p
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
                  className="text-4xl font-extrabold text-warning"
                >
                  {data.pendingApprovals}
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-xs font-semibold text-muted-foreground mt-2"
                >
                  {formatCurrency(data.pendingAmount)} pending
                </motion.p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2.5 bg-warning text-warning-foreground rounded-xl text-sm font-bold hover:shadow-xl hover:shadow-warning/30 transition-all border-2 border-warning/20"
              >
                Review
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Approved Expenses */}
        <motion.div
          initial={{ opacity: 0, x: -30, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.03, x: 5 }}
          className="relative p-5 rounded-2xl bg-gradient-to-br from-success/15 via-success/10 to-success/5 border-2 border-success/30 shadow-lg overflow-hidden"
        >
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 bg-success/10 rounded-full blur-2xl"
          />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="p-3 rounded-xl bg-success/30 text-success shadow-md border border-success/40"
              >
                <CheckCircle2 className="w-5 h-5" />
              </motion.div>
              <div>
                <p className="text-sm font-bold text-foreground">Approved Expenses</p>
                <p className="text-xs text-muted-foreground">Current month</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-end justify-between">
                <motion.p
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7, type: "spring", stiffness: 300 }}
                  className="text-4xl font-extrabold text-success"
                >
                  {data.approvedThisMonth}
                </motion.p>
                <span className="text-xs font-semibold text-muted-foreground mb-1">expenses</span>
              </div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-success to-emerald-500"
              >
                {formatCurrency(data.totalApprovedAmount)}
              </motion.p>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="grid grid-cols-2 gap-4 pt-6 border-t-2 border-border/50"
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 1, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.05, y: -3 }}
            className="relative text-center p-4 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border shadow-md overflow-hidden group/stat"
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 bg-primary/10 rounded-full blur-xl"
            />
            <div className="relative z-10">
              <p className="text-xs font-semibold text-muted-foreground mb-2">Total Expenses</p>
              <motion.p
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.1, type: "spring" }}
                className="text-xl font-extrabold text-foreground"
              >
                {data.pendingApprovals + data.approvedThisMonth}
              </motion.p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 1.1, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.05, y: -3 }}
            className="relative text-center p-4 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border shadow-md overflow-hidden group/stat"
          >
            <motion.div
              animate={{
                scale: [1.1, 1, 1.1],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 bg-accent/10 rounded-full blur-xl"
            />
            <div className="relative z-10">
              <p className="text-xs font-semibold text-muted-foreground mb-2">Total Amount</p>
              <motion.p
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, type: "spring" }}
                className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent"
              >
                {formatCurrency(data.totalApprovedAmount + data.pendingAmount)}
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
