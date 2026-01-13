"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DollarSign, TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import dynamic from 'next/dynamic';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function PayrollCostSummaryWidget() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const mockData = {
        totalPayrollCost: 2450000,
        earnings: 2850000,
        deductions: 400000,
        netPayout: 2450000,
        previousMonth: 2300000,
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

  const costChange = ((data.totalPayrollCost - data.previousMonth) / data.previousMonth) * 100;
  const isIncrease = costChange > 0;

  // Earnings vs Deductions Chart
  const chartOptions = {
    chart: {
      type: 'donut',
      fontFamily: 'inherit',
      toolbar: { show: false },
    },
    labels: ['Earnings', 'Deductions'],
    colors: ['hsl(var(--success))', 'hsl(var(--destructive))'],
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '14px',
              fontFamily: 'inherit',
              fontWeight: 600,
              color: 'var(--foreground)',
              offsetY: -10
            },
            value: {
              show: true,
              fontSize: '24px',
              fontFamily: 'inherit',
              fontWeight: 700,
              color: 'var(--foreground)',
              offsetY: 10,
              formatter: function (val) {
                return formatCurrency(data.netPayout);
              }
            },
            total: {
              show: false
            }
          }
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function(val, opts) {
        return val.toFixed(0) + '%';
      },
      style: {
        fontSize: '14px',
        fontFamily: 'inherit',
        fontWeight: 700,
        colors: ['hsl(var(--primary-foreground))', 'hsl(var(--primary-foreground))'], // Using CSS variable for text
      },
      dropShadow: {
        enabled: true,
        top: 2,
        left: 2,
        blur: 4,
        opacity: 0.95,
        color: 'hsl(var(--foreground))'
      },
      offsetY: 0,
      background: {
        enabled: true,
        foreColor: 'hsl(var(--primary-foreground))',
        padding: 10,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: 'hsl(var(--primary-foreground))',
        opacity: 0.98,
        dropShadow: {
          enabled: true,
          top: 2,
          left: 2,
          blur: 3,
          opacity: 0.6,
          color: 'hsl(var(--foreground))'
        }
      }
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
      labels: {
        colors: 'var(--foreground)',
        useSeriesColors: false,
        fontSize: '13px',
        fontFamily: 'inherit',
        fontWeight: 600,
      },
      markers: {
        width: 14,
        height: 14,
        radius: 7,
        offsetX: -5,
        offsetY: 0
      },
      itemMargin: {
        horizontal: 15,
        vertical: 8
      },
      formatter: function(seriesName, opts) {
        const val = opts.w.globals.series[opts.seriesIndex];
        const percent = ((val / (data.earnings + data.deductions)) * 100).toFixed(0);
        return seriesName + ' (' + percent + '%)';
      }
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
          return formatCurrency(val);
        }
      }
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    }
  };

  const chartSeries = [data.earnings, data.deductions];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, scale: 1.01 }}
      className="glass-card glass-card-hover rounded-3xl p-6 sm:p-8 h-full premium-shadow premium-shadow-hover relative overflow-hidden group border border-primary/10"
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
        className="absolute top-0 right-0 w-60 h-60 bg-primary/10 rounded-full blur-3xl -mr-30 -mt-30 transition-all group-hover:bg-primary/20"
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
        className="absolute bottom-0 left-0 w-48 h-48 bg-accent/10 rounded-full blur-3xl -ml-24 -mb-24"
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
          className="p-4 rounded-2xl bg-gradient-to-br from-primary/30 via-primary/20 to-primary/10 text-primary shadow-xl border-2 border-primary/20 relative overflow-hidden"
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
          <DollarSign className="w-7 h-7 relative z-10" />
        </motion.div>
        <div className="flex-1">
          <motion.h3
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-xl font-extrabold text-foreground mb-1"
          >
            Payroll Cost Summary
          </motion.h3>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-sm text-muted-foreground"
          >
            Current Month Overview
          </motion.p>
        </div>
      </motion.div>

      <div className="space-y-6 relative z-10">
        {/* Total Payroll Cost */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className="relative bg-gradient-to-br from-primary/15 via-primary/10 to-accent/10 rounded-2xl p-5 sm:p-6 border-2 border-primary/20 shadow-lg overflow-hidden group/card"
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20"
          />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-muted-foreground">Total Payroll Cost</span>
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.6, type: "spring", stiffness: 300 }}
                whileHover={{ scale: 1.1 }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-md ${
                  isIncrease
                    ? 'bg-success/30 text-success border border-success/30'
                    : 'bg-destructive/30 text-destructive border border-destructive/30'
                }`}
              >
                {isIncrease ? (
                  <motion.div
                    animate={{ y: [0, -2, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                  </motion.div>
                ) : (
                  <motion.div
                    animate={{ y: [0, 2, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <TrendingDown className="w-3.5 h-3.5" />
                  </motion.div>
                )}
                {Math.abs(costChange).toFixed(1)}%
              </motion.div>
            </div>
            <motion.h2
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%]"
            >
              <motion.span
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="inline-block"
              >
                {formatCurrency(data.totalPayrollCost)}
              </motion.span>
            </motion.h2>
          </div>
        </motion.div>

        {/* Earnings vs Deductions Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, type: "spring" }}
          className="space-y-4"
        >
          <motion.h4
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="text-sm font-bold text-foreground flex items-center gap-2"
          >
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-primary"
            />
            Earnings vs Deductions
          </motion.h4>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
            className="h-80 flex items-center justify-center -mx-2 relative"
          >
            <ReactApexChart options={chartOptions} series={chartSeries} type="donut" height={320} width="100%" />
          </motion.div>
        </motion.div>

        {/* Breakdown */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="grid grid-cols-2 gap-4"
        >
          <motion.div
            initial={{ opacity: 0, x: -30, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: 1, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.05, x: 5 }}
            className="relative p-4 rounded-2xl bg-gradient-to-br from-success/20 to-success/10 border-2 border-success/30 shadow-lg overflow-hidden group/earnings"
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
              className="absolute inset-0 bg-success/20 rounded-full blur-2xl"
            />
            <div className="relative z-10">
              <p className="text-xs font-semibold text-muted-foreground mb-2">Total Earnings</p>
              <motion.p
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.1, type: "spring" }}
                className="text-xl font-extrabold text-success"
              >
                {formatCurrency(data.earnings)}
              </motion.p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: 1.1, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.05, x: -5 }}
            className="relative p-4 rounded-2xl bg-gradient-to-br from-destructive/20 to-destructive/10 border-2 border-destructive/30 shadow-lg overflow-hidden group/deductions"
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
              className="absolute inset-0 bg-destructive/20 rounded-full blur-2xl"
            />
            <div className="relative z-10">
              <p className="text-xs font-semibold text-muted-foreground mb-2">Total Deductions</p>
              <motion.p
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, type: "spring" }}
                className="text-xl font-extrabold text-destructive"
              >
                {formatCurrency(data.deductions)}
              </motion.p>
            </div>
          </motion.div>
        </motion.div>

        {/* Net Payout */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1.3, type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.02 }}
          className="relative pt-6 mt-6 border-t-2 border-border/50"
        >
          <motion.div
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 bg-[length:200%_100%] opacity-50"
          />
          <div className="relative z-10 flex items-center justify-between p-4 rounded-xl">
            <span className="text-sm font-bold text-foreground">Net Payout Amount</span>
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.4, type: "spring" }}
              className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent"
            >
              {formatCurrency(data.netPayout)}
            </motion.span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
