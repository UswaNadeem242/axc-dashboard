"use client";
import React from "react";
import { Loader2, Search as SearchIcon } from "lucide-react";
import { useAwbLessInvoiceForm } from "./invoiceform";
import {
  AwbLessInvoiceDetails,
  AwbLessInvoiceItemsSection,
} from "./awblessinvoicefields";

export function AwbLessInvoiceTab() {
  const {
    form,
    setForm,
    items,
    addItemRow,
    updateItemRow,
    removeItemRow,
    loading,
    toast,
    handleSearch,
    handleCreateInvoice,
  } = useAwbLessInvoiceForm();

  return (
    <div className="flex flex-col gap-4 w-full">
      <AwbLessInvoiceDetails form={form} setForm={setForm} />

      <AwbLessInvoiceItemsSection
        form={form}
        setForm={setForm}
        items={items}
        addItemRow={addItemRow}
        updateItemRow={updateItemRow}
        removeItemRow={removeItemRow}
      />

      <div className="flex items-center justify-end gap-3">
       
        <button
          type="button"
          onClick={handleCreateInvoice}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-md bg-axc-navy text-white text-regular-medium hover:opacity-90 transition disabled:opacity-60 cursor-pointer"
        >
          {loading && <Loader2 size={14} className="animate-spin" />}
          Create Invoice
        </button>
      </div>

      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-md shadow-lg text-white text-regular-small ${
            toast.type === "success"
              ? "bg-emerald-600"
              : toast.type === "error"
                ? "bg-axc-red"
                : "bg-axc-navy"
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}