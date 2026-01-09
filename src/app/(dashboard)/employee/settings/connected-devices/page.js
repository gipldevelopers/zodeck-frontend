"use client";

import { useState } from "react";
import Breadcrumb from "@/components/common/Breadcrumb";
import { Laptop, Smartphone, Tablet } from "lucide-react";

export default function ConnectedDevicesPage() {
  const breadcrumbItems = [
    { label: "Employee", href: "/employee" },
    { label: "Settings", href: "/employee/settings" },
    { label: "Active Sessions", href: "/employee/settings/connected-devices" },
  ];

  // Hardcoded devices data
  const [devices, setDevices] = useState([
    {
      id: 1,
      type: "Laptop",
      name: "MacBook Pro",
      os: "macOS Monterey",
      browser: "Chrome 140",
      location: "Ahmedabad, India",
      lastActive: "Today, 10:20 AM",
      connected: true,
    },
    {
      id: 2,
      type: "Smartphone",
      name: "iPhone 14",
      os: "iOS 17",
      browser: "Safari",
      location: "Ahmedabad, India",
      lastActive: "Yesterday, 8:45 PM",
      connected: true,
    },
    {
      id: 3,
      type: "Tablet",
      name: "iPad Air",
      os: "iPadOS 17",
      browser: "Chrome",
      location: "Mumbai, India",
      lastActive: "2 days ago",
      connected: false,
    },
  ]);

  // Toggle device connection
  const toggleConnection = (id) => {
    setDevices((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, connected: !d.connected } : d
      )
    );
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Breadcrumb items={breadcrumbItems} />

      <div className="mt-8 w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Active Sessions
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Monitor and control devices currently accessing your account for enhanced security.
        </p>

        {/* Devices List */}
        <div className="grid gap-6">
          {devices.map((device) => (
            <div
              key={device.id}
              className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-gray-100 dark:bg-gray-900 rounded-xl shadow-sm transition hover:shadow-md"
            >
              {/* Device Info */}
              <div className="flex items-center gap-4">
                <DeviceIcon type={device.type} />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    {device.name} ({device.os})
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Browser: {device.browser} • Location: {device.location} • Last Active: {device.lastActive}
                  </p>
                </div>
              </div>

              {/* Disconnect Toggle */}
              <div className="flex items-center gap-4 mt-2 md:mt-0">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={device.connected}
                    onChange={() => toggleConnection(device.id)}
                  />
                  <div className="w-14 h-8 bg-gray-300 rounded-full peer dark:bg-gray-700 peer-checked:bg-indigo-600 relative transition-all duration-300">
                    <span
                      className={`absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 
                        ${device.connected ? "translate-x-6" : "translate-x-0"}`}
                    ></span>
                  </div>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Device icon component
function DeviceIcon({ type }) {
  switch (type) {
    case "Laptop":
      return <Laptop className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />;
    case "Smartphone":
      return <Smartphone className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />;
    case "Tablet":
      return <Tablet className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />;
    default:
      return <Laptop className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />;
  }
}
