"use client";
import { useEffect, useMemo, useState } from "react";
import {
  AwbFormState,
  ChargeKey,
  InvoiceRemarksFormState,
  PaymentDetailsFormState,
  RefundDetailsFormState,
  SalesBillingCharges,
  SalesBillingFormState,
  emptyCharge,
} from "./formstate";
import { api } from "@/app/src/lib/api";
import { useMasterData, calculateContractRateLocal } from "@/app/src/lib/useMasterData";
import { showToast } from "@/app/src/common/toast";

const chargeKeys: ChargeKey[] = [
  "additionalHandling", "additionalHandlingCharge", "addressCorrectionFees", "ahsWeight",
  "brandCharges", "collectionCharges", "dasCharges", "ddpCadCharges",
  "deliveryAreaSurcharge", "deliveryAreaSurchargeExtended", "dropOffCharges", "eForm",
  "extraCharges", "oversized", "peakSurcharge", "pickupCharges",
  "remoteArea", "remoteAreaSurcharge", "residentialSurcharge", "residentialSurchargeManual",
];

const emptyCharges = chargeKeys.reduce((acc, key) => {
  acc[key] = emptyCharge();
  return acc;
}, {} as SalesBillingCharges);



const emptyBillingForm: SalesBillingFormState = {
  salesCurrency: "USD",
  vatType: "GST",
  vatApplicable: false,
  editVat: false,

  freight: "0",
  editFreightAmount: false,
  freightPerKg: "",
  searchCharge: "",

  charges: emptyCharges,

  totalOtherCharges: "0",
  adjustmentAmount: "",

  fscPercent: "",
  editFscPercent: false,
  fsc: "0",
  editFsc: false,

  discountPercent: "",
  discountAmount: "",
  totalDiscount: "0",

  freightAfterDiscount: "0",
  subtotal: "0",
  nonTaxableAmount: "0",
  taxableAmount: "0",
  vatPercent: "0.00",
  vat: "0",
  cgst: "0",
  sgst: "0",
  grandTotal: "0",
  editTotal: false,
};

const emptyPayment: PaymentDetailsFormState = {
  paidAmount: "0.00",
  balanceAmount: "0.00",
  invoiceDate: "",
  invoiceNumber: "",
  invoiceRemarks: "",
  pastInvoiceNo: "",
  creditDebitNote: "",
};

const emptyRemarks: InvoiceRemarksFormState = {
  invoiceRemarks1: "",
  invoiceRemarks2: "",
  invoiceRemarks3: "",
  invoiceRemarks4: "",
};

const emptyRefund: RefundDetailsFormState = {
  refundAmount: "",
  refundDate: "",
  refundReason: "",
  refundRemarks: "",
};

const toNumber = (v: string) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : 0;
};

