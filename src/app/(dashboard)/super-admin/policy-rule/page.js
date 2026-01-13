// // src\app\(dashboard)\super-admin\policy-rule\page.js
// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useFormik } from 'formik';
// import toast, { Toaster } from 'react-hot-toast';
// import {
//   Plus,
//   Edit2,
//   Trash2,
//   MapPin,
//   Search,
//   ChevronLeft,
//   ChevronRight,
//   Filter,
//   FileJson,
// } from 'lucide-react';
// import {
//   Dialog,
//   DialogPanel,
//   DialogTitle,
//   Transition,
//   TransitionChild
// } from '@headlessui/react';
// import Select from 'react-select';
// import React from 'react';

// import { policyRuleService } from '@/services/super-admin-services/policy-rule.service';
// import { companyOrganizationService } from '@/services/super-admin-services/companyOrganization.service';
// import Breadcrumb from '@/components/common/Breadcrumb';

// // Modal Component for Assignment Only
// const Modal = ({ isOpen, onClose, title, children }) => {
//   return (
//     <Transition show={isOpen} as={React.Fragment}>
//       <Dialog as="div" className="relative z-50" onClose={onClose}>
//         <TransitionChild
//           as={React.Fragment}
//           enter="ease-out duration-300"
//           enterFrom="opacity-0"
//           enterTo="opacity-100"
//           leave="ease-in duration-200"
//           leaveFrom="opacity-100"
//           leaveTo="opacity-0"
//         >
//           <div className="fixed inset-0 bg-black/25 bg-opacity-75 transition-opacity" />
//         </TransitionChild>

//         <div className="fixed inset-0 z-10 overflow-y-auto">
//           <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
//             <TransitionChild
//               as={React.Fragment}
//               enter="ease-out duration-300"
//               enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
//               enterTo="opacity-100 translate-y-0 sm:scale-100"
//               leave="ease-in duration-200"
//               leaveFrom="opacity-100 translate-y-0 sm:scale-100"
//               leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
//             >
//               <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md">
//                 <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
//                   <div className="sm:flex sm:items-start">
//                     <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
//                       <DialogTitle
//                         as="h3"
//                         className="text-lg font-semibold leading-6 text-gray-900 border-b pb-2 mb-4"
//                       >
//                         {title}
//                       </DialogTitle>
//                       <div className="mt-2 text-sm">{children}</div>
//                     </div>
//                   </div>
//                 </div>
//               </DialogPanel>
//             </TransitionChild>
//           </div>
//         </div>
//       </Dialog>
//     </Transition>
//   );
// };

// export default function PolicyRulePage() {
//   const router = useRouter(); // For navigation to Add/Edit pages
//   const [policies, setPolicies] = useState([]);
//   const [locations, setLocations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [params, setParams] = useState({ page: 1, limit: 10, type: '' });
//   const [totalDocs, setTotalDocs] = useState(0);

//   const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
//   const [selectedPolicy, setSelectedPolicy] = useState(null);

//   // Fetch Policies
//   const fetchPolicies = async () => {
//     setLoading(true);
//     try {
//       const response = await policyRuleService.getPolicies(params);
//       if (response?.data?.policies) {
//         setPolicies(response.data.policies);
//         setTotalDocs(response.data.pagination?.total || 0);
//       } else {
//         setPolicies(response.docs || response.policies || []);
//         setTotalDocs(response.totalDocs || response.total || 0);
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error('Failed to fetch policies');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch Locations (for Assingment)
//   const fetchLocations = async () => {
//     try {
//       const response = await companyOrganizationService.getLocations();
//       const locs = Array.isArray(response) ? response : (response.docs || []);
//       setLocations(locs.map(l => ({ value: l.id, label: l.name })));
//     } catch (error) {
//       console.error(error);
//       toast.error('Failed to fetch locations');
//     }
//   };

//   useEffect(() => {
//     fetchPolicies();
//   }, [params]);

//   useEffect(() => {
//     fetchLocations();
//   }, []);

//   // Formik for Assign
//   const assignFormik = useFormik({
//     initialValues: {
//       locationIds: [], // array of objects {value, label}
//     },
//     onSubmit: async (values) => {
//       try {
//         const payload = {
//           policyId: selectedPolicy.id,
//           locationIds: values.locationIds.map((l) => l.value),
//         };
//         await policyRuleService.assignPolicy(payload);
//         toast.success('Policy assigned successfully');
//         setIsAssignModalOpen(false);
//       } catch (error) {
//         toast.error('Failed to assign policy');
//       }
//     },
//   });

