'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { policyRuleService } from '@/services/super-admin-services/policy-rule.service';
import Breadcrumb from '@/components/common/Breadcrumb';
import PolicyForm from '../../_components/PolicyForm'; // Adjusted path for edit/[id]

export default function EditPolicyPage() {
    const router = useRouter();
    const { id } = useParams();
    const [policy, setPolicy] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPolicy = async () => {
            try {
                const response = await policyRuleService.getPolicyById(id);
                // Handle potential response structures: { success: true, data: policy } or just policy
                const policyData = response.data || response;
                const rules = policyData.rules || {};

                // Map API response to Formik initial values, checking both top-level and nested rules
                const normalizedData = {
                    name: policyData.name || '',
                    description: policyData.description || '',
                    type: policyData.type || 'ATTENDANCE',
                    isActive: policyData.isActive !== undefined ? policyData.isActive : true,
                    version: policyData.version || '1.0',

                    // Attendance
                    shiftStart: policyData.shiftStart || rules.shiftStart || '09:00',
                    shiftEnd: policyData.shiftEnd || rules.shiftEnd || '18:00',
                    gracePeriodMinutes: policyData.gracePeriodMinutes || rules.gracePeriodMinutes || 0,
                    halfDayLateEntry: policyData.halfDayLateEntry || rules.halfDayLateEntry || '11:00',
                    biometricEnabled: policyData.biometricEnabled ?? rules.biometricEnabled ?? false,

                    // Leave
                    annualLeaveCount: policyData.annualLeaveCount || rules.annualLeaveCount || 0,
                    sickLeaveCount: policyData.sickLeaveCount || rules.sickLeaveCount || 0,
                    maxCarryOverDays: policyData.maxCarryOverDays || rules.maxCarryOverDays || 0,
                    encashmentAllowed: policyData.encashmentAllowed ?? rules.encashmentAllowed ?? false,
                    probationLeaveAllowed: policyData.probationLeaveAllowed ?? rules.probationLeaveAllowed ?? false,

                    // Payroll
                    salaryCycleStartDay: policyData.salaryCycleStartDay || rules.salaryCycleStartDay || 1,
                    salaryCycleEndDay: policyData.salaryCycleEndDay || rules.salaryCycleEndDay || 30,
                    taxDeductionMethod: policyData.taxDeductionMethod || rules.taxDeductionMethod || 'PROJECTED',
                    overtimeCalculationRate: policyData.overtimeCalculationRate || rules.overtimeCalculationRate || 1.5,
                    payslipGenerationDate: policyData.payslipGenerationDate || rules.payslipGenerationDate || 28,

                    // Expense
                    autoApprovalLimit: policyData.autoApprovalLimit || rules.autoApprovalLimit || 0,
                    receiptRequiredAbove: policyData.receiptRequiredAbove || rules.receiptRequiredAbove || 0,
                    travelClassAllowed: policyData.travelClassAllowed || rules.travelClassAllowed || 'ECONOMY',
                    maxFoodAllowancePerDay: policyData.maxFoodAllowancePerDay || rules.maxFoodAllowancePerDay || 0,
                    reimbursementCycleDays: policyData.reimbursementCycleDays || rules.reimbursementCycleDays || 7,
                };

                setPolicy(normalizedData);
            } catch (error) {
                console.error(error);
                toast.error('Failed to fetch policy details');
                router.push('/super-admin/policy-rule');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchPolicy();
        }
    }, [id, router]);

    const handleSubmit = async (values) => {
        try {
            await policyRuleService.updatePolicy(id, values);
            toast.success('Policy updated successfully');
            router.push('/super-admin/policy-rule');
        } catch (error) {
            console.error(error);
            toast.error('Failed to update policy');
        }
    };

    const handleCancel = () => {
        router.push('/super-admin/policy-rule');
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            </div>
        );
    }

    if (!policy) return null;

    return (
        <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8 font-sans">
            <Toaster position="top-right" />
            <Breadcrumb pageName="Edit Policy" />

            <div className="mt-6 rounded-xl border border-gray-200 bg-white shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 border-b pb-2">Edit Policy: {policy.name}</h2>
                <PolicyForm
                    initialValues={policy}
                    onSubmit={handleSubmit}
                    isEditing={true}
                    onCancel={handleCancel}
                />
            </div>
        </div>
    );
}
