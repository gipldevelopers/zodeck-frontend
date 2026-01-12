"use client";

import { useState, useEffect } from "react";
import { PlusCircle, Layers, Wallet, Users, CalendarRange, RefreshCcw, Loader2 } from "lucide-react";
import Breadcrumb from "@/components/common/Breadcrumb";
import { payrollSalaryStructureService } from "@/services/payroll-role-services/salary-structure.service";
import { toast } from "react-hot-toast";

const tabs = [
  { id: "ctc", label: "CTC Structures", icon: Layers },
  { id: "components", label: "Earnings & Deductions", icon: Wallet },
  { id: "assignment", label: "Assign to Employees", icon: Users },
  { id: "effective-dates", label: "Effective Dates", icon: CalendarRange },
  { id: "revisions", label: "Salary Revisions", icon: RefreshCcw },
];

export default function PayrollComplianceSalaryStructurePage() {
  const [activeTab, setActiveTab] = useState("ctc");
  const [salaryStructures, setSalaryStructures] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === "ctc") {
      fetchSalaryStructures();
      fetchStats();
    }
  }, [activeTab]);

  const fetchSalaryStructures = async () => {
    try {
      setLoading(true);
      const response = await payrollSalaryStructureService.getAllSalaryStructures({
        page: 1,
        limit: 100,
        status: "ACTIVE",
      });
      const data = response.success ? response.data : response;
      const structures = data?.salaryStructures || data?.data || [];
      setSalaryStructures(Array.isArray(structures) ? structures : []);
    } catch (error) {
      console.error("Error fetching salary structures:", error);
      toast.error(error.message || "Failed to fetch salary structures");
      setSalaryStructures([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await payrollSalaryStructureService.getSalaryStructureStats();
      const data = response.success ? response.data : response;
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "ctc":
        return (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  CTC Structures
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Define modular CTC templates for different bands and roles.
                </p>
              </div>
              <button className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
                <PlusCircle size={18} />
                Create New Structure
              </button>
            </div>

            <div className="rounded-xl border border-gray-100 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-gray-700 dark:bg-gray-800/80">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:border-gray-700 dark:text-gray-400">
                      <th className="px-4 py-3 text-left">Structure Name</th>
                      <th className="px-4 py-3 text-left">CTC Range</th>
                      <th className="px-4 py-3 text-left">Band / Grade</th>
                      <th className="px-4 py-3 text-left">Effective From</th>
                      <th className="px-4 py-3 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    <tr className="hover:bg-gray-50/80 dark:hover:bg-gray-800/70 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900 dark:text-white">
                          Standard CTC – Mid Level
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Default structure for mid-level employees
                        </p>
                      </td>
                      <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                        ₹8,00,000 – ₹12,00,000
                      </td>
                      <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                        Band 3 / Grade C
                      </td>
                      <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                        01 Jan 2026
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700 dark:bg-green-900/40 dark:text-green-300">
                          Active
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50/80 dark:hover:bg-gray-800/70 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900 dark:text-white">
                          Leadership CTC – Senior
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Higher variable and bonus components
                        </p>
                      </td>
                      <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                        ₹20,00,000 – ₹35,00,000
                      </td>
                      <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                        Band 5 / Grade E
                      </td>
                      <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                        01 Apr 2026
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-semibold text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300">
                          Draft
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case "components":
        return (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  Earnings & Deductions
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Configure reusable pay components with tax & compliance tags.
                </p>
              </div>
              <button className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors">
                <PlusCircle size={18} />
                Add Component
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-gray-100 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-gray-700 dark:bg-gray-800/80">
                <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 text-xs font-bold">
                    E
                  </span>
                  Earnings
                </h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-center justify-between">
                    <span>Basic</span>
                    <span className="text-xs text-gray-400">40% of CTC • Taxable</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>HRA</span>
                    <span className="text-xs text-gray-400">50% of Basic • Partially Exempt</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Special Allowance</span>
                    <span className="text-xs text-gray-400">Balance • Taxable</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-xl border border-gray-100 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-gray-700 dark:bg-gray-800/80">
                <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 text-xs font-bold">
                    D
                  </span>
                  Deductions
                </h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-center justify-between">
                    <span>PF Employee Share</span>
                    <span className="text-xs text-gray-400">12% of Basic • Statutory</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Professional Tax</span>
                    <span className="text-xs text-gray-400">Slab-wise • Location based</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Advance Recovery</span>
                    <span className="text-xs text-gray-400">Custom • Non-Statutory</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );
      case "assignment":
        return (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  Assign Salary Structure
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Map employees or groups to salary structures with effective dates.
                </p>
              </div>
              <button className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors">
                <PlusCircle size={18} />
                New Assignment
              </button>
            </div>

            <div className="rounded-xl border border-gray-100 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-gray-700 dark:bg-gray-800/80">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:border-gray-700 dark:text-gray-400">
                      <th className="px-4 py-3 text-left">Employee / Group</th>
                      <th className="px-4 py-3 text-left">Structure</th>
                      <th className="px-4 py-3 text-left">Effective From</th>
                      <th className="px-4 py-3 text-left">Effective To</th>
                      <th className="px-4 py-3 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    <tr className="hover:bg-gray-50/80 dark:hover:bg-gray-800/70 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900 dark:text-white">
                          Engineering – Level 2
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Department group assignment
                        </p>
                      </td>
                      <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                        Standard CTC – Mid Level
                      </td>
                      <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                        01 Feb 2026
                      </td>
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                        Ongoing
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                          Applied
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case "effective-dates":
        return (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text_WHITE">
                  Effective Date Management
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Plan salary changes and ensure smooth payroll cut-over.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-gray-100 bg-gradient-to-br from-white via-blue-50 to-indigo-50 p-4 shadow-sm dark:from-gray-800 dark:via-gray-900 dark:to-indigo-950/40 dark:border-gray-700">
              <p className="text-sm text-gray-700 dark:text-gray-200">
                Visual timeline and conflict checks for future-dated changes will appear here.
                Use this view to review overlapping structures before payroll run.
              </p>
            </div>
          </div>
        );
      case "revisions":
        return (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  Salary Revision Handling
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Track increment cycles, promotions, and retro-impact on payroll.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-gray-100 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-gray-700 dark:bg-gray-800/80">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Salary revision workflows (approval, effective date, retro calculation) can be
                configured here. For now this section is a visual placeholder ready for API
                integration.
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen dark:bg-gray-900 p-4 sm:p-6">
      {/* Breadcrumb & Header */}
      <Breadcrumb />

      <div className="mt-4 mb-6 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 via-sky-50 to-indigo-50 p-5 shadow-sm dark:border-blue-900/40 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950/40">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Salary Structure Management
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              Define and maintain employee salary components, CTC templates, and effective dates
              across your organisation.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors">
              <PlusCircle size={18} />
              Quick Create CTC
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="rounded-xl border border-gray-100 bg-white/80 shadow-sm backdrop-blur dark:border-gray-800 dark:bg-gray-900/70">
        <div className="flex flex-wrap gap-2 border-b border-gray-100 px-3 pt-3 dark:border-gray-800 sm:px-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-t-lg px-3 py-2 text-xs font-medium transition-colors sm:px-4 sm:text-sm ${
                  isActive
                    ? "bg-white text-blue-600 shadow-sm dark:bg-gray-900 dark:text-blue-400 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800/60 border-b-2 border-transparent"
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="p-4 sm:p-6">{renderTabContent()}</div>
      </div>
    </div>
  );
}

