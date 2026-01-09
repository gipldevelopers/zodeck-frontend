'use client';
import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, MapPin, Search, Filter } from 'lucide-react';
import { companyOrganizationService } from '@/services/super-admin-services/companyOrganization.service';
import ConfirmationDialog from '@/components/common/ConfirmationDialog';
import { toast } from 'react-hot-toast';
import { handleApiError } from '@/utils/errorUtils';

export default function LocationTab({ companies }) {
    const [locations, setLocations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCompanyId, setSelectedCompanyId] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingLocation, setEditingLocation] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    const [formData, setFormData] = useState({
        companyId: '',
        name: '',
        code: '',
        address: '',
        city: '',
        state: '',
        country: 'India',
        pincode: '',
        timezone: 'Asia/Kolkata',
        status: 'ACTIVE'
    });

    useEffect(() => {
        if (companies.length > 0 && !selectedCompanyId) {
            setSelectedCompanyId(companies[0].id);
        }
    }, [companies]);

    useEffect(() => {
        if (selectedCompanyId) {
            fetchLocations(selectedCompanyId);
            setFormData(prev => ({ ...prev, companyId: selectedCompanyId }));
        } else {
            setLocations([]);
        }
    }, [selectedCompanyId]);

    const fetchLocations = async (companyId) => {
        setIsLoading(true);
        try {
            const data = await companyOrganizationService.getLocations(companyId);
            setLocations(data.data || data.locations || data);
        } catch (error) {
            console.error('Failed to fetch locations', error);
            toast.error('Failed to fetch locations');
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            companyId: selectedCompanyId,
            name: '',
            code: '',
            address: '',
            city: '',
            state: '',
            country: 'India',
            pincode: '',
            timezone: 'Asia/Kolkata',
            status: 'ACTIVE'
        });
        setEditingLocation(null);
        setIsFormOpen(false);
    };

    const handleEdit = (location) => {
        setEditingLocation(location);
        setFormData({
            companyId: location.companyId,
            name: location.name || '',
            code: location.code || '',
            address: location.address || '',
            city: location.city || '',
            state: location.state || '',
            country: location.country || 'India',
            pincode: location.pincode || '',
            timezone: location.timezone || 'Asia/Kolkata',
            status: location.status || 'ACTIVE'
        });
        setIsFormOpen(true);
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await companyOrganizationService.deleteLocation(deleteId, selectedCompanyId);
            toast.success('Location deleted successfully');
            fetchLocations(selectedCompanyId);
            setDeleteId(null);
        } catch (error) {
            toast.error(error.message || 'Failed to delete location');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingLocation) {
                await companyOrganizationService.updateLocation(editingLocation.id, formData);
                toast.success('Location updated successfully');
            } else {
                await companyOrganizationService.createLocation(formData);
                toast.success('Location created successfully');
            }
            resetForm();
            fetchLocations(selectedCompanyId);
        } catch (error) {
            handleApiError(error, 'Failed to save location');
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
                    Add Location
                </button>
            </div>

            {isFormOpen && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-800">
                            {editingLocation ? 'Edit Location' : 'Create New Location'}
                        </h2>
                        <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">Cancel</button>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Fields */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Location Name</label>
                            <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="form-input w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Bangalore HQ" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Location Code</label>
                            <input type="text" required value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })} className="form-input w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. BLR-01" />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-sm font-medium text-gray-700">Address</label>
                            <input type="text" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className="form-input w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">City</label>
                            <input type="text" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} className="form-input w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">State</label>
                            <input type="text" value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value })} className="form-input w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Pincode</label>
                            <input type="text" value={formData.pincode} onChange={e => setFormData({ ...formData, pincode: e.target.value })} className="form-input w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Timezone</label>
                            <select value={formData.timezone} onChange={e => setFormData({ ...formData, timezone: e.target.value })} className="form-input w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                                <option value="Asia/Kolkata">Asia/Kolkata</option>
                                <option value="UTC">UTC</option>
                                <option value="America/New_York">America/New_York</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Status</label>
                            <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="form-input w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                                <option value="ACTIVE">Active</option>
                                <option value="INACTIVE">Inactive</option>
                            </select>
                        </div>

                        <div className="col-span-1 md:col-span-2 flex justify-end gap-3 mt-4">
                            <button type="button" onClick={resetForm} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700">Cancel</button>
                            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md">
                                {editingLocation ? 'Update Location' : 'Create Location'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Locations List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {isLoading ? (
                    <div className="p-8 text-center text-gray-500">Loading locations...</div>
                ) : locations.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-medium border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3">Name / Code</th>
                                    <th className="px-6 py-3">City / State</th>
                                    <th className="px-6 py-3">Pincode</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {locations.map((loc) => (
                                    <tr key={loc.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{loc.name}</div>
                                            <div className="text-xs text-blue-600">{loc.code}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>{loc.city}</div>
                                            <div className="text-xs text-gray-500">{loc.state}</div>
                                        </td>
                                        <td className="px-6 py-4">{loc.pincode}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${loc.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {loc.status || 'ACTIVE'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => handleEdit(loc)} className="p-1.5 hover:bg-blue-50 text-blue-600 rounded">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button onClick={() => setDeleteId(loc.id)} className="p-1.5 hover:bg-red-50 text-red-600 rounded">
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
                        <MapPin className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                        <p>No locations found for this company.</p>
                    </div>
                )}
            </div>

            <ConfirmationDialog
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Delete Location"
                message="Are you sure you want to delete this location? Associated data might be affected."
                confirmText="Delete"
                cancelText="Cancel"
                isDestructive={true}
            />
        </div>
    );
}
