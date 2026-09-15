"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowLeft, FileText } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ManifestEntry } from "@/app/src/constant";

const SectionHeader = ({ title }: { title: string }) => (
  <div className="bg-axc-navy/60 px-5 py-4 rounded-tl-lg rounded-tr-lg text-white capitalize">
    <h2>{title}</h2>
  </div>
);

const Field = ({ label, value }: { label: string; value: string | React.ReactNode }) => (
  <div className="flex items-center text-sm border-b border-axc-border last:border-b-0 py-2.5 px-4">
    <span className="text-axc-dark-gray text-regular-medium w-[200px] shrink-0">{label}</span>
    <span className="text-axc-gray flex-1 font-semibold">{value || "-"}</span>
  </div>
);

export default function ManifestViewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [manifestData, setManifestData] = useState<ManifestEntry | null>(null);
  const [activeTab, setActiveTab] = useState("entry");

  useEffect(() => {
    if (typeof window !== "undefined" && id) {
      const stored = localStorage.getItem("manifest_entries");
      if (stored) {
        try {
          const parsed: ManifestEntry[] = JSON.parse(stored);
          const found = parsed.find((item) => item.manifestNo === id);
          if (found) {
            setManifestData(found);
          }
        } catch (e) {
          console.error("Failed to load manifest data", e);
        }
      }
    }
  }, [id]);

  if (!manifestData) {
    return (
      <div className="p-8 flex items-center justify-center text-gray-500">
        Loading or manifest not found...
      </div>
    );
  }

  // Sample data for billing to show layout as per image (or fetch from localstorage if available)
  const billingRecords: any[] = []; // Usually fetched from manifestData.billing or similar

  return (
    <div className="relative bg-white p-6 rounded-lg w-full flex-1 flex flex-col min-h-0 shadow-sm border border-axc-border overflow-x-hidden overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-lg">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between pb-4 mb-6 gap-4 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            title="Go back"
          >
            <ArrowLeft size={24} />
          </button>
          <Image
            src="/image/logo.png"
            alt="axc Logo"
            width={100}
            height={60}
            className="object-contain"
          />
        </div>
        <div className="flex items-center pr-4">
          <h1 className="text-xl font-bold">Manifest#:{id}</h1>
        </div>
      </div>

      <div className="flex border-b border-gray-200 mb-6 gap-8">
        <button
          onClick={() => setActiveTab("entry")}
          className={`flex items-center gap-2 pb-3 text-sm font-medium border-b-2 transition-colors px-2 cursor-pointer ${activeTab === "entry" ? "border-axc-navy text-axc-navy" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
        >
          <FileText size={16} />
          Entry
        </button>
        <button
          onClick={() => setActiveTab("billing")}
          className={`flex items-center gap-2 pb-3 text-sm font-medium border-b-2 transition-colors px-2 cursor-pointer ${activeTab === "billing" ? "border-axc-navy text-axc-navy" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
        >
          <FileText size={16} />
          Billing
        </button>
      </div>

      {activeTab === "entry" && (
        <div className="border border-axc-border rounded-tl-lg rounded-tr-lg">
          <SectionHeader title="General Information" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-b border-axc-border">
            <Field label="Manifest No:" value={manifestData.manifestNo} />
            <div className="border-l border-axc-border">
              <Field label="Manifest Date:" value={manifestData.manifestDate} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-b border-axc-border">
            <Field label="Vendor:" value={manifestData.vendor} />
            <div className="border-l border-axc-border">
              <Field label="Vendor Name:" value={manifestData.vendorName} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-b border-axc-border">
            <Field label="Origin Hub Code:" value={manifestData.originHubCode} />
            <div className="border-l border-axc-border">
              <Field label="Destination Hub Name:" value={manifestData.destinationHubName} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-b border-axc-border">
            <Field label="Destination Hub Code:" value={manifestData.destinationHubCode} />
            <div className="border-l border-axc-border">
              <Field label="Forwarder Code:" value={manifestData.forwarderCode} />
            </div>
          </div>
          
          <SectionHeader title="Transport & Baggage" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-b border-axc-border">
            <Field label="Run Number:" value={manifestData.runNumber} />
            <div className="border-l border-axc-border">
              <Field label="Vehicle No:" value={manifestData.vehicleNo} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-b border-axc-border">
            <Field label="Master EDI Bag No:" value={manifestData.masterEdiBagNo} />
            <div className="border-l border-axc-border">
              <Field label="No. of Bags:" value={manifestData.noOfBags?.toString()} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-b border-axc-border">
            <Field label="Weight:" value={manifestData.weight} />
          </div>
        </div>
      )}

      {activeTab === "billing" && (
        <div className="border border-axc-border rounded-lg overflow-x-auto bg-white">
           <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-axc-navy/10 text-axc-navy font-bold uppercase text-xs">
              <tr>
                <th className="px-4 py-3 border-b border-axc-border">TYPE</th>
                <th className="px-4 py-3 border-b border-axc-border">CO-LOADER</th>
                <th className="px-4 py-3 border-b border-axc-border">VENDOR</th>
                <th className="px-4 py-3 border-b border-axc-border">COMPANY</th>
                <th className="px-4 py-3 border-b border-axc-border">CHARGE</th>
                <th className="px-4 py-3 border-b border-axc-border">AMOUNT</th>
                <th className="px-4 py-3 border-b border-axc-border">REMARK</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-axc-border">
              {billingRecords.length > 0 ? (
                billingRecords.map((record, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3">{record.type || "-"}</td>
                    <td className="px-4 py-3">{record.coLoader || "-"}</td>
                    <td className="px-4 py-3">{record.vendor || "-"}</td>
                    <td className="px-4 py-3">{record.company || "-"}</td>
                    <td className="px-4 py-3">{record.charge || "-"}</td>
                    <td className="px-4 py-3">{record.amount || "-"}</td>
                    <td className="px-4 py-3">{record.remark || "-"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    No billing records found for this manifest.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
