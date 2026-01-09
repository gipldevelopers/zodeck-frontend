"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import InputField from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import Checkbox from "@/components/form/input/Checkbox";
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth } from "@/context/AuthContext";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const result = await login(formData);
      
      if (result.success) {
        // Use the redirect path from the login response
        router.push(result.redirect || "/employee/dashboard");
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (error) {
      setError("An unexpected error occurred");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 w-full max-w-md mx-auto">
      <div className="flex flex-col justify-center flex-1">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to access your account
            </p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {error && (
                <div className="p-3 text-sm text-red-800 bg-red-50 rounded-lg dark:bg-red-900/20 dark:text-red-300">
                  {error}
                </div>
              )}
              
              <div>
                <Label htmlFor="email">
                  Email <span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <InputField 
                    id="email"
                    name="email"
                    placeholder="your.email@company.com" 
                    type="email" 
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="password">
                  Password <span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <InputField
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 pr-10"
                    required
                    disabled={loading}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    )}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox 
                    id="remember"
                    checked={isChecked} 
                    onChange={setIsChecked}
                    disabled={loading}
                  />
                  <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                    Keep me logged in
                  </span>
                </div>
              </div>
              
              <div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  size="sm"
                  disabled={loading}
                  loading={loading}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </div>
            </div>
          </form>

          {/* Demo credentials hint */}
          <div className="p-4 mt-6 text-sm bg-blue-50 rounded-lg dark:bg-blue-900/20">
            <p className="font-medium text-blue-800 dark:text-blue-300">Demo Credentials:</p>
            <p className="mt-1 text-blue-700 dark:text-blue-200">
              HR: hr@globalhr.com / hr123
            </p>
            <p className="text-blue-700 dark:text-blue-200">
              Employee: marketing@globalhr.com / marketing123
            </p>
            <p className="text-blue-700 dark:text-blue-200">
              Super Admin: superadmin@globalhr.com / admin123
            </p>
          </div>

          <div className="mt-5">
            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start flex justify-between">
              Can&apos;t remember password?{""}
              <Link
                href="/forgot-password"
                className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                Forgot Password?
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}