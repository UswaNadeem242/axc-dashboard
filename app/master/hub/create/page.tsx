"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { showToast } from "@/app/src/common/toast";
import CommonDropdown from "@/app/src/common/dropdown";
import { api } from "@/app/src/lib/api";
import { invalidateMasterDataCache } from "@/app/src/lib/useMasterData";
import {
  PanelHeader,
  FieldLabel,
  FieldError,
  inputClass,
  errorInputClass,
} from "@/app/create-entries/components/form";
import {
  HubEntry,
  HUB_TYPE_OPTIONS,
  CONTRACT_HEAD_OPTIONS,
  COMPANY_OPTIONS,
  COUNTRY_OPTIONS,
  initialHubData,
} from "../types";

function CreateHubContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const isEdit = Boolean(editId);

  const [form, setForm] = useState<HubEntry>({
    id: `hub_${Date.now()}`,
    name: "",
    code: "",
    type: "BOTH",
    contractHead: "HEAD OFFICE",
    contactNo: "",
    email: "",
    address: "",
    airportCode: "",
    airportName: "",
    stateCode: "",
    country: "UNITED ARAB EMIRATES",
    company: "AMERICAN XPRESS COURIER - AXC INC",
    hubTrackingName: "",
    cashRangeFrom: "",
    cashRangeTo: "",
    otherRangeFrom: "",
    otherRangeTo: "",
    isDestinationHub: true,
    status: "ACTIVE",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  // Load existing hub if editing
  useEffect(() => {
    if (!editId) return;
    let mounted = true;
    async function loadItem() {
      try {
        const found = await api.getMasterItem<HubEntry>("/hubs", editId!);
        if (mounted && found) {
          setForm({
            ...found,
            id: String(found.id),
          });
          return;
        }
      } catch (err) {
        console.warn("API fetch fallback:", err);
      }
      if (mounted && typeof window !== "undefined") {
        const stored = localStorage.getItem("master_hubs");
        if (stored) {
          try {
            const list: HubEntry[] = JSON.parse(stored);
            const found = list.find((h) => String(h.id) === String(editId));
            if (found) {
              setForm(found);
            }
          } catch (e) {
            console.error("Error loading hub:", e);
          }
        }
      }
    }
    loadItem();
    return () => {
      mounted = false;
    };
  }, [editId]);

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!form.name.trim()) errs.name = "Hub name is required.";
    if (!form.code.trim()) errs.code = "Hub code is required.";
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
      let savedRecord: HubEntry = form;
      try {
        if (editId) {
          savedRecord = await api.updateMasterItem<HubEntry>("/hubs", editId, form);
        } else {
          savedRecord = await api.createMasterItem<HubEntry>("/hubs", form);
        }
      } catch (apiErr) {
        console.warn("API save fallback to localStorage:", apiErr);
      }

      const stored = localStorage.getItem("master_hubs");
      let list: HubEntry[] = stored ? JSON.parse(stored) : initialHubData;

      if (editId) {
        list = list.map((item) => (String(item.id) === String(editId) ? savedRecord : item));
        showToast({
          message: `Hub ${form.name} updated successfully.`,
          variant: "success",
        });
      } else {
        list = [savedRecord, ...list];
        showToast({
          message: `Hub ${form.name} created successfully.`,
          variant: "success",
        });
      }

      localStorage.setItem("master_hubs", JSON.stringify(list));
      invalidateMasterDataCache();
      router.push("/master/hub");
    } catch (err) {
      console.error(err);
      showToast({
        message: "Failed to save Hub. Please try again.",
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
            {/* ══════════════ HUB INFORMATION CARD (AWB PANELHEADER & 3-COL GRID) ══════════════ */}
            <div className="bg-white rounded-lg border border-axc-border shadow-sm flex flex-col w-full">
              <PanelHeader title="Hub information" />

              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-3.5">
                {/* ROW 1: NAME, CODE, TYPE */}
                <div className="flex flex-col gap-1">
                  <FieldLabel required>Name</FieldLabel>
                  <input
                    type="text"
                    placeholder="e.g. DUBAI MAIN HUB"
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
                    } uppercase font-medium`}
                  />
                  <FieldError message={errors.name} />
                </div>

                <div className="flex flex-col gap-1">
                  <FieldLabel required>Code</FieldLabel>
                  <input
                    type="text"
                    placeholder="e.g. DXB-HUB"
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
                    } uppercase font-medium`}
                  />
                  <FieldError message={errors.code} />
                </div>

                <div className="flex flex-col gap-1">
                  <FieldLabel>Type</FieldLabel>
                  <CommonDropdown
                    value={form.type}
                    options={HUB_TYPE_OPTIONS}
                    onChange={(val) => setForm((prev) => ({ ...prev, type: val }))}
                    placeholder="Select Type..."
                  />
                </div>

                {/* ROW 2: CONTRACT HEAD, CONTACT NO, EMAIL ID */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Contract Head</FieldLabel>
                  <CommonDropdown
                    value={form.contractHead}
                    options={CONTRACT_HEAD_OPTIONS}
                    onChange={(val) =>
                      setForm((prev) => ({ ...prev, contractHead: val }))
                    }
                    placeholder="Select Contract Head..."
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <FieldLabel>Contact No.</FieldLabel>
                  <input
                    type="text"
                    placeholder="e.g. +971 4 282 1234"
                    value={form.contactNo}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, contactNo: e.target.value }))
                    }
                    className={inputClass}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <FieldLabel>Email ID</FieldLabel>
                  <input
                    type="email"
                    placeholder="e.g. hub.dxb@axc.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, email: e.target.value }))
                    }
                    className={inputClass}
                  />
                </div>

                {/* ROW 3: AIRPORT CODE, AIRPORT NAME, STATE CODE */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Airport Code</FieldLabel>
                  <input
                    type="text"
                    placeholder="e.g. DXB"
                    value={form.airportCode}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        airportCode: e.target.value.toUpperCase(),
                      }))
                    }
                    className={`${inputClass} uppercase`}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <FieldLabel>Airport Name</FieldLabel>
                  <input
                    type="text"
                    placeholder="e.g. Dubai International Airport"
                    value={form.airportName}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        airportName: e.target.value,
                      }))
                    }
                    className={inputClass}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <FieldLabel>State Code</FieldLabel>
                  <input
                    type="text"
                    placeholder="e.g. DXB"
                    value={form.stateCode}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        stateCode: e.target.value.toUpperCase(),
                      }))
                    }
                    className={`${inputClass} uppercase`}
                  />
                </div>

                {/* ROW 4: COUNTRY, COMPANY, HUB TRACKING NAME */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Country</FieldLabel>
                  <CommonDropdown
                    value={form.country}
                    options={COUNTRY_OPTIONS}
                    onChange={(val) =>
                      setForm((prev) => ({ ...prev, country: val }))
                    }
                    placeholder="Select Country..."
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <FieldLabel>Company</FieldLabel>
                  <CommonDropdown
                    value={form.company}
                    options={COMPANY_OPTIONS}
                    onChange={(val) =>
                      setForm((prev) => ({ ...prev, company: val }))
                    }
                    placeholder="Select Company..."
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <FieldLabel>Hub Tracking Name</FieldLabel>
                  <input
                    type="text"
                    placeholder="e.g. DXB-MAIN-SCAN"
                    value={form.hubTrackingName}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        hubTrackingName: e.target.value.toUpperCase(),
                      }))
                    }
                    className={`${inputClass} uppercase`}
                  />
                </div>

                {/* ROW 5: ADDRESS (SPAN 2 OR FULL) */}
                <div className="flex flex-col gap-1 sm:col-span-2 xl:col-span-3">
                  <FieldLabel>Address</FieldLabel>
                  <textarea
                    rows={2}
                    placeholder="e.g. Cargo Village, Building B, Dubai Airport Freezone"
                    value={form.address}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, address: e.target.value }))
                    }
                    className="border border-axc-border rounded-md px-3 py-2 text-regular-small text-axc-gray placeholder:text-axc-gray outline-none focus:border-axc-navy transition resize-none w-full"
                  />
                </div>

                {/* ROW 6: PAYMENT TYPE CASH RANGE & OTHER RANGE */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Payment Type Cash Range</FieldLabel>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="From"
                      value={form.cashRangeFrom}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          cashRangeFrom: e.target.value,
                        }))
                      }
                      className={`${inputClass} !py-2`}
                    />
                    <span className="text-xs text-gray-400 font-medium">to</span>
                    <input
                      type="number"
                      placeholder="To"
                      value={form.cashRangeTo}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          cashRangeTo: e.target.value,
                        }))
                      }
                      className={`${inputClass} !py-2`}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <FieldLabel>Payment Type Other Range</FieldLabel>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="From"
                      value={form.otherRangeFrom}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          otherRangeFrom: e.target.value,
                        }))
                      }
                      className={`${inputClass} !py-2`}
                    />
                    <span className="text-xs text-gray-400 font-medium">to</span>
                    <input
                      type="number"
                      placeholder="To"
                      value={form.otherRangeTo}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          otherRangeTo: e.target.value,
                        }))
                      }
                      className={`${inputClass} !py-2`}
                    />
                  </div>
                </div>

                {/* IS DESTINATION HUB CHECKBOX */}
                <div className="flex flex-col justify-center pt-5">
                  <label className="flex items-center gap-2.5 cursor-pointer text-regular-small text-axc-dark-gray font-medium select-none">
                    <input
                      type="checkbox"
                      checked={form.isDestinationHub}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          isDestinationHub: e.target.checked,
                        }))
                      }
                      className="w-4 h-4 rounded border-gray-300 text-axc-navy focus:ring-axc-navy cursor-pointer accent-axc-navy"
                    />
                    Is Destination Hub
                  </label>
                </div>

                {/* ROW 7: STATUS */}
                <div className="flex flex-col gap-1.5 sm:col-span-2 xl:col-span-3 pt-2">
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

            {/* ══════════════ BOTTOM ACTION BUTTONS (EXACT AWB STYLE) ══════════════ */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => router.push("/master/hub")}
                className="px-5 py-4 border border-axc-border bg-white text-axc-dark-gray rounded-lg text-xs font-semibold hover:bg-gray-50 transition cursor-pointer"
              >
               
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-5 py-4 bg-axc-navy cursor-pointer text-white rounded-lg text-regular-small transition shadow-sm"
              >
                
                {loading ? "Saving..." : isEdit ? "Update Hub" : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function CreateHubPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64 text-sm text-axc-gray">
          Loading Hub form...
        </div>
      }
    >
      <CreateHubContent />
    </Suspense>
  );
}

