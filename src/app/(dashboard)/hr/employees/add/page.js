// src/app/(dashboard)/hr/employees/add/page.js
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import PersonalInfoForm from './components/PersonalInfoForm';
import Breadcrumb from '@/components/common/Breadcrumb';
import ProgressIndicator from './components/ProgressIndicator';
import ContactInfoForm from './components/ContactInfoForm';
import ProfessionalInfoForm from './components/ProfessionalInfoForm';
import BankingInfoForm from './components/BankingInfoForm';
import DocumentsForm from './components/DocumentsForm';
import FormNavigation from './components/FormNavigation';
import FormRecoveryModal from '@/components/form/FormRecoveryModal';
import { toast } from 'sonner';
import employeeService from '@/services/hr-services/employeeService';
import { validateEmployeeForm } from '@/utils/validation';

const STEPS = [
  { id: 1, title: 'Personal Information', component: 'personal' },
  { id: 2, title: 'Contact Information', component: 'contact' },
  { id: 3, title: 'Professional Information', component: 'professional' },
  { id: 4, title: 'Banking Information', component: 'banking' },
  // { id: 5, title: 'Documents', component: 'documents' }
];

const STORAGE_KEY = 'hrms_employee_form_data';

const defaultFormData = {
  // Personal Information
  profileImage: null,
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  gender: '',
  maritalStatus: '',
  bloodGroup: '',
  nationality: 'Indian',
  religion: '',
  personalEmail: '',
  birthPlace: '',
  height: '',
  weight: '',

  // Contact Information
  email: '',
  phone: '',
  permanentAddress: '',
  currentAddress: '',
  city: '',
  state: '',
  pincode: '',
  country: 'India',
  emergencyContactName: '',
  emergencyContactRelation: '',
  emergencyContactPhone: '',

  // Professional Information
  employeeId: '',
  departmentId: '',
  designationId: '',
  reportingManagerId: '',
  joiningDate: '',
  confirmationDate: '',
  employmentType: 'FULL_TIME',
  workLocation: '',
  baseSalary: '',
  probationPeriod: '',
  workShift: '',
  weeklyHours: 40,
  overtimeEligible: false,

  // Banking Information
  bankName: '',
  accountNumber: '',
  ifscCode: '',
  accountHolderName: '',
  accountType: 'SAVINGS',

  // Documents & Tax Information
  panNumber: '',
  aadhaarNumber: '',

  // Status
  status: 'ACTIVE',
  onboardingStatus: 'PENDING',
  createUser: true
};

