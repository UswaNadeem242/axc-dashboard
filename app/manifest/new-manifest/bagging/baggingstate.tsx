"use client";
import { useState } from "react";

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
  const [awbDetails] = useState<AwbDetailsState>(emptyAwbDetails);

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
    updateField,
    errors,
    validateRunNumber,
    bagRow,
    updateBagRow,
    weightBagRow,
    updateWeightBagRow,
    awbSummary,
    bagSummary,
    partialAwbRows,
    awbDetails,
    handleSaveBag,
    handleSaveWeightBag,
    totals,
  };
}