"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Plus,
  XCircle,
  Copy,
  PlusCircle,
  Check,
  Search,
} from "lucide-react";
import { showToast } from "@/app/src/common/toast";
import { api } from "@/app/src/lib/api";
import { invalidateMasterDataCache } from "@/app/src/lib/useMasterData";
import CommonDropdown from "@/app/src/common/dropdown";
import {
  PanelHeader,
  FieldLabel,
  FieldError,
  inputClass,
} from "@/app/create-entries/components/form";
import {
  WhatsappMasterEntry,
  WhatsappVariableItem,
  WHATSAPP_IDENTIFIER_OPTIONS,
  AWB_RELATED_VALUES_LIST,
  initialWhatsappMasterData,
} from "../types";

function CreateWhatsappMasterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const isEdit = Boolean(editId);

  const smsTextareaRef = useRef<HTMLTextAreaElement>(null);

  const [form, setForm] = useState<WhatsappMasterEntry>({
    id: `wa_master_${Date.now()}`,
    title: "",
    whatsappIdentifier: "",
    templateName: "",
    smsContent: "",
    variables: [
      { id: "var_1", variable: "VAR1", valueExtractor: "", isButton: false },
    ],
    status: "ACTIVE",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [awbSearch, setAwbSearch] = useState("");
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Load existing entry if editing
  useEffect(() => {
    if (!editId) return;
    let mounted = true;
    api
      .getMasterItem<WhatsappMasterEntry>("/whatsapp-masters", editId)
      .then((found) => {
        if (mounted && found) {
          setForm({
            ...found,
            variables:
              found.variables && found.variables.length > 0
                ? found.variables
                : [
                    {
                      id: `var_${Date.now()}`,
                      variable: "VAR1",
                      valueExtractor: "",
                      isButton: false,
                    },
                  ],
          });
        }
      })
      .catch(() => {
        if (typeof window !== "undefined") {
          const stored = localStorage.getItem("master_whatsapp_masters");
          if (stored) {
            try {
              const list: WhatsappMasterEntry[] = JSON.parse(stored);
              const found = list.find((item) => String(item.id) === String(editId));
              if (found && mounted) {
                setForm({
                  ...found,
                  variables:
                    found.variables && found.variables.length > 0
                      ? found.variables
                      : [
                          {
                            id: `var_${Date.now()}`,
                            variable: "VAR1",
                            valueExtractor: "",
                            isButton: false,
                          },
                        ],
                });
              }
            } catch (e) {
              console.error("Error loading WhatsApp Master:", e);
            }
          }
        }
      });
    return () => {
      mounted = false;
    };
  }, [editId]);

  // Variables Table Handlers
  const handleAddVariable = () => {
    const nextIdx = form.variables.length + 1;
    const newVar: WhatsappVariableItem = {
      id: `var_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      variable: `VAR${nextIdx}`,
      valueExtractor: "",
      isButton: false,
    };
    setForm((prev) => ({
      ...prev,
      variables: [...prev.variables, newVar],
    }));
  };

  const handleRemoveVariable = (index: number) => {
    if (form.variables.length <= 1) {
      showToast({
        message: "At least one variable row is required.",
        variant: "info",
      });
      return;
    }
    setForm((prev) => ({
      ...prev,
      variables: prev.variables.filter((_, i) => i !== index),
    }));
  };

  const handleVariableChange = (
    index: number,
    field: keyof WhatsappVariableItem,
    val: any
  ) => {
    setForm((prev) => {
      const nextVars = [...prev.variables];
      nextVars[index] = { ...nextVars[index], [field]: val };
      return { ...prev, variables: nextVars };
    });
  };

  // Insert token into SMS Content
  const handleInsertTokenToSms = (token: string) => {
    setForm((prev) => {
      const textarea = smsTextareaRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = prev.smsContent;
        const updated =
          text.substring(0, start) + token + text.substring(end);
        return { ...prev, smsContent: updated };
      }
      return {
        ...prev,
        smsContent: prev.smsContent
          ? `${prev.smsContent} ${token}`
          : token,
      };
    });

    if (errors.smsContent) {
      setErrors((prev) => ({ ...prev, smsContent: "" }));
    }

    showToast({
      message: `Token ${token} inserted into SMS Content.`,
      variant: "success",
    });
  };

  // Insert token as a new Variable row
  const handleAddTokenAsVariable = (token: string) => {
    const nextIdx = form.variables.length + 1;
    const newVar: WhatsappVariableItem = {
      id: `var_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      variable: `VAR${nextIdx}`,
      valueExtractor: token,
      isButton: false,
    };
    setForm((prev) => ({
      ...prev,
      variables: [...prev.variables, newVar],
    }));
    showToast({
      message: `Added ${token} as variable VAR${nextIdx}.`,
      variant: "success",
    });
  };

  // Copy token to clipboard
  const handleCopyToken = (token: string) => {
    navigator.clipboard.writeText(token);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
    showToast({
      message: `Copied ${token} to clipboard!`,
      variant: "success",
    });
  };

  // Filter AWB Related Values by search
  const filteredAwbValues = AWB_RELATED_VALUES_LIST.filter(
    (item) =>
      item.token.toLowerCase().includes(awbSearch.toLowerCase()) ||
      item.label.toLowerCase().includes(awbSearch.toLowerCase()) ||
      item.sample.toLowerCase().includes(awbSearch.toLowerCase())
  );

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!form.whatsappIdentifier.trim()) {
      errs.whatsappIdentifier = "WhatsApp Identifier is required.";
    }
    if (!form.smsContent.trim()) {
      errs.smsContent = "SMS Content is required.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validate()) {
      showToast({
        message: "Please fill in all required fields marked with *",
        variant: "error",
      });
      return;
    }

    setLoading(true);

    try {
      let savedRecord = form;
      try {
        if (isEdit && editId) {
          savedRecord = await api.updateMasterItem<WhatsappMasterEntry>("/whatsapp-masters", editId, form);
        } else {
          savedRecord = await api.createMasterItem<WhatsappMasterEntry>("/whatsapp-masters", form);
        }
      } catch (apiErr) {
        console.warn("API save fallback to local:", apiErr);
      }

      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("master_whatsapp_masters");
        let list: WhatsappMasterEntry[] = stored
          ? JSON.parse(stored)
          : initialWhatsappMasterData;

        if (isEdit) {
          list = list.map((item) => (String(item.id) === String(editId) ? savedRecord : item));
        } else {
          list = [savedRecord, ...list];
        }

        localStorage.setItem(
          "master_whatsapp_masters",
          JSON.stringify(list)
        );
      }

      invalidateMasterDataCache();

      showToast({
        message: `WhatsApp Master "${form.title || form.whatsappIdentifier}" ${
          isEdit ? "updated" : "saved"
        } successfully!`,
        variant: "success",
      });

      router.push("/master/whatsapp-masters");
    } catch (err) {
      console.error("Failed to save WhatsApp Master:", err);
      showToast({
        message: "Failed to save WhatsApp Master. Please try again.",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full h-full min-h-0 overflow-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="relative bg-white p-4 rounded-lg border border-gray-200 w-full flex-1 flex flex-col min-h-0 shadow-sm overflow-hidden">
        {/* ═══════════ MAIN SCROLLABLE CONTAINER (AWB DESIGN) ═══════════ */}
        <div className="flex-1 min-h-0 overflow-y-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex flex-col gap-6 pb-6">
            {/* ═══════════ TOP SECTION: 2 SIDE-BY-SIDE CARDS (EXACT AWB REFERENCE LAYOUT) ═══════════ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start w-full">
              {/* ──────────────── CARD 1: WHATSAPP TEMPLATE INFORMATION ──────────────── */}
              <div className="bg-white rounded-lg border border-axc-border shadow-sm overflow-hidden flex flex-col w-full">
                <PanelHeader
                  title="Whatsapp template information"
                  right={
                    isEdit ? (
                      <span className="text-white text-xs px-2 py-0.5 rounded font-medium bg-white/20">
                        EDIT MODE
                      </span>
                    ) : (
                      <span className="text-white/80 text-xs px-2 py-0.5 font-medium">
                        TEMPLATE SETUP
                      </span>
                    )
                  }
                />

                <div className="p-4 sm:p-5 space-y-4">
                  {/* TITLE */}
                  <div>
                    <FieldLabel>Title</FieldLabel>
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, title: e.target.value }))
                      }
                      placeholder="Enter template title (e.g. Booking Acknowledgment)"
                      className={inputClass}
                    />
                  </div>

                  {/* ROW: WHATSAPP IDENTIFIER & TEMPLATE NAME */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* WHATSAPP IDENTIFIER * */}
                    <div>
                      <FieldLabel required>WhatsApp Identifier</FieldLabel>
                      <CommonDropdown
                        value={form.whatsappIdentifier}
                        options={WHATSAPP_IDENTIFIER_OPTIONS}
                        onChange={(val) => {
                          setForm((prev) => ({
                            ...prev,
                            whatsappIdentifier: val,
                          }));
                          if (errors.whatsappIdentifier) {
                            setErrors((prev) => ({
                              ...prev,
                              whatsappIdentifier: "",
                            }));
                          }
                        }}
                        placeholder="Select Identifier..."
                      />
                      <FieldError message={errors.whatsappIdentifier} />
                    </div>

                    {/* TEMPLATE NAME */}
                    <div>
                      <FieldLabel>Template Name</FieldLabel>
                      <input
                        type="text"
                        value={form.templateName}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            templateName: e.target.value,
                          }))
                        }
                        placeholder="e.g. axc_booking_alert_v1"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  {/* SMS CONTENT * */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <FieldLabel required>SMS Content</FieldLabel>
                      <span className="text-[11px] text-gray-400">
                        {form.smsContent.length} characters
                      </span>
                    </div>
                    <textarea
                      ref={smsTextareaRef}
                      rows={6}
                      value={form.smsContent}
                      onChange={(e) => {
                        setForm((prev) => ({
                          ...prev,
                          smsContent: e.target.value,
                        }));
                        if (errors.smsContent) {
                          setErrors((prev) => ({ ...prev, smsContent: "" }));
                        }
                      }}
                      placeholder="Dear {{customer_name}}, your shipment with AWB {{awb_number}} is currently {{current_status}}..."
                      className="w-full rounded-md border border-axc-border px-3 py-2.5 text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-axc-navy focus:border-axc-navy font-sans leading-relaxed transition resize-y"
                    />
                    <FieldError message={errors.smsContent} />
                    <p className="text-[11px] text-gray-500 mt-1 italic">
                      💡 Tip: Click <b>+ Insert</b> on any token from the AWB
                      Related Values table below to append it here.
                    </p>
                  </div>
                </div>
              </div>

              {/* ──────────────── CARD 2: WHATSAPP VARIABLES ──────────────── */}
              <div className="bg-white rounded-lg border border-axc-border shadow-sm overflow-hidden flex flex-col w-full">
                <PanelHeader
                  title="Whatsapp variables"
                  right={
                    <span className="text-white text-xs px-2 py-0.5 rounded font-medium bg-white/20">
                      {form.variables.length}{" "}
                      {form.variables.length === 1 ? "VARIABLE" : "VARIABLES"}
                    </span>
                  }
                />

                <div className="p-4 sm:p-5 flex flex-col gap-4">
                  <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="w-full text-left text-xs text-gray-700">
                      <thead className="bg-[#f8f9fa] border-b border-gray-200 text-gray-700 uppercase font-bold text-[11px] tracking-wide">
                        <tr>
                          <th className="py-2.5 px-3 min-w-[130px]">Variable</th>
                          <th className="py-2.5 px-3 min-w-[190px]">
                            Value Extractor
                          </th>
                          <th className="py-2.5 px-3 text-center w-24 whitespace-nowrap">
                            Is Button?
                          </th>
                          <th className="py-2.5 px-3 text-center w-16">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 bg-white">
                        {form.variables.map((row, idx) => (
                          <tr
                            key={row.id}
                            className="hover:bg-gray-50/60 transition-colors"
                          >
                            {/* VARIABLE */}
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={row.variable}
                                onChange={(e) =>
                                  handleVariableChange(
                                    idx,
                                    "variable",
                                    e.target.value.toUpperCase()
                                  )
                                }
                                placeholder="VAR#"
                                className="w-full rounded border border-gray-300 px-2.5 py-1.5 text-xs font-mono font-medium text-gray-800 focus:outline-none focus:border-axc-navy focus:ring-1 focus:ring-axc-navy"
                              />
                            </td>

                            {/* VALUE EXTRACTOR */}
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={row.valueExtractor}
                                onChange={(e) =>
                                  handleVariableChange(
                                    idx,
                                    "valueExtractor",
                                    e.target.value
                                  )
                                }
                                placeholder="{{awb_number}} or field name"
                                className="w-full rounded border border-gray-300 px-2.5 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-axc-navy focus:ring-1 focus:ring-axc-navy font-mono"
                              />
                            </td>

                            {/* IS BUTTON? */}
                            <td className="py-2 px-3 text-center">
                              <input
                                type="checkbox"
                                checked={row.isButton}
                                onChange={(e) =>
                                  handleVariableChange(
                                    idx,
                                    "isButton",
                                    e.target.checked
                                  )
                                }
                                className="h-4 w-4 rounded accent-axc-navy cursor-pointer"
                              />
                            </td>

                            {/* ACTION (DELETE ROW) */}
                            <td className="py-2 px-3 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveVariable(idx)}
                                className="text-red-500 hover:text-red-700 transition cursor-pointer p-1 rounded hover:bg-red-50"
                                title="Remove variable row"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* GREEN + ADD BUTTON (EXACTLY AS IN REFERENCE IMAGE) */}
                  <div>
                    <button
                      type="button"
                      onClick={handleAddVariable}
                      className="bg-[#5bb75b] hover:bg-[#4ea24e] text-white text-xs font-semibold px-3 py-1.5 rounded flex items-center gap-1.5 transition shadow-sm cursor-pointer"
                    >
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                      ADD
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ═══════════ BOTTOM SECTION: AWB RELATED VALUES (SET AT THE END) ═══════════ */}
            <div className="bg-white rounded-lg border border-axc-border shadow-sm overflow-hidden flex flex-col w-full">
              <PanelHeader
                title="AWB related values"
                right={
                  <span className="text-white text-xs px-2 py-0.5 rounded font-medium bg-white/20">
                    {filteredAwbValues.length} TOKENS AVAILABLE
                  </span>
                }
              />

              <div className="p-4 sm:p-5 flex flex-col gap-3">
                {/* Search Filter for AWB Tokens */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs text-gray-600 font-medium">
                    Available shipment tokens that you can copy or insert
                    directly into your SMS Content or Variables:
                  </p>
                  <div className="relative w-full sm:w-72 shrink-0">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={awbSearch}
                      onChange={(e) => setAwbSearch(e.target.value)}
                      placeholder="Search AWB tokens..."
                      className="w-full pl-9 pr-3 py-1.5 text-xs rounded-md border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-axc-navy focus:ring-1 focus:ring-axc-navy transition"
                    />
                  </div>
                </div>

                {/* Tokens Table (Responsive Grid / Table) */}
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#f8f9fa] border-b border-gray-200 text-gray-700 uppercase font-bold text-[11px] tracking-wide">
                      <tr>
                        <th className="py-2.5 px-3 w-52">Token</th>
                        <th className="py-2.5 px-3 min-w-[180px]">Field Name</th>
                        <th className="py-2.5 px-3 min-w-[200px]">Example Sample</th>
                        <th className="py-2.5 px-3 text-right w-44">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {filteredAwbValues.map((item) => (
                        <tr
                          key={item.token}
                          className="hover:bg-blue-50/40 transition-colors"
                        >
                          <td className="py-2.5 px-3 font-mono">
                            <span className="font-bold text-axc-navy bg-axc-navy/5 px-2 py-0.5 rounded border border-axc-navy/15">
                              {item.token}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-medium text-gray-800">
                            {item.label}
                          </td>
                          <td className="py-2.5 px-3 text-gray-500 font-sans">
                            {item.sample}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Copy Token */}
                              <button
                                type="button"
                                onClick={() => handleCopyToken(item.token)}
                                className="px-2 py-1 rounded border border-gray-200 text-gray-600 hover:text-axc-navy hover:border-axc-navy/30 text-[11px] font-medium transition cursor-pointer flex items-center gap-1"
                                title="Copy token to clipboard"
                              >
                                {copiedToken === item.token ? (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-600" />
                                    Copied
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3" />
                                    Copy
                                  </>
                                )}
                              </button>

                              {/* Insert into SMS Content */}
                              <button
                                type="button"
                                onClick={() =>
                                  handleInsertTokenToSms(item.token)
                                }
                                className="px-2.5 py-1 rounded bg-axc-navy/10 hover:bg-axc-navy/20 text-axc-navy text-[11px] font-semibold transition cursor-pointer whitespace-nowrap"
                                title="Insert into SMS Content"
                              >
                                + Insert
                              </button>

                              {/* Add as Variable Row */}
                              <button
                                type="button"
                                onClick={() =>
                                  handleAddTokenAsVariable(item.token)
                                }
                                className="p-1 rounded text-emerald-600 hover:bg-emerald-50 transition cursor-pointer"
                                title="Add as variable in table"
                              >
                                <PlusCircle className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredAwbValues.length === 0 && (
                        <tr>
                          <td
                            colSpan={4}
                            className="text-center py-6 text-gray-400 text-xs italic"
                          >
                            No tokens match your search.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════ BOTTOM ACTION BUTTONS (EXACT AWB DESIGN) ═══════════ */}
        <div className="shrink-0 flex items-center justify-between pt-4 border-t border-gray-100 mt-2 bg-white">
          <button
            type="button"
            onClick={() => router.push("/master/whatsapp-masters")}
            className="px-5 py-2.5 rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-axc-dark-gray font-medium text-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <button
            type="button"
            onClick={() => handleSubmit()}
            disabled={loading}
            className="px-6 py-2.5 rounded-md bg-axc-navy hover:bg-axc-navy/90 text-white font-medium text-xs flex items-center gap-1.5 transition shadow-sm cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {loading ? "Saving..." : isEdit ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CreateWhatsappMasterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-full p-8 text-sm text-gray-500">
          Loading WhatsApp Master Form...
        </div>
      }
    >
      <CreateWhatsappMasterContent />
    </Suspense>
  );
}
