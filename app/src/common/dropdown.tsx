"use client";

import React from "react";
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from "@headlessui/react";
import { ChevronDown } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface CommonDropdownProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function CommonDropdown({
  options,
  value,
  onChange,
  placeholder = "Select...",
  className = "",
}: CommonDropdownProps) {
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <Listbox value={value} onChange={onChange}>
      <div className="relative w-full">
        <ListboxButton
          className={`relative w-full text-left bg-white border border-axc-gray rounded px-3 py-3 outline-none cursor-pointer flex items-center justify-between text-xs font-medium text-axc-dark-gray ${className}`}
        >
          <span className="block truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" aria-hidden="true" />
        </ListboxButton>

        <ListboxOptions
          transition
          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-xs shadow-lg border border-axc-border focus:outline-none transition ease-in duration-100 data-[closed]:opacity-0 data-[leave]:opacity-0"
        >
          {options.map((option) => (
            <ListboxOption
              key={option.value}
              value={option.value}
              className="relative cursor-pointer select-none py-2.5 px-3 text-gray-900 data-[focus]:bg-axc-navy data-[focus]:text-white data-[selected]:bg-axc-navy/10 data-[selected]:text-axc-navy font-medium transition-colors"
            >
              <span className="block truncate">{option.label}</span>
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  );
}