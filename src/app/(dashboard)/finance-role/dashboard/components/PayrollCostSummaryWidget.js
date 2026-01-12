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
        colors: ['#ffffff', '#ffffff'], // White text for better contrast
      },
      dropShadow: {
        enabled: true,
        top: 2,
        left: 2,
        blur: 4,
        opacity: 0.95,
        color: '#000000'
      },
      offsetY: 0,
      background: {
        enabled: true,
        foreColor: '#ffffff',
        padding: 10,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#ffffff',
        opacity: 0.98,
        dropShadow: {
          enabled: true,
          top: 2,
          left: 2,
          blur: 3,
          opacity: 0.6,
          color: '#000000'
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="glass-card glass-card-hover rounded-2xl p-6 h-full premium-shadow premium-shadow-hover relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 transition-all group-hover:bg-primary/10"></div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-3 mb-6 relative z-10"
      >
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary shadow-md border border-primary/10"
        >
          <DollarSign className="w-6 h-6" />
        </motion.div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-foreground">Payroll Cost Summary</h3>
          <p className="text-sm text-muted-foreground">Current Month Overview</p>
        </div>
      </motion.div>

      <div className="space-y-6 relative z-10">
        {/* Total Payroll Cost */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-4 border border-primary/20"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Total Payroll Cost</span>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                isIncrease
                  ? 'bg-success/20 text-success'
                  : 'bg-destructive/20 text-destructive'
              }`}
            >
              {isIncrease ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {Math.abs(costChange).toFixed(1)}%
            </motion.div>
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent"
          >
            {formatCurrency(data.totalPayrollCost)}
          </motion.h2>
        </motion.div>

        {/* Earnings vs Deductions Chart */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-foreground">Earnings vs Deductions</h4>
          <div className="h-80 flex items-center justify-center -mx-2 relative">
            <ReactApexChart options={chartOptions} series={chartSeries} type="donut" height={320} width="100%" />
          </div>
        </div>

        {/* Breakdown */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="p-3 rounded-lg bg-success/10 border border-success/20"
          >
            <p className="text-xs text-muted-foreground mb-1">Total Earnings</p>
            <p className="text-lg font-bold text-success">{formatCurrency(data.earnings)}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="p-3 rounded-lg bg-destructive/10 border border-destructive/20"
          >
            <p className="text-xs text-muted-foreground mb-1">Total Deductions</p>
            <p className="text-lg font-bold text-destructive">{formatCurrency(data.deductions)}</p>
          </motion.div>
        </div>

        {/* Net Payout */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="pt-4 border-t border-border"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">Net Payout Amount</span>
            <span className="text-2xl font-extrabold text-primary">{formatCurrency(data.netPayout)}</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
