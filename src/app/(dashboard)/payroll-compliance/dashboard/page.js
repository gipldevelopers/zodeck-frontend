"use client";

import React from "react";
import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import Breadcrumb from '@/components/common/Breadcrumb';
import PayrollStatusWidget from './components/PayrollStatusWidget';
import PayrollExceptionsWidget from './components/PayrollExceptionsWidget';
import StatutoryComplianceWidget from './components/StatutoryComplianceWidget';
import UpcomingActionsWidget from './components/UpcomingActionsWidget';
import GettingStartedCard from './components/GettingStartedCard';
import WelcomeCard from './components/WelcomeCard';

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

export default function PayrollComplianceDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
      <Breadcrumb />

      <motion.div
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Welcome Card */}
        <motion.div variants={itemVariants}>
          <WelcomeCard />
        </motion.div>

        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-8 sm:p-10 shadow-lg border border-gray-200 dark:border-gray-700"
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
            className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-brand-500/20 to-brand-400/20 rounded-full blur-3xl -mr-48 -mt-48 pointer-events-none"
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
            className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-brand-400/15 to-brand-500/15 rounded-full blur-3xl -ml-40 -mb-40 pointer-events-none"
          />

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
            <div className="flex items-center gap-5">
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-sm font-semibold bg-white dark:bg-gray-800 backdrop-blur-xl px-5 py-3 rounded-2xl border-2 border-gray-200 dark:border-gray-700 flex items-center gap-3 shadow-lg"
              >
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-500/50"
                />
                <span className="text-gray-900 dark:text-white">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="relative px-8 py-3.5 font-bold text-white rounded-2xl group overflow-hidden shadow-xl hover:shadow-brand-500/50 transition-all duration-300"
              >
                <motion.span
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute inset-0 w-full h-full bg-gradient-to-r from-brand-500 via-brand-400 via-brand-500 to-brand-600 bg-[length:200%_100%] opacity-100 group-hover:opacity-90"
                />
                <motion.span
                  whileHover={{ x: 5 }}
                  className="relative flex items-center gap-2"
                >
                  Generate Report
                  <motion.svg
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                  </motion.svg>
                </motion.span>
              </motion.button>
            </motion.div>
          </div>
        </motion.div>

        {/* Getting Started Card - Full Width */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <GettingStartedCard />
        </motion.div>

        {/* Main Dashboard Widgets - 2x2 Grid */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8"
        >
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <PayrollStatusWidget />
          </motion.div>
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <PayrollExceptionsWidget />
          </motion.div>
        </motion.div>

        {/* Statutory Compliance & Upcoming Actions */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8"
        >
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <StatutoryComplianceWidget />
          </motion.div>
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <UpcomingActionsWidget />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
