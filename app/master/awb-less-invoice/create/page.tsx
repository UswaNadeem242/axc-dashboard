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
  AwbLessInvoiceEntry,
  initialAwbLessInvoiceData,
} from "../types";

function CreateAwbLessInvoiceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const isEdit = Boolean(editId);

  const [form, setForm] = useState<AwbLessInvoiceEntry>({
    id: `awb_less_${Date.now()}`,
    name: "",
    sac: "",
    status: "ACTIVE",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  // Load existing item if editing
  useEffect(() => {
    if (!editId) return;
    let mounted = true;
    api
      .getMasterItem<AwbLessInvoiceEntry>("/docket-less-invoice-items", editId)
      .then((found) => {
        if (mounted && found) setForm(found);
      })
      .catch(() => {
        if (typeof window !== "undefined") {
          const stored = localStorage.getItem("master_awb_less_invoices");
          if (stored) {
            try {
              const list: AwbLessInvoiceEntry[] = JSON.parse(stored);
              const found = list.find((item) => String(item.id) === String(editId));
              if (found && mounted) {
                setForm(found);
              }
            } catch (e) {
              console.error("Error loading item:", e);
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
    if (!form.name.trim()) errs.name = "Item name is required.";
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
          savedRecord = await api.updateMasterItem<AwbLessInvoiceEntry>("/docket-less-invoice-items", editId, form);
        } else {
          savedRecord = await api.createMasterItem<AwbLessInvoiceEntry>("/docket-less-invoice-items", form);
        }
      } catch (apiErr) {
        console.warn("API save fallback to local:", apiErr);
      }

      const stored = localStorage.getItem("master_awb_less_invoices");
      let list: AwbLessInvoiceEntry[] = stored
        ? JSON.parse(stored)
        : initialAwbLessInvoiceData;

      if (editId) {
        list = list.map((item) => (String(item.id) === String(editId) ? savedRecord : item));
        showToast({
          message: `Item ${form.name} updated successfully.`,
          variant: "success",
        });
      } else {
        list = [savedRecord, ...list];
        showToast({
          message: `Item ${form.name} created successfully.`,
          variant: "success",
        });
      }

      localStorage.setItem("master_awb_less_invoices", JSON.stringify(list));
      router.push("/master/awb-less-invoice");
    } catch (err) {
      console.error(err);
      showToast({
        message: "Failed to save item. Please try again.",
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
            {/* ══════════════ ITEM INFORMATION CARD ══════════════ */}
            <div className="bg-white rounded-lg border border-axc-border shadow-sm flex flex-col w-full">
              <PanelHeader title="AWB less invoice item" />

              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-x-4 gap-y-3.5">
                {/* ROW 1: NAME, SAC */}
                <div className="flex flex-col gap-1 sm:col-span-1">
                  <FieldLabel required>Name</FieldLabel>
                  <input
                    type="text"
                    placeholder="e.g. FREIGHT CHARGES"
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
                  <FieldLabel>SAC Code</FieldLabel>
                  <input
                    type="text"
                    placeholder="e.g. 996511"
                    value={form.sac}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        sac: e.target.value,
                      }))
                    }
                    className={`${inputClass} font-mono`}
                  />
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
                onClick={() => router.push("/master/awb-less-invoice")}
                className="px-5 py-4 border border-axc-border bg-white text-axc-dark-gray rounded-lg text-xs font-semibold hover:bg-gray-50 transition cursor-pointer"
              >
                
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-5 py-4 bg-axc-navy cursor-pointer text-white rounded-lg text-regular-small transition shadow-sm"
              >
               
                {loading ? "Saving..." : isEdit ? "Update Item" : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function CreateAwbLessInvoicePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64 text-sm text-axc-gray">
          Loading AWB Less Invoice form...
        </div>
      }
    >
      <CreateAwbLessInvoiceContent />
    </Suspense>
  );
}

