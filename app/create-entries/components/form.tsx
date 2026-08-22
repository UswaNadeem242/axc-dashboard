"use client";
import React, { useState } from "react";
import { Pencil } from "lucide-react";
export const inputClass =
  "border border-gray-300 rounded-md px-3 py-2.5 outline-none w-full text-[13px] text-gray-700 placeholder:text-gray-400 focus:border-gray-400 transition";
export const errorInputClass =
  "border border-red-400 rounded-md px-3 py-2.5 outline-none w-full text-[13px] text-gray-700 placeholder:text-gray-400 bg-red-50/40 focus:border-red-400 transition";

export function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="font-medium text-gray-600 text-[13px]">
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
}: {
  onFileChange?: (file: File | null) => void;
  placeholder?: string;
}) {
  const [fileName, setFileName] = useState("");
  return (
    <label className="flex items-center gap-2 border border-axc-gray rounded px-2 py-2.5 text-[11px] text-gray-500 bg-white cursor-pointer hover:bg-gray-50 transition">
      <span className="px-2 py-1 bg-gray-100 rounded text-[10px] font-bold text-gray-600 shrink-0">CHOOSE FILE</span>
      <span className={`truncate ${fileName ? "text-gray-700 font-medium" : "text-gray-400"}`}>{fileName || placeholder}</span>
      <input type="file" className="hidden" onChange={(e) => {
          const f = e.target.files?.[0] || null;
          setFileName(f ? f.name : "");
          onFileChange?.(f);
        }}
      />
    </label>
  );
}
export function EditIconButton({
  active,  onToggle, title = "Edit",
}: {
  active: boolean; onToggle: () => void; title?: string;
}) {
  return (
    <button type="button" onClick={onToggle}
      title={title}
      aria-pressed={active}
      className={`flex items-center justify-center h-7 w-7 shrink-0 rounded transition ${
        active
          ? "bg-axc-navy text-white cursor-pointer"
          : "bg-transparent text-axc-grey   hover:bg-gray-100 cursor-pointer"
      }`}
    >
      <Pencil size={13} />
    </button>
  );
}
export function PanelHeader({ title, right }: { title: string; right?: React.ReactNode }) {
  return (
    <div className="bg-axc-navy text-white text-[13px] font-semibold px-4 py-2.5 flex items-center justify-between gap-2">
      <span>{title}</span>
      {right}
    </div>
  );
}