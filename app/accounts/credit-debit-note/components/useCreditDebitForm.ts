"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "../../../src/common/toast";
import {
  CreditDebitNoteFormData,
  CreditDebitLineItem,
  CUSTOMER_OPTIONS,
  COMPANY_OPTIONS,
  ORIGIN_HUB_OPTIONS,
  REASON_OPTIONS,
  VAT_TYPE_OPTIONS,
  createDefaultLineItem,
} from "./types";
import { AccountEntry, initialAccountData } from "../../../src/constant";

const getTodayFormatted = () => {
  const d = new Date();
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

const getCurrentTimeFormatted = () => {
  const d = new Date();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

export const defaultFormData: CreditDebitNoteFormData = {
  noteNumber: `CN-2026-${Math.floor(100 + Math.random() * 900)}`,
  editNoteNumber: false,
  date: getTodayFormatted(),
  time: getCurrentTimeFormatted(),
  type: "CREDIT NOTE",
  noteTypeKind: "GENERAL",

  customer: CUSTOMER_OPTIONS[0].value,
  customerCode: CUSTOMER_OPTIONS[0].code,
  company: COMPANY_OPTIONS[0].value,
  editCompany: false,
  againstType: "INVOICE",
  againstNumber: "",

  originHub: ORIGIN_HUB_OPTIONS[0].value,
  destinationHub: "JFK",
  againstDocDate: getTodayFormatted(),
  originalAmount: "0.00",
  adjustmentAmount: "0.00",

  taxRate: 18,
  taxAmount: 0,
  grandTotal: 0,
  roundOff: "0.00",
  currency: "PKR",
  reason: REASON_OPTIONS[0].value,
  remarks: "",
  status: "Approved",
  noteItems: [createDefaultLineItem("1")],
  csvFile: null,
  csvFileName: "",
};

export function useCreditDebitForm(editId?: string | null) {
  const router = useRouter();
  const [form, setForm] = useState<CreditDebitNoteFormData>(defaultFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = Boolean(editId);

  // Load existing note when editing
  useEffect(() => {
    if (!editId || typeof window === "undefined") return;

    try {
      const stored = localStorage.getItem("account_entries");
      const list: AccountEntry[] = stored ? JSON.parse(stored) : initialAccountData;
      const found = list.find(
        (item) => item.noteNumber.toLowerCase() === editId.toLowerCase()
      );

      if (found) {
        const custMatched = CUSTOMER_OPTIONS.find((c) => c.value === found.partyName);
        setForm({
          noteNumber: found.noteNumber,
          editNoteNumber: true,
          date: found.noteDate || getTodayFormatted(),
          time: getCurrentTimeFormatted(),
          type: found.noteType === "Debit Note" ? "DEBIT NOTE" : "CREDIT NOTE",
          noteTypeKind: found.refDocNumber && found.refDocNumber !== "GENERAL" ? "AGAINST" : "GENERAL",

          customer: found.partyName || CUSTOMER_OPTIONS[0].value,
          customerCode: found.partyCode || custMatched?.code || "",
          company:
            COMPANY_OPTIONS.find((c) => c.value === found.branch || c.value === (found as any).company)?.value ||
            COMPANY_OPTIONS[0].value,
          editCompany: true,
          againstType: found.refDocType === "AWB" ? "AWB" : "INVOICE",
          againstNumber: found.refDocNumber && found.refDocNumber !== "GENERAL" ? found.refDocNumber : "",

          originHub: "SKT",
          destinationHub: "JFK",
          againstDocDate: found.refDocDate || found.noteDate,
          originalAmount: String(found.originalAmount || 0),
          adjustmentAmount: String(found.taxableAmount || found.grandTotal || 0),

          taxRate: 18,
          taxAmount: Number(found.taxAmount) || 0,
          grandTotal: Number(found.grandTotal) || 0,
          currency: found.currency || "PKR",
          reason: found.reason || REASON_OPTIONS[0].value,
          remarks: found.remarks || "",
          status: found.status,
          items: found.items || defaultFormData.items,
          noteItems:
            (found as any).noteItems && (found as any).noteItems.length > 0
              ? (found as any).noteItems
              : [createDefaultLineItem("1")],
          roundOff: (found as any).roundOff || "0.00",
        });
      }
    } catch (e) {
      console.error("Error loading note for editing:", e);
    }
  }, [editId]);

  const updateField = (field: keyof CreditDebitNoteFormData, value: any) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };

      // Auto sync customer code when customer changes
      if (field === "customer") {
        const matched = CUSTOMER_OPTIONS.find((c) => c.value === value);
        if (matched) {
          updated.customerCode = matched.code;
        }
      }

      // Auto update note number prefix when type changes
      if (field === "type" && !prev.editNoteNumber && !isEditMode) {
        const randomSuffix = Math.floor(100 + Math.random() * 900);
        updated.noteNumber = value === "CREDIT NOTE" ? `CN-2026-${randomSuffix}` : `DN-2026-${randomSuffix}`;
      }

      // Auto calculate grandTotal if adjustmentAmount changes
      if (field === "adjustmentAmount") {
        const num = parseFloat(String(value)) || 0;
        const tax = Math.round(num * 0.18 * 100) / 100;
        updated.taxAmount = tax;
        updated.grandTotal = Math.round((num + tax) * 100) / 100;
      }

      return updated;
    });
  };

  const updateNoteItem = (
    index: number,
    field: keyof CreditDebitLineItem,
    value: any
  ) => {
    setForm((prev) => {
      const currentItems = prev.noteItems ? [...prev.noteItems] : [createDefaultLineItem("1")];
      const item = { ...currentItems[index], [field]: value };

      // If user selected VAT type, auto-populate tax rate
      if (field === "vatType") {
        const vatOpt = VAT_TYPE_OPTIONS.find((v) => v.value === value);
        if (vatOpt) {
          item.taxPercent = String(vatOpt.taxRate);
        }
      }

      // Calculation logic
      const chargW = parseFloat(String(item.chargWeight)) || 0;
      const newChgW = parseFloat(String(item.newChgWeight)) || 0;
      const weight = newChgW > 0 ? newChgW : chargW;
      const rate = parseFloat(String(item.rate)) || 0;

      let base = 0;
      if (weight > 0 && rate > 0) {
        base = weight * rate;
      } else if (rate > 0) {
        base = rate;
      }

      // If user entered FSC %, calculate FSC amount
      if (field === "fscPercent" && base > 0) {
        const pct = parseFloat(String(value)) || 0;
        item.fsc = String(Math.round(((base * pct) / 100) * 100) / 100);
      }

      const fscVal = parseFloat(String(item.fsc)) || 0;
      const taxable = base + fscVal;
      const taxPct = parseFloat(String(item.taxPercent)) || 0;
      const taxVal = Math.round(((taxable * taxPct) / 100) * 100) / 100;

      // Auto update total if not manual total edit
      if (field !== "total") {
        if (taxable > 0 || taxVal > 0) {
          item.total = (taxable + taxVal).toFixed(2);
        }
      }

      currentItems[index] = item;

      // Calculate grand totals across all items
      const sumGrand = currentItems.reduce(
        (sum, it) => sum + (parseFloat(String(it.total)) || 0),
        0
      );
      const roundedGrand = Math.round(sumGrand);
      const diffRoundOff = (roundedGrand - sumGrand).toFixed(2);

      return {
        ...prev,
        noteItems: currentItems,
        grandTotal: Math.round(sumGrand * 100) / 100,
        adjustmentAmount: String(Math.round(sumGrand * 100) / 100),
        roundOff: diffRoundOff,
      };
    });
  };

  const addNoteItem = () => {
    setForm((prev) => {
      const currentItems = prev.noteItems ? [...prev.noteItems] : [];
      return {
        ...prev,
        noteItems: [...currentItems, createDefaultLineItem()],
      };
    });
  };

  const removeNoteItem = (index: number) => {
    setForm((prev) => {
      const currentItems = prev.noteItems ? [...prev.noteItems] : [];
      if (currentItems.length <= 1) return prev;
      const filtered = currentItems.filter((_, i) => i !== index);

      const sumGrand = filtered.reduce(
        (sum, it) => sum + (parseFloat(String(it.total)) || 0),
        0
      );
      const roundedGrand = Math.round(sumGrand);
      const diffRoundOff = (roundedGrand - sumGrand).toFixed(2);

      return {
        ...prev,
        noteItems: filtered,
        grandTotal: Math.round(sumGrand * 100) / 100,
        adjustmentAmount: String(Math.round(sumGrand * 100) / 100),
        roundOff: diffRoundOff,
      };
    });
  };

  const toggleEdit = (field: "editNoteNumber" | "editCompany") => {
    setForm((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = (saveStatus?: "Draft" | "Approved" | "Pending") => {
    if (!form.noteNumber.trim()) {
      showToast({ variant: "error", message: "Please enter Note Number." });
      return;
    }
    if (!form.customer.trim()) {
      showToast({ variant: "error", message: "Please select Customer." });
      return;
    }
    if (form.noteTypeKind === "AGAINST" && !form.againstNumber.trim()) {
      showToast({ variant: "error", message: `Please enter ${form.againstType} No.` });
      return;
    }

    setIsSubmitting(true);

    try {
      const stored = localStorage.getItem("account_entries");
      const list: AccountEntry[] = stored ? JSON.parse(stored) : [...initialAccountData];

      const adjAmount = parseFloat(String(form.grandTotal || form.adjustmentAmount)) || 0;
      const taxAmt = Math.round(adjAmount * 0.18 * 100) / 100;
      const totalAmt = Math.round((adjAmount + taxAmt) * 100) / 100;

      const entryToSave: AccountEntry = {
        srNo: list.length + 1,
        noteNumber: form.noteNumber.trim(),
        noteType: form.type === "CREDIT NOTE" ? "Credit Note" : "Debit Note",
        partyType: "Customer",
        partyName: form.customer.trim(),
        partyCode: form.customerCode.trim(),
        noteDate: form.date,
        dueDate: form.date,
        refDocType: form.noteTypeKind === "AGAINST" ? form.againstType === "AWB" ? "AWB" : "Invoice" : "Direct",
        refDocNumber: form.noteTypeKind === "AGAINST" ? form.againstNumber.trim() : "GENERAL",
        refDocDate: form.againstDocDate,
        originalAmount: parseFloat(String(form.originalAmount)) || 0,
        taxableAmount: adjAmount,
        taxAmount: taxAmt,
        grandTotal: form.grandTotal || totalAmt,
        currency: form.currency || "PKR",
        reason: form.reason || "General Account Adjustment",
        status: saveStatus || form.status,
        branch: form.originHub || "Sialkot Hub",
        company: form.company || "AMERICAN XPRESS COURIER - AXC INC",
        createdBy: "ACCOUNTS TEAM",
        createdDate: `${form.date} ${form.time}`,
        remarks: form.remarks,
        items: [
          {
            id: "1",
            description: form.reason || "Adjustment",
            originalAmount: parseFloat(String(form.originalAmount)) || 0,
            revisedAmount: 0,
            adjustmentAmount: adjAmount,
            taxRate: 18,
            taxAmount: taxAmt,
            total: form.grandTotal || totalAmt,
          },
        ],
      };

      (entryToSave as any).noteItems = form.noteItems;
      (entryToSave as any).roundOff = form.roundOff;

      let updatedList: AccountEntry[];
      if (isEditMode) {
        updatedList = list.map((item) =>
          item.noteNumber.toLowerCase() === editId?.toLowerCase() ? entryToSave : item
        );
      } else {
        const exists = list.some(
          (item) => item.noteNumber.toLowerCase() === form.noteNumber.trim().toLowerCase()
        );
        if (exists) {
          entryToSave.noteNumber = `${form.noteNumber.trim()}-${Math.floor(10 + Math.random() * 90)}`;
        }
        updatedList = [entryToSave, ...list];
      }

      localStorage.setItem("account_entries", JSON.stringify(updatedList));

      showToast({
        variant: "success",
        message: `${entryToSave.noteType} ${entryToSave.noteNumber} saved successfully!`,
      });

      setTimeout(() => {
        router.push("/accounts");
      }, 500);
    } catch (e) {
      console.error("Failed to save note entry:", e);
      showToast({ variant: "error", message: "Error saving note. Please try again." });
      setIsSubmitting(false);
    }
  };

  const handleDownloadSampleCsv = () => {
    const csvContent =
      "Description,Customer Ref No,AWB No,HS Code,Invoice No,Invoice Date,Charg. Weight,New Chg. Weight,Dest. Code,Rate,FSC %,FSC,VAT Type,Tax %,Total,Remark\n" +
      "Freight Rate Adjustment,REF-001,30128763,9805,INV-2026-081,14/10/2026,12.5,10.0,JFK,450,15,675,STANDARD_18,18,6106.50,Weight discrepancy adjustment\n" +
      "Fuel Surcharge Adjustment,REF-002,30128764,9805,INV-2026-082,14/10/2026,5.0,5.0,LHR,520,10,260,STANDARD_18,18,3374.80,Fuel rebate adjustment";

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "credit_debit_note_sample.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCsvUploaded = async (file: File | null) => {
    if (!file) {
      setForm((prev) => ({
        ...prev,
        csvFile: null,
        csvFileName: "",
      }));
      return;
    }

    try {
      const text = await file.text();
      const lines = text
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean);

      if (lines.length > 1) {
        const parsedItems: CreditDebitLineItem[] = [];
        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i]
            .split(",")
            .map((c) => c.trim().replace(/^"|"$/g, ""));
          if (cols.length >= 2) {
            const newItem = createDefaultLineItem(`${Date.now()}-${i}`);
            newItem.description = cols[0] || "";
            newItem.customerRefNo = cols[1] || "";
            newItem.awbNo = cols[2] || "";
            newItem.hsCode = cols[3] || "";
            newItem.invoiceNo = cols[4] || "";
            newItem.invoiceDate = cols[5] || "";
            newItem.chargWeight = cols[6] || "";
            newItem.newChgWeight = cols[7] || "";
            newItem.destCode = cols[8] || "";
            newItem.rate = cols[9] || "";
            newItem.fscPercent = cols[10] || "";
            newItem.fsc = cols[11] || "";
            newItem.vatType = cols[12] || "STANDARD_18";
            newItem.taxPercent = cols[13] || "18";
            newItem.total = cols[14] || "";
            newItem.remark = cols[15] || "";

            // Auto calculate total if not provided
            if (
              !newItem.total &&
              (newItem.rate || newItem.newChgWeight || newItem.chargWeight)
            ) {
              const w =
                parseFloat(String(newItem.newChgWeight)) ||
                parseFloat(String(newItem.chargWeight)) ||
                0;
              const r = parseFloat(String(newItem.rate)) || 0;
              const base = w > 0 && r > 0 ? w * r : r;
              const fsc =
                parseFloat(String(newItem.fsc)) ||
                (newItem.fscPercent
                  ? (base * parseFloat(String(newItem.fscPercent))) / 100
                  : 0);
              const taxable = base + fsc;
              const tax =
                (taxable * (parseFloat(String(newItem.taxPercent)) || 0)) / 100;
              newItem.total = (taxable + tax).toFixed(2);
            }

            parsedItems.push(newItem);
          }
        }

        if (parsedItems.length > 0) {
          const sumGrand = parsedItems.reduce(
            (acc, curr) => acc + (parseFloat(String(curr.total)) || 0),
            0
          );
          const roundDiff = (Math.round(sumGrand) - sumGrand).toFixed(2);

          setForm((prev) => ({
            ...prev,
            csvFile: file,
            csvFileName: file.name,
            noteItems: parsedItems,
            grandTotal: Math.round(sumGrand * 100) / 100,
            adjustmentAmount: String(Math.round(sumGrand * 100) / 100),
            roundOff: roundDiff,
          }));

          showToast({
            variant: "success",
            message: `${parsedItems.length} items imported from CSV file!`,
          });
          return;
        }
      }

      setForm((prev) => ({
        ...prev,
        csvFile: file,
        csvFileName: file.name,
      }));
      showToast({
        variant: "success",
        message: `CSV file "${file.name}" uploaded successfully.`,
      });
    } catch (err) {
      console.error("Error reading CSV file:", err);
      setForm((prev) => ({
        ...prev,
        csvFile: file,
        csvFileName: file.name,
      }));
      showToast({
        variant: "info",
        message: `File "${file.name}" uploaded.`,
      });
    }
  };

  return {
    form,
    updateField,
    toggleEdit,
    updateNoteItem,
    addNoteItem,
    removeNoteItem,
    handleCsvUploaded,
    handleDownloadSampleCsv,
    isEditMode,
    isSubmitting,
    handleSubmit,
    router,
  };
}
