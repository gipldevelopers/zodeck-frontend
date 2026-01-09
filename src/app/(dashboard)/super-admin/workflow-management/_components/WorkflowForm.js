'use client';

import { useFormik, FieldArray, FormikProvider } from 'formik';
import * as Yup from 'yup';
import {
    Plus,
    Trash2,
    AlertCircle,
    ArrowRight,
    GripVertical,
    Clock,
    UserCheck
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { roleService } from '@/services/super-admin-services/user-roleService';
import { userManagementService } from '@/services/userManagementService';

// Schema Validation
const getValidationSchema = () => {
    return Yup.object().shape({
        name: Yup.string().required('Name is required'),
        type: Yup.string().required('Type is required'),
        steps: Yup.array().of(
            Yup.object().shape({
                name: Yup.string().required('Step Name is required'),
                approverType: Yup.string().required('Approver Type is required'),
                systemRole: Yup.string().when('approverType', {
                    is: 'ROLE',
                    then: (schema) => schema.required('Role is required'),
                }),
                specificUserId: Yup.string().when('approverType', {
                    is: 'SPECIFIC_USER',
                    then: (schema) => schema.required('User is required'),
                }),
                slaDuration: Yup.number().positive().required('Duration is required'),
                slaUnit: Yup.string().required('Unit is required'),
            })
        ).min(1, 'At least one step is required'),
        // Conditions validation can be loose or specific based on type
    });
};

export default function WorkflowForm({ initialValues, onSubmit, isEditing = false, onCancel }) {
    const [systemRoles, setSystemRoles] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [rolesResponse, usersResponse] = await Promise.all([
                    roleService.getSystemRoles(),
                    userManagementService.getAllUsers({ limit: 1000 }) // Fetch all potential approvers
                ]);

                const roles = Array.isArray(rolesResponse) ? rolesResponse : (rolesResponse.docs || []);
                setSystemRoles(roles.map(r => ({ label: r.name, value: r.name })));

                const usersData = usersResponse.users || usersResponse.docs || [];
                setUsers(usersData.map(u => ({ label: `${u.firstName} ${u.lastName} (${u.email})`, value: u.id })));
            } catch (error) {
                console.error("Failed to fetch initial data", error);
            }
        };
        fetchData();
    }, []);

    const formik = useFormik({
        initialValues: initialValues || {
            name: '',
            description: '',
            type: 'LEAVE',
            isActive: true,
            isDefault: false,
            conditions: {
                days_min: 0,
                days_max: '',
                amount_min: 0,
            },
            steps: [
                {
                    stepNumber: 1,
                    name: 'Reporting Manager',
                    approverType: 'MANAGER',
                    slaDuration: 24,
                    slaUnit: 'HOURS',
                    slaAction: 'NEXT_LEVEL',
                    isFinalStep: false,
                }
            ],
        },
        validationSchema: getValidationSchema(),
        enableReinitialize: true,
        onSubmit: async (values) => {
            // Re-index steps
            const orderedSteps = values.steps.map((step, index) => ({
                ...step,
                stepNumber: index + 1,
                isFinalStep: index === values.steps.length - 1
            }));
            await onSubmit({ ...values, steps: orderedSteps });
        },
    });

    const addStep = () => {
        const newStep = {
            stepNumber: formik.values.steps.length + 1,
            name: '',
            approverType: 'MANAGER',
            slaDuration: 24,
            slaUnit: 'HOURS',
            slaAction: 'NEXT_LEVEL',
            isFinalStep: false,
        };
        formik.setFieldValue('steps', [...formik.values.steps, newStep]);
    };

    const removeStep = (index) => {
        const newSteps = formik.values.steps.filter((_, i) => i !== index);
        formik.setFieldValue('steps', newSteps);
    };

    const renderConditions = () => {
        const type = formik.values.type;
        if (type === 'LEAVE') {
            return (
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Min Days</label>
                        <input type="number" {...formik.getFieldProps('conditions.days_min')} className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Max Days</label>
                        <input type="number" {...formik.getFieldProps('conditions.days_max')} className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 text-sm" placeholder="Leave empty for unlimited" />
                    </div>
                </div>
            )
        } else if (type === 'EXPENSE') {
            return (
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Min Amount</label>
                        <input type="number" {...formik.getFieldProps('conditions.amount_min')} className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 text-sm" />
                    </div>
                </div>
            )
        }
        return <div className="text-sm text-gray-500 italic">No specific conditions for this type.</div>;
    };

    return (
        <FormikProvider value={formik}>
            <form onSubmit={formik.handleSubmit} className="space-y-6 text-left">
                {/* Basic Details */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase flex items-center gap-2">
                        <UserCheck className="w-4 h-4" /> Basic Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Workflow Name</label>
                            <input
                                type="text"
                                {...formik.getFieldProps('name')}
                                className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                            {formik.touched.name && formik.errors.name && <div className="text-red-500 text-xs mt-1">{formik.errors.name}</div>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Type</label>
                            <select
                                {...formik.getFieldProps('type')}
                                className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                                <option value="LEAVE">Leave Approval</option>
                                <option value="EXPENSE">Expense Approval</option>
                                <option value="ATTENDANCE_REGULARIZATION">Attendance Regularization</option>
                                <option value="PAYROLL">Payroll</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea rows={2} {...formik.getFieldProps('description')} className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm sm:text-sm" />
                        </div>
                        <div className="flex gap-4 pt-2">
                            <div className="flex items-center">
                                <input type="checkbox" id="isActive" checked={formik.values.isActive} onChange={(e) => formik.setFieldValue('isActive', e.target.checked)} className="h-4 w-4 text-blue-600 rounded border-gray-300" />
                                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">Active</label>
                            </div>
                            <div className="flex items-center">
                                <input type="checkbox" id="isDefault" checked={formik.values.isDefault} onChange={(e) => formik.setFieldValue('isDefault', e.target.checked)} className="h-4 w-4 text-blue-600 rounded border-gray-300" />
                                <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-900">Default Workflow</label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Conditions Section */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" /> Trigger Conditions
                    </h3>
                    {renderConditions()}
                </div>

                {/* Steps Section - The Core Logic */}
                <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                            Approval Steps <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-0.5 rounded-full">{formik.values.steps.length}</span>
                        </h3>
                        {/* <button type="button" onClick={addStep} className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
                            <Plus className="w-4 h-4" /> Add Step
                        </button> */}
                    </div>

                    <div className="space-y-4">
                        {formik.values.steps.map((step, index) => (
                            <div key={index} className="flex gap-3 relative group">
                                <div className="flex flex-col items-center mt-3">
                                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold z-10">
                                        {index + 1}
                                    </div>
                                    {index !== formik.values.steps.length - 1 && (
                                        <div className="w-0.5 h-full bg-gray-200 -my-1"></div>
                                    )}
                                </div>

                                <div className="flex-1 bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:border-blue-300 transition-colors">
                                    <div className="flex justify-between items-start mb-3">
                                        <h4 className="text-sm font-medium text-gray-900">Step {index + 1} Configuration</h4>
                                        <button type="button" onClick={() => removeStep(index)} className="text-gray-400 hover:text-red-500" disabled={formik.values.steps.length === 1}>
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div className="lg:col-span-1">
                                            <label className="text-xs font-medium text-gray-500">Step Name</label>
                                            <input type="text" value={step.name} onChange={(e) => formik.setFieldValue(`steps.${index}.name`, e.target.value)} className="mt-1 block w-full rounded-md border border-gray-200 text-sm py-1.5 px-2" placeholder="e.g. Manager Approval" />
                                            {formik.touched.steps?.[index]?.name && formik.errors.steps?.[index]?.name && <div className="text-red-500 text-xs">{formik.errors.steps[index].name}</div>}
                                        </div>

                                        <div className="lg:col-span-1">
                                            <label className="text-xs font-medium text-gray-500">Approver</label>
                                            <select value={step.approverType} onChange={(e) => formik.setFieldValue(`steps.${index}.approverType`, e.target.value)} className="mt-1 block w-full rounded-md border border-gray-200 text-sm py-1.5 px-2">
                                                <option value="MANAGER">Reporting Manager</option>
                                                <option value="ROLE">Specific Role</option>
                                                <option value="DYNAMIC">Dynamic Entity</option>
                                                <option value="SPECIFIC_USER">Specific User</option>
                                            </select>
                                        </div>

                                        {step.approverType === 'ROLE' && (
                                            <div className="lg:col-span-1">
                                                <label className="text-xs font-medium text-gray-500">Select Role</label>
                                                <select value={step.systemRole} onChange={(e) => formik.setFieldValue(`steps.${index}.systemRole`, e.target.value)} className="mt-1 block w-full rounded-md border border-gray-200 text-sm py-1.5 px-2">
                                                    <option value="">Select Role</option>
                                                    {systemRoles.map(role => (
                                                        <option key={role.value} value={role.value}>{role.label}</option>
                                                    ))}
                                                    {/* Fallback Static Roles if fetch fails */}
                                                    <option value="HR_ADMIN">HR Admin</option>
                                                    <option value="SUPER_ADMIN">Super Admin</option>
                                                </select>
                                            </div>
                                        )}

                                        {step.approverType === 'DYNAMIC' && (
                                            <div className="lg:col-span-1">
                                                <label className="text-xs font-medium text-gray-500">Entity</label>
                                                <select value={step.dynamicEntity} onChange={(e) => formik.setFieldValue(`steps.${index}.dynamicEntity`, e.target.value)} className="mt-1 block w-full rounded-md border border-gray-200 text-sm py-1.5 px-2">
                                                    <option value="DEPT_HEAD">Department Head</option>
                                                    <option value="PROJECT_MANAGER">Project Manager</option>
                                                </select>
                                            </div>
                                        )}

                                        {step.approverType === 'SPECIFIC_USER' && (
                                            <div className="lg:col-span-1">
                                                <label className="text-xs font-medium text-gray-500">Select User</label>
                                                <select
                                                    value={step.specificUserId}
                                                    onChange={(e) => formik.setFieldValue(`steps.${index}.specificUserId`, e.target.value)}
                                                    className="mt-1 block w-full rounded-md border border-gray-200 text-sm py-1.5 px-2"
                                                >
                                                    <option value="">Select User</option>
                                                    {users.map(user => (
                                                        <option key={user.value} value={user.value}>{user.label}</option>
                                                    ))}
                                                </select>
                                                {formik.touched.steps?.[index]?.specificUserId && formik.errors.steps?.[index]?.specificUserId && <div className="text-red-500 text-xs">{formik.errors.steps[index].specificUserId}</div>}
                                            </div>
                                        )}

                                        <div className="lg:col-span-1 flex gap-2">
                                            <div className="flex-1">
                                                <label className="text-xs font-medium text-gray-500">SLA</label>
                                                <input type="number" value={step.slaDuration} onChange={(e) => formik.setFieldValue(`steps.${index}.slaDuration`, e.target.value)} className="mt-1 block w-full rounded-md border border-gray-200 text-sm py-1.5 px-2" />
                                            </div>
                                            <div className="w-24">
                                                <label className="text-xs font-medium text-gray-500">Unit</label>
                                                <select value={step.slaUnit} onChange={(e) => formik.setFieldValue(`steps.${index}.slaUnit`, e.target.value)} className="mt-1 block w-full rounded-md border border-gray-200 text-sm py-1.5 px-2">
                                                    <option value="HOURS">Hours</option>
                                                    <option value="DAYS">Days</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="lg:col-span-1">
                                            <label className="text-xs font-medium text-gray-500">On SLA Breach</label>
                                            <select value={step.slaAction} onChange={(e) => formik.setFieldValue(`steps.${index}.slaAction`, e.target.value)} className="mt-1 block w-full rounded-md border border-gray-200 text-sm py-1.5 px-2">
                                                <option value="NEXT_LEVEL">Escalate to Next Level</option>
                                                <option value="NOTIFY_ONLY">Notify Only</option>
                                                <option value="AUTO_APPROVE">Auto Approve</option>
                                                <option value="AUTO_REJECT">Auto Reject</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button type="button" onClick={addStep} className="mt-4 w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-600 font-medium transition-all flex items-center justify-center gap-2">
                        <Plus className="w-4 h-4" /> Add Next Approval Step
                    </button>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t">
                    <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm font-medium">Cancel</button>
                    <button type="submit" disabled={formik.isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium disabled:opacity-50">
                        {isEditing ? 'Update Workflow' : 'Create Workflow'}
                    </button>
                </div>
            </form>
        </FormikProvider>
    );
}
