"use client";
import Breadcrumb from '@/components/common/Breadcrumb';
import AttendanceStatsCards from './components/AttendanceStatsCards';
import { useState, useEffect } from 'react';
import AttendanceTable from './components/AttendanceTable';
import BreadcrumbRightContent from './components/BreadcrumbRightContent';
import { attendanceService } from '../../../../services/hr-services/attendace.service';
import { toast } from 'react-hot-toast';

export default function AttendanceDashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch statistics when date changes
  useEffect(() => {
    fetchDashboardStats();
  }, [selectedDate]);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const response = await attendanceService.getDashboardStats({ date: dateStr });
      setStatsData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error(error.message || 'Failed to fetch dashboard statistics');
      setStatsData(null);
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen dark:bg-gray-900 p-4 sm:p-6">
      {/* Breadcrumb with Date Filter and Actions */}
      <Breadcrumb
        title="Attendance Dashboard"
        subtitle="Overview of today's attendance statistics and patterns"
        rightContent={
          <BreadcrumbRightContent
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Attendance Stats Cards */}
          <div className="bg-white rounded-lg shadow dark:bg-gray-800 p-4 sm:p-6">
            <AttendanceStatsCards
              selectedDate={selectedDate}
              statsData={statsData}
              loading={loading}
            />
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-lg shadow dark:bg-gray-800">
        <AttendanceTable selectedDate={selectedDate} />
      </div>
    </div>
  );
};