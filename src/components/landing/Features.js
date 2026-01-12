// // "use client";
// // import React from "react";
// // import TiltCard from "../ui/TiltCard";
// // import { Users, Briefcase, Calculator, Clock, FileText, Smartphone } from "lucide-react";

// // const features = [
// //   {
// //     title: "Core HR Operations",
// //     desc: "Employee Master, Org Structure, and Document Vault in one place.",
// //     icon: <Users className="w-8 h-8 text-blue-500" />,
// //     gradient: "from-blue-500 to-indigo-500",
// //   },
// //   {
// //     title: "Indian Payroll",
// //     desc: "Automated PF, ESI, PT, TDS, Payslips, and F&F Settlements.",
// //     icon: <Calculator className="w-8 h-8 text-emerald-500" />,
// //     gradient: "from-emerald-500 to-teal-500",
// //   },
// //   {
// //     title: "Smart Attendance",
// //     desc: "Dual mode tracking (Biometric + Timesheet) with Geofencing.",
// //     icon: <Clock className="w-8 h-8 text-amber-500" />,
// //     gradient: "from-amber-500 to-orange-500",
// //   },
// //   {
// //     title: "Recruitment (ATS)",
// //     desc: "End-to-end hiring: Requisitions, Candidate Pipeline, and Onboarding.",
// //     icon: <Briefcase className="w-8 h-8 text-purple-500" />,
// //     gradient: "from-purple-500 to-pink-500",
// //   },
// //   {
// //     title: "Statutory Compliance",
// //     desc: "Auto-generated monthly registers & challans for Indian laws.",
// //     icon: <FileText className="w-8 h-8 text-red-500" />,
// //     gradient: "from-red-500 to-rose-500",
// //   },
// //   {
// //     title: "Mobile PWA",
// //     desc: "Offline timesheets, Push Notifications, and Self-service on the go.",
// //     icon: <Smartphone className="w-8 h-8 text-cyan-500" />,
// //     gradient: "from-cyan-500 to-blue-500",
// //   },
// // ];

// // export default function Features() {
// //   return (
// //     <section id="features" className="py-20 bg-gray-50 dark:bg-gray-900/50">
// //       <div className="container mx-auto px-6">
// //         <div className="text-center mb-16">
// //           <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
// //             Everything you need to <span className="text-blue-600">manage your workforce</span>
// //           </h2>
// //           <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
// //             A comprehensive suite of modules designed for the modern Indian enterprise.
// //           </p>
// //         </div>

// //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
// //           {features.map((feature, index) => (
// //             <div key={index} className="h-64">
// //               <TiltCard className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
// //                 <div className="p-6 flex flex-col items-center text-center h-full justify-center">
// //                   <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg mb-6 text-white`}>
// //                     {feature.icon}
// //                   </div>
// //                   <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
// //                     {feature.title}
// //                   </h3>
// //                   <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
// //                     {feature.desc}
// //                   </p>
// //                 </div>
// //               </TiltCard>
// //             </div>
// //           ))}
// //         </div>
// //       </div>
// //     </section>
// //   );
// // }

// 'use client';
// import { motion, useInView } from "framer-motion";
// import { useRef } from "react";
// import { 
//   Users, 
//   Calculator, 
//   CalendarDays, 
//   FileCheck, 
//   UserPlus, 
//   Shield,
//   Smartphone,
//   GitBranch,
//   BarChart3
// } from "lucide-react";

// const features = [
//   {
//     icon: Users,
//     title: "Core HR Management",
//     description: "Centralized employee database with complete lifecycle management from onboarding to exit.",
//     color: "bg-primary/10",
//     iconColor: "text-primary",
//   },
//   {
//     icon: Calculator,
//     title: "Payroll & Compliance",
//     description: "Indian payroll with PF, ESI, PT, TDS calculations and automated statutory compliance.",
//     color: "bg-accent/10",
//     iconColor: "text-accent",
//   },
//   {
//     icon: CalendarDays,
//     title: "Attendance Management",
//     description: "Dual-mode tracking with biometric and timesheet integration. Jira sync for tech teams.",
//     color: "bg-green-100",
//     iconColor: "text-green-600",
//   },
//   {
//     icon: FileCheck,
//     title: "Leave Management",
//     description: "Configurable leave policies with CL/SL/EL, automated accruals and multi-level approvals.",
//     color: "bg-purple-100",
//     iconColor: "text-purple-600",
//   },
//   {
//     icon: UserPlus,
//     title: "Recruitment Module",
//     description: "End-to-end hiring workflow from requisition to offer letter with candidate tracking.",
//     color: "bg-blue-100",
//     iconColor: "text-blue-600",
//   },
//   {
//     icon: Shield,
//     title: "Role-Based Access",
//     description: "Granular permissions for 10 different roles from Super Admin to Department Heads.",
//     color: "bg-rose-100",
//     iconColor: "text-rose-600",
//   },
//   {
//     icon: Smartphone,
//     title: "Mobile PWA",
//     description: "Progressive Web App with offline timesheets and push notifications for on-the-go access.",
//     color: "bg-teal-100",
//     iconColor: "text-teal-600",
//   },
//   {
//     icon: GitBranch,
//     title: "Workflow Engine",
//     description: "Customizable approval workflows with multi-level escalation and SLA management.",
//     color: "bg-amber-100",
//     iconColor: "text-amber-600",
//   },
//   {
//     icon: BarChart3,
//     title: "Reports & Analytics",
//     description: "Comprehensive HR analytics with customizable dashboards and compliance reports.",
//     color: "bg-indigo-100",
//     iconColor: "text-indigo-600",
//   },
// ];

