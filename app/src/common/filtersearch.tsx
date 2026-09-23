"use client";

import React, { useMemo } from "react";
import {
  Popover,
  PopoverButton,
  PopoverPanel,
} from "@headlessui/react";
import { ChevronDown, Check, Search as SearchIcon, X } from "lucide-react";
import CustomDateRangePicker from "./daterangepicker";
import { format } from "date-fns";

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterGroup {
  group: string;
  options: FilterOption[];
  sameColumnAsPrevious?: boolean;
}

interface FilterSearchProps {
  options?: FilterOption[];
  groups?: FilterGroup[];
  selectedOption?: string;
  selectedOptions?: string[];
  onOptionChange?: (val: string) => void;
  onOptionsChange?: (vals: string[]) => void;
  searchValue: string;
  onSearchChange: (val: string) => void;
  onSearchSubmit?: (val: string) => void;
  placeholder?: string;
  columnTitle?: string;
  className?: string;
  searchSuggestions?: string[];
}

export default function FilterSearch({
  options,
  groups,
  selectedOption,
  selectedOptions,
  onOptionChange,
  onOptionsChange,
  searchValue,
  onSearchChange,
  onSearchSubmit,
  placeholder = "Search...",
  columnTitle = "Filter By",
  className = "",
  searchSuggestions,
}: FilterSearchProps) {
  const allOptions: FilterOption[] = useMemo(() => {
    if (options && options.length > 0) return options;
    if (groups && groups.length > 0) {
      return groups.flatMap((g) => g.options);
    }
    return [];
  }, [options, groups]);

  const activeOptionsList: string[] = useMemo(() => {
    if (selectedOptions !== undefined) {
      return selectedOptions;
    }
    if (selectedOption) {
      return [selectedOption];
    }
    return [];
  }, [selectedOptions, selectedOption]);

  const [showCustomDateRange, setShowCustomDateRange] = React.useState(false);

  const handleToggleOption = (val: string) => {
    if (val === "Custom") {
      setShowCustomDateRange(true);
      return;
    }
    if (onOptionsChange) {
      if (activeOptionsList.includes(val)) {
        onOptionsChange(activeOptionsList.filter((item) => item !== val));
      } else {
        onOptionsChange([...activeOptionsList, val]);
      }
    } else if (onOptionChange) {
      if (selectedOption === val) {
        onOptionChange("");
      } else {
        onOptionChange(val);
      }
    }
  };

  const handleRemoveOption = (val: string) => {
    if (onOptionsChange) {
      onOptionsChange(activeOptionsList.filter((item) => item !== val));
    } else if (onOptionChange) {
      onOptionChange("");
    }
  };

  const handleReset = () => {
    if (onOptionsChange) {
      onOptionsChange([]);
    }
    if (onOptionChange) {
      onOptionChange("");
    }
  };

  // Group options or prepare columns for flat options
  const columnsData: { title: string; items: FilterOption[] }[][] = useMemo(() => {
    if (groups && groups.length > 0) {
      const cols: { title: string; items: FilterOption[] }[][] = [];
      groups.forEach((g) => {
        if (g.sameColumnAsPrevious && cols.length > 0) {
          cols[cols.length - 1].push({ title: g.group, items: g.options });
        } else {
          cols.push([{ title: g.group, items: g.options }]);
        }
      });
      return cols;
    }

    if (options && options.length > 0) {
      const validOptions = options.filter((opt) => opt.value !== "");
      const itemsToUse = validOptions.length > 0 ? validOptions : options;
      return [[{ title: columnTitle, items: itemsToUse }]];
    }

    return [];
  }, [groups, options, columnTitle]);

  const filteredSuggestions = useMemo(() => {
    if (!searchSuggestions || !searchValue) return [];
    const lower = searchValue.toLowerCase();
    return searchSuggestions.filter(s => s && s.toLowerCase().includes(lower)).slice(0, 10);
  }, [searchSuggestions, searchValue]);

  return (
    <>
      <Popover className={`relative flex items-center ${className}`}>
        {({ open }) => (
          <>
            {/* Main Full Search Bar Container */}
            <div className="relative flex min-h-10 w-full min-w-[360px] sm:min-w-[480px] md:min-w-[640px] items-center rounded-lg border border-axc-border bg-white shadow-sm transition hover:border-gray-300  outline-none py-1">
              {/* Search Icon */}
              <SearchIcon
                size={15}
                className="ml-3.5 text-gray-400 pointer-events-none shrink-0"
              />

            {/* Selected Filter Badges if active */}
            {activeOptionsList.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 ml-2 shrink-0">
                {activeOptionsList.map((val) => {
                  const opt = allOptions.find((o) => o.value === val);
                  const label = opt ? opt.label : val;
                  return (
                    <span
                      key={val}
                      className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 select-none border border-blue-200"
                    >
                      {label}
                      <X
                        size={12}
                        className="cursor-pointer text-blue-600 hover:text-blue-800"
                        onClick={() => handleRemoveOption(val)}
                      />
                    </span>
                  );
                })}
              </div>
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
              placeholder={placeholder}
              className="h-8 flex-1 bg-transparent px-2.5 text-[13px] text-gray-800 placeholder:text-gray-400 focus:outline-none min-w-[100px]"
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

            {/* Search Suggestions Dropdown */}
            {filteredSuggestions.length > 0 && (
              <div className="absolute left-0 top-[110%] w-full z-[10000] bg-white border border-gray-200 rounded-md shadow-lg max-h-[300px] overflow-y-auto">
                {filteredSuggestions.map((suggestion, idx) => (
                  <div
                    key={idx}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      onSearchChange(suggestion);
                      if (onSearchSubmit) onSearchSubmit(suggestion);
                    }}
                    className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-[13px] text-gray-800 border-b border-gray-100 last:border-none truncate"
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
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
            className="absolute left-0 top-full mt-2 w-max max-w-[90vw] min-w-full z-[9999] focus:outline-none transition ease-out duration-150 data-[closed]:opacity-0 data-[closed]:scale-95"
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
                    <span className="text-sm font-bold text-black tracking-tight">
                      Filters
                    </span>
                  </div>

                  {activeOptionsList.length > 0 && (
                    <button
                      type="button"
                      onClick={handleReset}
                      className="text-[11px] font-semibold text-axc-navy hover:text-axc-navy-dark cursor-pointer"
                    >
                      Reset
                    </button>
                  )}
                </div>

                {/* Horizontal Layout for Columns */}
                <div className="flex flex-row divide-x divide-gray-200 bg-white w-full overflow-x-auto">
                  {columnsData.map((colGroups, colIdx) => (
                    <div
                      key={`col-${colIdx}`}
                      className="px-5 py-3 shrink-0 w-max min-w-[140px] flex flex-col gap-4"
                    >
                      {colGroups.map((col, groupIdx) => (
                        <div key={`${col.title}-${groupIdx}`}>
                          <h4 className="text-[13px] font-bold text-gray-900 mb-3 select-none">
                            {col.title}
                          </h4>
                          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-2 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full">
                            {col.items.map((option) => {
                              const isChecked = activeOptionsList.includes(option.value);
                          return (
                            <div
                              key={option.value}
                              onClick={() => handleToggleOption(option.value)}
                              className="group flex items-center gap-2.5 py-1 px-1.5 -mx-1.5 rounded-md hover:bg-gray-50 cursor-pointer select-none transition-colors"
                            >
                              {/* Custom Checkbox */}
                              <div
                                className={`h-4 w-4 rounded-[4px] border flex items-center justify-center shrink-0 transition-colors ${
                                  isChecked || (option.value === "Custom" && activeOptionsList.some(o => /^[A-Z][a-z]{2} \d{1,2}, \d{4} - [A-Z][a-z]{2} \d{1,2}, \d{4}$/.test(o)))
                                    ? "border-blue-600 bg-axc-navy text-white"
                                    : "border-gray-300 bg-white group-hover:border-gray-400"
                                }`}
                              >
                                {(isChecked || (option.value === "Custom" && activeOptionsList.some(o => /^[A-Z][a-z]{2} \d{1,2}, \d{4} - [A-Z][a-z]{2} \d{1,2}, \d{4}$/.test(o)))) && (
                                  <Check
                                    size={11}
                                    strokeWidth={3}
                                    className="text-white"
                                  />
                                )}
                              </div>

                              {/* Value Label */}
                              <span
                                className={`text-xs truncate capitalize transition-colors ${
                                  isChecked
                                    ? "font-semibold text-axc-navy"
                                    : "font-normal text-axc-gray group-hover:text-gray-900"
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
              ))}
            </div>
          </div>
        </div>
        </PopoverPanel>
      </>
        )}
      </Popover>

      {/* Date Range Modal */}
      {showCustomDateRange && (
        <div className="fixed inset-0 z-[99999] bg-black/40 flex items-center justify-center p-4">
          <CustomDateRangePicker
            onApply={(start, end) => {
              const formatted = `${format(start, "MMM dd, yyyy")} - ${format(end, "MMM dd, yyyy")}`;
              if (onOptionsChange) {
                onOptionsChange([
                  ...activeOptionsList.filter((o) => !o.includes(" - ") || !/^[A-Z][a-z]{2} \d{1,2}, \d{4} - [A-Z][a-z]{2} \d{1,2}, \d{4}$/.test(o)),
                  formatted,
                ]);
              }
              setShowCustomDateRange(false);
            }}
            onCancel={() => setShowCustomDateRange(false)}
          />
        </div>
      )}
    </>
  );
}

