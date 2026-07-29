"use client";

import React, { useState } from "react";
import { Poppins } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";
import DashboardLayout from "./src/component/dashboard-layout";
import ToastProvider from "./src/lib/toastprovider";

import Header from "./src/components/Header";
import Sidebar from "./src/components/Sidebar";

const poppins = Poppins({
  subsets: ["latin"],
<<<<<<< HEAD
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
=======
  weight: ["400", "500", "600", "700"],
>>>>>>> f37d15fde6c04d5ff5c9504bd42c8c26f50368c5
});

export const metadata: Metadata = {
  title: "AXC – American Xpress Courier | Nothing Is Too Far",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <html lang="en">
<<<<<<< HEAD
      <body className={poppins.className} suppressHydrationWarning>
        <DashboardLayout>{children} <ToastProvider /></DashboardLayout>
=======
      <body className={poppins.className}>
        <div className="flex min-h-screen bg-[#F5F7FB]">
          <Sidebar
            collapsed={collapsed}
            setCollapsed={setCollapsed}
          />

          <div
            className={`flex-1 transition-[margin] duration-300 ${
              collapsed ? "ml-16" : "ml-60"
            }`}
          >
            <Header />

            <main className="p-4 sm:p-5 lg:p-6">
              {children}
            </main>
          </div>
        </div>
>>>>>>> f37d15fde6c04d5ff5c9504bd42c8c26f50368c5
      </body>
    </html>
  );
}