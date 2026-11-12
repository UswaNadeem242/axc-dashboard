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
  Coins,
} from "lucide-react";
import CommonTable from "@/app/src/common/table";
import FilterSearch from "@/app/src/common/filtersearch";
import Button from "@/app/src/common/button";
import DeleteConfirmationDialog from "@/app/src/common/deleteConfirmation";
import Dropdown from "@/app/src/common/dropdown";
import { showToast } from "@/app/src/common/toast";
import { api, formatDateOnly } from "@/app/src/lib/api";
import {
  CurrencyEntry,
  CurrencyHeadings,
  currencyFilterGroups,
  initialCurrencyData,
} from "./types";

export default function CurrencyMasterPage() {
  const router = useRouter();
  const [data, setData] = useState<CurrencyEntry[]>([]);
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);

  // Modals & Action State
  const [viewCurrency, setViewCurrency] = useState<CurrencyEntry | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CurrencyEntry | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  // Sorting & Pagination
  const [sortKey, setSortKey] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // API + LocalStorage Persistence
  useEffect(() => {
    let mounted = true;
    api
      .getMasterList<CurrencyEntry>("/currencies")
      .then((list) => {
        if (!mounted) return;
        if (Array.isArray(list) && list.length > 0) {
          setData(list);
          if (typeof window !== "undefined") {
            localStorage.setItem("master_currencies", JSON.stringify(list));
          }
          return;
        }
        loadLocalFallback();
      })
      .catch(() => {
        if (mounted) loadLocalFallback();
      });

    function loadLocalFallback() {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("master_currencies");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const cleaned = parsed.map((item: any) => ({
                ...item,
                createdAt: formatDateOnly(item.createdAt || item.created_at),
              }));
              setData(cleaned);
              return;
            }
          } catch (e) {
            console.error("Error reading stored currencies:", e);
          }
        }
        setData(initialCurrencyData);
        localStorage.setItem("master_currencies", JSON.stringify(initialCurrencyData));
      }
    }

    return () => {
      mounted = false;
    };
  }, []);

  const saveCurrencies = (newList: CurrencyEntry[]) => {
    setData(newList);
    if (typeof window !== "undefined") {
      localStorage.setItem("master_currencies", JSON.stringify(newList));
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
      const group = currencyFilterGroups.find((g) =>
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

  // Autocomplete suggestions
  const searchSuggestions = useMemo(() => {
    const set = new Set<string>();
    data.forEach((c) => {
      if (c.code) set.add(c.code);
      if (c.name) set.add(c.name);
      if (c.fractionalUnit) set.add(c.fractionalUnit);
    });
    return Array.from(set).slice(0, 8);
  }, [data]);

  // Filtering
  const filteredData = useMemo(() => {
    let result = [...data];

    if (activeTags.length > 0) {
      result = result.filter((item) => {
        return activeTags.some((tag) => {
          const upperTag = tag.toUpperCase();
          if (upperTag === "ACTIVE" || upperTag === "INACTIVE") {
            return item.status === upperTag;
          }
          return (
            item.code.toLowerCase().includes(tag.toLowerCase()) ||
            item.name.toLowerCase().includes(tag.toLowerCase()) ||
            (item.fractionalUnit || "").toLowerCase().includes(tag.toLowerCase())
          );
        });
      });
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.code.toLowerCase().includes(q) ||
          item.name.toLowerCase().includes(q) ||
          (item.fractionalUnit || "").toLowerCase().includes(q)
      );
    }

    return result;
  }, [data, activeTags, searchQuery]);

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
      await api.deleteMasterItem("/currencies", deleteTarget.id);
    } catch {
      // fallback to local
    }
    const updated = data.filter((c) => String(c.id) !== String(deleteTarget.id));
    saveCurrencies(updated);
    setSelectedIds((prev) => prev.filter((i) => String(i) !== String(deleteTarget.id)));
    showToast({
      variant: "success",
      message: `Currency "${deleteTarget.code}" deleted successfully.`,
    });
    setIsDeleting(false);
    setDeleteTarget(null);
  };

  const handleConfirmBulkDelete = async () => {
    setIsDeleting(true);
    try {
      await api.bulkDeleteMasterItems("/currencies", selectedIds);
    } catch {
      // fallback to local
    }
    const updated = data.filter((c) => !selectedIds.map(String).includes(String(c.id)));
    saveCurrencies(updated);
    showToast({
      variant: "success",
      message: `${selectedIds.length} currencies deleted successfully.`,
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
      ? data.filter((c) => selectedIds.includes(c.id))
      : data;

    if (exportItems.length === 0) {
      showToast({ variant: "error", message: "No currency records to export." });
      return;
    }

    const headers = [
      "Sr No",
      "Code",
      "Name",
      "Fractional Unit",
      "Status",
      "Created Date",
    ];

    const csvRows = exportItems.map((c) => [
      c.srNo,
      `"${c.code}"`,
      `"${c.name}"`,
      `"${c.fractionalUnit || ""}"`,
      `"${c.status}"`,
      `"${formatDateOnly(c.createdAt || (c as any).created_at)}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...csvRows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Currencies_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast({
      variant: "success",
      message: `Exported ${exportItems.length} currency records.`,
    });
  };

  // AWB Custom Table Column Renderers
  const tableHeadings = CurrencyHeadings.map((h) => {
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
    if (h.key === "code") {
      return {
        ...h,
        render: (row: CurrencyEntry) => (
          <button
            type="button"
            onClick={() => setViewCurrency(row)}
            className="font-semibold text-axc-navy bg-axc-navy/5 px-2.5 py-1 rounded text-xs border border-axc-navy/15 hover:bg-axc-navy/10 transition cursor-pointer"
            title="Click to view details"
          >
            {row.code}
          </button>
        ),
      };
    }
    if (h.key === "name") {
      return {
        ...h,
        render: (row: CurrencyEntry) => (
          <span className="font-semibold text-gray-900 text-xs tracking-wide">
            {row.name}
          </span>
        ),
      };
    }
    if (h.key === "fractionalUnit") {
      return {
        ...h,
        render: (row: CurrencyEntry) => (
          <span className="text-gray-600 text-xs">
            {row.fractionalUnit || "-"}
          </span>
        ),
      };
    }
    if (h.key === "status") {
      return {
        ...h,
        render: (row: CurrencyEntry) => (
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
    if (h.key === "createdAt") {
      return {
        ...h,
        render: (row: CurrencyEntry) => (
          <span className="text-gray-600 text-xs whitespace-nowrap">
            {formatDateOnly(row.createdAt || (row as any).created_at)}
          </span>
        ),
      };
    }
    if (h.key === "action") {
      return {
        ...h,
        render: (row: CurrencyEntry) => (
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setViewCurrency(row)}
              className="inline-flex items-center justify-center rounded-md border border-axc-navy/30 p-1.5 text-axc-navy transition hover:bg-axc-navy/10 cursor-pointer"
              title="View"
            >
              <Eye size={15} />
            </button>
            <button
              type="button"
              onClick={() => router.push(`/master/currency/create?edit=${row.id}`)}
              className="inline-flex items-center justify-center rounded-md border border-axc-dark-green/30 p-1.5 text-axc-dark-green transition hover:bg-axc-dark-green/10 cursor-pointer"
              title="Edit"
            >
              <Pencil size={15} />
            </button>
            <button
              type="button"
              onClick={() => setDeleteTarget(row)}
              className="inline-flex items-center justify-center rounded-md border border-axc-red-dark/30 p-1.5 text-axc-red-dark transition hover:bg-axc-red-dark/10 cursor-pointer"
              title="Delete"
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
              groups={currencyFilterGroups}
              selectedOptions={activeTags}
              onOptionsChange={handleTagsChange}
              searchValue={searchQuery}
              onSearchChange={setSearchQuery}
              onSearchSubmit={handleSearchSubmit}
              placeholder="Search by Code, Name, Fractional Unit..."
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
            label="New Currency"
            href="/master/currency/create"
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

        {/* Common Table with Exact AWB Look & Feel */}
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
                ? "No currencies found matching your filters."
                : "No currency records found. Click 'New Currency' to add one."
            }
          />
        </div>
      </div>

      {/* ── View Details Modal ── */}
      {viewCurrency && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden border border-gray-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-axc-navy/5">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-lg bg-axc-navy text-white">
                  <Coins size={18} />
                </span>
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    Currency Details: {viewCurrency.code}
                  </h3>
                  <p className="text-xs text-gray-500">{viewCurrency.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewCurrency(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 grid grid-cols-2 gap-4 text-xs">
              <div className="flex flex-col gap-1 p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                <span className="text-gray-400 font-semibold uppercase">SR. NO.</span>
                <span className="font-bold text-gray-900">{viewCurrency.srNo}</span>
              </div>
              <div className="flex flex-col gap-1 p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                <span className="text-gray-400 font-semibold uppercase">CODE</span>
                <span className="font-bold text-axc-navy text-sm tracking-wider">{viewCurrency.code}</span>
              </div>
              <div className="flex flex-col gap-1 p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                <span className="text-gray-400 font-semibold uppercase">NAME</span>
                <span className="font-bold text-gray-900">{viewCurrency.name}</span>
              </div>
              <div className="flex flex-col gap-1 p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                <span className="text-gray-400 font-semibold uppercase">FRACTIONAL UNIT</span>
                <span className="font-medium text-gray-700">{viewCurrency.fractionalUnit || "-"}</span>
              </div>
              <div className="flex flex-col gap-1 p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                <span className="text-gray-400 font-semibold uppercase">STATUS</span>
                <span
                  className={`inline-flex items-center gap-1.5 font-bold ${
                    viewCurrency.status === "ACTIVE" ? "text-emerald-700" : "text-red-600"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      viewCurrency.status === "ACTIVE" ? "bg-emerald-500" : "bg-red-500"
                    }`}
                  />
                  {viewCurrency.status}
                </span>
              </div>
              <div className="flex flex-col gap-1 p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                <span className="text-gray-400 font-semibold uppercase">CREATED DATE</span>
                <span className="font-medium text-gray-700">
                  {formatDateOnly(viewCurrency.createdAt || (viewCurrency as any).created_at)}
                </span>
              </div>
            </div>

            <div className="px-6 py-3.5 border-t border-gray-200 bg-gray-50/70 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  const id = viewCurrency.id;
                  setViewCurrency(null);
                  router.push(`/master/currency/create?edit=${id}`);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-axc-navy text-white rounded-lg text-xs font-semibold hover:bg-axc-navy/90 transition cursor-pointer"
              >
                <Pencil size={13} />
                Edit Currency
              </button>
              <button
                type="button"
                onClick={() => setViewCurrency(null)}
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
        itemName={deleteTarget ? `${deleteTarget.name} (${deleteTarget.code})` : ""}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleConfirmSingleDelete}
        isLoading={isDeleting}
      />

      {/* Bulk Delete Dialog */}
      <DeleteConfirmationDialog
        isOpen={bulkDeleteOpen}
        itemName={`${selectedIds.length} ${
          selectedIds.length === 1 ? "currency" : "currencies"
        }`}
        onCancel={() => setBulkDeleteOpen(false)}
        onConfirm={handleConfirmBulkDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
