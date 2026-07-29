import React from "react";
interface Option {
  label: string;
  value: string | number;
}
interface DropdownFilterProps {
  value: string | number;
  options: Option[];
  onChange: (value: string) => void;
  className?: string;
}
export default function DropdownFilter({
  value,
  options,
  onChange,
  className = "",
}: DropdownFilterProps): React.JSX.Element {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`h-10 px-3 rounded-lg border border-[#E5E7EB] bg-white text-[13px] text-[#374151] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#DBEAFE] cursor-pointer ${className}`}
    >
      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
        >
          {option.label}
        </option>
      ))}
    </select>
  );
}