'use client';
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { 
  Building2, 
  Users, 
  Clock, 
  Shield,
  Award,
  HeartHandshake
} from "lucide-react";

const stats = [
  {
    icon: Building2,
    value: "1000+",
    label: "SMEs Supported",
    description: "Designed for businesses with 1-1000 employees",
  },
  {
    icon: Users,
    value: "1000",
    label: "Concurrent Users",
    description: "Built to handle enterprise-scale operations",
  },
  {
    icon: Clock,
    value: "99.9%",
    label: "Uptime Guarantee",
    description: "Enterprise-grade reliability and performance",
  },
  {
    icon: Shield,
    value: "100%",
    label: "India Compliant",
    description: "PF, ESI, PT, TDS & all statutory requirements",
  },
];

const CountUp = ({ target, duration = 2 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  // Extract number and suffix
  const numericPart = target.replace(/[^0-9.]/g, '');
  const suffix = target.replace(/[0-9.]/g, '');
  
  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      className="font-display text-4xl sm:text-5xl font-bold text-white"
    >
      {numericPart}{suffix}
    </motion.span>
  );
};

export const Stats = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-teal-600" />
      
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 -left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            x: [0, -80, 0],
            y: [0, 80, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-20 -right-20 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl"
        />
      </div>

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="container-custom relative z-10" ref={containerRef}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Built for Scale, Designed for{" "}
            <span className="text-white/80">Indian Businesses</span>
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Enterprise-grade infrastructure with SME-friendly simplicity. 
            No compromises on features or reliability.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 transition-all duration-300 hover:bg-white/15 hover:-translate-y-1">
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <stat.icon className="w-7 h-7 text-white" />
                </div>

                {/* Value */}
                <CountUp target={stat.value} />

                {/* Label */}
                <h4 className="font-display text-lg font-semibold text-white mt-2 mb-1">
                  {stat.label}
                </h4>

                {/* Description */}
                <p className="text-sm text-white/60">
                  {stat.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-8"
        >
          <div className="flex items-center gap-3 text-white/80">
            <Award className="w-6 h-6" />
            <span className="font-medium">ISO 27001 Ready</span>
          </div>
          <div className="hidden sm:block w-px h-6 bg-white/30" />
          <div className="flex items-center gap-3 text-white/80">
            <Shield className="w-6 h-6" />
            <span className="font-medium">GDPR Compliant</span>
          </div>
          <div className="hidden sm:block w-px h-6 bg-white/30" />
          <div className="flex items-center gap-3 text-white/80">
            <HeartHandshake className="w-6 h-6" />
            <span className="font-medium">24/7 Support</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};