// 'use client';
// import { motion } from "framer-motion";
// import { 
//   Linkedin, 
//   Twitter, 
//   Youtube, 
//   Mail, 
//   Phone, 
//   MapPin,
//   ArrowUpRight
// } from "lucide-react";

// const footerLinks = {
//   product: [
//     { label: "Features", href: "#features" },
//     { label: "Modules", href: "#modules" },
//     { label: "Pricing", href: "#pricing" },
//     { label: "Integrations", href: "#" },
//     { label: "API Documentation", href: "#" },
//   ],
//   company: [
//     { label: "About Us", href: "#about" },
//     { label: "Careers", href: "#" },
//     { label: "Blog", href: "#" },
//     { label: "Press Kit", href: "#" },
//     { label: "Contact", href: "#" },
//   ],
//   resources: [
//     { label: "Help Center", href: "#" },
//     { label: "Community", href: "#" },
//     { label: "Webinars", href: "#" },
//     { label: "Case Studies", href: "#" },
//     { label: "Templates", href: "#" },
//   ],
//   legal: [
//     { label: "Privacy Policy", href: "#" },
//     { label: "Terms of Service", href: "#" },
//     { label: "Cookie Policy", href: "#" },
//     { label: "GDPR", href: "#" },
//   ],
// };

// const socialLinks = [
//   { icon: Linkedin, href: "#", label: "LinkedIn" },
//   { icon: Twitter, href: "#", label: "Twitter" },
//   { icon: Youtube, href: "#", label: "YouTube" },
// ];

// export const Footer = () => {
//   return (
//     <footer className="bg-foreground text-white relative overflow-hidden">
//       {/* Background decoration */}
//       <div className="absolute inset-0">
//         <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
//         <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
//       </div>

//       <div className="container-custom relative z-10">
//         {/* Main footer content */}
//         <div className="py-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12">
//           {/* Brand column */}
//           <div className="col-span-2 md:col-span-3 lg:col-span-2">
//             <motion.a 
//               href="#"
//               className="inline-flex items-center gap-3 mb-6"
//               whileHover={{ scale: 1.02 }}
//             >
//               <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
//                 <span className="text-white font-display font-bold text-xl">Z</span>
//               </div>
//               <span className="font-display font-bold text-2xl text-white">
//                 Zodeck<span className="text-primary">.</span>
//               </span>
//             </motion.a>
            
//             <p className="text-white/60 max-w-sm mb-6">
//               Manifesting growth for Indian SMEs with the most comprehensive 
//               HRMS solution. Streamline your HR operations today.
//             </p>

//             {/* Contact info */}
//             <div className="space-y-3">
//               <a href="mailto:hello@zodeck.in" className="flex items-center gap-3 text-white/60 hover:text-white transition-colors">
//                 <Mail className="w-4 h-4" />
//                 <span>hello@zodeck.in</span>
//               </a>
//               <a href="tel:+919876543210" className="flex items-center gap-3 text-white/60 hover:text-white transition-colors">
//                 <Phone className="w-4 h-4" />
//                 <span>+91 98765 43210</span>
//               </a>
//               <div className="flex items-start gap-3 text-white/60">
//                 <MapPin className="w-4 h-4 mt-0.5" />
//                 <span>Kondapur, Hyderabad, Telangana, India</span>
//               </div>
//             </div>

//             {/* Social links */}
//             <div className="flex gap-3 mt-6">
//               {socialLinks.map((social) => (
//                 <a
//                   key={social.label}
//                   href={social.href}
//                   aria-label={social.label}
//                   className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-white/20 hover:text-white transition-all"
//                 >
//                   <social.icon className="w-5 h-5" />
//                 </a>
//               ))}
//             </div>
//           </div>

