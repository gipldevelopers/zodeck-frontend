"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, XCircle, TrendingUp, Loader2 } from "lucide-react";
import dynamic from 'next/dynamic';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function PayrollStatusWidget() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const mockData = {
        payrollStatus: "IN_PROGRESS",
        employeesProcessed: 145,
        totalEmployees: 200,
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
        <Loader2 className="w-8 h-8 animate-spin text-brand-600 dark:text-brand-400" />
      </motion.div>
    );
  }

  const status = data?.payrollStatus || "NOT_STARTED";
  const processedCount = data?.employeesProcessed || 0;
  const totalEmployees = data?.totalEmployees || 0;
  const progressPercentage = totalEmployees > 0 ? (processedCount / totalEmployees) * 100 : 0;

  const getStatusConfig = (status) => {
    switch (status) {
      case "COMPLETED":
        return {
          label: "Completed",
          icon: <CheckCircle2 className="w-6 h-6" />,
          color: "#10b981", // Success green
          gradient: {
            shade: 'dark',
            type: 'horizontal',
            shadeIntensity: 0.5,
            gradientToColors: ['#34d399'],
            inverseColors: true,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100]
          }
        };
      case "IN_PROGRESS":
        return {
          label: "In Progress",
          icon: <Clock className="w-6 h-6" />,
          color: "#0f766e", // Primary teal/emerald
          gradient: {
            shade: 'dark',
            type: 'horizontal',
            shadeIntensity: 0.5,
            gradientToColors: ['#2dd4bf'],
            inverseColors: true,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100]
          }
        };
      default:
        return {
          label: "Not Started",
          icon: <XCircle className="w-6 h-6" />,
          color: "#6b7280", // Gray
          gradient: {
            shade: 'dark',
            type: 'horizontal',
            shadeIntensity: 0.5,
            gradientToColors: ['#9ca3af'],
            inverseColors: true,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100]
          }
        };
    }
  };

  const statusConfig = getStatusConfig(status);

  const chartOptions = {
    chart: {
      type: 'radialBar',
      offsetY: -10,
      sparkline: {
        enabled: true
      }
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        track: {
          background: "#e2e8f0",
          strokeWidth: '97%',
          margin: 5, // margin is in pixels
          dropShadow: {
            enabled: true,
            top: 2,
            left: 0,
            color: '#999',
            opacity: 1,
            blur: 2
          }
        },
        dataLabels: {
          name: {
            show: false
          },
          value: {
            offsetY: -2,
            fontSize: '22px',
            fontWeight: 'bold',
            formatter: function (val) {
              return val.toFixed(0) + "%";
            }
          }
        },
        hollow: {
          size: "65%"
        }
      }
    },
    grid: {
      padding: {
        top: -10
      }
    },
    fill: {
      type: 'gradient',
      gradient: statusConfig.gradient
    },
    labels: ['Progress'],
    colors: [statusConfig.color],
    stroke: {
      lineCap: 'round'
    },
  };

  const chartSeries = [progressPercentage];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="glass-card glass-card-hover rounded-2xl p-6 h-full premium-shadow premium-shadow-hover relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-brand-500/10"></div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-3 mb-2 relative z-10"
      >
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className={`p-3 rounded-xl bg-${status === 'IN_PROGRESS' ? 'primary' : status === 'COMPLETED' ? 'success' : 'gray'}-50 text-${status === 'IN_PROGRESS' ? 'primary' : status === 'COMPLETED' ? 'success' : 'gray'}-500 shadow-md`}
        >
          {statusConfig.icon}
        </motion.div>
        <div>
          <h3 className="text-lg font-bold text-foreground">Payroll Status</h3>
          <p className="text-sm text-muted-foreground">Current Month</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-4 items-center mt-2 relative z-10">
        <div>
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="flex flex-col"
          >
            <span className="text-3xl font-bold text-gradient-primary">
              {processedCount}
              <span className="text-sm text-muted-foreground font-medium ml-1">/ {totalEmployees}</span>
            </span>
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">Employees Processed</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-1.5 mt-4 bg-white/50 dark:bg-black/20 backdrop-blur-sm w-fit px-3 py-1.5 rounded-full border border-white/20"
          >
            <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></div>
            <span className="text-xs font-medium text-brand-700 dark:text-brand-300">{statusConfig.label}</span>
          </motion.div>
        </div>

        <div className="h-32 flex items-center justify-center -mr-4">
          <ReactApexChart options={chartOptions} series={chartSeries} type="radialBar" height={180} />
        </div>
      </div>

      {/* Decorative pulse line at bottom */}
      <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-${status === 'IN_PROGRESS' ? 'primary' : 'gray'}-500 to-transparent w-full opacity-50`}></div>
    </motion.div>
  );
}
