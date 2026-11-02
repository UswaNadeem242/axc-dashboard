"use client";

import React from "react";
import Link from "next/link";
import Dropdown from "@/app/src/common/dropdown";
import {
  PanelHeader,
  FieldError,
  EditIconButton,
  inputClass,
  errorInputClass,
} from "@/app/create-entries/components/form";
import {
  COMPANY_OPTIONS,
  ORIGIN_HUB_OPTIONS,
  CURRENCY_OPTIONS,
  PAYMENT_TYPE_OPTIONS,
} from "../../types";

// ── Exact-case label (bypasses project toSentenceCase) ──────────────────────
function ExactFieldLabel({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="text-axc-dark-gray text-regular-medium">
      {children}
      {required && <span className="text-axc-red ml-0.5">*</span>}
    </label>
  );
}

// ── Types ─────────────────────────────────────────────────────────────────────
export interface CustomerFormState {
  name: string;
  company: string;
  originHub: string;
  parentCustomer: string;
  originCode: string;
  editOriginCode: boolean;
  email: string;
  address: string;
  currency: string;
  paymentType: string;
  creditLimit: string;
}

export interface CustomerFormErrors {
  name?: string;
  company?: string;
  originHub?: string;
  originCode?: string;
  email?: string;
  currency?: string;
  paymentType?: string;
  creditLimit?: string;
}

