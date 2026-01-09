'use client';
import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Award, Filter, Briefcase } from 'lucide-react';
import { companyOrganizationService } from '@/services/super-admin-services/companyOrganization.service';
import ConfirmationDialog from '@/components/common/ConfirmationDialog';
import { toast } from 'react-hot-toast';
import { handleApiError } from '@/utils/errorUtils';

export default function DesignationTab({ companies }) {
    const [designations, setDesignations] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCompanyId, setSelectedCompanyId] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingDesignation, setEditingDesignation] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    const [formData, setFormData] = useState({
        companyId: '',
        departmentId: '', // Required for creation
        name: '',
        code: '',
        level: '',
        grade: '',
        reportingLevel: '',
        minExperience: '',
        maxExperience: ''
    });

    useEffect(() => {
        if (companies.length > 0 && !selectedCompanyId) {
            setSelectedCompanyId(companies[0].id);
        }
    }, [companies]);

    useEffect(() => {
        if (selectedCompanyId) {
            fetchDesignations(selectedCompanyId);
            fetchDepartments(selectedCompanyId);
            setFormData(prev => ({ ...prev, companyId: selectedCompanyId }));
        } else {
            setDesignations([]);
            setDepartments([]);
        }
    }, [selectedCompanyId]);

    const fetchDesignations = async (companyId) => {
        setIsLoading(true);
        try {
            const data = await companyOrganizationService.getDesignations(companyId);
            setDesignations(data.data || data.designations || data);
        } catch (error) {
            console.error('Failed to fetch designations', error);
            toast.error('Failed to fetch designations');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchDepartments = async (companyId) => {
        try {
            const data = await companyOrganizationService.getDepartments(companyId);
            setDepartments(data.data || data.departments || data);
        } catch (error) {
            console.error("Failed to fetch departments", error);
        }
    };

    const resetForm = () => {
        setFormData({
            companyId: selectedCompanyId,
            departmentId: '',
            name: '',
            code: '',
            level: '',
            grade: '',
            reportingLevel: '',
            minExperience: '',
            maxExperience: ''
        });
        setEditingDesignation(null);
        setIsFormOpen(false);
    };

    const handleEdit = (desig) => {
        setEditingDesignation(desig);
        setFormData({
            companyId: desig.companyId,
            departmentId: desig.departmentId || '', // might be missing if API doesn't return it
            name: desig.name || '',
            code: desig.code || '',
            level: desig.level || '',
            grade: desig.grade || '',
            reportingLevel: desig.reportingLevel || '',
            minExperience: desig.minExperience || '',
            maxExperience: desig.maxExperience || ''
        });
        setIsFormOpen(true);
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await companyOrganizationService.deleteDesignation(deleteId, selectedCompanyId);
            toast.success('Designation deleted successfully');
            fetchDesignations(selectedCompanyId);
            setDeleteId(null);
        } catch (error) {
            toast.error(error.message || 'Failed to delete designation');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.departmentId) {
            toast.error("Please select a Department");
            return;
        }

        try {
            const payload = {
                ...formData,
                companyId: parseInt(formData.companyId),
                departmentId: parseInt(formData.departmentId),
                reportingLevel: formData.reportingLevel ? parseInt(formData.reportingLevel) : null,
                minExperience: formData.minExperience ? parseInt(formData.minExperience) : null,
                maxExperience: formData.maxExperience ? parseInt(formData.maxExperience) : null
            };

            if (editingDesignation) {
                await companyOrganizationService.updateDesignation(editingDesignation.id, payload);
                toast.success('Designation updated successfully');
            } else {
                await companyOrganizationService.createDesignation(payload);
                toast.success('Designation created successfully');
            }
            resetForm();
            fetchDesignations(selectedCompanyId);
        } catch (error) {
            handleApiError(error, 'Failed to save designation');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Filter size={18} className="text-gray-500" />
                    <select
                        value={selectedCompanyId}
                        onChange={(e) => setSelectedCompanyId(e.target.value)}
                        className="w-full md:w-64 p-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    >
                        <option value="" disabled>Select Company</option>
                        {companies.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>

                <button
                    onClick={() => {
                        if (!selectedCompanyId) {
                            toast.error("Please select a company first");
                            return;
                        }
                        setIsFormOpen(true)
                    }}
                    disabled={!selectedCompanyId}
                    className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg shadow-md transition-all ${selectedCompanyId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
                        }`}
                >
                    <Plus size={18} />
                    Add Designation
                </button>
            </div>

            {isFormOpen && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-800">
                            {editingDesignation ? 'Edit Designation' : 'Create New Designation'}
                        </h2>
                        <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">Cancel</button>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Fields */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Designation Name</label>
                            <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="form-input w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Senior Software Engineer" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Code</label>
                            <input type="text" value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })} className="form-input w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. SSE" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Department</label>
                            <select required value={formData.departmentId} onChange={e => setFormData({ ...formData, departmentId: e.target.value })} className="form-input w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                                <option value="">Select Department</option>
                                {departments.map(d => (
                                    <option key={d.id} value={d.id}>{d.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Level</label>
                            <input type="text" value={formData.level} onChange={e => setFormData({ ...formData, level: e.target.value })} className="form-input w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. L3" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Grade</label>
                            <input type="text" value={formData.grade} onChange={e => setFormData({ ...formData, grade: e.target.value })} className="form-input w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. A" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Reporting Level</label>
                            <input type="number" value={formData.reportingLevel} onChange={e => setFormData({ ...formData, reportingLevel: e.target.value })} className="form-input w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 2" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Min Exp (Yrs)</label>
                                <input type="number" value={formData.minExperience} onChange={e => setFormData({ ...formData, minExperience: e.target.value })} className="form-input w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Max Exp (Yrs)</label>
                                <input type="number" value={formData.maxExperience} onChange={e => setFormData({ ...formData, maxExperience: e.target.value })} className="form-input w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="10" />
                            </div>
                        </div>


                        <div className="col-span-1 md:col-span-2 flex justify-end gap-3 mt-4">
                            <button type="button" onClick={resetForm} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700">Cancel</button>
                            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md">
                                {editingDesignation ? 'Update Designation' : 'Create Designation'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {isLoading ? (
                    <div className="p-8 text-center text-gray-500">Loading designations...</div>
                ) : designations.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-medium border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3">Name / Code</th>
                                    <th className="px-6 py-3">Department</th>
                                    <th className="px-6 py-3">Level / Grade</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {designations.map((desig) => {
                                    // Find department name if possible
                                    const deptName = departments.find(d => d.id === desig.departmentId)?.name || 'Unknown Dept';

                                    return (
                                        <tr key={desig.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900">{desig.name}</div>
                                                <div className="text-xs text-blue-600">{desig.code}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-gray-600 text-xs">
                                                    <Briefcase size={12} /> {desig.department?.name || deptName}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    {desig.level && <span className="px-2 py-0.5 border border-purple-200 bg-purple-50 text-purple-700 rounded text-xs">{desig.level}</span>}
                                                    {desig.grade && <span className="px-2 py-0.5 border border-orange-200 bg-orange-50 text-orange-700 rounded text-xs">{desig.grade}</span>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => handleEdit(desig)} className="p-1.5 hover:bg-blue-50 text-blue-600 rounded">
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button onClick={() => setDeleteId(desig.id)} className="p-1.5 hover:bg-red-50 text-red-600 rounded">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-12 text-center text-gray-500">
                        <Award className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                        <p>No designations found for this company.</p>
                    </div>
                )}
            </div>

            <ConfirmationDialog
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Delete Designation"
                message="Are you sure you want to delete this designation?"
                confirmText="Delete"
                cancelText="Cancel"
                isDestructive={true}
            />
        </div>
    );
}
