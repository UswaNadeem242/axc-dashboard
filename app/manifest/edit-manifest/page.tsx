"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { User, FileText, ArrowLeft, Save } from "lucide-react";

import ManifestInformation from "../new-manifest/component/manifest-information";
import BagDetails from "../new-manifest/component/bag-detail";
import ManifestBilling from "../new-manifest/component/manifestbilling";
import {
  ManifestBagRow,
  ManifestChargeRow,
  ManifestFormErrors,
  ManifestFormState,
  ManifestTab,
} from "../new-manifest/component/state";
import { initialManifestData, ManifestEntry } from "@/app/src/constant";
import Button from "@/app/src/common/button";
import { api } from "@/app/src/lib/api";
import { showToast } from "@/app/src/common/toast";

type TabItem = {
  id: ManifestTab;
  label: string;
  icon: React.ReactNode;
};

const tabs: TabItem[] = [
  {
    id: "entry",
    label: "Entry",
    icon: <User size={14} />,
  },
  {
    id: "billing",
    label: "Billing",
    icon: <FileText size={14} />,
  },
];

const emptyBagRow = (id: number): ManifestBagRow => ({
  id,
  selected: false,
  bagNo: "",
  ediBagNo: "",
  bagId: "",
  trackBy: "PARCEL NUMBER",
  awbNo: "",
  forwarderNo: "",
  bookingDate: "",
  weight: "",
  pcs: "",
  destn: "",
  service: "",
  actionDuty: "",
});

const emptyChargeRow = (id: number): ManifestChargeRow => ({
  id,
  type: "",
  coLoader: "",
  vendor: "",
  company: "",
  charge: "",
  amount: "",
  remark: "",
});

function EditManifestContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const manifestId = searchParams.get("id") || searchParams.get("manifestNo") || "";

  const [tab, setTab] = useState<ManifestTab>("entry");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ManifestFormErrors>({});

  const [form, setForm] = useState<ManifestFormState>({
    manifestNo: manifestId,
    forwarderCode: "",
    forwarder: "",
    editForwarder: false,
    vendorCode: "",
    vendor: "",
    editVendor: false,
    masterNo: "",
    masterEdiBagNo: "",
    comment: "",
    date: "",
    time: "",
    runNumber: "",
    editRunNumber: false,
    flightNo: "",
    editFlightNo: false,
    noOfBags: "1",
    editNoOfBags: false,
    arrivalDate: "",
    arrivalTime: "",
    totalActualWt: "",
    totalVolumetricWt: "",
    totalChargeableWt: "",
    originHub: "",
    destinationHub: "",
    lineHaulVendor: "",
  });

  const [rows, setRows] = useState<ManifestBagRow[]>([emptyBagRow(1)]);
  const [charges, setCharges] = useState<ManifestChargeRow[]>([]);


  // Load existing manifest entry data
  useEffect(() => {
    if (!manifestId) return;

    let isMounted = true;
    async function loadData() {
      try {
        const res = await api.getManifest(manifestId);
        if (res && res.data && isMounted) {
          const matched = res.data;
          setForm((prev) => ({
            ...prev,
            ...(matched.form_data || {}),
            manifestNo: matched.manifest_no || manifestId,
            vendor: matched.vendor_name || matched.vendor || "",
            vendorCode: matched.vendor || "",
            originHub: matched.origin_hub_code || "",
            destinationHub: matched.destination_hub_code || matched.destination_hub_name || "",
            forwarderCode: matched.forwarder_code || "",
            runNumber: matched.run_number || "",
            masterEdiBagNo: matched.master_edi_bag_no || "",
            date: matched.manifest_date ? matched.manifest_date.split("-").reverse().join("-") : "",
            noOfBags: String(matched.no_of_bags || "1"),
            totalActualWt: String(matched.weight || ""),
            totalChargeableWt: String(matched.weight || ""),
          }));
          if (matched.bag_rows && Array.isArray(matched.bag_rows) && matched.bag_rows.length > 0) {
            setRows(matched.bag_rows);
          }
          if (matched.charge_rows && Array.isArray(matched.charge_rows) && matched.charge_rows.length > 0) {
            setCharges(matched.charge_rows);
          }
          return;
        }
      } catch (err) {
        console.warn("API getManifest fallback:", err);
      }

      if (typeof window !== "undefined") {
        let entries: ManifestEntry[] = [];
        const stored = localStorage.getItem("manifest_entries");
        if (stored) {
          try {
            entries = JSON.parse(stored);
          } catch (err) {
            console.error("Failed to parse manifest_entries:", err);
          }
        }
        if (!entries.length) {
          entries = initialManifestData;
        }

        const matched = entries.find((item) => String(item.manifestNo) === String(manifestId));

        if (matched && isMounted) {
          setForm((prev) => ({
            ...prev,
            manifestNo: matched.manifestNo || manifestId,
            vendor: matched.vendorName || matched.vendor || "",
            vendorCode: matched.vendor || "",
            originHub: matched.originHubCode || "",
            destinationHub: matched.destinationHubCode || matched.destinationHubName || "",
            forwarderCode: matched.forwarderCode || "",
            runNumber: matched.runNumber || "",
            masterEdiBagNo: matched.masterEdiBagNo || "",
            date: matched.manifestDate ? matched.manifestDate.split("-").reverse().join("-") : "",
            noOfBags: String(matched.noOfBags || "1"),
            totalActualWt: String(matched.weight || ""),
            totalChargeableWt: String(matched.weight || ""),
          }));

          if (matched.noOfBags) {
            setRows([
              {
                id: 1,
                selected: false,
                bagNo: `BAG-${matched.manifestNo}-01`,
                ediBagNo: matched.masterEdiBagNo || "",
                bagId: `ID-${matched.manifestNo}`,
                trackBy: "PARCEL NUMBER",
                awbNo: "30128763",
                forwarderNo: "874600062650",
                bookingDate: matched.manifestDate || "",
                weight: String(matched.weight || ""),
                pcs: "1",
                destn: matched.destinationHubCode || "",
                service: "FEDEX IP",
                actionDuty: "DUTY PAID",
              },
            ]);
          }
        }
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [manifestId]);

  const updateField = (field: keyof ManifestFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleEdit = (field: keyof ManifestFormState) => {
    setForm((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const updateRow = <K extends keyof ManifestBagRow>(id: number, key: K, value: ManifestBagRow[K]) => {
    setRows((prev) => {
      const next = prev.map((r) => {
        if (r.id === id) {
          const updated = { ...r, [key]: value };
          if (key === "awbNo" && typeof value === "string" && value.trim()) {
            try {
              const storedAwbs = localStorage.getItem("awb_entries");
              if (storedAwbs) {
                const awbList = JSON.parse(storedAwbs);
                const found = awbList.find((a: any) => String(a.awbNumber).trim() === value.trim());
                if (found) {
                  updated.bookingDate = found.bookingDate || updated.bookingDate;
                  updated.pcs = String(found.pcs || updated.pcs || "1");
                  updated.destn = found.destination || updated.destn;
                  updated.service = found.service || updated.service;
                  updated.forwarderNo = found.forwardingNumber || updated.forwarderNo;
                }
              }
            } catch (e) {
              console.warn("AWB lookup error:", e);
            }
          }
          return updated;
        }
        return r;
      });

      const totalWt = next.reduce((acc, r) => acc + (parseFloat(r.weight) || 0), 0);
      setForm((f) => ({
        ...f,
        noOfBags: String(next.length),
        totalActualWt: totalWt > 0 ? String(Number(totalWt.toFixed(2))) : f.totalActualWt,
        totalChargeableWt: totalWt > 0 ? String(Number(totalWt.toFixed(2))) : f.totalChargeableWt,
      }));

      return next;
    });
  };

  const addRow = () => {
    setRows((prev) => {
      const next = [...prev, emptyBagRow(Date.now())];
      setForm((f) => ({ ...f, noOfBags: String(next.length) }));
      return next;
    });
  };

  const removeRow = (id: number) => {
    setRows((prev) => {
      const next = prev.length > 1 ? prev.filter((r) => r.id !== id) : prev;
      const totalWt = next.reduce((acc, r) => acc + (parseFloat(r.weight) || 0), 0);
      setForm((f) => ({
        ...f,
        noOfBags: String(next.length),
        totalActualWt: totalWt > 0 ? String(Number(totalWt.toFixed(2))) : f.totalActualWt,
        totalChargeableWt: totalWt > 0 ? String(Number(totalWt.toFixed(2))) : f.totalChargeableWt,
      }));
      return next;
    });
  };

  const selectAll = () => {
    setRows((prev) => {
      const allSelected = prev.every((r) => r.selected);
      return prev.map((r) => ({ ...r, selected: !allSelected }));
    });
  };

  const updateCharge = <K extends keyof ManifestChargeRow>(id: number, key: K, value: ManifestChargeRow[K]) => {
    setCharges((prev) => prev.map((c) => (c.id === id ? { ...c, [key]: value } : c)));
  };

  const addCharge = () => {
    setCharges((prev) => [...prev, emptyChargeRow(Date.now())]);
  };

  const removeCharge = (id: number) => {
    setCharges((prev) => prev.filter((c) => c.id !== id));
  };

  const handleSearchAwb = () => {
    showToast({ variant: "info", message: "Searching AWB…" });
  };


  const handleSaveUpdate = async () => {
    if (!form.originHub?.trim()) {
      setErrors({ originHub: "Origin Hub is required" });
      showToast({ variant: "error", message: "Please fill all the required fields" });
      return;
    }

    setLoading(true);

    const updatedEntry: Partial<ManifestEntry> = {
      vendor: form.vendorCode,
      vendorName: form.vendor,
      originHubCode: form.originHub,
      destinationHubCode: form.destinationHub,
      destinationHubName: form.destinationHub,
      forwarderCode: form.forwarderCode,
      runNumber: form.runNumber,
      masterEdiBagNo: form.masterEdiBagNo,
      manifestDate: form.date ? form.date.split("-").reverse().join("-") : undefined,
      noOfBags: Number(form.noOfBags) || 1,
      weight: form.totalActualWt,
    };

    try {
      await api.updateManifest(manifestId, {
        ...updatedEntry,
        form_data: form,
        bag_rows: rows,
        charge_rows: charges,
      });
    } catch (err) {
      console.warn("API updateManifest fallback:", err);
    }

    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("manifest_entries");
        let list: ManifestEntry[] = stored ? JSON.parse(stored) : initialManifestData;

        const updatedList = list.map((item) => {
          if (String(item.manifestNo) === String(manifestId)) {
            return {
              ...item,
              ...updatedEntry,
            };
          }
          return item;
        });

        localStorage.setItem("manifest_entries", JSON.stringify(updatedList));
      } catch (err) {
        console.error("Failed to update manifest in localStorage:", err);
      }
    }

    setLoading(false);
    showToast({ variant: "success", message: "Manifest updated successfully!" });
    setTimeout(() => {
      router.push("/manifest");
    }, 800);
  };

  return (
    <div className="flex flex-col gap-4 w-full h-full min-h-0 overflow-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

      {/* Header bar */}
      {/* <div className="flex items-center justify-between gap-3 bg-white px-5 py-3.5 rounded-lg border border-axc-border shadow-xs shrink-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/manifest")}
            className="p-1.5 rounded-md hover:bg-gray-100 text-axc-dark-gray transition cursor-pointer"
            title="Back to All Manifests"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-regular-bold text-axc-dark-gray">
              Edit Manifest {manifestId ? `#${manifestId}` : ""}
            </h1>
            <p className="text-[12px] text-axc-gray">
              Update manifest information, bag details, and billing records
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            label="Cancel"
            onClick={() => router.push("/manifest")}
            variant="outline"
          />
          <Button
            label={loading ? "Saving..." : "Save Changes"}
            onClick={handleSaveUpdate}
            variant="primary"
            icon={Save}
            disabled={loading}
          />
        </div>
      </div> */}

      <div className="relative bg-white p-4 rounded-lg border border-gray-200 w-full flex-1 min-h-0 flex flex-col overflow-hidden">
        {/* Tab Headers */}
        <div className="bg-white border-b border-b-axc-border pb-0 shrink-0">
          <div className="flex gap-4 overflow-x-auto scrollbar-none">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`relative shrink-0 flex items-center gap-1.5 px-4 py-4 text-regular-medium whitespace-nowrap transition-colors duration-150 cursor-pointer ${
                  tab === t.id
                    ? "text-axc-dark-gray font-bold"
                    : "text-axc-gray hover:text-axc-dark-gray"
                }`}
              >
                {t.icon}
                {t.label}
                <span
                  className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-t transition-all duration-200 ${
                    tab === t.id ? "bg-axc-navy opacity-100" : "opacity-0"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 min-h-0 overflow-y-auto mt-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {tab === "entry" ? (
            <div className="flex flex-col gap-6 w-full pb-2">
              <ManifestInformation
                form={form}
                errors={errors}
                updateField={updateField}
                toggleEdit={toggleEdit}
                handleSearchAwb={handleSearchAwb}
                showBagging={false}
                handleCreateManifest={handleSaveUpdate}
                loading={loading}
                createButtonLabel="Save Changes"
              />
              <BagDetails
                rows={rows}
                updateRow={updateRow}
                addRow={addRow}
                removeRow={removeRow}
                selectAll={selectAll}
              />
            </div>
          ) : (
            <ManifestBilling
              charges={charges}
              addCharge={addCharge}
              updateCharge={updateCharge}
              removeCharge={removeCharge}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default function EditManifestPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-full w-full bg-white p-6 rounded-lg">
          <p className="text-sm text-axc-gray animate-pulse">Loading Manifest details...</p>
        </div>
      }
    >
      <EditManifestContent />
    </Suspense>
  );
}
