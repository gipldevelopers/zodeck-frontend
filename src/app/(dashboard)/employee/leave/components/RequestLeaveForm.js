"use client";

import { useState, useEffect } from "react";
import EmployeeLeaveService from "@/services/employee/leave.service";
import { toast } from "react-hot-toast";

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
      className="bg-white p-6 dark:bg-gray-800 rounded-2xl shadow-lg w-full space-y-6 border border-gray-200 dark:border-gray-700"
    >
      <h3 className="text-2xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
        Submit Leave Request
      </h3>

      {errors.availability && (
        <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          {errors.availability}
        </div>
      )}

      {/* Leave Type */}
      <div>
        <legend className="font-medium text-gray-700 dark:text-gray-300">
          Leave Type Name <span className="text-red-500">*</span>
        </legend>
        <select
          name="leaveTypeId"
          value={form.leaveTypeId}
          onChange={handleChange}
          disabled={loading}
          className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white"
        >
          <option value="">{loading ? "Loading..." : "Please Select Leave Type"}</option>
          {leaveTypes.map(type => (
            <option key={type.id} value={type.id}>{type.name} ({type.remaining || type.balance} remaining)</option>
          ))}
        </select>
        {errors.leaveTypeId && (
          <p className="text-red-500 text-sm mt-1">{errors.leaveTypeId}</p>
        )}
      </div>

      {/* Start & End Dates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <legend className="font-medium text-gray-700 dark:text-gray-300">
            Select From Date <span className="text-red-500">*</span>
          </legend>
          <input
            type="date"
            name="effectiveFrom"
            value={form.effectiveFrom}
            onChange={handleChange}
            onBlur={checkAvailability}
            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white"
          />
          {errors.effectiveFrom && (
            <p className="text-red-500 text-sm mt-1">{errors.effectiveFrom}</p>
          )}
        </div>
        <div>
          <legend className="font-medium text-gray-700 dark:text-gray-300">
            Select To Date <span className="text-red-500">*</span>
          </legend>
          <input
            type="date"
            name="effectiveTo"
            value={form.effectiveTo}
            onChange={handleChange}
            onBlur={checkAvailability}
            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white"
          />
          {errors.effectiveTo && (
            <p className="text-red-500 text-sm mt-1">{errors.effectiveTo}</p>
          )}
        </div>
      </div>

      {availability && availability.available && (
        <div className="text-green-600 text-sm font-medium">
          {availability.days} days(s) will be deducted.
        </div>
      )}

      {/* Remarks */}
      <div>
        <legend className="font-medium text-gray-700 dark:text-gray-300">
          Remarks <span className="text-red-500">*</span>
        </legend>
        <textarea
          name="remark"
          value={form.remark}
          onChange={handleChange}
          rows={4}
          className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white"
        />
        {errors.remark && (
          <p className="text-red-500 text-sm mt-1">{errors.remark}</p>
        )}
      </div>

      {/* Proof */}
      <div>
        <legend className="font-medium text-gray-700 dark:text-gray-300 mb-2">
          Attach Proof Document:
        </legend>

        <label className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md cursor-pointer hover:bg-blue-700 transition shadow-sm">
          Upload
          <input
            type="file"
            name="proof"
            onChange={handleChange}
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          />
        </label>

        {form.proof && (
          <p className="text-xs text-gray-600 dark:text-gray-300 mt-2">
            📄 {form.proof.name}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4 mt-6">
        <button
          type="button"
          onClick={() => setForm({
            leaveTypeId: "",
            effectiveFrom: "",
            effectiveTo: "",
            remark: "",
            proof: null,
          })}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          disabled={submitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md disabled:bg-blue-400"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </form>
  );
}
