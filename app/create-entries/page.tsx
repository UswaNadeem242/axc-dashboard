"use client";
import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, User, Paperclip, Truck, ShieldCheck } from "lucide-react";
import AirWaybillInformation from "./components/airwaybillinformation";
import ConsigneeToForm from "./components/consigneeto";
import ShipmentInvoiceSection from "./components/shipmentinvoice";
import ShipperFromForm from "./components/shipperfrom";
import WeightsAndDimensions from "./components/weightanddimensions";
import { useAwbEntryForm } from "./components/handles";
import { AwbSalesBillingTab } from "./components/awbsalesbillings";
import { AwbPurchaseBillingTab } from "./components/awbpurchase";
import { AwbDeliveryTab } from "./components/awbdelivery";
import { AwbAttachmentsTab } from "./components/awbattachments";
import { AwbKycTab } from "./components/awbkyc";

type TabItem = { id: string; label: string; icon?: React.ReactNode };

const allTabs: TabItem[] = [
  { id: "awb-details", label: "AWB Details", icon: <User size={14} /> },
  { id: "sales-billing", label: "Sales Billing", icon: <span className="text-[12px] font-bold">₹</span> },
  { id: "purchase-billing", label: "Purchase Billing", icon: <span className="text-[12px] font-bold">₹</span> },
  { id: "attachment", label: "Attachment", icon: <Paperclip size={14} /> },
  { id: "delivery", label: "Delivery", icon: <Truck size={14} /> },
  { id: "kyc", label: "KYC", icon: <ShieldCheck size={14} /> },
];

const newAwbTabs: TabItem[] = [
  { id: "awb-details", label: "AWB Details", icon: <User size={14} /> },
  { id: "sales-billing", label: "Sales Billing", icon: <span className="text-[12px] font-bold">₹</span> },
  { id: "purchase-billing", label: "Purchase Billing", icon: <span className="text-[12px] font-bold">₹</span> },
];

function CreateEntriesContent() {
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit") || searchParams.get("awb");
  const isEdit = Boolean(editId);

  const [activeTab, setActiveTab] = useState("awb-details");

  const {
    form,
    setForm,
    invoiceItems,
    setInvoiceItems,
    errors,
    loading,
    success,
    isEditMode,
    toast,
    showToast,
    resetShipper,
    resetConsignee,
    handleSubmit,
    handleCreateAndPrint,
    addInvoiceItem,
    removeInvoiceItem,
  } = useAwbEntryForm(editId);

  const currentTabs = isEdit ? allTabs : newAwbTabs;

  return (
    <div className="flex flex-col gap-4 w-full h-full min-h-0 overflow-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 rounded-lg px-4 py-3 text-xs font-bold shadow-lg text-white animate-in fade-in slide-in-from-top-2 duration-200 ${
            toast.type === "success" ? "bg-axc-dark-green" : "bg-axc-navy"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="relative bg-white p-6 rounded-lg border border-gray-200 w-full flex-1 min-h-0 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-b-axc-border pb-0 shrink-0">
          <div className="flex gap-4 overflow-x-auto scrollbar-none">
            {currentTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`text-regular-medium relative shrink-0 flex items-center gap-1.5 px-4 py-4 whitespace-nowrap transition-colors duration-150 cursor-pointer ${
                  activeTab === tab.id ? "text-axc-dark-gray" : "text-axc-gray hover:text-axc-dark-gray"
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

        {success && (
          <div className="flex items-center gap-3 rounded-2xl bg-axc-green/10 border border-axc-green/30 p-4 text-axc-dark-green animate-in fade-in slide-in-from-top-4 duration-300 shrink-0 mt-3">
            <CheckCircle className="h-5 w-5 text-axc-dark-green shrink-0" />
            <div>
              <p className="text-xs font-bold">
                {isEditMode ? "Entry Updated Successfully!" : "Entry Created Successfully!"}
              </p>
              <p className="text-[10px] text-axc-dark-green font-medium">Redirecting you back to AWB Entries list...</p>
            </div>
          </div>
        )}

        <div className="flex-1 min-h-0 overflow-y-auto mt-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {activeTab === "awb-details" && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full pb-2">
              <div className="grid grid-cols-1 xl:grid-cols-[360px_1fr] gap-6 items-start w-full">
                <div className="xl:sticky xl:top-0 self-start">
                  <WeightsAndDimensions form={form} setForm={setForm} />
                </div>

                <div className="flex flex-col gap-6 w-full">
                  <AirWaybillInformation form={form} setForm={setForm} errors={errors} />
                  <ShipperFromForm form={form} setForm={setForm} errors={errors} onReset={resetShipper} showToast={showToast} />
                  <ConsigneeToForm form={form} setForm={setForm} errors={errors} onReset={resetConsignee} showToast={showToast} />
                </div>
              </div>

              <ShipmentInvoiceSection
                form={form}
                setForm={setForm}
                invoiceItems={invoiceItems}
                setInvoiceItems={setInvoiceItems}
                addInvoiceItem={addInvoiceItem}
                removeInvoiceItem={removeInvoiceItem}
              />
                </div>
              </div>

              <ShipmentInvoiceSection
                form={form}
                setForm={setForm}
                invoiceItems={invoiceItems}
                setInvoiceItems={setInvoiceItems}
                addInvoiceItem={addInvoiceItem}
                removeInvoiceItem={removeInvoiceItem}
              />
              <div className="flex justify-end gap-3">
                <button type="submit" disabled={loading} className="px-5 py-4 bg-axc-navy  cursor-pointer text-white rounded-lg text-regular-small transition shadow-sm ">
                  {loading ? (isEditMode ? "Updating..." : "Saving...") : (isEditMode ? "Update AWB" : "Create AWB")}
                <button type="submit" disabled={loading} className="px-5 py-4 bg-axc-navy  cursor-pointer text-white rounded-lg text-regular-small transition shadow-sm ">
                  {loading ? (isEditMode ? "Updating..." : "Saving...") : (isEditMode ? "Update AWB" : "Create AWB")}
                </button>
                {!isEditMode && (
                  <button type="button" onClick={handleCreateAndPrint} className="px-5 py-4 bg-axc-red hover:opacity-90 text-white rounded-lg text-regular-small transition shadow-sm cursor-pointer">
                    Create AWB and Print Label
                  </button>
                )}
              </div>
            </form>
          )}

          {activeTab === "sales-billing" && (
            <AwbSalesBillingTab form={form} setForm={setForm} errors={errors} />
          )}

          {activeTab === "purchase-billing" && <AwbPurchaseBillingTab isEdit={isEdit} />}
          {activeTab === "purchase-billing" && <AwbPurchaseBillingTab isEdit={isEdit} />}

          {activeTab === "attachment" && (
            <AwbAttachmentsTab awbTrackingNo={form.awbNumber} showToast={showToast} />
          )}

          {activeTab === "delivery" && (
            <AwbDeliveryTab awbTrackingNo={form.awbNumber} />
          )}

          {activeTab === "kyc" && <AwbKycTab showToast={showToast} />}
        </div>
      </div>
    </div>
  );
}

export default function CreateEntriesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading AWB Entry...</div>}>
      <CreateEntriesContent />
    </Suspense>
  );
}