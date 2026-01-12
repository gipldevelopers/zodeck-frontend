"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Bell, FileText, Loader2 } from "lucide-react";

export default function UpcomingActionsWidget() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const today = new Date();
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);

      const nextMonth = new Date(today);
      nextMonth.setMonth(today.getMonth() + 1);
      nextMonth.setDate(5);

      const mockData = {
        payrollRunDueDate: nextMonth.toISOString(),
        filingReminders: [
          {
            title: "PF Filing Due",
            dueDate: nextWeek.toISOString(),
            type: "PF",
            description: "Monthly PF contribution filing",
          },
          {
            title: "TDS Filing Due",
            dueDate: new Date(today.getFullYear(), today.getMonth() + 1, 7).toISOString(),
            type: "TDS",
            description: "Monthly TDS filing",
          },
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
        className="bg-card text-card-foreground rounded-2xl shadow-lg border border-border p-6 h-full backdrop-blur-sm"
      >
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </motion.div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const getDaysUntil = (dateString) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      date.setHours(0, 0, 0, 0);
      const diffTime = date - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch {
      return null;
    }
  };

  const payrollRunDueDate = data?.payrollRunDueDate || null;
  const filingReminders = data?.filingReminders || [];

  const upcomingActions = [
    {
      type: "payrollRun",
      title: "Payroll Run Due Date",
      date: payrollRunDueDate,
      icon: <Calendar className="w-5 h-5" />,
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/20",
    },
    ...filingReminders.map((reminder) => ({
      type: "filing",
      title: reminder.title || "Statutory Filing",
      date: reminder.dueDate,
      description: reminder.type || reminder.description,
      icon: <FileText className="w-5 h-5" />,
      color: "text-accent",
      bgColor: "bg-accent/10",
      borderColor: "border-accent/20",
    })),
  ];

  const getUrgencyColor = (days) => {
    if (days === null || days === undefined) return "text-muted-foreground";
    if (days < 0) return "text-destructive";
    if (days <= 3) return "text-warning";
    if (days <= 7) return "text-accent";
    return "text-muted-foreground";
  };

  const getUrgencyBadge = (days) => {
    if (days === null || days === undefined) return null;
    if (days < 0)
      return (
        <span className="px-2 py-1 rounded-full bg-destructive/20 text-destructive text-xs font-semibold">
          Overdue
        </span>
      );
    if (days <= 3)
      return (
        <span className="px-2 py-1 rounded-full bg-warning/20 text-warning text-xs font-semibold">
          Urgent
        </span>
      );
    if (days <= 7)
      return (
        <span className="px-2 py-1 rounded-full bg-accent/20 text-accent text-xs font-semibold">
          Soon
        </span>
      );
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="glass-card glass-card-hover rounded-2xl p-6 h-full premium-shadow premium-shadow-hover relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-primary/10"></div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-3 mb-6 relative z-10"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary shadow-md border border-primary/10"
        >
          <Bell className="w-6 h-6" />
        </motion.div>
        <div>
          <h3 className="text-lg font-bold text-foreground">Upcoming Actions</h3>
          <p className="text-sm text-muted-foreground">Reminders & deadlines</p>
        </div>
      </motion.div>

      <div className="space-y-3">
        {upcomingActions.length > 0 ? (
          upcomingActions.map((action, index) => {
            const daysUntil = getDaysUntil(action.date);
            const urgencyColor = getUrgencyColor(daysUntil);
            const urgencyBadge = getUrgencyBadge(daysUntil);

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.02, x: 5 }}
                className={`p-4 rounded-xl border-2 ${action.borderColor} ${action.bgColor} backdrop-blur-sm transition-all cursor-pointer`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className={`p-2 rounded-lg ${action.color} bg-card mt-0.5 shadow-sm`}
                    >
                      {action.icon}
                    </motion.div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">
                        {action.title}
                      </p>
                      {action.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {action.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-muted-foreground">Due:</span>
                        <span
                          className={`text-xs font-semibold ${urgencyColor}`}
                        >
                          {formatDate(action.date)}
                        </span>
                        {daysUntil !== null && (
                          <span className="text-xs text-muted-foreground">
                            ({daysUntil < 0
                              ? `${Math.abs(daysUntil)} days ago`
                              : daysUntil === 0
                                ? "Today"
                                : `${daysUntil} day${daysUntil > 1 ? "s" : ""} left`}
                            )
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {urgencyBadge && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.4 + index * 0.1 }}
                      className="flex-shrink-0"
                    >
                      {urgencyBadge}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center py-8"
          >
            <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">
              No upcoming actions scheduled
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
