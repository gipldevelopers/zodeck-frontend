'use client';
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { 
  Users, 
  ClipboardList, 
  Calendar, 
  Wallet,
  UserCheck,
  Briefcase,
  LayoutDashboard,
  Settings,
  Shield,
  ChevronRight
} from "lucide-react";

const modules = [
  {
    id: "core-hr",
    icon: Users,
    title: "Core HR",
    subtitle: "Employee Lifecycle Management",
    features: [
      "Employee Master Database",
      "Organization Structure",
      "Document Vault & Management",
      "Department & Designation Mapping",
    ],
    gradient: "from-primary to-teal-500",
  },
  {
    id: "attendance",
    icon: ClipboardList,
    title: "Attendance",
    subtitle: "Time & Tracking",
    features: [
      "Dual Mode: Timesheet + Biometric",
      "Jira Integration for Tech Teams",
      "Late & Early Tracking",
      "Overtime Management",
    ],
    gradient: "from-blue-500 to-indigo-500",
  },
  {
    id: "leave",
    icon: Calendar,
    title: "Leave Management",
    subtitle: "Policies & Approvals",
    features: [
      "CL / SL / EL Configuration",
      "Automated Accruals",
      "Multi-level Approval Workflows",
      "Leave Balance Tracking",
    ],
    gradient: "from-green-500 to-emerald-500",
  },
  {
    id: "payroll",
    icon: Wallet,
    title: "Payroll & Compliance",
    subtitle: "Indian Statutory Requirements",
    features: [
      "CTC Structure & Components",
      "PF / ESI / PT / LWF / TDS",
      "Payslip Generation",
      "Full & Final Settlement",
    ],
    gradient: "from-accent to-orange-500",
  },
  {
    id: "recruitment",
    icon: Briefcase,
    title: "Recruitment",
    subtitle: "Hire to Onboard",
    features: [
      "Job Requisition Management",
      "Candidate Tracking",
      "Offer Letter Generation",
      "Pre-onboarding Workflows",
    ],
    gradient: "from-purple-500 to-pink-500",
  },
  {
    id: "ess-mss",
    icon: UserCheck,
    title: "ESS / MSS Portals",
    subtitle: "Self-Service Access",
    features: [
      "Employee Self-Service",
      "Manager Self-Service",
      "Profile & Document Access",
      "Request & Approval Center",
    ],
    gradient: "from-rose-500 to-red-500",
  },
];

const roles = [
  { name: "Super Admin", description: "Platform configuration & governance" },
  { name: "HR Admin", description: "HR operations & employee management" },
  { name: "Payroll Officer", description: "Payroll processing & compliance" },
  { name: "Finance", description: "Payroll approvals & cost centers" },
  { name: "Recruiter", description: "Hiring & onboarding workflows" },
  { name: "Manager (MSS)", description: "Team management & approvals" },
  { name: "Employee (ESS)", description: "Self-service portal access" },
  { name: "IT Admin", description: "System integrations & security" },
];

export const Modules = () => {
  const [activeModule, setActiveModule] = useState(modules[0].id);
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" });

  const activeModuleData = modules.find(m => m.id === activeModule);

  return (
    <section id="modules" className="section-padding bg-muted/30 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative z-10">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Complete Solution
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Integrated Modules for{" "}
            <span className="gradient-text">Every HR Need</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Six powerful modules working together to deliver a seamless 
            HR management experience.
          </p>
        </motion.div>

        {/* Modules Interactive Section */}
        <div className="grid lg:grid-cols-5 gap-8 mb-20">
          {/* Module Selector */}
          <div className="lg:col-span-2 space-y-3">
            {modules.map((module, index) => (
              <motion.button
                key={module.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setActiveModule(module.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-300 text-left ${
                  activeModule === module.id
                    ? "bg-white shadow-card-hover border-l-4 border-primary"
                    : "bg-transparent hover:bg-white/50"
                }`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${module.gradient} flex items-center justify-center shadow-lg`}>
                  <module.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-display font-semibold text-foreground">{module.title}</h4>
                  <p className="text-sm text-muted-foreground">{module.subtitle}</p>
                </div>
                <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${activeModule === module.id ? 'rotate-90' : ''}`} />
              </motion.button>
            ))}
          </div>

          {/* Module Details */}
          <motion.div
            key={activeModule}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-3"
          >
            {activeModuleData && (
              <div className="bg-white rounded-3xl p-8 shadow-card-hover h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${activeModuleData.gradient} flex items-center justify-center shadow-lg`}>
                    <activeModuleData.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-bold text-foreground">
                      {activeModuleData.title}
                    </h3>
                    <p className="text-muted-foreground">{activeModuleData.subtitle}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Key Features:</h4>
                  <ul className="space-y-3">
                    {activeModuleData.features.map((feature, index) => (
                      <motion.li
                        key={feature}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-3"
                      >
                        <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${activeModuleData.gradient} flex items-center justify-center`}>
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-foreground">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Mini 3D Card Effect */}
                <motion.div
                  whileHover={{ rotateY: 5, rotateX: -5 }}
                  transition={{ duration: 0.3 }}
                  className="mt-8 p-4 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl border border-border/50"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <LayoutDashboard className="w-5 h-5 text-primary" />
                      <span className="text-sm font-medium text-foreground">Role-based dashboards</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Settings className="w-5 h-5 text-muted-foreground" />
                      <Shield className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Roles Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-10">
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">
              10 Granular Roles with{" "}
              <span className="gradient-text">Fine-Tuned Access</span>
            </h3>
            <p className="text-muted-foreground">From Super Admin to Employee - everyone gets exactly what they need</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {roles.map((role, index) => (
              <motion.div
                key={role.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl p-4 border border-border/50 shadow-card hover:shadow-card-hover transition-shadow"
              >
                <h4 className="font-medium text-foreground">{role.name}</h4>
                <p className="text-sm text-muted-foreground">{role.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};