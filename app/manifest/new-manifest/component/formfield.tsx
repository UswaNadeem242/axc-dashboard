"use client";
import React, { useState } from "react";
import { Pencil, Check, Upload } from "lucide-react";
import { toSentenceCase } from "@/app/create-entries/components/form";

export function EditCheckbox({
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
      className="flex items-center gap-1.5 text-regular-small text-axc-navy hover:text-axc-navy/80 transition cursor-pointer select-none shrink-0"
    >
      <div
        className={`h-4 w-4 rounded border flex items-center justify-center transition ${
          active
            ? "border-axc-navy bg-axc-navy text-white"
            : "border-gray-400 bg-white"
        }`}
      >
        {active && <Check size={11} strokeWidth={3} />}
      </div>
      <span className="font-bold text-[11px] tracking-wider text-gray-700">EDIT</span>
    </button>
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
          ? "bg-axc-navy text-white shadow-sm"
          : "bg-transparent text-gray-400 hover:text-axc-navy hover:bg-gray-100"
      }`}
    >
      <Pencil size={13} />
    </button>
  );
}

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
    <label className="flex flex-col items-center justify-center gap-2 border border-axc-border rounded-lg py-5 px-4 text-center bg-white cursor-pointer hover:bg-gray-50/70 transition w-full">
      <span className="p-2 bg-gray-100/90 rounded-md text-gray-600 flex items-center justify-center shrink-0">
        <Upload size={18} />
      </span>
      <span className={`text-xs truncate max-w-full ${fileName ? "text-gray-700 font-medium" : "text-gray-400"}`}>
        {fileName || placeholder}
      </span>
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


export function PanelHeader({ title, right }: { title: string; right?: React.ReactNode }) {
  return (
    <div className="bg-axc-navy/60 text-white p-4 flex items-center rounded-tl-lg rounded-tr-lg justify-between gap-2">
      <h2>{toSentenceCase(title)}</h2>
      {right}
    </div>
  );
}