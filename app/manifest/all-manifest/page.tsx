"use client";

import React, { useState, useEffect } from "react";
import { FileText, X } from "lucide-react";
import CommonTable from "../../src/common/table";
import { ManifestHeading, ManifestEntry, initialManifestData } from "../../src/constant";
import FilterSearch from "../../src/common/filtersearch";
import Button from "../../src/common/button";
import { showToast } from "../../src/common/toast";

export default function AllManifestPage() {
  const [data, setData] = useState<ManifestEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);

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
        } catch (e) {
          console.error(e);
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

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const handleEdit = (row: ManifestEntry) => {
    console.log("Edit manifest", row.manifestNo);
  };

  const handleBagging = (row: ManifestEntry) => {
    console.log("Bagging manifest", row.manifestNo);
  };

  const handleDelete = (row: ManifestEntry) => {
    if (confirm(`Are you sure you want to delete manifest ${row.manifestNo}?`)) {
      setData((prev) => prev.filter((item) => item.manifestNo !== row.manifestNo));
      showToast({ variant: "success", message: "Manifest deleted." });
    }
  };

  const handlePdf = (row: ManifestEntry) => {
    console.log("View manifest PDF", row.manifestNo);
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

  const sortedData = React.useMemo(() => {
    if (!sortKey) return filteredData;
    const copy = [...filteredData];
    copy.sort((a: any, b: any) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av < bv) return sortDirection === "asc" ? -1 : 1;
      if (av > bv) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
    return copy;
  }, [filteredData, sortKey, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / itemsPerPage));

  useEffect(() => {
    setPage(1);
  }, [searchQuery, activeTags, sortKey, sortDirection]);

  const renderManifestActions = (row: ManifestEntry) => (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleEdit(row)}
        className="rounded bg-axc-dark-green px-3 py-1 text-[11px] font-bold text-white hover:opacity-90"
      >
        EDIT
      </button>
      <button
        onClick={() => handleBagging(row)}
        className="rounded bg-axc-dark-green px-3 py-1 text-[11px] font-bold text-white hover:opacity-90"
      >
        BAGGING
      </button>
      <button
        onClick={() => handleDelete(row)}
        className="rounded bg-axc-red px-3 py-1 text-[11px] font-bold text-white hover:opacity-90"
      >
        DELETE
      </button>
      <button
        onClick={() => handlePdf(row)}
        className="rounded bg-blue-600 p-1.5 text-white hover:bg-blue-700"
        title="View PDF"
      >
        <FileText size={14} />
      </button>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-2">
        <div>
          <h1 className="text-3xl font-bold text-axc-navy">All Manifest</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
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
          <Button label="New Manifest" href="/manifest/new-manifest" variant="primary" />
        </div>
      </div>

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

      <div className="overflow-hidden rounded-xl border border-axc-border bg-white shadow-sm">
        <CommonTable
          headings={ManifestHeading}
          data={sortedData}
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(p) => setPage(p)}
          itemsPerPage={itemsPerPage}
          renderActions={renderManifestActions}
          sortKey={sortKey ?? undefined}
          sortDirection={sortDirection}
          onSort={handleSort}
        />
      </div>
    </div>
  );
}