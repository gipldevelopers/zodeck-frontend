'use client';
import { useState, useEffect } from 'react';
import { Building2, MapPin, Users, Award, LayoutGrid } from 'lucide-react';
import { companyOrganizationService } from '@/services/super-admin-services/companyOrganization.service';
import CompanyTab from './components/CompanyTab';
import LocationTab from './components/LocationTab';
import DepartmentTab from './components/DepartmentTab';
import DesignationTab from './components/DesignationTab';
import { Toaster } from 'react-hot-toast';

export default function CompanyOrganizationPage() {
    const [activeTab, setActiveTab] = useState('company');
    const [companies, setCompanies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchCompanies = async () => {
        setIsLoading(true);
        try {
            const data = await companyOrganizationService.getAllCompanies();
            // Robustly handle different response structures
            if (Array.isArray(data)) {
                setCompanies(data);
            } else if (data.companies && Array.isArray(data.companies)) {
                setCompanies(data.companies);
            } else if (data.data && Array.isArray(data.data)) {
                setCompanies(data.data);
            } else {
                console.warn('Unexpected API response format for companies:', data);
                setCompanies([]);
            }
        } catch (error) {
            console.error('Failed to fetch companies', error);
            setCompanies([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    const tabs = [
        { id: 'company', label: 'Company Details', icon: Building2 },
        { id: 'locations', label: 'Locations & Branches', icon: MapPin },
        { id: 'departments', label: 'Departments', icon: Users },
        { id: 'designations', label: 'Designations', icon: Award },
    ];

    return (
        <div className="space-y-6">
            <Toaster position="top-right" />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <LayoutGrid className="text-blue-600" />
                        Company & Organization Setup
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Manage companies, legal entities, locations, departments, and designations.
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1">
                <div className="flex overflow-x-auto gap-1 p-1">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                  flex-1 min-w-[150px] flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200
                  ${isActive
                                        ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-200'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                `}
                            >
                                <Icon size={18} className={isActive ? 'text-blue-600' : 'text-gray-400'} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Content */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {activeTab === 'company' && (
                    <CompanyTab companies={companies} onRefresh={fetchCompanies} />
                )}
                {activeTab === 'locations' && (
                    <LocationTab companies={companies} />
                )}
                {activeTab === 'departments' && (
                    <DepartmentTab companies={companies} />
                )}
                {activeTab === 'designations' && (
                    <DesignationTab companies={companies} />
                )}
            </div>
        </div>
    );
}
