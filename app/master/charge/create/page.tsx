"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Save,
  ArrowLeft,
  CheckCircle,
  HelpCircle,
  AlertCircle,
  Layers,
  Settings,
} from "lucide-react";
import { showToast } from "@/app/src/common/toast";
import { api } from "@/app/src/lib/api";
<<<<<<< HEAD
import { invalidateMasterDataCache } from "@/app/src/lib/useMasterData";
=======
>>>>>>> 1857e6c4bcd752cfb854388be178686e21382f68
import CommonDropdown from "@/app/src/common/dropdown";
import {
  PanelHeader,
  FieldLabel,
  FieldError,
  inputClass,
  errorInputClass,
} from "@/app/create-entries/components/form";
import {
  ChargeEntry,
  RATE_TYPE_OPTIONS,
  SERVICE_PROVIDERS,
  initialChargeData,
} from "../types";

const defaultFormState = {
  code: "",
  name: "",
  sac: "",
  defaultRate: "0.00",
  rateType: "Fixed",
  status: "ACTIVE" as "ACTIVE" | "INACTIVE",

  // 11 Rules Checkboxes (from Reference Image 1)
  isVatApplicable: false,
  isFscApplicableSales: false,
  isFscApplicablePurchase: false,
  isManual: false,
  isCustomerOptional: false,
  isVendorOptional: false,
  isDefault: false,
  hideInInvoice: false,
  displayInAwbAppliesCharges: true,
  showInDutyInvoice: false,
  applyDrsAttemptCharge: false,

  // Service Mappings
  serviceMappings: {
    fedex: "",
    dhl: "",
    ups: "",
    inxpress: "",
    norsk: "",
    dsv: "",
  } as Record<string, string>,
};

function CreateChargeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const isEdit = Boolean(editId);

  const [form, setForm] = useState(defaultFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Load existing charge if editing
  useEffect(() => {
    if (typeof window === "undefined" || !editId) return;
    let mounted = true;
    const applyFound = (found: ChargeEntry) => {
      setForm({
        code: found.code || "",
        name: found.name || "",
        sac: found.sac || "",
        defaultRate: String(found.defaultRate ?? "0.00"),
        rateType: found.rateType || "Fixed",
        status: found.status || "ACTIVE",
        isVatApplicable: Boolean(found.isVatApplicable),
        isFscApplicableSales: Boolean(found.isFscApplicableSales),
        isFscApplicablePurchase: Boolean(found.isFscApplicablePurchase),
        isManual: Boolean(found.isManual),
        isCustomerOptional: Boolean(found.isCustomerOptional),
        isVendorOptional: Boolean(found.isVendorOptional),
        isDefault: Boolean(found.isDefault),
        hideInInvoice: Boolean(found.hideInInvoice),
        displayInAwbAppliesCharges: Boolean(found.displayInAwbAppliesCharges),
        showInDutyInvoice: Boolean(found.showInDutyInvoice),
        applyDrsAttemptCharge: Boolean(found.applyDrsAttemptCharge),
        serviceMappings: {
          fedex: found.serviceMappings?.fedex || "",
          dhl: found.serviceMappings?.dhl || "",
          ups: found.serviceMappings?.ups || "",
          inxpress: found.serviceMappings?.inxpress || "",
          norsk: found.serviceMappings?.norsk || "",
          dsv: found.serviceMappings?.dsv || "",
        },
      });
    };

    api
      .getMasterItem<ChargeEntry>("/charge-masters", editId)
      .then((found) => {
        if (mounted && found) applyFound(found);
      })
      .catch(() => {
        try {
          const stored = localStorage.getItem("master_charges");
          const list: ChargeEntry[] = stored
            ? JSON.parse(stored)
            : initialChargeData;
          const found = list.find(
            (item) => String(item.id) === String(editId) || item.name === editId
          );
          if (found && mounted) applyFound(found);
        } catch (e) {
          console.error("Error loading charge:", e);
        }
      });

    return () => {
      mounted = false;
    };
  }, [editId]);

  // Validation
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Charge Name is required.";
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
      let savedRecord: any = null;
      try {
        if (isEdit && editId) {
          savedRecord = await api.updateMasterItem("/charge-masters", editId, form);
        } else {
          savedRecord = await api.createMasterItem("/charge-masters", form);
        }
      } catch (apiErr) {
        console.warn("API save fallback to local:", apiErr);
      }

      const stored = localStorage.getItem("master_charges");
      const currentList: ChargeEntry[] = stored
        ? JSON.parse(stored)
        : [...initialChargeData];

      if (isEdit) {
        const updatedList = currentList.map((item) => {
          if (String(item.id) === String(editId) || item.name === editId) {
            return savedRecord || {
              ...item,
              ...form,
            };
          }
          return item;
        });
        localStorage.setItem("master_charges", JSON.stringify(updatedList));
      } else {
        const newCharge: ChargeEntry = savedRecord || {
          ...form,
          id: `CHG-${Date.now().toString().slice(-4)}`,
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
        const updatedList = [newCharge, ...currentList];
        localStorage.setItem("master_charges", JSON.stringify(updatedList));
      }

      invalidateMasterDataCache();

      setSuccess(true);
      showToast({
        variant: "success",
        message: isEdit ? "Charge updated successfully!" : "Charge created successfully!",
      });

      setTimeout(() => {
        router.push("/master/charge");
      }, 700);
    } catch (err) {
      console.error("Save error:", err);
      showToast({
        variant: "error",
        message: "Failed to save charge. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleServiceChange = (serviceKey: string, val: string) => {
    setForm((prev) => ({
      ...prev,
      serviceMappings: {
        ...prev.serviceMappings,
        [serviceKey]: val,
      },
    }));
  };

  return (
    <div className="flex flex-col gap-4 w-full h-full min-h-0 overflow-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="relative bg-white p-4 rounded-lg border border-gray-200 w-full flex-1 min-h-0 flex flex-col overflow-hidden">
        {/* ══════════════ TOP ACTION BAR ══════════════ */}
        {/* <div className="flex items-center justify-between pb-3.5 border-b border-axc-border shrink-0">
          <div className="flex items-center gap-2">
            <h1 className="text-regular-bold text-axc-dark-gray uppercase tracking-wider">
              {isEdit ? "EDIT CHARGE MASTER" : "ADD CHARGE MASTER"}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => router.push("/master/charge")}
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
                {isEdit ? "Charge Updated Successfully!" : "Charge Created Successfully!"}
              </p>
              <p className="text-[10px] text-axc-dark-green font-medium">Redirecting you back to Charge list...</p>
            </div>
          </div>
        )} */}

        {/* ══════════════ SCROLLABLE CONTENT (AWB 2-CARD LAYOUT) ══════════════ */}
        <div className="flex-1 min-h-0 overflow-y-auto  [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <form onSubmit={handleSave} className="flex flex-col gap-6 w-full pb-6">
            {/* Grid Container: Split layout matching Image 2 & Image 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* ══════════════ LEFT CARD: CHARGE DETAILS & RULES (col-span-8) ══════════════ */}
              <div className="lg:col-span-8 bg-white rounded-lg border border-axc-border shadow-sm flex flex-col overflow-hidden">
                <PanelHeader
                  title="Charge master information"
                />

                <div className="p-5 sm:p-6 flex flex-col gap-4">
                  {/* 1. NAME Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <label className="w-28 shrink-0 text-xs font-bold text-axc-dark-gray uppercase tracking-wide">
                      NAME <span className="text-red-500 font-bold">*</span>
                    </label>
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="e.g. FUEL SURCHARGE"
                        value={form.name}
                        onChange={(e) => {
                          setForm((prev) => ({ ...prev, name: e.target.value.toUpperCase() }));
                          if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                        }}
                        className={`${errors.name ? errorInputClass : inputClass} uppercase font-medium`}
                      />
                      <FieldError message={errors.name} />
                    </div>
                  </div>

                  {/* 2. SAC Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <label className="w-28 shrink-0 text-xs font-bold text-axc-dark-gray uppercase tracking-wide">
                      SAC
                    </label>
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="e.g. 996812"
                        value={form.sac}
                        onChange={(e) => setForm((prev) => ({ ...prev, sac: e.target.value }))}
                        className={`${inputClass} font-mono`}
                      />
                    </div>
                  </div>

                  {/* 2b. CODE & DEFAULT RATE Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <label className="w-28 shrink-0 text-xs font-bold text-axc-dark-gray uppercase tracking-wide">
                      CODE
                    </label>
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="e.g. CHG-FSC (Optional)"
                        value={form.code}
                        onChange={(e) => setForm((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))}
                        className={`${inputClass} uppercase font-mono`}
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-axc-dark-gray uppercase whitespace-nowrap">
                          DEFAULT RATE:
                        </span>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={form.defaultRate}
                          onChange={(e) => setForm((prev) => ({ ...prev, defaultRate: e.target.value }))}
                          className={`${inputClass} font-mono`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3. 11 CHECKBOXES (Indented to align flush under the SAC input field) */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 pt-1">
                    {/* Left spacer matching SAC label width */}
                    <div className="hidden sm:block w-28 shrink-0" />

                    {/* Checkboxes List Column */}
                    <div className="flex-1 flex flex-col gap-4">
                      {/* GROUP 1: APPLICABLE & MANUAL */}
                      <div className="flex flex-col gap-3">
                        {/* 1. IS VAT APPLICABLE */}
                        <label className="flex items-center gap-2.5 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={form.isVatApplicable}
                            onChange={(e) => setForm((prev) => ({ ...prev, isVatApplicable: e.target.checked }))}
                            className="w-4 h-4 rounded border-gray-300 accent-axc-navy cursor-pointer shrink-0"
                          />
                          <span className="text-xs font-semibold text-axc-dark-gray uppercase tracking-wide">
                            IS VAT APPLICABLE
                          </span>
                        </label>

                        {/* 2. IS FSC APPLICABLE - SALES */}
                        <label className="flex items-center gap-2.5 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={form.isFscApplicableSales}
                            onChange={(e) => setForm((prev) => ({ ...prev, isFscApplicableSales: e.target.checked }))}
                            className="w-4 h-4 rounded border-gray-300 accent-axc-navy cursor-pointer shrink-0"
                          />
                          <span className="text-xs font-semibold text-axc-dark-gray uppercase tracking-wide">
                            IS FSC APPLICABLE - SALES
                          </span>
                        </label>

                        {/* 3. IS FSC APPLICABLE - PURCHASE */}
                        <label className="flex items-center gap-2.5 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={form.isFscApplicablePurchase}
                            onChange={(e) => setForm((prev) => ({ ...prev, isFscApplicablePurchase: e.target.checked }))}
                            className="w-4 h-4 rounded border-gray-300 accent-axc-navy cursor-pointer shrink-0"
                          />
                          <span className="text-xs font-semibold text-axc-dark-gray uppercase tracking-wide">
                            IS FSC APPLICABLE - PURCHASE
                          </span>
                        </label>

                        {/* 4. IS MANUAL (WITH SUBTITLE) */}
                        <div className="flex flex-col gap-1">
                          <label className="flex items-center gap-2.5 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={form.isManual}
                              onChange={(e) => setForm((prev) => ({ ...prev, isManual: e.target.checked }))}
                              className="w-4 h-4 rounded border-gray-300 accent-axc-navy cursor-pointer shrink-0"
                            />
                            <span className="text-xs font-semibold text-axc-dark-gray uppercase tracking-wide">
                              IS MANUAL
                            </span>
                          </label>
                          <span className="text-[10px] text-gray-500 font-medium uppercase tracking-tight leading-tight">
                            USER HAS TO MANUALLY ADD THIS CHARGE ON AWB ENTRY, BELOW SETTINGS WILL NOT WORK!
                          </span>
                        </div>
                      </div>

                      {/* GROUP 2: IS CUSTOMER OPTIONAL */}
                      <div className="flex flex-col gap-1">
                        <label className="flex items-center gap-2.5 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={form.isCustomerOptional}
                            onChange={(e) => setForm((prev) => ({ ...prev, isCustomerOptional: e.target.checked }))}
                            className="w-4 h-4 rounded border-gray-300 accent-axc-navy cursor-pointer shrink-0"
                          />
                          <span className="text-xs font-semibold text-axc-dark-gray uppercase tracking-wide">
                            IS CUSTOMER OPTIONAL
                          </span>
                        </label>
                        <span className="text-[10px] text-gray-500 font-medium uppercase tracking-tight leading-tight">
                          IF TICKED, YOU HAVE TO MANUALLY TICK ON AWB ENTRY
                        </span>
                      </div>

                      {/* GROUP 3: IS VENDOR OPTIONAL */}
                      <div className="flex flex-col gap-1">
                        <label className="flex items-center gap-2.5 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={form.isVendorOptional}
                            onChange={(e) => setForm((prev) => ({ ...prev, isVendorOptional: e.target.checked }))}
                            className="w-4 h-4 rounded border-gray-300 accent-axc-navy cursor-pointer shrink-0"
                          />
                          <span className="text-xs font-semibold text-axc-dark-gray uppercase tracking-wide">
                            IS VENDOR OPTIONAL
                          </span>
                        </label>
                        <span className="text-[10px] text-gray-500 font-medium uppercase tracking-tight leading-tight">
                          IF TICKED, YOU HAVE TO MANUALLY TICK ON AWB ENTRY
                        </span>
                      </div>

                      {/* GROUP 4: VISIBILITY & DEFAULTS */}
                      <div className="flex flex-col gap-3">
                        {/* 7. IS DEFAULT */}
                        <label className="flex items-center gap-2.5 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={form.isDefault}
                            onChange={(e) => setForm((prev) => ({ ...prev, isDefault: e.target.checked }))}
                            className="w-4 h-4 rounded border-gray-300 accent-axc-navy cursor-pointer shrink-0"
                          />
                          <span className="text-xs font-semibold text-axc-dark-gray uppercase tracking-wide">
                            IS DEFAULT
                          </span>
                        </label>

                        {/* 8. HIDE IN INVOICE */}
                        <label className="flex items-center gap-2.5 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={form.hideInInvoice}
                            onChange={(e) => setForm((prev) => ({ ...prev, hideInInvoice: e.target.checked }))}
                            className="w-4 h-4 rounded border-gray-300 accent-axc-navy cursor-pointer shrink-0"
                          />
                          <span className="text-xs font-semibold text-axc-dark-gray uppercase tracking-wide">
                            HIDE IN INVOICE
                          </span>
                        </label>

                        {/* 9. DISPLAY IN AWB APPLIES CHARGES */}
                        <label className="flex items-center gap-2.5 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={form.displayInAwbAppliesCharges}
                            onChange={(e) => setForm((prev) => ({ ...prev, displayInAwbAppliesCharges: e.target.checked }))}
                            className="w-4 h-4 rounded border-gray-300 accent-axc-navy cursor-pointer shrink-0"
                          />
                          <span className="text-xs font-semibold text-axc-dark-gray uppercase tracking-wide">
                            DISPLAY IN AWB APPLIES CHARGES
                          </span>
                        </label>

                        {/* 10. SHOW IN DUTY INVOICE */}
                        <label className="flex items-center gap-2.5 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={form.showInDutyInvoice}
                            onChange={(e) => setForm((prev) => ({ ...prev, showInDutyInvoice: e.target.checked }))}
                            className="w-4 h-4 rounded border-gray-300 accent-axc-navy cursor-pointer shrink-0"
                          />
                          <span className="text-xs font-semibold text-axc-dark-gray uppercase tracking-wide">
                            SHOW IN DUTY INVOICE
                          </span>
                        </label>

                        {/* 11. APPLY DRS ATTEMPT CHARGE */}
                        <label className="flex items-center gap-2.5 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={form.applyDrsAttemptCharge}
                            onChange={(e) => setForm((prev) => ({ ...prev, applyDrsAttemptCharge: e.target.checked }))}
                            className="w-4 h-4 rounded border-gray-300 accent-axc-navy cursor-pointer shrink-0"
                          />
                          <span className="text-xs font-semibold text-axc-dark-gray uppercase tracking-wide">
                            APPLY DRS ATTEMPT CHARGE
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* 4. RATE TYPE Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 pt-2">
                    <label className="w-28 shrink-0 text-xs font-bold text-axc-dark-gray uppercase tracking-wide">
                      RATE TYPE
                    </label>
                    <div className="flex-1">
                      <CommonDropdown
                        value={form.rateType}
                        options={RATE_TYPE_OPTIONS}
                        onChange={(val) => setForm((prev) => ({ ...prev, rateType: val }))}
                      />
                    </div>
                  </div>

                  {/* 5. STATUS Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <label className="w-28 shrink-0 text-xs font-bold text-axc-dark-gray uppercase tracking-wide">
                      STATUS
                    </label>
                    <div className="flex-1 flex items-center gap-6">
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

              {/* ══════════════ RIGHT CARD: SERVICE CARRIER MAPPINGS (col-span-4) ══════════════ */}
              <div className="lg:col-span-4 bg-white rounded-lg border border-axc-border shadow-sm flex flex-col overflow-hidden">
                <PanelHeader
                  title="Carrier service mappings"
                 
                />

                <div className="p-5 flex flex-col gap-4">
                 
                  <div className="border border-axc-border rounded-lg overflow-hidden shadow-2xs">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-50 text-gray-600 font-bold uppercase tracking-wider border-b border-axc-border">
                        <tr>
                          <th className="px-3.5 py-3 w-1/3">SERVICE</th>
                          <th className="px-3.5 py-3">CHARGE NAME</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 bg-white">
                        {SERVICE_PROVIDERS.map((service) => (
                          <tr key={service.key} className="hover:bg-gray-50/50 transition">
                            <td className="px-3.5 py-2.5 font-bold text-axc-dark-gray whitespace-nowrap">
                              {service.label}
                            </td>
                            <td className="px-3 py-2">
                              <input
                                type="text"
                                placeholder={`Enter ${service.label} charge name...`}
                                value={form.serviceMappings[service.key] || ""}
                                onChange={(e) => handleServiceChange(service.key, e.target.value.toUpperCase())}
                                className={`${inputClass} text-xs py-1.5 uppercase`}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  
                </div>
              </div>
            </div>

            {/* ══════════════ BOTTOM ACTION BUTTONS (EXACT IMAGE 1) ══════════════ */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => router.push("/master/charge")}
                className="px-5 py-4 border border-axc-border bg-white text-axc-dark-gray rounded-lg text-xs font-semibold hover:bg-gray-50 transition cursor-pointer"
              >
              
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-5 py-4 bg-axc-navy cursor-pointer text-white rounded-lg text-regular-small transition shadow-sm"
              >
               
                {loading ? "SAVING..." : "SAVE"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function CreateChargePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64 text-sm text-axc-gray">
          Loading charge master...
        </div>
      }
    >
      <CreateChargeContent />
    </Suspense>
  );
}

