"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, History, X, Trash2 } from "lucide-react";
import CommonDropdown from "@/app/src/common/dropdown";
import CustomDatePicker from "@/app/src/common/datepicker";
import { showToast } from "@/app/src/common/toast";
import {
  PanelHeader,
  FieldLabel,
  inputClass,
  errorInputClass,
  FieldError,
} from "@/app/create-entries/components/form";
import {
  CustomerContractEntry,
  CONTRACT_TYPE_OPTIONS,
  INCOTERM_OPTIONS,
  CALCULATION_METHOD_OPTIONS,
  HUB_OPTIONS,
} from "./types";

const initialFormState: Omit<CustomerContractEntry, "id" | "createdAt"> = {
  customer: "",
  customerCode: "",
  service: "",
  serviceCode: "",
  product: "",
  productCode: "",
  airline: "",
  airlineCode: "",
  flight: "",
  flightCode: "",
  vendor: "",
  vendorCode: "",
  destinationZone: "",
  destinationZoneCode: "",
  destination: "",
  destinationCode: "",
  destinationCity: "",
  destinationCityCode: "",
  destinationState: "",
  destinationStateCode: "",
  destinationHub: "",
  contractType: "Weight Wise",
  incoterm: "",
  status: "ACTIVE",

  originZone: "",
  origin: "",
  originCode: "",
  originCity: "",
  originCityCode: "",
  originState: "",
  originStateCode: "",
  originHub: "",
  effectiveFrom: "",
  effectiveTo: "",
  remarks: "",
  notes: "",
  calculationMethod: "FIXED",
  tat: "",
  minimumFreight: "",
};

