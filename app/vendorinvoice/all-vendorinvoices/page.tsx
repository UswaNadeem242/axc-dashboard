"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  PlusCircleIcon,
  Eye,
  FileSpreadsheet,
  FileWarning,
  FileArchive,
  Trash2,
} from "lucide-react";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const [sortKey, setSortKey] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const [deleteTarget, setDeleteTarget] = useState<VendorInvoiceEntry | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
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
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && data.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [data]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);
  const handleView = (row: VendorInvoiceEntry) =>
    router.push(`/vendor-invoice/view/${row.invoiceNumber}`);

  const handleMissingAwbExport = (row: VendorInvoiceEntry) =>
    console.log("Missing AWB Export", row.invoiceNumber);
  

  const handleDelete = (row: VendorInvoiceEntry) => setDeleteTarget(row);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setData((prev) =>
      prev.filter((item) => item.invoiceNumber !== deleteTarget.invoiceNumber)
    );
    setIsDeleting(false);
    setDeleteTarget(null);
  };

  const cancelDelete = () => {
    if (isDeleting) return;
    setDeleteTarget(null);
  };
  const filteredData = data.filter((item) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;

    const terms = query.split(",").map((q) => q.trim()).filter(Boolean);
    return terms.some(
      (term) =>
        (item.vendor || "").toLowerCase().includes(term) ||
        (item.invoiceNumber || "").toLowerCase().includes(term) ||
        (item.invoiceDate || "").toLowerCase().includes(term) ||
        (item.createdDate || "").toLowerCase().includes(term) ||
        String(item.missingAwbCount).includes(term)
    );
  });
  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortKey) return 0;
    const aVal = (a as Record<string, any>)[sortKey] ?? "";
    const bVal = (b as Record<string, any>)[sortKey] ?? "";
    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
    }
    return sortDirection === "asc"
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal));
  });
  const paginatedData = sortedData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const tableHeadings = VendorInvoiceHeading.map((h) => {
    if (h.key === "srNo") {
      return {
        ...h,
        render: (_row: VendorInvoiceEntry, idx?: number) => (
          <span className="font-medium text-axc-dark-gray">
            {idx !== undefined ? (page - 1) * itemsPerPage + idx + 1 : _row.srNo}
          </span>
        ),
      };
    }
    if (h.key === "vendor") {
      return {
        ...h,
        render: (row: VendorInvoiceEntry) => (
          <span className="font-medium text-axc-navy">{row.vendor}</span>
        ),
      };
    }
    if (h.key === "invoiceDate") {
      return {
        ...h,
        render: (row: VendorInvoiceEntry) => <span>{row.invoiceDate || "-"}</span>,
      };
    }
    return h;
  });

  const iconBtn =
    "inline-flex items-center justify-center rounded-md border p-1.5 transition cursor-pointer";

  return (
    <div className="relative bg-white p-4 rounded-lg w-full flex-1 flex flex-col min-h-0 shadow-sm border border-axc-border overflow-x-hidden overflow-y-scroll [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-axc-gray/40 [&::-webkit-scrollbar-thumb]:rounded-lg">
      <div className="flex flex-wrap justify-between items-center gap-3 mb-4 shrink-0">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search vendor / invoice no. (comma separated)"
          className="h-9 w-full max-w-sm rounded-md border border-axc-border px-3 text-sm outline-none focus:border-axc-navy"
        />
        <Button
          label="New Vendor Invoice"
          href="/import"
          variant="primary"
          icon={PlusCircleIcon}
        />
      </div>

      <div className="mb-2 text-xs text-axc-dark-gray shrink-0">
        Total No. of Vendor Invoice: {data.length} &nbsp;|&nbsp; Total Display:{" "}
        {filteredData.length}
      </div>

      <div className="flex-1 min-h-0 flex flex-col">
        <CommonTable
          headings={tableHeadings}
          data={paginatedData}
          currentPage={page}
          onPageChange={setPage}
          itemsPerPage={itemsPerPage}
          showScroll={true}
          renderActions={(row: VendorInvoiceEntry) => (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleView(row)}
                className={`${iconBtn} border-axc-navy/30 text-axc-navy hover:bg-axc-navy/10`}
                title="View"
              >
                <Eye size={16} />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(row)}
                className={`${iconBtn} border-axc-red-dark/30 text-axc-red-dark hover:bg-axc-red-dark/10`}
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