"use client";
import { useMemo, useState } from "react";
import {
  PurchaseBillingFormState, PurchaseChargeKey,
  VendorDetailsFormState, VendorInvoiceFormState, VendorWeightRow,
  defaultPurchaseBilling, defaultVendorDetails, defaultVendorInvoice, defaultVendorWeightRow,
} from "./formstate";

function toNum(v: string) {
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
}

export function usePurchaseBilling() {
  const [billing, setBilling] = useState<PurchaseBillingFormState>(defaultPurchaseBilling());
  const [vendorDetails, setVendorDetails] = useState<VendorDetailsFormState>(defaultVendorDetails());
  const [vendorInvoice, setVendorInvoice] = useState<VendorInvoiceFormState>(defaultVendorInvoice());
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const toggleCharge = (key: PurchaseChargeKey) => {
    setBilling((prev) => ({
      ...prev,
      charges: {
        ...prev.charges,
        [key]: { ...prev.charges[key], checked: !prev.charges[key].checked },
      },
    }));
  };

  const updateCharge = (key: PurchaseChargeKey, field: "value" | "amount", val: string) => {
    setBilling((prev) => ({
      ...prev,
      charges: {
        ...prev.charges,
        [key]: { ...prev.charges[key], [field]: val },
      },
    }));
  };

  const addWeightRow = () => {
    const row = defaultVendorWeightRow();
    setVendorDetails((prev) => ({ ...prev, weightRows: [...prev.weightRows, row] }));
  };

  const removeWeightRow = (id: string) => {
    setVendorDetails((prev) => ({ ...prev, weightRows: prev.weightRows.filter((r) => r.id !== id) }));
  };

  const updateWeightRow = (id: string, field: keyof Omit<VendorWeightRow, "id">, val: string) => {
    setVendorDetails((prev) => ({
      ...prev,
      weightRows: prev.weightRows.map((r) => (r.id === id ? { ...r, [field]: val } : r)),
    }));
  };

  const totals = useMemo(() => {
    const totalOtherCharges = Object.values(billing.charges)
      .filter((c) => c.checked)
      .reduce((sum, c) => sum + toNum(c.amount), 0);

    const freight = toNum(billing.freight);
    const fsc = toNum(billing.fsc);
    const adjustment = toNum(billing.adjustmentAmount);

    const discountAmount = toNum(billing.discountAmount);
    const discountPercent = toNum(billing.discountPercent);
    const totalDiscount = discountAmount + (freight * discountPercent) / 100;

    const freightAfterDiscount = Math.max(freight - totalDiscount, 0);
    const subtotal = freightAfterDiscount + totalOtherCharges + fsc + adjustment;

    const nonTaxableAmount = 0;
    const taxableAmount = subtotal - nonTaxableAmount;

    const vatPercent = toNum(billing.vatPercent);
    const cgst = toNum(billing.cgst) || (taxableAmount * vatPercent) / 200;
    const sgst = toNum(billing.sgst) || (taxableAmount * vatPercent) / 200;

    const grandTotal = subtotal + cgst + sgst;

    return {
      totalOtherCharges: totalOtherCharges.toFixed(2),
      totalDiscount: totalDiscount.toFixed(2),
      freightAfterDiscount: freightAfterDiscount.toFixed(2),
      subtotal: subtotal.toFixed(2),
      taxableAmount: taxableAmount.toFixed(2),
      nonTaxableAmount: nonTaxableAmount.toFixed(2),
      cgst: cgst.toFixed(2),
      sgst: sgst.toFixed(2),
      grandTotal: grandTotal.toFixed(2),
    };
  }, [billing]);

  const handleSavePurchaseBilling = async () => {
    setSaving(true);
    try {
      await new Promise((res) => setTimeout(res, 600));
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    } finally {
      setSaving(false);
    }
  };

  return {
    billing, setBilling,
    vendorDetails, setVendorDetails,
    vendorInvoice, setVendorInvoice,
    toggleCharge, updateCharge,
    addWeightRow, removeWeightRow, updateWeightRow,
    totals,
    saving, saved, handleSavePurchaseBilling,
  };
}