// // 'use client';
// // import { useState, useEffect } from "react";
// // import { motion, AnimatePresence } from "framer-motion";
// // import { Menu, X, ChevronDown } from "lucide-react";
// // import { Button } from "@/components/ui/button";

// // const navLinks = [
// //   { 
// //     label: "Features", 
// //     href: "#features",
// //     subLinks: [
// //       { label: "Core HR", href: "#core-hr" },
// //       { label: "Payroll", href: "#payroll" },
// //       { label: "Attendance", href: "#attendance" },
// //       { label: "Recruitment", href: "#recruitment" },
// //     ]
// //   },
// //   { label: "Modules", href: "#modules" },
// //   { label: "Pricing", href: "#pricing" },
// //   { label: "About", href: "#about" },
// // ];

// // export const Navbar = () => {
// //   const [isScrolled, setIsScrolled] = useState(false);
// //   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
// //   const [activeDropdown, setActiveDropdown] = useState(null);

// //   useEffect(() => {
// //     const handleScroll = () => {
// //       setIsScrolled(window.scrollY > 20);
// //     };
// //     window.addEventListener("scroll", handleScroll);
// //     return () => window.removeEventListener("scroll", handleScroll);
// //   }, []);

// //   return (
// //     <motion.nav
// //       initial={{ y: -100 }}
// //       animate={{ y: 0 }}
// //       transition={{ duration: 0.6, ease: "easeOut" }}
// //       className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
// //         isScrolled 
// //           ? "bg-white/80 backdrop-blur-xl shadow-lg border-b border-border/50" 
// //           : "bg-transparent"
// //       }`}
// //     >
// //       <div className="container-custom">
// //         <div className="flex items-center justify-between h-20">
// //           {/* Logo */}
// //           <motion.a 
// //             href="#"
// //             className="flex items-center gap-3"
// //             whileHover={{ scale: 1.02 }}
// //           >
// //             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-glow">
// //               <span className="text-white font-display font-bold text-xl">Z</span>
// //             </div>
// //             <span className="font-display font-bold text-2xl text-foreground">
// //               Zodeck<span className="text-primary">.</span>
// //             </span>
// //           </motion.a>

// //           {/* Desktop Navigation */}
// //           <div className="hidden lg:flex items-center gap-8">
// //             {navLinks.map((link) => (
// //               <div 
// //                 key={link.label}
// //                 className="relative"
// //                 onMouseEnter={() => link.subLinks && setActiveDropdown(link.label)}
// //                 onMouseLeave={() => setActiveDropdown(null)}
// //               >
// //                 <a
// //                   href={link.href}
// //                   className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors font-medium"
// //                 >
// //                   {link.label}
// //                   {link.subLinks && (
// //                     <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === link.label ? 'rotate-180' : ''}`} />
// //                   )}
// //                 </a>
                
// //                 {/* Dropdown */}
// //                 <AnimatePresence>
// //                   {link.subLinks && activeDropdown === link.label && (
// //                     <motion.div
// //                       initial={{ opacity: 0, y: 10 }}
// //                       animate={{ opacity: 1, y: 0 }}
// //                       exit={{ opacity: 0, y: 10 }}
// //                       transition={{ duration: 0.2 }}
// //                       className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-card-hover border border-border/50 overflow-hidden"
// //                     >
// //                       {link.subLinks.map((subLink) => (
// //                         <a
// //                           key={subLink.label}
// //                           href={subLink.href}
// //                           className="block px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
// //                         >
// //                           {subLink.label}
// //                         </a>
// //                       ))}
// //                     </motion.div>
// //                   )}
// //                 </AnimatePresence>
// //               </div>
// //             ))}
// //           </div>

// //           {/* CTA Buttons */}
// //           <div className="hidden lg:flex items-center gap-4">
// //             <Button variant="ghost" className="font-medium">
// //               Sign In
// //             </Button>
// //             <Button className="btn-primary rounded-full px-6 font-medium">
// //               Start Free Trial
// //             </Button>
// //           </div>

// //           {/* Mobile Menu Button */}
// //           <button
// //             className="lg:hidden p-2 text-foreground"
// //             onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
// //           >
// //             {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
// //           </button>
// //         </div>
// //       </div>

// //       {/* Mobile Menu */}
// //       <AnimatePresence>
// //         {isMobileMenuOpen && (
// //           <motion.div
// //             initial={{ opacity: 0, height: 0 }}
// //             animate={{ opacity: 1, height: "auto" }}
// //             exit={{ opacity: 0, height: 0 }}
// //             className="lg:hidden bg-white border-b border-border"
// //           >
// //             <div className="container-custom py-6 space-y-4">
// //               {navLinks.map((link) => (
// //                 <a
// //                   key={link.label}
// //                   href={link.href}
// //                   className="block text-lg text-foreground font-medium py-2"
// //                   onClick={() => setIsMobileMenuOpen(false)}
// //                 >
// //                   {link.label}
// //                 </a>
// //               ))}
// //               <div className="pt-4 space-y-3">
// //                 <Button variant="outline" className="w-full">
// //                   Sign In
// //                 </Button>
// //                 <Button className="w-full btn-primary">
// //                   Start Free Trial
// //                 </Button>
// //               </div>
// //             </div>
// //           </motion.div>
// //         )}
// //       </AnimatePresence>
// //     </motion.nav>
// //   );
// // };
// "use client";

// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Menu, X, ChevronDown } from "lucide-react";
// import { Button } from "@/components/ui/button";

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
//           ? "bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-200/50" 
//           : "bg-transparent"
//       }`}
//     >
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-20">
//           {/* Logo */}
//           <motion.a 
//             href="#"
//             className="flex items-center gap-3"
//             whileHover={{ scale: 1.02 }}
//           >
//             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-500/70 flex items-center justify-center shadow-lg shadow-blue-500/20">
//               <span className="text-white font-bold text-xl">Z</span>
//             </div>
//             <span className="font-bold text-2xl text-gray-900">
//               Zodeck<span className="text-blue-600">.</span>
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
//                   className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors font-medium"
//                 >
//                   {link.label}
//                   {link.subLinks && (
//                     <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === link.label ? 'rotate-180' : ''}`} />
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
//                       className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200/50 overflow-hidden"
//                     >
//                       {link.subLinks.map((subLink) => (
//                         <a
//                           key={subLink.label}
//                           href={subLink.href}
//                           className="block px-4 py-3 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
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
//             <Button variant="ghost" className="font-medium">
//               Sign In
//             </Button>
//             <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 font-medium transition-colors">
//               Start Free Trial
//             </Button>
//           </div>

//           {/* Mobile Menu Button */}
//           <button
//             className="lg:hidden p-2 text-gray-900"
//             onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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
//             className="lg:hidden bg-white border-b border-gray-200"
//           >
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
//               {navLinks.map((link) => (
//                 <a
//                   key={link.label}
//                   href={link.href}
//                   className="block text-lg text-gray-900 font-medium py-2"
//                   onClick={() => setIsMobileMenuOpen(false)}
//                 >
//                   {link.label}
//                 </a>
//               ))}
//               <div className="pt-4 space-y-3">
//                 <Button variant="outline" className="w-full">
//                   Sign In
//                 </Button>
//                 <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
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

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

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
          ? "bg-white/80 backdrop-blur-xl shadow-lg border-b border-border/50" 
          : "bg-transparent"
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
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-glow"
              style={{
                background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--hero-gradient-end)) 100%)'
              }}
            >
              <span className="text-white font-bold text-xl">Z</span>
            </div>
            <span 
              className="font-bold text-2xl"
              style={{
                fontFamily: 'var(--font-space-grotesk)',
                color: 'hsl(var(--foreground))'
              }}
            >
              Zodeck<span style={{ color: 'hsl(var(--primary))' }}>.</span>
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
                  className="flex items-center gap-1 font-medium transition-colors"
                  style={{
                    color: isScrolled ? 'hsl(var(--muted-foreground))' : 'rgba(255, 255, 255, 0.9)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'hsl(var(--foreground))'}
                  onMouseLeave={(e) => e.currentTarget.style.color = isScrolled ? 'hsl(var(--muted-foreground))' : 'rgba(255, 255, 255, 0.9)'}
                >
                  {link.label}
                  {link.subLinks && (
                    <ChevronDown 
                      className={`w-4 h-4 transition-transform ${activeDropdown === link.label ? 'rotate-180' : ''}`} 
                      style={{
                        color: isScrolled ? 'hsl(var(--muted-foreground))' : 'rgba(255, 255, 255, 0.9)'
                      }}
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
                      className="absolute top-full left-0 mt-2 w-48 rounded-xl overflow-hidden"
                      style={{
                        backgroundColor: 'white',
                        border: '1px solid hsl(var(--border))',
                        boxShadow: '0 20px 24px -4px rgba(16, 24, 40, 0.08), 0 8px 8px -4px rgba(16, 24, 40, 0.03)'
                      }}
                    >
                      {link.subLinks.map((subLink) => (
                        <a
                          key={subLink.label}
                          href={subLink.href}
                          className="block px-4 py-3 text-sm transition-colors"
                          style={{
                            color: 'hsl(var(--muted-foreground))'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = 'hsl(var(--foreground))';
                            e.currentTarget.style.backgroundColor = 'hsl(var(--secondary))';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = 'hsl(var(--muted-foreground))';
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
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
            <Button
              onClick={() => router.push('/signin')}
              variant="ghost"
              className="font-medium"
              style={{
                color: isScrolled ? 'hsl(var(--muted-foreground))' : 'rgba(255, 255, 255, 0.9)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'hsl(var(--foreground))'}
              onMouseLeave={(e) => e.currentTarget.style.color = isScrolled ? 'hsl(var(--muted-foreground))' : 'rgba(255, 255, 255, 0.9)'}
            >
              Sign In
            </Button>
            <Button 
              onClick={() => router.push('/auth/signup')}
              className="rounded-full px-6 font-medium btn-primary"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-white)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px 0 rgba(var(--color-primary-rgb), 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 14px 0 rgba(var(--color-primary-rgb), 0.25)';
              }}
            >
              Start Free Trial
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{
              color: isScrolled ? 'hsl(var(--foreground))' : 'rgba(255, 255, 255, 0.9)'
            }}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
            className="lg:hidden"
            style={{
              backgroundColor: 'white',
              borderBottom: '1px solid hsl(var(--border))'
            }}
          >
            <div className="container-custom py-6 space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block text-lg font-medium py-2"
                  style={{
                    color: 'hsl(var(--foreground))'
                  }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-4 space-y-3">
                <Button 
                  onClick={() => {
                    router.push('/signin');
                    setIsMobileMenuOpen(false);
                  }}
                  variant="outline" 
                  className="w-full"
                  style={{
                    borderColor: 'hsl(var(--border))',
                    color: 'hsl(var(--foreground))'
                  }}
                >
                  Sign In
                </Button>
                <Button 
                  className="w-full btn-primary"
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    color: 'var(--color-white)'
                  }}
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