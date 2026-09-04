"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  PlusCircle,
  PlusCircleIcon,
} from "lucide-react";
import CommonTable from "../src/common/table";
import {
  AwbEntryheading,
  AwbEntry,
  initialData,
  awbFilterOptions,
} from "../src/constant";
import FilterSearch from "../src/common/filtersearch";
import Button from "../src/common/button";
import DeleteConfirmationDialog from "../src/common/deleteConfirmation";

export default function AwbEntriesPage() {
  const router = useRouter();

  const [data, setData] = useState<AwbEntry[]>([]);
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [pageSize, setPageSize] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);

  const [deleteTarget, setDeleteTarget] = useState<AwbEntry | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSearchSubmit = (val: string) => {
    const trimmed = val.trim();
    if (!trimmed) return;

    let tag = trimmed;
    if (filterType) {
      const opt = awbFilterOptions.find((o) => o.value === filterType);
      if (opt && opt.value) {
        tag = `${opt.label}: ${trimmed}`;
      }
    }

    if (!activeTags.includes(tag)) {
      setActiveTags((prev) => [...prev, tag]);
      setSearchQuery("");
      setFilterType("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setActiveTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("awb_entries");
      if (stored) {
        try {
          const parsed: AwbEntry[] = JSON.parse(stored);
          if (parsed.length > initialData.length) {
            setData(parsed);
            return;
          }
        } catch (e) {
          console.error(e);
        }
      }
      setData(initialData);
      localStorage.setItem("awb_entries", JSON.stringify(initialData));
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && data.length > 0) {
      localStorage.setItem("awb_entries", JSON.stringify(data));
    }
  }, [data]);

  const handleDelete = (row: AwbEntry) => {
    setDeleteTarget(row);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setData((prev) => prev.filter((item) => item.awbNumber !== deleteTarget.awbNumber));
    setSelectedIds((prev) => prev.filter((id) => id !== deleteTarget.awbNumber));
    setIsDeleting(false);
    setDeleteTarget(null);
  };

  const cancelDelete = () => {
    if (isDeleting) return;
    setDeleteTarget(null);
  };

  const handleTrack = (row: AwbEntry) => console.log("Track AWB", row.awbNumber);
  const handleMail = (row: AwbEntry) => console.log("Email AWB", row.awbNumber);
  const handlePdf1 = (row: AwbEntry) => console.log("View PDF 1", row.awbNumber);
  const handlePdf2 = (row: AwbEntry) => console.log("View PDF 2", row.awbNumber);
  const handleInv = (row: AwbEntry) => console.log("View INV", row.awbNumber);
  const handleEdit = (row: AwbEntry) => router.push(`/create-entries?edit=${row.awbNumber}`);
  const handleView = (row: AwbEntry) => router.push(`/awb-entries/view/${row.awbNumber}`);

  const filteredData = data.filter((item) => {
    const query = searchQuery.trim().toLowerCase();

    let matchesQuery = true;
    if (query) {
      if (filterType && filterType in item) {
        matchesQuery = String((item as Record<string, any>)[filterType] ?? "")
          .toLowerCase()
          .includes(query);
      } else {
        matchesQuery =
          (item.awbNumber || "").toLowerCase().includes(query) ||
          (item.customer || "").toLowerCase().includes(query) ||
          (item.forwardingNumber || "").toLowerCase().includes(query) ||
          (item.consignee || "").toLowerCase().includes(query) ||
          (item.shipper || "").toLowerCase().includes(query) ||
          (item.origin || "").toLowerCase().includes(query) ||
          (item.destination || "").toLowerCase().includes(query) ||
          (item.product || "").toLowerCase().includes(query) ||
          (item.service || "").toLowerCase().includes(query) ||
          (item.vendor || "").toLowerCase().includes(query) ||
          (item.masterCode || "").toLowerCase().includes(query) ||
          (item.bookingDate || "").toLowerCase().includes(query) ||
          (item.status || "").toLowerCase().includes(query);
      }
    }

    const matchesTags = activeTags.every((tag) => {
      const t = tag.toLowerCase();
      if (t.includes(":")) {
        const [fieldLabel, val] = t.split(":").map((s) => s.trim());
        const matchedOption = awbFilterOptions.find(
          (o) => o.label.toLowerCase() === fieldLabel
        );
        if (matchedOption && matchedOption.value in item) {
          return String((item as Record<string, any>)[matchedOption.value] ?? "")
            .toLowerCase()
            .includes(val);
        }
      }
      return (
        (item.awbNumber || "").toLowerCase().includes(t) ||
        (item.customer || "").toLowerCase().includes(t) ||
        (item.forwardingNumber || "").toLowerCase().includes(t) ||
        (item.consignee || "").toLowerCase().includes(t) ||
        (item.shipper || "").toLowerCase().includes(t) ||
        (item.origin || "").toLowerCase().includes(t) ||
        (item.destination || "").toLowerCase().includes(t) ||
        (item.product || "").toLowerCase().includes(t) ||
        (item.service || "").toLowerCase().includes(t) ||
        (item.vendor || "").toLowerCase().includes(t) ||
        (item.masterCode || "").toLowerCase().includes(t) ||
        (item.bookingDate || "").toLowerCase().includes(t) ||
        (item.status || "").toLowerCase().includes(t)
      );
    });

    return matchesQuery && matchesTags;
  });

  const [sortKey, setSortKey] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

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

  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(sortedData.length / itemsPerPage));
  const paginatedData = sortedData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const tableHeadings = AwbEntryheading.map((h) => {
    if (h.key === "srNo") {
      return {
        ...h,
        render: (_row: AwbEntry, idx?: number) => (
          <span className="font-medium text-axc-dark-gray">{idx !== undefined ? idx + 1 : _row.srNo}</span>
        ),
      };
    }
    if (h.key === "selectAwb") {
      const allSelected =
        paginatedData.length > 0 &&
        paginatedData.every((row) => selectedIds.includes(row.awbNumber));

      return {
        ...h,
        label: (
          <div className="flex flex-col items-center justify-center gap-1.5 py-0.5">
            <span className="text-xs font-semibold uppercase whitespace-nowrap">SELECT AWB</span>
            <input
              type="checkbox"
              checked={allSelected}
              onChange={() => {
                if (allSelected) {
                  setSelectedIds((prev) =>
                    prev.filter((id) => !paginatedData.some((row) => row.awbNumber === id))
                  );
                } else {
                  setSelectedIds((prev) =>
                    Array.from(new Set([...prev, ...paginatedData.map((row) => row.awbNumber)]))
                  );
                }
              }}
              className="h-3.5 w-3.5 accent-axc-navy cursor-pointer"
            />
          </div>
        ),
        render: (row: AwbEntry) => (
          <div className="flex items-center justify-center">
            <input
              type="checkbox"
              checked={selectedIds.includes(row.awbNumber)}
              onChange={() => {
                setSelectedIds((prev) =>
                  prev.includes(row.awbNumber)
                    ? prev.filter((id) => id !== row.awbNumber)
                    : [...prev, row.awbNumber]
                );
              }}
              className="h-3.5 w-3.5 accent-axc-navy cursor-pointer"
            />
          </div>
        ),
      };
    }
    if (h.key === "masterCode") {
      return {
        ...h,
        label: (
          <div className="flex flex-col text-left font-bold text-xs uppercase leading-[14px]">
            <span>INVOICE</span>
            <span>RANGE</span>
            <span>MASTER</span>
            <div className="flex items-center gap-1">
              <span>CODE</span>

            </div>
          </div>
        ),
      };
    }
    return h;
  });

  useEffect(() => {
    setPage(1);
  }, [searchQuery, filterType, activeTags]);

  return (
    <div className="relative bg-white p-4 rounded-lg w-full flex-1 flex flex-col min-h-0  shadow-sm border border-axc-border  overflow-x-hidden overflow-y-scroll [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-axc-gray/40 [&::-webkit-scrollbar-thumb]:rounded-lg">
      <div className="flex flex-wrap justify-between items-center gap-3 mb-4 shrink-0">
        <FilterSearch
          options={awbFilterOptions}
          selectedOption={filterType}
          onOptionChange={setFilterType}
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          onSearchSubmit={handleSearchSubmit}
          placeholder="Search"
        />
        <Button label="New AWB" href="/create-entries" variant="primary" icon={PlusCircleIcon} />
      </div>

      {activeTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-3 shrink-0 border-axc-gray">
          {activeTags.map((tag, idx) => {
            const colors = [
              "border-slate-200 bg-slate-50 text-slate-700 ",
              "border-axc-red/30 bg-axc-red/5 text-axc-red",
              "border-axc-yellow/30 bg-axc-yellow/5 text-axc-dark-yellow",
              "border-axc-green/30 bg-axc-green/5 text-axc-dark-green",
              "border-axc-sky/30 bg-axc-sky/5 text-axc-sky",
              "border-axc-blue/30 bg-axc-blue/5 text-axc-blue",
              "border-purple-200 bg-purple-50 text-purple-700",
              "border-pink-200 bg-pink-50 text-pink-700",
            ];
            const colorClass = colors[idx % colors.length];

            return (
              <span
                key={tag}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium transition ${colorClass}`}
              >
                {tag}
                <X
                  size={14}
                  className="cursor-pointer hover:opacity-70 transition-opacity"
                  onClick={() => removeTag(tag)}
                />
              </span>
            );
          })}
        </div>
      )}

      <div className="flex-1 min-h-0 flex flex-col">
        <CommonTable
          headings={tableHeadings}
          data={sortedData}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(p) => setPage(p)}
          itemsPerPage={itemsPerPage}
          sortKey={sortKey}
          sortDirection={sortDirection}
          onSort={handleSort}
          rowKey="awbNumber"
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
        />
      </div>

      <DeleteConfirmationDialog
        isOpen={!!deleteTarget}
        itemName={deleteTarget?.awbNumber}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}