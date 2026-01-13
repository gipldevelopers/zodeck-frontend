// src/components/landing/Navbar.js
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

const navLinks = [
  { 
    label: "Features", 
    href: "#features",
    subLinks: [
      { label: "Core HR", href: "#core-hr" },
      { label: "Payroll", href: "#payroll" },
      { label: "Attendance", href: "#attendance" },
      { label: "Recruitment", href: "#recruitment" },
    ]
  },
  { label: "Modules", href: "#modules" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" },
];

export const Navbar = () => {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? "bg-white/95 backdrop-blur-xl shadow-lg border-b border-border" 
          : "bg-white/95 backdrop-blur-md"
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.a 
            href="#"
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-blue-500/30 transition-transform group-hover:scale-105">
              <span className="text-xl font-bold text-white">Z</span>
            </div>
            <span 
              className="font-bold text-2xl text-foreground"
              style={{
                fontFamily: 'var(--font-space-grotesk)',
              }}
            >
              Zodeck<span className="text-primary">.</span>
            </span>
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <div 
                key={link.label}
                className="relative"
                onMouseEnter={() => link.subLinks && setActiveDropdown(link.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <a
                  href={link.href}
                  className="flex items-center gap-1 font-medium text-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                  {link.subLinks && (
                    <ChevronDown 
                      className={`w-4 h-4 transition-transform ${activeDropdown === link.label ? 'rotate-180' : ''}`} 
                    />
                  )}
                </a>
                
                {/* Dropdown */}
                <AnimatePresence>
                  {link.subLinks && activeDropdown === link.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-48 rounded-xl overflow-hidden bg-white border border-border shadow-xl"
                    >
                      {link.subLinks.map((subLink) => (
                        <a
                          key={subLink.label}
                          href={subLink.href}
                          className="block px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                        >
                          {subLink.label}
                        </a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            {/* <Button
              onClick={() => router.push('/signin')}
              variant="ghost"
              className="font-medium text-foreground hover:text-primary"
            >
              Sign In
            </Button> */}
            <Link href="/signin"
              className="rounded-full px-6 font-medium bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Sign In
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-border overflow-hidden"
          >
            <div className="container-custom py-6 space-y-4">
              {navLinks.map((link) => (
                <div key={link.label} className="space-y-1">
                  <a
                    href={link.href}
                    className="block text-lg font-medium py-2 text-foreground hover:text-primary transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                  {link.subLinks && (
                    <div className="ml-4 space-y-1">
                      {link.subLinks.map((subLink) => (
                        <a
                          key={subLink.label}
                          href={subLink.href}
                          className="block text-base py-1.5 text-muted-foreground hover:text-foreground transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {subLink.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-4 space-y-3 border-t border-border">
                <Button 
                  onClick={() => {
                    router.push('/signin');
                    setIsMobileMenuOpen(false);
                  }}
                  variant="outline" 
                  className="w-full border-border text-foreground hover:text-primary hover:border-primary"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={() => {
                    router.push('/auth/signup');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Start Free Trial
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;