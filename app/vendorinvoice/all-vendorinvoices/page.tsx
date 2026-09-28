"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PlusCircleIcon, Eye, Pencil, Trash2 } from "lucide-react";
import CommonTable from "../../src/common/table";
import {
  VendorInvoiceHeading,
  VendorInvoiceEntry,
  VendorInvoiceData,
} from "../../src/constant";
import Button from "../../src/common/button";
import DeleteConfirmationDialog from "../../src/common/deleteConfirmation";

const STORAGE_KEY = "vendor_invoices";

export default function VendorInvoicePage() {
  const router = useRouter();

  const [data, setData] = useState<VendorInvoiceEntry[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<VendorInvoiceEntry | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);

  const itemsPerPage = 10;

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          setData(JSON.parse(stored));
          return;
        } catch (e) {
          console.error(e);
        }
      }
      setData(VendorInvoiceData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(VendorInvoiceData));
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && data.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [data]);

  const filteredData = data.filter((item) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;

    const terms = query
      .split(",")
      .map((q) => q.trim())
      .filter(Boolean);
    return terms.some(
      (term) =>
        (item.vendor || "").toLowerCase().includes(term) ||
        (item.invoiceNumber || "").toLowerCase().includes(term) ||
        (item.invoiceDate || "").toLowerCase().includes(term) ||
        (item.createdDate || "").toLowerCase().includes(term) ||
        String(item.missingAwbCount).includes(term),
    );
  });

  const handleDelete = (row: VendorInvoiceEntry) => {
    setDeleteTarget(row);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setData((prev) =>
      prev.filter((item) => item.invoiceNumber !== deleteTarget.invoiceNumber),
    );
    setSelectedIds((prev) =>
      prev.filter((id) => id !== deleteTarget.invoiceNumber),
    );
    setIsDeleting(false);
    setDeleteTarget(null);
  };

  const cancelDelete = () => {
    if (isDeleting) return;
    setDeleteTarget(null);
  };

  const handleEdit = (row: VendorInvoiceEntry) =>
    router.push(`/import?edit=${row.invoiceNumber}`);
  const handleView = (row: VendorInvoiceEntry) =>
    router.push(`/vendorinvoice/view/${row.invoiceNumber}`);

  const paginatedData = filteredData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  const tableHeadings = VendorInvoiceHeading.map((h) => {
    if (h.key === "srNo") {
      return {
        ...h,
        render: (_row: VendorInvoiceEntry, idx?: number) => (
          <span className="font-medium text-axc-dark-gray">
            {idx !== undefined ? idx + 1 : _row.srNo}
          </span>
        ),
      };
    }
    return h;
  });

  return (
    <div className="relative bg-white p-4 rounded-lg w-full flex-1 flex flex-col min-h-0  shadow-sm border border-axc-border  overflow-x-hidden overflow-y-scroll [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-axc-gray/40 [&::-webkit-scrollbar-thumb]:rounded-lg">
      <div className="flex flex-wrap justify-between items-center gap-3 mb-4 shrink-0">
        <div className="flex flex-wrap items-center gap-3 w-full max-w-sm">
          {selectedIds.length > 0 && (
            <span className="text-xs font-semibold text-axc-gray">
              {selectedIds.length} selected
            </span>
          )}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search"
            className="h-9 w-full max-w-sm rounded-md border border-axc-border px-3 text-sm outline-none focus:border-axc-navy"
          />
        </div>
        <Button
          label="Import Vendor Invoice"
          href="/vendorinvoice/import"
          variant="primary"
          icon={PlusCircleIcon}
        />
      </div>

      <div className="flex-1 min-h-0 flex flex-col">
        <CommonTable
          headings={tableHeadings}
          data={paginatedData}
          currentPage={page}
          onPageChange={setPage}
          itemsPerPage={itemsPerPage}
          showScroll={true}
          selectable
          rowKey="invoiceNumber"
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          renderActions={(row: VendorInvoiceEntry) => (
            <div className="flex items-center justify-center gap-2">
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
                className="inline-flex items-center justify-center rounded-md border border-axc-dark-green/30 p-1.5 text-axc-dark-green transition hover:bg-axc-dark-green/10 cursor-pointer"
                title="Edit"
              >
                <Pencil size={16} />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(row)}
                className="inline-flex items-center justify-center rounded-md border border-axc-red-dark/30 p-1.5 text-axc-red-dark transition hover:bg-axc-red-dark/10 cursor-pointer"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
        />
      </div>
      <DeleteConfirmationDialog
        isOpen={Boolean(deleteTarget)}
        itemName={deleteTarget?.invoiceNumber}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}