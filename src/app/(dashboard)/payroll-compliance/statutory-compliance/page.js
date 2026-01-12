"use client";

import { 
  Shield, 
  Building2, 
  HeartPulse, 
  Receipt, 
  Users, 
  FileText,
  Calculator,
  BookOpen,
  FileBarChart,
  Download,
  Settings,
  CheckCircle2,
  AlertCircle,
  Loader2
} from "lucide-react";
import Breadcrumb from "@/components/common/Breadcrumb";
import { statutoryComplianceService } from "@/services/payroll-role-services/statutory-compliance.service";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const complianceTypes = [
  { 
    id: "pf", 
    label: "Provident Fund (PF)", 
    icon: Building2,
    color: "blue",
    description: "Employees' Provident Fund Organization (EPFO)"
  },
  { 
    id: "gratuity", 
    label: "Gratuity", 
    icon: HeartPulse,
    color: "purple",
    description: "Payment of Gratuity Act, 1972",
    highlighted: true
  },
  { 
    id: "esi", 
    label: "Employee State Insurance (ESI)", 
    icon: Users,
    color: "green",
    description: "ESI Corporation"
  },
  { 
    id: "pt", 
    label: "Professional Tax (PT)", 
    icon: Receipt,
    color: "orange",
    description: "State-wise Professional Tax"
  },
  { 
    id: "lwf", 
    label: "Labour Welfare Fund (LWF)", 
    icon: Shield,
    color: "indigo",
    description: "State Labour Welfare Fund"
  },
  { 
    id: "tds", 
    label: "Income Tax (TDS)", 
    icon: FileText,
    color: "red",
    description: "Tax Deducted at Source"
  },
];

