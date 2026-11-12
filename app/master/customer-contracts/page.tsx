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
  Building2,
  Calendar,
  Layers,
  MapPin,
} from "lucide-react";
import CommonTable from "@/app/src/common/table";
import FilterSearch from "@/app/src/common/filtersearch";
import Button from "@/app/src/common/button";
import DeleteConfirmationDialog from "@/app/src/common/deleteConfirmation";
import Dropdown from "@/app/src/common/dropdown";
import { showToast } from "@/app/src/common/toast";
import { api } from "@/app/src/lib/api";
import {
  CustomerContractEntry,
  CustomerContractsHeadings,
  customerContractFilterGroups,
  initialCustomerContractsData,
} from "./types";

export default function CustomerContractsMasterPage() {
  const router = useRouter();
  const [data, setData] = useState<CustomerContractEntry[]>([]);
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);

  // Modals & Action State
  const [viewContract, setViewContract] = useState<CustomerContractEntry | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CustomerContractEntry | null>(null);
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
        const list = await api.getMasterList<CustomerContractEntry>("/customer-contracts");
        if (mounted && Array.isArray(list)) {
          setData(list);
          if (typeof window !== "undefined") {
            localStorage.setItem("master_customer_contracts", JSON.stringify(list));
          }
          return;
        }
      } catch (err) {
        console.warn("API unavailable, falling back to localStorage:", err);
      }
      if (mounted && typeof window !== "undefined") {
        const stored = localStorage.getItem("master_customer_contracts");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setData(parsed);
              return;
            }
          } catch (e) {
            console.error("Error reading stored contracts:", e);
          }
        }
        setData(initialCustomerContractsData);
        localStorage.setItem(
          "master_customer_contracts",
          JSON.stringify(initialCustomerContractsData)
        );
      }
    }
    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  const saveContracts = (newList: CustomerContractEntry[]) => {
    setData(newList);
    if (typeof window !== "undefined") {
      localStorage.setItem("master_customer_contracts", JSON.stringify(newList));
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
      const group = customerContractFilterGroups.find((g) =>
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

  const searchSuggestions = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return [];
    const pool = new Set<string>();
    data.forEach((c) => {
      if (c.id?.toLowerCase().includes(q)) pool.add(c.id);
      if (c.customer?.toLowerCase().includes(q)) pool.add(c.customer);
      if (c.service?.toLowerCase().includes(q)) pool.add(c.service);
      if (c.product?.toLowerCase().includes(q)) pool.add(c.product);
      if (c.originHub?.toLowerCase().includes(q)) pool.add(c.originHub);
      if (c.destinationHub?.toLowerCase().includes(q)) pool.add(c.destinationHub);
    });
    return Array.from(pool).slice(0, 6);
  }, [data, searchQuery]);

  // Filtering
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery =
          item.id?.toLowerCase().includes(q) ||
          item.customer?.toLowerCase().includes(q) ||
          item.service?.toLowerCase().includes(q) ||
          item.product?.toLowerCase().includes(q) ||
          item.originHub?.toLowerCase().includes(q) ||
          item.destinationHub?.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      if (activeTags.length > 0) {
        for (const tag of activeTags) {
          const group = customerContractFilterGroups.find((g) =>
            g.options.some((o) => o.value === tag)
          );
          if (group) {
            if (group.group === "Contract Type" && item.contractType !== tag) return false;
            if (group.group === "Calculation Method" && item.calculationMethod !== tag) return false;
            if (group.group === "Origin Hub" && item.originHub !== tag) return false;
            if (group.group === "Status" && item.status !== tag) return false;
          } else {
            const matchesTag =
              item.id?.toLowerCase().includes(tag.toLowerCase()) ||
              item.customer?.toLowerCase().includes(tag.toLowerCase()) ||
              item.service?.toLowerCase().includes(tag.toLowerCase()) ||
              item.product?.toLowerCase().includes(tag.toLowerCase()) ||
              item.originHub?.toLowerCase().includes(tag.toLowerCase()) ||
              item.destinationHub?.toLowerCase().includes(tag.toLowerCase());
            if (!matchesTag) return false;
          }
        }
      }
      return true;
    });
  }, [data, searchQuery, activeTags]);

  // Sorting: Default latest first (Created date / ID descending)
  const sortedData = useMemo(() => {
    const list = [...filteredData];
    if (!sortKey) {
      return list.sort((a, b) => {
        const rawDateA = a.createdAt || (a as any).created_at || (a as any).createdDate;
        const rawDateB = b.createdAt || (b as any).created_at || (b as any).createdDate;
        const dateA = rawDateA ? new Date(rawDateA).getTime() : 0;
        const dateB = rawDateB ? new Date(rawDateB).getTime() : 0;
        if (dateA && dateB && dateA !== dateB) return dateB - dateA;

        const aNum = Number(a.id);
        const bNum = Number(b.id);
        if (!isNaN(aNum) && !isNaN(bNum) && aNum !== bNum) return bNum - aNum;

        return String(b.id || "").localeCompare(String(a.id || ""));
      });
    }
    const key = sortKey;
    const dir = sortDirection;
    return list.sort((a, b) => {
      const aVal = (a as any)[key] ?? "";
      const bVal = (b as any)[key] ?? "";
      const aNum = Number(aVal);
      const bNum = Number(bVal);
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return dir === "asc" ? aNum - bNum : bNum - aNum;
      }
      return dir === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [filteredData, sortKey, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage) || 1;
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

  // Row selection
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginatedData.map((d) => d.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string | number, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((i) => i !== id));
    }
  };

  // Delete Handlers
  const handleConfirmSingleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await api.deleteMasterItem("/customer-contracts", deleteTarget.id);
    } catch (err) {
      console.warn("API delete fallback:", err);
    }
    const updated = data.filter((c) => String(c.id) !== String(deleteTarget.id));
    saveContracts(updated);
    setSelectedIds((prev) => prev.filter((i) => String(i) !== String(deleteTarget.id)));
    showToast({
      variant: "success",
      message: `Contract "${deleteTarget.id}" deleted successfully.`,
    });
    setIsDeleting(false);
    setDeleteTarget(null);
  };

  const handleConfirmBulkDelete = async () => {
    setIsDeleting(true);
    try {
      await api.bulkDeleteMasterItems("/customer-contracts", selectedIds);
    } catch (err) {
      console.warn("API bulk delete fallback:", err);
    }
    const updated = data.filter((c) => !selectedIds.includes(c.id));
    saveContracts(updated);
    showToast({
      variant: "success",
      message: `${selectedIds.length} contract(s) deleted successfully.`,
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
      : filteredData;

    if (exportItems.length === 0) {
      showToast({
        variant: "error",
        message: "No contract records to export.",
      });
      return;
    }

    const headers = [
      "ID",
      "Customer",
      "Service",
      "Product",
      "Origin Hub",
      "Destination Hub",
      "Contract Type",
      "Calculation Method",
      "Effective From",
      "Effective To",
      "Status",
    ];

    const csvRows = exportItems.map((c) => [
      `"${c.id}"`,
      `"${c.customer}"`,
      `"${c.service}"`,
      `"${c.product}"`,
      `"${c.originHub}"`,
      `"${c.destinationHub}"`,
      `"${c.contractType}"`,
      `"${c.calculationMethod}"`,
      `"${c.effectiveFrom}"`,
      `"${c.effectiveTo}"`,
      `"${c.status}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...csvRows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Customer_Contracts_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast({
      variant: "success",
      message: `Exported ${exportItems.length} contract records to CSV.`,
    });
  };

  // Custom Table Headings & Cell Renderers
  const tableHeadings = CustomerContractsHeadings.map((h) => {
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
    if (h.key === "id") {
      return {
        ...h,
        render: (row: CustomerContractEntry) => (
          <span className="font-semibold text-axc-navy bg-axc-navy/5 px-2 py-0.5 rounded text-[11px]">
            {row.id}
          </span>
        ),
      };
    }
    if (h.key === "customer") {
      return {
        ...h,
        render: (row: CustomerContractEntry) => (
          <span className="font-semibold text-gray-900">{row.customer || (row as any).customerName || (row as any).customerCode || "-"}</span>
        ),
      };
    }
    if (h.key === "service") {
      return {
        ...h,
        render: (row: CustomerContractEntry) => (
          <span className="text-gray-800">{row.service || (row as any).serviceName || (row as any).serviceCode || "-"}</span>
        ),
      };
    }
    if (h.key === "product") {
      return {
        ...h,
        render: (row: CustomerContractEntry) => (
          <span className="font-medium text-gray-800">{row.product || (row as any).productName || (row as any).productCode || "-"}</span>
        ),
      };
    }
    if (h.key === "originHub") {
      return {
        ...h,
        render: (row: CustomerContractEntry) => (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
            {row.originHub || (row as any).originHubCode || (row as any).origin_hub || "-"}
          </span>
        ),
      };
    }
    if (h.key === "destinationHub") {
      return {
        ...h,
        render: (row: CustomerContractEntry) => (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-50 text-purple-700">
            {row.destinationHub || (row as any).destinationHubCode || (row as any).destination_hub || "-"}
          </span>
        ),
      };
    }
    if (h.key === "status") {
      return {
        ...h,
        render: (row: CustomerContractEntry) => (
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              row.status === "ACTIVE"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {row.status}
          </span>
        ),
      };
    }
    if (h.key === "action") {
      return {
        ...h,
        render: (row: CustomerContractEntry) => (
          <div className="flex items-center justify-center gap-1.5">
            <button
              type="button"
              onClick={() => setViewContract(row)}
              className="p-1 rounded text-axc-gray hover:text-axc-navy hover:bg-gray-100 transition cursor-pointer"
              title="View Contract"
            >
              <Eye size={15} />
            </button>
            <button
              type="button"
              onClick={() => router.push(`/master/customer-contracts/create?edit=${row.id}`)}
              className="p-1 rounded text-axc-gray hover:text-axc-navy hover:bg-gray-100 transition cursor-pointer"
              title="Edit Contract"
            >
              <Pencil size={15} />
            </button>
            <button
              type="button"
              onClick={() => setDeleteTarget(row)}
              className="p-1 rounded text-axc-red hover:text-red-700 hover:bg-red-50 transition cursor-pointer"
              title="Delete Contract"
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
      <div className="relative bg-white p-4 rounded-lg border border-gray-200 w-full flex-1 min-h-0 flex flex-col overflow-hidden">
        {/* Top Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 shrink-0">
          <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
            <FilterSearch
              groups={customerContractFilterGroups}
              selectedOptions={activeTags}
              onOptionsChange={handleTagsChange}
              searchValue={searchQuery}
              onSearchChange={setSearchQuery}
              onSearchSubmit={handleSearchSubmit}
              placeholder="Search by Customer, Service, Hub, ID..."
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
            label="New Contract"
            href="/master/customer-contracts/create"
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
            emptyMessage={
              activeTags.length > 0 || searchQuery
                ? "No contracts found matching your filters."
                : "No customer contracts found. Click 'New Contract' to add one."
            }
          />
        </div>
      </div>

      {/* ══════════════ VIEW CONTRACT DETAILS MODAL ══════════════ */}
      {viewContract && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-axc-navy/5">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-lg bg-axc-navy text-white">
                  <FileText size={18} />
                </span>
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    Contract Details: {viewContract.id}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium">{viewContract.customer}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewContract(null)}
                className="text-gray-400 hover:text-gray-600 transition p-1.5 rounded-md cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {/* Primary Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-lg bg-gray-50/70 border border-gray-200 text-xs">
                <div>
                  <span className="text-gray-400 block mb-0.5">Customer</span>
                  <span className="font-semibold text-gray-900">{viewContract.customer}</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">Service</span>
                  <span className="font-semibold text-gray-900">{viewContract.service || "-"}</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">Product</span>
                  <span className="font-semibold text-gray-900">{viewContract.product || "-"}</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">Origin Hub</span>
                  <span className="font-semibold text-blue-700">{viewContract.originHub || "-"}</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">Destination Hub</span>
                  <span className="font-semibold text-purple-700">{viewContract.destinationHub || "-"}</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">Contract Type</span>
                  <span className="font-semibold text-gray-900">{viewContract.contractType}</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">Calculation Method</span>
                  <span className="font-semibold text-gray-900">{viewContract.calculationMethod}</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">Effective Period</span>
                  <span className="font-semibold text-gray-900">
                    {viewContract.effectiveFrom} to {viewContract.effectiveTo}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">Status</span>
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                      viewContract.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {viewContract.status}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">Airline / Flight</span>
                  <span className="font-semibold text-gray-900">
                    {viewContract.airline || "-"} {viewContract.flight ? `(${viewContract.flight})` : ""}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">Vendor</span>
                  <span className="font-semibold text-gray-900">{viewContract.vendor || "-"}</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">TAT / Min Freight</span>
                  <span className="font-semibold text-gray-900">
                    {viewContract.tat || "-"} / {viewContract.minimumFreight || "-"}
                  </span>
                </div>
              </div>

              {/* Rate Items Table */}
              {viewContract.rateItems && viewContract.rateItems.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                    Contract Rate Slabs ({viewContract.rateItems.length})
                  </h4>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-gray-100 border-b border-gray-200 text-gray-700 font-semibold">
                        <tr>
                          <th className="py-2 px-3 text-center w-12">Sr#</th>
                          <th className="py-2 px-3">On Addition</th>
                          <th className="py-2 px-3 text-center">Lower Wt./Box</th>
                          <th className="py-2 px-3 text-center">Upper Wt./Box</th>
                          <th className="py-2 px-3 text-center">Rate</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {viewContract.rateItems.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50">
                            <td className="py-2 px-3 text-center font-medium text-gray-500">
                              {item.srNo}
                            </td>
                            <td className="py-2 px-3 font-semibold text-gray-800">
                              {item.onAddition || "-"}
                            </td>
                            <td className="py-2 px-3 text-center">{item.lowerWtBox || "-"}</td>
                            <td className="py-2 px-3 text-center">{item.upperWtBox || "-"}</td>
                            <td className="py-2 px-3 text-center font-bold text-axc-navy">
                              {item.rate || "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Remarks & Notes */}
              {(viewContract.remarks || viewContract.notes) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {viewContract.remarks && (
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <span className="font-bold text-gray-700 block mb-1">Remarks:</span>
                      <p className="text-gray-600 whitespace-pre-wrap">{viewContract.remarks}</p>
                    </div>
                  )}
                  {viewContract.notes && (
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <span className="font-bold text-gray-700 block mb-1">Notes:</span>
                      <p className="text-gray-600 whitespace-pre-wrap">{viewContract.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="px-6 py-3.5 border-t border-gray-200 bg-gray-50/70 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  const id = viewContract.id;
                  setViewContract(null);
                  router.push(`/master/customer-contracts/create?edit=${id}`);
                }}
                className="px-4 py-2 bg-axc-navy text-white rounded-lg text-xs font-semibold hover:bg-axc-navy/90 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Pencil size={13} />
                Edit Contract
              </button>
              <button
                type="button"
                onClick={() => setViewContract(null)}
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
        itemName={deleteTarget?.customer ? `${deleteTarget.customer} (${deleteTarget.id})` : deleteTarget?.id}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleConfirmSingleDelete}
        isLoading={isDeleting}
      />

      {/* Bulk Delete Dialog */}
      <DeleteConfirmationDialog
        isOpen={bulkDeleteOpen}
        itemName={`${selectedIds.length} ${
          selectedIds.length === 1 ? "contract" : "contracts"
        }`}
        onCancel={() => setBulkDeleteOpen(false)}
        onConfirm={handleConfirmBulkDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
