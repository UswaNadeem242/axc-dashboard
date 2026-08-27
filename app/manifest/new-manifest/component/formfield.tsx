"use client";
import React, { useState } from "react";
import { Pencil } from "lucide-react";
import { toSentenceCase } from "@/app/create-entries/components/form";

export const inputClass =
  "border border-axc-border rounded-md px-3 py-2.5 outline-none w-full text-regular-small text-axc-gray placeholder:text-axc-gray transition cursor-pointer placeholder:text-regular-small";

export const errorInputClass =
  "border border-red-400 rounded-md px-3 py-2.5 outline-none w-full text-regular-small text-axc-gray placeholder:text-axc-gray bg-red-50/40 focus:border-red-400 transition cursor-pointer placeholder:text-regular-small";

export const disabledInputClass =
  "border border-axc-border rounded-md px-3 py-2.5 outline-none w-full text-regular-small text-axc-gray placeholder:text-axc-gray bg-gray-50 cursor-not-allowed transition placeholder:text-regular-small";

export function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="text-regular-medium text-axc-dark-gray  capitalize">
      {children}
      {required && <span className="text-axc-red ml-0.5">*</span>}
    </label>
  );
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-[10px] text-axc-red font-semibold mt-1">{message}</p>;
}

export function FileUploadField({
  onFileChange,
  placeholder = "No file chosen",
  multiple = false,
}: {
  onFileChange?: (file: File | null) => void;
  placeholder?: string;
  multiple?: boolean;
}) {
  const [fileName, setFileName] = useState("");
  return (
    <label className="flex items-center gap-2 border border-axc-border rounded-md px-2 py-2.5 text-[11px] text-gray-500 bg-white cursor-pointer hover:bg-gray-50 transition">
      <span className="px-2 py-1 bg-gray-100 rounded text-regular-small text-gray-600 shrink-0">Choose File</span>
      <span className={`truncate ${fileName ? "text-gray-700 font-medium" : "text-gray-400"}`}>{fileName || placeholder}</span>
      <input
        type="file"
        multiple={multiple}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0] || null;
          setFileName(f ? f.name : "");
          onFileChange?.(f);
        }}
      />
    </label>
  );
}

export function EditIconButton({
  active,
  onToggle,
  title = "Edit",
}: {
  active: boolean;
  onToggle: () => void;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      title={title}
      aria-pressed={active}
      className={`flex items-center justify-center h-7 w-7 shrink-0 rounded transition cursor-pointer ${
        active
          ? "bg-axc-navy text-white"
          : "bg-transparent text-axc-grey hover:bg-gray-100 cursor pointer"
      }`}
    >
      <Pencil size={13} />
    </button>
  );
}

export function PanelHeader({ title, right }: { title: string; right?: React.ReactNode }) {
  return (
    <div className="bg-axc-navy text-white px-4 py-2.5 flex items-center justify-between gap-2">
      <h3>{toSentenceCase(title)}</h3>
      {right}
    </div>
  );
}