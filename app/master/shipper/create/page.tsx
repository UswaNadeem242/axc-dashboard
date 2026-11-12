"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { User, ShieldCheck, CheckCircle } from "lucide-react";
import { showToast } from "@/app/src/common/toast";
import { api } from "@/app/src/lib/api";
<<<<<<< HEAD
import { invalidateMasterDataCache } from "@/app/src/lib/useMasterData";
=======
>>>>>>> 1857e6c4bcd752cfb854388be178686e21382f68
import {
  ShipperEntry,
  initialShipperData,
} from "../types";
import ShipperTab from "./component/shipper-tab";
import KycTab, { KycRowItem } from "./component/kyc-tab";

type TabId = "shipper" | "kyc";

interface TabItem {
  id: TabId;
  label: string;
  icon: React.ReactNode;
}

const tabs: TabItem[] = [
  { id: "shipper", label: "Shipper Profile", icon: <User size={14} /> },
  { id: "kyc", label: "KYC Verification", icon: <ShieldCheck size={14} /> },
];

const defaultFormState = {
  // Profile Fields
  code: "",
  name: "",
  customer: "",
  accountCode: "",
  company: "",
  contactNo: "",
  email: "",
  pincode: "",
  dob: "",
  gstinType: "",
  gstinNo: "",
  gstinType2: "",
  gstinNo2: "",

  // Address Details
  addressLine1: "",
  addressLine2: "",
  addressLine3: "",
  city: "",
  state: "",
  country: "INDIA",
  dialCode: "+91",

  // Documents & Uploads
  page1File: "",
  page2File: "",
  shipperImage: "",
  uploadSignature: "",

  status: "ACTIVE" as "ACTIVE" | "INACTIVE",
  editCode: false,
};

function CreateShipperContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const isEdit = Boolean(editId);

  const [activeTab, setActiveTab] = useState<TabId>("shipper");
  const [form, setForm] = useState(defaultFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // KYC state mapping doc key -> { docNumber, name, page1, page2 }
  const [kycRows, setKycRows] = useState<Record<string, KycRowItem>>({});

  // Auto-generate code for new shipper
  useEffect(() => {
    if (!isEdit && !form.code) {
      const randomSuffix = Math.floor(100 + Math.random() * 900);
      setForm((prev) => ({
        ...prev,
        code: `SHP${randomSuffix}`,
        accountCode: `ACC-${randomSuffix}`,
      }));
    }
  }, [isEdit, form.code]);

  // Load existing entry if in edit mode
  useEffect(() => {
    if (typeof window === "undefined" || !editId) return;
    const applyFound = (found: ShipperEntry) => {
      setForm({
        code: found.code || "",
        name: found.name || "",
        customer: found.customer || "",
        accountCode: found.accountCode || "",
        company: found.company || "",
        contactNo: found.contactNo || "",
        email: found.email || "",
        pincode: found.pincode || "",
        dob: found.dob || "",
        gstinType: found.gstinType || "",
        gstinNo: found.gstinNo || "",
        gstinType2: found.gstinType2 || "",
        gstinNo2: found.gstinNo2 || "",
        addressLine1: found.addressLine1 || "",
        addressLine2: found.addressLine2 || "",
        addressLine3: found.addressLine3 || "",
        city: found.city || "",
        state: found.state || "",
        country: found.country || "INDIA",
        dialCode: found.dialCode || "+91",
        page1File: found.page1File || "",
        page2File: found.page2File || "",
        shipperImage: found.shipperImage || "",
        uploadSignature: found.uploadSignature || "",
        status: found.status || "ACTIVE",
        editCode: true,
      });

      if (found.kycDocuments) {
        const loadedKyc: Record<string, KycRowItem> = {};
        Object.entries(found.kycDocuments).forEach(([k, v]) => {
          loadedKyc[k] = {
            docNumber: v.docNumber || "",
            name: v.name || "",
            page1: v.page1 || "",
            page2: v.page2 || "",
          };
        });
        setKycRows(loadedKyc);
      }
    };

    const loadItem = async () => {
      try {
        const item = await api.getMasterItem<ShipperEntry>("/shippers", editId);
        if (item && item.code) {
          applyFound(item);
          return;
        }
      } catch (e) {
        console.warn("API get shipper fallback to localStorage:", e);
      }
      try {
        const stored = localStorage.getItem("master_shippers");
        const list: ShipperEntry[] = stored
          ? JSON.parse(stored)
          : initialShipperData;
        const found = list.find((item) => String(item.id) === String(editId) || item.code === editId);
        if (found) applyFound(found);
      } catch (e) {
        console.error("Error loading shipper:", e);
      }
    };
    loadItem();
  }, [editId]);

  // Mandatory field validation
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.code.trim()) newErrors.code = "Shipper Code is required.";
    if (!form.name.trim()) newErrors.name = "Shipper Name is required.";
    if (!form.company.trim()) newErrors.company = "Company is required.";
    if (!form.customer.trim()) newErrors.customer = "Customer is required.";
    if (!form.addressLine1.trim()) newErrors.addressLine1 = "Address Line 1 is required.";
    if (!form.city.trim()) newErrors.city = "City is required.";
    if (!form.state.trim()) newErrors.state = "State is required.";
    if (!form.country.trim()) newErrors.country = "Country is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      showToast({
        variant: "error",
        message: "Please fill in all mandatory profile fields (marked with *).",
      });
      setActiveTab("shipper");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
