"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    User, Mail, Phone, MapPin,
    Briefcase, ArrowLeft, Edit,
    FileText, CreditCard,
} from "lucide-react";
import Breadcrumb from "@/components/common/Breadcrumb";
import employeeService from "@/services/hr-services/employeeService";
import { toast } from "sonner";

export default function EmployeeProfilePage() {
    const { id } = useParams();
    const router = useRouter();
    const [employee, setEmployee] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEmployeeData = async () => {
            try {
                // Fetch employee details
                const empResponse = await employeeService.getEmployeeById(id);
                if (empResponse.success) {
                    setEmployee(empResponse.data);
                }

                // Fetch employee documents
                try {
                    const docsResponse = await employeeService.getEmployeeDocuments(id);
                    if (docsResponse.success) {
                        setDocuments(docsResponse.data || []);
                    }
                } catch (docError) {
                    console.error("Error fetching documents:", docError);
                    // Don't show error toast for documents, just log it
                }
            } catch (error) {
                console.error("Error fetching employee:", error);
                toast.error("Failed to load employee details");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchEmployeeData();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!employee) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Employee Not Found</h2>
                <button
                    onClick={() => router.push("/hr/employees")}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    <ArrowLeft size={18} /> Back to Directory
                </button>
            </div>
        );
    }

    const sections = [
        {
            title: "Personal Information",
            icon: <User size={20} className="text-blue-500" />,
            items: [
                { label: "Full Name", value: `${employee.firstName} ${employee.lastName}` },
                { label: "Gender", value: employee.gender || "-" },
                { label: "Date of Birth", value: employee.dateOfBirth ? new Date(employee.dateOfBirth).toLocaleDateString() : "-" },
                { label: "Marital Status", value: employee.maritalStatus || "-" },
                { label: "Blood Group", value: employee.bloodGroup || "-" },
                { label: "Nationality", value: employee.nationality || "-" },
                { label: "Religion", value: employee.religion || "-" },
                { label: "Birth Place", value: employee.birthPlace || "-" },
            ]
        },
        {
            title: "Contact Details",
            icon: <Mail size={20} className="text-blue-500" />,
            items: [
                { label: "Official Email", value: employee.email },
                { label: "Personal Email", value: employee.personalEmail || "-" },
                { label: "Phone Number", value: employee.phone || "-" },
                { label: "Emergency Contact", value: employee.emergencyContact || "-" },
                { label: "Emergency Phone", value: employee.emergencyContactPhone || "-" },
                { label: "Current Address", value: employee.currentAddress || "-" },
            ]
        },
        {
            title: "Professional Details",
            icon: <Briefcase size={20} className="text-blue-500" />,
            items: [
                { label: "Employee ID", value: employee.employeeId },
                { label: "Designation", value: employee.designation?.name || "-" },
                { label: "Department", value: employee.department?.name || "-" },
                { label: "Joining Date", value: employee.joiningDate ? new Date(employee.joiningDate).toLocaleDateString() : "-" },
                { label: "Employment Type", value: employee.employmentType || "-" },
                { label: "Work Shift", value: employee.workShift || "-" },
                { label: "Work Location", value: employee.workLocation || "-" },
                { label: "Reporting To", value: employee.reportingTo ? `${employee.reportingTo.firstName} ${employee.reportingTo.lastName}` : "-" },
            ]
        },
        {
            title: "Banking & Tax Information",
            icon: <CreditCard size={20} className="text-blue-500" />,
            items: [
                { label: "Bank Name", value: employee.bankName || "-" },
                { label: "Account Number", value: employee.accountNumber || "-" },
                { label: "IFSC Code", value: employee.ifscCode || "-" },
                { label: "PAN Number", value: employee.panNumber || "-" },
                { label: "Aadhaar Number", value: employee.aadhaarNumber || "-" },
                { label: "Base Salary", value: employee.baseSalary ? `₹${employee.baseSalary.toLocaleString()}` : "-" },
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
            <Breadcrumb
                rightContent={
                    <div className="flex gap-3">
                        <button
                            onClick={() => router.push("/hr/employees")}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 transition"
                        >
                            <ArrowLeft size={18} /> Back
                        </button>
                        <button
                            onClick={() => router.push(`/hr/employees/edit/${id}`)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
                        >
                            <Edit size={18} /> Edit Profile
                        </button>
                    </div>
                }
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column - Profile Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
                            <div className="px-6 pb-6 mt-[-4rem]">
                                <div className="relative inline-block">
                                    <div className="w-32 h-32 rounded-2xl border-4 border-white dark:border-gray-800 overflow-hidden bg-gray-100 dark:bg-gray-700 shadow-md">
                                        {employee.profileImage ? (
                                            <img
                                                src={process.env.NEXT_PUBLIC_API_URL + employee.profileImage}
                                                alt={employee.firstName}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <User size={64} className="text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                    <span className={`absolute bottom-2 right-2 w-5 h-5 rounded-full border-2 border-white dark:border-gray-800 ${employee.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'
                                        }`}></span>
                                </div>

                                <div className="mt-4">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {employee.firstName} {employee.lastName}
                                    </h2>
                                    <p className="text-blue-600 dark:text-blue-400 font-medium">
                                        {employee.designation?.name || "No Designation"}
                                    </p>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                                        {employee.department?.name || "No Department"}
                                    </p>
                                </div>

                                <div className="mt-6 space-y-4">
                                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                        <Mail size={18} className="text-gray-400" />
                                        <span className="text-sm truncate">{employee.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                        <Phone size={18} className="text-gray-400" />
                                        <span className="text-sm">{employee.phone || "Not specified"}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                        <MapPin size={18} className="text-gray-400" />
                                        <span className="text-sm">{employee.address || "Not specified"}</span>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Join Date</p>
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                                                {employee.joiningDate ? new Date(employee.joiningDate).toLocaleDateString() : '-'}
                                            </p>
                                        </div>
                                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</p>
                                            <p className={`text-sm font-semibold mt-1 ${employee.status === 'ACTIVE' ? 'text-green-600' : 'text-red-600'
                                                }`}>
                                                {employee.status || 'INACTIVE'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Details Sections */}
                    <div className="lg:col-span-2 space-y-6">
                        {sections.map((section, idx) => (
                            <div
                                key={idx}
                                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
                            >
                                <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-1.5 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                                            {section.icon}
                                        </div>
                                        <h3 className="font-bold text-gray-900 dark:text-white">
                                            {section.title}
                                        </h3>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                                        {section.items.map((item, i) => (
                                            <div key={i}>
                                                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
                                                    {item.label}
                                                </p>
                                                <p className="text-gray-900 dark:text-white font-medium">
                                                    {item.value}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Documents Section */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-1.5 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                                        <FileText size={20} className="text-blue-500" />
                                    </div>
                                    <h3 className="font-bold text-gray-900 dark:text-white">
                                        Documents
                                    </h3>
                                </div>
                                <button
                                    onClick={() => router.push(`/hr/employees/${id}/documents`)}
                                    className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                                >
                                    Manage Documents →
                                </button>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {['AADHAAR', 'PAN', 'RESUME'].map((docType) => {
                                        const hasDoc = documents.some(doc => doc.type === docType);
                                        return (
                                            <div
                                                key={docType}
                                                className={`p-4 rounded-xl border-2 transition-all ${hasDoc
                                                    ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                                                    : 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-2 rounded-lg ${hasDoc
                                                            ? 'bg-green-100 dark:bg-green-900/40'
                                                            : 'bg-yellow-100 dark:bg-yellow-900/40'
                                                            }`}>
                                                            <FileText size={20} className={hasDoc ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'} />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-900 dark:text-white text-sm">
                                                                {docType}
                                                            </p>
                                                            <p className={`text-xs ${hasDoc
                                                                ? 'text-green-600 dark:text-green-400'
                                                                : 'text-yellow-600 dark:text-yellow-400'
                                                                }`}>
                                                                {hasDoc ? 'Uploaded' : 'Pending'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                {documents.length === 0 && (
                                    <div className="mt-4 text-center py-6 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                                        <FileText size={32} className="mx-auto text-gray-400 mb-2" />
                                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                                            No documents uploaded yet
                                        </p>
                                        <button
                                            onClick={() => router.push(`/hr/employees/${id}/documents`)}
                                            className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
                                        >
                                            Upload Documents
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
