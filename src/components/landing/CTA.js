// 'use client';
// import { motion, useInView } from "framer-motion";
// import { useRef } from "react";
// import { ArrowRight, Sparkles } from "lucide-react";
// import { Button } from "@/components/ui/button";

// export const CTA = () => {
//   const containerRef = useRef(null);
//   const isInView = useInView(containerRef, { once: true, margin: "-100px" });

//   return (
//     <section className="section-padding relative overflow-hidden">
//       <div className="container-custom relative z-10" ref={containerRef}>
//         <motion.div
//           initial={{ opacity: 0, y: 40 }}
//           animate={isInView ? { opacity: 1, y: 0 } : {}}
//           transition={{ duration: 0.6 }}
//           className="relative bg-gradient-to-br from-foreground via-foreground to-primary/90 rounded-[2rem] p-8 md:p-16 overflow-hidden"
//         >
//           {/* Decorative elements */}
//           <div className="absolute inset-0 overflow-hidden">
//             <motion.div
//               animate={{ 
//                 rotate: [0, 360],
//               }}
//               transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
//               className="absolute -top-1/2 -right-1/4 w-[600px] h-[600px] border border-white/10 rounded-full"
//             />
//             <motion.div
//               animate={{ 
//                 rotate: [360, 0],
//               }}
//               transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
//               className="absolute -bottom-1/2 -left-1/4 w-[500px] h-[500px] border border-white/5 rounded-full"
//             />
//             <div className="absolute top-10 right-10 w-32 h-32 bg-primary/30 rounded-full blur-3xl" />
//             <div className="absolute bottom-10 left-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl" />
//           </div>

//           {/* Content */}
//           <div className="relative z-10 text-center max-w-3xl mx-auto">
//             {/* Badge */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={isInView ? { opacity: 1, y: 0 } : {}}
//               transition={{ delay: 0.2 }}
//               className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/90 text-sm font-medium mb-6"
//             >
//               <Sparkles className="w-4 h-4" />
//               <span>90-Day Free Warranty Included</span>
//             </motion.div>

//             {/* Headline */}
//             <motion.h2
//               initial={{ opacity: 0, y: 20 }}
//               animate={isInView ? { opacity: 1, y: 0 } : {}}
//               transition={{ delay: 0.3 }}
//               className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6"
//             >
//               Ready to Transform Your{" "}
//               <span className="text-primary-foreground/80">HR Operations?</span>
//             </motion.h2>

//             {/* Description */}
//             <motion.p
//               initial={{ opacity: 0, y: 20 }}
//               animate={isInView ? { opacity: 1, y: 0 } : {}}
//               transition={{ delay: 0.4 }}
//               className="text-lg text-white/70 mb-10 max-w-2xl mx-auto"
//             >
//               Join hundreds of Indian SMEs who have already streamlined their workforce 
//               management with Zodeck HRMS. Start your free trial today — no credit card required.
//             </motion.p>

//             {/* CTA Buttons */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={isInView ? { opacity: 1, y: 0 } : {}}
//               transition={{ delay: 0.5 }}
//               className="flex flex-col sm:flex-row gap-4 justify-center"
//             >
//               <Button 
//                 size="lg" 
//                 className="bg-white text-foreground hover:bg-white/90 rounded-full px-8 text-base group shadow-lg"
//               >
//                 Start Free Trial
//                 <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
//               </Button>
//               <Button 
//                 size="lg" 
//                 variant="outline" 
//                 className="btn-outline-hero rounded-full px-8 text-base"
//               >
//                 Schedule a Demo
//               </Button>
//             </motion.div>

//             {/* Trust note */}
//             <motion.p
//               initial={{ opacity: 0 }}
//               animate={isInView ? { opacity: 1 } : {}}
//               transition={{ delay: 0.7 }}
//               className="text-sm text-white/50 mt-8"
//             >
//               ✓ Free 14-day trial &nbsp;&nbsp; ✓ No credit card required &nbsp;&nbsp; ✓ Cancel anytime
//             </motion.p>
//           </div>
//         </motion.div>
//       </div>
//     </section>
//   );
// };

"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const CTA = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="container-custom relative z-10" ref={containerRef}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative bg-gradient-to-br from-brand-700 via-brand-600 to-accent-500 rounded-[2rem] p-8 md:p-16 overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{ 
                rotate: [0, 360],
              }}
              transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
              className="absolute -top-1/2 -right-1/4 w-[600px] h-[600px] border border-white/10 rounded-full"
            />
            <motion.div
              animate={{ 
                rotate: [360, 0],
              }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-1/2 -left-1/4 w-[500px] h-[500px] border border-white/5 rounded-full"
            />
            <div className="absolute top-10 right-10 w-32 h-32 bg-brand-400/30 rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-10 w-40 h-40 bg-accent-400/20 rounded-full blur-3xl" />
          </div>

          {/* Content */}
          <div className="relative z-10 text-center max-w-3xl mx-auto">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/90 text-sm font-medium mb-6"
            >
              <Sparkles className="w-4 h-4" />
              <span>90-Day Free Warranty Included</span>
            </motion.div>

            {/* Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6"
            >
              Ready to Transform Your{" "}
              <span className="text-brand-100">HR Operations?</span>
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
              className="text-lg text-white/70 mb-10 max-w-2xl mx-auto"
            >
              Join hundreds of Indian SMEs who have already streamlined their workforce 
              management with Zodeck HRMS. Start your free trial today — no credit card required.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button 
                size="lg" 
                className="bg-white text-gray-900 hover:bg-white/90 rounded-full px-8 text-base group shadow-lg glow-accent"
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="btn-outline-hero rounded-full px-8 text-base"
              >
                Schedule a Demo
              </Button>
            </motion.div>

            {/* Trust note */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.7 }}
              className="text-sm text-white/50 mt-8"
            >
              ✓ Free 14-day trial &nbsp;&nbsp; ✓ No credit card required &nbsp;&nbsp; ✓ Cancel anytime
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;

