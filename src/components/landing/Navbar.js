// // src\components\landing\Navbar.js
// "use client";

// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Menu, X, ChevronDown } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useRouter } from "next/navigation";

// const navLinks = [
//   { 
//     label: "Features", 
//     href: "#features",
//     subLinks: [
//       { label: "Core HR", href: "#core-hr" },
//       { label: "Payroll", href: "#payroll" },
//       { label: "Attendance", href: "#attendance" },
//       { label: "Recruitment", href: "#recruitment" },
//     ]
//   },
//   { label: "Modules", href: "#modules" },
//   { label: "Pricing", href: "#pricing" },
//   { label: "About", href: "#about" },
// ];

// export const Navbar = () => {
//   const router = useRouter();
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [activeDropdown, setActiveDropdown] = useState(null);

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 20);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   return (
//     <motion.nav
//       initial={{ y: -100 }}
//       animate={{ y: 0 }}
//       transition={{ duration: 0.6, ease: "easeOut" }}
//       className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
//         isScrolled 
//           ? "bg-white/80 backdrop-blur-xl shadow-lg border-b border-border/50" 
//           : "bg-transparent"
//       }`}
//     >
//       <div className="container-custom">
//         <div className="flex items-center justify-between h-20">
//           {/* Logo */}
//           <motion.a 
//             href="#"
//             className="flex items-center gap-3"
//             whileHover={{ scale: 1.02 }}
//           >
//             <div 
//               className="w-10 h-10 rounded-xl flex items-center justify-center shadow-glow"
//               style={{
//                 background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--hero-gradient-end)) 100%)'
//               }}
//             >
//               <span className="text-white font-bold text-xl">Z</span>
//             </div>
//             <span 
//               className="font-bold text-2xl"
//               style={{
//                 fontFamily: 'var(--font-space-grotesk)',
//                 color: 'hsl(var(--foreground))'
//               }}
//             >
//               Zodeck<span style={{ color: 'hsl(var(--primary))' }}>.</span>
//             </span>
//           </motion.a>

//           {/* Desktop Navigation */}
//           <div className="hidden lg:flex items-center gap-8">
//             {navLinks.map((link) => (
//               <div 
//                 key={link.label}
//                 className="relative"
//                 onMouseEnter={() => link.subLinks && setActiveDropdown(link.label)}
//                 onMouseLeave={() => setActiveDropdown(null)}
//               >
//                 <a
//                   href={link.href}
//                   className="flex items-center gap-1 font-medium transition-colors"
//                   style={{
//                     color: isScrolled ? 'hsl(var(--muted-foreground))' : 'rgba(255, 255, 255, 0.9)'
//                   }}
//                   onMouseEnter={(e) => e.currentTarget.style.color = 'hsl(var(--foreground))'}
//                   onMouseLeave={(e) => e.currentTarget.style.color = isScrolled ? 'hsl(var(--muted-foreground))' : 'rgba(255, 255, 255, 0.9)'}
//                 >
//                   {link.label}
//                   {link.subLinks && (
//                     <ChevronDown 
//                       className={`w-4 h-4 transition-transform ${activeDropdown === link.label ? 'rotate-180' : ''}`} 
//                       style={{
//                         color: isScrolled ? 'hsl(var(--muted-foreground))' : 'rgba(255, 255, 255, 0.9)'
//                       }}
//                     />
//                   )}
//                 </a>
                
//                 {/* Dropdown */}
//                 <AnimatePresence>
//                   {link.subLinks && activeDropdown === link.label && (
//                     <motion.div
//                       initial={{ opacity: 0, y: 10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: 10 }}
//                       transition={{ duration: 0.2 }}
//                       className="absolute top-full left-0 mt-2 w-48 rounded-xl overflow-hidden"
//                       style={{
//                         backgroundColor: 'white',
//                         border: '1px solid hsl(var(--border))',
//                         boxShadow: '0 20px 24px -4px rgba(16, 24, 40, 0.08), 0 8px 8px -4px rgba(16, 24, 40, 0.03)'
//                       }}
//                     >
//                       {link.subLinks.map((subLink) => (
//                         <a
//                           key={subLink.label}
//                           href={subLink.href}
//                           className="block px-4 py-3 text-sm transition-colors"
//                           style={{
//                             color: 'hsl(var(--muted-foreground))'
//                           }}
//                           onMouseEnter={(e) => {
//                             e.currentTarget.style.color = 'hsl(var(--foreground))';
//                             e.currentTarget.style.backgroundColor = 'hsl(var(--secondary))';
//                           }}
//                           onMouseLeave={(e) => {
//                             e.currentTarget.style.color = 'hsl(var(--muted-foreground))';
//                             e.currentTarget.style.backgroundColor = 'transparent';
//                           }}
//                         >
//                           {subLink.label}
//                         </a>
//                       ))}
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </div>
//             ))}
//           </div>

//           {/* CTA Buttons */}
//           <div className="hidden lg:flex items-center gap-4">
//             <Button
//               onClick={() => router.push('/signin')}
//               variant="ghost"
//               className="font-medium"
//               style={{
//                 color: isScrolled ? 'hsl(var(--muted-foreground))' : 'rgba(255, 255, 255, 0.9)'
//               }}
//               onMouseEnter={(e) => e.currentTarget.style.color = 'hsl(var(--foreground))'}
//               onMouseLeave={(e) => e.currentTarget.style.color = isScrolled ? 'hsl(var(--muted-foreground))' : 'rgba(255, 255, 255, 0.9)'}
//             >
//               Sign In
//             </Button>
//             <Button 
//               onClick={() => router.push('/auth/signup')}
//               className="rounded-full px-6 font-medium btn-primary"
//               style={{
//                 backgroundColor: 'var(--color-primary)',
//                 color: 'var(--color-white)'
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)';
//                 e.currentTarget.style.transform = 'translateY(-2px)';
//                 e.currentTarget.style.boxShadow = '0 6px 20px 0 rgba(var(--color-primary-rgb), 0.35)';
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.backgroundColor = 'var(--color-primary)';
//                 e.currentTarget.style.transform = 'translateY(0)';
//                 e.currentTarget.style.boxShadow = '0 4px 14px 0 rgba(var(--color-primary-rgb), 0.25)';
//               }}
//             >
//               Start Free Trial
//             </Button>
//           </div>

