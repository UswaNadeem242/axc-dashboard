"use client";

import React, { useMemo } from "react";
import {
  Popover,
  PopoverButton,
  PopoverPanel,
} from "@headlessui/react";
import { ChevronDown, Check, Search as SearchIcon, X } from "lucide-react";

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
  columnTitle?: string;
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
  placeholder = "Search...",
  columnTitle = "Filter By",
  className = "",
}: FilterSearchProps) {
  const allOptions: FilterOption[] = useMemo(() => {
    if (options && options.length > 0) return options;
    if (groups && groups.length > 0) {
      return groups.flatMap((g) => g.options);
    }
    return [];
  }, [options, groups]);

  const currentSelected = allOptions.find((opt) => opt.value === selectedOption);
  const selectedLabel =
    currentSelected && currentSelected.value ? currentSelected.label : "";

  const handleToggleOption = (val: string) => {
    if (selectedOption === val) {
      onOptionChange("");
    } else {
      onOptionChange(val);
    }
  };

  // Group options or prepare columns for flat options
  const columnsData: { title: string; items: FilterOption[] }[] = useMemo(() => {
    if (groups && groups.length > 0) {
      return groups.map((g) => ({
        title: g.group,
        items: g.options,
      }));
    }

    if (options && options.length > 0) {
      const validOptions = options.filter((opt) => opt.value !== "");
      const itemsToUse = validOptions.length > 0 ? validOptions : options;

      if (itemsToUse.length > 6) {
        const chunkSize = Math.ceil(itemsToUse.length / 2);
        return [
          { title: columnTitle, items: itemsToUse.slice(0, chunkSize) },
          { title: "More", items: itemsToUse.slice(chunkSize) },
        ];
      }

      return [{ title: columnTitle, items: itemsToUse }];
    }

    return [];
  }, [groups, options, columnTitle]);

  return (
    <Popover className={`relative flex items-center ${className}`}>
      {({ open }) => (
        <>
          {/* Main Full Search Bar Container */}
          <div className="relative flex h-10 w-full min-w-[320px] md:min-w-[420px] items-center rounded-lg border border-axc-border bg-white shadow-sm transition hover:border-gray-300 focus-within:border-axc-blue">
            {/* Search Icon */}
            <SearchIcon
              size={15}
              className="ml-3.5 text-gray-400 pointer-events-none shrink-0"
            />

            {/* Selected Filter Badge if active */}
            {selectedLabel && (
              <span className="ml-2 inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 shrink-0 select-none">
                {selectedLabel}
                <X
                  size={12}
                  className="cursor-pointer text-blue-600 hover:text-blue-800"
                  onClick={() => onOptionChange("")}
                />
              </span>
            )}

            {/* Full Search Input */}
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
              placeholder={selectedLabel ? `Search in ${selectedLabel}...` : placeholder}
              className="h-full flex-1 bg-transparent px-2.5 text-[13px] text-gray-800 placeholder:text-gray-400 focus:outline-none"
            />

            {/* Clear Search Input Button */}
            {searchValue && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="text-gray-400 hover:text-gray-600 p-1 mr-1 cursor-pointer transition-colors shrink-0"
              >
                <X size={13} />
              </button>
            )}

            {/* Side Dropdown Chevron Trigger */}
            <PopoverButton
              className="flex h-full items-center px-3 text-gray-400 hover:text-gray-600 cursor-pointer outline-none select-none shrink-0 transition-colors"
              title="Filters"
            >
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  open ? "rotate-180 text-blue-600" : ""
                }`}
                aria-hidden="true"
              />
            </PopoverButton>
          </div>

          {/* Dropdown Popover Panel - matches search bar width */}
          <PopoverPanel
            transition
            className="absolute left-0 right-0 top-full mt-2 w-full min-w-full z-[9999] focus:outline-none transition ease-out duration-150 data-[closed]:opacity-0 data-[closed]:scale-95"
          >
            <div className="relative pt-2 w-full">
              {/* Top Arrow Pointer (Aligned under search input) */}
              <div className="absolute top-[2px] left-6 h-3.5 w-3.5 rotate-45 border-l border-t border-gray-200 bg-white z-20" />

              {/* Rounded Popover Card */}
              <div className="relative z-10 w-full rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden">
                {/* Header: Sliders Icon + "Filters" Title */}
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200 bg-white select-none">
                  <div className="flex items-center gap-2.5">
                    <svg
                      className="h-4 w-4 text-blue-600 shrink-0"
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        d="M2.5 6.5H7.5M12.5 6.5H17.5"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <circle
                        cx="10"
                        cy="6.5"
                        r="2.5"
                        strokeWidth="2"
                        fill="white"
                      />
                      <path
                        d="M2.5 13.5H5.5M10.5 13.5H17.5"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <circle
                        cx="8"
                        cy="13.5"
                        r="2.5"
                        strokeWidth="2"
                        fill="white"
                      />
                    </svg>
                    <span className="text-[14px] font-bold text-gray-900 tracking-tight">
                      Filters
                    </span>
                  </div>

                  {selectedOption && (
                    <button
                      type="button"
                      onClick={() => onOptionChange("")}
                      className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
                    >
                      Reset
                    </button>
                  )}
                </div>

                {/* Columns with Vertical Dividers */}
                <div className="flex flex-row divide-x divide-gray-200 bg-white w-full">
                  {columnsData.map((col, colIdx) => (
                    <div
                      key={`${col.title}-${colIdx}`}
                      className="p-5 flex-1 min-w-0"
                    >
                      <h4 className="text-[13px] font-bold text-gray-900 mb-3 select-none">
                        {col.title}
                      </h4>

                      <div className="space-y-2 max-h-[220px] overflow-y-auto pr-2 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full">
                        {col.items.map((option) => {
                          const isChecked = selectedOption === option.value;
                          return (
                            <div
                              key={option.value}
                              onClick={() => handleToggleOption(option.value)}
                              className="group flex items-center gap-2.5 py-1 px-1.5 -mx-1.5 rounded-md hover:bg-gray-50 cursor-pointer select-none transition-colors"
                            >
                              {/* Custom Checkbox */}
                              <div
                                className={`h-4 w-4 rounded-[4px] border flex items-center justify-center shrink-0 transition-colors ${
                                  isChecked
                                    ? "border-blue-600 bg-blue-600 text-white"
                                    : "border-gray-300 bg-white group-hover:border-gray-400"
                                }`}
                              >
                                {isChecked && (
                                  <Check
                                    size={11}
                                    strokeWidth={3}
                                    className="text-white"
                                  />
                                )}
                              </div>

                              {/* Value Label */}
                              <span
                                className={`text-[13px] truncate transition-colors ${
                                  isChecked
                                    ? "font-semibold text-blue-600"
                                    : "font-normal text-gray-700 group-hover:text-gray-900"
                                }`}
                              >
                                {option.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </PopoverPanel>
        </>
      )}
    </Popover>
  );
}


