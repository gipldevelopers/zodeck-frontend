'use client';

import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { policyRuleService } from '@/services/super-admin-services/policy-rule.service';
import Breadcrumb from '@/components/common/Breadcrumb';
import PolicyForm from '../_components/PolicyForm';

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
        <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8 font-sans">
            <Toaster position="top-right" />
            <Breadcrumb pageName="Create Policy" />

            <div className="mt-6 rounded-xl border border-gray-200 bg-white shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 border-b pb-2">Create New Policy</h2>
                <PolicyForm onSubmit={handleSubmit} onCancel={handleCancel} />
            </div>
        </div>
    );
}
