"use client";
import React, { useState } from "react";
import { User, Users, CreditCard, FileText } from "lucide-react";
import { AwbSingleCustomerInvoiceTab } from "./components/awbsinglecustomerinvoice";

type TabItem = { id: string; label: string; icon?: React.ReactNode };

const tabs: TabItem[] = [
  { id: "single-customer", label: "Single Customer", icon: <User size={14} /> },
  { id: "multiple-customer", label: "Multiple Customer", icon: <Users size={14} /> },
  { id: "multiple-awb", label: "Multiple AWB", icon: <CreditCard size={14} /> },
  { id: "awb-less-invoice", label: "AWB Less Invoice", icon: <FileText size={14} /> },
];

export default function CreateInvoicePage() {
  const [activeTab, setActiveTab] = useState("single-customer");

  return (
    <div className="flex flex-col gap-4 w-full h-full min-h-0 overflow-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {/* <div className="flex items-center justify-between shrink-0">
        <h2 className="text-xl font-bold text-axc-navy">Invoice</h2>
      </div> */}

      <div className="relative bg-white p-3 rounded-[8px] border border-gray-200 w-full flex-1 min-h-0 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-b-axc-border pb-0 shrink-0">
          <div className="flex gap-4 overflow-x-auto scrollbar-none">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative shrink-0 flex items-center gap-1.5 px-4 py-4 text-regular-medium whitespace-nowrap transition-colors duration-150 cursor-pointer ${
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

        <div className="flex-1 min-h-0 overflow-y-auto mt-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {activeTab === "single-customer" && <AwbSingleCustomerInvoiceTab />}

          {activeTab !== "single-customer" && (
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