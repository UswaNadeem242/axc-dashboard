"use client";
import React, { useState, useRef } from "react";
import { Pencil, Check, Upload, FileText, Trash2, Cross, X } from "lucide-react";
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

/* ---------------------------------------------------------
   FILE UPLOAD FIELD (with per-file progress bar)
--------------------------------------------------------- */

interface UploadingFile {
  id: string;
  file: File;
  uploaded: number; // bytes uploaded so far
}

function formatBytes(bytes: number) {
  if (bytes <= 0) return "0 MB";
  const mb = bytes / (1024 * 1024);
  return `${mb < 10 ? mb.toFixed(1) : Math.round(mb)} MB`;
}

export function FileUploadField({
  onFileChange,
  onFilesChange,
  placeholder = "Drop your files here or browse",
  multiple = false,
}: {
  onFileChange?: (file: File | null) => void;
  onFilesChange?: (files: File[]) => void;
  placeholder?: string;
  multiple?: boolean;
}) {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Simulates an upload progressing over time, filling the bar until it reaches the file's full size.
  function simulateUpload(id: string, totalSize: number) {
    const stepMs = 200;
    const stepSize = Math.max(totalSize / 18, 80 * 1024); // ~18 steps to finish, min 80KB/step

    const interval = setInterval(() => {
      setUploadingFiles((prev) => {
        let finished = false;
        const next = prev.map((uf) => {
          if (uf.id !== id) return uf;
          const uploaded = Math.min(uf.uploaded + stepSize, totalSize);
          if (uploaded >= totalSize) finished = true;
          return { ...uf, uploaded };
        });
        if (finished) clearInterval(interval);
        return next;
      });
    }, stepMs);
  }

  function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    const newFiles = Array.from(fileList);

    if (!multiple) {
      const file = newFiles[0];
      const id = `${file.name}-${Date.now()}`;
      setUploadingFiles([{ id, file, uploaded: 0 }]);
      onFileChange?.(file);
      simulateUpload(id, file.size);
      return;
    }

    const added: UploadingFile[] = newFiles.map((file, i) => ({
      id: `${file.name}-${Date.now()}-${i}`,
      file,
      uploaded: 0,
    }));
    setUploadingFiles((prev) => [...prev, ...added]);
    added.forEach((uf) => simulateUpload(uf.id, uf.file.size));
    onFilesChange?.(newFiles);
  }

  function removeFile(id: string) {
    setUploadingFiles((prev) => prev.filter((f) => f.id !== id));
  }

  return (
    <div className="w-full flex flex-col gap-3">
      <label
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
        className="flex flex-col items-center justify-center gap-2 border border-dashed border-axc-border rounded-lg py-6 px-4 text-center bg-white cursor-pointer hover:bg-gray-50/70 transition w-full"
      >
        <span className="p-2 bg-gray-100/90 rounded-md text-gray-600 flex items-center justify-center shrink-0">
          <Upload size={18} />
        </span>
        <span className="text-xs text-gray-400">{placeholder}</span>
        <input
          ref={inputRef}
          type="file"
          multiple={multiple}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </label>

      {uploadingFiles.length > 0 && (
        <div className="flex flex-col gap-2">
          {uploadingFiles.map((uf) => {
            const percent = Math.min(100, Math.round((uf.uploaded / uf.file.size) * 100));
            const done = percent >= 100;

            return (
              <div
                key={uf.id}
                className="border border-axc-border rounded-md px-3 py-2.5 bg-white flex items-center gap-3 w-1/5"
              >
                <span className="p-1.5 bg-gray-100 rounded text-gray-500 shrink-0">
                  <FileText size={14} />
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-medium text-gray-700 truncate">{uf.file.name}</p>
                    <button
                      type="button"
                      onClick={() => removeFile(uf.id)}
                      className="text-axc-red hover:text-axc-red transition shrink-0 cursor-pointer"
                      title="Remove file"
                    >
                      <X size={13} />
                    </button>
                  </div>

                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {formatBytes(uf.uploaded)} of {formatBytes(uf.file.size)}
                  </p>
                  <div className="mt-1.5 flex items-center h-1.5 w-3/4 overflow-hidden rounded-full">
                    <div
                      className={`h-full bg-axc-blue transition-all duration-200 ease-linear ${
                        done ? "rounded-full" : "rounded-l-full"
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                    {!done && (
                      <div
                        className="h-full rounded-r-full bg-red-400 transition-all duration-200 ease-linear"
                        style={{ width: `${100 - percent}%` }}
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function PanelHeader({ title, right }: { title: string; right?: React.ReactNode }) {
  return (
    <div className="bg-axc-navy/60 text-white p-4 flex items-center rounded-tl-lg rounded-tr-lg justify-between gap-2">
      <h2>{title}</h2>
      {right}
    </div>
  );
}