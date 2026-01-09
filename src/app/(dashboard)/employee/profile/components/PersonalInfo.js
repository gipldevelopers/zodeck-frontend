"use client";

import { useState } from 'react';
import { Save, Info } from 'lucide-react';

export default function PersonalInfo({ data, onUpdate, updating }) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(data);

    // Fields that are NOT allowed to be edited
    const READONLY_FIELDS = ['firstName', 'lastName', 'email'];

    // Fields that ARE allowed to be edited (from the allowed list)
    const editableFields = [
        { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: 'Enter phone number' },
        { name: 'personalEmail', label: 'Personal Email', type: 'email', placeholder: 'Enter personal email' },
        { name: 'dateOfBirth', label: 'Date of Birth', type: 'date', placeholder: '' },
        { name: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Other'] },
        { name: 'maritalStatus', label: 'Marital Status', type: 'text', placeholder: 'Enter marital status' },
        { name: 'bloodGroup', label: 'Blood Group', type: 'text', placeholder: 'Enter blood group' },
        { name: 'nationality', label: 'Nationality', type: 'text', placeholder: 'Enter nationality' },
        { name: 'religion', label: 'Religion', type: 'text', placeholder: 'Enter religion' },
        { name: 'birthPlace', label: 'Birth Place', type: 'text', placeholder: 'Enter birth place' },
        { name: 'height', label: 'Height (cm)', type: 'number', placeholder: 'Enter height' },
        { name: 'weight', label: 'Weight (kg)', type: 'number', placeholder: 'Enter weight' },
        { name: 'permanentAddress', label: 'Permanent Address', type: 'textarea', placeholder: 'Enter permanent address', rows: 3 },
        { name: 'currentAddress', label: 'Current Address', type: 'textarea', placeholder: 'Enter current address', rows: 3 },
        { name: 'city', label: 'City', type: 'text', placeholder: 'Enter city' },
        { name: 'state', label: 'State', type: 'text', placeholder: 'Enter state' },
        { name: 'pincode', label: 'Pincode', type: 'text', placeholder: 'Enter pincode' },
        { name: 'country', label: 'Country', type: 'text', placeholder: 'Enter country' },
        { name: 'emergencyContactName', label: 'Emergency Contact Name', type: 'text', placeholder: 'Enter emergency contact name' },
        { name: 'emergencyContactRelation', label: 'Emergency Contact Relation', type: 'text', placeholder: 'Enter relationship' },
        { name: 'emergencyContactPhone', label: 'Emergency Contact Phone', type: 'tel', placeholder: 'Enter emergency contact phone' }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await onUpdate(formData);
            setIsEditing(false);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleCancel = () => {
        setFormData(data);
        setIsEditing(false);
    };

    const isFieldEditable = (fieldName) => {
        return !READONLY_FIELDS.includes(fieldName) && isEditing;
    };

    const renderField = (field) => {
        const commonProps = {
            name: field.name,
            value: formData[field.name] || '',
            onChange: handleChange,
            disabled: !isFieldEditable(field.name),
            className: `w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white ${isFieldEditable(field.name)
                    ? 'border-gray-300'
                    : 'border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700'
                } disabled:bg-gray-100 disabled:dark:bg-gray-800 disabled:cursor-not-allowed`,
            placeholder: field.placeholder
        };

        if (field.type === 'textarea') {
            return (
                <textarea
                    {...commonProps}
                    rows={field.rows || 3}
                />
            );
        } else if (field.type === 'select') {
            return (
                <select {...commonProps}>
                    <option value="">Select {field.label}</option>
                    {field.options?.map(option => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
            );
        } else {
            return (
                <input
                    type={field.type}
                    {...commonProps}
                />
            );
        }
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Personal Information</h2>
                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Edit Information
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <button
                            onClick={handleCancel}
                            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={updating}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {updating ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save size={16} />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>

            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-start gap-2">
                    <Info size={16} className="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                        Only specific fields are editable. Contact HR for changes to non-editable information.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information Section */}
                <div>
                    <h3 className="text-md font-medium text-gray-800 dark:text-white mb-4">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Read-only fields */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                First Name <span className="text-gray-500 text-xs">(Read-only)</span>
                            </label>
                            <input
                                type="text"
                                value={formData.firstName}
                                disabled
                                className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Last Name <span className="text-gray-500 text-xs">(Read-only)</span>
                            </label>
                            <input
                                type="text"
                                value={formData.lastName}
                                disabled
                                className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white cursor-not-allowed"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Company Email <span className="text-gray-500 text-xs">(Read-only)</span>
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                disabled
                                className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white cursor-not-allowed"
                            />
                        </div>

                        {/* Editable fields from the allowed list */}
                        {editableFields.slice(0, 6).map((field) => (
                            <div key={field.name}>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {field.label}
                                    {isFieldEditable(field.name) && (
                                        <span className="text-green-600 text-xs ml-2">(Editable)</span>
                                    )}
                                </label>
                                {renderField(field)}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Address Information Section */}
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-md font-medium text-gray-800 dark:text-white mb-4">Address Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {editableFields.slice(12, 18).map((field) => (
                            <div key={field.name} className={field.name.includes('Address') ? 'md:col-span-2' : ''}>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {field.label}
                                    {isFieldEditable(field.name) && (
                                        <span className="text-green-600 text-xs ml-2">(Editable)</span>
                                    )}
                                </label>
                                {renderField(field)}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Emergency Contact Section */}
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-md font-medium text-gray-800 dark:text-white mb-4">Emergency Contact</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {editableFields.slice(18).map((field) => (
                            <div key={field.name}>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {field.label}
                                    {isFieldEditable(field.name) && (
                                        <span className="text-green-600 text-xs ml-2">(Editable)</span>
                                    )}
                                </label>
                                {renderField(field)}
                            </div>
                        ))}
                    </div>
                </div>
            </form>
        </div>
    );
}
