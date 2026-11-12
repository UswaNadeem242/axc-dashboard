"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { User, MapPin, ShieldCheck, Mail, Globe, Bell } from "lucide-react";
import { showToast } from "@/app/src/common/toast";
import { api } from "@/app/src/lib/api";
import { invalidateMasterDataCache } from "@/app/src/lib/useMasterData";
import {
  ORIGIN_HUB_OPTIONS,
  CustomerEntry,
  initialCustomerData,
  CustomerEmailSettings,
  defaultCustomerEmailSettings,
  WebPortalUserForm,
  defaultWebPortalUserForm,
  CustomerNotificationSettings,
  defaultNotificationSettings,
} from "../types";

import CustomerTab, {
  CustomerFormState,
  CustomerFormErrors,
} from "./component/customer-tab";
import HubTab from "./component/hub-tab";
import KycTab, {
  KycRowData,
  CustomerContractRow,
  CUSTOMER_FIELDS,
} from "./component/kyc-tab";
import EmailSettingTab from "./component/email-setting-tab";
import WebPortalTab from "./component/web-portal-tab";
import NotificationsSettingsTab from "./component/notifications-settings-tab";

// ─── Tab config ───────────────────────────────────────────────────────────────
type CustomerTab =
  | "customer"
  | "hub"
  | "kyc"
  | "emailSetting"
  | "webPortal"
  | "notifications";