//   // Navigate to Create Page
//   const handleCreate = () => {
//     router.push('/super-admin/policy-rule/add');
//   };

//   // Navigate to Edit Page
//   const handleEdit = (policy) => {
//     router.push(`/super-admin/policy-rule/edit/${policy.id}`);
//   };

//   const handleDelete = async (id) => {
//     if (confirm('Are you sure you want to delete this policy?')) {
//       try {
//         await policyRuleService.deletePolicy(id);
//         toast.success('Policy deleted successfully');
//         fetchPolicies();
//       } catch (error) {
//         toast.error('Failed to delete policy');
//       }
//     }
//   };

//   const handleAssignClick = (policy) => {
//     setSelectedPolicy(policy);
//     assignFormik.resetForm();
//     setIsAssignModalOpen(true);
//   };

//   return (
//     <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8 font-sans">
//       <Toaster position="top-right" />
//       <Breadcrumb pageName="Policy & Rule Engine" />

//       {/* Header & Controls */}
//       <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row shadow-sm p-4 bg-white rounded-lg border border-gray-100">
//         <div className="relative w-full sm:w-72">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search policies..."
//               className="w-full rounded-md border border-gray-200 py-2 pl-9 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
//             />
//           </div>
//         </div>

//         <div className="flex w-full items-center justify-end gap-3 sm:w-auto">
//           <div className="flex items-center gap-2">
//             <Filter className="h-4 w-4 text-gray-500" />
//             <select
//               className="rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
//               value={params.type}
//               onChange={(e) => setParams({ ...params, type: e.target.value, page: 1 })}
//             >
//               <option value="">All Types</option>
//               <option value="ATTENDANCE">Attendance</option>
//               <option value="LEAVE">Leave</option>
//               <option value="PAYROLL">Payroll</option>
//               <option value="EXPENSE">Expense</option>
//             </select>
//           </div>
//           <button
//             onClick={handleCreate}
//             className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
//           >
//             <Plus className="h-4 w-4" />
//             Create Policy
//           </button>
//         </div>
//       </div>

