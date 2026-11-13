"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  PlusCircleIcon,
  FileText,
  Eye,
  Pencil,
  Trash2,
  Globe2,
  DollarSign,
} from "lucide-react";
import CommonTable from "@/app/src/common/table";
import FilterSearch from "@/app/src/common/filtersearch";
import Button from "@/app/src/common/button";
import DeleteConfirmationDialog from "@/app/src/common/deleteConfirmation";
import Dropdown from "@/app/src/common/dropdown";
import { showToast } from "@/app/src/common/toast";
import { api } from "@/app/src/lib/api";
import {
  CountryEntry,
  CountryHeadings,
  countryFilterGroups,
  initialCountryData,
} from "./types";

export default function CountryMasterPage() {
  const router = useRouter();

  const [data, setData] = useState<CountryEntry[]>([]);
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);

  // Modals & Action State
  const [viewCountry, setViewCountry] = useState<CountryEntry | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CountryEntry | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  // Sorting State
  const [sortKey, setSortKey] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Pagination
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Backend API + LocalStorage Persistence
  useEffect(() => {
    let mounted = true;
    async function loadData() {
      try {
        const list = await api.getMasterList<CountryEntry>("/countries");
        if (mounted && Array.isArray(list)) {
          setData(list);
          if (typeof window !== "undefined") {
            localStorage.setItem("master_countries", JSON.stringify(list));
          }
          return;
        }
      } catch (err) {
        console.warn("API unavailable, falling back to localStorage:", err);
      }
      if (mounted && typeof window !== "undefined") {
        const stored = localStorage.getItem("master_countries");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setData(parsed);
              return;
            }
          } catch (e) {
            console.error("Error reading stored countries:", e);
          }
        }
        setData(initialCountryData);
        localStorage.setItem("master_countries", JSON.stringify(initialCountryData));
      }
    }
    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  const saveCountries = (newList: CountryEntry[]) => {
    setData(newList);
    if (typeof window !== "undefined") {
      localStorage.setItem("master_countries", JSON.stringify(newList));
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
      const group = countryFilterGroups.find((g) =>
        g.options.some((o) => o.value === addedTag)
      );
      if (group) {
        const groupValues = group.options.map((o) => o.value);
        const filteredTags = newTags.filter(
          (tag) => tag === addedTag || !groupValues.includes(tag)
        );
        setActiveTags(filteredTags);
        setPage(1);
        return;
      }
    }
    setActiveTags(newTags);
    setPage(1);
  };

  const removeTag = (tagToRemove: string) => {
    setActiveTags((prev) => prev.filter((t) => t !== tagToRemove));
    setPage(1);
  };

  const searchSuggestions = useMemo(() => {
    const names = data.map((item) => item.name).filter(Boolean);
    const codes = data.map((item) => item.code).filter(Boolean);
    const currencies = data.map((item) => item.currencyCode).filter(Boolean);
    return Array.from(new Set([...names, ...codes, ...currencies]));
  }, [data]);

  // Filtered Data
  const filteredData = useMemo(() => {
    let result = [...data];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.code.toLowerCase().includes(q) ||
          item.dialCode.toLowerCase().includes(q) ||
          item.currencyCode.toLowerCase().includes(q) ||
          item.currencyName.toLowerCase().includes(q) ||
          item.id.toLowerCase().includes(q)
      );
    }

    if (activeTags.length > 0) {
      result = result.filter((item) => {
        return activeTags.every((rawTag) => {
          const raw = rawTag.toLowerCase().trim();
          if (raw === "active" || raw === "inactive") {
            return item.status.toLowerCase() === raw;
          }
          return (
            item.name.toLowerCase().includes(raw) ||
            item.code.toLowerCase().includes(raw) ||
            item.dialCode.toLowerCase().includes(raw) ||
            item.currencyCode.toLowerCase().includes(raw) ||
            item.id.toLowerCase().includes(raw)
          );
        });
      });
    }

    return result;
  }, [data, searchQuery, activeTags]);

  // Sorting handler
  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const sortedData = useMemo(() => {
    const list = [...filteredData];
    if (!sortKey) return list;

    return list.sort((a, b) => {
      const aVal = (a as any)[sortKey] ?? "";
      const bVal = (b as any)[sortKey] ?? "";
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }
      return sortDirection === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [filteredData, sortKey, sortDirection]);

  // Paginated Data
  const totalPages = Math.max(1, Math.ceil(sortedData.length / itemsPerPage));
  const paginatedData = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return sortedData.slice(start, start + itemsPerPage);
  }, [sortedData, page, itemsPerPage]);

  // Actions
  const handleView = (country: CountryEntry) => {
    setViewCountry(country);
  };

  const handleEdit = (country: CountryEntry) => {
    router.push(`/master/country/create?edit=${encodeURIComponent(country.id)}`);
  };

  const handleDelete = (country: CountryEntry) => {
    setDeleteTarget(country);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await api.deleteMasterItem("/countries", deleteTarget.id);
    } catch (err) {
      console.warn("API delete fallback:", err);
    }
    const updated = data.filter((item) => String(item.id) !== String(deleteTarget.id));
    saveCountries(updated);
    setSelectedIds((prev) => prev.filter((id) => String(id) !== String(deleteTarget.id)));
    setIsDeleting(false);
    setDeleteTarget(null);
    showToast({
      variant: "success",
      message: `Country "${deleteTarget.name}" deleted successfully!`,
    });
  };

  const handleBulkDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await api.bulkDeleteMasterItems("/countries", selectedIds);
    } catch (err) {
      console.warn("API bulk delete fallback:", err);
    }
    const updated = data.filter((item) => !selectedIds.includes(item.id));
    saveCountries(updated);
    setSelectedIds([]);
    setIsDeleting(false);
    setBulkDeleteOpen(false);
    showToast({
      variant: "success",
      message: `${selectedIds.length} Country(s) deleted successfully!`,
    });
  };

  const handleBulkExport = () => {
    const targetData =
      selectedIds.length > 0
        ? data.filter((item) => selectedIds.includes(item.id))
        : filteredData;

    if (targetData.length === 0) {
      showToast({ variant: "error", message: "No countries data to export." });
      return;
    }

    const headers = [
      "ID",
      "Country Name",
      "Code",
      "Dial Code",
      "Currency Code",
      "Currency Symbol",
      "Currency Name",
      "Status",
      "Created At",
    ];
    const rows = targetData.map((c) => [
      c.id,
      `"${c.name || ""}"`,
      `"${c.code || ""}"`,
      `"${c.dialCode || ""}"`,
      c.currencyCode || "",
      `"${c.currencySymbol || ""}"`,
      `"${c.currencyName || ""}"`,
      c.status,
      c.createdAt || "",
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `countries_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast({ variant: "success", message: "Exported Countries as CSV successfully!" });
  };

  // Build Table Headings (AWB / Shipper Table Pattern)
  const tableHeadings = CountryHeadings.map((h) => {
    if (h.key === "srNo") {
      return {
        ...h,
        render: (_row: CountryEntry, idx?: number) => (
          <span className="font-medium text-axc-dark-gray text-xs">
            {idx !== undefined ? idx + 1 : _row.srNo || 1}
          </span>
        ),
      };
    }

    if (h.key === "selectCountry") {
      const allSelected =
        paginatedData.length > 0 &&
        paginatedData.every((row) => selectedIds.includes(row.id));

      return {
        ...h,
        label: (
          <div className="flex flex-row-reverse items-center justify-center gap-1.5">
            <span className="text-xs font-bold capitalize leading-none whitespace-nowrap">
              Select Country
            </span>
            <input
              type="checkbox"
              checked={allSelected}
              onChange={() => {
                if (allSelected) {
                  setSelectedIds((prev) =>
                    prev.filter((id) => !paginatedData.some((row) => row.id === id))
                  );
                } else {
                  setSelectedIds((prev) =>
                    Array.from(new Set([...prev, ...paginatedData.map((row) => row.id)]))
                  );
                }
              }}
              className="h-3.5 w-3.5 accent-axc-navy cursor-pointer"
            />
          </div>
        ),
        render: (row: CountryEntry) => (
          <div className="flex items-center justify-center">
            <input
              type="checkbox"
              checked={selectedIds.includes(row.id)}
              onChange={() => {
                setSelectedIds((prev) =>
                  prev.includes(row.id)
                    ? prev.filter((id) => id !== row.id)
                    : [...prev, row.id]
                );
              }}
              className="h-3.5 w-3.5 accent-axc-navy cursor-pointer"
            />
          </div>
        ),
      };
    }

    if (h.key === "name") {
      return {
        ...h,
        render: (row: CountryEntry) => (
          <span className="font-semibold text-axc-dark-gray text-xs whitespace-nowrap">
            {row.name}
          </span>
        ),
      };
    }

    if (h.key === "code") {
      return {
        ...h,
        render: (row: CountryEntry) => (
          <span className="font-bold text-axc-navy text-xs tracking-wider uppercase">
            {row.code}
          </span>
        ),
      };
    }

    if (h.key === "dialCode") {
      return {
        ...h,
        render: (row: CountryEntry) => (
          <span className="text-xs text-axc-dark-gray font-mono whitespace-nowrap">
            {row.dialCode || "-"}
          </span>
        ),
      };
    }

    if (h.key === "currencyCode") {
      return {
        ...h,
        render: (row: CountryEntry) => (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase bg-blue-50 text-blue-700 border border-blue-200">
            {row.currencyCode || "-"}
          </span>
        ),
      };
    }

    if (h.key === "currencySymbol") {
      return {
        ...h,
        render: (row: CountryEntry) => (
          <span className="text-xs font-bold text-axc-dark-gray font-mono">
            {row.currencySymbol || "-"}
          </span>
        ),
      };
    }

    if (h.key === "status") {
      return {
        ...h,
        render: (row: CountryEntry) => (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border whitespace-nowrap ${
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
            {row.status}
          </span>
        ),
      };
    }

    return h;
  });

  return (
    <div className="relative bg-white p-4 rounded-lg w-full flex-1 flex flex-col min-h-0 shadow-sm border border-axc-border overflow-x-hidden overflow-y-scroll [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-axc-gray/40 [&::-webkit-scrollbar-thumb]:rounded-lg">
      {/* ═══════════ TOP CONTROLS BAR (EXACT AWB / SHIPPER LAYOUT) ═══════════ */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-4 shrink-0">
        <div className="flex flex-wrap items-center gap-3">
          <FilterSearch
            groups={countryFilterGroups}
            selectedOptions={activeTags}
            onOptionsChange={handleTagsChange}
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            onSearchSubmit={handleSearchSubmit}
            placeholder="Search entries..."
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
                      label: "Export",
                      icon: <FileText className="h-4 w-4" />,
                      onClick: handleBulkExport,
                    },
                    {
                      label: "Delete",
                      icon: <Trash2 className="h-4 w-4" />,
                      onClick: () => {
                        if (selectedIds.length === 0) {
                          showToast({
                            variant: "error",
                            message: "Please select at least one country to delete.",
                          });
                          return;
                        }
                        setBulkDeleteOpen(true);
                      },
                    },
                  ]}
                />
              </div>
            </>
          )}
        </div>

        <Button
          label="New Country"
          href="/master/country/create"
          variant="primary"
          icon={PlusCircleIcon}
        />
      </div>

      {/* ═══════════ ACTIVE FILTER TAGS ═══════════ */}
      {activeTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pb-3 border-b border-gray-100 mb-3 shrink-0">
          <span className="text-xs text-gray-500 font-medium mr-1">Active Filters:</span>
          {activeTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-axc-navy/10 text-axc-navy font-medium border border-axc-navy/20"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
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

      {/* ═══════════ COMMON TABLE (EXACT AWB / SHIPPER STYLE) ═══════════ */}
      <div className="flex-1 min-h-0 flex flex-col">
        <CommonTable
          headings={tableHeadings}
          data={paginatedData}
          currentPage={page}
          totalPages={totalPages}
          totalCount={sortedData.length}
          onPageChange={setPage}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={(newSize) => {
            setItemsPerPage(newSize);
            setPage(1);
          }}
          showScroll={true}
          sortKey={sortKey}
          sortDirection={sortDirection}
          onSort={handleSort}
          renderActions={(row: CountryEntry) => (
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

      {/* ═══════════ VIEW COUNTRY MODAL ═══════════ */}
      {viewCountry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-axc-navy text-white rounded-t-xl">
              <div className="flex items-center gap-2.5">
                <Globe2 size={18} />
                <h3 className="text-base font-bold uppercase tracking-wide">
                  Country Details — {viewCountry.name} ({viewCountry.code})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setViewCountry(null)}
                className="text-white/80 hover:text-white p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                  <span className="text-gray-500 font-medium block">Country ID</span>
                  <span className="font-bold text-axc-dark-gray">{viewCountry.id}</span>
                </div>
                <div>
                  <span className="text-gray-500 font-medium block">Code</span>
                  <span className="font-bold text-axc-navy text-sm uppercase">{viewCountry.code}</span>
                </div>
                <div>
                  <span className="text-gray-500 font-medium block">Dial Code</span>
                  <span className="font-mono font-semibold text-axc-dark-gray">{viewCountry.dialCode || "-"}</span>
                </div>
                <div>
                  <span className="text-gray-500 font-medium block">Status</span>
                  <span
                    className={`inline-flex items-center gap-1 font-bold ${
                      viewCountry.status === "ACTIVE" ? "text-emerald-600" : "text-red-500"
                    }`}
                  >
                    {viewCountry.status}
                  </span>
                </div>
              </div>

              {/* Currency Information */}
              <div className="p-3 bg-gray-50/70 rounded-lg border border-gray-200 space-y-2">
                <span className="text-[11px] font-bold text-axc-dark-gray uppercase tracking-wider block border-b border-gray-200 pb-1">
                  Currency Information
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                  <div>
                    <span className="text-gray-500 block">Currency Code</span>
                    <span className="font-bold text-blue-700">{viewCountry.currencyCode || "-"}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Symbol</span>
                    <span className="font-bold text-axc-dark-gray text-sm">{viewCountry.currencySymbol || "-"}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Currency Name</span>
                    <span className="font-semibold text-axc-dark-gray">{viewCountry.currencyName || "-"}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Fractional Unit</span>
                    <span className="font-medium text-gray-700">{viewCountry.currencyFractionalUnit || "-"}</span>
                  </div>
                </div>
              </div>

              {/* Exchange Rates Table */}
              <div>
                <span className="text-[11px] font-bold text-axc-dark-gray uppercase tracking-wider block mb-2">
                  Exchange Rates History
                </span>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
                      <tr>
                        <th className="px-3 py-2">Rate</th>
                        <th className="px-3 py-2">Effective From</th>
                        <th className="px-3 py-2">Effective Till</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {viewCountry.exchangeRates && viewCountry.exchangeRates.length > 0 ? (
                        viewCountry.exchangeRates.map((r, i) => (
                          <tr key={i}>
                            <td className="px-3 py-2 font-mono font-bold text-axc-dark-gray">{r.rate || "-"}</td>
                            <td className="px-3 py-2 font-mono text-gray-700">{r.effectiveFrom || "-"}</td>
                            <td className="px-3 py-2 font-mono text-gray-700">{r.effectiveTill || "-"}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="px-3 py-3 text-center text-gray-400">
                            No exchange rates defined.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 flex justify-end gap-2 bg-gray-50 rounded-b-xl">
              <button
                type="button"
                onClick={() => {
                  const id = viewCountry.id;
                  setViewCountry(null);
                  router.push(`/master/country/create?edit=${encodeURIComponent(id)}`);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-axc-navy text-white rounded-lg text-xs font-semibold hover:bg-axc-navy/90 transition cursor-pointer"
              >
                <Pencil size={13} />
                Edit Country
              </button>
              <button
                type="button"
                onClick={() => setViewCountry(null)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-xs font-semibold transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ DELETE CONFIRMATION DIALOGS ═══════════ */}
      <DeleteConfirmationDialog
        isOpen={Boolean(deleteTarget)}
        itemName={deleteTarget ? deleteTarget.name : ""}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
      />

      <DeleteConfirmationDialog
        isOpen={bulkDeleteOpen}
        itemName={`${selectedIds.length} ${
          selectedIds.length === 1 ? "Country" : "Countries"
        }`}
        onCancel={() => setBulkDeleteOpen(false)}
        onConfirm={handleBulkDeleteConfirm}
        isLoading={isDeleting}
      />
    </div>
  );
}

