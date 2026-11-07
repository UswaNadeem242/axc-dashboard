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
  Building2,
  MapPin,
  ShieldCheck,
  FileCheck,
} from "lucide-react";
import CommonTable from "@/app/src/common/table";
import FilterSearch from "@/app/src/common/filtersearch";
import Button from "@/app/src/common/button";
import DeleteConfirmationDialog from "@/app/src/common/deleteConfirmation";
import Dropdown from "@/app/src/common/dropdown";
import { showToast } from "@/app/src/common/toast";
import {
  ConsigneeEntry,
  ConsigneeHeadings,
  consigneeFilterGroups,
  initialConsigneeData,
} from "./types";

export default function ConsigneeMasterPage() {
  const router = useRouter();

  const [data, setData] = useState<ConsigneeEntry[]>([]);
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);

  // Modals & Action State
  const [viewConsignee, setViewConsignee] = useState<ConsigneeEntry | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ConsigneeEntry | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // LocalStorage Persistence (Exact Shipper Pattern)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("master_consignees");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setData(parsed);
            return;
          }
        } catch (e) {
          console.error("Error reading stored consignees:", e);
        }
      }
      setData(initialConsigneeData);
      localStorage.setItem("master_consignees", JSON.stringify(initialConsigneeData));
    }
  }, []);

  const saveConsignees = (newList: ConsigneeEntry[]) => {
    setData(newList);
    if (typeof window !== "undefined") {
      localStorage.setItem("master_consignees", JSON.stringify(newList));
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
      const group = consigneeFilterGroups.find((g) =>
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

  // Search suggestions (exact Shipper / AWB pattern)
  const searchSuggestions = useMemo(() => {
    const codes = data.map((item) => item.code).filter(Boolean);
    const names = data.map((item) => item.name).filter(Boolean);
    const companies = data.map((item) => item.company).filter(Boolean);
    const customers = data.map((item) => item.customer).filter(Boolean);
    const cities = data.map((item) => item.city).filter(Boolean);
    return Array.from(new Set([...codes, ...names, ...companies, ...customers, ...cities]));
  }, [data]);

  // Filter & Search Logic
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        item.code.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        item.company.toLowerCase().includes(q) ||
        item.customer.toLowerCase().includes(q) ||
        item.city.toLowerCase().includes(q) ||
        item.state.toLowerCase().includes(q) ||
        item.country.toLowerCase().includes(q) ||
        item.contactNo.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q);

      const statusTags = activeTags.filter((t): t is "ACTIVE" | "INACTIVE" => t === "ACTIVE" || t === "INACTIVE");
      const companyTags = activeTags.filter((t) =>
        consigneeFilterGroups[2]?.options.some((o) => o.value === t)
      );
      const countryTags = activeTags.filter((t) =>
        consigneeFilterGroups[1]?.options.some((o) => o.value === t)
      );

      const matchesStatus =
        statusTags.length === 0 || statusTags.includes(item.status);
      const matchesCompany =
        companyTags.length === 0 || companyTags.includes(item.company);
      const matchesCountry =
        countryTags.length === 0 || countryTags.includes(item.country);

      const customTags = activeTags.filter(
        (t) =>
          !statusTags.includes(t as any) &&
          !companyTags.includes(t) &&
          !countryTags.includes(t)
      );
      const matchesCustom =
        customTags.length === 0 ||
        customTags.every((tag) => {
          const raw = tag.toLowerCase();
          return (
            item.code.toLowerCase().includes(raw) ||
            item.name.toLowerCase().includes(raw) ||
            item.company.toLowerCase().includes(raw) ||
            item.customer.toLowerCase().includes(raw) ||
            item.city.toLowerCase().includes(raw) ||
            item.state.toLowerCase().includes(raw) ||
            item.country.toLowerCase().includes(raw)
          );
        });

      return matchesQuery && matchesStatus && matchesCompany && matchesCountry && matchesCustom;
    });
  }, [data, searchQuery, activeTags]);

  // Paginated Data
  const paginatedData = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, page]);

  // Row Action Handlers (Exact Shipper Pattern)
  const handleView = (row: ConsigneeEntry) => {
    setViewConsignee(row);
  };

  const handleEdit = (row: ConsigneeEntry) => {
    router.push(`/master/consignee/create?edit=${row.id}`);
  };

  const handleDelete = (row: ConsigneeEntry) => {
    setDeleteTarget(row);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setTimeout(() => {
      const updated = data.filter((item) => item.id !== deleteTarget.id);
      saveConsignees(updated);
      setSelectedIds((prev) => prev.filter((id) => id !== deleteTarget.id));
      setIsDeleting(false);
      setDeleteTarget(null);
      showToast({
        variant: "success",
        message: `Consignee "${deleteTarget.name}" (${deleteTarget.code}) deleted.`,
      });
    }, 250);
  };

  const handleBulkDeleteConfirm = () => {
    if (selectedIds.length === 0) return;
    setIsDeleting(true);
    setTimeout(() => {
      const updated = data.filter((item) => !selectedIds.includes(item.id));
      saveConsignees(updated);
      setSelectedIds([]);
      setIsDeleting(false);
      setBulkDeleteOpen(false);
      showToast({
        variant: "success",
        message: `Deleted ${selectedIds.length} consignee records.`,
      });
    }, 250);
  };

  // Export CSV (Exact Shipper Pattern)
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
      "Consignee Code",
      "Consignee Name",
      "Company",
      "Customer",
      "Contact No",
      "Email",
      "City",
      "State",
      "Country",
      "Pincode",
      "Status",
    ];

    const rows = exportItems.map((d, idx) => [
      idx + 1,
      `"${d.code}"`,
      `"${d.name}"`,
      `"${d.company}"`,
      `"${d.customer}"`,
      `"${d.contactNo}"`,
      `"${d.email}"`,
      `"${d.city}"`,
      `"${d.state}"`,
      `"${d.country}"`,
      `"${d.pincode}"`,
      `"${d.status}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Consignees_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast({ variant: "success", message: "Consignee data exported successfully." });
  };

  // Headings mapped exactly to Shipper / AWB table specification
  const tableHeadings = ConsigneeHeadings.map((h) => {
    if (h.key === "srNo") {
      return {
        ...h,
        render: (_row: ConsigneeEntry, idx?: number) => (
          <span className="font-medium text-axc-dark-gray">
            {idx !== undefined ? idx + 1 : _row.srNo}
          </span>
        ),
      };
    }

    if (h.key === "selectConsignee") {
      const allSelected =
        paginatedData.length > 0 &&
        paginatedData.every((row) => selectedIds.includes(row.id));

      return {
        ...h,
        label: (
          <div className="flex flex-row-reverse items-center justify-center gap-1.5">
            <span className="text-xs font-bold capitalize leading-none whitespace-nowrap">
              Select Consignee
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
        render: (row: ConsigneeEntry) => (
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

    if (h.key === "code") {
      return {
        ...h,
        render: (row: ConsigneeEntry) => (
          <span className="font-medium text-axc-navy whitespace-nowrap">{row.code}</span>
        ),
      };
    }

    if (h.key === "name") {
      return {
        ...h,
        render: (row: ConsigneeEntry) => (
          <span className="font-semibold text-axc-dark-gray whitespace-nowrap">{row.name}</span>
        ),
      };
    }

    if (h.key === "company") {
      return {
        ...h,
        render: (row: ConsigneeEntry) => (
          <span className="text-axc-dark-gray whitespace-nowrap">{row.company}</span>
        ),
      };
    }

    if (h.key === "customer") {
      return {
        ...h,
        render: (row: ConsigneeEntry) => (
          <span className="text-axc-dark-gray whitespace-nowrap">{row.customer || "-"}</span>
        ),
      };
    }

    if (h.key === "contactNo") {
      return {
        ...h,
        render: (row: ConsigneeEntry) => (
          <span className="text-axc-dark-gray whitespace-nowrap font-mono">
            {row.dialCode ? `${row.dialCode} ` : ""}{row.contactNo || "-"}
          </span>
        ),
      };
    }

    if (h.key === "city") {
      return {
        ...h,
        render: (row: ConsigneeEntry) => (
          <span className="text-axc-dark-gray whitespace-nowrap">{row.city}</span>
        ),
      };
    }

    if (h.key === "state") {
      return {
        ...h,
        render: (row: ConsigneeEntry) => (
          <span className="text-axc-dark-gray whitespace-nowrap">{row.state}</span>
        ),
      };
    }

    if (h.key === "country") {
      return {
        ...h,
        render: (row: ConsigneeEntry) => (
          <span className="text-axc-dark-gray whitespace-nowrap">{row.country}</span>
        ),
      };
    }

    if (h.key === "pincode") {
      return {
        ...h,
        render: (row: ConsigneeEntry) => (
          <span className="text-axc-dark-gray whitespace-nowrap font-mono">{row.pincode || "-"}</span>
        ),
      };
    }

    if (h.key === "status") {
      return {
        ...h,
        render: (row: ConsigneeEntry) => (
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
      {/* ═══════════ TOP CONTROLS BAR (EXACT SHIPPER / AWB LAYOUT) ═══════════ */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-4 shrink-0">
        <div className="flex flex-wrap items-center gap-3">
          <FilterSearch
            groups={consigneeFilterGroups}
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
                            message: "Please select at least one consignee entry to delete.",
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
          label="New Consignee"
          href="/master/consignee/create"
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

      {/* ═══════════ COMMON TABLE (EXACT SHIPPER PROPS & ACTIONS) ═══════════ */}
      <div className="flex-1 min-h-0 flex flex-col">
        <CommonTable
          headings={tableHeadings}
          data={paginatedData}
          currentPage={page}
          onPageChange={setPage}
          itemsPerPage={itemsPerPage}
          showScroll={true}
          renderActions={(row: ConsigneeEntry) => (
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

      {/* ═══════════ VIEW CONSIGNEE MODAL (EXACT SHIPPER STYLE) ═══════════ */}
      {viewConsignee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
            <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-gray-50/80 sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-axc-navy text-white flex items-center justify-center font-bold">
                  {viewConsignee.code.slice(0, 3)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">{viewConsignee.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-mono text-gray-500">{viewConsignee.code}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-xs text-gray-600">{viewConsignee.company}</span>
                    <span className="text-gray-300">•</span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${
                        viewConsignee.status === "ACTIVE"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {viewConsignee.status}
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewConsignee(null)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-200 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs">
              <div>
                <h4 className="font-bold text-gray-700 uppercase tracking-wide text-[11px] mb-2.5 flex items-center gap-1.5">
                  <Building2 size={13} className="text-axc-navy" />
                  Profile & Entity Information
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  <div className="p-2.5 bg-gray-50 rounded border border-gray-100">
                    <span className="text-gray-400 block text-[10px] uppercase">Consignee Code</span>
                    <span className="font-semibold text-gray-800 font-mono">{viewConsignee.code}</span>
                  </div>
                  <div className="p-2.5 bg-gray-50 rounded border border-gray-100">
                    <span className="text-gray-400 block text-[10px] uppercase">Customer</span>
                    <span className="font-semibold text-gray-800">{viewConsignee.customer || "-"}</span>
                  </div>
                  <div className="p-2.5 bg-gray-50 rounded border border-gray-100">
                    <span className="text-gray-400 block text-[10px] uppercase">Company</span>
                    <span className="font-semibold text-gray-800 truncate block">{viewConsignee.company}</span>
                  </div>
                  <div className="p-2.5 bg-gray-50 rounded border border-gray-100">
                    <span className="text-gray-400 block text-[10px] uppercase">Contact Number</span>
                    <span className="font-semibold text-gray-800 font-mono">
                      {viewConsignee.dialCode ? `${viewConsignee.dialCode} ` : ""}{viewConsignee.contactNo || "-"}
                    </span>
                  </div>
                  <div className="p-2.5 bg-gray-50 rounded border border-gray-100">
                    <span className="text-gray-400 block text-[10px] uppercase">Email ID</span>
                    <span className="font-semibold text-gray-800 truncate block">{viewConsignee.email || "-"}</span>
                  </div>
                  <div className="p-2.5 bg-gray-50 rounded border border-gray-100">
                    <span className="text-gray-400 block text-[10px] uppercase">Date of Birth</span>
                    <span className="font-semibold text-gray-800">{viewConsignee.dob || "-"}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-3 mt-1">
                <h4 className="font-bold text-gray-700 uppercase tracking-wide text-[11px] mb-2.5 flex items-center gap-1.5">
                  <MapPin size={13} className="text-axc-navy" />
                  Address & Location Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-2.5">
                  <div className="p-2.5 bg-gray-50 rounded border border-gray-100 col-span-full">
                    <span className="text-gray-400 block text-[10px] uppercase">Address</span>
                    <span className="font-semibold text-gray-800 block">
                      {viewConsignee.addressLine1}
                      {viewConsignee.addressLine2 ? `, ${viewConsignee.addressLine2}` : ""}
                      {viewConsignee.addressLine3 ? `, ${viewConsignee.addressLine3}` : ""}
                    </span>
                  </div>
                  <div className="p-2.5 bg-gray-50 rounded border border-gray-100">
                    <span className="text-gray-400 block text-[10px] uppercase">City</span>
                    <span className="font-semibold text-gray-800">{viewConsignee.city}</span>
                  </div>
                  <div className="p-2.5 bg-gray-50 rounded border border-gray-100">
                    <span className="text-gray-400 block text-[10px] uppercase">State</span>
                    <span className="font-semibold text-gray-800">{viewConsignee.state}</span>
                  </div>
                  <div className="p-2.5 bg-gray-50 rounded border border-gray-100">
                    <span className="text-gray-400 block text-[10px] uppercase">Country</span>
                    <span className="font-semibold text-gray-800">{viewConsignee.country}</span>
                  </div>
                  <div className="p-2.5 bg-gray-50 rounded border border-gray-100">
                    <span className="text-gray-400 block text-[10px] uppercase">Pincode</span>
                    <span className="font-semibold text-gray-800 font-mono">{viewConsignee.pincode || "-"}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-3 mt-1">
                <h4 className="font-bold text-gray-700 uppercase tracking-wide text-[11px] mb-2.5 flex items-center gap-1.5">
                  <FileCheck size={13} className="text-axc-navy" />
                  Attached Documents & Proofs
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="p-2.5 bg-gray-50 rounded border border-gray-100 flex items-center justify-between">
                    <span className="text-gray-500 font-medium">Consignee ID Proof 1</span>
                    <span className="font-mono text-gray-800 text-[11px] truncate max-w-[170px]">
                      {viewConsignee.idProof1 || "Not uploaded"}
                    </span>
                  </div>
                  <div className="p-2.5 bg-gray-50 rounded border border-gray-100 flex items-center justify-between">
                    <span className="text-gray-500 font-medium">Consignee ID Proof 2</span>
                    <span className="font-mono text-gray-800 text-[11px] truncate max-w-[170px]">
                      {viewConsignee.idProof2 || "Not uploaded"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 flex justify-end gap-2 bg-gray-50">
              <button
                type="button"
                onClick={() => {
                  const id = viewConsignee.id;
                  setViewConsignee(null);
                  router.push(`/master/consignee/create?edit=${id}`);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-axc-navy text-white rounded-lg text-xs font-semibold hover:bg-axc-navy/90 transition cursor-pointer"
              >
                <Pencil size={13} />
                Edit Consignee
              </button>
              <button
                type="button"
                onClick={() => setViewConsignee(null)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-xs font-semibold transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ DELETE CONFIRMATION DIALOGS (EXACT SHIPPER STYLE) ═══════════ */}
      <DeleteConfirmationDialog
        isOpen={Boolean(deleteTarget)}
        itemName={deleteTarget ? `${deleteTarget.name} (${deleteTarget.code})` : ""}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
      />

      <DeleteConfirmationDialog
        isOpen={bulkDeleteOpen}
        itemName={`${selectedIds.length} ${
          selectedIds.length === 1 ? "Consignee" : "Consignees"
        }`}
        onCancel={() => setBulkDeleteOpen(false)}
        onConfirm={handleBulkDeleteConfirm}
        isLoading={isDeleting}
      />
    </div>
  );
}
