"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, CheckCircle, RotateCcw } from "lucide-react";
import Link from "next/link";
import { AwbEntry } from "../src/constant";
import CommonTabs, { TabItem } from "../src/common/tabs";
import CommonDropdown from "../src/common/dropdown";
import { User, ChevronDown } from "lucide-react";

const inputClass = "border border-axc-gray rounded px-2 py-3 outline-none";

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

export default function CreateEntriesPage() {
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("awb-details");
  const [awbSubTab, setAwbSubTab] = useState("awb-info");

  const awbSubTabs: TabItem[] = [
    { id: "awb-info", label: "AWB Information" },
    { id: "shipper", label: "Shipper / Consignor / From" },
    { id: "consignee", label: "Consignee / Receiver / To" },
  ];

  const validateAwbInfo = (): boolean => {
    if (!form.awbNumber?.trim()) {
      alert("AWB NUMBER is required");
      return false;
    }
    if (!form.customer?.trim()) {
      alert("CUSTOMER is required");
      return false;
    }
    if (!form.origin?.trim()) {
      alert("ORIGIN is required");
      return false;
    }
    if (!form.destination?.trim()) {
      alert("DESTINATION is required");
      return false;
    }
    return true;
  };

  const validateShipper = (): boolean => {
    if (!form.shipperAddress1?.trim()) {
      alert("Shipper ADDRESS 1 is required");
      return false;
    }
    if (!form.shipperState?.trim()) {
      alert("Shipper STATE / COUNTY is required");
      return false;
    }
    if (!form.shipperCountry?.trim()) {
      alert("Shipper COUNTRY is required");
      return false;
    }
    return true;
  };

  const validateConsignee = (): boolean => {
    if (!form.consigneePersonName?.trim()) {
      alert("Consignee PERSON NAME is required");
      return false;
    }
    if (!form.consigneeAddress1?.trim()) {
      alert("Consignee ADDRESS 1 is required");
      return false;
    }
    if (!form.consigneeState?.trim()) {
      alert("Consignee STATE / COUNTY is required");
      return false;
    }
    if (!form.consigneeCountry?.trim()) {
      alert("Consignee COUNTRY is required");
      return false;
    }
    return true;
  };

  const handleSubTabChange = (targetTab: string) => {
    // Going forward from awb-info requires validating awb-info
    if (awbSubTab === "awb-info" && (targetTab === "shipper" || targetTab === "consignee")) {
      if (!validateAwbInfo()) return;
    }

    // Going forward from shipper to consignee requires validating shipper
    if (awbSubTab === "shipper" && targetTab === "consignee") {
      if (!validateShipper()) return;
    }

    // Going from awb-info to consignee directly requires validating both awb-info and shipper
    if (awbSubTab === "awb-info" && targetTab === "consignee") {
      if (!validateAwbInfo()) return;
      if (!validateShipper()) return;
    }

    setAwbSubTab(targetTab);
  };

  const tabs: TabItem[] = [
    {
      id: "awb-details",
      label: "AWB Details",
      icon: <User size={14} />,
    },
    {
      id: "sales-billing",
      label: "Sales Billing",
      icon: <span className="text-[12px] font-bold">₹</span>,
    },
    {
      id: "purchase-billing",
      label: "Purchase Billing",
      icon: <span className="text-[12px] font-bold">₹</span>,
    },
    {
      id: "extra",
      label: "Extra",
      icon: <ChevronDown size={14} />,
    },
  ];

  const [form, setForm] = useState({
    // Air Waybill Info
    awbNumber: "",
    editAwbNumber: false,
    customer: "ELS INDIA",
    company: "",
    editCompany: false,
    origin: "INDIA",
    originZone: "",
    destination: "UNITED STATES OF AMERICA",
    destinationZone: "",
    product: "NONDOX",
    bookingDate: "2026-07-20",
    service: "FEDEX IP EX NEW YORK - INDIA",
    vendor: "FEDEX IP EX NEW YORK - INDIA 210588750",
    editVendor: false,
    masterCode: "NONGST",
    forwardingNumber: "",
    forwardingNumber2: "",
    referenceNumber: "",
    shipmentValue: "",
    shipmentCurrency: "USD",
    invoiceDate: "2026-07-20",
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

    // Shipper details
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

    // Consignee details
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

    // Weights & Dimensions
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

    // Shipment Invoice
    createShipmentInvoice: true,
    invoiceType: "INVOICE",
    invoiceCurrency: "USD",
    incoterms: "DDU",
    invoiceNote: "GIFT",
    invoiceDeclaration: "UNSOLICITED GIFT SENT TO MY FRIENDS & FAMILY MEMBERS FOR THERE PERSONAL USE ONLY",
  });

  const [invoiceItems, setInvoiceItems] = useState([
    { id: 1, boxNo: "Select...", srNo: "1", description: "UNSOLICITED GIFT", hsCode: "", unitType: "PCS", quantity: "1", unitWeight: "", igst: "", unitRates: "", amount: "" }
  ]);

  const handleReset = () => {
    setForm({
      awbNumber: "",
      editAwbNumber: false,
      customer: "ELS INDIA",
      company: "",
      editCompany: false,
      origin: "INDIA",
      originZone: "",
      destination: "UNITED STATES OF AMERICA",
      destinationZone: "",
      product: "NONDOX",
      bookingDate: "2026-07-20",
      service: "FEDEX IP EX NEW YORK - INDIA",
      vendor: "FEDEX IP EX NEW YORK - INDIA 210588750",
      editVendor: false,
      masterCode: "NONGST",
      forwardingNumber: "",
      forwardingNumber2: "",
      referenceNumber: "",
      shipmentValue: "",
      shipmentCurrency: "USD",
      invoiceDate: "2026-07-20",
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
    });
    setInvoiceItems([
      { id: 1, boxNo: "Select...", srNo: "1", description: "UNSOLICITED GIFT", hsCode: "", unitType: "PCS", quantity: "1", unitWeight: "", igst: "", unitRates: "", amount: "" }
    ]);
  };

  const addInvoiceItem = () => {
    setInvoiceItems([
      ...invoiceItems,
      {
        id: Date.now(),
        boxNo: "Select...",
        srNo: String(invoiceItems.length + 1),
        description: "",
        hsCode: "",
        unitType: "Select...",
        quantity: "",
        unitWeight: "",
        igst: "",
        unitRates: "",
        amount: "",
      }
    ]);
  };

  const removeInvoiceItem = (id: number) => {
    if (invoiceItems.length > 1) {
      setInvoiceItems(invoiceItems.filter((item) => item.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.awbNumber) return;

    setLoading(true);

    // Simulate saving process
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

      // Redirect back after brief show of success toast
      setTimeout(() => {
        router.push("/awb-entries");
      }, 1500);
    }, 800);
  };

  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Header section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/awb-entries"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-white border border-axc-gray  text-gray-600 hover:bg-gray-50 transition shadow-sm"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h2 className="text-xl font-bold text-axc-navy">Create AWB Entry</h2>
            <p className="text-xs text-axc-gray  font-medium">Add a new shipment detail to your database</p>
          </div>
        </div>
      </div>

      {/* Reusable Common Tabs Component */}
      <CommonTabs tabs={tabs} activeTab={activeTab} onChangeTab={setActiveTab} />

      {/* Success notification */}
      {success && (
        <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 border border-emerald-100 p-4 text-emerald-800 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
          <div>
            <p className="text-xs font-bold">Entry Created Successfully!</p>
            <p className="text-[10px] text-emerald-600 font-medium">Redirecting you back to AWB Entries list...</p>
          </div>
        </div>
      )}

      {/* Tab Contents */}
      {activeTab === "awb-details" ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
          {/* Top Form Buttons Bar */}
          <div className="flex justify-between items-center bg-white p-4 rounded-lg border border-axc-border shadow-sm">
            <h3 className="text-sm font-bold text-axc-navy">ADD AWB</h3>
            <div className="flex gap-2">
              {awbSubTab !== "awb-info" && (
                <button
                  type="button"
                  onClick={() => {
                    if (awbSubTab === "consignee") setAwbSubTab("shipper");
                    else if (awbSubTab === "shipper") setAwbSubTab("awb-info");
                  }}
                  className="px-4 py-2 border border-axc-gray  text-gray-600 rounded-lg text-xs font-bold hover:bg-slate-50 transition"
                >
                  PREVIOUS
                </button>
              )}
              {awbSubTab !== "consignee" ? (
                <button
                  type="button"
                  onClick={() => {
                    if (awbSubTab === "awb-info") handleSubTabChange("shipper");
                    else if (awbSubTab === "shipper") handleSubTabChange("consignee");
                  }}
                  className="px-4 py-2 bg-axc-navy  hover:bg-axc-navy/80 text-white rounded-lg text-xs font-bold transition shadow-sm"
                >
                  NEXT
                </button>
              ) : (
                <>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-axc-navy  hover:bg-axc-navy/80 text-white rounded-lg text-xs font-bold transition shadow-sm"
                  >
                    CREATE AWB
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      alert("AWB created and label printed!");
                      handleReset();
                    }}
                    className="px-4 py-2 bg-[#0b733a] hover:bg-[#095f30] text-white rounded-lg text-xs font-bold transition shadow-sm"
                  >
                    CREATE AWB AND PRINT LABEL
                  </button>
                </>
              )}
            </div>
          </div>

          {/* AWB Sub-tabs */}
          <div className="w-full">
            <CommonTabs tabs={awbSubTabs} activeTab={awbSubTab} onChangeTab={handleSubTabChange} />
          </div>

          <div className="w-full">
            {awbSubTab === "awb-info" && (
              /* Column 1: AIR WAYBILL INFORMATION */
              <div className="bg-white p-5 rounded-xl border border-axc-border shadow-sm flex flex-col gap-4">
                <h4 className="text-xs font-extrabold text-axc-dark-gray capitalize tracking-wider border-b border-axc-border pb-2 flex items-center justify-between">
                  <span>AIR WAYBILL INFORMATION</span>
                  <span className="bg-axc-navy text-white text-xs px-2 py-0.5 rounded font-medium">BALANCE: WAIT...</span>
                </h4>

                <div className="flex flex-col gap-3 text-xs">
                
                  {/* AWB Number      flex flex-col gap-3 text-xs* /}
                  <div className="grid grid-cols-3 items-center gap-2">
                    <label className="font-bold text-axc-red uppercase">AWB NUMBER</label>
                    <div className="col-span-2 flex items-center gap-2">
                      <input
                        type="text"
                        required
                        value={form.awbNumber}
                        onChange={(e) => setForm({ ...form, awbNumber: e.target.value })}
                        className={`${inputClass} flex-1 bg-gray-50 focus:bg-white`}
                      />
                      <label className="flex items-center gap-1 text-[10px] text-axc-dark-gray cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.editAwbNumber}
                          onChange={(e) => setForm({ ...form, editAwbNumber: e.target.checked })}
                        /> EDIT
                      </label>
                    </div>
                  </div>

                  {/* Customer */}
                  <div className="grid grid-cols-3 items-center gap-2">
                    <label className="font-bold text-axc-red uppercase">CUSTOMER</label>
                    <input
                      type="text"
                      required
                      value={form.customer}
                      onChange={(e) => setForm({ ...form, customer: e.target.value })}
                      className={`${inputClass} col-span-2 bg-gray-50 focus:bg-white`}
                    />
                  </div>

                  {/* Company */}
                  <div className="grid grid-cols-3 items-center gap-2">
                    <label className="font-bold text-gray-600 uppercase">COMPANY</label>
                    <div className="col-span-2 flex items-center gap-2">
                      <CommonDropdown
                        value={form.company}
                        onChange={(val) => setForm({ ...form, company: val })}
                        className="flex-1 bg-gray-50 focus:bg-white"
                        placeholder="SELECT COMPANY..."
                        options={[
                          { value: "company1", label: "Company A" },
                          { value: "company2", label: "Company B" }
                        ]}
                      />
                      <label className="flex items-center gap-1 text-[10px] text-axc-dark-gray cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.editCompany}
                          onChange={(e) => setForm({ ...form, editCompany: e.target.checked })}
                        /> EDIT
                      </label>
                    </div>
                  </div>

                  {/* Origin */}
                  <div className="grid grid-cols-3 items-center gap-2">
                    <label className="font-bold text-axc-red uppercase">ORIGIN</label>
                    <div className="col-span-2 grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Origin"
                        value={form.origin}
                        onChange={(e) => setForm({ ...form, origin: e.target.value })}
                        className={inputClass}
                      />
                      <input
                        type="text"
                        placeholder="ZONE"
                        value={form.originZone}
                        onChange={(e) => setForm({ ...form, originZone: e.target.value })}
                        className={`${inputClass} bg-gray-50`}
                      />
                    </div>
                  </div>

                  {/* Destination */}
                  <div className="grid grid-cols-3 items-center gap-2">
                    <label className="font-bold text-axc-red uppercase">DESTINATION</label>
                    <div className="col-span-2 grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Destination"
                        value={form.destination}
                        onChange={(e) => setForm({ ...form, destination: e.target.value })}
                        className={inputClass}
                      />
                      <input
                        type="text"
                        placeholder="ZONE"
                        value={form.destinationZone}
                        onChange={(e) => setForm({ ...form, destinationZone: e.target.value })}
                        className={`${inputClass} bg-gray-50`}
                      />
                    </div>
                  </div>

                  {/* Product */}
                  <div className="grid grid-cols-3 items-center gap-2">
                    <label className="font-bold text-axc-red uppercase">PRODUCT</label>
                    <CommonDropdown
                      value={form.product}
                      onChange={(val) => setForm({ ...form, product: val })}
                      className="col-span-2"
                      options={[
                        { value: "NONDOX", label: "NONDOX" },
                        { value: "DOX", label: "DOX" }
                      ]}
                    />
                  </div>

                  {/* Booking Date */}
                  <div className="grid grid-cols-3 items-center gap-2">
                    <label className="font-bold text-axc-red uppercase">BOOKING DATE</label>
                    <input
                      type="date"
                      value={form.bookingDate}
                      onChange={(e) => setForm({ ...form, bookingDate: e.target.value })}
                      className={`${inputClass} col-span-2`}
                    />
                  </div>

                  {/* Service */}
                  <div className="grid grid-cols-3 items-center gap-2">
                    <label className="font-bold text-axc-red uppercase">SERVICE</label>
                    <CommonDropdown
                      value={form.service}
                      onChange={(val) => setForm({ ...form, service: val })}
                      className="col-span-2"
                      options={[
                        { value: "FEDEX IP EX NEW YORK - INDIA", label: "FEDEX IP EX NEW YORK - INDIA" },
                        { value: "FEDEX IE EX", label: "FEDEX IE EX" }
                      ]}
                    />
                  </div>

                  {/* Vendor */}
                  <div className="grid grid-cols-3 items-center gap-2">
                    <label className="font-bold text-gray-600 uppercase">VENDOR</label>
                    <div className="col-span-2 flex items-center gap-2">
                      <CommonDropdown
                        value={form.vendor}
                        onChange={(val) => setForm({ ...form, vendor: val })}
                        className="flex-1"
                        options={[
                          { value: "FEDEX IP EX NEW YORK - INDIA 210588750", label: "FEDEX IP EX NEW YORK - INDIA 210588750" }
                        ]}
                      />
                      <label className="flex items-center gap-1 text-[10px] text-axc-dark-gray cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.editVendor}
                          onChange={(e) => setForm({ ...form, editVendor: e.target.checked })}
                        /> EDIT
                      </label>
                    </div>
                  </div>

                  {/* Forwarding Numbers */}
                  <div className="grid grid-cols-3 items-center gap-2">
                    <label className="font-bold text-gray-600 uppercase">FORWARDING NUMBER</label>
                    <input
                      type="text"
                      value={form.forwardingNumber}
                      onChange={(e) => setForm({ ...form, forwardingNumber: e.target.value })}
                      className={`${inputClass} col-span-2`}
                    />
                  </div>

                  <div className="grid grid-cols-3 items-center gap-2">
                    <label className="font-bold text-gray-600 uppercase">FORWARDING NUMBER 2</label>
                    <input
                      type="text"
                      value={form.forwardingNumber2}
                      onChange={(e) => setForm({ ...form, forwardingNumber2: e.target.value })}
                      className={`${inputClass} col-span-2`}
                    />
                  </div>

                  {/* Reference Number */}
                  <div className="grid grid-cols-3 items-center gap-2">
                    <label className="font-bold text-gray-600 uppercase">REFERENCE NUMBER</label>
                    <input
                      type="text"
                      value={form.referenceNumber}
                      onChange={(e) => setForm({ ...form, referenceNumber: e.target.value })}
                      className={`${inputClass} col-span-2`}
                    />
                  </div>

                  {/* Shipment Value */}
                  <div className="grid grid-cols-3 items-center gap-2">
                    <label className="font-bold text-gray-600 uppercase">SHIPMENT VALUE</label>
                    <div className="col-span-2 grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Value"
                        value={form.shipmentValue}
                        onChange={(e) => setForm({ ...form, shipmentValue: e.target.value })}
                        className={inputClass}
                      />
                      <CommonDropdown
                      className="border-axc-border"
                        value={form.shipmentCurrency}
                        onChange={(val) => setForm({ ...form, shipmentCurrency: val })}
                        options={[
                          { value: "USD", label: "USD" },
                          { value: "INR", label: "INR" }
                        ]}
                      />
                    </div>
                  </div>

                  {/* Invoice Date & Number */}
                  <div className="grid grid-cols-3 items-center gap-2">
                    <label className="font-bold text-gray-600 uppercase">INVOICE DATE</label>
                    <div className="col-span-2 flex items-center gap-2">
                      <input
                        type="date"
                        value={form.invoiceDate}
                        onChange={(e) => setForm({ ...form, invoiceDate: e.target.value })}
                        className={`${inputClass} flex-1`}
                      />
                      <label className="flex items-center gap-1 text-[10px] text-axc-dark-gray cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.editInvoice}
                          onChange={(e) => setForm({ ...form, editInvoice: e.target.checked })}
                        /> EDIT
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 items-center gap-2">
                    <label className="font-bold text-gray-600 uppercase">INVOICE NUMBER</label>
                    <input
                      type="text"
                      value={form.invoiceNumber}
                      onChange={(e) => setForm({ ...form, invoiceNumber: e.target.value })}
                      className={`${inputClass} col-span-2`}
                    />
                  </div>

                  {/* Content */}
                  <div className="grid grid-cols-3 gap-2">
                    <label className="font-bold text-gray-600 uppercase mt-1">CONTENT</label>
                    <textarea
                      rows={2}
                      value={form.content}
                      onChange={(e) => setForm({ ...form, content: e.target.value })}
                      className={`${inputClass} col-span-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none`}
                    />
                  </div>

                  {/* Contract ID */}
                  <div className="grid grid-cols-3 items-center gap-2">
                    <label className="font-bold text-gray-600 uppercase">CONTRACT ID</label>
                    <input
                      type="text"
                      value={form.contractId}
                      onChange={(e) => setForm({ ...form, contractId: e.target.value })}
                      className={`${inputClass} col-span-2`}
                    />
                  </div>

                  {/* Rate Grid table */}
                  <div className="col-span-3 mt-2 border rounded-lg overflow-hidden">
                    <table className="w-full text-[10px] text-center border-collapse">
                      <thead>
                        <tr className="bg-gray-100 border-b">
                          <th className="py-1 border-r text-axc-dark-gray font-bold"></th>
                          <th className="py-1 border-r text-axc-dark-gray font-bold">Customer</th>
                          <th className="py-1 text-axc-dark-gray font-bold">Vendor</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-1 px-2 border-r bg-gray-50 text-left font-bold text-gray-600">RATE CONTRACT</td>
                          <td className="border-r">
                            <input
                              type="text"
                              value={form.rateContractCustomer}
                              onChange={(e) => setForm({ ...form, rateContractCustomer: e.target.value })}
                              className="w-full border-none focus:outline-none text-center py-0.5"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={form.rateContractVendor}
                              onChange={(e) => setForm({ ...form, rateContractVendor: e.target.value })}
                              className="w-full border-none focus:outline-none text-center py-0.5"
                            />
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-1 px-2 border-r bg-gray-50 text-left font-bold text-gray-600">CFT CONTRACT</td>
                          <td className="border-r">
                            <input
                              type="text"
                              value={form.cftContractCustomer}
                              onChange={(e) => setForm({ ...form, cftContractCustomer: e.target.value })}
                              className="w-full border-none focus:outline-none text-center py-0.5"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={form.cftContractVendor}
                              onChange={(e) => setForm({ ...form, cftContractVendor: e.target.value })}
                              className="w-full border-none focus:outline-none text-center py-0.5"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td className="py-1 px-2 border-r bg-gray-50 text-left font-bold text-gray-600">TAT</td>
                          <td className="border-r">
                            <input
                              type="text"
                              value={form.tatCustomer}
                              onChange={(e) => setForm({ ...form, tatCustomer: e.target.value })}
                              className="w-full border-none focus:outline-none text-center py-0.5"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={form.tatVendor}
                              onChange={(e) => setForm({ ...form, tatVendor: e.target.value })}
                              className="w-full border-none focus:outline-none text-center py-0.5"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Origin Hub */}
                  <div className="grid grid-cols-3 items-center gap-2 mt-2">
                    <label className="font-bold text-gray-600 uppercase">ORIGIN HUB</label>
                    <div className="col-span-2 flex items-center gap-2">
                      <CommonDropdown
                        value={form.originHub}
                        onChange={(val) => setForm({ ...form, originHub: val })}
                        className="flex-1"
                        placeholder="SELECT..."
                        options={[]}
                      />
                      <label className="flex items-center gap-1 text-[10px] text-axc-dark-gray cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.editOriginHub}
                          onChange={(e) => setForm({ ...form, editOriginHub: e.target.checked })}
                        /> EDIT
                      </label>
                    </div>
                  </div>

                  {/* Duty */}
                  <div className="grid grid-cols-3 items-center gap-2">
                    <label className="font-bold text-gray-600 uppercase">DUTY</label>
                    <CommonDropdown
                      value={form.duty}
                      onChange={(val) => setForm({ ...form, duty: val })}
                      className="col-span-2"
                      placeholder="SELECT..."
                      options={[]}
                    />
                  </div>
                </div>
              </div>
            )}

            {awbSubTab === "shipper" && (
              /* Column 2: SHIPPER / CONSIGNOR / FROM */
              <div className="bg-white p-5 rounded-xl border border-axc-gray  shadow-sm flex flex-col gap-4">
                <h4 className="text-xs font-extrabold text-gray-800 uppercase tracking-wider border-b pb-2 flex items-center justify-between">
                  <span>SHIPPER / CONSIGNOR / FROM</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setForm({
                        ...form,
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
                      })}
                      className="text-gray-400 hover:text-gray-600 transition"
                      title="Reset Shipper Form"
                    >
                      <RotateCcw size={14} />
                    </button>
                    <label className="flex items-center gap-1 text-[10px] text-axc-dark-gray cursor-pointer normal-case">
                      <input
                        type="checkbox"
                        checked={form.shipperSaveToAddressBook}
                        onChange={(e) => setForm({ ...form, shipperSaveToAddressBook: e.target.checked })}
                      /> SAVE TO ADDRESS BOOK?
                    </label>
                  </div>
                </h4>

                <div className="flex flex-col gap-2.5 text-xs">
                  {/* Search Address Book */}
                  <div className="grid grid-cols-3 items-center gap-2">
                    <label className="font-bold text-gray-600 uppercase">SEARCH ADDRESS BOOK</label>
                    <input
                      type="text"
                      value={form.shipperSearchAddressBook}
                      onChange={(e) => setForm({ ...form, shipperSearchAddressBook: e.target.value })}
                      className={`${inputClass} col-span-2`}
                    />
                  </div>

                  {/* Code */}
                  <div className="grid grid-cols-3 items-center gap-2">
                    <label className="font-bold text-gray-600 uppercase">CODE</label>
                    <div className="col-span-2 flex items-center gap-2">
                      <input
                        type="text"
                        value={form.shipperCode}
                        onChange={(e) => setForm({ ...form, shipperCode: e.target.value })}
                        className={`${inputClass} flex-1`}
                      />
                      <label className="flex items-center gap-1 text-[10px] text-axc-dark-gray cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.shipperUpdateAddressBook}
                          onChange={(e) => setForm({ ...form, shipperUpdateAddressBook: e.target.checked })}
                        /> UPDATE ADDRESS BOOK?
                      </label>
                    </div>
                  </div>

                  {/* Company */}
                  <div className="grid grid-cols-3 items-center gap-2">
                    <label className="font-bold text-gray-600 uppercase">COMPANY</label>
                    <input
                      type="text"
                      value={form.shipperCompany}
                      onChange={(e) => setForm({ ...form, shipperCompany: e.target.value })}
                      className={`${inputClass} col-span-2`}
                    />
                  </div>

                  {/* Person Name */}
                  <div className="grid grid-cols-3 items-center gap-2">
                    <label className="font-bold text-gray-600 uppercase">PERSON NAME</label>
                    <input
                      type="text"
                      value={form.shipperPersonName}
                      onChange={(e) => setForm({ ...form, shipperPersonName: e.target.value })}
                      className={`${inputClass} col-span-2`}
                    />
                  </div>

                  {/* Address 1 */}
                  <div className="grid grid-cols-3 items-center gap-2">
                    <label className="font-bold text-axc-red uppercase">ADDRESS 1</label>
                    <input
                      type="text"
                      required
                      value={form.shipperAddress1}
                      onChange={(e) => setForm({ ...form, shipperAddress1: e.target.value })}
                      className="col-span-2 border border-red-200 rounded px-2 py-1.5 focus:border-red-500"
                    />
                  </div>

                  {/* Address 2 */}
                  <div className="grid grid-cols-3 items-center gap-2">
                    <label className="font-bold text-gray-600 uppercase">ADDRESS 2</label>
                    <input
                      type="text"
                      value={form.shipperAddress2}
                      onChange={(e) => setForm({ ...form, shipperAddress2: e.target.value })}
                      className={`${inputClass} col-span-2`}
                    />
                  </div>

                  {/* Address 3 */}
                  <div className="grid grid-cols-3 items-center gap-2">
                    <label className="font-bold text-gray-600 uppercase">ADDRESS 3</label>
                    <input
                      type="text"
                      value={form.shipperAddress3}
                      onChange={(e) => setForm({ ...form, shipperAddress3: e.target.value })}
                      className={`${inputClass} col-span-2`}
                    />
                  </div>

                  {/* Post / Zip Code */}
                  <div className="grid grid-cols-3 items-center gap-2">
                    <label className="font-bold text-gray-600 uppercase">POST / ZIP CODE</label>
                    <div className="col-span-2 flex gap-2">
                      <input
                        type="text"
                        value={form.shipperZipCode}
                        onChange={(e) => setForm({ ...form, shipperZipCode: e.target.value })}
                        className={`${inputClass} flex-1`}
                      />
                      <button
                        type="button"
                        onClick={() => alert(`Searching zip code: ${form.shipperZipCode}`)}
                        className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded text-[10px] font-bold"
                      >
                        SEARCH
                      </button>
                    </div>
                  </div>

                  {/* City */}
                  <div className="grid grid-cols-3 items-center gap-2">
                    <label className="font-bold text-gray-600 uppercase">CITY</label>
                    <input
                      type="text"
                      value={form.shipperCity}
                      onChange={(e) => setForm({ ...form, shipperCity: e.target.value })}
                      className={`${inputClass} col-span-2`}
                    />
                  </div>

                  {/* State / County */}
                  <div className="grid grid-cols-3 items-center gap-2">
                    <label className="font-bold text-axc-red uppercase">STATE / COUNTY</label>
                    <input
                      type="text"
                      required
                      value={form.shipperState}
                      onChange={(e) => setForm({ ...form, shipperState: e.target.value })}
                      className="col-span-2 border border-red-200 rounded px-2 py-1.5 focus:border-red-500"
                    />
                  </div>

                  {/* Country */}
                  <div className="grid grid-cols-3 items-center gap-2">
                    <label className="font-bold text-axc-red uppercase">COUNTRY</label>
                    <input
                      type="text"
                      required
                      value={form.shipperCountry}
                      onChange={(e) => setForm({ ...form, shipperCountry: e.target.value })}
                      className={`${inputClass} col-span-2`}
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="grid grid-cols-3 items-center gap-2">
                    <label className="font-bold text-gray-600 uppercase">PHONE NUMBER</label>
                    <input
                      type="text"
                      value={form.shipperPhone}
                      onChange={(e) => setForm({ ...form, shipperPhone: e.target.value })}
                      className={`${inputClass} col-span-2`}
                    />
                  </div>

                  {/* Email Address */}
                  <div className="grid grid-cols-3 items-center gap-2">
                    <label className="font-bold text-gray-600 uppercase">EMAIL ADDRESS</label>
                    <input
                      type="email"
                      value={form.shipperEmail}
                      onChange={(e) => setForm({ ...form, shipperEmail: e.target.value })}
                      className={`${inputClass} col-span-2`}
                    />
                  </div>

                  {/* KYC Type */}
                  <div className="grid grid-cols-3 items-center gap-2">
                    <label className="font-bold text-gray-600 uppercase">KYC TYPE</label>
                    <CommonDropdown
                      value={form.shipperKycType}
                      onChange={(val) => setForm({ ...form, shipperKycType: val })}
                      className="col-span-2"
                      placeholder="SELECT..."
                      options={[
                        { value: "IEC", label: "IEC" },
                        { value: "GST", label: "GST" },
                        { value: "PAN", label: "PAN" }
                      ]}
                    />
                  </div>

                  {/* KYC Number */}
                  <div className="grid grid-cols-3 items-center gap-2">
                    <label className="font-bold text-gray-600 uppercase">KYC NUMBER</label>
                    <input
                      type="text"
                      value={form.shipperKycNumber}
                      onChange={(e) => setForm({ ...form, shipperKycNumber: e.target.value })}
                      className={`${inputClass} col-span-2`}
                    />
                  </div>

                  {/* Upload KYC */}
                  <div className="grid grid-cols-3 items-center gap-2">
                    <label className="font-bold text-gray-600 uppercase">UPLOAD KYC</label>
                    <input
                      type="file"
                      className="col-span-2 text-[10px]"
                      onChange={(e) => alert("KYC File uploaded!")}
                    />
                  </div>
                </div>
              </div>
            )}

            {awbSubTab === "consignee" && (
              /* Column 3: CONSIGNEE / RECEIVER / TO */
              <div className="bg-white p-5 rounded-xl border border-axc-gray  shadow-sm flex flex-col gap-4">
                <h4 className="text-xs font-extrabold text-gray-800 uppercase tracking-wider border-b pb-2 flex items-center justify-between">
                  <span>CONSIGNEE / RECEIVER / TO</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setForm({
                        ...form,
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
                      })}
                      className="text-gray-400 hover:text-gray-600 transition"
                      title="Reset Consignee Form"
                    >
                      <RotateCcw size={14} />
                    </button>
                    <label className="flex items-center gap-1 text-[10px] text-axc-dark-gray cursor-pointer normal-case">
                      <input
                        type="checkbox"
                        checked={form.consigneeSaveToAddressBook}
                        onChange={(e) => setForm({ ...form, consigneeSaveToAddressBook: e.target.checked })}
                      /> SAVE TO ADDRESS BOOK?
                    </label>
                  </div>
                </h4>

                <div className="flex flex-col gap-2.5 text-xs">
                  {/* Search Address Book */}
                  <div className="grid grid-cols-3 items-center gap-2">
                    <label className="font-bold text-gray-600 uppercase">SEARCH ADDRESS BOOK</label>
                    <input
                      type="text"
                      value={form.consigneeSearchAddressBook}
                      onChange={(e) => setForm({ ...form, consigneeSearchAddressBook: e.target.value })}
                      className={`${inputClass} col-span-2`}
                    />
                  </div>

                  {/* Code */}
                  <div className="grid grid-cols-3 items-center gap-2">
                    <label className="font-bold text-gray-600 uppercase">CODE</label>
                    <div className="col-span-2 flex items-center gap-2">
                      <input
                        type="text"
                        value={form.consigneeCode}
                        onChange={(e) => setForm({ ...form, consigneeCode: e.target.value })}
                        className={`${inputClass} flex-1`}
                      />
                      <label className="flex items-center gap-1 text-[10px] text-axc-dark-gray cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.consigneeUpdateAddressBook}
                          onChange={(e) => setForm({ ...form, consigneeUpdateAddressBook: e.target.checked })}
                        /> UPDATE ADDRESS BOOK?
                      </label>
                    </div>
                  </div>

                  {/* Company */}
                  <div className="grid grid-cols-3 items-center gap-2">
                    <label className="font-bold text-gray-600 uppercase">COMPANY</label>
                    <input
                      type="text"
                      value={form.consigneeCompany}
                      onChange={(e) => setForm({ ...form, consigneeCompany: e.target.value })}
                      className={`${inputClass} col-span-2`}
                    />
                  </div>

                  {/* Person Name */}
                  <div className="grid grid-cols-3 items-center gap-2">
                    <label className="font-bold text-axc-red uppercase">PERSON NAME</label>
                    <input
                      type="text"
                      required
                      value={form.consigneePersonName}
                      onChange={(e) => setForm({ ...form, consigneePersonName: e.target.value })}
                      className="col-span-2 border border-red-200 rounded px-2 py-1.5 focus:border-red-500"
                    />
                  </div>

                  {/* Address 1 */}
                  <div className="grid grid-cols-3 items-center gap-2">
                    <label className="font-bold text-axc-red uppercase">ADDRESS 1</label>
                    <input
                      type="text"
                      required
                      value={form.consigneeAddress1}
                      onChange={(e) => setForm({ ...form, consigneeAddress1: e.target.value })}
                      className="col-span-2 border border-red-200 rounded px-2 py-1.5 focus:border-red-500"
                    />
                  </div>

                  {/* Address 2 */}
                  <div className="grid grid-cols-3 items-center gap-2">
                    <label className="font-bold text-gray-600 uppercase">ADDRESS 2</label>
                    <input
                      type="text"
                      value={form.consigneeAddress2}
                      onChange={(e) => setForm({ ...form, consigneeAddress2: e.target.value })}
                      className={`${inputClass} col-span-2`}
                    />
                  </div>

                  {/* Address 3 */}
                  <div className="grid grid-cols-3 items-center gap-2">
                    <label className="font-bold text-gray-600 uppercase">ADDRESS 3</label>
                    <input
                      type="text"
                      value={form.consigneeAddress3}
                      onChange={(e) => setForm({ ...form, consigneeAddress3: e.target.value })}
                      className={`${inputClass} col-span-2`}
                    />
                  </div>

                  {/* Post / Zip Code */}
                  <div className="grid grid-cols-3 items-center gap-2">
                    <label className="font-bold text-gray-600 uppercase">POST / ZIP CODE</label>
                    <div className="col-span-2 flex gap-2">
                      <input
                        type="text"
                        value={form.consigneeZipCode}
                        onChange={(e) => setForm({ ...form, consigneeZipCode: e.target.value })}
                        className={`${inputClass} flex-1`}
                      />
                      <button
                        type="button"
                        onClick={() => alert(`Searching zip code: ${form.consigneeZipCode}`)}
                        className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded text-[10px] font-bold"
                      >
                        SEARCH
                      </button>
                    </div>
                  </div>

                  {/* City */}
                  <div className="grid grid-cols-3 items-center gap-2">
                    <label className="font-bold text-gray-600 uppercase">CITY</label>
                    <input
                      type="text"
                      value={form.consigneeCity}
                      onChange={(e) => setForm({ ...form, consigneeCity: e.target.value })}
                      className={`${inputClass} col-span-2`}
                    />
                  </div>

                  {/* State / County */}
                  <div className="grid grid-cols-3 items-center gap-2">
                    <label className="font-bold text-axc-red uppercase">STATE / COUNTY</label>
                    <input
                      type="text"
                      required
                      value={form.consigneeState}
                      onChange={(e) => setForm({ ...form, consigneeState: e.target.value })}
                      className="col-span-2 border border-red-200 rounded px-2 py-1.5 focus:border-red-500"
                    />
                  </div>

                  {/* Country */}
                  <div className="grid grid-cols-3 items-center gap-2">
                    <label className="font-bold text-axc-red uppercase">COUNTRY</label>
                    <input
                      type="text"
                      required
                      value={form.consigneeCountry}
                      onChange={(e) => setForm({ ...form, consigneeCountry: e.target.value })}
                      className={`${inputClass} col-span-2`}
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="grid grid-cols-3 items-center gap-2">
                    <label className="font-bold text-gray-600 uppercase">PHONE NUMBER</label>
                    <input
                      type="text"
                      value={form.consigneePhone}
                      onChange={(e) => setForm({ ...form, consigneePhone: e.target.value })}
                      className={`${inputClass} col-span-2`}
                    />
                  </div>

                  {/* Email Address */}
                  <div className="grid grid-cols-3 items-center gap-2">
                    <label className="font-bold text-gray-600 uppercase">EMAIL ADDRESS</label>
                    <input
                      type="email"
                      value={form.consigneeEmail}
                      onChange={(e) => setForm({ ...form, consigneeEmail: e.target.value })}
                      className={`${inputClass} col-span-2`}
                    />
                  </div>

                  {/* Upload Document */}
                  <div className="grid grid-cols-3 items-center gap-2 mt-1.5">
                    <label className="font-bold text-gray-600 uppercase">UPLOAD DOCUMENT</label>
                    <input
                      type="file"
                      className="col-span-2 text-[10px]"
                      onChange={(e) => alert("Consignee Document uploaded!")}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section: WEIGHTS AND DIMENSIONS */}
          <div className="bg-white p-5 rounded-xl border border-axc-border  shadow-sm flex flex-col gap-4">
            <h4 className="text-xs font-extrabold text-gray-800 uppercase tracking-wider border-b pb-2">
              WEIGHTS AND DIMENSIONS
            </h4>

            <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-xs">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-gray-600">PCS</label>
                <input
                  type="number"
                  value={form.pcs}
                  onChange={(e) => setForm({ ...form, pcs: Number(e.target.value) })}
                  className={`${inputClass} bg-gray-50`}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-bold text-gray-600">ACTUAL WEIGHT</label>
                <input
                  type="text"
                  value={form.actualWeight}
                  onChange={(e) => setForm({ ...form, actualWeight: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-bold text-gray-600">VOLUMETRIC WEIGHT</label>
                <input
                  type="text"
                  value={form.volumetricWeight}
                  onChange={(e) => setForm({ ...form, volumetricWeight: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-bold text-gray-600">CONSIGNER WEIGHT</label>
                <input
                  type="text"
                  value={form.consignerWeight}
                  onChange={(e) => setForm({ ...form, consignerWeight: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-bold text-gray-600">ADD. WEIGHT</label>
                <input
                  type="text"
                  value={form.addWeight}
                  onChange={(e) => setForm({ ...form, addWeight: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-bold text-gray-600">CHARGEABLE WEIGHT</label>
                <input
                  type="text"
                  value={form.chargeableWeight}
                  onChange={(e) => setForm({ ...form, chargeableWeight: e.target.value })}
                  className={`${inputClass} bg-gray-50`}
                />
              </div>
            </div>

            {/* Weights Details Table */}
            <div className="border rounded-lg overflow-x-auto mt-2">
              <table className="w-full text-xs text-center border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-gray-100 border-b text-[10px] text-axc-dark-gray font-bold uppercase">
                    <th className="py-2 border-r">PARCEL NO.</th>
                    <th className="py-2 border-r">BOX NO.</th>
                    <th className="py-2 border-r">ACTUAL WT.(KG.)</th>
                    <th className="py-2 border-r">L(CM)</th>
                    <th className="py-2 border-r">B(CM)</th>
                    <th className="py-2 border-r">H(CM)</th>
                    <th className="py-2 border-r">VOLUMETRIC WT.(KG.)</th>
                    <th className="py-2 border-r">CHARGEABLE WT.(KG.)</th>
                    <th className="py-2">CTN</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-1 border-r text-gray-600">1</td>
                    <td className="border-r">
                      <input
                        type="text"
                        value={form.boxNo}
                        onChange={(e) => setForm({ ...form, boxNo: e.target.value })}
                        className="w-full text-center border-none focus:outline-none"
                      />
                    </td>
                    <td className="border-r">
                      <input
                        type="text"
                        placeholder="Actual Wt"
                        value={form.parcelActualWt}
                        onChange={(e) => setForm({ ...form, parcelActualWt: e.target.value })}
                        className="w-full text-center border-none focus:outline-none"
                      />
                    </td>
                    <td className="border-r">
                      <input
                        type="text"
                        placeholder="L"
                        value={form.parcelL}
                        onChange={(e) => setForm({ ...form, parcelL: e.target.value })}
                        className="w-full text-center border-none focus:outline-none"
                      />
                    </td>
                    <td className="border-r">
                      <input
                        type="text"
                        placeholder="B"
                        value={form.parcelB}
                        onChange={(e) => setForm({ ...form, parcelB: e.target.value })}
                        className="w-full text-center border-none focus:outline-none"
                      />
                    </td>
                    <td className="border-r">
                      <input
                        type="text"
                        placeholder="H"
                        value={form.parcelH}
                        onChange={(e) => setForm({ ...form, parcelH: e.target.value })}
                        className="w-full text-center border-none focus:outline-none"
                      />
                    </td>
                    <td className="border-r">
                      <input
                        type="text"
                        placeholder="Vol. Wt"
                        value={form.parcelVolumetricWt}
                        onChange={(e) => setForm({ ...form, parcelVolumetricWt: e.target.value })}
                        className="w-full text-center border-none focus:outline-none"
                      />
                    </td>
                    <td className="border-r">
                      <input
                        type="text"
                        placeholder="Ch. Wt"
                        value={form.parcelChargeableWt}
                        onChange={(e) => setForm({ ...form, parcelChargeableWt: e.target.value })}
                        className="w-full text-center border-none focus:outline-none"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        placeholder="Ctn"
                        value={form.parcelCtn}
                        onChange={(e) => setForm({ ...form, parcelCtn: e.target.value })}
                        className="w-full text-center border-none focus:outline-none"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section: CREATE SHIPMENT INVOICE? */}
          <div className="flex flex-col gap-4 text-xs font-sans text-gray-800">
            <label className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-800 cursor-pointer">
              <input
                type="checkbox"
                checked={form.createShipmentInvoice}
                onChange={(e) => setForm({ ...form, createShipmentInvoice: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>CREATE SHIPMENT INVOICE?</span>
            </label>

            {form.createShipmentInvoice && (
              <div className="flex flex-col gap-4 animate-in fade-in duration-200">
                {/* Row 1: Invoice Type, Currency, Incoterms */}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold uppercase text-gray-600">INVOICE TYPE ?</span>
                    <CommonDropdown
                      value={form.invoiceType}
                      onChange={(val) => setForm({ ...form, invoiceType: val })}
                      className="w-48 !py-1 !px-2 border-gray-300"
                      options={[
                        { value: "INVOICE", label: "INVOICE" },
                        { value: "PROFORMA", label: "PROFORMA" }
                      ]}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-semibold uppercase text-gray-600">CURRENCY</span>
                    <CommonDropdown
                      value={form.invoiceCurrency}
                      onChange={(val) => setForm({ ...form, invoiceCurrency: val })}
                      className="w-32 !py-1 !px-2 border-gray-300"
                      options={[
                        { value: "USD", label: "USD" },
                        { value: "INR", label: "INR" }
                      ]}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-semibold uppercase text-gray-600">INCOTERMS</span>
                    <CommonDropdown
                      value={form.incoterms}
                      onChange={(val) => setForm({ ...form, incoterms: val })}
                      className="w-48 !py-1 !px-2 border-gray-300"
                      options={[
                        { value: "DDU", label: "DDU" },
                        { value: "DDP", label: "DDP" }
                      ]}
                    />
                  </div>
                </div>

                {/* Row 2: Note and Declaration */}
                <div className="flex flex-wrap md:flex-nowrap items-center gap-3">
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-semibold uppercase text-gray-600">NOTE</span>
                    <CommonDropdown
                      value={form.invoiceNote}
                      onChange={(val) => setForm({ ...form, invoiceNote: val })}
                      className="w-48 !py-1 !px-2 border-gray-300"
                      options={[
                        { value: "GIFT", label: "GIFT" },
                        { value: "SAMPLE", label: "SAMPLE" },
                        { value: "COMMERCIAL", label: "COMMERCIAL" }
                      ]}
                    />
                  </div>
                  <input
                    type="text"
                    value={form.invoiceDeclaration}
                    onChange={(e) => setForm({ ...form, invoiceDeclaration: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-1 text-[11px] bg-white focus:outline-none"
                  />
                </div>

                {/* SHIPMENT INVOICE ITEMS table */}
                <div className="mt-2">
                  <div className="bg-[#1e457e] text-white text-[11px] font-bold px-3 py-1.5 uppercase tracking-wide">
                    SHIPMENT INVOICE ITEMS
                  </div>
                  <div className="border border-t-0 overflow-x-auto">
                    <table className="w-full text-[11px] border-collapse min-w-[950px]">
                      <thead>
                        <tr className="bg-gray-50 border-b text-[10px] text-axc-dark-gray font-bold uppercase text-left">
                          <th className="py-2 px-2 border-r font-bold">BOX NO.</th>
                          <th className="py-2 px-2 border-r font-bold">SR. NO.</th>
                          <th className="py-2 px-2 border-r font-bold w-1/4">DESCRIPTION</th>
                          <th className="py-2 px-2 border-r font-bold">HS CODE</th>
                          <th className="py-2 px-2 border-r font-bold">UNIT TYPE</th>
                          <th className="py-2 px-2 border-r font-bold">QUANTITY</th>
                          <th className="py-2 px-2 border-r font-bold">UNIT WEIGHT</th>
                          <th className="py-2 px-2 border-r font-bold">IGST</th>
                          <th className="py-2 px-2 border-r font-bold">UNIT RATES</th>
                          <th className="py-2 px-2 border-r font-bold">AMOUNT</th>
                          <th className="py-2 px-2 font-bold text-center">ACTION</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoiceItems.map((item, idx) => (
                          <tr key={item.id} className="border-b last:border-b-0 hover:bg-gray-50/50">
                            <td className="border-r p-1">
                              <CommonDropdown
                                value={item.boxNo}
                                onChange={(val) => {
                                  const updated = [...invoiceItems];
                                  updated[idx].boxNo = val;
                                  setInvoiceItems(updated);
                                }}
                                className="w-full !py-0.5 !px-1.5 border-gray-300"
                                placeholder="Select..."
                                options={[
                                  { value: "1", label: "Box 1" }
                                ]}
                              />
                            </td>
                            <td className="border-r p-1 text-center bg-gray-50 text-gray-600 font-medium">
                              {item.srNo}
                            </td>
                            <td className="border-r p-1">
                              <input
                                type="text"
                                placeholder="SEARCH HERE..."
                                value={item.description}
                                onChange={(e) => {
                                  const updated = [...invoiceItems];
                                  updated[idx].description = e.target.value;
                                  setInvoiceItems(updated);
                                }}
                                className="w-full bg-white border border-gray-300 rounded px-1.5 py-0.5 focus:outline-none"
                              />
                            </td>
                            <td className="border-r p-1">
                              <input
                                type="text"
                                value={item.hsCode}
                                onChange={(e) => {
                                  const updated = [...invoiceItems];
                                  updated[idx].hsCode = e.target.value;
                                  setInvoiceItems(updated);
                                }}
                                className="w-full bg-white border border-gray-300 rounded px-1.5 py-0.5 focus:outline-none text-center"
                              />
                            </td>
                            <td className="border-r p-1">
                              <CommonDropdown
                                value={item.unitType}
                                onChange={(val) => {
                                  const updated = [...invoiceItems];
                                  updated[idx].unitType = val;
                                  setInvoiceItems(updated);
                                }}
                                className="w-full !py-0.5 !px-1.5 border-gray-300"
                                placeholder="Select..."
                                options={[
                                  { value: "PCS", label: "PCS" },
                                  { value: "KGS", label: "KGS" }
                                ]}
                              />
                            </td>
                            <td className="border-r p-1">
                              <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => {
                                  const updated = [...invoiceItems];
                                  updated[idx].quantity = e.target.value;
                                  updated[idx].amount = String(Number(e.target.value) * Number(updated[idx].unitRates || 0));
                                  setInvoiceItems(updated);
                                }}
                                className="w-full bg-white border border-gray-300 rounded px-1.5 py-0.5 focus:outline-none text-center"
                              />
                            </td>
                            <td className="border-r p-1">
                              <input
                                type="text"
                                value={item.unitWeight}
                                onChange={(e) => {
                                  const updated = [...invoiceItems];
                                  updated[idx].unitWeight = e.target.value;
                                  setInvoiceItems(updated);
                                }}
                                className="w-full bg-white border border-gray-300 rounded px-1.5 py-0.5 focus:outline-none text-center"
                              />
                            </td>
                            <td className="border-r p-1">
                              <input
                                type="text"
                                value={item.igst}
                                onChange={(e) => {
                                  const updated = [...invoiceItems];
                                  updated[idx].igst = e.target.value;
                                  setInvoiceItems(updated);
                                }}
                                className="w-full bg-white border border-gray-300 rounded px-1.5 py-0.5 focus:outline-none text-center"
                              />
                            </td>
                            <td className="border-r p-1">
                              <input
                                type="text"
                                value={item.unitRates}
                                onChange={(e) => {
                                  const updated = [...invoiceItems];
                                  updated[idx].unitRates = e.target.value;
                                  updated[idx].amount = String(Number(item.quantity || 0) * Number(e.target.value));
                                  setInvoiceItems(updated);
                                }}
                                className="w-full bg-white border border-gray-300 rounded px-1.5 py-0.5 focus:outline-none text-center"
                              />
                            </td>
                            <td className="border-r p-1">
                              <input
                                type="text"
                                readOnly
                                value={item.amount}
                                className="w-full bg-gray-50 border border-axc-gray  rounded px-1.5 py-0.5 text-center cursor-not-allowed text-axc-dark-gray font-medium"
                              />
                            </td>
                            <td className="p-1 text-center">
                              <button
                                type="button"
                                onClick={() => removeInvoiceItem(item.id)}
                                className="inline-flex items-center gap-1 text-axc-red hover:text-red-800 font-bold text-[10px]"
                              >
                                <span className="inline-block w-3.5 h-3.5 rounded-full border border-axc-red text-center leading-3 font-extrabold text-[9px] shrink-0">x</span>
                                REMOVE
                              </button>
                            </td>
                          </tr>
                        ))}

                        {/* Footer row containing totals */}
                        <tr className="bg-gray-50/50 border-t">
                          <td colSpan={5} className="py-2 px-3 border-r"></td>
                          <td colSpan={2} className="py-2 px-2 border-r text-right font-bold text-gray-700">
                            <div className="flex items-center justify-end gap-2 text-[10px]">
                              <span>TOTAL WEIGHT</span>
                              <input
                                type="text"
                                readOnly
                                value={invoiceItems.reduce((acc, curr) => acc + Number(curr.unitWeight || 0) * Number(curr.quantity || 0), 0)}
                                className="w-24 border border-gray-300 bg-gray-100 rounded px-1.5 py-0.5 text-center font-bold text-gray-600"
                              />
                            </div>
                          </td>
                          <td colSpan={2} className="py-2 px-2 border-r text-right font-bold text-gray-700">
                            <div className="flex items-center justify-end gap-2 text-[10px]">
                              <span>TOTAL AMOUNT</span>
                              <input
                                type="text"
                                readOnly
                                value={invoiceItems.reduce((acc, curr) => acc + Number(curr.amount || 0), 0)}
                                className="w-24 border border-gray-300 bg-gray-100 rounded px-1.5 py-0.5 text-center font-bold text-gray-600"
                              />
                            </div>
                          </td>
                          <td colSpan={2} className="py-2 px-3"></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={addInvoiceItem}
                      className="px-3 py-2 bg-axc-yellow hover:bg-axc-yellow/80 text-white rounded text-xs font-bold shadow-sm transition uppercase"
                    >
                      + ADD ITEM
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom actions matching top actions */}
          <div className="flex justify-end gap-3 bg-white p-4 rounded-2xl border border-axc-gray  shadow-sm">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-5 py-2 border border-axc-gray  text-gray-600 rounded-lg text-xs font-bold hover:bg-slate-50 transition mr-auto"
            >
              <RotateCcw size={14} /> Reset
            </button>
            {awbSubTab !== "awb-info" && (
              <button
                type="button"
                onClick={() => {
                  if (awbSubTab === "consignee") setAwbSubTab("shipper");
                  else if (awbSubTab === "shipper") setAwbSubTab("awb-info");
                }}
                className="px-5 py-2 border border-axc-gray  text-gray-600 rounded-lg text-xs font-bold hover:bg-slate-50 transition"
              >
                PREVIOUS
              </button>
            )}
            {awbSubTab !== "consignee" ? (
              <button
                type="button"
                onClick={() => {
                  if (awbSubTab === "awb-info") handleSubTabChange("shipper");
                  else if (awbSubTab === "shipper") handleSubTabChange("consignee");
                }}
                className="px-5 py-2 bg-axc-navy hover:bg-axc-navy/80 text-white rounded-lg text-xs font-bold transition shadow-sm"
              >
                NEXT
              </button>
            ) : (
              <>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-axc-navy hover:bg-axc-navy/80 text-white rounded-lg text-xs font-bold transition shadow-sm"
                >
                  {loading ? "Saving..." : "CREATE AWB"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    alert("AWB created and label printed!");
                    handleReset();
                  }}
                  className="px-5 py-2 bg-[#0b733a] hover:bg-[#095f30] text-white rounded-lg text-xs font-bold transition shadow-sm"
                >
                  CREATE AWB AND PRINT LABEL
                </button>
              </>
            )}
          </div>
        </form>
      ) : (
        /* Other Tabs Placeholder */
        <div className="rounded-[32px] border border-axc-gray  bg-white p-12 text-center text-axc-dark-gray shadow-sm w-full">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
            {tabs.find((t) => t.id === activeTab)?.label}
          </p>
          <p className="text-xs text-gray-400 font-medium">
            This section is currently under development.
          </p>
        </div>
      )}
    </div>
  );
}
