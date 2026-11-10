"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Save, Coins } from "lucide-react";
import { showToast } from "@/app/src/common/toast";
import { api } from "@/app/src/lib/api";
import { PanelHeader } from "@/app/create-entries/components/form";
import { CurrencyEntry, initialCurrencyData } from "../types";

function CreateCurrencyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const isEdit = Boolean(editId);

  const [form, setForm] = useState({
    name: "",
    code: "",
    symbol: "",
    exchangeRate: "1.00",
    fractionalUnit: "",
    srNo: "1",
    status: "ACTIVE" as "ACTIVE" | "INACTIVE",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Load existing records or auto-generate next SR NO
  useEffect(() => {
    if (typeof window === "undefined") return;
    let mounted = true;
    const stored = localStorage.getItem("master_currencies");
    const list: CurrencyEntry[] = stored
      ? JSON.parse(stored)
      : initialCurrencyData;

    if (editId) {
      api
        .getMasterItem<CurrencyEntry>("/currencies", editId)
        .then((found) => {
          if (mounted && found) {
            setForm({
              name: found.name || "",
              code: found.code || "",
              symbol: found.symbol || "",
              exchangeRate: String(found.exchangeRate ?? "1.00"),
              fractionalUnit: found.fractionalUnit || "",
              srNo: String(found.srNo || 1),
              status: found.status || "ACTIVE",
            });
          }
        })
        .catch(() => {
          const found = list.find((c) => String(c.id) === String(editId) || c.code === editId);
          if (found && mounted) {
            setForm({
              name: found.name,
              code: found.code,
              symbol: found.symbol || "",
              exchangeRate: String(found.exchangeRate ?? "1.00"),
              fractionalUnit: found.fractionalUnit || "",
              srNo: String(found.srNo),
              status: found.status,
            });
          }
        });
      return () => {
        mounted = false;
      };
    }

    const maxSr = list.reduce((max, c) => (c.srNo > max ? c.srNo : max), 0);
    setForm((prev) => ({ ...prev, srNo: String(maxSr + 1) }));
    return () => {
      mounted = false;
    };
  }, [editId]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Name is required.";
    if (!form.code.trim()) errs.code = "Code is required.";
    if (form.srNo && isNaN(Number(form.srNo))) {
      errs.srNo = "SR NO must be a valid number.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      showToast({
        variant: "error",
        message: "Please fill in all required fields.",
      });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: form.name.trim().toUpperCase(),
        code: form.code.trim().toUpperCase(),
        symbol: form.symbol.trim(),
        exchangeRate: Number(form.exchangeRate) || 1,
        fractionalUnit: form.fractionalUnit.trim().toUpperCase(),
        srNo: Number(form.srNo) || 1,
        status: form.status,
      };

      let savedRecord: any = null;
      try {
        if (isEdit && editId) {
          savedRecord = await api.updateMasterItem("/currencies", editId, payload);
        } else {
          savedRecord = await api.createMasterItem("/currencies", payload);
        }
      } catch (apiErr) {
        console.warn("API save fallback to local:", apiErr);
      }

      const stored = localStorage.getItem("master_currencies");
      const currentList: CurrencyEntry[] = stored
        ? JSON.parse(stored)
        : [...initialCurrencyData];

      if (isEdit) {
        const updatedList = currentList.map((item) => {
          if (String(item.id) === String(editId) || item.code === editId) {
            return savedRecord || {
              ...item,
              ...payload,
            };
          }
          return item;
        });

        localStorage.setItem("master_currencies", JSON.stringify(updatedList));
        showToast({
          variant: "success",
          message: `Currency "${form.code.toUpperCase()}" updated successfully!`,
        });
      } else {
        const now = new Date();
        const formattedDate = `${now.getDate().toString().padStart(2, "0")}/${(
          now.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}/${now.getFullYear()} ${now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}`;

        const newCurrency: CurrencyEntry = savedRecord || {
          id: `CURR-${Date.now().toString().slice(-4)}`,
          srNo: Number(form.srNo) || currentList.length + 1,
          name: form.name.trim().toUpperCase(),
          code: form.code.trim().toUpperCase(),
          symbol: form.symbol.trim(),
          exchangeRate: Number(form.exchangeRate) || 1,
          fractionalUnit: form.fractionalUnit.trim().toUpperCase(),
          status: form.status,
          createdAt: formattedDate,
        };

        const updatedList = [...currentList, newCurrency];
        localStorage.setItem("master_currencies", JSON.stringify(updatedList));
        showToast({
          variant: "success",
          message: `Currency "${newCurrency.code}" created successfully!`,
        });
      }

      setTimeout(() => {
        router.push("/master/currency");
      }, 400);
    } catch (err) {
      console.error("Failed to save currency:", err);
      showToast({
        variant: "error",
        message: "Failed to save currency. Please try again.",
      });
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full h-full min-h-0 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden p-1">
      {/* ── Main Form Card with AWB Styling ── */}
      <div className="relative bg-white p-4 rounded-lg border border-gray-200 w-full flex-1 min-h-0 flex flex-col overflow-hidden">
        <div className="bg-white rounded-lg border border-axc-border shadow-sm flex flex-col overflow-hidden">
          {/* Panel Header */}
          <PanelHeader
            title={isEdit ? "Edit Currency" : "Add Currency"}
          // right={
          //   <button
          //     type="button"
          //     onClick={() => router.push("/master/currency")}
          //     className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          //   >
          //     <ArrowLeft size={13} />
          //     Back
          //   </button>
          // }
          />

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              {/* 1. NAME * */}
              <div className="flex flex-col gap-1.5">
                <label className="text-axc-dark-gray text-regular-medium">
                  Name <span className="text-axc-red ml-0.5">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Currency Name (e.g. RUPEE)"
                  value={form.name}
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, name: e.target.value }));
                    if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                  }}
                  className={`border rounded-md px-3 py-2.5 outline-none w-full text-regular-small text-axc-dark-gray bg-white  ${errors.name ? "border-red-400 bg-red-50/30" : "border-axc-border"
                    }`}
                />
                {errors.name && (
                  <p className="text-[11px] text-axc-red font-semibold">{errors.name}</p>
                )}
              </div>

              {/* 2. CODE * */}
              <div className="flex flex-col gap-1.5">
                <label className="text-axc-dark-gray text-regular-medium">
                  Code <span className="text-axc-red ml-0.5">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Currency Code (e.g. PKR)"
                  value={form.code}
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, code: e.target.value }));
                    if (errors.code) setErrors((prev) => ({ ...prev, code: "" }));
                  }}
                  className={`border rounded-md px-3 py-2.5 outline-none w-full text-regular-small text-axc-dark-gray bg-white  uppercase ${errors.code ? "border-red-400 bg-red-50/30" : "border-axc-border"
                    }`}
                />
                {errors.code && (
                  <p className="text-[11px] text-axc-red font-semibold">{errors.code}</p>
                )}
              </div>

              {/* 3. CURRENCY FRACTIONAL UNIT */}
              <div className="flex flex-col gap-1.5">
                <label className="text-axc-dark-gray text-regular-medium">
                  Currency Fractional Unit
                </label>
                <input
                  type="text"
                  placeholder="Enter Fractional Unit (e.g. PAISA)"
                  value={form.fractionalUnit}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, fractionalUnit: e.target.value }))
                  }
                  className="border border-axc-border rounded-md px-3 py-2.5 outline-none w-full text-regular-small text-axc-dark-gray bg-white  "
                />
              </div>

              {/* 4. SR NO */}
              <div className="flex flex-col gap-1.5">
                <label className="text-axc-dark-gray text-regular-medium">
                  Sr NO
                </label>
                <input
                  type="number"
                  placeholder="Enter Serial Number"
                  value={form.srNo}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, srNo: e.target.value }))
                  }
                  className="border border-axc-border rounded-md px-3 py-2.5 outline-none w-full text-regular-small text-axc-dark-gray bg-white  "
                />
                {errors.srNo && (
                  <p className="text-[11px] text-axc-red font-semibold">{errors.srNo}</p>
                )}
              </div>

              {/* 5. CURRENCY SYMBOL */}
              <div className="flex flex-col gap-1.5">
                <label className="text-axc-dark-gray text-regular-medium">
                  Symbol
                </label>
                <input
                  type="text"
                  placeholder="Enter Currency Symbol (e.g. $, Rs, £)"
                  value={form.symbol}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, symbol: e.target.value }))
                  }
                  className="border border-axc-border rounded-md px-3 py-2.5 outline-none w-full text-regular-small text-axc-dark-gray bg-white"
                />
              </div>

              {/* 6. EXCHANGE RATE */}
              <div className="flex flex-col gap-1.5">
                <label className="text-axc-dark-gray text-regular-medium">
                  Exchange Rate
                </label>
                <input
                  type="number"
                  step="0.0001"
                  placeholder="Enter Exchange Rate (e.g. 1.00)"
                  value={form.exchangeRate}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, exchangeRate: e.target.value }))
                  }
                  className="border border-axc-border rounded-md px-3 py-2.5 outline-none w-full text-regular-small text-axc-dark-gray bg-white"
                />
              </div>

              {/* 5. STATUS (Radio buttons) */}
              <div className="flex flex-col gap-2 md:col-span-2 pt-2 border-t border-gray-100">
                <label className="text-axc-dark-gray text-regular-medium font-semibold">
                  Status
                </label>
                <div className="flex items-center gap-6 mt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
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
                    <span className="text-xs font-semibold text-axc-dark-gray">
                      Active
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
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
                    <span className="text-xs font-semibold text-axc-dark-gray">
                      InActive
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="flex items-center justify-end gap-3 pt-6    ">
              <button
                type="button"
                onClick={() => router.push("/master/currency")}
                className="px-5 py-4 border border-axc-border bg-white text-axc-dark-gray rounded-lg text-xs font-semibold hover:bg-gray-50 transition cursor-pointer"
              >
                BACK
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-4 bg-axc-navy cursor-pointer text-white rounded-lg text-regular-small transition shadow-sm"
              >
              
                {loading ? "Saving..." : isEdit ? "Update Currency" : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
  );
}

export default function CreateCurrencyPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-gray-500">Loading Currency Form...</div>
      }
    >
      <CreateCurrencyContent />
    </Suspense>
  );
}

