"use client";
import React from "react";
import { useSingleCustomerInvoiceForm } from "./invoiceform";
import { SingleCustomerSearchPanel } from "./singlecustomersearch";
import { SingleCustomerInvoiceDetails, AwbTableSection } from "./singlecustomerinvoice";

export function AwbSingleCustomerInvoiceTab() {
  const {
    search,
    setSearch,
    form,
    setForm,
    awbRows,
    addAwbRow,
    updateAwbRow,
    removeAwbRow,
    errors,
    loading,
    handleSearch,
    handleCreateInvoice,
  } = useSingleCustomerInvoiceForm();

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 items-stretch w-full pb-2">
      <div className="lg:col-span-3 w-full flex flex-col">
        <SingleCustomerInvoiceDetails
          form={form}
          setForm={setForm}
          errors={errors}
          onCreateInvoice={handleCreateInvoice}
          loading={loading}
        />
      </div>
      <div className="w-full lg:col-span-9 flex flex-col">
        <SingleCustomerSearchPanel search={search} setSearch={setSearch} onSearch={handleSearch} errors={errors} />
      </div>

      <div className="w-full lg:col-span-12">
        <AwbTableSection
          awbRows={awbRows}
          addAwbRow={addAwbRow}
          updateAwbRow={updateAwbRow}
          removeAwbRow={removeAwbRow}
          errors={errors}
        />
      </div>
    </div>
  );
}