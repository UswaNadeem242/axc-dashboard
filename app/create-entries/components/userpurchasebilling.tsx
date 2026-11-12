"use client";
import { useEffect, useMemo, useState } from "react";
import {
  AwbFormState,
  PurchaseBillingFormState, PurchaseChargeKey,
  VendorDetailsFormState, VendorInvoiceFormState, VendorWeightRow,
  defaultPurchaseBilling, defaultVendorDetails, defaultVendorInvoice, defaultVendorWeightRow,
} from "./formstate";
import { api } from "@/app/src/lib/api";
import { useMasterData, calculateContractRateLocal } from "@/app/src/lib/useMasterData";
import { showToast } from "@/app/src/common/toast";

function toNum(v: string) {
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
}

export function usePurchaseBilling(form?: AwbFormState) {
  const { serviceContracts } = useMasterData();
  const [billing, setBilling] = useState<PurchaseBillingFormState>(defaultPurchaseBilling());
  const [vendorDetails, setVendorDetails] = useState<VendorDetailsFormState>(defaultVendorDetails());
  const [vendorInvoice, setVendorInvoice] = useState<VendorInvoiceFormState>(defaultVendorInvoice());
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const awbNo = form?.awbNumber?.trim();
    if (!awbNo) return;
    let mounted = true;
    (async () => {
      try {
        const res = await api.getAwb(awbNo);
        const pb = res?.data?.purchaseBilling;
        if (pb && mounted) {
          if (pb.billing) setBilling((prev) => ({ ...prev, ...pb.billing }));
          if (pb.vendorDetails) setVendorDetails((prev) => ({ ...prev, ...pb.vendorDetails }));
          if (pb.vendorInvoice) setVendorInvoice((prev) => ({ ...prev, ...pb.vendorInvoice }));
          return;
        }
      } catch {}
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem(`awb_purchase_billing_${awbNo}`);
        if (stored && mounted) {
          try {
            const parsed = JSON.parse(stored);
            if (parsed.billing) setBilling((prev) => ({ ...prev, ...parsed.billing }));
            if (parsed.vendorDetails) setVendorDetails((prev) => ({ ...prev, ...parsed.vendorDetails }));
            if (parsed.vendorInvoice) setVendorInvoice((prev) => ({ ...prev, ...parsed.vendorInvoice }));
          } catch {}
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, [form?.awbNumber]);

  // Auto-calculate vendor freight from matched Service/Vendor Contract
  useEffect(() => {
    if (!form) return;
    const vnd = form.vendor?.trim().toUpperCase();
    const srv = form.service?.trim().toUpperCase();
    const wt = parseFloat(form.chargeableWeight || form.actualWeight || "0");
    if ((!vnd && !srv) || wt <= 0) return;

    const matchedSC =
      serviceContracts.find((c: any) => {
        const vCode = String(c.vendor_code || c.vendorCode || c.vendor_name || c.vendorName || "").toUpperCase();
        const sCode = String(c.service_code || c.serviceCode || c.service_name || c.serviceName || "").toUpperCase();
        return (!vnd || !vCode || vCode.includes(vnd)) && (!srv || !sCode || sCode.includes(srv));
      }) || serviceContracts[0];

    if (matchedSC) {
      const rateRes = calculateContractRateLocal(matchedSC, wt, Number(form.pcs || 1));
      setBilling((prev) => {
        if (prev.editFreightAmount) return prev;
        return {
          ...prev,
          freight: rateRes.finalFreight > 0 ? String(rateRes.finalFreight) : prev.freight,
          freightPerKg: rateRes.freightPerKg > 0 ? String(rateRes.freightPerKg) : prev.freightPerKg,
        };
      });
    }
  }, [form?.vendor, form?.service, form?.chargeableWeight, form?.actualWeight, form?.pcs, serviceContracts]);

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
    let totalOtherCharges = Object.values(billing.charges)
      .filter((c) => c.checked)
      .reduce((sum, c) => sum + toNum(c.amount), 0);

    if (billing.dynamicCharges) {
      totalOtherCharges += Object.values(billing.dynamicCharges)
        .filter((c) => c.checked)
        .reduce((sum, c) => sum + toNum(c.amount), 0);
    }

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
      const updatedBilling = { ...billing, ...totals };
      setBilling(updatedBilling);
      const payload = { billing: updatedBilling, vendorDetails, vendorInvoice };
      const awbNo = form?.awbNumber?.trim();
      if (awbNo) {
        await api.updateAwb(awbNo, { purchaseBilling: payload }).catch(() => {});
        if (typeof window !== "undefined") {
          localStorage.setItem(`awb_purchase_billing_${awbNo}`, JSON.stringify(payload));
        }
      }
      setSaved(true);
      showToast({ variant: "success", message: "Purchase billing saved successfully!" });
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