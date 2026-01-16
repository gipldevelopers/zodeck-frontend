'use client';

import { useState, useEffect } from 'react';
import Breadcrumb from '@/components/common/Breadcrumb';
import userService from '@/services/user-services/user.service';
import { toast } from 'react-hot-toast';
import HRMSLoader from '@/components/common/HRMSLoader';
import { UserCircle, Mail, Phone, MapPin, Calendar, Building } from 'lucide-react';

// Define allowed fields for update
const ALLOWED_UPDATE_FIELDS = [
  'phone', 'personalEmail', 'dateOfBirth', 'gender', 'maritalStatus',
  'bloodGroup', 'nationality', 'religion', 'birthPlace',
  'permanentAddress', 'currentAddress', 'city', 'state', 'pincode', 'country',
  'emergencyContactName', 'emergencyContactRelation', 'emergencyContactPhone',
  'bankName', 'accountNumber', 'ifscCode', 'accountHolderName', 'branchName',
  'accountType', 'panNumber', 'aadhaarNumber'
];

export default function MasterAdminProfilePage() {
  const [activeTab, setActiveTab] = useState('personal');
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await userService.getProfile();

      if (response.success) {
        const transformedData = transformApiData(response.data);
        setProfileData(transformedData);
      } else {
        throw new Error(response.message || 'Failed to load profile');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to load profile data');
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const transformApiData = (apiData) => {
    const employee = apiData.employee || {};

    return {
      personal: {
        firstName: employee.firstName || '',
        lastName: employee.lastName || '',
        email: employee.email || apiData.email || '',
        personalEmail: employee.personalEmail || '',
        phone: employee.phone || '',
        dateOfBirth: employee.dateOfBirth ? formatDateForInput(employee.dateOfBirth) : '',
        gender: employee.gender === 'MALE' ? 'Male' :
          employee.gender === 'FEMALE' ? 'Female' : 'Other',
        maritalStatus: employee.maritalStatus || '',
        bloodGroup: employee.bloodGroup || '',
        nationality: employee.nationality || '',
        religion: employee.religion || '',
        birthPlace: employee.birthPlace || '',
        permanentAddress: employee.permanentAddress || '',
        currentAddress: employee.currentAddress || '',
        city: employee.city || '',
        state: employee.state || '',
        pincode: employee.pincode || '',
        country: employee.country || '',
        emergencyContactName: employee.emergencyContactName || '',
        emergencyContactRelation: employee.emergencyContactRelation || '',
        emergencyContactPhone: employee.emergencyContactPhone || ''
      },
      employment: {
        employeeId: employee.employeeId || '',
        designation: employee.designation?.name || '',
        department: employee.department?.name || '',
        joiningDate: employee.joiningDate ? formatDateForInput(employee.joiningDate) : '',
        employmentType: employee.employmentType || '',
        workLocation: employee.workLocation || '',
      },
      bank: {
        bankName: employee.bankName || '',
        accountNumber: employee.accountNumber || '',
        accountType: employee.accountType || 'SAVINGS',
        ifscCode: employee.ifscCode || '',
        accountHolderName: employee.accountHolderName || '',
        branchName: employee.branchName || '',
        panNumber: employee.panNumber || '',
        aadhaarNumber: employee.aadhaarNumber || '',
      }
    };
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const handleUpdate = async (tab, formData) => {
    try {
      setUpdating(true);
      const filteredData = {};
      
      Object.keys(formData).forEach(key => {
        if (ALLOWED_UPDATE_FIELDS.includes(key) && formData[key] !== undefined) {
          filteredData[key] = formData[key];
        }
      });

      const response = await userService.updateProfile(filteredData);

      if (response.success) {
        toast.success('Profile updated successfully');
        await fetchProfile();
      } else {
        throw new Error(response.message || 'Failed to update profile');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
      console.error('Error updating profile:', error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <HRMSLoader />;
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 p-8">
        <div className="text-center text-gray-500">Failed to load profile data</div>
      </div>
    );
  }

  const tabs = [
    { id: 'personal', label: 'Personal Information', icon: UserCircle },
    { id: 'employment', label: 'Employment Details', icon: Building },
    { id: 'bank', label: 'Bank Details', icon: Building },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        <Breadcrumb 
          items={[
            { label: 'Master Admin', href: '/master-admin/dashboard' },
            { label: 'Profile', href: '/master-admin/profile' }
          ]}
        />

        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-6">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-3xl font-bold">
              {profileData.personal.firstName.charAt(0).toUpperCase()}
              {profileData.personal.lastName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {profileData.personal.firstName} {profileData.personal.lastName}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">{profileData.personal.email}</p>
              <div className="flex items-center gap-4 mt-3">
                <span className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Phone size={16} />
                  {profileData.personal.phone || 'N/A'}
                </span>
                <span className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Building size={16} />
                  Master Admin
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex space-x-1 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-4 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'personal' && (
              <PersonalInfoTab 
                data={profileData.personal} 
                onUpdate={(data) => handleUpdate('personal', data)}
                updating={updating}
              />
            )}
            {activeTab === 'employment' && (
              <EmploymentTab data={profileData.employment} />
            )}
            {activeTab === 'bank' && (
              <BankTab 
                data={profileData.bank} 
                onUpdate={(data) => handleUpdate('bank', data)}
                updating={updating}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Personal Info Tab Component
const PersonalInfoTab = ({ data, onUpdate, updating }) => {
  const [formData, setFormData] = useState(data);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">First Name</label>
          <input
            type="text"
            value={formData.firstName}
            disabled
            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
          <input
            type="text"
            value={formData.lastName}
            disabled
            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
          <input
            type="email"
            value={formData.email}
            disabled
            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Personal Email</label>
          <input
            type="email"
            value={formData.personalEmail}
            onChange={(e) => setFormData({ ...formData, personalEmail: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date of Birth</label>
          <input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={updating}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
        >
          {updating ? 'Updating...' : 'Update Information'}
        </button>
      </div>
    </form>
  );
};

// Employment Tab Component
const EmploymentTab = ({ data }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Employee ID</label>
          <input
            type="text"
            value={data.employeeId}
            disabled
            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Designation</label>
          <input
            type="text"
            value={data.designation}
            disabled
            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Department</label>
          <input
            type="text"
            value={data.department}
            disabled
            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Joining Date</label>
          <input
            type="text"
            value={data.joiningDate}
            disabled
            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-500"
          />
        </div>
      </div>
    </div>
  );
};

// Bank Tab Component
const BankTab = ({ data, onUpdate, updating }) => {
  const [formData, setFormData] = useState(data);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bank Name</label>
          <input
            type="text"
            value={formData.bankName}
            onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Account Number</label>
          <input
            type="text"
            value={formData.accountNumber}
            onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">IFSC Code</label>
          <input
            type="text"
            value={formData.ifscCode}
            onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Account Holder Name</label>
          <input
            type="text"
            value={formData.accountHolderName}
            onChange={(e) => setFormData({ ...formData, accountHolderName: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Branch Name</label>
          <input
            type="text"
            value={formData.branchName}
            onChange={(e) => setFormData({ ...formData, branchName: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Account Type</label>
          <select
            value={formData.accountType}
            onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          >
            <option value="SAVINGS">Savings</option>
            <option value="CURRENT">Current</option>
          </select>
        </div>
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={updating}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
        >
          {updating ? 'Updating...' : 'Update Bank Details'}
        </button>
      </div>
    </form>
  );
};
