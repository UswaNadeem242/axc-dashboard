"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Trash, Plus } from "lucide-react";
import CommonDropdown from "@/app/src/common/dropdown";
import CustomDatePicker from "@/app/src/common/datepicker";
import { showToast } from "@/app/src/common/toast";
import {
  PanelHeader,
  FieldLabel,
  inputClass,
  errorInputClass,
  FieldError,
} from "@/app/create-entries/components/form";
import {
  CustomerContractEntry,
  ContractRateItem,
  CONTRACT_TYPE_OPTIONS,
  INCOTERM_OPTIONS,
  CALCULATION_METHOD_OPTIONS,
  HUB_OPTIONS,
  initialCustomerContractsData,
} from "../types";

const initialFormState: Omit<CustomerContractEntry, "id" | "createdAt"> = {
  customer: "",
  customerCode: "",
  service: "",
  serviceCode: "",
  product: "",
  productCode: "",
  airline: "",
  airlineCode: "",
  flight: "",
  flightCode: "",
  vendor: "",
  vendorCode: "",
  destinationZone: "",
  destinationZoneCode: "",
  destination: "",
  destinationCode: "",
  destinationCity: "",
  destinationCityCode: "",
  destinationState: "",
  destinationStateCode: "",
  destinationHub: "",
  contractType: "Weight Wise",
  incoterm: "",
  status: "ACTIVE",

  originZone: "",
  origin: "",
  originCode: "",
  originCity: "",
  originCityCode: "",
  originState: "",
  originStateCode: "",
  originHub: "",
  effectiveFrom: "",
  effectiveTo: "",
  remarks: "",
  notes: "",
  calculationMethod: "Fixed",
  tat: "",
  minimumFreight: "",
};

const initialRateItem: ContractRateItem = {
  id: 1,
  srNo: 1,
  onAddition: "",
  lowerWtBox: "",
  upperWtBox: "",
  rate: "",
};

function CreateCustomerContractContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const isEdit = Boolean(editId);

  const [form, setForm] = useState(initialFormState);
  const [rateItems, setRateItems] = useState<ContractRateItem[]>([initialRateItem]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  // Load existing data in edit mode
  useEffect(() => {
    if (!editId || typeof window === "undefined") return;

    try {
      const stored = localStorage.getItem("master_customer_contracts");
      const list: CustomerContractEntry[] = stored
        ? JSON.parse(stored)
        : initialCustomerContractsData;
      const found = list.find((c) => c.id === editId);

      if (found) {
        setForm({
          customer: found.customer || "",
          customerCode: found.customerCode || "",
          service: found.service || "",
          serviceCode: found.serviceCode || "",
          product: found.product || "",
          productCode: found.productCode || "",
          airline: found.airline || "",
          airlineCode: found.airlineCode || "",
          flight: found.flight || "",
          flightCode: found.flightCode || "",
          vendor: found.vendor || "",
          vendorCode: found.vendorCode || "",
          destinationZone: found.destinationZone || "",
          destinationZoneCode: found.destinationZoneCode || "",
          destination: found.destination || "",
          destinationCode: found.destinationCode || "",
          destinationCity: found.destinationCity || "",
          destinationCityCode: found.destinationCityCode || "",
          destinationState: found.destinationState || "",
          destinationStateCode: found.destinationStateCode || "",
          destinationHub: found.destinationHub || "",
          contractType: found.contractType || "Weight Wise",
          incoterm: found.incoterm || "",
          status: found.status || "ACTIVE",

          originZone: found.originZone || "",
          origin: found.origin || "",
          originCode: found.originCode || "",
          originCity: found.originCity || "",
          originCityCode: found.originCityCode || "",
          originState: found.originState || "",
          originStateCode: found.originStateCode || "",
          originHub: found.originHub || "",
          effectiveFrom: found.effectiveFrom || "",
          effectiveTo: found.effectiveTo || "",
          remarks: found.remarks || "",
          notes: found.notes || "",
          calculationMethod: found.calculationMethod || "Fixed",
          tat: found.tat || "",
          minimumFreight: found.minimumFreight || "",
        });

        if (found.rateItems && found.rateItems.length > 0) {
          setRateItems(found.rateItems);
        }
      }
    } catch (e) {
      console.error("Error loading contract for edit:", e);
    }
  }, [editId]);

  const handleFieldChange = (field: keyof typeof initialFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const addRateItem = () => {
    setRateItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        srNo: prev.length + 1,
        onAddition: "",
        lowerWtBox: "",
        upperWtBox: "",
        rate: "",
      },
    ]);
  };

  const removeRateItem = (id: number) => {
    if (rateItems.length === 1) {
      setRateItems([initialRateItem]);
      return;
    }
    setRateItems((prev) =>
      prev
        .filter((item) => item.id !== id)
        .map((item, idx) => ({ ...item, srNo: idx + 1 }))
    );
    showToast({ variant: "success", message: "Item removed" });
  };

  const updateRateItem = (id: number, field: keyof ContractRateItem, value: string) => {
    setRateItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!form.customer.trim()) errs.customer = "Customer is required";
    if (!form.service.trim()) errs.service = "Service is required";
    if (!form.product.trim()) errs.product = "Product is required";
    if (!form.contractType) errs.contractType = "Contract Type is required";
    if (!form.calculationMethod) errs.calculationMethod = "Calculation Method is required";
    if (!form.effectiveFrom) errs.effectiveFrom = "Effective From is required";
    if (!form.effectiveTo) errs.effectiveTo = "Effective To is required";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      showToast({
        variant: "error",
        message: "Please fill in all required fields properly.",
      });
      return;
    }

    setSaving(true);

    try {
      const stored = localStorage.getItem("master_customer_contracts");
      const currentList: CustomerContractEntry[] = stored
        ? JSON.parse(stored)
        : [...initialCustomerContractsData];

      if (isEdit) {
        const updatedList = currentList.map((item) => {
          if (item.id === editId) {
            return {
              ...item,
              ...form,
              rateItems,
            };
          }
          return item;
        });

        localStorage.setItem("master_customer_contracts", JSON.stringify(updatedList));
        showToast({
          variant: "success",
          message: `Contract for "${form.customer}" updated successfully!`,
        });
      } else {
        const newEntry: CustomerContractEntry = {
          ...form,
          rateItems,
          id: `CC-${Date.now().toString().slice(-4)}`,
          createdAt: new Date().toISOString().split("T")[0],
        };

        const updatedList = [newEntry, ...currentList];
        localStorage.setItem("master_customer_contracts", JSON.stringify(updatedList));

        showToast({
          variant: "success",
          message: `Customer Contract "${newEntry.id}" created successfully!`,
        });
      }

      setTimeout(() => {
        router.push("/master/customer-contracts");
      }, 500);
    } catch (err) {
      console.error("Failed to save customer contract:", err);
      showToast({
        variant: "error",
        message: "Failed to save contract. Please try again.",
      });
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full h-full min-h-0 overflow-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="relative bg-white p-4 rounded-lg border border-gray-200 w-full flex-1 min-h-0 flex flex-col overflow-hidden">
        {/* Top Header Bar */}
        {/* <div className="flex items-center justify-between pb-3 border-b border-axc-border shrink-0">
          <div className="flex items-center gap-3">
            <Link
              href="/master/customer-contracts"
              className="p-1.5 rounded-lg border border-axc-border text-axc-gray hover:text-axc-navy hover:bg-gray-50 transition cursor-pointer"
              title="Back to Customer Contracts"
            >
              <ArrowLeft size={16} />
            </Link>
            <div>
              <h2 className="text-sm font-semibold text-axc-dark-gray">
                {isEdit ? "Edit Customer Contract" : "Add Customer Contract"}
              </h2>
            </div>
          </div>
        </div> */}

        {/* Form Body */}
        <div className="flex-1 min-h-0 overflow-y-auto pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <form onSubmit={handleSave} className="flex flex-col gap-6 w-full">
            {/* 1. Main Contract Information Card */}
            <div className="bg-white rounded-lg border border-axc-border shadow-xs flex flex-col relative z-20">
              <PanelHeader title={isEdit ? "Customer Contract Information" : "Customer Contracts Information"} />

              {/* 3-Column Grid Layout */}
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 items-start">
                {/* 1. Customer */}
                <div className="flex flex-col gap-1">
                  <FieldLabel required>Customer</FieldLabel>
                  <input
                    type="text"
                    value={form.customer}
                    placeholder="Enter Customer"
                    onChange={(e) => handleFieldChange("customer", e.target.value)}
                    className={`${errors.customer ? errorInputClass : inputClass} w-full`}
                  />
                  <FieldError message={errors.customer} />
                </div>

                {/* 2. Service */}
                <div className="flex flex-col gap-1">
                  <FieldLabel required>Service</FieldLabel>
                  <input
                    type="text"
                    value={form.service}
                    placeholder="Enter Service"
                    onChange={(e) => handleFieldChange("service", e.target.value)}
                    className={`${errors.service ? errorInputClass : inputClass} w-full`}
                  />
                  <FieldError message={errors.service} />
                </div>

                {/* 3. Product */}
                <div className="flex flex-col gap-1">
                  <FieldLabel required>Product</FieldLabel>
                  <input
                    type="text"
                    value={form.product}
                    placeholder="Enter Product"
                    onChange={(e) => handleFieldChange("product", e.target.value)}
                    className={`${errors.product ? errorInputClass : inputClass} w-full`}
                  />
                  <FieldError message={errors.product} />
                </div>

                {/* 4. Airline */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Airline</FieldLabel>
                  <input
                    type="text"
                    value={form.airline}
                    placeholder="Enter Airline"
                    onChange={(e) => handleFieldChange("airline", e.target.value)}
                    className={`${inputClass} w-full`}
                  />
                </div>

                {/* 5. Flight */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Flight</FieldLabel>
                  <input
                    type="text"
                    value={form.flight}
                    placeholder="Enter Flight"
                    onChange={(e) => handleFieldChange("flight", e.target.value)}
                    className={`${inputClass} w-full`}
                  />
                </div>

                {/* 6. Vendor */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Vendor</FieldLabel>
                  <input
                    type="text"
                    value={form.vendor}
                    placeholder="Enter Vendor"
                    onChange={(e) => handleFieldChange("vendor", e.target.value)}
                    className={`${inputClass} w-full`}
                  />
                </div>

                {/* 7. Origin Hub */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Origin Hub</FieldLabel>
                  <CommonDropdown
                    value={form.originHub}
                    onChange={(val) => handleFieldChange("originHub", val)}
                    options={HUB_OPTIONS}
                    placeholder="SELECT.."
                  />
                </div>

                {/* 8. Origin Zone */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Origin Zone</FieldLabel>
                  <input
                    type="text"
                    value={form.originZone}
                    placeholder="Enter Origin Zone"
                    onChange={(e) => handleFieldChange("originZone", e.target.value)}
                    className={`${inputClass} w-full`}
                  />
                </div>

                {/* 9. Origin */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Origin</FieldLabel>
                  <input
                    type="text"
                    value={form.origin}
                    placeholder="Enter Origin"
                    onChange={(e) => handleFieldChange("origin", e.target.value)}
                    className={`${inputClass} w-full`}
                  />
                </div>

                {/* 10. Origin City */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Origin City</FieldLabel>
                  <input
                    type="text"
                    value={form.originCity}
                    placeholder="Enter Origin City"
                    onChange={(e) => handleFieldChange("originCity", e.target.value)}
                    className={`${inputClass} w-full`}
                  />
                </div>

                {/* 11. Origin State */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Origin State</FieldLabel>
                  <input
                    type="text"
                    value={form.originState}
                    placeholder="Enter Origin State"
                    onChange={(e) => handleFieldChange("originState", e.target.value)}
                    className={`${inputClass} w-full`}
                  />
                </div>

                {/* 12. Destination Hub */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Destination Hub</FieldLabel>
                  <CommonDropdown
                    value={form.destinationHub}
                    onChange={(val) => handleFieldChange("destinationHub", val)}
                    options={HUB_OPTIONS}
                    placeholder="SELECT.."
                  />
                </div>

                {/* 13. Destination Zone */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Destination Zone</FieldLabel>
                  <input
                    type="text"
                    value={form.destinationZone}
                    placeholder="Enter Destination Zone"
                    onChange={(e) => handleFieldChange("destinationZone", e.target.value)}
                    className={`${inputClass} w-full`}
                  />
                </div>

                {/* 14. Destination */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Destination</FieldLabel>
                  <input
                    type="text"
                    value={form.destination}
                    placeholder="Enter Destination"
                    onChange={(e) => handleFieldChange("destination", e.target.value)}
                    className={`${inputClass} w-full`}
                  />
                </div>

                {/* 15. Destination City */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Destination City</FieldLabel>
                  <input
                    type="text"
                    value={form.destinationCity}
                    placeholder="Enter Destination City"
                    onChange={(e) => handleFieldChange("destinationCity", e.target.value)}
                    className={`${inputClass} w-full`}
                  />
                </div>

                {/* 16. Destination State */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Destination State</FieldLabel>
                  <input
                    type="text"
                    value={form.destinationState}
                    placeholder="Enter Destination State"
                    onChange={(e) => handleFieldChange("destinationState", e.target.value)}
                    className={`${inputClass} w-full`}
                  />
                </div>

                {/* 17. Contract Type * */}
                <div className="flex flex-col gap-1">
                  <FieldLabel required>Contract Type</FieldLabel>
                  <CommonDropdown
                    value={form.contractType}
                    onChange={(val) => handleFieldChange("contractType", val)}
                    options={CONTRACT_TYPE_OPTIONS}
                    placeholder="Select Contract Type"
                    className={errors.contractType ? "!border-red-400 !bg-red-50/40" : "border-axc-border"}
                  />
                  <FieldError message={errors.contractType} />
                </div>

                {/* 18. Calculation Method * */}
                <div className="flex flex-col gap-1">
                  <FieldLabel required>Calculation Method</FieldLabel>
                  <CommonDropdown
                    value={form.calculationMethod}
                    onChange={(val) => handleFieldChange("calculationMethod", val)}
                    options={CALCULATION_METHOD_OPTIONS}
                    placeholder="Select Method"
                    className={errors.calculationMethod ? "!border-red-400 !bg-red-50/40" : "border-axc-border"}
                  />
                  <FieldError message={errors.calculationMethod} />
                </div>

                {/* 19. Effective From * */}
                <div className="flex flex-col gap-1">
                  <FieldLabel required>Effective From</FieldLabel>
                  <CustomDatePicker
                    value={form.effectiveFrom}
                    onChange={(val) => handleFieldChange("effectiveFrom", val)}
                    placeholder="mm/dd/yyyy"
                    className={errors.effectiveFrom ? "!border-red-400 !bg-red-50/40" : "border-axc-border"}
                  />
                  <FieldError message={errors.effectiveFrom} />
                </div>

                {/* 20. Effective To * */}
                <div className="flex flex-col gap-1">
                  <FieldLabel required>Effective To</FieldLabel>
                  <CustomDatePicker
                    value={form.effectiveTo}
                    onChange={(val) => handleFieldChange("effectiveTo", val)}
                    placeholder="mm/dd/yyyy"
                    className={errors.effectiveTo ? "!border-red-400 !bg-red-50/40" : "border-axc-border"}
                  />
                  <FieldError message={errors.effectiveTo} />
                </div>

                {/* 21. Incoterm */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Incoterm</FieldLabel>
                  <CommonDropdown
                    value={form.incoterm}
                    onChange={(val) => handleFieldChange("incoterm", val)}
                    options={INCOTERM_OPTIONS}
                    placeholder="SELECT INCOTERM.."
                  />
                </div>

                {/* 22. TAT */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>TAT</FieldLabel>
                  <input
                    type="text"
                    value={form.tat}
                    placeholder="Enter TAT"
                    onChange={(e) => handleFieldChange("tat", e.target.value)}
                    className={`${inputClass} w-full`}
                  />
                </div>

                {/* 23. Minimum Freight */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Minimum Freight</FieldLabel>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={form.minimumFreight}
                    placeholder="Enter Minimum Freight"
                    onChange={(e) => handleFieldChange("minimumFreight", e.target.value)}
                    className={`${inputClass} w-full`}
                  />
                </div>

                {/* 24. Status (Radio) */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Status</FieldLabel>
                  <div className="flex items-center gap-6 h-10 px-1">
                    <label className="flex items-center gap-2 cursor-pointer text-regular-medium text-axc-dark-gray">
                      <input
                        type="radio"
                        name="status"
                        value="ACTIVE"
                        checked={form.status === "ACTIVE"}
                        onChange={() => handleFieldChange("status", "ACTIVE")}
                        className="w-4 h-4 accent-axc-navy cursor-pointer"
                      />
                      <span>ACTIVE</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-regular-medium text-axc-dark-gray">
                      <input
                        type="radio"
                        name="status"
                        value="INACTIVE"
                        checked={form.status === "INACTIVE"}
                        onChange={() => handleFieldChange("status", "INACTIVE")}
                        className="w-4 h-4 accent-axc-navy cursor-pointer"
                      />
                      <span>INACTIVE</span>
                    </label>
                  </div>
                </div>

                {/* 25 & 26. Separated Remarks & Notes Textareas */}
                <div className="col-span-full border-t border-axc-border pt-4 mt-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Remarks */}
                    <div className="flex flex-col gap-1">
                      <FieldLabel>Remarks</FieldLabel>
                      <textarea
                        rows={3}
                        value={form.remarks}
                        placeholder="Enter Remarks here..."
                        onChange={(e) => handleFieldChange("remarks", e.target.value)}
                        className="border border-axc-border rounded-md px-3 py-2 outline-none w-full text-regular-small text-axc-gray resize-none focus:border-axc-navy focus:ring-1 focus:ring-axc-navy transition placeholder:text-gray-400"
                      />
                    </div>

                    {/* Notes */}
                    <div className="flex flex-col gap-1">
                      <FieldLabel>Notes</FieldLabel>
                      <textarea
                        rows={3}
                        value={form.notes}
                        placeholder="Enter Notes here..."
                        onChange={(e) => handleFieldChange("notes", e.target.value)}
                        className="border border-axc-border rounded-md px-3 py-2 outline-none w-full text-regular-small text-axc-gray resize-none focus:border-axc-navy focus:ring-1 focus:ring-axc-navy transition placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Contract Rate Items (AWB Shipment Invoice Style) */}
            <div className="bg-white rounded-lg border border-axc-border shadow-xs overflow-hidden flex flex-col">
              <div className="bg-axc-navy/60 text-white p-4 rounded-tl-lg rounded-tr-lg flex items-center justify-between gap-2">
                <h3 className="font-medium tracking-wide">Contract Rate Items</h3>
                <button
                  type="button"
                  onClick={addRateItem}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded transition cursor-pointer shadow-xs"
                >
                  <Plus size={14} />
                  Add Item
                </button>
              </div>

              <div className="overflow-x-auto p-4">
                <div className="border border-axc-border rounded-md overflow-hidden">
                  <table className="w-full text-sm min-w-[700px]">
                    <thead>
                      <tr className="bg-axc-navy/10 text-regular-medium text-axc-dark-gray text-left whitespace-nowrap">
                        <th className="py-2.5 px-3 border-r border-axc-border w-16 text-center">Sr#</th>
                        <th className="py-2.5 px-3 border-r border-axc-border">On Addition</th>
                        <th className="py-2.5 px-3 border-r border-axc-border">Lower Wt./Box</th>
                        <th className="py-2.5 px-3 border-r border-axc-border">Upper Wt./Box</th>
                        <th className="py-2.5 px-3 border-r border-axc-border">Rate</th>
                        <th className="py-2.5 px-3 text-center w-20">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rateItems.map((item) => (
                        <tr
                          key={item.id}
                          className="border-b border-axc-border last:border-b-0 hover:bg-gray-50/50"
                        >
                          <td className="text-center bg-gray-50 text-gray-600 font-medium border-r border-axc-border">
                            {item.srNo}
                          </td>
                          <td className="p-1.5 border-r border-axc-border">
                            <input
                              type="text"
                              value={item.onAddition}
                              placeholder="Enter on addition"
                              onChange={(e) => updateRateItem(item.id, "onAddition", e.target.value)}
                              className="w-full bg-white border border-axc-border rounded px-2.5 py-1.5 text-regular-small text-axc-gray focus:outline-none focus:border-axc-navy focus:ring-1 focus:ring-axc-navy shadow-none"
                            />
                          </td>
                          <td className="p-1.5 border-r border-axc-border">
                            <input
                              type="text"
                              value={item.lowerWtBox}
                              placeholder="Enter lower wt/box"
                              onChange={(e) => updateRateItem(item.id, "lowerWtBox", e.target.value)}
                              className="w-full bg-white border border-axc-border rounded px-2.5 py-1.5 text-regular-small text-axc-gray focus:outline-none focus:border-axc-navy focus:ring-1 focus:ring-axc-navy shadow-none text-center"
                            />
                          </td>
                          <td className="p-1.5 border-r border-axc-border">
                            <input
                              type="text"
                              value={item.upperWtBox}
                              placeholder="Enter upper wt/box"
                              onChange={(e) => updateRateItem(item.id, "upperWtBox", e.target.value)}
                              className="w-full bg-white border border-axc-border rounded px-2.5 py-1.5 text-regular-small text-axc-gray focus:outline-none focus:border-axc-navy focus:ring-1 focus:ring-axc-navy shadow-none text-center"
                            />
                          </td>
                          <td className="p-1.5 border-r border-axc-border">
                            <input
                              type="text"
                              value={item.rate}
                              placeholder="Enter rate"
                              onChange={(e) => updateRateItem(item.id, "rate", e.target.value)}
                              className="w-full bg-white border border-axc-border rounded px-2.5 py-1.5 text-regular-small text-axc-gray focus:outline-none focus:border-axc-navy focus:ring-1 focus:ring-axc-navy shadow-none text-center"
                            />
                          </td>
                          <td className="p-1.5 text-center">
                            <button
                              type="button"
                              onClick={() => removeRateItem(item.id)}
                              className="inline-flex cursor-pointer items-center justify-center rounded-md border border-axc-red/30 p-1.5 text-axc-red transition hover:bg-axc-red/10"
                              title="Remove item"
                            >
                              <Trash size={15} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      <tr className="border-t border-axc-border bg-white">
                        <td colSpan={6} className="py-2.5 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={addRateItem}
                              className="p-1 text-white rounded-full ring ring-axc-yellow transition cursor-pointer flex justify-center items-center hover:bg-axc-yellow/10"
                              title="Add Item"
                            >
                              <Plus size={15} strokeWidth={3} className="text-axc-yellow" />
                            </button>
                            <span className="text-xs text-gray-500 font-medium">Add Item</span>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Link
                href="/master/customer-contracts"
                className="px-5 py-2.5 rounded-lg border border-axc-border bg-white text-axc-dark-gray text-regular-small hover:bg-gray-50 transition cursor-pointer font-medium"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-axc-navy text-white rounded-lg text-regular-small transition shadow-sm hover:bg-axc-navy/90 cursor-pointer font-medium disabled:opacity-50 flex items-center gap-2"
              >
                <Save size={15} />
                {saving
                  ? isEdit
                    ? "Updating..."
                    : "Saving..."
                  : isEdit
                  ? "Update Contract"
                  : "Save Customer Contract"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function CreateCustomerContractPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading Contract Form...</div>}>
      <CreateCustomerContractContent />
    </Suspense>
  );
}

