"use client";

import { Fragment } from "react";
import { Listbox, ListboxButton, ListboxOptions, ListboxOption, Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";
import { ChevronDown, MoreVertical } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface DropdownItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
}

interface DropdownProps {
  options?: Option[];
  value?: string;
  onChange?: (value: string) => void;
  items?: DropdownItem[];
  title?: string;
  placeholder?: string;
  className?: string;
}

export default function Dropdown({ options, value, onChange, items, title = "Actions", placeholder = "Select...", className = "" }: DropdownProps) {
  if (items) {
    return (
      <Menu as="div" className={`relative inline-block text-left ${className}`}>
        <MenuButton className="flex h-[38px] items-center gap-2 rounded-md border border-axc-border bg-white px-4 text-[12px] font-medium text-axc-dark-gray transition-colors hover:bg-axc-light-bg">
          <MoreVertical className="h-4 w-4" />
          {title}
        </MenuButton>

        <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
          <MenuItems className="absolute right-0 z-50 mt-1 w-40 origin-top-right rounded-md border border-axc-border bg-white py-1 text-[12px] shadow-lg focus:outline-none">
            {items.map((item) => (
              <MenuItem key={item.label}>
                {({ focus }) => (
                  <button type="button" onClick={item.onClick} className={`flex w-full items-center gap-2 px-3 py-2 text-left ${focus ? "bg-axc-light-bg" : ""}`}>
                    {item.icon}
                    {item.label}
                  </button>
                )}
              </MenuItem>
            ))}
          </MenuItems>
        </Transition>
      </Menu>
    );
  }

  const selectedOption = options?.find((opt) => opt.value === value);

  return (
    <Listbox value={value || ""} onChange={onChange}>
      <div className="relative w-full">
        <ListboxButton className={`relative w-full text-left bg-white border border-axc-border rounded-md px-3 py-2.5 outline-none cursor-pointer flex items-center justify-between text-[13px] font-normal text-gray-700 focus:border-axc-border transition ${className}`}>
          <span className={`block truncate ${selectedOption ? "text-gray-700" : "text-gray-400"}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" aria-hidden="true" />
        </ListboxButton>

        <ListboxOptions
          anchor={{ to: "bottom start", gap: 4 }}
          transition
          className="z-[9999] max-h-60 overflow-auto rounded-md bg-white py-1 text-xs shadow-xl border border-axc-border focus:outline-none transition ease-in duration-100 data-[closed]:opacity-0 data-[leave]:opacity-0 w-[var(--button-width)]"
        >
          {options?.map((option) => (
            <ListboxOption key={option.value} value={option.value} className="relative cursor-pointer select-none py-2.5 px-3 text-gray-900 data-[focus]:bg-axc-navy data-[focus]:text-white data-[selected]:bg-axc-navy/10 data-[selected]:text-axc-navy font-medium transition-colors">
              <span className="block truncate">{option.label}</span>
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  );
}