"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Receipt, RotateCcw } from "lucide-react";
import CreditDebitInformation from "./components/creditdebitinformation";
import CreditDebitItemsTable from "./components/creditdebittable";
import { useCreditDebitForm, defaultFormData } from "./components/useCreditDebitForm";

function CreditDebitNoteFormContent() {
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const {
    form,
    updateField,
    toggleEdit,
    updateNoteItem,
    addNoteItem,
    removeNoteItem,
    handleCsvUploaded,
    handleDownloadSampleCsv,
    isEditMode,
    isSubmitting,
    handleSubmit,
    router,
  } = useCreditDebitForm(editId);

  return (
    <div className="flex flex-col gap-4 w-full h-full min-h-0 overflow-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="relative bg-white p-4 rounded-lg border border-gray-200 w-full flex-1 min-h-0 flex flex-col overflow-hidden">
        {/* Top Header matching AWB style */}
        

        {/* Scrollable Form Body */}
        <div className="flex-1 min-h-0 overflow-y-auto pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="flex flex-col gap-5 w-full"
          >
            {/* Credit / Debit Note Information with CSV Upload */}
            <CreditDebitInformation
              form={form}
              updateField={updateField}
              toggleEdit={toggleEdit}
              onCsvUploaded={handleCsvUploaded}
              onDownloadSampleCsv={handleDownloadSampleCsv}
            />

            {/* Credit / Debit Items Table (AWB Design with exact screenshot headers) */}
            <CreditDebitItemsTable
              items={form.noteItems || []}
              onUpdateItem={updateNoteItem}
              onAddItem={addNoteItem}
              onRemoveItem={removeNoteItem}
              grandTotal={form.grandTotal}
              roundOff={form.roundOff}
            />

            {/* Bottom Action Buttons matching AWB forms */}
            <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
             
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => router.push("/accounts")}
                  className="px-5 py-4 border border-axc-border bg-white text-axc-dark-gray rounded-lg text-xs font-semibold hover:bg-gray-50 transition cursor-pointer"
                >
                  Cancel
                </button>

                

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-axc-navy text-white text-regular-small px-5 py-4 rounded-lg cursor-pointer transition  "
                >
                  {isSubmitting ? "Saving..." : isEditMode ? "Update Note" : "Save Note"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function CreditDebitNotePage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-gray-500 animate-pulse">
          Loading Credit / Debit Note Form...
        </div>
      }
    >
      <CreditDebitNoteFormContent />
    </Suspense>
  );
}