//       {/* Content */}
//       <div className="mt-6 rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
//         {loading ? (
//           <div className="flex h-64 items-center justify-center">
//             <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
//           </div>
//         ) : policies.length === 0 ? (
//           <div className="flex flex-col items-center justify-center py-20 text-gray-500">
//             <FileJson className="h-16 w-16 text-gray-300 mb-4" />
//             <p className="text-lg font-medium">No policies found</p>
//             <p className="text-sm">Create a new policy to get started</p>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full text-left text-sm text-gray-500">
//               <thead className="bg-gray-50 text-xs uppercase text-gray-700 font-bold tracking-wider border-b border-gray-100">
//                 <tr>
//                   <th className="px-6 py-4">Name</th>
//                   <th className="px-6 py-4">Type</th>
//                   <th className="px-6 py-4">Summary</th>
//                   <th className="px-6 py-4">Version</th>
//                   <th className="px-6 py-4">Status</th>
//                   <th className="px-6 py-4 text-right">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-100">
//                 {policies.map((policy) => (
//                   <tr key={policy.id} className="hover:bg-gray-50 transition-colors">
//                     <td className="px-6 py-4">
//                       <div className="font-medium text-gray-900">{policy.name}</div>
//                       <div className="text-xs text-gray-400 mt-0.5 max-w-xs">{policy.description}</div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
//                         {policy.type}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="flex flex-col gap-1 text-xs text-gray-500">
//                         {policy.type === 'ATTENDANCE' && (
//                           <>
//                             <span>Shift: {policy.shiftStart || (policy.rules && policy.rules.shiftStart)} - {policy.shiftEnd || (policy.rules && policy.rules.shiftEnd)}</span>
//                             <span>Grace: {policy.gracePeriodMinutes || (policy.rules && policy.rules.gracePeriodMinutes) || 0}m</span>
//                           </>
//                         )}
//                         {policy.type === 'LEAVE' && (
//                           <>
//                             <span>Annual: {policy.annualLeaveCount || (policy.rules && policy.rules.annualLeaveCount)} days</span>
//                             <span>Sick: {policy.sickLeaveCount || (policy.rules && policy.rules.sickLeaveCount)} days</span>
//                           </>
//                         )}
//                         {policy.type === 'PAYROLL' && (
//                           <>
//                             <span>Cycle: {policy.salaryCycleStartDay || (policy.rules && policy.rules.salaryCycleStartDay)}-{policy.salaryCycleEndDay || (policy.rules && policy.rules.salaryCycleEndDay)}</span>
//                             <span>Tax: {policy.taxDeductionMethod || (policy.rules && policy.rules.taxDeductionMethod)}</span>
//                           </>
//                         )}
//                         {policy.type === 'EXPENSE' && (
//                           <>
//                             <span>Travel: {policy.travelClassAllowed || (policy.rules && policy.rules.travelClassAllowed)}</span>
//                             <span>Limit: {policy.autoApprovalLimit || (policy.rules && policy.rules.autoApprovalLimit)}</span>
//                           </>
//                         )}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 text-gray-600">v{policy.version}</td>
//                     <td className="px-6 py-4">
//                       <span
//                         className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium ${policy.isActive
//                           ? 'bg-green-50 text-green-700'
//                           : 'bg-red-50 text-red-700'
//                           }`}
//                       >
//                         <span className={`h-1.5 w-1.5 rounded-full ${policy.isActive ? 'bg-green-600' : 'bg-red-600'}`}></span>
//                         {policy.isActive ? 'Active' : 'Inactive'}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 text-right">
//                       <div className="flex items-center justify-end gap-2">
//                         <button
//                           onClick={() => handleAssignClick(policy)}
//                           className="rounded-md p-1.5 text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"
//                           title="Assign to Locations"
//                         >
//                           <MapPin className="h-4 w-4" />
//                         </button>
//                         <button
//                           onClick={() => handleEdit(policy)}
//                           className="rounded-md p-1.5 text-gray-500 hover:bg-yellow-50 hover:text-yellow-600 transition-colors"
//                           title="Edit"
//                         >
//                           <Edit2 className="h-4 w-4" />
//                         </button>
//                         <button
//                           onClick={() => handleDelete(policy.id)}
//                           className="rounded-md p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
//                           title="Delete"
//                         >
//                           <Trash2 className="h-4 w-4" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//         <div className="border-t border-gray-200 px-4 py-3 sm:px-6 flex justify-between items-center">
//           <div className="text-sm text-gray-700">
//             Showing <span className="font-medium">{(params.page - 1) * params.limit + 1}</span> to <span className="font-medium">{Math.min(params.page * params.limit, totalDocs)}</span> of <span className="font-medium">{totalDocs}</span> results
//           </div>
//           <div className="flex gap-2">
//             <button
//               disabled={params.page <= 1}
//               onClick={() => setParams(p => ({ ...p, page: p.page - 1 }))}
//               className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
//             >
//               <ChevronLeft className="h-4 w-4" />
//             </button>
//             <button
//               disabled={params.page * params.limit >= totalDocs}
//               onClick={() => setParams(p => ({ ...p, page: p.page + 1 }))}
//               className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
//             >
//               <ChevronRight className="h-4 w-4" />
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Assign Modal */}
//       <Modal
//         isOpen={isAssignModalOpen}
//         onClose={() => setIsAssignModalOpen(false)}
//         title="Assign Policy to Locations"
//       >
//         <form onSubmit={assignFormik.handleSubmit} className="space-y-4 text-left">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Select Locations</label>
//             <Select
//               isMulti
//               options={locations}
//               value={assignFormik.values.locationIds}
//               onChange={(option) => assignFormik.setFieldValue('locationIds', option)}
//               className="text-sm"
//             />
//             <p className="text-xs text-gray-500 mt-1">Select one or more locations to apply this policy.</p>
//           </div>

//           <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
//             <button
//               type="submit"
//               className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:col-start-2"
//             >
//               Assign Policy
//             </button>
//             <button
//               type="button"
//               className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
//               onClick={() => setIsAssignModalOpen(false)}
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </Modal>

//     </div>
//   );
// }


// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useFormik } from 'formik';
// import toast, { Toaster } from 'react-hot-toast';
// import {
//   Plus, Edit2, Trash2, MapPin, Search,
//   ChevronLeft, ChevronRight, Filter, Clock, Calendar, DollarSign, Receipt, LayoutGrid, List
// } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';
// import Select from 'react-select';
// import React from 'react';

// // Custom Services & Components
// import { policyRuleService } from '@/services/super-admin-services/policy-rule.service';
// import { companyOrganizationService } from '@/services/super-admin-services/companyOrganization.service';
// import Breadcrumb from '@/components/common/Breadcrumb';
// import ConfirmationDialog from '@/components/common/ConfirmationDialog'; // Reusing your existing dialog

// // --- Helper: Policy Type Config ---
// const POLICY_CONFIG = {
//   ATTENDANCE: { icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
//   LEAVE: { icon: Calendar, color: 'text-pink-600', bg: 'bg-pink-50', border: 'border-pink-200' },
//   PAYROLL: { icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
//   EXPENSE: { icon: Receipt, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
// };

