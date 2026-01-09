// src/app/(dashboard)/hr/payroll/components/RecentPayrollRuns.js
"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, Download, Calendar, ChevronUp, ChevronDown } from 'lucide-react';
import { payrollService } from '../../../../../services/hr-services/payroll.service';

export default function RecentPayrollRuns() {
  const router = useRouter();
  const [sortField, setSortField] = useState('processedDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [payrollRuns, setPayrollRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    totalItems: 0,
    totalPages: 1
  });

  useEffect(() => {
    const fetchPayrollRuns = async () => {
      try {
        setLoading(true);
        const response = await payrollService.getRecentPayrollRuns({
          page: pagination.page,
          limit: pagination.limit
        });
        setPayrollRuns(response.data.payrollRuns || []);
        setPagination(response.data.pagination || pagination);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching payroll runs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayrollRuns();
  }, [pagination.page, pagination.limit]);

  // Sort payroll runs based on selected field and direction
  const sortedRuns = [...payrollRuns].sort((a, b) => {
    if (sortDirection === 'asc') {
      return a[sortField] > b[sortField] ? 1 : -1;
    } else {
      return a[sortField] < b[sortField] ? 1 : -1;
    }
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Completed':
      case 'PROCESSED':
      case 'PAID':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Pending':
      case 'DRAFT':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Failed':
      case 'FAILED':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ?
      <ChevronUp className="ml-1 w-4 h-4 text-blue-500" /> :
      <ChevronDown className="ml-1 w-4 h-4 text-blue-500" />;
  };

  const handleViewDetails = (run) => {
    router.push(`/hr/payroll/history?runId=${run.id}`);
  };

  const handleDownloadReports = async (run) => {
    try {
      // Download payroll report
      const blob = await payrollService.downloadReport(run.id, 'pdf');
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payroll-report-${run.payrollId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error downloading report:', err);
      alert('Failed to download report');
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6 animate-pulse"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6">
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
          <p className="text-red-600 dark:text-red-400">Error loading payroll runs: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 sm:gap-0">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Recent Payroll Runs
        </h2>
        <button
          className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition w-full sm:w-auto justify-center"
          onClick={() => router.push('/hr/payroll/process')}
        >
          <Calendar size={16} />
          Process New Payroll
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="min-w-[1000px]">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-150"
                  onClick={() => handleSort('payrollId')}
                >
                  <div className="flex items-center">
                    Payroll ID
                    <SortIcon field="payrollId" />
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-150"
                  onClick={() => handleSort('period')}
                >
                  <div className="flex items-center">
                    Period
                    <SortIcon field="period" />
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-150"
                  onClick={() => handleSort('processedDate')}
                >
                  <div className="flex items-center">
                    Processed Date
                    <SortIcon field="processedDate" />
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-150"
                  onClick={() => handleSort('totalAmount')}
                >
                  <div className="flex items-center">
                    Total Amount
                    <SortIcon field="totalAmount" />
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-150"
                  onClick={() => handleSort('totalEmployees')}
                >
                  <div className="flex items-center">
                    Employees
                    <SortIcon field="totalEmployees" />
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-150"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center">
                    Status
                    <SortIcon field="status" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {sortedRuns.map((run) => (
                <tr key={run.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-150">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400">
                    {run.payrollId}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {run.period}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {payrollService.formatDate(run.processedDate)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {payrollService.formatCurrency(run.totalAmount)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {run.totalEmployees}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-0.5 rounded-xs text-xs font-medium ${getStatusClass(run.status)}`}>
                      {run.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewDetails(run)}
                        className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all duration-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {(run.status === 'PROCESSED' || run.status === 'PAID') && (
                        <button
                          onClick={() => handleDownloadReports(run)}
                          className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-all duration-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
                          title="Download Reports"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing {sortedRuns.length} of {pagination.totalItems} payroll runs
        </p>
        <button
          className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          onClick={() => {
            // Navigate to all payroll history
            // router.push('/hr/payroll/history');
          }}
        >
          View All Payroll History →
        </button>
      </div>
    </div>
  );
}