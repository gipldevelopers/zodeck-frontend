"use client";

import { useState } from "react";
import Breadcrumb from "@/components/common/Breadcrumb";
import { Lock, Key, Eye, EyeOff } from "lucide-react";

export default function PasswordManagementPage() {
  const breadcrumbItems = [
    { label: "Employee", href: "/employee" },
    { label: "Settings", href: "/employee/settings" },
    { label: "Password Management", href: "/employee/settings/password-management" },
  ];

  const [passwords, setPasswords] = useState({
    currentPassword: "password123",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (field, value) => {
    setPasswords((prev) => ({ ...prev, [field]: value }));
  };

  const toggleShowPassword = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSave = () => {
    // Validation
    if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
      setMessage({ type: "error", text: "All fields are required." });
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage({ type: "error", text: "New password and confirm password do not match." });
      return;
    }

    // Simulate saving
    setMessage({ type: "success", text: "Password has been updated successfully!" });
    setPasswords((prev) => ({ ...prev, currentPassword: passwords.newPassword, newPassword: "", confirmPassword: "" }));
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Breadcrumb items={breadcrumbItems} />

      <div className="mt-8 w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Change your password
        </h2>

        <div className="space-y-6 w-full">
          <PasswordField
            label="Current Password"
            icon={<Lock size={16} />}
            value={passwords.currentPassword}
            show={showPassword.currentPassword}
            onChange={(v) => handleChange("currentPassword", v)}
            onToggle={() => toggleShowPassword("currentPassword")}
          />
          <PasswordField
            label="New Password"
            icon={<Key size={16} />}
            value={passwords.newPassword}
            show={showPassword.newPassword}
            onChange={(v) => handleChange("newPassword", v)}
            onToggle={() => toggleShowPassword("newPassword")}
          />
          <PasswordField
            label="Confirm New Password"
            icon={<Key size={16} />}
            value={passwords.confirmPassword}
            show={showPassword.confirmPassword}
            onChange={(v) => handleChange("confirmPassword", v)}
            onToggle={() => toggleShowPassword("confirmPassword")}
          />
        </div>

        {message.text && (
          <p
            className={`mt-4 text-sm px-4 py-2 rounded-lg w-max ${
              message.type === "success"
                ? "bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100"
                : "bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100"
            }`}
          >
            {message.text}
          </p>
        )}

        <div className="mt-8 flex justify-end w-full">
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
          >
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
}

function PasswordField({ label, icon, value, onChange, show, onToggle }) {
  return (
    <div className="flex flex-col w-full relative">
      <label className="flex items-center gap-2 mb-1 text-gray-600 dark:text-gray-300 font-medium">
        {icon} {label}
      </label>
      <div className="relative w-full">
        <input
          type={show ? "text" : "password"}
          className="w-full p-3 pr-12 border rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <span
          className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 dark:text-gray-300"
          onClick={onToggle}
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </span>
      </div>
    </div>
  );
}
