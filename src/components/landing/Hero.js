// "use client";

// import { motion } from "framer-motion";
// import { ArrowRight, Play, CheckCircle2, Sparkles } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { FloatingDashboard } from "./FloatingDashboard";

// const stats = [
//   { value: "1000+", label: "Concurrent Users" },
//   { value: "99.9%", label: "Uptime SLA" },
//   { value: "100%", label: "India Compliant" },
// ];

// const features = [
//   "Full Payroll & Statutory Compliance",
//   "Employee Self-Service Portal",
//   "Multi-level Approval Workflows",
// ];

// export const Hero = () => {
//   return (
//     <section className="relative min-h-screen flex items-center overflow-hidden mesh-gradient grain">
//       {/* Animated background elements */}
//       <div className="absolute inset-0 overflow-hidden">
//         <motion.div
//           animate={{ 
//             x: [0, 30, 0],
//             y: [0, -20, 0],
//           }}
//           transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
//           className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
//         />
//         <motion.div
//           animate={{ 
//             x: [0, -30, 0],
//             y: [0, 30, 0],
//           }}
//           transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
//           className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl"
//         />
//       </div>

//       <div className="container-custom relative z-10 pt-32 pb-20">
//         <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
//           {/* Left Content */}
//           <motion.div
//             initial={{ opacity: 0, x: -50 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.8, ease: "easeOut" }}
//             className="text-center lg:text-left"
//           >
//             {/* Badge */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.2 }}
//               className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6"
//             >
//               <Sparkles className="w-4 h-4" />
//               <span>Manifesting Growth for Indian SMEs</span>
//             </motion.div>

//             {/* Headline */}
//             <motion.h1
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.3 }}
//               className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-tight mb-6"
//             >
//               The Complete{" "}
//               <span className="gradient-text">HRMS Solution</span>
//               {" "}for Modern Businesses
//             </motion.h1>

//             {/* Subtitle */}
//             <motion.p
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.4 }}
//               className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8"
//             >
//               Streamline your HR operations with India's most comprehensive 
//               workforce management platform. From payroll to recruitment, 
//               all in one powerful solution.
//             </motion.p>

//             {/* Feature checklist */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.5 }}
//               className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8"
//             >
//               {features.map((feature, index) => (
//                 <div key={index} className="flex items-center gap-2 text-sm text-foreground">
//                   <CheckCircle2 className="w-5 h-5 text-primary" />
//                   <span>{feature}</span>
//                 </div>
//               ))}
//             </motion.div>

//             {/* CTA Buttons */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.6 }}
//               className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
//             >
//               <Button size="lg" className="btn-primary rounded-full px-8 text-base group">
//                 Start Your Free Trial
//                 <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
//               </Button>
//               <Button 
//                 size="lg" 
//                 variant="outline" 
//                 className="rounded-full px-8 text-base border-2 group"
//               >
//                 <Play className="mr-2 w-5 h-5 text-primary" />
//                 Watch Demo
//               </Button>
//             </motion.div>

//             {/* Stats */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.7 }}
//               className="flex justify-center lg:justify-start gap-8 mt-12 pt-8 border-t border-border/50"
//             >
//               {stats.map((stat, index) => (
//                 <div key={index} className="text-center lg:text-left">
//                   <div className="font-display text-2xl sm:text-3xl font-bold text-foreground">
//                     {stat.value}
//                   </div>
//                   <div className="text-sm text-muted-foreground">{stat.label}</div>
//                 </div>
//               ))}
//             </motion.div>
//           </motion.div>

//           {/* Right Content - 3D Dashboard */}
//           <motion.div
//             initial={{ opacity: 0, x: 50 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
//             className="relative hidden lg:block"
//           >
//             <FloatingDashboard />
//           </motion.div>
//         </div>
//       </div>

//       {/* Scroll indicator */}
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 1.5 }}
//         className="absolute bottom-8 left-1/2 -translate-x-1/2"
//       >
//         <motion.div
//           animate={{ y: [0, 10, 0] }}
//           transition={{ duration: 2, repeat: Infinity }}
//           className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2"
//         >
//           <motion.div
//             animate={{ y: [0, 12, 0] }}
//             transition={{ duration: 2, repeat: Infinity }}
//             className="w-1.5 h-1.5 bg-primary rounded-full"
//           />
//         </motion.div>
//       </motion.div>
//     </section>
//   );
// };

"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingDashboard } from "./FloatingDashboard";

const stats = [
  { value: "1000+", label: "Concurrent Users" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "100%", label: "India Compliant" },
];

const features = [
  "Full Payroll & Statutory Compliance",
  "Employee Self-Service Portal",
  "Multi-level Approval Workflows",
];

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-gray-50 via-white to-secondary-50">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ 
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-100 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            x: [0, -30, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-accent-100 rounded-full blur-3xl"
        />
      </div>

      <div className="container-custom relative z-10 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-sm font-medium mb-6"
            >
              <Sparkles className="w-4 h-4" />
              <span>Manifesting Growth for Indian SMEs</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight mb-6"
            >
              The Complete{" "}
              <span className="gradient-text">HRMS Solution</span>
              {" "}for Modern Businesses
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg sm:text-xl text-gray-600 max-w-xl mx-auto lg:mx-0 mb-8"
            >
              Streamline your HR operations with India's most comprehensive 
              workforce management platform. From payroll to recruitment, 
              all in one powerful solution.
            </motion.p>

            {/* Feature checklist */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8"
            >
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-900">
                  <CheckCircle2 className="w-5 h-5 text-brand-500" />
                  <span>{feature}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button size="lg" className="btn-primary rounded-full px-8 text-base group">
                Start Your Free Trial
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="rounded-full px-8 text-base border-2 border-brand-500 text-brand-500 hover:bg-brand-50 group"
              >
                <Play className="mr-2 w-5 h-5 text-brand-500" />
                Watch Demo
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex justify-center lg:justify-start gap-8 mt-12 pt-8 border-t border-gray-200"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center lg:text-left">
                  <div className="font-display text-2xl sm:text-3xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - 3D Dashboard */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="relative hidden lg:block"
          >
            <FloatingDashboard />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-gray-300 flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-brand-500 rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;