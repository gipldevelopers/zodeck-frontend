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
} from "lucide-react";
import Breadcrumb from "@/components/common/Breadcrumb";
import { onboardingExitService } from "@/services/hr-services/onboarding-exit.service";
import { fullFinalSettlementService } from "@/services/payroll-role-services/full-final-settlement.service";
import { toast } from "react-hot-toast";
import employeeService from "@/services/hr-services/employeeService";

const tabs = [
  { id: "pending", label: "Pending Settlements", icon: Clock },
  { id: "calculate", label: "Calculate Settlement", icon: Calculator },
  { id: "cleared", label: "Cleared Settlements", icon: CheckCircle2 },
];

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

  const fetchEmployees = async (query = "") => {
    try {
      const response = await employeeService.getAllEmployees({
        search: query,
        limit: 50,
      });
      const data = response.success ? response.data?.employees || response.data : response.data || [];
      setEmployees(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching employees:", error);
      setEmployees([]);
    }
  };

  const fetchSettlements = async () => {
    try {
      setLoading(true);
      let response;
      if (activeTab === "pending") {
        response = await fullFinalSettlementService.getPendingSettlements();
      } else if (activeTab === "cleared") {
        response = await fullFinalSettlementService.getClearedSettlements();
      }
      
      const data = response.success ? response.data : response;
      const settlementsData = Array.isArray(data) ? data : (data?.settlements || []);
      setSettlements(settlementsData);
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
        className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      },
      IN_PROGRESS: {
        label: "In Progress",
        className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      },
      COMPLETED: {
        label: "Completed",
        className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      },
      ON_HOLD: {
        label: "On Hold",
        className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      },
    };
    const statusConfig = config[status] || config.PENDING;
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.className}`}>
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
    <div className="bg-gray-50 min-h-screen dark:bg-gray-900 p-4 sm:p-6">
      <Breadcrumb />

      {/* Header */}
      <div className="mt-4 mb-6 rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 p-5 shadow-sm dark:border-emerald-900/40 dark:from-gray-900 dark:via-slate-900 dark:to-emerald-950/40">
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Full & Final Settlement
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Manage employee exit settlements, calculations, and final payments
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm mb-6">
        <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 pt-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                  isActive
                    ? "border-emerald-600 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20"
                    : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="p-4 sm:p-6">{renderTabContent()}</div>
      </div>
    </div>
  );
}

// Pending Settlements Tab Component
function PendingSettlementsTab({ settlements, loading, getStatusBadge, formatCurrency }) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pending Settlements</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Employees awaiting final settlement processing
          </p>
        </div>
      </div>

      {settlements.length > 0 ? (
        <div className="space-y-4">
          {settlements.map((settlement) => (
            <div
              key={settlement.id}
              className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <img
                    src={settlement.employee?.profileImage || "/images/users/user-default.png"}
                    alt={settlement.employee?.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {settlement.employee?.name}
                      </h4>
                      {getStatusBadge(settlement.status)}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {settlement.employee?.employeeId} • {settlement.employee?.department}
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Resignation Date</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {new Date(settlement.resignationDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Last Working Date</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {new Date(settlement.lastWorkingDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Clearance Status</p>
                        {getStatusBadge(settlement.clearanceStatus)}
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Settlement Amount</p>
                        <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                          {formatCurrency(settlement.totalSettlement)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium flex items-center gap-2">
                    <Calculator className="w-4 h-4" />
                    Calculate
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Clock className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No pending settlements found</p>
        </div>
      )}
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
      const response = await fullFinalSettlementService.calculateSettlement({
        employeeId: selectedEmployee.id,
      });
      const data = response.success ? response.data : response;
      
      // Format calculation data from API response
      const formattedData = {
        earnings: {
          pendingSalary: data.lastMonthSalary || 0,
          leaveEncashment: data.leaveEncashment || 0,
          gratuity: data.gratuity || 0,
          bonus: data.breakdown?.bonus || 0,
          totalEarnings: (data.lastMonthSalary || 0) + (data.leaveEncashment || 0) + (data.gratuity || 0) + (data.breakdown?.bonus || 0),
        },
        deductions: {
          noticePayRecovery: data.breakdown?.recoveries?.noticePay || 0,
          advanceRecovery: data.breakdown?.recoveries?.advance || 0,
          loanDeduction: data.breakdown?.deductions?.loan || 0,
          otherDeductions: data.breakdown?.deductions?.other || 0,
          totalDeductions: data.deductions || 0,
        },
        netSettlement: data.totalSettlement || 0,
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
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Calculate Settlement
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Select an employee and calculate their full & final settlement amount
        </p>
      </div>

      {/* Employee Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Search Employee
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or employee ID..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {employees.length > 0 && (
          <div className="mt-3 border border-gray-200 dark:border-gray-700 rounded-lg max-h-60 overflow-y-auto">
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
                  className={`w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${
                    selectedEmployee?.id === emp.id ? "bg-emerald-50 dark:bg-emerald-900/20" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={emp.profileImage || "/images/users/user-default.png"}
                      alt={employeeName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{employeeName}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {emp.employeeId} • {emp.department?.name || emp.department || "-"}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {selectedEmployee && (
          <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
            <div className="flex items-center gap-3">
              <img
                src={selectedEmployee.profileImage || "/images/users/user-default.png"}
                alt={selectedEmployee.name || `${selectedEmployee.firstName} ${selectedEmployee.lastName}`}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="font-semibold text-gray-900 dark:text-white">
                  {selectedEmployee.name || `${selectedEmployee.firstName || ""} ${selectedEmployee.lastName || ""}`.trim()}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedEmployee.employeeId} • {selectedEmployee.department?.name || selectedEmployee.department || "-"}
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedEmployee(null);
                  setSearchQuery("");
                  setShowCalculation(false);
                  setCalculationData(null);
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ×
              </button>
            </div>
          </div>
        )}

        <button
          onClick={handleCalculate}
          disabled={!selectedEmployee}
          className="mt-4 w-full py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Calculator className="w-5 h-5" />
          Calculate Settlement
        </button>
      </div>

      {/* Calculation Results */}
      {showCalculation && calculationData && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
            Settlement Calculation
          </h4>

          {/* Earnings */}
          <div>
            <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              Earnings
            </h5>
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-sm text-gray-600 dark:text-gray-400">Pending Salary</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatCurrency(calculationData.earnings.pendingSalary)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-sm text-gray-600 dark:text-gray-400">Leave Encashment</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatCurrency(calculationData.earnings.leaveEncashment)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-sm text-gray-600 dark:text-gray-400">Gratuity</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatCurrency(calculationData.earnings.gratuity)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-sm text-gray-600 dark:text-gray-400">Bonus / Incentives</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatCurrency(calculationData.earnings.bonus)}
                </span>
              </div>
              <div className="flex justify-between py-3 bg-green-50 dark:bg-green-900/20 rounded-lg px-4 mt-3">
                <span className="font-semibold text-gray-900 dark:text-white">Total Earnings</span>
                <span className="text-lg font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(calculationData.earnings.totalEarnings)}
                </span>
              </div>
            </div>
          </div>

          {/* Deductions */}
          <div>
            <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              Deductions
            </h5>
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-sm text-gray-600 dark:text-gray-400">Notice Pay Recovery</span>
                <span className="text-sm font-medium text-red-600 dark:text-red-400">
                  -{formatCurrency(calculationData.deductions.noticePayRecovery)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-sm text-gray-600 dark:text-gray-400">Advance Recovery</span>
                <span className="text-sm font-medium text-red-600 dark:text-red-400">
                  -{formatCurrency(calculationData.deductions.advanceRecovery)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-sm text-gray-600 dark:text-gray-400">Loan Deduction</span>
                <span className="text-sm font-medium text-red-600 dark:text-red-400">
                  -{formatCurrency(calculationData.deductions.loanDeduction)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-sm text-gray-600 dark:text-gray-400">Other Deductions</span>
                <span className="text-sm font-medium text-red-600 dark:text-red-400">
                  -{formatCurrency(calculationData.deductions.otherDeductions)}
                </span>
              </div>
              <div className="flex justify-between py-3 bg-red-50 dark:bg-red-900/20 rounded-lg px-4 mt-3">
                <span className="font-semibold text-gray-900 dark:text-white">Total Deductions</span>
                <span className="text-lg font-bold text-red-600 dark:text-red-400">
                  {formatCurrency(calculationData.deductions.totalDeductions)}
                </span>
              </div>
            </div>
          </div>

          {/* Net Settlement */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-xl p-6 border-2 border-emerald-200 dark:border-emerald-800">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Net Settlement Amount</p>
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(calculationData.netSettlement)}
                </p>
              </div>
              <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>

          <div className="flex gap-3">
            <button className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2">
              <FileText className="w-4 h-4" />
              Generate Settlement Letter
            </button>
            <button className="flex-1 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium flex items-center justify-center gap-2">
              <Download className="w-4 h-4" />
              Download Statement
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Cleared Settlements Tab Component
function ClearedSettlementsTab({ settlements, loading, getStatusBadge, formatCurrency }) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Cleared Settlements</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Completed full & final settlements
          </p>
        </div>
      </div>

      {settlements.length > 0 ? (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Employee
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Exit Date
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Settlement Amount
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {settlements.map((settlement) => (
                  <tr key={settlement.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={settlement.employee?.profileImage || "/images/users/user-default.png"}
                          alt={settlement.employee?.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {settlement.employee?.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {settlement.employee?.employeeId}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                      {new Date(settlement.lastWorkingDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(settlement.totalSettlement)}
                      </p>
                    </td>
                    <td className="px-4 py-3">{getStatusBadge(settlement.status)}</td>
                    <td className="px-4 py-3">
                      <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <CheckCircle2 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No cleared settlements found</p>
        </div>
      )}
    </div>
  );
}