// // --- Modal Component (Styled) ---
// const Modal = ({ isOpen, onClose, title, children }) => {
//   if (!isOpen) return null;
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
//       <motion.div 
//         initial={{ opacity: 0, scale: 0.95 }}
//         animate={{ opacity: 1, scale: 1 }}
//         exit={{ opacity: 0, scale: 0.95 }}
//         className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100 dark:border-gray-700"
//       >
//         <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
//           <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
//         </div>
//         <div className="p-6">{children}</div>
//       </motion.div>
//     </div>
//   );
// };

// export default function PolicyRulePage() {
//   const router = useRouter();
//   const [policies, setPolicies] = useState([]);
//   const [locations, setLocations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [params, setParams] = useState({ page: 1, limit: 9, type: '' }); // Limit 9 for Grid View
//   const [totalDocs, setTotalDocs] = useState(0);
//   const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

//   // Modal States
//   const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [selectedPolicy, setSelectedPolicy] = useState(null);

//   // Fetch Policies
//   const fetchPolicies = async () => {
//     setLoading(true);
//     try {
//       const response = await policyRuleService.getPolicies(params);
//       if (response?.data?.policies) {
//         setPolicies(response.data.policies);
//         setTotalDocs(response.data.pagination?.total || 0);
//       } else {
//         setPolicies(response.docs || response.policies || []);
//         setTotalDocs(response.totalDocs || response.total || 0);
//       }
//     } catch (error) {
//       toast.error('Failed to fetch policies');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch Locations
//   useEffect(() => {
//     const fetchLocs = async () => {
//       try {
//         const response = await companyOrganizationService.getLocations();
//         const locs = Array.isArray(response) ? response : (response.docs || []);
//         setLocations(locs.map(l => ({ value: l.id, label: l.name })));
//       } catch (error) { console.error(error); }
//     };
//     fetchLocs();
//   }, []);

//   useEffect(() => { fetchPolicies(); }, [params]);

//   // Formik for Assignment
//   const assignFormik = useFormik({
//     initialValues: { locationIds: [] },
//     onSubmit: async (values) => {
//       try {
//         await policyRuleService.assignPolicy({
//           policyId: selectedPolicy.id,
//           locationIds: values.locationIds.map((l) => l.value),
//         });
//         toast.success('Policy assigned successfully');
//         setIsAssignModalOpen(false);
//       } catch (error) {
//         toast.error('Failed to assign policy');
//       }
//     },
//   });

//   // Handlers
//   const handleAssignClick = (policy) => {
//     setSelectedPolicy(policy);
//     assignFormik.resetForm();
//     setIsAssignModalOpen(true);
//   };

//   const handleDeleteClick = (policy) => {
//     setSelectedPolicy(policy);
//     setDeleteDialogOpen(true);
//   };

//   const handleDeleteConfirm = async () => {
//     try {
//       await policyRuleService.deletePolicy(selectedPolicy.id);
//       toast.success('Policy deleted');
//       fetchPolicies();
//     } catch (error) {
//       toast.error('Failed to delete');
//     } finally {
//       setDeleteDialogOpen(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 pb-12 relative">
//       {/* Background Decor */}
//       <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-gray-900 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem] dark:bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)]"></div>
      
//       <Toaster position="top-right" />

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="mb-8">
//            <Breadcrumb pageName="Policy & Rule Engine" />
//            <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
//               <div>
//                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Policies</h1>
//                  <p className="text-gray-500 dark:text-gray-400 mt-1">Manage automation rules for your organization.</p>
//               </div>
//               <button
//                 onClick={() => router.push('/super-admin/policy-rule/add')}
//                 className="group inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-700 hover:scale-105 active:scale-95"
//               >
//                 <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
//                 <span>Create Policy</span>
//               </button>
//            </div>
//         </div>

//         {/* --- Toolbar --- */}
//         <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between bg-white dark:bg-gray-800 p-2 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
           
//            {/* Search & Filter */}
//            <div className="flex items-center gap-3 w-full sm:w-auto px-2">
//               <div className="relative flex-1 sm:w-64">
//                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//                  <input 
//                     type="text" 
//                     placeholder="Search policies..." 
//                     className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
//                  />
//               </div>
//               <div className="relative">
//                  <select 
//                     className="appearance-none pl-9 pr-8 py-2 bg-gray-50 dark:bg-gray-900 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
//                     value={params.type}
//                     onChange={(e) => setParams({ ...params, type: e.target.value, page: 1 })}
//                  >
//                     <option value="">All Types</option>
//                     <option value="ATTENDANCE">Attendance</option>
//                     <option value="LEAVE">Leave</option>
//                     <option value="PAYROLL">Payroll</option>
//                     <option value="EXPENSE">Expense</option>
//                  </select>
//                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
//               </div>
//            </div>

