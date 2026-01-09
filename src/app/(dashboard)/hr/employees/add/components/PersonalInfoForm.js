// src/app/(dashboard)/hr/employees/add/components/PersonalInfoForm.js
"use client";
import { User, Calendar, Globe, Upload, X, Camera, AlertCircle, CheckCircle, Ruler, Weight, MapPin } from 'lucide-react';
import { useState, useRef } from 'react';
import InputField from '@/components/form/input/InputField';
import SelectField from './SelectField';
import Label from '@/components/form/Label';
import { toast } from 'sonner';

export default function PersonalInfoForm({ formData, errors, onChange, dropdownData }) {
  const [profilePreview, setProfilePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const genderOptions = [
    { value: '', label: 'Select Gender' },
    { value: 'MALE', label: 'Male' },
    { value: 'FEMALE', label: 'Female' },
    { value: 'OTHER', label: 'Other' },
    { value: 'PREFER_NOT_TO_SAY', label: 'Prefer not to say' }
  ];

  const maritalStatusOptions = [
    { value: '', label: 'Select Marital Status' },
    { value: 'SINGLE', label: 'Single' },
    { value: 'MARRIED', label: 'Married' },
    { value: 'DIVORCED', label: 'Divorced' },
    { value: 'WIDOWED', label: 'Widowed' },
    { value: 'SEPARATED', label: 'Separated' }
  ];

  const bloodGroupOptions = [
    { value: '', label: 'Select Blood Group' },
    { value: 'A_POSITIVE', label: 'A+' },
    { value: 'A_NEGATIVE', label: 'A-' },
    { value: 'B_POSITIVE', label: 'B+' },
    { value: 'B_NEGATIVE', label: 'B-' },
    { value: 'O_POSITIVE', label: 'O+' },
    { value: 'O_NEGATIVE', label: 'O-' },
    { value: 'AB_POSITIVE', label: 'AB+' },
    { value: 'AB_NEGATIVE', label: 'AB-' }
  ];

  // const physicalStatusOptions = [
  //   { value: '', label: 'Select Physical Status' },
  //   { value: 'NORMAL', label: 'Normal' },
  //   { value: 'DISABLED', label: 'Disabled' },
  //   { value: 'SPECIAL_NEEDS', label: 'Special Needs' }
  // ];

  const handleProfilePhotoUpload = (file) => {
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePreview(e.target.result);
        onChange('profileImage', file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInputChange = (event) => {
    handleProfilePhotoUpload(event.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleProfilePhotoUpload(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removeProfilePhoto = () => {
    setProfilePreview(null);
    onChange('profileImage', null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Calculate age from date of birth
  const calculateAge = (dob) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(formData.dateOfBirth);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Personal Information
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Complete employee personal details
            </p>
          </div>
        </div>
      </div>

      {/* Profile Photo Upload Section */}
      <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <Camera className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="font-medium text-gray-900 dark:text-white">
            Profile Photo
          </h3>
        </div>

        <div className="flex flex-col sm:flex-row items-start gap-6">
          {/* Photo Preview */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className={`
                w-20 h-20 rounded-full flex items-center justify-center overflow-hidden
                border-2 transition-all duration-200 bg-gray-100 dark:bg-gray-700
                ${isDragging
                  ? 'border-blue-400 ring-1 ring-blue-100 dark:ring-blue-900/20'
                  : profilePreview
                    ? 'border-transparent'
                    : 'border-dashed border-gray-300 dark:border-gray-600'
                }
              `}>
                {profilePreview ? (
                  <img
                    src={profilePreview}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-gray-400" />
                )}
              </div>

              {profilePreview && (
                <button
                  type="button"
                  onClick={removeProfilePhoto}
                  className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all shadow-sm"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
              300x300px recommended
            </p>
          </div>

          {/* Upload Controls */}
          <div className="flex-1 space-y-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
              className="hidden"
            />

            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`
                p-3 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
                ${isDragging
                  ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-600'
                }
              `}
              onClick={triggerFileInput}
            >
              <div className="flex flex-col items-center justify-center gap-1">
                <Upload className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Click to upload
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    JPG, PNG, GIF (Max 5MB)
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
              <CheckCircle className="w-3 h-3" />
              <span>Helps in employee identification</span>
            </div>
          </div>
        </div>
      </div>

      {/* Basic Information Section */}
      <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-6">
          <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="font-medium text-gray-900 dark:text-white">
            Basic Information
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Name Fields */}
          <div className="space-y-2">
            <Label htmlFor="firstName" required>
              First Name
            </Label>
            <InputField
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={(e) => onChange('firstName', e.target.value)}
              placeholder="Enter first name"
              error={errors.firstName}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName" required>
              Last Name
            </Label>
            <InputField
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={(e) => onChange('lastName', e.target.value)}
              placeholder="Enter last name"
              error={errors.lastName}
            />
          </div>

          {/* Email Fields */}
          <div className="space-y-2">
            <Label htmlFor="email" required>
              Official Email
            </Label>
            <InputField
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={(e) => onChange('email', e.target.value)}
              placeholder="employee@company.com"
              error={errors.email}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="personalEmail">
              Personal Email
            </Label>
            <InputField
              id="personalEmail"
              name="personalEmail"
              type="email"
              value={formData.personalEmail}
              onChange={(e) => onChange('personalEmail', e.target.value)}
              placeholder="personal@email.com"
              error={errors.personalEmail}
            />
          </div>

          {/* Date of Birth with Age Display */}
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth" required>
              Date of Birth
            </Label>
            <div className="relative">
              <InputField
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => onChange('dateOfBirth', e.target.value)}
                error={errors.dateOfBirth}
              />
              {age !== null && (
                <div className="absolute -bottom-5 left-0 text-xs text-gray-500 dark:text-gray-400">
                  Age: {age} years
                </div>
              )}
            </div>
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <Label htmlFor="gender" required>
              Gender
            </Label>
            <SelectField
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={(value) => onChange('gender', value)}
              options={genderOptions}
              error={errors.gender}
            />
          </div>

          {/* Marital Status */}
          <div className="space-y-2">
            <Label htmlFor="maritalStatus">
              Marital Status
            </Label>
            <SelectField
              id="maritalStatus"
              name="maritalStatus"
              value={formData.maritalStatus}
              onChange={(value) => onChange('maritalStatus', value)}
              options={maritalStatusOptions}
              error={errors.maritalStatus}
            />
          </div>

          {/* Blood Group */}
          <div className="space-y-2">
            <Label htmlFor="bloodGroup">
              Blood Group
            </Label>
            <SelectField
              id="bloodGroup"
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={(value) => onChange('bloodGroup', value)}
              options={bloodGroupOptions}
              error={errors.bloodGroup}
            />
          </div>

          {/* Nationality */}
          <div className="space-y-2">
            <Label htmlFor="nationality">
              Nationality
            </Label>
            <InputField
              id="nationality"
              name="nationality"
              value={formData.nationality}
              onChange={(e) => onChange('nationality', e.target.value)}
              placeholder="Enter nationality"
              error={errors.nationality}
            />
          </div>

          {/* Religion */}
          <div className="space-y-2">
            <Label htmlFor="religion">
              Religion
            </Label>
            <InputField
              id="religion"
              name="religion"
              value={formData.religion}
              onChange={(e) => onChange('religion', e.target.value)}
              placeholder="Enter religion"
              error={errors.religion}
            />
          </div>
        </div>
      </div>

      {/* Additional Personal Details */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-6">
          <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="font-medium text-gray-900 dark:text-white">
            Additional Details
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Birth Place */}
          <div className="space-y-2">
            <Label htmlFor="birthPlace">
              Birth Place
            </Label>
            <InputField
              id="birthPlace"
              name="birthPlace"
              value={formData.birthPlace}
              onChange={(e) => onChange('birthPlace', e.target.value)}
              placeholder="Enter birth place"
              error={errors.birthPlace}
            />
          </div>

          {/* Height */}
          <div className="space-y-2">
            <Label htmlFor="height">
              Height (cm)
            </Label>
            <InputField
              id="height"
              name="height"
              type="number"
              value={formData.height}
              onChange={(e) => onChange('height', e.target.value)}
              placeholder="Height in cm"
              error={errors.height}
              icon={<Ruler className="w-4 h-4" />}
            />
          </div>

          {/* Weight */}
          <div className="space-y-2">
            <Label htmlFor="weight">
              Weight (kg)
            </Label>
            <InputField
              id="weight"
              name="weight"
              type="number"
              value={formData.weight}
              onChange={(e) => onChange('weight', e.target.value)}
              placeholder="Weight in kg"
              error={errors.weight}
              icon={<Weight className="w-4 h-4" />}
            />
          </div>

          {/* Physical Status */}
          {/* <div className="space-y-2">
            <Label htmlFor="physicalStatus">
              Physical Status
            </Label>
            <SelectField
              id="physicalStatus"
              name="physicalStatus"
              value={formData.physicalStatus}
              onChange={(value) => onChange('physicalStatus', value)}
              options={physicalStatusOptions}
              error={errors.physicalStatus}
            />
          </div> */}

          {/* Identification Mark */}
          {/* <div className="space-y-2 md:col-span-2">
            <Label htmlFor="identificationMark">
              Identification Mark
            </Label>
            <InputField
              id="identificationMark"
              name="identificationMark"
              value={formData.identificationMark}
              onChange={(e) => onChange('identificationMark', e.target.value)}
              placeholder="Any visible identification marks"
              error={errors.identificationMark}
            />
          </div> */}
        </div>
      </div>

      {/* Guidelines Card */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <div className="p-1.5 bg-blue-600 rounded-md flex-shrink-0 mt-0.5">
            <AlertCircle className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              Important Guidelines
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-3 h-3 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-xs text-gray-700 dark:text-gray-300">
                  Match government-issued documents
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-3 h-3 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-xs text-gray-700 dark:text-gray-300">
                  Use recent, high-quality photo
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-3 h-3 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-xs text-gray-700 dark:text-gray-300">
                  Verify spellings and formats
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-3 h-3 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-xs text-gray-700 dark:text-gray-300">
                  * indicates required fields
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}