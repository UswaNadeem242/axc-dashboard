"use client";

import React from "react";
import Dropdown from "@/app/src/common/dropdown";
import {
  CustomerEmailSettings,
  defaultCustomerEmailSettings,
  EMAIL_CYCLE_OPTIONS,
  EMAIL_TIME_OPTIONS,
  REPORT_HEAD_OPTIONS,
  SHIPMENT_RANGE_OPTIONS,
  LEDGER_DATE_RANGE_OPTIONS,
} from "../../types";

interface EmailSettingTabProps {
  data: CustomerEmailSettings;
  onChange: (data: CustomerEmailSettings) => void;
  onSave?: () => void;
  loading?: boolean;
}

// ── Reusable Section Card with AWB Look & Feel ──────────────────────────────
function SectionCard({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white rounded-lg border border-axc-border shadow-xs overflow-hidden flex flex-col transition-all duration-150 hover:shadow-sm ${className}`}
    >
      {/* AWB Panel Header */}
      <div className="bg-[#7B7FAD] bg-axc-navy/60 text-white px-5 py-3 flex items-center justify-between shrink-0">
        <h3 className="text-xs sm:text-[13px] font-bold capitalize tracking-wide text-white">
          {title}
        </h3>
      </div>
      {/* Content */}
      <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 gap-4 bg-white">
        {children}
      </div>
    </div>
  );
}

// ── Reusable Label + Dropdown Row ───────────────────────────────────────────
function SettingFieldRow({
  label,
  value,
  options,
  placeholder = "Select...",
  searchable = false,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  searchable?: boolean;
  onChange: (val: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[210px_1fr] items-center gap-1.5 sm:gap-4">
      <label className="text-axc-dark-gray text-regular-medium capitalize whitespace-nowrap">
        {label}
      </label>
      <div className="w-full">
        <Dropdown
          value={value}
          onChange={onChange}
          options={options}
          placeholder={placeholder}
          searchable={searchable}
          className="border-axc-border w-full text-xs"
        />
      </div>
    </div>
  );
}

// ── Reusable Checkbox Row ───────────────────────────────────────────────────
function SettingCheckboxRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-start gap-2.5 cursor-pointer text-xs font-medium text-axc-dark-gray hover:text-axc-navy select-none py-0.5 transition-colors">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-gray-300 text-axc-navy focus:ring-axc-navy/30 cursor-pointer mt-0.5 accent-axc-navy"
      />
      <span className="leading-tight">{label}</span>
    </label>
  );
}

export default function EmailSettingTab({
  data,
  onChange,
  onSave,
  loading = false,
}: EmailSettingTabProps) {
  const updateField = <K extends keyof CustomerEmailSettings>(
    key: K,
    val: CustomerEmailSettings[K]
  ) => {
    onChange({
      ...data,
      [key]: val,
    });
  };

  const handleReset = () => {
    onChange({ ...defaultCustomerEmailSettings });
  };

  return (
    <div className="flex flex-col gap-6 w-full mt-4 pb-6">
      {/* ── ROW 1: MIS Email Setting & Outstanding Email Setting (Exact Same Height & Length) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 items-stretch">
        {/* CARD 1: MIS EMAIL SETTING */}
        <SectionCard title="MIS Email Setting" className="h-full">
          <div className="flex flex-col gap-3.5">
            <SettingFieldRow
              label="Report Head"
              value={data.misReportHead}
              options={REPORT_HEAD_OPTIONS}
              placeholder="Select..."
              searchable={true}
              onChange={(val) => updateField("misReportHead", val)}
            />

            <SettingFieldRow
              label="Custom Email Cycle"
              value={data.misEmailCycle}
              options={EMAIL_CYCLE_OPTIONS}
              onChange={(val) => updateField("misEmailCycle", val)}
            />

            <SettingFieldRow
              label="Custom Email Time 1"
              value={data.misEmailTime}
              options={EMAIL_TIME_OPTIONS}
              onChange={(val) => updateField("misEmailTime", val)}
            />

            <SettingFieldRow
              label="Custom Email Shipment Range"
              value={data.misShipmentRange}
              options={SHIPMENT_RANGE_OPTIONS}
              onChange={(val) => updateField("misShipmentRange", val)}
            />
          </div>

          <div className="pt-3 flex flex-col gap-2.5 border-t border-gray-100">
            <SettingCheckboxRow
              label="Send Email Only Once If Shipment Delivered"
              checked={data.misSendOnceIfDelivered}
              onChange={(checked) => updateField("misSendOnceIfDelivered", checked)}
            />
            <SettingCheckboxRow
              label="Don't Send Email If All The Shipments Are Delivered Of The Last Month"
              checked={data.misDontSendIfAllDeliveredLastMonth}
              onChange={(checked) =>
                updateField("misDontSendIfAllDeliveredLastMonth", checked)
              }
            />
          </div>
        </SectionCard>

        {/* CARD 2: OUTSTANDING EMAIL SETTING */}
        <SectionCard title="Outstanding Email Setting" className="h-full">
          <div className="flex flex-col gap-3.5">
            <SettingFieldRow
              label="Custom Email Cycle"
              value={data.outstandingEmailCycle}
              options={EMAIL_CYCLE_OPTIONS}
              onChange={(val) => updateField("outstandingEmailCycle", val)}
            />

            <SettingFieldRow
              label="Custom Email Time 1"
              value={data.outstandingEmailTime}
              options={EMAIL_TIME_OPTIONS}
              onChange={(val) => updateField("outstandingEmailTime", val)}
            />

            <SettingFieldRow
              label="Ledger Date Range"
              value={data.outstandingLedgerDateRange}
              options={LEDGER_DATE_RANGE_OPTIONS}
              onChange={(val) => updateField("outstandingLedgerDateRange", val)}
            />
          </div>

          <div className="pt-3 flex flex-col gap-2.5 border-t border-gray-100">
            <SettingCheckboxRow
              label="Send Outstanding Email If Negative Amount"
              checked={data.outstandingSendIfNegative}
              onChange={(checked) => updateField("outstandingSendIfNegative", checked)}
            />
            <SettingCheckboxRow
              label="Send Outstanding Email If Positive Amount"
              checked={data.outstandingSendIfPositive}
              onChange={(checked) => updateField("outstandingSendIfPositive", checked)}
            />
            <SettingCheckboxRow
              label="Send Outstanding Email If Zero Amount"
              checked={data.outstandingSendIfZero}
              onChange={(checked) => updateField("outstandingSendIfZero", checked)}
            />
          </div>
        </SectionCard>
      </div>

      {/* ── ROW 2: Aging Limit Email & WhatsApp Settings ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 items-stretch">
        {/* CARD 3: AGING LIMIT EMAIL SETTING */}
        <SectionCard title="Aging Limit Email Setting" className="h-full">
          <SettingFieldRow
            label="Aging Limit Email Cycle"
            value={data.agingEmailCycle}
            options={EMAIL_CYCLE_OPTIONS}
            onChange={(val) => updateField("agingEmailCycle", val)}
          />
        </SectionCard>

        {/* CARD 4: AGING LIMIT WHATSAPP SETTING */}
        <SectionCard title="Aging Limit WhatsApp Setting" className="h-full">
          <SettingFieldRow
            label="Aging Limit WhatsApp Cycle"
            value={data.agingWhatsappCycle}
            options={EMAIL_CYCLE_OPTIONS}
            onChange={(val) => updateField("agingWhatsappCycle", val)}
          />
        </SectionCard>
      </div>

      {/* ── ROW 3: AWBwise Ledger & Inventory Email Settings ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 items-stretch">
        {/* CARD 5: AWBWISE LEDGER EMAIL SETTING */}
        <SectionCard title="AWBwise Ledger Email Setting" className="h-full">
          <div className="flex flex-col gap-3.5">
            <SettingFieldRow
              label="Custom Email Cycle"
              value={data.awbwiseEmailCycle}
              options={EMAIL_CYCLE_OPTIONS}
              onChange={(val) => updateField("awbwiseEmailCycle", val)}
            />

            <SettingFieldRow
              label="Custom Email Time 1"
              value={data.awbwiseEmailTime}
              options={EMAIL_TIME_OPTIONS}
              onChange={(val) => updateField("awbwiseEmailTime", val)}
            />

            <SettingFieldRow
              label="Ledger Date Range"
              value={data.awbwiseLedgerDateRange}
              options={LEDGER_DATE_RANGE_OPTIONS}
              onChange={(val) => updateField("awbwiseLedgerDateRange", val)}
            />
          </div>
        </SectionCard>

        {/* CARD 6: INVENTORY EMAIL SETTING */}
        <SectionCard title="Inventory Email Setting" className="h-full">
          <div className="flex flex-col gap-3.5">
            <SettingFieldRow
              label="Custom Email Cycle"
              value={data.inventoryEmailCycle}
              options={EMAIL_CYCLE_OPTIONS}
              onChange={(val) => updateField("inventoryEmailCycle", val)}
            />

            <SettingFieldRow
              label="Custom Email Time 1"
              value={data.inventoryEmailTime}
              options={EMAIL_TIME_OPTIONS}
              onChange={(val) => updateField("inventoryEmailTime", val)}
            />
          </div>
        </SectionCard>
      </div>

      {/* Bottom Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={handleReset}
          className="px-5 py-4 border border-axc-border bg-white text-axc-dark-gray rounded-lg text-xs font-semibold hover:bg-gray-50 transition cursor-pointer"
        >
          Reset Defaults
        </button>
        {onSave && (
          <button
            type="button"
            onClick={onSave}
            disabled={loading}
            className="px-5 py-4 bg-axc-navy cursor-pointer text-white rounded-lg text-regular-small transition shadow-sm"
          >
            {loading ? "Saving..." : "Save Email Settings"}
          </button>
        )}
      </div>
    </div>
  );
}

