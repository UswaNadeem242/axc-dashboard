import React from "react";
import { ChevronDown } from "lucide-react";

interface FilterSearchProps {
  options: { label: string; value: string }[];
  selectedOption: string;
  onOptionChange: (val: string) => void;
  searchValue: string;
  onSearchChange: (val: string) => void;
  onSearchSubmit?: (val: string) => void;
  placeholder?: string;
}

export default function FilterSearch({
  options,
  selectedOption,
  onOptionChange,
  searchValue,
  onSearchChange,
  onSearchSubmit,
  placeholder = "Search",
}: FilterSearchProps) {
  return (
    <div className="flex h-11 items-center overflow-hidden rounded-md border border-axc-border bg-white  transition ">
      {/* Select Dropdown */}
      <div className="relative flex h-full items-center bg-transparent">
        <select
          value={selectedOption}
          onChange={(e) => onOptionChange(e.target.value)}
          className="h-full cursor-pointer appearance-none bg-transparent pl-3 pr-8 text-sm text-axc-gray focus:outline-none"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          className="pointer-events-none absolute right-2.5 text-gray-400"
        />
      </div>

      {/* Vertical Divider */}
      <div className="h-5 w-px bg-gray-300"></div>

      {/* Search Input */}
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
        className="h-full w-full min-w-[250px] bg-transparent px-3 text-sm text-gray-700 placeholder-axc-gray focus:outline-none"
      />
    </div>
  );
}
