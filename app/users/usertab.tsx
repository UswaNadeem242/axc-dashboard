"use client";

import { useMemo, useState } from "react";
import { Eye, FileText, Plus, Printer, Trash2 } from "lucide-react";

import SearchInput from "../src/common/search";
import Dropdown from "../src/common/dropdown";
import Pagination from "../src/common/pagination";
import ToggleSwitch from "./toggleswitch";
import AddUserModal from "./adduser";
import DeleteConfirmationDialog from "./deleteConfirmation";

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
  "Super Admin": "bg-axc-blue text-white",
  Admin: "bg-axc-sky text-white",
  Manager: "bg-axc-yellow text-white",
  Staff: "bg-axc-green text-white",
  Sales: "bg-axc-red text-white",
};

function RoleBadge({ role }: { role: string }) {
  return (
    <span className={`inline-flex rounded-[3px] px-[10px] py-[4px] text-[10px] font-medium ${ROLE_COLORS[role] ?? "bg-axc-gray text-white"}`}>
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
function ViewUserModal({ user, onClose }: { user: UserRow | null; onClose: () => void }) {
  if (!user) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4" onClick={onClose}>
      <div className="w-full max-w-sm rounded-lg bg-white p-5 shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[16px] font-semibold text-axc-dark-gray">User Details</h2>
        </div>
        <div className="space-y-3 text-[12px]">
          <DetailRow label="Name" value={user.name} />
          <DetailRow label="Email" value={user.email} />
          <DetailRow label="Role" value={<RoleBadge role={user.role} />} />
          <DetailRow label="Store" value={user.store} />
          <DetailRow label="Last Login" value={user.lastLogin} />
          <DetailRow label="Status" value={user.isActive ? "Active" : "Inactive"} />
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-5 h-[36px] w-full rounded-md border border-axc-border bg-white text-[12px] font-semibold text-axc-dark-gray hover:bg-axc-light-bg"
        >
          Close
        </button>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-axc-border pb-2">
      <span className="font-medium text-axc-gray">{label}</span>
      <span className="text-right text-axc-dark-gray">{value}</span>
    </div>
  );
}

export default function UserTab() {
  const [users, setUsers] = useState<UserRow[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [viewingUser, setViewingUser] = useState<UserRow | null>(null);
  const [deleteUser, setDeleteUser] = useState<UserRow | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  const perPage = 10;

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

  const totalPages = Math.ceil(filteredUsers.length / perPage);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * perPage, currentPage * perPage);

  const allSelected = paginatedUsers.length > 0 && paginatedUsers.every((user) => selectedIds.includes(user.id));
  const toggleAll = () =>
    setSelectedIds(allSelected ? [] : Array.from(new Set([...selectedIds, ...paginatedUsers.map((user) => user.id)])));
  const toggleSelect = (id: number) =>
    setSelectedIds((previous) => (previous.includes(id) ? previous.filter((item) => item !== id) : [...previous, id]));

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

  return (
    <div className="relative">
      {toast && <Toast msg={toast} />}
      <div className="flex flex-wrap items-center justify-between gap-3">
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
                    showToast("Please select at least one user to delete");
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

        <button
          type="button"
          onClick={() => setIsAddUserOpen(true)}
          className="flex h-[38px] items-center gap-2 rounded-md bg-axc-blue px-4 text-[12px] font-semibold text-white hover:bg-axc-blue-dark"
        >
          <Plus className="h-4 w-4" />
          Add User
        </button>
      </div>
      <div className="mt-4 overflow-x-auto rounded-[8px] border border-axc-border">
        <table className="w-full whitespace-nowrap">
          <thead>
            <tr className="h-[42px] border-b border-axc-border bg-axc-light-bg text-[12px] font-semibold text-axc-dark-gray">
              <th className="w-10 px-3 py-3">
                <input type="checkbox" checked={allSelected} onChange={toggleAll} className="h-3.5 w-3.5 accent-axc-blue" />
              </th>
              <th className="px-4 py-3 text-left">User Name</th>
              <th className="px-4 py-3 text-left">Email Address</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Store</th>
              <th className="px-4 py-3 text-left">Last Login</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {paginatedUsers.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-[12px] text-axc-gray">
                  No users found
                </td>
              </tr>
            ) : (
              paginatedUsers.map((user) => (
                <tr key={user.id} className="h-[42px] border-b border-axc-border text-[12px] text-axc-dark-gray transition-colors hover:bg-axc-light-bg">
                  <td className="px-3 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(user.id)}
                      onChange={() => toggleSelect(user.id)}
                      className="h-3.5 w-3.5 accent-axc-blue"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium">{user.name}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">
                    <RoleBadge role={user.role} />
                  </td>
                  <td className="px-4 py-3">{user.store}</td>
                  <td className="px-4 py-3">{user.lastLogin}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center">
                      <ToggleSwitch checked={user.isActive} onChange={() => toggleStatus(user.id)} />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setViewingUser(user)}
                        className="flex h-7 w-7 items-center justify-center rounded border border-axc-yellow text-axc-yellow hover:bg-axc-light-bg"
                        title="View"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteUser(user)}
                        className="flex h-7 w-7 items-center justify-center rounded border border-axc-red text-axc-red hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-2 flex justify-end">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      )}

      <AddUserModal
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        onSave={handleAddUser}
      />

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
    </div>
  );
}
