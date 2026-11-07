"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { showToast } from "@/app/src/common/toast";
import CommonDropdown from "@/app/src/common/dropdown";
import {
  PanelHeader,
  FieldLabel,
  FieldError,
  inputClass,
  errorInputClass,
} from "@/app/create-entries/components/form";
import {
  CityEntry,
  DISTRICT_OPTIONS,
  initialCityData,
} from "../types";

function CreateCityContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const isEdit = Boolean(editId);

  const [form, setForm] = useState<CityEntry>({
    id: `city_${Date.now()}`,
    name: "",
    code: "",
    district: "",
    status: "ACTIVE",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  // Load existing city if editing
  useEffect(() => {
    if (editId && typeof window !== "undefined") {
      const stored = localStorage.getItem("master_cities");
      if (stored) {
        try {
          const list: CityEntry[] = JSON.parse(stored);
          const found = list.find((c) => c.id === editId);
          if (found) {
            setForm(found);
          }
        } catch (e) {
          console.error("Error loading city:", e);
        }
      }
    }
  }, [editId]);

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!form.name.trim()) errs.name = "City name is required.";
    if (!form.code.trim()) errs.code = "City code is required.";
    if (!form.district.trim()) errs.district = "District is required.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
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
      const stored = localStorage.getItem("master_cities");
      let list: CityEntry[] = stored ? JSON.parse(stored) : initialCityData;

      if (editId) {
        list = list.map((item) => (item.id === editId ? form : item));
        showToast({
          message: `City ${form.name} updated successfully.`,
          variant: "success",
        });
      } else {
        list = [form, ...list];
        showToast({
          message: `City ${form.name} created successfully.`,
          variant: "success",
        });
      }

      localStorage.setItem("master_cities", JSON.stringify(list));
      router.push("/master/city");
    } catch (err) {
      console.error(err);
      showToast({
        message: "Failed to save City. Please try again.",
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
            {/* ══════════════ CITY INFORMATION CARD (AWB PANELHEADER & 3-COL GRID) ══════════════ */}
            <div className="bg-white rounded-lg border border-axc-border shadow-sm flex flex-col w-full">
              <PanelHeader title="City information" />

              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-3.5">
                {/* ROW 1: NAME, CODE, DISTRICT */}
                <div className="flex flex-col gap-1">
                  <FieldLabel required>Name</FieldLabel>
                  <input
                    type="text"
                    placeholder="e.g. DUBAI"
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
                    placeholder="e.g. DXB"
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
                  <FieldLabel required>District</FieldLabel>
                  <CommonDropdown
                    value={form.district}
                    options={DISTRICT_OPTIONS}
                    onChange={(val) => {
                      setForm((prev) => ({ ...prev, district: val }));
                      if (errors.district)
                        setErrors((prev) => ({ ...prev, district: "" }));
                    }}
                    placeholder="SEARCH HERE..."
                    className={
                      errors.district
                        ? "!border-red-400 !bg-red-50/40"
                        : "border-axc-border"
                    }
                  />
                  <FieldError message={errors.district} />
                </div>

                {/* ROW 2: STATUS */}
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
                onClick={() => router.push("/master/city")}
                className="px-5 py-4 border border-axc-border bg-white text-axc-dark-gray rounded-lg text-xs font-semibold hover:bg-gray-50 transition cursor-pointer"
              >
                 
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-5 py-4 bg-axc-navy cursor-pointer text-white rounded-lg text-regular-small transition shadow-sm"
              >
                
                {loading ? "Saving..." : isEdit ? "Update City" : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function CreateCityPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64 text-sm text-axc-gray">
          Loading City form...
        </div>
      }
    >
      <CreateCityContent />
    </Suspense>
  );
}

