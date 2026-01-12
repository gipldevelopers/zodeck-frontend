"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Calendar, UserCheck, Pause, Loader2, ExternalLink, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import dynamic from 'next/dynamic';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function PayrollExceptionsWidget() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const mockData = {
        missingAttendance: 8,
        missingSalaryStructure: 3,
        onHoldEmployees: 2,
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

  const exceptions = [
    {
      type: "missingAttendance",
      label: "Missing Attendance",
      count: data?.missingAttendance || 0,
      icon: <Calendar className="w-5 h-5" />,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
    },
    {
      type: "missingSalaryStructure",
      label: "Missing Salary",
      count: data?.missingSalaryStructure || 0,
      icon: <UserCheck className="w-5 h-5" />,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/20",
    },
    {
      type: "onHoldEmployees",
      label: "On-Hold",
      count: data?.onHoldEmployees || 0,
      icon: <Pause className="w-5 h-5" />,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
    },
  ];

  const totalExceptions = exceptions.reduce((sum, ex) => sum + ex.count, 0);

  // Chart Configuration
  const chartSeries = [{
    name: 'Exceptions',
    data: exceptions.map(ex => ex.count)
  }];

  const chartOptions = {
    chart: {
      type: 'bar',
      toolbar: { show: false },
      fontFamily: 'inherit'
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: true,
        barHeight: '40%',
        margin: 5,
        distributed: true
      }
    },
    dataLabels: {
      enabled: true,
      textAnchor: 'start',
      style: {
        colors: ['#fff']
      },
      formatter: function (val, opt) {
        return val > 0 ? val : ''
      },
      offsetX: 0,
    },
    xaxis: {
      categories: exceptions.map(ex => ex.label),
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        show: true,
        style: {
          colors: 'var(--foreground)',
          fontSize: '12px'
        }
      }
    },
    grid: {
      show: false,
      padding: {
        top: -20,
        right: 0,
        bottom: -15,
        left: -10
      }
    },
    colors: ['hsl(var(--primary))', '#ef4444', '#8b5cf6'],
    legend: { show: false },
    tooltip: {
      theme: 'light',
      style: {
        fontSize: '12px',
        fontFamily: 'inherit'
      },
      y: {
        formatter: function(val) {
          return val + ' exceptions'
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
      <div className="absolute top-0 right-0 w-32 h-32 bg-warning/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-warning/10"></div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-3 mb-4 relative z-10"
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
          className="p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 text-amber-500 shadow-md border border-amber-500/10"
        >
          <AlertTriangle className="w-6 h-6" />
        </motion.div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-foreground">Payroll Exceptions</h3>
          <p className="text-sm text-muted-foreground">Requires attention</p>
        </div>
        {totalExceptions > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="px-3 py-1 rounded-full bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400 text-sm font-bold shadow-sm"
          >
            {totalExceptions}
          </motion.div>
        )}
      </motion.div>

      {/* Chart */}
      {totalExceptions > 0 && (
        <div className="mb-4 h-32 -ml-2 relative z-10">
          <ReactApexChart options={chartOptions} series={chartSeries} type="bar" height="100%" />
        </div>
      )}

      <div className="space-y-3 relative z-10">
        {exceptions.map((exception, index) => (
          exception.count > 0 && ( /* Only show distinct non-zero in list if desired, but here showing all for consistency? let's show all */
            <motion.div
              key={exception.type}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.01, x: 2 }}
              className={`p-3 rounded-xl border ${exception.borderColor} ${exception.bgColor} backdrop-blur-sm transition-all cursor-pointer flex items-center justify-between`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${exception.color.replace('text-', 'bg-').replace('500', '100')} dark:bg-opacity-20`}
                >
                  {exception.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {exception.label}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {exception.count} Affected
                  </p>
                </div>
              </div>

              <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-50 transition-opacity" />
            </motion.div>
          )
        ))}

        {totalExceptions === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center py-8"
          >
            <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-500 mb-3" />
            <p className="text-sm text-muted-foreground">All clear! No exceptions found.</p>
          </motion.div>
        )}

        {totalExceptions > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href="/hr/payroll/process"
              className="mt-2 flex items-center justify-center gap-2 w-full py-2.5 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all font-medium text-sm"
            >
              <span>Review All Exceptions</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
