"use client";

import { useMemo, useState } from "react";
import { FileText, Printer, Trash2 } from "lucide-react";

import SearchInput from "../src/common/search";
import Dropdown from "../src/common/dropdown";
import ToggleSwitch from "./toggleswitch";
import DeleteConfirmationDialog from "../src/common/deleteConfirmation";
import CommonTable from "../src/common/table";

interface ActivityLog {
  id: number;
  userName: string;
  action: string;
  module: string;
  date: string;
  ipAddress: string;
  isActive: boolean;
}

const initialLogs: ActivityLog[] = [
  { id: 1, userName: "Ali Ahmed", action: "User Created", module: "Users", date: "18 Aug 2026, 10:30 AM", ipAddress: "192.168.1.10", isActive: true },
  { id: 2, userName: "Sara Khan", action: "Profile Updated", module: "Users", date: "18 Aug 2026, 11:15 AM", ipAddress: "192.168.1.11", isActive: true },
  { id: 3, userName: "Usman Malik", action: "Permission Changed", module: "Roles & Permissions", date: "17 Aug 2026, 03:20 PM", ipAddress: "192.168.1.12", isActive: false },
  { id: 4, userName: "Ayesha Noor", action: "Subscription Updated", module: "Subscription", date: "17 Aug 2026, 01:45 PM", ipAddress: "192.168.1.13", isActive: true },
  { id: 5, userName: "Ali Ahmed", action: "Login", module: "Security", date: "16 Aug 2026, 09:10 AM", ipAddress: "192.168.1.10", isActive: true },
];

const MODULE_COLORS: Record<string, string> = {
  Users: "bg-axc-blue text-white",
  "Roles & Permissions": "bg-axc-yellow text-white",
  Subscription: "bg-axc-green text-white",
  Security: "bg-axc-red text-white",
  Account: "bg-axc-sky text-white",
};

function ModuleBadge({ module }: { module: string }) {
  return (
    <span className={`inline-flex rounded-full px-[10px] py-[4px] text-[10px] font-medium ${MODULE_COLORS[module] ?? "bg-axc-gray text-white"}`}>
      {module}
    </span>
  );
}

function Toast({ msg }: { msg: string }) {
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-2 rounded-lg bg-axc-green px-4 py-3 text-[13px] font-medium text-white shadow-lg">
      <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
      {msg}
    </div>
  );
}

export default function ActivityLogsTab() {
  const [logs, setLogs] = useState<ActivityLog[]>(initialLogs);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const filteredLogs = useMemo(() => {
    const value = search.trim().toLowerCase();
    if (!value) return logs;
    return logs.filter(
      (log) =>
        log.userName.toLowerCase().includes(value) ||
        log.action.toLowerCase().includes(value) ||
        log.module.toLowerCase().includes(value) ||
        log.ipAddress.toLowerCase().includes(value)
    );
  }, [logs, search]);

  const toggleStatus = (id: number) => {
    setLogs((previous) => previous.map((log) => (log.id === id ? { ...log, isActive: !log.isActive } : log)));
    showToast("Status updated successfully");
  };

  const handleBulkDeleteConfirm = () => {
    setLogs((previous) => previous.filter((log) => !selectedIds.includes(log.id)));
    showToast(`${selectedIds.length} log(s) deleted successfully`);
    setSelectedIds([]);
    setBulkDeleteOpen(false);
  };

  const headings = [
    { label: "User Name", key: "userName" },
    { label: "Action", key: "action", truncate: false, render: (row: ActivityLog) => row.action },
    { label: "Module", key: "module", render: (row: ActivityLog) => <ModuleBadge module={row.module} /> },
    { label: "Date", key: "date", truncate: false },
    { label: "IP Address", key: "ipAddress", render: (row: ActivityLog) => <span className="font-mono">{row.ipAddress}</span> },
    {
      label: "Status",
      key: "status",
      render: (row: ActivityLog) => (
        <div className="flex justify-center">
          <ToggleSwitch checked={row.isActive} onChange={() => toggleStatus(row.id)} />
        </div>
      ),
    },
  ];

  return (
    <div className="relative bg-white p-3 rounded-[8px] w-full h-[calc(100vh-160px)] flex flex-col overflow-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {toast && <Toast msg={toast} />}

      <div className="flex flex-wrap items-center gap-3 mb-4 shrink-0">
        <div className="w-[220px]">
          <SearchInput
            placeholder="Search activity logs..."
            value={search}
            onChange={(value) => {
              setSearch(value);
              setCurrentPage(1);
            }}
          />
        </div>

        <Dropdown
          title="Actions"
          items={[
            { label: "Export", icon: <FileText className="h-4 w-4" />, onClick: () => {} },
            { label: "Print", icon: <Printer className="h-4 w-4" />, onClick: () => window.print() },
            {
              label: "Delete",
              icon: <Trash2 className="h-4 w-4" />,
              onClick: () => {
                if (selectedIds.length === 0) {
                  showToast("Please select at least one log to delete");
                  return;
                }
                setBulkDeleteOpen(true);
              },
            },
          ]}
        />

        {selectedIds.length > 0 && (
          <button
            type="button"
            onClick={() => setSelectedIds([])}
            className="flex items-center gap-2 rounded-md border border-axc-border px-3 py-2 text-[12px] font-medium text-axc-dark-gray"
          >
            {selectedIds.length} Selected
          </button>
        )}
      </div>

      <CommonTable
        headings={headings}
        data={filteredLogs}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        itemsPerPage={10}
        showScroll={false}
        selectable
        rowKey="id"
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
      />

      <DeleteConfirmationDialog
        isOpen={bulkDeleteOpen}
        itemName={`${selectedIds.length} selected activity log(s)`}
        onCancel={() => setBulkDeleteOpen(false)}
        onConfirm={handleBulkDeleteConfirm}
      />
    </div>
  );
}