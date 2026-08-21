"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AwbEntry } from "../../src/constant";
import { AwbFormErrors, AwbFormState, InvoiceItem, ToastState } from "./formstate";
const initialData: AwbEntry[] = [
  {
    srNo: 1,
    awbNumber: "30128763",
    bookingDate: "20/07/2026 3:54:47 PM",
    forwardingNumber: "874600062650",
    customer: "ELS INDIA",
    masterCode: "NONGST",
    product: "NONDOX",
    pcs: 1,
    service: "FEDEX IP EX NEW YORK - INDIA",
    vendor: "FEDEX IP EX NEW YORK - INDIA 210588750",
    origin: "INDIA",
    destination: "UNITED STATES OF AMERICA",
    consignee: "RAJBHIHAI PATEL",
    shipper: "MEHULBHAI BALDEVBHAI RAVAL",
    status: "Arrived",
  },
  {
    srNo: 2,
    awbNumber: "30593993",
    bookingDate: "20/07/2026 3:32:16 PM",
    forwardingNumber: "874599310837",
    customer: "ELS INDIA",
    masterCode: "NONGST",
    product: "NONDOX",
    pcs: 1,
    service: "FEDEX IP EX NEW YORK - INDIA",
    vendor: "FEDEX IP EX NEW YORK - INDIA 210588750",
    origin: "INDIA",
    destination: "UNITED STATES OF AMERICA",
    consignee: "UTSAV VAGHANI",
    shipper: "VAGHANI KRISHNABEN SHAILESHBHAI",
    status: "Arrived",
  },
  {
    srNo: 3,
    awbNumber: "30621342",
    bookingDate: "20/07/2026 3:28:52 PM",
    forwardingNumber: "874599181710",
    customer: "ELS INDIA",
    masterCode: "NONGST",
    product: "NONDOX",
    pcs: 1,
    service: "FEDEX IP EX NEW YORK - INDIA",
    vendor: "FEDEX IP EX NEW YORK - INDIA 210588750",
    origin: "INDIA",
    destination: "UNITED STATES OF AMERICA",
    consignee: "SRIRAM IYER",
    shipper: "SRIRAM IYER",
    status: "Arrived",
  },
  {
    srNo: 4,
    awbNumber: "30575099",
    bookingDate: "20/07/2026 3:22:55 PM",
    forwardingNumber: "874599003859",
    customer: "ELS INDIA",
    masterCode: "NONGST",
    product: "NONDOX",
    pcs: 1,
    service: "FEDEX IP EX NEW YORK - INDIA",
    vendor: "FEDEX IP EX NEW YORK - INDIA 210588750",
    origin: "INDIA",
    destination: "UNITED STATES OF AMERICA",
    consignee: "KIRANMAYI VEMURI",
    shipper: "SAVANI HIRAL NILESHBHAI",
    status: "Arrived",
  },
  {
    srNo: 5,
    awbNumber: "31151195",
    bookingDate: "20/07/2026 3:21:11 PM",
    forwardingNumber: "874598955475",
    customer: "ELS INDIA",
    masterCode: "NONGST",
    product: "NONDOX",
    pcs: 1,
    service: "FEDEX IP EX NEW YORK - INDIA",
    vendor: "FEDEX IP EX NEW YORK - INDIA 210588750",
    origin: "INDIA",
    destination: "UNITED STATES OF AMERICA",
    consignee: "NIL PATEL",
    shipper: "PATEL ATUL",
    status: "Arrived",
  },
  {
    srNo: 6,
    awbNumber: "30519927",
    bookingDate: "20/07/2026 3:20:21 PM",
    forwardingNumber: "874598924947",
    customer: "ELS INDIA",
    masterCode: "NONGST",
    product: "NONDOX",
    pcs: 1,
    service: "FEDEX IP EX NEW YORK - INDIA",
    vendor: "FEDEX IP EX NEW YORK - INDIA 210588750",
    origin: "INDIA",
    destination: "UNITED STATES OF AMERICA",
    consignee: "SAIPRIYA KARNE",
    shipper: "JASANI NITINBHAI RADHUBHAI",
    status: "Arrived",
  },
  {
    srNo: 7,
    awbNumber: "30168756",
    bookingDate: "20/07/2026 3:18:57 PM",
    forwardingNumber: "874598888781",
    customer: "ELS INDIA",
    masterCode: "NONGST",
    product: "NONDOX",
    pcs: 1,
    service: "FEDEX IP EX NEW YORK - INDIA",
    vendor: "FEDEX IP EX NEW YORK - INDIA 210588750",
    origin: "INDIA",
    destination: "UNITED STATES OF AMERICA",
    consignee: "VIJAYKUMAR K DAVE",
    shipper: "AMIBEN KRISHNAKANT DAVE",
    status: "On Time",
  },
];

