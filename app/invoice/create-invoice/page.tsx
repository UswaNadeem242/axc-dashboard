"use client";
import React, { useState, useEffect, useCallback } from "react";
import { User, Users, CreditCard, FileText } from "lucide-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AwbSingleCustomerInvoiceTab } from "./components/awbsinglecustomerinvoice";
import { AwbMultipleCustomerInvoiceTab } from "./components/awbmultiplecustomerinvoice";
import { AwbMultipleTab } from "./components/awbmultipleinvoice";
import { AwbLessInvoiceTab } from "./components/awblessinvoice";
import { showToast } from "../../src/common/toast";

type TabItem = { id: string; label: string; icon?: React.ReactNode };

const tabs: TabItem[] = [
  { id: "single-customer", label: "Single Customer", icon: <User size={14} /> },
 /* {
    id: "multiple-customer",
    label: "Multiple Customer",
    icon: <Users size={14} />,
  },
  { id: "multiple-awb", label: "Multiple AWB", icon: <CreditCard size={14} /> },*/
  {
    id: "awb-less-invoice",
    label: "AWB Less Invoice",
    icon: <FileText size={14} />,
  },
];

const developedTabs = new Set([
  "single-customer",
  /*"multiple-customer",
  "multiple-awb",*/
  "awb-less-invoice",
]);

const tabWarnings: Record<string, string> = {
  "multiple-customer":
    "To Create Multiple Customer Invoice, Enable Auto Generate Invoice Number Setting",
  "multiple-awb":
    "To Create Multiple AWB Invoice, Enable Auto Generate Invoice Number Setting",
};

export default function CreateInvoicePage() {
  const [activeTab, setActiveTab] = useState("single-customer");
  const [dismissedWarnings, setDismissedWarnings] = useState
    <Record<string, boolean>
  >({});

  const markDismissed = useCallback((tabId: string) => {
    setDismissedWarnings((prev) => ({ ...prev, [tabId]: true }));
  }, []);

  useEffect(() => {
    const warning = tabWarnings[activeTab];
    if (!warning || dismissedWarnings[activeTab]) return;

    showToast({
      variant: "warning",
      message: warning,
      options: {
        containerId: "invoice-toast",
        toastId: `tab-warning-${activeTab}`,
        autoClose: 5000,
        onClose: () => markDismissed(activeTab),
      },
    });
  }, [activeTab, dismissedWarnings, markDismissed]);

  return (
    <div className="flex flex-col gap-4 w-full h-full min-h-0 overflow-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <ToastContainer
        containerId="invoice-toast"
        position="top-right"
        autoClose={5000}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
       toastClassName="!bg-axc-red !text-white"

        limit={2}
      />

      <div className="relative bg-white p-4 rounded-lg border border-gray-200 w-full flex-1 min-h-0 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-b-axc-border pb-0 shrink-0">
          <div className="flex gap-4 overflow-x-auto scrollbar-none">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative shrink-0 flex items-center gap-1.5 px-4 py-4 regular-text-medium whitespace-nowrap transition-colors duration-150 cursor-pointer ${
                  activeTab === tab.id
                    ? "text-axc-dark-gray"
                    : "text-axc-gray hover:text-axc-dark-gray"
                }`}
              >
                {tab.icon}
                {tab.label}
                <span
                  className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-t transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-axc-navy opacity-100"
                      : "opacity-0"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto mt-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {activeTab === "single-customer" && <AwbSingleCustomerInvoiceTab />}
         {/* {activeTab === "multiple-customer" && (
            <AwbMultipleCustomerInvoiceTab />
          )}
          {activeTab === "multiple-awb" && <AwbMultipleTab />}*/}
          {activeTab === "awb-less-invoice" && <AwbLessInvoiceTab />}

          {!developedTabs.has(activeTab) && (
            <div className="rounded-[32px] border border-axc-border bg-white p-12 text-center text-axc-dark-gray shadow-sm w-full">
              <p className="text-xs font-bold text-axc-gray uppercase tracking-wider mb-2">
                {tabs.find((t) => t.id === activeTab)?.label}
              </p>
              <p className="text-xs text-axc-gray font-medium">
                This section is currently under development.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}