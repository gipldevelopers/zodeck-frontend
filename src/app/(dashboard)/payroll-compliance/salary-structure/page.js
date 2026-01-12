"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, Layers, Wallet, Users, CalendarRange, RefreshCcw, Loader2, TrendingUp, DollarSign, CheckCircle2, Clock } from "lucide-react";
import Breadcrumb from "@/components/common/Breadcrumb";
import { toast } from "react-hot-toast";
import dynamic from 'next/dynamic';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const tabs = [
  { id: "ctc", label: "CTC Structures", icon: Layers },
  { id: "components", label: "Earnings & Deductions", icon: Wallet },
  { id: "assignment", label: "Assign to Employees", icon: Users },
  { id: "effective-dates", label: "Effective Dates", icon: CalendarRange },
  { id: "revisions", label: "Salary Revisions", icon: RefreshCcw },
];

export default function PayrollComplianceSalaryStructurePage() {
  const [activeTab, setActiveTab] = useState("ctc");
  const [salaryStructures, setSalaryStructures] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === "ctc") {
      fetchSalaryStructures();
      fetchStats();
    }
  }, [activeTab]);

  const fetchSalaryStructures = async () => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock salary structures data
      const mockStructures = [
        {
          id: 1,
          name: "Standard CTC – Mid Level",
          description: "Default structure for mid-level employees",
          ctcRange: "₹5L - ₹10L",
          band: "Band 3",
          effectiveFrom: "2024-01-01",
          status: "ACTIVE",
        },
        {
          id: 2,
          name: "Senior Executive CTC",
          description: "Structure for senior executives",
          ctcRange: "₹10L - ₹20L",
          band: "Band 4",
          effectiveFrom: "2024-01-01",
          status: "ACTIVE",
        },
        {
          id: 3,
          name: "Junior Level CTC",
          description: "Entry-level employee structure",
          ctcRange: "₹2L - ₹5L",
          band: "Band 2",
          effectiveFrom: "2024-01-01",
          status: "ACTIVE",
        },
      ];
      
      setSalaryStructures(mockStructures);
    } catch (error) {
      console.error("Error fetching salary structures:", error);
      toast.error(error.message || "Failed to fetch salary structures");
      setSalaryStructures([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Mock stats data
      const mockStats = {
        totalStructures: 12,
        activeStructures: 10,
        assignedEmployees: 185,
        pendingAssignments: 15,
      };
      
      setStats(mockStats);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "ctc":
        return (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  CTC Structures
                </h3>
                <p className="text-sm text-muted-foreground">
                  Define modular CTC templates for different bands and roles.
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary inline-flex items-center gap-2"
              >
                <PlusCircle size={18} />
                Create New Structure
              </motion.button>
            </div>

            <div className="glass-card rounded-xl p-4 premium-shadow">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      <th className="px-4 py-3 text-left">Structure Name</th>
                      <th className="px-4 py-3 text-left">CTC Range</th>
                      <th className="px-4 py-3 text-left">Band / Grade</th>
                      <th className="px-4 py-3 text-left">Effective From</th>
                      <th className="px-4 py-3 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {[
                      { name: "Standard CTC – Mid Level", desc: "Default structure for mid-level employees", range: "₹8,00,000 – ₹12,00,000", band: "Band 3 / Grade C", date: "01 Jan 2026", status: "Active", statusColor: "success" },
                      { name: "Leadership CTC – Senior", desc: "Higher variable and bonus components", range: "₹20,00,000 – ₹35,00,000", band: "Band 5 / Grade E", date: "01 Apr 2026", status: "Draft", statusColor: "warning" },
                    ].map((row, index) => (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.01, backgroundColor: "hsl(var(--muted))" }}
                        className="transition-colors cursor-pointer"
                      >
                        <td className="px-4 py-3">
                          <p className="font-semibold text-foreground">
                            {row.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {row.desc}
                          </p>
                        </td>
                        <td className="px-4 py-3 text-foreground font-medium">
                          {row.range}
                        </td>
                        <td className="px-4 py-3 text-foreground">
                          {row.band}
                        </td>
                        <td className="px-4 py-3 text-foreground">
                          {row.date}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex rounded-full bg-${row.statusColor}/20 px-2.5 py-0.5 text-xs font-semibold text-${row.statusColor} border border-${row.statusColor}/20`}>
                            {row.status}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case "components":
        return (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  Earnings & Deductions
                </h3>
                <p className="text-sm text-muted-foreground">
                  Configure reusable pay components with tax & compliance tags.
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-accent inline-flex items-center gap-2"
              >
                <PlusCircle size={18} />
                Add Component
              </motion.button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="rounded-xl border border-border bg-card/80 p-4 shadow-md backdrop-blur-sm"
              >
                <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-success/20 text-success text-xs font-bold">
                  </span>
                  Earnings
                </h4>
                <ul className="space-y-2 text-sm text-foreground">
                  <li className="flex items-center justify-between">
                    <span>Basic</span>
                    <span className="text-xs text-muted-foreground">40% of CTC • Taxable</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>HRA</span>
                    <span className="text-xs text-muted-foreground">50% of Basic • Partially Exempt</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Special Allowance</span>
                    <span className="text-xs text-muted-foreground">Balance • Taxable</span>
                  </li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.02 }}
                className="rounded-xl border border-border bg-card/80 p-4 shadow-md backdrop-blur-sm"
              >
                <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-destructive/20 text-destructive text-xs font-bold">
                  </span>
                  Deductions
                </h4>
                <ul className="space-y-2 text-sm text-foreground">
                  <li className="flex items-center justify-between">
                    <span>PF Employee Share</span>
                    <span className="text-xs text-muted-foreground">12% of Basic • Statutory</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Professional Tax</span>
                    <span className="text-xs text-muted-foreground">Slab-wise • Location based</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Advance Recovery</span>
                    <span className="text-xs text-muted-foreground">Custom • Non-Statutory</span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        );
      case "assignment":
        return (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  Assign Salary Structure
                </h3>
                <p className="text-sm text-muted-foreground">
                  Map employees or groups to salary structures with effective dates.
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary inline-flex items-center gap-2"
              >
                <PlusCircle size={18} />
                New Assignment
              </motion.button>
            </div>

            <div className="rounded-xl border border-border bg-card/80 p-4 shadow-md backdrop-blur-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      <th className="px-4 py-3 text-left">Employee / Group</th>
                      <th className="px-4 py-3 text-left">Structure</th>
                      <th className="px-4 py-3 text-left">Effective From</th>
                      <th className="px-4 py-3 text-left">Effective To</th>
                      <th className="px-4 py-3 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileHover={{ scale: 1.01, backgroundColor: "hsl(var(--muted))" }}
                      className="transition-colors cursor-pointer"
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground">
                          Engineering – Level 2
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Department group assignment
                        </p>
                      </td>
                      <td className="px-4 py-3 text-foreground">
                        Standard CTC – Mid Level
                      </td>
                      <td className="px-4 py-3 text-foreground">
                        01 Feb 2026
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        Ongoing
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex rounded-full bg-primary/20 px-2.5 py-0.5 text-xs font-semibold text-primary">
                          Applied
                        </span>
                      </td>
                    </motion.tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case "effective-dates":
        return (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  Effective Date Management
                </h3>
                <p className="text-sm text-muted-foreground">
                  Plan salary changes and ensure smooth payroll cut-over.
                </p>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card rounded-xl p-6 premium-shadow relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-all"></div>
              <p className="text-sm text-foreground relative z-10">
                Visual timeline and conflict checks for future-dated changes will appear here.
                Use this view to review overlapping structures before payroll run.
              </p>
            </motion.div>
          </div>
        );
      case "revisions":
        return (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  Salary Revision Handling
                </h3>
                <p className="text-sm text-muted-foreground">
                  Track increment cycles, promotions, and retro-impact on payroll.
                </p>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card rounded-xl p-6 premium-shadow relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-accent/10 transition-all"></div>
              <p className="text-sm text-foreground relative z-10">
                Salary revision workflows (approval, effective date, retro calculation) can be
                configured here. For now this section is a visual placeholder ready for API
                integration.
              </p>
            </motion.div>
          </div>
        );
      default:
        return null;
    }
  };

  // Stats chart data
  const statsChartOptions = {
    chart: {
      type: 'bar',
      toolbar: { show: false },
      fontFamily: 'inherit',
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        columnWidth: '60%',
      }
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: ['Total', 'Active', 'Assigned', 'Pending'],
    },
    yaxis: { labels: { show: false } },
    colors: ['hsl(var(--primary))'],
    tooltip: {
      theme: 'light',
      style: {
        fontSize: '12px',
        fontFamily: 'inherit',
        color: 'var(--foreground)'
      },
    }
  };

  const statsChartSeries = [{
    name: 'Count',
    data: [
      stats?.totalStructures || 0,
      stats?.activeStructures || 0,
      stats?.assignedEmployees || 0,
      stats?.pendingAssignments || 0,
    ]
  }];

  return (
    <div className="bg-background min-h-screen p-4 sm:p-6">
      <Breadcrumb />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-4 mb-6 glass-card rounded-2xl p-6 premium-shadow relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-primary/10 transition-all"></div>
        
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between relative z-10">
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="p-4 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary shadow-lg border border-primary/10"
            >
              <Layers className="w-8 h-8" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold text-gradient-primary">
                Salary Structure Management
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Define and maintain employee salary components, CTC templates, and effective dates
                across your organisation.
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary inline-flex items-center gap-2"
          >
            <PlusCircle size={18} />
            Quick Create CTC
          </motion.button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 relative z-10">
            {[
              { label: "Total Structures", value: stats.totalStructures, icon: Layers, color: "primary" },
              { label: "Active", value: stats.activeStructures, icon: CheckCircle2, color: "success" },
              { label: "Assigned Employees", value: stats.assignedEmployees, icon: Users, color: "accent" },
              { label: "Pending", value: stats.pendingAssignments, icon: Clock, color: "warning" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="glass-card rounded-xl p-4 border border-border/50 text-center"
              >
                <div className={`inline-flex p-2 rounded-lg bg-${stat.color}/10 text-${stat.color} mb-2`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Stats Chart */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 glass-card rounded-xl p-6 premium-shadow"
        >
          <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Structure Overview
          </h3>
          <ReactApexChart options={statsChartOptions} series={statsChartSeries} type="bar" height={200} />
        </motion.div>
      )}

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card rounded-2xl premium-shadow"
      >
        <div className="flex flex-wrap gap-2 border-b border-border px-3 pt-3 sm:px-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 rounded-t-lg px-3 py-2 text-xs font-medium transition-all sm:px-4 sm:text-sm relative ${
                  isActive
                    ? "bg-card text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        <div className="p-4 sm:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

