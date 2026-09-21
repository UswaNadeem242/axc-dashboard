"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Eye, FileText, Plus, Printer, Trash2, X } from "lucide-react";

import SearchInput from "../src/common/search";
import Dropdown from "../src/common/dropdown";
import ToggleSwitch from "./toggleswitch";
import AddUserModal from "./adduser";
import DeleteConfirmationDialog from "../src/common/deleteConfirmation";
import CommonTable from "../src/common/table";

interface UserRow {
  id: number;
  name: string;
  email: string;
  role: string;
  store: string;
  lastLogin: string;
  isActive: boolean;
}

const initialUsers: UserRow[] = [
  { id: 1, name: "Ali Ahmed", email: "ali.ahmed@axc.com", role: "Super Admin", store: "Lahore Hub", lastLogin: "18 Aug 2026, 10:30 AM", isActive: true },
  { id: 2, name: "Sara Khan", email: "sara.khan@axc.com", role: "Admin", store: "Karachi Hub", lastLogin: "18 Aug 2026, 09:12 AM", isActive: true },
  { id: 3, name: "Usman Malik", email: "usman.malik@axc.com", role: "Manager", store: "Islamabad Hub", lastLogin: "17 Aug 2026, 04:45 PM", isActive: false },
  { id: 4, name: "Ayesha Noor", email: "ayesha.noor@axc.com", role: "Staff", store: "Multan Hub", lastLogin: "17 Aug 2026, 02:20 PM", isActive: true },
];

const ROLE_COLORS: Record<string, string> = {
  "Super Admin": "bg-axc-blue/10 text-axc-blue",
  Admin: "bg-axc-sky/10 text-axc-navy",
  Manager: "bg-axc-yellow/10 text-axc-yellow",
  Staff: "bg-axc-green/10 text-axc-green",
  Sales: "bg-axc-red/10 text-axc-red",
};

function RoleBadge({ role }: { role: string }) {
  return (
    <span className={`inline-flex rounded-full px-[10px] py-[4px] text-[10px] font-medium ${ROLE_COLORS[role] ?? "bg-axc-gray text-white"}`}>
      {role}
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

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-axc-border pb-2">
      <span className="font-medium text-axc-gray">{label}</span>
      <span className="text-right text-axc-dark-gray">{value}</span>
    </div>
  );
}

