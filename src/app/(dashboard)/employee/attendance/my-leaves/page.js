"use client";

import { useState, useMemo } from "react";
import Breadcrumb from "@/components/common/Breadcrumb";
import BreadcrumbRightContent from "../components/BreadcrumbRightContent";
import Pagination from "@/components/common/Pagination";
import { useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, getPaginationRowModel, flexRender } from "@tanstack/react-table";
import { Bar } from "react-chartjs-2";
import 'chart.js/auto';
import LeavesStatsCards from "../components/LeavesStatsCards";


// --- Dummy leave data
const leaveData = [
  { id: "L-001", date: "01 Sep 2025", type: "Sick", duration: "Full Day", status: "Approved", reason: "Fever", approvedBy: "HR" },
  { id: "L-002", date: "05 Sep 2025", type: "Casual", duration: "Half Day", status: "Pending", reason: "Personal", approvedBy: "Manager" },
  { id: "L-003", date: "12 Sep 2025", type: "Earned", duration: "Full Day", status: "Rejected", reason: "Vacation", approvedBy: "HR" },
  { id: "L-004", date: "20 Sep 2025", type: "Sick", duration: "Half Day", status: "Approved", reason: "Cold", approvedBy: "Manager" },
  { id: "L-005", date: "25 Sep 2025", type: "Casual", duration: "Full Day", status: "Approved", reason: "Personal", approvedBy: "Manager" },
];

// --- Filters component
function LeaveFilters({ monthFilter, setMonthFilter, typeFilter, setTypeFilter, statusFilter, setStatusFilter, onClearFilters }) {
  const months = ["All","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const types = ["All","Casual","Sick","Earned"];
  const statuses = ["All","Pending","Approved","Rejected"];
  const hasActiveFilters = monthFilter !== "All" || typeFilter !== "All" || statusFilter !== "All";

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm mb-4 flex flex-wrap gap-4 items-center">
      <select className="border px-3 py-2 rounded" value={monthFilter} onChange={e => setMonthFilter(e.target.value)}>
        {months.map(m => <option key={m} value={m}>{m}</option>)}
      </select>
      <select className="border px-3 py-2 rounded" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
        {types.map(t => <option key={t} value={t}>{t}</option>)}
      </select>
      <select className="border px-3 py-2 rounded" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
        {statuses.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
      {hasActiveFilters && <button className="px-3 py-2 text-red-600 hover:text-red-800" onClick={onClearFilters}>Clear</button>}
    </div>
  );
}

// --- Attractive Apply Leave Form
function ApplyLeaveForm({ onSubmit }) {
  const [type, setType] = useState("Casual");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [duration, setDuration] = useState("Full Day");
  const [reason, setReason] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit({ id: `L-${Math.floor(Math.random()*1000)}`, date: startDate, type, duration, status: "Pending", reason, approvedBy: "-" });
    setType("Casual"); setStartDate(""); setEndDate(""); setDuration("Full Day"); setReason("");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg -md flex flex-col gap-6">

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    {/* Leave Type */}
    <div className="flex flex-col">
      <label className="text-gray-600 dark:text-gray-400 mb-1">Leave Type</label>
      <select
        className="border px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 outline-none"
        value={type}
        onChange={e => setType(e.target.value)}
      >
        <option value="Casual">Casual</option>
        <option value="Sick">Sick</option>
        <option value="Earned">Earned</option>
      </select>
    </div>

    {/* Start Date */}
    <div className="flex flex-col">
      <label className="text-gray-600 dark:text-gray-400 mb-1">Start Date</label>
      <input
        type="date"
        className="border px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 outline-none"
        value={startDate}
        onChange={e => setStartDate(e.target.value)}
        required
      />
    </div>

    {/* End Date */}
    <div className="flex flex-col">
      <label className="text-gray-600 dark:text-gray-400 mb-1">End Date</label>
      <input
        type="date"
        className="border px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 outline-none"
        value={endDate}
        onChange={e => setEndDate(e.target.value)}
        required
      />
    </div>

    {/* Duration */}
    <div className="flex flex-col">
      <label className="text-gray-600 dark:text-gray-400 mb-1">Duration</label>
      <select
        className="border px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 outline-none"
        value={duration}
        onChange={e => setDuration(e.target.value)}
      >
        <option value="Full Day">Full Day</option>
        <option value="Half Day">Half Day</option>
      </select>
    </div>
  </div>

  {/* Reason */}
  <div className="flex flex-col">
    <label className="text-gray-600 dark:text-gray-400 mb-1">Reason</label>
    <input
      type="text"
      className="border px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 outline-none w-full"
      placeholder="Reason for leave"
      value={reason}
      onChange={e => setReason(e.target.value)}
      required
    />
  </div>

  {/* Submit Button */}
  <button
    type="submit"
    className="w-full py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition font-semibold"
  >
    Submit Leave
  </button>
</form>

  );
}


