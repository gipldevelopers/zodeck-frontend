"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  CheckCircle2,
  XCircle,
  Download,
  Search,
  Filter,
  Calendar,
  User,
  FileText,
  Loader2,
  AlertCircle,
  Clock,
} from "lucide-react";

export default function ExpenseTable({ statusFilter, setStatusFilter }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      const mockData = [
        {
          id: 1,
          employeeName: "Rajesh Kumar",
          employeeId: "EMP001",
          expenseType: "Travel",
          description: "Flight tickets for client meeting",
          amount: 12500,
          date: "2026-01-15",
          status: "pending",
          receipt: "receipt_001.pdf",
          department: "Sales",
        },
        {
          id: 2,
          employeeName: "Priya Sharma",
          employeeId: "EMP002",
          expenseType: "Meals",
          description: "Client lunch meeting",
          amount: 3500,
          date: "2026-01-14",
          status: "pending",
          receipt: "receipt_002.pdf",
          department: "Marketing",
        },
        {
          id: 3,
          employeeName: "Amit Patel",
          employeeId: "EMP003",
          expenseType: "Accommodation",
          description: "Hotel stay for conference",
          amount: 8500,
          date: "2026-01-13",
          status: "approved",
          receipt: "receipt_003.pdf",
          department: "Engineering",
          approvedBy: "Finance Manager",
          approvedDate: "2026-01-14",
        },
        {
          id: 4,
          employeeName: "Sneha Reddy",
          employeeId: "EMP004",
          expenseType: "Transport",
          description: "Taxi fare for site visit",
          amount: 1200,
          date: "2026-01-12",
          status: "rejected",
          receipt: "receipt_004.pdf",
          department: "Operations",
          rejectedBy: "Finance Manager",
          rejectedDate: "2026-01-13",
          rejectionReason: "Receipt not clear",
        },
        {
          id: 5,
          employeeName: "Vikram Singh",
          employeeId: "EMP005",
          expenseType: "Travel",
          description: "Train tickets for training",
          amount: 2800,
          date: "2026-01-11",
          status: "pending",
          receipt: "receipt_005.pdf",
          department: "HR",
        },
        {
          id: 6,
          employeeName: "Anjali Mehta",
          employeeId: "EMP006",
          expenseType: "Meals",
          description: "Team dinner",
          amount: 4500,
          date: "2026-01-10",
          status: "approved",
          receipt: "receipt_006.pdf",
          department: "Sales",
          approvedBy: "Finance Manager",
          approvedDate: "2026-01-11",
        },
        {
          id: 7,
          employeeName: "Rohit Verma",
          employeeId: "EMP007",
          expenseType: "Accommodation",
          description: "Hotel for client visit",
          amount: 6200,
          date: "2026-01-09",
          status: "pending",
          receipt: "receipt_007.pdf",
          department: "Sales",
        },
        {
          id: 8,
          employeeName: "Kavita Nair",
          employeeId: "EMP008",
          expenseType: "Transport",
          description: "Airport transfer",
          amount: 1800,
          date: "2026-01-08",
          status: "approved",
          receipt: "receipt_008.pdf",
          department: "Marketing",
          approvedBy: "Finance Manager",
          approvedDate: "2026-01-09",
        },
      ];
      setData(mockData);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        icon: Clock,
        bg: "bg-warning/10",
        text: "text-warning",
        border: "border-warning/20",
        label: "Pending",
      },
      approved: {
        icon: CheckCircle2,
        bg: "bg-success/10",
        text: "text-success",
        border: "border-success/20",
        label: "Approved",
      },
      rejected: {
        icon: XCircle,
        bg: "bg-destructive/10",
        text: "text-destructive",
        border: "border-destructive/20",
        label: "Rejected",
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border}`}
      >
        <Icon className="w-3.5 h-3.5" />
        {config.label}
      </span>
    );
  };

  const filteredData = data.filter((expense) => {
    const matchesStatus = statusFilter === "all" || expense.status === statusFilter;
    const matchesSearch =
      expense.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.expenseType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleApprove = (id) => {
    setData(
      data.map((exp) =>
        exp.id === id
          ? {
              ...exp,
              status: "approved",
              approvedBy: "Current User",
              approvedDate: new Date().toISOString().split("T")[0],
            }
          : exp
      )
    );
  };

  const handleReject = () => {
    if (!rejectReason.trim()) return;
    setData(
      data.map((exp) =>
        exp.id === selectedExpense?.id
          ? {
              ...exp,
              status: "rejected",
              rejectedBy: "Current User",
              rejectedDate: new Date().toISOString().split("T")[0],
              rejectionReason: rejectReason,
            }
          : exp
      )
    );
    setShowRejectModal(false);
    setRejectReason("");
    setSelectedExpense(null);
  };

  const openRejectModal = (expense) => {
    setSelectedExpense(expense);
    setShowRejectModal(true);
  };

  const filterTabs = [
    { id: "all", label: "All", count: data.length },
    {
      id: "pending",
      label: "Pending",
      count: data.filter((e) => e.status === "pending").length,
    },
    {
      id: "approved",
      label: "Approved",
      count: data.filter((e) => e.status === "approved").length,
    },
    {
      id: "rejected",
      label: "Rejected",
      count: data.filter((e) => e.status === "rejected").length,
    },
  ];

  if (loading) {
    return (
      <div className="glass-card rounded-2xl p-6 premium-shadow flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-6 premium-shadow"
      >
        {/* Header with Filters */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {filterTabs.map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  statusFilter === tab.id
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-muted/50 text-foreground hover:bg-muted"
                }`}
              >
                {tab.label}
                <span className="ml-2 px-2 py-0.5 rounded-full bg-card/20 text-xs">
                  {tab.count}
                </span>
              </motion.button>
            ))}
          </div>

          <div className="relative w-full lg:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full lg:w-64 pl-10 pr-4 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Employee
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Expense Type
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Description
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Amount
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Date
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <AnimatePresence>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center gap-3"
                      >
                        <FileText className="w-12 h-12 text-muted-foreground opacity-50" />
                        <p className="text-muted-foreground">No expenses found</p>
                      </motion.div>
                    </td>
                  </tr>
                ) : (
                  filteredData.map((expense, index) => (
                    <motion.tr
                      key={expense.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-primary font-bold">
                            {expense.employeeName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              {expense.employeeName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {expense.employeeId}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm font-medium text-foreground">
                          {expense.expenseType}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm text-foreground max-w-xs truncate">
                          {expense.description}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm font-bold text-foreground">
                          {formatCurrency(expense.amount)}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm text-muted-foreground">
                          {formatDate(expense.date)}
                        </p>
                      </td>
                      <td className="py-4 px-4">{getStatusBadge(expense.status)}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              setSelectedExpense(expense);
                              setShowDetailModal(true);
                            }}
                            className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </motion.button>
                          {expense.status === "pending" && (
                            <>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleApprove(expense.id)}
                                className="p-2 rounded-lg hover:bg-success/10 text-success transition-colors"
                                title="Approve"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => openRejectModal(expense)}
                                className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                                title="Reject"
                              >
                                <XCircle className="w-4 h-4" />
                              </motion.button>
                            </>
                          )}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
                            title="Download Receipt"
                          >
                            <Download className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedExpense && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDetailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto premium-shadow"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">Expense Details</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <XCircle className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Employee</p>
                    <p className="text-sm font-semibold text-foreground">
                      {selectedExpense.employeeName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Employee ID</p>
                    <p className="text-sm font-semibold text-foreground">
                      {selectedExpense.employeeId}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Expense Type</p>
                    <p className="text-sm font-semibold text-foreground">
                      {selectedExpense.expenseType}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Amount</p>
                    <p className="text-sm font-bold text-primary">
                      {formatCurrency(selectedExpense.amount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Date</p>
                    <p className="text-sm font-semibold text-foreground">
                      {formatDate(selectedExpense.date)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Department</p>
                    <p className="text-sm font-semibold text-foreground">
                      {selectedExpense.department}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Description</p>
                  <p className="text-sm text-foreground">{selectedExpense.description}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Receipt</p>
                  <button className="flex items-center gap-2 text-sm text-primary hover:underline">
                    <Download className="w-4 h-4" />
                    {selectedExpense.receipt}
                  </button>
                </div>
                {selectedExpense.status === "approved" && (
                  <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                    <p className="text-sm text-muted-foreground mb-1">Approved By</p>
                    <p className="text-sm font-semibold text-success">
                      {selectedExpense.approvedBy} on {formatDate(selectedExpense.approvedDate)}
                    </p>
                  </div>
                )}
                {selectedExpense.status === "rejected" && (
                  <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                    <p className="text-sm text-muted-foreground mb-1">Rejected By</p>
                    <p className="text-sm font-semibold text-destructive mb-2">
                      {selectedExpense.rejectedBy} on {formatDate(selectedExpense.rejectedDate)}
                    </p>
                    <p className="text-sm text-muted-foreground mb-1">Reason</p>
                    <p className="text-sm text-foreground">
                      {selectedExpense.rejectionReason}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reject Modal */}
      <AnimatePresence>
        {showRejectModal && selectedExpense && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowRejectModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card rounded-2xl p-6 max-w-md w-full premium-shadow"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-destructive/20 text-destructive">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-foreground">Reject Expense</h2>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                Are you sure you want to reject this expense claim? Please provide a reason.
              </p>

              <div className="mb-4">
                <label className="text-sm font-semibold text-foreground mb-2 block">
                  Rejection Reason
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Enter rejection reason..."
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-destructive resize-none"
                />
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectReason("");
                    setSelectedExpense(null);
                  }}
                  className="flex-1 px-4 py-2 rounded-lg bg-muted text-foreground font-semibold hover:bg-muted/80 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleReject}
                  disabled={!rejectReason.trim()}
                  className="flex-1 px-4 py-2 rounded-lg bg-destructive text-destructive-foreground font-semibold hover:bg-destructive/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reject
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
