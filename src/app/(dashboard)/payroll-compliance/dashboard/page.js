"use client";

import React from "react";
import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import Breadcrumb from '@/components/common/Breadcrumb';
import PayrollStatusWidget from './components/PayrollStatusWidget';
import PayrollExceptionsWidget from './components/PayrollExceptionsWidget';
import StatutoryComplianceWidget from './components/StatutoryComplianceWidget';
import UpcomingActionsWidget from './components/UpcomingActionsWidget';

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
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export default function PayrollComplianceDashboard() {
  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <Breadcrumb />

      <motion.div
        className="space-y-6"
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
                <BarChart3 className="w-8 h-8" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold text-gradient-primary">
                  Payroll Dashboard
                </h1>
                <p className="text-muted-foreground mt-1">
                  Month-wise operational view of payroll readiness, exceptions, and compliance status.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="text-sm font-medium bg-white/50 dark:bg-black/20 backdrop-blur-md px-4 py-3 rounded-xl border border-white/20 flex items-center gap-2 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>

              <button className="relative px-6 py-3 font-bold text-white rounded-xl group overflow-hidden shadow-lg hover:shadow-primary/40 transition-all duration-300 transform hover:-translate-y-1">
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary via-teal-500 to-emerald-500 opacity-100 group-hover:opacity-90 transition-opacity"></span>
                <span className="relative flex items-center gap-2">
                  Generate Report
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                </span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Main Dashboard Widgets - 2x2 Grid */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <PayrollStatusWidget />
          <PayrollExceptionsWidget />
        </motion.div>

        {/* Statutory Compliance & Upcoming Actions */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <StatutoryComplianceWidget />
          <UpcomingActionsWidget />
        </motion.div>
      </motion.div>
    </div>
  );
}