const emptyForm: AwbFormState = {
  awbNumber: "",
  editAwbNumber: false,
  customer: "",
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
  boxNo: "1",
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
  { id: 1, boxNo: "Select...", srNo: "1", description: "UNSOLICITED GIFT", hsCode: "", unitType: "PCS", quantity: "1", unitWeight: "", igst: "", unitRates: "", amount: "" },
];
export function useAwbEntryForm() {
  const router = useRouter();
  const [form, setForm] = useState<AwbFormState>(emptyForm);
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>(emptyInvoiceItems);
  const [errors, setErrors] = useState<AwbFormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const showToast = (message: string, type: "success" | "info" = "info") => {
    setToast({ message, type });
    window.clearTimeout((showToast as any)._t);
    (showToast as any)._t = window.setTimeout(() => setToast(null), 2600);
  };
  const clearFieldErrors = (keys: string[]) => {
    setErrors((prev) => {
      const copy = { ...prev };
      keys.forEach((k) => delete copy[k]);
      return copy;
    });
  };
  const validateAwbInfo = (): boolean => {
    const keys = ["awbNumber", "customer", "origin", "destination"];
    const next: AwbFormErrors = {};
    if (!form.awbNumber?.trim()) next.awbNumber = "AWB Number is required";
    if (!form.customer?.trim()) next.customer = "Customer is required";
    if (!form.origin?.trim()) next.origin = "Origin is required";
    if (!form.destination?.trim()) next.destination = "Destination is required";
    setErrors((prev) => {
      const copy = { ...prev };
      keys.forEach((k) => delete copy[k]);
      return { ...copy, ...next };
    });
    return Object.keys(next).length === 0;
  };
  const validateShipper = (): boolean => {
    const keys = ["shipperAddress1", "shipperState", "shipperCountry"];
    const next: AwbFormErrors = {};
    if (!form.shipperAddress1?.trim()) next.shipperAddress1 = "Address 1 is required";
    if (!form.shipperState?.trim()) next.shipperState = "State / County is required";
    if (!form.shipperCountry?.trim()) next.shipperCountry = "Country is required";
    setErrors((prev) => {
      const copy = { ...prev };
      keys.forEach((k) => delete copy[k]);
      return { ...copy, ...next };
    });
    return Object.keys(next).length === 0;
  };
  const validateConsignee = (): boolean => {
    const keys = ["consigneePersonName", "consigneeAddress1", "consigneeState", "consigneeCountry"];
    const next: AwbFormErrors = {};
    if (!form.consigneePersonName?.trim()) next.consigneePersonName = "Person Name is required";
    if (!form.consigneeAddress1?.trim()) next.consigneeAddress1 = "Address 1 is required";
    if (!form.consigneeState?.trim()) next.consigneeState = "State / County is required";
    if (!form.consigneeCountry?.trim()) next.consigneeCountry = "Country is required";
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
    setInvoiceItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        boxNo: "Select...",
        srNo: String(prev.length + 1),
        description: "",
        hsCode: "",
        unitType: "Select...",
        quantity: "",
        unitWeight: "",
        igst: "",
        unitRates: "",
        amount: "",
      },
    ]);
  };
  const removeInvoiceItem = (id: number) => {
    setInvoiceItems((prev) => (prev.length > 1 ? prev.filter((item) => item.id !== id) : prev));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const awbOk = validateAwbInfo();
    const shipperOk = validateShipper();
    const consigneeOk = validateConsignee();
    if (!awbOk || !shipperOk || !consigneeOk) {
      showToast("Please fill all the required fields");
      return;
    }
    setLoading(true);
    setTimeout(() => {
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
      const newEntry: AwbEntry = {
        srNo: currentData.length + 1,
        awbNumber: form.awbNumber,
        bookingDate: form.bookingDate ? new Date(form.bookingDate).toLocaleDateString() : new Date().toLocaleString(),
        forwardingNumber: form.forwardingNumber || "8745" + Math.floor(10000000 + Math.random() * 90000000),
        customer: form.customer,
        masterCode: form.masterCode || "NONGST",
        product: form.product,
        pcs: Number(form.pcs),
        service: form.service,
        vendor: form.vendor,
        origin: form.origin,
        destination: form.destination,
        consignee: form.consigneePersonName || "N/A",
        shipper: form.shipperPersonName || "N/A",
        status: "Arrived",
      };

      const updatedData = [newEntry, ...currentData];
      if (typeof window !== "undefined") {
        localStorage.setItem("awb_entries", JSON.stringify(updatedData));
      }

      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        router.push("/awb-entries");
      }, 1500);
    }, 800);
  };

  const handleCreateAndPrint = () => {
    const awbOk = validateAwbInfo();
    const shipperOk = validateShipper();
    const consigneeOk = validateConsignee();
    if (!awbOk || !shipperOk || !consigneeOk) {
      showToast("Please fill all the required fields");
      return;
    }
    showToast("AWB created and label printed!", "success");
    handleReset();
  };
  return {
    form,
    setForm,
    invoiceItems,
    setInvoiceItems,
    errors,
    loading,
    success,
    toast,
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