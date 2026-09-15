"use client";
import React from "react";
import { useAwbInvoiceForm } from "./invoiceform";
import { MultipleAwbSearchPanel } from "./multipleawbsearch";
import { MultipleawbDetails, AwbTableSection } from "./multipleawbinvoice";

export function AwbMultipleTab() {
  const {
    search,
    setSearch,
    form,
    setForm,
    awbRows,
    addAwbRow,
    updateAwbRow,
    removeAwbRow,
    loading,
    handleSearch,
    handleCreateInvoice,
  } = useAwbInvoiceForm();

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 items-stretch w-full pb-2">
      <div className="lg:col-span-3 w-full flex flex-col">
        <MultipleawbDetails
          form={form}
          setForm={setForm}
          onCreateInvoice={handleCreateInvoice}
          loading={loading}
        />
      </div>
      <div className="w-full lg:col-span-9 flex flex-col">
        <MultipleAwbSearchPanel
          search={search}
          setSearch={setSearch}
          onSearch={handleSearch}
        />
      </div>

      <div className="w-full lg:col-span-12">
        <AwbTableSection
          awbRows={awbRows}
          addAwbRow={addAwbRow}
          updateAwbRow={updateAwbRow}
          removeAwbRow={removeAwbRow}
        />
      </div>
    </div>
  );
}