function ViewUserModal({ user, onClose }: { user: UserRow | null; onClose: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (user) {
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [user]);

  if (!user) return null;

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 250);
  };

  return (
    <div
      className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
      onClick={handleClose}
    >
      <div
        className={`fixed top-0 right-0 z-50 flex h-full w-full max-w-5xl flex-col overflow-y-auto bg-white shadow-2xl transition-transform duration-300 ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-axc-border bg-white px-6 py-4">
          <h2 className="text-regular-medium font-semibold text-axc-dark-gray">User Details</h2>
          <button type="button" onClick={handleClose} className="rounded-md p-1 transition-colors hover:bg-axc-light-bg">
            <X className="h-5 w-5 text-axc-gray" />
          </button>
        </div>
        <div className="flex-1 space-y-3 px-6 py-6 text-[12px]">
          <DetailRow label="Name" value={user.name} />
          <DetailRow label="Email" value={user.email} />
          <DetailRow label="Role" value={<RoleBadge role={user.role} />} />
          <DetailRow label="Store" value={user.store} />
          <DetailRow label="Last Login" value={user.lastLogin} />
          <DetailRow label="Status" value={user.isActive ? "Active" : "Inactive"} />
        </div>

        {/* Footer */}
        <div className="flex shrink-0 justify-end gap-3 border-t border-axc-border px-6 py-4">
          <button
            type="button"
            onClick={handleClose}
            className="h-[38px] min-w-[100px] rounded-md border border-axc-border bg-white px-4 text-[12px] font-semibold text-axc-dark-gray hover:bg-axc-light-bg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function UserTab() {
  const [users, setUsers] = useState<UserRow[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [viewingUser, setViewingUser] = useState<UserRow | null>(null);
  const [deleteUser, setDeleteUser] = useState<UserRow | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  const itemsPerPage = 10;

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const filteredUsers = useMemo(() => {
    const value = search.trim().toLowerCase();
    if (!value) return users;
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(value) ||
        user.email.toLowerCase().includes(value) ||
        user.role.toLowerCase().includes(value) ||
        user.store.toLowerCase().includes(value)
    );
  }, [users, search]);

  const paginatedUsers = useMemo(() => {
    return filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [filteredUsers, currentPage]);

  const toggleStatus = (id: number) => {
    setUsers((previous) => previous.map((user) => (user.id === id ? { ...user, isActive: !user.isActive } : user)));
    showToast("Status updated successfully");
  };

  const handleConfirmDelete = () => {
    if (!deleteUser) return;
    setUsers((previous) => previous.filter((user) => user.id !== deleteUser.id));
    showToast("User deleted successfully");
    setDeleteUser(null);
  };

  const handleBulkDeleteConfirm = () => {
    setUsers((previous) => previous.filter((user) => !selectedIds.includes(user.id)));
    showToast(`${selectedIds.length} user(s) deleted successfully`);
    setSelectedIds([]);
    setBulkDeleteOpen(false);
  };

  const handleAddUser = (formData: {
    name: string;
    email: string;
    role: string;
    assignedHub: string;
    status: boolean;
  }) => {
    setUsers((previous) => [
      ...previous,
      {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        role: formData.role,
        store: formData.assignedHub || "-",
        lastLogin: "-",
        isActive: formData.status,
      },
    ]);
    showToast("User created successfully");
    setIsAddUserOpen(false);
  };

  const allSelected = paginatedUsers.length > 0 && paginatedUsers.every((row) => selectedIds.includes(row.id));

  const toggleAllSelection = () => {
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !paginatedUsers.some((row) => row.id === id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...paginatedUsers.map((row) => row.id)])));
    }
  };

  const toggleRowSelection = (id: number) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const headings = [
    {
      label: (
        <input
          type="checkbox"
          checked={allSelected}
          onChange={toggleAllSelection}
          className="h-3.5 w-3.5 accent-axc-navy cursor-pointer"
        />
      ),
      key: "selectUser",
      className: "w-10 !px-2",
      render: (row: UserRow) => (
        <div className="flex items-center justify-center">
          <input
            type="checkbox"
            checked={selectedIds.includes(row.id)}
            onChange={() => toggleRowSelection(row.id)}
            className="h-3.5 w-3.5 accent-axc-navy cursor-pointer"
          />
        </div>
      ),
    },
    { label: "User Name", key: "name" },
    { label: "Email Address", key: "email", truncate: false },
    { label: "Role", key: "role", render: (row: UserRow) => <RoleBadge role={row.role} /> },
    { label: "Store", key: "store", truncate: false },
    { label: "Last Login", key: "lastLogin", truncate: false },
    {
      label: "Status",
      key: "status",
      render: (row: UserRow) => (
        <div className="flex justify-center">
          <ToggleSwitch checked={row.isActive} onChange={() => toggleStatus(row.id)} />
        </div>
      ),
    },
    { label: "Action", key: "action" },
  ];

  const renderActions = (row: UserRow) => (
    <div className="flex justify-center gap-2">
      <button
        type="button"
        onClick={() => setViewingUser(row)}
        className="flex h-7 w-7 items-center justify-center rounded border border-axc-yellow text-axc-yellow cursor-pointer hover:bg-axc-light-bg"
        title="View"
      >
        <Eye className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onClick={() => setDeleteUser(row)}
        className="flex h-7 w-7 items-center justify-center rounded border border-axc-red text-axc-red cursor-pointer hover:bg-red-50"
        title="Delete"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );

  return (
    <>
      {toast && <Toast msg={toast} />}

      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-[220px]">
            <SearchInput
              placeholder="Search users..."
              value={search}
              onChange={(value) => {
                setSearch(value);
                setCurrentPage(1);
              }}
            />
          </div>

          {selectedIds.length > 0 && (
            <>
              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="flex items-center gap-2 rounded-md border border-axc-border px-3 py-2 text-[12px] font-medium text-axc-dark-gray"
              >
                {selectedIds.length} Selected
              </button>

              <Dropdown
                title="Actions"
                items={[
                  { label: "Export", icon: <FileText className="h-4 w-4" />, onClick: () => {} },
                  { label: "Print", icon: <Printer className="h-4 w-4" />, onClick: () => window.print() },
                  {
                    label: "Delete",
                    icon: <Trash2 className="h-4 w-4" />,
                    onClick: () => setBulkDeleteOpen(true),
                  },
                ]}
              />
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsAddUserOpen(true)}
          className="flex h-[38px] cursor-pointer items-center gap-2 rounded-md bg-axc-blue px-4 text-[12px] font-semibold text-white"
        >
          <Plus className="h-4 w-4" />
          Add User
        </button>
      </div>

      <CommonTable
        headings={headings}
        data={filteredUsers}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        showScroll={false}
        renderActions={renderActions}
        rowKey="id"
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        emptyMessage="No users found"
      />

      <AddUserModal isOpen={isAddUserOpen} onClose={() => setIsAddUserOpen(false)} onSave={handleAddUser} />

      <ViewUserModal user={viewingUser} onClose={() => setViewingUser(null)} />

      <DeleteConfirmationDialog
        isOpen={Boolean(deleteUser)}
        itemName={deleteUser?.name}
        onCancel={() => setDeleteUser(null)}
        onConfirm={handleConfirmDelete}
      />

      <DeleteConfirmationDialog
        isOpen={bulkDeleteOpen}
        itemName={`${selectedIds.length} selected user(s)`}
        onCancel={() => setBulkDeleteOpen(false)}
        onConfirm={handleBulkDeleteConfirm}
      />
    </>
  );
}