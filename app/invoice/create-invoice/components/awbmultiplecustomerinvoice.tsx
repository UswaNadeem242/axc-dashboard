"use client";
import React from "react";
import { useMultipleCustomerInvoiceForm } from "./invoiceform";
import { MultipleCustomerSearchPanel } from "./multiplecustomersearch";
import {
  MultipleCustomerInvoiceDetails,
  AwbTableSection,
} from "./multiplecustomerinvoice";

export function AwbMultipleCustomerInvoiceTab() {
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
  } = useMultipleCustomerInvoiceForm();

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 items-stretch w-full pb-2">
      <div className="lg:col-span-3 w-full flex flex-col">
        <MultipleCustomerInvoiceDetails
          form={form}
          setForm={setForm}
          onCreateInvoice={handleCreateInvoice}
          loading={loading}
        />
      </div>
      <div className="w-full lg:col-span-9 flex flex-col">
        <MultipleCustomerSearchPanel
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
