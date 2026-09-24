"use client";
import React, { useState, useRef } from "react";
import { Pencil, Check, Upload, FileText, X, AlertCircle } from "lucide-react";
import {
  ProfileFormState,
  ProfileFormErrors,
  OrganizationFormState,
  OrganizationFormErrors,
  SecurityFormState,
  SecurityFormErrors,
  NotificationFormState,
  BillingPlan,
  PaymentMethod,
  BillingHistoryItem,
} from "./settingstate";
import { showToast } from "../../src/common/toast";
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
interface UploadingFile {
  id: string;
  file: File;
  uploaded: number;
  status: "uploading" | "done" | "error";
  errorMessage?: string;
}

function formatBytes(bytes: number) {
  if (bytes <= 0) return "0 MB";
  const mb = bytes / (1024 * 1024);
  return `${mb < 10 ? mb.toFixed(1) : Math.round(mb)} MB`;
}

const DEFAULT_ACCEPTED_MIME_TYPES = ["image/jpeg", "image/png", "application/pdf", "image/svg+xml"];
const DEFAULT_ACCEPTED_LABEL = "JPEG, PNG, PDF and SVG formats, up to 10MB";
const DEFAULT_MAX_SIZE_BYTES = 10 * 1024 * 1024;

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
      <h3>{title}</h3>
      {right}
    </div>
  );
}

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/svg+xml"];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

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
export const SESSION_TIMEOUT_OPTIONS = [
  { value: "15", label: "15 minutes" },
  { value: "30", label: "30 minutes" },
  { value: "60", label: "1 hour" },
  { value: "120", label: "2 hours" },
  { value: "1440", label: "24 hours" },
];

export const DEFAULT_SESSION_TIMEOUT = "60";

const emptySecurityForm: SecurityFormState = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

interface UseSecurityFormOptions {
  onUpdatePassword?: (payload: {
    currentPassword: string;
    newPassword: string;
  }) => Promise<void> | void;
  onTwoFactorChange?: (enabled: boolean) => Promise<void> | void;
  onSessionTimeoutChange?: (enabled: boolean) => Promise<void> | void;
  onSessionTimeoutDurationChange?: (minutes: string) => Promise<void> | void;
  initialTwoFactorEnabled?: boolean;
  initialSessionTimeoutEnabled?: boolean;
  initialSessionTimeoutDuration?: string;
  minPasswordLength?: number;
}

