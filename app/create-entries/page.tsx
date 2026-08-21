"use client";
import React, { useState } from "react";
import { ArrowLeft, CheckCircle, RotateCcw, User, ChevronDown } from "lucide-react";
import Link from "next/link";
import AirWaybillInformation from "./components/airwaybillinformation";
import ConsigneeToForm from "./components/consigneeto";
import ShipmentInvoiceSection from "./components/shipmentinvoice";
import ShipperFromForm from "./components/shipperfrom";
import WeightsAndDimensions from "./components/weightanddimensions";
import { useAwbEntryForm } from "./components/handles";
import { AwbSalesBillingTab } from "./components/awbsalesbillings";
import { AwbPurchaseBillingTab } from "./components/awbpurchase";

type TabItem = { id: string; label: string; icon?: React.ReactNode };
const tabs: TabItem[] = [
  { id: "awb-details", label: "AWB Details", icon: <User size={14} /> },
  { id: "sales-billing", label: "Sales Billing", icon: <span className="text-[12px] font-bold">₹</span> },
  { id: "purchase-billing", label: "Purchase Billing", icon: <span className="text-[12px] font-bold">₹</span> },
  { id: "extra", label: "Extra", icon: <ChevronDown size={14} /> },
];

export default function CreateEntriesPage() {
  const [activeTab, setActiveTab] = useState("awb-details");

  const {
    form,
    setForm,
    invoiceItems,
    setInvoiceItems,
    errors,
    loading,
    success,
    toast,
    showToast,
    resetShipper,
    resetConsignee,
    handleReset,
    handleSubmit,
    handleCreateAndPrint,
    addInvoiceItem,
    removeInvoiceItem,
  } = useAwbEntryForm();

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

      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/awb-entries"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-white border border-axc-border text-axc-gray hover:bg-axc-light-bg transition shadow-sm"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h2 className="text-xl font-bold text-axc-navy">Create AWB Entry</h2>
            <p className="text-xs text-axc-gray font-medium">Add a new shipment detail to your database</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-axc-border rounded-[8px] px-5 pb-0 shrink-0">
        <div className="flex gap-0 overflow-x-auto scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`relative shrink-0 flex items-center gap-1.5 px-4 py-4 text-[16px] font-extrabold whitespace-nowrap transition-colors duration-150 ${
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

      <div className="relative bg-white p-3 rounded-[8px] border border-gray-200 w-full flex-1 min-h-0 flex flex-col overflow-hidden">
        {success && (
          <div className="flex items-center gap-3 rounded-2xl bg-axc-green/10 border border-axc-green/30 p-4 text-axc-dark-green animate-in fade-in slide-in-from-top-4 duration-300 shrink-0 mt-0">
            <CheckCircle className="h-5 w-5 text-axc-dark-green shrink-0" />
            <div>
              <p className="text-xs font-bold">Entry Created Successfully!</p>
              <p className="text-[10px] text-axc-dark-green font-medium">Redirecting you back to AWB Entries list...</p>
            </div>
          </div>
        )}

        {/* SINGLE scroll container — sara tab content isi ke andar scroll hoga */}
        <div className="flex-1 min-h-0 overflow-y-auto mt-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {activeTab === "awb-details" && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full pb-2">
              <div className="grid grid-cols-1 xl:grid-cols-[360px_1fr] gap-6 items-start w-full">
                <WeightsAndDimensions form={form} setForm={setForm} />
                <div className="flex flex-col gap-6 w-full">
                  <AirWaybillInformation form={form} setForm={setForm} errors={errors} />
                  <ShipperFromForm form={form} setForm={setForm} errors={errors} onReset={resetShipper} showToast={showToast} />
                  <ConsigneeToForm form={form} setForm={setForm} errors={errors} onReset={resetConsignee} showToast={showToast} />
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
              <div className="flex justify-end gap-3 bg-white p-4 rounded-2xl border border-axc-border shadow-sm">
                <button type="button" onClick={handleReset} className="flex items-center gap-1.5 px-5 py-2 border border-axc-border text-axc-gray rounded-lg text-xs font-bold hover:bg-axc-light-bg transition mr-auto">
                  <RotateCcw size={14} /> Reset
                </button>
                <button type="submit" disabled={loading} className="px-5 py-2 bg-axc-navy hover:bg-axc-navy/80 text-white rounded-lg text-xs font-bold transition shadow-sm">
                  {loading ? "Saving..." : "CREATE AWB"}
                </button>
                <button type="button" onClick={handleCreateAndPrint} className="px-5 py-2 bg-axc-dark-green hover:opacity-90 text-white rounded-lg text-xs font-bold transition shadow-sm">
                  CREATE AWB AND PRINT LABEL
                </button>
              </div>
            </form>
          )}

          {activeTab === "sales-billing" && (
            <AwbSalesBillingTab form={form} setForm={setForm} errors={errors} />
          )}

          {activeTab === "purchase-billing" && <AwbPurchaseBillingTab />}

          {activeTab !== "awb-details" && activeTab !== "sales-billing" && activeTab !== "purchase-billing" && (
            <div className="rounded-[32px] border border-axc-border bg-white p-12 text-center text-axc-dark-gray shadow-sm w-full">
              <p className="text-xs font-bold text-axc-gray uppercase tracking-wider mb-2">
                {tabs.find((t) => t.id === activeTab)?.label}
              </p>
              <p className="text-xs text-axc-gray font-medium">This section is currently under development.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}