//            {/* View Toggle */}
//            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
//               <button 
//                  onClick={() => setViewMode('grid')}
//                  className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-gray-600 shadow-sm text-indigo-600' : 'text-gray-500'}`}
//               >
//                  <LayoutGrid size={18} />
//               </button>
//               <button 
//                  onClick={() => setViewMode('list')}
//                  className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow-sm text-indigo-600' : 'text-gray-500'}`}
//               >
//                  <List size={18} />
//               </button>
//            </div>
//         </div>

//         {/* --- Content Grid --- */}
//         {loading ? (
//            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               {[1,2,3].map(i => <div key={i} className="h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse"></div>)}
//            </div>
//         ) : policies.length === 0 ? (
//            <div className="flex flex-col items-center justify-center py-24 text-gray-400 bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
//               <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-full mb-4">
//                  <Filter size={32} />
//               </div>
//               <p className="text-lg font-medium text-gray-900 dark:text-white">No policies found</p>
//               <p className="text-sm">Try adjusting your filters or create a new one.</p>
//            </div>
//         ) : (
//            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
//               <AnimatePresence>
//                  {policies.map((policy, index) => {
//                     const config = POLICY_CONFIG[policy.type] || { icon: Filter, color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200' };
//                     const Icon = config.icon;

//                     return (
//                        <motion.div
//                           key={policy.id}
//                           initial={{ opacity: 0, y: 20 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           transition={{ delay: index * 0.05 }}
//                           className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
//                        >
//                           {/* Card Header */}
//                           <div className="flex justify-between items-start mb-4">
//                              <div className={`p-3 rounded-xl ${config.bg} ${config.color}`}>
//                                 <Icon size={24} />
//                              </div>
//                              <div className={`px-2.5 py-1 rounded-full text-xs font-bold border ${policy.isActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
//                                 {policy.isActive ? 'ACTIVE' : 'DRAFT'}
//                              </div>
//                           </div>

//                           {/* Content */}
//                           <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">{policy.name}</h3>
//                           <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-6 h-10">
//                              {policy.description || "No description provided."}
//                           </p>

//                           {/* Meta Data */}
//                           <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700 text-xs font-medium text-gray-500">
//                              <span>v{policy.version}</span>
//                              <span>{new Date(policy.createdAt).toLocaleDateString()}</span>
//                           </div>

//                           {/* Quick Actions Overlay (Visible on Hover) */}
//                           <div className="absolute inset-0 bg-white/90 dark:bg-gray-800/95 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-3 rounded-2xl">
//                              <div className="flex gap-2">
//                                 <button 
//                                    onClick={() => handleAssignClick(policy)}
//                                    className="p-3 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 hover:scale-110 transition-all" 
//                                    title="Assign"
//                                 >
//                                    <MapPin size={20} />
//                                 </button>
//                                 <button 
//                                    onClick={() => router.push(`/super-admin/policy-rule/edit/${policy.id}`)}
//                                    className="p-3 rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-100 hover:scale-110 transition-all" 
//                                    title="Edit"
//                                 >
//                                    <Edit2 size={20} />
//                                 </button>
//                                 <button 
//                                    onClick={() => handleDeleteClick(policy)}
//                                    className="p-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 hover:scale-110 transition-all" 
//                                    title="Delete"
//                                 >
//                                    <Trash2 size={20} />
//                                 </button>
//                              </div>
//                              <span className="text-sm font-bold text-gray-900 dark:text-white">Manage Policy</span>
//                           </div>
//                        </motion.div>
//                     );
//                  })}
//               </AnimatePresence>
//            </div>
//         )}

//         {/* Pagination */}
//         <div className="mt-8 flex justify-center gap-2">
//            <button
//               disabled={params.page <= 1}
//               onClick={() => setParams(p => ({ ...p, page: p.page - 1 }))}
//               className="p-2 rounded-lg border bg-white dark:bg-gray-800 hover:bg-gray-50 disabled:opacity-50"
//            >
//               <ChevronLeft size={20} />
//            </button>
//            <span className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300">
//               Page {params.page}
//            </span>
//            <button
//               disabled={params.page * params.limit >= totalDocs}
//               onClick={() => setParams(p => ({ ...p, page: p.page + 1 }))}
//               className="p-2 rounded-lg border bg-white dark:bg-gray-800 hover:bg-gray-50 disabled:opacity-50"
//            >
//               <ChevronRight size={20} />
//            </button>
//         </div>
//       </div>

