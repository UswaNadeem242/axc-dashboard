"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { User, MapPin, ShieldCheck } from "lucide-react";
import { showToast } from "@/app/src/common/toast";
import { ORIGIN_HUB_OPTIONS, CustomerEntry, initialCustomerData } from "../types";

import CustomerTab, {
  CustomerFormState,
  CustomerFormErrors,
} from "./component/customer-tab";
import HubTab from "./component/hub-tab";
import KycTab from "./component/kyc-tab";

// ─── Tab config ───────────────────────────────────────────────────────────────
type CustomerTab = "customer" | "hub" | "kyc";

const TABS: { id: CustomerTab; label: string; icon: React.ReactNode }[] = [
  { id: "customer", label: "Customer", icon: <User size={14} /> },
  { id: "hub",      label: "Hub",      icon: <MapPin size={14} /> },
  { id: "kyc",      label: "KYC",      icon: <ShieldCheck size={14} /> },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const generateOriginCode = (hubCode = "DEL") => {
  const randomNum = Math.floor(100 + Math.random() * 900);
  return `${hubCode}-CUST-${randomNum}`;
};

const defaultForm = (): CustomerFormState => ({
  name: "",
  company: "",
  originHub: ORIGIN_HUB_OPTIONS[0].value,
  parentCustomer: "",
  originCode: generateOriginCode("DEL"),
  editOriginCode: false,
  email: "",
  address: "",
  currency: "USD",
  paymentType: "Credit",
  creditLimit: "50000",
});

// ─── Page content ─────────────────────────────────────────────────────────────
function CreateCustomerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const isEdit = Boolean(editId);

  const [tab, setTab] = useState<CustomerTab>("customer");
  const [form, setForm] = useState<CustomerFormState>(defaultForm());
  const [errors, setErrors] = useState<CustomerFormErrors>({});
  const [loading, setLoading] = useState(false);

  // Load existing record in edit mode
  useEffect(() => {
    if (!editId || typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("master_customers");
      const list: CustomerEntry[] = stored ? JSON.parse(stored) : initialCustomerData;
      const found = list.find((c) => c.id === editId || c.originCode === editId);
      if (found) {
        setForm({
          name: found.name || "",
          company: found.company || "",
          originHub: found.originHub || ORIGIN_HUB_OPTIONS[0].value,
          parentCustomer: found.parentCustomer || "",
          originCode: found.originCode || "",
          editOriginCode: true,
          email: found.email || "",
          address: found.address || "",
          currency: found.currency || "USD",
          paymentType: found.paymentType || "Credit",
          creditLimit: String(found.creditLimit || ""),
        });
      }
    } catch (e) {
      console.error("Error loading customer for edit:", e);
    }
  }, [editId]);

  // Auto-update origin code prefix when hub changes
  const handleHubChange = (val: string) => {
    setForm((prev) => ({
      ...prev,
      originHub: val,
      originCode: !prev.editOriginCode ? generateOriginCode(val) : prev.originCode,
    }));
    if (errors.originHub) setErrors((prev) => ({ ...prev, originHub: undefined }));
  };

  // Validation
  const validate = (): boolean => {
    const e: CustomerFormErrors = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.company)     e.company = "Company is required.";
    if (!form.originHub)   e.originHub = "Origin Hub is required.";
    if (!form.originCode.trim()) e.originCode = "Origin Code is required.";
    if (!form.email.trim()) {
      e.email = "Email ID is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      e.email = "Please enter a valid email address.";
    }
    if (!form.currency)    e.currency = "Currency is required.";
    if (!form.paymentType) e.paymentType = "Payment Type is required.";
    if (form.creditLimit && isNaN(Number(form.creditLimit)))
      e.creditLimit = "Credit Limit must be a valid number.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // Submit handler
  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) {
      showToast({ variant: "error", message: "Please fill in all required fields properly." });
      return;
    }
    setLoading(true);
    try {
      const stored = localStorage.getItem("master_customers");
      const currentList: CustomerEntry[] = stored ? JSON.parse(stored) : [...initialCustomerData];

      if (isEdit) {
        const updatedList = currentList.map((item) => {
          if (item.id === editId || item.originCode === editId) {
            return {
              ...item,
              name: form.name.trim(),
              company: form.company,
              originHub: form.originHub,
              parentCustomer: form.parentCustomer,
              originCode: form.originCode.trim(),
              email: form.email.trim(),
              address: form.address.trim(),
              currency: form.currency,
              paymentType: form.paymentType,
              creditLimit: form.creditLimit ? Number(form.creditLimit) : "0",
            };
          }
          return item;
        });
        localStorage.setItem("master_customers", JSON.stringify(updatedList));
        showToast({ variant: "success", message: `Customer "${form.name}" updated successfully!` });
      } else {
        const newCustomer: CustomerEntry = {
          id: `CUST-${Date.now().toString().slice(-4)}`,
          srNo: currentList.length + 1,
          name: form.name.trim(),
          company: form.company,
          originHub: form.originHub,
          parentCustomer: form.parentCustomer || "None",
          originCode: form.originCode.trim(),
          email: form.email.trim(),
          address: form.address.trim(),
          currency: form.currency,
          paymentType: form.paymentType,
          creditLimit: form.creditLimit ? Number(form.creditLimit) : "0",
          createdAt: new Date().toISOString().split("T")[0],
        };
        const updatedList = [newCustomer, ...currentList];
        localStorage.setItem("master_customers", JSON.stringify(updatedList));
        showToast({ variant: "success", message: `Customer "${newCustomer.name}" created successfully!` });
      }

      setTimeout(() => router.push("/master/customer"), 500);
    } catch (err) {
      console.error("Failed to save customer:", err);
      showToast({ variant: "error", message: "Failed to save customer. Please try again." });
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full h-full min-h-0 overflow-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="relative bg-white p-4 rounded-lg border border-gray-200 w-full flex-1 min-h-0 flex flex-col overflow-hidden">

        {/* ── Tab Bar ── */}
        <div className="bg-white border-b border-b-axc-border pb-0 shrink-0">
          <div className="flex gap-4 overflow-x-auto scrollbar-none">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`relative shrink-0 flex items-center gap-1.5 px-4 py-4 text-regular-medium whitespace-nowrap transition-colors duration-150 cursor-pointer ${
                  tab === t.id
                    ? "text-axc-dark-gray"
                    : "text-axc-gray hover:text-axc-dark-gray"
                }`}
              >
                {t.icon}
                {t.label}
                <span
                  className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-t transition-all duration-200 ${
                    tab === t.id ? "bg-axc-navy opacity-100" : "opacity-0"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* ── Tab Content ── */}
        <div className="flex-1 min-h-0 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {tab === "customer" && (
            <CustomerTab
              form={form}
              errors={errors}
              loading={loading}
              isEdit={isEdit}
              onChange={setForm}
              onErrorChange={setErrors}
              onHubChange={handleHubChange}
              onSubmit={handleSubmit}
            />
          )}

          {tab === "hub" && <HubTab />}
          {tab === "kyc" && <KycTab customerId={editId || undefined} customerName={form.name} />}
        </div>

      </div>
    </div>
  );
}

export default function CreateCustomerPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading Customer Form...</div>}>
      <CreateCustomerContent />
    </Suspense>
  );
}
