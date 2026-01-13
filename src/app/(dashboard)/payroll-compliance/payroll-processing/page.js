"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Download,
  Calculator,
  Eye,
  Lock,
  FileText,
  CheckCircle2,
  Loader2,
  AlertCircle,
  RefreshCw,
  Users,
  ArrowRight,
  ArrowLeft,
  Send,
  Printer,
  Search,
  X,
  Plus,
  Trash2,
  Edit2,
  Minus
} from "lucide-react";
import Breadcrumb from "@/components/common/Breadcrumb";
import { toast } from "react-hot-toast";
import dynamic from 'next/dynamic';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const workflowSteps = [
  { id: 1, label: "Select Period", icon: Calendar },
  { id: 2, label: "Select Employees", icon: Users },
  { id: 3, label: "Fetch Data", icon: Download },
  { id: 4, label: "Calculate", icon: Calculator },
  { id: 5, label: "Preview", icon: Eye },
  { id: 6, label: "Lock", icon: Lock },
  { id: 7, label: "Payslips", icon: FileText },
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

// Date formatting helper function
const formatDateDDMMYYYY = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export default function PayrollProcessingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [processingStatus, setProcessingStatus] = useState({});

  const [payrollData, setPayrollData] = useState({
    period: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    startDate: "",
    endDate: "",
    paymentDate: "",
  });

  const [calculationSummary, setCalculationSummary] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  const [employeeList, setEmployeeList] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [availableEmployees, setAvailableEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [employeeLoading, setEmployeeLoading] = useState(false);
  const [manualDeductions, setManualDeductions] = useState([]);
  const [showAddDeduction, setShowAddDeduction] = useState(false);
  const [editingDeduction, setEditingDeduction] = useState(null);
  const [deductionForm, setDeductionForm] = useState({
    description: "",
    amount: "",
    type: "global", // "global" or "employee"
    employeeId: null,
  });

  useEffect(() => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const paymentDate = new Date(today.getFullYear(), today.getMonth() + 1, 5);

    const startDateStr = firstDay.toISOString().split("T")[0];
    const endDateStr = lastDay.toISOString().split("T")[0];
    const paymentDateStr = paymentDate.toISOString().split("T")[0];

    setPayrollData({
      ...payrollData,
      startDate: startDateStr,
      endDate: endDateStr,
      paymentDate: paymentDateStr,
      period: `${formatDateDDMMYYYY(startDateStr)} to ${formatDateDDMMYYYY(endDateStr)}`,
    });

    // Load mock employees
    fetchAvailableEmployees();
  }, []);

  // Auto-generate preview data when entering step 5 if calculation is done
  useEffect(() => {
    if (currentStep === 5 && calculationSummary && !previewData) {
      const totalGross = selectedEmployees.reduce((sum, emp) => sum + (emp.ctc || 0), 0);
      const autoDeductions = Math.round(totalGross * 0.18);
      const totalManualDeductions = manualDeductions.reduce((sum, d) => sum + (parseFloat(d.amount) || 0), 0);
      const totalDeductions = autoDeductions + totalManualDeductions;
      const totalNetPay = totalGross - totalDeductions;

      setPreviewData({
        period: payrollData.period,
        employeeCount: calculationSummary.totalEmployees || 0,
        grossPay: calculationSummary.totalGross || 0,
        deductions: calculationSummary.totalDeductions || 0,
        netPay: calculationSummary.totalNetPay || 0,
      });
    }
  }, [currentStep, calculationSummary, previewData, selectedEmployees, manualDeductions, payrollData.period]);

  const fetchAvailableEmployees = async () => {
    try {
      setEmployeeLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock employee data
      const mockEmployees = [
        { id: 1, empId: "EMP001", name: "John Doe", designation: "Senior Developer", department: "Engineering", ctc: 50000, status: "ACTIVE" },
        { id: 2, empId: "EMP002", name: "Jane Smith", designation: "HR Manager", department: "Human Resources", ctc: 45000, status: "ACTIVE" },
        { id: 3, empId: "EMP003", name: "Mike Johnson", designation: "Sales Executive", department: "Sales", ctc: 60000, status: "ACTIVE" },
        { id: 4, empId: "EMP004", name: "Sarah Williams", designation: "Marketing Manager", department: "Marketing", ctc: 55000, status: "ACTIVE" },
        { id: 5, empId: "EMP005", name: "David Brown", designation: "Finance Analyst", department: "Finance", ctc: 48000, status: "ACTIVE" },
        { id: 6, empId: "EMP006", name: "Emily Davis", designation: "Product Manager", department: "Product", ctc: 65000, status: "ACTIVE" },
        { id: 7, empId: "EMP007", name: "Robert Wilson", designation: "QA Engineer", department: "Engineering", ctc: 42000, status: "ACTIVE" },
        { id: 8, empId: "EMP008", name: "Lisa Anderson", designation: "Designer", department: "Design", ctc: 47000, status: "ACTIVE" },
        { id: 9, empId: "EMP009", name: "James Taylor", designation: "DevOps Engineer", department: "Engineering", ctc: 58000, status: "ACTIVE" },
        { id: 10, empId: "EMP010", name: "Maria Garcia", designation: "Accountant", department: "Finance", ctc: 44000, status: "ACTIVE" },
      ];
      
      setAvailableEmployees(mockEmployees);
    } catch (error) {
      toast.error("Failed to fetch employees");
    } finally {
      setEmployeeLoading(false);
    }
  };

  const getMonthName = (month) => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return months[month - 1] || "";
  };

  // Update period when dates change
  useEffect(() => {
    if (payrollData.startDate && payrollData.endDate) {
      const startFormatted = formatDateDDMMYYYY(payrollData.startDate);
      const endFormatted = formatDateDDMMYYYY(payrollData.endDate);
      setPayrollData(prev => ({
        ...prev,
        period: `${startFormatted} to ${endFormatted}`
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payrollData.startDate, payrollData.endDate]);

  const handleFetchData = async () => {
    if (selectedEmployees.length === 0) {
      toast.error("Please select employees first");
      setCurrentStep(2);
      return;
    }

    try {
      setLoading(true);
      setProcessingStatus({ step: 3, status: "processing", message: "Fetching attendance & leave data..." });

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      setProcessingStatus({ step: 3, status: "completed", message: "Data fetched successfully" });
      toast.success("Attendance & leave data fetched successfully");
    } catch (error) {
      setProcessingStatus({ step: 3, status: "error", message: error.message });
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleCalculate = async () => {
    try {
      setLoading(true);
      setProcessingStatus({ step: 4, status: "processing", message: "Calculating gross, deductions & net pay..." });

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Calculate based on selected employees
      const totalGross = selectedEmployees.reduce((sum, emp) => sum + (emp.ctc || 0), 0);
      const autoDeductions = Math.round(totalGross * 0.18); // 18% automatic deductions
      
      // Calculate manual deductions
      const globalManualDeductions = manualDeductions
        .filter(d => d.type === 'global')
        .reduce((sum, d) => sum + (parseFloat(d.amount) || 0), 0);
      
      const employeeManualDeductions = manualDeductions
        .filter(d => d.type === 'employee')
        .reduce((sum, d) => sum + (parseFloat(d.amount) || 0), 0);
      
      const totalManualDeductions = globalManualDeductions + employeeManualDeductions;
      const totalDeductions = autoDeductions + totalManualDeductions;
      const totalNetPay = totalGross - totalDeductions;

      // Mock calculation summary data
      const mockSummary = {
        totalEmployees: selectedEmployees.length,
        totalGross: totalGross,
        autoDeductions: autoDeductions,
        manualDeductions: totalManualDeductions,
        totalDeductions: totalDeductions,
        totalNetPay: totalNetPay,
        employeesProcessed: selectedEmployees.length,
      };

      // Generate employee list with calculations
      const calculatedEmployees = selectedEmployees.map(emp => {
        const empGross = emp.ctc || 0;
        const empAutoDeductions = Math.round(empGross * 0.18);
        const empManualDeductions = manualDeductions
          .filter(d => d.type === 'employee' && d.employeeId === emp.id)
          .reduce((sum, d) => sum + (parseFloat(d.amount) || 0), 0);
        const empTotalDeductions = empAutoDeductions + empManualDeductions;
        const empNet = empGross - empTotalDeductions;
        
        return {
          id: emp.id,
          name: emp.name,
          empId: emp.empId,
          gross: empGross,
          autoDeductions: empAutoDeductions,
          manualDeductions: empManualDeductions,
          deductions: empTotalDeductions,
          net: empNet,
          status: "Calculated"
        };
      });

      setCalculationSummary(mockSummary);
      setEmployeeList(calculatedEmployees);

      setProcessingStatus({ step: 4, status: "completed", message: "Calculation completed" });
      toast.success("Payroll calculation completed successfully");
    } catch (error) {
      setProcessingStatus({ step: 4, status: "error", message: error.message });
      toast.error(error.message || "Calculation failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = () => {
    // Recalculate to ensure manual deductions are included
    if (calculationSummary) {
      const totalGross = selectedEmployees.reduce((sum, emp) => sum + (emp.ctc || 0), 0);
      const autoDeductions = Math.round(totalGross * 0.18);
      const totalManualDeductions = manualDeductions.reduce((sum, d) => sum + (parseFloat(d.amount) || 0), 0);
      const totalDeductions = autoDeductions + totalManualDeductions;
      const totalNetPay = totalGross - totalDeductions;

      setCalculationSummary({
        ...calculationSummary,
        totalDeductions: totalDeductions,
        totalNetPay: totalNetPay,
        manualDeductions: totalManualDeductions,
        autoDeductions: autoDeductions,
      });
    }

    setPreviewData({
      period: payrollData.period,
      employeeCount: calculationSummary?.totalEmployees || 0,
      grossPay: calculationSummary?.totalGross || 0,
      deductions: calculationSummary?.totalDeductions || 0,
      netPay: calculationSummary?.totalNetPay || 0,
    });
    setCurrentStep(5);
  };

  const handleLockPayroll = async () => {
    // Replaced standard confirm with custom UI flow logic if needed, but for simplicity we keep confirmation here or handle via UI state
    // For now we'll assume a direct action via the button which implies confirmation or a modal could be used.
    // Let's keep it simple for now.

    try {
      setLoading(true);
      setProcessingStatus({ step: 6, status: "processing", message: "Locking payroll..." });

      await new Promise(resolve => setTimeout(resolve, 1500));

      setIsLocked(true);
      setProcessingStatus({ step: 6, status: "completed", message: "Payroll locked successfully" });
      toast.success("Payroll locked successfully");
    } catch (error) {
      setProcessingStatus({ step: 6, status: "error", message: error.message });
      toast.error("Failed to lock payroll");
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePayslips = async () => {
    try {
      setLoading(true);
      setProcessingStatus({ step: 7, status: "processing", message: "Generating payslips..." });
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setProcessingStatus({ step: 7, status: "completed", message: "Payslips generated successfully" });
      toast.success("Payslips generated successfully");
    } catch (error) {
      setProcessingStatus({ step: 7, status: "error", message: error.message });
      toast.error("Failed to generate payslips");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleAddDeduction = () => {
    if (!deductionForm.description || !deductionForm.amount) {
      toast.error("Please fill in description and amount");
      return;
    }

    const newDeduction = {
      id: Date.now(),
      description: deductionForm.description,
      amount: parseFloat(deductionForm.amount),
      type: deductionForm.type,
      employeeId: deductionForm.type === 'employee' ? deductionForm.employeeId : null,
      employeeName: deductionForm.type === 'employee' 
        ? selectedEmployees.find(e => e.id === deductionForm.employeeId)?.name 
        : null,
    };

    if (editingDeduction) {
      setManualDeductions(manualDeductions.map(d => 
        d.id === editingDeduction.id ? newDeduction : d
      ));
      setEditingDeduction(null);
      toast.success("Deduction updated successfully");
    } else {
      setManualDeductions([...manualDeductions, newDeduction]);
      toast.success("Deduction added successfully");
    }

    setDeductionForm({
      description: "",
      amount: "",
      type: "global",
      employeeId: null,
    });
    setShowAddDeduction(false);
    
    // Recalculate if calculation is already done
    if (calculationSummary) {
      handleCalculate();
    }
  };

  const handleDeleteDeduction = (id) => {
    setManualDeductions(manualDeductions.filter(d => d.id !== id));
    toast.success("Deduction removed");
    
    // Recalculate if calculation is already done
    if (calculationSummary) {
      handleCalculate();
    }
  };

  const handleEditDeduction = (deduction) => {
    setEditingDeduction(deduction);
    setDeductionForm({
      description: deduction.description,
      amount: deduction.amount.toString(),
      type: deduction.type,
      employeeId: deduction.employeeId || null,
    });
    setShowAddDeduction(true);
  };

  const getStepStatus = (stepId) => {
    if (stepId < currentStep) return "completed";
    if (stepId === currentStep) return processingStatus.step === stepId ? processingStatus.status : "current";
    return "pending";
  };

  const renderStepContent = () => {
    const stepAnimation = {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -20 },
      transition: { duration: 0.3 }
    };

    switch (currentStep) {
      case 1:
        return (
          <motion.div {...stepAnimation} className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                Select Payroll Period
              </h3>
              <p className="text-muted-foreground">
                Select the start and end dates for the payroll period.
              </p>
            </div>

            <div className="max-w-md mx-auto space-y-5 glass-card p-8 rounded-2xl border border-white/20 dark:border-white/10 shadow-xl">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Start Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={payrollData.startDate}
                      onChange={(e) => {
                        const newStartDate = e.target.value;
                        setPayrollData({ 
                          ...payrollData, 
                          startDate: newStartDate,
                          period: newStartDate ? `${formatDateDDMMYYYY(newStartDate)} to ${formatDateDDMMYYYY(payrollData.endDate)}` : ""
                        });
                      }}
                      className="w-full pl-4 pr-10 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                      required
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                  </div>
                  {payrollData.startDate && (
                    <p className="text-xs text-muted-foreground">
                      {formatDateDDMMYYYY(payrollData.startDate)}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">End Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={payrollData.endDate}
                      onChange={(e) => {
                        const newEndDate = e.target.value;
                        setPayrollData({ 
                          ...payrollData, 
                          endDate: newEndDate,
                          period: newEndDate ? `${formatDateDDMMYYYY(payrollData.startDate)} to ${formatDateDDMMYYYY(newEndDate)}` : ""
                        });
                      }}
                      className="w-full pl-4 pr-10 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                      required
                      min={payrollData.startDate}
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                  </div>
                  {payrollData.endDate && (
                    <p className="text-xs text-muted-foreground">
                      {formatDateDDMMYYYY(payrollData.endDate)}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Payment Date</label>
                <div className="relative">
                  <input
                    type="date"
                    value={payrollData.paymentDate}
                    onChange={(e) => setPayrollData({ ...payrollData, paymentDate: e.target.value })}
                    className="w-full pl-4 pr-10 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary/50 outline-none"
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
                {payrollData.paymentDate && (
                  <p className="text-xs text-muted-foreground">
                    {formatDateDDMMYYYY(payrollData.paymentDate)}
                  </p>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCurrentStep(2)}
                disabled={!payrollData.startDate || !payrollData.endDate}
                className="btn-primary w-full flex items-center justify-center gap-2 mt-4"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        );

      case 2:
        const filteredEmployees = availableEmployees.filter(emp =>
          emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.empId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.department.toLowerCase().includes(searchQuery.toLowerCase())
        );

        const toggleEmployeeSelection = (employee) => {
          if (selectedEmployees.some(emp => emp.id === employee.id)) {
            setSelectedEmployees(selectedEmployees.filter(emp => emp.id !== employee.id));
          } else {
            setSelectedEmployees([...selectedEmployees, employee]);
          }
        };

        const toggleSelectAll = () => {
          if (selectedEmployees.length === filteredEmployees.length && filteredEmployees.length > 0) {
            setSelectedEmployees([]);
          } else {
            setSelectedEmployees([...filteredEmployees]);
          }
        };

        return (
          <motion.div {...stepAnimation} className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Select Employees for Payroll
              </h3>
              <p className="text-sm text-muted-foreground">
                Choose employees to include in the payroll processing for {payrollData.period}
              </p>
            </div>

            <div className="max-w-6xl mx-auto space-y-4">
              {/* Search and Selection Summary */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search employees by name, ID, or department..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-card text-foreground"
                  />
                </div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-card rounded-xl px-4 py-2 premium-shadow"
                >
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-primary">{selectedEmployees.length}</span> of{" "}
                    <span className="font-semibold text-foreground">{filteredEmployees.length}</span> selected
                  </p>
                </motion.div>
              </div>

              {/* Select All */}
              {filteredEmployees.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="checkbox"
                    checked={filteredEmployees.length > 0 && selectedEmployees.length === filteredEmployees.length}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20"
                  />
                  <label className="text-sm font-medium text-foreground cursor-pointer">
                    Select All ({filteredEmployees.length} employees)
                  </label>
                </motion.div>
              )}

              {/* Employee List */}
              {employeeLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : filteredEmployees.length > 0 ? (
                <div className="glass-card rounded-xl overflow-hidden premium-shadow">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase">Select</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase">Employee ID</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase">Name</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase">Designation</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase">Department</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase">Monthly CTC</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {filteredEmployees.map((employee, index) => {
                          const isSelected = selectedEmployees.some(emp => emp.id === employee.id);
                          return (
                            <motion.tr
                              key={employee.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              whileHover={{ backgroundColor: 'hsl(var(--muted) / 0.5)' }}
                              className={`transition-colors cursor-pointer ${isSelected ? 'bg-primary/5' : ''}`}
                              onClick={() => toggleEmployeeSelection(employee)}
                            >
                              <td className="px-4 py-3">
                                <div className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => toggleEmployeeSelection(employee)}
                                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20"
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <span className="text-sm font-medium text-primary">{employee.empId}</span>
                              </td>
                              <td className="px-4 py-3">
                                <span className="text-sm font-medium text-foreground">{employee.name}</span>
                              </td>
                              <td className="px-4 py-3">
                                <span className="text-sm text-muted-foreground">{employee.designation}</span>
                              </td>
                              <td className="px-4 py-3">
                                <span className="text-sm text-muted-foreground">{employee.department}</span>
                              </td>
                              <td className="px-4 py-3">
                                <span className="text-sm font-semibold text-success">{formatCurrency(employee.ctc)}</span>
                              </td>
                              <td className="px-4 py-3">
                                <span className="inline-flex rounded-full bg-success/20 px-2.5 py-0.5 text-xs font-semibold text-success">
                                  {employee.status}
                                </span>
                              </td>
                            </motion.tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="glass-card rounded-xl p-12 text-center">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No employees found matching your search.</p>
                </div>
              )}

              {/* Navigation */}
              <div className="flex gap-3 pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCurrentStep(1)}
                  className="btn-outline flex-1 flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (selectedEmployees.length > 0) {
                      setCurrentStep(3);
                    } else {
                      toast.error("Please select at least one employee");
                    }
                  }}
                  disabled={selectedEmployees.length === 0}
                  className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next: Fetch Data
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div {...stepAnimation} className="space-y-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-foreground mb-2">Fetch Data</h3>
              <p className="text-muted-foreground">Retrieve attendance and leave records automatically.</p>
              {selectedEmployees.length > 0 && (
                <p className="text-xs text-muted-foreground mt-2">
                  Processing for {selectedEmployees.length} selected employee{selectedEmployees.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>

            <div className="max-w-lg mx-auto">
              <div className="glass-card p-6 rounded-2xl border border-white/20 dark:border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full -mr-16 -mt-16 z-0"></div>

                <div className="relative z-10 flex flex-col gap-6">
                  <div className="flex items-start gap-4 p-4 bg-primary/5 rounded-xl border border-primary/10">
                    <div className="p-2 bg-card rounded-lg shadow-sm text-primary">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-sm">Data Retrieval Sources</h4>
                      <ul className="mt-2 text-xs text-muted-foreground space-y-1.5 list-disc pl-4">
                        <li>Biometric Attendance System</li>
                        <li>Leave Management Module</li>
                        <li>Overtime & Shift Adjustments</li>
                        <li>Holiday Calendar</li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={handleFetchData}
                      disabled={loading || selectedEmployees.length === 0 || (processingStatus.step === 3 && processingStatus.status === 'completed')}
                      className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all shadow-lg ${
                        processingStatus.step === 3 && processingStatus.status === 'completed'
                          ? 'bg-success text-success-foreground cursor-default'
                          : selectedEmployees.length === 0
                          ? 'bg-muted text-muted-foreground cursor-not-allowed'
                          : 'btn-primary'
                      }`}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" /> Fetching...
                        </>
                      ) : processingStatus.step === 3 && processingStatus.status === 'completed' ? (
                        <>
                          <CheckCircle2 className="w-5 h-5" /> Data Fetched
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-5 h-5" /> Retrieve Data
                        </>
                      )}
                    </motion.button>

                    <AnimatePresence>
                      {processingStatus.step === 3 && processingStatus.status === 'completed' && (
                        <motion.button
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          onClick={() => setCurrentStep(4)}
                          className="w-full py-3 text-sm font-semibold text-primary hover:text-primary/80 flex items-center justify-center gap-2 group"
                        >
                          Proceed to Calculation <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 4:
        const chartOptions = {
          chart: { type: 'bar', toolbar: { show: false }, fontFamily: 'inherit' },
          plotOptions: { bar: { borderRadius: 6, columnWidth: '50%', distributed: true } },
          dataLabels: { enabled: false },
          legend: { show: false },
          xaxis: {
            categories: ['Gross', 'Deductions', 'Net Pay'],
            labels: { style: { colors: 'var(--muted-foreground)' } },
            axisBorder: { show: false },
            axisTicks: { show: false }
          },
          yaxis: {
            labels: { style: { colors: 'var(--muted-foreground)' }, formatter: (val) => val >= 1000 ? `${val / 1000}k` : val }
          },
          grid: { borderColor: 'var(--border)', strokeDashArray: 4 },
          tooltip: { theme: 'dark' },
          colors: ['hsl(var(--success))', 'hsl(var(--destructive))', 'hsl(var(--primary))'] // Success, Destructive, Primary
        };

        const chartSeries = calculationSummary ? [{
          name: 'Amount',
          data: [calculationSummary.totalGross, calculationSummary.totalDeductions, calculationSummary.totalNetPay]
        }] : [];

        return (
          <motion.div {...stepAnimation} className="space-y-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-foreground mb-2">Payroll Calculation</h3>
              <p className="text-muted-foreground">Process gross salary, deductions, and net pay for all employees.</p>
            </div>

            <div className="max-w-5xl mx-auto space-y-8">
              {!calculationSummary ? (
                <div className="flex flex-col items-center justify-center py-12 glass-card rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <Calculator className="w-10 h-10 text-primary" />
                  </div>
                  <h4 className="text-xl font-bold text-foreground">Ready to Calculate</h4>
                  <p className="text-muted-foreground text-center max-w-md mt-2 mb-8">
                    The system will process attendance data and calculate payouts based on salary structures.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCalculate}
                    disabled={loading}
                    className="px-8 py-3 btn-primary rounded-full font-bold shadow-xl flex items-center gap-2"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Calculator className="w-5 h-5" />}
                    {loading ? 'Processing...' : 'Run Calculation'}
                  </motion.button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                      <div className="glass-card p-6 rounded-2xl border border-white/20 dark:border-white/10 shadow-sm">
                        <h4 className="font-bold text-foreground mb-6">Summary Overview</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                          <div className="p-4 bg-muted rounded-xl border border-border">
                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Employees</p>
                            <p className="text-2xl font-bold text-foreground mt-1">{calculationSummary.totalEmployees}</p>
                          </div>
                          <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100 dark:border-emerald-900/20">
                            <p className="text-xs text-emerald-600 dark:text-emerald-400 uppercase tracking-wider font-semibold">Gross Pay</p>
                            <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300 mt-1">{formatCurrency(calculationSummary.totalGross)}</p>
                          </div>
                          <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/20">
                            <p className="text-xs text-red-600 dark:text-red-400 uppercase tracking-wider font-semibold">Deductions</p>
                            <p className="text-lg font-bold text-red-700 dark:text-red-300 mt-1">{formatCurrency(calculationSummary.totalDeductions)}</p>
                          </div>
                          <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/20">
                            <p className="text-xs text-blue-600 dark:text-blue-400 uppercase tracking-wider font-semibold">Net Pay</p>
                            <p className="text-lg font-bold text-blue-700 dark:text-blue-300 mt-1">{formatCurrency(calculationSummary.totalNetPay)}</p>
                          </div>
                        </div>
                        <div className="h-64 w-full">
                          <ReactApexChart options={chartOptions} series={chartSeries} type="bar" height="100%" />
                        </div>
                      </div>

                      {/* Manual Deductions Section */}
                      <div className="glass-card p-6 rounded-2xl border border-white/20 dark:border-white/10 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="font-bold text-foreground">Manual Deductions & Charges</h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              Add custom deductions or additional charges for this payroll period
                            </p>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setShowAddDeduction(!showAddDeduction);
                              setEditingDeduction(null);
                              setDeductionForm({
                                description: "",
                                amount: "",
                                type: "global",
                                employeeId: null,
                              });
                            }}
                            className="btn-primary flex items-center gap-2 text-sm"
                          >
                            <Plus className="w-4 h-4" />
                            Add Deduction
                          </motion.button>
                        </div>

                        {/* Add/Edit Deduction Form */}
                        <AnimatePresence>
                          {showAddDeduction && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mb-4 p-4 bg-muted/30 rounded-xl border border-border"
                            >
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-sm font-medium text-foreground mb-2">
                                    Deduction Type
                                  </label>
                                  <div className="flex gap-2">
                                    <button
                                      type="button"
                                      onClick={() => setDeductionForm({ ...deductionForm, type: "global", employeeId: null })}
                                      className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                        deductionForm.type === "global"
                                          ? "bg-primary text-primary-foreground"
                                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                                      }`}
                                    >
                                      Global (All Employees)
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setDeductionForm({ ...deductionForm, type: "employee" })}
                                      className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                        deductionForm.type === "employee"
                                          ? "bg-primary text-primary-foreground"
                                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                                      }`}
                                    >
                                      Specific Employee
                                    </button>
                                  </div>
                                </div>

                                {deductionForm.type === "employee" && (
                                  <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                  >
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                      Select Employee
                                    </label>
                                    <select
                                      value={deductionForm.employeeId || ""}
                                      onChange={(e) => setDeductionForm({ ...deductionForm, employeeId: parseInt(e.target.value) })}
                                      className="w-full px-4 py-2 border border-border rounded-lg bg-card text-foreground focus:ring-2 focus:ring-primary/20"
                                    >
                                      <option value="">Select Employee</option>
                                      {selectedEmployees.map(emp => (
                                        <option key={emp.id} value={emp.id}>
                                          {emp.name} ({emp.empId})
                                        </option>
                                      ))}
                                    </select>
                                  </motion.div>
                                )}

                                <div>
                                  <label className="block text-sm font-medium text-foreground mb-2">
                                    Description *
                                  </label>
                                  <input
                                    type="text"
                                    value={deductionForm.description}
                                    onChange={(e) => setDeductionForm({ ...deductionForm, description: e.target.value })}
                                    placeholder="e.g., Late Fee, Loan Deduction, Fine, etc."
                                    className="w-full px-4 py-2 border border-border rounded-lg bg-card text-foreground focus:ring-2 focus:ring-primary/20"
                                  />
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-foreground mb-2">
                                    Amount (₹) *
                                  </label>
                                  <input
                                    type="number"
                                    value={deductionForm.amount}
                                    onChange={(e) => setDeductionForm({ ...deductionForm, amount: e.target.value })}
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                    className="w-full px-4 py-2 border border-border rounded-lg bg-card text-foreground focus:ring-2 focus:ring-primary/20"
                                  />
                                </div>

                                <div className="flex gap-2">
                                  <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleAddDeduction}
                                    className="btn-primary flex-1 flex items-center justify-center gap-2"
                                  >
                                    {editingDeduction ? (
                                      <>
                                        <Edit2 className="w-4 h-4" />
                                        Update Deduction
                                      </>
                                    ) : (
                                      <>
                                        <Plus className="w-4 h-4" />
                                        Add Deduction
                                      </>
                                    )}
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                      setShowAddDeduction(false);
                                      setEditingDeduction(null);
                                      setDeductionForm({
                                        description: "",
                                        amount: "",
                                        type: "global",
                                        employeeId: null,
                                      });
                                    }}
                                    className="btn-outline flex items-center justify-center gap-2"
                                  >
                                    <X className="w-4 h-4" />
                                    Cancel
                                  </motion.button>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Manual Deductions List */}
                        {manualDeductions.length > 0 ? (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                              <span>Total Manual Deductions: <span className="font-semibold text-foreground">{formatCurrency(calculationSummary?.manualDeductions || 0)}</span></span>
                            </div>
                            {manualDeductions.map((deduction, index) => (
                              <motion.div
                                key={deduction.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                              >
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-foreground">{deduction.description}</span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                                      deduction.type === 'global' 
                                        ? 'bg-primary/20 text-primary' 
                                        : 'bg-accent/20 text-accent'
                                    }`}>
                                      {deduction.type === 'global' ? 'Global' : deduction.employeeName}
                                    </span>
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {deduction.type === 'employee' && deduction.employeeName && `For: ${deduction.employeeName}`}
                                  </p>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-sm font-semibold text-destructive">
                                    -{formatCurrency(deduction.amount)}
                                  </span>
                                  <div className="flex gap-1">
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      onClick={() => handleEditDeduction(deduction)}
                                      className="p-1.5 rounded-lg text-primary hover:bg-primary/10 transition-colors"
                                      title="Edit"
                                    >
                                      <Edit2 className="w-4 h-4" />
                                    </motion.button>
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      onClick={() => handleDeleteDeduction(deduction.id)}
                                      className="p-1.5 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                                      title="Delete"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </motion.button>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">
                            <Minus className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No manual deductions added yet</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="glass-card p-6 rounded-2xl border border-white/20 dark:border-white/10 shadow-sm flex flex-col justify-center text-center">
                      <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center text-green-600 mb-4">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <h4 className="text-xl font-bold text-foreground">Calculation Complete</h4>
                      <p className="text-sm text-muted-foreground mt-2 mb-6">
                        All figures have been processed. Proceed to preview the detailed breakdown.
                      </p>
                      <button
                        onClick={handlePreview}
                        className="btn-primary w-full py-3 shadow-lg flex items-center justify-center gap-2"
                      >
                        Next Step <ArrowRight className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleCalculate}
                        className="mt-3 text-sm text-muted-foreground hover:text-foreground underline underline-offset-4"
                      >
                        Re-calculate
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        );

      case 5:
        // Ensure we have preview data - use calculationSummary if previewData is not set
        const displayPreviewData = previewData || (calculationSummary ? {
          period: payrollData.period,
          employeeCount: calculationSummary.totalEmployees || 0,
          grossPay: calculationSummary.totalGross || 0,
          deductions: calculationSummary.totalDeductions || 0,
          netPay: calculationSummary.totalNetPay || 0,
        } : null);

        return (
          <motion.div {...stepAnimation} className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-foreground mb-2">Preview & Verification</h3>
              <p className="text-muted-foreground">Review the final payroll data before locking it.</p>
            </div>

            <div className="max-w-5xl mx-auto space-y-6">
              {displayPreviewData && calculationSummary ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="glass-card p-6 rounded-2xl border border-white/20 dark:border-white/10 relative overflow-hidden">
                      <div className="flex justify-between items-end mb-6">
                        <div>
                          <p className="text-sm text-muted-foreground">Total Net Payable</p>
                          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                            {formatCurrency(displayPreviewData.netPay)}
                          </h2>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-foreground">{displayPreviewData.period}</p>
                          <p className="text-xs text-muted-foreground">{displayPreviewData.employeeCount} Employees</p>
                        </div>
                      </div>

                      <div className="space-y-3 pt-6 border-t border-gray-100 dark:border-white/5">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Total Gross Pay</span>
                          <span className="font-semibold text-foreground">{formatCurrency(displayPreviewData.grossPay)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Auto Deductions</span>
                          <span className="font-semibold text-red-500">-{formatCurrency(calculationSummary.autoDeductions || 0)}</span>
                        </div>
                        {(calculationSummary.manualDeductions || 0) > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Manual Deductions</span>
                            <span className="font-semibold text-primary">-{formatCurrency(calculationSummary.manualDeductions || 0)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm font-semibold pt-2 border-t border-border">
                          <span className="text-foreground">Total Deductions</span>
                          <span className="text-red-500">-{formatCurrency(displayPreviewData.deductions)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="glass-card p-0 rounded-2xl border border-white/20 dark:border-white/10 overflow-hidden">
                      <div className="p-4 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5">
                        <h4 className="font-bold text-foreground text-sm">Employee Breakdown (Preview)</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {employeeList?.length || 0} employee{employeeList?.length !== 1 ? 's' : ''} processed
                        </p>
                      </div>
                      <div className="max-h-96 overflow-y-auto p-4 custom-scrollbar">
                        {employeeList && employeeList.length > 0 ? (
                          <div className="space-y-3">
                            {employeeList.map((emp, index) => (
                              <motion.div
                                key={emp.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ scale: 1.01, x: 4 }}
                                className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border hover:bg-muted/50 transition-all"
                              >
                                <div className="flex items-center gap-3 flex-1">
                                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                                    {emp.name?.charAt(0) || 'E'}
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-sm font-bold text-foreground">{emp.name || 'Unknown'}</p>
                                    <p className="text-xs text-muted-foreground">{emp.empId || 'N/A'}</p>
                                  </div>
                                </div>
                                <div className="text-right space-y-1">
                                  <div className="flex items-center gap-4">
                                    <div className="text-right">
                                      <p className="text-xs text-muted-foreground">Gross</p>
                                      <p className="text-sm font-semibold text-foreground">{formatCurrency(emp.gross || 0)}</p>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-xs text-muted-foreground">Deductions</p>
                                      <p className="text-sm font-semibold text-destructive">-{formatCurrency(emp.deductions || 0)}</p>
                                    </div>
                                    <div className="text-right border-l border-border pl-4">
                                      <p className="text-xs text-muted-foreground">Net Pay</p>
                                      <p className="text-base font-bold text-success">{formatCurrency(emp.net || 0)}</p>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        ) : selectedEmployees && selectedEmployees.length > 0 ? (
                          <div className="space-y-3">
                            {selectedEmployees.map((emp, index) => {
                              const empGross = emp.ctc || 0;
                              const empAutoDeductions = Math.round(empGross * 0.18);
                              const empManualDeductions = manualDeductions
                                .filter(d => d.type === 'employee' && d.employeeId === emp.id)
                                .reduce((sum, d) => sum + (parseFloat(d.amount) || 0), 0);
                              const globalManualDeductions = manualDeductions
                                .filter(d => d.type === 'global')
                                .reduce((sum, d) => sum + (parseFloat(d.amount) || 0) / selectedEmployees.length, 0);
                              const empTotalDeductions = empAutoDeductions + empManualDeductions + globalManualDeductions;
                              const empNet = empGross - empTotalDeductions;
                              
                              return (
                                <motion.div
                                  key={emp.id}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                  whileHover={{ scale: 1.01, x: 4 }}
                                  className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border hover:bg-muted/50 transition-all"
                                >
                                  <div className="flex items-center gap-3 flex-1">
                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                                      {emp.name?.charAt(0) || 'E'}
                                    </div>
                                    <div className="flex-1">
                                      <p className="text-sm font-bold text-foreground">{emp.name || 'Unknown'}</p>
                                      <p className="text-xs text-muted-foreground">{emp.empId || 'N/A'}</p>
                                    </div>
                                  </div>
                                  <div className="text-right space-y-1">
                                    <div className="flex items-center gap-4">
                                      <div className="text-right">
                                        <p className="text-xs text-muted-foreground">Gross</p>
                                        <p className="text-sm font-semibold text-foreground">{formatCurrency(empGross)}</p>
                                      </div>
                                      <div className="text-right">
                                        <p className="text-xs text-muted-foreground">Deductions</p>
                                        <p className="text-sm font-semibold text-destructive">-{formatCurrency(empTotalDeductions)}</p>
                                      </div>
                                      <div className="text-right border-l border-border pl-4">
                                        <p className="text-xs text-muted-foreground">Net Pay</p>
                                        <p className="text-base font-bold text-success">{formatCurrency(empNet)}</p>
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-center py-12 text-muted-foreground">
                            <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p className="text-sm font-medium">No employee data available</p>
                            <p className="text-xs mt-1">Please complete the calculation step first</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setCurrentStep(6)}
                      className="w-full py-4 btn-primary rounded-xl font-bold shadow-lg flex items-center justify-center gap-2"
                    >
                      Verify & Proceed <ArrowRight className="w-4 h-4" />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setCurrentStep(4)}
                      className="w-full py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-foreground rounded-xl font-semibold hover:bg-gray-50 flex items-center justify-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back to Calculate
                    </motion.button>
                  </div>
                </div>
              ) : calculationSummary ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12 glass-card rounded-2xl border border-dashed border-border"
                >
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <Eye className="w-10 h-10 text-primary" />
                  </div>
                  <h4 className="text-xl font-bold text-foreground mb-2">Generating Preview...</h4>
                  <p className="text-muted-foreground text-center max-w-md mb-6">
                    Preparing preview data with current calculations.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePreview}
                    className="btn-primary px-8 py-3 rounded-xl font-bold flex items-center gap-2"
                  >
                    <Eye className="w-5 h-5" />
                    Generate Preview
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12 glass-card rounded-2xl border border-dashed border-border"
                >
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <Calculator className="w-10 h-10 text-primary" />
                  </div>
                  <h4 className="text-xl font-bold text-foreground mb-2">No Calculation Data Available</h4>
                  <p className="text-muted-foreground text-center max-w-md mb-6">
                    Please complete the calculation step first before generating preview.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentStep(4)}
                    className="btn-outline px-8 py-3 rounded-xl font-bold flex items-center gap-2"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Go to Calculation
                  </motion.button>
                </motion.div>
              )}
            </div>
          </motion.div>
        );

      case 6:
        return (
          <motion.div {...stepAnimation} className="space-y-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-foreground mb-2">Finalize Payroll</h3>
              <p className="text-muted-foreground">Locking the payroll allows you to generate payslips and reports.</p>
            </div>

            <div className="max-w-md mx-auto">
              <div className="glass-card p-8 rounded-2xl border border-white/20 dark:border-white/10 text-center shadow-xl">
                {isLocked ? (
                  <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center text-green-600 mx-auto mb-6">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h4 className="text-xl font-bold text-foreground mb-2">Payroll Locked!</h4>
                    <p className="text-sm text-muted-foreground mb-8">
                      The payroll for {payrollData.period} has been successfully locked and saved.
                    </p>
                    <button
                      onClick={() => setCurrentStep(7)}
                      className="w-full py-3 btn-primary rounded-xl font-bold flex items-center justify-center gap-2"
                    >
                      Go to Payslips <ArrowRight className="w-4 h-4" />
                    </button>
                  </motion.div>
                ) : (
                  <div className="space-y-6">
                    <div className="w-20 h-20 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center text-primary mx-auto">
                      <Lock className="w-10 h-10" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-foreground">Confirm Lock</h4>
                      <p className="text-sm text-muted-foreground mt-2">
                        Once locked, you cannot modify attendance or salary details for this period without unlocking.
                      </p>
                    </div>
                    <button
                      onClick={handleLockPayroll}
                      disabled={loading}
                      className="w-full py-3 btn-primary rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />}
                      {loading ? 'Locking...' : 'Lock Payroll'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        );

      case 7:
        return (
          <motion.div {...stepAnimation} className="space-y-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-foreground mb-2">Generate Payslips</h3>
              <p className="text-muted-foreground">Generate payslips and bank transfer statements.</p>
            </div>

            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card p-6 rounded-2xl border border-white/20 dark:border-white/10 hover:border-primary/30 transition-all group cursor-pointer">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-foreground">Generate Payslips</h4>
                <p className="text-sm text-muted-foreground mt-2 mb-6">Create PDF payslips for all {calculationSummary?.totalEmployees || 0} employees.</p>

                {processingStatus.step === 6 && processingStatus.status === 'completed' ? (
                  <button className="w-full py-2.5 bg-green-500 text-white rounded-lg font-semibold flex items-center justify-center gap-2 cursor-default">
                    <CheckCircle2 className="w-4 h-4" /> Generated
                  </button>
                ) : (
                  <button
                    onClick={handleGeneratePayslips}
                    disabled={loading}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />}
                    Generate All
                  </button>
                )}
              </div>

              <div className="glass-card p-6 rounded-2xl border border-white/20 dark:border-white/10 hover:border-primary/30 transition-all group cursor-pointer">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center text-purple-600 mb-4 group-hover:scale-110 transition-transform">
                  <Send className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-foreground">Email Notification</h4>
                <p className="text-sm text-muted-foreground mt-2 mb-6">Send payslips directly to employee registered emails.</p>

                <button className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" /> Send Emails
                </button>
              </div>
            </div>

            <div className="flex justify-center mt-8">
              <button
                onClick={() => window.location.href = '/payroll-compliance/dashboard'}
                className="px-6 py-3 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                Return to Dashboard
              </button>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <Breadcrumb />

      <motion.div
        className="space-y-6 mt-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden rounded-2xl glass-card p-8 premium-shadow"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10">
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="p-4 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary shadow-lg border border-primary/10"
              >
                <Calculator className="w-8 h-8" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold text-gradient-primary">
                  Payroll Processing
                </h1>
                <p className="text-muted-foreground mt-1">
                  End-to-end payroll run management, from data fetch to payslip generation.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Workflow Steps Indicator */}
        <motion.div
          variants={itemVariants}
          className="glass-card rounded-2xl p-4 overflow-x-auto premium-shadow"
        >
          <div className="flex items-center justify-between min-w-[600px] px-2">
            {workflowSteps.map((step, index) => {
              const status = getStepStatus(step.id);
              const Icon = step.icon;

              return (
                <div key={step.id} className="flex flex-col items-center relative z-10 group">
                  <button
                    onClick={() => status !== 'pending' && setCurrentStep(step.id)}
                    disabled={status === 'pending'}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm border-2 ${status === 'completed' ? 'bg-green-500 border-green-500 text-white' :
                        status === 'current' ? 'bg-white dark:bg-gray-800 border-primary text-primary scale-110 shadow-lg shadow-primary/20' :
                          'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400'
                      }`}
                  >
                    {status === 'completed' ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-5 h-5" />}
                  </button>
                  <span className={`text-xs font-bold mt-2 transition-colors ${status === 'current' ? 'text-primary' :
                      status === 'completed' ? 'text-green-600' : 'text-muted-foreground'
                    }`}>
                    {step.label}
                  </span>

                  {/* Connector Line */}
                  {index < workflowSteps.length - 1 && (
                    <div className={`absolute top-6 left-1/2 w-[calc(100%_+_2rem)] h-0.5 -z-10 -translate-y-1/2 ${getStepStatus(workflowSteps[index + 1].id) !== 'pending'
                        ? 'bg-green-500'
                        : 'bg-gray-200 dark:bg-gray-800'
                      }`}></div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Main Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>

      </motion.div>
    </div>
  );
}
