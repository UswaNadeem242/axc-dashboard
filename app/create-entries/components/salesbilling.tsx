"use client";
import { useMemo, useState } from "react";
import {
  ChargeKey,
  InvoiceRemarksFormState,
  PaymentDetailsFormState,
  RefundDetailsFormState,
  SalesBillingCharges,
  SalesBillingFormState,
  emptyCharge,
} from "./formstate";

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

const defaultChecked: ChargeKey[] = [
  "additionalHandlingCharge", "deliveryAreaSurcharge", "deliveryAreaSurchargeExtended",
  "remoteArea", "remoteAreaSurcharge", "residentialSurcharge",
];
defaultChecked.forEach((k) => (emptyCharges[k] = { ...emptyCharges[k], checked: true, value: "0", amount: "0" }));

const emptyBillingForm: SalesBillingFormState = {
  salesCurrency: "USD",
  vatType: "GST",
  vatApplicable: false,

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

export function useSalesBilling() {
  const [billing, setBilling] = useState<SalesBillingFormState>(emptyBillingForm);
  const [payment, setPayment] = useState<PaymentDetailsFormState>(emptyPayment);
  const [remarks, setRemarks] = useState<InvoiceRemarksFormState>(emptyRemarks);
  const [refund, setRefund] = useState<RefundDetailsFormState>(emptyRefund);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

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
    const otherCharges = chargeKeys.reduce((sum, key) => {
      const line = billing.charges[key];
      return sum + (line.checked ? toNumber(line.amount) : toNumber(line.value));
    }, 0);

    const freight = toNumber(billing.freight);
    const discountAmount =
      billing.discountAmount !== ""
        ? toNumber(billing.discountAmount)
        : (freight * toNumber(billing.discountPercent)) / 100;
    const freightAfterDiscount = freight - discountAmount;
    const subtotal = freightAfterDiscount + otherCharges + toNumber(billing.fsc) + toNumber(billing.adjustmentAmount || "0");
    const taxableAmount = billing.vatApplicable ? subtotal : 0;
    const nonTaxableAmount = billing.vatApplicable ? 0 : subtotal;
    const vat = billing.vatApplicable ? (taxableAmount * toNumber(billing.vatPercent)) / 100 : 0;
    const grandTotal = subtotal + vat;

    return {
      totalOtherCharges: otherCharges.toFixed(2),
      totalDiscount: discountAmount.toFixed(2),
      freightAfterDiscount: freightAfterDiscount.toFixed(2),
      subtotal: subtotal.toFixed(2),
      taxableAmount: taxableAmount.toFixed(2),
      nonTaxableAmount: nonTaxableAmount.toFixed(2),
      vat: vat.toFixed(2),
      grandTotal: grandTotal.toFixed(2),
    };
  }, [billing]);

  const handleSaveBilling = () => {
    setSaving(true);
    setTimeout(() => {
      setBilling((prev) => ({ ...prev, ...totals }));
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 600);
  };

  return {
    billing, setBilling, payment, setPayment, remarks, setRemarks, refund, setRefund,
    toggleCharge, updateCharge, totals, saving, saved, handleSaveBilling, chargeKeys,
  };
}