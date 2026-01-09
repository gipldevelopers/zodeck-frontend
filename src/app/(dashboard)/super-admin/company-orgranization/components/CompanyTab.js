'use client';
import { useState } from 'react';
import { Plus, Edit2, Trash2, Globe, Phone, Mail, Building, MapPin } from 'lucide-react';
import { companyOrganizationService } from '@/services/super-admin-services/companyOrganization.service';
import ConfirmationDialog from '@/components/common/ConfirmationDialog';
import { toast } from 'react-hot-toast';
import { handleApiError } from '@/utils/errorUtils';

export default function CompanyTab({ companies = [], onRefresh }) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCompany, setEditingCompany] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        companyCode: '',
        subdomain: '',
        contactEmail: '',
        phone: '',
        legalEntityName: '',
        industryType: '',
        country: '',
        plan: 'STANDARD',
        address: '',
        website: '',
        maxUsers: '',
        maxEmployees: ''
    });

    const resetForm = () => {
        setFormData({
            name: '',
            companyCode: '',
            subdomain: '',
            contactEmail: '',
            phone: '',
            legalEntityName: '',
            industryType: '',
            country: '',
            plan: 'STANDARD',
            address: '',
            website: '',
            maxUsers: '',
            maxEmployees: ''
        });
        setEditingCompany(null);
        setIsFormOpen(false);
    };

    const handleEdit = (company) => {
        setEditingCompany(company);
        setFormData({
            name: company.name || '',
            companyCode: company.companyCode || '',
            subdomain: company.subdomain || '',
            contactEmail: company.contactEmail || '',
            phone: company.phone || '',
            legalEntityName: company.legalEntityName || '',
            industryType: company.industryType || '',
            country: company.country || '',
            plan: company.plan || 'STANDARD',
            address: company.address || '',
            website: company.website || '',
            maxUsers: company.maxUsers || '',
            maxEmployees: company.maxEmployees || ''
        });
        setIsFormOpen(true);
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await companyOrganizationService.deleteCompany(deleteId);
            toast.success('Company deleted successfully');
            onRefresh();
            setDeleteId(null);
        } catch (error) {
            toast.error(error.message || 'Failed to delete company');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCompany) {
                // Update
                await companyOrganizationService.updateCompany(editingCompany.id, formData);
                toast.success('Company updated successfully');
            } else {
                // Create
                await companyOrganizationService.createCompany(formData);
                toast.success('Company created successfully');
            }
            resetForm();
            onRefresh();
        } catch (error) {
            handleApiError(error, 'Failed to save company');
        }
    };

    if (isFormOpen) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">
                        {editingCompany ? 'Edit Company' : 'Create New Company'}
                    </h2>
                    <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                        Cancel
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Company Name</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Company Code</label>
                        <input
                            type="text"
                            required
                            value={formData.companyCode}
                            onChange={(e) => setFormData({ ...formData, companyCode: e.target.value })}
                            disabled={!!editingCompany}
                            className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${editingCompany ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Subdomain</label>
                        <input
                            type="text"
                            required
                            value={formData.subdomain}
                            onChange={(e) => setFormData({ ...formData, subdomain: e.target.value })}
                            disabled={!!editingCompany}
                            className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${editingCompany ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Legal Entity Name</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            value={formData.legalEntityName}
                            onChange={(e) => setFormData({ ...formData, legalEntityName: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Contact Email</label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            value={formData.contactEmail}
                            onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Phone</label>
                        <input
                            type="tel"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Industry Type</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            value={formData.industryType}
                            onChange={(e) => setFormData({ ...formData, industryType: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Country</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            value={formData.country}
                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Address</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Website</label>
                        <input
                            type="url"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            value={formData.website}
                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Max Users</label>
                        <input
                            type="number"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            value={formData.maxUsers}
                            onChange={(e) => setFormData({ ...formData, maxUsers: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Max Employees</label>
                        <input
                            type="number"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            value={formData.maxEmployees}
                            onChange={(e) => setFormData({ ...formData, maxEmployees: e.target.value })}
                        />
                    </div>

                    <div className="col-span-1 md:col-span-2 flex justify-end gap-3 mt-4">
                        <button
                            type="button"
                            onClick={resetForm}
                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 shadow-md transform transition active:scale-95"
                        >
                            {editingCompany ? 'Update Company' : 'Create Company'}
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">
                    Registered Companies <span className="text-sm font-normal text-gray-500 ml-2">({Array.isArray(companies) ? companies.length : 0})</span>
                </h3>
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition-all"
                >
                    <Plus size={18} />
                    Add Company
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {companies.map((company) => (
                    <div
                        key={company.id}
                        className="group relative bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all duration-300"
                    >
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => handleEdit(company)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                                title="Edit"
                            >
                                <Edit2 size={16} />
                            </button>
                            <button
                                onClick={() => setDeleteId(company.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                                title="Delete"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>

                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                                {company.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 line-clamp-1">{company.name}</h4>
                                <p className="text-sm text-gray-500">{company.legalEntityName}</p>
                                <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-xs font-medium text-gray-600 rounded">
                                    {company.companyCode}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <Globe size={14} className="text-gray-400" />
                                <span>{company.subdomain}.ghr.com</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail size={14} className="text-gray-400" />
                                <span className="truncate">{company.contactEmail}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone size={14} className="text-gray-400" />
                                <span>{company.phone || 'N/A'}</span>
                            </div>
                            {company.country && (
                                <div className="flex items-center gap-2">
                                    <MapPin size={14} className="text-gray-400" />
                                    <span>{company.country}</span>
                                </div>
                            )}
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
                            <span>Plan: <b className="text-gray-700">{company.plan || 'STANDARD'}</b></span>
                            <span className="uppercase">{company.industryType || 'General'}</span>
                        </div>
                    </div>
                ))}

                {companies.length === 0 && (
                    <div className="col-span-full py-12 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                        <Building className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                        <p>No companies found. Create one to get started.</p>
                    </div>
                )}
            </div>

            <ConfirmationDialog
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Delete Company"
                message="Are you sure you want to delete this company? This action cannot be undone and will delete all associated data."
                confirmText="Delete"
                cancelText="Cancel"
                isDestructive={true}
            />
        </div>
    );
}
