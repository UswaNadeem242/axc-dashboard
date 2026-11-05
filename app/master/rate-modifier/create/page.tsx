"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Save, ArrowLeft } from "lucide-react";
import { showToast } from "@/app/src/common/toast";
import CommonDropdown from "@/app/src/common/dropdown";
import CustomDatePicker from "@/app/src/common/datepicker";
import {
  PanelHeader,
  FieldLabel,
  FieldError,
  inputClass,
  errorInputClass,
} from "@/app/create-entries/components/form";
import {
  RateModifierEntry,
  CHARGE_OPTIONS,
  BILLING_TYPE_OPTIONS,
  INSURANCE_TYPE_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
  DISPATCH_TYPE_OPTIONS,
  RATE_PER_OPTIONS,
  HIGH_VALUE_CHARGE_ON_OPTIONS,
  initialRateModifierData,
} from "../types";

const defaultFormState = {
  // Charge & Billing (10 fields)
  charge: "",
  billingType: "",
  insuranceType: "",
  paymentMethod: "",
  fixedAmount: "",
  minAmount: "",
  percentageOnFreight: "",
  percentageOnShipmentValue: "",
  percentageOnFreightAndFsc: "",
  dispatchType: "",

  // Weight & Dimension Limits (16 fields)
  minChargeableWeight: "",
  maxChargeableWeight: "",
  minActualWeight: "",
  maxActualWeight: "",
  minVolumeWeight: "",
  maxVolumeWeight: "",
  minNoOfBoxes: "",
  maxNoOfBoxes: "",
  minDimension: "",
  maxDimension: "",
  minPerBoxActualWeight: "",
  maxPerBoxActualWeight: "",
  minPerBoxVolumetricWeight: "",
  maxPerBoxVolumetricWeight: "",
  minPerBoxChargeableWeight: "",
  maxPerBoxChargeableWeight: "",

  // Shipment Value & Flight (3 fields)
  minShipmentValue: "",
  maxShipmentValue: "",
  flightNumber: "",

  // Entities & Routing (10 fields)
  customer: "",
  product: "",
  service: "",
  vendor: "",
  destinationLocation: "",
  originLocation: "",
  destinationZone: "",
  originZone: "",
  destinationHub: "",
  originHub: "",

  // Geographic States, Cities, Pincodes & Content (7 fields from Reference Image)
  destinationState: "",
  originState: "",
  destinationCity: "",
  originCity: "",
  destinationPincode: "",
  originPincode: "",
  docketContent: "",

  // Validity & Rate Calculation (5 fields from Reference Image)
  effectiveFrom: "",
  effectiveTo: "",
  ratePer: "",
  minDimensionPerPcs: false,
  maxDimensionPerPcs: false,

  // Special Conditions & Surcharges (10 checkboxes from Reference Image)
  grith: false,
  slabWiseRate: false,
  isDryIce: false,
  isCsbIvShipment: false,
  isCsbVShipment: false,
  isCommercialShipment: false,
  isOriginOda: false,
  isDestinationOda: false,
  isOriginOda2: false,
  isDestinationOda2: false,

  // Grith Dimensions & High Value (4 fields from Reference Image)
  grith2ndSideMinDimension: "",
  grith2ndSideMaxDimension: "",
  highValueChargeOn: "",
  highValueAmount: "",

  status: "ACTIVE" as "ACTIVE" | "INACTIVE",
};

function CreateRateModifierContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const isEdit = Boolean(editId);

  const [form, setForm] = useState(defaultFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Load existing entry if in edit mode
  useEffect(() => {
    if (typeof window === "undefined" || !editId) return;
    try {
      const stored = localStorage.getItem("master_rate_modifiers");
      const list: RateModifierEntry[] = stored
        ? JSON.parse(stored)
        : initialRateModifierData;
      const found = list.find((item) => item.id === editId);
      if (found) {
        setForm({
          charge: found.charge || "",
          billingType: found.billingType || "",
          insuranceType: found.insuranceType || "",
          paymentMethod: found.paymentMethod || "",
          fixedAmount: found.fixedAmount || "",
          minAmount: found.minAmount || "",
          percentageOnFreight: found.percentageOnFreight || "",
          percentageOnShipmentValue: found.percentageOnShipmentValue || "",
          percentageOnFreightAndFsc: found.percentageOnFreightAndFsc || "",
          dispatchType: found.dispatchType || "",

          minChargeableWeight: found.minChargeableWeight || "",
          maxChargeableWeight: found.maxChargeableWeight || "",
          minActualWeight: found.minActualWeight || "",
          maxActualWeight: found.maxActualWeight || "",
          minVolumeWeight: found.minVolumeWeight || "",
          maxVolumeWeight: found.maxVolumeWeight || "",
          minNoOfBoxes: found.minNoOfBoxes || "",
          maxNoOfBoxes: found.maxNoOfBoxes || "",
          minDimension: found.minDimension || "",
          maxDimension: found.maxDimension || "",
          minPerBoxActualWeight: found.minPerBoxActualWeight || "",
          maxPerBoxActualWeight: found.maxPerBoxActualWeight || "",
          minPerBoxVolumetricWeight: found.minPerBoxVolumetricWeight || "",
          maxPerBoxVolumetricWeight: found.maxPerBoxVolumetricWeight || "",
          minPerBoxChargeableWeight: found.minPerBoxChargeableWeight || "",
          maxPerBoxChargeableWeight: found.maxPerBoxChargeableWeight || "",

          minShipmentValue: found.minShipmentValue || "",
          maxShipmentValue: found.maxShipmentValue || "",
          flightNumber: found.flightNumber || "",

          customer: found.customer || "",
          product: found.product || "",
          service: found.service || "",
          vendor: found.vendor || "",
          destinationLocation: found.destinationLocation || "",
          originLocation: found.originLocation || "",
          destinationZone: found.destinationZone || "",
          originZone: found.originZone || "",
          destinationHub: found.destinationHub || "",
          originHub: found.originHub || "",

          destinationState: found.destinationState || "",
          originState: found.originState || "",
          destinationCity: found.destinationCity || "",
          originCity: found.originCity || "",
          destinationPincode: found.destinationPincode || "",
          originPincode: found.originPincode || "",
          docketContent: found.docketContent || "",

          effectiveFrom: found.effectiveFrom || "",
          effectiveTo: found.effectiveTo || "",
          ratePer: found.ratePer || "",
          minDimensionPerPcs: Boolean(found.minDimensionPerPcs),
          maxDimensionPerPcs: Boolean(found.maxDimensionPerPcs),

          grith: Boolean(found.grith),
          slabWiseRate: Boolean(found.slabWiseRate),
          isDryIce: Boolean(found.isDryIce),
          isCsbIvShipment: Boolean(found.isCsbIvShipment),
          isCsbVShipment: Boolean(found.isCsbVShipment),
          isCommercialShipment: Boolean(found.isCommercialShipment),
          isOriginOda: Boolean(found.isOriginOda),
          isDestinationOda: Boolean(found.isDestinationOda),
          isOriginOda2: Boolean(found.isOriginOda2),
          isDestinationOda2: Boolean(found.isDestinationOda2),

          grith2ndSideMinDimension: found.grith2ndSideMinDimension || "",
          grith2ndSideMaxDimension: found.grith2ndSideMaxDimension || "",
          highValueChargeOn: found.highValueChargeOn || "",
          highValueAmount: found.highValueAmount || "",

          status: found.status || "ACTIVE",
        });
      }
    } catch (e) {
      console.error("Error loading rate modifier:", e);
    }
  }, [editId]);

  // Validation
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.charge.trim()) newErrors.charge = "Charge is required.";
    if (!form.billingType.trim()) newErrors.billingType = "Billing Type is required.";
    if (!form.effectiveFrom.trim()) newErrors.effectiveFrom = "Effective From date is required.";
    if (!form.effectiveTo.trim()) newErrors.effectiveTo = "Effective To date is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      showToast({
        variant: "error",
        message: "Please fill in all required fields (Charge, Billing Type, Effective Dates).",
      });
      return;
    }

    setLoading(true);
    try {
      const stored = localStorage.getItem("master_rate_modifiers");
      const currentList: RateModifierEntry[] = stored
        ? JSON.parse(stored)
        : [...initialRateModifierData];

      if (isEdit) {
        const updatedList = currentList.map((item) => {
          if (item.id === editId) {
            return {
              ...item,
              ...form,
            };
          }
          return item;
        });
        localStorage.setItem("master_rate_modifiers", JSON.stringify(updatedList));
        showToast({
          variant: "success",
          message: `Rate Modifier "${form.charge}" updated successfully!`,
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

        const newModifier: RateModifierEntry = {
          id: `RM-${Date.now().toString().slice(-4)}`,
          srNo: currentList.length + 1,
          ...form,
          createdAt: formattedDate,
        };

        const updatedList = [...currentList, newModifier];
        localStorage.setItem("master_rate_modifiers", JSON.stringify(updatedList));
        showToast({
          variant: "success",
          message: `Rate Modifier "${newModifier.charge}" created successfully!`,
        });
      }

      setTimeout(() => {
        router.push("/master/rate-modifier");
      }, 400);
    } catch (err) {
      console.error("Failed to save rate modifier:", err);
      showToast({
        variant: "error",
        message: "Failed to save rate modifier. Please try again.",
      });
      setLoading(false);
    }
  };

  const textareaClass =
    "border border-axc-border rounded-md px-3 py-2.5 outline-none w-full text-regular-small text-axc-gray placeholder:text-axc-gray transition placeholder:text-regular-small";

  return (
    <div className="flex flex-col gap-4 w-full h-full min-h-0 overflow-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {/* ── Main Outer White Card (Exact AWB Page Container) ── */}
      <div className="relative bg-white p-4 rounded-lg border border-gray-200 w-full flex-1 min-h-0 flex flex-col overflow-hidden">
        
        {/* Scrollable Form Body */}
        <div className="flex-1 min-h-0 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full pb-48">
            
            {/* ══════════════ PANEL 1: CHARGE & BILLING INFORMATION ══════════════ */}
            <div className="bg-white rounded-lg border border-axc-border shadow-sm flex flex-col relative z-50">
              <PanelHeader
                title={isEdit ? "Edit Charge & Billing Information" : "Charge & Billing Information"}
                
              />
              {/* Exactly 3 columns per row on desktop like AWB form */}
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3.5">
                {/* 1. Charge */}
                <div className="flex flex-col gap-1">
                  <FieldLabel required>Charge</FieldLabel>
                  <CommonDropdown
                    placeholder="Select Charge..."
                    value={form.charge}
                    onChange={(val) => {
                      setForm((prev) => ({ ...prev, charge: val }));
                      if (errors.charge) setErrors((prev) => ({ ...prev, charge: "" }));
                    }}
                    options={CHARGE_OPTIONS}
                    className={errors.charge ? "!border-red-400 !bg-red-50/40" : "border-axc-border"}
                  />
                  <FieldError message={errors.charge} />
                </div>

                {/* 2. Billing Type */}
                <div className="flex flex-col gap-1">
                  <FieldLabel required>Billing Type</FieldLabel>
                  <CommonDropdown
                    placeholder="Select Billing Type..."
                    value={form.billingType}
                    onChange={(val) => {
                      setForm((prev) => ({ ...prev, billingType: val }));
                      if (errors.billingType) setErrors((prev) => ({ ...prev, billingType: "" }));
                    }}
                    options={BILLING_TYPE_OPTIONS}
                    className={errors.billingType ? "!border-red-400 !bg-red-50/40" : "border-axc-border"}
                  />
                  <FieldError message={errors.billingType} />
                </div>

                {/* 3. Insurance Type */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Insurance Type</FieldLabel>
                  <CommonDropdown
                    placeholder="Select Insurance Type..."
                    value={form.insuranceType}
                    onChange={(val) => setForm((prev) => ({ ...prev, insuranceType: val }))}
                    options={INSURANCE_TYPE_OPTIONS}
                    className="border-axc-border"
                  />
                </div>

                {/* 4. Payment Method */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Payment Method</FieldLabel>
                  <CommonDropdown
                    placeholder="Select Payment Method..."
                    value={form.paymentMethod}
                    onChange={(val) => setForm((prev) => ({ ...prev, paymentMethod: val }))}
                    options={PAYMENT_METHOD_OPTIONS}
                    className="border-axc-border"
                  />
                </div>

                {/* 5. Fixed Amount */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Fixed Amount</FieldLabel>
                  <input
                    type="text"
                    placeholder="Fixed Amount"
                    value={form.fixedAmount}
                    onChange={(e) => setForm((prev) => ({ ...prev, fixedAmount: e.target.value }))}
                    className={inputClass}
                  />
                </div>

                {/* 6. Min Amount */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Min Amount</FieldLabel>
                  <input
                    type="text"
                    placeholder="Min Amount"
                    value={form.minAmount}
                    onChange={(e) => setForm((prev) => ({ ...prev, minAmount: e.target.value }))}
                    className={inputClass}
                  />
                </div>

                {/* 7. Percentage On Freight */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Percentage On Freight</FieldLabel>
                  <input
                    type="text"
                    placeholder="Percentage On Freight (e.g. 15%)"
                    value={form.percentageOnFreight}
                    onChange={(e) => setForm((prev) => ({ ...prev, percentageOnFreight: e.target.value }))}
                    className={inputClass}
                  />
                </div>

                {/* 8. Percentage On Shipment Value */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Percentage On Shipment Value</FieldLabel>
                  <input
                    type="text"
                    placeholder="Percentage On Shipment Value (e.g. 2.5%)"
                    value={form.percentageOnShipmentValue}
                    onChange={(e) => setForm((prev) => ({ ...prev, percentageOnShipmentValue: e.target.value }))}
                    className={inputClass}
                  />
                </div>

                {/* 9. Percentage On Freight & FSC */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Percentage On Freight & FSC</FieldLabel>
                  <input
                    type="text"
                    placeholder="Percentage On Freight & FSC"
                    value={form.percentageOnFreightAndFsc}
                    onChange={(e) => setForm((prev) => ({ ...prev, percentageOnFreightAndFsc: e.target.value }))}
                    className={inputClass}
                  />
                </div>

                {/* 10. Dispatch Type */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Dispatch Type</FieldLabel>
                  <CommonDropdown
                    placeholder="Select Dispatch Type..."
                    value={form.dispatchType}
                    onChange={(val) => setForm((prev) => ({ ...prev, dispatchType: val }))}
                    options={DISPATCH_TYPE_OPTIONS}
                    className="border-axc-border"
                  />
                </div>
              </div>
            </div>

            {/* ══════════════ PANEL 2: WEIGHTS, VALUES & DIMENSIONS LIMITS ══════════════ */}
            <div className="bg-white rounded-lg border border-axc-border shadow-sm flex flex-col relative z-40">
              <PanelHeader title="Weights, Values & Dimensions Limits" />
              {/* Exactly 3 columns per row on desktop like AWB form */}
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3.5">
                {/* 1. Min Chargeable Weight */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Min Chargeable Weight</FieldLabel>
                  <input
                    type="text"
                    placeholder="Min Chargeable Weight"
                    value={form.minChargeableWeight}
                    onChange={(e) => setForm((prev) => ({ ...prev, minChargeableWeight: e.target.value }))}
                    className={inputClass}
                  />
                </div>

                {/* 2. Max Chargeable Weight */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Max Chargeable Weight</FieldLabel>
                  <input
                    type="text"
                    placeholder="Max Chargeable Weight"
                    value={form.maxChargeableWeight}
                    onChange={(e) => setForm((prev) => ({ ...prev, maxChargeableWeight: e.target.value }))}
                    className={inputClass}
                  />
                </div>

                {/* 3. Min Actual Weight */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Min Actual Weight</FieldLabel>
                  <input
                    type="text"
                    placeholder="Min Actual Weight"
                    value={form.minActualWeight}
                    onChange={(e) => setForm((prev) => ({ ...prev, minActualWeight: e.target.value }))}
                    className={inputClass}
                  />
                </div>

                {/* 4. Max Actual Weight */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Max Actual Weight</FieldLabel>
                  <input
                    type="text"
                    placeholder="Max Actual Weight"
                    value={form.maxActualWeight}
                    onChange={(e) => setForm((prev) => ({ ...prev, maxActualWeight: e.target.value }))}
                    className={inputClass}
                  />
                </div>

                {/* 5. Min Volume Weight */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Min Volume Weight</FieldLabel>
                  <input
                    type="text"
                    placeholder="Min Volume Weight"
                    value={form.minVolumeWeight}
                    onChange={(e) => setForm((prev) => ({ ...prev, minVolumeWeight: e.target.value }))}
                    className={inputClass}
                  />
                </div>

                {/* 6. Max Volume Weight */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Max Volume Weight</FieldLabel>
                  <input
                    type="text"
                    placeholder="Max Volume Weight"
                    value={form.maxVolumeWeight}
                    onChange={(e) => setForm((prev) => ({ ...prev, maxVolumeWeight: e.target.value }))}
                    className={inputClass}
                  />
                </div>

                {/* 7. Min No of Boxes */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Min No Of Boxes</FieldLabel>
                  <input
                    type="text"
                    placeholder="Min No Of Boxes"
                    value={form.minNoOfBoxes}
                    onChange={(e) => setForm((prev) => ({ ...prev, minNoOfBoxes: e.target.value }))}
                    className={inputClass}
                  />
                </div>

                {/* 8. Max No of Boxes */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Max No Of Boxes</FieldLabel>
                  <input
                    type="text"
                    placeholder="Max No Of Boxes"
                    value={form.maxNoOfBoxes}
                    onChange={(e) => setForm((prev) => ({ ...prev, maxNoOfBoxes: e.target.value }))}
                    className={inputClass}
                  />
                </div>

                {/* 9. Min Dimension */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Min Dimension</FieldLabel>
                  <input
                    type="text"
                    placeholder="Min Dimension (LxWxH)"
                    value={form.minDimension}
                    onChange={(e) => setForm((prev) => ({ ...prev, minDimension: e.target.value }))}
                    className={inputClass}
                  />
                </div>

                {/* 10. Max Dimension */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Max Dimension</FieldLabel>
                  <input
                    type="text"
                    placeholder="Max Dimension (LxWxH)"
                    value={form.maxDimension}
                    onChange={(e) => setForm((prev) => ({ ...prev, maxDimension: e.target.value }))}
                    className={inputClass}
                  />
                </div>

                {/* 11. Min Per Box Actual Weight */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Min Per Box Actual Weight</FieldLabel>
                  <input
                    type="text"
                    placeholder="Min Per Box Actual Weight"
                    value={form.minPerBoxActualWeight}
                    onChange={(e) => setForm((prev) => ({ ...prev, minPerBoxActualWeight: e.target.value }))}
                    className={inputClass}
                  />
                </div>

                {/* 12. Max Per Box Actual Weight */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Max Per Box Actual Weight</FieldLabel>
                  <input
                    type="text"
                    placeholder="Max Per Box Actual Weight"
                    value={form.maxPerBoxActualWeight}
                    onChange={(e) => setForm((prev) => ({ ...prev, maxPerBoxActualWeight: e.target.value }))}
                    className={inputClass}
                  />
                </div>

                {/* 13. Min Per Box Volumetric Weight */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Min Per Box Volumetric Weight</FieldLabel>
                  <input
                    type="text"
                    placeholder="Min Per Box Volumetric Weight"
                    value={form.minPerBoxVolumetricWeight}
                    onChange={(e) => setForm((prev) => ({ ...prev, minPerBoxVolumetricWeight: e.target.value }))}
                    className={inputClass}
                  />
                </div>

                {/* 14. Max Per Box Volumetric Weight */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Max Per Box Volumetric Weight</FieldLabel>
                  <input
                    type="text"
                    placeholder="Max Per Box Volumetric Weight"
                    value={form.maxPerBoxVolumetricWeight}
                    onChange={(e) => setForm((prev) => ({ ...prev, maxPerBoxVolumetricWeight: e.target.value }))}
                    className={inputClass}
                  />
                </div>

                {/* 15. Min Per Box Chargeable Weight */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Min Per Box Chargeable Weight</FieldLabel>
                  <input
                    type="text"
                    placeholder="Min Per Box Chargeable Weight"
                    value={form.minPerBoxChargeableWeight}
                    onChange={(e) => setForm((prev) => ({ ...prev, minPerBoxChargeableWeight: e.target.value }))}
                    className={inputClass}
                  />
                </div>

                {/* 16. Max Per Box Chargeable Weight */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Max Per Box Chargeable Weight</FieldLabel>
                  <input
                    type="text"
                    placeholder="Max Per Box Chargeable Weight"
                    value={form.maxPerBoxChargeableWeight}
                    onChange={(e) => setForm((prev) => ({ ...prev, maxPerBoxChargeableWeight: e.target.value }))}
                    className={inputClass}
                  />
                </div>

                {/* 17. Min Shipment Value */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Min Shipment Value</FieldLabel>
                  <input
                    type="text"
                    placeholder="Min Shipment Value"
                    value={form.minShipmentValue}
                    onChange={(e) => setForm((prev) => ({ ...prev, minShipmentValue: e.target.value }))}
                    className={inputClass}
                  />
                </div>

                {/* 18. Max Shipment Value */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Max Shipment Value</FieldLabel>
                  <input
                    type="text"
                    placeholder="Max Shipment Value"
                    value={form.maxShipmentValue}
                    onChange={(e) => setForm((prev) => ({ ...prev, maxShipmentValue: e.target.value }))}
                    className={inputClass}
                  />
                </div>

                {/* 19. Flight Number */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Flight Number</FieldLabel>
                  <input
                    type="text"
                    placeholder="Flight Number (e.g. EK-204)"
                    value={form.flightNumber}
                    onChange={(e) => setForm((prev) => ({ ...prev, flightNumber: e.target.value }))}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {/* ══════════════ PANEL 3: ROUTING & ENTITY DETAILS ══════════════ */}
            <div className="bg-white rounded-lg border border-axc-border shadow-sm flex flex-col relative z-30">
              <PanelHeader title="Routing & Geographic Location Details" />
              {/* Exactly 3 columns per row on desktop like AWB form */}
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3.5">
                {/* 1. Customer */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Customer</FieldLabel>
                  <input
                    type="text"
                    placeholder="Search here..."
                    value={form.customer}
                    onChange={(e) => setForm((prev) => ({ ...prev, customer: e.target.value }))}
                    className={inputClass}
                  />
                </div>

                {/* 2. Product */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Product</FieldLabel>
                  <input
                    type="text"
                    placeholder="Search here..."
                    value={form.product}
                    onChange={(e) => setForm((prev) => ({ ...prev, product: e.target.value }))}
                    className={inputClass}
                  />
                </div>

                {/* 3. Service */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Service</FieldLabel>
                  <input
                    type="text"
                    placeholder="Search here..."
                    value={form.service}
                    onChange={(e) => setForm((prev) => ({ ...prev, service: e.target.value }))}
                    className={inputClass}
                  />
                </div>

                {/* 4. Vendor */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Vendor</FieldLabel>
                  <input
                    type="text"
                    placeholder="Search here..."
                    value={form.vendor}
                    onChange={(e) => setForm((prev) => ({ ...prev, vendor: e.target.value }))}
                    className={inputClass}
                  />
                </div>

                {/* 5. Origin Location */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Origin Location</FieldLabel>
                  <input
                    type="text"
                    placeholder="Search here..."
                    value={form.originLocation}
                    onChange={(e) => setForm((prev) => ({ ...prev, originLocation: e.target.value }))}
                    className={inputClass}
                  />
                </div>

                {/* 6. Destination Location */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Destination Location</FieldLabel>
                  <input
                    type="text"
                    placeholder="Search here..."
                    value={form.destinationLocation}
                    onChange={(e) => setForm((prev) => ({ ...prev, destinationLocation: e.target.value }))}
                    className={inputClass}
                  />
                </div>

                {/* 7. Origin Zone */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Origin Zone</FieldLabel>
                  <input
                    type="text"
                    placeholder="Search here..."
                    value={form.originZone}
                    onChange={(e) => setForm((prev) => ({ ...prev, originZone: e.target.value }))}
                    className={inputClass}
                  />
                </div>

                {/* 8. Destination Zone */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Destination Zone</FieldLabel>
                  <input
                    type="text"
                    placeholder="Search here..."
                    value={form.destinationZone}
                    onChange={(e) => setForm((prev) => ({ ...prev, destinationZone: e.target.value }))}
                    className={inputClass}
                  />
                </div>

                {/* 9. Origin Hub */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Origin Hub</FieldLabel>
                  <input
                    type="text"
                    placeholder="Search here..."
                    value={form.originHub}
                    onChange={(e) => setForm((prev) => ({ ...prev, originHub: e.target.value }))}
                    className={inputClass}
                  />
                </div>

                {/* 10. Destination Hub */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Destination Hub</FieldLabel>
                  <input
                    type="text"
                    placeholder="Search here..."
                    value={form.destinationHub}
                    onChange={(e) => setForm((prev) => ({ ...prev, destinationHub: e.target.value }))}
                    className={inputClass}
                  />
                </div>

                {/* 11. Origin State (From Reference Image) */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <FieldLabel>Origin State</FieldLabel>
                    <span className="text-[10px] text-red-500 font-semibold tracking-tight">
                      (USE COMMA FOR MULTIPLE)
                    </span>
                  </div>
                  <textarea
                    rows={1}
                    placeholder="Enter origin state(s)..."
                    value={form.originState}
                    onChange={(e) => setForm((prev) => ({ ...prev, originState: e.target.value }))}
                    className={textareaClass}
                  />
                </div>

                {/* 12. Destination State (From Reference Image) */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <FieldLabel>Destination State</FieldLabel>
                    <span className="text-[10px] text-red-500 font-semibold tracking-tight">
                      (USE COMMA FOR MULTIPLE)
                    </span>
                  </div>
                  <textarea
                    rows={1}
                    placeholder="Enter destination state(s)..."
                    value={form.destinationState}
                    onChange={(e) => setForm((prev) => ({ ...prev, destinationState: e.target.value }))}
                    className={textareaClass}
                  />
                </div>

                {/* 13. Origin City (From Reference Image) */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <FieldLabel>Origin City</FieldLabel>
                    <span className="text-[10px] text-red-500 font-semibold tracking-tight">
                      (USE COMMA FOR MULTIPLE)
                    </span>
                  </div>
                  <textarea
                    rows={1}
                    placeholder="Enter origin city(s)..."
                    value={form.originCity}
                    onChange={(e) => setForm((prev) => ({ ...prev, originCity: e.target.value }))}
                    className={textareaClass}
                  />
                </div>

                {/* 14. Destination City (From Reference Image) */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <FieldLabel>Destination City</FieldLabel>
                    <span className="text-[10px] text-red-500 font-semibold tracking-tight">
                      (USE COMMA FOR MULTIPLE)
                    </span>
                  </div>
                  <textarea
                    rows={1}
                    placeholder="Enter destination city(s)..."
                    value={form.destinationCity}
                    onChange={(e) => setForm((prev) => ({ ...prev, destinationCity: e.target.value }))}
                    className={textareaClass}
                  />
                </div>

                {/* 15. Origin Pincode (From Reference Image) */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <FieldLabel>Origin Pincode</FieldLabel>
                    <span className="text-[10px] text-red-500 font-semibold tracking-tight">
                      (USE COMMA FOR MULTIPLE)
                    </span>
                  </div>
                  <textarea
                    rows={1}
                    placeholder="Enter origin pincode(s)..."
                    value={form.originPincode}
                    onChange={(e) => setForm((prev) => ({ ...prev, originPincode: e.target.value }))}
                    className={textareaClass}
                  />
                </div>

                {/* 16. Destination Pincode (From Reference Image) */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <FieldLabel>Destination Pincode</FieldLabel>
                    <span className="text-[10px] text-red-500 font-semibold tracking-tight">
                      (USE COMMA FOR MULTIPLE)
                    </span>
                  </div>
                  <textarea
                    rows={1}
                    placeholder="Enter destination pincode(s)..."
                    value={form.destinationPincode}
                    onChange={(e) => setForm((prev) => ({ ...prev, destinationPincode: e.target.value }))}
                    className={textareaClass}
                  />
                </div>

                {/* 17. Docket Content (From Reference Image) */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <FieldLabel>Docket Content</FieldLabel>
                    <span className="text-[10px] text-red-500 font-semibold tracking-tight">
                      (USE COMMA FOR MULTIPLE)
                    </span>
                  </div>
                  <textarea
                    rows={1}
                    placeholder="Enter docket content(s)..."
                    value={form.docketContent}
                    onChange={(e) => setForm((prev) => ({ ...prev, docketContent: e.target.value }))}
                    className={textareaClass}
                  />
                </div>
              </div>
            </div>

            {/* ══════════════ PANEL 4: VALIDITY & RATE CALCULATION (FROM REFERENCE IMAGE) ══════════════ */}
            <div className="bg-white rounded-lg border border-axc-border shadow-sm flex flex-col relative z-20">
              <PanelHeader title="Validity & Rate Calculation" />
              {/* Exactly 3 columns per row on desktop like AWB form */}
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3.5">
                {/* 1. Effective From */}
                <div className="flex flex-col gap-1 relative z-30">
                  <FieldLabel required>Effective From</FieldLabel>
                  <CustomDatePicker
                    value={form.effectiveFrom}
                    onChange={(val) => {
                      setForm((prev) => ({ ...prev, effectiveFrom: val }));
                      if (errors.effectiveFrom) setErrors((prev) => ({ ...prev, effectiveFrom: "" }));
                    }}
                    placeholder="mm/dd/yyyy"
                    openDirection="auto"
                    className="w-full"
                  />
                  <FieldError message={errors.effectiveFrom} />
                </div>

                {/* 2. Effective To */}
                <div className="flex flex-col gap-1 relative z-30">
                  <FieldLabel required>Effective To</FieldLabel>
                  <CustomDatePicker
                    value={form.effectiveTo}
                    onChange={(val) => {
                      setForm((prev) => ({ ...prev, effectiveTo: val }));
                      if (errors.effectiveTo) setErrors((prev) => ({ ...prev, effectiveTo: "" }));
                    }}
                    placeholder="mm/dd/yyyy"
                    openDirection="auto"
                    className="w-full"
                  />
                  <FieldError message={errors.effectiveTo} />
                </div>

                {/* 3. Rate Per */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Rate Per</FieldLabel>
                  <CommonDropdown
                    placeholder="Select Rate Per..."
                    value={form.ratePer}
                    onChange={(val) => setForm((prev) => ({ ...prev, ratePer: val }))}
                    options={RATE_PER_OPTIONS}
                    className="border-axc-border"
                  />
                </div>

                {/* 4. Per PC Dimension Checkboxes */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Per PC Dimension</FieldLabel>
                  <div className="flex flex-col gap-1.5 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.minDimensionPerPcs}
                        onChange={(e) => setForm((prev) => ({ ...prev, minDimensionPerPcs: e.target.checked }))}
                        className="w-4 h-4 accent-axc-navy cursor-pointer"
                      />
                      <span className="text-regular-small text-axc-dark-gray font-medium">Min Dimension Per PCS</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.maxDimensionPerPcs}
                        onChange={(e) => setForm((prev) => ({ ...prev, maxDimensionPerPcs: e.target.checked }))}
                        className="w-4 h-4 accent-axc-navy cursor-pointer"
                      />
                      <span className="text-regular-small text-axc-dark-gray font-medium">Max Dimension Per PCS</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* ══════════════ PANEL 5: SPECIAL SURCHARGES, SHIPMENT CONDITIONS & STATUS ══════════════ */}
            <div className="bg-white rounded-lg border border-axc-border shadow-sm flex flex-col relative z-10">
              <PanelHeader title="Special Surcharges, Shipment Conditions & Status" />

              {/* Checkboxes & Status Section - 4 Columns matching Reference Image */}
              <div className="px-4 pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Column 1: Shipment Type Conditions */}
                  <div className="flex flex-col gap-2.5">
                    <label className="flex items-center gap-2 cursor-pointer select-none hover:text-axc-navy transition">
                      <input
                        type="checkbox"
                        checked={form.grith}
                        onChange={(e) => setForm((prev) => ({ ...prev, grith: e.target.checked }))}
                        className="w-4 h-4 accent-axc-navy cursor-pointer rounded"
                      />
                      <span className="text-regular-small text-axc-dark-gray font-medium">GRITH</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer select-none hover:text-axc-navy transition">
                      <input
                        type="checkbox"
                        checked={form.slabWiseRate}
                        onChange={(e) => setForm((prev) => ({ ...prev, slabWiseRate: e.target.checked }))}
                        className="w-4 h-4 accent-axc-navy cursor-pointer rounded"
                      />
                      <span className="text-regular-small text-axc-dark-gray font-medium">SLAB WISE RATE</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer select-none hover:text-axc-navy transition">
                      <input
                        type="checkbox"
                        checked={form.isDryIce}
                        onChange={(e) => setForm((prev) => ({ ...prev, isDryIce: e.target.checked }))}
                        className="w-4 h-4 accent-axc-navy cursor-pointer rounded"
                      />
                      <span className="text-regular-small text-axc-dark-gray font-medium">IS DRY ICE??</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer select-none hover:text-axc-navy transition">
                      <input
                        type="checkbox"
                        checked={form.isCsbIvShipment}
                        onChange={(e) => setForm((prev) => ({ ...prev, isCsbIvShipment: e.target.checked }))}
                        className="w-4 h-4 accent-axc-navy cursor-pointer rounded"
                      />
                      <span className="text-regular-small text-axc-dark-gray font-medium">IS CSB IV SHIPMENT ?</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer select-none hover:text-axc-navy transition">
                      <input
                        type="checkbox"
                        checked={form.isCsbVShipment}
                        onChange={(e) => setForm((prev) => ({ ...prev, isCsbVShipment: e.target.checked }))}
                        className="w-4 h-4 accent-axc-navy cursor-pointer rounded"
                      />
                      <span className="text-regular-small text-axc-dark-gray font-medium">IS CSB V SHIPMENT ?</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer select-none hover:text-axc-navy transition">
                      <input
                        type="checkbox"
                        checked={form.isCommercialShipment}
                        onChange={(e) => setForm((prev) => ({ ...prev, isCommercialShipment: e.target.checked }))}
                        className="w-4 h-4 accent-axc-navy cursor-pointer rounded"
                      />
                      <span className="text-regular-small text-axc-dark-gray font-medium">IS COMMERCIAL SHIPMENT ?</span>
                    </label>
                  </div>

                  {/* Column 2: ODA Flags */}
                  <div className="flex flex-col gap-2.5">
                    <label className="flex items-center gap-2 cursor-pointer select-none hover:text-axc-navy transition">
                      <input
                        type="checkbox"
                        checked={form.isOriginOda}
                        onChange={(e) => setForm((prev) => ({ ...prev, isOriginOda: e.target.checked }))}
                        className="w-4 h-4 accent-axc-navy cursor-pointer rounded"
                      />
                      <span className="text-regular-small text-axc-dark-gray font-medium">IS ORIGIN ODA</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer select-none hover:text-axc-navy transition">
                      <input
                        type="checkbox"
                        checked={form.isDestinationOda}
                        onChange={(e) => setForm((prev) => ({ ...prev, isDestinationOda: e.target.checked }))}
                        className="w-4 h-4 accent-axc-navy cursor-pointer rounded"
                      />
                      <span className="text-regular-small text-axc-dark-gray font-medium">IS DESTINATION ODA</span>
                    </label>
                  </div>

                  {/* Column 3: ODA2 Flags */}
                  <div className="flex flex-col gap-2.5">
                    <label className="flex items-center gap-2 cursor-pointer select-none hover:text-axc-navy transition">
                      <input
                        type="checkbox"
                        checked={form.isOriginOda2}
                        onChange={(e) => setForm((prev) => ({ ...prev, isOriginOda2: e.target.checked }))}
                        className="w-4 h-4 accent-axc-navy cursor-pointer rounded"
                      />
                      <span className="text-regular-small text-axc-dark-gray font-medium">IS ORIGIN ODA2</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer select-none hover:text-axc-navy transition">
                      <input
                        type="checkbox"
                        checked={form.isDestinationOda2}
                        onChange={(e) => setForm((prev) => ({ ...prev, isDestinationOda2: e.target.checked }))}
                        className="w-4 h-4 accent-axc-navy cursor-pointer rounded"
                      />
                      <span className="text-regular-small text-axc-dark-gray font-medium">IS DESTINATION ODA2</span>
                    </label>
                  </div>

                  {/* Column 4: Status Radio */}
                  <div className="flex flex-col gap-2">
                    <span className="text-regular-small font-semibold text-axc-dark-gray tracking-wide uppercase">
                      STATUS
                    </span>
                    <div className="flex flex-col gap-2 pt-0.5">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="radio"
                          name="status"
                          value="ACTIVE"
                          checked={form.status === "ACTIVE"}
                          onChange={() => setForm((prev) => ({ ...prev, status: "ACTIVE" }))}
                          className="w-4 h-4 accent-axc-navy cursor-pointer"
                        />
                        <span className="text-regular-small font-medium text-emerald-700">ACTIVE</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="radio"
                          name="status"
                          value="INACTIVE"
                          checked={form.status === "INACTIVE"}
                          onChange={() => setForm((prev) => ({ ...prev, status: "INACTIVE" }))}
                          className="w-4 h-4 accent-axc-navy cursor-pointer"
                        />
                        <span className="text-regular-small font-medium text-red-600">INACTIVE</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grith Dimension & Hight Value Inputs - Matching Reference Image */}
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5 ">
                {/* 1. Grith 2nd Side Min Dimension */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Grith 2nd Side Min Dimension</FieldLabel>
                  <input
                    type="text"
                    placeholder="Enter Min Dimension"
                    value={form.grith2ndSideMinDimension}
                    onChange={(e) => setForm((prev) => ({ ...prev, grith2ndSideMinDimension: e.target.value }))}
                    className={inputClass}
                  />
                </div>

                {/* 2. Grith 2nd Side Max Dimension */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Grith 2nd Side Max Dimension</FieldLabel>
                  <input
                    type="text"
                    placeholder="Enter Max Dimension"
                    value={form.grith2ndSideMaxDimension}
                    onChange={(e) => setForm((prev) => ({ ...prev, grith2ndSideMaxDimension: e.target.value }))}
                    className={inputClass}
                  />
                </div>

                {/* 3. Hight Value Charge On */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Hight Value Charge On</FieldLabel>
                  <CommonDropdown
                    placeholder="SELECT..."
                    value={form.highValueChargeOn}
                    onChange={(val) => setForm((prev) => ({ ...prev, highValueChargeOn: val }))}
                    options={HIGH_VALUE_CHARGE_ON_OPTIONS}
                    className="border-axc-border"
                  />
                </div>

                {/* 4. Hight Value Amount */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Hight Value Amount</FieldLabel>
                  <input
                    type="text"
                    placeholder="Enter Amount"
                    value={form.highValueAmount}
                    onChange={(e) => setForm((prev) => ({ ...prev, highValueAmount: e.target.value }))}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {/* ══════════════ BOTTOM ACTION BUTTONS (EXACT AWB BUTTONS) ══════════════ */}
            <div className="flex justify-end items-center gap-3 mt-2">
              <button
                type="button"
                onClick={() => router.push("/master/rate-modifier")}
                className="px-5 py-4 border border-axc-border bg-white text-axc-dark-gray rounded-lg text-xs font-semibold hover:bg-gray-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-4 bg-axc-navy cursor-pointer text-white rounded-lg text-regular-small transition shadow-sm"
              >
                
                {loading ? "Saving..." : isEdit ? "Update Rate Modifier" : "Create Rate Modifier"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function CreateRateModifierPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-gray-500">
          Loading Rate Modifier Form...
        </div>
      }
    >
      <CreateRateModifierContent />
    </Suspense>
  );
}
