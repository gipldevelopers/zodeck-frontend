"use client";
import { Download, DollarSign } from 'lucide-react';
import Link from 'next/link';

export default function PayrollWidget({ data }) {
    if (!data) return <div className="animate-pulse h-32 bg-gray-100 rounded-lg"></div>;

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 h-full">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                    <DollarSign size={20} />
                </div>
                <h3 className="font-bold text-gray-800 dark:text-white">Payroll Snapshot</h3>
            </div>

            <div className="flex flex-col justify-between h-[calc(100%-60px)]">
                <div>
                    <p className="text-sm text-gray-500 mb-1">Last Payslip ({data.month})</p>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white flex items-baseline gap-1">
                        <span className="text-lg font-medium text-gray-400">{data.currency}</span>
                        {data.lastPayslipAmount?.toLocaleString()}
                    </div>
                </div>

                <div className="pt-4 mt-auto">
                    <Link href={`/employee/payroll/download/${data.id}`} className="flex items-center justify-center gap-2 w-full py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors font-medium text-sm">
                        <Download size={16} /> Download Payslip
                    </Link>
                </div>
            </div>
        </div>
    );
}
