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
  MapPin,
  Layers,
} from "lucide-react";
import CommonTable from "@/app/src/common/table";
import FilterSearch from "@/app/src/common/filtersearch";
import Button from "@/app/src/common/button";
import DeleteConfirmationDialog from "@/app/src/common/deleteConfirmation";
import Dropdown from "@/app/src/common/dropdown";
import { showToast } from "@/app/src/common/toast";
import { api } from "@/app/src/lib/api";
import {
  StateEntry,
  stateFilterGroups,
  initialStateData,
} from "./types";

export default function StateMasterPage() {
  const router = useRouter();

  const [data, setData] = useState<StateEntry[]>([]);
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);

  // Modals & Action State
  const [viewState, setViewState] = useState<StateEntry | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<StateEntry | null>(null);
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
        const list = await api.getMasterList<StateEntry>("/states");
        if (mounted && Array.isArray(list)) {
          setData(list);
          if (typeof window !== "undefined") {
            localStorage.setItem("master_states", JSON.stringify(list));
          }
          return;
        }
      } catch (err) {
        console.warn("API unavailable, falling back to localStorage:", err);
      }
      if (mounted && typeof window !== "undefined") {
        const stored = localStorage.getItem("master_states");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setData(parsed);
              return;
            }
          } catch (e) {
            console.error("Error reading stored states:", e);
          }
        }
        setData(initialStateData);
        localStorage.setItem("master_states", JSON.stringify(initialStateData));
      }
    }
    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  const saveStates = (newList: StateEntry[]) => {
    setData(newList);
    if (typeof window !== "undefined") {
      localStorage.setItem("master_states", JSON.stringify(newList));
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
      const group = stateFilterGroups.find((g) =>
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

  // Search Suggestions
  const searchSuggestions = useMemo(() => {
    const suggestions: string[] = [];
    data.forEach((s) => {
      if (s.name && !suggestions.includes(s.name)) suggestions.push(s.name);
      if (s.code && !suggestions.includes(s.code)) suggestions.push(s.code);
      if (s.country && !suggestions.includes(s.country)) suggestions.push(s.country);
    });
    return suggestions.slice(0, 8);
  }, [data]);

  // Filtered & Sorted Data
  const filteredData = useMemo(() => {
    let result = [...data];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.code.toLowerCase().includes(q) ||
          item.country.toLowerCase().includes(q) ||
          (item.portCode && item.portCode.toLowerCase().includes(q)) ||
          (item.gstStateCode && item.gstStateCode.toLowerCase().includes(q))
      );
    }

    if (activeTags.length > 0) {
      result = result.filter((item) => {
        return activeTags.every((tag) => {
          if (tag === "ACTIVE" || tag === "INACTIVE") {
            return item.status === tag;
          }
          if (
            ["UNITED STATES", "INDIA", "UNITED ARAB EMIRATES", "CANADA", "UNITED KINGDOM"].includes(
              tag
            )
          ) {
            return item.country.toUpperCase() === tag;
          }
          const q = tag.toLowerCase();
          return (
            item.name.toLowerCase().includes(q) ||
            item.code.toLowerCase().includes(q) ||
            item.country.toLowerCase().includes(q)
          );
        });
      });
    }

    if (sortKey) {
      result.sort((a, b) => {
        let valA = (a as any)[sortKey] ?? "";
        let valB = (b as any)[sortKey] ?? "";
        if (typeof valA === "string") valA = valA.toLowerCase();
        if (typeof valB === "string") valB = valB.toLowerCase();

        if (valA < valB) return sortDirection === "asc" ? -1 : 1;
        if (valA > valB) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, searchQuery, activeTags, sortKey, sortDirection]);

  // Paginated data
  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const paginatedData = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, page, itemsPerPage]);

  // Selection handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allIds = filteredData.map((d) => d.id);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isAllSelected =
    filteredData.length > 0 &&
    filteredData.every((item) => selectedIds.includes(item.id));

  // Sorting handler
  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  // Delete Single State
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await api.deleteMasterItem("/states", deleteTarget.id);
    } catch (err) {
      console.warn("API delete fallback:", err);
    }
    const updated = data.filter((d) => String(d.id) !== String(deleteTarget.id));
    saveStates(updated);
    setSelectedIds((prev) => prev.filter((id) => String(id) !== String(deleteTarget.id)));
    setIsDeleting(false);
    setDeleteTarget(null);
    showToast({
      message: `State ${deleteTarget.name} has been removed.`,
      variant: "success",
    });
  };

  // Bulk Delete
  const handleBulkDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await api.bulkDeleteMasterItems("/states", selectedIds);
    } catch (err) {
      console.warn("API bulk delete fallback:", err);
    }
    const updated = data.filter((d) => !selectedIds.includes(d.id));
    saveStates(updated);
    const count = selectedIds.length;
    setSelectedIds([]);
    setIsDeleting(false);
    setBulkDeleteOpen(false);
    showToast({
      message: `${count} states deleted successfully.`,
      variant: "success",
    });
  };

  const tableHeadings = [
    {
      key: "select",
      label: (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isAllSelected}
            onChange={handleSelectAll}
            className="h-4 w-4 rounded border-gray-300 text-axc-navy focus:ring-axc-navy cursor-pointer accent-axc-navy"
          />
          <span className="text-xs font-bold text-gray-700">SELECT STATE</span>
        </div>
      ),
      render: (row: StateEntry) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(row.id)}
          onChange={() => handleSelectRow(row.id)}
          className="h-4 w-4 rounded border-gray-300 text-axc-navy focus:ring-axc-navy cursor-pointer accent-axc-navy"
        />
      ),
    },
    {
      key: "sr",
      label: "SR.NO.",
      render: (_row: StateEntry, idx?: number) => {
        const index = (page - 1) * itemsPerPage + (idx ?? 0) + 1;
        return <span className="text-xs font-mono text-gray-600">{index}</span>;
      },
    },
    {
      key: "name",
      label: "NAME",
      sortable: true,
      render: (row: StateEntry) => (
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-axc-navy shrink-0" />
          <span className="font-semibold text-gray-900 text-xs tracking-tight">
            {row.name}
          </span>
        </div>
      ),
    },
    {
      key: "code",
      label: "CODE",
      sortable: true,
      render: (row: StateEntry) => (
        <span className="font-mono font-bold text-axc-navy bg-blue-50 px-2 py-0.5 rounded text-xs">
          {row.code}
        </span>
      ),
    },
    {
      key: "portCode",
      label: "PORT CODE",
      sortable: true,
      render: (row: StateEntry) => (
        <span className="font-mono text-xs text-gray-700">
          {row.portCode || "-"}
        </span>
      ),
    },
    {
      key: "country",
      label: "COUNTRY",
      sortable: true,
      render: (row: StateEntry) => (
        <span className="text-xs font-medium text-gray-800">
          {row.country}
        </span>
      ),
    },
    {
      key: "gstStateCode",
      label: "GST STATE CODE",
      sortable: true,
      render: (row: StateEntry) => (
        <span className="font-mono text-xs text-gray-600">
          {row.gstStateCode || "-"}
        </span>
      ),
    },
    {
      key: "eWaybillMaxAmount",
      label: "E-WAYBILL MAX",
      sortable: true,
      render: (row: StateEntry) => (
        <span className="font-mono text-xs font-medium text-gray-700">
          {row.eWaybillMaxAmount ? Number(row.eWaybillMaxAmount).toLocaleString() : "-"}
        </span>
      ),
    },
    {
      key: "status",
      label: "STATUS",
      sortable: true,
      render: (row: StateEntry) => {
        const isActive = row.status === "ACTIVE";
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border whitespace-nowrap ${
              isActive
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-red-50 text-red-600 border-red-200"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isActive ? "bg-emerald-500" : "bg-red-500"
              }`}
            />
            {row.status}
          </span>
        );
      },
    },
  ];

  return (
    <div className="relative bg-white p-4 rounded-lg w-full flex-1 flex flex-col min-h-0 shadow-sm border border-axc-border overflow-x-hidden overflow-y-scroll [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-axc-gray/40 [&::-webkit-scrollbar-thumb]:rounded-lg">
      {/* ═══════════ TOP CONTROLS BAR (EXACT AWB / SHIPPER LAYOUT) ═══════════ */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-4 shrink-0">
        <div className="flex flex-wrap items-center gap-3">
          <FilterSearch
            groups={stateFilterGroups}
            selectedOptions={activeTags}
            onOptionsChange={handleTagsChange}
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            onSearchSubmit={handleSearchSubmit}
            placeholder="Search states by name, code, country..."
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
                      label: "Delete",
                      icon: <Trash2 className="h-4 w-4" />,
                      onClick: () => setBulkDeleteOpen(true),
                    },
                  ]}
                />
              </div>
            </>
          )}
        </div>

        <Button
          label="Add State"
          href="/master/state/create"
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
          totalCount={filteredData.length}
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
          renderActions={(row: StateEntry) => (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setViewState(row)}
                className="inline-flex items-center justify-center rounded-md border border-axc-navy/30 p-1.5 text-axc-navy transition hover:bg-axc-navy/10 cursor-pointer"
                title="View"
              >
                <Eye size={16} />
              </button>
              <button
                type="button"
                onClick={() => router.push(`/master/state/create?id=${row.id}`)}
                className="inline-flex items-center justify-center rounded-md border border-axc-dark-green/30 p-1.5 text-axc-dark-green transition hover:bg-axc-dark-green/10 cursor-pointer"
                title="Edit"
              >
                <Pencil size={16} />
              </button>
              <button
                type="button"
                onClick={() => setDeleteTarget(row)}
                className="inline-flex items-center justify-center rounded-md border border-axc-red-dark/30 p-1.5 text-axc-red-dark transition hover:bg-axc-red-dark/10 cursor-pointer"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
        />
      </div>

      {/* ══════════════ VIEW DETAIL MODAL ══════════════ */}
      {viewState && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-2xl border border-axc-border w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
            <div className="bg-[#686B9A] px-5 py-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <MapPin size={18} />
                <h3 className="font-bold text-base tracking-wide">
                  State Details: {viewState.name} ({viewState.code})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setViewState(null)}
                className="p-1 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex flex-col gap-5 text-xs text-gray-700">
              {/* Basic Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div>
                  <span className="font-bold text-gray-400 block uppercase text-[10px]">
                    State Name
                  </span>
                  <span className="font-semibold text-gray-900 text-sm">
                    {viewState.name}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-gray-400 block uppercase text-[10px]">
                    Code
                  </span>
                  <span className="font-mono font-bold text-axc-navy bg-blue-50 px-2 py-0.5 rounded">
                    {viewState.code}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-gray-400 block uppercase text-[10px]">
                    Port Code
                  </span>
                  <span className="font-mono font-medium text-gray-800">
                    {viewState.portCode || "-"}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-gray-400 block uppercase text-[10px]">
                    Country
                  </span>
                  <span className="font-semibold text-gray-800">
                    {viewState.country}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-gray-400 block uppercase text-[10px]">
                    GST State Code
                  </span>
                  <span className="font-mono font-medium text-gray-800">
                    {viewState.gstStateCode || "-"}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-gray-400 block uppercase text-[10px]">
                    Skynet State
                  </span>
                  <span className="font-medium text-gray-800">
                    {viewState.skynetState || "-"}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-gray-400 block uppercase text-[10px]">
                    E-Waybill Max
                  </span>
                  <span className="font-mono font-semibold text-gray-900">
                    {viewState.eWaybillMaxAmount
                      ? Number(viewState.eWaybillMaxAmount).toLocaleString()
                      : "-"}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-gray-400 block uppercase text-[10px]">
                    Intrastate Max
                  </span>
                  <span className="font-mono font-semibold text-gray-900">
                    {viewState.intrastateMaxAmount
                      ? Number(viewState.intrastateMaxAmount).toLocaleString()
                      : "-"}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-gray-400 block uppercase text-[10px]">
                    Status
                  </span>
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                      viewState.status === "ACTIVE"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {viewState.status}
                  </span>
                </div>
              </div>

              {/* Zone Mappings */}
              <div>
                <div className="flex items-center gap-1.5 mb-2 font-bold text-gray-800 text-xs">
                  <Layers size={14} className="text-axc-navy" />
                  Zone Mappings ({viewState.zones?.length || 0})
                </div>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-100 text-gray-600 font-semibold border-b border-gray-200">
                      <tr>
                        <th className="px-3 py-2">Zone</th>
                        <th className="px-3 py-2">Type</th>
                        <th className="px-3 py-2">Customer</th>
                        <th className="px-3 py-2">Service</th>
                        <th className="px-3 py-2">Vendor</th>
                        <th className="px-3 py-2">Service Type</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {viewState.zones && viewState.zones.length > 0 ? (
                        viewState.zones.map((zm, i) => (
                          <tr key={zm.id || i} className="hover:bg-gray-50/50">
                            <td className="px-3 py-2 font-medium text-axc-navy">
                              {zm.zone || "-"}
                            </td>
                            <td className="px-3 py-2">{zm.type || "-"}</td>
                            <td className="px-3 py-2">{zm.customer || "-"}</td>
                            <td className="px-3 py-2">{zm.service || "-"}</td>
                            <td className="px-3 py-2">{zm.vendor || "-"}</td>
                            <td className="px-3 py-2">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  zm.serviceType === "SERVICEABLE"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {zm.serviceType}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-4 py-3 text-center text-gray-400 italic"
                          >
                            No zone mappings recorded for this state.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-3 border-t border-axc-border flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  const id = viewState.id;
                  setViewState(null);
                  router.push(`/master/state/create?id=${id}`);
                }}
                className="px-4 py-1.5 rounded-lg bg-axc-navy text-white text-xs font-semibold hover:bg-axc-navy/90 transition flex items-center gap-1.5"
              >
                <Pencil size={13} />
                Edit State
              </button>
              <button
                type="button"
                onClick={() => setViewState(null)}
                className="px-4 py-1.5 rounded-lg border border-gray-300 bg-white text-gray-700 text-xs font-semibold hover:bg-gray-50 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════ SINGLE DELETE DIALOG ══════════════ */}
      <DeleteConfirmationDialog
        isOpen={Boolean(deleteTarget)}
        itemName={deleteTarget ? `${deleteTarget.name} (${deleteTarget.code})` : ""}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />

      {/* ══════════════ BULK DELETE DIALOG ══════════════ */}
      <DeleteConfirmationDialog
        isOpen={bulkDeleteOpen}
        itemName={`${selectedIds.length} ${
          selectedIds.length === 1 ? "State" : "States"
        }`}
        onCancel={() => setBulkDeleteOpen(false)}
        onConfirm={handleBulkDeleteConfirm}
        isLoading={isDeleting}
      />
    </div>
  );
}
