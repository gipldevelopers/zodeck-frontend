"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Loader2 } from "lucide-react";
import dynamic from 'next/dynamic';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function CostTrendWidget() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const mockData = {
        months: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
        costs: [2100000, 2200000, 2300000, 2350000, 2400000, 2450000],
        currentMonth: 'January',
        trend: '+6.5%',
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

  const chartOptions = {
    chart: {
      type: 'line',
      toolbar: { show: false },
      fontFamily: 'inherit',
      sparkline: {
        enabled: false
      }
    },
    stroke: {
      curve: 'smooth',
      width: 3,
      colors: ['hsl(var(--primary))']
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 100],
        colorStops: [
          {
            offset: 0,
            color: 'hsl(var(--primary))',
            opacity: 0.7
          },
          {
            offset: 100,
            color: 'hsl(var(--accent))',
            opacity: 0.3
          }
        ]
      }
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '11px',
        fontFamily: 'inherit',
        fontWeight: 600,
        colors: ['var(--foreground)']
      },
      background: {
        enabled: true,
        foreColor: 'var(--foreground)',
        padding: 4,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: 'var(--border)',
        opacity: 0.9,
      }
    },
    xaxis: {
      categories: data.months,
      labels: {
        style: {
          colors: 'var(--foreground)',
          fontSize: '12px',
          fontFamily: 'inherit',
        }
      },
      axisBorder: {
        show: true,
        color: 'var(--border)',
      },
      axisTicks: {
        show: true,
        color: 'var(--border)',
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: 'var(--foreground)',
          fontSize: '12px',
          fontFamily: 'inherit',
        },
        formatter: function (val) {
          return (val / 1000000).toFixed(1) + 'M';
        }
      }
    },
    grid: {
      borderColor: 'var(--border)',
      strokeDashArray: 4,
      xaxis: {
        lines: {
          show: true
        }
      },
      yaxis: {
        lines: {
          show: true
        }
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
    colors: ['hsl(var(--primary))'],
    markers: {
      size: 5,
      colors: ['hsl(var(--primary))'],
      strokeColors: '#fff',
      strokeWidth: 2,
      hover: {
        size: 7
      }
    }
  };

  const chartSeries = [{
    name: 'Payroll Cost',
    data: data.costs
  }];

  const latestCost = data.costs[data.costs.length - 1];
  const previousCost = data.costs[data.costs.length - 2];
  const change = ((latestCost - previousCost) / previousCost) * 100;

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
        className="flex items-center justify-between mb-6 relative z-10"
      >
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary shadow-md border border-primary/10"
          >
            <TrendingUp className="w-6 h-6" />
          </motion.div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Cost Trend Snapshot</h3>
            <p className="text-sm text-muted-foreground">Month-on-Month Analysis</p>
          </div>
        </div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: "spring" }}
          className="px-3 py-1.5 rounded-full bg-success/20 text-success text-xs font-bold border border-success/30"
        >
          {data.trend}
        </motion.div>
      </motion.div>

      <div className="space-y-4 relative z-10">
        {/* Current Month Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20"
        >
          <div>
            <p className="text-xs text-muted-foreground mb-1">{data.currentMonth} 2026</p>
            <p className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              {formatCurrency(latestCost)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">vs Previous</p>
            <p className={`text-sm font-bold ${change >= 0 ? 'text-success' : 'text-destructive'}`}>
              {change >= 0 ? '+' : ''}{change.toFixed(1)}%
            </p>
          </div>
        </motion.div>

        {/* Chart */}
        <div className="h-64 -mx-2">
          <ReactApexChart options={chartOptions} series={chartSeries} type="line" height="100%" />
        </div>

        {/* Trend Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-3 gap-3 pt-4 border-t border-border"
        >
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Lowest</p>
            <p className="text-sm font-bold text-foreground">
              {formatCurrency(Math.min(...data.costs))}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Average</p>
            <p className="text-sm font-bold text-foreground">
              {formatCurrency(data.costs.reduce((a, b) => a + b, 0) / data.costs.length)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Highest</p>
            <p className="text-sm font-bold text-foreground">
              {formatCurrency(Math.max(...data.costs))}
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
