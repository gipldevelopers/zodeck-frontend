'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import {
    Plus,
    Edit2,
    Trash2,
    GitBranch,
    Search,
    Filter,
    Copy,
    CheckCircle2,
    XCircle,
    ChevronRight,
    ChevronLeft
} from 'lucide-react';
import Breadcrumb from '@/components/common/Breadcrumb';
import { workflowManageService } from '@/services/super-admin-services/workflow-manage.service';

export default function WorkflowManagementPage() {
    const router = useRouter();
    const [workflows, setWorkflows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [params, setParams] = useState({ page: 1, limit: 10, type: '', isActive: '' });
    const [totalDocs, setTotalDocs] = useState(0);

    const fetchWorkflows = async () => {
        setLoading(true);
        try {
            const response = await workflowManageService.getAllWorkflows(params);
            if (response?.data?.workflows) {
                setWorkflows(response.data.workflows);
                setTotalDocs(response.data.pagination?.total || 0);
            } else {
                // Fallback for different response structures
                setWorkflows(response.workflows || response.docs || []);
                setTotalDocs(response.pagination?.total || response.totalDocs || 0);
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch workflows');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWorkflows();
    }, [params]);

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this workflow?')) {
            try {
                await workflowManageService.deleteWorkflow(id);
                toast.success('Workflow deleted successfully');
                fetchWorkflows();
            } catch (error) {
                toast.error('Failed to delete workflow');
            }
        }
    };

    const handleClone = async (workflow) => {
        const name = prompt("Enter name for the cloned workflow:", `Copy of ${workflow.name}`);
        if (name) {
            try {
                await workflowManageService.cloneWorkflow(workflow.id, { name });
                toast.success('Workflow cloned successfully');
                fetchWorkflows();
            } catch (error) {
                toast.error('Failed to clone workflow');
            }
        }
    };

    return (
        <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8 font-sans">
            <Toaster position="top-right" />
            <Breadcrumb pageName="Workflow Management" />

            {/* Header & Controls */}
            <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row shadow-sm p-4 bg-white rounded-lg border border-gray-100">
                <div className="relative w-full sm:w-72">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search workflows..."
                            className="w-full rounded-md border border-gray-200 py-2 pl-9 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            onChange={(e) => setParams(prev => ({ ...prev, search: e.target.value, page: 1 }))}
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
                            <option value="LEAVE">Leave</option>
                            {/* <option value="ATTENDANCE_REGULARIZATION">Attendance Regularization</option> */} {/* Enum match? */}
                            <option value="EXPENSE">Expense</option>
                            {/* Add other types as needed based on backend enums */}
                        </select>
                        <select
                            className="rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                            value={params.isActive}
                            onChange={(e) => setParams({ ...params, isActive: e.target.value, page: 1 })}
                        >
                            <option value="">All Status</option>
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </select>
                    </div>
                    <button
                        onClick={() => router.push('/super-admin/workflow-management/add')}
                        className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                    >
                        <Plus className="h-4 w-4" />
                        Create Workflow
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="mt-6 rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex h-64 items-center justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                    </div>
                ) : workflows.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                        <GitBranch className="h-16 w-16 text-gray-300 mb-4" />
                        <p className="text-lg font-medium">No workflows found</p>
                        <p className="text-sm">Create a new workflow to get started</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-500">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-700 font-bold tracking-wider border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Type</th>
                                    <th className="px-6 py-4">Steps</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {workflows.map((workflow) => (
                                    <tr key={workflow.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{workflow.name}</div>
                                            <div className="text-xs text-gray-400 mt-0.5 max-w-xs">{workflow.description}</div>
                                            {workflow.isDefault && (
                                                <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20 mt-1">Default</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                                                {workflow.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1">
                                                <div className="flex -space-x-2 overflow-hidden">
                                                    {workflow.steps?.map((step, idx) => (
                                                        <div key={idx} className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 ring-2 ring-white text-xs font-medium text-indigo-800" title={step.name}>
                                                            {step.stepNumber}
                                                        </div>
                                                    ))}
                                                </div>
                                                <span className="text-xs ml-2">({workflow.steps?.length || 0} Levels)</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1">
                                                {workflow.isActive ? (
                                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                ) : (
                                                    <XCircle className="w-4 h-4 text-gray-400" />
                                                )}
                                                <span className={workflow.isActive ? 'text-green-700' : 'text-gray-500'}>
                                                    {workflow.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleClone(workflow)}
                                                    className="rounded-md p-1.5 text-gray-500 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                                                    title="Clone"
                                                >
                                                    <Copy className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => router.push(`/super-admin/workflow-management/edit/${workflow.id}`)}
                                                    className="rounded-md p-1.5 text-gray-500 hover:bg-yellow-50 hover:text-yellow-600 transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(workflow.id)}
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
        </div>
    );
}
