"use client";

import React, { useMemo } from "react";
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
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
  const allOptions: FilterOption[] = useMemo(() => {
    if (options && options.length > 0) return options;
    if (groups && groups.length > 0) {
      return groups.flatMap((g) => g.options);
    }
    return [];
  }, [options, groups]);

  const currentSelected = allOptions.find((opt) => opt.value === selectedOption);
  const selectedLabel = currentSelected && currentSelected.value ? currentSelected.label : "Select";

  return (
    <div
      className={`flex h-10 items-center rounded-lg border border-axc-border bg-white shadow-sm transition  outline-none  ${className}`}
    >
      {/* Headless UI Listbox Dropdown */}
      <div className="relative shrink-0">
        <Listbox value={selectedOption} onChange={onOptionChange}>
          <div className="relative">
            <ListboxButton className="flex h-10 items-center justify-between gap-2.5 px-3.5 text-[13px] font-medium text-axc-dark-gray hover:bg-gray-50/80 rounded-l-lg transition-colors cursor-pointer outline-none select-none">
              <span className="block truncate max-w-65">
                {selectedLabel}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-gray-400 shrink-0" aria-hidden="true" />
            </ListboxButton>

            <ListboxOptions
              anchor={{ to: "bottom start", gap: 6 }}
              transition
              className="z-[9999] min-w-[210px] w-auto focus:outline-none transition ease-out duration-100 data-[closed]:opacity-0 data-[closed]:scale-95"
            >
              <div className="relative pt-2">
                <div className="absolute top-[2px] left-6 h-3.5 w-3.5 rotate-45 border-l border-t border-axc-border bg-white z-20" />

                {/* Rounded Popover Card */}
                <div className="relative z-10 max-h-64 overflow-y-auto rounded-2xl border border-axc-border bg-white shadow-lg divide-y divide-gray-100">
                  {groups && groups.length > 0 ? (
                    <>
                      <ListboxOption
                        value=""
                        className="relative cursor-pointer select-none py-2.5 px-4 text-[#374151] data-[focus]:bg-[#F9FAFB] data-[selected]:bg-[#F9FAFB] data-[selected]:font-semibold data-[selected]:text-axc-navy text-[13px] font-medium transition-colors flex items-center justify-between"
                      >
                        <span>Select</span>
                        {!selectedOption && (
                          <Check size={14} className="text-axc-navy shrink-0 ml-2" />
                        )}
                      </ListboxOption>
                      {groups.map((grp) => (
                        <div key={grp.group} className="py-1">
                          <div className="px-4 py-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/60">
                            {grp.group}
                          </div>
                          {grp.options.map((option) => (
                            <ListboxOption
                              key={option.value}
                              value={option.value}
                              className="relative cursor-pointer select-none py-2 px-4 text-[#374151] data-[focus]:bg-[#F9FAFB] data-[selected]:bg-[#F9FAFB] data-[selected]:font-semibold data-[selected]:text-axc-navy text-[13px] font-medium transition-colors flex items-center justify-between"
                            >
                              <span className="block truncate">{option.label}</span>
                              {option.value === selectedOption && (
                                <Check size={14} className="text-axc-navy shrink-0 ml-2" />
                              )}
                            </ListboxOption>
                          ))}
                        </div>
                      ))}
                    </>
                  ) : (
                    allOptions.map((option) => (
                      <ListboxOption
                        key={option.value}
                        value={option.value}
                        className="relative cursor-pointer select-none py-2.5 px-4 text-[#374151] data-[focus]:bg-[#F9FAFB] data-[selected]:bg-[#F9FAFB] data-[selected]:font-semibold data-[selected]:text-axc-navy text-[13px] font-medium transition-colors flex items-center justify-between"
                      >
                        <span className="block truncate">{option.label}</span>
                        {option.value === selectedOption && (
                          <Check size={14} className="text-axc-navy shrink-0 ml-2" />
                        )}
                      </ListboxOption>
                    ))
                  )}
                </div>
              </div>
            </ListboxOptions>
          </div>
        </Listbox>
      </div>

      {/* Vertical Divider */}
      <div className="h-5 w-[1px] bg-gray-200 shrink-0" />

      {/* Search Input */}
      <div className="relative flex h-full flex-1 items-center min-w-[400px]">
        <SearchIcon size={15} className="ml-3 text-gray-400 pointer-events-none shrink-0" />
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
          className="h-full w-full bg-transparent px-2.5 text-[13px] text-gray-800 placeholder:text-gray-400 focus:outline-none"
        />
        {searchValue && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-2.5 text-gray-400 hover:text-gray-600 p-1 cursor-pointer transition-colors"
          >
            <X size={13} />
          </button>
        )}
      </div>
    </div>
  );
}
