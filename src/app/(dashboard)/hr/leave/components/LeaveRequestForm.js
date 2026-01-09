"use client";
import { useState, useEffect, useRef } from 'react';
import { X, Calendar, User, FileText, Paperclip, Download, Trash2, ArrowLeft, Users, Search, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { leaveRequestService } from '../../../../../services/hr-services/leaveRequestService';
import { userService } from '../../../../../services/user-services/user.service';
import { employeeService } from '../../../../../services/hr-services/employeeService';
import { toast } from 'sonner';

const LeaveRequestForm = ({ isEditMode = false, initialData = null, onSave, onCancel }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    leaveType: '',
    reason: '',
    fromDate: '',
    toDate: '',
    startDateBreakdown: 'FULL_DAY',
    endDateBreakdown: 'FULL_DAY',
    days: 0,
    attachment: null,
    cc: []
  });

  const [calculatedDays, setCalculatedDays] = useState(0);
  const [existingAttachment, setExistingAttachment] = useState(null);
  const [isCcDropdownOpen, setIsCcDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [ccOptions, setCcOptions] = useState([]);
  const [ccLoading, setCcLoading] = useState(false);
  const [employeeData, setEmployeeData] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const fromDateRef = useRef(null);
  const toDateRef = useRef(null);
  const fileInputRef = useRef(null);
  const ccDropdownRef = useRef(null);

  useEffect(() => {
    fetchCurrentEmployee();
    fetchLeaveTypes();
    fetchCcOptions();
  }, []);

  useEffect(() => {
    if (initialData) {
      if (isEditMode) {
        fetchLeaveRequestDetails();
      } else {
        if (initialData.id) {
          const parseDate = (dateStr) => {
            if (!dateStr) return '';
            if (typeof dateStr === 'string' && dateStr.includes(',')) {
              const months = {
                'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05', 'Jun': '06',
                'Jul': '07', 'Aug': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
              };

              const parts = dateStr.split(' ');
              const day = parts[0];
              const month = months[parts[1]];
              const year = parts[2].replace(',', '');

              return `${year}-${month}-${day.padStart(2, '0')}`;
            }
            return dateStr.split('T')[0];
          };

          const formData = {
            leaveType: initialData.leaveType || '',
            reason: initialData.reason || '',
            days: initialData.days || 0,
            fromDate: parseDate(initialData.fromDate) || '',
            toDate: parseDate(initialData.toDate) || '',
            startDateBreakdown: initialData.startDateBreakdown?.toUpperCase() || 'FULL_DAY',
            endDateBreakdown: initialData.endDateBreakdown?.toUpperCase() || 'FULL_DAY',
            attachment: null,
            cc: initialData.cc || []
          };

          setFormData(formData);
          setCalculatedDays(initialData.days || 0);

          if (initialData.attachment) {
            setExistingAttachment({
              url: initialData.attachmentUrl,
              name: initialData.attachmentName
            });
          }

          calculateDays(formData);
        }
      }
    }
  }, [initialData, isEditMode]);

  const fetchCurrentEmployee = async () => {
    try {
      setProfileLoading(true);
      const response = await userService.getProfile();

      if (response.success && response.data) {
        const userData = response.data;

        const employee = {
          id: userData.publicId || userData.id,
          name: `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
          employeeId: userData.employee?.employeeId || userData.employeeId || '',
          designation: userData.employee?.designation?.name || userData.designation || 'N/A',
          department: userData.employee?.department?.name || userData.department || 'N/A',
          profileImage: userData.employee?.profileImage || userData.profileImage || null,
          phone: userData.employee?.phone || userData.phone || '',
          reportingManager: userData.employee?.reportingManager?.firstName
            ? `${userData.employee.reportingManager.firstName} ${userData.employee.reportingManager.lastName}`
            : 'N/A'
        };

        setEmployeeData(employee);

        if (!initialData && !isEditMode) {
          setFormData(prev => ({
            ...prev,
            employeeName: employee.name
          }));
        }
      } else {
        toast.error(response.message || 'Failed to load employee data');
      }
    } catch (error) {
      console.error('Error fetching employee profile:', error);
      toast.error('Failed to load employee profile');
      
      setEmployeeData({
        id: 'EMP001',
        name: 'Current User',
        firstName: 'Current',
        lastName: 'User',
        email: 'employee@company.com',
        employeeId: 'EMP001',
        designation: 'Software Engineer',
        department: 'Engineering',
        profileImage: null,
        phone: '+1234567890',
        reportingManager: 'John Manager'
      });
    } finally {
      setProfileLoading(false);
    }
  };

  const fetchLeaveRequestDetails = async () => {
    if (!initialData?.id) return;

    try {
      setLoading(true);
      const response = await leaveRequestService.getLeaveRequestById(initialData.id);

      if (response.success && response.data) {
        const data = response.data;

        const parseDate = (date) => {
          if (!date) return '';
          const dateObj = new Date(date);
          return dateObj.toISOString().split('T')[0];
        };

        const formData = {
          leaveType: data.leaveType?.name || '',
          reason: data.reason || '',
          days: data.days || 0,
          fromDate: parseDate(data.fromDate),
          toDate: parseDate(data.toDate),
          startDateBreakdown: data.startDateBreakdown || 'FULL_DAY',
          endDateBreakdown: data.endDateBreakdown || 'FULL_DAY',
          attachment: null,
          cc: data.cc || []
        };

        setFormData(formData);
        setCalculatedDays(data.days || 0);

        if (data.attachmentUrl) {
          setExistingAttachment({
            url: data.attachmentUrl,
            name: data.attachmentName || 'Attachment'
          });
        }
      }
    } catch (error) {
      console.error('Error fetching leave request details:', error);
      toast.error('Failed to load leave request details');
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaveTypes = async () => {
    try {
      const response = await leaveRequestService.getLeaveTypesDropdown();
      if (response.success && response.data) {
        setLeaveTypes(response.data);
      } else {
        setLeaveTypes([
          { id: 1, name: 'Sick Leave' },
          { id: 2, name: 'Annual Leave' },
          { id: 3, name: 'Casual Leave' },
          { id: 4, name: 'Maternity Leave' },
          { id: 5, name: 'Paternity Leave' },
          { id: 6, name: 'Medical Leave' },
          { id: 7, name: 'Personal Leave' },
          { id: 8, name: 'Emergency Leave' }
        ]);
      }
    } catch (error) {
      console.error('Error fetching leave types:', error);
      setLeaveTypes([
        { id: 1, name: 'Sick Leave' },
        { id: 2, name: 'Annual Leave' },
        { id: 3, name: 'Casual Leave' },
        { id: 4, name: 'Maternity Leave' },
        { id: 5, name: 'Paternity Leave' },
        { id: 6, name: 'Medical Leave' },
        { id: 7, name: 'Personal Leave' },
        { id: 8, name: 'Emergency Leave' }
      ]);
    }
  };

  const fetchCcOptions = async () => {
    try {
      setCcLoading(true);
      
      const managersResponse = await employeeService.getManagers();
      
      let apiManagers = [];
      if (managersResponse.success && managersResponse.data) {
        apiManagers = managersResponse.data.map(manager => ({
          id: manager.id,
          name: `${manager.firstName} ${manager.lastName}`,
          role: manager.designation?.name || 'Manager',
          email: manager.email,
          firstName: manager.firstName,
          lastName: manager.lastName,
          employeeId: manager.employeeId,
          department: manager.department?.name || 'N/A'
        }));
      }

      setCcOptions(apiManagers);
    } catch (error) {
      console.error('Error fetching managers:', error);
      setCcOptions([]);
      toast.error('Failed to load managers list');
    } finally {
      setCcLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ccDropdownRef.current && !ccDropdownRef.current.contains(event.target)) {
        setIsCcDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCcOptions = ccOptions.filter(option =>
    option.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    option.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    option.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCcSelect = (person) => {
    if (!formData.cc.some(p => p.id === person.id)) {
      setFormData(prev => ({
        ...prev,
        cc: [...prev.cc, person]
      }));
    }
    setSearchQuery('');
    setIsCcDropdownOpen(false);
  };

  const removeCcPerson = (personId) => {
    setFormData(prev => ({
      ...prev,
      cc: prev.cc.filter(p => p.id !== personId)
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = {
      ...formData,
      [name]: value
    };

    setFormData(updatedFormData);

    if (name === 'fromDate' || name === 'toDate' ||
      name === 'startDateBreakdown' || name === 'endDateBreakdown') {
      calculateDays(updatedFormData);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf',
        'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please select a valid file type (JPEG, PNG, PDF, DOC, DOCX)');
        return;
      }

      setFormData(prev => ({
        ...prev,
        attachment: file,
        attachmentName: file.name
      }));

      setExistingAttachment(null);
    }
  };

  const removeAttachment = () => {
    setFormData(prev => ({
      ...prev,
      attachment: null,
      attachmentName: ''
    }));
    setExistingAttachment(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const calculateDays = (data) => {
    if (!data.fromDate || !data.toDate) {
      setCalculatedDays(0);
      return;
    }

    const start = new Date(data.fromDate);
    const end = new Date(data.toDate);

    if (start.toDateString() === end.toDateString()) {
      let dayCount = 0;

      if (data.startDateBreakdown === 'FULL_DAY') {
        dayCount = 1;
      } else {
        dayCount = 0.5;
      }

      setCalculatedDays(dayCount);
      return;
    }

    const diffTime = Math.abs(end - start);
    let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    if (data.startDateBreakdown !== 'FULL_DAY') {
      diffDays -= 0.5;
    }

    if (data.endDateBreakdown !== 'FULL_DAY') {
      diffDays -= 0.5;
    }

    if (!isNaN(diffDays)) {
      setCalculatedDays(diffDays);
      setFormData(prev => ({ ...prev, days: diffDays }));
    }
  };

  const handleBreakdownChange = (field, value) => {
    const updatedFormData = {
      ...formData,
      [field]: value
    };

    setFormData(updatedFormData);
    calculateDays(updatedFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.leaveType) {
      toast.error('Please select a leave type');
      return;
    }

    if (!formData.reason) {
      toast.error('Please provide a reason');
      return;
    }

    if (!formData.fromDate || !formData.toDate) {
      toast.error('Please select both from and to dates');
      return;
    }

    if (new Date(formData.fromDate) > new Date(formData.toDate)) {
      toast.error('From date cannot be after to date');
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(formData.fromDate) < today) {
      toast.error('Leave cannot be requested for past dates');
      return;
    }

    setSubmitting(true);

    try {
      const submitData = {
        leaveType: formData.leaveType,
        reason: formData.reason,
        days: calculatedDays,
        fromDate: formData.fromDate,
        toDate: formData.toDate,
        startDateBreakdown: formData.startDateBreakdown.toLowerCase(),
        endDateBreakdown: formData.endDateBreakdown.toLowerCase(),
        attachment: formData.attachment,
        cc: formData.cc.map(person => ({
          email: person.email,
          name: person.name
        }))
      };

      console.log('Submitting leave request:', submitData);

      let response;
      if (isEditMode && initialData?.id) {
        response = await leaveRequestService.updateLeaveRequest(initialData.id, submitData);
      } else {
        response = await leaveRequestService.createLeaveRequest(submitData);
      }

      if (response.success) {
        toast.success(isEditMode ? 'Leave request updated successfully' : 'Leave request submitted successfully');
        
        router.push('/hr/leave/requests');
        router.refresh();
        
        if (onSave) {
          onSave(response.data);
        }
      } else {
        toast.error(response.message || 'Failed to save leave request');
      }
    } catch (error) {
      console.error('Error saving leave request:', error);
      toast.error(error.message || 'Failed to save leave request');
    } finally {
      setSubmitting(false);
    }
  };

  const openDatePicker = (ref) => {
    if (ref.current) {
      ref.current.showPicker();
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if ((loading && isEditMode) || profileLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
          <span className="text-gray-600 dark:text-gray-400">
            {profileLoading ? 'Loading employee data...' : 'Loading leave request details...'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <button
            onClick={onCancel}
            className="mr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            disabled={submitting}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {isEditMode ? 'Edit Leave Request' : 'Add New Leave Request'}
          </h3>
        </div>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          disabled={submitting}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
        <div className="flex items-center">
          {employeeData?.profileImage ? (
            <img
              src={employeeData.profileImage}
              alt={employeeData.name}
              className="w-10 h-10 rounded-full mr-3 object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
              <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          )}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {employeeData?.firstName}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Employee ID: {employeeData?.employeeId || 'N/A'}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">•</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {employeeData?.designation || 'N/A'}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">•</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {employeeData?.department || 'N/A'}
                  </span>
                </div>
              </div>
              <div className="mt-2 sm:mt-0">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                  Leave Requester
                </span>
              </div>
            </div>
            {employeeData?.reportingManager && employeeData.reportingManager !== 'N/A' && (
              <div className="mt-2">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Reporting Manager: <span className="font-medium">{employeeData.reportingManager}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Leave Type *
          </label>
          <select
            name="leaveType"
            value={formData.leaveType}
            onChange={handleChange}
            className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            required
            disabled={submitting}
          >
            <option value="">Select Leave Type</option>
            {leaveTypes.map((type) => (
              <option key={type.id} value={type.name}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Reason *
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              rows={3}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Please provide a detailed reason for your leave request"
              required
              disabled={submitting}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              From Date *
            </label>
            <div className="relative">
              <input
                ref={fromDateRef}
                type="date"
                name="fromDate"
                value={formData.fromDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full pl-3 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                required
                disabled={submitting}
              />
              <Calendar
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 cursor-pointer"
                onClick={() => openDatePicker(fromDateRef)}
              />
            </div>

            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Date Breakdown
              </label>
              <div className="flex flex-wrap gap-3">
                {[
                  { value: 'FULL_DAY', label: 'Full Day' },
                  { value: 'FIRST_HALF', label: 'First Half' },
                  { value: 'SECOND_HALF', label: 'Second Half' }
                ].map(option => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="radio"
                      name="startDateBreakdown"
                      checked={formData.startDateBreakdown === option.value}
                      onChange={() => handleBreakdownChange('startDateBreakdown', option.value)}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                      disabled={submitting}
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              To Date *
            </label>
            <div className="relative">
              <input
                ref={toDateRef}
                type="date"
                name="toDate"
                value={formData.toDate}
                onChange={handleChange}
                min={formData.fromDate || new Date().toISOString().split('T')[0]}
                className="w-full pl-3 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                required
                disabled={submitting}
              />
              <Calendar
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 cursor-pointer"
                onClick={() => openDatePicker(toDateRef)}
              />
            </div>

            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                End Date Breakdown
              </label>
              <div className="flex flex-wrap gap-3">
                {[
                  { value: 'FULL_DAY', label: 'Full Day' },
                  { value: 'FIRST_HALF', label: 'First Half' },
                  { value: 'SECOND_HALF', label: 'Second Half' }
                ].map(option => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="radio"
                      name="endDateBreakdown"
                      checked={formData.endDateBreakdown === option.value}
                      onChange={() => handleBreakdownChange('endDateBreakdown', option.value)}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                      disabled={submitting}
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {formData.fromDate && formData.toDate && (
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Selected Dates:</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {formatDateForDisplay(formData.fromDate)} to {formatDateForDisplay(formData.toDate)}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
              Calculated Leave Days:
            </span>
            <span className="text-lg font-bold text-blue-800 dark:text-blue-300">
              {calculatedDays} {calculatedDays === 1 ? 'day' : 'days'}
            </span>
          </div>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
            Based on selected dates and breakdown options
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            CC (Managers & Supervisors)
          </label>
          <div className="relative" ref={ccDropdownRef}>
            {formData.cc.length > 0 && (
              <div className="space-y-3 mb-4">
                {formData.cc.map(person => (
                  <div
                    key={person.id}
                    className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0 mr-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                          {person.name}
                        </p>
                        <p className="text-xs text-blue-600 dark:text-blue-400">
                          {person.role} • {person.email}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCcPerson(person.id)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 p-1"
                      disabled={submitting}
                      title="Remove"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="relative">
              <div className="flex items-center">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder={ccLoading ? "Loading managers..." : "Search managers and supervisors..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsCcDropdownOpen(true)}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:opacity-50"
                  disabled={submitting || ccLoading}
                />
                {ccLoading ? (
                  <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 animate-spin" />
                ) : (
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                )}
              </div>

              {isCcDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {ccLoading ? (
                    <div className="p-3 text-center">
                      <Loader2 className="w-4 h-4 mx-auto animate-spin text-blue-600 dark:text-blue-400" />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Loading managers...</p>
                    </div>
                  ) : filteredCcOptions.length > 0 ? (
                    filteredCcOptions.map(person => (
                      <div
                        key={person.id}
                        onClick={() => handleCcSelect(person)}
                        className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                      >
                        <div className="flex-shrink-0 mr-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {person.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {person.role}
                              </p>
                            </div>
                            {formData.cc.some(p => p.id === person.id) && (
                              <div className="ml-2 flex-shrink-0">
                                <div className="w-2 h-2 bg-green-500 rounded-full" />
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                            {person.email}
                          </p>
                          {person.employeeId && (
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate">
                              ID: {person.employeeId} • {person.department}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-center text-sm text-gray-500 dark:text-gray-400">
                      No managers available
                    </div>
                  )}
                </div>
              )}
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Select managers and supervisors to notify about this leave request
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Attachment (Optional)
          </label>
          <div className="space-y-3">
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
              className="hidden"
              disabled={submitting}
            />

            <button
              type="button"
              onClick={triggerFileInput}
              className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 disabled:opacity-50"
              disabled={submitting}
            >
              <Paperclip className="w-4 h-4 mr-2" />
              Upload File
            </button>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              Supported formats: JPG, PNG, PDF, DOC, DOCX (Max 5MB)
            </p>

            {(formData.attachmentName || existingAttachment) && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                <div className="flex items-center">
                  <Paperclip className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-xs">
                    {formData.attachmentName || (existingAttachment && existingAttachment.name) || 'Attachment'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {existingAttachment?.url && (
                    <button
                      type="button"
                      onClick={() => window.open(existingAttachment.url, '_blank')}
                      className="p-1 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                      title="Download attachment"
                      disabled={submitting}
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={removeAttachment}
                    className="p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    title="Remove attachment"
                    disabled={submitting}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isEditMode ? 'Update Leave Request' : 'Submit Leave Request'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LeaveRequestForm;