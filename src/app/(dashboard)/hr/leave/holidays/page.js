"use client";
import { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import Breadcrumb from '@/components/common/Breadcrumb';
import HolidaysHeader from './components/HolidaysHeader';
import HolidaysCalendar from './components/HolidaysCalendar';
import HolidaysList from './components/HolidaysList';
import Link from 'next/link';
import { holidayService } from '../../../../../services/hr-services/leave-holiday-calender.service';
import { toast } from 'react-hot-toast';

export default function Holidays() {
  const [holidays, setHolidays] = useState([]);
  const [view, setView] = useState('list');
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear());
  const [typeFilter, setTypeFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [availableYears, setAvailableYears] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });

  // Fetch holidays and available years on mount
  useEffect(() => {
    fetchHolidays();
    fetchHolidayYears();
  }, [yearFilter, typeFilter]);

  const fetchHolidays = async () => {
    setLoading(true);
    try {
      const params = {
        page: 1,
        year: yearFilter,
        ...(typeFilter !== 'all' && { type: typeFilter }),
        limit: 100 // Get all holidays for the year
      };

      const response = await holidayService.getAllHolidays(params);

      // Extract holidays array from response.data
      if (response.success && response.data) {
        setHolidays(response.data);

        // Update pagination if available
        if (response.pagination) {
          setPagination(response.pagination);
        }
      } else {
        setHolidays([]);
      }
    } catch (error) {
      console.error('Error fetching holidays:', error);
      toast.error(error.message || 'Failed to fetch holidays');
      setHolidays([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchHolidayYears = async () => {
    try {
      const response = await holidayService.getHolidayYears();

      // Check if response has data array
      let years = [];
      if (Array.isArray(response)) {
        years = response;
      } else if (response && response.data) {
        years = response.data;
      } else if (response && Array.isArray(response)) {
        years = response;
      }

      // Ensure current year is included
      const currentYear = new Date().getFullYear();
      if (!years.includes(currentYear)) {
        years.push(currentYear);
      }

      setAvailableYears(years.sort((a, b) => b - a));
    } catch (error) {
      console.error('Error fetching holiday years:', error);
      // Set default years
      const currentYear = new Date().getFullYear();
      setAvailableYears([currentYear - 1, currentYear, currentYear + 1]);
    }
  };

  const handleDeleteHoliday = async (holidayId) => {
    if (!confirm('Are you sure you want to delete this holiday?')) {
      return;
    }

    try {
      await holidayService.deleteHoliday(holidayId);
      setHolidays(prev => prev.filter(holiday => holiday.id !== holidayId));
      toast.success('Holiday deleted successfully');
    } catch (error) {
      console.error('Error deleting holiday:', error);
      toast.error(error.message || 'Failed to delete holiday');
    }
  };

  const filteredHolidays = holidays.filter(holiday => {
    if (!holiday || !holiday.date) return false;

    try {
      const holidayYear = new Date(holiday.date).getFullYear();
      const matchesYear = holidayYear === yearFilter;
      const matchesType = typeFilter === 'all' || holiday.type === typeFilter;

      return matchesYear && matchesType;
    } catch (error) {
      console.error('Error filtering holiday:', holiday, error);
      return false;
    }
  });

  return (
    <div className="bg-gray-50 min-h-screen dark:bg-gray-900 p-4 sm:p-6">
      <Breadcrumb
        pages={[
          { name: 'HR', href: '/hr' },
          { name: 'Leave', href: '/hr/leave' },
          { name: 'Holidays', href: '#' },
        ]}
        rightContent={
          <Link
            href="/hr/leave/holidays/add"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
          >
            <PlusCircle size={18} /> Add Holiday
          </Link>
        }
      />

      <HolidaysHeader
        view={view}
        onViewChange={setView}
        yearFilter={yearFilter}
        onYearFilterChange={setYearFilter}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        totalHolidays={filteredHolidays.length}
        availableYears={availableYears}
        loading={loading}
      />

      <div className="mt-6 bg-white rounded-lg shadow dark:bg-gray-800 min-h-[400px]">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading holidays...</p>
          </div>
        ) : view === 'calendar' ? (
          <HolidaysCalendar holidays={filteredHolidays} />
        ) : (
          <HolidaysList
            holidays={filteredHolidays}
            onDeleteHoliday={handleDeleteHoliday}
          />
        )}

        {!loading && filteredHolidays.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">No holidays found for the selected filters</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              Try changing the year or type filter
            </p>
          </div>
        )}
      </div>
    </div>
  );
}