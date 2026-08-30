"use client";

import React from "react";
import { User, FileText } from "lucide-react";

import ManifestSummary from "./component/manifestsummary";
import ManifestInformation from "./component/manifest-information";
import BagDetails from "./component/bag-detail";
import ManifestBilling from "./component/manifestbilling";
import { useManifestForm } from "./component/manifestform";

type TabItem = {
  id: "entry" | "billing";
  label: string;
  icon: React.ReactNode;
};

const tabs: TabItem[] = [
  {
    id: "entry",
    label: "Entry",
    icon: <User size={14} />,
  },
  {
    id: "billing",
    label: "Billing",
    icon: <FileText size={14} />,
  },
];

export default function ManifestPage() {
  const {
    form,
    updateField,
    toggleEdit,
    errors,
    tab,
    setTab,
    rows,
    updateRow,
    addRow,
    removeRow,
    selectAll,
    charges,
    updateCharge,
    addCharge,
    removeCharge,
    loading,
    toast,
    handleCreateManifest,
    handleSearchAwb,
    handleBagging,
  } = useManifestForm();

  const handleUpdateField = (
    field: string,
    value: string
  ) => {
    updateField(field as any, value as any);
  };
  const handleToggleEdit = (field: string) => {
    if (
      field === "editForwarder" ||
      field === "editVendor" ||
      field === "editRunNumber" ||
      field === "editFlightNo" ||
      field === "editNoOfBags"
    ) {
      toggleEdit(field);
    }
  };

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

      <div className="relative bg-white p-4 rounded-lg border border-gray-200 w-full flex-1 min-h-0 flex flex-col overflow-hidden">

        <div className="bg-white border-b border-b-axc-border pb-0 shrink-0">
          <div className="flex gap-4 overflow-x-auto scrollbar-none">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`relative shrink-0 flex items-center gap-1.5 px-4 py-4 text-regular-medium whitespace-nowrap transition-colors duration-150 cursor-pointer ${
                  tab === t.id
                    ? "text-axc-dark-gray"
                    : "text-axc-gray hover:text-axc-dark-gray "
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

        <div className="flex-1 min-h-0 overflow-y-auto mt-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {tab === "entry" ? (
            <div className="flex flex-col gap-6 w-full pb-2">
              <ManifestSummary
                form={form}
                updateField={handleUpdateField}
                toggleEdit={handleToggleEdit}
              />
              <ManifestInformation
                form={form}
                errors={errors}
                updateField={handleUpdateField}
                toggleEdit={handleToggleEdit}
                handleSearchAwb={handleSearchAwb}
                handleBagging={handleBagging}
              />
              <BagDetails
                rows={rows}
                updateRow={updateRow}
                addRow={addRow}
                removeRow={removeRow}
                selectAll={selectAll}
              />
            </div>
          ) : (
            <ManifestBilling
              charges={charges}
              addCharge={addCharge}
              updateCharge={updateCharge}
              removeCharge={removeCharge}
            />
          )}
        </div>
      </div>
    </div>
  );
}