"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ManifestBagRow,
  ManifestChargeRow,
  ManifestFormErrors,
  ManifestFormState,
  ManifestTab,
  ToastState,
} from "./state";
import { api } from "../../../src/lib/api";
import { initialManifestData, ManifestEntry } from "../../../src/constant";
import { showToast as showAppToast } from "../../../src/common/toast";

export function createEmptyForm(): ManifestFormState {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const hh = String(today.getHours()).padStart(2, "0");
  const min = String(today.getMinutes()).padStart(2, "0");

  return {
    manifestNo: "",

    forwarderCode: "",
    forwarder: "",
    editForwarder: false,
    vendorCode: "",
    vendor: "",
    editVendor: false,

    masterNo: "",
    masterEdiBagNo: "",
    comment: "",

    date: `${yyyy}-${mm}-${dd}`,
    time: `${hh}:${min}`,

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
  };
}

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

export function useManifestForm() {
  const router = useRouter();

  const [form, setForm] = useState<ManifestFormState>(createEmptyForm());
  const [errors, setErrors] = useState<ManifestFormErrors>({});
  const [tab, setTab] = useState<ManifestTab>("entry");
  const [rows, setRows] = useState<ManifestBagRow[]>([emptyBagRow(1)]);
  const [charges, setCharges] = useState<ManifestChargeRow[]>([]);
  const [loading, setLoading] = useState(false);

  const showToast = (message: string, type: "success" | "info" | "error" = "info") => {
    showAppToast({ variant: type, message });
  };

  const updateField = <K extends keyof ManifestFormState>(key: K, value: ManifestFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleEdit = (key: "editForwarder" | "editVendor" | "editRunNumber" | "editFlightNo" | "editNoOfBags") => {
    setForm((prev) => ({ ...prev, [key]: !prev[key] }));
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

  const validateEntry = (): boolean => {
    const next: ManifestFormErrors = {};
    if (!form.originHub?.trim()) next.originHub = "Origin Hub is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleCreateManifest = async () => {
    if (!validateEntry()) {
      showToast("Please fill all the required fields", "error");
      return;
    }
    setLoading(true);

    const manifestNumber = form.manifestNo || `MAN-${Date.now().toString().slice(-6)}`;
    const newEntry: ManifestEntry = {
      srNo: 1,
      manifestNo: manifestNumber,
      vendor: form.vendorCode || "AXC",
      vendorName: form.vendor || "AXC EXPRESS",
      originHubCode: form.originHub,
      destinationHubCode: form.destinationHub || "DEL",
      destinationHubName: form.destinationHub || "DELHI HUB",
      forwarderCode: form.forwarderCode || "FWD-01",
      runNumber: form.runNumber || "RUN-101",
      masterEdiBagNo: form.masterEdiBagNo || "",
      manifestDate: form.date ? form.date.split("-").reverse().join("-") : new Date().toLocaleDateString(),
      vehicleNo: form.flightNo || "",
      noOfBags: Number(form.noOfBags) || 1,
      weight: form.totalActualWt || "10.00",
    };

    try {
      const awbNumbers = rows.map((r) => r.awbNo?.trim()).filter(Boolean);
      await api.createManifest({
        ...newEntry,
        form_data: {
          ...form,
          awbNumbers,
        },
        bag_rows: rows,
        charge_rows: charges,
      });
    } catch (err) {
      console.warn("API createManifest fallback:", err);
    }

    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("manifest_entries");
        const list: ManifestEntry[] = stored ? JSON.parse(stored) : initialManifestData;
        localStorage.setItem("manifest_entries", JSON.stringify([newEntry, ...list]));
      } catch (e) {
        console.error(e);
      }
    }

    setLoading(false);
    showToast("Manifest created successfully!", "success");
    setTimeout(() => {
      router.push("/manifest");
    }, 1000);
  };

  const handleSearchAwb = () => {
    showToast("Searching AWB…");
  };

  const handleBagging = () => {
    router.push("/manifest/new-manifest/bagging");
  };

  return {
    form,
    setForm,
    updateField,
    toggleEdit,
    errors,
    tab,
    setTab,
    rows,
    updateRow,
    addRow,
    removeRow,
    selectAll,
    charges,
    updateCharge,
    addCharge,
    removeCharge,
    loading,
    toast: null,
    showToast,
    handleCreateManifest,
    handleSearchAwb,
    handleBagging,
  };
}