// --- Main Leaves Page
export default function MyLeaves() {
  const [data, setData] = useState(leaveData);
  const [monthFilter, setMonthFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const filteredData = useMemo(() => data.filter(l => {
    const monthMatch = monthFilter === "All" || new Date(l.date).toLocaleString('default', { month: 'short' }) === monthFilter;
    const typeMatch = typeFilter === "All" || l.type === typeFilter;
    const statusMatch = statusFilter === "All" || l.status === statusFilter;
    return monthMatch && typeMatch && statusMatch;
  }), [data, monthFilter, typeFilter, statusFilter]);

  const columns = useMemo(() => [
    { accessorKey: "date", header: "Date" },
    { accessorKey: "type", header: "Type" },
    { accessorKey: "duration", header: "Duration" },
    { accessorKey: "status", header: "Status", cell: info => {
      const s = info.getValue();
      const color = s === "Approved" ? "bg-green-100 text-green-800" :
                    s === "Pending" ? "bg-yellow-100 text-yellow-800" :
                    "bg-red-100 text-red-800";
      return <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>{s}</span>;
    }},
    { accessorKey: "reason", header: "Reason" },
    { accessorKey: "approvedBy", header: "Approved By" },
  ], []);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { pagination, sorting, globalFilter },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    pageCount: Math.ceil(filteredData.length / pagination.pageSize),
  });

  const handleAddLeave = leave => setData([leave, ...data]);

  const chartData = useMemo(() => {
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const countsPerMonth = months.map(m => data.filter(d => new Date(d.date).toLocaleString('default',{ month: 'short'}) === m).length);
    const typeCounts = ["Casual","Sick","Earned"].map(t => data.filter(d => d.type===t).length);
    return {
      labels: months,
      datasets: [
        { label: "Total Leaves", data: countsPerMonth, backgroundColor: "#3b82f6" },
        { label: "Casual Leaves", data: Array(12).fill(typeCounts[0]), backgroundColor: "#60a5fa" },
        { label: "Sick Leaves", data: Array(12).fill(typeCounts[1]), backgroundColor: "#facc15" },
        { label: "Earned Leaves", data: Array(12).fill(typeCounts[2]), backgroundColor: "#10b981" }
      ]
    };
  }, [data]);

  return (
    <div className="bg-gray-50 min-h-screen dark:bg-gray-900">
      <Breadcrumb
        title="My Leaves"
        subtitle="View and apply leaves"
        rightContent={<BreadcrumbRightContent />}
      />

      <LeavesStatsCards leaveData={data} totalLeaves={20} />

      <LeaveFilters
        monthFilter={monthFilter} setMonthFilter={setMonthFilter}
        typeFilter={typeFilter} setTypeFilter={setTypeFilter}
        statusFilter={statusFilter} setStatusFilter={setStatusFilter}
        onClearFilters={() => { setMonthFilter("All"); setTypeFilter("All"); setStatusFilter("All"); setPagination({ pageIndex:0,pageSize:5 }) }}
      />

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <table className="w-full min-w-[600px]">
          <thead className="bg-gray-100 dark:bg-gray-800">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="px-3 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 cursor-pointer"
                      onClick={header.column.getToggleSortingHandler()}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted() ? (header.column.getIsSorted() === 'asc' ? ' 🔼' : ' 🔽') : null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {table.getRowModel().rows.length > 0 ? table.getRowModel().rows.map(row => (
              <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            )) : (
              <tr>
                <td colSpan={columns.length} className="text-center py-6 text-gray-500 dark:text-gray-400">
                  No leave records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={pagination.pageIndex + 1}
        totalItems={filteredData.length}
        itemsPerPage={pagination.pageSize}
        onPageChange={page => table.setPageIndex(page - 1)}
        onItemsPerPageChange={size => { table.setPageSize(size); table.setPageIndex(0); }}
        className="mt-4"
      />

{/* Chart Section Full Width */}
<div className="mt-6">
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm flex flex-col">
    <h3 className="font-semibold text-lg text-gray-700 dark:text-gray-200 mb-4 text-center">Leaves Overview</h3>
    <div className="flex-1">
      <Bar 
        data={chartData} 
        options={{ 
          responsive: true, 
          plugins: { legend: { position: 'top' } }, 
          maintainAspectRatio: false 
        }} 
        height={400} 
      />
    </div>
  </div>
</div>



    </div>
  );
}
