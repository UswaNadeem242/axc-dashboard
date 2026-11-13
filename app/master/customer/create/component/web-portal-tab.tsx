"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { showToast } from "@/app/src/common/toast";
import {
  inputClass,
  errorInputClass,
  FieldError,
} from "@/app/create-entries/components/form";
import {
  WebPortalUserForm,
  defaultWebPortalUserForm,
  PORTAL_MODULES,
  PORTAL_ACTIONS,
  PortalAction,
  PortalModuleKey,
} from "../../types";

export interface WebPortalFormErrors {
  name?: string;
  email?: string;
  password?: string;
}

interface WebPortalTabProps {
  data: WebPortalUserForm;
  onChange: (data: WebPortalUserForm) => void;
  onSave?: () => void;
  loading?: boolean;
}

export default function WebPortalTab({
  data,
  onChange,
  onSave,
  loading = false,
}: WebPortalTabProps) {
  const [errors, setErrors] = useState<WebPortalFormErrors>({});
  const [showPassword, setShowPassword] = useState(false);

  // ── Field Updates ──────────────────────────────────────────────────────────
  const updateField = <K extends keyof WebPortalUserForm>(
    key: K,
    val: WebPortalUserForm[K]
  ) => {
    onChange({
      ...data,
      [key]: val,
    });
    if (errors[key as keyof WebPortalFormErrors]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  // ── Permission Helpers ─────────────────────────────────────────────────────
  const togglePermission = (modKey: PortalModuleKey, action: PortalAction) => {
    const current = data.permissions[modKey]?.[action] || false;
    onChange({
      ...data,
      permissions: {
        ...data.permissions,
        [modKey]: {
          ...data.permissions[modKey],
          [action]: !current,
        },
      },
    });
  };

  // Row selection toggle
  const isRowAllSelected = (modKey: PortalModuleKey, allowed: PortalAction[]) => {
    return allowed.every((act) => data.permissions[modKey]?.[act]);
  };

  const toggleRow = (modKey: PortalModuleKey, allowed: PortalAction[]) => {
    const allSelected = isRowAllSelected(modKey, allowed);
    const updatedRow = { ...data.permissions[modKey] };
    allowed.forEach((act) => {
      updatedRow[act] = !allSelected;
    });
    onChange({
      ...data,
      permissions: {
        ...data.permissions,
        [modKey]: updatedRow,
      },
    });
  };

  // Column selection toggle
  const isColAllSelected = (act: PortalAction) => {
    return PORTAL_MODULES.filter((m) => m.allowedActions.includes(act)).every(
      (m) => data.permissions[m.key]?.[act]
    );
  };

  const toggleCol = (act: PortalAction) => {
    const allSelected = isColAllSelected(act);
    const nextPerms = { ...data.permissions };
    PORTAL_MODULES.forEach((m) => {
      if (m.allowedActions.includes(act)) {
        nextPerms[m.key] = {
          ...nextPerms[m.key],
          [act]: !allSelected,
        };
      }
    });
    onChange({
      ...data,
      permissions: nextPerms,
    });
  };

  // Global "Select All"
  const isGlobalAllSelected = () => {
    return PORTAL_MODULES.every((m) =>
      m.allowedActions.every((act) => data.permissions[m.key]?.[act])
    );
  };

  const toggleGlobalAll = () => {
    const allSelected = isGlobalAllSelected();
    const nextPerms = { ...data.permissions };
    PORTAL_MODULES.forEach((m) => {
      const updatedRow = { ...nextPerms[m.key] };
      m.allowedActions.forEach((act) => {
        updatedRow[act] = !allSelected;
      });
      nextPerms[m.key] = updatedRow;
    });
    onChange({
      ...data,
      permissions: nextPerms,
    });
  };

  // ── Validation ─────────────────────────────────────────────────────────────
  const validate = (): boolean => {
    const errs: WebPortalFormErrors = {};
    if (!data.name.trim()) {
      errs.name = "Name is required.";
    }
    if (!data.email.trim()) {
      errs.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
      errs.email = "Please enter a valid email address.";
    }
    if (!data.password.trim()) {
      if (!(data as any).hasPassword) {
        errs.password = "Password is required.";
      }
    } else if (data.password.length < 6) {
      errs.password = "Password must be at least 6 characters.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      showToast({
        variant: "error",
        message: "Please fill in all required fields properly (Name, Email, Password).",
      });
      return;
    }
    if (onSave) {
      onSave();
    } else {
      showToast({ variant: "success", message: "Portal user saved successfully!" });
    }
  };

  const handleReset = () => {
    onChange({ ...defaultWebPortalUserForm });
    setErrors({});
  };

  return (
    <div className="flex flex-col gap-6 w-full mt-4 pb-6">
      {/* ── Main Container with AWB Header ── */}
      <div className="bg-white rounded-lg border border-axc-border shadow-xs overflow-hidden flex flex-col">
        {/* AWB Panel Header */}
        <div className="bg-[#7B7FAD] bg-axc-navy/60 text-white px-5 py-3.5 flex items-center justify-between">
          <h3 className="text-xs sm:text-[14px] font-bold uppercase tracking-wider text-white">
            Add New Portal User
          </h3>
        </div>

        {/* ── Form Inputs Section ── */}
        <div className="p-4 sm:p-6 border-b border-gray-200 bg-white">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto] gap-4 items-start">
            {/* 1. Name (Required) */}
            <div className="flex flex-col gap-1">
              <label className="text-axc-dark-gray text-regular-medium">
                Name <span className="text-axc-red">*</span>
              </label>
              <input
                type="text"
                value={data.name}
                placeholder="Enter name"
                onChange={(e) => updateField("name", e.target.value)}
                className={errors.name ? errorInputClass : inputClass}
              />
              <FieldError message={errors.name} />
            </div>

            {/* 2. Email (Required) */}
            <div className="flex flex-col gap-1">
              <label className="text-axc-dark-gray text-regular-medium">
                Email <span className="text-axc-red">*</span>
              </label>
              <input
                type="email"
                value={data.email}
                placeholder="Enter email address"
                onChange={(e) => updateField("email", e.target.value)}
                className={errors.email ? errorInputClass : inputClass}
              />
              <FieldError message={errors.email} />
            </div>

            {/* 3. Password (Required) */}
            <div className="flex flex-col gap-1">
              <label className="text-axc-dark-gray text-regular-medium">
                Password <span className="text-axc-red">*</span>
              </label>
              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  value={data.password}
                  placeholder="••••••••"
                  onChange={(e) => updateField("password", e.target.value)}
                  className={`${errors.password ? errorInputClass : inputClass} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-axc-navy cursor-pointer transition p-0.5 focus:outline-none"
                  title={showPassword ? "Hide password" : "Show password"}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <FieldError message={errors.password} />
            </div>

            {/* 4. Is Admin */}
            <div className="flex flex-col gap-1 sm:items-center sm:pt-6">
              <label className="text-axc-dark-gray text-regular-medium text-xs font-semibold uppercase sm:hidden">
                Is Admin
              </label>
              <label className="flex items-center gap-2 cursor-pointer pt-2 sm:pt-0">
                <input
                  type="checkbox"
                  checked={data.isAdmin}
                  onChange={(e) => updateField("isAdmin", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-axc-navy focus:ring-axc-navy/30 cursor-pointer accent-axc-navy"
                />
                <span className="text-xs font-bold text-axc-dark-gray uppercase tracking-tight">
                  Is Admin
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* ── Permissions Table Section ── */}
        <div className="p-4  bg-white flex flex-col gap-3">
          {/* Top Bar with Select All and AWB Extra Options */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isGlobalAllSelected()}
                onChange={toggleGlobalAll}
                className="h-4 w-4 rounded border-gray-300 text-axc-navy focus:ring-axc-navy/30 cursor-pointer accent-axc-navy"
              />
              <span className="text-xs font-bold text-axc-dark-gray uppercase tracking-wide">
                Select All
              </span>
            </label>

            {/* AWB Label Printing Preferences (from Reference Image) */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-gray-700">
              <label className="flex items-center gap-1.5 cursor-pointer select-none hover:text-axc-navy transition">
                <input
                  type="checkbox"
                  checked={data.reprintAwbLabel}
                  onChange={(e) => updateField("reprintAwbLabel", e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-gray-300 text-axc-navy focus:ring-axc-navy/30 cursor-pointer accent-axc-navy"
                />
                <span>Reprint AWB Label</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer select-none hover:text-axc-navy transition">
                <input
                  type="checkbox"
                  checked={data.hideLabelDoc}
                  onChange={(e) => updateField("hideLabelDoc", e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-gray-300 text-axc-navy focus:ring-axc-navy/30 cursor-pointer accent-axc-navy"
                />
                <span>Hide Label Doc</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer select-none hover:text-axc-navy transition">
                <input
                  type="checkbox"
                  checked={data.hideLabelPrint}
                  onChange={(e) => updateField("hideLabelPrint", e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-gray-300 text-axc-navy focus:ring-axc-navy/30 cursor-pointer accent-axc-navy"
                />
                <span>Hide Label Print</span>
              </label>
            </div>
          </div>

          {/* Matrix Table */}
          <div className="overflow-x-auto border border-gray-200 rounded-md shadow-xs">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-axc-navy/10 text-axc-dark-gray text-left whitespace-nowrap border-b border-axc-border font-bold text-regular-medium capitalize tracking-tight">
                  <th className="px-4 py-3 text-left font-bold tracking-wider  capitalize   min-w-[180px]">
                    Permissions
                  </th>
                  {PORTAL_ACTIONS.map((action) => {
                    const allColChecked = isColAllSelected(action.key);
                    return (
                      <th
                        key={action.key}
                        className="px-3 py-3 text-center font-bold tracking-wider capitalize  min-w-[90px]"
                      >
                        <label className="inline-flex items-center gap-1.5 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={allColChecked}
                            onChange={() => toggleCol(action.key)}
                            className="h-3.5 w-3.5 rounded border-gray-300 text-axc-navy focus:ring-axc-navy/30 cursor-pointer accent-axc-navy"
                          />
                          <span>{action.label}</span>
                        </label>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {PORTAL_MODULES.map((module) => {
                  const rowAllChecked = isRowAllSelected(module.key, module.allowedActions);
                  return (
                    <tr
                      key={module.key}
                      className="hover:bg-blue-50/40 transition-colors"
                    >
                      {/* Module Row Header with Select Row Checkbox */}
                      <td className="px-4 py-2.5 text-black text-regular-small">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={rowAllChecked}
                            onChange={() => toggleRow(module.key, module.allowedActions)}
                            className="h-4 w-4 rounded border-gray-300 text-axc-navy focus:ring-axc-navy/30 cursor-pointer accent-axc-navy"
                          />
                          <span>{module.label}</span>
                        </label>
                      </td>

                      {/* Action Checkboxes */}
                      {PORTAL_ACTIONS.map((action) => {
                        const isAllowed = module.allowedActions.includes(action.key);
                        const isChecked = data.permissions[module.key]?.[action.key] || false;

                        return (
                          <td
                            key={action.key}
                            className="px-3 py-3 text-center border-r border-gray-200 last:border-r-0"
                          >
                            {isAllowed ? (
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => togglePermission(module.key, action.key)}
                                className="h-4 w-4 rounded border-gray-300 text-axc-navy focus:ring-axc-navy/30 cursor-pointer accent-axc-navy"
                              />
                            ) : (
                              <span className="text-gray-300 select-none font-bold">—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Action Buttons (Matching AWB & Customer Tab) ── */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={handleReset}
          className="px-5 py-4 border border-axc-border bg-white text-axc-dark-gray rounded-lg text-xs font-semibold hover:bg-gray-50 transition cursor-pointer"
        >
          Reset Defaults
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={loading}
          className="px-5 py-4 bg-axc-navy cursor-pointer text-white rounded-lg text-regular-small transition shadow-sm"
        >
          {loading ? "Saving..." : "Save Portal Settings"}
        </button>
      </div>
    </div>
  );
}

