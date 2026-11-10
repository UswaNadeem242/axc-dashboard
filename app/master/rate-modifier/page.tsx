"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  PlusCircleIcon,
  FileText,
  Eye,
  Pencil,
  Trash2,
  X,
  Sliders,
} from "lucide-react";
import CommonTable from "@/app/src/common/table";
import FilterSearch from "@/app/src/common/filtersearch";
import Button from "@/app/src/common/button";
import DeleteConfirmationDialog from "@/app/src/common/deleteConfirmation";
import Dropdown from "@/app/src/common/dropdown";
import { showToast } from "@/app/src/common/toast";
import { api } from "@/app/src/lib/api";
import {
  RateModifierEntry,
  RateModifierHeadings,
  rateModifierFilterGroups,
  initialRateModifierData,
} from "./types";

export default function RateModifierMasterPage() {
  const router = useRouter();
  const [data, setData] = useState<RateModifierEntry[]>([]);
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);

  // Modals & Action State
  const [viewModifier, setViewModifier] = useState<RateModifierEntry | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<RateModifierEntry | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  // Sorting & Pagination
  const [sortKey, setSortKey] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // Backend API + LocalStorage Persistence
  useEffect(() => {
    let mounted = true;
    async function loadData() {
      try {
        const list = await api.getMasterList<RateModifierEntry>("/rate-modifiers");
        if (mounted && Array.isArray(list)) {
          setData(list);
          if (typeof window !== "undefined") {
            localStorage.setItem("master_rate_modifiers", JSON.stringify(list));
          }
          return;
        }
      } catch (err) {
        console.warn("API unavailable, falling back to localStorage:", err);
      }
      if (mounted && typeof window !== "undefined") {
        const stored = localStorage.getItem("master_rate_modifiers");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setData(parsed);
              return;
            }
          } catch (e) {
            console.error("Error reading stored rate modifiers:", e);
          }
        }
        setData(initialRateModifierData);
        localStorage.setItem("master_rate_modifiers", JSON.stringify(initialRateModifierData));
      }
    }
    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  const saveModifiers = (newList: RateModifierEntry[]) => {
    setData(newList);
    if (typeof window !== "undefined") {
      localStorage.setItem("master_rate_modifiers", JSON.stringify(newList));
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
      const group = rateModifierFilterGroups.find((g) =>
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

  // Tag removal
  const handleRemoveTag = (tagToRemove: string) => {
    setActiveTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  // Filter Data
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // 1. Text Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQuery =
          item.charge.toLowerCase().includes(q) ||
          item.billingType.toLowerCase().includes(q) ||
          (item.insuranceType && item.insuranceType.toLowerCase().includes(q)) ||
          (item.paymentMethod && item.paymentMethod.toLowerCase().includes(q)) ||
          (item.dispatchType && item.dispatchType.toLowerCase().includes(q));
        if (!matchesQuery) return false;
      }

      // 2. Active filter tags
      if (activeTags.length > 0) {
        const matchesTags = activeTags.every((tag) => {
          const lowerTag = tag.toLowerCase();
          return (
            item.status?.toLowerCase() === lowerTag ||
            item.billingType?.toLowerCase() === lowerTag ||
            item.dispatchType?.toLowerCase() === lowerTag ||
            item.charge?.toLowerCase().includes(lowerTag)
          );
        });
        if (!matchesTags) return false;
      }

      return true;
    });
  }, [data, searchQuery, activeTags]);

  // Sorting
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      const valA = (a as any)[sortKey] ?? "";
      const valB = (b as any)[sortKey] ?? "";
      if (typeof valA === "number" && typeof valB === "number") {
        return sortDirection === "asc" ? valA - valB : valB - valA;
      }
      return sortDirection === "asc"
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  }, [filteredData, sortKey, sortDirection]);

  // Pagination
  const paginatedData = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return sortedData.slice(start, start + itemsPerPage);
  }, [sortedData, page, itemsPerPage]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  // Delete Handlers
  const handleConfirmSingleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await api.deleteMasterItem("/rate-modifiers", deleteTarget.id);
    } catch (err) {
      console.warn("API delete fallback:", err);
    }
    const updated = data.filter((r) => String(r.id) !== String(deleteTarget.id));
    saveModifiers(updated);
    setSelectedIds((prev) => prev.filter((i) => String(i) !== String(deleteTarget.id)));
    showToast({
      variant: "success",
      message: `Rate Modifier "${deleteTarget.charge}" deleted successfully.`,
    });
    setIsDeleting(false);
    setDeleteTarget(null);
  };

  const handleConfirmBulkDelete = async () => {
    setIsDeleting(true);
    try {
      await api.bulkDeleteMasterItems("/rate-modifiers", selectedIds);
    } catch (err) {
      console.warn("API bulk delete fallback:", err);
    }
    const updated = data.filter((r) => !selectedIds.includes(r.id));
    saveModifiers(updated);
    showToast({
      variant: "success",
      message: `${selectedIds.length} rate modifiers deleted successfully.`,
    });
    setSelectedIds([]);
    setIsDeleting(false);
    setBulkDeleteOpen(false);
  };

  // Export CSV
  const handleExport = (all: boolean = false) => {
    const exportItems = all
      ? data
      : selectedIds.length > 0
      ? data.filter((r) => selectedIds.includes(r.id))
      : data;

    if (exportItems.length === 0) {
      showToast({ variant: "error", message: "No rate modifiers to export." });
      return;
    }

    const headers = [
      "Sr No",
      "Charge",
      "Billing Type",
      "Insurance Type",
      "Payment Method",
      "Fixed Amount",
      "Min Amount",
      "% on Freight",
      "% on Shipment Value",
      "% on Freight & FSC",
      "Dispatch Type",
      "Status",
      "Created Date",
    ];

    const csvRows = exportItems.map((r) => [
      r.srNo,
      `"${r.charge}"`,
      `"${r.billingType}"`,
      `"${r.insuranceType}"`,
      `"${r.paymentMethod}"`,
      `"${r.fixedAmount}"`,
      `"${r.minAmount}"`,
      `"${r.percentageOnFreight}"`,
      `"${r.percentageOnShipmentValue}"`,
      `"${r.percentageOnFreightAndFsc}"`,
      `"${r.dispatchType}"`,
      `"${r.status}"`,
      `"${r.createdAt}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...csvRows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `RateModifiers_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast({
      variant: "success",
      message: `Exported ${exportItems.length} rate modifier records.`,
    });
  };

  // Autocomplete suggestions
  const searchSuggestions = useMemo(() => {
    const set = new Set<string>();
    data.forEach((item) => {
      if (item.charge) set.add(item.charge);
      if (item.billingType) set.add(item.billingType);
      if (item.dispatchType) set.add(item.dispatchType);
      if (item.paymentMethod) set.add(item.paymentMethod);
    });
    return Array.from(set);
  }, [data]);

  // Table Column Renderers with Exact AWB Look & Feel
  const tableHeadings = RateModifierHeadings.map((h) => {
    if (h.key === "srNo") {
      return {
        ...h,
        render: (_: any, idx?: number) => (
          <span className="text-gray-500 font-medium text-xs">
            {(page - 1) * itemsPerPage + (idx ?? 0) + 1}
          </span>
        ),
      };
    }
    if (h.key === "charge") {
      return {
        ...h,
        render: (row: RateModifierEntry) => (
          <span className="font-semibold text-gray-900 text-xs">
            {row.charge}
          </span>
        ),
      };
    }
    if (h.key === "billingType") {
      return {
        ...h,
        render: (row: RateModifierEntry) => (
          <span className="font-semibold text-axc-navy bg-axc-navy/5 px-2.5 py-1 rounded text-xs border border-axc-navy/15 inline-block">
            {row.billingType}
          </span>
        ),
      };
    }
    if (h.key === "customer") {
      return {
        ...h,
        render: (row: RateModifierEntry) => (
          <span className="text-gray-900 font-medium text-xs">
            {row.customer || "-"}
          </span>
        ),
      };
    }
    if (h.key === "vendor") {
      return {
        ...h,
        render: (row: RateModifierEntry) => (
          <span className="text-gray-700 text-xs">
            {row.vendor || "-"}
          </span>
        ),
      };
    }
    if (h.key === "originHub") {
      return {
        ...h,
        render: (row: RateModifierEntry) => (
          <span className="text-gray-700 text-xs font-semibold">
            {row.originHub || row.originLocation || "-"}
          </span>
        ),
      };
    }
    if (h.key === "destinationHub") {
      return {
        ...h,
        render: (row: RateModifierEntry) => (
          <span className="text-gray-700 text-xs font-semibold">
            {row.destinationHub || row.destinationLocation || "-"}
          </span>
        ),
      };
    }
    if (h.key === "insuranceType") {
      return {
        ...h,
        render: (row: RateModifierEntry) => (
          <span className="text-gray-700 text-xs font-medium">
            {row.insuranceType || "-"}
          </span>
        ),
      };
    }
    if (h.key === "paymentMethod") {
      return {
        ...h,
        render: (row: RateModifierEntry) => (
          <span className="text-gray-700 text-xs font-medium">
            {row.paymentMethod || "-"}
          </span>
        ),
      };
    }
    if (h.key === "fixedAmount") {
      return {
        ...h,
        render: (row: RateModifierEntry) => (
          <span className="font-semibold text-gray-900 text-xs">
            {row.fixedAmount ? `$${row.fixedAmount}` : "-"}
          </span>
        ),
      };
    }
    if (h.key === "minAmount") {
      return {
        ...h,
        render: (row: RateModifierEntry) => (
          <span className="text-gray-700 text-xs font-medium">
            {row.minAmount ? `$${row.minAmount}` : "-"}
          </span>
        ),
      };
    }
    if (h.key === "effectivePeriod") {
      return {
        ...h,
        render: (row: RateModifierEntry) => (
          <span className="text-gray-700 text-xs">
            {row.effectiveFrom || row.effectiveTo
              ? `${row.effectiveFrom || "-"} to ${row.effectiveTo || "-"}`
              : "-"}
          </span>
        ),
      };
    }
    if (h.key === "percentageOnFreight") {
      return {
        ...h,
        render: (row: RateModifierEntry) => (
          <span className="text-gray-700 text-xs font-medium">
            {row.percentageOnFreight || "-"}
          </span>
        ),
      };
    }
    if (h.key === "percentageOnShipmentValue") {
      return {
        ...h,
        render: (row: RateModifierEntry) => (
          <span className="text-gray-700 text-xs font-medium">
            {row.percentageOnShipmentValue || "-"}
          </span>
        ),
      };
    }
    if (h.key === "dispatchType") {
      return {
        ...h,
        render: (row: RateModifierEntry) => (
          <span className="text-gray-600 text-xs">
            {row.dispatchType || "-"}
          </span>
        ),
      };
    }
    if (h.key === "status") {
      return {
        ...h,
        render: (row: RateModifierEntry) => (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
              row.status === "ACTIVE"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-red-50 text-red-600 border-red-200"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                row.status === "ACTIVE" ? "bg-emerald-500" : "bg-red-500"
              }`}
            />
            {row.status === "ACTIVE" ? "Active" : "Inactive"}
          </span>
        ),
      };
    }
    if (h.key === "action") {
      return {
        ...h,
        render: (row: RateModifierEntry) => (
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setViewModifier(row)}
              className="inline-flex items-center justify-center rounded-md border border-axc-navy/30 p-1.5 text-axc-navy transition hover:bg-axc-navy/10 cursor-pointer"
              title="View Details"
            >
              <Eye size={15} />
            </button>
            <button
              type="button"
              onClick={() => router.push(`/master/rate-modifier/create?edit=${row.id}`)}
              className="inline-flex items-center justify-center rounded-md border border-axc-navy/30 p-1.5 text-axc-navy transition hover:bg-axc-navy/10 cursor-pointer"
              title="Edit Rate Modifier"
            >
              <Pencil size={15} />
            </button>
            <button
              type="button"
              onClick={() => setDeleteTarget(row)}
              className="inline-flex items-center justify-center rounded-md border border-red-300 p-1.5 text-red-600 transition hover:bg-red-50 cursor-pointer"
              title="Delete Rate Modifier"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ),
      };
    }
    return h;
  });

  return (
    <div className="flex flex-col gap-4 w-full h-full min-h-0 overflow-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="relative bg-white p-4 rounded-lg w-full flex-1 flex flex-col min-h-0 shadow-sm border border-axc-border overflow-hidden">
        {/* Top Controls Bar (Exact AWB Layout) */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 shrink-0">
          <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
            <FilterSearch
              groups={rateModifierFilterGroups}
              selectedOptions={activeTags}
              onOptionsChange={handleTagsChange}
              searchValue={searchQuery}
              onSearchChange={setSearchQuery}
              onSearchSubmit={handleSearchSubmit}
              placeholder="Search by Charge, Billing Type, Dispatch..."
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
                  <span className="font-semibold text-axc-navy">{selectedIds.length}</span>
                  Selected
                  <X size={13} className="text-gray-400" />
                </button>

                <div className="[&_button]:cursor-pointer">
                  <Dropdown
                    title="Actions"
                    items={[
                      {
                        label: "Export Selected (CSV)",
                        icon: <FileText className="h-4 w-4 text-axc-navy" />,
                        onClick: () => handleExport(false),
                      },
                      {
                        label: `Delete Selected (${selectedIds.length})`,
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
            label="New Rate Modifier"
            href="/master/rate-modifier/create"
            variant="primary"
            icon={PlusCircleIcon}
          />
        </div>

        {/* Active Filter Tags */}
        {activeTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pb-3 border-b border-gray-100 mb-3 shrink-0">
            <span className="text-xs text-gray-500 font-medium mr-1">
              Active Filters:
            </span>
            {activeTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-axc-navy/10 text-axc-navy font-medium border border-axc-navy/20"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-red-500 transition-colors ml-0.5 cursor-pointer"
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

        {/* Common Table with AWB Styling */}
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
            emptyMessage={
              activeTags.length > 0 || searchQuery
                ? "No rate modifiers found matching your filters."
                : "No rate modifier records found. Click 'New Rate Modifier' to add one."
            }
          />
        </div>
      </div>

      {/* ── View Details Modal ── */}
      {viewModifier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-axc-navy/5">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-lg bg-axc-navy text-white">
                  <Sliders size={18} />
                </span>
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    {viewModifier.charge}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Billing: {viewModifier.billingType} • Method: {viewModifier.paymentMethod || "N/A"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewModifier(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-100 flex flex-col gap-1">
                <span className="text-gray-400 font-semibold uppercase text-[10px]">CHARGE</span>
                <span className="font-bold text-gray-900">{viewModifier.charge}</span>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-100 flex flex-col gap-1">
                <span className="text-gray-400 font-semibold uppercase text-[10px]">BILLING TYPE</span>
                <span className="font-bold text-axc-navy">{viewModifier.billingType}</span>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-100 flex flex-col gap-1">
                <span className="text-gray-400 font-semibold uppercase text-[10px]">INSURANCE TYPE</span>
                <span className="font-medium text-gray-700">{viewModifier.insuranceType || "None"}</span>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-100 flex flex-col gap-1">
                <span className="text-gray-400 font-semibold uppercase text-[10px]">PAYMENT METHOD</span>
                <span className="font-medium text-gray-700">{viewModifier.paymentMethod || "None"}</span>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-100 flex flex-col gap-1">
                <span className="text-gray-400 font-semibold uppercase text-[10px]">FIXED AMOUNT</span>
                <span className="font-bold text-gray-900">{viewModifier.fixedAmount ? `$${viewModifier.fixedAmount}` : "-"}</span>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-100 flex flex-col gap-1">
                <span className="text-gray-400 font-semibold uppercase text-[10px]">MIN AMOUNT</span>
                <span className="font-medium text-gray-700">{viewModifier.minAmount ? `$${viewModifier.minAmount}` : "-"}</span>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-100 flex flex-col gap-1">
                <span className="text-gray-400 font-semibold uppercase text-[10px]">PERCENTAGE ON FREIGHT</span>
                <span className="font-medium text-gray-700">{viewModifier.percentageOnFreight || "-"}</span>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-100 flex flex-col gap-1">
                <span className="text-gray-400 font-semibold uppercase text-[10px]">PERCENTAGE ON SHIPMENT VALUE</span>
                <span className="font-medium text-gray-700">{viewModifier.percentageOnShipmentValue || "-"}</span>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-100 flex flex-col gap-1">
                <span className="text-gray-400 font-semibold uppercase text-[10px]">PERCENTAGE ON FREIGHT & FSC</span>
                <span className="font-medium text-gray-700">{viewModifier.percentageOnFreightAndFsc || "-"}</span>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-100 flex flex-col gap-1">
                <span className="text-gray-400 font-semibold uppercase text-[10px]">DISPATCH TYPE</span>
                <span className="font-medium text-gray-700">{viewModifier.dispatchType || "-"}</span>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-100 flex flex-col gap-1">
                <span className="text-gray-400 font-semibold uppercase text-[10px]">STATUS</span>
                <span className={viewModifier.status === "ACTIVE" ? "text-emerald-700 font-bold" : "text-red-600 font-bold"}>
                  {viewModifier.status}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-100 flex flex-col gap-1">
                <span className="text-gray-400 font-semibold uppercase text-[10px]">CREATED DATE</span>
                <span className="font-medium text-gray-700">{viewModifier.createdAt}</span>
              </div>

              {/* Weight & Dimension Limits Block */}
              <div className="col-span-full border-t border-gray-200 pt-3 mt-1">
                <h4 className="font-bold text-gray-700 uppercase tracking-wide text-[11px] mb-2">
                  Weight & Dimension Limits
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <div className="p-2 bg-gray-50 rounded border border-gray-100">
                    <span className="text-gray-400 block text-[10px] uppercase">Chargeable Wt</span>
                    <span className="font-semibold text-gray-800">
                      {viewModifier.minChargeableWeight || "-"} to {viewModifier.maxChargeableWeight || "-"}
                    </span>
                  </div>
                  <div className="p-2 bg-gray-50 rounded border border-gray-100">
                    <span className="text-gray-400 block text-[10px] uppercase">Actual Wt</span>
                    <span className="font-semibold text-gray-800">
                      {viewModifier.minActualWeight || "-"} to {viewModifier.maxActualWeight || "-"}
                    </span>
                  </div>
                  <div className="p-2 bg-gray-50 rounded border border-gray-100">
                    <span className="text-gray-400 block text-[10px] uppercase">Volume Wt</span>
                    <span className="font-semibold text-gray-800">
                      {viewModifier.minVolumeWeight || "-"} to {viewModifier.maxVolumeWeight || "-"}
                    </span>
                  </div>
                  <div className="p-2 bg-gray-50 rounded border border-gray-100">
                    <span className="text-gray-400 block text-[10px] uppercase">No of Boxes</span>
                    <span className="font-semibold text-gray-800">
                      {viewModifier.minNoOfBoxes || "-"} to {viewModifier.maxNoOfBoxes || "-"}
                    </span>
                  </div>
                  <div className="p-2 bg-gray-50 rounded border border-gray-100">
                    <span className="text-gray-400 block text-[10px] uppercase">Dimension</span>
                    <span className="font-semibold text-gray-800">
                      {viewModifier.minDimension || "-"} to {viewModifier.maxDimension || "-"}
                    </span>
                  </div>
                  <div className="p-2 bg-gray-50 rounded border border-gray-100">
                    <span className="text-gray-400 block text-[10px] uppercase">Per Box Actual Wt</span>
                    <span className="font-semibold text-gray-800">
                      {viewModifier.minPerBoxActualWeight || "-"} to {viewModifier.maxPerBoxActualWeight || "-"}
                    </span>
                  </div>
                  <div className="p-2 bg-gray-50 rounded border border-gray-100">
                    <span className="text-gray-400 block text-[10px] uppercase">Per Box Vol Wt</span>
                    <span className="font-semibold text-gray-800">
                      {viewModifier.minPerBoxVolumetricWeight || "-"} to {viewModifier.maxPerBoxVolumetricWeight || "-"}
                    </span>
                  </div>
                  <div className="p-2 bg-gray-50 rounded border border-gray-100">
                    <span className="text-gray-400 block text-[10px] uppercase">Per Box Chargeable Wt</span>
                    <span className="font-semibold text-gray-800">
                      {viewModifier.minPerBoxChargeableWeight || "-"} to {viewModifier.maxPerBoxChargeableWeight || "-"}
                    </span>
                  </div>
                  <div className="p-2 bg-gray-50 rounded border border-gray-100">
                    <span className="text-gray-400 block text-[10px] uppercase">Shipment Value</span>
                    <span className="font-semibold text-gray-800">
                      {viewModifier.minShipmentValue ? `$${viewModifier.minShipmentValue}` : "-"} to {viewModifier.maxShipmentValue ? `$${viewModifier.maxShipmentValue}` : "-"}
                    </span>
                  </div>
                  <div className="p-2 bg-gray-50 rounded border border-gray-100">
                    <span className="text-gray-400 block text-[10px] uppercase">Flight Number</span>
                    <span className="font-semibold text-gray-800">
                      {viewModifier.flightNumber || "-"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Routing & Entity Details Block */}
              <div className="col-span-full border-t border-gray-200 pt-3 mt-1">
                <h4 className="font-bold text-gray-700 uppercase tracking-wide text-[11px] mb-2">
                  Routing & Entity Details
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <div className="p-2 bg-gray-50 rounded border border-gray-100">
                    <span className="text-gray-400 block text-[10px] uppercase">Customer</span>
                    <span className="font-semibold text-gray-800">{viewModifier.customer || "-"}</span>
                  </div>
                  <div className="p-2 bg-gray-50 rounded border border-gray-100">
                    <span className="text-gray-400 block text-[10px] uppercase">Product</span>
                    <span className="font-semibold text-gray-800">{viewModifier.product || "-"}</span>
                  </div>
                  <div className="p-2 bg-gray-50 rounded border border-gray-100">
                    <span className="text-gray-400 block text-[10px] uppercase">Service</span>
                    <span className="font-semibold text-gray-800">{viewModifier.service || "-"}</span>
                  </div>
                  <div className="p-2 bg-gray-50 rounded border border-gray-100">
                    <span className="text-gray-400 block text-[10px] uppercase">Vendor</span>
                    <span className="font-semibold text-gray-800">{viewModifier.vendor || "-"}</span>
                  </div>
                  <div className="p-2 bg-gray-50 rounded border border-gray-100">
                    <span className="text-gray-400 block text-[10px] uppercase">Origin Location</span>
                    <span className="font-semibold text-gray-800">{viewModifier.originLocation || "-"}</span>
                  </div>
                  <div className="p-2 bg-gray-50 rounded border border-gray-100">
                    <span className="text-gray-400 block text-[10px] uppercase">Destination Location</span>
                    <span className="font-semibold text-gray-800">{viewModifier.destinationLocation || "-"}</span>
                  </div>
                  <div className="p-2 bg-gray-50 rounded border border-gray-100">
                    <span className="text-gray-400 block text-[10px] uppercase">Origin Zone</span>
                    <span className="font-semibold text-gray-800">{viewModifier.originZone || "-"}</span>
                  </div>
                  <div className="p-2 bg-gray-50 rounded border border-gray-100">
                    <span className="text-gray-400 block text-[10px] uppercase">Destination Zone</span>
                    <span className="font-semibold text-gray-800">{viewModifier.destinationZone || "-"}</span>
                  </div>
                  <div className="p-2 bg-gray-50 rounded border border-gray-100">
                    <span className="text-gray-400 block text-[10px] uppercase">Origin Hub</span>
                    <span className="font-semibold text-gray-800">{viewModifier.originHub || "-"}</span>
                  </div>
                  <div className="p-2 bg-gray-50 rounded border border-gray-100">
                    <span className="text-gray-400 block text-[10px] uppercase">Destination Hub</span>
                    <span className="font-semibold text-gray-800">{viewModifier.destinationHub || "-"}</span>
                  </div>
                  <div className="p-2 bg-gray-50 rounded border border-gray-100">
                    <span className="text-gray-400 block text-[10px] uppercase">Origin State</span>
                    <span className="font-semibold text-gray-800">{viewModifier.originState || "-"}</span>
                  </div>
                  <div className="p-2 bg-gray-50 rounded border border-gray-100">
                    <span className="text-gray-400 block text-[10px] uppercase">Destination State</span>
                    <span className="font-semibold text-gray-800">{viewModifier.destinationState || "-"}</span>
                  </div>
                  <div className="p-2 bg-gray-50 rounded border border-gray-100">
                    <span className="text-gray-400 block text-[10px] uppercase">Origin City</span>
                    <span className="font-semibold text-gray-800">{viewModifier.originCity || "-"}</span>
                  </div>
                  <div className="p-2 bg-gray-50 rounded border border-gray-100">
                    <span className="text-gray-400 block text-[10px] uppercase">Destination City</span>
                    <span className="font-semibold text-gray-800">{viewModifier.destinationCity || "-"}</span>
                  </div>
                  <div className="p-2 bg-gray-50 rounded border border-gray-100">
                    <span className="text-gray-400 block text-[10px] uppercase">Origin Pincode</span>
                    <span className="font-semibold text-gray-800">{viewModifier.originPincode || "-"}</span>
                  </div>
                  <div className="p-2 bg-gray-50 rounded border border-gray-100">
                    <span className="text-gray-400 block text-[10px] uppercase">Destination Pincode</span>
                    <span className="font-semibold text-gray-800">{viewModifier.destinationPincode || "-"}</span>
                  </div>
                  <div className="p-2 bg-gray-50 rounded border border-gray-100 col-span-2">
                    <span className="text-gray-400 block text-[10px] uppercase">Docket Content</span>
                    <span className="font-semibold text-gray-800">{viewModifier.docketContent || "-"}</span>
                  </div>
                </div>
              </div>

              {/* Validity & Rate Calculation Block */}
              <div className="col-span-full border-t border-gray-200 pt-3 mt-1">
                <h4 className="font-bold text-gray-700 uppercase tracking-wide text-[11px] mb-2">
                  Validity & Rate Calculation
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <div className="p-2 bg-gray-50 rounded border border-gray-100">
                    <span className="text-gray-400 block text-[10px] uppercase">Effective From</span>
                    <span className="font-semibold text-gray-800">{viewModifier.effectiveFrom || "-"}</span>
                  </div>
                  <div className="p-2 bg-gray-50 rounded border border-gray-100">
                    <span className="text-gray-400 block text-[10px] uppercase">Effective To</span>
                    <span className="font-semibold text-gray-800">{viewModifier.effectiveTo || "-"}</span>
                  </div>
                  <div className="p-2 bg-gray-50 rounded border border-gray-100">
                    <span className="text-gray-400 block text-[10px] uppercase">Rate Per</span>
                    <span className="font-semibold text-gray-800">{viewModifier.ratePer || "-"}</span>
                  </div>
                  <div className="p-2 bg-gray-50 rounded border border-gray-100">
                    <span className="text-gray-400 block text-[10px] uppercase">Per PC Dimension</span>
                    <span className="font-semibold text-gray-800">
                      {viewModifier.minDimensionPerPcs ? "Min PCS " : ""}
                      {viewModifier.maxDimensionPerPcs ? "Max PCS" : ""}
                      {!viewModifier.minDimensionPerPcs && !viewModifier.maxDimensionPerPcs ? "None" : ""}
                    </span>
                  </div>
                </div>
              </div>

              {/* Special Conditions, Surcharges & Grith/High Value Block */}
              <div className="col-span-full border-t border-gray-200 pt-3 mt-1">
                <h4 className="font-bold text-gray-700 uppercase tracking-wide text-[11px] mb-2">
                  Special Surcharges, Conditions & High Value
                </h4>
                <div className="flex flex-wrap gap-1.5 mb-2.5">
                  {viewModifier.grith && (
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-semibold">
                      GRITH
                    </span>
                  )}
                  {viewModifier.slabWiseRate && (
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-semibold">
                      SLAB WISE RATE
                    </span>
                  )}
                  {viewModifier.isDryIce && (
                    <span className="px-2 py-0.5 rounded bg-cyan-50 text-cyan-700 border border-cyan-200 text-[10px] font-semibold">
                      DRY ICE
                    </span>
                  )}
                  {viewModifier.isCsbIvShipment && (
                    <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-semibold">
                      CSB IV SHIPMENT
                    </span>
                  )}
                  {viewModifier.isCsbVShipment && (
                    <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-semibold">
                      CSB V SHIPMENT
                    </span>
                  )}
                  {viewModifier.isCommercialShipment && (
                    <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-semibold">
                      COMMERCIAL SHIPMENT
                    </span>
                  )}
                  {viewModifier.isOriginOda && (
                    <span className="px-2 py-0.5 rounded bg-orange-50 text-orange-700 border border-orange-200 text-[10px] font-semibold">
                      ORIGIN ODA
                    </span>
                  )}
                  {viewModifier.isDestinationOda && (
                    <span className="px-2 py-0.5 rounded bg-orange-50 text-orange-700 border border-orange-200 text-[10px] font-semibold">
                      DESTINATION ODA
                    </span>
                  )}
                  {viewModifier.isOriginOda2 && (
                    <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-semibold">
                      ORIGIN ODA2
                    </span>
                  )}
                  {viewModifier.isDestinationOda2 && (
                    <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-semibold">
                      DESTINATION ODA2
                    </span>
                  )}
                  {!viewModifier.grith &&
                    !viewModifier.slabWiseRate &&
                    !viewModifier.isDryIce &&
                    !viewModifier.isCsbIvShipment &&
                    !viewModifier.isCsbVShipment &&
                    !viewModifier.isCommercialShipment &&
                    !viewModifier.isOriginOda &&
                    !viewModifier.isDestinationOda &&
                    !viewModifier.isOriginOda2 &&
                    !viewModifier.isDestinationOda2 && (
                      <span className="text-gray-400 text-[11px] italic">No special conditions enabled</span>
                    )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <div className="p-2 bg-gray-50 rounded border border-gray-100">
                    <span className="text-gray-400 block text-[10px] uppercase">Grith 2nd Side Min Dim</span>
                    <span className="font-semibold text-gray-800">{viewModifier.grith2ndSideMinDimension || "-"}</span>
                  </div>
                  <div className="p-2 bg-gray-50 rounded border border-gray-100">
                    <span className="text-gray-400 block text-[10px] uppercase">Grith 2nd Side Max Dim</span>
                    <span className="font-semibold text-gray-800">{viewModifier.grith2ndSideMaxDimension || "-"}</span>
                  </div>
                  <div className="p-2 bg-gray-50 rounded border border-gray-100">
                    <span className="text-gray-400 block text-[10px] uppercase">High Value Charge On</span>
                    <span className="font-semibold text-gray-800">{viewModifier.highValueChargeOn || "-"}</span>
                  </div>
                  <div className="p-2 bg-gray-50 rounded border border-gray-100">
                    <span className="text-gray-400 block text-[10px] uppercase">High Value Amount</span>
                    <span className="font-semibold text-gray-800">
                      {viewModifier.highValueAmount ? `$${viewModifier.highValueAmount}` : "-"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-3.5 border-t border-gray-200 bg-gray-50/70 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  const id = viewModifier.id;
                  setViewModifier(null);
                  router.push(`/master/rate-modifier/create?edit=${id}`);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-axc-navy text-white rounded-lg text-xs font-semibold hover:bg-axc-navy/90 transition cursor-pointer"
              >
                <Pencil size={13} />
                Edit Rate Modifier
              </button>
              <button
                type="button"
                onClick={() => setViewModifier(null)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-xs font-semibold transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={Boolean(deleteTarget)}
        itemName={deleteTarget ? `${deleteTarget.charge}` : ""}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleConfirmSingleDelete}
        isLoading={isDeleting}
      />

      {/* Bulk Delete Dialog */}
      <DeleteConfirmationDialog
        isOpen={bulkDeleteOpen}
        itemName={`${selectedIds.length} ${
          selectedIds.length === 1 ? "rate modifier" : "rate modifiers"
        }`}
        onCancel={() => setBulkDeleteOpen(false)}
        onConfirm={handleConfirmBulkDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
