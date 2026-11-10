"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Save,
  ArrowLeft,
  CheckCircle,
  FileSpreadsheet,
  Calendar,
  Layers,
} from "lucide-react";
import { showToast } from "@/app/src/common/toast";
import CommonDropdown from "@/app/src/common/dropdown";
import CustomDatePicker from "@/app/src/common/datepicker";
import { api } from "@/app/src/lib/api";
import {
  PanelHeader,
  FieldLabel,
  FieldError,
  inputClass,
  errorInputClass,
} from "@/app/create-entries/components/form";
import {
  CftContractEntry,
  BILLING_TYPE_OPTIONS,
  CUSTOMER_OPTIONS,
  SERVICE_OPTIONS,
  VENDOR_OPTIONS,
  PRODUCT_OPTIONS,
  initialCftContractData,
} from "../types";

const defaultFormState = {
  billingType: "BOTH",
  customer: "",
  service: "",
  vendor: "",
  product: "",
  effectiveFrom: "",
  effectiveTo: "",
  cftValue: "",
  cftMultiplier: "",
  status: "ACTIVE" as "ACTIVE" | "INACTIVE",
};

function CreateCftContractContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const isEdit = Boolean(editId);

  const [form, setForm] = useState(defaultFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Load existing contract if editing
  useEffect(() => {
    if (!editId) return;
    let mounted = true;
    async function loadItem() {
      try {
        const found = await api.getMasterItem<CftContractEntry>("/cft-contracts", editId!);
        if (mounted && found) {
          setForm({
            billingType: found.billingType || "BOTH",
            customer: found.customer || "",
            service: found.service || "",
            vendor: found.vendor || "",
            product: found.product || "",
            effectiveFrom: found.effectiveFrom || "",
            effectiveTo: found.effectiveTo || "",
            cftValue: String(found.cftValue || ""),
            cftMultiplier: String(found.cftMultiplier || ""),
            status: found.status || "ACTIVE",
          });
          return;
        }
      } catch (err) {
        console.warn("API fetch fallback:", err);
      }
      if (mounted && typeof window !== "undefined") {
        try {
          const stored = localStorage.getItem("master_cft_contracts");
          const list: CftContractEntry[] = stored
            ? JSON.parse(stored)
            : initialCftContractData;
          const found = list.find((item) => String(item.id) === String(editId));
          if (found) {
            setForm({
              billingType: found.billingType || "BOTH",
              customer: found.customer || "",
              service: found.service || "",
              vendor: found.vendor || "",
              product: found.product || "",
              effectiveFrom: found.effectiveFrom || "",
              effectiveTo: found.effectiveTo || "",
              cftValue: found.cftValue || "",
              cftMultiplier: found.cftMultiplier || "",
              status: found.status || "ACTIVE",
            });
          }
        } catch (e) {
          console.error("Error loading CFT contract:", e);
        }
      }
    }
    loadItem();
    return () => {
      mounted = false;
    };
  }, [editId]);

  // Validation
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.effectiveFrom) newErrors.effectiveFrom = "Effective From date is required.";
    if (!form.effectiveTo) newErrors.effectiveTo = "Effective To date is required.";
    if (!form.cftValue.trim()) newErrors.cftValue = "CFT Value is required.";
    if (!form.cftMultiplier.trim()) newErrors.cftMultiplier = "CFT Multiplier is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validate()) {
      showToast({
        variant: "error",
        message: "Please fill in all mandatory fields (marked with *).",
      });
      return;
    }

    setLoading(true);
    try {
      let savedRecord: CftContractEntry | null = null;
      try {
        if (isEdit && editId) {
          savedRecord = await api.updateMasterItem<CftContractEntry>("/cft-contracts", editId, form);
        } else {
          savedRecord = await api.createMasterItem<CftContractEntry>("/cft-contracts", form);
        }
      } catch (apiErr) {
        console.warn("API save fallback to localStorage:", apiErr);
      }

      const stored = localStorage.getItem("master_cft_contracts");
      const currentList: CftContractEntry[] = stored
        ? JSON.parse(stored)
        : [...initialCftContractData];

      if (isEdit) {
        const updatedList = currentList.map((item) => {
          if (String(item.id) === String(editId)) {
            return savedRecord || {
              ...item,
              ...form,
            };
          }
          return item;
        });
        localStorage.setItem("master_cft_contracts", JSON.stringify(updatedList));
      } else {
        const newContract: CftContractEntry = savedRecord || {
          ...form,
          id: `CFT-2026-${String(currentList.length + 1).padStart(3, "0")}`,
          srNo: currentList.length + 1,
          createdAt: new Date().toLocaleString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
        };
        const updatedList = [newContract, ...currentList];
        localStorage.setItem("master_cft_contracts", JSON.stringify(updatedList));
      }

      setSuccess(true);
      showToast({
        variant: "success",
        message: isEdit
          ? "CFT Contract updated successfully!"
          : "CFT Contract created successfully!",
      });

      setTimeout(() => {
        router.push("/master/cft-contracts");
      }, 700);
    } catch (err) {
      console.error("Save error:", err);
      showToast({
        variant: "error",
        message: "Failed to save CFT Contract. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full h-full min-h-0 overflow-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="relative bg-white p-4 rounded-lg border border-gray-200 w-full flex-1 min-h-0 flex flex-col overflow-hidden">
        {/* ══════════════ TOP ACTION BAR ══════════════ */}
        {/* <div className="flex items-center justify-between pb-3.5 border-b border-axc-border shrink-0">
          <div className="flex items-center gap-2">
            <h1 className="text-regular-bold text-axc-dark-gray uppercase tracking-wider">
              {isEdit ? "EDIT CFT CONTRACTS" : "ADD CFT CONTRACTS"}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => router.push("/master/cft-contracts")}
              className="px-4 py-1.5 rounded border border-gray-300 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft size={13} />
              BACK
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => handleSave()}
              className="px-5 py-1.5 rounded bg-axc-navy hover:bg-axc-navy/90 text-white text-xs font-bold uppercase tracking-wider transition cursor-pointer shadow-xs flex items-center gap-1.5 disabled:opacity-50"
            >
              <Save size={13} />
              {loading ? "SAVING..." : "SAVE"}
            </button>
          </div>
        </div> */}

        {/* ══════════════ SUCCESS BANNER ══════════════ */}
        {/* {success && (
          <div className="flex items-center gap-3 rounded-2xl bg-axc-green/10 border border-axc-green/30 p-4 text-axc-dark-green animate-in fade-in slide-in-from-top-4 duration-300 shrink-0 mt-3">
            <CheckCircle className="h-5 w-5 text-axc-dark-green shrink-0" />
            <div>
              <p className="text-xs font-bold">
                {isEdit
                  ? "CFT Contract Updated Successfully!"
                  : "CFT Contract Created Successfully!"}
              </p>
              <p className="text-[10px] text-axc-dark-green font-medium">
                Redirecting you back to CFT Contracts list...
              </p>
            </div>
          </div>
        )} */}

        {/* ══════════════ SCROLLABLE MAIN FORM (IMAGE 2 AWB/CREDIT NOTE STYLE CARD) ══════════════ */}
        <div className="flex-1 min-h-0 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <form onSubmit={handleSave} className="flex flex-col gap-6 w-full pb-48">
            <div className="bg-white rounded-lg border border-axc-border shadow-sm flex flex-col w-full">
              {/* Purple-Slate Header Banner: Image 2 Style */}
              <PanelHeader title="CFT contract information" />

              {/* Main Content Grid: Exactly 3 Inputs Per Row Matching Image 2 */}
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-4.5">
                {/* ══════════════ ROW 1: BILLING TYPE, CUSTOMER, SERVICE ══════════════ */}
                {/* 1. BILLING TYPE */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Billing Type</FieldLabel>
                  <CommonDropdown
                    value={form.billingType}
                    options={BILLING_TYPE_OPTIONS}
                    onChange={(val) => setForm((prev) => ({ ...prev, billingType: val }))}
                  />
                </div>

                {/* 2. CUSTOMER */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Customer</FieldLabel>
                  <CommonDropdown
                    value={form.customer}
                    options={CUSTOMER_OPTIONS}
                    onChange={(val) => setForm((prev) => ({ ...prev, customer: val }))}
                  />
                </div>

                {/* 3. SERVICE */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Service</FieldLabel>
                  <CommonDropdown
                    value={form.service}
                    options={SERVICE_OPTIONS}
                    onChange={(val) => setForm((prev) => ({ ...prev, service: val }))}
                  />
                </div>

                {/* ══════════════ ROW 2: VENDOR, PRODUCT, EFFECTIVE FROM ══════════════ */}
                {/* 4. VENDOR */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Vendor</FieldLabel>
                  <CommonDropdown
                    value={form.vendor}
                    options={VENDOR_OPTIONS}
                    onChange={(val) => setForm((prev) => ({ ...prev, vendor: val }))}
                  />
                </div>

                {/* 5. PRODUCT */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Product</FieldLabel>
                  <CommonDropdown
                    value={form.product}
                    options={PRODUCT_OPTIONS}
                    onChange={(val) => setForm((prev) => ({ ...prev, product: val }))}
                  />
                </div>

                {/* 6. EFFECTIVE FROM * */}
                <div className="flex flex-col gap-1">
                  <FieldLabel required>Effective From</FieldLabel>
                  <CustomDatePicker
                    value={form.effectiveFrom}
                    onChange={(val) => {
                      setForm((prev) => ({ ...prev, effectiveFrom: val }));
                      if (errors.effectiveFrom) setErrors((prev) => ({ ...prev, effectiveFrom: "" }));
                    }}
                    placeholder="YYYY-MM-DD"
                    align="right"
                    openDirection="auto"
                    className={errors.effectiveFrom ? errorInputClass : inputClass}
                  />
                  <FieldError message={errors.effectiveFrom} />
                </div>

                {/* ══════════════ ROW 3: EFFECTIVE TO, CFT VALUE, CFT MULTIPLIER ══════════════ */}
                {/* 7. EFFECTIVE TO * */}
                <div className="flex flex-col gap-1">
                  <FieldLabel required>Effective To</FieldLabel>
                  <CustomDatePicker
                    value={form.effectiveTo}
                    onChange={(val) => {
                      setForm((prev) => ({ ...prev, effectiveTo: val }));
                      if (errors.effectiveTo) setErrors((prev) => ({ ...prev, effectiveTo: "" }));
                    }}
                    placeholder="YYYY-MM-DD"
                    align="left"
                    openDirection="auto"
                    className={errors.effectiveTo ? errorInputClass : inputClass}
                  />
                  <FieldError message={errors.effectiveTo} />
                </div>

                {/* 8. CFT VALUE * */}
                <div className="flex flex-col gap-1">
                  <FieldLabel required>CFT Value</FieldLabel>
                  <input
                    type="text"
                    placeholder="e.g. 1728"
                    value={form.cftValue}
                    onChange={(e) => {
                      setForm((prev) => ({ ...prev, cftValue: e.target.value }));
                      if (errors.cftValue) setErrors((prev) => ({ ...prev, cftValue: "" }));
                    }}
                    className={errors.cftValue ? errorInputClass : inputClass}
                  />
                  <FieldError message={errors.cftValue} />
                </div>

                {/* 9. CFT MULTIPLIER * */}
                <div className="flex flex-col gap-1">
                  <FieldLabel required>CFT Multiplier</FieldLabel>
                  <input
                    type="text"
                    placeholder="e.g. 1.00 or 5000"
                    value={form.cftMultiplier}
                    onChange={(e) => {
                      setForm((prev) => ({ ...prev, cftMultiplier: e.target.value }));
                      if (errors.cftMultiplier) setErrors((prev) => ({ ...prev, cftMultiplier: "" }));
                    }}
                    className={errors.cftMultiplier ? errorInputClass : inputClass}
                  />
                  <FieldError message={errors.cftMultiplier} />
                </div>

                {/* ══════════════ ROW 4: STATUS ══════════════ */}
                {/* 10. STATUS */}
                <div className="flex flex-col gap-1.5 sm:col-span-2 lg:col-span-3 pt-2">
                  <FieldLabel>Status</FieldLabel>
                  <div className="flex items-center gap-6 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-axc-dark-gray select-none">
                      <input
                        type="radio"
                        name="status"
                        value="ACTIVE"
                        checked={form.status === "ACTIVE"}
                        onChange={() => setForm((prev) => ({ ...prev, status: "ACTIVE" }))}
                        className="w-4 h-4 accent-axc-blue cursor-pointer"
                      />
                      ACTIVE
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-axc-dark-gray select-none">
                      <input
                        type="radio"
                        name="status"
                        value="INACTIVE"
                        checked={form.status === "INACTIVE"}
                        onChange={() => setForm((prev) => ({ ...prev, status: "INACTIVE" }))}
                        className="w-4 h-4 accent-axc-blue cursor-pointer"
                      />
                      INACTIVE
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* ══════════════ BOTTOM ACTION BUTTONS (MATCHING IMAGE 1 & 2) ══════════════ */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => router.push("/master/cft-contracts")}
                className="px-5 py-4 border border-axc-border bg-white text-axc-dark-gray rounded-lg text-xs font-semibold hover:bg-gray-50 transition cursor-pointer"
              >
                
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-5 py-4 bg-axc-navy cursor-pointer text-white rounded-lg text-regular-small transition shadow-sm"
              >
                 
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function CreateCftContractPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64 text-sm text-axc-gray">
          Loading CFT Contract form...
        </div>
      }
    >
      <CreateCftContractContent />
    </Suspense>
  );
}

