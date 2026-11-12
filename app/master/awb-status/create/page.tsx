"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { showToast } from "@/app/src/common/toast";
import { api } from "@/app/src/lib/api";
<<<<<<< HEAD
import { invalidateMasterDataCache } from "@/app/src/lib/useMasterData";
=======
>>>>>>> 1857e6c4bcd752cfb854388be178686e21382f68
import {
  PanelHeader,
  FieldLabel,
  FieldError,
  inputClass,
} from "@/app/create-entries/components/form";
import {
  AwbStatusEntry,
  initialAwbStatusData,
} from "../types";

function CreateAwbStatusContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const isEdit = Boolean(editId);

  const [form, setForm] = useState<AwbStatusEntry>({
    id: `awb_status_${Date.now()}`,
    name: "",
    code: "",
    status: "ACTIVE",
    addInInvoice: true,
    dontAddInInvoice: false,
    dontCalculateCharge: false,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  // Load existing AWB status if editing
  useEffect(() => {
    if (!editId) return;
    let mounted = true;
    api
      .getMasterItem<AwbStatusEntry>("/awb-statuses", editId)
      .then((found) => {
        if (mounted && found) setForm(found);
      })
      .catch(() => {
        if (typeof window !== "undefined") {
          const stored = localStorage.getItem("master_awb_statuses");
          if (stored) {
            try {
              const list: AwbStatusEntry[] = JSON.parse(stored);
              const found = list.find((item) => String(item.id) === String(editId));
              if (found && mounted) {
                setForm(found);
              }
            } catch (e) {
              console.error("Error loading AWB status:", e);
            }
          }
        }
      });
    return () => {
      mounted = false;
    };
  }, [editId]);

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!form.name.trim()) errs.name = "Status name is required.";
    if (!form.code.trim()) errs.code = "Status code is required.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validate()) {
      showToast({
        message: "Please fill in all required fields.",
        variant: "error",
      });
      return;
    }

    setLoading(true);

    try {
      let savedRecord = form;
      try {
        if (isEdit && editId) {
          savedRecord = await api.updateMasterItem<AwbStatusEntry>("/awb-statuses", editId, form);
        } else {
          savedRecord = await api.createMasterItem<AwbStatusEntry>("/awb-statuses", form);
        }
      } catch (apiErr) {
        console.warn("API save fallback to local:", apiErr);
      }

      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("master_awb_statuses");
        let list: AwbStatusEntry[] = stored
          ? JSON.parse(stored)
          : initialAwbStatusData;

        if (isEdit) {
          list = list.map((item) => (String(item.id) === String(editId) ? savedRecord : item));
        } else {
          list = [savedRecord, ...list];
        }

        localStorage.setItem("master_awb_statuses", JSON.stringify(list));
      }

      invalidateMasterDataCache();

      showToast({
        message: `AWB Status "${form.name}" ${isEdit ? "updated" : "created"} successfully!`,
        variant: "success",
      });

      router.push("/master/awb-status");
    } catch (err) {
      console.error("Failed to save AWB status:", err);
      showToast({
        message: "Failed to save AWB status. Please try again.",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full h-full min-h-0 overflow-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="relative bg-white p-4 rounded-lg border border-gray-200 w-full flex-1 flex flex-col min-h-0 shadow-sm overflow-hidden">
        {/* Form Container with scrollbar */}
        <div className="flex-1 min-h-0 overflow-y-auto space-y-4 pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            {/* Panel Header */}
            <PanelHeader
              title="AWB status information"
              right={
                isEdit ? (
                  <span className="text-[11px] font-semibold tracking-wider bg-white/20 text-white px-2.5 py-0.5 rounded">
                    EDIT MODE
                  </span>
                ) : undefined
              }
            />

            {/* Panel Body */}
            <div className="p-4 sm:p-6 space-y-6">
              {/* Row 1: Name and Code */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* NAME */}
                <div>
                  <FieldLabel required>Name</FieldLabel>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => {
                      setForm((prev) => ({ ...prev, name: e.target.value.toUpperCase() }));
                      if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                    }}
                    placeholder="Enter status name (e.g. DELIVERED, IN TRANSIT)"
                    className={inputClass}
                  />
                  <FieldError message={errors.name} />
                </div>

                {/* CODE */}
                <div>
                  <FieldLabel required>Code</FieldLabel>
                  <input
                    type="text"
                    value={form.code}
                    onChange={(e) => {
                      setForm((prev) => ({ ...prev, code: e.target.value.toUpperCase() }));
                      if (errors.code) setErrors((prev) => ({ ...prev, code: "" }));
                    }}
                    placeholder="Enter status code (e.g. DLV, OFD)"
                    className={inputClass}
                  />
                  <FieldError message={errors.code} />
                </div>
              </div>

              {/* Row 2: Status Radios */}
              <div className="pt-2">
                <FieldLabel>Status</FieldLabel>
                <div className="flex items-center gap-6 mt-2">
                  <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={form.status === "ACTIVE"}
                      onChange={() => setForm((prev) => ({ ...prev, status: "ACTIVE" }))}
                      className="h-4 w-4 text-axc-navy focus:ring-axc-navy"
                    />
                    ACTIVE
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={form.status === "INACTIVE"}
                      onChange={() => setForm((prev) => ({ ...prev, status: "INACTIVE" }))}
                      className="h-4 w-4 text-axc-navy focus:ring-axc-navy"
                    />
                    INACTIVE
                  </label>
                </div>
              </div>

              {/* Row 3: Invoice & Charge Checkboxes */}
              <div className="pt-2 border-t border-gray-100">
                <FieldLabel>Invoice & Charge Rules</FieldLabel>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
                  {/* ADD IN INVOICE */}
                  <label className="flex items-center gap-2.5 p-3 rounded-lg border border-gray-200 hover:border-axc-navy/40 transition-colors bg-gray-50/50 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={form.addInInvoice}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setForm((prev) => ({
                          ...prev,
                          addInInvoice: checked,
                          dontAddInInvoice: checked ? false : prev.dontAddInInvoice,
                        }));
                      }}
                      className="h-4 w-4 rounded accent-axc-navy cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-gray-800">
                      ADD IN INVOICE
                    </span>
                  </label>

                  {/* DON'T ADD IN INVOICE */}
                  <label className="flex items-center gap-2.5 p-3 rounded-lg border border-gray-200 hover:border-axc-navy/40 transition-colors bg-gray-50/50 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={form.dontAddInInvoice}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setForm((prev) => ({
                          ...prev,
                          dontAddInInvoice: checked,
                          addInInvoice: checked ? false : prev.addInInvoice,
                        }));
                      }}
                      className="h-4 w-4 rounded accent-axc-navy cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-gray-800">
                      DON'T ADD IN INVOICE
                    </span>
                  </label>

                  {/* DON'T CALCULATE CHARGE */}
                  <label className="flex items-center gap-2.5 p-3 rounded-lg border border-gray-200 hover:border-axc-navy/40 transition-colors bg-gray-50/50 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={form.dontCalculateCharge}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          dontCalculateCharge: e.target.checked,
                        }))
                      }
                      className="h-4 w-4 rounded accent-axc-navy cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-gray-800">
                      DON'T CALCULATE CHARGE
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════ BOTTOM ACTION BUTTONS (EXACT AWB DESIGN) ═══════════ */}
        <div className="shrink-0 flex items-center justify-end gap-2 pt-4    bg-white">
          <button
            type="button"
            onClick={() => router.push("/master/awb-status")}
            className="px-5 py-4 border border-axc-border bg-white text-axc-dark-gray rounded-lg text-xs font-semibold hover:bg-gray-50 transition cursor-pointer"
          >
            
            Cancel
          </button>

          <button
            type="button"
            onClick={() => handleSubmit()}
            disabled={loading}
            className="px-5 py-4 bg-axc-navy cursor-pointer text-white rounded-lg text-regular-small transition shadow-sm"
          >
            
            {loading ? "Saving..." : isEdit ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CreateAwbStatusPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-full p-8 text-sm text-gray-500">
          Loading AWB Status Form...
        </div>
      }
    >
      <CreateAwbStatusContent />
    </Suspense>
  );
}
