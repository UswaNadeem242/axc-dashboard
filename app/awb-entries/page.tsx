"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  RotateCcw,
  Plus,
  Download,
  MoreHorizontal,
  ChevronRight,
  ChevronsRight,
  X,
} from "lucide-react";
import CommonTable from "../src/common/table";
import { AwbEntryheading, AwbEntry, initialData } from "../src/constant";
import FilterSearch from "../src/common/filtersearch";
import Button from "../src/common/button";
export default function AwbEntriesPage() {
  const [data, setData] = useState<AwbEntry[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [pageSize, setPageSize] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);

  const handleSearchSubmit = (val: string) => {
    const trimmed = val.trim();
    if (trimmed && !activeTags.includes(trimmed)) {
      setActiveTags((prev) => [...prev, trimmed]);
      setSearchQuery("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setActiveTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Always load from initialData as the source of truth.
      // Merge with any user-added entries from localStorage that don't exist in initialData.
      const stored = localStorage.getItem("awb_entries");
      if (stored) {
        try {
          const parsed: AwbEntry[] = JSON.parse(stored);
          // If stored has more entries than initialData, it means user added rows — keep them
          if (parsed.length > initialData.length) {
            setData(parsed);
            return;
          }
        } catch (e) {
          console.error(e);
        }
      }
      // Default: use the latest initialData
      setData(initialData);
      localStorage.setItem("awb_entries", JSON.stringify(initialData));
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && data.length > 0) {
      localStorage.setItem("awb_entries", JSON.stringify(data));
    }
  }, [data]);

  // Form State
  const [newAwb, setNewAwb] = useState({
    awbNumber: "",
    forwardingNumber: "",
    customer: "ELS INDIA",
    masterCode: "NONGST",
    product: "NONDOX",
    pcs: 1,
    service: "FEDEX IP EX NEW YORK - INDIA",
    vendor: "FEDEX IP EX NEW YORK - INDIA 210588750",
    origin: "INDIA",
    destination: "UNITED STATES OF AMERICA",
    consignee: "",
    shipper: "",
    status: "Arrived",
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(data.map((item) => item.awbNumber));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectItem = (awbNumber: string) => {
    setSelectedIds((prev) =>
      prev.includes(awbNumber)
        ? prev.filter((id) => id !== awbNumber)
        : [...prev, awbNumber]
    );
  };

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAwb.awbNumber) return;

    const entry: AwbEntry = {
      srNo: data.length + 1,
      awbNumber: newAwb.awbNumber,
      bookingDate: new Date().toLocaleString(),
      forwardingNumber: newAwb.forwardingNumber || "8745" + Math.floor(10000000 + Math.random() * 90000000),
      customer: newAwb.customer,
      masterCode: newAwb.masterCode,
      product: newAwb.product,
      pcs: Number(newAwb.pcs),
      service: newAwb.service,
      vendor: newAwb.vendor,
      origin: newAwb.origin,
      destination: newAwb.destination,
      consignee: newAwb.consignee || "N/A",
      shipper: newAwb.shipper || "N/A",
      status: newAwb.status,
    };

    setData([entry, ...data]);
    setShowAddModal(false);
    // Reset Form
    setNewAwb({
      awbNumber: "",
      forwardingNumber: "",
      customer: "ELS INDIA",
      masterCode: "NONGST",
      product: "NONDOX",
      pcs: 1,
      service: "FEDEX IP EX NEW YORK - INDIA",
      vendor: "FEDEX IP EX NEW YORK - INDIA 210588750",
      origin: "INDIA",
      destination: "UNITED STATES OF AMERICA",
      consignee: "",
      shipper: "",
      status: "Arrived",
    });
  };

  const handleDelete = (row: AwbEntry) => {
    if (confirm(`Are you sure you want to delete AWB ${row.awbNumber}?`)) {
      setData((prev) => prev.filter((item) => item.awbNumber !== row.awbNumber));
    }
  };

  const handleTrack = (row: AwbEntry) => {
    console.log("Track AWB", row.awbNumber);
  };

  const handleMail = (row: AwbEntry) => {
    console.log("Email AWB", row.awbNumber);
  };

  const handlePdf1 = (row: AwbEntry) => {
    console.log("View PDF 1", row.awbNumber);
  };

  const handlePdf2 = (row: AwbEntry) => {
    console.log("View PDF 2", row.awbNumber);
  };

  const handleInv = (row: AwbEntry) => {
    console.log("View INV", row.awbNumber);
  };

  const handleEdit = (row: AwbEntry) => {
    console.log("Edit AWB", row.awbNumber);
  };

  const filteredData = data.filter((item) => {
    const query = searchQuery.toLowerCase();
    const matchesQuery =
      !query ||
      (item.awbNumber || "").toLowerCase().includes(query) ||
      (item.customer || "").toLowerCase().includes(query) ||
      (item.forwardingNumber || "").toLowerCase().includes(query) ||
      (item.consignee || "").toLowerCase().includes(query) ||
      (item.shipper || "").toLowerCase().includes(query);

    const matchesTags = activeTags.every((tag) => {
      const t = tag.toLowerCase();
      return (
        (item.awbNumber || "").toLowerCase().includes(t) ||
        (item.customer || "").toLowerCase().includes(t) ||
        (item.forwardingNumber || "").toLowerCase().includes(t) ||
        (item.consignee || "").toLowerCase().includes(t) ||
        (item.shipper || "").toLowerCase().includes(t)
      );
    });

    return matchesQuery && matchesTags;
  });
  const [page, setPage] = useState(1);

  const itemsPerPage = 10;

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));

  // Reset to page 1 whenever the search query changes
  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-2">
        {/* Title & Breadcrumbs */}
        <div>
          <h1 className="text-3xl font-bold text-axc-navy">AWB Entries</h1>
          
        </div>

        {/* Search & Action Button */}
        <div className="flex flex-wrap items-center gap-3">
          <FilterSearch
            options={[
              { label: "Select", value: "" },
              { label: "AWB Number", value: "awb" },
              { label: "Customer", value: "customer" },
            ]}
            selectedOption={filterType}
            onOptionChange={setFilterType}
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            onSearchSubmit={handleSearchSubmit}
            placeholder="Search"
          />
          <Button
            label="Create Entry"
            href="/create-entries"
            variant="primary"
          />
        </div>
      </div>

      {/* Render Active Badges */}
      {activeTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {activeTags.map((tag, idx) => {
            const colors = [
              "border-slate-200 bg-slate-50 text-slate-700",
              "border-red-200 bg-red-50 text-red-700",
              "border-amber-200 bg-amber-50 text-amber-700",
              "border-green-200 bg-green-50 text-green-700",
              "border-blue-200 bg-blue-50 text-blue-700",
              "border-indigo-200 bg-indigo-50 text-indigo-700",
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
      {/* Reusable Common Table Component */}
      <div className="overflow-x-auto rounded-xl border border-axc-border bg-white  shadow-sm">
        <CommonTable
          headings={AwbEntryheading}
          data={filteredData}
          onEdit={handleEdit}
          onDelete={handleDelete}

          currentPage={page}
          totalPages={totalPages}

          onPageChange={(page) => {
            setPage(page);
          }}

          itemsPerPage={itemsPerPage}
        />
      </div>
    </div>
  );
}
