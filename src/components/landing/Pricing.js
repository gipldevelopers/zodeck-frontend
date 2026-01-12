// 'use client';
// import { motion, useInView } from "framer-motion";
// import { useRef, useState } from "react";
// import { Check, X, Sparkles } from "lucide-react";
// import { Button } from "@/components/ui/button";

// const plans = [
//   {
//     name: "Starter",
//     description: "Perfect for small teams getting started",
//     price: { monthly: 4999, yearly: 3999 },
//     currency: "₹",
//     per: "per month",
//     employees: "Up to 50 employees",
//     popular: false,
//     features: [
//       { name: "Core HR Management", included: true },
//       { name: "Attendance Tracking", included: true },
//       { name: "Leave Management", included: true },
//       { name: "Basic Payroll", included: true },
//       { name: "Employee Self-Service", included: true },
//       { name: "Email Support", included: true },
//       { name: "Advanced Analytics", included: false },
//       { name: "API Access", included: false },
//       { name: "Custom Integrations", included: false },
//     ],
//   },
//   {
//     name: "Professional",
//     description: "Most popular for growing businesses",
//     price: { monthly: 9999, yearly: 7999 },
//     currency: "₹",
//     per: "per month",
//     employees: "Up to 250 employees",
//     popular: true,
//     features: [
//       { name: "Core HR Management", included: true },
//       { name: "Attendance Tracking", included: true },
//       { name: "Leave Management", included: true },
//       { name: "Full Payroll & Compliance", included: true },
//       { name: "Employee & Manager Portals", included: true },
//       { name: "Recruitment Module", included: true },
//       { name: "Advanced Analytics", included: true },
//       { name: "Priority Support", included: true },
//       { name: "API Access", included: false },
//     ],
//   },
//   {
//     name: "Enterprise",
//     description: "For large organizations with complex needs",
//     price: { monthly: null, yearly: null },
//     currency: "",
//     per: "Custom pricing",
//     employees: "Unlimited employees",
//     popular: false,
//     features: [
//       { name: "Everything in Professional", included: true },
//       { name: "Custom Workflows", included: true },
//       { name: "Dedicated Account Manager", included: true },
//       { name: "Custom Integrations", included: true },
//       { name: "API Access", included: true },
//       { name: "On-premise Deployment", included: true },
//       { name: "SLA Guarantee", included: true },
//       { name: "24/7 Phone Support", included: true },
//       { name: "Training & Onboarding", included: true },
//     ],
//   },
// ];

// export const Pricing = () => {
//   const [isYearly, setIsYearly] = useState(false);
//   const containerRef = useRef(null);
//   const isInView = useInView(containerRef, { once: true, margin: "-100px" });

//   return (
//     <section id="pricing" className="section-padding bg-muted/30 relative overflow-hidden">
//       {/* Background */}
//       <div className="absolute inset-0">
//         <div className="absolute top-20 left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
//         <div className="absolute bottom-20 right-20 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
//       </div>

//       <div className="container-custom relative z-10" ref={containerRef}>
//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           animate={isInView ? { opacity: 1, y: 0 } : {}}
//           transition={{ duration: 0.6 }}
//           className="text-center max-w-3xl mx-auto mb-12"
//         >
//           <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
//             Simple Pricing
//           </span>
//           <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
//             Choose the Perfect Plan for{" "}
//             <span className="gradient-text">Your Team</span>
//           </h2>
//           <p className="text-lg text-muted-foreground">
//             Flexible pricing that scales with your business. All plans include a 14-day free trial.
//           </p>
//         </motion.div>

//         {/* Billing toggle */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={isInView ? { opacity: 1, y: 0 } : {}}
//           transition={{ delay: 0.2 }}
//           className="flex items-center justify-center gap-4 mb-12"
//         >
//           <span className={`text-sm font-medium ${!isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
//             Monthly
//           </span>
//           <button
//             onClick={() => setIsYearly(!isYearly)}
//             className={`relative w-14 h-7 rounded-full transition-colors ${
//               isYearly ? 'bg-primary' : 'bg-border'
//             }`}
//           >
//             <motion.div
//               animate={{ x: isYearly ? 28 : 4 }}
//               transition={{ type: "spring", stiffness: 500, damping: 30 }}
//               className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md"
//             />
//           </button>
//           <span className={`text-sm font-medium ${isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
//             Yearly
//           </span>
//           <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
//             Save 20%
//           </span>
//         </motion.div>

