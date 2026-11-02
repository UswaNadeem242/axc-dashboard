"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  PlusCircleIcon,
  FileText,
  Eye,
  Pencil,
  Trash2,
  Printer,
  X,
  Building2,
  Mail,
  MapPin,
} from "lucide-react";
import CommonTable from "@/app/src/common/table";
import FilterSearch from "@/app/src/common/filtersearch";
import Button from "@/app/src/common/button";
import DeleteConfirmationDialog from "@/app/src/common/deleteConfirmation";
import Dropdown from "@/app/src/common/dropdown";
import { showToast } from "@/app/src/common/toast";
import {
  CustomerEntry,
  CustomerHeadings,
  customerFilterGroups,
  initialCustomerData,
} from "./types";

export default function CustomerMasterPage() {
  const router = useRouter();
  const [data, setData] = useState<CustomerEntry[]>([]);
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);

  // Modals & Action State
  const [viewCustomer, setViewCustomer] = useState<CustomerEntry | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CustomerEntry | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  // Sorting & Pagination
  const [sortKey, setSortKey] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // LocalStorage Persistence
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("master_customers");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setData(parsed);
            return;
          }
        } catch (e) {
          console.error("Error reading stored customers:", e);
        }
      }
      setData(initialCustomerData);
      localStorage.setItem("master_customers", JSON.stringify(initialCustomerData));
    }
  }, []);

  const saveCustomers = (newList: CustomerEntry[]) => {
    setData(newList);
    if (typeof window !== "undefined") {
      localStorage.setItem("master_customers", JSON.stringify(newList));
    }
  };

  // Search filter submit
  const handleSearchSubmit = (val: string) => {
    const trimmed = val.trim();
    if (!trimmed) return;
    if (!activeTags.includes(trimmed)) {
      setActiveTags((prev) => [...prev, trimmed]);
      setSearchQuery("");
      setPage(1);
    }
  };

  const handleTagsChange = (newTags: string[]) => {
    const addedTag = newTags.find((tag) => !activeTags.includes(tag));
    if (addedTag) {
      const group = customerFilterGroups.find((g) =>
        g.options.some((o) => o.value === addedTag)
      );
      if (group) {
        const otherOptions = group.options
          .map((o) => o.value)
          .filter((v) => v !== addedTag);
        const filteredTags = newTags.filter((tag) => !otherOptions.includes(tag));
        setActiveTags(filteredTags);
        setPage(1);
        return;
      }
    }
    setActiveTags(newTags);
    setPage(1);
  };

  // Filtered & Sorted Data
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQuery =
          item.name.toLowerCase().includes(q) ||
          item.originCode.toLowerCase().includes(q) ||
          item.company.toLowerCase().includes(q) ||
          item.originHub.toLowerCase().includes(q) ||
          item.email.toLowerCase().includes(q) ||
          item.parentCustomer.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      if (activeTags.length > 0) {
        return activeTags.every((tag) => {
          return (
            item.company === tag ||
            item.originHub === tag ||
            item.paymentType === tag ||
            item.currency === tag ||
            item.name.toLowerCase().includes(tag.toLowerCase()) ||
            item.originCode.toLowerCase().includes(tag.toLowerCase())
          );
        });
      }

      return true;
    });
  }, [data, searchQuery, activeTags]);

  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      const valA = (a as any)[sortKey] ?? "";
      const valB = (b as any)[sortKey] ?? "";

      if (typeof valA === "number" && typeof valB === "number") {
        return sortDirection === "asc" ? valA - valB : valB - valA;
      }

      const strA = String(valA).toLowerCase();
      const strB = String(valB).toLowerCase();
      return sortDirection === "asc"
        ? strA.localeCompare(strB)
        : strB.localeCompare(strA);
    });
  }, [filteredData, sortKey, sortDirection]);

  // Paginated Data
  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, page, itemsPerPage]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  // Search suggestions
  const searchSuggestions = useMemo(() => {
    const names = data.map((c) => c.name).filter(Boolean);
    const codes = data.map((c) => c.originCode).filter(Boolean);
    const companies = data.map((c) => c.company).filter(Boolean);
    const hubs = data.map((c) => c.originHub).filter(Boolean);
    return Array.from(new Set([...names, ...codes, ...companies, ...hubs]));
  }, [data]);

  // Delete Handlers
  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setTimeout(() => {
      const updated = data.filter((c) => c.id !== deleteTarget.id);
      saveCustomers(updated);
      setSelectedIds((prev) => prev.filter((id) => id !== deleteTarget.id));
      setIsDeleting(false);
      setDeleteTarget(null);
      showToast({
        variant: "success",
        message: `Customer "${deleteTarget.name}" deleted successfully.`,
      });
    }, 300);
  };

  const handleBulkDeleteConfirm = () => {
    setIsDeleting(true);
    setTimeout(() => {
      const updated = data.filter((c) => !selectedIds.includes(c.id));
      saveCustomers(updated);
      const count = selectedIds.length;
      setSelectedIds([]);
      setIsDeleting(false);
      setBulkDeleteOpen(false);
      showToast({
        variant: "success",
        message: `${count} customers deleted successfully.`,
      });
    }, 300);
  };

  // Bulk Export to CSV
  const handleBulkExport = () => {
    const exportItems =
      selectedIds.length > 0
        ? data.filter((c) => selectedIds.includes(c.id))
        : data;

    if (exportItems.length === 0) {
      showToast({ variant: "error", message: "No customers available to export." });
      return;
    }

    const headers = [
      "Name",
      "Company",
      "Origin Hub",
      "Parent Customer",
      "Origin Code",
      "Email ID",
      "Address",
      "Currency",
      "Payment Type",
      "Credit Limit",
    ];

    const csvRows = exportItems.map((c) => [
      `"${c.name}"`,
      `"${c.company}"`,
      `"${c.originHub}"`,
      `"${c.parentCustomer}"`,
      `"${c.originCode}"`,
      `"${c.email}"`,
      `"${(c.address || "").replace(/"/g, '""')}"`,
      `"${c.currency}"`,
      `"${c.paymentType}"`,
      `"${c.creditLimit}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...csvRows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Customers_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast({
      variant: "success",
      message: `Exported ${exportItems.length} customer records to CSV.`,
    });
  };

  // Custom Table Renderers with exact field names
  const tableHeadings = CustomerHeadings.map((h) => {
    if (h.key === "srNo") {
      return {
        ...h,
        render: (_: any, idx?: number) => (
          <span className="text-gray-500 font-medium">
            {(page - 1) * itemsPerPage + (idx ?? 0) + 1}
          </span>
        ),
      };
    }
    if (h.key === "name") {
      return {
        ...h,
        render: (row: CustomerEntry) => (
          <span className="font-semibold text-gray-900">{row.name}</span>
        ),
      };
    }
    if (h.key === "originCode") {
      return {
        ...h,
        render: (row: CustomerEntry) => (
          <span className="font-semibold text-axc-navy bg-axc-navy/5 px-2 py-1 rounded text-[11px]">
            {row.originCode}
          </span>
        ),
      };
    }
    if (h.key === "originHub") {
      return {
        ...h,
        render: (row: CustomerEntry) => (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
            {row.originHub}
          </span>
        ),
      };
    }
    if (h.key === "creditLimit") {
      return {
        ...h,
        render: (row: CustomerEntry) => (
          <span className="font-semibold text-gray-800">
            {row.currency} {Number(row.creditLimit || 0).toLocaleString()}
          </span>
        ),
      };
    }
    if (h.key === "address") {
      return {
        ...h,
        render: (row: CustomerEntry) => (
          <span className="truncate max-w-[200px] block text-gray-600" title={row.address}>
            {row.address || "-"}
          </span>
        ),
      };
    }
    return h;
  });

  return (
    <div className="flex flex-col gap-4 w-full h-full min-h-0 overflow-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="relative bg-white p-4 rounded-lg border border-gray-200 w-full flex-1 min-h-0 flex flex-col overflow-hidden">
        {/* Top Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 shrink-0">
          <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
            <FilterSearch
              groups={customerFilterGroups}
              selectedOptions={activeTags}
              onOptionsChange={handleTagsChange}
              searchValue={searchQuery}
              onSearchChange={setSearchQuery}
              onSearchSubmit={handleSearchSubmit}
              placeholder="Search by Name, Origin Code, Company..."
              searchSuggestions={searchSuggestions}
            />

            {selectedIds.length > 0 && (
              <>
                <button
                  type="button"
                  onClick={() => setSelectedIds([])}
                  className="flex items-center gap-2 rounded-md border border-axc-border px-3 py-2 text-[12px] font-medium text-axc-dark-gray hover:bg-gray-50 cursor-pointer transition-colors"
                  title="Click to clear selection"
                >
                  {selectedIds.length} Selected
                </button>

                <div className="[&_button]:cursor-pointer">
                  <Dropdown
                    title="Actions"
                    items={[
                      {
                        label: "Export CSV",
                        icon: <FileText className="h-4 w-4" />,
                        onClick: handleBulkExport,
                      },
                      {
                        label: "Print List",
                        icon: <Printer className="h-4 w-4" />,
                        onClick: () => window.print(),
                      },
                      {
                        label: "Delete",
                        icon: <Trash2 className="h-4 w-4 text-red-500" />,
                        onClick: () => setBulkDeleteOpen(true),
                      },
                    ]}
                  />
                </div>
              </>
            )}
          </div>

          <Button
            label="New Customer"
            href="/master/customer/create"
            variant="primary"
            icon={PlusCircleIcon}
          />
        </div>

        {/* Active Filter Tags */}
        {activeTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-3 shrink-0">
            {activeTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-axc-navy/20 bg-axc-navy/5 text-axc-navy"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => setActiveTags((prev) => prev.filter((t) => t !== tag))}
                  className="hover:text-red-500 transition cursor-pointer"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
            <button
              type="button"
              onClick={() => setActiveTags([])}
              className="text-xs text-axc-gray hover:text-axc-navy underline transition cursor-pointer ml-1"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Common Table */}
        <div className="flex-1 min-h-0 flex flex-col">
          <CommonTable
            headings={tableHeadings}
            data={paginatedData}
            currentPage={page}
            onPageChange={setPage}
            itemsPerPage={itemsPerPage}
            sortKey={sortKey}
            sortDirection={sortDirection}
            onSort={handleSort}
            selectable={true}
            rowKey="id"
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            showScroll={true}
            emptyMessage="No customer records found"
            renderActions={(row: CustomerEntry) => (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setViewCustomer(row)}
                  title="View"
                  className="p-1 rounded text-axc-gray hover:text-axc-navy hover:bg-gray-100 transition cursor-pointer"
                >
                  <Eye size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => router.push(`/master/customer/create?edit=${row.id}`)}
                  title="Edit"
                  className="p-1 rounded text-axc-gray hover:text-axc-navy hover:bg-gray-100 transition cursor-pointer"
                >
                  <Pencil size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(row)}
                  title="Delete"
                  className="p-1 rounded text-axc-gray hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            )}
          />
        </div>
      </div>

      {/* View Customer Details Modal */}
      {viewCustomer && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setViewCustomer(null)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl border border-axc-border max-w-xl w-full p-6 relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-axc-border mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-axc-navy/10 text-axc-navy rounded-lg">
                  <Building2 size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-axc-dark-gray">
                    {viewCustomer.name}
                  </h3>
                  <span className="text-xs font-semibold text-axc-navy">
                    {viewCustomer.originCode}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewCustomer(null)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 cursor-pointer transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Exact 10 Fields Displayed */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="flex flex-col gap-1 p-2.5 rounded-lg bg-gray-50">
                <span className="text-gray-400 font-medium">Name</span>
                <span className="font-semibold text-gray-800">{viewCustomer.name}</span>
              </div>

              <div className="flex flex-col gap-1 p-2.5 rounded-lg bg-gray-50">
                <span className="text-gray-400 font-medium">Company</span>
                <span className="font-semibold text-gray-800">{viewCustomer.company}</span>
              </div>

              <div className="flex flex-col gap-1 p-2.5 rounded-lg bg-gray-50">
                <span className="text-gray-400 font-medium">Origin Hub</span>
                <span className="font-semibold text-gray-800">{viewCustomer.originHub}</span>
              </div>

              <div className="flex flex-col gap-1 p-2.5 rounded-lg bg-gray-50">
                <span className="text-gray-400 font-medium">Parent Customer</span>
                <span className="font-semibold text-gray-800">
                  {viewCustomer.parentCustomer || "None"}
                </span>
              </div>

              <div className="flex flex-col gap-1 p-2.5 rounded-lg bg-gray-50">
                <span className="text-gray-400 font-medium">Origin Code</span>
                <span className="font-semibold text-axc-navy">{viewCustomer.originCode}</span>
              </div>

              <div className="flex flex-col gap-1 p-2.5 rounded-lg bg-gray-50">
                <span className="text-gray-400 font-medium">Currency</span>
                <span className="font-semibold text-gray-800">{viewCustomer.currency}</span>
              </div>

              <div className="flex flex-col gap-1 p-2.5 rounded-lg bg-gray-50">
                <span className="text-gray-400 font-medium">Payment Type</span>
                <span className="font-semibold text-gray-800">{viewCustomer.paymentType}</span>
              </div>

              <div className="flex flex-col gap-1 p-2.5 rounded-lg bg-gray-50">
                <span className="text-gray-400 font-medium">Credit Limit</span>
                <span className="font-bold text-axc-navy">
                  {viewCustomer.currency}{" "}
                  {Number(viewCustomer.creditLimit || 0).toLocaleString()}
                </span>
              </div>

              <div className="flex flex-col gap-1 p-2.5 rounded-lg bg-gray-50 col-span-2">
                <span className="text-gray-400 font-medium">Email ID</span>
                <span className="font-semibold text-gray-800 flex items-center gap-1.5">
                  <Mail size={13} className="text-gray-400" />
                  {viewCustomer.email}
                </span>
              </div>

              <div className="flex flex-col gap-1 p-2.5 rounded-lg bg-gray-50 col-span-2">
                <span className="text-gray-400 font-medium">Address</span>
                <span className="font-medium text-gray-700 flex items-start gap-1.5 leading-relaxed">
                  <MapPin size={14} className="text-gray-400 shrink-0 mt-0.5" />
                  {viewCustomer.address || "No Address"}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 mt-5 pt-3 border-t border-axc-border">
              <button
                type="button"
                onClick={() => setViewCustomer(null)}
                className="px-4 py-2 rounded-lg border border-axc-border text-xs font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const id = viewCustomer.id;
                  setViewCustomer(null);
                  router.push(`/master/customer/create?edit=${id}`);
                }}
                className="px-4 py-2 rounded-lg bg-axc-navy text-xs font-semibold text-white hover:bg-axc-navy/90 transition cursor-pointer"
              >
                Edit Customer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={Boolean(deleteTarget)}
        itemName={deleteTarget?.name}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* Bulk Delete Dialog */}
      <DeleteConfirmationDialog
        isOpen={bulkDeleteOpen}
        itemName={`${selectedIds.length} ${
          selectedIds.length === 1 ? "customer" : "customers"
        }`}
        onCancel={() => setBulkDeleteOpen(false)}
        onConfirm={handleBulkDeleteConfirm}
      />
    </div>
  );
}
