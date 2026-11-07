"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Save,
  ArrowLeft,
  CheckCircle,
  Plus,
  Trash2,
  XCircle,
  DollarSign,
  Globe2,
} from "lucide-react";
import { showToast } from "@/app/src/common/toast";
import CommonDropdown from "@/app/src/common/dropdown";
import CustomDatePicker from "@/app/src/common/datepicker";
import {
  PanelHeader,
  FieldLabel,
  FieldError,
  inputClass,
  errorInputClass,
} from "@/app/create-entries/components/form";
import {
  CountryEntry,
  CountryExchangeRate,
  CURRENCY_CODE_OPTIONS,
  CURRENCY_PRESETS,
  initialCountryData,
} from "../types";

const defaultFormState = {
  name: "",
  code: "",
  dialCode: "",
  currencyCode: "",
  currencySymbol: "",
  currencyName: "",
  currencyFractionalUnit: "",
  status: "ACTIVE" as "ACTIVE" | "INACTIVE",
  exchangeRates: [
    {
      id: 1,
      rate: "",
      effectiveFrom: "",
      effectiveTill: "",
    },
  ] as CountryExchangeRate[],
};

function CreateCountryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const isEdit = Boolean(editId);

  const [form, setForm] = useState(defaultFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Load existing country if editing
  useEffect(() => {
    if (typeof window === "undefined" || !editId) return;
    try {
      const stored = localStorage.getItem("master_countries");
      const list: CountryEntry[] = stored
        ? JSON.parse(stored)
        : initialCountryData;
      const found = list.find((item) => item.id === editId || item.code === editId);
      if (found) {
        setForm({
          name: found.name || "",
          code: found.code || "",
          dialCode: found.dialCode || "",
          currencyCode: found.currencyCode || "",
          currencySymbol: found.currencySymbol || "",
          currencyName: found.currencyName || "",
          currencyFractionalUnit: found.currencyFractionalUnit || "",
          status: found.status || "ACTIVE",
          exchangeRates:
            found.exchangeRates && found.exchangeRates.length > 0
              ? found.exchangeRates
              : [
                  {
                    id: 1,
                    rate: "",
                    effectiveFrom: "",
                    effectiveTill: "",
                  },
                ],
        });
      }
    } catch (e) {
      console.error("Error loading country:", e);
    }
  }, [editId]);

  // Auto-fill currency details on Currency Code change
  const handleCurrencyChange = (currCode: string) => {
    const preset = CURRENCY_PRESETS[currCode];
    setForm((prev) => ({
      ...prev,
      currencyCode: currCode,
      currencySymbol: preset ? preset.symbol : prev.currencySymbol,
      currencyName: preset ? preset.name : prev.currencyName,
      currencyFractionalUnit: preset ? preset.fractionalUnit : prev.currencyFractionalUnit,
    }));
  };

  // Exchange rate dynamic row handlers
  const handleAddRateRow = () => {
    setForm((prev) => ({
      ...prev,
      exchangeRates: [
        ...prev.exchangeRates,
        {
          id: Date.now(),
          rate: "",
          effectiveFrom: "",
          effectiveTill: "",
        },
      ],
    }));
  };

  const handleRemoveRateRow = (id: string | number) => {
    if (form.exchangeRates.length <= 1) {
      // Clear instead of removing last row
      setForm((prev) => ({
        ...prev,
        exchangeRates: [
          {
            id: 1,
            rate: "",
            effectiveFrom: "",
            effectiveTill: "",
          },
        ],
      }));
      return;
    }
    setForm((prev) => ({
      ...prev,
      exchangeRates: prev.exchangeRates.filter((r) => r.id !== id),
    }));
  };

  const handleRateFieldChange = (
    id: string | number,
    field: keyof CountryExchangeRate,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      exchangeRates: prev.exchangeRates.map((r) =>
        r.id === id ? { ...r, [field]: value } : r
      ),
    }));
  };

  // Validation
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Country Name is required.";
    if (!form.code.trim()) newErrors.code = "Country Code is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (e?: React.FormEvent) => {
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
      const stored = localStorage.getItem("master_countries");
      const currentList: CountryEntry[] = stored
        ? JSON.parse(stored)
        : [...initialCountryData];

      if (isEdit) {
        const updatedList = currentList.map((item) => {
          if (item.id === editId || item.code === editId) {
            return {
              ...item,
              ...form,
              name: form.name.trim().toUpperCase(),
              code: form.code.trim().toUpperCase(),
            };
          }
          return item;
        });
        localStorage.setItem("master_countries", JSON.stringify(updatedList));
      } else {
        const newCountry: CountryEntry = {
          ...form,
          name: form.name.trim().toUpperCase(),
          code: form.code.trim().toUpperCase(),
          id: `CTRY-${String(currentList.length + 1).padStart(3, "0")}`,
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
        const updatedList = [newCountry, ...currentList];
        localStorage.setItem("master_countries", JSON.stringify(updatedList));
      }

      setSuccess(true);
      showToast({
        variant: "success",
        message: isEdit
          ? "Country updated successfully!"
          : "Country created successfully!",
      });

      setTimeout(() => {
        router.push("/master/country");
      }, 700);
    } catch (err) {
      console.error("Save error:", err);
      showToast({
        variant: "error",
        message: "Failed to save Country. Please try again.",
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
              {isEdit ? "EDIT COUNTRY" : "ADD COUNTRY"}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => router.push("/master/country")}
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
                {isEdit ? "Country Updated Successfully!" : "Country Created Successfully!"}
              </p>
              <p className="text-[10px] text-axc-dark-green font-medium">
                Redirecting you back to Country list...
              </p>
            </div>
          </div>
        )} */}

        {/* ══════════════ SCROLLABLE MAIN FORM (12-COL COUNTRY INFO + EXCHANGE RATE TABLE BELOW) ══════════════ */}
        <div className="flex-1 min-h-0 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <form onSubmit={handleSave} className="flex flex-col gap-6 w-full pb-36">
            <div className="flex flex-col gap-6 w-full">
              {/* ══════════════ 1. COUNTRY INFORMATION CARD (12 COL / FULL WIDTH) ══════════════ */}
              <div className="bg-white rounded-lg border border-axc-border shadow-sm flex flex-col w-full">
                <PanelHeader title="Country information" />

                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-4.5">
                  {/* ROW 1: NAME, CODE, DIAL CODE */}
                  <div className="flex flex-col gap-1">
                    <FieldLabel required>Name</FieldLabel>
                    <input
                      type="text"
                      placeholder="e.g. UNITED STATES"
                      value={form.name}
                      onChange={(e) => {
                        setForm((prev) => ({ ...prev, name: e.target.value.toUpperCase() }));
                        if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                      }}
                      className={`${errors.name ? errorInputClass : inputClass} uppercase font-medium`}
                    />
                    <FieldError message={errors.name} />
                  </div>

                  <div className="flex flex-col gap-1">
                    <FieldLabel required>Code</FieldLabel>
                    <input
                      type="text"
                      placeholder="e.g. US"
                      value={form.code}
                      onChange={(e) => {
                        setForm((prev) => ({ ...prev, code: e.target.value.toUpperCase() }));
                        if (errors.code) setErrors((prev) => ({ ...prev, code: "" }));
                      }}
                      className={`${errors.code ? errorInputClass : inputClass} uppercase font-medium`}
                    />
                    <FieldError message={errors.code} />
                  </div>

                  <div className="flex flex-col gap-1">
                    <FieldLabel>Dial Code</FieldLabel>
                    <input
                      type="text"
                      placeholder="e.g. +1"
                      value={form.dialCode}
                      onChange={(e) => setForm((prev) => ({ ...prev, dialCode: e.target.value }))}
                      className={`${inputClass} font-mono`}
                    />
                  </div>

                  {/* ROW 2: CURRENCY CODE, SYMBOL, NAME */}
                  <div className="flex flex-col gap-1">
                    <FieldLabel>Currency Code</FieldLabel>
                    <CommonDropdown
                      value={form.currencyCode}
                      options={CURRENCY_CODE_OPTIONS}
                      onChange={handleCurrencyChange}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <FieldLabel>Currency Symbol</FieldLabel>
                    <input
                      type="text"
                      placeholder="e.g. $"
                      value={form.currencySymbol}
                      onChange={(e) => setForm((prev) => ({ ...prev, currencySymbol: e.target.value }))}
                      className={inputClass}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <FieldLabel>Currency Name</FieldLabel>
                    <input
                      type="text"
                      placeholder="e.g. US DOLLAR"
                      value={form.currencyName}
                      onChange={(e) => setForm((prev) => ({ ...prev, currencyName: e.target.value.toUpperCase() }))}
                      className={`${inputClass} uppercase`}
                    />
                  </div>

                  {/* ROW 3: CURRENCY FRACTIONAL UNIT, STATUS */}
                  <div className="flex flex-col gap-1">
                    <FieldLabel>Currency Fractional Unit</FieldLabel>
                    <input
                      type="text"
                      placeholder="e.g. Cent"
                      value={form.currencyFractionalUnit}
                      onChange={(e) => setForm((prev) => ({ ...prev, currencyFractionalUnit: e.target.value }))}
                      className={inputClass}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 sm:col-span-1 lg:col-span-2">
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

              {/* ══════════════ 2. CURRENCY EXCHANGE RATE CARD (BELOW, FULL WIDTH) ══════════════ */}
              <div className="bg-white rounded-lg border border-axc-border shadow-sm flex flex-col w-full">
                <PanelHeader title="Currency exchange rate" />

                <div className="p-4 flex flex-col gap-4">
                  <div className="border border-axc-border rounded-lg overflow-x-auto shadow-2xs">
                    <table className="w-full text-left text-xs min-w-[500px]">
                      <thead className="bg-gray-50 text-gray-600 font-bold uppercase tracking-wider border-b border-axc-border">
                        <tr>
                          <th className="px-4 py-3 w-[30%]">RATE</th>
                          <th className="px-4 py-3 w-[32%]">EFFECTIVE FROM</th>
                          <th className="px-4 py-3 w-[32%]">EFFECTIVE TILL</th>
                          <th className="px-3 py-3 text-center w-[6%]">ACTION</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 bg-white">
                        {form.exchangeRates.map((row) => (
                          <tr key={row.id} className="hover:bg-gray-50/50 transition">
                            <td className="px-4 py-2.5">
                              <input
                                type="text"
                                placeholder="0.00"
                                value={row.rate}
                                onChange={(e) => handleRateFieldChange(row.id, "rate", e.target.value)}
                                className={`${inputClass} text-xs py-1.5 px-3 font-mono`}
                              />
                            </td>
                            <td className="px-4 py-2.5">
                              <CustomDatePicker
                                value={row.effectiveFrom}
                                onChange={(val) => handleRateFieldChange(row.id, "effectiveFrom", val)}
                                placeholder="YYYY-MM-DD"
                                align="left"
                                openDirection="auto"
                                className="text-xs py-1.5 px-3"
                              />
                            </td>
                            <td className="px-4 py-2.5">
                              <CustomDatePicker
                                value={row.effectiveTill}
                                onChange={(val) => handleRateFieldChange(row.id, "effectiveTill", val)}
                                placeholder="YYYY-MM-DD"
                                align="left"
                                openDirection="auto"
                                className="text-xs py-1.5 px-3"
                              />
                            </td>
                            <td className="px-3 py-2.5 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveRateRow(row.id)}
                                className="inline-flex cursor-pointer items-center justify-center rounded-md border border-axc-red/30 p-1.5 text-axc-red transition hover:bg-axc-red/10"
                                title="Remove Rate Row"
                              >
                                <Trash2 size={17} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Green + ADD MORE Button (Exact Reference Image 1) */}
                  <div>
                    <button
                      type="button"
                      onClick={handleAddRateRow}
                      className="p-1 text-white rounded-full ring ring-axc-yellow transition capitalize cursor-pointer flex justify-center items-center hover:bg-axc-yellow/10"
                    >
                      <Plus size={14} className="stroke-[3]   text-axc-yellow" />
                      
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ══════════════ BOTTOM ACTION BUTTONS ══════════════ */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => router.push("/master/country")}
                className="px-5 py-4 bg-white cursor-pointer text-axc-dark-gray border border-gray-300 rounded-lg text-regular-small transition shadow-sm"
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

export default function CreateCountryPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64 text-sm text-axc-gray">
          Loading Country form...
        </div>
      }
    >
      <CreateCountryContent />
    </Suspense>
  );
}