export function useSalesBilling(form?: AwbFormState) {
  const { customerContracts, rateModifiers } = useMasterData();
  const [billing, setBilling] = useState<SalesBillingFormState>(emptyBillingForm);
  const [payment, setPayment] = useState<PaymentDetailsFormState>(emptyPayment);
  const [remarks, setRemarks] = useState<InvoiceRemarksFormState>(emptyRemarks);
  const [refund, setRefund] = useState<RefundDetailsFormState>(emptyRefund);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Load saved salesBilling from backend or localStorage when editing an AWB
  useEffect(() => {
    const awbNo = form?.awbNumber?.trim();
    if (!awbNo) return;
    let mounted = true;
    (async () => {
      try {
        const res = await api.getAwb(awbNo);
        const sb = res?.data?.salesBilling;
        if (sb && mounted) {
          setBilling((prev) => ({
            ...prev,
            ...sb,
            charges: { ...prev.charges, ...(sb.charges || {}) },
          }));
          return;
        }
      } catch {
        // fallback to localStorage
      }
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem(`awb_sales_billing_${awbNo}`);
        if (stored && mounted) {
          try {
            const parsed = JSON.parse(stored);
            setBilling((prev) => ({ ...prev, ...parsed }));
          } catch {}
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, [form?.awbNumber]);

  // Auto-calculate freight & FSC from matched Customer Contract & Rate Modifiers when customer/service/weight changes
  useEffect(() => {
    if (!form) return;
    const cust = form.customer?.trim().toUpperCase();
    const srv = form.service?.trim().toUpperCase();
    const wt = parseFloat(form.chargeableWeight || form.actualWeight || "0");
    if ((!cust && !srv) || wt <= 0) return;

    const matchedCC =
      customerContracts.find((c: any) => {
        const cCode = String(c.customer_code || c.customerCode || c.customer_name || c.customerName || "").toUpperCase();
        const sCode = String(c.service_code || c.serviceCode || c.service_name || c.serviceName || "").toUpperCase();
        return (!cust || cCode.includes(cust)) && (!srv || !sCode || sCode.includes(srv));
      }) || customerContracts[0];

    if (matchedCC) {
      const rateRes = calculateContractRateLocal(matchedCC, wt, Number(form.pcs || 1));
      setBilling((prev) => {
        if (prev.editFreightAmount) return prev;
        const nextFreight = rateRes.finalFreight > 0 ? String(rateRes.finalFreight) : prev.freight;
        const nextPerKg = rateRes.freightPerKg > 0 ? String(rateRes.freightPerKg) : prev.freightPerKg;
        const fscPct = parseFloat(prev.fscPercent || "0");
        const nextFsc = !prev.editFsc && fscPct > 0 ? (( parseFloat(nextFreight) * fscPct ) / 100).toFixed(2) : prev.fsc;
        return {
          ...prev,
          freight: nextFreight,
          freightPerKg: nextPerKg,
          fsc: nextFsc,
        };
      });
    }
  }, [form?.customer, form?.service, form?.chargeableWeight, form?.actualWeight, form?.pcs, customerContracts, rateModifiers]);

  const toggleCharge = (key: ChargeKey) => {
    setBilling((prev) => ({
      ...prev,
      charges: { ...prev.charges, [key]: { ...prev.charges[key], checked: !prev.charges[key].checked } },
    }));
  };

  const updateCharge = (key: ChargeKey, field: "value" | "amount", val: string) => {
    setBilling((prev) => ({
      ...prev,
      charges: { ...prev.charges, [key]: { ...prev.charges[key], [field]: val } },
    }));
  };

  const totals = useMemo(() => {
    let otherCharges = chargeKeys.reduce((sum, key) => {
      const line = billing.charges[key];
      return sum + (line.checked ? toNumber(line.amount) : toNumber(line.value));
    }, 0);

    if (billing.dynamicCharges) {
      otherCharges += Object.values(billing.dynamicCharges).reduce((sum, line) => {
        return sum + (line.checked ? toNumber(line.amount) : toNumber(line.value));
      }, 0);
    }

    const freight = toNumber(billing.freight);
    const discountAmount =
      billing.discountAmount !== ""
        ? toNumber(billing.discountAmount)
        : (freight * toNumber(billing.discountPercent)) / 100;
    const freightAfterDiscount = freight - discountAmount;
    const subtotal = freightAfterDiscount + otherCharges + toNumber(billing.fsc) + toNumber(billing.adjustmentAmount || "0");
    const taxableAmount = billing.vatApplicable ? subtotal : 0;
    const nonTaxableAmount = billing.vatApplicable ? 0 : subtotal;
    const vatPercent = toNumber(billing.vatPercent);
    const vat = billing.vatApplicable ? (taxableAmount * vatPercent) / 100 : 0;
    const cgst = billing.vatApplicable ? (taxableAmount * vatPercent) / 200 : 0;
    const sgst = billing.vatApplicable ? (taxableAmount * vatPercent) / 200 : 0;
    const grandTotal = subtotal + vat;

    return {
      totalOtherCharges: otherCharges.toFixed(2),
      totalDiscount: discountAmount.toFixed(2),
      freightAfterDiscount: freightAfterDiscount.toFixed(2),
      subtotal: subtotal.toFixed(2),
      taxableAmount: taxableAmount.toFixed(2),
      nonTaxableAmount: nonTaxableAmount.toFixed(2),
      vat: vat.toFixed(2),
      cgst: cgst.toFixed(2),
      sgst: sgst.toFixed(2),
      grandTotal: grandTotal.toFixed(2),
    };
  }, [billing]);

  const handleSaveBilling = async () => {
    setSaving(true);
    const updatedBilling = { ...billing, ...totals };
    setBilling(updatedBilling);

    const awbNo = form?.awbNumber?.trim();
    if (awbNo) {
      try {
        await api.updateAwb(awbNo, { salesBilling: updatedBilling });
      } catch (err) {
        console.warn("API save salesBilling fallback:", err);
      }
      if (typeof window !== "undefined") {
        localStorage.setItem(`awb_sales_billing_${awbNo}`, JSON.stringify(updatedBilling));
      }
    }

    setSaving(false);
    setSaved(true);
    showToast({ variant: "success", message: "Sales billing saved successfully!" });
    setTimeout(() => setSaved(false), 2000);
  };

  return {
    billing, setBilling, payment, setPayment, remarks, setRemarks, refund, setRefund,
    toggleCharge, updateCharge, totals, saving, saved, handleSaveBilling, chargeKeys,
  };
}