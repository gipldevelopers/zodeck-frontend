import React from "react";
import Link from "next/link";

const Schedules = () => {
  const schedules = [
    {
      id: 1,
      position: "UI/UX Designer",
      badgeColor: "bg-gray-500",
      title: "Interview Candidates - UI/UX Designer",
      date: "Thu, 15 Feb 2025",
      time: "01:00 PM - 02:20 PM",
      participants: [
        "/images/users/user-05.jpg",
        "/images/users/user-06.jpg",
        "/images/users/user-07.jpg",
        "/images/users/user-08.jpg",
        "/images/users/user-09.jpg",
      ],
      additionalParticipants: 3,
    },
    {
      id: 2,
      position: "IOS Developer",
      badgeColor: "bg-gray-800",
      title: "Interview Candidates - IOS Developer",
      date: "Thu, 15 Feb 2025",
      time: "02:00 PM - 04:20 PM",
      participants: [
        "/images/users/user-05.jpg",
        "/images/users/user-06.jpg",
        "/images/users/user-07.jpg",
        "/images/users/user-08.jpg",
        "/images/users/user-09.jpg",
      ],
      additionalParticipants: 3,
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 h-full w-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 
                      flex items-center justify-between gap-2 flex-wrap">
        <h5 className="text-sm sm:text-base font-semibold text-gray-800 dark:text-white">
          Schedules
        </h5>
        <Link
          href="/hr/candidates"
          className="px-3 py-1 text-xs font-semibold rounded-md 
                     bg-gray-100 hover:bg-gray-200 text-gray-600 
                     dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300"
        >
          View All
        </Link>
      </div>

      {/* Body */}
      <div className="p-4 space-y-4">
        {schedules.map((schedule) => (
          <div
            key={schedule.id}
            className="bg-gray-50 dark:bg-gray-700 p-2 sm:p-3 rounded-lg"
          >
            {/* Badge */}
            <span
              className={`inline-block text-[10px] px-2 py-1 rounded-sm 
                          text-white mb-2 ${schedule.badgeColor}`}
            >
              {schedule.position}
            </span>

            {/* Title */}
            <h6 className="text-sm font-semibold text-gray-800 dark:text-white truncate mb-2">
              {schedule.title}
            </h6>

            {/* Date & Time */}
            <div className="flex flex-wrap gap-3 mb-3">
              <p className="text-xs text-gray-600 dark:text-gray-300 flex items-center">
                <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {schedule.date}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-300 flex items-center">
                <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {schedule.time}
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-3 pt-3 
                            border-t border-gray-200 dark:border-gray-600">
              {/* Participants */}
              <div className="flex -space-x-2">
                {schedule.participants.slice(0, 5).map((participant, index) => (
                  <img
                    key={index}
                    src={participant}
                    alt="Participant"
                    className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 
                               object-cover transition-transform hover:-translate-y-1"
                  />
                ))}

                {schedule.additionalParticipants > 0 && (
                  <div className="relative group">
                    <div
                      className="w-7 h-7 rounded-full border-2 border-white dark:border-gray-800 
                                 bg-blue-500 text-white text-xs flex items-center justify-center"
                    >
                      +{schedule.additionalParticipants}
                    </div>
                    <div
                      className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 
                                 bg-gray-800 text-white text-xs rounded px-2 py-1 
                                 opacity-0 group-hover:opacity-100 transition"
                    >
                      {schedule.additionalParticipants} more participants
                    </div>
                  </div>
                )}
              </div>

              {/* Join Button */}
              <button
                className="px-3 py-1 text-[10px] font-semibold rounded-sm 
                           bg-primary text-white hover:bg-primary/90"
              >
                Join Meeting
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Schedules;
