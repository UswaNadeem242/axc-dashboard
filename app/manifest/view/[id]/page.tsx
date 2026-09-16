"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowLeft, FileText } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ManifestEntry, ManifestChargeRow } from "@/app/src/constant";

const SectionHeader = ({ title }: { title: string }) => (
  <div className="bg-axc-navy/60 px-5 py-4 rounded-tl-lg rounded-tr-lg text-white capitalize">
    <h2>{title}</h2>
  </div>
);

const Field = ({
  label,
  value,
  bordered = false,
}: {
  label: string;
  value: string | React.ReactNode;
  bordered?: boolean;
}) => (
  <div
    className={`flex items-center text-sm border-b border-axc-border last:border-b-0 py-2.5 px-4 ${
      bordered ? "md:border-l md:border-axc-border" : ""
    }`}
  >
    <span className="text-axc-dark-gray text-regular-medium w-[200px] shrink-0">{label}</span>
    <span className="text-axc-gray flex-1 font-semibold">{value || "-"}</span>
  </div>
);

const DUMMY_BILLING_RECORDS: ManifestChargeRow[] = [
  {
    id: 1,
    type: "Freight",
    coLoader: "AXC Co-Load",
    vendor: "Speedex Logistics",
    company: "AXC Cargo Pvt Ltd",
    charge: "Line Haul Charge",
    amount: "12,500.00",
    remark: "Standard rate",
  },
  {
    id: 2,
    type: "Handling",
    coLoader: "-",
    vendor: "Speedex Logistics",
    company: "AXC Cargo Pvt Ltd",
    charge: "Ground Handling",
    amount: "1,800.00",
    remark: "Per bag",
  },
  {
    id: 3,
    type: "Fuel Surcharge",
    coLoader: "Skyward Cargo",
    vendor: "Speedex Logistics",
    company: "AXC Cargo Pvt Ltd",
    charge: "Fuel Adjustment",
    amount: "950.00",
    remark: "As per fuel index",
  },
  {
    id: 4,
    type: "Duty",
    coLoader: "-",
    vendor: "Customs Clearing Co.",
    company: "AXC Cargo Pvt Ltd",
    charge: "Customs Duty",
    amount: "3,200.00",
    remark: "Pending approval",
  },
];

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

  // Dummy data used to preview layout; swap with manifestData.billing when available
  const billingRecords: ManifestChargeRow[] = DUMMY_BILLING_RECORDS;

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b border-axc-border">
            <Field label="Manifest No:" value={manifestData.manifestNo} />
            <Field label="Manifest Date:" value={manifestData.manifestDate} bordered />
            <Field label="Vendor:" value={manifestData.vendor} bordered />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b border-axc-border">
            <Field label="Vendor Name:" value={manifestData.vendorName} />
            <Field label="Origin Hub Code:" value={manifestData.originHubCode} bordered />
            <Field label="Destination Hub Name:" value={manifestData.destinationHubName} bordered />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b border-axc-border">
            <Field label="Destination Hub Code:" value={manifestData.destinationHubCode} />
            <Field label="Forwarder Code:" value={manifestData.forwarderCode} bordered />
          </div>

          <SectionHeader title="Transport & Baggage" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b border-axc-border">
            <Field label="Run Number:" value={manifestData.runNumber} />
            <Field label="Vehicle No:" value={manifestData.vehicleNo} bordered />
            <Field label="Master EDI Bag No:" value={manifestData.masterEdiBagNo} bordered />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b border-axc-border">
            <Field label="No. of Bags:" value={manifestData.noOfBags?.toString()} />
            <Field label="Weight:" value={manifestData.weight} bordered />
          </div>
        </div>
      )}

      {activeTab === "billing" && (
        <div className="border border-axc-border rounded-lg overflow-x-auto bg-white">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-axc-navy/10 text-axc-black font-bold  text-xs">
              <tr>
                <th className="px-4 py-3 border-b border-axc-border">Type</th>
                <th className="px-4 py-3 border-b border-axc-border">Co-Loader</th>
                <th className="px-4 py-3 border-b border-axc-border">Vendor</th>
                <th className="px-4 py-3 border-b border-axc-border">Company</th>
                <th className="px-4 py-3 border-b border-axc-border">Charge</th>
                <th className="px-4 py-3 border-b border-axc-border">Amount</th>
                <th className="px-4 py-3 border-b border-axc-border">Remark</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-axc-border">
              {billingRecords.length > 0 ? (
                billingRecords.map((record) => (
                  <tr key={record.id}>
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