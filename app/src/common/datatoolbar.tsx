import React from "react";

interface DataToolbarProps {
  search?: React.ReactNode;
  filters?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export default function DataToolbar({
  search,
  filters,
  actions,
  className = "",
}: DataToolbarProps) {
  return (
    <div
      className={`flex flex-col gap-4 rounded-2xl 
 border border-gray-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between ${className}`}
    >
      <div className="flex flex-1 flex-wrap items-center gap-3">
        {search}

        {filters}
      </div>

      <div className="flex items-center gap-2">
        {actions}
      </div>
    </div>
  );
}