//           {/* Product links */}
//           <div>
//             <h4 className="font-display font-semibold text-white mb-4">Product</h4>
//             <ul className="space-y-3">
//               {footerLinks.product.map((link) => (
//                 <li key={link.label}>
//                   <a 
//                     href={link.href} 
//                     className="text-white/60 hover:text-white transition-colors inline-flex items-center gap-1 group"
//                   >
//                     {link.label}
//                     <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
//                   </a>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Company links */}
//           <div>
//             <h4 className="font-display font-semibold text-white mb-4">Company</h4>
//             <ul className="space-y-3">
//               {footerLinks.company.map((link) => (
//                 <li key={link.label}>
//                   <a 
//                     href={link.href} 
//                     className="text-white/60 hover:text-white transition-colors inline-flex items-center gap-1 group"
//                   >
//                     {link.label}
//                     <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
//                   </a>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Resources links */}
//           <div>
//             <h4 className="font-display font-semibold text-white mb-4">Resources</h4>
//             <ul className="space-y-3">
//               {footerLinks.resources.map((link) => (
//                 <li key={link.label}>
//                   <a 
//                     href={link.href} 
//                     className="text-white/60 hover:text-white transition-colors inline-flex items-center gap-1 group"
//                   >
//                     {link.label}
//                     <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
//                   </a>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Legal links */}
//           <div>
//             <h4 className="font-display font-semibold text-white mb-4">Legal</h4>
//             <ul className="space-y-3">
//               {footerLinks.legal.map((link) => (
//                 <li key={link.label}>
//                   <a 
//                     href={link.href} 
//                     className="text-white/60 hover:text-white transition-colors inline-flex items-center gap-1 group"
//                   >
//                     {link.label}
//                     <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
//                   </a>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>

//         {/* Bottom bar */}
//         <div className="py-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
//           <p className="text-white/40 text-sm">
//             © 2024 Zodeck Technologies Private Limited. All rights reserved.
//           </p>
//           <p className="text-white/40 text-sm">
//             Made with ❤️ in India
//           </p>
//         </div>
//       </div>
//     </footer>
//   );
// };

"use client";

import { motion } from "framer-motion";
import { 
  Linkedin, 
  Twitter, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin,
  ArrowUpRight
} from "lucide-react";

const footerLinks = {
  product: [
    { label: "Features", href: "#features" },
    { label: "Modules", href: "#modules" },
    { label: "Pricing", href: "#pricing" },
    { label: "Integrations", href: "#" },
    { label: "API Documentation", href: "#" },
  ],
  company: [
    { label: "About Us", href: "#about" },
    { label: "Careers", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Press Kit", href: "#" },
    { label: "Contact", href: "#" },
  ],
  resources: [
    { label: "Help Center", href: "#" },
    { label: "Community", href: "#" },
    { label: "Webinars", href: "#" },
    { label: "Case Studies", href: "#" },
    { label: "Templates", href: "#" },
  ],
  legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
    { label: "GDPR", href: "#" },
  ],
};

const socialLinks = [
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent-400/5 rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative z-10">
        {/* Main footer content */}
        <div className="py-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <motion.a 
              href="#"
              className="inline-flex items-center gap-3 mb-6"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-400 flex items-center justify-center">
                <span className="text-white font-display font-bold text-xl">Z</span>
              </div>
              <span className="font-display font-bold text-2xl text-white">
                Zodeck<span className="text-brand-400">.</span>
              </span>
            </motion.a>
            
            <p className="text-gray-300 max-w-sm mb-6">
              Manifesting growth for Indian SMEs with the most comprehensive 
              HRMS solution. Streamline your HR operations today.
            </p>

            {/* Contact info */}
            <div className="space-y-3">
              <a href="mailto:hello@zodeck.in" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                <Mail className="w-4 h-4" />
                <span>hello@zodeck.in</span>
              </a>
              <a href="tel:+919876543210" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                <Phone className="w-4 h-4" />
                <span>+91 98765 43210</span>
              </a>
              <div className="flex items-start gap-3 text-gray-400">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span>Kondapur, Hyderabad, Telangana, India</span>
              </div>
            </div>

            {/* Social links */}
            <div className="flex gap-3 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-brand-500 hover:text-white transition-all"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Product links */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href} 
                    className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href} 
                    className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources links */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href} 
                    className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href} 
                    className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © 2024 Zodeck Technologies Private Limited. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm">
            Made with ❤️ in India
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;