"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Save, Plus, XCircle, Trash } from "lucide-react";
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
} from "@/app/create-entries/components/form";
import {
  AwbStateEntry,
  STATE_NAME_OPTIONS,
  EVENT_DATETIME_OPTIONS,
  EVENT_LOCATION_OPTIONS,
  initialAwbStateData,
} from "../types";

function CreateAwbStateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const isEdit = Boolean(editId);

  const [form, setForm] = useState<AwbStateEntry>({
    id: `awb_state_${Date.now()}`,
    stateName: "",
    eventDateTime: "CURRENT DATE & TIME",
    eventLocation: "ORIGIN HUB",
    descriptions: [""],
    status: "ACTIVE",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  // Load existing AWB state if editing
  useEffect(() => {
    if (!editId) return;
    let mounted = true;
    api
      .getMasterItem<AwbStateEntry>("/awb-states", editId)
      .then((found) => {
        if (mounted && found) {
          setForm({
            ...found,
            descriptions:
              found.descriptions && found.descriptions.length > 0
                ? found.descriptions
                : [""],
          });
        }
      })
      .catch(() => {
        if (typeof window !== "undefined") {
          const stored = localStorage.getItem("master_awb_states");
          if (stored) {
            try {
              const list: AwbStateEntry[] = JSON.parse(stored);
              const found = list.find((item) => String(item.id) === String(editId));
              if (found && mounted) {
                setForm({
                  ...found,
                  descriptions:
                    found.descriptions && found.descriptions.length > 0
                      ? found.descriptions
                      : [""],
                });
              }
            } catch (e) {
              console.error("Error loading AWB state:", e);
            }
          }
        }
      });
    return () => {
      mounted = false;
    };
  }, [editId]);

  // Description dynamic list handlers
  const handleAddDescription = () => {
    setForm((prev) => ({
      ...prev,
      descriptions: [...prev.descriptions, ""],
    }));
  };

  const handleRemoveDescription = (index: number) => {
    if (form.descriptions.length <= 1) {
      showToast({
        message: "At least one description field is required.",
        variant: "info",
      });
      return;
    }
    setForm((prev) => ({
      ...prev,
      descriptions: prev.descriptions.filter((_, i) => i !== index),
    }));
  };

  const handleDescriptionChange = (index: number, val: string) => {
    setForm((prev) => {
      const next = [...prev.descriptions];
      next[index] = val;
      return { ...prev, descriptions: next };
    });
    if (errors.descriptions) {
      setErrors((prev) => ({ ...prev, descriptions: "" }));
    }
  };

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!form.stateName.trim()) errs.stateName = "State name is required.";
    if (!form.eventDateTime.trim())
      errs.eventDateTime = "Event date & time is required.";
    if (!form.eventLocation.trim())
      errs.eventLocation = "Event location is required.";

    const hasFilledDescription = form.descriptions.some((d) => d.trim().length > 0);
    if (!hasFilledDescription) {
      errs.descriptions = "At least one event description is required.";
    }

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
      const cleanedDescriptions = form.descriptions.filter((d) => d.trim().length > 0);
      const payload: AwbStateEntry = {
        ...form,
        descriptions:
          cleanedDescriptions.length > 0 ? cleanedDescriptions : ["Updated status."],
      };

      let savedRecord = payload;
      try {
        if (editId) {
          savedRecord = await api.updateMasterItem<AwbStateEntry>("/awb-states", editId, payload);
        } else {
          savedRecord = await api.createMasterItem<AwbStateEntry>("/awb-states", payload);
        }
      } catch (apiErr) {
        console.warn("API save fallback to local:", apiErr);
      }

      const stored = localStorage.getItem("master_awb_states");
      let list: AwbStateEntry[] = stored
        ? JSON.parse(stored)
        : initialAwbStateData;

      if (editId) {
        list = list.map((item) => (String(item.id) === String(editId) ? savedRecord : item));
        showToast({
          message: `AWB State ${payload.stateName} updated successfully.`,
          variant: "success",
        });
      } else {
        list = [savedRecord, ...list];
        showToast({
          message: `AWB State ${payload.stateName} created successfully.`,
          variant: "success",
        });
      }

      localStorage.setItem("master_awb_states", JSON.stringify(list));
      invalidateMasterDataCache();
      router.push("/master/awb-state");
    } catch (err) {
      console.error(err);
      showToast({
        message: "Failed to save AWB State. Please try again.",
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
            {/* ══════════════ AWB STATE INFORMATION CARD ══════════════ */}
            <div className="bg-white rounded-lg border border-axc-border shadow-sm flex flex-col w-full">
              <PanelHeader title="AWB state information" />

              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-3.5">
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
                {/* ROW 1: STATE NAME, EVENT DATE & TIME, EVENT LOCATION */}
                <div className="flex flex-col gap-1">
                  <FieldLabel required>State Name</FieldLabel>
                  <CommonDropdown
                    value={form.stateName}
                    options={STATE_NAME_OPTIONS}
                    onChange={(val) => {
                      setForm((prev) => ({ ...prev, stateName: val }));
                      if (errors.stateName)
                        setErrors((prev) => ({ ...prev, stateName: "" }));
                    }}
                    placeholder="Select State Name..."
                    className={
                      errors.stateName
                        ? "!border-red-400 !bg-red-50/40"
                        : "border-axc-border"
                    }
                  />
                  <FieldError message={errors.stateName} />
                </div>

                <div className="flex flex-col gap-1">
                  <FieldLabel required>Event Date & Time</FieldLabel>
                  <CommonDropdown
                    value={form.eventDateTime}
                    options={EVENT_DATETIME_OPTIONS}
                    onChange={(val) => {
                      setForm((prev) => ({ ...prev, eventDateTime: val }));
                      if (errors.eventDateTime)
                        setErrors((prev) => ({ ...prev, eventDateTime: "" }));
                    }}
                    placeholder="Select Event Date & Time..."
                    className={
                      errors.eventDateTime
                        ? "!border-red-400 !bg-red-50/40"
                        : "border-axc-border"
                    }
                  />
                  <FieldError message={errors.eventDateTime} />
                </div>

                <div className="flex flex-col gap-1">
                  <FieldLabel required>Event Location</FieldLabel>
                  <CommonDropdown
                    value={form.eventLocation}
                    options={EVENT_LOCATION_OPTIONS}
                    onChange={(val) => {
                      setForm((prev) => ({ ...prev, eventLocation: val }));
                      if (errors.eventLocation)
                        setErrors((prev) => ({ ...prev, eventLocation: "" }));
                    }}
                    placeholder="Select Event Location..."
                    className={
                      errors.eventLocation
                        ? "!border-red-400 !bg-red-50/40"
                        : "border-axc-border"
                    }
                  />
                  <FieldError message={errors.eventLocation} />
                </div>

                {/* ROW 2: EVENT DESCRIPTION(S) */}
                <div className="flex flex-col gap-2.5 sm:col-span-2 xl:col-span-3 pt-1">
                  <FieldLabel required>Event Description</FieldLabel>

                  <div className="flex flex-col gap-2">
                    {form.descriptions.map((desc, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Enter event description..."
                          value={desc}
                          onChange={(e) =>
                            handleDescriptionChange(idx, e.target.value)
                          }
                          className={`${inputClass} !py-2 flex-1`}
                        />

                        {form.descriptions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveDescription(idx)}
                            className="inline-flex cursor-pointer items-center justify-center rounded-md border border-axc-red/30 p-1.5 text-axc-red transition "
                            title="Remove Description"
                          >
                            <Trash size={18} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <FieldError message={errors.descriptions} />

                  {/* + ADD DESCRIPTION GREEN BUTTON */}
                  <div>
                    <button
                      type="button"
                      onClick={handleAddDescription}
                      className="p-1 text-white rounded-full ring ring-axc-yellow transition capitalize cursor-pointer flex justify-center items-center hover:bg-axc-yellow/10"
                    >
                      <Plus size={14} className="stroke-[3]  text-axc-yellow" />
                      
                    </button>
                  </div>
                </div>

                {/* ROW 3: STATUS */}
               
              </div>
            </div>

            {/* ══════════════ BOTTOM ACTION BUTTONS (EXACT AWB STYLE) ══════════════ */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => router.push("/master/awb-state")}
                className="px-5 py-4 border border-axc-border bg-white text-axc-dark-gray rounded-lg text-xs font-semibold hover:bg-gray-50 transition cursor-pointer"
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

export default function CreateAwbStatePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64 text-sm text-axc-gray">
          Loading AWB State form...
        </div>
      }
    >
      <CreateAwbStateContent />
    </Suspense>
  );
}