export default function CustomerContractsPage() {
  const router = useRouter();
  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [historyList, setHistoryList] = useState<CustomerContractEntry[]>([]);

  // Load history from localStorage
  const loadHistory = () => {
    try {
      const stored = localStorage.getItem("master_customer_contracts");
      if (stored) {
        setHistoryList(JSON.parse(stored));
      } else {
        setHistoryList([]);
      }
    } catch (e) {
      console.error("Error reading customer contracts:", e);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleFieldChange = (field: keyof typeof initialFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!form.customer.trim()) errs.customer = "Customer is required";
    if (!form.service.trim()) errs.service = "Service is required";
    if (!form.product.trim()) errs.product = "Product is required";
    if (!form.contractType) errs.contractType = "Contract Type is required";
    if (!form.calculationMethod) errs.calculationMethod = "Calculation Method is required";
    if (!form.effectiveFrom) errs.effectiveFrom = "Effective From is required";
    if (!form.effectiveTo) errs.effectiveTo = "Effective To is required";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      showToast({
        variant: "error",
        message: "Please fill in all required fields properly.",
      });
      return;
    }

    setSaving(true);

    try {
      const newEntry: CustomerContractEntry = {
        ...form,
        id: `CC-${Date.now().toString().slice(-6)}`,
        createdAt: new Date().toISOString(),
      };

      const stored = localStorage.getItem("master_customer_contracts");
      const currentList: CustomerContractEntry[] = stored ? JSON.parse(stored) : [];
      const updatedList = [newEntry, ...currentList];

      localStorage.setItem("master_customer_contracts", JSON.stringify(updatedList));
      setHistoryList(updatedList);

      showToast({
        variant: "success",
        message: "Customer Contract saved successfully!",
      });

      // Reset form
      setForm(initialFormState);
    } catch (err) {
      console.error("Failed to save customer contract:", err);
      showToast({
        variant: "error",
        message: "Failed to save contract. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteHistory = (id: string) => {
    const updated = historyList.filter((item) => item.id !== id);
    localStorage.setItem("master_customer_contracts", JSON.stringify(updated));
    setHistoryList(updated);
    showToast({
      variant: "success",
      message: "Contract removed from history",
    });
  };

  return (
    <div className="flex flex-col gap-4 w-full h-full min-h-0 overflow-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="relative bg-white p-4 rounded-lg border border-gray-200 w-full flex-1 min-h-0 flex flex-col overflow-hidden">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-axc-border shrink-0">
          <div className="flex items-center gap-3">
            <Link
              href="/master/customer"
              className="p-1.5 rounded-lg border border-axc-border text-axc-gray hover:text-axc-navy hover:bg-gray-50 transition cursor-pointer"
              title="Back to Customers"
            >
              <ArrowLeft size={16} />
            </Link>
            <div>
              <h2 className="text-sm font-semibold text-axc-dark-gray">
                Add Customer Contracts
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowHistory(true)}
              className="px-3.5 py-2 border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg text-regular-small font-medium transition cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <History size={14} />
              Customer Contracts History
            </button>
          </div>
        </div>

        {/* Form Body: Exactly matching Credit/Debit Note Information UI */}
        <div className="flex-1 min-h-0 overflow-y-auto pt-4 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <form onSubmit={handleSave} className="flex flex-col gap-6 w-full">
            <div className="bg-white rounded-lg border border-axc-border shadow-xs flex flex-col relative z-20">
              <PanelHeader title="Customer Contracts Information" />

              {/* 3-Column Grid Layout matching the reference image */}
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 items-start">
                {/* 1. Customer */}
                <div className="flex flex-col gap-1">
                  <FieldLabel required>Customer</FieldLabel>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={form.customer}
                      placeholder="SEARCH HERE.."
                      onChange={(e) => handleFieldChange("customer", e.target.value)}
                      className={`${errors.customer ? errorInputClass : inputClass} flex-1`}
                    />
                    <input
                      type="text"
                      value={form.customerCode}
                      placeholder="Code"
                      onChange={(e) => handleFieldChange("customerCode", e.target.value)}
                      className={`${inputClass} w-24 bg-gray-50 text-gray-500`}
                    />
                  </div>
                  <FieldError message={errors.customer} />
                </div>

                {/* 2. Service */}
                <div className="flex flex-col gap-1">
                  <FieldLabel required>Service</FieldLabel>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={form.service}
                      placeholder="SEARCH HERE.."
                      onChange={(e) => handleFieldChange("service", e.target.value)}
                      className={`${errors.service ? errorInputClass : inputClass} flex-1`}
                    />
                    <input
                      type="text"
                      value={form.serviceCode}
                      placeholder="Code"
                      onChange={(e) => handleFieldChange("serviceCode", e.target.value)}
                      className={`${inputClass} w-20 bg-gray-50 text-gray-500`}
                    />
                  </div>
                  <FieldError message={errors.service} />
                </div>

                {/* 3. Product */}
                <div className="flex flex-col gap-1">
                  <FieldLabel required>Product</FieldLabel>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={form.product}
                      placeholder="SEARCH HERE.."
                      onChange={(e) => handleFieldChange("product", e.target.value)}
                      className={`${errors.product ? errorInputClass : inputClass} flex-1`}
                    />
                    <input
                      type="text"
                      value={form.productCode}
                      placeholder="Code"
                      onChange={(e) => handleFieldChange("productCode", e.target.value)}
                      className={`${inputClass} w-20 bg-gray-50 text-gray-500`}
                    />
                  </div>
                  <FieldError message={errors.product} />
                </div>

                {/* 4. Airline */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Airline</FieldLabel>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={form.airline}
                      placeholder="SEARCH HERE.."
                      onChange={(e) => handleFieldChange("airline", e.target.value)}
                      className={`${inputClass} flex-1`}
                    />
                    <input
                      type="text"
                      value={form.airlineCode}
                      placeholder="Code"
                      onChange={(e) => handleFieldChange("airlineCode", e.target.value)}
                      className={`${inputClass} w-20 bg-gray-50 text-gray-500`}
                    />
                  </div>
                </div>

                {/* 5. Flight */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Flight</FieldLabel>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={form.flight}
                      placeholder="SEARCH HERE.."
                      onChange={(e) => handleFieldChange("flight", e.target.value)}
                      className={`${inputClass} flex-1`}
                    />
                    <input
                      type="text"
                      value={form.flightCode}
                      placeholder="Code"
                      onChange={(e) => handleFieldChange("flightCode", e.target.value)}
                      className={`${inputClass} w-20 bg-gray-50 text-gray-500`}
                    />
                  </div>
                </div>

                {/* 6. Vendor */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Vendor</FieldLabel>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={form.vendor}
                      placeholder="SEARCH HERE.."
                      onChange={(e) => handleFieldChange("vendor", e.target.value)}
                      className={`${inputClass} flex-1`}
                    />
                    <input
                      type="text"
                      value={form.vendorCode}
                      placeholder="Code"
                      onChange={(e) => handleFieldChange("vendorCode", e.target.value)}
                      className={`${inputClass} w-20 bg-gray-50 text-gray-500`}
                    />
                  </div>
                </div>

                {/* 7. Origin Hub */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Origin Hub</FieldLabel>
                  <CommonDropdown
                    value={form.originHub}
                    onChange={(val) => handleFieldChange("originHub", val)}
                    options={HUB_OPTIONS}
                    placeholder="SELECT.."
                  />
                </div>

                {/* 8. Origin Zone */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Origin Zone</FieldLabel>
                  <input
                    type="text"
                    value={form.originZone}
                    placeholder="Enter Origin Zone"
                    onChange={(e) => handleFieldChange("originZone", e.target.value)}
                    className={inputClass}
                  />
                </div>

                {/* 9. Origin */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Origin</FieldLabel>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={form.origin}
                      placeholder="SEARCH HERE.."
                      onChange={(e) => handleFieldChange("origin", e.target.value)}
                      className={`${inputClass} flex-1`}
                    />
                    <input
                      type="text"
                      value={form.originCode}
                      placeholder="Code"
                      onChange={(e) => handleFieldChange("originCode", e.target.value)}
                      className={`${inputClass} w-20 bg-gray-50 text-gray-500`}
                    />
                  </div>
                </div>

                {/* 10. Origin City */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Origin City</FieldLabel>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={form.originCity}
                      placeholder="SEARCH HERE.."
                      onChange={(e) => handleFieldChange("originCity", e.target.value)}
                      className={`${inputClass} flex-1`}
                    />
                    <input
                      type="text"
                      value={form.originCityCode}
                      placeholder="Code"
                      onChange={(e) => handleFieldChange("originCityCode", e.target.value)}
                      className={`${inputClass} w-20 bg-gray-50 text-gray-500`}
                    />
                  </div>
                </div>

                {/* 11. Origin State */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Origin State</FieldLabel>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={form.originState}
                      placeholder="SEARCH HERE.."
                      onChange={(e) => handleFieldChange("originState", e.target.value)}
                      className={`${inputClass} flex-1`}
                    />
                    <input
                      type="text"
                      value={form.originStateCode}
                      placeholder="Code"
                      onChange={(e) => handleFieldChange("originStateCode", e.target.value)}
                      className={`${inputClass} w-20 bg-gray-50 text-gray-500`}
                    />
                  </div>
                </div>

                {/* 12. Destination Hub */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Destination Hub</FieldLabel>
                  <CommonDropdown
                    value={form.destinationHub}
                    onChange={(val) => handleFieldChange("destinationHub", val)}
                    options={HUB_OPTIONS}
                    placeholder="SELECT.."
                  />
                </div>

                {/* 13. Destination Zone */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Destination Zone</FieldLabel>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={form.destinationZone}
                      placeholder="SEARCH HERE..."
                      onChange={(e) => handleFieldChange("destinationZone", e.target.value)}
                      className={`${inputClass} flex-1`}
                    />
                    <input
                      type="text"
                      value={form.destinationZoneCode}
                      placeholder="Code"
                      onChange={(e) => handleFieldChange("destinationZoneCode", e.target.value)}
                      className={`${inputClass} w-20 bg-gray-50 text-gray-500`}
                    />
                  </div>
                </div>

                {/* 14. Destination */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Destination</FieldLabel>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={form.destination}
                      placeholder="Enter Destination"
                      onChange={(e) => handleFieldChange("destination", e.target.value)}
                      className={`${inputClass} flex-1`}
                    />
                    <input
                      type="text"
                      value={form.destinationCode}
                      placeholder="Code"
                      onChange={(e) => handleFieldChange("destinationCode", e.target.value)}
                      className={`${inputClass} w-20 bg-gray-50 text-gray-500`}
                    />
                  </div>
                </div>

                {/* 15. Destination City */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Destination City</FieldLabel>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={form.destinationCity}
                      placeholder="SEARCH HERE.."
                      onChange={(e) => handleFieldChange("destinationCity", e.target.value)}
                      className={`${inputClass} flex-1`}
                    />
                    <input
                      type="text"
                      value={form.destinationCityCode}
                      placeholder="Code"
                      onChange={(e) => handleFieldChange("destinationCityCode", e.target.value)}
                      className={`${inputClass} w-20 bg-gray-50 text-gray-500`}
                    />
                  </div>
                </div>

                {/* 16. Destination State */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Destination State</FieldLabel>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={form.destinationState}
                      placeholder="SEARCH HERE.."
                      onChange={(e) => handleFieldChange("destinationState", e.target.value)}
                      className={`${inputClass} flex-1`}
                    />
                    <input
                      type="text"
                      value={form.destinationStateCode}
                      placeholder="Code"
                      onChange={(e) => handleFieldChange("destinationStateCode", e.target.value)}
                      className={`${inputClass} w-20 bg-gray-50 text-gray-500`}
                    />
                  </div>
                </div>

                {/* 17. Contract Type * */}
                <div className="flex flex-col gap-1">
                  <FieldLabel required>Contract Type</FieldLabel>
                  <CommonDropdown
                    value={form.contractType}
                    onChange={(val) => handleFieldChange("contractType", val)}
                    options={CONTRACT_TYPE_OPTIONS}
                    placeholder="Select Contract Type"
                    className={errors.contractType ? "!border-red-400 !bg-red-50/40" : "border-axc-border"}
                  />
                  <FieldError message={errors.contractType} />
                </div>

                {/* 18. Calculation Method * */}
                <div className="flex flex-col gap-1">
                  <FieldLabel required>Calculation Method</FieldLabel>
                  <CommonDropdown
                    value={form.calculationMethod}
                    onChange={(val) => handleFieldChange("calculationMethod", val)}
                    options={CALCULATION_METHOD_OPTIONS}
                    placeholder="Select Method"
                    className={errors.calculationMethod ? "!border-red-400 !bg-red-50/40" : "border-axc-border"}
                  />
                  <FieldError message={errors.calculationMethod} />
                </div>

                {/* 19. Effective From * */}
                <div className="flex flex-col gap-1">
                  <FieldLabel required>Effective From</FieldLabel>
                  <CustomDatePicker
                    value={form.effectiveFrom}
                    onChange={(val) => handleFieldChange("effectiveFrom", val)}
                    placeholder="mm/dd/yyyy"
                    className={errors.effectiveFrom ? "!border-red-400 !bg-red-50/40" : "border-axc-border"}
                  />
                  <FieldError message={errors.effectiveFrom} />
                </div>

                {/* 20. Effective To * */}
                <div className="flex flex-col gap-1">
                  <FieldLabel required>Effective To</FieldLabel>
                  <CustomDatePicker
                    value={form.effectiveTo}
                    onChange={(val) => handleFieldChange("effectiveTo", val)}
                    placeholder="mm/dd/yyyy"
                    className={errors.effectiveTo ? "!border-red-400 !bg-red-50/40" : "border-axc-border"}
                  />
                  <FieldError message={errors.effectiveTo} />
                </div>

                {/* 21. Incoterm */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Incoterm</FieldLabel>
                  <CommonDropdown
                    value={form.incoterm}
                    onChange={(val) => handleFieldChange("incoterm", val)}
                    options={INCOTERM_OPTIONS}
                    placeholder="SELECT INCOTERM.."
                  />
                </div>

                {/* 22. TAT */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>TAT</FieldLabel>
                  <input
                    type="text"
                    value={form.tat}
                    placeholder="Enter TAT"
                    onChange={(e) => handleFieldChange("tat", e.target.value)}
                    className={inputClass}
                  />
                </div>

                {/* 23. Minimum Freight */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Minimum Freight</FieldLabel>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={form.minimumFreight}
                    placeholder="Enter Minimum Freight"
                    onChange={(e) => handleFieldChange("minimumFreight", e.target.value)}
                    className={inputClass}
                  />
                </div>

                {/* 24. Status (Radio) */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Status</FieldLabel>
                  <div className="flex items-center gap-6 h-10 px-1">
                    <label className="flex items-center gap-2 cursor-pointer text-regular-medium text-axc-dark-gray">
                      <input
                        type="radio"
                        name="status"
                        value="ACTIVE"
                        checked={form.status === "ACTIVE"}
                        onChange={() => handleFieldChange("status", "ACTIVE")}
                        className="w-4 h-4 accent-axc-navy cursor-pointer"
                      />
                      <span>ACTIVE</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-regular-medium text-axc-dark-gray">
                      <input
                        type="radio"
                        name="status"
                        value="INACTIVE"
                        checked={form.status === "INACTIVE"}
                        onChange={() => handleFieldChange("status", "INACTIVE")}
                        className="w-4 h-4 accent-axc-navy cursor-pointer"
                      />
                      <span>INACTIVE</span>
                    </label>
                  </div>
                </div>

                {/* 25. Remarks */}
                <div className="flex flex-col gap-1 md:col-span-2 lg:col-span-1">
                  <FieldLabel>Remarks</FieldLabel>
                  <textarea
                    rows={2}
                    value={form.remarks}
                    placeholder="Enter Remarks"
                    onChange={(e) => handleFieldChange("remarks", e.target.value)}
                    className="border border-axc-border rounded-md px-3 py-2 outline-none w-full text-regular-small text-axc-gray resize-none focus:border-axc-navy focus:ring-1 focus:ring-axc-navy transition"
                  />
                </div>

                {/* 26. Notes */}
                <div className="flex flex-col gap-1 md:col-span-2 lg:col-span-2">
                  <FieldLabel>Notes</FieldLabel>
                  <textarea
                    rows={2}
                    value={form.notes}
                    placeholder="Enter Notes"
                    onChange={(e) => handleFieldChange("notes", e.target.value)}
                    className="border border-axc-border rounded-md px-3 py-2 outline-none w-full text-regular-small text-axc-gray resize-none focus:border-axc-navy focus:ring-1 focus:ring-axc-navy transition"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Link
                href="/master/customer"
                className="px-5 py-2.5 rounded-lg border border-axc-border bg-white text-axc-dark-gray text-regular-small hover:bg-gray-50 transition cursor-pointer font-medium"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-axc-navy text-white rounded-lg text-regular-small transition shadow-sm hover:bg-axc-navy/90 cursor-pointer font-medium disabled:opacity-50 flex items-center gap-2"
              >
                <Save size={15} />
                {saving ? "Saving..." : "Save Customer Contract"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ══════════════ HISTORY MODAL ══════════════ */}
      {showHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden border border-gray-200 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-5 py-3.5 border-b border-gray-200 flex items-center justify-between bg-gray-50/60">
              <div className="flex items-center gap-2">
                <History className="text-amber-500" size={18} />
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                  Customer Contracts History
                </h3>
                <span className="text-xs bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full">
                  {historyList.length} Records
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowHistory(false)}
                className="text-gray-400 hover:text-gray-600 transition p-1 rounded-md cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {historyList.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-sm">
                  No customer contracts saved yet. Fill the form and click Save!
                </div>
              ) : (
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="w-full text-left text-xs text-gray-600">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-700 font-bold uppercase tracking-wider">
                      <tr>
                        <th className="px-3 py-2.5">ID</th>
                        <th className="px-3 py-2.5">Customer</th>
                        <th className="px-3 py-2.5">Service</th>
                        <th className="px-3 py-2.5">Product</th>
                        <th className="px-3 py-2.5">Contract Type</th>
                        <th className="px-3 py-2.5">Method</th>
                        <th className="px-3 py-2.5">Effective</th>
                        <th className="px-3 py-2.5">Status</th>
                        <th className="px-3 py-2.5 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {historyList.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50/60 transition">
                          <td className="px-3 py-2 font-semibold text-axc-navy">{item.id}</td>
                          <td className="px-3 py-2 font-medium text-gray-800">
                            {item.customer} {item.customerCode ? `(${item.customerCode})` : ""}
                          </td>
                          <td className="px-3 py-2">{item.service || "-"}</td>
                          <td className="px-3 py-2">{item.product || "-"}</td>
                          <td className="px-3 py-2">{item.contractType}</td>
                          <td className="px-3 py-2">{item.calculationMethod}</td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            {item.effectiveFrom} to {item.effectiveTo}
                          </td>
                          <td className="px-3 py-2">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                item.status === "ACTIVE"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleDeleteHistory(item.id)}
                              className="text-red-500 hover:text-red-700 p-1 transition cursor-pointer"
                              title="Delete record"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 border-t border-gray-200 bg-gray-50/50 flex justify-end">
              <button
                type="button"
                onClick={() => setShowHistory(false)}
                className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded text-xs font-semibold transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
