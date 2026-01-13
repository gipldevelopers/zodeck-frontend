"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Settings, FileText, Users, Calendar } from "lucide-react";
import Link from "next/link";

const gettingStartedSteps = [
  {
    id: 1,
    title: "Configure Company Settings",
    description: "Set up your company profile and basic information",
    icon: Settings,
    completed: true,
    href: "/payroll-compliance/settings",
    color: "bg-brand-500"
  },
  {
    id: 2,
    title: "Add Employee Details",
    description: "Import or add employee information and bank details",
    icon: Users,
    completed: true,
    href: "/payroll-compliance/employees",
    color: "bg-brand-500"
  },
  {
    id: 3,
    title: "Set Up Payroll Structure",
    description: "Configure salary components and pay scales",
    icon: FileText,
    completed: false,
    href: "/payroll-compliance/payroll-structure",
    color: "bg-gray-400"
  },
  {
    id: 4,
    title: "Configure Compliance Rules",
    description: "Set up tax brackets and statutory compliance",
    icon: Calendar,
    completed: false,
    href: "/payroll-compliance/compliance",
    color: "bg-gray-400"
  }
];

export default function GettingStartedCard() {
  const completedSteps = gettingStartedSteps.filter(step => step.completed).length;
  const totalSteps = gettingStartedSteps.length;
  const progressPercentage = (completedSteps / totalSteps) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      <div className="p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Getting Started
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Complete these steps to set up your payroll system
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-brand-600 dark:text-brand-400">
              {completedSteps}/{totalSteps}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Completed</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Overall Progress
            </span>
            <span className="text-sm font-semibold text-brand-600 dark:text-brand-400">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-brand-500 to-brand-600 rounded-full"
            />
          </div>
        </div>

        {/* Steps List */}
        <div className="space-y-4">
          {gettingStartedSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={step.href}
                  className="flex items-start gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-500/50 hover:bg-brand-50/30 dark:hover:bg-brand-900/10 transition-all duration-200 group"
                >
                  {/* Icon */}
                  <div className={`p-3 rounded-lg ${step.completed ? 'bg-brand-100 dark:bg-brand-900/30' : 'bg-gray-100 dark:bg-gray-700'} transition-colors`}>
                    {step.completed ? (
                      <CheckCircle2 className={`w-6 h-6 ${step.completed ? 'text-brand-600 dark:text-brand-400' : 'text-gray-400'}`} />
                    ) : (
                      <Icon className={`w-6 h-6 ${step.completed ? 'text-brand-600 dark:text-brand-400' : 'text-gray-400'}`} />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className={`font-semibold ${step.completed ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                        {step.title}
                      </h3>
                      {step.completed && (
                        <span className="px-2 py-1 text-xs font-medium bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400 rounded-full">
                          Done
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {step.description}
                    </p>
                  </div>

                  {/* Arrow */}
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors flex-shrink-0" />
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-3">
            <Link
              href="/payroll-compliance/payroll-structure"
              className="px-4 py-2 text-sm font-medium bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition shadow-sm hover:shadow-md"
            >
              Set Up Payroll
            </Link>
            <Link
              href="/payroll-compliance/compliance"
              className="px-4 py-2 text-sm font-medium bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400 rounded-lg hover:bg-brand-100 dark:hover:bg-brand-900/50 transition"
            >
              Configure Compliance
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