<<<<<<< HEAD
        customer_name: form.customer,
        customer_code: form.accountCode,
        account_code: form.accountCode,
        contact_no: form.contactNo,
        address_line_1: form.addressLine1,
        address_line_2: form.addressLine2,
        address_line_3: form.addressLine3,
        dial_code: form.dialCode,
        gstin_type: form.gstinType,
        gstin_no: form.gstinNo,
        gstin_type_2: form.gstinType2,
        gstin_no_2: form.gstinNo2,
        kyc_documents: kycRows,
=======
>>>>>>> 1857e6c4bcd752cfb854388be178686e21382f68
        kycDocuments: kycRows,
      };
      const stored = localStorage.getItem("master_shippers");
      const currentList: ShipperEntry[] = stored
        ? JSON.parse(stored)
        : [...initialShipperData];

      if (isEdit && editId) {
        let savedItem: ShipperEntry | null = null;
        try {
          savedItem = await api.updateMasterItem<ShipperEntry>("/shippers", editId, payload);
<<<<<<< HEAD
          invalidateMasterDataCache();
=======
>>>>>>> 1857e6c4bcd752cfb854388be178686e21382f68
        } catch (e) {
          console.warn("API update shipper fallback to local:", e);
        }
        const updatedList = currentList.map((item) => {
          if (String(item.id) === String(editId) || item.code === editId) {
            return savedItem || {
              ...item,
              ...form,
              kycDocuments: kycRows,
            };
          }
          return item;
        });
        localStorage.setItem("master_shippers", JSON.stringify(updatedList));
      } else {
        let createdItem: ShipperEntry | null = null;
        try {
          createdItem = await api.createMasterItem<ShipperEntry>("/shippers", payload);
<<<<<<< HEAD
          invalidateMasterDataCache();
=======
>>>>>>> 1857e6c4bcd752cfb854388be178686e21382f68
        } catch (e) {
          console.warn("API create shipper fallback to local:", e);
        }
        const newShipper: ShipperEntry = createdItem || {
          ...form,
          id: `SHP-${Date.now().toString().slice(-4)}`,
          srNo: currentList.length + 1,
          kycDocuments: kycRows,
          createdAt: new Date().toLocaleString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
        };
        const updatedList = [newShipper, ...currentList];
        localStorage.setItem("master_shippers", JSON.stringify(updatedList));
      }

      setSuccess(true);
      showToast({
        variant: "success",
        message: isEdit ? "Shipper updated successfully!" : "Shipper created successfully!",
      });

      setTimeout(() => {
        router.push("/master/shipper");
      }, 700);
    } catch (err) {
      console.error("Save error:", err);
      showToast({
        variant: "error",
        message: "Failed to save shipper. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSave();
  };

  return (
    <div className="flex flex-col gap-4 w-full h-full min-h-0 overflow-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="relative bg-white p-4 rounded-lg border border-gray-200 w-full flex-1 min-h-0 flex flex-col overflow-hidden">
        {/* ══════════════ EXACT AWB TAB BAR ══════════════ */}
        <div className="bg-white border-b border-b-axc-border pb-0 shrink-0">
          <div className="flex gap-4 overflow-x-auto scrollbar-none">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`text-regular-medium relative shrink-0 flex items-center gap-1.5 px-4 py-4 whitespace-nowrap transition-colors duration-150 cursor-pointer ${
                  activeTab === tab.id
                    ? "text-axc-dark-gray font-semibold"
                    : "text-axc-gray hover:text-axc-dark-gray"
                }`}
              >
                {tab.icon}
                {tab.label}
                <span
                  className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-t transition-all duration-200 ${
                    activeTab === tab.id ? "bg-axc-navy opacity-100" : "opacity-0"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* ══════════════ SUCCESS BANNER ══════════════ */}
        {success && (
          <div className="flex items-center gap-3 rounded-2xl bg-axc-green/10 border border-axc-green/30 p-4 text-axc-dark-green animate-in fade-in slide-in-from-top-4 duration-300 shrink-0 mt-3">
            <CheckCircle className="h-5 w-5 text-axc-dark-green shrink-0" />
            <div>
              <p className="text-xs font-bold">
                {isEdit ? "Shipper Updated Successfully!" : "Shipper Created Successfully!"}
              </p>
              <p className="text-[10px] text-axc-dark-green font-medium">
                Redirecting you back to Shipper list...
              </p>
            </div>
          </div>
        )}

        {/* ══════════════ TAB CONTENT ══════════════ */}
        <div className="flex-1 min-h-0 overflow-y-auto mt-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className={activeTab === "shipper" ? "block" : "hidden"}>
            <ShipperTab
              form={form}
              setForm={setForm}
              errors={errors}
              setErrors={setErrors}
              loading={loading}
              isEdit={isEdit}
              onCancel={() => router.push("/master/shipper")}
              onSubmit={handleSubmit}
            />
          </div>

          <div className={activeTab === "kyc" ? "block" : "hidden"}>
            <KycTab
              kycRows={kycRows}
              setKycRows={setKycRows}
              onSave={handleSave}
              onCancel={() => setActiveTab("shipper")}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CreateShipperPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64 text-sm text-axc-gray">
          Loading shipper form...
        </div>
      }
    >
      <CreateShipperContent />
    </Suspense>
  );
}
