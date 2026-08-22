"use client";
import React from "react";
import { usePurchaseBilling } from "./userpurchasebilling";
import { PurchaseBillingPanel } from "./purchasebilling";
import { VendorDetailsPanel } from "./vendordetails";
import { VendorInvoicePanel } from "./vendorinvoice";
import {
  PurchaseBillingFormState, VendorDetailsFormState, VendorInvoiceFormState,
} from "./formstate";

export function AwbPurchaseBillingTab() {
  const {
    billing, setBilling,
    vendorDetails, setVendorDetails,
    vendorInvoice, setVendorInvoice,
    toggleCharge, updateCharge,
    addWeightRow, removeWeightRow, updateWeightRow,
    totals,
    saving, saved, handleSavePurchaseBilling,
  } = usePurchaseBilling();

  return (
    <div className="flex flex-col gap-6 w-full pb-2">
      <div className="flex flex-col xl:flex-row gap-6 items-start w-full">
        <div className="flex flex-col gap-6 w-full xl:w-[360px] xl:shrink-0 xl:sticky xl:top-6 xl:self-start">
          <VendorInvoicePanel
            vendorInvoice={vendorInvoice}
            onChange={(patch: Partial<VendorInvoiceFormState>) =>
              setVendorInvoice((prev: VendorInvoiceFormState) => ({ ...prev, ...patch }))
            }
          />
        </div>

        <div className="flex-1 w-full">
          <div className="flex flex-col gap-6 w-full pb-2">
            <PurchaseBillingPanel
              billing={billing}
              toggleCharge={toggleCharge}
              updateCharge={updateCharge}
              onChange={(patch: Partial<PurchaseBillingFormState>) =>
                setBilling((prev: PurchaseBillingFormState) => ({ ...prev, ...patch }))
              }
              totals={totals}
            />

            <VendorDetailsPanel
              vendorDetails={vendorDetails}
              onChange={(patch: Partial<VendorDetailsFormState>) =>
                setVendorDetails((prev: VendorDetailsFormState) => ({ ...prev, ...patch }))
              }
              onWeightRowChange={updateWeightRow}
              onAddWeightRow={addWeightRow}
              onRemoveWeightRow={removeWeightRow}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 bg-white p-4 rounded-2xl border border-axc-border shadow-sm">
        <button
          type="button"
          onClick={handleSavePurchaseBilling}
          disabled={saving}
          className="px-5 py-2 bg-axc-navy hover:bg-axc-navy/80 text-white rounded-lg text-xs font-bold transition shadow-sm disabled:opacity-60"
        >
          {saving ? "SAVING..." : saved ? "SAVED" : "SAVE BILLING"}
        </button>
      </div>
    </div>
  );
}