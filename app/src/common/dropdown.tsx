"use client";

import { Fragment } from "react";
import { Listbox, ListboxButton, ListboxOptions, ListboxOption, Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";
import { ChevronDown, MoreVertical, Check } from "lucide-react";

interface Option {
  value: string;
  label: React.ReactNode;
}

interface DropdownItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
}

interface DropdownProps {
  options?: Option[];
  value?: any;
  onChange?: (value: any) => void;
  items?: DropdownItem[];
  title?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  multiple?: boolean;
}

export default function Dropdown({
  options,
  value,
  onChange,
  items,
  title = "Actions",
  placeholder = "Select...",
  className = "",
  disabled = false,
  multiple = false,
}: DropdownProps) {
  if (items) {
    return (
      <Menu as="div" className={`relative inline-block text-left ${className}`}>
        <MenuButton className="flex h-[38px] items-center gap-2 rounded-md border border-axc-border bg-white px-4 text-sm font-medium text-axc-dark-gray transition-colors hover:bg-axc-light-bg cursor-pointer">
          <MoreVertical className="h-4 w-4" />
          {title}
        </MenuButton>

        <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
          <div className="absolute right-0 z-50 mt-1 w-52 pt-2">
            <div className="absolute top-[2px] right-6 h-3.5 w-3.5 rotate-45 border-l border-t border-axc-border bg-white z-20" />
            <MenuItems className="relative z-10 overflow-hidden rounded-2xl border border-axc-border bg-white divide-y divide-gray-100 focus:outline-none">
              {items.map((item) => (
                <MenuItem key={item.label}>
                  {({ focus }) => (
                    <button
                      type="button"
                      onClick={item.onClick}
                      className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-gray-700 transition-colors ${focus ? "bg-gray-50/90 text-gray-900" : ""
                        }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </button>
                  )}
                </MenuItem>
              ))}
            </MenuItems>
          </div>
        </Transition>
      </Menu>
    );
  }

  const isArray = Array.isArray(value);
  const selectedOptions = isArray 
    ? options?.filter((opt) => value.includes(opt.value)) || []
    : options?.filter((opt) => opt.value === value) || [];

  let displayLabel: React.ReactNode = placeholder;
  if (selectedOptions.length > 0) {
    if (isArray && selectedOptions.length > 1) {
      displayLabel = `${selectedOptions.length} selected`;
    } else {
      displayLabel = selectedOptions[0].label;
    }
  }

  return (
    <Listbox value={value || (multiple ? [] : "")} onChange={onChange} disabled={disabled} multiple={multiple}>
      <div className="relative w-full">
        <ListboxButton
          className={`relative w-full text-left border rounded-md px-3 py-2.5 outline-none placeholder:text-regular-small flex items-center justify-between text-sm font-normal transition ${disabled
            ? "bg-gray-50 border-axc-border text-gray-400 cursor-not-allowed"
            : "bg-white border-axc-border text-gray-700 cursor-pointer"
            } ${className}`}
        >
          <span className={`block truncate ${selectedOptions.length > 0 ? "text-gray-800 font-medium" : "text-gray-400"}`}>
            {displayLabel}
          </span>
          <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" aria-hidden="true" />
        </ListboxButton>

        <ListboxOptions
          anchor={{ to: "bottom start", gap: 4 }}
          transition
          className="z-[9999] w-[var(--button-width)] focus:outline-none transition ease-out duration-100 data-[closed]:opacity-0 data-[closed]:scale-95"
        >
          <div className="relative pt-2">
            <div className="absolute top-[2px] right-6 h-3.5 w-3.5 rotate-45 border-l border-t border-axc-border bg-white z-20" />

            {/* Rounded Popover Card with clearly defined border-axc-border */}
            <div className="relative z-10 max-h-64 overflow-y-auto rounded-2xl border border-axc-border bg-white divide-y divide-gray-100">
              {options && options.length > 0 ? (
                options.map((option) => (
                  <ListboxOption
                    key={option.value}
                    value={option.value}
                    className="relative cursor-pointer select-none py-3 px-4 text-black data-[focus]:bg-[#F9FAFB] data-[selected]:bg-[#F9FAFB] data-[selected]:font-semibold data-[selected]:text-axc-navy text-xs font-medium transition-colors"
                  >
                    {({ selected }) => (
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2 truncate">
                          {multiple && option.value !== "OTHER" && (
                            <input
                              type="checkbox"
                              checked={selected}
                              readOnly
                              className="h-3.5 w-3.5 accent-axc-navy shrink-0"
                            />
                          )}
                          <span className="block truncate">{option.label}</span>
                        </div>
                        {selected && !multiple && (
                          <Check size={16} className="text-axc-navy shrink-0 ml-2" />
                        )}
                      </div>
                    )}
                  </ListboxOption>
                ))
              ) : (
                <div className="py-3 px-4 text-xs text-gray-400 text-center select-none">
                  No options available
                </div>
              )}
            </div>
          </div>
        </ListboxOptions>
      </div>
    </Listbox>
  );
}