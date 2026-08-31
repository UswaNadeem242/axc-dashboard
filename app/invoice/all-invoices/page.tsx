"use client";

import React, { useState, useEffect } from "react";
import { X, Mail, MessageCircle, FileText, FileSpreadsheet, Pencil, Trash2, PlusCircle, PlusCircleIcon, Eye } from "lucide-react";

import CommonTable from "../../src/common/table";
import { InvoiceHeading, InvoiceEntry, initialInvoiceData } from "../../src/constant";
import FilterSearch from "../../src/common/filtersearch";
import Button from "../../src/common/button";
import { showToast } from "../../src/common/toast";
import DeleteConfirmationDialog from "../../src/common/deleteConfirmation";

export default function AllInvoicePage() {
  const [data, setData] = useState<InvoiceEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<InvoiceEntry | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("invoice_entries");
      if (stored) {
        try {
          const parsed: InvoiceEntry[] = JSON.parse(stored);
          if (parsed.length > initialInvoiceData.length) {
            setData(parsed);
            return;
          }
        } catch (error) {
          console.error("Failed to load invoice data:", error);
        }
      }
      setData(initialInvoiceData);
      localStorage.setItem("invoice_entries", JSON.stringify(initialInvoiceData));
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && data.length > 0) {
      localStorage.setItem("invoice_entries", JSON.stringify(data));
    }
  }, [data]);

  const handleSearchSubmit = (val: string) => {
    const trimmed = val.trim();
    if (trimmed && !activeTags.includes(trimmed)) {
      setActiveTags((prev) => [...prev, trimmed]);
      setSearchQuery("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setActiveTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const handleView = (row: InvoiceEntry) => console.log("View Invoice:", row.invoiceNumber);
  const handleEmail = (row: InvoiceEntry) => console.log("Email Invoice:", row.invoiceNumber);
  const handleWhatsapp = (row: InvoiceEntry) => console.log("Whatsapp Invoice:", row.invoiceNumber);
  const handlePdf = (row: InvoiceEntry) => console.log("View Invoice PDF:", row.invoiceNumber);
  const handleExcel = (row: InvoiceEntry) => console.log("Export Invoice Excel:", row.invoiceNumber);
  const handleEdit = (row: InvoiceEntry) => console.log("Edit Invoice:", row.invoiceNumber);

  // Opens the confirmation dialog instead of deleting immediately.
  const handleDelete = (row: InvoiceEntry) => {
    setDeleteTarget(row);
  };

  const cancelDelete = () => {
    if (isDeleting) return;
    setDeleteTarget(null);
  };

  // Runs the actual delete once the user confirms in the dialog.
  const confirmDelete = () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    setData((prev) => prev.filter((item) => item.invoiceNumber !== deleteTarget.invoiceNumber));
    setSelectedIds((prev) => prev.filter((id) => id !== deleteTarget.invoiceNumber));
    showToast({ variant: "success", message: "Invoice deleted." });

    setIsDeleting(false);
    setDeleteTarget(null);
  };

  const filteredData = data.filter((item) => {
    const query = searchQuery.toLowerCase();
    const matchesQuery =
      !query ||
      item.invoiceNumber.toLowerCase().includes(query) ||
      item.customerName.toLowerCase().includes(query) ||
      item.customerType.toLowerCase().includes(query) ||
      item.shipperCode.toLowerCase().includes(query) ||
      item.createdBy.toLowerCase().includes(query);

    const matchesTags = activeTags.every((tag) => {
      const t = tag.toLowerCase();
      return (
        item.invoiceNumber.toLowerCase().includes(t) ||
        item.customerName.toLowerCase().includes(t) ||
        item.customerType.toLowerCase().includes(t) ||
        item.shipperCode.toLowerCase().includes(t) ||
        item.createdBy.toLowerCase().includes(t)
      );
    });

    return matchesQuery && matchesTags;
  });

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  return (
    <div className="relative bg-white p-6 rounded-lg w-full h-[calc(100vh-160px)] flex flex-col overflow-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
        <div className="flex flex-wrap items-center gap-3">
          {selectedIds.length > 0 && (
            <span className="text-regular-medium  text-axc-gray">{selectedIds.length} selected</span>
          )}
          <FilterSearch
            options={[
              { label: "Select", value: "" },
              { label: "Invoice Number", value: "invoiceNumber" },
              { label: "Customer Name", value: "customerName" },
              { label: "Created By", value: "createdBy" },
            ]}
            selectedOption={filterType}
            onOptionChange={setFilterType}
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            onSearchSubmit={handleSearchSubmit}
            placeholder="Search"
          />
        </div>

      
        <Button className="px-5 py-4 rounded-lg text-regular-small" label="New Invoice" href="/invoice/create-invoice" variant="primary" icon={PlusCircleIcon}  />

      </div>

      {activeTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-2 shrink-0">
          {activeTags.map((tag, idx) => {
            const colors = [
              "border-slate-200 bg-slate-50 text-slate-700",
              "border-axc-red/30 bg-axc-red/5 text-axc-red",
              "border-axc-yellow/30 bg-axc-yellow/5 text-axc-dark-yellow",
              "border-axc-green/30 bg-axc-green/5 text-axc-dark-green",
              "border-axc-sky/30 bg-axc-sky/5 text-axc-sky",
              "border-axc-blue/30 bg-axc-blue/5 text-axc-blue",
              "border-purple-200 bg-purple-50 text-purple-700",
              "border-pink-200 bg-pink-50 text-pink-700",
            ];
            const colorClass = colors[idx % colors.length];

            return (
              <span
                key={tag}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium transition ${colorClass}`}
              >
                {tag}
                <X
                  size={14}
                  className="cursor-pointer hover:opacity-70 transition-opacity"
                  onClick={() => removeTag(tag)}
                />
              </span>
            );
          })}
        </div>
      )}

      <CommonTable
        headings={InvoiceHeading}
        data={filteredData}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(p) => setPage(p)}
        itemsPerPage={itemsPerPage}
        selectable
        rowKey="invoiceNumber"
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        renderActions={(row: InvoiceEntry) => (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleView(row)}
              className="inline-flex items-center justify-center rounded-md border border-axc-navy/30 p-1.5 text-axc-navy transition hover:bg-axc-navy/10 cursor-pointer"
              title="View"
              >
             <Eye size={16} />
             </button>
            <button
              type="button"
              onClick={() => handleEdit(row)}
              className="inline-flex items-center justify-center rounded-md border border-axc-dark-green/30  p-1.5 text-axc-dark-green transition hover:bg-axc-dark-green/10"
              title="Edit"
            >
              <Pencil size={16} />
            </button>
            <button
              type="button"
              onClick={() => handleDelete(row)}
              className="inline-flex items-center justify-center rounded-md border border-axc-red-dark/30  p-1.5 text-axc-red-dark transition hover:bg-axc-red-dark/10"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      />

      <DeleteConfirmationDialog
        isOpen={deleteTarget !== null}
        itemName={deleteTarget?.invoiceNumber}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
