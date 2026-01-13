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
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
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
          className="relative overflow-hidden rounded-3xl glass-card p-8 sm:p-10 premium-shadow border border-primary/10"
        >
          {/* Animated Background Gradients */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl -mr-48 -mt-48 pointer-events-none"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-accent/15 to-primary/15 rounded-full blur-3xl -ml-40 -mb-40 pointer-events-none"
          />

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
            <div className="flex items-center gap-5">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                whileHover={{ scale: 1.15, rotate: 10 }}
                className="p-5 rounded-2xl bg-gradient-to-br from-primary/30 via-primary/20 to-primary/10 text-primary shadow-2xl border-2 border-primary/20 relative overflow-hidden"
              >
                <motion.div
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                />
                <FileBarChart className="w-10 h-10 relative z-10" />
              </motion.div>
              <div>
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-4xl sm:text-5xl font-extrabold text-gradient-primary mb-2"
                >
                  Finance Reports
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-base sm:text-lg text-muted-foreground"
                >
                  Generate comprehensive financial reports, analytics, and insights for better decision making.
                </motion.p>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-sm font-semibold bg-card/60 backdrop-blur-xl px-5 py-3 rounded-2xl border-2 border-border/30 flex items-center gap-3 shadow-xl"
              >
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-3 h-3 rounded-full bg-success shadow-lg shadow-success/50"
                />
                <span className="text-foreground">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Report Type Cards */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <ReportTypeCards 
            selectedReportType={selectedReportType}
            setSelectedReportType={setSelectedReportType}
          />
        </motion.div>

        {/* Report Generator and Generated Reports - Side by Side */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="lg:col-span-1"
          >
            <ReportGeneratorWidget selectedReportType={selectedReportType} />
          </motion.div>
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="lg:col-span-2"
          >
            <GeneratedReportsTable />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
