'use client';
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Target, Lightbulb, Users, ArrowUpRight } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Our Mission",
    description: "To democratize HR technology for Indian SMEs, making enterprise-grade workforce management accessible and affordable for businesses of all sizes.",
  },
  {
    icon: Lightbulb,
    title: "Our Vision",
    description: "To become India's most trusted HRMS partner, enabling businesses to focus on growth while we handle the complexities of HR operations.",
  },
  {
    icon: Users,
    title: "Our Promise",
    description: "100% India-compliant, always up-to-date with the latest statutory requirements, and backed by a team that understands Indian business needs.",
  },
];

const team = [
  {
    name: "Rakesh Sabbathi",
    role: "Founder & CEO",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&crop=face",
  },
  {
    name: "Swetha Reddy",
    role: "Product Owner",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=face",
  },
  {
    name: "Raj Kumar",
    role: "Head of Engineering",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
  },
];

export const About = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section id="about" className="section-padding bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative z-10" ref={containerRef}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            About Zodeck
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Manifesting Growth for{" "}
            <span className="gradient-text">Indian Businesses</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            We're on a mission to transform how Indian businesses manage their most valuable asset — their people.
          </p>
        </motion.div>

        {/* Values Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-8 border border-border/50 shadow-card hover:shadow-card-hover transition-shadow"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center mb-6 shadow-lg">
                <value.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-3">
                {value.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Company Info */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid lg:grid-cols-2 gap-12 items-center mb-20"
        >
          <div>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-6">
              Built in India, for India
            </h3>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Zodeck Technologies was founded with a singular vision: to provide Indian SMEs 
                with world-class HR technology that understands their unique challenges.
              </p>
              <p>
                Our team brings together decades of experience in HR operations, software development, 
                and Indian statutory compliance. We've built Zodeck from the ground up to handle the 
                complexities of Indian payroll — from PF and ESI to PT and TDS.
              </p>
              <p>
                Based in Hyderabad, we're proud to serve businesses across India, helping them 
                streamline operations, ensure compliance, and focus on what matters most — growth.
              </p>
            </div>
            
            <div className="flex gap-6 mt-8">
              <div className="text-center">
                <div className="font-display text-3xl font-bold text-foreground">2024</div>
                <div className="text-sm text-muted-foreground">Founded</div>
              </div>
              <div className="text-center">
                <div className="font-display text-3xl font-bold text-foreground">Hyderabad</div>
                <div className="text-sm text-muted-foreground">Headquarters</div>
              </div>
            </div>
          </div>

          {/* Team Preview */}
          <div className="bg-muted/30 rounded-3xl p-8">
            <h4 className="font-display font-semibold text-lg text-foreground mb-6">Leadership Team</h4>
            <div className="space-y-4">
              {team.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-4 p-3 rounded-xl bg-white shadow-card hover:shadow-card-hover transition-shadow cursor-pointer group"
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-primary/20"
                  />
                  <div className="flex-1">
                    <h5 className="font-medium text-foreground">{member.name}</h5>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};