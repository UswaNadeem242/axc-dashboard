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
    <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 items-start w-full pb-2">
      <div className="w-full lg:col-span-5 lg:sticky lg:top-0 lg:self-start">
        <SingleCustomerSearchPanel search={search} setSearch={setSearch} onSearch={handleSearch} errors={errors} />
      </div>

      <div className="lg:col-span-7 w-full flex flex-col gap-6">
        <SingleCustomerInvoiceDetails
          form={form}
          setForm={setForm}
          errors={errors}
          onCreateInvoice={handleCreateInvoice}
          loading={loading}
        />

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