//       {/* --- Modals --- */}
//       <Modal isOpen={isAssignModalOpen} title="Assign Policy" onClose={() => setIsAssignModalOpen(false)}>
//          <form onSubmit={assignFormik.handleSubmit} className="space-y-6">
//             <div>
//                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Locations</label>
//                <Select
//                   isMulti
//                   options={locations}
//                   value={assignFormik.values.locationIds}
//                   onChange={(option) => assignFormik.setFieldValue('locationIds', option)}
//                   className="text-sm"
//                   styles={{
//                      control: (base) => ({ ...base, borderRadius: '0.75rem', padding: '2px', borderColor: '#e5e7eb' })
//                   }}
//                />
//                <p className="text-xs text-gray-500 mt-2">The selected policy will be enforced at these locations.</p>
//             </div>
//             <div className="flex justify-end gap-3">
//                <button 
//                   type="button" 
//                   onClick={() => setIsAssignModalOpen(false)}
//                   className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
//                >
//                   Cancel
//                </button>
//                <button 
//                   type="submit"
//                   className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-lg shadow-indigo-500/30 transition-all"
//                >
//                   Confirm Assignment
//                </button>
//             </div>
//          </form>
//       </Modal>

//       <ConfirmationDialog
//         isOpen={deleteDialogOpen}
//         onClose={() => setDeleteDialogOpen(false)}
//         onConfirm={handleDeleteConfirm}
//         title="Delete Policy"
//         message={`Are you sure you want to delete "${selectedPolicy?.name}"? This action cannot be undone.`}
//         confirmText="Delete"
//         isDestructive={true}
//       />
//     </div>
//   );
// }

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import toast, { Toaster } from 'react-hot-toast';
import {
  Plus, Edit, Trash2, MapPin, Search,
  ChevronLeft, ChevronRight, Filter, Clock, Calendar, 
  DollarSign, Receipt, FileText
} from 'lucide-react';
import {
  Dialog, DialogPanel, DialogTitle, Transition, TransitionChild
} from '@headlessui/react';
import Select from 'react-select';
import React, { Fragment } from 'react';

import { policyRuleService } from '@/services/super-admin-services/policy-rule.service';
import { companyOrganizationService } from '@/services/super-admin-services/companyOrganization.service';
import Breadcrumb from '@/components/common/Breadcrumb';
import ConfirmationDialog from '@/components/common/ConfirmationDialog';

// --- Configuration ---
const POLICY_STYLES = {
  ATTENDANCE: { 
    icon: Clock, 
    label: 'Attendance', 
    badge: 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-600/20' 
  },
  LEAVE: { 
    icon: Calendar, 
    label: 'Leave', 
    badge: 'bg-purple-50 text-purple-700 border-purple-200 ring-purple-600/20' 
  },
  PAYROLL: { 
    icon: DollarSign, 
    label: 'Payroll', 
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-600/20' 
  },
  EXPENSE: { 
    icon: Receipt, 
    label: 'Expense', 
    badge: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-600/20' 
  },
};

