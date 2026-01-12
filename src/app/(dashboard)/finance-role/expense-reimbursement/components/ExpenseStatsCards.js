"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, CheckCircle2, XCircle, DollarSign, Loader2 } from "lucide-react";

export default function ExpenseStatsCards() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const mockData = {
        pending: 12,
        approved: 45,
        rejected: 3,
        totalPendingAmount: 35000,
        totalApprovedAmount: 125000,
        totalRejectedAmount: 8500,
      };
      setData(mockData);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass-card rounded-2xl p-6 h-full flex items-center justify-center premium-shadow">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ))}
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const stats = [
    {
      label: "Pending Approvals",
      value: data.pending,
      amount: data.totalPendingAmount,
      icon: Clock,
      color: "warning",
      bgGradient: "from-warning/20 to-warning/5",
      borderColor: "border-warning/20",
      textColor: "text-warning",
    },
    {
      label: "Approved",
      value: data.approved,
      amount: data.totalApprovedAmount,
      icon: CheckCircle2,
      color: "success",
      bgGradient: "from-success/20 to-success/5",
      borderColor: "border-success/20",
      textColor: "text-success",
    },
    {
      label: "Rejected",
      value: data.rejected,
      amount: data.totalRejectedAmount,
      icon: XCircle,
      color: "destructive",
      bgGradient: "from-destructive/20 to-destructive/5",
      borderColor: "border-destructive/20",
      textColor: "text-destructive",
    },
    {
      label: "Total Processed",
      value: data.approved + data.rejected,
      amount: data.totalApprovedAmount + data.totalRejectedAmount,
      icon: DollarSign,
      color: "primary",
      bgGradient: "from-primary/20 to-primary/5",
      borderColor: "border-primary/20",
      textColor: "text-primary",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ y: -5 }}
            className={`glass-card glass-card-hover rounded-2xl p-6 premium-shadow premium-shadow-hover relative overflow-hidden group border ${stat.borderColor}`}
          >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.bgGradient} rounded-full blur-2xl -mr-16 -mt-16 transition-all group-hover:opacity-75`}></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`p-3 rounded-xl bg-gradient-to-br ${stat.bgGradient} ${stat.textColor} shadow-md border ${stat.borderColor}`}
                >
                  <Icon className="w-6 h-6" />
                </motion.div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-muted-foreground">{stat.label}</p>
                <motion.p
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 + index * 0.1, type: "spring" }}
                  className={`text-3xl font-extrabold ${stat.textColor}`}
                >
                  {stat.value}
                </motion.p>
                <p className="text-sm font-bold text-foreground">
                  {formatCurrency(stat.amount)}
                </p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
