'use client';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AlertCircle } from 'lucide-react';
import React from 'react';

export default function PolicyForm({ initialValues, onSubmit, isEditing = false, onCancel }) {
    const getValidationSchema = () => {
        const baseSchema = {
            name: Yup.string().required('Name is required'),
            type: Yup.string().required('Type is required'),
            version: Yup.string().required('Version is required'),
        };

        return Yup.object().shape({
            ...baseSchema,
            shiftStart: Yup.string().when('type', {
                is: 'ATTENDANCE',
                then: (schema) => schema.required('Shift Start is required'),
            }),
            shiftEnd: Yup.string().when('type', {
                is: 'ATTENDANCE',
                then: (schema) => schema.required('Shift End is required'),
            }),
            gracePeriodMinutes: Yup.number().when('type', {
                is: 'ATTENDANCE',
                then: (schema) => schema.required('Grace Period is required').min(0),
            }),
            annualLeaveCount: Yup.number().when('type', {
                is: 'LEAVE',
                then: (schema) => schema.required('Annual Leave Count is required').min(0),
            }),
            sickLeaveCount: Yup.number().when('type', {
                is: 'LEAVE',
                then: (schema) => schema.required('Sick Leave Count is required').min(0),
            }),
        });
    };

    const formik = useFormik({
        initialValues: initialValues || {
            name: '',
            description: '',
            type: 'ATTENDANCE',
            isActive: true,
            version: '1.0',

            // ATTENDANCE
            shiftStart: '09:00',
            shiftEnd: '18:00',
            gracePeriodMinutes: 15,
            halfDayLateEntry: '11:00',
            biometricEnabled: false,

            // LEAVE
            annualLeaveCount: 18,
            sickLeaveCount: 12,
            maxCarryOverDays: 0,
            encashmentAllowed: false,
            probationLeaveAllowed: false,

            // PAYROLL
            salaryCycleStartDay: 1,
            salaryCycleEndDay: 30,
            taxDeductionMethod: 'PROJECTED',
            overtimeCalculationRate: 1.5,
            payslipGenerationDate: 28,

            // EXPENSE
            autoApprovalLimit: 0,
            receiptRequiredAbove: 0,
            travelClassAllowed: 'ECONOMY',
            maxFoodAllowancePerDay: 0,
            reimbursementCycleDays: 7,
        },
        validationSchema: getValidationSchema(),
        enableReinitialize: true,
        onSubmit: async (values) => {
            // Construct clean payload
            const common = {
                name: values.name,
                description: values.description,
                type: values.type,
                isActive: values.isActive,
                version: values.version,
            };

            let specific = {};
            if (values.type === 'ATTENDANCE') {
                specific = {
                    shiftStart: values.shiftStart,
                    shiftEnd: values.shiftEnd,
                    gracePeriodMinutes: values.gracePeriodMinutes,
                    halfDayLateEntry: values.halfDayLateEntry,
                    biometricEnabled: values.biometricEnabled,
                };
            } else if (values.type === 'LEAVE') {
                specific = {
                    annualLeaveCount: values.annualLeaveCount,
                    sickLeaveCount: values.sickLeaveCount,
                    maxCarryOverDays: values.maxCarryOverDays,
                    encashmentAllowed: values.encashmentAllowed,
                    probationLeaveAllowed: values.probationLeaveAllowed,
                };
            } else if (values.type === 'PAYROLL') {
                specific = {
                    salaryCycleStartDay: values.salaryCycleStartDay,
                    salaryCycleEndDay: values.salaryCycleEndDay,
                    taxDeductionMethod: values.taxDeductionMethod,
                    overtimeCalculationRate: values.overtimeCalculationRate,
                    payslipGenerationDate: values.payslipGenerationDate,
                };
            } else if (values.type === 'EXPENSE') {
                specific = {
                    autoApprovalLimit: values.autoApprovalLimit,
                    receiptRequiredAbove: values.receiptRequiredAbove,
                    travelClassAllowed: values.travelClassAllowed,
                    maxFoodAllowancePerDay: values.maxFoodAllowancePerDay,
                    reimbursementCycleDays: values.reimbursementCycleDays,
                };
            }

            await onSubmit({ ...common, ...specific });
        },
    });

    const renderSpecificFields = () => {
        const type = formik.values.type;

        if (type === 'ATTENDANCE') {
            return (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Shift Start</label>
                        <input type="time" {...formik.getFieldProps('shiftStart')} onClick={(e) => e.target.showPicker && e.target.showPicker()} className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 sm:text-sm" />
                        {formik.touched.shiftStart && formik.errors.shiftStart && <div className="text-red-500 text-xs mt-1">{formik.errors.shiftStart}</div>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Shift End</label>
                        <input type="time" {...formik.getFieldProps('shiftEnd')} onClick={(e) => e.target.showPicker && e.target.showPicker()} className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 sm:text-sm" />
                        {formik.touched.shiftEnd && formik.errors.shiftEnd && <div className="text-red-500 text-xs mt-1">{formik.errors.shiftEnd}</div>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Grace Period (mins)</label>
                        <input type="number" {...formik.getFieldProps('gracePeriodMinutes')} className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 sm:text-sm" />
                        {formik.touched.gracePeriodMinutes && formik.errors.gracePeriodMinutes && <div className="text-red-500 text-xs mt-1">{formik.errors.gracePeriodMinutes}</div>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Half Day Late Entry</label>
                        <input type="time" {...formik.getFieldProps('halfDayLateEntry')} onClick={(e) => e.target.showPicker && e.target.showPicker()} className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 sm:text-sm" />
                    </div>
                    <div className="flex items-center sm:col-span-2 pt-4">
                        <input type="checkbox" id="biometricEnabled" checked={formik.values.biometricEnabled} onChange={(e) => formik.setFieldValue('biometricEnabled', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600" />
                        <label htmlFor="biometricEnabled" className="ml-2 block text-sm text-gray-900">Biometric Enabled</label>
                    </div>
                </div>
            );
        } else if (type === 'LEAVE') {
            return (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Annual Leave Count</label>
                        <input type="number" {...formik.getFieldProps('annualLeaveCount')} className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 sm:text-sm" />
                        {formik.touched.annualLeaveCount && formik.errors.annualLeaveCount && <div className="text-red-500 text-xs mt-1">{formik.errors.annualLeaveCount}</div>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Sick Leave Count</label>
                        <input type="number" {...formik.getFieldProps('sickLeaveCount')} className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 sm:text-sm" />
                        {formik.touched.sickLeaveCount && formik.errors.sickLeaveCount && <div className="text-red-500 text-xs mt-1">{formik.errors.sickLeaveCount}</div>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Max Carry Over Days</label>
                        <input type="number" {...formik.getFieldProps('maxCarryOverDays')} className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 sm:text-sm" />
                    </div>
                    <div className="flex flex-col gap-2 sm:col-span-2 pt-2">
                        <div className="flex items-center">
                            <input type="checkbox" id="encashmentAllowed" checked={formik.values.encashmentAllowed} onChange={(e) => formik.setFieldValue('encashmentAllowed', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600" />
                            <label htmlFor="encashmentAllowed" className="ml-2 block text-sm text-gray-900">Encashment Allowed</label>
                        </div>
                        <div className="flex items-center">
                            <input type="checkbox" id="probationLeaveAllowed" checked={formik.values.probationLeaveAllowed} onChange={(e) => formik.setFieldValue('probationLeaveAllowed', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600" />
                            <label htmlFor="probationLeaveAllowed" className="ml-2 block text-sm text-gray-900">Probation Leave Allowed</label>
                        </div>
                    </div>
                </div>
            );
        } else if (type === 'PAYROLL') {
            return (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Salary Cycle Start</label>
                        <input type="number" {...formik.getFieldProps('salaryCycleStartDay')} className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 sm:text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Salary Cycle End</label>
                        <input type="number" {...formik.getFieldProps('salaryCycleEndDay')} className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 sm:text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tax Deduction</label>
                        <select {...formik.getFieldProps('taxDeductionMethod')} className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 sm:text-sm">
                            <option value="PROJECTED">Projected</option>
                            <option value="ACTUAL">Actual</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Overtime Rate (x)</label>
                        <input type="number" step="0.1" {...formik.getFieldProps('overtimeCalculationRate')} className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 sm:text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Payslip Gen Date</label>
                        <input type="number" {...formik.getFieldProps('payslipGenerationDate')} className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 sm:text-sm" />
                    </div>
                </div>
            );
        } else if (type === 'EXPENSE') {
            return (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Auto Approval Limit</label>
                        <input type="number" {...formik.getFieldProps('autoApprovalLimit')} className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 sm:text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Receipt Required Above</label>
                        <input type="number" {...formik.getFieldProps('receiptRequiredAbove')} className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 sm:text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Travel Class</label>
                        <select {...formik.getFieldProps('travelClassAllowed')} className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 sm:text-sm">
                            <option value="ECONOMY">Economy</option>
                            <option value="BUSINESS">Business</option>
                            <option value="FIRST">First</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Max Food Allowance</label>
                        <input type="number" {...formik.getFieldProps('maxFoodAllowancePerDay')} className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 sm:text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Reimbursement Cycle</label>
                        <input type="number" {...formik.getFieldProps('reimbursementCycleDays')} className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 sm:text-sm" />
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-4 text-left">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Policy Name</label>
                    <input
                        type="text"
                        {...formik.getFieldProps('name')}
                        className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                    />
                    {formik.touched.name && formik.errors.name && (
                        <div className="text-red-500 text-xs mt-1">{formik.errors.name}</div>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <select
                        {...formik.getFieldProps('type')}
                        className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                    >
                        <option value="ATTENDANCE">Attendance</option>
                        <option value="LEAVE">Leave</option>
                        <option value="PAYROLL">Payroll</option>
                        <option value="EXPENSE">Expense</option>
                    </select>
                    {formik.touched.type && formik.errors.type && (
                        <div className="text-red-500 text-xs mt-1">{formik.errors.type}</div>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Version</label>
                    <input
                        type="text"
                        {...formik.getFieldProps('version')}
                        className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                    />
                    {formik.touched.version && formik.errors.version && (
                        <div className="text-red-500 text-xs mt-1">{formik.errors.version}</div>
                    )}
                </div>
                <div className="flex items-center sm:pt-6">
                    <input
                        type="checkbox"
                        id="isActive"
                        checked={formik.values.isActive}
                        onChange={(e) => formik.setFieldValue('isActive', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                    />
                    <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">Is Active</label>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                    rows={2}
                    {...formik.getFieldProps('description')}
                    className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                />
            </div>

            <div className="border-t border-gray-100 pt-4 mt-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-blue-500" />
                    Policy Configuration
                </h4>
                {renderSpecificFields()}
            </div>

            <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                <button
                    type="submit"
                    disabled={formik.isSubmitting}
                    className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:col-start-2 disabled:opacity-50"
                >
                    {isEditing ? 'Update Policy' : 'Create Policy'}
                </button>
                <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                    onClick={onCancel}
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}
