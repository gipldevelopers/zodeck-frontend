"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, CheckCircle2, AlertCircle, Clock, Loader2, ArrowRight } from "lucide-react";
import dynamic from 'next/dynamic';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function StatutoryComplianceWidget() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const mockData = {
        compliance: {
          pf: "COMPLIANT",
          gratuity: "PENDING",
          esi: "COMPLIANT",
          tds: "WARNING",
        },
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

  const getStatusConfig = (status) => {
    switch (status) {
      case "COMPLIANT":
        return {
          label: "Compliant",
          icon: <CheckCircle2 className="w-5 h-5" />,
          color: "text-emerald-500",
          bgColor: "bg-emerald-500/10",
          borderColor: "border-emerald-500/20",
          badgeColor: "bg-emerald-500/10 text-emerald-600",
          chartColor: "#10b981"
        };
      case "PENDING":
        return {
          label: "Pending",
          icon: <Clock className="w-5 h-5" />,
          color: "text-blue-500",
          bgColor: "bg-blue-500/10",
          borderColor: "border-blue-500/20",
          badgeColor: "bg-blue-500/10 text-blue-600",
          chartColor: "#3b82f6"
        };
      case "WARNING":
        return {
          label: "Warning",
          icon: <AlertCircle className="w-5 h-5" />,
          color: "text-amber-500",
          bgColor: "bg-amber-500/10",
          borderColor: "border-amber-500/20",
          badgeColor: "bg-amber-500/10 text-amber-600",
          chartColor: "#f59e0b"
        };
      case "OVERDUE":
        return {
          label: "Overdue",
          icon: <AlertCircle className="w-5 h-5" />,
          color: "text-red-500",
          bgColor: "bg-red-500/10",
          borderColor: "border-red-500/20",
          badgeColor: "bg-red-500/10 text-red-600",
          chartColor: "#ef4444"
        };
      default:
        return {
          label: "Pending",
          icon: <Clock className="w-5 h-5" />,
          color: "text-gray-400",
          bgColor: "bg-gray-100",
          borderColor: "border-gray-200",
          badgeColor: "bg-gray-100 text-gray-500",
          chartColor: "#9ca3af"
        };
    }
  };

  const complianceItems = [
    {
      name: "PF Calculation",
      status: data?.compliance?.pf || "PENDING",
      description: "Provident Fund",
    },
    {
      name: "Gratuity Status",
      status: data?.compliance?.gratuity || "PENDING",
      description: "Gratuity calculations",
    },
    {
      name: "ESI Calculation",
      status: data?.compliance?.esi || "PENDING",
      description: "Employee State Insurance",
    },
    {
      name: "TDS Calculation",
      status: data?.compliance?.tds || "PENDING",
      description: "Tax Deducted at Source",
    },
  ];

  const compliantCount = complianceItems.filter((item) => item.status === "COMPLIANT").length;
  // Calculate counts for chart
  const counts = {
    COMPLIANT: 0,
    PENDING: 0,
    WARNING: 0,
    OVERDUE: 0
  };

  complianceItems.forEach(item => {
    if (counts[item.status] !== undefined) {
      counts[item.status]++;
    } else {
      counts.PENDING++; // default
    }
  });

  const chartSeries = [counts.COMPLIANT, counts.PENDING, counts.WARNING + counts.OVERDUE];
  const chartLabels = ['Compliant', 'Pending', 'Action Needed'];
  const chartColors = ['#10b981', '#3b82f6', '#f59e0b'];

  const chartOptions = {
    chart: {
      type: 'donut',
      fontFamily: 'inherit',
    },
    labels: chartLabels,
    colors: chartColors,
    plotOptions: {
      pie: {
        donut: {
          size: '75%',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '12px',
              fontFamily: 'inherit',
              fontWeight: 500,
              offsetY: -5
            },
            value: {
              show: true,
              fontSize: '24px',
              fontFamily: 'inherit',
              fontWeight: 700,
              color: 'var(--foreground)',
              offsetY: 5,
              formatter: function (val) {
                return val
              }
            },
            total: {
              show: true,
              label: 'Total',
              fontSize: '12px',
              fontFamily: 'inherit',
              fontWeight: 500,
              color: '#64748b',
              formatter: function (w) {
                return w.globals.seriesTotals.reduce((a, b) => a + b, 0)
              }
            }
          }
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      colors: ['transparent'],
      width: 2
    },
    legend: {
      show: false
    },
    tooltip: {
      theme: 'light',
      style: {
        fontSize: '12px',
        fontFamily: 'inherit',
        color: 'var(--foreground)',
        background: 'var(--card)',
      },
      y: {
        formatter: function (val) {
          return val + " Items"
        }
      }
    }
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
          <Shield className="w-6 h-6" />
        </motion.div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-foreground">
            Statutory Compliance
          </h3>
          <p className="text-sm text-muted-foreground">
            {compliantCount} / {complianceItems.length} Compliant
          </p>
        </div>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-6 relative z-10">
        {/* Chart Section */}
        <div className="flex-shrink-0 flex items-center justify-center">
          <ReactApexChart options={chartOptions} series={chartSeries} type="donut" width={160} />
        </div>

        {/* List Section */}
        <div className="flex-1 space-y-3">
          {complianceItems.slice(0, 3).map((item, index) => {
            const config = getStatusConfig(item.status);
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.02, x: 5 }}
                className={`p-3 rounded-xl border ${config.borderColor} ${config.bgColor} backdrop-blur-md transition-all cursor-pointer flex items-center justify-between group/item`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${config.color.replace('text-', 'bg-')}`}></div>
                  <div>
                    <p className="text-sm font-semibold text-foreground leading-tight">{item.name}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{config.label}</p>
                  </div>
                </div>

                <ArrowRight className={`w-4 h-4 ${config.color} opacity-0 group-hover/item:opacity-100 transition-opacity transform group-hover/item:translate-x-1`} />
              </motion.div>
            );
          })}
        </div>
      </div>

      {complianceItems.length > 3 && (
        <motion.div
          className="mt-4 pt-4 border-t border-dashed border-gray-200 dark:border-gray-800 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <span className="text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors font-medium">
            View all {complianceItems.length} compliances
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}
