"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Trash, Plus } from "lucide-react";
import CommonDropdown from "@/app/src/common/dropdown";
import CustomDatePicker from "@/app/src/common/datepicker";
import { showToast } from "@/app/src/common/toast";
import { api } from "@/app/src/lib/api";
import { useMasterData, invalidateMasterDataCache } from "@/app/src/lib/useMasterData";
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

  const {
    customers,
    services,
    products,
    vendors,
    hubs,
    zones,
    cities,
    states,
    countries,
  } = useMasterData();

  const [form, setForm] = useState(initialFormState);
  const [rateItems, setRateItems] = useState<ContractRateItem[]>([initialRateItem]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  // Memoized Master Options
  const customerOptions = useMemo(() => {
    const list = customers.map((c) => ({
      value: c.code || c.value,
      label: c.label || `${c.code} - ${c.name}`,
    }));
    if (form.customerCode && !list.some((o) => o.value === form.customerCode)) {
      list.unshift({
        value: form.customerCode,
        label: form.customer ? `${form.customerCode} - ${form.customer}` : form.customerCode,
      });
    } else if (form.customer && !form.customerCode && !list.some((o) => o.value === form.customer || o.label === form.customer)) {
      list.unshift({ value: form.customer, label: form.customer });
    }
    return [{ value: "", label: "SELECT CUSTOMER.." }, ...list];
  }, [customers, form.customer, form.customerCode]);

  const handleCustomerChange = (val: string) => {
    if (!val) {
      setForm((p) => ({ ...p, customer: "", customerCode: "" }));
      return;
    }
    const found = customers.find((c) => c.value === val || c.code === val);
    setForm((p) => ({
      ...p,
      customer: found ? (found.name || found.label) : val,
      customerCode: found ? (found.code || found.value) : val,
    }));
    if (errors.customer) setErrors((p) => ({ ...p, customer: "" }));
  };

  const serviceOptions = useMemo(() => {
    const list = services.map((s) => ({
      value: s.code || s.value,
      label: s.label || s.name || s.code,
    }));
    if (form.serviceCode && !list.some((o) => o.value === form.serviceCode)) {
      list.unshift({
        value: form.serviceCode,
        label: form.service ? `${form.serviceCode} - ${form.service}` : form.serviceCode,
      });
    } else if (form.service && !form.serviceCode && !list.some((o) => o.value === form.service || o.label === form.service)) {
      list.unshift({ value: form.service, label: form.service });
    }
    return [{ value: "", label: "SELECT SERVICE.." }, ...list];
  }, [services, form.service, form.serviceCode]);

  const handleServiceChange = (val: string) => {
    if (!val) {
      setForm((p) => ({ ...p, service: "", serviceCode: "" }));
      return;
    }
    const found = services.find((s) => s.value === val || s.code === val);
    setForm((p) => ({
      ...p,
      service: found ? (found.name || found.label) : val,
      serviceCode: found ? (found.code || found.value) : val,
    }));
    if (errors.service) setErrors((p) => ({ ...p, service: "" }));
  };

  const productOptions = useMemo(() => {
    const list = products.map((p) => ({
      value: p.code || p.value,
      label: p.label || p.name || p.code,
    }));
    if (form.productCode && !list.some((o) => o.value === form.productCode)) {
      list.unshift({
        value: form.productCode,
        label: form.product ? `${form.productCode} - ${form.product}` : form.productCode,
      });
    } else if (form.product && !form.productCode && !list.some((o) => o.value === form.product || o.label === form.product)) {
      list.unshift({ value: form.product, label: form.product });
    }
    return [{ value: "", label: "SELECT PRODUCT.." }, ...list];
  }, [products, form.product, form.productCode]);

  const handleProductChange = (val: string) => {
    if (!val) {
      setForm((p) => ({ ...p, product: "", productCode: "" }));
      return;
    }
    const found = products.find((p) => p.value === val || p.code === val);
    setForm((p) => ({
      ...p,
      product: found ? (found.name || found.label) : val,
      productCode: found ? (found.code || found.value) : val,
    }));
    if (errors.product) setErrors((p) => ({ ...p, product: "" }));
  };

  const vendorOptions = useMemo(() => {
    const list = vendors.map((v) => ({
      value: v.code || v.value,
      label: v.label || v.name || v.code,
    }));
    if (form.vendorCode && !list.some((o) => o.value === form.vendorCode)) {
      list.unshift({
        value: form.vendorCode,
        label: form.vendor ? `${form.vendorCode} - ${form.vendor}` : form.vendorCode,
      });
    } else if (form.vendor && !form.vendorCode && !list.some((o) => o.value === form.vendor || o.label === form.vendor)) {
      list.unshift({ value: form.vendor, label: form.vendor });
    }
    return [{ value: "", label: "SELECT VENDOR.." }, ...list];
  }, [vendors, form.vendor, form.vendorCode]);

  const handleVendorChange = (val: string) => {
    if (!val) {
      setForm((p) => ({ ...p, vendor: "", vendorCode: "" }));
      return;
    }
    const found = vendors.find((v) => v.value === val || v.code === val);
    setForm((p) => ({
      ...p,
      vendor: found ? (found.name || found.label) : val,
      vendorCode: found ? (found.code || found.value) : val,
    }));
  };

  const hubOptions = useMemo(() => {
    const map = new Map<string, string>();
    HUB_OPTIONS.forEach((h) => {
      if (h.value) map.set(h.value.toUpperCase(), h.label);
    });
    hubs.forEach((h) => {
      const code = (h.code || h.value || "").toUpperCase();
      if (code && !map.has(code)) {
        map.set(code, h.label || code);
      }
    });
    const list = Array.from(map.entries()).map(([k, v]) => ({ value: k, label: v }));
    return [{ value: "", label: "SELECT.." }, ...list];
  }, [hubs]);

  const zoneOptions = useMemo(() => {
    const list = zones
      .map((z) => ({
        value: z.code || z.value || z.name || "",
        label: z.label || z.name || z.code || "",
      }))
      .filter((z) => z.value);
    return [{ value: "", label: "SELECT ZONE.." }, ...list];
  }, [zones]);

  const cityOptions = useMemo(() => {
    const list = cities
      .map((c) => ({
        value: c.name || c.code || c.value || "",
        label: c.label || c.name || c.code || "",
      }))
      .filter((c) => c.value);
    return [{ value: "", label: "SELECT CITY.." }, ...list];
  }, [cities]);

  const stateOptions = useMemo(() => {
    const list = states
      .map((s) => ({
        value: s.name || s.code || s.value || "",
        label: s.label || s.name || s.code || "",
      }))
      .filter((s) => s.value);
    return [{ value: "", label: "SELECT STATE.." }, ...list];
  }, [states]);

  const countryOptions = useMemo(() => {
    const list = countries
      .map((c) => ({
        value: c.code || c.value || c.name || "",
        label: c.label || c.name || c.code || "",
      }))
      .filter((c) => c.value);
    return [{ value: "", label: "SELECT COUNTRY.." }, ...list];
  }, [countries]);

  const getDynamicOptions = (baseList: { value: string; label: string }[], currentValue: string) => {
    if (!currentValue) return baseList;
    if (!baseList.some((o) => o.value.toLowerCase() === currentValue.toLowerCase())) {
      const copy = [...baseList];
      copy.splice(1, 0, { value: currentValue, label: currentValue });
      return copy;
    }
    return baseList;
  };

  // Load existing data in edit mode
  useEffect(() => {
    if (!editId) return;
    let mounted = true;
    async function loadItem() {
      try {
        const found = await api.getMasterItem<CustomerContractEntry>("/customer-contracts", editId!);
        if (mounted && found) {
          setForm({
            ...initialFormState,
            ...found,
            status: found.status || "ACTIVE",
          });
          if (Array.isArray((found as any).items) && (found as any).items.length > 0) {
            setRateItems(
              (found as any).items.map((it: any, idx: number) => ({
                id: it.id || idx + 1,
                srNo: it.sort_order || idx + 1,
                onAddition: String(it.on_addition ?? ""),
                lowerWtBox: String(it.lower_wt ?? ""),
                upperWtBox: String(it.upper_wt ?? ""),
                rate: String(it.rate ?? ""),
              }))
            );
          } else if (found.rateItems && found.rateItems.length > 0) {
            setRateItems(found.rateItems);
          }
          return;
        }
      } catch (err) {
        console.warn("API fetch fallback:", err);
      }
      if (mounted && typeof window !== "undefined") {
        try {
          const stored = localStorage.getItem("master_customer_contracts");
          const list: CustomerContractEntry[] = stored
            ? JSON.parse(stored)
            : initialCustomerContractsData;
          const found = list.find((c) => String(c.id) === String(editId));

          if (found) {
            setForm({
              ...initialFormState,
              ...found,
              status: found.status || "ACTIVE",
            });

            if (found.rateItems && found.rateItems.length > 0) {
              setRateItems(found.rateItems);
            }
          }
        } catch (e) {
          console.error("Error loading contract for edit:", e);
        }
      }
    }
    loadItem();
    return () => {
      mounted = false;
    };
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

  const handleSave = async (e: React.FormEvent) => {
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
      const payload = {
        ...form,
        customer_code: form.customerCode || form.customer,
        customer_name: form.customer,
        service_code: form.serviceCode || form.service,
        service_name: form.service,
        product_code: form.productCode || form.product,
        product_name: form.product,
        vendor_code: form.vendorCode || form.vendor,
        vendor_name: form.vendor,
        origin_hub_code: form.originHub,
        destination_hub_code: form.destinationHub,
        origin_code: form.originCode || form.origin || "PK",
        origin_name: form.origin,
        origin_zone: form.originZone,
        origin_city: form.originCity,
        origin_state: form.originState,
        destination_code: form.destinationCode || form.destination,
        destination_name: form.destination,
        destination_zone: form.destinationZone,
        destination_city: form.destinationCity,
        destination_state: form.destinationState,
        contract_type: form.contractType,
        calculation_method: form.calculationMethod,
        effective_from: form.effectiveFrom,
        effective_till: form.effectiveTo,
        effective_to: form.effectiveTo,
        tat: form.tat,
        minimum_freight: form.minimumFreight ? parseFloat(form.minimumFreight) : 0,
        remarks: form.remarks,
        notes: form.notes,
        status: form.status,
        items: rateItems.map((it, idx) => ({
          on_addition: parseFloat(it.onAddition) || 0,
          lower_wt: parseFloat(it.lowerWtBox) || 0,
          upper_wt: parseFloat(it.upperWtBox) || 0,
          rate: parseFloat(it.rate) || 0,
          sort_order: idx + 1,
        })),
        rateItems,
      };
      let savedRecord: CustomerContractEntry | null = null;
      try {
        if (isEdit && editId) {
          savedRecord = await api.updateMasterItem<CustomerContractEntry>("/customer-contracts", editId, payload);
        } else {
          savedRecord = await api.createMasterItem<CustomerContractEntry>("/customer-contracts", payload);
        }
        invalidateMasterDataCache();
      } catch (apiErr) {
        console.warn("API save fallback to localStorage:", apiErr);
      }

      const stored = localStorage.getItem("master_customer_contracts");
      const currentList: CustomerContractEntry[] = stored
        ? JSON.parse(stored)
        : [...initialCustomerContractsData];

      if (isEdit) {
        const updatedList = currentList.map((item) => {
          if (String(item.id) === String(editId)) {
            return savedRecord || {
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
        const newEntry: CustomerContractEntry = savedRecord || {
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
        message: "Failed to save customer contract.",
      });
    } finally {
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
                  <CommonDropdown
                    value={form.customerCode || form.customer}
                    onChange={handleCustomerChange}
                    options={customerOptions}
                    placeholder="Select Customer..."
                    searchable
                    className={errors.customer ? "!border-red-400 !bg-red-50/40" : "border-axc-border"}
                  />
                  <FieldError message={errors.customer} />
                </div>

                {/* 2. Service */}
                <div className="flex flex-col gap-1">
                  <FieldLabel required>Service</FieldLabel>
                  <CommonDropdown
                    value={form.serviceCode || form.service}
                    onChange={handleServiceChange}
                    options={serviceOptions}
                    placeholder="Select Service..."
                    searchable
                    className={errors.service ? "!border-red-400 !bg-red-50/40" : "border-axc-border"}
                  />
                  <FieldError message={errors.service} />
                </div>

                {/* 3. Product */}
                <div className="flex flex-col gap-1">
                  <FieldLabel required>Product</FieldLabel>
                  <CommonDropdown
                    value={form.productCode || form.product}
                    onChange={handleProductChange}
                    options={productOptions}
                    placeholder="Select Product..."
                    searchable
                    className={errors.product ? "!border-red-400 !bg-red-50/40" : "border-axc-border"}
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
                  <CommonDropdown
                    value={form.vendorCode || form.vendor}
                    onChange={handleVendorChange}
                    options={vendorOptions}
                    placeholder="Select Vendor..."
                    searchable
                    className="border-axc-border"
                  />
                </div>

                {/* 7. Origin Hub */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Origin Hub</FieldLabel>
                  <CommonDropdown
                    value={form.originHub}
                    onChange={(val) => handleFieldChange("originHub", val)}
                    options={hubOptions}
                    placeholder="SELECT.."
                    searchable
                    className="border-axc-border"
                  />
                </div>

                {/* 8. Origin Zone */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Origin Zone</FieldLabel>
                  <CommonDropdown
                    value={form.originZone}
                    onChange={(val) => handleFieldChange("originZone", val)}
                    options={getDynamicOptions(zoneOptions, form.originZone)}
                    placeholder="Select Origin Zone..."
                    searchable
                    className="border-axc-border"
                  />
                </div>

                {/* 9. Origin */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Origin</FieldLabel>
                  <CommonDropdown
                    value={form.origin}
                    onChange={(val) => handleFieldChange("origin", val)}
                    options={getDynamicOptions(countryOptions, form.origin)}
                    placeholder="Select Origin..."
                    searchable
                    className="border-axc-border"
                  />
                </div>

                {/* 10. Origin City */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Origin City</FieldLabel>
                  <CommonDropdown
                    value={form.originCity}
                    onChange={(val) => handleFieldChange("originCity", val)}
                    options={getDynamicOptions(cityOptions, form.originCity)}
                    placeholder="Select Origin City..."
                    searchable
                    className="border-axc-border"
                  />
                </div>

                {/* 11. Origin State */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Origin State</FieldLabel>
                  <CommonDropdown
                    value={form.originState}
                    onChange={(val) => handleFieldChange("originState", val)}
                    options={getDynamicOptions(stateOptions, form.originState)}
                    placeholder="Select Origin State..."
                    searchable
                    className="border-axc-border"
                  />
                </div>

                {/* 12. Destination Hub */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Destination Hub</FieldLabel>
                  <CommonDropdown
                    value={form.destinationHub}
                    onChange={(val) => handleFieldChange("destinationHub", val)}
                    options={hubOptions}
                    placeholder="SELECT.."
                    searchable
                    className="border-axc-border"
                  />
                </div>

                {/* 13. Destination Zone */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Destination Zone</FieldLabel>
                  <CommonDropdown
                    value={form.destinationZone}
                    onChange={(val) => handleFieldChange("destinationZone", val)}
                    options={getDynamicOptions(zoneOptions, form.destinationZone)}
                    placeholder="Select Destination Zone..."
                    searchable
                    className="border-axc-border"
                  />
                </div>

                {/* 14. Destination */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Destination</FieldLabel>
                  <CommonDropdown
                    value={form.destination}
                    onChange={(val) => handleFieldChange("destination", val)}
                    options={getDynamicOptions(countryOptions, form.destination)}
                    placeholder="Select Destination..."
                    searchable
                    className="border-axc-border"
                  />
                </div>

                {/* 15. Destination City */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Destination City</FieldLabel>
                  <CommonDropdown
                    value={form.destinationCity}
                    onChange={(val) => handleFieldChange("destinationCity", val)}
                    options={getDynamicOptions(cityOptions, form.destinationCity)}
                    placeholder="Select Destination City..."
                    searchable
                    className="border-axc-border"
                  />
                </div>

                {/* 16. Destination State */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Destination State</FieldLabel>
                  <CommonDropdown
                    value={form.destinationState}
                    onChange={(val) => handleFieldChange("destinationState", val)}
                    options={getDynamicOptions(stateOptions, form.destinationState)}
                    placeholder="Select Destination State..."
                    searchable
                    className="border-axc-border"
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

