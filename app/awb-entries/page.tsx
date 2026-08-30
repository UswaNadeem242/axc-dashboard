"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  PlusCircle,
  PlusCircleIcon,
} from "lucide-react";
import CommonTable from "../src/common/table";
import { AwbEntryheading, AwbEntry, initialData } from "../src/constant";
import FilterSearch from "../src/common/filtersearch";
import Button from "../src/common/button";

export default function AwbEntriesPage() {
  const router = useRouter();
  const router = useRouter();
  const [data, setData] = useState<AwbEntry[]>([]);
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
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
    if (confirm(`Are you sure you want to delete AWB ${row.awbNumber}?`)) {
      setData((prev) => prev.filter((item) => item.awbNumber !== row.awbNumber));
      setSelectedIds((prev) => prev.filter((id) => id !== row.awbNumber));
    }
  };

  const handleTrack = (row: AwbEntry) => console.log("Track AWB", row.awbNumber);
  const handleMail = (row: AwbEntry) => console.log("Email AWB", row.awbNumber);
  const handlePdf1 = (row: AwbEntry) => console.log("View PDF 1", row.awbNumber);
  const handlePdf2 = (row: AwbEntry) => console.log("View PDF 2", row.awbNumber);
  const handleInv = (row: AwbEntry) => console.log("View INV", row.awbNumber);
  const handleEdit = (row: AwbEntry) => router.push(`/create-entries?edit=${row.awbNumber}`);
  const handleView = (row: AwbEntry) => router.push(`/create-entries?edit=${row.awbNumber}`);
  const handleEdit = (row: AwbEntry) => router.push(`/create-entries?edit=${row.awbNumber}`);
  const handleView = (row: AwbEntry) => router.push(`/create-entries?edit=${row.awbNumber}`);

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

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  return (
    <div className="relative bg-white p-4 rounded-lg w-full flex-1 flex flex-col min-h-0  shadow-sm border border-axc-border  overflow-x-hidden overflow-y-scroll [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-axc-gray/40 [&::-webkit-scrollbar-thumb]:rounded-lg">
      <div className="flex flex-wrap justify-between items-center gap-3 mb-4 shrink-0">
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
          headings={AwbEntryheading}
          data={filteredData}
          onEdit={handleEdit}
          
          
          onDelete={handleDelete}
          onView={handleView}
          onView={handleView}
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(p) => setPage(p)}
          itemsPerPage={itemsPerPage}
          selectable
          rowKey="awbNumber"
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
        />
      </div>
    </div>
  );
}

