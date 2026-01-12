"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FileBarChart } from "lucide-react";
import Breadcrumb from '@/components/common/Breadcrumb';
import ReportTypeCards from './components/ReportTypeCards';
import ReportGeneratorWidget from './components/ReportGeneratorWidget';
import GeneratedReportsTable from './components/GeneratedReportsTable';

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

export default function FinanceReportsPage() {
  const [selectedReportType, setSelectedReportType] = useState(null);

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
                <FileBarChart className="w-8 h-8" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold text-gradient-primary">
                  Finance Reports
                </h1>
                <p className="text-muted-foreground mt-1">
                  Generate comprehensive financial reports, analytics, and insights for better decision making.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="text-sm font-medium bg-white/50 dark:bg-black/20 backdrop-blur-md px-4 py-3 rounded-xl border border-white/20 flex items-center gap-2 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Report Type Cards */}
        <motion.div variants={itemVariants}>
          <ReportTypeCards 
            selectedReportType={selectedReportType}
            setSelectedReportType={setSelectedReportType}
          />
        </motion.div>

        {/* Report Generator and Generated Reports - Side by Side */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          <div className="lg:col-span-1">
            <ReportGeneratorWidget selectedReportType={selectedReportType} />
          </div>
          <div className="lg:col-span-2">
            <GeneratedReportsTable />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
