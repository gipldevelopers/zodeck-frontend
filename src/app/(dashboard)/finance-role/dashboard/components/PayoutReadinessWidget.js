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
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, scale: 1.01 }}
      className="glass-card glass-card-hover rounded-3xl p-6 sm:p-8 h-full premium-shadow premium-shadow-hover relative overflow-hidden group border border-success/10"
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
        className="absolute top-0 right-0 w-60 h-60 bg-success/10 rounded-full blur-3xl -mr-30 -mt-30 transition-all group-hover:bg-success/20"
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
        className="absolute bottom-0 left-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl -ml-24 -mb-24"
      />

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        className="flex items-center gap-4 mb-8 relative z-10"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.15, rotate: 10 }}
          className="p-4 rounded-2xl bg-gradient-to-br from-success/30 via-success/20 to-success/10 text-success shadow-xl border-2 border-success/20 relative overflow-hidden"
        >
          <motion.div
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          />
          <FileCheck className="w-7 h-7 relative z-10" />
        </motion.div>
        <div className="flex-1">
          <motion.h3
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-xl font-extrabold text-foreground mb-1"
          >
            Payout Readiness
          </motion.h3>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-sm text-muted-foreground"
          >
            Payment Status Check
          </motion.p>
        </div>
      </motion.div>

      <div className="space-y-4 relative z-10">
        {/* Payroll Approved Status */}
        <motion.div
          initial={{ opacity: 0, x: -30, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.02, x: 5 }}
          className={`relative p-5 rounded-2xl border-2 transition-all shadow-lg overflow-hidden ${
            data.payrollApproved
              ? 'bg-gradient-to-br from-success/15 via-success/10 to-success/5 border-success/40'
              : 'bg-gradient-to-br from-destructive/15 via-destructive/10 to-destructive/5 border-destructive/40'
          }`}
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className={`absolute inset-0 rounded-full blur-2xl ${
              data.payrollApproved ? 'bg-success/20' : 'bg-destructive/20'
            }`}
          />
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
                  animate={{
                    rotate: data.payrollApproved ? [0, 10, -10, 0] : 0,
                  }}
                  transition={{
                    duration: 2,
                    repeat: data.payrollApproved ? Infinity : 0,
                    ease: "easeInOut",
                  }}
                  className={`p-3 rounded-xl shadow-md border ${
                    data.payrollApproved
                      ? 'bg-success/30 text-success border-success/40'
                      : 'bg-destructive/30 text-destructive border-destructive/40'
                  }`}
                >
                  {data.payrollApproved ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <XCircle className="w-6 h-6" />
                  )}
                </motion.div>
                <div>
                  <p className="text-sm font-bold text-foreground">Payroll Approved</p>
                  <p className="text-xs text-muted-foreground">
                    {data.payrollApproved ? 'Ready for payout' : 'Pending approval'}
                  </p>
                </div>
              </div>
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.6, type: "spring", stiffness: 300 }}
                whileHover={{ scale: 1.1 }}
                className={`px-4 py-2 rounded-full text-xs font-bold shadow-lg ${
                  data.payrollApproved
                    ? 'bg-success text-success-foreground border-2 border-success/30'
                    : 'bg-destructive text-destructive-foreground border-2 border-destructive/30'
                }`}
              >
                {data.payrollApproved ? 'YES' : 'NO'}
              </motion.div>
            </div>
            {data.payrollApproved && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="text-xs font-semibold text-muted-foreground mt-4"
              >
                Approved on {formatDate(data.approvedDate)}
              </motion.p>
            )}
          </div>
        </motion.div>

        {/* Bank File Generated Status */}
        <motion.div
          initial={{ opacity: 0, x: -30, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.02, x: 5 }}
          className={`relative p-5 rounded-2xl border-2 transition-all shadow-lg overflow-hidden ${
            data.bankFileGenerated
              ? 'bg-gradient-to-br from-success/15 via-success/10 to-success/5 border-success/40'
              : 'bg-gradient-to-br from-warning/15 via-warning/10 to-warning/5 border-warning/40'
          }`}
        >
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className={`absolute inset-0 rounded-full blur-2xl ${
              data.bankFileGenerated ? 'bg-success/20' : 'bg-warning/20'
            }`}
          />
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.6, type: "spring", stiffness: 300 }}
                  animate={{
                    rotate: data.bankFileGenerated ? [0, 10, -10, 0] : 0,
                  }}
                  transition={{
                    duration: 2,
                    repeat: data.bankFileGenerated ? Infinity : 0,
                    ease: "easeInOut",
                  }}
                  className={`p-3 rounded-xl shadow-md border ${
                    data.bankFileGenerated
                      ? 'bg-success/30 text-success border-success/40'
                      : 'bg-warning/30 text-warning border-warning/40'
                  }`}
                >
                  {data.bankFileGenerated ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <AlertCircle className="w-6 h-6" />
                  )}
                </motion.div>
                <div>
                  <p className="text-sm font-bold text-foreground">Bank File Generated</p>
                  <p className="text-xs text-muted-foreground">
                    {data.bankFileGenerated ? 'File ready for upload' : 'File generation pending'}
                  </p>
                </div>
              </div>
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.7, type: "spring", stiffness: 300 }}
                whileHover={{ scale: 1.1 }}
                className={`px-4 py-2 rounded-full text-xs font-bold shadow-lg ${
                  data.bankFileGenerated
                    ? 'bg-success text-success-foreground border-2 border-success/30'
                    : 'bg-warning text-warning-foreground border-2 border-warning/30'
                }`}
              >
                {data.bankFileGenerated ? 'YES' : 'NO'}
              </motion.div>
            </div>
            {data.bankFileGenerated && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="text-xs font-semibold text-muted-foreground mt-4"
              >
                Generated on {formatDate(data.bankFileDate)}
              </motion.p>
            )}
          </div>
        </motion.div>

        {/* Overall Status */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.02, y: -3 }}
          className={`relative mt-6 p-6 rounded-2xl border-2 shadow-xl overflow-hidden ${
            data.payrollApproved && data.bankFileGenerated
              ? 'bg-gradient-to-r from-success/25 via-success/15 to-success/10 border-success/40'
              : 'bg-gradient-to-r from-warning/25 via-warning/15 to-warning/10 border-warning/40'
          }`}
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className={`absolute inset-0 rounded-full blur-3xl ${
              data.payrollApproved && data.bankFileGenerated ? 'bg-success/30' : 'bg-warning/30'
            }`}
          />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-foreground mb-2">Overall Status</p>
              <motion.p
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9, type: "spring" }}
                className={`text-2xl font-extrabold ${
                  data.payrollApproved && data.bankFileGenerated
                    ? 'text-success'
                    : 'text-warning'
                }`}
              >
                {data.payrollApproved && data.bankFileGenerated
                  ? 'Ready for Payout'
                  : 'Action Required'}
              </motion.p>
            </div>
            {data.payrollApproved && data.bankFileGenerated && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 1, type: "spring", stiffness: 300 }}
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 2,
                  ease: "easeInOut",
                }}
                className="p-3 rounded-xl bg-success/30 border-2 border-success/40 shadow-lg"
              >
                <CheckCircle2 className="w-10 h-10 text-success" />
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