//           {/* Mobile Menu Button */}
//           <button
//             className="lg:hidden p-2"
//             onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//             style={{
//               color: isScrolled ? 'hsl(var(--foreground))' : 'rgba(255, 255, 255, 0.9)'
//             }}
//           >
//             {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//           </button>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       <AnimatePresence>
//         {isMobileMenuOpen && (
//           <motion.div
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: "auto" }}
//             exit={{ opacity: 0, height: 0 }}
//             className="lg:hidden"
//             style={{
//               backgroundColor: 'white',
//               borderBottom: '1px solid hsl(var(--border))'
//             }}
//           >
//             <div className="container-custom py-6 space-y-4">
//               {navLinks.map((link) => (
//                 <a
//                   key={link.label}
//                   href={link.href}
//                   className="block text-lg font-medium py-2"
//                   style={{
//                     color: 'hsl(var(--foreground))'
//                   }}
//                   onClick={() => setIsMobileMenuOpen(false)}
//                 >
//                   {link.label}
//                 </a>
//               ))}
//               <div className="pt-4 space-y-3">
//                 <Button 
//                   onClick={() => {
//                     router.push('/signin');
//                     setIsMobileMenuOpen(false);
//                   }}
//                   variant="outline" 
//                   className="w-full"
//                   style={{
//                     borderColor: 'hsl(var(--border))',
//                     color: 'hsl(var(--foreground))'
//                   }}
//                 >
//                   Sign In
//                 </Button>
//                 <Button 
//                   className="w-full btn-primary"
//                   style={{
//                     backgroundColor: 'var(--color-primary)',
//                     color: 'var(--color-white)'
//                   }}
//                 >
//                   Start Free Trial
//                 </Button>
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </motion.nav>
//   );
// };

// export default Navbar;

