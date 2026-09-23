"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, PlusCircleIcon } from "lucide-react";

import CommonTable from "../src/common/table";
import { ManifestHeading, ManifestEntry, initialManifestData } from "../src/constant";
import FilterSearch from "../src/common/filtersearch";
import Button from "../src/common/button";
import { showToast } from "../src/common/toast";
import DeleteConfirmationDialog from "../src/common/deleteConfirmation";

export default function AllManifestPage() {
  const router = useRouter();
  const [data, setData] = useState<ManifestEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);

  const [deleteTarget, setDeleteTarget] = useState<ManifestEntry | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
    const values = val.split(",").map((v) => v.trim()).filter(Boolean);
    if (values.length > 0) {
      setActiveTags((prev) => {
        const newTags = values.filter((v) => !prev.includes(v));
        return [...prev, ...newTags];
      });
      setSearchQuery("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setActiveTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const handleEdit = (row: ManifestEntry) => {
    router.push(`/manifest/edit-manifest?id=${row.manifestNo}`);
  };

  const handleBag = (row: ManifestEntry) => {
    router.push(`/manifest/edit-bagging?id=${row.manifestNo}`);
  };

  const handleView = (row: ManifestEntry) => {
    router.push(`/manifest/view/${row.manifestNo}`);
  };

  const handleDelete = (row: ManifestEntry) => {
    setDeleteTarget(row);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setData((prev) => prev.filter((item) => item.manifestNo !== deleteTarget.manifestNo));
    setSelectedIds((prev) => prev.filter((id) => id !== deleteTarget.manifestNo));
    showToast({ variant: "success", message: "Manifest deleted." });
    setIsDeleting(false);
    setDeleteTarget(null);
  };

  const cancelDelete = () => {
    if (isDeleting) return;
    setDeleteTarget(null);
  };

  const filteredData = data.filter((item) => {
    const query = searchQuery.toLowerCase();

    const checkMatch = (searchStr: string) => {
      if (!searchStr) return true;
      const raw = searchStr.toLowerCase();

      if (raw === "custom") return true;

      if (raw === "today" || raw === "yesterday" || raw === "last 7 days") {
        const checkDate = (dateStr?: string) => {
          if (!dateStr) return false;
          const parts = dateStr.split(/[-/]/);
          if (parts.length !== 3) return false;
          const [d, m, y] = parts;

          const itemDate = new Date(Number(y), Number(m) - 1, Number(d));
          itemDate.setHours(0, 0, 0, 0);

          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);

          const last7Days = new Date(today);
          last7Days.setDate(last7Days.getDate() - 7);

          if (raw === "today") return itemDate.getTime() === today.getTime();
          if (raw === "yesterday") return itemDate.getTime() === yesterday.getTime();
          if (raw === "last 7 days") return itemDate >= last7Days && itemDate <= today;
          return false;
        };
        return checkDate(item.manifestDate);
      }

      const dateRangeRegex = /^[a-z]{3} \d{1,2}, \d{4} - [a-z]{3} \d{1,2}, \d{4}$/i;
      if (dateRangeRegex.test(raw)) {
        const parts = raw.split(" - ");
        if (parts.length === 2) {
          const checkCustomDate = (dateStr?: string) => {
            if (!dateStr) return false;
            const dateParts = dateStr.split(/[-/]/);
            if (dateParts.length !== 3) return false;
            const [d, m, y] = dateParts;
            const itemDate = new Date(Number(y), Number(m) - 1, Number(d));
            itemDate.setHours(0, 0, 0, 0);

            const start = new Date(parts[0]);
            start.setHours(0, 0, 0, 0);
            const end = new Date(parts[1]);
            end.setHours(23, 59, 59, 999);

            return itemDate >= start && itemDate <= end;
          };
          return checkCustomDate(item.manifestDate);
        }
      }

      return (
        item.manifestNo.toLowerCase().includes(searchStr) ||
        item.runNumber.toLowerCase().includes(searchStr) ||
        item.originHubCode.toLowerCase().includes(searchStr) ||
        item.destinationHubCode.toLowerCase().includes(searchStr) ||
        item.destinationHubName.toLowerCase().includes(searchStr)
      );
    };

    const matchesQuery = (() => {
      if (!query) return true;
      if (query.trim().endsWith(",")) return true;
      const queries = query.split(/[,\s]+/).map(q => q.trim()).filter(Boolean);
      if (queries.length === 0) return true;
      return queries.some(q => checkMatch(q));
    })();

    const matchesTags = activeTags.length === 0 || activeTags.some((tag) => checkMatch(tag.toLowerCase()));

    if (activeTags.length > 0 && query) {
      return matchesQuery || matchesTags;
    }

    return matchesQuery && matchesTags;
  });

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));

  useEffect(() => {
    setPage(1);
  }, [searchQuery, activeTags]);

  const filterGroups = React.useMemo(() => {
    const origins = Array.from(new Set(data.map((d) => d.originHubCode).filter(Boolean)));
    const originOptions = origins.map((o) => ({ label: o, value: o }));

    const destinations = Array.from(new Set(data.map((d) => d.destinationHubName).filter(Boolean)));
    const destinationOptions = destinations.map((d) => ({ label: d, value: d }));

    return [
      {
        group: "By Date",
        options: [
          { label: "Today", value: "Today" },
          { label: "Yesterday", value: "Yesterday" },
          { label: "Last 7 days", value: "Last 7 days" },
          { label: "Custom", value: "Custom" },
        ],
      },
      {
        group: "Origin Hub",
        options: originOptions,
      },
      {
        group: "Destination Hub",
        options: destinationOptions,
      },
    ];
  }, [data]);

  return (
    <div className="relative bg-white shadow-sm border border-axc-border p-4  rounded-lg w-full h-[calc(100vh-160px)] flex flex-col  overflow-x-hidden overflow-y-scroll [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-axc-gray/40 [&::-webkit-scrollbar-thumb]:rounded-lg">
      <div className="flex flex-wrap justify-between items-center gap-3 mb-4 ">
        <div className="flex flex-wrap items-center gap-3">
          {selectedIds.length > 0 && (
            <span className="text-xs font-semibold text-axc-gray">{selectedIds.length} selected</span>
          )}
          <FilterSearch
            groups={filterGroups}
            selectedOptions={activeTags}
            onOptionsChange={setActiveTags}
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
        onBag={handleBag}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(p) => setPage(p)}
        itemsPerPage={itemsPerPage}
        selectable
        rowKey="manifestNo"
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
      />

      <DeleteConfirmationDialog
        isOpen={!!deleteTarget}
        itemName={deleteTarget?.manifestNo}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}