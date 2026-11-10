"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { showToast } from "@/app/src/common/toast";
import { api } from "@/app/src/lib/api";
import {
  PanelHeader,
  FieldLabel,
  FieldError,
  inputClass,
  errorInputClass,
} from "@/app/create-entries/components/form";
import {
  InvoiceRangeEntry,
  initialInvoiceRangeData,
} from "../types";

function CreateInvoiceRangeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const isEdit = Boolean(editId);

  const [form, setForm] = useState<InvoiceRangeEntry>({
    id: `inv_range_${Date.now()}`,
    name: "",
    code: "",
    prefix: "",
    startNumber: "",
    endNumber: "",
    currentNumber: "",
    suffix: "",
    status: "ACTIVE",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  // Load existing invoice range if editing
  useEffect(() => {
    if (!editId) return;
    let mounted = true;
    api
      .getMasterItem<InvoiceRangeEntry>("/invoice-ranges", editId)
      .then((found) => {
        if (mounted && found) setForm(found);
      })
      .catch(() => {
        if (typeof window !== "undefined") {
          const stored = localStorage.getItem("master_invoice_ranges");
          if (stored) {
            try {
              const list: InvoiceRangeEntry[] = JSON.parse(stored);
              const found = list.find((item) => String(item.id) === String(editId));
              if (found && mounted) {
                setForm(found);
              }
            } catch (e) {
              console.error("Error loading invoice range:", e);
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
    if (!form.name.trim()) errs.name = "Name is required.";
    if (!form.code.trim()) errs.code = "Code is required.";
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
      let savedRecord = form;
      try {
        if (editId) {
          savedRecord = await api.updateMasterItem<InvoiceRangeEntry>("/invoice-ranges", editId, form);
        } else {
          savedRecord = await api.createMasterItem<InvoiceRangeEntry>("/invoice-ranges", form);
        }
      } catch (apiErr) {
        console.warn("API save fallback to local:", apiErr);
      }

      const stored = localStorage.getItem("master_invoice_ranges");
      let list: InvoiceRangeEntry[] = stored
        ? JSON.parse(stored)
        : initialInvoiceRangeData;

      if (editId) {
        list = list.map((item) => (String(item.id) === String(editId) ? savedRecord : item));
        showToast({
          message: `Invoice Range ${form.name} updated successfully.`,
          variant: "success",
        });
      } else {
        list = [savedRecord, ...list];
        showToast({
          message: `Invoice Range ${form.name} created successfully.`,
          variant: "success",
        });
      }

      localStorage.setItem("master_invoice_ranges", JSON.stringify(list));
      router.push("/master/invoice-range");
    } catch (err) {
      console.error(err);
      showToast({
        message: "Failed to save Invoice Range. Please try again.",
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
            {/* ══════════════ INVOICE RANGE INFORMATION CARD ══════════════ */}
            <div className="bg-white rounded-lg border border-axc-border shadow-sm flex flex-col w-full">
              <PanelHeader title="Invoice range information" />

              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-3.5">
                {/* ROW 1: NAME, CODE, PREFIX */}
                <div className="flex flex-col gap-1">
                  <FieldLabel required>Name</FieldLabel>
                  <input
                    type="text"
                    placeholder="e.g. GENERAL INVOICE RANGE 2026"
                    value={form.name}
                    onChange={(e) => {
                      setForm((prev) => ({
                        ...prev,
                        name: e.target.value.toUpperCase(),
                      }));
                      if (errors.name)
                        setErrors((prev) => ({ ...prev, name: "" }));
                    }}
                    className={`${errors.name ? errorInputClass : inputClass
                      } uppercase font-medium`}
                  />
                  <FieldError message={errors.name} />
                </div>

                <div className="flex flex-col gap-1">
                  <FieldLabel required>Code</FieldLabel>
                  <input
                    type="text"
                    placeholder="e.g. INV-GEN-26"
                    value={form.code}
                    onChange={(e) => {
                      setForm((prev) => ({
                        ...prev,
                        code: e.target.value.toUpperCase(),
                      }));
                      if (errors.code)
                        setErrors((prev) => ({ ...prev, code: "" }));
                    }}
                    className={`${errors.code ? errorInputClass : inputClass
                      } uppercase font-medium`}
                  />
                  <FieldError message={errors.code} />
                </div>

                <div className="flex flex-col gap-1">
                  <FieldLabel>Prefix</FieldLabel>
                  <input
                    type="text"
                    placeholder="e.g. INV-"
                    value={form.prefix}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        prefix: e.target.value.toUpperCase(),
                      }))
                    }
                    className={`${inputClass} uppercase font-mono`}
                  />
                </div>

                {/* ROW 2: START NUMBER, END NUMBER, SUFFIX */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Start Number</FieldLabel>
                  <input
                    type="text"
                    placeholder="e.g. 10001"
                    value={form.startNumber}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        startNumber: e.target.value,
                      }))
                    }
                    className={`${inputClass} font-mono`}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <FieldLabel>End Number</FieldLabel>
                  <input
                    type="text"
                    placeholder="e.g. 99999"
                    value={form.endNumber}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        endNumber: e.target.value,
                      }))
                    }
                    className={`${inputClass} font-mono`}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <FieldLabel>Suffix</FieldLabel>
                  <input
                    type="text"
                    placeholder="e.g. /2026 or -DXB"
                    value={form.suffix}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        suffix: e.target.value.toUpperCase(),
                      }))
                    }
                    className={`${inputClass} uppercase font-mono`}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <FieldLabel>Current Number</FieldLabel>
                  <input
                    type="text"
                    placeholder="e.g. 10001 (Optional, defaults to Start Number)"
                    value={form.currentNumber || ""}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        currentNumber: e.target.value,
                      }))
                    }
                    className={`${inputClass} font-mono`}
                  />
                </div>

                {/* ROW 3: STATUS */}
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
                onClick={() => router.push("/master/invoice-range")}
                className="px-5 py-4 border border-axc-border bg-white text-axc-dark-gray rounded-lg text-xs font-semibold hover:bg-gray-50 transition cursor-pointer"
              >

                Cancel              
                 </button>

              <button
                type="submit"
                disabled={loading}
                className="px-5 py-4 bg-axc-navy cursor-pointer text-white rounded-lg text-regular-small transition shadow-sm"
              >
                
                {loading ? "Saving..." : isEdit ? "Update Invoice Range" : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function CreateInvoiceRangePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64 text-sm text-axc-gray">
          Loading Invoice Range form...
        </div>
      }
    >
      <CreateInvoiceRangeContent />
    </Suspense>
  );
}

