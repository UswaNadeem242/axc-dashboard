"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Save,
  ArrowLeft,
  History,
  Upload,
  X,
  FileText,
  CheckCircle,
  Building2,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Clock,
} from "lucide-react";
import { showToast } from "@/app/src/common/toast";
import CommonDropdown from "@/app/src/common/dropdown";
import CustomDatePicker from "@/app/src/common/datepicker";
import {
  PanelHeader,
  FieldLabel,
  FieldError,
  EditIconButton,
  FileUploadField,
  inputClass,
  errorInputClass,
} from "@/app/create-entries/components/form";
import {
  ConsigneeEntry,
  COUNTRY_OPTIONS,
  CUSTOMER_OPTIONS,
  COMPANY_OPTIONS,
  initialConsigneeData,
} from "../types";

const defaultFormState = {
  customer: "",
  company: "AMERICAN XPRESS COURIER - AXC INC",
  code: "",
  name: "",
  contactNo: "",
  email: "",
  dob: "",
  idProof1: "",
  idProof2: "",
  status: "ACTIVE" as "ACTIVE" | "INACTIVE",

  addressLine1: "",
  addressLine2: "",
  addressLine3: "",
  city: "",
  state: "",
  country: "INDIA",
  pincode: "",
  dialCode: "+91",

  editCode: false,
};

function CreateConsigneeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const isEdit = Boolean(editId);

  const [form, setForm] = useState(defaultFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  // Auto-generate Consignee code
  useEffect(() => {
    if (!isEdit && !form.code) {
      const randomSuffix = Math.floor(100 + Math.random() * 900);
      setForm((prev) => ({
        ...prev,
        code: `CSN${randomSuffix}`,
      }));
    }
  }, [isEdit, form.code]);

  // Load existing consignee for edit
  useEffect(() => {
    if (typeof window === "undefined" || !editId) return;
    try {
      const stored = localStorage.getItem("master_consignees");
      const list: ConsigneeEntry[] = stored
        ? JSON.parse(stored)
        : initialConsigneeData;
      const found = list.find((item) => item.id === editId || item.code === editId);
      if (found) {
        setForm({
          customer: found.customer || "",
          company: found.company || "AMERICAN XPRESS COURIER - AXC INC",
          code: found.code || "",
          name: found.name || "",
          contactNo: found.contactNo || "",
          email: found.email || "",
          dob: found.dob || "",
          idProof1: found.idProof1 || "",
          idProof2: found.idProof2 || "",
          status: found.status || "ACTIVE",
          addressLine1: found.addressLine1 || "",
          addressLine2: found.addressLine2 || "",
          addressLine3: found.addressLine3 || "",
          city: found.city || "",
          state: found.state || "",
          country: found.country || "INDIA",
          pincode: found.pincode || "",
          dialCode: found.dialCode || "+91",
          editCode: true,
        });
      }
    } catch (e) {
      console.error("Error loading consignee:", e);
    }
  }, [editId]);

  // Validation based on Image 1 mandatory fields (marked with red asterisk)
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.company.trim()) newErrors.company = "Company is required.";
    if (!form.code.trim()) newErrors.code = "Consignee Code is required.";
    if (!form.name.trim()) newErrors.name = "Consignee Name is required.";
    if (!form.contactNo.trim()) newErrors.contactNo = "Contact Number is required.";
    if (!form.addressLine1.trim()) newErrors.addressLine1 = "Address Line 1 is required.";
    if (!form.city.trim()) newErrors.city = "City is required.";
    if (!form.state.trim()) newErrors.state = "State is required.";
    if (!form.country.trim()) newErrors.country = "Country is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validate()) {
      showToast({
        variant: "error",
        message: "Please fill in all mandatory fields (marked with *).",
      });
      return;
    }

    setLoading(true);
    try {
      const stored = localStorage.getItem("master_consignees");
      const currentList: ConsigneeEntry[] = stored
        ? JSON.parse(stored)
        : [...initialConsigneeData];

      if (isEdit) {
        const updatedList = currentList.map((item) => {
          if (item.id === editId || item.code === editId) {
            return {
              ...item,
              ...form,
            };
          }
          return item;
        });
        localStorage.setItem("master_consignees", JSON.stringify(updatedList));
      } else {
        const newConsignee: ConsigneeEntry = {
          ...form,
          id: `CSN-${Date.now().toString().slice(-4)}`,
          srNo: currentList.length + 1,
          createdAt: new Date().toLocaleString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
        };
        const updatedList = [newConsignee, ...currentList];
        localStorage.setItem("master_consignees", JSON.stringify(updatedList));
      }

      setSuccess(true);
      showToast({
        variant: "success",
        message: isEdit ? "Consignee updated successfully!" : "Consignee created successfully!",
      });

      setTimeout(() => {
        router.push("/master/consignee");
      }, 700);
    } catch (err) {
      console.error("Save error:", err);
      showToast({
        variant: "error",
        message: "Failed to save consignee. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full h-full min-h-0 overflow-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="relative bg-white p-4 rounded-lg border border-gray-200 w-full flex-1 min-h-0 flex flex-col overflow-hidden">
        {/* ══════════════ TOP ACTION BAR (MATCHING REFERENCE IMAGE 1) ══════════════ */}
        {/* <div className="flex items-center justify-between pb-3.5 border-b border-axc-border shrink-0">
          <div className="flex items-center gap-2">
            <h1 className="text-regular-bold text-axc-dark-gray uppercase tracking-wider">
              {isEdit ? "EDIT CONSIGNEE" : "ADD CONSIGNEE"}
            </h1>
          </div>

          <div className="flex items-center gap-2">
           
            <button
              type="button"
              onClick={() => router.push("/master/consignee")}
              className="px-4 py-1.5 rounded border border-gray-300 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft size={13} />
              BACK
            </button>

             <button
              type="button"
              onClick={() => setHistoryOpen(true)}
              className="px-4 py-1.5 rounded bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold uppercase tracking-wider transition cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              <History size={13} />
              CONSIGNEE HISTORY
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={handleSave}
              className="px-5 py-1.5 rounded bg-axc-navy hover:bg-axc-navy/90 text-white text-xs font-bold uppercase tracking-wider transition cursor-pointer shadow-xs flex items-center gap-1.5 disabled:opacity-50"
            >
              <Save size={13} />
              {loading ? "SAVING..." : "SAVE"}
            </button>
          </div>
        </div> */}

        {/* ══════════════ SUCCESS BANNER ══════════════ */}
        {/* {success && (
          <div className="flex items-center gap-3 rounded-2xl bg-axc-green/10 border border-axc-green/30 p-4 text-axc-dark-green animate-in fade-in slide-in-from-top-4 duration-300 shrink-0">
            <CheckCircle className="h-5 w-5 text-axc-dark-green shrink-0" />
            <div>
              <p className="text-xs font-bold">
                {isEdit ? "Consignee Updated Successfully!" : "Consignee Created Successfully!"}
              </p>
              <p className="text-[10px] text-axc-dark-green font-medium">Redirecting you back to Consignee list...</p>
            </div>
          </div>
        )} */}

        {/* ══════════════ SCROLLABLE MAIN FORM (IMAGE 2 AWB STYLE CARD) ══════════════ */}
        <div className="flex-1 min-h-0 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <form onSubmit={handleSave} className="flex flex-col gap-6 w-full pb-6">
            <div className="bg-white rounded-lg border border-axc-border shadow-sm flex flex-col w-full">
              {/* Purple-Navy Header Banner: Image 2 Style */}
              <PanelHeader
                title="Consignee information"
                
              />

              {/* Main Content Grid: Exactly 3 Inputs Per Row, Address Row at the End */}
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-4">
                {/* ══════════════ ROW 1: CODE, NAME, COMPANY ══════════════ */}
                <div className="flex flex-col gap-1">
                  <FieldLabel required>Code</FieldLabel>
                  <div className="relative">
                    <input
                      type="text"
                      value={form.code}
                      readOnly={!form.editCode}
                      placeholder={!form.editCode ? "AUTO-GENERATED" : ""}
                      onChange={(e) => {
                        setForm((prev) => ({ ...prev, code: e.target.value.toUpperCase() }));
                        if (errors.code) setErrors((prev) => ({ ...prev, code: "" }));
                      }}
                      className={`${errors.code ? errorInputClass : inputClass} w-full pr-10 text-regular-small ${
                        form.editCode ? "bg-white" : "bg-gray-50 text-gray-500 cursor-not-allowed"
                      }`}
                    />
                    <div className="absolute right-1 top-1/2 -translate-y-1/2">
                      <EditIconButton
                        active={form.editCode}
                        onToggle={() => setForm((prev) => ({ ...prev, editCode: !prev.editCode }))}
                        title="Edit Consignee Code"
                      />
                    </div>
                  </div>
                  <FieldError message={errors.code} />
                </div>

                <div className="flex flex-col gap-1">
                  <FieldLabel required>Name</FieldLabel>
                  <input
                    type="text"
                    placeholder="Enter Consignee Name..."
                    value={form.name}
                    onChange={(e) => {
                      setForm((prev) => ({ ...prev, name: e.target.value }));
                      if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                    }}
                    className={errors.name ? errorInputClass : inputClass}
                  />
                  <FieldError message={errors.name} />
                </div>

                <div className="flex flex-col gap-1">
                  <FieldLabel required>Company</FieldLabel>
                  <CommonDropdown
                    value={form.company}
                    placeholder="SELECT COMPANY..."
                    options={COMPANY_OPTIONS}
                    onChange={(val) => {
                      setForm((prev) => ({ ...prev, company: val }));
                      if (errors.company) setErrors((prev) => ({ ...prev, company: "" }));
                    }}
                  />
                  <FieldError message={errors.company} />
                </div>

                {/* ══════════════ ROW 2: CUSTOMER, CONTACT NO, EMAIL ID ══════════════ */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Customer</FieldLabel>
                  <CommonDropdown
                    value={form.customer}
                    placeholder="SEARCH HERE..."
                    options={CUSTOMER_OPTIONS}
                    onChange={(val) => setForm((prev) => ({ ...prev, customer: val }))}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <FieldLabel required>Contact No.</FieldLabel>
                  <div className="flex items-center gap-2">
                    <input
                      type="tel"
                      placeholder="e.g. +91"
                      value={form.dialCode}
                      onChange={(e) => setForm((prev) => ({ ...prev, dialCode: e.target.value }))}
                      className={`${inputClass} w-24 shrink-0 text-left font-mono`}
                    />
                    <input
                      type="tel"
                      placeholder="Enter Contact Number..."
                      value={form.contactNo}
                      onChange={(e) => {
                        setForm((prev) => ({ ...prev, contactNo: e.target.value }));
                        if (errors.contactNo) setErrors((prev) => ({ ...prev, contactNo: "" }));
                      }}
                      className={`${errors.contactNo ? errorInputClass : inputClass} flex-1`}
                    />
                  </div>
                  <FieldError message={errors.contactNo} />
                </div>

                <div className="flex flex-col gap-1">
                  <FieldLabel>Email Id.</FieldLabel>
                  <input
                    type="email"
                    placeholder="e.g. consignee@domain.com"
                    value={form.email}
                    onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                    className={inputClass}
                  />
                </div>

                {/* ══════════════ ROW 3: DATE OF BIRTH, CITY, STATE ══════════════ */}
                <div className="flex flex-col gap-1">
                  <FieldLabel>Date of Birth</FieldLabel>
                  <CustomDatePicker
                    value={form.dob}
                    onChange={(val) => setForm((prev) => ({ ...prev, dob: val }))}
                    placeholder="mm/dd/yyyy"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <FieldLabel required>City</FieldLabel>
                  <input
                    type="text"
                    placeholder="Enter City..."
                    value={form.city}
                    onChange={(e) => {
                      setForm((prev) => ({ ...prev, city: e.target.value }));
                      if (errors.city) setErrors((prev) => ({ ...prev, city: "" }));
                    }}
                    className={errors.city ? errorInputClass : inputClass}
                  />
                  <FieldError message={errors.city} />
                </div>

                <div className="flex flex-col gap-1">
                  <FieldLabel required>State</FieldLabel>
                  <input
                    type="text"
                    placeholder="Enter State / Province..."
                    value={form.state}
                    onChange={(e) => {
                      setForm((prev) => ({ ...prev, state: e.target.value }));
                      if (errors.state) setErrors((prev) => ({ ...prev, state: "" }));
                    }}
                    className={errors.state ? errorInputClass : inputClass}
                  />
                  <FieldError message={errors.state} />
                </div>

                {/* ══════════════ ROW 4: COUNTRY, PINCODE, STATUS ══════════════ */}
                <div className="flex flex-col gap-1">
                  <FieldLabel required>Country</FieldLabel>
                  <CommonDropdown
                    value={form.country}
                    placeholder="SELECT COUNTRY..."
                    options={COUNTRY_OPTIONS}
                    onChange={(val) => {
                      setForm((prev) => ({ ...prev, country: val }));
                      if (errors.country) setErrors((prev) => ({ ...prev, country: "" }));
                    }}
                  />
                  <FieldError message={errors.country} />
                </div>

                <div className="flex flex-col gap-1">
                  <FieldLabel>Pincode</FieldLabel>
                  <input
                    type="text"
                    placeholder="e.g. 380054"
                    value={form.pincode}
                    onChange={(e) => setForm((prev) => ({ ...prev, pincode: e.target.value }))}
                    className={inputClass}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <FieldLabel>Status</FieldLabel>
                  <div className="flex items-center gap-6 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-axc-dark-gray">
                      <input
                        type="radio"
                        name="status"
                        value="ACTIVE"
                        checked={form.status === "ACTIVE"}
                        onChange={() => setForm((prev) => ({ ...prev, status: "ACTIVE" }))}
                        className="w-4 h-4 accent-axc-blue cursor-pointer"
                      />
                      ACTIVE
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-axc-dark-gray">
                      <input
                        type="radio"
                        name="status"
                        value="INACTIVE"
                        checked={form.status === "INACTIVE"}
                        onChange={() => setForm((prev) => ({ ...prev, status: "INACTIVE" }))}
                        className="w-4 h-4 accent-axc-blue cursor-pointer"
                      />
                      INACTIVE
                    </label>
                  </div>
                </div>

                {/* ══════════════ ADDRESS & UPLOAD KYC (EXACT REFERENCE IMAGE DESIGN) ══════════════ */}
                {/* Address 1 * */}
                <div className="flex flex-col gap-1 sm:col-span-2 lg:col-span-3 w-full">
                  <FieldLabel required>Address 1</FieldLabel>
                  <input
                    type="text"
                    placeholder="Address 1"
                    value={form.addressLine1}
                    onChange={(e) => {
                      setForm((prev) => ({ ...prev, addressLine1: e.target.value }));
                      if (errors.addressLine1) setErrors((prev) => ({ ...prev, addressLine1: "" }));
                    }}
                    className={errors.addressLine1 ? errorInputClass : inputClass}
                  />
                  <FieldError message={errors.addressLine1} />
                </div>

                {/* Address 2 */}
                <div className="flex flex-col gap-1 sm:col-span-2 lg:col-span-3 w-full">
                  <FieldLabel>Address 2</FieldLabel>
                  <input
                    type="text"
                    placeholder="Address 2"
                    value={form.addressLine2}
                    onChange={(e) => setForm((prev) => ({ ...prev, addressLine2: e.target.value }))}
                    className={inputClass}
                  />
                </div>

                {/* Address 3 */}
                <div className="flex flex-col gap-1 sm:col-span-2 lg:col-span-3 w-full">
                  <FieldLabel>Address 3</FieldLabel>
                  <input
                    type="text"
                    placeholder="Address 3"
                    value={form.addressLine3}
                    onChange={(e) => setForm((prev) => ({ ...prev, addressLine3: e.target.value }))}
                    className={inputClass}
                  />
                </div>

                {/* ══════════════ UPLOAD 1: CONSIGNEE ID PROOF 1 ══════════════ */}
                <div className="flex flex-col gap-1 sm:col-span-2 lg:col-span-3 w-full">
                  <FieldLabel>Consignee ID Proof 1</FieldLabel>
                  <FileUploadField
                    placeholder="No file chosen"
                    acceptedLabel="JPEG, PNG, PDF and SVG formats, up to 10MB"
                    onFileChange={(file) => {
                      setForm((prev) => ({ ...prev, idProof1: file?.name || "" }));
                    }}
                  />
                  {form.idProof1 && (
                    <div className="flex items-center gap-2 pt-1">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-gray-100 text-gray-700 text-xs border border-gray-200">
                        <FileText size={13} className="text-axc-navy shrink-0" />
                        <span className="font-medium truncate max-w-xs">{form.idProof1}</span>
                        <button
                          type="button"
                          onClick={() => setForm((prev) => ({ ...prev, idProof1: "" }))}
                          className="text-gray-400 hover:text-red-500 cursor-pointer ml-1"
                          title="Remove file"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    </div>
                  )}
                </div>

                {/* ══════════════ UPLOAD 2: CONSIGNEE ID PROOF 2 ══════════════ */}
                <div className="flex flex-col gap-1 sm:col-span-2 lg:col-span-3 w-full">
                  <FieldLabel>Consignee ID Proof 2</FieldLabel>
                  <FileUploadField
                    placeholder="No file chosen"
                    acceptedLabel="JPEG, PNG, PDF and SVG formats, up to 10MB"
                    onFileChange={(file) => {
                      setForm((prev) => ({ ...prev, idProof2: file?.name || "" }));
                    }}
                  />
                  {form.idProof2 && (
                    <div className="flex items-center gap-2 pt-1">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-gray-100 text-gray-700 text-xs border border-gray-200">
                        <FileText size={13} className="text-axc-navy shrink-0" />
                        <span className="font-medium truncate max-w-xs">{form.idProof2}</span>
                        <button
                          type="button"
                          onClick={() => setForm((prev) => ({ ...prev, idProof2: "" }))}
                          className="text-gray-400 hover:text-red-500 cursor-pointer ml-1"
                          title="Remove file"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ══════════════ BOTTOM ACTION BUTTONS (IMAGE 1 BOTTOM BAR) ══════════════ */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => router.push("/master/consignee")}
                className="px-5 py-4 border border-axc-border bg-white text-axc-dark-gray rounded-lg text-xs font-semibold hover:bg-gray-50 transition cursor-pointer"
              >
                
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
               className="px-5 py-4 bg-axc-navy cursor-pointer text-white rounded-lg text-regular-small transition shadow-sm"
              >
                
                {loading ? "SAVING..." : "SAVE"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ══════════════ CONSIGNEE HISTORY MODAL ══════════════ */}
      {/* {historyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 max-w-3xl w-full overflow-hidden flex flex-col max-h-[85vh]">
        
            <div className="bg-axc-navy/60 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History size={18} />
                <h3 className="text-base font-bold">Consignee History — {form.code || "Consignee"}</h3>
              </div>
              <button
                type="button"
                onClick={() => setHistoryOpen(false)}
                className="text-white/80 hover:text-white p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

             <div className="p-6 overflow-y-auto space-y-4">
              <div className="flex items-center justify-between text-xs text-gray-500 pb-2 border-b border-gray-100">
                <span>Recent shipment consignee logs and audit records</span>
                <span className="font-semibold text-axc-navy">Consignee: {form.name || "N/A"}</span>
              </div>

              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-600 font-semibold uppercase tracking-wider border-b border-gray-200">
                    <tr>
                      <th className="px-3 py-2.5">Date & Time</th>
                      <th className="px-3 py-2.5">AWB No</th>
                      <th className="px-3 py-2.5">Origin / Destination</th>
                      <th className="px-3 py-2.5">Status</th>
                      <th className="px-3 py-2.5">User</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    <tr>
                      <td className="px-3 py-2 font-mono">05/11/2026 15:30</td>
                      <td className="px-3 py-2 font-semibold text-axc-navy">AXC-992104</td>
                      <td className="px-3 py-2">Ahmedabad → Dubai (DXB)</td>
                      <td className="px-3 py-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700">
                          DELIVERED
                        </span>
                      </td>
                      <td className="px-3 py-2">Admin User</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 font-mono">02/11/2026 11:20</td>
                      <td className="px-3 py-2 font-semibold text-axc-navy">AXC-991823</td>
                      <td className="px-3 py-2">Mumbai → London (LHR)</td>
                      <td className="px-3 py-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700">
                          IN TRANSIT
                        </span>
                      </td>
                      <td className="px-3 py-2">Operator 02</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 font-mono">28/10/2026 09:45</td>
                      <td className="px-3 py-2 font-semibold text-axc-navy">AXC-988341</td>
                      <td className="px-3 py-2">Delhi → New York (JFK)</td>
                      <td className="px-3 py-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700">
                          DELIVERED
                        </span>
                      </td>
                      <td className="px-3 py-2">Admin User</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

             <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex justify-end">
              <button
                type="button"
                onClick={() => setHistoryOpen(false)}
                className="px-4 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-700 text-xs font-semibold hover:bg-gray-100 transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
}

export default function CreateConsigneePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64 text-sm text-axc-gray">
          Loading consignee form...
        </div>
      }
    >
      <CreateConsigneeContent />
    </Suspense>
  );
}

