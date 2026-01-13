// // src\app\(dashboard)\super-admin\policy-rule\add\page.js
// 'use client';

// import { useRouter } from 'next/navigation';
// import toast, { Toaster } from 'react-hot-toast';
// import { policyRuleService } from '@/services/super-admin-services/policy-rule.service';
// import Breadcrumb from '@/components/common/Breadcrumb';
// import PolicyForm from '../_components/PolicyForm';

// export default function CreatePolicyPage() {
//     const router = useRouter();

//     const handleSubmit = async (values) => {
//         try {
//             await policyRuleService.createPolicy(values);
//             toast.success('Policy created successfully');
//             router.push('/super-admin/policy-rule');
//         } catch (error) {
//             console.error(error);
//             toast.error('Failed to create policy');
//         }
//     };

//     const handleCancel = () => {
//         router.push('/super-admin/policy-rule');
//     };

//     return (
//         <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8 font-sans">
//             <Toaster position="top-right" />
//             <Breadcrumb pageName="Create Policy" />

//             <div className="mt-6 rounded-xl border border-gray-200 bg-white shadow-sm p-6">
//                 <h2 className="text-lg font-semibold text-gray-900 mb-6 border-b pb-2">Create New Policy</h2>
//                 <PolicyForm onSubmit={handleSubmit} onCancel={handleCancel} />
//             </div>
//         </div>
//     );
// }


"use client";

import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { policyRuleService } from '@/services/super-admin-services/policy-rule.service';
import Breadcrumb from '@/components/common/Breadcrumb';
import PolicyForm from '../_components/PolicyForm';
import { FileText } from 'lucide-react';

export default function CreatePolicyPage() {
    const router = useRouter();

    const handleSubmit = async (values) => {
        try {
            await policyRuleService.createPolicy(values);
            toast.success('Policy created successfully');
            router.push('/super-admin/policy-rule');
        } catch (error) {
            console.error(error);
            toast.error('Failed to create policy');
        }
    };

    const handleCancel = () => {
        router.push('/super-admin/policy-rule');
    };

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 pb-12 relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-gray-900 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem] dark:bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)]"></div>
            
            <Toaster position="top-right" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Breadcrumb pageName="Create Policy" />
                    <div className="mt-4 flex items-center gap-3">
                        <div className="p-3 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-600/20 text-white">
                            <FileText className="h-8 w-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                                Policy Configuration
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 mt-1">
                                Define automated rules for attendance, leave, payroll, and expenses.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form Container */}
                <PolicyForm onSubmit={handleSubmit} onCancel={handleCancel} />
            </div>
        </div>
    );
}