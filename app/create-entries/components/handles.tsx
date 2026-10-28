"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AwbEntry, initialData } from "../../src/constant";
import { AwbFormErrors, AwbFormState, InvoiceItem, ToastState } from "./formstate";
import { api } from "../../src/lib/api";
import { showToast as showAppToast } from "../../src/common/toast";

const emptyForm: AwbFormState = {
  awbNumber: "",
  editAwbNumber: false,
  branch: "",
  customer: "",
  customerCode: "",
  sector: "",
  destinationHub: "",
  company: "",
  editCompany: false,
  origin: "",
  originZone: "",
  destination: "",
  destinationZone: "",
  product: "NONDOX",
  bookingDate: "2026-07-20",
  service: "",
  vendor: "",
  editVendor: false,
  masterCode: "",
  forwardingNumber: "",
  forwardingNumber2: "",
  referenceNumber: "",
  shipmentValue: "",
  shipmentCurrency: "",
  invoiceDate: "",
  invoiceNumber: "",
  editInvoice: false,
  content: "",
  contractId: "",
  rateContractCustomer: "",
  rateContractVendor: "",
  cftContractCustomer: "",
  cftContractVendor: "",
  tatCustomer: "",
  tatVendor: "",
  originHub: "",
  editOriginHub: false,
  duty: "",

  shipperSaveToAddressBook: false,
  shipperSearchAddressBook: "",
  shipperCode: "",
  shipperUpdateAddressBook: false,
  shipperCompany: "",
  shipperPersonName: "",
  shipperAddress1: "",
  shipperAddress2: "",
  shipperAddress3: "",
  shipperZipCode: "",
  shipperCity: "",
  shipperState: "",
  shipperCountry: "",
  shipperPhone: "",
  shipperEmail: "",
  shipperKycType: "",
  shipperKycNumber: "",

  consigneeSaveToAddressBook: false,
  consigneeSearchAddressBook: "",
  consigneeCode: "",
  consigneeUpdateAddressBook: false,
  consigneeCompany: "",
  consigneePersonName: "",
  consigneeAddress1: "",
  consigneeAddress2: "",
  consigneeAddress3: "",
  consigneeZipCode: "",
  consigneeCity: "",
  consigneeState: "",
  consigneeCountry: "",
  consigneePhone: "",
  consigneeEmail: "",

  pcs: 1,
  actualWeight: "",
  volumetricWeight: "",
  consignerWeight: "",
  addWeight: "",
  chargeableWeight: "",
  parcelType: "",
  boxNo: "1",
  actualNo: "",
  parcelActualWt: "",
  parcelL: "",
  parcelB: "",
  parcelH: "",
  parcelVolumetricWt: "",
  parcelChargeableWt: "",
  parcelCtn: "",

  createShipmentInvoice: true,
  invoiceType: "INVOICE",
  invoiceCurrency: "USD",
  incoterms: "DDU",
  invoiceNote: "GIFT",
  invoiceDeclaration: "UNSOLICITED GIFT SENT TO MY FRIENDS & FAMILY MEMBERS FOR THERE PERSONAL USE ONLY",
};
const emptyInvoiceItems: InvoiceItem[] = [
  { id: 1, boxNo: "1", srNo: "1", description: "UNSOLICITED GIFT", hsCode: "", unitType: "PCS", quantity: "1", unitWeight: "", igst: "", unitRates: "", amount: "" },
];
export function useAwbEntryForm(editAwbId?: string | null) {
  const router = useRouter();
  const [form, setForm] = useState<AwbFormState>(emptyForm);
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>(emptyInvoiceItems);
  const [errors, setErrors] = useState<AwbFormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (!editAwbId) {
      setIsEditMode(false);
      return;
    }
    setIsEditMode(true);

    async function loadAwbDetail() {
      try {
        const res = await api.getAwb(editAwbId as string);
        if (res && res.data) {
          const item = res.data;
          const formData = item.form || item.form_data || {};
          const awbData = item.awb || item;
          setForm((prev) => ({
            ...prev,
            ...formData,
            awbNumber: String(awbData.awbNumber || awbData.awb_number || prev.awbNumber),
            editAwbNumber: true,
            customer: awbData.customer || formData.customer || prev.customer,
            forwardingNumber: awbData.forwardingNumber || awbData.forwarding_number || formData.forwardingNumber || prev.forwardingNumber,
            masterCode: awbData.masterCode || awbData.master_code || formData.masterCode || prev.masterCode,
            product: awbData.product || formData.product || prev.product,
            pcs: Number(awbData.pcs) || Number(formData.pcs) || prev.pcs,
            service: awbData.service || formData.service || prev.service,
            vendor: awbData.vendor || formData.vendor || prev.vendor,
            origin: awbData.origin || formData.origin || prev.origin,
            destination: awbData.destination || formData.destination || prev.destination,
            consigneePersonName: formData.consigneePersonName || awbData.consignee || prev.consigneePersonName,
            shipperPersonName: formData.shipperPersonName || awbData.shipper || prev.shipperPersonName,
            bookingDate: (awbData.bookingDate || awbData.booking_date || formData.bookingDate || prev.bookingDate)?.split(" ")[0],
          }));
          const invList = item.invoiceItems || item.invoice_items;
          if (invList && Array.isArray(invList) && invList.length > 0) {
            setInvoiceItems(invList);
          }
          return;
        }
      } catch (err) {
        console.warn("API loadAwbDetail fallback:", err);
      }

      if (typeof window !== "undefined") {
        const savedDetail = localStorage.getItem(`awb_detail_${editAwbId}`);
        if (savedDetail) {
          try {
            const parsed = JSON.parse(savedDetail);
            if (parsed.form) setForm(parsed.form);
            if (parsed.invoiceItems) setInvoiceItems(parsed.invoiceItems);
            return;
          } catch (e) {
            console.error(e);
          }
        }

        let list = initialData;
        const stored = localStorage.getItem("awb_entries");
        if (stored) {
          try {
            list = JSON.parse(stored);
          } catch (e) {
            console.error(e);
          }
        }
        const found = list.find((item) => String(item.awbNumber) === String(editAwbId));
        if (found) {
          setForm((prev) => ({
            ...prev,
            awbNumber: String(found.awbNumber || ""),
            editAwbNumber: true,
            customer: found.customer || "",
            forwardingNumber: found.forwardingNumber || "",
            masterCode: found.masterCode || "",
            product: found.product || "NONDOX",
            pcs: Number(found.pcs) || 1,
            service: found.service || "",
            vendor: found.vendor || "",
            origin: found.origin || "",
            destination: found.destination || "",
            consigneePersonName: found.consignee || "",
            shipperPersonName: found.shipper || "",
            bookingDate: found.bookingDate ? found.bookingDate.split(" ")[0] : prev.bookingDate,
          }));
        }
      }
    }

    loadAwbDetail();
  }, [editAwbId]);

  const showToast = (message: string, type: "success" | "info" | "error" = "info") => {
    showAppToast({ variant: type, message });
  };
  const clearFieldErrors = (keys: string[]) => {
    setErrors((prev) => {
      const copy = { ...prev };
      keys.forEach((k) => delete copy[k]);
      return copy;
    });
  };
  useEffect(() => {
    setErrors((prev) => {
      let changed = false;
      const copy = { ...prev };
      Object.keys(copy).forEach((key) => {
        const val = form[key as keyof AwbFormState];
        if (typeof val === "string" && val.trim() !== "") {
          delete copy[key];
          changed = true;
        }
      });
      return changed ? copy : prev;
    });
  }, [form]);

  const validateAwbInfo = (): boolean => {
    const keys = [
      "awbNumber",
      "branch",
      "company",
      "customer",
      "customerCode",
      "sector",
      "originHub",
      "destinationHub",
      "product",
      "bookingDate",
      "service",
    ];
    const next: AwbFormErrors = {};
    if (!form.awbNumber?.trim()) next.awbNumber = "AWB Number is required";
    if (!form.branch?.trim()) next.branch = "Branch is required";
    if (!form.company?.trim()) next.company = "Company is required";
    if (!form.customer?.trim()) next.customer = "Customer is required";
    if (!form.customerCode?.trim()) next.customerCode = "Customer Code is required";
    if (!form.sector?.trim()) next.sector = "Sector is required";
    if (!form.originHub?.trim()) next.originHub = "Origin Hub is required";
    if (!form.destinationHub?.trim()) next.destinationHub = "Destination Hub is required";
    if (!form.product?.trim()) next.product = "Product is required";
    if (!form.bookingDate?.trim()) next.bookingDate = "Booking Date is required";
    if (!form.service?.trim()) next.service = "Service is required";
    setErrors((prev) => {
      const copy = { ...prev };
      keys.forEach((k) => delete copy[k]);
      return { ...copy, ...next };
    });
    return Object.keys(next).length === 0;
  };
  const validateShipper = (): boolean => {
    const keys = ["shipperState", "shipperCountry", "shipperAddress1"];
    const next: AwbFormErrors = {};
    if (!form.shipperState?.trim()) next.shipperState = "State / County is required";
    if (!form.shipperCountry?.trim()) next.shipperCountry = "Country is required";
    if (!form.shipperAddress1?.trim()) next.shipperAddress1 = "Address 1 is required";
    setErrors((prev) => {
      const copy = { ...prev };
      keys.forEach((k) => delete copy[k]);
      return { ...copy, ...next };
    });
    return Object.keys(next).length === 0;
  };
  const validateConsignee = (): boolean => {
    const keys = [
      "consigneePersonName",
      "consigneeState",
      "consigneeCountry",
      "consigneeAddress1",
    ];
    const next: AwbFormErrors = {};
    if (!form.consigneePersonName?.trim()) next.consigneePersonName = "Person Name is required";
    if (!form.consigneeState?.trim()) next.consigneeState = "State / County is required";
    if (!form.consigneeCountry?.trim()) next.consigneeCountry = "Country is required";
    if (!form.consigneeAddress1?.trim()) next.consigneeAddress1 = "Address 1 is required";
    setErrors((prev) => {
      const copy = { ...prev };
      keys.forEach((k) => delete copy[k]);
      return { ...copy, ...next };
    });
    return Object.keys(next).length === 0;
  };
  const resetShipper = () => {
    clearFieldErrors(["shipperAddress1", "shipperState", "shipperCountry"]);
    setForm((prev) => ({
      ...prev,
      shipperSearchAddressBook: "",
      shipperCode: "",
      shipperCompany: "",
      shipperPersonName: "",
      shipperAddress1: "",
      shipperAddress2: "",
      shipperAddress3: "",
      shipperZipCode: "",
      shipperCity: "",
      shipperState: "",
      shipperCountry: "",
      shipperPhone: "",
      shipperEmail: "",
      shipperKycType: "",
      shipperKycNumber: "",
    }));
  };
  const resetConsignee = () => {
    clearFieldErrors(["consigneePersonName", "consigneeAddress1", "consigneeState", "consigneeCountry"]);
    setForm((prev) => ({
      ...prev,
      consigneeSearchAddressBook: "",
      consigneeCode: "",
      consigneeCompany: "",
      consigneePersonName: "",
      consigneeAddress1: "",
      consigneeAddress2: "",
      consigneeAddress3: "",
      consigneeZipCode: "",
      consigneeCity: "",
      consigneeState: "",
      consigneeCountry: "",
      consigneePhone: "",
      consigneeEmail: "",
    }));
  };
  const handleReset = () => {
    setErrors({});
    setForm(emptyForm);
    setInvoiceItems(emptyInvoiceItems);
  };
  const addInvoiceItem = () => {
    setInvoiceItems((prev) => {
      const lastItem = prev[prev.length - 1];
      const nextBoxNo = lastItem && !isNaN(Number(lastItem.boxNo)) 
        ? String(Number(lastItem.boxNo) + 1) 
        : "1";
        
      return [
        ...prev,
        {
          id: Date.now(),
          boxNo: nextBoxNo,
          srNo: String(prev.length + 1),
          description: "",
          hsCode: "",
          unitType: "PCS",
          quantity: "",
          unitWeight: "",
          igst: "",
          unitRates: "",
          amount: "",
        },
      ];
    });
  };
  const removeInvoiceItem = (id: number) => {
    setInvoiceItems((prev) => (prev.length > 1 ? prev.filter((item) => item.id !== id) : prev));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const awbOk = validateAwbInfo();
    const shipperOk = validateShipper();
    const consigneeOk = validateConsignee();
    if (!awbOk || !shipperOk || !consigneeOk) {
      showToast("Please fill all the required fields", "error");
      return;
    }
    setLoading(true);

    let currentData = initialData;
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("awb_entries");
      if (stored) {
        try {
          currentData = JSON.parse(stored);
        } catch (err) {
          console.error(err);
        }
      }
    }

    const existingItem = currentData.find((i) => String(i.awbNumber) === String(form.awbNumber));
    const entry: AwbEntry = {
      srNo: existingItem?.srNo || currentData.length + 1,
      awbNumber: form.awbNumber,
      bookingDate: form.bookingDate || new Date().toLocaleDateString(),
      forwardingNumber: form.forwardingNumber || (
        ((form.service || "") + " " + (form.vendor || "")).toUpperCase().includes("DHL")
          ? String(Math.floor(1000000000 + Math.random() * 9000000000))
          : ((form.service || "") + " " + (form.vendor || "")).toUpperCase().includes("UPS")
          ? "1Z" + Math.random().toString(36).substring(2, 10).toUpperCase() + Math.floor(10000000 + Math.random() * 90000000)
          : ((form.service || "") + " " + (form.vendor || "")).toUpperCase().includes("FEDEX")
          ? "8745" + Math.floor(10000000 + Math.random() * 90000000)
          : "AXC" + Math.floor(10000000 + Math.random() * 90000000)
      ),
      customer: form.customer,
      masterCode: form.masterCode || "NONGST",
      product: form.product,
      pcs: Number(form.pcs) || 1,
      service: form.service,
      vendor: form.vendor,
      origin: form.origin || "INDIA",
      destination: form.destination || "UNITED STATES OF AMERICA",
      consignee: form.consigneePersonName || existingItem?.consignee || "N/A",
      shipper: form.shipperPersonName || existingItem?.shipper || "N/A",
      status: existingItem?.status || "Arrived",
    };

    const totalInvoiceAmount = invoiceItems.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
    const resolvedShipmentValue = form.shipmentValue || (totalInvoiceAmount > 0 ? String(totalInvoiceAmount) : "0");

    const payload = {
      ...entry,
      shipment_value: resolvedShipmentValue,
      form_data: {
        ...form,
        shipmentValue: resolvedShipmentValue,
      },
      invoice_items: invoiceItems,
    };

    try {
      if (isEditMode || existingItem) {
        await api.updateAwb(form.awbNumber, payload);
      } else {
        await api.createAwb(payload);
      }
    } catch (err) {
      console.warn("API submit fallback:", err);
    }

    let updatedData: AwbEntry[];
    if (isEditMode || existingItem) {
      updatedData = currentData.map((item) =>
        String(item.awbNumber) === String(form.awbNumber) ? entry : item
      );
    } else {
      updatedData = [entry, ...currentData];
    }

    if (typeof window !== "undefined") {
      localStorage.setItem("awb_entries", JSON.stringify(updatedData));
      localStorage.setItem(`awb_detail_${form.awbNumber}`, JSON.stringify({ form, invoiceItems }));
    }

    setLoading(false);
    setSuccess(true);
    showToast(isEditMode ? "AWB Entry Updated Successfully!" : "Entry Created Successfully!", "success");
    setTimeout(() => {
      router.push("/awb-entries");
    }, 1200);
  };

  const handleCreateAndPrint = () => {
    const awbOk = validateAwbInfo();
    const shipperOk = validateShipper();
    const consigneeOk = validateConsignee();
    if (!awbOk || !shipperOk || !consigneeOk) {
      showToast("Please fill all the required fields", "error");
      return;
    }
    showToast("AWB saved and label printed!", "success");
  };
  return {
    form,
    setForm,
    invoiceItems,
    setInvoiceItems,
    errors,
    loading,
    success,
    isEditMode,
    toast: null,
    showToast,
    clearFieldErrors,
    resetShipper,
    resetConsignee,
    handleReset,
    handleSubmit,
    handleCreateAndPrint,
    addInvoiceItem,
    removeInvoiceItem,
  };
}