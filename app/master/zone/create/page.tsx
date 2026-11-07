"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Save,
  ArrowLeft,
  CheckCircle,
  MapPin,
  Globe2,
} from "lucide-react";
import { showToast } from "@/app/src/common/toast";
import {
  PanelHeader,
  FieldLabel,
  FieldError,
  inputClass,
  errorInputClass,
} from "@/app/create-entries/components/form";
import {
  ZoneEntry,
  initialZoneData,
} from "../types";

const defaultFormState = {
  code: "",
  // name: "",
  status: "ACTIVE" as "ACTIVE" | "INACTIVE",
};

function CreateZoneContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const isEdit = Boolean(editId);

  const [form, setForm] = useState(defaultFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Load existing zone if editing
  useEffect(() => {
    if (typeof window === "undefined" || !editId) return;
    try {
      const stored = localStorage.getItem("master_zones");
      const list: ZoneEntry[] = stored
        ? JSON.parse(stored)
        : initialZoneData;
      const found = list.find((item) => item.id === editId || item.code === editId);
      if (found) {
        setForm({
          code: found.code || "",
          status: found.status || "ACTIVE",
        });
      }
    } catch (e) {
      console.error("Error loading zone:", e);
    }
  }, [editId]);

  // Validation
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.code.trim()) newErrors.code = "Zone Code is required.";
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
      const stored = localStorage.getItem("master_zones");
      const currentList: ZoneEntry[] = stored
        ? JSON.parse(stored)
        : [...initialZoneData];

      if (isEdit) {
        const updatedList = currentList.map((item) => {
          if (item.id === editId || item.code === editId) {
            return {
              ...item,
              ...form,
              code: form.code.trim().toUpperCase(),
            };
          }
          return item;
        });
        localStorage.setItem("master_zones", JSON.stringify(updatedList));
      } else {
        const newZone: ZoneEntry = {
          ...form,
          code: form.code.trim().toUpperCase(),
          id: `ZN-${String(currentList.length + 1).padStart(3, "0")}`,
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
        const updatedList = [newZone, ...currentList];
        localStorage.setItem("master_zones", JSON.stringify(updatedList));
      }

      setSuccess(true);
      showToast({
        variant: "success",
        message: isEdit
          ? "Zone updated successfully!"
          : "Zone created successfully!",
      });

      setTimeout(() => {
        router.push("/master/zone");
      }, 700);
    } catch (err) {
      console.error("Save error:", err);
      showToast({
        variant: "error",
        message: "Failed to save Zone. Please try again.",
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
              {isEdit ? "EDIT ZONE" : "ADD ZONE"}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => router.push("/master/zone")}
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
        {success && (
          <div className="flex items-center gap-3 rounded-2xl bg-axc-green/10 border border-axc-green/30 p-4 text-axc-dark-green animate-in fade-in slide-in-from-top-4 duration-300 shrink-0 mt-3">
            <CheckCircle className="h-5 w-5 text-axc-dark-green shrink-0" />
            <div>
              <p className="text-xs font-bold">
                {isEdit ? "Zone Updated Successfully!" : "Zone Created Successfully!"}
              </p>
              <p className="text-[10px] text-axc-dark-green font-medium">
                Redirecting you back to Zone list...
              </p>
            </div>
          </div>
        )}

        {/* ══════════════ SCROLLABLE MAIN FORM (IMAGE 2 AWB/CREDIT NOTE STYLE CARD) ══════════════ */}
        <div className="flex-1 min-h-0 overflow-y-auto  [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <form onSubmit={handleSave} className="flex flex-col gap-6 w-full pb-36">
            <div className="bg-white rounded-lg border border-axc-border shadow-sm flex flex-col w-full">
              {/* Purple-Slate Header Banner: Image 2 Style */}
              <PanelHeader title="Zone information" />

              {/* Main Content Grid: Matching Image 2 */}
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-x-5 gap-y-4.5">
                {/* 1. CODE * */}
                <div className="flex flex-col gap-1">
                  <FieldLabel required>Code</FieldLabel>
                  <input
                    type="text"
                    placeholder="e.g. ZONE-1"
                    value={form.code}
                    onChange={(e) => {
                      setForm((prev) => ({ ...prev, code: e.target.value.toUpperCase() }));
                      if (errors.code) setErrors((prev) => ({ ...prev, code: "" }));
                    }}
                    className={`${errors.code ? errorInputClass : inputClass} uppercase font-medium`}
                  />
                  <FieldError message={errors.code} />
                </div>

                {/* 2. NAME */}
                {/* <div className="flex flex-col gap-1 sm:col-span-1 lg:col-span-2">
                  <FieldLabel>Zone Name / Description</FieldLabel>
                  <input
                    type="text"
                    placeholder="e.g. NORTH AMERICA (USA & CANADA)"
                    value={form.name}
                    onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value.toUpperCase() }))}
                    className={`${inputClass} uppercase`}
                  />
                </div> */}


                <div className="flex flex-col gap-1 ">
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

                {/* 3. STATUS */}

              </div>
            </div>

            {/* ══════════════ BOTTOM ACTION BUTTONS ══════════════ */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => router.push("/master/zone")}
                className="px-5 py-4 border border-axc-border bg-white text-axc-dark-gray rounded-lg text-xs font-semibold hover:bg-gray-50 transition cursor-pointer "
              >
               
                BACK
              </button>

              <button
                type="submit"
                disabled={loading}
                className="bg-axc-navy text-white text-regular-small px-5 py-4 rounded-lg cursor-pointer transition  "
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

export default function CreateZonePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64 text-sm text-axc-gray">
          Loading Zone form...
        </div>
      }
    >
      <CreateZoneContent />
    </Suspense>
  );
}

