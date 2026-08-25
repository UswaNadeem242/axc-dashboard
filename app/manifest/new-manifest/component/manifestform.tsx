"use client";
import { useState } from "react";
import {
  ManifestBagRow,
  ManifestChargeRow,
  ManifestFormErrors,
  ManifestFormState,
  ManifestTab,
  ToastState,
} from "./state";

const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, "0");
const dd = String(today.getDate()).padStart(2, "0");

const emptyForm: ManifestFormState = {
  manifestNo: "",

  forwarder: "",
  editForwarder: false,
  vendor: "",
  editVendor: false,

  masterNo: "",
  masterEdiBagNo: "",
  comment: "",

  date: `${yyyy}-${mm}-${dd}`,
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
};

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
  const [form, setForm] = useState<ManifestFormState>(emptyForm);
  const [errors, setErrors] = useState<ManifestFormErrors>({});
  const [tab, setTab] = useState<ManifestTab>("entry");
  const [rows, setRows] = useState<ManifestBagRow[]>([emptyBagRow(1)]);
  const [charges, setCharges] = useState<ManifestChargeRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (message: string, type: "success" | "info" = "info") => {
    setToast({ message, type });
    window.clearTimeout((showToast as any)._t);
    (showToast as any)._t = window.setTimeout(() => setToast(null), 2600);
  };

  const updateField = <K extends keyof ManifestFormState>(key: K, value: ManifestFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleEdit = (key: "editForwarder" | "editVendor" | "editRunNumber" | "editFlightNo" | "editNoOfBags") => {
    setForm((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const updateRow = <K extends keyof ManifestBagRow>(id: number, key: K, value: ManifestBagRow[K]) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [key]: value } : r)));
  };

  const addRow = () => {
    setRows((prev) => [...prev, emptyBagRow(Date.now())]);
  };

  const removeRow = (id: number) => {
    setRows((prev) => (prev.length > 1 ? prev.filter((r) => r.id !== id) : prev));
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

  const handleCreateManifest = () => {
    if (!validateEntry()) {
      showToast("Please fill all the required fields");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast("Manifest created successfully!", "success");
    }, 700);
  };

  const handleSearchAwb = () => {
    showToast("Searching AWB…");
  };

  const handleBagging = () => {
    showToast("Bagging started");
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
    toast,
    showToast,
    handleCreateManifest,
    handleSearchAwb,
    handleBagging,
  };
}