// --- Assignment Modal ---
const AssignModal = ({ isOpen, onClose, title, children }) => {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" />
        </TransitionChild>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-md border border-gray-100">
                <div className="bg-white px-6 py-6">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                      <DialogTitle as="h3" className="text-xl font-bold leading-6 text-gray-900 mb-1">
                        {title}
                      </DialogTitle>
                      <p className="text-sm text-gray-500 mb-6">Configure where this policy applies.</p>
                      {children}
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
  const router = useRouter();
  const [policies, setPolicies] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useState({ page: 1, limit: 10, type: '' });
  const [totalDocs, setTotalDocs] = useState(0);

  // Modal States
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  // Fetch Data
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
      toast.error('Failed to fetch policies');
    } finally {
      setLoading(false);
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await companyOrganizationService.getLocations();
      const locs = Array.isArray(response) ? response : (response.docs || []);
      setLocations(locs.map(l => ({ value: l.id, label: l.name })));
    } catch (error) { console.error(error); }
  };

  useEffect(() => { fetchPolicies(); }, [params]);
  useEffect(() => { fetchLocations(); }, []);

  // Formik for Assignment
  const assignFormik = useFormik({
    initialValues: { locationIds: [] },
    onSubmit: async (values) => {
      try {
        await policyRuleService.assignPolicy({
          policyId: selectedPolicy.id,
          locationIds: values.locationIds.map((l) => l.value),
        });
        toast.success('Policy assigned successfully');
        setIsAssignModalOpen(false);
      } catch (error) {
        toast.error('Failed to assign policy');
      }
    },
  });

  // Handlers
  const handleAssignClick = (policy) => {
    setSelectedPolicy(policy);
    assignFormik.resetForm();
    setIsAssignModalOpen(true);
  };

  const handleDeleteClick = (policy) => {
    setSelectedPolicy(policy);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await policyRuleService.deletePolicy(selectedPolicy.id);
      toast.success('Policy deleted');
      fetchPolicies();
    } catch (error) {
      toast.error('Failed to delete');
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 pb-12 relative">
      {/* Background Decor */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-gray-900 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem] dark:bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)]"></div>
      
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <Breadcrumb pageName="Policy & Rule Engine" />
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
            </div>
            
            <button
              onClick={() => router.push('/super-admin/policy-rule/add')}
              className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-gray-900/10 hover:bg-gray-800 transition-all dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              <span>Create Policy</span>
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between bg-white dark:bg-gray-800 p-2 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
           <div className="flex items-center gap-3 w-full sm:w-auto px-2">
              {/* Search */}
              <div className="relative flex-1 sm:w-80 group">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                 <input 
                    type="text" 
                    placeholder="Search policies by name..." 
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-800 transition-all placeholder:text-gray-400"
                 />
              </div>

              {/* Type Filter */}
              <div className="relative">
                 <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500 z-10" />
                 <select 
                    className="appearance-none pl-9 pr-8 py-2 bg-gray-50 dark:bg-gray-900 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer border-none hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
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
           </div>
        </div>

        {/* Table Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          {loading ? (
             <div className="flex flex-col items-center justify-center py-20">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
                <p className="mt-4 text-sm text-gray-500 font-medium">Loading policies...</p>
             </div>
          ) : policies.length === 0 ? (
             <div className="flex flex-col items-center justify-center py-24 text-gray-400">
                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-full mb-4 border border-gray-100 dark:border-gray-800">
                   <FileText size={32} className="text-gray-300 dark:text-gray-600" />
                </div>
                <p className="text-lg font-medium text-gray-900 dark:text-white">No policies found</p>
                <p className="text-sm">Create a new policy to get started.</p>
             </div>
          ) : (
             <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                   <thead className="bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                      <tr>
                         <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Policy Name</th>
                         <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                         <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Configuration Summary</th>
                         <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                         <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                      {policies.map((policy) => {
                         const style = POLICY_STYLES[policy.type] || { badge: 'bg-gray-100 text-gray-600', icon: FileText };
                         const TypeIcon = style.icon;

                         return (
                            <tr key={policy.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors duration-200">
                               <td className="px-6 py-4">
                                  <div className="flex flex-col">
                                     <span className="font-semibold text-gray-900 dark:text-white text-sm">{policy.name}</span>
                                     <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1 max-w-[200px]">
                                        {policy.description || "No description provided"}
                                     </span>
                                  </div>
                               </td>
                               <td className="px-6 py-4">
                                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${style.badge}`}>
                                     <TypeIcon size={12} />
                                     {policy.type}
                                  </span>
                               </td>
                               <td className="px-6 py-4">
                                  <div className="flex flex-col gap-1 text-xs text-gray-600 dark:text-gray-300">
                                     {policy.type === 'ATTENDANCE' && (
                                        <>
                                           <span className="flex items-center gap-1"><Clock size={10} className="text-gray-400"/> Shift: {policy.shiftStart || '-'} to {policy.shiftEnd || '-'}</span>
                                           <span>Grace: {policy.gracePeriodMinutes || 0}m</span>
                                        </>
                                     )}
                                     {policy.type === 'LEAVE' && (
                                        <>
                                           <span>Annual: {policy.annualLeaveCount || 0} days</span>
                                           <span>Sick: {policy.sickLeaveCount || 0} days</span>
                                        </>
                                     )}
                                     {policy.type === 'PAYROLL' && (
                                        <>
                                           <span>Cycle: {policy.salaryCycleStartDay}-{policy.salaryCycleEndDay}</span>
                                           <span>Tax: {policy.taxDeductionMethod}</span>
                                        </>
                                     )}
                                     {policy.type === 'EXPENSE' && (
                                        <>
                                           <span>Limit: ${policy.autoApprovalLimit || 0}</span>
                                           <span>Class: {policy.travelClassAllowed}</span>
                                        </>
                                     )}
                                  </div>
                               </td>
                               <td className="px-6 py-4">
                                  <div className="flex items-center gap-2">
                                     {policy.isActive ? (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900">
                                           <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span> Active
                                        </span>
                                     ) : (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700">
                                           <span className="h-1.5 w-1.5 rounded-full bg-gray-400"></span> Inactive
                                        </span>
                                     )}
                                     <span className="text-[10px] font-mono text-gray-400 bg-gray-50 dark:bg-gray-800 px-1.5 rounded border border-gray-100 dark:border-gray-700">
                                        v{policy.version}
                                     </span>
                                  </div>
                               </td>
                               <td className="px-6 py-4 text-right">
                                  {/* Consistent Actions Buttons */}
                                  <div className="flex items-center justify-end gap-2">
                                     <button 
                                        onClick={() => handleAssignClick(policy)}
                                        className="p-2 rounded-lg text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-indigo-900/50 transition-colors" 
                                        title="Assign to Location"
                                     >
                                        <MapPin size={16} />
                                     </button>
                                     <button 
                                        onClick={() => router.push(`/super-admin/policy-rule/edit/${policy.id}`)}
                                        className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-blue-600 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors" 
                                        title="Edit Policy"
                                     >
                                        <Edit size={16} />
                                     </button>
                                     <button 
                                        onClick={() => handleDeleteClick(policy)}
                                        className="p-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-900/20 transition-colors" 
                                        title="Delete Policy"
                                     >
                                        <Trash2 size={16} />
                                     </button>
                                  </div>
                               </td>
                            </tr>
                         );
                      })}
                   </tbody>
                </table>
             </div>
          )}
          
          {/* Footer Pagination */}
          <div className="border-t border-gray-100 dark:border-gray-700 px-6 py-4 bg-gray-50/50 dark:bg-gray-900/50 flex items-center justify-between">
             <span className="text-sm text-gray-500 dark:text-gray-400">
                Showing <span className="font-medium text-gray-900 dark:text-white">{(params.page - 1) * params.limit + 1}</span> - <span className="font-medium text-gray-900 dark:text-white">{Math.min(params.page * params.limit, totalDocs)}</span> of {totalDocs}
             </span>
             <div className="flex gap-2">
                <button
                   disabled={params.page <= 1}
                   onClick={() => setParams(p => ({ ...p, page: p.page - 1 }))}
                   className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
                >
                   <ChevronLeft size={16} />
                </button>
                <button
                   disabled={params.page * params.limit >= totalDocs}
                   onClick={() => setParams(p => ({ ...p, page: p.page + 1 }))}
                   className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
                >
                   <ChevronRight size={16} />
                </button>
             </div>
          </div>
        </div>
      </div>

      {/* --- Assign Modal --- */}
      <AssignModal 
        isOpen={isAssignModalOpen} 
        title="Assign Policy to Locations" 
        onClose={() => setIsAssignModalOpen(false)}
      >
         <form onSubmit={assignFormik.handleSubmit} className="space-y-6">
            <div>
               <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Select Locations</label>
               <Select
                  isMulti
                  options={locations}
                  value={assignFormik.values.locationIds}
                  onChange={(option) => assignFormik.setFieldValue('locationIds', option)}
                  className="text-sm"
                  styles={{
                     control: (base) => ({ 
                        ...base, 
                        borderRadius: '0.75rem', 
                        padding: '4px', 
                        borderColor: '#e5e7eb',
                        boxShadow: 'none',
                        '&:hover': { borderColor: '#d1d5db' }
                     }),
                     multiValue: (base) => ({
                        ...base,
                        borderRadius: '0.5rem',
                        backgroundColor: '#eff6ff',
                     }),
                     multiValueLabel: (base) => ({
                        ...base,
                        color: '#1d4ed8',
                        fontWeight: '500',
                     })
                  }}
               />
            </div>
            <div className="flex justify-end gap-3 pt-2">
               <button 
                  type="button" 
                  onClick={() => setIsAssignModalOpen(false)}
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
               >
                  Cancel
               </button>
               <button 
                  type="submit"
                  className="px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-500/20 transition-all"
               >
                  Confirm Assignment
               </button>
            </div>
         </form>
      </AssignModal>

      {/* --- Delete Confirmation --- */}
      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Policy"
        message={`Are you sure you want to delete "${selectedPolicy?.name}"? This action cannot be undone.`}
        confirmText="Delete Policy"
        isDestructive={true}
      />
    </div>
  );
}
