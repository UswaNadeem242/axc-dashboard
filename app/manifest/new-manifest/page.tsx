"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, User, FileText } from "lucide-react";

import ManifestSummary from "./component/manifestsummary";
import ManifestInformation from "./component/manifest-information";
import BagDetails from "./component/bag-detail";
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
    <div className="flex flex-col gap-4 w-full  [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 rounded-lg px-4 py-3 text-xs font-bold shadow-lg text-white animate-in fade-in slide-in-from-top-2 duration-200 ${
            toast.type === "success"
              ? "bg-[#0b733a]"
              : "bg-axc-navy"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">

          <Link
            href="/manifest/all-manifest"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-white border border-axc-border text-gray-600 hover:bg-gray-50 transition shadow-sm"
          >
            <ArrowLeft size={16} />
          </Link>

          <div>
            <h2 className="text-xl font-bold text-axc-navy">
              Manifest Detail
            </h2>

            <p className="text-xs text-axc-gray font-medium">
              Create and manage manifest entries
            </p>
          </div>

        </div>

        <button
          type="button"
          onClick={handleCreateManifest}
          disabled={loading}
          className="px-5 py-2 bg-axc-navy hover:bg-axc-navy/80 text-white rounded-lg text-xs font-bold transition shadow-sm disabled:opacity-60"
        >
          {loading ? "CREATING…" : "CREATE MANIFEST"}
        </button>
      </div>

      <div className="bg-white border border-axc-border rounded-[8px] px-5 pb-0 shrink-0">
        <div className="flex gap-0">

          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`relative shrink-0 flex items-center gap-1.5 px-4 py-4 text-[16px] font-extrabold whitespace-nowrap transition-colors duration-150 ${
                tab === t.id
                  ? "text-axc-dark-gray"
                  : "text-gray-400 hover:text-axc-dark-gray"
              }`}
            >
              {t.icon}

              {t.label}

              <span
                className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-t transition-all duration-200 ${
                  tab === t.id
                    ? "bg-axc-navy opacity-100"
                    : "opacity-0"
                }`}
              />
            </button>
          ))}

        </div>
      </div>
      <div className="relative bg-white p-3 rounded-[8px] w-full flex-1 min-h-0 flex flex-col overflow-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex-1 overflow-y-auto mt-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
            <div className="rounded-[8px] border border-axc-border bg-white p-12 text-center text-axc-dark-gray shadow-sm w-full">

              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Billing
              </p>

              <p className="text-xs text-gray-400 font-medium">
                Billing details go here.
              </p>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}