'use client';
import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Briefcase, Filter, Users } from 'lucide-react';
import { companyOrganizationService } from '@/services/super-admin-services/companyOrganization.service';
import ConfirmationDialog from '@/components/common/ConfirmationDialog';
import { toast } from 'react-hot-toast';
import { handleApiError } from '@/utils/errorUtils';

export default function DepartmentTab({ companies }) {
    const [departments, setDepartments] = useState([]);
    const [locations, setLocations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCompanyId, setSelectedCompanyId] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingDepartment, setEditingDepartment] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    const [formData, setFormData] = useState({
        companyId: '',
        name: '',
        code: '',
        headOfDepartment: '',
        phone: '',
        email: '',
        locationIds: []
    });

    useEffect(() => {
        if (companies.length > 0 && !selectedCompanyId) {
            setSelectedCompanyId(companies[0].id);
        }
    }, [companies]);

    useEffect(() => {
        if (selectedCompanyId) {
            fetchDepartments(selectedCompanyId);
            fetchLocations(selectedCompanyId);
            setFormData(prev => ({ ...prev, companyId: selectedCompanyId }));
        } else {
            setDepartments([]);
            setLocations([]);
        }
    }, [selectedCompanyId]);

    const fetchDepartments = async (companyId) => {
        setIsLoading(true);
        try {
            const data = await companyOrganizationService.getDepartments(companyId);
            setDepartments(data.data || data.departments || data);
        } catch (error) {
            console.error('Failed to fetch departments', error);
            toast.error('Failed to fetch departments');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchLocations = async (companyId) => {
        try {
            const data = await companyOrganizationService.getLocations(companyId);
            setLocations(data.data || data.locations || data);
        } catch (error) {
            // quiet fail or log
            console.error("Failed to load locations for department form", error);
        }
    };

    const resetForm = () => {
        setFormData({
            companyId: selectedCompanyId,
            name: '',
            code: '',
            headOfDepartment: '',
            phone: '',
            email: '',
            locationIds: []
        });
        setEditingDepartment(null);
        setIsFormOpen(false);
    };

    const handleEdit = (dept) => {
        setEditingDepartment(dept);
        // map data. existing locationIds might be objects or ids depending on API
        // assuming ids for now based on cURL
        setFormData({
            companyId: dept.companyId,
            name: dept.name || '',
            code: dept.code || '',
            headOfDepartment: dept.headOfDepartment || '',
            phone: dept.phone || '',
            email: dept.email || '',
            locationIds: dept.locationIds || []
        });
        setIsFormOpen(true);
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await companyOrganizationService.deleteDepartment(deleteId, selectedCompanyId);
            toast.success('Department deleted successfully');
            fetchDepartments(selectedCompanyId);
            setDeleteId(null);
        } catch (error) {
            toast.error(error.message || 'Failed to delete department');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                // Ensure locationIds is an array of integers if API expects it
                locationIds: formData.locationIds.map(Number)
            };

            if (editingDepartment) {
                await companyOrganizationService.updateDepartment(editingDepartment.id, payload);
                toast.success('Department updated successfully');
            } else {
                await companyOrganizationService.createDepartment(payload);
                toast.success('Department created successfully');
            }
            resetForm();
            fetchDepartments(selectedCompanyId);
        } catch (error) {
            handleApiError(error, 'Failed to save department');
        }
    };

    const toggleLocation = (locId) => {
        const current = formData.locationIds;
        if (current.includes(locId)) {
            setFormData({ ...formData, locationIds: current.filter(id => id !== locId) });
        } else {
            setFormData({ ...formData, locationIds: [...current, locId] });
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
                    Add Department
                </button>
            </div>

            {
                isFormOpen && (
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-800">
                                {editingDepartment ? 'Edit Department' : 'Create New Department'}
                            </h2>
                            <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">Cancel</button>
                        </div>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Fields */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Department Name</label>
                                <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="form-input w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Engineering" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Department Code</label>
                                <input type="text" required value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })} className="form-input w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. ENG" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Head of Department</label>
                                <input type="text" value={formData.headOfDepartment} onChange={e => setFormData({ ...formData, headOfDepartment: e.target.value })} className="form-input w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Full Name" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Phone</label>
                                <input type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="form-input w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="1234567890" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Email</label>
                                <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="form-input w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="email@company.com" />
                            </div>

                            {/* Locations Multi-select */}
                            <div className="col-span-1 md:col-span-2 space-y-2">
                                <label className="text-sm font-medium text-gray-700">Associated Locations</label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 border p-4 rounded-lg bg-gray-50/50 max-h-48 overflow-y-auto">
                                    {locations.length > 0 ? locations.map(loc => (
                                        <label key={loc.id} className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded transition-colors">
                                            <input
                                                type="checkbox"
                                                checked={formData.locationIds.includes(loc.id)}
                                                onChange={() => toggleLocation(loc.id)}
                                                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                            />
                                            <span className="text-sm text-gray-700">{loc.name} <span className="text-xs text-gray-400">({loc.code})</span></span>
                                        </label>
                                    )) : (
                                        <div className="col-span-full text-sm text-gray-400 italic">No locations found. Add locations first.</div>
                                    )}
                                </div>
                            </div>

                            <div className="col-span-1 md:col-span-2 flex justify-end gap-3 mt-4">
                                <button type="button" onClick={resetForm} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md">
                                    {editingDepartment ? 'Update Department' : 'Create Department'}
                                </button>
                            </div>
                        </form>
                    </div>
                )
            }

            {/* List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {isLoading ? (
                    <div className="p-8 text-center text-gray-500">Loading departments...</div>
                ) : departments.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-medium border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3">Name / Code</th>
                                    <th className="px-6 py-3">Head of Dept</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {departments
                                    .map((dept) => (
                                        <tr key={dept.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900">{dept.name}</div>
                                                <div className="text-xs text-blue-600">{dept.code}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                                                        {dept.headOfDepartment ? dept.headOfDepartment.charAt(0) : <Users size={12} />}
                                                    </div>
                                                    <span>{dept.headOfDepartment || 'N/A'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => handleEdit(dept)} className="p-1.5 hover:bg-blue-50 text-blue-600 rounded">
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button onClick={() => setDeleteId(dept.id)} className="p-1.5 hover:bg-red-50 text-red-600 rounded">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-12 text-center text-gray-500">
                        <Briefcase className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                        <p>No departments found for this company.</p>
                    </div>
                )}
            </div>

            <ConfirmationDialog
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Delete Department"
                message="Are you sure you want to delete this department?"
                confirmText="Delete"
                cancelText="Cancel"
                isDestructive={true}
            />
        </div >
    );
}