export default function AddEmployeePage() {
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [recoveryData, setRecoveryData] = useState(null);
  const [dropdownData, setDropdownData] = useState({
    departments: [],
    designations: [],
    reportingManagers: []
  });
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [formData, setFormData] = useState(defaultFormData);
  const [errors, setErrors] = useState({});

  // Load dropdown data
  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        // const [departments, designations, managers 
        //   // reportingManagers
        // ] = await Promise.all([
        //   employeeService.getDepartments(),
        //   employeeService.getDesignations(),
        //   // employeeService.getReportingManagers()
        //   employeeService.getManagers()
        // ]);
        const [departments, designations, managers] = await Promise.all([
          employeeService.getDepartments(),
          employeeService.getDesignations(),
          employeeService.getManagers() // Make sure this endpoint exists
        ]);

        setDropdownData({
          departments: departments.data || departments,
          designations: designations.data || designations,
          reportingManagers: managers.data || managers
          // reportingManagers: reportingManagers.data || reportingManagers
        });
      } catch (error) {
        toast.error('Failed to load dropdown data');
        console.error('Error loading dropdown data:', error);
      } finally {
        setLoadingDropdowns(false);
      }
    };

    loadDropdownData();
  }, []);

  // Load saved data on component mount
  useEffect(() => {
    const loadSavedData = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsedData = JSON.parse(saved);
          const dataAge = parsedData.timestamp
            ? Date.now() - new Date(parsedData.timestamp).getTime()
            : Infinity;

          const isDataRecent = dataAge < 24 * 60 * 60 * 1000;

          if (isDataRecent) {
            setRecoveryData(parsedData);
            setShowRecoveryModal(true);
          } else {
            localStorage.removeItem(STORAGE_KEY);
          }
        }
      } catch (error) {
        console.error('Error loading saved form data:', error);
        localStorage.removeItem(STORAGE_KEY);
      } finally {
        setIsDataLoaded(true);
      }
    };

    loadSavedData();
  }, []);

  // Auto-save with debouncing
  useEffect(() => {
    if (!isDataLoaded) return;

    const saveData = () => {
      try {
        const dataToSave = {
          formData,
          currentStep,
          timestamp: new Date().toISOString()
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
        setLastSaved(new Date());
        setIsSaved(true);

        setTimeout(() => setIsSaved(false), 2000);
      } catch (error) {
        console.error('Error saving form data:', error);
      }
    };

    const timeoutId = setTimeout(saveData, 1500);
    return () => clearTimeout(timeoutId);
  }, [formData, currentStep, isDataLoaded]);

  // Clear form data from storage
  const clearFormData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setFormData(defaultFormData);
    setCurrentStep(1);
    setErrors({});
    setRecoveryData(null);
    toast.success('Form cleared successfully');
  }, []);

  // Handle input changes
  const handleInputChange = useCallback((name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }, [errors]);

  // Navigation handlers
  const handleNext = useCallback(() => {
    const stepErrors = validateEmployeeForm(formData, currentStep);

    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      toast.error('Please fix the errors before proceeding');
      return;
    }

    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, formData]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();

      // Append all fields to FormData
      Object.keys(formData).forEach(key => {
        if (key === 'profileImage') {
          if (formData[key] instanceof File) {
            formDataToSend.append('profileImage', formData[key]);
          }
        } else if (formData[key] !== null && formData[key] !== undefined) {
          let value = formData[key];

          if (['dateOfBirth', 'joiningDate', 'confirmationDate'].includes(key) && value) {
            // Ensure dates are in YYYY-MM-DD format
            if (value instanceof Date) {
              value = value.toISOString().split('T')[0];
            }
          }

          // Ensure boolean values are strings "true" or "false"
          if (typeof value === 'boolean') {
            value = value.toString();
          }

          // Only skip empty strings for truly optional fields
          const optionalFields = [
            'religion', 'birthPlace', 'height', 'weight', 'personalEmail',
            'maritalStatus', 'bloodGroup', 'reportingManagerId', 'confirmationDate',
            'probationPeriod', 'workShift', 'baseSalary', 'workLocation',
            'bankName', 'accountNumber', 'ifscCode', 'accountHolderName',
            'panNumber', 'aadhaarNumber'
          ];

          if (value === '' && optionalFields.includes(key)) {
            // Skip empty optional fields
            return;
          }

          formDataToSend.append(key, value);
        }
      });

      // Add default onboardingStatus if missing
      if (!formData.onboardingStatus) {
        formDataToSend.append('onboardingStatus', 'PENDING');
      }

      // Debug: Log what we're sending
      console.log('FormData entries:');
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      const response = await employeeService.createEmployee(formDataToSend);

      if (response.success) {
        const employeeId = response.data.id;

        // Clear form data from storage
        localStorage.removeItem(STORAGE_KEY);

        toast.success('Employee created successfully! Redirecting...');

        // Redirect to documents page after a brief delay
        setTimeout(() => {
          router.push(`/hr/employees/${employeeId}/documents?new=true`);
        }, 1500);
      } else {
        throw new Error(response.message || 'Failed to create employee');
      }

    } catch (error) {
      console.error('Error creating employee:', error);
      toast.error(error.message || 'Failed to create employee');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Recovery modal handlers
  const handleRecover = useCallback(() => {
    if (recoveryData) {
      setFormData(recoveryData.formData || defaultFormData);
      setCurrentStep(recoveryData.currentStep || 1);
      setLastSaved(recoveryData.timestamp ? new Date(recoveryData.timestamp) : null);
      toast.success('Form data recovered successfully');
    }
    setShowRecoveryModal(false);
  }, [recoveryData]);

  const handleDiscard = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setRecoveryData(null);
    setShowRecoveryModal(false);
    toast.info('Previous form data discarded');
  }, []);

  // Manual save function
  const handleManualSave = useCallback(() => {
    const dataToSave = {
      formData,
      currentStep,
      timestamp: new Date().toISOString()
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    setLastSaved(new Date());
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
    toast.success('Form progress saved');
  }, [formData, currentStep]);

  // Render step content
  const renderStepContent = useCallback(() => {
    if (!isDataLoaded || loadingDropdowns) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    const commonProps = {
      formData,
      errors,
      onChange: handleInputChange,
      dropdownData
    };

    switch (currentStep) {
      case 1: return <PersonalInfoForm {...commonProps} />;
      case 2: return <ContactInfoForm {...commonProps} />;
      case 3: return <ProfessionalInfoForm {...commonProps} />;
      case 4: return <BankingInfoForm {...commonProps} />;
      case 5: return <DocumentsForm {...commonProps} />;
      default: return null;
    }
  }, [currentStep, formData, errors, handleInputChange, isDataLoaded, loadingDropdowns, dropdownData]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Breadcrumb
        items={[
          { label: 'HR', href: '/hr' },
          { label: 'Employees', href: '/hr/employees' },
          { label: 'Add Employee', href: '/hr/employees/add' }
        ]}
      />

      {/* Save Status Indicator */}
      <div className="px-6 pt-6">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            {isSaved && (
              <span className="text-green-600 dark:text-green-400">✓ Saved</span>
            )}
            {lastSaved && (
              <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleManualSave}
              className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50 transition-colors"
            >
              Save Progress
            </button>
            <button
              onClick={clearFormData}
              className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50 transition-colors"
            >
              Clear Form
            </button>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="px-6 my-6">
        <ProgressIndicator
          steps={STEPS}
          currentStep={currentStep}
        />
      </div>

      {/* Form Container */}
      <div className="px-4 md:px-6 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            {/* Step Content */}
            <div className="p-4 md:p-8">
              {renderStepContent()}
            </div>

            {/* Form Navigation */}
            <div className="px-4 py-4 md:px-8 md:py-6 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl border-t border-gray-200 dark:border-gray-700">
              <FormNavigation
                currentStep={currentStep}
                totalSteps={STEPS.length}
                onPrevious={handlePrevious}
                onNext={handleNext}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                canProceed={true}
                submitButtonText="Create Employee & Upload Documents"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Recovery Modal */}
      <FormRecoveryModal
        isOpen={showRecoveryModal}
        onRecover={handleRecover}
        onDiscard={handleDiscard}
        lastSaved={recoveryData?.timestamp}
      />
    </div>
  );
}