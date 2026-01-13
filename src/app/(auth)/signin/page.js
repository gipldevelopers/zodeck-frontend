// // src\app\(auth)\signin\page.js
// import AuthGuard from "@/components/auth/AuthGuard";
// import SignInForm from "@/components/auth/SignInForm";

// export const metadata = {
//   title: "Next.js SignIn Page | TailAdmin - Next.js Dashboard Template",
//   description: "This is Next.js Signin Page TailAdmin Dashboard Template",
// };

// export default function SignIn() {
//   return (
//     <AuthGuard requireAuth={false}>  {/* Don't require auth for signin page */}
//       <SignInForm />
//     </AuthGuard>
//   )
// }

"use client";
import React from 'react';
import AuthGuard from "@/components/auth/AuthGuard";
import SignInForm from "@/components/auth/SignInForm";
import { ShieldCheck, Globe, Zap, Star } from 'lucide-react';

export default function SignIn() {
  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen w-full flex bg-white dark:bg-black">
        
        {/* --- LEFT COLUMN: Brand Experience (Desktop Only) --- */}
        <div className="hidden lg:flex w-[60%] relative flex-col justify-between p-16 overflow-hidden bg-[#0a0a0a]">
           
           {/* Abstract Animated Background */}
           <div className="absolute inset-0 z-0 pointer-events-none">
              <div className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse"></div>
              <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
              {/* Grid Overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
           </div>

           {/* Header: Logo */}
           <div className="relative z-10 flex items-center gap-3">
              <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-xl shadow-white/10">
                 <span className="text-xl font-bold text-black">Z</span>
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">Zodeck</span>
           </div>

           {/* Center: Value Proposition */}
           <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-md text-white/80 text-sm font-medium mb-8">
                 <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                 <span>Trusted by 4,000+ Enterprises</span>
              </div>
              <h1 className="text-6xl font-medium text-white leading-[1.1] mb-8 tracking-tight">
                 The operating system for <br />
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-white">
                    modern workforce.
                 </span>
              </h1>
              
              <div className="grid grid-cols-2 gap-12 border-t border-white/10 pt-8 mt-12">
                 <div>
                    <p className="text-white font-medium text-lg">99.9% Uptime</p>
                    <p className="text-gray-500 text-sm mt-1">Enterprise-grade reliability guarantees.</p>
                 </div>
                 <div>
                    <p className="text-white font-medium text-lg">Global Payroll</p>
                    <p className="text-gray-500 text-sm mt-1">Automated compliance across 100+ regions.</p>
                 </div>
              </div>
           </div>

           {/* Footer: Trust Badges */}
           <div className="relative z-10 flex gap-8 text-sm text-gray-400 font-medium items-center">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 backdrop-blur-sm">
                 <ShieldCheck className="w-4 h-4 text-emerald-500" /> SOC2 Type II
              </div>
              <div className="flex items-center gap-2">
                 <Globe className="w-4 h-4 text-blue-500" /> ISO 27001
              </div>
              <div className="flex items-center gap-2">
                 <Zap className="w-4 h-4 text-amber-500" /> GDPR Ready
              </div>
           </div>
        </div>

        {/* --- RIGHT COLUMN: Login Interface --- */}
        <div className="w-full lg:w-[40%] flex flex-col justify-center items-center p-8 relative z-20 bg-white dark:bg-gray-950 shadow-2xl">
           <div className="w-full max-w-[420px]">
              <SignInForm />
           </div>
           
           {/* <div className="absolute bottom-8 text-center text-xs text-gray-400 max-w-sm leading-relaxed">
              Protected by reCAPTCHA and subject to the Zodeck <a href="#" className="underline hover:text-gray-600 dark:hover:text-gray-300">Privacy Policy</a> and <a href="#" className="underline hover:text-gray-600 dark:hover:text-gray-300">Terms of Service</a>.
           </div> */}
        </div>

      </div>
    </AuthGuard>
  );
}