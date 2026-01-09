'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import toast, { Toaster } from 'react-hot-toast';
import {
  Plus,
  Edit2,
  Trash2,
  MapPin,
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
  FileJson,
} from 'lucide-react';
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild
} from '@headlessui/react';
import Select from 'react-select';
import React from 'react';

import { policyRuleService } from '@/services/super-admin-services/policy-rule.service';
import { companyOrganizationService } from '@/services/super-admin-services/companyOrganization.service';
import Breadcrumb from '@/components/common/Breadcrumb';

// Modal Component for Assignment Only
const Modal = ({ isOpen, onClose, title, children }) => {
  return (
    <Transition show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                      <DialogTitle
                        as="h3"
                        className="text-lg font-semibold leading-6 text-gray-900 border-b pb-2 mb-4"
                      >
                        {title}
                      </DialogTitle>
                      <div className="mt-2 text-sm">{children}</div>
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default function PolicyRulePage() {
  const router = useRouter(); // For navigation to Add/Edit pages
  const [policies, setPolicies] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useState({ page: 1, limit: 10, type: '' });
  const [totalDocs, setTotalDocs] = useState(0);

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  // Fetch Policies
  const fetchPolicies = async () => {
    setLoading(true);
    try {
      const response = await policyRuleService.getPolicies(params);
      if (response?.data?.policies) {
        setPolicies(response.data.policies);
        setTotalDocs(response.data.pagination?.total || 0);
      } else {
        setPolicies(response.docs || response.policies || []);
        setTotalDocs(response.totalDocs || response.total || 0);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch policies');
    } finally {
      setLoading(false);
    }
  };

  // Fetch Locations (for Assingment)
  const fetchLocations = async () => {
    try {
      const response = await companyOrganizationService.getLocations();
      const locs = Array.isArray(response) ? response : (response.docs || []);
      setLocations(locs.map(l => ({ value: l.id, label: l.name })));
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch locations');
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, [params]);

  useEffect(() => {
    fetchLocations();
  }, []);

  // Formik for Assign
  const assignFormik = useFormik({
    initialValues: {
      locationIds: [], // array of objects {value, label}
    },
    onSubmit: async (values) => {
      try {
        const payload = {
          policyId: selectedPolicy.id,
          locationIds: values.locationIds.map((l) => l.value),
        };
        await policyRuleService.assignPolicy(payload);
        toast.success('Policy assigned successfully');
        setIsAssignModalOpen(false);
      } catch (error) {
        toast.error('Failed to assign policy');
      }
    },
  });

  // Navigate to Create Page
  const handleCreate = () => {
    router.push('/super-admin/policy-rule/add');
  };

  // Navigate to Edit Page
  const handleEdit = (policy) => {
    router.push(`/super-admin/policy-rule/edit/${policy.id}`);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this policy?')) {
      try {
        await policyRuleService.deletePolicy(id);
        toast.success('Policy deleted successfully');
        fetchPolicies();
      } catch (error) {
        toast.error('Failed to delete policy');
      }
    }
  };

  const handleAssignClick = (policy) => {
    setSelectedPolicy(policy);
    assignFormik.resetForm();
    setIsAssignModalOpen(true);
  };

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8 font-sans">
      <Toaster position="top-right" />
      <Breadcrumb pageName="Policy & Rule Engine" />

      {/* Header & Controls */}
      <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row shadow-sm p-4 bg-white rounded-lg border border-gray-100">
        <div className="relative w-full sm:w-72">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search policies..."
              className="w-full rounded-md border border-gray-200 py-2 pl-9 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex w-full items-center justify-end gap-3 sm:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              className="rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              value={params.type}
              onChange={(e) => setParams({ ...params, type: e.target.value, page: 1 })}
            >
              <option value="">All Types</option>
              <option value="ATTENDANCE">Attendance</option>
              <option value="LEAVE">Leave</option>
              <option value="PAYROLL">Payroll</option>
              <option value="EXPENSE">Expense</option>
            </select>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
          >
            <Plus className="h-4 w-4" />
            Create Policy
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          </div>
        ) : policies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <FileJson className="h-16 w-16 text-gray-300 mb-4" />
            <p className="text-lg font-medium">No policies found</p>
            <p className="text-sm">Create a new policy to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-500">
              <thead className="bg-gray-50 text-xs uppercase text-gray-700 font-bold tracking-wider border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Summary</th>
                  <th className="px-6 py-4">Version</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {policies.map((policy) => (
                  <tr key={policy.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{policy.name}</div>
                      <div className="text-xs text-gray-400 mt-0.5 max-w-xs">{policy.description}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                        {policy.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 text-xs text-gray-500">
                        {policy.type === 'ATTENDANCE' && (
                          <>
                            <span>Shift: {policy.shiftStart || (policy.rules && policy.rules.shiftStart)} - {policy.shiftEnd || (policy.rules && policy.rules.shiftEnd)}</span>
                            <span>Grace: {policy.gracePeriodMinutes || (policy.rules && policy.rules.gracePeriodMinutes) || 0}m</span>
                          </>
                        )}
                        {policy.type === 'LEAVE' && (
                          <>
                            <span>Annual: {policy.annualLeaveCount || (policy.rules && policy.rules.annualLeaveCount)} days</span>
                            <span>Sick: {policy.sickLeaveCount || (policy.rules && policy.rules.sickLeaveCount)} days</span>
                          </>
                        )}
                        {policy.type === 'PAYROLL' && (
                          <>
                            <span>Cycle: {policy.salaryCycleStartDay || (policy.rules && policy.rules.salaryCycleStartDay)}-{policy.salaryCycleEndDay || (policy.rules && policy.rules.salaryCycleEndDay)}</span>
                            <span>Tax: {policy.taxDeductionMethod || (policy.rules && policy.rules.taxDeductionMethod)}</span>
                          </>
                        )}
                        {policy.type === 'EXPENSE' && (
                          <>
                            <span>Travel: {policy.travelClassAllowed || (policy.rules && policy.rules.travelClassAllowed)}</span>
                            <span>Limit: {policy.autoApprovalLimit || (policy.rules && policy.rules.autoApprovalLimit)}</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">v{policy.version}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium ${policy.isActive
                          ? 'bg-green-50 text-green-700'
                          : 'bg-red-50 text-red-700'
                          }`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${policy.isActive ? 'bg-green-600' : 'bg-red-600'}`}></span>
                        {policy.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleAssignClick(policy)}
                          className="rounded-md p-1.5 text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          title="Assign to Locations"
                        >
                          <MapPin className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(policy)}
                          className="rounded-md p-1.5 text-gray-500 hover:bg-yellow-50 hover:text-yellow-600 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(policy.id)}
                          className="rounded-md p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="border-t border-gray-200 px-4 py-3 sm:px-6 flex justify-between items-center">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{(params.page - 1) * params.limit + 1}</span> to <span className="font-medium">{Math.min(params.page * params.limit, totalDocs)}</span> of <span className="font-medium">{totalDocs}</span> results
          </div>
          <div className="flex gap-2">
            <button
              disabled={params.page <= 1}
              onClick={() => setParams(p => ({ ...p, page: p.page - 1 }))}
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              disabled={params.page * params.limit >= totalDocs}
              onClick={() => setParams(p => ({ ...p, page: p.page + 1 }))}
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Assign Modal */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title="Assign Policy to Locations"
      >
        <form onSubmit={assignFormik.handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Locations</label>
            <Select
              isMulti
              options={locations}
              value={assignFormik.values.locationIds}
              onChange={(option) => assignFormik.setFieldValue('locationIds', option)}
              className="text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">Select one or more locations to apply this policy.</p>
          </div>

          <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
            <button
              type="submit"
              className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:col-start-2"
            >
              Assign Policy
            </button>
            <button
              type="button"
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
              onClick={() => setIsAssignModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