interface CustomerTabProps {
  form: CustomerFormState;
  errors: CustomerFormErrors;
  loading: boolean;
  isEdit: boolean;
  onChange: (form: CustomerFormState) => void;
  onErrorChange: (errors: CustomerFormErrors) => void;
  onHubChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function CustomerTab({
  form,
  errors,
  loading,
  isEdit,
  onChange,
  onErrorChange,
  onHubChange,
  onSubmit,
}: CustomerTabProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-6 w-full mt-4 pb-6"
    >
      <div className="bg-white rounded-lg border border-axc-border shadow-sm flex flex-col">
        <PanelHeader
          title={isEdit ? "Customer Information (Edit)" : "Customer Information"}
        />

        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-3.5">

          {/* 1. Name */}
          <div className="flex flex-col gap-1">
            <ExactFieldLabel required>Name</ExactFieldLabel>
            <input
              type="text"
              value={form.name}
              placeholder="Enter Name"
              onChange={(e) => {
                onChange({ ...form, name: e.target.value });
                if (errors.name) onErrorChange({ ...errors, name: undefined });
              }}
              className={`${errors.name ? errorInputClass : inputClass} text-regular-small`}
            />
            <FieldError message={errors.name} />
          </div>

          {/* 2. Company */}
          <div className="flex flex-col gap-1">
            <ExactFieldLabel required>Company</ExactFieldLabel>
            <Dropdown
              value={form.company}
              onChange={(val) => {
                onChange({ ...form, company: val });
                if (errors.company) onErrorChange({ ...errors, company: undefined });
              }}
              className={errors.company ? "!border-red-400 !bg-red-50/40" : "border-axc-border"}
              placeholder="Select..."
              options={COMPANY_OPTIONS}
            />
            <FieldError message={errors.company} />
          </div>

          {/* 3. Origin Hub */}
          <div className="flex flex-col gap-1">
            <ExactFieldLabel required>Origin Hub</ExactFieldLabel>
            <Dropdown
              value={form.originHub}
              onChange={onHubChange}
              className={errors.originHub ? "!border-red-400 !bg-red-50/40" : "border-axc-border"}
              placeholder="Select Origin Hub..."
              options={ORIGIN_HUB_OPTIONS}
            />
            <FieldError message={errors.originHub} />
          </div>

          {/* 4. Parent Customer */}
          <div className="flex flex-col gap-1">
            <ExactFieldLabel>Parent Customer</ExactFieldLabel>
            <input
              type="text"
              value={form.parentCustomer}
              placeholder="Enter Parent Customer"
              onChange={(e) => onChange({ ...form, parentCustomer: e.target.value })}
              className={`${inputClass} text-regular-small`}
            />
          </div>

          {/* 5. Origin Code */}
          <div className="flex flex-col gap-1">
            <ExactFieldLabel required>Origin Code</ExactFieldLabel>
            <div className="relative">
              <input
                type="text"
                value={form.originCode}
                readOnly={!form.editOriginCode}
                placeholder={!form.editOriginCode ? "AUTO-GENERATED" : "Enter Origin Code"}
                onChange={(e) => {
                  onChange({ ...form, originCode: e.target.value });
                  if (errors.originCode) onErrorChange({ ...errors, originCode: undefined });
                }}
                className={`${
                  errors.originCode ? errorInputClass : inputClass
                } w-full pr-10 text-regular-small ${
                  form.editOriginCode
                    ? "bg-white"
                    : "bg-gray-50 text-gray-500 cursor-not-allowed"
                }`}
              />
              <div className="absolute right-1 top-1/2 -translate-y-1/2">
                <EditIconButton
                  active={form.editOriginCode}
                  onToggle={() =>
                    onChange({ ...form, editOriginCode: !form.editOriginCode })
                  }
                  title="Edit Origin Code"
                />
              </div>
            </div>
            <FieldError message={errors.originCode} />
          </div>

          {/* 6. Email ID */}
          <div className="flex flex-col gap-1">
            <ExactFieldLabel required>Email ID</ExactFieldLabel>
            <input
              type="email"
              value={form.email}
              placeholder="Enter Email ID"
              onChange={(e) => {
                onChange({ ...form, email: e.target.value });
                if (errors.email) onErrorChange({ ...errors, email: undefined });
              }}
              className={`${errors.email ? errorInputClass : inputClass} text-regular-small`}
            />
            <FieldError message={errors.email} />
          </div>

          {/* 7. Address — full width */}
          <div className="flex flex-col gap-1 sm:col-span-2 xl:col-span-3">
            <ExactFieldLabel>Address</ExactFieldLabel>
            <textarea
              rows={2}
              value={form.address}
              placeholder="Enter Address"
              onChange={(e) => onChange({ ...form, address: e.target.value })}
              className="border border-axc-border rounded-md px-3 py-2 outline-none w-full text-regular-small text-axc-gray placeholder:text-gray-400 focus:border-axc-navy focus:ring-1 focus:ring-axc-navy transition resize-none"
            />
          </div>

          {/* 8. Currency */}
          <div className="flex flex-col gap-1">
            <ExactFieldLabel required>Currency</ExactFieldLabel>
            <Dropdown
              value={form.currency}
              onChange={(val) => {
                onChange({ ...form, currency: val });
                if (errors.currency) onErrorChange({ ...errors, currency: undefined });
              }}
              className={errors.currency ? "!border-red-400 !bg-red-50/40" : "border-axc-border"}
              placeholder="Select Currency..."
              options={CURRENCY_OPTIONS}
            />
            <FieldError message={errors.currency} />
          </div>

          {/* 9. Payment Type */}
          <div className="flex flex-col gap-1">
            <ExactFieldLabel required>Payment Type</ExactFieldLabel>
            <Dropdown
              value={form.paymentType}
              onChange={(val) => {
                onChange({ ...form, paymentType: val });
                if (errors.paymentType) onErrorChange({ ...errors, paymentType: undefined });
              }}
              className={errors.paymentType ? "!border-red-400 !bg-red-50/40" : "border-axc-border"}
              placeholder="Select Payment Type..."
              options={PAYMENT_TYPE_OPTIONS}
            />
            <FieldError message={errors.paymentType} />
          </div>

          {/* 10. Credit Limit */}
          <div className="flex flex-col gap-1">
            <ExactFieldLabel>Credit Limit</ExactFieldLabel>
            <input
              type="number"
              min="0"
              step="any"
              value={form.creditLimit}
              placeholder="Enter Credit Limit"
              onChange={(e) => {
                onChange({ ...form, creditLimit: e.target.value });
                if (errors.creditLimit) onErrorChange({ ...errors, creditLimit: undefined });
              }}
              className={`${errors.creditLimit ? errorInputClass : inputClass} text-regular-small`}
            />
            <FieldError message={errors.creditLimit} />
          </div>

        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Link
          href="/master/customer"
          className="px-5 py-4 border border-axc-border bg-white text-axc-dark-gray rounded-lg text-regular-small hover:bg-gray-50 transition cursor-pointer"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-4 bg-axc-navy cursor-pointer text-white rounded-lg text-regular-small transition shadow-sm disabled:opacity-50"
        >
          {loading
            ? isEdit ? "Updating..." : "Saving..."
            : isEdit ? "Update Customer" : "Create Customer"}
        </button>
      </div>
    </form>
  );
}

