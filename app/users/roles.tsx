"use client";

import { useEffect, useState } from "react";
import { Eye, Pencil, Plus, Shield, Trash2, Users, X } from "lucide-react";

import PagesPermissionsModal, { PagePermission } from "./pagepermision";
import DeleteConfirmationDialog from "../src/common/deleteConfirmation";
import { showToast } from "../src/common/toast";
import { api } from "../src/lib/api";

interface Role {
  id: number;
  name: string;
  description: string;
  users: number;
  status: boolean;
  permissions: PagePermission[];
}
const CARD_STYLES = [
  { bg: "bg-axc-blue/10", border: "border-axc-blue/30", icon: "text-axc-blue" },
  { bg: "bg-axc-green/10", border: "border-axc-green/30", icon: "text-axc-green" },
  { bg: "bg-axc-yellow/10", border: "border-axc-yellow/30", icon: "text-axc-yellow" },
  { bg: "bg-axc-red/10", border: "border-axc-red/30", icon: "text-axc-red" },
  { bg: "bg-axc-sky/10", border: "border-axc-sky/30", icon: "text-axc-sky" },
];

const defaultPermissions: PagePermission[] = [
  { id: "users", title: "Users", view: true, add: true, edit: true, delete: false },
  { id: "roles", title: "Roles & Permissions", view: true, add: false, edit: false, delete: false },
  { id: "hubs", title: "Hubs", view: true, add: true, edit: true, delete: false },
  { id: "awb", title: "AWB Services", view: true, add: true, edit: true, delete: true },
  { id: "reports", title: "Reports", view: true, add: false, edit: false, delete: false },
];

const initialRoles: Role[] = [
  { id: 1, name: "Super Admin", description: "Full system access across every module.", users: 1, status: true, permissions: defaultPermissions },
  { id: 2, name: "Admin", description: "Administrative access with limited deletion rights.", users: 3, status: true, permissions: defaultPermissions.map((p) => ({ ...p, delete: false })) },
  { id: 3, name: "Manager", description: "Management level access to day-to-day operations.", users: 5, status: true, permissions: defaultPermissions.map((p) => ({ ...p, add: false, delete: false })) },
];

