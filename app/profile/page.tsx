"use client";
import React from "react";
import { useRouter } from "next/navigation";
import ProfileView from "./profilepage";


const profile = {
  firstName: "Super",
  lastName: "Admin",
  username: "super_admin",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  country: "",
  zipCode: "",
  bio: "",
  avatarUrl: "",
};

export default function ProfilePage() {
  const router = useRouter();

  return (
    <div className="p-6 flex flex-col gap-6">
      <ProfileView
        firstName={profile.firstName}
        lastName={profile.lastName}
        roleLabel="Super Admin"
        email="admin@admin.com"
        username={profile.username}
        phone={profile.phone}
        addressLine1={profile.addressLine1}
        addressLine2={profile.addressLine2}
        city={profile.city}
        state={profile.state}
        country={profile.country}
        zipCode={profile.zipCode}
        bio={profile.bio}
        avatarUrl={profile.avatarUrl}
        lastLogin="9/18/2026"
        onEdit={() => router.push("/setting?tab=profile")}
      />
    </div>
  );
}