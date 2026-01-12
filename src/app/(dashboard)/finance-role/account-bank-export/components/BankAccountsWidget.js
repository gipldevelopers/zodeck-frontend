"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Building2, CheckCircle2, AlertCircle, Loader2, Plus } from "lucide-react";

export default function BankAccountsWidget() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const mockData = {
        accounts: [
          {
            id: 1,
            bankName: "HDFC Bank",
            accountNumber: "****1234",
            accountType: "Salary Account",
            ifscCode: "HDFC0001234",
            branch: "Mumbai Main",
            status: "active",
            balance: 2450000,
            isDefault: true,
          },
          {
            id: 2,
            bankName: "ICICI Bank",
            accountNumber: "****5678",
            accountType: "Current Account",
            ifscCode: "ICIC0005678",
            branch: "Delhi Branch",
            status: "active",
            balance: 1850000,
            isDefault: false,
          },
          {
            id: 3,
            bankName: "Axis Bank",
            accountNumber: "****9012",
            accountType: "Savings Account",
            ifscCode: "UTIB0009012",
            branch: "Bangalore Branch",
            status: "inactive",
            balance: 0,
            isDefault: false,
          },
        ],
        totalAccounts: 3,
        activeAccounts: 2,
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
            <Building2 className="w-6 h-6" />
          </motion.div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Bank Accounts</h3>
            <p className="text-sm text-muted-foreground">
              {data.activeAccounts} active of {data.totalAccounts} total
            </p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          title="Add Account"
        >
          <Plus className="w-5 h-5" />
        </motion.button>
      </motion.div>

      <div className="space-y-3 relative z-10">
        {data.accounts.map((account, index) => (
          <motion.div
            key={account.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className={`p-4 rounded-xl border-2 transition-all ${
              account.isDefault
                ? "bg-primary/5 border-primary/30"
                : account.status === "active"
                ? "bg-muted/30 border-border hover:bg-muted/50"
                : "bg-muted/20 border-border opacity-60"
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-bold text-foreground">{account.bankName}</h4>
                  {account.isDefault && (
                    <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-semibold">
                      Default
                    </span>
                  )}
                  {account.status === "active" ? (
                    <CheckCircle2 className="w-4 h-4 text-success" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-1">
                  {account.accountType} • {account.accountNumber}
                </p>
                <p className="text-xs text-muted-foreground">
                  IFSC: {account.ifscCode} • {account.branch}
                </p>
              </div>
            </div>
            {account.status === "active" && account.balance > 0 && (
              <div className="pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground mb-1">Available Balance</p>
                <p className="text-lg font-bold text-foreground">
                  {formatCurrency(account.balance)}
                </p>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
