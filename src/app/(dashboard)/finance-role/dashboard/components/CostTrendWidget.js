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
      strokeColors: 'hsl(var(--card))',
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
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className="relative flex items-center justify-between p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-primary/15 via-primary/10 to-accent/10 border-2 border-primary/20 shadow-lg overflow-hidden group/stats"
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
            className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 bg-[length:200%_100%]"
          />
          <div className="relative z-10 flex items-center justify-between w-full">
            <div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-xs font-semibold text-muted-foreground mb-2"
              >
                {data.currentMonth} 2026
              </motion.p>
              <motion.p
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, type: "spring" }}
                className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%]"
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
                  {formatCurrency(latestCost)}
                </motion.span>
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, type: "spring" }}
              className="text-right"
            >
              <p className="text-xs font-semibold text-muted-foreground mb-1">vs Previous</p>
              <motion.p
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className={`text-sm font-bold ${change >= 0 ? 'text-success' : 'text-destructive'}`}
              >
                {change >= 0 ? '+' : ''}{change.toFixed(1)}%
              </motion.p>
            </motion.div>
          </div>
        </motion.div>

        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, type: "spring" }}
          className="h-64 -mx-2 relative"
        >
          <ReactApexChart options={chartOptions} series={chartSeries} type="line" height="100%" />
        </motion.div>

        {/* Trend Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="grid grid-cols-3 gap-4 pt-6 border-t-2 border-border/50"
        >
          {[
            { label: 'Lowest', value: Math.min(...data.costs), delay: 1 },
            { label: 'Average', value: data.costs.reduce((a, b) => a + b, 0) / data.costs.length, delay: 1.1 },
            { label: 'Highest', value: Math.max(...data.costs), delay: 1.2 },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: stat.delay, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.05, y: -3 }}
              className="relative text-center p-4 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border shadow-md overflow-hidden"
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
                  delay: index * 0.2,
                }}
                className="absolute inset-0 bg-primary/10 rounded-full blur-xl"
              />
              <div className="relative z-10">
                <p className="text-xs font-semibold text-muted-foreground mb-2">{stat.label}</p>
                <motion.p
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: stat.delay + 0.1, type: "spring" }}
                  className="text-lg font-extrabold text-foreground"
                >
                  {formatCurrency(stat.value)}
                </motion.p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
