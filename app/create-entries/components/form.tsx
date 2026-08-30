"use client";
import React, { useState } from "react";
import { Pencil, Upload } from "lucide-react";

export const inputClass =
  "border border-axc-border rounded-md px-3 py-2.5 outline-none w-full text-regular-small text-axc-gray placeholder:text-axc-gray transition placeholder:text-regular-small";
export const errorInputClass =
  "border border-red-400 rounded-md px-3 py-2.5 outline-none w-full text-regular-small text-axc-gray placeholder:text-gray-400 bg-red-50/40 focus:border-red-400 transition placeholder:text-regular-small";

export function toSentenceCase(text: string): string {
  if (!text) return text;
  const lower = text.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

export function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  const label = typeof children === "string" ? toSentenceCase(children) : children;
  return (
    <label className=" text-axc-dark-gray text-regular-medium">
      {label}
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
    <label className="flex items-center gap-2 border border-axc-border rounded px-2 py-2.5 text-[11px] text-gray-500 bg-white cursor-pointer hover:bg-gray-50 transition">
      <span className="px-2 py-1 bg-gray-100 rounded text-regular-small  text-gray-600 shrink-0"><Upload size={14} /></span>
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
  active, onToggle, title = "Edit",
}: {
  active: boolean; onToggle: () => void; title?: string;
}) {
  return (
    <button type="button" onClick={onToggle}
      title={title}
      aria-pressed={active}
      className={`flex items-center justify-center h-7 w-7 shrink-0 rounded transition ${active
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
    <div className="bg-axc-navy text-white p-4  rounded-tl-lg  rounded-tr-lg flex items-center justify-between gap-2">
      <h3>{toSentenceCase(title)}</h3>
      {right}
    </div>
  );
}