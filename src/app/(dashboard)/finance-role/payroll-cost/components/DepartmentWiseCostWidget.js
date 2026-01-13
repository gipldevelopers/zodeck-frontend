"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Building2, Loader2 } from "lucide-react";
import dynamic from 'next/dynamic';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function DepartmentWiseCostWidget() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const mockData = {
        departments: [
          { name: 'Engineering', cost: 850000, employees: 45, percentage: 34.7 },
          { name: 'Sales', cost: 620000, employees: 32, percentage: 25.3 },
          { name: 'Marketing', cost: 480000, employees: 25, percentage: 19.6 },
          { name: 'HR', cost: 280000, employees: 15, percentage: 11.4 },
          { name: 'Operations', cost: 220000, employees: 8, percentage: 9.0 },
        ],
        totalCost: 2450000,
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
      type: 'bar',
      fontFamily: 'inherit',
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '60%',
        borderRadius: 8,
        dataLabels: {
          position: 'top',
        },
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return formatCurrency(val);
      },
      offsetY: -20,
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
      categories: data.departments.map(d => d.name),
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
          return (val / 100000).toFixed(0) + 'L';
        }
      }
    },
    grid: {
      borderColor: 'var(--border)',
      strokeDashArray: 4,
      xaxis: {
        lines: {
          show: false
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
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.8,
        opacityTo: 0.6,
        stops: [0, 100],
        colorStops: [
          {
            offset: 0,
            color: 'hsl(var(--primary))',
            opacity: 0.8
          },
          {
            offset: 100,
            color: 'hsl(var(--accent))',
            opacity: 0.6
          }
        ]
      }
    }
  };

  const chartSeries = [{
    name: 'Payroll Cost',
    data: data.departments.map(d => d.cost)
  }];

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
          <Building2 className="w-6 h-6" />
        </motion.div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-foreground">Department-wise Payroll Cost</h3>
          <p className="text-sm text-muted-foreground">Cost breakdown by department</p>
        </div>
      </motion.div>

      <div className="space-y-4 relative z-10">
        {/* Chart */}
        <div className="h-80 -mx-2">
          <ReactApexChart options={chartOptions} series={chartSeries} type="bar" height="100%" />
        </div>

        {/* Department List */}
        <div className="space-y-2 pt-4 border-t border-border">
          {data.departments.map((dept, index) => (
            <motion.div
              key={dept.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: `hsl(var(--primary))` }}></div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{dept.name}</p>
                  <p className="text-xs text-muted-foreground">{dept.employees} employees</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-foreground">{formatCurrency(dept.cost)}</p>
                <p className="text-xs text-muted-foreground">{dept.percentage}%</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