export default function RolesTab() {
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);
  const [deleteRole, setDeleteRole] = useState<Role | null>(null);
  const [formOpen, setFormOpen] = useState<{ open: boolean; role?: Role | null }>({ open: false });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await api.getRoles();
        if (mounted && Array.isArray(res?.data) && res.data.length > 0) {
          setRoles(
            res.data.map((r: any) => ({
              id: r.id,
              name: r.name || "",
              description: r.description || "",
              users: r.users ?? 0,
              status: r.status ?? true,
              permissions: Array.isArray(r.permissions) && r.permissions.length > 0 ? r.permissions : defaultPermissions,
            }))
          );
          return;
        }
      } catch {}
      if (typeof window !== "undefined") {
        try {
          const cached = localStorage.getItem("axc_roles_list");
          if (cached && mounted) {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed) && parsed.length > 0) setRoles(parsed);
          }
        } catch {}
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const syncRolesCache = (next: Role[]) => {
    setRoles(next);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("axc_roles_list", JSON.stringify(next));
      } catch {}
    }
  };

  const handlePermissions = (role: Role) => {
    setSelectedRole(role);
    setIsPermissionsOpen(true);
  };

  const handleSavePermissions = async (permissions: PagePermission[]) => {
    if (!selectedRole) return;
    const next = roles.map((role) => (role.id === selectedRole.id ? { ...role, permissions } : role));
    syncRolesCache(next);
    try {
      await api.saveRolePermissions(selectedRole.id, permissions);
      await api.createActivityLog({ userName: "System", action: `Permissions Updated (${selectedRole.name})`, module: "Roles & Permissions" });
    } catch {}
    showToast({ variant: "success", message: "Permissions saved successfully" });
  };

  const handleDeleteRole = async () => {
    if (!deleteRole) return;
    const targetId = deleteRole.id;
    const targetName = deleteRole.name;
    syncRolesCache(roles.filter((role) => role.id !== targetId));
    setDeleteRole(null);
    try {
      await api.deleteRole(targetId);
      await api.createActivityLog({ userName: "System", action: `Role Deleted (${targetName})`, module: "Roles & Permissions" });
    } catch {}
    showToast({ variant: "success", message: "Role deleted successfully" });
  };

  return (
    <div className="relative flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[16px] font-semibold text-axc-dark-gray">Role management</h3>
        </div>

        <button
          type="button"
          onClick={() => setFormOpen({ open: true, role: null })}
          className="flex items-center gap-2 rounded-[6px] bg-axc-blue px-3 py-2 text-[13px] text-white hover:bg-axc-blue-dark"
        >
          <span className="rounded-full border border-white">
            <Plus className="h-4 w-4" />
          </span>
          Add Role
        </button>
      </div>

      {roles.length === 0 ? (
        <div className="flex h-40 flex-col items-center justify-center gap-2 text-[13px] text-axc-gray">
          <Shield className="h-10 w-10 text-axc-gray" />
          <span>No roles found</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {roles.map((role, index) => {
            const style = CARD_STYLES[index % CARD_STYLES.length];
            return (
              <div key={role.id} className={`rounded-lg border-2 p-4 transition-shadow hover:shadow-md ${style.bg} ${style.border}`}>
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-axc-border bg-white">
                    <Shield className={`h-6 w-6 ${style.icon}`} />
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setFormOpen({ open: true, role })}
                      className="rounded-md p-1.5 transition-colors cursor-pointer hover:bg-white/60"
                      title="Edit Role"
                    >
                      <Pencil className="h-4 w-4 text-axc-dark-gray" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteRole(role)}
                      className="rounded-md p-1.5 transition-colors cursor-pointer hover:bg-white/60"
                      title="Delete Role"
                    >
                      <Trash2 className="h-4 w-4 text-axc-red" />
                    </button>
                  </div>
                </div>

                <h4 className="mb-1 text-[16px] font-semibold text-axc-dark-gray">{role.name}</h4>
                <p className="mb-4 text-[12px] text-axc-gray">{role.description}</p>

                <div className="flex items-center justify-between border-t-2 border-axc-border pt-3">
                  <div className="flex items-center gap-1 text-[12px] text-axc-gray">
                    <Users className="h-3.5 w-3.5" />
                    <span>{role.users} users</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handlePermissions(role)}
                    className="flex items-center gap-1 text-[12px] font-medium  cursor-pointer text-axc-blue"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View Permissions</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {formOpen.open && (
        <RoleFormPanel
          role={formOpen.role}
          onClose={() => setFormOpen({ open: false })}
          onSave={async (name, description) => {
            if (formOpen.role) {
              const roleId = formOpen.role.id;
              syncRolesCache(roles.map((r) => (r.id === roleId ? { ...r, name, description } : r)));
              try {
                await api.updateRole(roleId, { name, description });
              } catch {}
              showToast({ variant: "success", message: "Role updated" });
            } else {
              let createdRole: Role = { id: Date.now(), name, description, users: 0, status: true, permissions: defaultPermissions };
              try {
                const res = await api.createRole({ name, description, permissions: defaultPermissions });
                if (res?.data?.id) {
                  createdRole = {
                    id: res.data.id,
                    name: res.data.name || name,
                    description: res.data.description || description,
                    users: res.data.users ?? 0,
                    status: res.data.status ?? true,
                    permissions: Array.isArray(res.data.permissions) && res.data.permissions.length > 0 ? res.data.permissions : defaultPermissions,
                  };
                }
              } catch {}
              syncRolesCache([...roles, createdRole]);
              showToast({ variant: "success", message: "Role created" });
            }
            setFormOpen({ open: false });
          }}
        />
      )}

      <PagesPermissionsModal
        isOpen={isPermissionsOpen}
        onClose={() => {
          setIsPermissionsOpen(false);
          setSelectedRole(null);
        }}
        roleName={selectedRole?.name}
        initialPermissions={selectedRole?.permissions || []}
        onSave={handleSavePermissions}
      />

      <DeleteConfirmationDialog isOpen={Boolean(deleteRole)} itemName={deleteRole?.name} onCancel={() => setDeleteRole(null)} onConfirm={handleDeleteRole} />
    </div>
  );
}

function RoleFormPanel({
  role,
  onClose,
  onSave,
}: {
  role?: Role | null;
  onClose: () => void;
  onSave: (name: string, description: string) => void;
}) {
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState(role?.name || "");
  const [description, setDescription] = useState(role?.description || "");
  const [error, setError] = useState("");

  useState(() => {
    requestAnimationFrame(() => setVisible(true));
  });

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 250);
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      setError("Role name is required.");
      return;
    }
    onSave(name.trim(), description.trim());
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
        onClick={handleClose}
      />
      <div
        className={`fixed top-0 right-0 z-50 flex h-full w-full max-w-5xl flex-col bg-white shadow-2xl transition-transform duration-300 ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-axc-border px-4 py-3">
          <h2 className="text-[18px] font-semibold text-axc-dark-gray">{role ? "Edit Role" : "Add New Role"}</h2>
          <button type="button" onClick={handleClose} className="rounded-md p-1.5 hover:bg-axc-light-bg">
            <X className="h-5 w-5 text-axc-gray" />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-6">
          {error && <div className="rounded border border-red-200 bg-red-50 p-3 text-[12px] text-red-600">{error}</div>}

          <div>
            <label className="mb-1 block text-[12px] font-medium text-axc-dark-gray">
              Role Name <span className="text-axc-red">*</span>
            </label>
            <input
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setError("");
              }}
              placeholder="e.g. Sales Manager"
              className="h-[34px] w-full rounded border border-axc-border px-3 text-[12px] outline-none focus:border-axc-blue"
            />
          </div>

          <div>
            <label className="mb-1 block text-[12px] font-medium text-axc-dark-gray">Description</label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe this role..."
              rows={3}
              className="w-full resize-none rounded border border-axc-border px-3 py-2 text-[12px] outline-none focus:border-axc-blue"
            />
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-end gap-3 border-t border-axc-border px-4 py-4">
          <button
            type="button"
            onClick={handleClose}
            className="h-[38px] min-w-[100px] rounded-md border border-axc-border bg-white px-4 text-[12px] font-semibold text-axc-dark-gray hover:bg-axc-light-bg"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="h-[38px] min-w-[120px] rounded-md bg-axc-blue px-4 text-[12px] font-semibold text-white hover:bg-axc-blue-dark"
          >
            {role ? "Save Changes" : "Create Role"}
          </button>
        </div>
      </div>
    </>
  );
}