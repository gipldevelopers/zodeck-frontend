"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, FileCheck, Loader2, AlertCircle } from "lucide-react";

export default function PayoutReadinessWidget() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const mockData = {
        payrollApproved: true,
        bankFileGenerated: true,
        approvedDate: new Date().toISOString(),
        bankFileDate: new Date().toISOString(),
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="glass-card glass-card-hover rounded-2xl p-6 h-full premium-shadow premium-shadow-hover relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 w-40 h-40 bg-success/5 rounded-full blur-3xl -mr-20 -mt-20 transition-all group-hover:bg-success/10"></div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-3 mb-6 relative z-10"
      >
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="p-3 rounded-xl bg-gradient-to-br from-success/20 to-success/5 text-success shadow-md border border-success/10"
        >
          <FileCheck className="w-6 h-6" />
        </motion.div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-foreground">Payout Readiness</h3>
          <p className="text-sm text-muted-foreground">Payment Status Check</p>
        </div>
      </motion.div>

      <div className="space-y-4 relative z-10">
        {/* Payroll Approved Status */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className={`p-4 rounded-xl border-2 transition-all ${
            data.payrollApproved
              ? 'bg-success/10 border-success/30'
              : 'bg-destructive/10 border-destructive/30'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
                className={`p-2 rounded-lg ${
                  data.payrollApproved
                    ? 'bg-success/20 text-success'
                    : 'bg-destructive/20 text-destructive'
                }`}
              >
                {data.payrollApproved ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <XCircle className="w-5 h-5" />
                )}
              </motion.div>
              <div>
                <p className="text-sm font-semibold text-foreground">Payroll Approved</p>
                <p className="text-xs text-muted-foreground">
                  {data.payrollApproved ? 'Ready for payout' : 'Pending approval'}
                </p>
              </div>
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                data.payrollApproved
                  ? 'bg-success text-white'
                  : 'bg-destructive text-white'
              }`}
            >
              {data.payrollApproved ? 'YES' : 'NO'}
            </motion.div>
          </div>
          {data.payrollApproved && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-xs text-muted-foreground mt-3"
            >
              Approved on {formatDate(data.approvedDate)}
            </motion.p>
          )}
        </motion.div>

        {/* Bank File Generated Status */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className={`p-4 rounded-xl border-2 transition-all ${
            data.bankFileGenerated
              ? 'bg-success/10 border-success/30'
              : 'bg-warning/10 border-warning/30'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className={`p-2 rounded-lg ${
                  data.bankFileGenerated
                    ? 'bg-success/20 text-success'
                    : 'bg-warning/20 text-warning'
                }`}
              >
                {data.bankFileGenerated ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
              </motion.div>
              <div>
                <p className="text-sm font-semibold text-foreground">Bank File Generated</p>
                <p className="text-xs text-muted-foreground">
                  {data.bankFileGenerated ? 'File ready for upload' : 'File generation pending'}
                </p>
              </div>
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: "spring" }}
              className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                data.bankFileGenerated
                  ? 'bg-success text-white'
                  : 'bg-warning text-white'
              }`}
            >
              {data.bankFileGenerated ? 'YES' : 'NO'}
            </motion.div>
          </div>
          {data.bankFileGenerated && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-xs text-muted-foreground mt-3"
            >
              Generated on {formatDate(data.bankFileDate)}
            </motion.p>
          )}
        </motion.div>

        {/* Overall Status */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className={`mt-4 p-4 rounded-xl ${
            data.payrollApproved && data.bankFileGenerated
              ? 'bg-gradient-to-r from-success/20 to-success/10 border-2 border-success/30'
              : 'bg-gradient-to-r from-warning/20 to-warning/10 border-2 border-warning/30'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground mb-1">Overall Status</p>
              <p className={`text-lg font-bold ${
                data.payrollApproved && data.bankFileGenerated
                  ? 'text-success'
                  : 'text-warning'
              }`}>
                {data.payrollApproved && data.bankFileGenerated
                  ? 'Ready for Payout'
                  : 'Action Required'}
              </p>
            </div>
            {data.payrollApproved && data.bankFileGenerated && (
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <CheckCircle2 className="w-8 h-8 text-success" />
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
