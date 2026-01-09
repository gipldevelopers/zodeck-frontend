// src/app/(dashboard)/hr/profile/page.js
"use client";

import { useState, useEffect } from 'react';
import Breadcrumb from '@/components/common/Breadcrumb';
import ProfileHeader from './components/ProfileHeader';
import ProfileTabs from './components/ProfileTabs';
import userService from '@/services/user-services/user.service';
import { toast } from 'react-hot-toast';

// Define allowed fields for update
const ALLOWED_UPDATE_FIELDS = [
  'phone', 'personalEmail', 'dateOfBirth', 'gender', 'maritalStatus',
  'bloodGroup', 'nationality', 'religion', 'birthPlace',
  'permanentAddress', 'currentAddress', 'city', 'state', 'pincode', 'country',
  'emergencyContactName', 'emergencyContactRelation', 'emergencyContactPhone',
  'bankName', 'accountNumber', 'ifscCode', 'accountHolderName', 'branchName',
  'accountType', 'panNumber', 'aadhaarNumber'
];

export default function ProfilePage() {
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
        personalEmail: employee.personalEmail || '', // Added personalEmail
        phone: employee.phone || '',
        dateOfBirth: employee.dateOfBirth ? formatDateForInput(employee.dateOfBirth) : '',
        gender: employee.gender === 'MALE' ? 'Male' :
          employee.gender === 'FEMALE' ? 'Female' : 'Other',
        maritalStatus: employee.maritalStatus || '',
        bloodGroup: employee.bloodGroup || '',
        nationality: employee.nationality || '',
        religion: employee.religion || '',
        birthPlace: employee.birthPlace || '',
        height: employee.height ? String(employee.height) : '',
        weight: employee.weight ? String(employee.weight) : '',
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
        manager: employee.reportingManager ?
          `${employee.reportingManager.firstName || ''} ${employee.reportingManager.lastName || ''}`.trim() : '',
        managerDesignation: employee.reportingManager?.designation?.name || ''
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
        pfNumber: employee.pfNumber || '',
        uanNumber: employee.uanNumber || '',
        esiNumber: employee.esiNumber || ''
      },
      documents: employee.documents || [],
      settings: {
        emailNotifications: true,
        smsNotifications: false,
        twoFactorAuth: true,
        language: 'English',
        timezone: apiData.company?.timezone || 'UTC'
      },
      originalApiData: apiData
    };
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const handleUpdateProfile = async (section, data) => {
    try {
      setUpdating(true);

      // Filter only allowed fields
      let updatePayload = { employee: {} };

      if (section === 'personal') {
        // Map form data to API field names
        const mappedData = {
          phone: data.phone || null,
          personalEmail: data.personalEmail || null,
          dateOfBirth: data.dateOfBirth ? formatDateForAPI(data.dateOfBirth) : null,
          gender: data.gender === 'Male' ? 'MALE' :
            data.gender === 'Female' ? 'FEMALE' :
              data.gender.toUpperCase() || null,
          maritalStatus: data.maritalStatus || null,
          bloodGroup: data.bloodGroup || null,
          nationality: data.nationality || null,
          religion: data.religion || null,
          birthPlace: data.birthPlace || null,
          height: data.height ? parseInt(data.height) : null,
          weight: data.weight ? parseInt(data.weight) : null,
          permanentAddress: data.permanentAddress || null,
          currentAddress: data.currentAddress || null,
          city: data.city || null,
          state: data.state || null,
          pincode: data.pincode || null,
          country: data.country || null,
          emergencyContactName: data.emergencyContactName || null,
          emergencyContactRelation: data.emergencyContactRelation || null,
          emergencyContactPhone: data.emergencyContactPhone || null
        };

        // Only include allowed fields
        Object.keys(mappedData).forEach(key => {
          if (ALLOWED_UPDATE_FIELDS.includes(key) && mappedData[key] !== undefined) {
            updatePayload.employee[key] = mappedData[key];
          }
        });
      } else if (section === 'bank') {
        const mappedData = {
          bankName: data.bankName || null,
          accountNumber: data.accountNumber || null,
          ifscCode: data.ifscCode || null,
          accountHolderName: data.accountHolderName || null,
          branchName: data.branchName || null,
          accountType: data.accountType || null,
          panNumber: data.panNumber || null,
          aadhaarNumber: data.aadhaarNumber || null
        };

        // Only include allowed fields
        Object.keys(mappedData).forEach(key => {
          if (ALLOWED_UPDATE_FIELDS.includes(key) && mappedData[key] !== undefined) {
            updatePayload.employee[key] = mappedData[key];
          }
        });
      }

      console.log('Sending update payload:', updatePayload);

      // Check if there are any fields to update
      if (Object.keys(updatePayload.employee).length === 0) {
        toast.info('No editable fields were changed');
        return;
      }

      const response = await userService.updateProfile(updatePayload);

      if (response.success) {
        toast.success('Profile updated successfully');

        // Update local state immediately
        setProfileData(prev => ({
          ...prev,
          [section]: {
            ...prev[section],
            ...data
          }
        }));

        // Refresh from server after a short delay
        setTimeout(() => {
          fetchProfile();
        }, 1000);
      } else {
        toast.error(response.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Update error details:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  const formatDateForAPI = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toISOString();
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen dark:bg-gray-900 p-4 sm:p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="bg-gray-50 min-h-screen dark:bg-gray-900 p-4 sm:p-6">
        <div className="text-center py-10">
          <p className="text-gray-600 dark:text-gray-400">Failed to load profile data</p>
          <button
            onClick={fetchProfile}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen dark:bg-gray-900 p-4 sm:p-6">
      {/* Breadcrumb */}
      <Breadcrumb
        pageTitle="My Profile"
        rightContent={null}
      />

      {/* Profile Header */}
      <ProfileHeader profileData={profileData.personal} />

      {/* Profile Tabs */}
      <div className="mt-6">
        <ProfileTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          profileData={profileData}
          onUpdateProfile={handleUpdateProfile}
          updating={updating}
          allowedFields={ALLOWED_UPDATE_FIELDS}
        />
      </div>
    </div>
  );
}