"use client";
import React from "react";
import {
  Mail,
  Building2,
  Pencil,
  User,
  AtSign,
  Phone,
  Home,
  MapPin,
  Flag,
  Globe,
  Hash,
  FileText,
} from "lucide-react";
import { PanelHeader } from "../setting/components/settingform";

interface ProfileViewProps {
  firstName?: string;
  lastName?: string;
  roleLabel?: string;
  email?: string;
  username?: string;
  phone?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  bio?: string;
  avatarUrl?: string | null;
  lastLogin?: string;
  onEdit?: () => void;
}

function InfoLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[11px] font-bold tracking-wide text-axc-dark-gray uppercase">
      {children}
    </span>
  );
}

function InfoValue({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-regular-small text-axc-gray break-words whitespace-pre-wrap">
      {children || "-"}
    </span>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
}) {
  return (
    <div className="flex items-start gap-2 min-w-0">
      <span className="text-axc-navy mt-0.5 shrink-0">{icon}</span>
      <div className="flex flex-col gap-0.5 min-w-0">
        <InfoLabel>{label}</InfoLabel>
        <InfoValue>{value}</InfoValue>
      </div>
    </div>
  );
}

export default function ProfileView({
  firstName = "Super",
  lastName = "Admin",
  roleLabel = "Super Admin",
  email = "admin@admin.com",
  username = "super_admin",
  phone,
  addressLine1,
  addressLine2,
  city,
  state,
  country,
  zipCode,
  bio,
  avatarUrl,
  lastLogin,
  onEdit,
}: ProfileViewProps) {
  return (
    <div className="bg-white rounded-lg border border-axc-border shadow-sm flex flex-col">

      <div className="relative">
        <PanelHeader title="Profile Information" />
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            title="Edit profile"
            className="absolute right-6 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full border border-axc-border flex items-center justify-center text-axc-navy bg-white hover:bg-gray-50 transition cursor-pointer"
          >
            <Pencil size={14} />
          </button>
        )}
      </div>
      <div className="p-6 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full overflow-hidden bg-gray-100 border border-axc-border flex items-center justify-center shrink-0">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-lg font-bold text-gray-400">
                {(firstName || "").charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <span className="font-bold text-axc-dark-gray">
                {firstName} {lastName}
              </span>
              <span className="text-[10px] font-semibold text-axc-navy bg-axc-navy/10 px-2 py-0.5 rounded-full capitalize">
                {roleLabel}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-regular-small text-axc-gray">
              <Mail size={12} />
              <span>{email}</span>
            </div>
            <div className="flex items-center gap-1.5 text-regular-small text-axc-gray">
              <Building2 size={12} />
              <span>{username}</span>
            </div>
          </div>
        </div>

        {lastLogin && (
          <span className="text-[11px] text-axc-gray whitespace-nowrap">
            Last login: {lastLogin}
          </span>
        )}
      </div>
      <div className="px-6 pb-6 pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-6">
          <InfoRow icon={<User size={14} />} label="First Name" value={firstName} />
          <InfoRow icon={<User size={14} />} label="Last Name" value={lastName} />
          <InfoRow icon={<AtSign size={14} />} label="Username" value={username} />

          <InfoRow icon={<Phone size={14} />} label="Phone" value={phone} />
          <InfoRow icon={<Home size={14} />} label="Address Line 1" value={addressLine1} />
          <InfoRow icon={<Home size={14} />} label="Address Line 2" value={addressLine2} />

          <InfoRow icon={<MapPin size={14} />} label="City" value={city} />
          <InfoRow icon={<Flag size={14} />} label="State" value={state} />
          <InfoRow icon={<Globe size={14} />} label="Country" value={country} />

          <InfoRow icon={<Hash size={14} />} label="ZIP Code" value={zipCode} />

          <div className="sm:col-span-2 lg:col-span-3">
            <InfoRow icon={<FileText size={14} />} label="Bio" value={bio} />
          </div>
        </div>
      </div>
    </div>
  );
}