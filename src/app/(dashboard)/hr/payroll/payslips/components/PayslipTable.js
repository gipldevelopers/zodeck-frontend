// src/app/(dashboard)/hr/payroll/payslips/components/PayslipTable.js
"use client";
import { useState, useMemo, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import { ChevronUp, ChevronDown, Eye, Download, Mail, FileText } from 'lucide-react';
import Pagination from '@/components/common/Pagination';
import PayslipFilters from './PayslipFilters';
import { payrollService } from '../../../../../../services/hr-services/payroll.service';

export default function PayslipTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [periodFilter, setPeriodFilter] = useState('all');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const fetchPayslips = async () => {
      try {
        setLoading(true);
        const response = await payrollService.getAllPayslips({
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
          search: globalFilter,
          status: statusFilter !== 'all' ? statusFilter : '',
          period: periodFilter !== 'all' ? periodFilter : ''
        });
        setData(response.data.payslips || []);
        setTotalItems(response.data.pagination?.totalItems || 0);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching payslips:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayslips();
  }, [pagination.pageIndex, pagination.pageSize, globalFilter, statusFilter, periodFilter]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'payslipId',
        header: 'Payslip ID',
        cell: info => <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{info.getValue()}</span>,
      },
      {
        accessorKey: 'employee',
        header: 'Employee',
        cell: info => (
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {info.row.original.employee?.firstName} {info.row.original.employee?.lastName}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {info.row.original.employee?.employeeId}
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'period',
        header: 'Period',
        cell: info => <span className="text-sm text-gray-600 dark:text-gray-400">{info.getValue()}</span>,
      },
      {
        accessorKey: 'issueDate',
        header: 'Issue Date',
        cell: info => <span className="text-sm text-gray-600 dark:text-gray-400">{payrollService.formatDate(info.getValue())}</span>,
      },
      {
        accessorKey: 'basicSalary',
        header: 'Basic Salary',
        cell: info => <span className="text-sm font-medium text-gray-900 dark:text-white">{payrollService.formatCurrency(info.getValue())}</span>,
      },
      {
        accessorKey: 'netSalary',
        header: 'Net Salary',
        cell: info => <span className="text-sm font-bold text-green-600 dark:text-green-400">{payrollService.formatCurrency(info.getValue())}</span>,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: info => {
          const status = info.getValue()?.toUpperCase();
          let statusClass = '';
          if (status === 'PAID' || status === 'COMPLETED') {
            statusClass = 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
          } else if (status === 'PENDING' || status === 'DRAFT') {
            statusClass = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
          } else {
            statusClass = 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
          }
          return (
            <span className={`px-2.5 py-0.5 rounded-xs text-xs font-medium ${statusClass}`}>
              {status}
            </span>
          );
        },
      },
      {
        accessorKey: 'paymentMethod',
        header: 'Payment Method',
        cell: info => <span className="text-sm text-gray-600 dark:text-gray-400">{info.getValue() || 'N/A'}</span>,
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: info => (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleView(info.row.original)}
              className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all duration-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
              title="View Payslip"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDownload(info.row.original)}
              className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-all duration-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
              title="Download PDF"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleEmail(info.row.original)}
              className="p-2 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition-all duration-200 dark:bg-purple-900/30 dark:text-purple-400 dark:hover:bg-purple-900/50"
              title="Email Payslip"
            >
              <Mail className="w-4 h-4" />
            </button>
          </div>
        ),
        enableSorting: false,
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      pagination,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(totalItems / pagination.pageSize),
  });

  // Get unique values for filter dropdowns
  const statuses = useMemo(() => {
    return ['all', 'PAID', 'PENDING', 'FAILED'];
  }, []);

  const periods = useMemo(() => {
    const uniquePeriods = new Set(data.map(item => item.period));
    return ['all', ...Array.from(uniquePeriods)];
  }, [data]);

  // Clear all filters
  const clearFilters = () => {
    setStatusFilter('all');
    setPeriodFilter('all');
    setGlobalFilter('');
  };

  // Handle actions
  const handleView = (payslip) => {
    window.open(`/hr/payroll/payslips/view/${payslip.id}`, '_blank');
  };

  const handleDownload = async (payslip) => {
    try {
      const blob = await payrollService.downloadPayslip(payslip.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payslip-${payslip.payslipId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error downloading payslip:', err);
      alert('Failed to download payslip');
    }
  };

  const handleEmail = async (payslip) => {
    if (!payslip.employee?.email) {
      alert('Employee email not found');
      return;
    }

    try {
      await payrollService.sendPayslipEmail(payslip.id, payslip.employee.email);
      alert('Payslip sent successfully to ' + payslip.employee.email);
    } catch (err) {
      console.error('Error sending payslip email:', err);
      alert('Failed to send payslip email: ' + err.message);
    }
  };

  if (loading && data.length === 0) {
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

  return (
    <div className="p-4 sm:p-6">
      {/* Header with stats */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 sm:gap-0">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Employee Payslips</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage and distribute employee payslips
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg dark:bg-blue-900/30 dark:text-blue-400">
          <FileText size={18} />
          <span className="font-medium">Total: {totalItems} payslips</span>
        </div>
      </div>

      {/* Filters Section */}
      <div className="mb-6">
        <PayslipFilters
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          periodFilter={periodFilter}
          setPeriodFilter={setPeriodFilter}
          statuses={statuses}
          periods={periods}
          onClearFilters={clearFilters}
        />
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
          Error: {error}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm relative">
        {loading && (
          <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 flex items-center justify-center z-10 transition-opacity">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
        <div className="min-w-[1000px] md:min-w-full text-center">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} className="border-b border-gray-200 dark:border-gray-700">
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      className="px-3 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider dark:text-gray-300"
                      {...(header.column.getCanSort() ? {
                        onClick: header.column.getToggleSortingHandler(),
                        className: "px-3 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-150"
                      } : {})}
                    >
                      <div className="flex items-center">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && (
                          <>
                            {{
                              asc: <ChevronUp className="ml-1 w-4 h-4 text-blue-500" />,
                              desc: <ChevronDown className="ml-1 w-4 h-4 text-blue-500" />,
                            }[header.column.getIsSorted()] ?? (
                                <div className="ml-1 flex flex-col">
                                  <ChevronUp className="w-3 h-3 -mb-0.5 text-gray-400" />
                                  <ChevronDown className="w-3 h-3 -mt-0.5 text-gray-400" />
                                </div>
                              )}
                          </>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map(row => (
                  <tr
                    key={row.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-150"
                  >
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-3 py-4 whitespace-nowrap text-left">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-3 py-8 text-center text-gray-500 dark:text-gray-400">
                    No payslips found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Component */}
      <Pagination
        currentPage={pagination.pageIndex + 1}
        totalItems={totalItems}
        itemsPerPage={pagination.pageSize}
        onPageChange={(page) => setPagination(prev => ({ ...prev, pageIndex: page - 1 }))}
        onItemsPerPageChange={(size) => {
          setPagination({ pageIndex: 0, pageSize: size });
        }}
        className="mt-6"
      />
    </div>
  );
}
