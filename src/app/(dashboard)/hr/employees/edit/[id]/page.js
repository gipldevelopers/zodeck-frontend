"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    User, Mail, Phone, MapPin, Building, Calendar,
    Briefcase, ArrowLeft, Save, Loader2, Info
} from "lucide-react";
import Breadcrumb from "@/components/common/Breadcrumb";
import employeeService from "@/services/hr-services/employeeService";
import { toast } from "sonner";
import InputField from "@/components/form/input/InputField";
import SelectField from "../../add/components/SelectField";
import Label from "@/components/form/Label";
import { validateEmployeeForm } from "@/utils/validation";

export default function EditEmployeePage() {
    const { id } = useParams();
    const router = useRouter();

    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [dropdownData, setDropdownData] = useState({
        departments: [],
        designations: [],
        reportingManagers: []
    });

    const [activeTab, setActiveTab] = useState('personal');

    // Load dropdown data
    useEffect(() => {
        const loadDropdownData = async () => {
            try {
                const [departments, designations, managers] = await Promise.all([
                    employeeService.getDepartments(),
                    employeeService.getDesignations(),
                    employeeService.getManagers()
                ]);

                setDropdownData({
                    departments: Array.isArray(departments) ? departments : (departments.data || []),
                    designations: Array.isArray(designations) ? designations : (designations.data || []),
                    reportingManagers: Array.isArray(managers) ? managers : (managers.data || [])
                });
            } catch (error) {
                console.error('Error loading dropdown data:', error);
            }
        };

        loadDropdownData();
    }, []);

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const response = await employeeService.getEmployeeById(id);
                if (response.success) {
                    const emp = response.data;
                    // Map API response to form data structure
                    setFormData({
                        firstName: emp.firstName || '',
                        lastName: emp.lastName || '',
                        email: emp.email || '',
                        personalEmail: emp.personalEmail || '',
                        phone: emp.phone || '',
                        alternatePhone: emp.alternatePhone || '',
                        dateOfBirth: emp.dateOfBirth ? emp.dateOfBirth.split('T')[0] : '',
                        gender: emp.gender || '',
                        maritalStatus: emp.maritalStatus || '',
                        bloodGroup: emp.bloodGroup || '',
                        nationality: emp.nationality || 'Indian',
                        religion: emp.religion || '',
                        permanentAddress: emp.permanentAddress || '',
                        currentAddress: emp.currentAddress || '',
                        emergencyContactName: emp.emergencyContactName || '',
                        emergencyContactPhone: emp.emergencyContactPhone || '',
                        employeeId: emp.employeeId || '',
                        departmentId: emp.departmentId?.toString() || '',
                        designationId: emp.designationId?.toString() || '',
                        reportingManagerId: emp.reportingManagerId?.toString() || '',
                        joiningDate: emp.joiningDate ? emp.joiningDate.split('T')[0] : '',
                        confirmationDate: emp.confirmationDate ? emp.confirmationDate.split('T')[0] : '',
                        employmentType: emp.employmentType || 'FULL_TIME',
                        workLocation: emp.workLocation || '',
                        baseSalary: emp.baseSalary?.toString() || '',
                        workShift: emp.workShift || '',
                        status: emp.status || 'ACTIVE',
                        permanentAddress: emp.permanentAddress || '',
                        emergencyContactName: emp.emergencyContactName || '',
                        aadhaarNumber: emp.aadhaarNumber || '',
                        panNumber: emp.panNumber || '',
                        bankName: emp.bankName || '',
                        accountNumber: emp.accountNumber || '',
                        ifscCode: emp.ifscCode || '',
                        accountHolderName: emp.accountHolderName || '',
                        dbId: emp.id // numeric ID for update API
                    });
                }
            } catch (error) {
                console.error("Error fetching employee:", error);
                toast.error("Failed to load employee details");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchEmployee();
    }, [id]);

    const handleInputChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate relevant steps
        let allErrors = {};
        [1, 2, 3].forEach(step => {
            const stepErrors = validateEmployeeForm(formData, step);
            allErrors = { ...allErrors, ...stepErrors };
        });

        // Filter out errors for fields not present in the Edit UI
        const fieldsNotInUI = ['permanentAddress', 'emergencyContactName'];
        fieldsNotInUI.forEach(field => {
            delete allErrors[field];
        });

        if (Object.keys(allErrors).length > 0) {
            setErrors(allErrors);
            // Auto-switch tab if error is in a different section
            if (allErrors.firstName || allErrors.lastName || allErrors.dateOfBirth) setActiveTab('personal');
            else if (allErrors.email || allErrors.phone) setActiveTab('contact');
            else if (allErrors.departmentId || allErrors.designationId) setActiveTab('professional');

            const firstErrorField = Object.keys(allErrors)[0];
            toast.error(`Please fix the errors: ${allErrors[firstErrorField]}`);
            return;
        }

        setSubmitting(true);
        try {
            const processedData = {
                ...formData,
                departmentId: formData.departmentId ? parseInt(formData.departmentId) : null,
                designationId: formData.designationId ? parseInt(formData.designationId) : null,
                reportingManagerId: formData.reportingManagerId ? parseInt(formData.reportingManagerId) : null,
                baseSalary: formData.baseSalary ? parseFloat(formData.baseSalary) : null,
                dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth) : null,
                joiningDate: formData.joiningDate ? new Date(formData.joiningDate) : null,
                confirmationDate: formData.confirmationDate ? new Date(formData.confirmationDate) : null,
                // Preserve secondary fields
                aadhaarNumber: formData.aadhaarNumber,
                panNumber: formData.panNumber,
                bankName: formData.bankName,
                accountNumber: formData.accountNumber,
                ifscCode: formData.ifscCode,
                accountHolderName: formData.accountHolderName,
            };

            await employeeService.updateEmployee(formData.dbId, processedData);
            toast.success("Employee profile updated successfully");
            router.push(`/hr/employees/${id}`);
        } catch (error) {
            console.error("Error updating employee:", error);
            toast.error(error.message || "Failed to update employee");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <Loader2 className="animate-spin h-12 w-12 text-blue-600" />
            </div>
        );
    }

    const tabs = [
        { id: 'personal', label: 'Personal', icon: <User size={18} /> },
        { id: 'contact', label: 'Contact', icon: <Mail size={18} /> },
        { id: 'professional', label: 'Professional', icon: <Briefcase size={18} /> },
        { id: 'payroll', label: 'Payroll & Status', icon: <Building size={18} /> },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
            <Breadcrumb
                rightContent={
                    <div className="flex gap-3">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 transition"
                        >
                            <ArrowLeft size={18} /> Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm disabled:opacity-70"
                        >
                            {submitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                            Save Changes
                        </button>
                    </div>
                }
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">

                    {/* Tabs */}
                    <div className="flex border-b border-gray-100 dark:border-gray-700">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 flex items-center justify-center gap-3 py-5 text-base font-semibold transition-colors border-b-2 ${activeTab === tab.id
                                    ? 'text-blue-600 border-blue-600 bg-blue-50/30 dark:bg-blue-900/10'
                                    : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                    }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <form className="p-10" onSubmit={handleSubmit}>

                        {/* Personal Tab */}
                        {activeTab === 'personal' && (
                            <div className="space-y-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName" required>First Name</Label>
                                        <InputField
                                            id="firstName"
                                            value={formData.firstName}
                                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                                            error={errors.firstName}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName" required>Last Name</Label>
                                        <InputField
                                            id="lastName"
                                            value={formData.lastName}
                                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                                            error={errors.lastName}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="dateOfBirth" required>Date of Birth</Label>
                                        <InputField
                                            type="date"
                                            id="dateOfBirth"
                                            value={formData.dateOfBirth}
                                            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                                            error={errors.dateOfBirth}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="gender" required>Gender</Label>
                                        <SelectField
                                            options={[
                                                { value: 'MALE', label: 'Male' },
                                                { value: 'FEMALE', label: 'Female' },
                                                { value: 'OTHER', label: 'Other' }
                                            ]}
                                            value={formData.gender}
                                            onChange={(val) => handleInputChange('gender', val)}
                                            error={errors.gender}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="maritalStatus">Marital Status</Label>
                                        <SelectField
                                            options={[
                                                { value: 'SINGLE', label: 'Single' },
                                                { value: 'MARRIED', label: 'Married' },
                                                { value: 'DIVORCED', label: 'Divorced' }
                                            ]}
                                            value={formData.maritalStatus}
                                            onChange={(val) => handleInputChange('maritalStatus', val)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="bloodGroup">Blood Group</Label>
                                        <InputField
                                            id="bloodGroup"
                                            value={formData.bloodGroup}
                                            onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Contact Tab */}
                        {activeTab === 'contact' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <Label htmlFor="email" required>Official Email</Label>
                                        <InputField
                                            type="email"
                                            id="email"
                                            value={formData.email}
                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                            error={errors.email}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="personalEmail">Personal Email</Label>
                                        <InputField
                                            type="email"
                                            id="personalEmail"
                                            value={formData.personalEmail}
                                            onChange={(e) => handleInputChange('personalEmail', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone" required>Phone Number</Label>
                                        <InputField
                                            id="phone"
                                            value={formData.phone}
                                            onChange={(e) => handleInputChange('phone', e.target.value)}
                                            error={errors.phone}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="emergencyContactPhone">Emergency Contact Phone</Label>
                                        <InputField
                                            id="emergencyContactPhone"
                                            value={formData.emergencyContactPhone}
                                            onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="currentAddress">Current Address</Label>
                                    <textarea
                                        id="currentAddress"
                                        rows={3}
                                        className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                                        value={formData.currentAddress}
                                        onChange={(e) => handleInputChange('currentAddress', e.target.value)}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Professional Tab */}
                        {activeTab === 'professional' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <Label htmlFor="employeeId" required>Employee ID</Label>
                                        <InputField
                                            id="employeeId"
                                            value={formData.employeeId}
                                            onChange={(e) => handleInputChange('employeeId', e.target.value)}
                                            error={errors.employeeId}
                                            readOnly
                                            className="bg-gray-50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="departmentId" required>Department</Label>
                                        <SelectField
                                            options={(dropdownData.departments || []).map(d => ({ value: d.id?.toString(), label: d.name }))}
                                            value={formData.departmentId}
                                            onChange={(val) => handleInputChange('departmentId', val)}
                                            error={errors.departmentId}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="designationId" required>Designation</Label>
                                        <SelectField
                                            options={(dropdownData.designations || []).map(d => ({ value: d.id?.toString(), label: d.name }))}
                                            value={formData.designationId}
                                            onChange={(val) => handleInputChange('designationId', val)}
                                            error={errors.designationId}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="reportingManagerId">Reporting Manager</Label>
                                        <SelectField
                                            options={(dropdownData.reportingManagers || []).map(m => ({
                                                value: m.id?.toString(),
                                                label: `${m.firstName} ${m.lastName}`
                                            }))}
                                            value={formData.reportingManagerId}
                                            onChange={(val) => handleInputChange('reportingManagerId', val)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="joiningDate" required>Joining Date</Label>
                                        <InputField
                                            type="date"
                                            id="joiningDate"
                                            value={formData.joiningDate}
                                            onChange={(e) => handleInputChange('joiningDate', e.target.value)}
                                            error={errors.joiningDate}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="employmentType" required>Employment Type</Label>
                                        <SelectField
                                            options={[
                                                { value: 'FULL_TIME', label: 'Full Time' },
                                                { value: 'PART_TIME', label: 'Part Time' },
                                                { value: 'CONTRACT', label: 'Contract' },
                                                { value: 'INTERNSHIP', label: 'Internship' }
                                            ]}
                                            value={formData.employmentType}
                                            onChange={(val) => handleInputChange('employmentType', val)}
                                            error={errors.employmentType}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Payroll & Status Tab */}
                        {activeTab === 'payroll' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <Label htmlFor="baseSalary">Base Salary (₹)</Label>
                                        <InputField
                                            type="number"
                                            id="baseSalary"
                                            value={formData.baseSalary}
                                            onChange={(e) => handleInputChange('baseSalary', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="workShift">Work Shift</Label>
                                        <InputField
                                            id="workShift"
                                            value={formData.workShift}
                                            onChange={(e) => handleInputChange('workShift', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="status">Employment Status</Label>
                                        <SelectField
                                            options={[
                                                { value: 'ACTIVE', label: 'Active' },
                                                { value: 'PROBATION', label: 'Probation' },
                                                { value: 'NOTICE_PERIOD', label: 'Notice Period' },
                                                { value: 'RESIGNED', label: 'Resigned' },
                                                { value: 'TERMINATED', label: 'Terminated' }
                                            ]}
                                            value={formData.status}
                                            onChange={(val) => handleInputChange('status', val)}
                                        />
                                    </div>
                                </div>

                                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800 flex items-start gap-3">
                                    <Info className="text-blue-600 mt-0.5" size={18} />
                                    <div>
                                        <p className="text-xs text-blue-800 dark:text-blue-300">
                                            Changes to status and payroll might affect employee access and salary calculations.
                                            Please double-check before saving.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                    </form>
                </div>
            </div>
        </div>
    );
}