// const FeatureCard = ({ feature, index }) => {
//   const ref = useRef(null);
//   const isInView = useInView(ref, { once: true, margin: "-100px" });

//   return (
//     <motion.div
//       ref={ref}
//       initial={{ opacity: 0, y: 40 }}
//       animate={isInView ? { opacity: 1, y: 0 } : {}}
//       transition={{ duration: 0.5, delay: index * 0.1 }}
//       className="group relative"
//     >
//       <div className="relative h-full bg-card rounded-2xl p-6 border border-border/50 shadow-card transition-all duration-500 hover:shadow-card-hover hover:-translate-y-1 overflow-hidden">
//         {/* Gradient overlay on hover */}
//         <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
//         {/* Icon */}
//         <div className={`relative w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-4 transition-transform duration-500 group-hover:scale-110`}>
//           <feature.icon className={`w-7 h-7 ${feature.iconColor}`} />
//         </div>

//         {/* Content */}
//         <h3 className="relative font-display text-xl font-semibold text-foreground mb-2">
//           {feature.title}
//         </h3>
//         <p className="relative text-muted-foreground text-sm leading-relaxed">
//           {feature.description}
//         </p>

//         {/* Arrow indicator */}
//         <motion.div
//           className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
//           whileHover={{ x: 5 }}
//         >
//           <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
//             <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
//             </svg>
//           </div>
//         </motion.div>
//       </div>
//     </motion.div>
//   );
// };

// export const Features = () => {
//   const headerRef = useRef(null);
//   const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" });

//   return (
//     <section id="features" className="section-padding bg-background relative">
//       {/* Background decoration */}
//       <div className="absolute inset-0 overflow-hidden">
//         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
//       </div>

//       <div className="container-custom relative z-10">
//         {/* Section Header */}
//         <motion.div
//           ref={headerRef}
//           initial={{ opacity: 0, y: 30 }}
//           animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
//           transition={{ duration: 0.6 }}
//           className="text-center max-w-3xl mx-auto mb-16"
//         >
//           <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
//             Powerful Features
//           </span>
//           <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
//             Everything You Need to{" "}
//             <span className="gradient-text">Manage Your Workforce</span>
//           </h2>
//           <p className="text-lg text-muted-foreground">
//             A comprehensive suite of tools designed specifically for Indian businesses 
//             to streamline HR operations and ensure compliance.
//           </p>
//         </motion.div>

//         {/* Features Grid */}
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {features.map((feature, index) => (
//             <FeatureCard key={feature.title} feature={feature} index={index} />
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

'use client';
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { 
  Users, 
  Calculator, 
  CalendarDays, 
  FileCheck, 
  UserPlus, 
  Shield,
  Smartphone,
  GitBranch,
  BarChart3
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Core HR Management",
    description: "Centralized employee database with complete lifecycle management from onboarding to exit.",
    color: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    icon: Calculator,
    title: "Payroll & Compliance",
    description: "Indian payroll with PF, ESI, PT, TDS calculations and automated statutory compliance.",
    color: "bg-accent/10",
    iconColor: "text-accent",
  },
  {
    icon: CalendarDays,
    title: "Attendance Management",
    description: "Dual-mode tracking with biometric and timesheet integration. Jira sync for tech teams.",
    color: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    icon: FileCheck,
    title: "Leave Management",
    description: "Configurable leave policies with CL/SL/EL, automated accruals and multi-level approvals.",
    color: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    icon: UserPlus,
    title: "Recruitment Module",
    description: "End-to-end hiring workflow from requisition to offer letter with candidate tracking.",
    color: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    icon: Shield,
    title: "Role-Based Access",
    description: "Granular permissions for 10 different roles from Super Admin to Department Heads.",
    color: "bg-rose-100",
    iconColor: "text-rose-600",
  },
  {
    icon: Smartphone,
    title: "Mobile PWA",
    description: "Progressive Web App with offline timesheets and push notifications for on-the-go access.",
    color: "bg-teal-100",
    iconColor: "text-teal-600",
  },
  {
    icon: GitBranch,
    title: "Workflow Engine",
    description: "Customizable approval workflows with multi-level escalation and SLA management.",
    color: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  {
    icon: BarChart3,
    title: "Reports & Analytics",
    description: "Comprehensive HR analytics with customizable dashboards and compliance reports.",
    color: "bg-indigo-100",
    iconColor: "text-indigo-600",
  },
];

function FeatureCard({ feature, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative"
    >
      <div className="relative h-full bg-card rounded-2xl p-6 border border-border/50 shadow-card transition-all duration-500 hover:shadow-card-hover hover:-translate-y-1 overflow-hidden">
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Icon */}
        <div className={`relative w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-4 transition-transform duration-500 group-hover:scale-110`}>
          <feature.icon className={`w-7 h-7 ${feature.iconColor}`} />
        </div>

        {/* Content */}
        <h3 className="relative font-display text-xl font-semibold text-foreground mb-2">
          {feature.title}
        </h3>
        <p className="relative text-muted-foreground text-sm leading-relaxed">
          {feature.description}
        </p>

        {/* Arrow indicator */}
        <motion.div
          className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          whileHover={{ x: 5 }}
        >
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export function Features() {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" });

  return (
    <section id="features" className="section-padding bg-background relative">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Powerful Features
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Everything You Need to{" "}
            <span className="gradient-text">Manage Your Workforce</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            A comprehensive suite of tools designed specifically for Indian businesses 
            to streamline HR operations and ensure compliance.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;