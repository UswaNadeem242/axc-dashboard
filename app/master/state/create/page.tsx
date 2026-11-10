"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Save, Plus, XCircle, Trash } from "lucide-react";
import { showToast } from "@/app/src/common/toast";
import CustomDatePicker from "@/app/src/common/datepicker";
import CommonDropdown from "@/app/src/common/dropdown";
import { api } from "@/app/src/lib/api";
import {
  PanelHeader,
  FieldLabel,
  FieldError,
  inputClass,
  errorInputClass,
} from "@/app/create-entries/components/form";
import {
  StateEntry,
  StateZoneMapping,
  COUNTRY_OPTIONS,
  ZONE_OPTIONS,
  TYPE_OPTIONS,
  SERVICE_OPTIONS,
  VENDOR_OPTIONS,
  CUSTOMER_OPTIONS,
  SERVICE_TYPE_OPTIONS,
  initialStateData,
} from "../types";

function CreateStateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const isEdit = Boolean(editId);

  const [form, setForm] = useState<StateEntry>({
    id: `state_${Date.now()}`,
    name: "",
    code: "",
    portCode: "",
    country: "",
    gstStateCode: "",
    skynetState: "",
    eWaybillMaxAmount: "",
    intrastateMaxAmount: "",
    interstateMaxAmount: "",
    status: "ACTIVE",
    zones: [
      {
        id: `zone_map_${Date.now()}_1`,
        zone: "",
        type: "BOTH",
        customer: "ALL",
        service: "ALL",
        vendor: "ALL",
        effectiveFrom: "",
        effectiveTill: "",
        serviceType: "SERVICEABLE",
      },
    ],
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  // Load existing state if edit mode
  useEffect(() => {
    if (!editId) return;
    let mounted = true;
    async function loadItem() {
      try {
        const found = await api.getMasterItem<StateEntry>("/states", editId!);
        if (mounted && found) {
          setForm({
            ...found,
            id: String(found.id),
            zones:
              found.zones && found.zones.length > 0
                ? found.zones
                : [
                    {
                      id: `zone_map_${Date.now()}_1`,
                      zone: "",
                      type: "BOTH",
                      customer: "ALL",
                      service: "ALL",
                      vendor: "ALL",
                      effectiveFrom: "",
                      effectiveTill: "",
                      serviceType: "SERVICEABLE",
                    },
                  ],
          });
          return;
        }
      } catch (err) {
        console.warn("API fetch fallback:", err);
      }
      if (mounted && typeof window !== "undefined") {
        const stored = localStorage.getItem("master_states");
        if (stored) {
          try {
            const list: StateEntry[] = JSON.parse(stored);
            const found = list.find((s) => String(s.id) === String(editId));
            if (found) {
              setForm({
                ...found,
                zones:
                  found.zones && found.zones.length > 0
                    ? found.zones
                    : [
                        {
                          id: `zone_map_${Date.now()}_1`,
                          zone: "",
                          type: "BOTH",
                          customer: "ALL",
                          service: "ALL",
                          vendor: "ALL",
                          effectiveFrom: "",
                          effectiveTill: "",
                          serviceType: "SERVICEABLE",
                        },
                      ],
              });
            }
          } catch (e) {
            console.error("Error loading state:", e);
          }
        }
      }
    }
    loadItem();
    return () => {
      mounted = false;
    };
  }, [editId]);

  // Zone Row Handlers
  const handleAddZoneRow = () => {
    const newRow: StateZoneMapping = {
      id: `zone_map_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      zone: "",
      type: "BOTH",
      customer: "ALL",
      service: "ALL",
      vendor: "ALL",
      effectiveFrom: "",
      effectiveTill: "",
      serviceType: "SERVICEABLE",
    };
    setForm((prev) => ({
      ...prev,
      zones: [...prev.zones, newRow],
    }));
  };

  const handleRemoveZoneRow = (id: string) => {
    if (form.zones.length <= 1) {
      showToast({
        message: "At least one zone row is required.",
        variant: "info",
      });
      return;
    }
    setForm((prev) => ({
      ...prev,
      zones: prev.zones.filter((row) => row.id !== id),
    }));
  };

  const handleZoneFieldChange = (
    id: string,
    field: keyof StateZoneMapping,
    val: string
  ) => {
    setForm((prev) => ({
      ...prev,
      zones: prev.zones.map((row) =>
        row.id === id ? { ...row, [field]: val } : row
      ),
    }));
  };

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!form.name.trim()) errs.name = "State name is required.";
    if (!form.code.trim()) errs.code = "State code is required.";
    if (!form.country.trim()) errs.country = "Country is required.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      showToast({
        message: "Please fill in all required fields.",
        variant: "error",
      });
      return;
    }

    setLoading(true);

    try {
      let savedRecord: StateEntry = form;
      try {
        if (editId) {
          savedRecord = await api.updateMasterItem<StateEntry>("/states", editId, form);
        } else {
          savedRecord = await api.createMasterItem<StateEntry>("/states", form);
        }
      } catch (apiErr) {
        console.warn("API save fallback to localStorage:", apiErr);
      }

      const stored = localStorage.getItem("master_states");
      let list: StateEntry[] = stored ? JSON.parse(stored) : initialStateData;

      if (editId) {
        list = list.map((item) => (String(item.id) === String(editId) ? savedRecord : item));
        showToast({
          message: `State ${form.name} updated successfully.`,
          variant: "success",
        });
      } else {
        list = [savedRecord, ...list];
        showToast({
          message: `State ${form.name} created successfully.`,
          variant: "success",
        });
      }

      localStorage.setItem("master_states", JSON.stringify(list));
      router.push("/master/state");
    } catch (err) {
      console.error(err);
      showToast({
        message: "Failed to save state. Please try again.",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full h-full min-h-0 overflow-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {/* ══════════════ AWB-STYLE CARD CONTAINER ══════════════ */}
      <div className="relative bg-white p-4 rounded-lg border border-gray-200 w-full flex-1 min-h-0 flex flex-col overflow-hidden">
        {/* ══════════════ SCROLLABLE MAIN FORM (AWB LAYOUT) ══════════════ */}
        <div className="flex-1 min-h-0 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full pb-36">
            <div className="flex flex-col gap-6 w-full">
              {/* ══════════════ 1. STATE INFORMATION CARD (AWB PANELHEADER & 3-COL GRID) ══════════════ */}
              <div className="bg-white rounded-lg border border-axc-border shadow-sm flex flex-col w-full">
                <PanelHeader title="State information" />

                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-3">
                  {/* ROW 1: NAME, CODE, PORT CODE */}
                  <div className="flex flex-col gap-1">
                    <FieldLabel required>Name</FieldLabel>
                    <input
                      type="text"
                      placeholder="e.g. CALIFORNIA"
                      value={form.name}
                      onChange={(e) => {
                        setForm((prev) => ({
                          ...prev,
                          name: e.target.value.toUpperCase(),
                        }));
                        if (errors.name)
                          setErrors((prev) => ({ ...prev, name: "" }));
                      }}
                      className={`${
                        errors.name ? errorInputClass : inputClass
                      } uppercase`}
                    />
                    <FieldError message={errors.name} />
                  </div>

                  <div className="flex flex-col gap-1">
                    <FieldLabel required>Code</FieldLabel>
                    <input
                      type="text"
                      placeholder="e.g. CA"
                      value={form.code}
                      onChange={(e) => {
                        setForm((prev) => ({
                          ...prev,
                          code: e.target.value.toUpperCase(),
                        }));
                        if (errors.code)
                          setErrors((prev) => ({ ...prev, code: "" }));
                      }}
                      className={`${
                        errors.code ? errorInputClass : inputClass
                      } uppercase`}
                    />
                    <FieldError message={errors.code} />
                  </div>

                  <div className="flex flex-col gap-1">
                    <FieldLabel>Port Code</FieldLabel>
                    <input
                      type="text"
                      placeholder="e.g. USLAX"
                      value={form.portCode}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          portCode: e.target.value.toUpperCase(),
                        }))
                      }
                      className={`${inputClass} uppercase`}
                    />
                  </div>

                  {/* ROW 2: COUNTRY, GST STATE CODE, SKYNET STATE */}
                  <div className="flex flex-col gap-1">
                    <FieldLabel required>Country</FieldLabel>
                    <CommonDropdown
                      value={form.country}
                      options={COUNTRY_OPTIONS}
                      onChange={(val) => {
                        setForm((prev) => ({ ...prev, country: val }));
                        if (errors.country)
                          setErrors((prev) => ({ ...prev, country: "" }));
                      }}
                      placeholder="Select Country..."
                      className={
                        errors.country
                          ? "!border-red-400 !bg-red-50/40"
                          : "border-axc-border"
                      }
                    />
                    <FieldError message={errors.country} />
                  </div>

                  <div className="flex flex-col gap-1">
                    <FieldLabel>GST State Code</FieldLabel>
                    <input
                      type="text"
                      placeholder="e.g. 06"
                      value={form.gstStateCode}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          gstStateCode: e.target.value,
                        }))
                      }
                      className={inputClass}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <FieldLabel>Skynet State</FieldLabel>
                    <input
                      type="text"
                      placeholder="e.g. CA-SKY"
                      value={form.skynetState}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          skynetState: e.target.value.toUpperCase(),
                        }))
                      }
                      className={`${inputClass} uppercase`}
                    />
                  </div>

                  {/* ROW 3: E WAYBILL MAX AMOUNT, INTRASTATE MAX AMOUNT, INTERSTATE MAX AMOUNT */}
                  <div className="flex flex-col gap-1">
                    <FieldLabel>E Waybill Max Amount</FieldLabel>
                    <input
                      type="number"
                      placeholder="e.g. 50000"
                      value={form.eWaybillMaxAmount}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          eWaybillMaxAmount: e.target.value,
                        }))
                      }
                      className={inputClass}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <FieldLabel>Intrastate Max Amount</FieldLabel>
                    <input
                      type="number"
                      placeholder="e.g. 100000"
                      value={form.intrastateMaxAmount}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          intrastateMaxAmount: e.target.value,
                        }))
                      }
                      className={inputClass}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <FieldLabel>Interstate Max Amount</FieldLabel>
                    <input
                      type="number"
                      placeholder="e.g. 50000"
                      value={form.interstateMaxAmount}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          interstateMaxAmount: e.target.value,
                        }))
                      }
                      className={inputClass}
                    />
                  </div>

                  {/* ROW 4: STATUS */}
                  <div className="flex flex-col gap-1.5 sm:col-span-2 xl:col-span-3 pt-1">
                    <FieldLabel>Status</FieldLabel>
                    <div className="flex items-center gap-6 pt-1">
                      <label className="flex items-center gap-2 cursor-pointer text-regular-small text-axc-dark-gray select-none">
                        <input
                          type="radio"
                          name="status"
                          value="ACTIVE"
                          checked={form.status === "ACTIVE"}
                          onChange={() =>
                            setForm((prev) => ({ ...prev, status: "ACTIVE" }))
                          }
                          className="w-4 h-4 accent-axc-navy cursor-pointer"
                        />
                        Active
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-regular-small text-axc-dark-gray select-none">
                        <input
                          type="radio"
                          name="status"
                          value="INACTIVE"
                          checked={form.status === "INACTIVE"}
                          onChange={() =>
                            setForm((prev) => ({ ...prev, status: "INACTIVE" }))
                          }
                          className="w-4 h-4 accent-axc-navy cursor-pointer"
                        />
                        Inactive
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* ══════════════ 2. ZONE MAPPING CARD (BELOW, FULL WIDTH) ══════════════ */}
              <div className="bg-white rounded-lg border border-axc-border shadow-sm flex flex-col w-full">
                <PanelHeader
                  title="Zone mapping"
                  
                />

                <div className="p-4 flex flex-col gap-4">
                  <div className="border border-axc-border rounded-lg overflow-x-auto">
                    <table className="w-full text-left text-xs min-w-[950px]">
                      <thead className="bg-axc-navy/10 text-regular-medium text-axc-dark-gray text-left whitespace-nowrap">
                        <tr>
                          <th className="px-3 py-3 w-[14%]">Zone</th>
                          <th className="px-3 py-3 w-[11%]">Type</th>
                          <th className="px-3 py-3 w-[14%]">Customer</th>
                          <th className="px-3 py-3 w-[13%]">Service</th>
                          <th className="px-3 py-3 w-[15%]">Vendor</th>
                          <th className="px-3 py-3 w-[12%]">Effective from</th>
                          <th className="px-3 py-3 w-[12%]">Effective till</th>
                          <th className="px-3 py-3 w-[14%]">Service Type</th>
                          <th className="px-2 py-3 text-center w-[5%]">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 bg-white">
                        {form.zones.map((row) => (
                          <tr
                            key={row.id}
                            className="hover:bg-gray-50/50 transition"
                          >
                            {/* ZONE - Input Field */}
                            <td className="px-3 py-2">
                              <input
                                type="text"
                                placeholder="SEARCH HERE..."
                                value={row.zone}
                                onChange={(e) =>
                                  handleZoneFieldChange(
                                    row.id,
                                    "zone",
                                    e.target.value.toUpperCase()
                                  )
                                }
                                className="border border-axc-border rounded-md px-3 py-1.5 outline-none w-full text-xs text-axc-dark-gray placeholder:text-gray-400 bg-white  "
                              />
                            </td>

                            {/* TYPE - The ONLY Dropdown */}
                            <td className="px-3 py-2">
                              <CommonDropdown
                                value={row.type}
                                options={TYPE_OPTIONS}
                                onChange={(val) =>
                                  handleZoneFieldChange(
                                    row.id,
                                    "type",
                                    val as "BOTH" | "CUSTOMER" | "VENDOR"
                                  )
                                }
                                className="!py-1.5 !px-2.5 !text-xs"
                              />
                            </td>

                            {/* CUSTOMER - Input Field */}
                            <td className="px-3 py-2">
                              <input
                                type="text"
                                placeholder="SEARCH HERE..."
                                value={row.customer}
                                onChange={(e) =>
                                  handleZoneFieldChange(
                                    row.id,
                                    "customer",
                                    e.target.value.toUpperCase()
                                  )
                                }
                                className="border border-axc-border rounded-md px-3 py-1.5 outline-none w-full text-xs text-axc-dark-gray placeholder:text-gray-400 bg-white "
                              />
                            </td>

                            {/* SERVICE - Input Field */}
                            <td className="px-3 py-2">
                              <input
                                type="text"
                                placeholder="SEARCH HERE..."
                                value={row.service}
                                onChange={(e) =>
                                  handleZoneFieldChange(
                                    row.id,
                                    "service",
                                    e.target.value.toUpperCase()
                                  )
                                }
                                className="border border-axc-border rounded-md px-3 py-1.5 outline-none w-full text-xs text-axc-dark-gray placeholder:text-gray-400 bg-white "
                              />
                            </td>

                            {/* VENDOR - Input Field */}
                            <td className="px-3 py-2">
                              <input
                                type="text"
                                placeholder="SEARCH HERE..."
                                value={row.vendor}
                                onChange={(e) =>
                                  handleZoneFieldChange(
                                    row.id,
                                    "vendor",
                                    e.target.value.toUpperCase()
                                  )
                                }
                                className="border border-axc-border rounded-md px-3 py-1.5 outline-none w-full text-xs text-axc-dark-gray placeholder:text-gray-400 bg-white "
                              />
                            </td>

                            {/* EFFECTIVE FROM - Datepicker */}
                            <td className="px-3 py-2">
                              <CustomDatePicker
                                value={row.effectiveFrom}
                                onChange={(val) =>
                                  handleZoneFieldChange(
                                    row.id,
                                    "effectiveFrom",
                                    val
                                  )
                                }
                                placeholder="YYYY-MM-DD"
                                align="left"
                                openDirection="auto"
                                className="!py-1.5 !px-2.5 !text-xs"
                              />
                            </td>

                            {/* EFFECTIVE TILL - Datepicker */}
                            <td className="px-3 py-2">
                              <CustomDatePicker
                                value={row.effectiveTill}
                                onChange={(val) =>
                                  handleZoneFieldChange(
                                    row.id,
                                    "effectiveTill",
                                    val
                                  )
                                }
                                placeholder="YYYY-MM-DD"
                                align="left"
                                openDirection="auto"
                                className="!py-1.5 !px-2.5 !text-xs"
                              />
                            </td>

                            {/* SERVICE TYPE - Input Field */}
                            <td className="px-3 py-2">
                              <input
                                type="text"
                                placeholder="SERVICEABLE"
                                value={row.serviceType}
                                onChange={(e) =>
                                  handleZoneFieldChange(
                                    row.id,
                                    "serviceType",
                                    e.target.value.toUpperCase() as any
                                  )
                                }
                                className="border border-axc-border rounded-md px-3 py-1.5 outline-none w-full text-xs text-axc-dark-gray placeholder:text-gray-400 bg-white focus:border-axc-navy uppercase transition"
                              />
                            </td>

                            {/* ACTION */}
                            <td className="px-2 py-2 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveZoneRow(row.id)}
                                className="inline-flex cursor-pointer items-center justify-center rounded-md border border-axc-red/30 p-1.5 text-axc-red transition "
                                title="Remove Zone Row"
                              >
                                <Trash size={17} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Green + ADD ZONE Button (Below Table) */}
                  <div>
                    <button
                      type="button"
                      onClick={handleAddZoneRow}
                      className="p-1 text-white rounded-full ring ring-axc-yellow transition capitalize cursor-pointer flex justify-center items-center hover:bg-axc-yellow/10"
                    >
                      <Plus size={14} className="stroke-[3]  text-axc-yellow" />
                      
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ══════════════ BOTTOM ACTION BUTTONS (EXACT AWB STYLE) ══════════════ */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => router.push("/master/state")}
                className="px-5 py-4 bg-white cursor-pointer text-axc-dark-gray border border-gray-300 rounded-lg text-regular-small transition shadow-sm"
              >
             
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-5 py-4 bg-axc-navy cursor-pointer text-white rounded-lg text-regular-small transition shadow-sm"
              >
               
                {loading ? "Saving..." : isEdit ? "Update State" : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function CreateStatePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64 text-sm text-axc-gray">
          Loading State form...
        </div>
      }
    >
      <CreateStateContent />
    </Suspense>
  );
}
