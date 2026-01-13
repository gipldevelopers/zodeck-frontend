"use client";

import { motion } from "framer-motion";
import {
  DollarSign,
  Receipt,
  TrendingUp,
  FileText,
  PieChart,
  BarChart3,
  Calendar,
  Users,
} from "lucide-react";

export default function ReportTypeCards({ selectedReportType, setSelectedReportType }) {
  const reportTypes = [
    {
      id: "financial-summary",
      label: "Financial Summary",
      description: "Overall financial overview and key metrics",
      icon: DollarSign,
      color: "primary",
      bgGradient: "from-primary/20 to-primary/5",
      borderColor: "border-primary/20",
    },
    {
      id: "expense-report",
      label: "Expense Report",
      description: "Detailed expense analysis and breakdown",
      icon: Receipt,
      color: "accent",
      bgGradient: "from-accent/20 to-accent/5",
      borderColor: "border-accent/20",
    },
    {
      id: "payroll-report",
      label: "Payroll Report",
      description: "Comprehensive payroll cost analysis",
      icon: TrendingUp,
      color: "success",
      bgGradient: "from-success/20 to-success/5",
      borderColor: "border-success/20",
    },
    {
      id: "tax-report",
      label: "Tax Report",
      description: "Tax deductions and compliance reports",
      icon: FileText,
      color: "warning",
      bgGradient: "from-warning/20 to-warning/5",
      borderColor: "border-warning/20",
    },
    {
      id: "department-wise",
      label: "Department Analysis",
      description: "Cost breakdown by department",
      icon: PieChart,
      color: "primary",
      bgGradient: "from-primary/20 to-primary/5",
      borderColor: "border-primary/20",
    },
    {
      id: "cost-center",
      label: "Cost Center Report",
      description: "Cost center wise financial analysis",
      icon: BarChart3,
      color: "accent",
      bgGradient: "from-accent/20 to-accent/5",
      borderColor: "border-accent/20",
    },
    {
      id: "monthly-report",
      label: "Monthly Report",
      description: "Month-wise financial performance",
      icon: Calendar,
      color: "success",
      bgGradient: "from-success/20 to-success/5",
      borderColor: "border-success/20",
    },
    {
      id: "employee-wise",
      label: "Employee Financial",
      description: "Individual employee financial details",
      icon: Users,
      color: "warning",
      bgGradient: "from-warning/20 to-warning/5",
      borderColor: "border-warning/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {reportTypes.map((report, index) => {
        const Icon = report.icon;
        const isSelected = selectedReportType === report.id;

        return (
          <motion.button
            key={report.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.5 }}
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedReportType(report.id)}
            className={`p-4 rounded-xl border-2 transition-all text-left relative overflow-hidden group ${
              isSelected
                ? `bg-gradient-to-br ${report.bgGradient} ${report.borderColor} shadow-lg`
                : "bg-muted/30 border-border hover:bg-muted/50"
            }`}
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-2xl -mr-10 -mt-10 transition-all group-hover:opacity-75"></div>

            <div className="relative z-10">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className={`p-3 rounded-lg bg-gradient-to-br ${report.bgGradient} w-fit mb-3 ${
                  isSelected ? `text-${report.color}` : "text-muted-foreground"
                }`}
              >
                <Icon className="w-5 h-5" />
              </motion.div>
              <h3
                className={`text-sm font-bold mb-1 ${
                  isSelected ? "text-foreground" : "text-foreground"
                }`}
              >
                {report.label}
              </h3>
              <p className="text-xs text-muted-foreground">{report.description}</p>
            </div>

            {isSelected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 w-3 h-3 rounded-full bg-primary"
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