//         {/* Pricing cards */}
//         <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
//           {plans.map((plan, index) => (
//             <motion.div
//               key={plan.name}
//               initial={{ opacity: 0, y: 40 }}
//               animate={isInView ? { opacity: 1, y: 0 } : {}}
//               transition={{ duration: 0.5, delay: index * 0.1 }}
//               className={`relative bg-white rounded-3xl p-8 border ${
//                 plan.popular 
//                   ? 'border-primary shadow-glow scale-105 lg:scale-110' 
//                   : 'border-border/50 shadow-card'
//               }`}
//             >
//               {/* Popular badge */}
//               {plan.popular && (
//                 <div className="absolute -top-4 left-1/2 -translate-x-1/2">
//                   <div className="flex items-center gap-1 px-4 py-1.5 bg-primary text-white text-sm font-medium rounded-full shadow-lg">
//                     <Sparkles className="w-4 h-4" />
//                     Most Popular
//                   </div>
//                 </div>
//               )}

//               {/* Plan header */}
//               <div className="mb-6">
//                 <h3 className="font-display text-xl font-bold text-foreground mb-1">
//                   {plan.name}
//                 </h3>
//                 <p className="text-sm text-muted-foreground">{plan.description}</p>
//               </div>

//               {/* Price */}
//               <div className="mb-6">
//                 {plan.price.monthly ? (
//                   <>
//                     <div className="flex items-baseline gap-1">
//                       <span className="text-4xl font-display font-bold text-foreground">
//                         {plan.currency}{isYearly ? plan.price.yearly.toLocaleString() : plan.price.monthly.toLocaleString()}
//                       </span>
//                       <span className="text-muted-foreground">/{plan.per.split(' ')[1]}</span>
//                     </div>
//                     <p className="text-sm text-muted-foreground mt-1">{plan.employees}</p>
//                   </>
//                 ) : (
//                   <>
//                     <div className="text-4xl font-display font-bold text-foreground">
//                       Custom
//                     </div>
//                     <p className="text-sm text-muted-foreground mt-1">{plan.employees}</p>
//                   </>
//                 )}
//               </div>

//               {/* CTA */}
//               <Button
//                 className={`w-full rounded-full mb-8 ${
//                   plan.popular 
//                     ? 'btn-primary' 
//                     : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
//                 }`}
//               >
//                 {plan.price.monthly ? 'Start Free Trial' : 'Contact Sales'}
//               </Button>

//               {/* Features */}
//               <ul className="space-y-3">
//                 {plan.features.map((feature) => (
//                   <li key={feature.name} className="flex items-center gap-3">
//                     {feature.included ? (
//                       <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
//                         <Check className="w-3 h-3 text-green-600" />
//                       </div>
//                     ) : (
//                       <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
//                         <X className="w-3 h-3 text-muted-foreground" />
//                       </div>
//                     )}
//                     <span className={feature.included ? 'text-foreground' : 'text-muted-foreground'}>
//                       {feature.name}
//                     </span>
//                   </li>
//                 ))}
//               </ul>
//             </motion.div>
//           ))}
//         </div>

//         {/* Enterprise note */}
//         <motion.p
//           initial={{ opacity: 0 }}
//           animate={isInView ? { opacity: 1 } : {}}
//           transition={{ delay: 0.6 }}
//           className="text-center text-sm text-muted-foreground mt-12"
//         >
//           All prices are in INR and exclude applicable taxes. 
//           Need a custom solution? <a href="#" className="text-primary hover:underline">Contact our sales team</a>.
//         </motion.p>
//       </div>
//     </section>
//   );
// };

