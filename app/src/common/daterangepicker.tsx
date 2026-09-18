"use client";

import React, { useState } from "react";
import { DateRange, RangeKeyDict } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { format } from "date-fns";

export interface CustomDateRangePickerProps {
  onApply: (startDate: Date, endDate: Date) => void;
  onCancel: () => void;
}

export default function CustomDateRangePicker({
  onApply,
  onCancel,
}: CustomDateRangePickerProps) {
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const handleSelect = (ranges: RangeKeyDict) => {
    setState([ranges.selection as any]);
  };

  return (
    <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden w-max">
      <div className="p-2">
        <DateRange
          onChange={handleSelect}
          moveRangeOnFirstSelection={false}
          months={2}
          ranges={state}
          direction="horizontal"
          rangeColors={["#1e3a8a"]} // axc-navy
        />
      </div>
      <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-gray-50/50">
        <button
          onClick={onCancel}
          className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            if (state[0].startDate && state[0].endDate) {
              onApply(state[0].startDate, state[0].endDate);
            }
          }}
          className="px-5 py-2 text-sm font-medium text-white bg-[#1a2d42] border border-transparent rounded-lg shadow-sm hover:bg-[#142334] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900 transition-colors"
        >
          OK
        </button>
      </div>
    </div>
  );
}