export function useSecurityForm({
  onUpdatePassword,
  onTwoFactorChange,
  onSessionTimeoutChange,
  onSessionTimeoutDurationChange,
  initialTwoFactorEnabled = false,
  initialSessionTimeoutEnabled = false,
  initialSessionTimeoutDuration = DEFAULT_SESSION_TIMEOUT,
  minPasswordLength = 8,
}: UseSecurityFormOptions = {}) {
  const [form, setForm] = useState<SecurityFormState>(emptySecurityForm);
  const [errors, setErrors] = useState<SecurityFormErrors>({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(initialTwoFactorEnabled);
  const [sessionTimeoutEnabled, setSessionTimeoutEnabled] = useState(
    initialSessionTimeoutEnabled,
  );
  const [sessionTimeoutDuration, setSessionTimeoutDuration] = useState(
    initialSessionTimeoutDuration,
  );

  const updateField = <K extends keyof SecurityFormState>(
    key: K,
    value: SecurityFormState[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (): boolean => {
    const next: SecurityFormErrors = {};

    if (!form.currentPassword) {
      next.currentPassword = "Current password is required";
    }

    if (!form.newPassword) {
      next.newPassword = "New password is required";
    } else if (form.newPassword.length < minPasswordLength) {
      next.newPassword = `Password must be at least ${minPasswordLength} characters`;
    } else if (form.newPassword === form.currentPassword) {
      next.newPassword = "New password must be different from current password";
    }

    if (!form.confirmPassword) {
      next.confirmPassword = "Please confirm your new password";
    } else if (form.confirmPassword !== form.newPassword) {
      next.confirmPassword = "Passwords do not match";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleCancel = () => {
    setForm(emptySecurityForm);
    setErrors({});
  };

  const handleUpdatePassword = async () => {
    if (!validate()) return;
    setIsUpdating(true);
    try {
      await onUpdatePassword?.({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setForm(emptySecurityForm);
      setErrors({});
    } catch (err) {
      setErrors({
        currentPassword:
          err instanceof Error ? err.message : "Failed to update password",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const onToggleTwoFactor = async () => {
    const next = !twoFactorEnabled;
    setTwoFactorEnabled(next);
    try {
      await onTwoFactorChange?.(next);
    } catch {
      setTwoFactorEnabled(!next);
    }
  };

  const onToggleSessionTimeout = async () => {
    const next = !sessionTimeoutEnabled;
    setSessionTimeoutEnabled(next);
    try {
      await onSessionTimeoutChange?.(next);
    } catch {
      setSessionTimeoutEnabled(!next);
    }
  };

  const onChangeSessionTimeoutDuration = async (minutes: string) => {
    const previous = sessionTimeoutDuration;
    setSessionTimeoutDuration(minutes);
    try {
      await onSessionTimeoutDurationChange?.(minutes);
    } catch {
      setSessionTimeoutDuration(previous);
    }
  };

  return {
    form,
    errors,
    updateField,
    handleUpdatePassword,
    handleCancel,
    twoFactorEnabled,
    onToggleTwoFactor,
    sessionTimeoutEnabled,
    onToggleSessionTimeout,
    sessionTimeoutDuration,
    onChangeSessionTimeoutDuration,
    isUpdating,
  };
}

const defaultNotificationForm: NotificationFormState = {
  teamUpdates: false,
  billingPayments: false,
  securityAlerts: false,
  marketingPromotions: false,
  newFeatures: false,
  mentions: false,
  comments: false,
  teamInvites: false,
  systemAlerts: false,
  messages: false,
  taskUpdates: false,
  productUpdates: false,
};

interface UseNotificationFormOptions {
  onToggleChange?: (key: keyof NotificationFormState, value: boolean) => Promise<void> | void;
  initialValues?: Partial<NotificationFormState>;
}

export function useNotificationForm({
  onToggleChange,
  initialValues,
}: UseNotificationFormOptions = {}) {
  const [form, setForm] = useState<NotificationFormState>({
    ...defaultNotificationForm,
    ...initialValues,
  });

  const onToggle = async (key: keyof NotificationFormState) => {
    const next = !form[key];
    setForm((prev) => ({ ...prev, [key]: next }));
    try {
      await onToggleChange?.(key, next);
      showToast({ variant: "success", message: "Preferences saved" });
    } catch {
      setForm((prev) => ({ ...prev, [key]: !next }));
      showToast({ variant: "error", message: "Failed to save preferences" });
    }
  };

  return { form, onToggle };
}

const defaultBillingPlan: BillingPlan = {
  name: "Silver",
  status: "Active",
  price: 49,
  nextBillingDate: "Sep 1, 2026",
  activeUsers: 1,
  maxUsers: 5,
};

interface UseBillingFormOptions {
  initialPlan?: BillingPlan;
  initialPaymentMethods?: PaymentMethod[];
  initialBillingHistory?: BillingHistoryItem[];
  onAddCard?: () => void;
  onRemoveCard?: (id: string) => Promise<void> | void;
  onSetDefaultCard?: (id: string) => Promise<void> | void;
  onUpgradePlan?: () => void;
  onDownloadInvoice?: (id: string) => Promise<void> | void;
}

export function useBillingForm({
  initialPlan = defaultBillingPlan,
  initialPaymentMethods = [],
  initialBillingHistory = [],
  onAddCard,
  onRemoveCard,
  onSetDefaultCard,
  onUpgradePlan,
  onDownloadInvoice,
}: UseBillingFormOptions = {}) {
  const [plan] = useState<BillingPlan>(initialPlan);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(initialPaymentMethods);
  const [billingHistory] = useState<BillingHistoryItem[]>(initialBillingHistory);

  const handleAddCard = () => {
    onAddCard?.();
  };

  const handleRemoveCard = async (id: string) => {
    const previous = paymentMethods;
    setPaymentMethods((prev) => {
      const next = prev.filter((card) => card.id !== id);
      if (next.length > 0 && !next.some((card) => card.isDefault)) {
        next[0] = { ...next[0], isDefault: true };
      }
      return next;
    });
    try {
      await onRemoveCard?.(id);
      showToast({ variant: "success", message: "Card removed successfully" });
    } catch {
      setPaymentMethods(previous);
      showToast({ variant: "error", message: "Failed to remove card" });
    }
  };

  const handleSetDefault = async (id: string) => {
    const previous = paymentMethods;
    setPaymentMethods((prev) => prev.map((card) => ({ ...card, isDefault: card.id === id })));
    try {
      await onSetDefaultCard?.(id);
      showToast({ variant: "success", message: "Default card updated" });
    } catch {
      setPaymentMethods(previous);
      showToast({ variant: "error", message: "Failed to update default card" });
    }
  };

  const handleUpgradePlan = () => {
    onUpgradePlan?.();
  };

  const handleDownloadInvoice = async (id: string) => {
    try {
      await onDownloadInvoice?.(id);
      showToast({ variant: "success", message: "Invoice download started" });
    } catch {
      showToast({ variant: "error", message: "Failed to download invoice" });
    }
  };

  return {
    plan,
    paymentMethods,
    billingHistory,
    handleAddCard,
    handleRemoveCard,
    handleSetDefault,
    handleUpgradePlan,
    handleDownloadInvoice,
  };
}