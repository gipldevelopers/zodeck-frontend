"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2, CalendarDays } from 'lucide-react';
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function SignInForm() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const result = await login(formData);
      if (result.success) {
        router.push(result.redirect || "/employee/dashboard");
      } else {
        setError(result.message || 'Invalid credentials. Please try again.');
        setLoading(false);
      }
    } catch (err) {
      setError("Network connection error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Sign in</h2>
        <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">
          Welcome back to Zodeck. Please enter your details.
        </p>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        
        <div className="space-y-4">
          <div className="group">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                </div>
                <input
                name="email"
                type="email"
                required
                placeholder="name@work-email.com"
                value={formData.email}
                onChange={handleChange}
                className="block w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-gray-800 focus:border-transparent transition-all outline-none"
                disabled={loading}
                />
            </div>
          </div>

          <div className="group">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
              </div>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="block w-full pl-11 pr-12 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-gray-800 focus:border-transparent transition-all outline-none"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Error State */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-sm text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-end">
           <Link href="/forgot-password">
             <span className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 transition-colors">
               Forgot password?
             </span>
           </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="relative w-full py-3.5 px-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none overflow-hidden group"
        >
          {loading ? (
            <Loader2 className="animate-spin w-5 h-5 mx-auto" />
          ) : (
            <span className="flex items-center justify-center gap-2">
              Sign in <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </span>
          )}
        </button>
      </form>

      {/* Demo credentials hint */}
      <div className="p-4 mt-6 text-sm bg-blue-50 rounded-lg dark:bg-blue-900/20">
        <p className="font-medium text-blue-800 dark:text-blue-300">
          Demo Credentials:
        </p>

        <div className="mt-2 space-y-1 text-blue-700 dark:text-blue-200">
          <p>Super Admin: superadmin@globalhr.com / admin123</p>
          <p>HR Admin: hr@globalhr.com / hr123</p>
          <p>Payroll Admin: payroll@globalhr.com / payroll123</p>
          <p>Finance Admin: financeadmin@globalhr.com / finance123</p>
          <p>Employee: marketing@globalhr.com / marketing123</p>
        </div>
      </div>
    </motion.div>
  );
}