const TABS: { id: CustomerTab; label: string; icon: React.ReactNode }[] = [
  { id: "customer",      label: "Customer",                          icon: <User size={14} /> },
  { id: "hub",           label: "Hub",                               icon: <MapPin size={14} /> },
  { id: "kyc",           label: "KYC",                               icon: <ShieldCheck size={14} /> },
  { id: "emailSetting",  label: "Email Setting",                     icon: <Mail size={14} /> },
  { id: "webPortal",     label: "Web Portal",                        icon: <Globe size={14} /> },
  { id: "notifications", label: "Notifications & System Settings",   icon: <Bell size={14} /> },
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
  userType: "B2B",
  operationsId: "",
  billingId: "",
  status: "Active",
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

  // Lifted state for Hubs and KYC so switching tabs never loses data
  const [selectedHubs, setSelectedHubs] = useState<string[]>([ORIGIN_HUB_OPTIONS[0].value]);
  const [kycData, setKycData] = useState<Record<string, KycRowData>>(() => {
    const initial: Record<string, KycRowData> = {};
    CUSTOMER_FIELDS.forEach((f) => {
      initial[f.key] = { docNumber: "", name: "", page1: null };
    });
    return initial;
  });
  const [kycContracts, setKycContracts] = useState<CustomerContractRow[]>([
    { id: 1, effectiveFrom: "", effectiveTill: "", file: null },
  ]);
  const [emailSettings, setEmailSettings] = useState<CustomerEmailSettings>(() => ({
    ...defaultCustomerEmailSettings,
  }));
  const [webPortal, setWebPortal] = useState<WebPortalUserForm>(() => ({
    ...defaultWebPortalUserForm,
  }));
  const [notificationsSettings, setNotificationsSettings] =
    useState<CustomerNotificationSettings>(() => ({
      ...defaultNotificationSettings,
    }));

  // Load existing record in edit mode
  useEffect(() => {
    if (!editId || typeof window === "undefined") {
      // If creating new, check if draft hubs, kyc, or email settings exist
      try {
        const draftHubs = localStorage.getItem("customer_hubs_draft");
        if (draftHubs) {
          const parsed = JSON.parse(draftHubs);
          if (Array.isArray(parsed) && parsed.length > 0) setSelectedHubs(parsed);
        }
        const draftKyc = localStorage.getItem("customer_kyc_draft");
        if (draftKyc) {
          const parsedKyc = JSON.parse(draftKyc);
          if (parsedKyc && typeof parsedKyc === "object") setKycData((prev) => ({ ...prev, ...parsedKyc }));
        }
        const draftContracts = localStorage.getItem("customer_contracts_draft");
        if (draftContracts) {
          const parsedC = JSON.parse(draftContracts);
          if (Array.isArray(parsedC) && parsedC.length > 0) setKycContracts(parsedC);
        }
        const draftEmail = localStorage.getItem("customer_email_settings_draft");
        if (draftEmail) {
          const parsedE = JSON.parse(draftEmail);
          if (parsedE && typeof parsedE === "object") {
            setEmailSettings((prev) => ({ ...prev, ...parsedE }));
          }
        }
        const draftPortal = localStorage.getItem("customer_web_portal_draft");
        if (draftPortal) {
          const parsedP = JSON.parse(draftPortal);
          if (parsedP && typeof parsedP === "object") {
            setWebPortal((prev) => ({ ...prev, ...parsedP }));
          }
        }
        const draftNotif = localStorage.getItem("customer_notifications_draft");
        if (draftNotif) {
          const parsedN = JSON.parse(draftNotif);
          if (parsedN && typeof parsedN === "object") {
            setNotificationsSettings((prev) => ({ ...prev, ...parsedN }));
          }
        }
      } catch {}
      return;
    }

    const applyFound = (found: CustomerEntry | any) => {
      setForm({
        name: found.name || "",
        company: found.company || "",
        originHub: found.originHub || found.origin_hub || ORIGIN_HUB_OPTIONS[0].value,
        parentCustomer: found.parentCustomer || found.parent_customer || "",
        originCode: found.originCode || found.origin_code || "",
        editOriginCode: true,
        email: found.email || "",
        address: found.address || "",
        currency: found.currency || "USD",
        paymentType: found.paymentType || found.payment_type || "Credit",
        creditLimit: String(found.creditLimit ?? found.credit_limit ?? ""),
        userType: found.userType || found.user_type || "B2B",
        operationsId: found.operationsId || found.operations_id || "",
        billingId: found.billingId || found.billing_id || "",
        status: found.status || "Active",
      });

      if (Array.isArray(found.hubs) && found.hubs.length > 0) {
        setSelectedHubs(found.hubs);
      } else if (found.originHub || found.origin_hub) {
        setSelectedHubs([found.originHub || found.origin_hub]);
      }

      const kyc = found.kycData || found.kyc_data;
      if (kyc && typeof kyc === "object") {
        setKycData((prev) => ({ ...prev, ...kyc }));
      }

      if (Array.isArray(found.contracts) && found.contracts.length > 0) {
        setKycContracts(found.contracts);
      }

      const emailConfig = found.emailSettings || found.email_settings;
      if (emailConfig && typeof emailConfig === "object") {
        setEmailSettings((prev) => ({ ...prev, ...emailConfig }));
      }

      const portalConfig = found.webPortal || found.web_portal;
      if (portalConfig && typeof portalConfig === "object") {
        setWebPortal((prev) => ({ ...prev, ...portalConfig }));
      }

      const notifConfig = found.notificationsSettings || found.notifications_settings;
      if (notifConfig && typeof notifConfig === "object") {
        setNotificationsSettings((prev) => ({ ...prev, ...notifConfig }));
      }
    };

    const loadItem = async () => {
      try {
        const item = await api.getMasterItem<CustomerEntry>("/customers", editId);
        if (item && item.name) {
          applyFound(item);
          return;
        }
      } catch (e) {
        console.warn("API get customer fallback to localStorage:", e);
      }
      try {
        const stored = localStorage.getItem("master_customers");
        const list: CustomerEntry[] = stored ? JSON.parse(stored) : initialCustomerData;
        const found = list.find((c) => String(c.id) === String(editId) || c.originCode === editId);
        if (found) applyFound(found);
      } catch (e) {
        console.error("Error loading customer for edit:", e);
      }
    };
    loadItem();
  }, [editId]);

  // Auto-update origin code prefix when hub changes
  const handleHubChange = (val: string) => {
    setForm((prev) => ({
      ...prev,
      originHub: val,
      originCode: !prev.editOriginCode ? generateOriginCode(val) : prev.originCode,
    }));
    // Also ensure this hub is in selectedHubs if empty
    setSelectedHubs((prev) => (prev.includes(val) ? prev : [val, ...prev]));
    if (errors.originHub) setErrors((prev) => ({ ...prev, originHub: undefined }));
  };

  const handleSaveHubs = async () => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("customer_hubs_draft", JSON.stringify(selectedHubs));
      } catch {}
    }
    if (isEdit && editId) {
      try {
        await api.updateMasterItem(`/customers`, editId, { hubs: selectedHubs });
      } catch {}
    }
    showToast({ variant: "success", message: "Hub selection saved successfully!" });
  };

  const handleSaveKyc = async () => {
    const storageKey = editId ? `customer_kyc_${editId}` : "customer_kyc_draft";
    const contractsKey = editId ? `customer_contracts_${editId}` : "customer_contracts_draft";
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(storageKey, JSON.stringify(kycData));
        localStorage.setItem(contractsKey, JSON.stringify(kycContracts));
      } catch {}
    }
    if (isEdit && editId) {
      try {
        await api.updateMasterItem(`/customers`, editId, { kycData, contracts: kycContracts });
      } catch {}
    }
    showToast({ variant: "success", message: "Customer KYC and Contract details saved successfully!" });
  };

  const handleSaveEmailSettings = async () => {
    const storageKey = editId ? `customer_email_settings_${editId}` : "customer_email_settings_draft";
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(storageKey, JSON.stringify(emailSettings));
      } catch {}
    }
    if (isEdit && editId) {
      try {
        await api.updateMasterItem(`/customers`, editId, { emailSettings, email_settings: emailSettings });
      } catch {}
    }
    showToast({ variant: "success", message: "Email settings saved successfully!" });
  };

  const handleSaveWebPortal = async () => {
    const storageKey = editId ? `customer_web_portal_${editId}` : "customer_web_portal_draft";
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(storageKey, JSON.stringify(webPortal));
      } catch {}
    }
    if (isEdit && editId) {
      try {
        await api.updateMasterItem(`/customers`, editId, { webPortal, web_portal: webPortal });
      } catch {}
    }
    showToast({ variant: "success", message: "Web Portal user settings saved successfully!" });
  };

  const handleSaveNotifications = async () => {
    const storageKey = editId ? `customer_notifications_${editId}` : "customer_notifications_draft";
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(storageKey, JSON.stringify(notificationsSettings));
      } catch {}
    }
    if (isEdit && editId) {
      try {
        await api.updateMasterItem(`/customers`, editId, {
          notificationsSettings,
          notifications_settings: notificationsSettings,
        });
      } catch {}
    }
    showToast({
      variant: "success",
      message: "Notifications & System Settings saved successfully!",
    });
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
  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) {
      showToast({ variant: "error", message: "Please fill in all required fields properly." });
      return;
    }
    setLoading(true);
    try {
      const payload = {
        name: form.name.trim(),
        company: form.company,
        originHub: form.originHub,
        parentCustomer: form.parentCustomer || "None",
        originCode: form.originCode.trim(),
        email: form.email.trim(),
        address: form.address.trim(),
        currency: form.currency,
        paymentType: form.paymentType,
        creditLimit: form.creditLimit ? Number(form.creditLimit) : 0,
        userType: form.userType || "B2B",
        operationsId: form.operationsId.trim(),
        billingId: form.billingId.trim(),
        status: form.status || "Active",
        hubs: selectedHubs.length > 0 ? selectedHubs : [form.originHub],
        kycData: kycData,
        contracts: kycContracts,
        emailSettings: emailSettings,
        email_settings: emailSettings,
        webPortal: webPortal,
        web_portal: webPortal,
        notificationsSettings: notificationsSettings,
        notifications_settings: notificationsSettings,
      };
      const stored = localStorage.getItem("master_customers");
      const currentList: CustomerEntry[] = stored ? JSON.parse(stored) : [...initialCustomerData];

      if (isEdit && editId) {
        let savedItem: CustomerEntry | null = null;
        try {
          savedItem = await api.updateMasterItem<CustomerEntry>("/customers", editId, payload);
        } catch (e) {
          console.warn("API update customer fallback to local:", e);
        }
        const updatedList = currentList.map((item) => {
          if (String(item.id) === String(editId) || item.originCode === editId) {
            return savedItem || {
              ...item,
              ...payload,
            };
          }
          return item;
        });
        localStorage.setItem("master_customers", JSON.stringify(updatedList));
        showToast({ variant: "success", message: `Customer "${form.name}" updated successfully!` });
      } else {
        let createdItem: CustomerEntry | null = null;
        try {
          createdItem = await api.createMasterItem<CustomerEntry>("/customers", payload);
        } catch (e) {
          console.warn("API create customer fallback to local:", e);
        }
        const newCustomer: CustomerEntry = createdItem || {
          id: `CUST-${Date.now().toString().slice(-4)}`,
          srNo: currentList.length + 1,
          ...payload,
          createdAt: new Date().toISOString().split("T")[0],
        };
        const updatedList = [newCustomer, ...currentList];
        localStorage.setItem("master_customers", JSON.stringify(updatedList));
        showToast({ variant: "success", message: `Customer "${newCustomer.name}" created successfully!` });
      }

      // Clear draft keys after successful save
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem("customer_hubs_draft");
          localStorage.removeItem("customer_kyc_draft");
          localStorage.removeItem("customer_contracts_draft");
          localStorage.removeItem("customer_email_settings_draft");
          localStorage.removeItem("customer_web_portal_draft");
          localStorage.removeItem("customer_notifications_draft");
        } catch {}
      }

      invalidateMasterDataCache();

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

        {/* ── Tab Content — Kept mounted so tab switching never destroys state ── */}
        <div className="flex-1 min-h-0 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className={tab === "customer" ? "block" : "hidden"}>
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
          </div>

          <div className={tab === "hub" ? "block" : "hidden"}>
            <HubTab
              selectedHubs={selectedHubs}
              onChange={setSelectedHubs}
              onSave={handleSaveHubs}
              loading={loading}
            />
          </div>

          <div className={tab === "kyc" ? "block" : "hidden"}>
            <KycTab
              customerId={editId || undefined}
              customerName={form.name}
              data={kycData}
              onChange={setKycData}
              contracts={kycContracts}
              onContractsChange={setKycContracts}
              onSave={handleSaveKyc}
              saving={loading}
            />
          </div>

          <div className={tab === "emailSetting" ? "block" : "hidden"}>
            <EmailSettingTab
              data={emailSettings}
              onChange={setEmailSettings}
              onSave={handleSaveEmailSettings}
              loading={loading}
            />
          </div>

          <div className={tab === "webPortal" ? "block" : "hidden"}>
            <WebPortalTab
              data={webPortal}
              onChange={setWebPortal}
              onSave={handleSaveWebPortal}
              loading={loading}
            />
          </div>

          <div className={tab === "notifications" ? "block" : "hidden"}>
            <NotificationsSettingsTab
              data={notificationsSettings}
              onChange={setNotificationsSettings}
              onSave={handleSaveNotifications}
              loading={loading}
            />
          </div>
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
