"use client";
import { useEffect, useState } from "react";
import { api } from "@/app/src/lib/api";

export interface BagEntryRow {
  id: number;
  bagNo: string;
  awbNo: string;
  pcs: string;
  weight: string;
}

export interface WeightBagRow {
  bagNo: string;
  bagWeight: string;
  weight: string;
}

export interface AwbSummaryRow {
  id: number;
  awbNo: string;
  pcs: string;
  weight: string;
}

export interface BagSummaryRow {
  id: number;
  bagNo: string;
  totalPcs: string;
  totalWeight: string;
  bagWeight: string;
}

export interface PartialAwbRow {
  id: number;
  awbNumber: string;
  splitAwb: string;
  pcNumber: string;
  boxWeight: string;
}

export interface AwbDetailsState {
  contents: string;
  comments: string;
  remarks: string;
  vendorName: string;
  service: string;
  shipperName: string;
  customerName: string;
  consigneeAddress: string;
  totalValue: string;
  pcs: string;
  boxWeight: string;
  consigneeName: string;
  forwardingNo: string;
}

export interface BaggingFormState {
  runNumber: string;
  parcelWiseBagging: boolean;
  flightNo: string;
  manifestDate: string;
  origin: string;
  destination: string;
  forwarder: string;
  masterNo: string;
}

export type BaggingFormErrors = Partial<Record<"runNumber", string>>;

const emptyForm: BaggingFormState = {
  runNumber: "",
  parcelWiseBagging: false,
  flightNo: "",
  manifestDate: "",
  origin: "",
  destination: "",
  forwarder: "",
  masterNo: "",
};

const emptyAwbDetails: AwbDetailsState = {
  contents: "",
  comments: "",
  remarks: "",
  vendorName: "",
  service: "",
  shipperName: "",
  customerName: "",
  consigneeAddress: "",
  totalValue: "",
  pcs: "",
  boxWeight: "",
  consigneeName: "",
  forwardingNo: "",
};

