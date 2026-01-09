import React from "react";
import Link from "next/link";

const Birthdays = () => {
  const birthdaysData = [
    {
      period: "Today",
      employees: [
        {
          name: "Andrew Jermia",
          role: "iOS Developer",
          avatar: "/images/users/user-10.jpg",
        },
      ],
    },
    {
      period: "Tomorrow",
      employees: [
        {
          name: "Mary Zeen",
          role: "UI/UX Designer",
          avatar: "/images/users/user-11.jpg",
        },
        {
          name: "Antony Lewis",
          role: "Android Developer",
          avatar: "/images/users/user-12.jpg",
        },
      ],
    },
    {
      period: "25 Jan 2025",
      employees: [
        {
          name: "Doglas Martini",
          role: ".Net Developer",
          avatar: "/images/users/user-13.jpg",
        },
      ],
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 h-full w-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
        <h5 className="text-sm sm:text-base font-semibold text-gray-800 dark:text-white">
          Birthdays
        </h5>
        <Link
          href="/hr/employees"
          className="px-3 py-1 text-xs font-semibold rounded-md 
                     bg-gray-100 hover:bg-gray-200 text-gray-600 
                     dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300"
        >
          View All
        </Link>
      </div>

      {/* Body */}
      <div className="p-4 space-y-4">
        {birthdaysData.map((periodData, periodIndex) => (
          <div key={periodIndex}>
            <h6 className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {periodData.period}
            </h6>

            <div className="space-y-3">
              {periodData.employees.map((employee, empIndex) => (
                <div
                  key={empIndex}
                  className="bg-gray-50 dark:bg-gray-700 
                             p-2 sm:p-3 rounded-lg border border-dashed 
                             border-gray-200 dark:border-gray-600"
                >
                  <div className="flex items-center justify-between gap-3">
                    {/* Left */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden flex-shrink-0">
                        <img
                          src={employee.avatar}
                          alt={employee.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="min-w-0">
                        <h6 className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                          {employee.name}
                        </h6>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {employee.role}
                        </p>
                      </div>
                    </div>

                    {/* Action */}
                    <button
                      className="flex items-center gap-1 text-xs font-medium 
                                 bg-blue-500 hover:bg-blue-600 
                                 text-white px-3 py-1.5 rounded-md 
                                 transition-colors whitespace-nowrap"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h6m6 3v12a3 3 0 01-3 3H6a3 3 0 01-3-3V6a3 3 0 013-3h12a3 3 0 013 3z"
                        />
                      </svg>
                      Send
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Birthdays;
