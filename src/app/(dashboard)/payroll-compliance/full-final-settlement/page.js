"use client";

import React, { useState, useEffect } from "react";
import {
  FileCheck,
  Calculator,
  Receipt,
  Package,
  Download,
  Search,
  User,
  Calendar,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Clock,
  Loader2,
  ArrowRight,
  FileText,
  UserX,
  CreditCard
} from "lucide-react";
import Breadcrumb from "@/components/common/Breadcrumb";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from 'next/dynamic';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const tabs = [
  { id: "pending", label: "Pending Settlements", icon: Clock },
  { id: "calculate", label: "Calculate Settlement", icon: Calculator },
  { id: "cleared", label: "Cleared Settlements", icon: CheckCircle2 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function FullFinalSettlementPage() {
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (activeTab === "pending" || activeTab === "cleared") {
      fetchSettlements();
    }
  }, [activeTab]);

  // Mock employee data
  const mockEmployees = [
    { id: 1, name: "John Doe", employeeId: "EMP001", department: "Engineering", email: "john.doe@company.com" },
    { id: 2, name: "Jane Smith", employeeId: "EMP002", department: "HR", email: "jane.smith@company.com" },
    { id: 3, name: "Mike Johnson", employeeId: "EMP003", department: "Sales", email: "mike.johnson@company.com" },
    { id: 4, name: "Sarah Williams", employeeId: "EMP004", department: "Marketing", email: "sarah.williams@company.com" },
    { id: 5, name: "David Brown", employeeId: "EMP005", department: "Finance", email: "david.brown@company.com" },
  ];

  const fetchEmployees = async (query = "") => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    if (query.length > 2) {
      const filtered = mockEmployees.filter(emp =>
        emp.name.toLowerCase().includes(query.toLowerCase()) ||
        emp.employeeId.toLowerCase().includes(query.toLowerCase()) ||
        emp.department.toLowerCase().includes(query.toLowerCase())
      );
      setEmployees(filtered);
    } else {
      setEmployees([]);
    }
  };

  const fetchSettlements = async () => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock settlements data
      const today = new Date();
      const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 15);
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);

      const mockSettlements = [
        {
          id: 1,
          employee: { name: "John Doe", employeeId: "EMP001", department: "Engineering", profileImage: null },
          resignationDate: lastMonth.toISOString(),
          lastWorkingDate: nextWeek.toISOString(),
          status: activeTab === "pending" ? "PENDING" : "COMPLETED",
          clearanceStatus: "PENDING",
          totalSettlement: 125000,
        },
        {
          id: 2,
          employee: { name: "Jane Smith", employeeId: "EMP002", department: "HR", profileImage: null },
          resignationDate: new Date(today.getFullYear(), today.getMonth() - 1, 20).toISOString(),
          lastWorkingDate: new Date(today.getFullYear(), today.getMonth(), 5).toISOString(),
          status: activeTab === "pending" ? "IN_PROGRESS" : "COMPLETED",
          clearanceStatus: "IN_PROGRESS",
          totalSettlement: 98000,
        },
        {
          id: 3,
          employee: { name: "Mike Johnson", employeeId: "EMP003", department: "Sales", profileImage: null },
          resignationDate: new Date(today.getFullYear(), today.getMonth() - 2, 10).toISOString(),
          lastWorkingDate: new Date(today.getFullYear(), today.getMonth() - 1, 1).toISOString(),
          status: activeTab === "pending" ? "PENDING" : "COMPLETED",
          clearanceStatus: "COMPLETED",
          totalSettlement: 156000,
        },
      ];

      setSettlements(mockSettlements);
    } catch (error) {
      console.error("Error fetching settlements:", error);
      toast.error(error.message || "Failed to fetch settlements");
      setSettlements([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.length > 2) {
      fetchEmployees(query);
    } else {
      setEmployees([]);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const config = {
      PENDING: {
        label: "Pending",
        className: "text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800",
      },
      IN_PROGRESS: {
        label: "In Progress",
        className: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
      },
      COMPLETED: {
        label: "Completed",
        className: "text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
      },
      ON_HOLD: {
        label: "On Hold",
        className: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
      },
    };
    const statusConfig = config[status] || config.PENDING;
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusConfig.className}`}>
        {statusConfig.label}
      </span>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "pending":
        return (
          <PendingSettlementsTab
            settlements={settlements.filter((s) => s.status !== "COMPLETED")}
            loading={loading}
            getStatusBadge={getStatusBadge}
            formatCurrency={formatCurrency}
          />
        );
      case "calculate":
        return (
          <CalculateSettlementTab
            selectedEmployee={selectedEmployee}
            setSelectedEmployee={setSelectedEmployee}
            employees={employees}
            searchQuery={searchQuery}
            onSearch={handleSearch}
            formatCurrency={formatCurrency}
          />
        );
      case "cleared":
        return (
          <ClearedSettlementsTab
            settlements={settlements.filter((s) => s.status === "COMPLETED")}
            loading={loading}
            getStatusBadge={getStatusBadge}
            formatCurrency={formatCurrency}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <Breadcrumb />

      <motion.div
        className="space-y-6 mt-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden rounded-2xl glass-card p-8 premium-shadow"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10">
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 text-emerald-600 shadow-lg border border-emerald-500/10"
              >
                <FileCheck className="w-8 h-8" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold text-gradient-primary">
                  Full & Final Settlement
                </h1>
                <p className="text-muted-foreground mt-1">
                  Streamline employee exit settlements, automate calculations, and manage final payments with ease.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="relative px-5 py-2.5 font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl hover:bg-emerald-100 transition-colors flex items-center gap-2">
                <FileCheck className="w-5 h-5" />
                <span>Policy Guide</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          variants={itemVariants}
          className="glass-card rounded-2xl border border-border/20 shadow-xl overflow-hidden"
        >
          <div className="flex flex-wrap gap-1 p-2 bg-muted/50 border-b border-border">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ${isActive
                      ? "text-success bg-card shadow-sm"
                      : "text-foreground hover:bg-muted"
                    }`}
                >
                  <Icon size={18} className={isActive ? "text-success" : "text-muted-foreground"} />
                  <span>{tab.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 rounded-lg ring-1 ring-foreground/5"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="p-6 sm:p-8 bg-card/50 min-h-[500px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {renderTabContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

// Pending Settlements Tab Component
function PendingSettlementsTab({ settlements, loading, getStatusBadge, formatCurrency }) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Chart Data Preparation
  const statusCounts = {
    PENDING: settlements.filter(s => s.status === 'PENDING').length,
    IN_PROGRESS: settlements.filter(s => s.status === 'IN_PROGRESS').length,
    ON_HOLD: settlements.filter(s => s.status === 'ON_HOLD').length
  };

  const chartOptions = {
    chart: { type: 'donut', fontFamily: 'inherit', background: 'transparent' },
    labels: ['Pending', 'In Progress', 'On Hold'],
    colors: ['#f59e0b', '#3b82f6', '#ef4444'],
    plotOptions: {
      pie: {
        donut: {
          size: '75%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total',
              fontSize: '14px',
              fontFamily: 'inherit',
              fontWeight: 600,
              color: 'var(--foreground)',
              formatter: function (w) {
                return w.globals.seriesTotals.reduce((a, b) => a + b, 0)
              }
            }
          }
        }
      }
    },
    dataLabels: { enabled: false },
    stroke: { show: false },
    legend: { position: 'bottom', markers: { radius: 12 } },
    tooltip: { 
      theme: 'light',
      style: {
        fontSize: '12px',
        fontFamily: 'inherit',
        color: 'var(--foreground)'
      },
      y: {
        formatter: function(val) {
          return val + ' settlements'
        }
      }
    }
  };

  const chartSeries = [statusCounts.PENDING, statusCounts.IN_PROGRESS, statusCounts.ON_HOLD];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-3 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <h3 className="text-xl font-bold text-foreground">Pending Queue</h3>
            <p className="text-sm text-muted-foreground">
              Processing {settlements.length} active settlements
            </p>
          </div>
        </div>

        {settlements.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {settlements.map((settlement, index) => (
              <motion.div
                key={settlement.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -2 }}
                className="glass-card hover:bg-card/80 rounded-xl p-5 border border-border/20 transition-all group premium-shadow-hover"
              >
                <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="relative">
                      {settlement.employee?.profileImage ? (
                        <img
                          src={settlement.employee.profileImage}
                          alt={settlement.employee?.name}
                          className="w-16 h-16 rounded-2xl object-cover shadow-md"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextElementSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div 
                        className={`w-16 h-16 rounded-2xl shadow-md flex items-center justify-center text-primary-foreground font-bold text-lg bg-gradient-to-br from-primary to-accent ${settlement.employee?.profileImage ? 'hidden' : ''}`}
                        style={{ display: settlement.employee?.profileImage ? 'none' : 'flex' }}
                      >
                        {settlement.employee?.name?.charAt(0)?.toUpperCase() || 'E'}
                      </div>
                      <div className="absolute -bottom-2 -right-2 bg-card rounded-full p-1 shadow-sm border border-border">
                        <UserX className="w-3 h-3 text-emerald-500" />
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="text-lg font-bold text-foreground group-hover:text-emerald-600 transition-colors">
                          {settlement.employee?.name}
                        </h4>
                        {getStatusBadge(settlement.status)}
                      </div>
                      <p className="text-sm text-muted-foreground font-medium mb-3">
                        {settlement.employee?.employeeId} • {settlement.employee?.department}
                      </p>

                      <div className="flex flex-col sm:flex-row gap-3 mt-3">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted border border-border">
                          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                          <div>
                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Resignation</p>
                            <p className="text-xs font-bold text-foreground">
                              {new Date(settlement.resignationDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted border border-border">
                          <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                          <div>
                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Last Day</p>
                            <p className="text-xs font-bold text-foreground">
                              {new Date(settlement.lastWorkingDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30 ml-auto sm:ml-0">
                          <DollarSign className="w-4 h-4 text-emerald-600" />
                          <div>
                            <p className="text-[10px] uppercase tracking-wider text-emerald-600/80 dark:text-emerald-400/80 font-semibold">Est. Amount</p>
                            <p className="text-sm font-extrabold text-emerald-700 dark:text-emerald-400">
                              {formatCurrency(settlement.totalSettlement)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 w-full md:w-auto mt-4 md:mt-0">
                    <button className="px-6 py-2.5 bg-gradient-to-r from-success to-primary text-primary-foreground rounded-xl hover:shadow-lg hover:shadow-success/20 transition-all text-sm font-bold flex items-center justify-center gap-2">
                      <Calculator className="w-4 h-4" />
                      Process
                    </button>
                    <button className="px-6 py-2.5 bg-white dark:bg-white/5 text-foreground border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-white/10 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                      <FileText className="w-4 h-4" />
                      View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-card/50 rounded-2xl border border-dashed border-border">
            <Clock className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <h4 className="text-lg font-semibold text-foreground">No Pending Settlements</h4>
            <p className="text-muted-foreground">All settlement requests are up to date.</p>
          </div>
        )}
      </div>

      {/* Sidebar Stats */}
      <div className="space-y-6">
        <div className="glass-card p-6 rounded-2xl border border-white/20 dark:border-white/5 shadow-lg">
          <h4 className="font-bold text-foreground mb-4">Status Distribution</h4>
          <div className="h-48 flex items-center justify-center">
            <ReactApexChart options={chartOptions} series={chartSeries} type="donut" height={220} width={"100%"} />
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-white/20 dark:border-white/5 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-500/10 text-blue-600 rounded-xl">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-600/80 dark:text-blue-300">Total Payable</p>
              <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-100 mt-1">
                {formatCurrency(settlements.reduce((sum, s) => sum + s.totalSettlement, 0))}
              </h3>
              <p className="text-xs text-blue-600/60 dark:text-blue-400 mt-2">Across {settlements.length} employees</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Calculate Settlement Tab Component
function CalculateSettlementTab({
  selectedEmployee,
  setSelectedEmployee,
  employees,
  searchQuery,
  onSearch,
  formatCurrency,
}) {
  const [calculationData, setCalculationData] = useState(null);
  const [showCalculation, setShowCalculation] = useState(false);
  const [calculating, setCalculating] = useState(false);

  const handleCalculate = async () => {
    if (!selectedEmployee) {
      toast.error("Please select an employee first");
      return;
    }
    try {
      setCalculating(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock calculation data
      const formattedData = {
        earnings: {
          pendingSalary: 45000,
          leaveEncashment: 12000,
          gratuity: 35000,
          bonus: 15000,
          totalEarnings: 107000,
        },
        deductions: {
          noticePayRecovery: 0,
          advanceRecovery: 5000,
          loanDeduction: 12000,
          otherDeductions: 2000,
          totalDeductions: 19000,
        },
        netSettlement: 88000,
      };
      setCalculationData(formattedData);
      setShowCalculation(true);
      toast.success("Settlement calculated successfully");
    } catch (error) {
      console.error("Error calculating settlement:", error);
      toast.error(error.message || "Failed to calculate settlement");
    } finally {
      setCalculating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-6">
        <div>
          <h3 className="text-xl font-bold text-foreground mb-2">
            Calculate Settlement
          </h3>
          <p className="text-sm text-muted-foreground">
            Select an employee to initiate the full & final settlement process.
          </p>
        </div>

        {/* Employee Search */}
        <div className="glass-card rounded-2xl border border-white/20 dark:border-white/10 p-6 shadow-sm">
          <label className="block text-sm font-semibold text-foreground mb-3">
            Search Employee
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Name or ID..."
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-3 rounded-xl border border-border bg-muted focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
            />
          </div>

          {employees.length > 0 && (
            <div className="mt-3 border border-border rounded-xl overflow-hidden shadow-lg bg-card max-h-60 overflow-y-auto custom-scrollbar">
              {employees.map((emp) => {
                const employeeName = emp.name || `${emp.firstName || ""} ${emp.lastName || ""}`.trim();
                return (
                  <button
                    key={emp.id}
                    onClick={() => {
                      setSelectedEmployee(emp);
                      setSearchQuery(employeeName);
                      onSearch("");
                    }}
                    className={`w-full p-3 text-left hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0 flex items-center gap-3 ${selectedEmployee?.id === emp.id ? "bg-emerald-50 dark:bg-emerald-900/20" : ""
                      }`}
                  >
                    {emp.profileImage ? (
                      <img
                        src={emp.profileImage}
                        alt={employeeName}
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm bg-gradient-to-br from-primary to-accent ${emp.profileImage ? 'hidden' : ''}`}
                      style={{ display: emp.profileImage ? 'none' : 'flex' }}
                    >
                      {employeeName?.charAt(0)?.toUpperCase() || 'E'}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{employeeName}</p>
                      <p className="text-xs text-muted-foreground">
                        {emp.employeeId} • {emp.department?.name || emp.department || "-"}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {selectedEmployee && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800 rounded-xl relative group"
            >
              <button
                onClick={() => {
                  setSelectedEmployee(null);
                  setSearchQuery("");
                  setShowCalculation(false);
                  setCalculationData(null);
                }}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              >
                ×
              </button>
              <div className="flex items-center gap-3">
                {selectedEmployee.profileImage ? (
                  <img
                    src={selectedEmployee.profileImage}
                    alt={selectedEmployee.name || `${selectedEmployee.firstName} ${selectedEmployee.lastName}`}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-white dark:ring-gray-800 shadow-sm"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div 
                  className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg bg-gradient-to-br from-primary to-accent ring-2 ring-white dark:ring-gray-800 shadow-sm ${selectedEmployee.profileImage ? 'hidden' : ''}`}
                  style={{ display: selectedEmployee.profileImage ? 'none' : 'flex' }}
                >
                  {(selectedEmployee.name || `${selectedEmployee.firstName || ""} ${selectedEmployee.lastName || ""}`.trim())?.charAt(0)?.toUpperCase() || 'E'}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-foreground text-lg">
                    {selectedEmployee.name || `${selectedEmployee.firstName || ""} ${selectedEmployee.lastName || ""}`.trim()}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs px-2 py-0.5 rounded-md bg-white dark:bg-black/20 text-muted-foreground font-medium border border-gray-100 dark:border-white/5">
                      {selectedEmployee.employeeId}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {selectedEmployee.department?.name || selectedEmployee.department || "-"}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <button
            onClick={handleCalculate}
            disabled={!selectedEmployee || calculating}
            className="mt-6 w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {calculating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Calculator className="w-5 h-5" />}
            {calculating ? "Calculating..." : "Calculate Settlement"}
          </button>
        </div>
      </div>

      {/* Calculation Results */}
      <div className="lg:col-span-2">
        {showCalculation && calculationData ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-2xl border border-white/20 dark:border-white/10 p-8 shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-emerald-500/5 to-transparent rounded-bl-full pointer-events-none"></div>

            <div className="flex items-center justify-between mb-8 relative z-10">
              <h4 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Receipt className="w-6 h-6 text-emerald-500" />
                Settlement Breakdown
              </h4>
              <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full text-sm font-semibold">
                Draft Calculation
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
              {/* Earnings */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                  <div className="p-1.5 rounded bg-green-100 dark:bg-green-900/30 text-green-600">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <h5 className="font-bold text-foreground">Earnings</h5>
                </div>

                <div className="space-y-3">
                  {[
                    { label: "Pending Salary", value: calculationData.earnings.pendingSalary },
                    { label: "Leave Encashment", value: calculationData.earnings.leaveEncashment },
                    { label: "Gratuity", value: calculationData.earnings.gratuity },
                    { label: "Bonus / Incentives", value: calculationData.earnings.bonus }
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="font-semibold text-foreground">{formatCurrency(item.value)}</span>
                    </div>
                  ))}

                  <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/10 rounded-lg mt-2 border border-green-100 dark:border-green-900/30">
                    <span className="font-bold text-green-700 dark:text-green-400">Total Earnings</span>
                    <span className="font-bold text-green-700 dark:text-green-400 text-lg">
                      {formatCurrency(calculationData.earnings.totalEarnings)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Deductions */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                  <div className="p-1.5 rounded bg-red-100 dark:bg-red-900/30 text-red-600">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  <h5 className="font-bold text-foreground">Deductions</h5>
                </div>

                <div className="space-y-3">
                  {[
                    { label: "Notice Pay Recovery", value: calculationData.deductions.noticePayRecovery },
                    { label: "Advance Recovery", value: calculationData.deductions.advanceRecovery },
                    { label: "Loan Deduction", value: calculationData.deductions.loanDeduction },
                    { label: "Other Deductions", value: calculationData.deductions.otherDeductions }
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="font-semibold text-red-500">-{formatCurrency(item.value)}</span>
                    </div>
                  ))}

                  <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/10 rounded-lg mt-2 border border-red-100 dark:border-red-900/30">
                    <span className="font-bold text-red-700 dark:text-red-400">Total Deductions</span>
                    <span className="font-bold text-red-700 dark:text-red-400 text-lg">
                      -{formatCurrency(calculationData.deductions.totalDeductions)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Net Settlement */}
            <div className="mt-8 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 blur-xl"></div>
              <div className="relative bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl p-6 border border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Net Settlement Amount</p>
                  <p className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 mt-1">
                    {formatCurrency(calculationData.netSettlement)}
                  </p>
                </div>

                <div className="flex gap-3 w-full sm:w-auto">
                  <button className="flex-1 sm:flex-none px-6 py-3 bg-white dark:bg-gray-800 text-foreground border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-bold text-sm shadow-sm flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" />
                    Statement
                  </button>
                  <button className="flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:shadow-lg hover:shadow-emerald-500/20 transition-all font-bold text-sm flex items-center justify-center gap-2">
                    Generate Letter
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-12 text-center rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
              <Calculator className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Ready to Calculate</h3>
            <p className="text-muted-foreground max-w-sm mt-2">
              Select an employee and click calculate to view the complete breakdown of their full & final settlement.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Cleared Settlements Tab Component
function ClearedSettlementsTab({ settlements, loading, getStatusBadge, formatCurrency }) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="text-xl font-bold text-foreground">History</h3>
          <p className="text-sm text-muted-foreground">Archive of completed settlements</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search history..." className="pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none" />
        </div>
      </div>

      {settlements.length > 0 ? (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm bg-white dark:bg-gray-800">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Exit Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {settlements.map((settlement) => (
                  <tr key={settlement.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {settlement.employee?.profileImage ? (
                          <img
                            src={settlement.employee.profileImage}
                            alt={settlement.employee?.name}
                            className="w-10 h-10 rounded-full object-cover shadow-sm"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextElementSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div 
                          className={`w-10 h-10 rounded-full shadow-sm flex items-center justify-center text-white font-bold text-sm bg-gradient-to-br from-primary to-accent ${settlement.employee?.profileImage ? 'hidden' : ''}`}
                          style={{ display: settlement.employee?.profileImage ? 'none' : 'flex' }}
                        >
                          {settlement.employee?.name?.charAt(0)?.toUpperCase() || 'E'}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">
                            {settlement.employee?.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {settlement.employee?.employeeId}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {new Date(settlement.lastWorkingDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                        {formatCurrency(settlement.totalSettlement)}
                      </p>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(settlement.status)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="text-sm font-medium text-primary hover:text-primary/80 dark:text-primary dark:hover:text-primary/80 transition-colors inline-flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-primary/10">
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                        <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-muted">
                          <FileText className="w-4 h-4" />
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white/50 dark:bg-white/5 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
          <CheckCircle2 className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground">No cleared settlements record found.</p>
        </div>
      )}
    </div>
  );
}
