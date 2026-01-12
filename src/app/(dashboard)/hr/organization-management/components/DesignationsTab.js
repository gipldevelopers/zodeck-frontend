"use client";

import DesignationTableWrapper from "./DesignationTableWrapper";

export default function DesignationsTab() {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <DesignationTableWrapper />
      </div>
    </div>
  );
}
