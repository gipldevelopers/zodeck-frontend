"use client";

import { useState } from "react";
import Breadcrumb from "@/components/common/Breadcrumb";
import { User, Calendar, Phone, Mail, MapPin, Building } from "lucide-react";

export default function ContactInformationPage() {
  const breadcrumbItems = [
    { label: "Employee", href: "/employee" },
    { label: "Settings", href: "/employee/settings" },
    { label: "Contact Information", href: "/employee/settings/contact-information" },
  ];

  const [employee, setEmployee] = useState({
    firstName: "Vraj",
    lastName: "Darji",
    email: "vraj.darji@example.com",
    phone: "+91 9876543210",
    dob: "12 March 1998",
    gender: "Male",
    maritalStatus: "Single",
    bloodGroup: "O+",
    department: "Software Development",
    address: "123, Shreeji Apartment, Ahmedabad",
    country: "India",
    state: "Gujarat",
    city: "Ahmedabad",
    postalCode: "380015",
    emergencyContactName: "John Doe",
    emergencyContactPhone: "+91 9123456789",
  });

  const [message, setMessage] = useState("");

  const handleChange = (field, value) => {
    setEmployee((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can call API to save changes
    setMessage("Contact information has been updated successfully!");
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Breadcrumb items={breadcrumbItems} />

      <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 w-full">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Contact & Personal Information
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Update your personal, contact, and emergency information here.
        </p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Personal Info */}
          <div className="grid md:grid-cols-2 gap-6 w-full">
            <InputField label="First Name" icon={<User size={16} />} value={employee.firstName} onChange={(v) => handleChange("firstName", v)} />
            <InputField label="Last Name" icon={<User size={16} />} value={employee.lastName} onChange={(v) => handleChange("lastName", v)} />
            <InputField label="Email" icon={<Mail size={16} />} value={employee.email} onChange={(v) => handleChange("email", v)} />
            <InputField label="Phone" icon={<Phone size={16} />} value={employee.phone} onChange={(v) => handleChange("phone", v)} />
            <InputField label="Date of Birth" icon={<Calendar size={16} />} value={employee.dob} onChange={(v) => handleChange("dob", v)} />
            <InputField label="Gender" icon={<User size={16} />} value={employee.gender} onChange={(v) => handleChange("gender", v)} />
            <InputField label="Marital Status" icon={<User size={16} />} value={employee.maritalStatus} onChange={(v) => handleChange("maritalStatus", v)} />
            <InputField label="Blood Group" icon={<User size={16} />} value={employee.bloodGroup} onChange={(v) => handleChange("bloodGroup", v)} />
            <InputField label="Department" icon={<Building size={16} />} value={employee.department} onChange={(v) => handleChange("department", v)} />
          </div>

          {/* Address Info */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Address Information</h3>
            <div className="grid md:grid-cols-2 gap-6 w-full">
              <InputField label="Address" icon={<MapPin size={16} />} value={employee.address} onChange={(v) => handleChange("address", v)} />
              <InputField label="Country" icon={<MapPin size={16} />} value={employee.country} onChange={(v) => handleChange("country", v)} />
              <InputField label="State" icon={<MapPin size={16} />} value={employee.state} onChange={(v) => handleChange("state", v)} />
              <InputField label="City" icon={<MapPin size={16} />} value={employee.city} onChange={(v) => handleChange("city", v)} />
              <InputField label="Postal Code" icon={<MapPin size={16} />} value={employee.postalCode} onChange={(v) => handleChange("postalCode", v)} />
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Emergency Contact</h3>
            <div className="grid md:grid-cols-2 gap-6 w-full">
              <InputField label="Emergency Contact Name" icon={<User size={16} />} value={employee.emergencyContactName} onChange={(v) => handleChange("emergencyContactName", v)} />
              <InputField label="Emergency Contact Phone" icon={<Phone size={16} />} value={employee.emergencyContactPhone} onChange={(v) => handleChange("emergencyContactPhone", v)} />
            </div>
          </div>

          {/* Success Message */}
          {message && (
            <p className="mt-4 px-4 py-2 bg-green-100 text-green-800 rounded-lg dark:bg-green-700 dark:text-green-100 w-max">
              {message}
            </p>
          )}

          {/* Save Button */}
          <div className="flex justify-end gap-4 mt-4">
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function InputField({ label, icon, value, onChange }) {
  return (
    <div className="flex flex-col w-full">
      <label className="flex items-center gap-2 mb-1 text-gray-600 dark:text-gray-300 font-medium">
        {icon} {label}
      </label>
      <input
        type="text"
        className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
