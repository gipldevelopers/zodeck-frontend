import { Calendar, List, Filter, Calendar as CalendarIcon } from 'lucide-react';

const HolidaysHeader = ({
  view,
  onViewChange,
  yearFilter,
  onYearFilterChange,
  typeFilter,
  onTypeFilterChange,
  totalHolidays,
  availableYears = [],
  loading = false
}) => {
  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'national', label: 'National' },
    { value: 'religious', label: 'Religious' },
    { value: 'regional', label: 'Regional' },
    { value: 'company', label: 'Company' }
  ];

  // Ensure availableYears has at least current year
  const yearOptions = availableYears.length > 0 
    ? availableYears 
    : [yearFilter - 1, yearFilter, yearFilter + 1];

  return (
    <div className="mt-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Holiday Calendar</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and view all company holidays and festivals
          </p>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400 mt-2 sm:mt-0">
          {loading ? (
            <span className="inline-flex items-center">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-2"></div>
              Loading...
            </span>
          ) : (
            `${totalHolidays} ${totalHolidays === 1 ? 'holiday' : 'holidays'} in ${yearFilter}`
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        {/* View Toggle */}
        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 self-start sm:self-auto">
          <button
            onClick={() => onViewChange('list')}
            disabled={loading}
            className={`p-2 rounded-md flex items-center gap-2 text-sm ${view === 'list'
                ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow'
                : 'text-gray-600 dark:text-gray-400'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <List size={16} />
            List View
          </button>
          <button
            onClick={() => onViewChange('calendar')}
            disabled={loading}
            className={`p-2 rounded-md flex items-center gap-2 text-sm ${view === 'calendar'
                ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow'
                : 'text-gray-600 dark:text-gray-400'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <CalendarIcon size={16} />
            Calendar View
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={yearFilter}
              onChange={(e) => onYearFilterChange(parseInt(e.target.value))}
              disabled={loading}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {yearOptions.map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <select
            value={typeFilter}
            onChange={(e) => onTypeFilterChange(e.target.value)}
            disabled={loading}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {typeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default HolidaysHeader;