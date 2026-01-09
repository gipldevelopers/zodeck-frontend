"use client";
import { useState, useMemo } from "react";
import Breadcrumb from "@/components/common/Breadcrumb";
import BreadcrumbRightContent from "../components/BreadcrumbRightContent";
import Pagination from "@/components/common/Pagination";
import { Clock } from "lucide-react";
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
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm mb-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 min-w-[250px]">
          <input
            type="text"
            placeholder="Search by date or status..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full pl-3 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div className="flex gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white"
          >
            {statuses.map(s => <option key={s} value={s}>{s === 'all' ? 'All Status' : s}</option>)}
          </select>
          {hasActiveFilters && (
            <button onClick={onClearFilters} className="px-3 py-2 text-red-600 hover:text-red-800 dark:text-red-400">
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
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });

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
    { accessorKey: 'date', header: 'Date', enableSorting: true },
    { accessorKey: 'checkIn', header: 'Check In', enableSorting: true },
    { accessorKey: 'checkOut', header: 'Check Out', enableSorting: true },
    { accessorKey: 'break', header: 'Break', enableSorting: true },
    { accessorKey: 'late', header: 'Late', cell: info => <span className="text-red-600">{info.getValue()}</span>, enableSorting: true },
    { accessorKey: 'productionHours', header: 'Work Hours', cell: info => <div className="flex items-center gap-1"><Clock className="w-3 h-3 text-gray-400" /> {info.getValue()}</div>, enableSorting: true },
    { accessorKey: 'status', header: 'Status', cell: info => {
        const attStatus = info.getValue();
        const statusClass = attStatus === 'Present' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                            attStatus === 'Late' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                            attStatus === 'Absent' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                            attStatus === 'Half Day' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                            attStatus === 'Overtime' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
        return <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass}`}>{attStatus}</span>;
      }, enableSorting: true
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
    <div className="bg-gray-50 min-h-screen dark:bg-gray-900">
      <Breadcrumb
        title="My Attendance"
        subtitle="View your attendance records"
        rightContent={<BreadcrumbRightContent selectedDate={selectedDate} setSelectedDate={setSelectedDate} />}
      />

      <AttendanceFilters
        globalFilter={globalFilter} setGlobalFilter={setGlobalFilter}
        statusFilter={statusFilter} setStatusFilter={setStatusFilter}
        statuses={statuses}
        onClearFilters={() => { setGlobalFilter(''); setStatusFilter('all'); setPagination({ pageIndex: 0, pageSize: 5 }); }}
      />

      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <table className="w-full min-w-[600px]">
          <thead className="bg-gray-100 dark:bg-gray-800">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className={`px-3 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 ${header.column.getCanSort() ? 'cursor-pointer' : ''}`}
                    {...(header.column.getCanSort() ? { onClick: header.column.getToggleSortingHandler() } : {})}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getCanSort() && (
                      header.column.getIsSorted() === 'asc' ? ' 🔼' :
                      header.column.getIsSorted() === 'desc' ? ' 🔽' : null
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {table.getRowModel().rows.length > 0 ? table.getRowModel().rows.map(row => (
              <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                ))}
              </tr>
            )) : (
              <tr>
                <td colSpan={columns.length} className="text-center py-6 text-gray-500 dark:text-gray-400">
                  No attendance records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={pagination.pageIndex + 1}
        totalItems={filteredData.length}
        itemsPerPage={pagination.pageSize}
        onPageChange={page => table.setPageIndex(page - 1)}
        onItemsPerPageChange={size => { table.setPageSize(size); table.setPageIndex(0); }}
        className="mt-4"
      />
    </div>
  );
}
