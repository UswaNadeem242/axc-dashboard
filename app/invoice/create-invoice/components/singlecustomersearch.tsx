"use client";
import React from "react";
import CommonDropdown from "../../../src/common/dropdown";
import { SingleInvoiceSearchState } from "./invoicestate";
import { FieldLabel, PanelHeader, inputClass } from "./invoiceform";

interface Props {
  search: SingleInvoiceSearchState;
  setSearch: React.Dispatch<React.SetStateAction<SingleInvoiceSearchState>>;
  onSearch: () => void;
  errors?: Partial<Record<keyof SingleInvoiceSearchState, string>>;
}

export function SingleCustomerSearchPanel({ search, setSearch, onSearch, errors = {} }: Props) {
  return (
    <div className="bg-white rounded-lg border border-axc-border shadow-sm overflow-hidden flex flex-col h-full">
      <PanelHeader title="Add Invoice" />

      <div className="p-4 flex flex-col justify-between flex-1 gap-3 text-xs">
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col gap-1">
            <FieldLabel required>Customer</FieldLabel>
            <input
              type="text"
              value={search.customer}
              onChange={(e) => setSearch((prev) => ({ ...prev, customer: e.target.value }))}
              className={inputClass}
              placeholder="Customer"
            />
            {errors.customer && <span className="text-[10px] text-red-500">{errors.customer}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <FieldLabel required>Billing Company</FieldLabel>
            <CommonDropdown
              value={search.billingCompany}
              onChange={(val) => setSearch((prev) => ({ ...prev, billingCompany: val }))}
              className="w-full border-axc-border"
              options={[{ value: "AXC INC", label: "AMERICAN XPRESS COURIER - AXC INC" }]}
            />
            {errors.billingCompany && <span className="text-[10px] text-red-500">{errors.billingCompany}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <FieldLabel>Bank Details</FieldLabel>
            <CommonDropdown
              value={search.bankDetails}
              onChange={(val) => setSearch((prev) => ({ ...prev, bankDetails: val }))}
              className="w-full border-axc-border"
              options={[{ value: "BANK", label: "BANK (BANK)" }]}
            />
          </div>

          <div className="flex flex-col gap-1">
            <FieldLabel required>GST Number</FieldLabel>
            <input
              type="text"
              value={search.gstNumber}
              onChange={(e) => setSearch((prev) => ({ ...prev, gstNumber: e.target.value }))}
              className={inputClass}
              placeholder="GST number"
            />
            {errors.gstNumber && <span className="text-[10px] text-red-500">{errors.gstNumber}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <FieldLabel required>Invoice Range</FieldLabel>
            <CommonDropdown
              value={search.invoiceRange}
              onChange={(val) => setSearch((prev) => ({ ...prev, invoiceRange: val }))}
              className="w-full border-axc-border"
              options={[{ value: "AXC", label: "AXC" }]}
            />
            {errors.invoiceRange && <span className="text-[10px] text-red-500">{errors.invoiceRange}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <FieldLabel>From Date</FieldLabel>
            <input
              type="date"
              value={search.fromDate}
              onChange={(e) => setSearch((prev) => ({ ...prev, fromDate: e.target.value }))}
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1">
            <FieldLabel>Till Date</FieldLabel>
            <input
              type="date"
              value={search.tillDate}
              onChange={(e) => setSearch((prev) => ({ ...prev, tillDate: e.target.value }))}
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1">
            <FieldLabel>Service</FieldLabel>
            <input
              type="text"
              value={search.service}
              onChange={(e) => setSearch((prev) => ({ ...prev, service: e.target.value }))}
              className={inputClass}
              placeholder="Service"
            />
          </div>

          <div className="flex flex-col gap-1">
            <FieldLabel>Vendor</FieldLabel>
            <input
              type="text"
              value={search.vendor}
              onChange={(e) => setSearch((prev) => ({ ...prev, vendor: e.target.value }))}
              className={inputClass}
              placeholder="Vendor"
            />
          </div>

          <div className="flex flex-col gap-1">
            <FieldLabel>Product</FieldLabel>
            <input
              type="text"
              value={search.product}
              onChange={(e) => setSearch((prev) => ({ ...prev, product: e.target.value }))}
              className={inputClass}
              placeholder="Product"
            />
          </div>

          <div className="flex flex-col gap-1">
            <FieldLabel>Run Number</FieldLabel>
            <input
              type="text"
              value={search.runNumber}
              onChange={(e) => setSearch((prev) => ({ ...prev, runNumber: e.target.value }))}
              className={inputClass}
              placeholder="Run Number"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onSearch}
            className="px-5 py-3 bg-axc-yellow text-white rounded text-xs font-bold shadow-sm transition uppercase cursor-pointer"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
}