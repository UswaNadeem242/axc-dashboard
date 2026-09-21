"use client";
import React, { useState, useRef } from "react";
import { Pencil, Check, Upload, FileText, X, AlertCircle } from "lucide-react";
import {
  ProfileFormState,
  ProfileFormErrors,
  OrganizationFormState,
  OrganizationFormErrors,
} from "./settingstate";

/* =========================================================
   SHARED FIELD PRIMITIVES (moved in from formfield.tsx)
========================================================= */

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
   FILE UPLOAD FIELD (restricted formats + per-file progress bar)
--------------------------------------------------------- */

interface UploadingFile {
  id: string;
  file: File;
  uploaded: number; // bytes uploaded so far
  status: "uploading" | "done" | "error";
  errorMessage?: string;
}

function formatBytes(bytes: number) {
  if (bytes <= 0) return "0 MB";
  const mb = bytes / (1024 * 1024);
  return `${mb < 10 ? mb.toFixed(1) : Math.round(mb)} MB`;
}

// Default: JPEG, PNG, PDF, SVG
const DEFAULT_ACCEPTED_MIME_TYPES = ["image/jpeg", "image/png", "application/pdf", "image/svg+xml"];
const DEFAULT_ACCEPTED_LABEL = "JPEG, PNG, PDF and SVG formats, up to 10MB";
const DEFAULT_MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export function FileUploadField({
  onFileChange,
  onFilesChange,
  placeholder,
  multiple = false,
  acceptedMimeTypes = DEFAULT_ACCEPTED_MIME_TYPES,
  acceptedExtensions,
  acceptedLabel = DEFAULT_ACCEPTED_LABEL,
  maxSizeBytes = DEFAULT_MAX_SIZE_BYTES,
}: {
  onFileChange?: (file: File | null) => void;
  onFilesChange?: (files: File[]) => void;
  placeholder?: string;
  multiple?: boolean;
  acceptedMimeTypes?: string[];
  acceptedExtensions?: string[];
  acceptedLabel?: string;
  maxSizeBytes?: number;
}) {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  function isAcceptedFile(file: File): { ok: boolean; message?: string } {
    if (file.size > maxSizeBytes) {
      return { ok: false, message: `File too large, max ${formatBytes(maxSizeBytes)}.` };
    }

    const mimeOk = acceptedMimeTypes.includes(file.type);
    const extOk = acceptedExtensions
      ? acceptedExtensions.some((ext) => file.name.toLowerCase().endsWith(ext.toLowerCase()))
      : false;

    if (!mimeOk && !extOk) {
      return { ok: false, message: "Unsupported file, upload another." };
    }
    return { ok: true };
  }

  function simulateUpload(id: string, totalSize: number) {
    const stepMs = 200;
    const stepSize = Math.max(totalSize / 18, 80 * 1024);

    const interval = setInterval(() => {
      setUploadingFiles((prev) => {
        let finished = false;
        const next = prev.map((uf) => {
          if (uf.id !== id || uf.status !== "uploading") return uf;
          const uploaded = Math.min(uf.uploaded + stepSize, totalSize);
          if (uploaded >= totalSize) finished = true;
          return { ...uf, uploaded, status: uploaded >= totalSize ? "done" : "uploading" } as UploadingFile;
        });
        if (finished) clearInterval(interval);
        return next;
      });
    }, stepMs);
  }

  function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    const newFiles = Array.from(fileList);

    const mapped: UploadingFile[] = newFiles.map((file, i) => {
      const id = `${file.name}-${Date.now()}-${i}`;
      const check = isAcceptedFile(file);
      if (!check.ok) {
        return { id, file, uploaded: 0, status: "error", errorMessage: check.message };
      }
      return { id, file, uploaded: 0, status: "uploading" };
    });

    if (!multiple) {
      setUploadingFiles(mapped.slice(0, 1));
    } else {
      setUploadingFiles((prev) => [...prev, ...mapped]);
    }

    const accepted = mapped.filter((m) => m.status === "uploading");
    accepted.forEach((uf) => simulateUpload(uf.id, uf.file.size));

    const acceptedFiles = accepted.map((uf) => uf.file);
    if (!multiple) {
      onFileChange?.(acceptedFiles[0] ?? null);
    } else if (acceptedFiles.length > 0) {
      onFilesChange?.(acceptedFiles);
    }
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
        <span className="text-xs text-gray-400">{placeholder || "Drop your files here or browse"}</span>
        <span className="text-[10px] text-gray-400">{acceptedLabel}</span>
        <input
          ref={inputRef}
          type="file"
          multiple={multiple}
          accept={acceptedMimeTypes.join(",")}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </label>

      {uploadingFiles.length > 0 && (
        <div className="flex flex-row flex-wrap gap-2">
          {uploadingFiles.map((uf) => {
            const percent =
              uf.status === "error" ? 0 : Math.min(100, Math.round((uf.uploaded / uf.file.size) * 100));
            const done = uf.status === "done";
            const isError = uf.status === "error";

            return (
              <div
                key={uf.id}
                className={`border rounded-md px-2.5 py-2 flex items-center gap-2 w-[calc(50%-0.25rem)] sm:w-[calc(33.333%-0.34rem)] lg:w-[calc(20%-0.4rem)] ${
                  isError ? "border-red-300 bg-red-50/40" : "border-axc-border bg-white"
                }`}
              >
                <span
                  className={`p-1.5 rounded shrink-0 ${
                    isError ? "bg-red-100 text-axc-red" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {isError ? <AlertCircle size={13} /> : <FileText size={13} />}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1.5">
                    <p className="text-[11px] font-medium text-gray-700 truncate">{uf.file.name}</p>
                    <button
                      type="button"
                      onClick={() => removeFile(uf.id)}
                      className="text-axc-red hover:text-axc-red transition shrink-0 cursor-pointer"
                      title="Remove file"
                    >
                      <X size={12} />
                    </button>
                  </div>

                  {isError ? (
                    <p className="text-[10px] text-axc-red font-medium mt-0.5 truncate">{uf.errorMessage}</p>
                  ) : (
                    <>
                      <p className="text-[9px] text-gray-400 mt-0.5">
                        {formatBytes(uf.uploaded)} of {formatBytes(uf.file.size)}
                      </p>
                      <div className="mt-1 flex items-center h-1 w-full overflow-hidden rounded-full">
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
                    </>
                  )}
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

/* =========================================================
   FORM HOOKS
========================================================= */

// same accepted-format convention already used in FileUploadField
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/svg+xml"];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB

/* =========================================================
   PROFILE
========================================================= */

const emptyProfileForm: ProfileFormState = {
  firstName: "",
  lastName: "",
  username: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  country: "",
  zipCode: "",
  bio: "",

  avatarFile: null,
  avatarPreview: "",
};

export function useProfileForm(initialAvatarUrl?: string) {
  const [form, setForm] = useState<ProfileFormState>({
    ...emptyProfileForm,
    avatarPreview: initialAvatarUrl || "",
  });
  const [errors, setErrors] = useState<ProfileFormErrors>({});
  const [loading, setLoading] = useState(false);

  const updateField = <K extends keyof ProfileFormState>(key: K, value: ProfileFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleAvatarSelect = (file: File | null) => {
    if (!file) {
      setForm((prev) => ({ ...prev, avatarFile: null, avatarPreview: "" }));
      return;
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setErrors((prev) => ({ ...prev, avatar: "Unsupported file, upload another." }));
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setErrors((prev) => ({ ...prev, avatar: "File too large, max 10 MB." }));
      return;
    }

    setErrors((prev) => ({ ...prev, avatar: undefined }));
    setForm((prev) => ({
      ...prev,
      avatarFile: file,
      avatarPreview: URL.createObjectURL(file),
    }));
  };

  const validate = (): boolean => {
    const next: ProfileFormErrors = {};
    if (!form.firstName?.trim()) next.firstName = "First Name is required";
    if (!form.lastName?.trim()) next.lastName = "Last Name is required";
    setErrors((prev) => ({ ...prev, firstName: next.firstName, lastName: next.lastName }));
    return !next.firstName && !next.lastName;
  };

  const handleSaveChanges = () => {
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 700);
  };

  const handleCancel = () => {
    setForm(emptyProfileForm);
    setErrors({});
  };

  return {
    form,
    setForm,
    updateField,
    handleAvatarSelect,
    errors,
    loading,
    handleSaveChanges,
    handleCancel,
  };
}

/* =========================================================
   ORGANIZATION
========================================================= */

const emptyOrganizationForm: OrganizationFormState = {
  companyName: "",
  industry: "",
  email: "",
  phoneNumber: "",
  websiteUrl: "",
  country: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  stateProvince: "",
  zipPostalCode: "",

  logoFile: null,
  logoPreview: "",
};

export function useOrganizationForm(initialLogoUrl?: string) {
  const [form, setForm] = useState<OrganizationFormState>({
    ...emptyOrganizationForm,
    logoPreview: initialLogoUrl || "",
  });
  const [errors, setErrors] = useState<OrganizationFormErrors>({});
  const [loading, setLoading] = useState(false);

  const updateField = <K extends keyof OrganizationFormState>(key: K, value: OrganizationFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleLogoSelect = (file: File | null) => {
    if (!file) {
      setForm((prev) => ({ ...prev, logoFile: null, logoPreview: "" }));
      return;
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setErrors((prev) => ({ ...prev, logo: "Unsupported file, upload another." }));
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setErrors((prev) => ({ ...prev, logo: "File too large, max 10 MB." }));
      return;
    }

    setErrors((prev) => ({ ...prev, logo: undefined }));
    setForm((prev) => ({
      ...prev,
      logoFile: file,
      logoPreview: URL.createObjectURL(file),
    }));
  };

  const validate = (): boolean => {
    const next: OrganizationFormErrors = {};
    if (!form.companyName?.trim()) next.companyName = "Company Name is required";
    if (!form.industry?.trim()) next.industry = "Industry is required";
    if (!form.email?.trim()) next.email = "Email is required";
    if (!form.phoneNumber?.trim()) next.phoneNumber = "Phone Number is required";
    setErrors((prev) => ({ ...prev, ...next }));
    return Object.keys(next).length === 0;
  };

  const handleSaveChanges = () => {
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 700);
  };

  const handleCancel = () => {
    setForm(emptyOrganizationForm);
    setErrors({});
  };

  return {
    form,
    setForm,
    updateField,
    handleLogoSelect,
    errors,
    loading,
    handleSaveChanges,
    handleCancel,
  };
}