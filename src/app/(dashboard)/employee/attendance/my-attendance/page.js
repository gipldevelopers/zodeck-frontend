"use client";
import { useState, useMemo } from "react";
import Breadcrumb from "@/components/common/Breadcrumb";
import BreadcrumbRightContent from "../components/BreadcrumbRightContent";
import Pagination from "@/components/common/Pagination";
import { Clock, Search, Filter, X, ChevronUp, ChevronDown, Calendar, CheckCircle, AlertCircle, Timer, Briefcase } from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";

// Mock employee attendance data
const defaultData = [
  { id: "Att-001", date: "01 Sep 2025", checkIn: "09:15 AM", checkOut: "06:10 PM", break: "01:00", late: "00:15", productionHours: "07:55", status: "Present" },
  { id: "Att-002", date: "02 Sep 2025", checkIn: "09:45 AM", checkOut: "06:05 PM", break: "01:00", late: "00:45", productionHours: "07:20", status: "Late" },
  { id: "Att-003", date: "03 Sep 2025", checkIn: "--", checkOut: "--", break: "--", late: "--", productionHours: "00:00", status: "Absent" },
  { id: "Att-004", date: "04 Sep 2025", checkIn: "09:10 AM", checkOut: "02:00 PM", break: "00:30", late: "00:00", productionHours: "04:20", status: "Half Day" },
  { id: "Att-005", date: "05 Sep 2025", checkIn: "09:00 AM", checkOut: "07:00 PM", break: "01:00", late: "00:00", productionHours: "08:00", status: "Overtime" },
  { id: "Att-006", date: "06 Sep 2025", checkIn: "09:05 AM", checkOut: "06:15 PM", break: "01:00", late: "00:05", productionHours: "08:10", status: "Present" },
  { id: "Att-007", date: "07 Sep 2025", checkIn: "09:20 AM", checkOut: "06:05 PM", break: "01:00", late: "00:20", productionHours: "07:45", status: "Late" },
];

