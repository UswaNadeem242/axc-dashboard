"use client";

import React, { useState, useEffect } from "react";
import { X, PlusCircleIcon } from "lucide-react";

import CommonTable from "../src/common/table";
import { ManifestHeading, ManifestEntry, initialManifestData } from "../src/constant";
import FilterSearch from "../src/common/filtersearch";
import Button from "../src/common/button";
import { showToast } from "../src/common/toast";

export default function AllManifestPage() {
  const [data, setData] = useState<ManifestEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);

  const itemsPerPage = 10;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("manifest_entries");
      if (stored) {
        try {
          const parsed: ManifestEntry[] = JSON.parse(stored);
          if (parsed.length > initialManifestData.length) {
            setData(parsed);
            return;
          }
        } catch (error) {
          console.error("Failed to load manifest data:", error);
        }
      }
      setData(initialManifestData);
      localStorage.setItem("manifest_entries", JSON.stringify(initialManifestData));
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && data.length > 0) {
      localStorage.setItem("manifest_entries", JSON.stringify(data));
    }
  }, [data]);

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

  const handleEdit = (row: ManifestEntry) => console.log("Edit Manifest:", row.manifestNo);
  const handleView = (row: ManifestEntry) => console.log("View Manifest:", row.manifestNo);

  const handleDelete = (row: ManifestEntry) => {
    const confirmed = confirm(`Are you sure you want to delete manifest ${row.manifestNo}?`);
    if (!confirmed) return;
    setData((prev) => prev.filter((item) => item.manifestNo !== row.manifestNo));
    setSelectedIds((prev) => prev.filter((id) => id !== row.manifestNo));
    showToast({ variant: "success", message: "Manifest deleted." });
  };

  const filteredData = data.filter((item) => {
    const query = searchQuery.toLowerCase();
    const matchesQuery =
      !query ||
      item.manifestNo.toLowerCase().includes(query) ||
      item.runNumber.toLowerCase().includes(query) ||
      item.originHubCode.toLowerCase().includes(query) ||
      item.destinationHubCode.toLowerCase().includes(query) ||
      item.destinationHubName.toLowerCase().includes(query);

    const matchesTags = activeTags.every((tag) => {
      const t = tag.toLowerCase();
      return (
        item.manifestNo.toLowerCase().includes(t) ||
        item.runNumber.toLowerCase().includes(t) ||
        item.originHubCode.toLowerCase().includes(t) ||
        item.destinationHubCode.toLowerCase().includes(t) ||
        item.destinationHubName.toLowerCase().includes(t)
      );
    });

    return matchesQuery && matchesTags;
  });

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  return (
    <div className="relative bg-white p-3 rounded-[8px] w-full h-[calc(100vh-160px)] flex flex-col  overflow-x-hidden overflow-y-scroll [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-axc-gray/40 [&::-webkit-scrollbar-thumb]:rounded-lg">
      <div className="flex flex-wrap justify-between items-center gap-3 mb-4 ">
        <div className="flex flex-wrap items-center gap-3">
          {selectedIds.length > 0 && (
            <span className="text-xs font-semibold text-axc-gray">{selectedIds.length} selected</span>
          )}
          <FilterSearch
            options={[
              { label: "Select", value: "" },
              { label: "Manifest No.", value: "manifestNo" },
              { label: "Origin Hub", value: "originHubCode" },
              { label: "Destination Hub", value: "destinationHubCode" },
            ]}
            selectedOption={filterType}
            onOptionChange={setFilterType}
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            onSearchSubmit={handleSearchSubmit}
            placeholder="Search"
          />
        </div>

        <Button label="New Manifest" href="/manifest/new-manifest" variant="primary" icon={PlusCircleIcon} />
      </div>

      {activeTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-2 shrink-0">
          {activeTags.map((tag, idx) => {
            const colors = [
              "border-slate-200 bg-slate-50 text-slate-700",
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

      <CommonTable
        headings={ManifestHeading}
        data={filteredData}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(p) => setPage(p)}
        itemsPerPage={itemsPerPage}
        selectable
        rowKey="manifestNo"
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
      />
    </div>
  );
}