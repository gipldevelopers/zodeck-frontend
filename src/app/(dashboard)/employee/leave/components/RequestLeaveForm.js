"use client";

import { useState, useEffect } from "react";
import EmployeeLeaveService from "@/services/employee/leave.service";
import { toast } from "react-hot-toast";
import { Plus, Calendar, FileText, Upload, X } from "lucide-react";

export default function RequestLeaveForm() {
  const [form, setForm] = useState({
    leaveTypeId: "",
    effectiveFrom: "",
    effectiveTo: "",
    remark: "",
    proof: null,
  });
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [availability, setAvailability] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchLeaveTypes();
  }, []);

  const fetchLeaveTypes = async () => {
    try {
      setLoading(true);
      const response = await EmployeeLeaveService.getLeaveTypes();
      setLeaveTypes(response.data || response || []);
    } catch (error) {
      console.error("Failed to fetch leave types", error);
      toast.error("Failed to load leave types");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    const newValue = files ? files[0] : value;

    setForm(prev => {
      const updated = { ...prev, [name]: newValue };

      // Reset availability check if dates or type change
      if (name === 'leaveTypeId' || name === 'effectiveFrom' || name === 'effectiveTo') {
        setAvailability(null);
      }
      return updated;
    });

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const checkAvailability = async () => {
    if (!form.leaveTypeId || !form.effectiveFrom || !form.effectiveTo) return;

    try {
      const result = await EmployeeLeaveService.checkLeaveAvailability(
        form.effectiveFrom,
        form.effectiveTo,
        form.leaveTypeId
      );
      setAvailability(result);
      if (!result.available) {
        setErrors(prev => ({ ...prev, availability: result.message }));
      } else {
        setErrors(prev => ({ ...prev, availability: null }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.leaveTypeId) newErrors.leaveTypeId = "Leave type is required.";
    if (!form.effectiveFrom) newErrors.effectiveFrom = "Start date is required.";
    if (!form.effectiveTo) newErrors.effectiveTo = "End date is required.";
    if (
      form.effectiveFrom &&
      form.effectiveTo &&
      form.effectiveTo < form.effectiveFrom
    ) {
      newErrors.effectiveTo = "End date cannot be earlier than start date.";
    }
    if (!form.remark) newErrors.remark = "Remarks are required.";
    if (availability && !availability.available) {
      newErrors.availability = availability.message;
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setSubmitting(true);

      // Prepare FormData for file upload
      const formData = new FormData();
      formData.append('leaveTypeId', form.leaveTypeId);
      formData.append('startDate', form.effectiveFrom);
      formData.append('endDate', form.effectiveTo);
      formData.append('reason', form.remark);
      if (form.proof) {
        formData.append('document', form.proof);
      }

      await EmployeeLeaveService.requestLeave(formData);

      toast.success("Leave request submitted successfully!");
      setForm({
        leaveTypeId: "",
        effectiveFrom: "",
        effectiveTo: "",
        remark: "",
        proof: null,
      });
      setAvailability(null);
    } catch (error) {
      toast.error(error.message || "Failed to submit leave request");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 rounded-2xl border border-primary-100/50 dark:border-gray-700 shadow-sm p-6 space-y-5"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 rounded-xl">
          <Plus size={18} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Submit Leave Request
        </h3>
      </div>

      {errors.availability && (
        <div className="p-3 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/30 rounded-xl text-sm">
          {errors.availability}
        </div>
      )}

      {/* Leave Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Leave Type Name <span className="text-red-500">*</span>
        </label>
        <select
          name="leaveTypeId"
          value={form.leaveTypeId}
          onChange={handleChange}
          disabled={loading}
          className="w-full px-4 py-2.5 border border-primary-200/50 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 dark:focus:border-primary-500 transition-all duration-200 text-sm"
        >
          <option value="">{loading ? "Loading..." : "Please Select Leave Type"}</option>
          {leaveTypes.map(type => (
            <option key={type.id} value={type.id}>{type.name} ({type.remaining || type.balance} remaining)</option>
          ))}
        </select>
        {errors.leaveTypeId && (
          <p className="text-red-500 text-xs mt-1.5">{errors.leaveTypeId}</p>
        )}
      </div>

      {/* Start & End Dates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select From Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="effectiveFrom"
            value={form.effectiveFrom}
            onChange={handleChange}
            onBlur={checkAvailability}
            className="w-full px-4 py-2.5 border border-primary-200/50 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 dark:focus:border-primary-500 transition-all duration-200 text-sm"
          />
          {errors.effectiveFrom && (
            <p className="text-red-500 text-xs mt-1.5">{errors.effectiveFrom}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select To Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="effectiveTo"
            value={form.effectiveTo}
            onChange={handleChange}
            onBlur={checkAvailability}
            className="w-full px-4 py-2.5 border border-primary-200/50 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 dark:focus:border-primary-500 transition-all duration-200 text-sm"
          />
          {errors.effectiveTo && (
            <p className="text-red-500 text-xs mt-1.5">{errors.effectiveTo}</p>
          )}
        </div>
      </div>

      {availability && availability.available && (
        <div className="p-3 bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400 border border-primary-200 dark:border-primary-500/30 rounded-xl text-sm font-medium">
          {availability.days} day(s) will be deducted.
        </div>
      )}

      {/* Remarks */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Remarks <span className="text-red-500">*</span>
        </label>
        <textarea
          name="remark"
          value={form.remark}
          onChange={handleChange}
          rows={4}
          placeholder="Enter reason for leave..."
          className="w-full px-4 py-2.5 border border-primary-200/50 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 dark:focus:border-primary-500 transition-all duration-200 text-sm resize-none"
        />
        {errors.remark && (
          <p className="text-red-500 text-xs mt-1.5">{errors.remark}</p>
        )}
      </div>

      {/* Proof */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Attach Proof Document (Optional)
        </label>
        <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400 border border-primary-200/50 dark:border-primary-500/30 rounded-xl text-sm font-medium cursor-pointer hover:bg-primary-100 dark:hover:bg-primary-500/20 transition-colors duration-200">
          <Upload size={16} />
          Upload Document
          <input
            type="file"
            name="proof"
            onChange={handleChange}
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          />
        </label>
        {form.proof && (
          <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
            <FileText size={14} className="text-gray-500 dark:text-gray-400" />
            <span className="text-xs text-gray-600 dark:text-gray-400 flex-1 truncate">{form.proof.name}</span>
            <button
              type="button"
              onClick={() => setForm(prev => ({ ...prev, proof: null }))}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
            >
              <X size={14} className="text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={() => setForm({
            leaveTypeId: "",
            effectiveFrom: "",
            effectiveTo: "",
            remark: "",
            proof: null,
          })}
          className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700 transition-all duration-200"
          disabled={submitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2.5 text-sm font-medium bg-primary-500 text-white rounded-xl hover:bg-primary-600 shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit Request"}
        </button>
      </div>
    </form>
  );
}