// Filters component
function AttendanceFilters({ globalFilter, setGlobalFilter, statusFilter, setStatusFilter, statuses, onClearFilters }) {
  const hasActiveFilters = statusFilter !== 'all' || globalFilter;
  
  const statusConfig = {
    'all': { label: 'All Status', icon: Filter, color: 'gray' },
    'Present': { label: 'Present', icon: CheckCircle, color: 'green' },
    'Late': { label: 'Late', icon: AlertCircle, color: 'yellow' },
    'Absent': { label: 'Absent', icon: X, color: 'red' },
    'Half Day': { label: 'Half Day', icon: Timer, color: 'blue' },
    'Overtime': { label: 'Overtime', icon: Briefcase, color: 'purple' },
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-primary-100/50 dark:border-gray-700 shadow-sm mb-6">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1 w-full lg:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by date or status..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-primary-200/50 dark:border-gray-600 rounded-xl bg-gray-50/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 dark:focus:border-primary-500 transition-all duration-200 text-sm"
          />
        </div>
        
        {/* Status Filter */}
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:flex-initial">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full lg:w-auto appearance-none pl-10 pr-8 py-2.5 border border-primary-200/50 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 dark:focus:border-primary-500 transition-all duration-200 text-sm cursor-pointer"
            >
              {statuses.map(s => (
                <option key={s} value={s}>
                  {statusConfig[s]?.label || s}
                </option>
              ))}
            </select>
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
          </div>
          
          {hasActiveFilters && (
            <button 
              onClick={onClearFilters} 
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors duration-200"
            >
              <X size={16} />
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Main page
export default function MyAttendance() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [data, setData] = useState(defaultData);
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const statuses = useMemo(() => ['all', 'Present', 'Late', 'Absent', 'Half Day', 'Overtime'], []);

  const filteredData = useMemo(() => {
    let result = [...data];
    if (globalFilter) {
      const term = globalFilter.toLowerCase();
      result = result.filter(d =>
        d.date.toLowerCase().includes(term) ||
        d.status.toLowerCase().includes(term)
      );
    }
    if (statusFilter !== 'all') {
      result = result.filter(d => d.status === statusFilter);
    }
    return result;
  }, [data, globalFilter, statusFilter]);

  const columns = useMemo(() => [
    { 
      accessorKey: 'date', 
      header: 'Date', 
      enableSorting: true,
      cell: info => (
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-primary-500" />
          <span className="font-medium text-gray-700 dark:text-gray-300">{info.getValue()}</span>
        </div>
      )
    },
    { 
      accessorKey: 'checkIn', 
      header: 'Check In', 
      enableSorting: true,
      cell: info => (
        <span className="text-gray-700 dark:text-gray-300 font-medium">{info.getValue()}</span>
      )
    },
    { 
      accessorKey: 'checkOut', 
      header: 'Check Out', 
      enableSorting: true,
      cell: info => (
        <span className="text-gray-700 dark:text-gray-300 font-medium">{info.getValue()}</span>
      )
    },
    { 
      accessorKey: 'break', 
      header: 'Break', 
      enableSorting: true,
      cell: info => (
        <span className="text-gray-600 dark:text-gray-400">{info.getValue()}</span>
      )
    },
    { 
      accessorKey: 'late', 
      header: 'Late', 
      enableSorting: true,
      cell: info => {
        const value = info.getValue();
        if (value === '--') {
          return <span className="text-gray-400">--</span>;
        }
        return <span className="text-red-600 dark:text-red-400 font-medium">{value}</span>;
      }
    },
    { 
      accessorKey: 'productionHours', 
      header: 'Work Hours', 
      enableSorting: true,
      cell: info => (
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-primary-500" />
          <span className="font-semibold text-gray-900 dark:text-gray-100">{info.getValue()}</span>
        </div>
      )
    },
    { 
      accessorKey: 'status', 
      header: 'Status', 
      enableSorting: true,
      cell: info => {
        const attStatus = info.getValue();
        const statusConfig = {
          'Present': { bg: 'bg-primary-50 dark:bg-primary-500/10', text: 'text-primary-700 dark:text-primary-400', border: 'border-primary-200 dark:border-primary-500/30' },
          'Late': { bg: 'bg-yellow-50 dark:bg-yellow-500/10', text: 'text-yellow-700 dark:text-yellow-400', border: 'border-yellow-200 dark:border-yellow-500/30' },
          'Absent': { bg: 'bg-red-50 dark:bg-red-500/10', text: 'text-red-700 dark:text-red-400', border: 'border-red-200 dark:border-red-500/30' },
          'Half Day': { bg: 'bg-blue-50 dark:bg-blue-500/10', text: 'text-blue-700 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-500/30' },
          'Overtime': { bg: 'bg-purple-50 dark:bg-purple-500/10', text: 'text-purple-700 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-500/30' },
        };
        const config = statusConfig[attStatus] || { bg: 'bg-gray-50 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-400', border: 'border-gray-200 dark:border-gray-700' };
        return (
          <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold border ${config.bg} ${config.text} ${config.border}`}>
            {attStatus}
          </span>
        );
      }
    },
  ], []);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    pageCount: Math.ceil(filteredData.length / pagination.pageSize),
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Breadcrumb
          title="My Attendance"
          subtitle="View your attendance records and track your work hours"
          rightContent={<BreadcrumbRightContent selectedDate={selectedDate} setSelectedDate={setSelectedDate} />}
        />

        <AttendanceFilters
          globalFilter={globalFilter} 
          setGlobalFilter={setGlobalFilter}
          statusFilter={statusFilter} 
          setStatusFilter={setStatusFilter}
          statuses={statuses}
          onClearFilters={() => { 
            setGlobalFilter(''); 
            setStatusFilter('all'); 
            setPagination({ pageIndex: 0, pageSize: 10 }); 
          }}
        />

        {/* Table Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-primary-100/50 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gradient-to-r from-primary-50/50 to-primary-50/30 dark:from-gray-800 dark:to-gray-800 border-b border-primary-100/50 dark:border-gray-700">
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th
                        key={header.id}
                        className={`px-5 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider ${
                          header.column.getCanSort() ? 'cursor-pointer hover:bg-primary-50/50 dark:hover:bg-gray-700/50 transition-colors' : ''
                        }`}
                        {...(header.column.getCanSort() ? { onClick: header.column.getToggleSortingHandler() } : {})}
                      >
                        <div className="flex items-center gap-2">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getCanSort() && (
                            <span className="text-gray-400">
                              {header.column.getIsSorted() === 'asc' ? (
                                <ChevronUp size={14} />
                              ) : header.column.getIsSorted() === 'desc' ? (
                                <ChevronDown size={14} />
                              ) : (
                                <div className="flex flex-col -space-y-1">
                                  <ChevronUp size={10} className="text-gray-300" />
                                  <ChevronDown size={10} className="text-gray-300" />
                                </div>
                              )}
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-primary-100/30 dark:divide-gray-700">
                {table.getRowModel().rows.length > 0 ? table.getRowModel().rows.map((row, index) => (
                  <tr 
                    key={row.id} 
                    className="hover:bg-primary-50/30 dark:hover:bg-gray-700/30 transition-colors duration-150"
                  >
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-5 py-4 text-sm">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={columns.length} className="text-center py-16">
                      <div className="flex flex-col items-center gap-3">
                        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full">
                          <Calendar size={32} className="text-gray-400" />
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">No attendance records found</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500">Try adjusting your filters</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={pagination.pageIndex + 1}
          totalItems={filteredData.length}
          itemsPerPage={pagination.pageSize}
          onPageChange={page => table.setPageIndex(page - 1)}
          onItemsPerPageChange={size => { 
            table.setPageSize(size); 
            table.setPageIndex(0); 
            setPagination({ pageIndex: 0, pageSize: size });
          }}
          className="mt-6"
        />
      </div>
    </div>
  );
}