// src/components/landing/Navbar.js
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, LogIn, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Navigation Structure
const navLinks = [
  { 
    label: "Features", 
    href: "#features",
    subLinks: [
      { label: "Core HR", href: "#core-hr", desc: "Employee database & records" },
      { label: "Payroll", href: "#payroll", desc: "Automated salary processing" },
      { label: "Attendance", href: "#attendance", desc: "Time tracking & shifts" },
      { label: "Recruitment", href: "#recruitment", desc: "ATS & onboarding" },
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

  // Handle Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Text Color Logic based on scroll state
  // Assuming the hero section has a dark background, so initial text is white/light.
  // When scrolled, navbar becomes white, so text should be dark.
  const textColorClass = isScrolled ? "text-gray-800 dark:text-white" : "text-white dark:text-white";
  const hoverTextColorClass = isScrolled ? "hover:text-blue-600 dark:hover:text-blue-400" : "hover:text-blue-200";
  const logoTextClass = isScrolled ? "text-gray-900 dark:text-white" : "text-white";

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-md py-3" 
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between">
          
          {/* --- LOGO --- */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30 transition-transform group-hover:scale-105">
              <span className="text-xl font-bold text-white">Z</span>
            </div>
            <span className={`text-2xl font-bold tracking-tight transition-colors ${logoTextClass}`}>
              Zodeck
            </span>
          </Link>

          {/* --- DESKTOP NAVIGATION --- */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <div 
                key={link.label}
                className="relative group"
                onMouseEnter={() => link.subLinks && setActiveDropdown(link.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={link.href}
                  className={`flex items-center gap-1 text-sm font-medium transition-colors ${textColorClass} ${hoverTextColorClass}`}
                >
                  {link.label}
                  {link.subLinks && (
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === link.label ? 'rotate-180' : ''}`} />
                  )}
                </Link>
                
                {/* Desktop Dropdown */}
                <AnimatePresence>
                  {link.subLinks && activeDropdown === link.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-64 p-2 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden"
                    >
                      <div className="flex flex-col gap-1">
                        {link.subLinks.map((subLink) => (
                          <Link
                            key={subLink.label}
                            href={subLink.href}
                            className="block px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group/item"
                          >
                            <div className="text-sm font-semibold text-gray-900 dark:text-white group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400">
                              {subLink.label}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {subLink.desc}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* --- DESKTOP CTA BUTTONS --- */}
          <div className="hidden lg:flex items-center gap-4">
            <Link 
              href="/signin" 
              className={`text-sm font-medium transition-colors ${textColorClass} ${hoverTextColorClass}`}
            >
              Log in
            </Link>
            <Link
              href="/auth/signup"
              className="group relative inline-flex items-center gap-2 px-5 py-2.5 bg-white text-gray-900 rounded-full text-sm font-semibold shadow-lg shadow-white/10 hover:bg-gray-50 transition-all hover:scale-105 active:scale-95"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* --- MOBILE MENU TOGGLE --- */}
          <button
            className={`lg:hidden p-2 rounded-lg transition-colors ${isScrolled ? 'text-gray-900 hover:bg-gray-100' : 'text-white hover:bg-white/10'}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* --- MOBILE MENU OVERLAY --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100vh" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 top-[60px] z-40 bg-white dark:bg-gray-900 overflow-y-auto lg:hidden"
          >
            <div className="container mx-auto px-6 py-8 flex flex-col gap-6">
              
              {/* Mobile Links */}
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <div key={link.label} className="border-b border-gray-100 dark:border-gray-800 last:border-0 pb-2">
                    {link.subLinks ? (
                      <div className="py-2">
                        <div className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {link.label}
                        </div>
                        <div className="pl-4 flex flex-col gap-3 border-l-2 border-gray-100 dark:border-gray-800">
                          {link.subLinks.map(sub => (
                            <Link 
                              key={sub.label}
                              href={sub.href}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium"
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Link
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block py-3 text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </div>
                ))}
              </div>

              {/* Mobile CTAs */}
              <div className="mt-auto pb-10 flex flex-col gap-4">
                <Link 
                  href="/signin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-3.5 flex items-center justify-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <LogIn className="w-5 h-5" /> Log In
                </Link>
                <Link 
                  href="/auth/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-3.5 flex items-center justify-center gap-2 rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-colors"
                >
                  Start Free Trial <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;