"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Check, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Starter",
    description: "Perfect for small teams getting started",
    price: { monthly: 4999, yearly: 3999 },
    currency: "₹",
    per: "per month",
    employees: "Up to 50 employees",
    popular: false,
    features: [
      { name: "Core HR Management", included: true },
      { name: "Attendance Tracking", included: true },
      { name: "Leave Management", included: true },
      { name: "Basic Payroll", included: true },
      { name: "Employee Self-Service", included: true },
      { name: "Email Support", included: true },
      { name: "Advanced Analytics", included: false },
      { name: "API Access", included: false },
      { name: "Custom Integrations", included: false },
    ],
  },
  {
    name: "Professional",
    description: "Most popular for growing businesses",
    price: { monthly: 9999, yearly: 7999 },
    currency: "₹",
    per: "per month",
    employees: "Up to 250 employees",
    popular: true,
    features: [
      { name: "Core HR Management", included: true },
      { name: "Attendance Tracking", included: true },
      { name: "Leave Management", included: true },
      { name: "Full Payroll & Compliance", included: true },
      { name: "Employee & Manager Portals", included: true },
      { name: "Recruitment Module", included: true },
      { name: "Advanced Analytics", included: true },
      { name: "Priority Support", included: true },
      { name: "API Access", included: false },
    ],
  },
  {
    name: "Enterprise",
    description: "For large organizations with complex needs",
    price: { monthly: null, yearly: null },
    currency: "",
    per: "Custom pricing",
    employees: "Unlimited employees",
    popular: false,
    features: [
      { name: "Everything in Professional", included: true },
      { name: "Custom Workflows", included: true },
      { name: "Dedicated Account Manager", included: true },
      { name: "Custom Integrations", included: true },
      { name: "API Access", included: true },
      { name: "On-premise Deployment", included: true },
      { name: "SLA Guarantee", included: true },
      { name: "24/7 Phone Support", included: true },
      { name: "Training & Onboarding", included: true },
    ],
  },
];

export const Pricing = () => {
  const [isYearly, setIsYearly] = useState(false);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section id="pricing" className="section-padding bg-muted/30 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative z-10" ref={containerRef}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Simple Pricing
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Choose the Perfect Plan for{" "}
            <span className="gradient-text">Your Team</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Flexible pricing that scales with your business. All plans include a 14-day free trial.
          </p>
        </motion.div>

        {/* Billing toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-4 mb-12"
        >
          <span className={`text-sm font-medium ${!isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
            Monthly
          </span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className={`relative w-14 h-7 rounded-full transition-colors ${
              isYearly ? 'bg-primary' : 'bg-border'
            }`}
          >
            <motion.div
              animate={{ x: isYearly ? 28 : 4 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md"
            />
          </button>
          <span className={`text-sm font-medium ${isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
            Yearly
          </span>
          <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
            Save 20%
          </span>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative bg-white rounded-3xl p-8 border ${
                plan.popular 
                  ? 'border-primary shadow-glow scale-105 lg:scale-110' 
                  : 'border-border/50 shadow-card'
              }`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1 px-4 py-1.5 bg-primary text-white text-sm font-medium rounded-full shadow-lg">
                    <Sparkles className="w-4 h-4" />
                    Most Popular
                  </div>
                </div>
              )}

              {/* Plan header */}
              <div className="mb-6">
                <h3 className="font-display text-xl font-bold text-foreground mb-1">
                  {plan.name}
                </h3>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="mb-6">
                {plan.price.monthly ? (
                  <>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-display font-bold text-foreground">
                        {plan.currency}{isYearly ? plan.price.yearly?.toLocaleString() : plan.price.monthly?.toLocaleString()}
                      </span>
                      <span className="text-muted-foreground">/{plan.per.split(' ')[1]}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{plan.employees}</p>
                  </>
                ) : (
                  <>
                    <div className="text-4xl font-display font-bold text-foreground">
                      Custom
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{plan.employees}</p>
                  </>
                )}
              </div>

              {/* CTA */}
              <Button
                className={`w-full rounded-full mb-8 ${
                  plan.popular 
                    ? 'btn-primary' 
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {plan.price.monthly ? 'Start Free Trial' : 'Contact Sales'}
              </Button>

              {/* Features */}
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature.name} className="flex items-center gap-3">
                    {feature.included ? (
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                        <Check className="w-3 h-3 text-green-600" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
                        <X className="w-3 h-3 text-muted-foreground" />
                      </div>
                    )}
                    <span className={feature.included ? 'text-foreground' : 'text-muted-foreground'}>
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Enterprise note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center text-sm text-muted-foreground mt-12"
        >
          All prices are in INR and exclude applicable taxes. 
          Need a custom solution? <a href="#" className="text-primary hover:underline">Contact our sales team</a>.
        </motion.p>
      </div>
    </section>
  );
};