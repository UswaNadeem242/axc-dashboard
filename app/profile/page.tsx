"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProfileView from "./profilepage";
import { api } from "../src/lib/api";

const initialProfile = {
  firstName: "Super",
  lastName: "Admin",
  username: "super_admin",
  email: "admin@admin.com",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  country: "",
  zipCode: "",
  bio: "",
  avatarUrl: "",
  roleLabel: "Super Admin",
  lastLogin: "Today at 09:42 AM",
};

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState(initialProfile);

  useEffect(() => {
    let isMounted = true;
    async function loadProfile() {
      try {
        const res = await api.getProfile();
        if (res && res.data && isMounted) {
          setProfile((prev) => ({
            ...prev,
            ...res.data,
            avatarUrl: res.data.avatarPreview || prev.avatarUrl,
          }));
        }
      } catch (err) {
        console.warn("API getProfile fallback:", err);
      }
    }
    loadProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="p-4 flex flex-col gap-6">
      <ProfileView
        firstName={profile.firstName}
        lastName={profile.lastName}
        roleLabel={profile.roleLabel || "Super Admin"}
        email={profile.email || "admin@admin.com"}
        username={profile.username}
        phone={profile.phone}
        city={profile.city}
        country={profile.country}
        bio={profile.bio}
        avatarUrl={profile.avatarUrl}
        lastLogin={profile.lastLogin || "Today at 09:42 AM"}
        onEdit={() => router.push("/setting?tab=profile")}
      />
    </div>
  );
}