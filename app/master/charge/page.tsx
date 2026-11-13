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
  DollarSign,
  CheckCircle,
  XCircle,
  Percent,
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
  ChargeEntry,
  ChargeHeadings,
  chargeFilterGroups,
  SERVICE_PROVIDERS,
  initialChargeData,
} from "./types";

export default function ChargeMasterPage() {
  const router = useRouter();

  const [data, setData] = useState<ChargeEntry[]>([]);
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);

  // Modals & Action State
  const [viewCharge, setViewCharge] = useState<ChargeEntry | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ChargeEntry | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // API + LocalStorage Persistence
  useEffect(() => {
    let mounted = true;
    api
      .getMasterList<ChargeEntry>("/charge-masters")
      .then((list) => {
        if (!mounted) return;
        if (Array.isArray(list) && list.length > 0) {
          setData(list);
          if (typeof window !== "undefined") {
            localStorage.setItem("master_charges", JSON.stringify(list));
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
        const stored = localStorage.getItem("master_charges");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setData(parsed);
              return;
            }
          } catch (e) {
            console.error("Error reading stored charges:", e);
          }
        }
        setData(initialChargeData);
        localStorage.setItem("master_charges", JSON.stringify(initialChargeData));
      }
    }

    return () => {
      mounted = false;
    };
  }, []);

  const saveCharges = (newList: ChargeEntry[]) => {
    setData(newList);
    if (typeof window !== "undefined") {
      localStorage.setItem("master_charges", JSON.stringify(newList));
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
      const group = chargeFilterGroups.find((g) =>
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
    setActiveTags((prev) => prev.filter((tag) => tag !== tagToRemove));
    setPage(1);
  };

  // Search suggestions
  const searchSuggestions = useMemo(() => {
    const names = data.map((item) => item.name).filter(Boolean);
    const sacs = data.map((item) => item.sac).filter(Boolean);
    const rateTypes = data.map((item) => item.rateType).filter(Boolean);
    return Array.from(new Set([...names, ...sacs, ...rateTypes]));
  }, [data]);

  // Filter & Search Logic
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.sac.toLowerCase().includes(q) ||
        item.rateType.toLowerCase().includes(q);

      const statusTags = activeTags.filter((t): t is "ACTIVE" | "INACTIVE" => t === "ACTIVE" || t === "INACTIVE");
      const rateTypeTags = activeTags.filter((t) =>
        chargeFilterGroups[1]?.options.some((o) => o.value === t)
      );

      const matchesStatus =
        statusTags.length === 0 || statusTags.includes(item.status);
      const matchesRateType =
        rateTypeTags.length === 0 || rateTypeTags.includes(item.rateType);

      const hasVat = activeTags.includes("vat_applicable");
      const hasManual = activeTags.includes("manual_entry");
      const hasFsc = activeTags.includes("fsc_sales");

      const matchesRules =
        (!hasVat || item.isVatApplicable) &&
        (!hasManual || item.isManual) &&
        (!hasFsc || item.isFscApplicableSales);

      const customTags = activeTags.filter(
        (t) =>
          !statusTags.includes(t as any) &&
          !rateTypeTags.includes(t) &&
          t !== "vat_applicable" &&
          t !== "manual_entry" &&
          t !== "fsc_sales"
      );

      const matchesCustom =
        customTags.length === 0 ||
        customTags.every((tag) => {
          const raw = tag.toLowerCase();
          return item.name.toLowerCase().includes(raw) || item.sac.toLowerCase().includes(raw);
        });

      return matchesQuery && matchesStatus && matchesRateType && matchesRules && matchesCustom;
    });
  }, [data, searchQuery, activeTags]);

  // Latest first sorted data
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      // 1. Primary: latest created date first
      const rawDateA = a.createdAt || (a as any).created_at || (a as any).createdDate;
      const rawDateB = b.createdAt || (b as any).created_at || (b as any).createdDate;
      const dateA = rawDateA ? new Date(rawDateA).getTime() : 0;
      const dateB = rawDateB ? new Date(rawDateB).getTime() : 0;
      if (dateA && dateB && dateA !== dateB) return dateB - dateA;

      // 2. Secondary: latest numeric ID first
      const idA = Number(a.id) || 0;
      const idB = Number(b.id) || 0;
      if (idA && idB && idA !== idB) return idB - idA;

      return String(b.id || "").localeCompare(String(a.id || ""));
    });
  }, [filteredData]);

  // Paginated Data
  const totalPages = Math.max(1, Math.ceil(sortedData.length / itemsPerPage));
  const paginatedData = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return sortedData.slice(start, start + itemsPerPage);
  }, [sortedData, page, itemsPerPage]);

  // Row Action Handlers
  const handleView = (row: ChargeEntry) => {
    setViewCharge(row);
  };

  const handleEdit = (row: ChargeEntry) => {
    router.push(`/master/charge/create?edit=${row.id}`);
  };

  const handleDelete = (row: ChargeEntry) => {
    setDeleteTarget(row);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await api.deleteMasterItem("/charge-masters", deleteTarget.id);
    } catch {
      // fallback to local
    }
    const updated = data.filter((item) => String(item.id) !== String(deleteTarget.id));
    saveCharges(updated);
    setSelectedIds((prev) => prev.filter((id) => String(id) !== String(deleteTarget.id)));
    setIsDeleting(false);
    setDeleteTarget(null);
    showToast({
      variant: "success",
      message: `Charge "${deleteTarget.name}" deleted successfully.`,
    });
  };

  const handleBulkDeleteConfirm = async () => {
    if (selectedIds.length === 0) return;
    setIsDeleting(true);
    try {
      await api.bulkDeleteMasterItems("/charge-masters", selectedIds);
    } catch {
      // fallback to local
    }
    const updated = data.filter((item) => !selectedIds.map(String).includes(String(item.id)));
    saveCharges(updated);
    setSelectedIds([]);
    setIsDeleting(false);
    setBulkDeleteOpen(false);
    showToast({
      variant: "success",
      message: `Deleted ${selectedIds.length} charge records.`,
    });
  };

  // Export CSV
  const handleBulkExport = () => {
    const exportItems =
      selectedIds.length > 0
        ? data.filter((item) => selectedIds.includes(item.id))
        : filteredData;

    if (exportItems.length === 0) {
      showToast({ variant: "error", message: "No entries to export." });
      return;
    }

    const headers = [
      "Sr No",
      "Charge Name",
      "SAC Code",
      "Rate Type",
      "VAT Applicable",
      "FSC Sales",
      "FSC Purchase",
      "Manual",
      "Customer Optional",
      "Vendor Optional",
      "Default",
      "Hide in Invoice",
      "Status",
    ];

    const rows = exportItems.map((d, idx) => [
      idx + 1,
      `"${d.name}"`,
      `"${d.sac}"`,
      `"${d.rateType}"`,
      d.isVatApplicable ? "YES" : "NO",
      d.isFscApplicableSales ? "YES" : "NO",
      d.isFscApplicablePurchase ? "YES" : "NO",
      d.isManual ? "YES" : "NO",
      d.isCustomerOptional ? "YES" : "NO",
      d.isVendorOptional ? "YES" : "NO",
      d.isDefault ? "YES" : "NO",
      d.hideInInvoice ? "YES" : "NO",
      `"${d.status}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Charge_Master_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast({ variant: "success", message: "Charge master exported successfully." });
  };

  // Table headings mapping
  const tableHeadings = ChargeHeadings.map((h) => {
    if (h.key === "srNo") {
      return {
        ...h,
        render: (_row: ChargeEntry, idx?: number) => (
          <span className="font-medium text-axc-dark-gray">
            {idx !== undefined ? (page - 1) * itemsPerPage + idx + 1 : _row.srNo}
          </span>
        ),
      };
    }

    if (h.key === "selectCharge") {
      const allSelected =
        paginatedData.length > 0 &&
        paginatedData.every((row) => selectedIds.includes(row.id));

      return {
        ...h,
        label: (
          <div className="flex flex-row-reverse items-center justify-center gap-1.5">
            <span className="text-xs font-bold capitalize leading-none whitespace-nowrap">
              Select Charge
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
        render: (row: ChargeEntry) => (
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
        render: (row: ChargeEntry) => (
          <span className="font-semibold text-axc-dark-gray whitespace-nowrap">{row.name}</span>
        ),
      };
    }

    if (h.key === "sac") {
      return {
        ...h,
        render: (row: ChargeEntry) => (
          <span className="text-axc-dark-gray font-mono text-xs whitespace-nowrap">{row.sac || "—"}</span>
        ),
      };
    }

    if (h.key === "rateType") {
      return {
        ...h,
        render: (row: ChargeEntry) => (
          <span className="px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-700 whitespace-nowrap border border-gray-200">
            {row.rateType}
          </span>
        ),
      };
    }

    if (h.key === "isVatApplicable") {
      return {
        ...h,
        render: (row: ChargeEntry) => (
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded ${
              row.isVatApplicable
                ? "bg-blue-50 text-blue-700 border border-blue-200"
                : "bg-gray-50 text-gray-400"
            }`}
          >
            {row.isVatApplicable ? "YES" : "NO"}
          </span>
        ),
      };
    }

    if (h.key === "isFscApplicableSales") {
      return {
        ...h,
        render: (row: ChargeEntry) => (
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded ${
              row.isFscApplicableSales
                ? "bg-amber-50 text-amber-700 border border-amber-200"
                : "bg-gray-50 text-gray-400"
            }`}
          >
            {row.isFscApplicableSales ? "YES" : "NO"}
          </span>
        ),
      };
    }

    if (h.key === "isManual") {
      return {
        ...h,
        render: (row: ChargeEntry) => (
          <span
            className={`inline-flex items-center justify-center text-[11px] font-semibold px-2.5 py-0.5 rounded border whitespace-nowrap ${
              row.isManual
                ? "bg-purple-50 text-purple-700 border-purple-200"
                : "bg-blue-50 text-blue-700 border-blue-200"
            }`}
          >
            {row.isManual ? "MANUAL" : "AUTO"}
          </span>
        ),
      };
    }

    if (h.key === "status") {
      return {
        ...h,
        render: (row: ChargeEntry) => (
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
      {/* ═══════════ TOP CONTROLS BAR (AWB / SHIPPER PATTERN) ═══════════ */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-4 shrink-0">
        <div className="flex flex-wrap items-center gap-3">
          <FilterSearch
            groups={chargeFilterGroups}
            selectedOptions={activeTags}
            onOptionsChange={handleTagsChange}
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            onSearchSubmit={handleSearchSubmit}
            placeholder="Search charge name, sac code..."
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
                            message: "Please select at least one charge entry to delete.",
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
          label="New Charge"
          href="/master/charge/create"
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

      {/* ═══════════ COMMON TABLE ═══════════ */}
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
          renderActions={(row: ChargeEntry) => (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleView(row)}
                className="inline-flex items-center justify-center rounded-md border border-axc-navy/30 p-1.5 text-axc-navy transition hover:bg-axc-navy/10 cursor-pointer"
                title="View Charge"
              >
                <Eye size={16} />
              </button>
              <button
                type="button"
                onClick={() => handleEdit(row)}
                className="inline-flex items-center justify-center rounded-md border border-axc-dark-green/30 p-1.5 text-axc-dark-green transition hover:bg-axc-dark-green/10 cursor-pointer"
                title="Edit Charge"
              >
                <Pencil size={16} />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(row)}
                className="inline-flex items-center justify-center rounded-md border border-axc-red-dark/30 p-1.5 text-axc-red-dark transition hover:bg-axc-red-dark/10 cursor-pointer"
                title="Delete Charge"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
        />
      </div>

      {/* ═══════════ VIEW CHARGE MODAL ═══════════ */}
      {viewCharge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-axc-navy/60 text-white rounded-t-xl">
              <div className="flex items-center gap-2.5">
                <DollarSign size={18} />
                <h3 className="text-base font-bold uppercase tracking-wide">{viewCharge.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setViewCharge(null)}
                className="text-white/80 hover:text-white p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase">SAC Code</span>
                  <span className="font-semibold text-gray-800 font-mono">{viewCharge.sac || "—"}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase">Rate Type</span>
                  <span className="font-semibold text-gray-800">{viewCharge.rateType}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase">Status</span>
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                      viewCharge.status === "ACTIVE"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {viewCharge.status}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase">Created</span>
                  <span className="text-gray-600">{viewCharge.createdAt}</span>
                </div>
              </div>

              {/* Rules & Checkboxes */}
              <div>
                <h4 className="font-bold text-gray-700 uppercase tracking-wide text-[11px] mb-2 flex items-center gap-1.5">
                  <Layers size={13} className="text-axc-navy" />
                  Billing Rules & Configuration
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { label: "VAT Applicable", val: viewCharge.isVatApplicable },
                    { label: "FSC Sales", val: viewCharge.isFscApplicableSales },
                    { label: "FSC Purchase", val: viewCharge.isFscApplicablePurchase },
                    { label: "Manual Charge", val: viewCharge.isManual },
                    { label: "Customer Optional", val: viewCharge.isCustomerOptional },
                    { label: "Vendor Optional", val: viewCharge.isVendorOptional },
                    { label: "Default Charge", val: viewCharge.isDefault },
                    { label: "Hide In Invoice", val: viewCharge.hideInInvoice },
                    { label: "Display In AWB", val: viewCharge.displayInAwbAppliesCharges },
                    { label: "Duty Invoice", val: viewCharge.showInDutyInvoice },
                    { label: "DRS Attempt Charge", val: viewCharge.applyDrsAttemptCharge },
                  ].map((rule) => (
                    <div
                      key={rule.label}
                      className="p-2 border border-gray-100 rounded bg-white flex items-center justify-between"
                    >
                      <span className="text-gray-600">{rule.label}</span>
                      {rule.val ? (
                        <CheckCircle size={14} className="text-emerald-600" />
                      ) : (
                        <XCircle size={14} className="text-gray-300" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Service Provider Mappings */}
              <div>
                <h4 className="font-bold text-gray-700 uppercase tracking-wide text-[11px] mb-2 flex items-center gap-1.5">
                  <Percent size={13} className="text-axc-navy" />
                  Carrier / Service Charge Mappings
                </h4>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
                      <tr>
                        <th className="px-3 py-2 w-1/3">Service</th>
                        <th className="px-3 py-2">Charge Name in Carrier System</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {SERVICE_PROVIDERS.map((s) => (
                        <tr key={s.key}>
                          <td className="px-3 py-2 font-bold text-gray-700">{s.label}</td>
                          <td className="px-3 py-2 text-gray-800">
                            {viewCharge.serviceMappings[s.key] || "—"}
                          </td>
                        </tr>
                      ))}
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
                  const id = viewCharge.id;
                  setViewCharge(null);
                  router.push(`/master/charge/create?edit=${id}`);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-axc-navy text-white rounded-lg text-xs font-semibold hover:bg-axc-navy/90 transition cursor-pointer"
              >
                <Pencil size={13} />
                Edit Charge
              </button>
              <button
                type="button"
                onClick={() => setViewCharge(null)}
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
        itemName={deleteTarget ? `${deleteTarget.name}` : ""}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
      />

      <DeleteConfirmationDialog
        isOpen={bulkDeleteOpen}
        itemName={`${selectedIds.length} ${
          selectedIds.length === 1 ? "Charge" : "Charges"
        }`}
        onCancel={() => setBulkDeleteOpen(false)}
        onConfirm={handleBulkDeleteConfirm}
        isLoading={isDeleting}
      />
    </div>
  );
}