export function useBaggingForm() {
  const [form, setForm] = useState<BaggingFormState>(emptyForm);
  const [errors, setErrors] = useState<BaggingFormErrors>({});

  const [bagRow, setBagRow] = useState<BagEntryRow>({ id: 1, bagNo: "", awbNo: "", pcs: "", weight: "" });
  const [weightBagRow, setWeightBagRow] = useState<WeightBagRow>({ bagNo: "", bagWeight: "", weight: "" });

  const [awbSummary, setAwbSummary] = useState<AwbSummaryRow[]>([]);
  const [bagSummary, setBagSummary] = useState<BagSummaryRow[]>([]);
  const [partialAwbRows] = useState<PartialAwbRow[]>([]);
  const [awbDetails, setAwbDetails] = useState<AwbDetailsState>(emptyAwbDetails);

  // Auto-lookup AWB details when bagRow.awbNo is typed
  useEffect(() => {
    const awbNo = bagRow.awbNo?.trim();
    if (!awbNo || awbNo.length < 3) return;
    let mounted = true;
    const timer = setTimeout(async () => {
      try {
        const res = await api.getAwb(awbNo);
        const d = res?.data;
        if (d && mounted) {
          setAwbDetails({
            contents: d.content || "Courier Shipment",
            comments: d.invoiceNote || "",
            remarks: d.invoiceDeclaration || "",
            vendorName: d.vendor || "",
            service: d.service || "",
            shipperName: d.shipperPersonName || d.shipper || "",
            customerName: d.customer || "",
            consigneeAddress: [d.consigneeAddress1, d.consigneeCity, d.consigneeCountry].filter(Boolean).join(", "),
            totalValue: `${d.shipmentCurrency || "USD"} ${d.shipmentValue || "0.00"}`,
            pcs: String(d.pcs || "1"),
            boxWeight: String(d.chargeableWeight || d.actualWeight || "1.00"),
            consigneeName: d.consigneePersonName || d.consignee || "",
            forwardingNo: d.forwardingNumber || "",
          });
          setBagRow((prev) => ({
            ...prev,
            pcs: prev.pcs || String(d.pcs || "1"),
            weight: prev.weight || String(d.chargeableWeight || d.actualWeight || "1.00"),
          }));
          return;
        }
      } catch {}

      if (typeof window !== "undefined") {
        try {
          const stored = localStorage.getItem("awb_entries");
          if (stored) {
            const list = JSON.parse(stored);
            const found = list.find((a: any) => String(a.awbNumber).trim() === awbNo);
            if (found && mounted) {
              setAwbDetails((prev) => ({
                ...prev,
                vendorName: found.vendor || "",
                service: found.service || "",
                shipperName: found.shipper || "",
                customerName: found.customer || "",
                consigneeAddress: found.destination || "",
                pcs: String(found.pcs || "1"),
                consigneeName: found.consignee || "",
                forwardingNo: found.forwardingNumber || "",
              }));
              setBagRow((prev) => ({
                ...prev,
                pcs: prev.pcs || String(found.pcs || "1"),
              }));
            }
          }
        } catch {}
      }
    }, 300);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [bagRow.awbNo]);

  const updateField = <K extends keyof BaggingFormState>(key: K, value: BaggingFormState[K]) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "parcelWiseBagging" && value === true) {
        setBagRow((row) => ({ ...row, pcs: "" }));
      }
      return next;
    });
  };

  const updateBagRow = <K extends keyof BagEntryRow>(key: K, value: BagEntryRow[K]) => {
    setBagRow((prev) => ({ ...prev, [key]: value }));
  };

  const updateWeightBagRow = <K extends keyof WeightBagRow>(key: K, value: WeightBagRow[K]) => {
    setWeightBagRow((prev) => ({ ...prev, [key]: value }));
  };

  const validateRunNumber = (): boolean => {
    const next: BaggingFormErrors = {};
    if (!form.runNumber?.trim()) next.runNumber = "Run Number is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSaveBag = () => {
    if (!bagRow.bagNo?.trim() || !bagRow.awbNo?.trim()) return;
    setAwbSummary((prev) => [...prev, { id: Date.now(), awbNo: bagRow.awbNo, pcs: bagRow.pcs, weight: bagRow.weight }]);
    setBagSummary((prev) => [
      ...prev,
      { id: Date.now() + 1, bagNo: bagRow.bagNo, totalPcs: bagRow.pcs, totalWeight: bagRow.weight, bagWeight: "" },
    ]);
    setBagRow({ id: Date.now(), bagNo: "", awbNo: "", pcs: "", weight: "" });
  };

  const handleSaveWeightBag = () => {
    if (!weightBagRow.bagNo?.trim()) return;
    setBagSummary((prev) =>
      prev.map((row) =>
        row.bagNo === weightBagRow.bagNo
          ? { ...row, bagWeight: weightBagRow.bagWeight, totalWeight: weightBagRow.weight }
          : row
      )
    );
    setWeightBagRow({ bagNo: "", bagWeight: "", weight: "" });
  };

  const totals = {
    totalBag: bagSummary.length,
    totalAwb: awbSummary.length,
    totalPcs: awbSummary.reduce((acc, row) => acc + Number(row.pcs || 0), 0),
    totalWeight: awbSummary.reduce((acc, row) => acc + Number(row.weight || 0), 0),
    totalBagWeight: bagSummary.reduce((acc, row) => acc + Number(row.bagWeight || 0), 0),
  };

  return {
    form,
    setForm,
    updateField,
    errors,
    validateRunNumber,
    bagRow,
    updateBagRow,
    weightBagRow,
    updateWeightBagRow,
    awbSummary,
    setAwbSummary,
    bagSummary,
    setBagSummary,
    partialAwbRows,
    awbDetails,
    handleSaveBag,
    handleSaveWeightBag,
    totals,
  };
}