"use client";
import React from "react";
import AirWaybillInformation from "./airwaybillinformation";
import { AwbFormErrors, AwbFormState } from "./formstate";
import { useSalesBilling } from "./salesbilling";
import { SalesBillingPanel } from "./billing";
import { AwbWeightSummary } from "./weightsummary";
import { PaymentDetailsPanel } from "./paymentdetail";
import { InvoiceRemarksPanel, RefundDetailsPanel } from "./invoiceremarks";
import {
  PaymentDetailsFormState,
  InvoiceRemarksFormState,
  RefundDetailsFormState,
  SalesBillingFormState,
} from "./formstate";

export function AwbSalesBillingTab({
  form,
  setForm,
  errors,
}: {
  form: AwbFormState;
  setForm: React.Dispatch<React.SetStateAction<AwbFormState>>;
  errors: AwbFormErrors;
}) {
  const {
    billing, payment, remarks, refund,
    toggleCharge, updateCharge, totals,
    setBilling, setPayment, setRemarks, setRefund,
    saving, saved, handleSaveBilling,
  } = useSalesBilling();

  return (
    <div className="flex flex-col gap-6 w-full pb-2">
      <div className="flex flex-col xl:flex-row gap-6 items-start w-full">
        <div className="flex flex-col gap-6 w-full xl:w-[360px] xl:shrink-0 xl:sticky xl:top-6 xl:self-start">
          <AwbWeightSummary form={form} />
          <PaymentDetailsPanel
            payment={payment}
            onChange={(patch: Partial<PaymentDetailsFormState>) =>
              setPayment((prev: PaymentDetailsFormState) => ({ ...prev, ...patch }))
            }
          />
        </div>

        <div className="flex-1 w-full">
          <div className="flex flex-col gap-6 w-full pb-2">
            <AirWaybillInformation form={form} setForm={setForm} errors={errors} />

            <InvoiceRemarksPanel
              remarks={remarks}
              onChange={(patch: Partial<InvoiceRemarksFormState>) =>
                setRemarks((prev: InvoiceRemarksFormState) => ({ ...prev, ...patch }))
              }
            />

            <SalesBillingPanel
              billing={billing}
              toggleCharge={toggleCharge}
              updateCharge={updateCharge}
              onChange={(patch: Partial<SalesBillingFormState>) =>
                setBilling((prev: SalesBillingFormState) => ({ ...prev, ...patch }))
              }
              totals={totals}
            />

            <RefundDetailsPanel
              refund={refund}
              onChange={(patch: Partial<RefundDetailsFormState>) =>
                setRefund((prev: RefundDetailsFormState) => ({ ...prev, ...patch }))
              }
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 bg-white p-4 rounded-2xl border border-axc-border shadow-sm">
        <button
          type="button"
          onClick={handleSaveBilling}
          disabled={saving}
          className="px-5 py-2 bg-axc-navy hover:bg-axc-navy/80 text-white rounded-lg text-xs font-bold transition shadow-sm disabled:opacity-60"
        >
          {saving ? "SAVING..." : saved ? "SAVED" : "SAVE BILLING"}
        </button>
      </div>
    </div>
  );
}