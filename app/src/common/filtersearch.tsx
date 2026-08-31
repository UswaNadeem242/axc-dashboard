import React from "react";
import { ChevronDown, Search as SearchIcon, X } from "lucide-react";

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterGroup {
  group: string;
  options: FilterOption[];
}

interface FilterSearchProps {
  options?: FilterOption[];
  groups?: FilterGroup[];
  selectedOption: string;
  onOptionChange: (val: string) => void;
  searchValue: string;
  onSearchChange: (val: string) => void;
  onSearchSubmit?: (val: string) => void;
  placeholder?: string;
  className?: string;
}

export default function FilterSearch({
  options,
  groups,
  selectedOption,
  onOptionChange,
  searchValue,
  onSearchChange,
  onSearchSubmit,
  placeholder = "Search",
  className = "",
}: FilterSearchProps) {
  return (
    <div
      className={`flex h-10 items-center overflow-hidden rounded-md border border-axc-border bg-white transition hover:border-gray-300 focus-within:border-axc-navy/60 focus-within:ring-1 focus-within:ring-axc-navy/20 ${className}`}
    >
      {/* Select Dropdown */}
      <div className="relative flex h-full items-center shrink-0">
        <select
          value={selectedOption}
          onChange={(e) => onOptionChange(e.target.value)}
          className="h-full cursor-pointer appearance-none bg-transparent pl-3.5 pr-8 text-[13px] font-normal text-gray-700 focus:outline-none"
        >
          {groups ? (
            <>
              <option value="">Select</option>
              {groups.map((group) => (
                <optgroup key={group.group} label={group.group} className="font-semibold text-gray-900 bg-gray-50">
                  {group.options.map((opt) => (
                    <option key={opt.value} value={opt.value} className="font-normal text-gray-700 bg-white py-1">
                      {opt.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </>
          ) : (
            options?.map((opt) => (
              <option key={opt.value} value={opt.value} className="text-gray-700">
                {opt.label}
              </option>
            ))
          )}
        </select>
        <ChevronDown
          size={14}
          className="pointer-events-none absolute right-2.5 text-gray-400"
        />
      </div>

      {/* Vertical Divider */}
      <div className="h-5 w-[1px] bg-gray-200 mx-1 shrink-0" />

      {/* Search Input */}
      <div className="relative flex h-full flex-1 items-center min-w-[220px]">
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && onSearchSubmit) {
              e.preventDefault();
              onSearchSubmit(searchValue);
            }
          }}
          placeholder={placeholder}
          className="h-full w-full bg-transparent px-3 text-[13px] text-gray-800 placeholder:text-gray-400 focus:outline-none"
        />
        {searchValue && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-2 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
          >
            <X size={13} />
          </button>
        )}
      </div>
    </div>
  );
}