export default function StatutoryCompliancePage() {
  const [activeCompliance, setActiveCompliance] = useState("pf");
  const [activeFeatureTab, setActiveFeatureTab] = useState("calculation");
  const [loading, setLoading] = useState(false);
  const [complianceOverview, setComplianceOverview] = useState(null);

  useEffect(() => {
    fetchComplianceOverview();
  }, []);

  const fetchComplianceOverview = async () => {
    try {
      setLoading(true);
      const response = await statutoryComplianceService.getComplianceOverview();
      const data = response.success ? response.data : response;
      setComplianceOverview(data);
    } catch (error) {
      console.error("Error fetching compliance overview:", error);
      toast.error(error.message || "Failed to fetch compliance overview");
    } finally {
      setLoading(false);
    }
  };

  const selectedCompliance = complianceTypes.find(c => c.id === activeCompliance);

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: "bg-blue-100 dark:bg-blue-900/30",
        text: "text-blue-600 dark:text-blue-400",
        border: "border-blue-200 dark:border-blue-800",
        gradient: "from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20",
        button: "bg-blue-600 hover:bg-blue-700",
      },
      purple: {
        bg: "bg-purple-100 dark:bg-purple-900/30",
        text: "text-purple-600 dark:text-purple-400",
        border: "border-purple-200 dark:border-purple-800",
        gradient: "from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20",
        button: "bg-purple-600 hover:bg-purple-700",
      },
      green: {
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-600 dark:text-green-400",
        border: "border-green-200 dark:border-green-800",
        gradient: "from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20",
        button: "bg-green-600 hover:bg-green-700",
      },
      orange: {
        bg: "bg-orange-100 dark:bg-orange-900/30",
        text: "text-orange-600 dark:text-orange-400",
        border: "border-orange-200 dark:border-orange-800",
        gradient: "from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20",
        button: "bg-orange-600 hover:bg-orange-700",
      },
      indigo: {
        bg: "bg-indigo-100 dark:bg-indigo-900/30",
        text: "text-indigo-600 dark:text-indigo-400",
        border: "border-indigo-200 dark:border-indigo-800",
        gradient: "from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20",
        button: "bg-indigo-600 hover:bg-indigo-700",
      },
      red: {
        bg: "bg-red-100 dark:bg-red-900/30",
        text: "text-red-600 dark:text-red-400",
        border: "border-red-200 dark:border-red-800",
        gradient: "from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20",
        button: "bg-red-600 hover:bg-red-700",
      },
    };
    return colors[color] || colors.blue;
  };

  const renderFeatureContent = () => {
    const colorClasses = getColorClasses(selectedCompliance?.color || "blue");

    switch (activeFeatureTab) {
      case "calculation":
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    Auto-Calculation Based on Salary
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Automatic computation of {selectedCompliance?.label} based on employee salary structure
                  </p>
                </div>
                <button
                  className={`px-4 py-2 ${colorClasses.button} text-white rounded-lg font-medium transition-colors flex items-center gap-2`}
                >
                  <Calculator className="w-4 h-4" />
                  Run Calculation
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Employees Covered</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">150</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Contribution</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">₹2,50,000</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Last Calculated</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Jan 2026</p>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Employee</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Salary Base</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Calculation Rate</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900 dark:text-white">John Doe</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">EMP-001</p>
                      </td>
                      <td className="px-4 py-3 text-gray-900 dark:text-white">₹50,000</td>
                      <td className="px-4 py-3 text-gray-900 dark:text-white">12%</td>
                      <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">₹6,000</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-300">
                          Calculated
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case "registers":
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    Compliance Registers
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Maintain statutory registers and records for {selectedCompliance?.label}
                  </p>
                </div>
                <button
                  className={`px-4 py-2 ${colorClasses.button} text-white rounded-lg font-medium transition-colors flex items-center gap-2`}
                >
                  <BookOpen className="w-4 h-4" />
                  View Registers
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${colorClasses.bg} ${colorClasses.text}`}>
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Monthly Register</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Jan 2026</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    Monthly contribution and deduction register
                  </p>
                  <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                    View Details →
                  </button>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${colorClasses.bg} ${colorClasses.text}`}>
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Annual Register</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">FY 2025-26</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    Annual consolidated register and statements
                  </p>
                  <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                    View Details →
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case "reports":
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    Monthly / Annual Reports
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Generate statutory compliance reports for {selectedCompliance?.label}
                  </p>
                </div>
                <div className="flex gap-2">
                  <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-white">
                    <option>Monthly</option>
                    <option>Annual</option>
                    <option>Quarterly</option>
                  </select>
                  <button
                    className={`px-4 py-2 ${colorClasses.button} text-white rounded-lg font-medium transition-colors flex items-center gap-2`}
                  >
                    <FileBarChart className="w-4 h-4" />
                    Generate Report
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Monthly Report - January 2026</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Generated on 05 Feb 2026</p>
                    </div>
                    <button className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                </div>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Annual Report - FY 2024-25</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Generated on 01 Apr 2025</p>
                    </div>
                    <button className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "challan":
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    Challan Generation (Data-Ready)
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Generate payment challans for {selectedCompliance?.label} submission
                  </p>
                </div>
                <button
                  className={`px-4 py-2 ${colorClasses.button} text-white rounded-lg font-medium transition-colors flex items-center gap-2`}
                >
                  <Download className="w-4 h-4" />
                  Generate Challan
                </button>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                      Data-Ready Format
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      Challan data is pre-formatted and ready for direct upload to government portals. All calculations and validations are pre-verified.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Challan - January 2026</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Amount: ₹2,50,000 • Status: Ready
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                      <button className="px-4 py-2 text-sm font-medium text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors">
                        Upload to Portal
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen dark:bg-gray-900 p-4 sm:p-6">
      <Breadcrumb />

      {/* Header */}
      <div className="mt-4 mb-6 rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50 p-5 shadow-sm dark:border-indigo-900/40 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950/40">
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Statutory Compliance (India)
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Manage mandatory Indian statutory requirements
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Compliance Types Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm sticky top-6">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-4">
              Compliance Types
            </h3>
            <div className="space-y-2">
              {complianceTypes.map((compliance) => {
                const Icon = compliance.icon;
                const colorClasses = getColorClasses(compliance.color);
                const isActive = activeCompliance === compliance.id;

                return (
                  <button
                    key={compliance.id}
                    onClick={() => setActiveCompliance(compliance.id)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all text-left ${
                      isActive
                        ? `${colorClasses.bg} ${colorClasses.text} border-2 ${colorClasses.border} shadow-sm`
                        : "hover:bg-gray-50 dark:hover:bg-gray-700/50 border-2 border-transparent"
                    } ${compliance.highlighted ? "ring-2 ring-yellow-300 dark:ring-yellow-700" : ""}`}
                  >
                    <div className={`p-2 rounded-lg ${isActive ? colorClasses.bg : "bg-gray-100 dark:bg-gray-700"}`}>
                      <Icon className={`w-4 h-4 ${isActive ? colorClasses.text : "text-gray-500 dark:text-gray-400"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${isActive ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"}`}>
                        {compliance.label}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {compliance.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Selected Compliance Header */}
          <div className={`bg-gradient-to-r ${getColorClasses(selectedCompliance?.color || "blue").gradient} rounded-xl border ${getColorClasses(selectedCompliance?.color || "blue").border} p-6 shadow-sm`}>
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${getColorClasses(selectedCompliance?.color || "blue").bg} ${getColorClasses(selectedCompliance?.color || "blue").text}`}>
                {selectedCompliance && (
                  <selectedCompliance.icon className="w-6 h-6" />
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {selectedCompliance?.label}
                  {selectedCompliance?.highlighted && (
                    <span className="ml-2 px-2 py-0.5 bg-yellow-200 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300 text-xs font-semibold rounded-full">
                      Highlighted
                    </span>
                  )}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {selectedCompliance?.description}
                </p>
              </div>
              <button className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Configure
              </button>
            </div>
          </div>

          {/* Feature Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 pt-4">
              <button
                onClick={() => setActiveFeatureTab("calculation")}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                  activeFeatureTab === "calculation"
                    ? "border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                    : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                <Calculator className="w-4 h-4" />
                Auto-Calculation
              </button>
              <button
                onClick={() => setActiveFeatureTab("registers")}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                  activeFeatureTab === "registers"
                    ? "border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                    : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                <BookOpen className="w-4 h-4" />
                Compliance Registers
              </button>
              <button
                onClick={() => setActiveFeatureTab("reports")}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                  activeFeatureTab === "reports"
                    ? "border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                    : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                <FileBarChart className="w-4 h-4" />
                Reports
              </button>
              <button
                onClick={() => setActiveFeatureTab("challan")}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                  activeFeatureTab === "challan"
                    ? "border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                    : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                <Download className="w-4 h-4" />
                Challan Generation
              </button>
            </div>

            <div className="p-4 sm:p-6">
              {renderFeatureContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
