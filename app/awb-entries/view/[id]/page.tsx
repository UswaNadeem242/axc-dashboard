"use client";
import React from "react";
import Image from "next/image";
import { X, MapPin, Phone, Mail, ChevronDown, User, IndianRupee, Truck, ArrowLeft, Eye } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

const SectionHeader = ({ title }: { title: string }) => (
  <div className="bg-axc-navy/60 px-5 py-4  rounded-tl-lg rounded-tr-lg  text-white capitalize">
    <h2>{title}
    </h2>
  </div>
);

const Field = ({ label, value }: { label: string; value: string | React.ReactNode }) => (
  <div className="flex items-center text-sm border-b border-axc-border last:border-b-0 py-2.5 px-4">
    <span className="text-axc-dark-gray text-regular-medium w-[150px] shrink-0">{label}</span>
    <span className="text-axc-gray flex-1">{value}</span>
  </div>
);

const AwbDetailsView = ({ id, formData, awbData, invoiceItems }: { id: string, formData: any, awbData: any, invoiceItems: any[] }) => (
  <div className="border border-axc-border rounded-tl-lg rounded-tr-lg">
    {/* ... (previous sections) ... */}
    <SectionHeader title="Weights and Dimensions" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-b border-axc-border">
      <Field label="Pcs:" value={formData?.pcs || awbData?.pcs || "-"} />
      <div className="border-l border-axc-border">
        <Field label="Actual Weight:" value={formData?.actualWeight || "-"} />
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-b border-axc-border">
      <Field label="Volumetric Weight:" value={formData?.volumetricWeight || "-"} />
      <div className="border-l border-axc-border">
        <Field label="Consigner Weight:" value={formData?.consignerWeight || "-"} />
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-b border-axc-border">
      <Field label="Add. Weight:" value={formData?.addWeight || "-"} />
      <div className="border-l border-axc-border">
        <Field label="Chargeable Weight:" value={formData?.chargeableWeight || "-"} />
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-b border-gray-200">
      <Field label="Parcel Type:" value={formData?.parcelType || "-"} />
      <div className="border-l border-gray-200">
        <Field label="Box No.:" value={formData?.boxNo || "-"} />
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b border-gray-200">
      <Field label="Actual Wt:" value={formData?.parcelActualWt || "-"} />
      <div className="border-l border-gray-200">
        <Field label="L (cm):" value={formData?.parcelL || "-"} />
      </div>
      <div className="border-l border-gray-200">
        <Field label="B (cm):" value={formData?.parcelB || "-"} />
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b border-gray-200">
      <Field label="H (cm):" value={formData?.parcelH || "-"} />
      <div className="border-l border-gray-200">
        <Field label="Volumetric Wt:" value={formData?.parcelVolumetricWt || "-"} />
      </div>
      <div className="border-l border-gray-200">
        <Field label="Chargeable Wt:" value={formData?.parcelChargeableWt || "-"} />
      </div>
    </div>
    <div className="grid grid-cols-1 gap-0 border-b border-gray-200">
      <Field label="Ctn:" value={formData?.parcelCtn || "-"} />
    </div>

    <SectionHeader title="Air Waybill Information" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b border-gray-200">
      <Field label="AWB Number:" value={id} />
      <div className="border-l border-gray-200"><Field label="Branch:" value={formData?.branch || "-"} /></div>
      <div className="border-l border-gray-200"><Field label="Company:" value={formData?.company || "-"} /></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b border-gray-200">
      <Field label="Customer:" value={formData?.customer || awbData?.customer || "-"} />
      <div className="border-l border-gray-200"><Field label="Customer Code:" value={formData?.customerCode || "-"} /></div>
      <div className="border-l border-gray-200"><Field label="Sector:" value={formData?.sector || "-"} /></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b border-gray-200">
      <Field label="Destination Hub:" value={formData?.destinationHub || "-"} />
      <div className="border-l border-gray-200"><Field label="Product:" value={formData?.product || awbData?.product || "-"} /></div>
      <div className="border-l border-gray-200"><Field label="Booking Date:" value={formData?.bookingDate || awbData?.bookingDate || "-"} /></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b border-gray-200">
      <Field label="Service:" value={formData?.service || awbData?.service || "-"} />
      <div className="border-l border-gray-200"><Field label="Vendor:" value={formData?.vendor || awbData?.vendor || "-"} /></div>
      <div className="border-l border-gray-200"><Field label="Forwarding No:" value={formData?.forwardingNumber || awbData?.forwardingNumber || "-"} /></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b border-gray-200">
      <Field label="Forwarding No 2:" value={formData?.forwardingNumber2 || "-"} />
      <div className="border-l border-gray-200"><Field label="Reference No:" value={formData?.referenceNumber || "-"} /></div>
      <div className="border-l border-gray-200"><Field label="Shipment Value:" value={formData?.shipmentValue || "-"} /></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-b border-gray-200">
      <Field label="Invoice Date:" value={formData?.invoiceDate || "-"} />
      <div className="border-l border-gray-200"><Field label="Invoice Number:" value={formData?.invoiceNumber || "-"} /></div>
    </div>
    <div className="grid grid-cols-1 gap-0 border-b border-gray-200">
      <div className="flex flex-col text-sm py-2.5 px-3">
        <span className="text-gray-600 font-medium mb-1">Content:</span>
        <span className="text-gray-900">{formData?.content || "-"}</span>
      </div>
    </div>

    <SectionHeader title="Contract ID" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-b border-gray-200">
      <div className="p-3 border-r border-gray-200">
        <h4 className="font-semibold text-gray-700 text-xs mb-2">Customer</h4>
        <Field label="Rate Contract:" value={formData?.rateContractCustomer || "-"} />
        <Field label="CFT Contract:" value={formData?.cftContractCustomer || "-"} />
        <Field label="TAT:" value={formData?.tatCustomer || "-"} />
      </div>
      <div className="p-3">
        <h4 className="font-semibold text-gray-700 text-xs mb-2">Vendor</h4>
        <Field label="Rate Contract:" value={formData?.rateContractVendor || "-"} />
        <Field label="CFT Contract:" value={formData?.cftContractVendor || "-"} />
        <Field label="TAT:" value={formData?.tatVendor || "-"} />
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-b border-gray-200">
      <Field label="Origin Hub:" value={formData?.originHub || "-"} />
      <div className="border-l border-gray-200"><Field label="Duty:" value={formData?.duty || "-"} /></div>
    </div>

    <SectionHeader title="Shipper / Consigner / From" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b border-gray-200">
      <Field label="Code:" value={formData?.shipperCode || "-"} />
      <div className="border-l border-gray-200"><Field label="Company:" value={formData?.shipperCompany || "-"} /></div>
      <div className="border-l border-gray-200"><Field label="Person Name:" value={formData?.shipperPersonName || awbData?.shipper || "-"} /></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b border-gray-200">
      <Field label="Email Address:" value={formData?.shipperEmail || "-"} />
      <div className="border-l border-gray-200"><Field label="Phone Number:" value={formData?.shipperPhone || "-"} /></div>
      <div className="border-l border-gray-200"><Field label="Post / Zip Code:" value={formData?.shipperZipCode || "-"} /></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b border-gray-200">
      <Field label="City:" value={formData?.shipperCity || "-"} />
      <div className="border-l border-gray-200"><Field label="State / County:" value={formData?.shipperState || "-"} /></div>
      <div className="border-l border-gray-200"><Field label="Country:" value={formData?.shipperCountry || formData?.origin || awbData?.origin || "-"} /></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-b border-gray-200">
      <Field label="KYC Type:" value={formData?.shipperKycType || "-"} />
      <div className="border-l border-gray-200"><Field label="KYC Number:" value={formData?.shipperKycNumber || "-"} /></div>
    </div>
    <div className="grid grid-cols-1 gap-0 border-b border-gray-200">
      <Field label="Address 1:" value={formData?.shipperAddress1 || "-"} />
      <Field label="Address 2:" value={formData?.shipperAddress2 || "-"} />
      <Field label="Address 3:" value={formData?.shipperAddress3 || "-"} />
    </div>

    <SectionHeader title="Consignee / Receiver / To" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b border-gray-200">
      <Field label="Code:" value={formData?.consigneeCode || "-"} />
      <div className="border-l border-gray-200"><Field label="Company:" value={formData?.consigneeCompany || "-"} /></div>
      <div className="border-l border-gray-200"><Field label="Person Name:" value={formData?.consigneePersonName || awbData?.consignee || "-"} /></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b border-gray-200">
      <Field label="Email Address:" value={formData?.consigneeEmail || "-"} />
      <div className="border-l border-gray-200"><Field label="Post / Zip Code:" value={formData?.consigneeZipCode || "-"} /></div>
      <div className="border-l border-gray-200"><Field label="City:" value={formData?.consigneeCity || "-"} /></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-b border-gray-200">
      <Field label="State / County:" value={formData?.consigneeState || "-"} />
      <div className="border-l border-gray-200"><Field label="Country:" value={formData?.consigneeCountry || formData?.destination || awbData?.destination || "-"} /></div>
    </div>
    <div className="grid grid-cols-1 gap-0 border-b border-gray-200">
      <Field label="Phone Number:" value={formData?.consigneePhone || "-"} />
      <Field label="Address 1:" value={formData?.consigneeAddress1 || "-"} />
      <Field label="Address 2:" value={formData?.consigneeAddress2 || "-"} />
      <Field label="Address 3:" value={formData?.consigneeAddress3 || "-"} />
    </div>

    <SectionHeader title="Create Shipment Invoice?" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b border-gray-200">
      <Field label="Invoice Type:" value={formData?.invoiceType || "-"} />
      <div className="border-l border-gray-200"><Field label="Currency:" value={formData?.invoiceCurrency || "-"} /></div>
      <div className="border-l border-gray-200"><Field label="Incoterms:" value={formData?.incoterms || "-"} /></div>
    </div>
    <div className="grid grid-cols-1 gap-0 border-b border-gray-200">
      <Field label="Note:" value={formData?.invoiceNote || "-"} />
      <div className="flex flex-col text-sm py-2.5 px-3">
        <span className="text-gray-600 font-medium mb-1">Declaration:</span>
        <span className="text-gray-900">{formData?.invoiceDeclaration || "-"}</span>
      </div>
    </div>

    <SectionHeader title="Shipment Invoice Items" />
    <div className="overflow-x-auto p-4 rounded-lg">
      <table className="w-full text-regular-small  rounded-lg  text-left border border-gray-200">
        <thead className="bg-axc-navy/10 text-axc-dark-gray  capitalize text-xs">
          <tr>
            <th className="px-3 py-3 border-b border-axc-border">BoxId</th>
            <th className="px-3 py-3 border-b border-axc-border">SrNo</th>
            <th className="px-3 py-3 border-b border-axc-border">Description</th>
            <th className="px-3 py-3 border-b border-axc-border">HS Code</th>
            <th className="px-3 py-3 border-b border-axc-border">Unit Type</th>
            <th className="px-3 py-3 border-b border-axc-border">Quantity</th>
            <th className="px-3 py-3 border-b border-axc-border">Unit Weight</th>
            <th className="px-3 py-3 border-b border-axc-border">IGST</th>
            <th className="px-3 py-3 border-b border-axc-border">Unit Rates</th>
            <th className="px-3 py-3 border-b border-axc-border">Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoiceItems && invoiceItems.length > 0 ? (
            invoiceItems.map((item, idx) => (
              <tr key={idx} className="border-b last:border-b-0">
                <td className="px-3 py-2">{item.boxNo || "-"}</td>
                <td className="px-3 py-2">{item.srNo || "-"}</td>
                <td className="px-3 py-2">{item.description || "-"}</td>
                <td className="px-3 py-2">{item.hsCode || "-"}</td>
                <td className="px-3 py-2">{item.unitType || "-"}</td>
                <td className="px-3 py-2">{item.quantity || "-"}</td>
                <td className="px-3 py-2">{item.unitWeight || "-"}</td>
                <td className="px-3 py-2">{item.igst || "-"}</td>
                <td className="px-3 py-2">{item.unitRates || "-"}</td>
                <td className="px-3 py-2">{item.amount || "-"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={10} className="px-3 py-4 text-center text-gray-500">No invoice items found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

const PurchaseBillingView = ({ id, vendorInvoiceData, purchaseBillingData, vendorDetailsData }: any) => (
  <div className="border border-axc-border rounded-lg">
    {/* VENDOR INVOICE */}
    <SectionHeader title="Vendor Invoice" />
    <div className="grid grid-cols-1 border-b border-gray-200 bg-white">
      <Field label="Past Vendor Invoice:" value={vendorInvoiceData?.pastVendorInvoice || "-"} />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-b border-gray-200 bg-white">
      <Field label="Vendor Invoice 1:" value={vendorInvoiceData?.vendorInvoice1 || "-"} />
      <div className="border-l border-gray-200"><Field label="Invoice Remarks 1:" value={vendorInvoiceData?.invoiceRemarks1 || "-"} /></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-b border-gray-200 bg-white">
      <Field label="Vendor Invoice 2:" value={vendorInvoiceData?.vendorInvoice2 || "-"} />
      <div className="border-l border-gray-200"><Field label="Invoice Remarks 2:" value={vendorInvoiceData?.invoiceRemarks2 || "-"} /></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-b border-gray-200 bg-white">
      <Field label="Vendor Invoice 3:" value={vendorInvoiceData?.vendorInvoice3 || "-"} />
      <div className="border-l border-gray-200"><Field label="Invoice Remarks 3:" value={vendorInvoiceData?.invoiceRemarks3 || "-"} /></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-b border-gray-200 bg-white">
      <Field label="Vendor Invoice 4:" value={vendorInvoiceData?.vendorInvoice4 || "-"} />
      <div className="border-l border-gray-200"><Field label="Invoice Remarks 4:" value={vendorInvoiceData?.invoiceRemarks4 || "-"} /></div>
    </div>

    {/* PURCHASE BILLING */}
    <div className="mt-4">
      <SectionHeader title="Purchase Billing" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b border-gray-200 bg-white">
        <Field label="Company:" value={purchaseBillingData?.company || "-"} />
        <div className="border-l border-gray-200"><Field label="Currency:" value={purchaseBillingData?.purchaseCurrency || "-"} /></div>
        <div className="border-l border-gray-200"><Field label="VAT Type:" value={purchaseBillingData?.vatType || "-"} /></div>
      </div>
      <div className="grid grid-cols-1 border-b border-gray-200 bg-white">
        <Field label="VAT Applicable:" value={purchaseBillingData?.vatApplicable ? "Yes" : "No"} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b border-gray-200 bg-white">
        <Field label="Freight:" value={purchaseBillingData?.freight || "0.00"} />
        <div className="border-l border-gray-200"><Field label="Freight Per Kg:" value={purchaseBillingData?.freightPerKg || "-"} /></div>
        <div className="border-l border-gray-200"><Field label="Search Charge:" value={purchaseBillingData?.searchCharge || "-"} /></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b border-gray-200 bg-white">
        <ChargeField label="Additional Handling" charge={purchaseBillingData?.charges?.additionalHandling} />
        <div className="border-l border-gray-200"><ChargeField label="Additional Handling Charge Weight" charge={purchaseBillingData?.charges?.additionalHandlingCharge} /></div>
        <div className="border-l border-gray-200"><ChargeField label="Address Correction Fees" charge={purchaseBillingData?.charges?.addressCorrectionFees} /></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b border-gray-200 bg-white">
        <ChargeField label="AHS Weight" charge={purchaseBillingData?.charges?.ahsWeight} />
        <div className="border-l border-gray-200"><ChargeField label="Brand Charges" charge={purchaseBillingData?.charges?.brandCharges} /></div>
        <div className="border-l border-gray-200"><ChargeField label="Collection Charges" charge={purchaseBillingData?.charges?.collectionCharges} /></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b border-gray-200 bg-white">
        <ChargeField label="DAS Charge" charge={purchaseBillingData?.charges?.dasCharges} />
        <div className="border-l border-gray-200"><ChargeField label="DDP CAD Charge" charge={purchaseBillingData?.charges?.ddpCadCharges} /></div>
        <div className="border-l border-gray-200"><ChargeField label="Delivery Area Surcharge" charge={purchaseBillingData?.charges?.deliveryAreaSurcharge} /></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b border-gray-200 bg-white">
        <ChargeField label="Delivery Area Surcharge Extended" charge={purchaseBillingData?.charges?.deliveryAreaSurchargeExtended} />
        <div className="border-l border-gray-200"><ChargeField label="Drop Off Charges" charge={purchaseBillingData?.charges?.dropOffCharges} /></div>
        <div className="border-l border-gray-200"><ChargeField label="E Form" charge={purchaseBillingData?.charges?.eForm} /></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b border-gray-200 bg-white">
        <ChargeField label="Extra Charges" charge={purchaseBillingData?.charges?.extraCharges} />
        <div className="border-l border-gray-200"><ChargeField label="Oversized" charge={purchaseBillingData?.charges?.oversized} /></div>
        <div className="border-l border-gray-200"><ChargeField label="Peak Surcharge" charge={purchaseBillingData?.charges?.peakSurcharge} /></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b border-gray-200 bg-white">
        <ChargeField label="Pickup Charges" charge={purchaseBillingData?.charges?.pickupCharges} />
        <div className="border-l border-gray-200"><ChargeField label="Remote Area" charge={purchaseBillingData?.charges?.remoteArea} /></div>
        <div className="border-l border-gray-200"><ChargeField label="Remote Area Surcharge" charge={purchaseBillingData?.charges?.remoteAreaSurcharge} /></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-b border-gray-200 bg-white">
        <ChargeField label="Residential Surcharge" charge={purchaseBillingData?.charges?.residentialSurcharge} />
        <div className="border-l border-gray-200"><ChargeField label="Residential Surcharge Manual" charge={purchaseBillingData?.charges?.residentialSurchargeManual} /></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b border-gray-200 bg-white">
        <Field label="Total Other Charges:" value={purchaseBillingData?.totalOtherCharges || "0.00"} />
        <div className="border-l border-gray-200"><Field label="Adjustment Amount:" value={purchaseBillingData?.adjustmentAmount || "-"} /></div>
        <div className="border-l border-gray-200"><Field label="FSC %:" value={purchaseBillingData?.fscPercent || "-"} /></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b border-gray-200 bg-white">
        <Field label="FSC:" value={purchaseBillingData?.fsc || "0.00"} />
        <div className="border-l border-gray-200"><Field label="Discount (In %):" value={purchaseBillingData?.discountPercent || "-"} /></div>
        <div className="border-l border-gray-200"><Field label="Discount Amount:" value={purchaseBillingData?.discountAmount || "-"} /></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b border-gray-200 bg-white">
        <Field label="Total Discount:" value={purchaseBillingData?.totalDiscount || "0.00"} />
        <div className="border-l border-gray-200"><Field label="Freight After Discount:" value={purchaseBillingData?.freightAfterDiscount || "0.00"} /></div>
        <div className="border-l border-gray-200"><Field label="Subtotal:" value={purchaseBillingData?.subtotal || "0.00"} /></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b border-gray-200 bg-white">
        <Field label="Non Taxable Amount:" value={purchaseBillingData?.nonTaxableAmount || "0.00"} />
        <div className="border-l border-gray-200"><Field label="Taxable Amount:" value={purchaseBillingData?.taxableAmount || "0.00"} /></div>
        <div className="border-l border-gray-200"><Field label="VAT %:" value={purchaseBillingData?.vatPercent || "0.00"} /></div>
      </div>
      <div className="grid grid-cols-1 gap-0 border-b border-gray-200 bg-white font-bold">
        <Field label="Grand Total:" value={purchaseBillingData?.grandTotal || "0.00"} />
      </div>
    </div>

    {/* VENDOR DETAILS */}
    <div className="mt-4">
      <SectionHeader title="Vendor Details" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b border-gray-200 bg-white">
        <Field label="Product:" value={vendorDetailsData?.product || "-"} />
        <div className="border-l border-gray-200"><Field label="Service:" value={vendorDetailsData?.service || "-"} /></div>
        <div className="border-l border-gray-200"><Field label="Vendor:" value={vendorDetailsData?.vendor || "-"} /></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b border-gray-200 bg-white">
        <Field label="Origin Zone:" value={vendorDetailsData?.originZone || "-"} />
        <div className="border-l border-gray-200"><Field label="Destination Zone:" value={vendorDetailsData?.destinationZone || "-"} /></div>
        <div className="border-l border-gray-200"><Field label="PCS:" value={vendorDetailsData?.pcs || "-"} /></div>
      </div>
      <div className="overflow-x-auto p-4 bg-white border-b border-gray-200">
        <table className="w-full  font-regular-small text-left border border-axc-border">
          <thead className="bg-axc-navy/10  ">
            <tr>
              <th className="px-3 py-3 border-b border-axc-border">Actual Wt.(KG.)</th>
              <th className="px-3 py-3 border-b border-axc-border">L(CM)</th>
              <th className="px-3 py-3 border-b border-axc-border">B(CM)</th>
              <th className="px-3 py-3 border-b border-axc-border">H(CM)</th>
              <th className="px-3 py-3 border-b border-axc-border">Volumetric Wt.(KG.)</th>
              <th className="px-3 py-3 border-b border-axc-border">Chargeable Wt.(KG.)</th>
            </tr>
          </thead>
          <tbody>
            {vendorDetailsData?.weightRows && vendorDetailsData.weightRows.length > 0 ? (
              vendorDetailsData.weightRows.map((row: any, idx: number) => (
                <tr key={idx} className="border-b last:border-b-0 border-axc-border">
                  <td className="px-3 py-3">{row.actualWeight || "-"}</td>
                  <td className="px-3 py-3">{row.length || "-"}</td>
                  <td className="px-3 py-3">{row.breadth || "-"}</td>
                  <td className="px-3 py-3">{row.height || "-"}</td>
                  <td className="px-3 py-3">{row.volumetricWeight || "-"}</td>
                  <td className="px-3 py-3">{row.chargeableWeight || "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-3 py-4 text-center text-gray-500">No weight rows</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="grid grid-cols-1 border-b border-gray-200 bg-white">
        <Field label="Actual Weight:" value={vendorDetailsData?.actualWeight || "-"} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b border-gray-200 bg-white">
        <Field label="CFT ID:" value={vendorDetailsData?.cftId || "-"} />
        <div className="border-l border-gray-200"><Field label="CFT VALUE:" value={vendorDetailsData?.cftValue || "-"} /></div>
        <div className="border-l border-gray-200"><Field label="Contact ID:" value={vendorDetailsData?.vendorContractId || "-"} /></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b border-gray-200 bg-white">
        <Field label="TAT:" value={vendorDetailsData?.tat || "-"} />
        <div className="border-l border-gray-200"><Field label="Volum Weight:" value={vendorDetailsData?.volumeWeight || "-"} /></div>
        <div className="border-l border-gray-200"><Field label="Chargeable Weight:" value={vendorDetailsData?.chargeableWeight || "-"} /></div>
      </div>
    </div>
  </div>
);

const DeliveryView = ({ id, formData, awbData, deliveryData }: any) => (
  <div className="border border-gray-200 rounded bg-gray-50/50">
    {/* FORWARDING NUMBERS */}
    <SectionHeader title="Forwarding Details" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-b border-gray-200 bg-white">
      <Field label="Forwarding Number:" value={formData?.forwardingNumber || awbData?.forwardingNumber || "-"} />
      <div className="border-l border-gray-200"><Field label="Forwarding Number 2:" value={formData?.forwardingNumber2 || "-"} /></div>
    </div>

    {/* CUSTOMER VS VENDOR TABLE */}
    <div className="mt-4">
      <SectionHeader title="Expected Delivery / TAT" />
      <div className="overflow-x-auto p-3 bg-white border-b border-axc-border">
        <table className="w-full text-sm text-left border border-axc-border">
          <thead className="bg-axc-navy/10 text-axc-dark-gray text-regular-small  text-xs">
            <tr>
              <th className="px-3 py-3 border-b border-axc-border"></th>
              <th className="px-3 py-3 border-b border-axc-border text-regular-medium text-center">Customer</th>
              <th className="px-3 py-3 border-b border-axc-border text-regular-medium text-center">Vendor</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-axc-border">
              <td className="px-3 py-3 font-medium text-regular-medium">Expected Delivery Date</td>
              <td className="px-3 py-3 text-center text-regular-medium">{deliveryData?.customerExpectedDate || "-"}</td>
              <td className="px-3 py-3 text-center text-regular-medium">{deliveryData?.vendorExpectedDate || "-"}</td>
            </tr>
            <tr className="border-b border-axc-border">
              <td className="px-3 py-3 font-medium text-regular-medium">Actual TAT</td>
              <td className="px-3 py-3 text-center font-bold text-axc-navy text-regular-medium">{deliveryData?.customerActualTat || "0"}</td>
              <td className="px-3 py-3 text-center font-bold text-axc-navy text-regular-medium">{deliveryData?.vendorActualTat || "0"}</td>
            </tr>
            <tr className="border-b border-axc-border">
              <td className="px-3 py-3 font-medium text-regular-medium">Crossed EDD Days</td>
              <td className="px-3 py-3 text-center">{deliveryData?.customerCrossedEdd || "-"}</td>
              <td className="px-3 py-3 text-center">{deliveryData?.vendorCrossedEdd || "-"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    {/* DELIVERY DETAILS */}
    <div className="mt-4">
      <SectionHeader title="Delivery" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b border-gray-200 bg-white">
        <Field label="Expected Date:" value={deliveryData?.expectedDate || "-"} />
        <div className="border-l border-gray-200"><Field label="Expected Time:" value={deliveryData?.expectedTime || "-"} /></div>
        <div className="border-l border-gray-200"><Field label="Delivery Date:" value={deliveryData?.deliveryDate || "-"} /></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b border-gray-200 bg-white">
        <Field label="Delivery Time:" value={deliveryData?.deliveryTime || "-"} />
        <div className="border-l border-gray-200"><Field label="API Crossed EDD Days:" value={deliveryData?.apiCrossedEddDays || "-"} /></div>
        <div className="border-l border-gray-200"><Field label="Connection Date:" value={deliveryData?.connectionDate || "-"} /></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b border-gray-200 bg-white">
        <Field label="Connection Time:" value={deliveryData?.connectionTime || "-"} />
        <div className="border-l border-gray-200"><Field label="Appointment Date:" value={deliveryData?.appointmentDate || "-"} /></div>
        <div className="border-l border-gray-200"><Field label="Appointment Time:" value={deliveryData?.appointmentTime || "-"} /></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b border-gray-200 bg-white">
        <Field label="POD Uploaded Date:" value={deliveryData?.podUploadedDate || "-"} />
        <div className="border-l border-gray-200"><Field label="POD Uploaded Time:" value={deliveryData?.podUploadedTime || "-"} /></div>
        <div className="border-l border-gray-200"><Field label="Delivery Cost:" value={deliveryData?.deliveryCost || "-"} /></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b border-gray-200 bg-white">
        <Field label="Receiver Name:" value={deliveryData?.receiverName || "-"} />
        <div className="border-l border-gray-200"><Field label="Receiver Mobile:" value={deliveryData?.receiverMobile || "-"} /></div>
        <div className="border-l border-gray-200"><Field label="Receiver Email:" value={deliveryData?.receiverEmail || "-"} /></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b border-gray-200 bg-white">
        <Field label="Remarks:" value={deliveryData?.remarks || "-"} />
        <div className="border-l border-gray-200"><Field label="AWB Status Code:" value={deliveryData?.awbStatusCode || "-"} /></div>
        <div className="border-l border-gray-200"><Field label="AWB Status Name:" value={deliveryData?.awbStatusName || "-"} /></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b border-gray-200 bg-white">
        <Field label="Reason For Status:" value={deliveryData?.reasonForStatus || "-"} />
        <div className="border-l border-gray-200"><Field label="COD Amount:" value={deliveryData?.codAmount || "-"} /></div>
        <div className="border-l border-gray-200"><Field label="COD Amount Collected:" value={deliveryData?.codAmountCollected || "-"} /></div>
      </div>
      <div className="flex  gap-4 border-b border-gray-200 bg-white py-2.5 px-3 items-center text-sm">
        <span className="text-gray-600 font-medium">POD Hard Copy</span>
        <input type="checkbox" checked={deliveryData?.podHardCopy || false} readOnly disabled className="w-3 h-3 rounded-sm border-gray-300 mr-2" />
      </div>
      <div className="flex justify-end items-center gap-4 py-4 px-4 bg-gray-50 border-b border-gray-200 text-regular-medium text-gray-700">
        <span>TOTAL PCS - {deliveryData?.totalPcs || formData?.pcs || awbData?.pcs || "0"}</span>
        <span>TOTAL PICKUP SCAN PARCELS - {deliveryData?.totalPickupScanParcels || "0"}</span>
        <span>TOTAL INSCAN PARCELS - {deliveryData?.totalInscanParcels || "0"}</span>
      </div>
    </div>

    {/* AWB TRACKING */}
    <div className="mt-4">
      <SectionHeader title={`AWB Tracking: ${id}`} />
      <div className="overflow-x-auto p-3 bg-white rounded-lg ">
        <table className="w-full text-sm text-left  border border-axc-border">
          <thead className="bg-axc-navy/10 text-axc-dark-gray capitalize text-regular-meidum">
            <tr>
              <th className="px-3 py-3 border-b border-axc-border">EVENT DATE TIME</th>
              <th className="px-3 py-3 border-b border-axc-border">EVENT DESCRIPTION</th>
              <th className="px-3 py-3 border-b border-axc-border">EVENT LOCATION</th>
              <th className="px-3 py-3 border-b border-axc-border">EVENT TYPE</th>
              <th className="px-3 py-3 border-b border-axc-border">EVENT STATE</th>
              <th className="px-3 py-3 border-b border-axc-border">EVENT REMARK</th>
              <th className="px-3 py-3 border-b border-axc-border">CREATED DATE</th>
              <th className="px-3 py-3 border-b border-axc-border">CREATED BY</th>
            </tr>
          </thead>
          <tbody>
            {deliveryData?.trackingEvents && deliveryData.trackingEvents.length > 0 ? (
              deliveryData.trackingEvents.map((event: any, idx: number) => (
                <tr key={idx} className="border-b last:border-b-0">
                  <td className="px-3 py-2">{event.dateTime || "-"}</td>
                  <td className="px-3 py-2">{event.description || "-"}</td>
                  <td className="px-3 py-2">{event.location || "-"}</td>
                  <td className="px-3 py-2">{event.type || "-"}</td>
                  <td className="px-3 py-2">{event.state || "-"}</td>
                  <td className="px-3 py-2">{event.remark || "-"}</td>
                  <td className="px-3 py-2">{event.createdDate || "-"}</td>
                  <td className="px-3 py-2">{event.createdBy || "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-3 py-4 text-center text-gray-500">No tracking events added</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const ChargeField = ({ label, charge }: { label: string, charge: any }) => (
  <div className="flex items-center text-sm border-b border-gray-200 py-2.5 px-3 bg-white">
    <span className="text-gray-600 font-medium w-[220px] shrink-0 flex items-center gap-2">
      <input type="checkbox" checked={charge?.checked || false} readOnly disabled className="w-3 h-3 rounded-sm border-gray-300" />
      {label}
    </span>
    <span className="text-gray-900 flex-1">{charge?.checked ? (charge?.amount || charge?.value || "0") : "-"}</span>
  </div>
);

const SalesBillingView = ({ id, formData, awbData, billingData, paymentData, remarksData, refundData }: any) => (
  <div className="border border-gray-200 rounded bg-gray-50/50">

    {/* WEIGHT SUMMARY */}
    <SectionHeader title="Weight Summary" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-b border-gray-200 bg-white">
      <Field label="Pcs:" value={formData?.pcs || awbData?.pcs || "-"} />
      <div className="border-l border-gray-200"><Field label="Actual Weight:" value={formData?.actualWeight || "-"} /></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-b border-gray-200 bg-white">
      <Field label="Volumetric Weight:" value={formData?.volumetricWeight || "-"} />
      <div className="border-l border-gray-200"><Field label="Consigner Weight:" value={formData?.consignerWeight || "-"} /></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-b border-gray-200 bg-white">
      <Field label="Add. Weight:" value={formData?.addWeight || "-"} />
      <div className="border-l border-gray-200"><Field label="Chargeable Weight:" value={formData?.chargeableWeight || "-"} /></div>
    </div>

    {/* AIR WAYBILL INFORMATION */}
    <div className="mt-4">
      <SectionHeader title="Air Waybill Information" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b border-gray-200 bg-white">
        <Field label="AWB Number:" value={id} />
        <div className="border-l border-gray-200"><Field label="Branch:" value={formData?.branch || "-"} /></div>
        <div className="border-l border-gray-200"><Field label="Company:" value={formData?.company || "-"} /></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b border-gray-200 bg-white">
        <Field label="Customer:" value={formData?.customer || awbData?.customer || "-"} />
        <div className="border-l border-gray-200"><Field label="Customer Code:" value={formData?.customerCode || "-"} /></div>
        <div className="border-l border-gray-200"><Field label="Sector:" value={formData?.sector || "-"} /></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b border-gray-200 bg-white">
        <Field label="Destination Hub:" value={formData?.destinationHub || "-"} />
        <div className="border-l border-gray-200"><Field label="Product:" value={formData?.product || awbData?.product || "-"} /></div>
        <div className="border-l border-gray-200"><Field label="Booking Date:" value={formData?.bookingDate || awbData?.bookingDate || "-"} /></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b border-gray-200 bg-white">
        <Field label="Service:" value={formData?.service || awbData?.service || "-"} />
        <div className="border-l border-gray-200"><Field label="Vendor:" value={formData?.vendor || awbData?.vendor || "-"} /></div>
        <div className="border-l border-gray-200"><Field label="Forwarding No:" value={formData?.forwardingNumber || awbData?.forwardingNumber || "-"} /></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b border-gray-200 bg-white">
        <Field label="Forwarding No 2:" value={formData?.forwardingNumber2 || "-"} />
        <div className="border-l border-gray-200"><Field label="Reference No:" value={formData?.referenceNumber || "-"} /></div>
        <div className="border-l border-gray-200"><Field label="Shipment Value:" value={formData?.shipmentValue || "-"} /></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-b border-gray-200 bg-white">
        <Field label="Invoice Date:" value={formData?.invoiceDate || "-"} />
        <div className="border-l border-gray-200"><Field label="Invoice Number:" value={formData?.invoiceNumber || "-"} /></div>
      </div>
    </div>

    {/* CONTRACT ID & HUB */}
    <div className="mt-4">
      <SectionHeader title="Contract ID" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-b border-gray-200 bg-white">
        <div className=" border-r border-axc-border">
          <h4 className="text-axc-dark-gray text-regular-medium  text-center bg-axc-navy/10 py-3  ">Customer</h4>
          <Field label="Rate Contract:" value={formData?.rateContractCustomer || "-"} />
          <Field label="CFT Contract:" value={formData?.cftContractCustomer || "-"} />
          <Field label="TAT:" value={formData?.tatCustomer || "-"} />
        </div>
        <div className="">
          <h4 className="text-axc-dark-gray text-regular-medium  text-center bg-axc-navy/10 py-3  ">Vendor</h4>
          <Field label="Rate Contract:" value={formData?.rateContractVendor || "-"} />
          <Field label="CFT Contract:" value={formData?.cftContractVendor || "-"} />
          <Field label="TAT:" value={formData?.tatVendor || "-"} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-b border-gray-200 bg-white">
        <Field label="Origin Hub:" value={formData?.originHub || "-"} />
        <div className="border-l border-gray-200"><Field label="Duty:" value={formData?.duty || "-"} /></div>
      </div>
    </div>

    {/* SALES BILLING SECTION */}
    <div className="mt-4">
      <SectionHeader title="Sales Billing" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b border-gray-200 bg-white">
        <Field label="Sales Currency:" value={billingData?.salesCurrency || "-"} />
        <div className="border-l border-gray-200"><Field label="VAT Type:" value={billingData?.vatType || "-"} /></div>
        <div className="border-l border-gray-200"><Field label="VAT Applicable:" value={billingData?.vatApplicable ? "Yes" : "No"} /></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b border-gray-200 bg-white">
        <Field label="Freight:" value={billingData?.freight || "0.00"} />
        <div className="border-l border-gray-200"><Field label="Freight Per Kg:" value={billingData?.freightPerKg || "-"} /></div>
        <div className="border-l border-gray-200"><Field label="Search Charge:" value={billingData?.searchCharge || "-"} /></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b border-gray-200 bg-white">
        <ChargeField label="Additional Handling" charge={billingData?.charges?.additionalHandling} />
        <div className="border-l border-gray-200"><ChargeField label="Additional Handling Charge Weight" charge={billingData?.charges?.additionalHandlingCharge} /></div>
        <div className="border-l border-gray-200"><ChargeField label="Address Correction Fees" charge={billingData?.charges?.addressCorrectionFees} /></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b border-gray-200 bg-white">
        <ChargeField label="AHS Weight" charge={billingData?.charges?.ahsWeight} />
        <div className="border-l border-gray-200"><ChargeField label="Brand Charges" charge={billingData?.charges?.brandCharges} /></div>
        <div className="border-l border-gray-200"><ChargeField label="Collection Charges" charge={billingData?.charges?.collectionCharges} /></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b border-gray-200 bg-white">
        <ChargeField label="DAS Charges" charge={billingData?.charges?.dasCharges} />
        <div className="border-l border-gray-200"><ChargeField label="DDP CAD Charges" charge={billingData?.charges?.ddpCadCharges} /></div>
        <div className="border-l border-gray-200"><ChargeField label="Delivery Area Surcharge" charge={billingData?.charges?.deliveryAreaSurcharge} /></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b border-gray-200 bg-white">
        <ChargeField label="Delivery Area Surcharge Extended" charge={billingData?.charges?.deliveryAreaSurchargeExtended} />
        <div className="border-l border-gray-200"><ChargeField label="Drop Off Charges" charge={billingData?.charges?.dropOffCharges} /></div>
        <div className="border-l border-gray-200"><ChargeField label="E Form" charge={billingData?.charges?.eForm} /></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b border-gray-200 bg-white">
        <ChargeField label="Extra Charges" charge={billingData?.charges?.extraCharges} />
        <div className="border-l border-gray-200"><ChargeField label="Oversized" charge={billingData?.charges?.oversized} /></div>
        <div className="border-l border-gray-200"><ChargeField label="Peak Surcharge" charge={billingData?.charges?.peakSurcharge} /></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b border-gray-200 bg-white">
        <ChargeField label="Pickup Charges" charge={billingData?.charges?.pickupCharges} />
        <div className="border-l border-gray-200"><ChargeField label="Remote Area" charge={billingData?.charges?.remoteArea} /></div>
        <div className="border-l border-gray-200"><ChargeField label="Remote Area Surcharge" charge={billingData?.charges?.remoteAreaSurcharge} /></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-b border-gray-200 bg-white">
        <ChargeField label="Residential Surcharge" charge={billingData?.charges?.residentialSurcharge} />
        <div className="border-l border-gray-200"><ChargeField label="Residential Surcharge Manual" charge={billingData?.charges?.residentialSurchargeManual} /></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b border-gray-200 bg-white">
        <Field label="Total Other Charges:" value={billingData?.totalOtherCharges || "0.00"} />
        <div className="border-l border-gray-200"><Field label="Adjustment Amount:" value={billingData?.adjustmentAmount || "-"} /></div>
        <div className="border-l border-gray-200"><Field label="FSC %:" value={billingData?.fscPercent || "-"} /></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b border-gray-200 bg-white">
        <Field label="FSC:" value={billingData?.fsc || "0.00"} />
        <div className="border-l border-gray-200"><Field label="Discount (in %):" value={billingData?.discountPercent || "-"} /></div>
        <div className="border-l border-gray-200"><Field label="Discount Amount:" value={billingData?.discountAmount || "-"} /></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b border-gray-200 bg-white">
        <Field label="Total Discount:" value={billingData?.totalDiscount || "0.00"} />
        <div className="border-l border-gray-200"><Field label="Freight After Discount:" value={billingData?.freightAfterDiscount || "0.00"} /></div>
        <div className="border-l border-gray-200"><Field label="Subtotal:" value={billingData?.subtotal || "0.00"} /></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b border-gray-200 bg-white">
        <Field label="Non Taxable Amount:" value={billingData?.nonTaxableAmount || "0.00"} />
        <div className="border-l border-gray-200"><Field label="Taxable Amount:" value={billingData?.taxableAmount || "0.00"} /></div>
        <div className="border-l border-gray-200"><Field label="VAT %:" value={billingData?.vatPercent || "0.00"} /></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b border-gray-200 bg-white">
        <Field label="CGST:" value={billingData?.cgst || "0.00"} />
        <div className="border-l border-gray-200"><Field label="SGST:" value={billingData?.sgst || "0.00"} /></div>
        <div className="border-l border-gray-200 font-bold bg-gray-50"><Field label="Grand Total:" value={billingData?.grandTotal || "0.00"} /></div>
      </div>
    </div>

    {/* PAYMENT DETAILS */}
    <div className="mt-4">
      <SectionHeader title="Payment Details" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-b border-gray-200 bg-white">
        <Field label="Paid Amount:" value={paymentData?.paidAmount || "0.00"} />
        <div className="border-l border-gray-200"><Field label="Balance Amount:" value={paymentData?.balanceAmount || "0.00"} /></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-b border-gray-200 bg-white">
        <Field label="Invoice Date:" value={paymentData?.invoiceDate || "-"} />
        <div className="border-l border-gray-200"><Field label="Invoice Number:" value={paymentData?.invoiceNumber || "-"} /></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-b border-gray-200 bg-white">
        <Field label="Invoice Remarks:" value={paymentData?.invoiceRemarks || "-"} />
        <div className="border-l border-gray-200"><Field label="Past Invoice No:" value={paymentData?.pastInvoiceNo || "-"} /></div>
      </div>
      <div className="grid grid-cols-1 gap-0 border-b border-gray-200 bg-white">
        <Field label="Credit/Debit Note:" value={paymentData?.creditDebitNote || "-"} />
      </div>
    </div>

    {/* INVOICE REMARKS */}
    <div className="mt-4">
      <SectionHeader title="Invoice Remarks" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-b border-gray-200 bg-white">
        <Field label="Invoice Remarks 1:" value={remarksData?.invoiceRemarks1 || "-"} />
        <div className="border-l border-gray-200"><Field label="Invoice Remarks 2:" value={remarksData?.invoiceRemarks2 || "-"} /></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-b border-gray-200 bg-white">
        <Field label="Invoice Remarks 3:" value={remarksData?.invoiceRemarks3 || "-"} />
        <div className="border-l border-gray-200"><Field label="Invoice Remarks 4:" value={remarksData?.invoiceRemarks4 || "-"} /></div>
      </div>
    </div>

    {/* REFUND DETAILS */}
    <div className="mt-4">
      <SectionHeader title="Refund Details" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-b border-gray-200 bg-white">
        <Field label="Refund Amount:" value={refundData?.refundAmount || "-"} />
        <div className="border-l border-gray-200"><Field label="Refund Date:" value={refundData?.refundDate || "-"} /></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-b border-gray-200 bg-white">
        <Field label="Refund Reason:" value={refundData?.refundReason || "-"} />
        <div className="border-l border-gray-200"><Field label="Refund Remarks:" value={refundData?.refundRemarks || "-"} /></div>
      </div>
    </div>

  </div>
);

export default function AwbViewPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id ? (Array.isArray(params.id) ? params.id[0] : params.id) : "00IMP-321";

  const [activeTab, setActiveTab] = React.useState<"awb-details" | "sales-billing" | "purchase-billing" | "delivery">("awb-details");
  const [awbData, setAwbData] = React.useState<any>(null);
  const [formData, setFormData] = React.useState<any>(null);
  const [billingData, setBillingData] = React.useState<any>(null);
  const [paymentData, setPaymentData] = React.useState<any>(null);
  const [remarksData, setRemarksData] = React.useState<any>(null);
  const [refundData, setRefundData] = React.useState<any>(null);
  const [purchaseBillingData, setPurchaseBillingData] = React.useState<any>(null);
  const [vendorInvoiceData, setVendorInvoiceData] = React.useState<any>(null);
  const [vendorDetailsData, setVendorDetailsData] = React.useState<any>(null);
  const [deliveryData, setDeliveryData] = React.useState<any>(null);
  const [invoiceItems, setInvoiceItems] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const storedEntries = localStorage.getItem("awb_entries");
      if (storedEntries) {
        try {
          const parsed = JSON.parse(storedEntries);
          const found = parsed.find((item: any) => String(item.awbNumber) === String(id));
          if (found) setAwbData(found);
        } catch (e) {
          console.error(e);
        }
      }

      const storedDetail = localStorage.getItem(`awb_detail_${id}`);
      if (storedDetail) {
        try {
          const parsed = JSON.parse(storedDetail);
          if (parsed.form) setFormData(parsed.form);
          if (parsed.billing) setBillingData(parsed.billing);
          if (parsed.payment) setPaymentData(parsed.payment);
          if (parsed.remarks) setRemarksData(parsed.remarks);
          if (parsed.refund) setRefundData(parsed.refund);
          if (parsed.invoiceItems) setInvoiceItems(parsed.invoiceItems);
          if (parsed.purchaseBilling) setPurchaseBillingData(parsed.purchaseBilling);
          if (parsed.vendorInvoice) setVendorInvoiceData(parsed.vendorInvoice);
          if (parsed.vendorDetails) setVendorDetailsData(parsed.vendorDetails);
          if (parsed.delivery) setDeliveryData(parsed.delivery);
        } catch (e) {
          console.error(e);
        }
      }

      // Look for sales billing directly if it's saved separately
      const storedSales = localStorage.getItem(`awb_sales_${id}`);
      if (storedSales) {
        try {
          const parsedSales = JSON.parse(storedSales);
          if (parsedSales) setBillingData(parsedSales);
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [id]);

  return (
    <div className="relative bg-white p-6 rounded-lg w-full flex-1 flex flex-col min-h-0 shadow-sm border border-axc-border overflow-x-hidden overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-lg">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between pb-4 mb-6 gap-4 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            title="Go back"
          >
            <ArrowLeft size={24} />
          </button>
          <Image
            src="/image/logo.png"
            alt="axc Logo"
            width={100}
            height={60}
            className="object-contain"
          />
        </div>
        <div className="flex items-center pr-4">
          <h1 className="text-xl font-bold">Parcel#:{id}</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6 gap-8">
        <button
          onClick={() => setActiveTab("awb-details")}
          className={`flex items-center gap-2 pb-3 text-sm font-medium border-b-2 transition-colors px-2 cursor-pointer ${activeTab === "awb-details" ? "border-axc-navy text-axc-navy" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
        >
          <Eye size={16} />
          AWB Details
        </button>
        <button
          onClick={() => setActiveTab("sales-billing")}
          className={`flex items-center gap-2 pb-3 text-sm font-medium border-b-2 transition-colors px-2 cursor-pointer ${activeTab === "sales-billing" ? "border-axc-navy text-axc-navy" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
        >
          <IndianRupee size={16} />
          Sales Billing
        </button>
        <button
          onClick={() => setActiveTab("purchase-billing")}
          className={`flex items-center gap-2 pb-3 text-sm font-medium border-b-2 transition-colors px-2 cursor-pointer ${activeTab === "purchase-billing" ? "border-axc-navy text-axc-navy" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
        >
          <IndianRupee size={16} />
          Purchase Billing
        </button>
        <button
          onClick={() => setActiveTab("delivery")}
          className={`flex items-center gap-2 pb-3 text-sm font-medium border-b-2 transition-colors px-2 cursor-pointer ${activeTab === "delivery" ? "border-axc-navy text-axc-navy" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
        >
          <Truck size={16} />
          Delivery
        </button>
      </div>



      {activeTab === "awb-details" ? (
        <AwbDetailsView id={id} formData={formData} awbData={awbData} invoiceItems={invoiceItems} />
      ) : activeTab === "sales-billing" ? (
        <SalesBillingView id={id} formData={formData} awbData={awbData} billingData={billingData} paymentData={paymentData} remarksData={remarksData} refundData={refundData} />
      ) : activeTab === "purchase-billing" ? (
        <PurchaseBillingView id={id} vendorInvoiceData={vendorInvoiceData} purchaseBillingData={purchaseBillingData} vendorDetailsData={vendorDetailsData} />
      ) : (
        <DeliveryView id={id} formData={formData} awbData={awbData} deliveryData={deliveryData} />
      )}
    </div>
  );
}
