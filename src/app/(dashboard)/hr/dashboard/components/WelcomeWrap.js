"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

const WelcomeWrap = ({
  userName,
  pendingApprovals,
  leaveRequests,
  avatarUrl,
}) => {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      };
      const formatted = now
        .toLocaleDateString("en-GB", options)
        .replace(",", ",");
      setCurrentTime(formatted);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 w-full">
      <div
        className="p-3 sm:p-6 flex flex-col md:flex-row 
                   md:items-center md:justify-between gap-4"
      >
        {/* Left */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden 
                         border-2 border-white dark:border-gray-700 shadow-md"
            >
              <Image
                src={avatarUrl || "/images/users/default-avatar.png"}
                alt={userName}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Text */}
          <div className="min-w-0">
            <h3
              className="text-sm sm:text-xl font-semibold 
                         text-gray-800 dark:text-white flex items-center gap-2"
            >
              <span className="truncate">Welcome Back, {userName}</span>
              <button
                className="text-blue-500 hover:text-blue-700 
                           dark:text-blue-400 dark:hover:text-blue-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
            </h3>

            <p className="text-xs sm:text-base text-gray-600 dark:text-gray-300 truncate">
              You have{" "}
              <span className="text-blue-600 dark:text-blue-400 font-medium underline">
                {pendingApprovals}
              </span>{" "}
              Pending Approvals &{" "}
              <span className="text-blue-600 dark:text-blue-400 font-medium underline">
                {leaveRequests}
              </span>{" "}
              Leave Requests
            </p>
          </div>
        </div>

        {/* Right – Time */}
        <div
          className="bg-gray-100 dark:bg-gray-700 px-3 py-2 sm:px-4 sm:py-3 rounded-xl 
                     flex items-center gap-3 shadow-sm w-full md:w-auto"
        >
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              Current Time
            </p>
            <p className="text-sm sm:text-base font-semibold text-blue-700 dark:text-blue-400">
              {currentTime}
            </p>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default WelcomeWrap;
