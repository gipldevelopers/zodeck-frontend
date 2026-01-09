"use client";

export default function LeaveBalanceCard({ type, allocated, used }) {
  const remaining = allocated - used;
  const percentage = (used / allocated) * 100;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 flex flex-col gap-3 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          {type}
        </h4>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {remaining} / {allocated} days left
        </span>
      </div>

      <div className="relative h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full">
        <div
          className="absolute h-2 bg-blue-600 rounded-full transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400">
        {used} used • {remaining} remaining
      </p>
    </div>
  );
}
