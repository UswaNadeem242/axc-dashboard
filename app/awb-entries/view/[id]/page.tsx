"use client";
import React from "react";
import Image from "next/image";
import { IndianRupee, Truck, ArrowLeft, Eye } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

const SectionHeader = ({ title }: { title: string }) => (
  <div className="bg-axc-navy/60 px-5 py-4 rounded-tl-lg rounded-tr-lg text-white capitalize">
    <h2>{title}</h2>
  </div>
);

const Field = ({
  label,
  value,
  compact = false,
}: {
  label: string;
  value: string | React.ReactNode;
  compact?: boolean;
}) => (
  <div className="flex items-center text-sm border-b border-axc-border last:border-b-0 py-2.5 px-4">
    <span className={`text-axc-dark-gray text-regular-medium shrink-0 ${compact ? "w-[110px]" : "w-[150px]"}`}>
      {label}
    </span>
    <span className="text-axc-gray flex-1">{value}</span>
  </div>
);
const Row3 = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b border-axc-border bg-white [&>*+*]:md:border-l [&>*+*]:md:border-axc-border">
    {children}
  </div>
);
const Row2 = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-b border-axc-border bg-white [&>*+*]:md:border-l [&>*+*]:md:border-axc-border">
    {children}
  </div>
);

const Row1 = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-1 gap-0 border-b border-axc-border bg-white">{children}</div>
);

const ChargeField = ({ label, charge }: { label: string; charge: any }) => (
  <div className="flex items-center text-sm border-b border-axc-border py-2.5 px-3 bg-white">
    <span className="text-axc-dark-gray text-regular-medium w-[220px] shrink-0 flex items-center gap-2">
      <input
        type="checkbox"
        checked={charge?.checked || false}
        readOnly
        disabled
        className="w-3 h-3 rounded-sm border-gray-300"
      />
      {label}
    </span>
    <span className="text-axc-gray flex-1">{charge?.checked ? charge?.amount || charge?.value || "0" : "-"}</span>
  </div>
);

const ContractIdSection = ({ formData }: { formData: any }) => (
  <div className="mt-4">
    <SectionHeader title="Contract ID" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-b border-axc-border bg-white">
      <div className="border-r border-axc-border">
        <h4 className="text-axc-dark-gray text-regular-medium text-center bg-axc-navy/10 py-3">Customer</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 border-b border-axc-border">
          <Field compact label="Rate Contract:" value={formData?.rateContractCustomer || "-"} />
          <div className="md:border-l border-axc-border">
            <Field compact label="CFT Contract:" value={formData?.cftContractCustomer || "-"} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2">
          <Field compact label="TAT:" value={formData?.tatCustomer || "-"} />
          <div className="md:border-l border-axc-border">
            <Field compact label="Origin Hub:" value={formData?.originHub || "-"} />
          </div>
        </div>
      </div>
      <div>
        <h4 className="text-axc-dark-gray text-regular-medium text-center bg-axc-navy/10 py-3">Vendor</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 border-b border-axc-border">
          <Field compact label="Rate Contract:" value={formData?.rateContractVendor || "-"} />
          <div className="md:border-l border-axc-border">
            <Field compact label="CFT Contract:" value={formData?.cftContractVendor || "-"} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2">
          <Field compact label="TAT:" value={formData?.tatVendor || "-"} />
          <div className="md:border-l border-axc-border">
            <Field compact label="Duty:" value={formData?.duty || "-"} />
          </div>
        </div>
      </div>
    </div>
  </div>
);
const getDummyInvoiceItems = () => [
  {
    boxNo: "BOX-01",
    srNo: "1",
    description: "Cotton T-Shirts",
    hsCode: "610910",
    unitType: "PCS",
    quantity: "10",
    unitWeight: "0.20",
    igst: "5%",
    unitRates: "250",
    amount: "2500",
  },
  {
    boxNo: "BOX-01",
    srNo: "2",
    description: "Denim Jeans",
    hsCode: "620342",
    unitType: "PCS",
    quantity: "5",
    unitWeight: "0.60",
    igst: "12%",
    unitRates: "800",
    amount: "4000",
  },
  {
    boxNo: "BOX-02",
    srNo: "3",
    description: "Leather Wallet",
    hsCode: "420231",
    unitType: "PCS",
    quantity: "3",
    unitWeight: "0.15",
    igst: "18%",
    unitRates: "600",
    amount: "1800",
  },
];

const getDummyWeightRows = () => [
  {
    actualWeight: "2.50",
    length: "30",
    breadth: "20",
    height: "15",
    volumetricWeight: "1.80",
    chargeableWeight: "2.50",
  },
  {
    actualWeight: "1.20",
    length: "25",
    breadth: "18",
    height: "10",
    volumetricWeight: "0.90",
    chargeableWeight: "1.20",
  },
];

const getDummyTrackingEvents = () => [
  {
    dateTime: "2026-09-10 09:15",
    description: "Shipment Booked",
    location: "Lahore Hub",
    type: "Pickup",
    state: "Processed",
    remark: "Picked up from shipper",
    createdDate: "2026-09-10",
    createdBy: "System",
  },
  {
    dateTime: "2026-09-11 14:40",
    description: "In Transit",
    location: "Karachi Hub",
    type: "Transit",
    state: "In Progress",
    remark: "Departed origin hub",
    createdDate: "2026-09-11",
    createdBy: "System",
  },
  {
    dateTime: "2026-09-13 11:05",
    description: "Out for Delivery",
    location: "Destination City",
    type: "Delivery",
    state: "In Progress",
    remark: "With delivery courier",
    createdDate: "2026-09-13",
    createdBy: "System",
  },
];

const AwbDetailsView = ({
  id,
  formData,
  awbData,
  invoiceItems,
}: {
  id: string;
  formData: any;
  awbData: any;
  invoiceItems: any[];
}) => {
  const displayInvoiceItems = invoiceItems && invoiceItems.length > 0 ? invoiceItems : getDummyInvoiceItems();

  return (
    <div className="border border-axc-border rounded-tl-lg rounded-tr-lg">
      <SectionHeader title="Weights and Dimensions" />
      <Row3>
        <Field label="Pcs:" value={formData?.pcs || awbData?.pcs || "-"} />
        <Field label="Actual Weight:" value={formData?.actualWeight || "-"} />
        <Field label="Volumetric Weight:" value={formData?.volumetricWeight || "-"} />
      </Row3>
      <Row3>
        <Field label="Consigner Weight:" value={formData?.consignerWeight || "-"} />
        <Field label="Add. Weight:" value={formData?.addWeight || "-"} />
        <Field label="Chargeable Weight:" value={formData?.chargeableWeight || "-"} />
      </Row3>
      <Row3>
        <Field label="Parcel Type:" value={formData?.parcelType || "-"} />
        <Field label="Box No.:" value={formData?.boxNo || "-"} />
        <Field label="Actual Wt:" value={formData?.parcelActualWt || "-"} />
      </Row3>
      <Row3>
        <Field label="L (cm):" value={formData?.parcelL || "-"} />
        <Field label="B (cm):" value={formData?.parcelB || "-"} />
        <Field label="H (cm):" value={formData?.parcelH || "-"} />
      </Row3>
      <Row3>
        <Field label="Volumetric Wt:" value={formData?.parcelVolumetricWt || "-"} />
        <Field label="Chargeable Wt:" value={formData?.parcelChargeableWt || "-"} />
        <Field label="Ctn:" value={formData?.parcelCtn || "-"} />
      </Row3>

      <SectionHeader title="Air Waybill Information" />
      <Row3>
        <Field label="AWB Number:" value={id} />
        <Field label="Branch:" value={formData?.branch || "-"} />
        <Field label="Company:" value={formData?.company || "-"} />
      </Row3>
      <Row3>
        <Field label="Customer:" value={formData?.customer || awbData?.customer || "-"} />
        <Field label="Customer Code:" value={formData?.customerCode || "-"} />
        <Field label="Sector:" value={formData?.sector || "-"} />
      </Row3>
      <Row3>
        <Field label="Destination Hub:" value={formData?.destinationHub || "-"} />
        <Field label="Product:" value={formData?.product || awbData?.product || "-"} />
        <Field label="Booking Date:" value={formData?.bookingDate || awbData?.bookingDate || "-"} />
      </Row3>
      <Row3>
        <Field label="Service:" value={formData?.service || awbData?.service || "-"} />
        <Field label="Vendor:" value={formData?.vendor || awbData?.vendor || "-"} />
        <Field label="Forwarding No:" value={formData?.forwardingNumber || awbData?.forwardingNumber || "-"} />
      </Row3>
      <Row3>
        <Field label="Forwarding No 2:" value={formData?.forwardingNumber2 || "-"} />
        <Field label="Reference No:" value={formData?.referenceNumber || "-"} />
        <Field label="Shipment Value:" value={formData?.shipmentValue || "-"} />
      </Row3>
      <Row2>
        <Field label="Invoice Date:" value={formData?.invoiceDate || "-"} />
        <Field label="Invoice Number:" value={formData?.invoiceNumber || "-"} />
      </Row2>
      <Row1>
        <div className="flex flex-col text-sm py-2.5 px-4">
          <span className="text-axc-dark-gray text-regular-medium mb-1">Content:</span>
          <span className="text-axc-gray">{formData?.content || "-"}</span>
        </div>
      </Row1>

      <ContractIdSection formData={formData} />

      <div className="mt-4">
        <SectionHeader title="Shipper / Consigner / From" />
        <Row3>
          <Field label="Code:" value={formData?.shipperCode || "-"} />
          <Field label="Company:" value={formData?.shipperCompany || "-"} />
          <Field label="Person Name:" value={formData?.shipperPersonName || awbData?.shipper || "-"} />
        </Row3>
        <Row3>
          <Field label="Email Address:" value={formData?.shipperEmail || "-"} />
          <Field label="Phone Number:" value={formData?.shipperPhone || "-"} />
          <Field label="Post / Zip Code:" value={formData?.shipperZipCode || "-"} />
        </Row3>
        <Row3>
          <Field label="City:" value={formData?.shipperCity || "-"} />
          <Field label="State / County:" value={formData?.shipperState || "-"} />
          <Field
            label="Country:"
            value={formData?.shipperCountry || formData?.origin || awbData?.origin || "-"}
          />
        </Row3>
        <Row2>
          <Field label="KYC Type:" value={formData?.shipperKycType || "-"} />
          <Field label="KYC Number:" value={formData?.shipperKycNumber || "-"} />
        </Row2>
        <Row1>
          <Field label="Address 1:" value={formData?.shipperAddress1 || "-"} />
          <Field label="Address 2:" value={formData?.shipperAddress2 || "-"} />
          <Field label="Address 3:" value={formData?.shipperAddress3 || "-"} />
        </Row1>
      </div>

      <div className="mt-4">
        <SectionHeader title="Consignee / Receiver / To" />
        <Row3>
          <Field label="Code:" value={formData?.consigneeCode || "-"} />
          <Field label="Company:" value={formData?.consigneeCompany || "-"} />
          <Field label="Person Name:" value={formData?.consigneePersonName || awbData?.consignee || "-"} />
        </Row3>
        <Row3>
          <Field label="Email Address:" value={formData?.consigneeEmail || "-"} />
          <Field label="Post / Zip Code:" value={formData?.consigneeZipCode || "-"} />
          <Field label="City:" value={formData?.consigneeCity || "-"} />
        </Row3>
        <Row3>
          <Field label="State / County:" value={formData?.consigneeState || "-"} />
          <Field
            label="Country:"
            value={formData?.consigneeCountry || formData?.destination || awbData?.destination || "-"}
          />
          <Field label="Phone Number:" value={formData?.consigneePhone || "-"} />
        </Row3>
        <Row1>
          <Field label="Address 1:" value={formData?.consigneeAddress1 || "-"} />
          <Field label="Address 2:" value={formData?.consigneeAddress2 || "-"} />
          <Field label="Address 3:" value={formData?.consigneeAddress3 || "-"} />
        </Row1>
      </div>

      <div className="mt-4">
        <SectionHeader title="Create Shipment Invoice?" />
        <Row3>
          <Field label="Invoice Type:" value={formData?.invoiceType || "-"} />
          <Field label="Currency:" value={formData?.invoiceCurrency || "-"} />
          <Field label="Incoterms:" value={formData?.incoterms || "-"} />
        </Row3>
        <Row1>
          <Field label="Note:" value={formData?.invoiceNote || "-"} />
          <div className="flex flex-col text-sm py-2.5 px-4">
            <span className="text-axc-dark-gray text-regular-medium mb-1">Declaration:</span>
            <span className="text-axc-gray">{formData?.invoiceDeclaration || "-"}</span>
          </div>
        </Row1>
      </div>

      <div className="mt-4">
        <SectionHeader title="Shipment Invoice Items" />
        <div className="overflow-x-auto p-4 rounded-lg">
          <table className="w-full text-regular-small rounded-lg text-left border border-gray-200">
            <thead className="bg-axc-navy/10 text-axc-dark-gray capitalize text-xs">
              <tr>
                <th className="px-3 py-3 border-b border-gray-200">BoxId</th>
                <th className="px-3 py-3 border-b border-gray-200">SrNo</th>
                <th className="px-3 py-3 border-b border-gray-200">Description</th>
                <th className="px-3 py-3 border-b border-gray-200">HS Code</th>
                <th className="px-3 py-3 border-b border-gray-200">Unit Type</th>
                <th className="px-3 py-3 border-b border-gray-200">Quantity</th>
                <th className="px-3 py-3 border-b border-gray-200">Unit Weight</th>
                <th className="px-3 py-3 border-b border-gray-200">IGST</th>
                <th className="px-3 py-3 border-b border-gray-200">Unit Rates</th>
                <th className="px-3 py-3 border-b border-gray-200">Amount</th>
              </tr>
            </thead>
            <tbody>
              {displayInvoiceItems.map((item, idx) => (
                <tr key={idx} className="border-gray-200">
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const PurchaseBillingView = ({ vendorInvoiceData, purchaseBillingData, vendorDetailsData }: any) => {
  const displayWeightRows =
    vendorDetailsData?.weightRows && vendorDetailsData.weightRows.length > 0
      ? vendorDetailsData.weightRows
      : getDummyWeightRows();

  return (
    <div className="border border-axc-border rounded-lg">
     
      <SectionHeader title="Vendor Invoice" />
      <Row1>
        <Field label="Past Vendor Invoice:" value={vendorInvoiceData?.pastVendorInvoice || "-"} />
      </Row1>
      <Row2>
        <Field label="Vendor Invoice 1:" value={vendorInvoiceData?.vendorInvoice1 || "-"} />
        <Field label="Invoice Remarks 1:" value={vendorInvoiceData?.invoiceRemarks1 || "-"} />
      </Row2>
      <Row2>
        <Field label="Vendor Invoice 2:" value={vendorInvoiceData?.vendorInvoice2 || "-"} />
        <Field label="Invoice Remarks 2:" value={vendorInvoiceData?.invoiceRemarks2 || "-"} />
      </Row2>
      <Row2>
        <Field label="Vendor Invoice 3:" value={vendorInvoiceData?.vendorInvoice3 || "-"} />
        <Field label="Invoice Remarks 3:" value={vendorInvoiceData?.invoiceRemarks3 || "-"} />
      </Row2>
      <Row2>
        <Field label="Vendor Invoice 4:" value={vendorInvoiceData?.vendorInvoice4 || "-"} />
        <Field label="Invoice Remarks 4:" value={vendorInvoiceData?.invoiceRemarks4 || "-"} />
      </Row2>

  
      <div className="mt-4">
        <SectionHeader title="Purchase Billing" />
        <Row3>
          <Field label="Company:" value={purchaseBillingData?.company || "-"} />
          <Field label="Currency:" value={purchaseBillingData?.purchaseCurrency || "-"} />
          <Field label="VAT Type:" value={purchaseBillingData?.vatType || "-"} />
        </Row3>
        <Row1>
          <Field label="VAT Applicable:" value={purchaseBillingData?.vatApplicable ? "Yes" : "No"} />
        </Row1>
        <Row3>
          <Field label="Freight:" value={purchaseBillingData?.freight || "0.00"} />
          <Field label="Freight Per Kg:" value={purchaseBillingData?.freightPerKg || "-"} />
          <Field label="Search Charge:" value={purchaseBillingData?.searchCharge || "-"} />
        </Row3>
        <Row3>
          <ChargeField label="Additional Handling" charge={purchaseBillingData?.charges?.additionalHandling} />
          <ChargeField
            label="Additional Handling Charge Weight"
            charge={purchaseBillingData?.charges?.additionalHandlingCharge}
          />
          <ChargeField label="Address Correction Fees" charge={purchaseBillingData?.charges?.addressCorrectionFees} />
        </Row3>
        <Row3>
          <ChargeField label="AHS Weight" charge={purchaseBillingData?.charges?.ahsWeight} />
          <ChargeField label="Brand Charges" charge={purchaseBillingData?.charges?.brandCharges} />
          <ChargeField label="Collection Charges" charge={purchaseBillingData?.charges?.collectionCharges} />
        </Row3>
        <Row3>
          <ChargeField label="DAS Charge" charge={purchaseBillingData?.charges?.dasCharges} />
          <ChargeField label="DDP CAD Charge" charge={purchaseBillingData?.charges?.ddpCadCharges} />
          <ChargeField label="Delivery Area Surcharge" charge={purchaseBillingData?.charges?.deliveryAreaSurcharge} />
        </Row3>
        <Row3>
          <ChargeField
            label="Delivery Area Surcharge Extended"
            charge={purchaseBillingData?.charges?.deliveryAreaSurchargeExtended}
          />
          <ChargeField label="Drop Off Charges" charge={purchaseBillingData?.charges?.dropOffCharges} />
          <ChargeField label="E Form" charge={purchaseBillingData?.charges?.eForm} />
        </Row3>
        <Row3>
          <ChargeField label="Extra Charges" charge={purchaseBillingData?.charges?.extraCharges} />
          <ChargeField label="Oversized" charge={purchaseBillingData?.charges?.oversized} />
          <ChargeField label="Peak Surcharge" charge={purchaseBillingData?.charges?.peakSurcharge} />
        </Row3>
        <Row3>
          <ChargeField label="Pickup Charges" charge={purchaseBillingData?.charges?.pickupCharges} />
          <ChargeField label="Remote Area" charge={purchaseBillingData?.charges?.remoteArea} />
          <ChargeField label="Remote Area Surcharge" charge={purchaseBillingData?.charges?.remoteAreaSurcharge} />
        </Row3>
        <Row2>
          <ChargeField label="Residential Surcharge" charge={purchaseBillingData?.charges?.residentialSurcharge} />
          <ChargeField
            label="Residential Surcharge Manual"
            charge={purchaseBillingData?.charges?.residentialSurchargeManual}
          />
        </Row2>
        <Row3>
          <Field label="Total Other Charges:" value={purchaseBillingData?.totalOtherCharges || "0.00"} />
          <Field label="Adjustment Amount:" value={purchaseBillingData?.adjustmentAmount || "-"} />
          <Field label="FSC %:" value={purchaseBillingData?.fscPercent || "-"} />
        </Row3>
        <Row3>
          <Field label="FSC:" value={purchaseBillingData?.fsc || "0.00"} />
          <Field label="Discount (In %):" value={purchaseBillingData?.discountPercent || "-"} />
          <Field label="Discount Amount:" value={purchaseBillingData?.discountAmount || "-"} />
        </Row3>
        <Row3>
          <Field label="Total Discount:" value={purchaseBillingData?.totalDiscount || "0.00"} />
          <Field label="Freight After Discount:" value={purchaseBillingData?.freightAfterDiscount || "0.00"} />
          <Field label="Subtotal:" value={purchaseBillingData?.subtotal || "0.00"} />
        </Row3>
        <Row3>
          <Field label="Non Taxable Amount:" value={purchaseBillingData?.nonTaxableAmount || "0.00"} />
          <Field label="Taxable Amount:" value={purchaseBillingData?.taxableAmount || "0.00"} />
          <Field label="VAT %:" value={purchaseBillingData?.vatPercent || "0.00"} />
        </Row3>
        <div className="grid grid-cols-1 gap-0 border-b border-axc-border bg-white font-bold">
          <Field label="Grand Total:" value={purchaseBillingData?.grandTotal || "0.00"} />
        </div>
      </div>

      
      <div className="mt-4">
        <SectionHeader title="Vendor Details" />
        <Row3>
          <Field label="Product:" value={vendorDetailsData?.product || "-"} />
          <Field label="Service:" value={vendorDetailsData?.service || "-"} />
          <Field label="Vendor:" value={vendorDetailsData?.vendor || "-"} />
        </Row3>
        <Row3>
          <Field label="Origin Zone:" value={vendorDetailsData?.originZone || "-"} />
          <Field label="Destination Zone:" value={vendorDetailsData?.destinationZone || "-"} />
          <Field label="PCS:" value={vendorDetailsData?.pcs || "-"} />
        </Row3>
        <div className="overflow-x-auto p-4 bg-white border-b border-gray-200">
          <table className="w-full font-regular-small text-left border border-gray-200">
            <thead className="bg-axc-navy/10 text-axc-dark-gray">
              <tr>
                <th className="px-3 py-3 border-b border-gray-200">Actual Wt.(KG.)</th>
                <th className="px-3 py-3 border-b border-gray-200">L(CM)</th>
                <th className="px-3 py-3 border-b border-gray-200">B(CM)</th>
                <th className="px-3 py-3 border-b border-gray-200">H(CM)</th>
                <th className="px-3 py-3 border-b border-gray-200">Volumetric Wt.(KG.)</th>
                <th className="px-3 py-3 border-b border-gray-200">Chargeable Wt.(KG.)</th>
              </tr>
            </thead>
            <tbody>
              {displayWeightRows.map((row: any, idx: number) => (
                <tr key={idx} className=" border-gray-200">
                  <td className="px-3 py-3">{row.actualWeight || "-"}</td>
                  <td className="px-3 py-3">{row.length || "-"}</td>
                  <td className="px-3 py-3">{row.breadth || "-"}</td>
                  <td className="px-3 py-3">{row.height || "-"}</td>
                  <td className="px-3 py-3">{row.volumetricWeight || "-"}</td>
                  <td className="px-3 py-3">{row.chargeableWeight || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Row1>
          <Field label="Actual Weight:" value={vendorDetailsData?.actualWeight || "-"} />
        </Row1>
        <Row3>
          <Field label="CFT ID:" value={vendorDetailsData?.cftId || "-"} />
          <Field label="CFT VALUE:" value={vendorDetailsData?.cftValue || "-"} />
          <Field label="Contact ID:" value={vendorDetailsData?.vendorContractId || "-"} />
        </Row3>
        <Row3>
          <Field label="TAT:" value={vendorDetailsData?.tat || "-"} />
          <Field label="Volum Weight:" value={vendorDetailsData?.volumeWeight || "-"} />
          <Field label="Chargeable Weight:" value={vendorDetailsData?.chargeableWeight || "-"} />
        </Row3>
      </div>
    </div>
  );
};

const DeliveryView = ({ id, formData, awbData, deliveryData }: any) => {
  const displayTrackingEvents =
    deliveryData?.trackingEvents && deliveryData.trackingEvents.length > 0
      ? deliveryData.trackingEvents
      : getDummyTrackingEvents();

  return (
    <div className="border border-axc-border rounded bg-gray-50/50">
      {/* FORWARDING NUMBERS */}
      <SectionHeader title="Forwarding Details" />
      <Row2>
        <Field label="Forwarding Number:" value={formData?.forwardingNumber || awbData?.forwardingNumber || "-"} />
        <Field label="Forwarding Number 2:" value={formData?.forwardingNumber2 || "-"} />
      </Row2>

      {/* CUSTOMER VS VENDOR TABLE */}
      <div className="mt-4">
        <SectionHeader title="Expected Delivery / TAT" />
        <div className="overflow-x-auto p-3 bg-white border-b border-gray-200">
          <table className="w-full text-sm text-left border border-gray-200">
            <thead className="bg-axc-navy/10 text-axc-dark-gray text-regular-small text-xs">
              <tr>
                <th className="px-3 py-3 border-b border-gray-200"></th>
                <th className="px-3 py-3 border-b border-gray-200 text-regular-medium text-center">Customer</th>
                <th className="px-3 py-3 border-b border-gray-200 text-regular-medium text-center">Vendor</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="px-3 py-3 font-medium text-regular-medium">Expected Delivery Date</td>
                <td className="px-3 py-3 text-center text-regular-medium">{deliveryData?.customerExpectedDate || "-"}</td>
                <td className="px-3 py-3 text-center text-regular-medium">{deliveryData?.vendorExpectedDate || "-"}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="px-3 py-3 font-medium text-regular-medium">Actual TAT</td>
                <td className="px-3 py-3 text-center font-bold text-axc-navy text-regular-medium">
                  {deliveryData?.customerActualTat || "0"}
                </td>
                <td className="px-3 py-3 text-center font-bold text-axc-navy text-regular-medium">
                  {deliveryData?.vendorActualTat || "0"}
                </td>
              </tr>
              <tr className="border-b border-gray-200">
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
        <Row3>
          <Field label="Expected Date:" value={deliveryData?.expectedDate || "-"} />
          <Field label="Expected Time:" value={deliveryData?.expectedTime || "-"} />
          <Field label="Delivery Date:" value={deliveryData?.deliveryDate || "-"} />
        </Row3>
        <Row3>
          <Field label="Delivery Time:" value={deliveryData?.deliveryTime || "-"} />
          <Field label="API Crossed EDD Days:" value={deliveryData?.apiCrossedEddDays || "-"} />
          <Field label="Connection Date:" value={deliveryData?.connectionDate || "-"} />
        </Row3>
        <Row3>
          <Field label="Connection Time:" value={deliveryData?.connectionTime || "-"} />
          <Field label="Appointment Date:" value={deliveryData?.appointmentDate || "-"} />
          <Field label="Appointment Time:" value={deliveryData?.appointmentTime || "-"} />
        </Row3>
        <Row3>
          <Field label="POD Uploaded Date:" value={deliveryData?.podUploadedDate || "-"} />
          <Field label="POD Uploaded Time:" value={deliveryData?.podUploadedTime || "-"} />
          <Field label="Delivery Cost:" value={deliveryData?.deliveryCost || "-"} />
        </Row3>
        <Row3>
          <Field label="Receiver Name:" value={deliveryData?.receiverName || "-"} />
          <Field label="Receiver Mobile:" value={deliveryData?.receiverMobile || "-"} />
          <Field label="Receiver Email:" value={deliveryData?.receiverEmail || "-"} />
        </Row3>
        <Row3>
          <Field label="Remarks:" value={deliveryData?.remarks || "-"} />
          <Field label="AWB Status Code:" value={deliveryData?.awbStatusCode || "-"} />
          <Field label="AWB Status Name:" value={deliveryData?.awbStatusName || "-"} />
        </Row3>
        <Row3>
          <Field label="Reason For Status:" value={deliveryData?.reasonForStatus || "-"} />
          <Field label="COD Amount:" value={deliveryData?.codAmount || "-"} />
          <Field label="COD Amount Collected:" value={deliveryData?.codAmountCollected || "-"} />
        </Row3>
        <div className="flex gap-4 border-b border-axc-border bg-white py-2.5 px-4 items-center text-sm">
          <span className="text-axc-dark-gray text-regular-medium">POD Hard Copy</span>
          <input
            type="checkbox"
            checked={deliveryData?.podHardCopy || false}
            readOnly
            disabled
            className="w-3 h-3 rounded-sm border-gray-300 mr-2"
          />
        </div>
        <div className="flex justify-end items-center gap-4 py-4 px-4 bg-gray-50 border-b border-axc-border text-regular-medium text-gray-700">
          <span>TOTAL PCS - {deliveryData?.totalPcs || formData?.pcs || awbData?.pcs || "0"}</span>
          <span>TOTAL PICKUP SCAN PARCELS - {deliveryData?.totalPickupScanParcels || "0"}</span>
          <span>TOTAL INSCAN PARCELS - {deliveryData?.totalInscanParcels || "0"}</span>
        </div>
      </div>

      {/* AWB TRACKING */}
      <div className="mt-4">
        <SectionHeader title={`AWB Tracking: ${id}`} />
        <div className="overflow-x-auto p-3 bg-white rounded-lg">
          <table className="w-full text-sm text-left border border-gray-200">
            <thead className="bg-axc-navy/10 text-axc-dark-gray capitalize text-regular-medium">
              <tr>
                <th className="px-3 py-3 border-b border-gray-200">EVENT DATE TIME</th>
                <th className="px-3 py-3 border-b border-gray-200">EVENT DESCRIPTION</th>
                <th className="px-3 py-3 border-b border-gray-200">EVENT LOCATION</th>
                <th className="px-3 py-3 border-b border-gray-200">EVENT TYPE</th>
                <th className="px-3 py-3 border-b border-gray-200">EVENT STATE</th>
                <th className="px-3 py-3 border-b border-gray-200">EVENT REMARK</th>
                <th className="px-3 py-3 border-b border-gray-200">CREATED DATE</th>
                <th className="px-3 py-3 border-b border-gray-200">CREATED BY</th>
              </tr>
            </thead>
            <tbody>
              {displayTrackingEvents.map((event: any, idx: number) => (
                <tr key={idx} className="border-gray-200">
                  <td className="px-3 py-2">{event.dateTime || "-"}</td>
                  <td className="px-3 py-2">{event.description || "-"}</td>
                  <td className="px-3 py-2">{event.location || "-"}</td>
                  <td className="px-3 py-2">{event.type || "-"}</td>
                  <td className="px-3 py-2">{event.state || "-"}</td>
                  <td className="px-3 py-2">{event.remark || "-"}</td>
                  <td className="px-3 py-2">{event.createdDate || "-"}</td>
                  <td className="px-3 py-2">{event.createdBy || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const SalesBillingView = ({ id, formData, awbData, billingData, paymentData, remarksData, refundData }: any) => (
  <div className="border border-axc-border rounded bg-gray-50/50">
    {/* WEIGHT SUMMARY */}
    <SectionHeader title="Weight Summary" />
    <Row3>
      <Field label="Pcs:" value={formData?.pcs || awbData?.pcs || "-"} />
      <Field label="Actual Weight:" value={formData?.actualWeight || "-"} />
      <Field label="Volumetric Weight:" value={formData?.volumetricWeight || "-"} />
    </Row3>
    <Row3>
      <Field label="Consigner Weight:" value={formData?.consignerWeight || "-"} />
      <Field label="Add. Weight:" value={formData?.addWeight || "-"} />
      <Field label="Chargeable Weight:" value={formData?.chargeableWeight || "-"} />
    </Row3>

    {/* AIR WAYBILL INFORMATION */}
    <div className="mt-4">
      <SectionHeader title="Air Waybill Information" />
      <Row3>
        <Field label="AWB Number:" value={id} />
        <Field label="Branch:" value={formData?.branch || "-"} />
        <Field label="Company:" value={formData?.company || "-"} />
      </Row3>
      <Row3>
        <Field label="Customer:" value={formData?.customer || awbData?.customer || "-"} />
        <Field label="Customer Code:" value={formData?.customerCode || "-"} />
        <Field label="Sector:" value={formData?.sector || "-"} />
      </Row3>
      <Row3>
        <Field label="Destination Hub:" value={formData?.destinationHub || "-"} />
        <Field label="Product:" value={formData?.product || awbData?.product || "-"} />
        <Field label="Booking Date:" value={formData?.bookingDate || awbData?.bookingDate || "-"} />
      </Row3>
      <Row3>
        <Field label="Service:" value={formData?.service || awbData?.service || "-"} />
        <Field label="Vendor:" value={formData?.vendor || awbData?.vendor || "-"} />
        <Field label="Forwarding No:" value={formData?.forwardingNumber || awbData?.forwardingNumber || "-"} />
      </Row3>
      <Row3>
        <Field label="Forwarding No 2:" value={formData?.forwardingNumber2 || "-"} />
        <Field label="Reference No:" value={formData?.referenceNumber || "-"} />
        <Field label="Shipment Value:" value={formData?.shipmentValue || "-"} />
      </Row3>
      <Row2>
        <Field label="Invoice Date:" value={formData?.invoiceDate || "-"} />
        <Field label="Invoice Number:" value={formData?.invoiceNumber || "-"} />
      </Row2>
    </div>

     <ContractIdSection formData={formData} />

    {/* SALES BILLING SECTION */}
    <div className="mt-4">
      <SectionHeader title="Sales Billing" />
      <Row3>
        <Field label="Sales Currency:" value={billingData?.salesCurrency || "-"} />
        <Field label="VAT Type:" value={billingData?.vatType || "-"} />
        <Field label="VAT Applicable:" value={billingData?.vatApplicable ? "Yes" : "No"} />
      </Row3>
      <Row3>
        <Field label="Freight:" value={billingData?.freight || "0.00"} />
        <Field label="Freight Per Kg:" value={billingData?.freightPerKg || "-"} />
        <Field label="Search Charge:" value={billingData?.searchCharge || "-"} />
      </Row3>
      <Row3>
        <ChargeField label="Additional Handling" charge={billingData?.charges?.additionalHandling} />
        <ChargeField
          label="Additional Handling Charge Weight"
          charge={billingData?.charges?.additionalHandlingCharge}
        />
        <ChargeField label="Address Correction Fees" charge={billingData?.charges?.addressCorrectionFees} />
      </Row3>
      <Row3>
        <ChargeField label="AHS Weight" charge={billingData?.charges?.ahsWeight} />
        <ChargeField label="Brand Charges" charge={billingData?.charges?.brandCharges} />
        <ChargeField label="Collection Charges" charge={billingData?.charges?.collectionCharges} />
      </Row3>
      <Row3>
        <ChargeField label="DAS Charges" charge={billingData?.charges?.dasCharges} />
        <ChargeField label="DDP CAD Charges" charge={billingData?.charges?.ddpCadCharges} />
        <ChargeField label="Delivery Area Surcharge" charge={billingData?.charges?.deliveryAreaSurcharge} />
      </Row3>
      <Row3>
        <ChargeField
          label="Delivery Area Surcharge Extended"
          charge={billingData?.charges?.deliveryAreaSurchargeExtended}
        />
        <ChargeField label="Drop Off Charges" charge={billingData?.charges?.dropOffCharges} />
        <ChargeField label="E Form" charge={billingData?.charges?.eForm} />
      </Row3>
      <Row3>
        <ChargeField label="Extra Charges" charge={billingData?.charges?.extraCharges} />
        <ChargeField label="Oversized" charge={billingData?.charges?.oversized} />
        <ChargeField label="Peak Surcharge" charge={billingData?.charges?.peakSurcharge} />
      </Row3>
      <Row3>
        <ChargeField label="Pickup Charges" charge={billingData?.charges?.pickupCharges} />
        <ChargeField label="Remote Area" charge={billingData?.charges?.remoteArea} />
        <ChargeField label="Remote Area Surcharge" charge={billingData?.charges?.remoteAreaSurcharge} />
      </Row3>
      <Row2>
        <ChargeField label="Residential Surcharge" charge={billingData?.charges?.residentialSurcharge} />
        <ChargeField label="Residential Surcharge Manual" charge={billingData?.charges?.residentialSurchargeManual} />
      </Row2>
      <Row3>
        <Field label="Total Other Charges:" value={billingData?.totalOtherCharges || "0.00"} />
        <Field label="Adjustment Amount:" value={billingData?.adjustmentAmount || "-"} />
        <Field label="FSC %:" value={billingData?.fscPercent || "-"} />
      </Row3>
      <Row3>
        <Field label="FSC:" value={billingData?.fsc || "0.00"} />
        <Field label="Discount (in %):" value={billingData?.discountPercent || "-"} />
        <Field label="Discount Amount:" value={billingData?.discountAmount || "-"} />
      </Row3>
      <Row3>
        <Field label="Total Discount:" value={billingData?.totalDiscount || "0.00"} />
        <Field label="Freight After Discount:" value={billingData?.freightAfterDiscount || "0.00"} />
        <Field label="Subtotal:" value={billingData?.subtotal || "0.00"} />
      </Row3>
      <Row3>
        <Field label="Non Taxable Amount:" value={billingData?.nonTaxableAmount || "0.00"} />
        <Field label="Taxable Amount:" value={billingData?.taxableAmount || "0.00"} />
        <Field label="VAT %:" value={billingData?.vatPercent || "0.00"} />
      </Row3>
      <Row3>
        <Field label="CGST:" value={billingData?.cgst || "0.00"} />
        <Field label="SGST:" value={billingData?.sgst || "0.00"} />
        <div className="font-bold bg-gray-50">
          <Field label="Grand Total:" value={billingData?.grandTotal || "0.00"} />
        </div>
      </Row3>
    </div>

    {/* PAYMENT DETAILS */}
    <div className="mt-4">
      <SectionHeader title="Payment Details" />
      <Row3>
        <Field label="Paid Amount:" value={paymentData?.paidAmount || "0.00"} />
        <Field label="Balance Amount:" value={paymentData?.balanceAmount || "0.00"} />
        <Field label="Invoice Date:" value={paymentData?.invoiceDate || "-"} />
      </Row3>
      <Row3>
        <Field label="Invoice Number:" value={paymentData?.invoiceNumber || "-"} />
        <Field label="Invoice Remarks:" value={paymentData?.invoiceRemarks || "-"} />
        <Field label="Past Invoice No:" value={paymentData?.pastInvoiceNo || "-"} />
      </Row3>
      <Row1>
        <Field label="Credit/Debit Note:" value={paymentData?.creditDebitNote || "-"} />
      </Row1>
    </div>

    {/* INVOICE REMARKS */}
    <div className="mt-4">
      <SectionHeader title="Invoice Remarks" />
      <Row2>
        <Field label="Invoice Remarks 1:" value={remarksData?.invoiceRemarks1 || "-"} />
        <Field label="Invoice Remarks 2:" value={remarksData?.invoiceRemarks2 || "-"} />
      </Row2>
      <Row2>
        <Field label="Invoice Remarks 3:" value={remarksData?.invoiceRemarks3 || "-"} />
        <Field label="Invoice Remarks 4:" value={remarksData?.invoiceRemarks4 || "-"} />
      </Row2>
    </div>

    {/* REFUND DETAILS */}
    <div className="mt-4">
      <SectionHeader title="Refund Details" />
      <Row2>
        <Field label="Refund Amount:" value={refundData?.refundAmount || "-"} />
        <Field label="Refund Date:" value={refundData?.refundDate || "-"} />
      </Row2>
      <Row2>
        <Field label="Refund Reason:" value={refundData?.refundReason || "-"} />
        <Field label="Refund Remarks:" value={refundData?.refundRemarks || "-"} />
      </Row2>
    </div>
  </div>
);

export default function AwbViewPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id ? (Array.isArray(params.id) ? params.id[0] : params.id) : "00IMP-321";

  const [activeTab, setActiveTab] = React.useState<
    "awb-details" | "sales-billing" | "purchase-billing" | "delivery"
  >("awb-details");
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
      <div className="flex flex-wrap items-center justify-between pb-4 mb-6 gap-4 border-b border-axc-border">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            title="Go back"
          >
            <ArrowLeft size={24} />
          </button>
          <Image src="/image/logo.png" alt="axc Logo" width={100} height={60} className="object-contain" />
        </div>
        <div className="flex items-center pr-4">
          <h1 className="text-xl font-bold">Parcel#:{id}</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-axc-border mb-6 gap-8">
        <button
          onClick={() => setActiveTab("awb-details")}
          className={`flex items-center gap-2 pb-3 text-sm font-medium border-b-2 transition-colors px-2 cursor-pointer ${
            activeTab === "awb-details"
              ? "border-axc-navy text-axc-navy"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          <Eye size={16} />
          AWB Details
        </button>
        <button
          onClick={() => setActiveTab("sales-billing")}
          className={`flex items-center gap-2 pb-3 text-sm font-medium border-b-2 transition-colors px-2 cursor-pointer ${
            activeTab === "sales-billing"
              ? "border-axc-navy text-axc-navy"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          <IndianRupee size={16} />
          Sales Billing
        </button>
        {/* <button
          onClick={() => setActiveTab("purchase-billing")}
          className={`flex items-center gap-2 pb-3 text-sm font-medium border-b-2 transition-colors px-2 cursor-pointer ${
            activeTab === "purchase-billing"
              ? "border-axc-navy text-axc-navy"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          <IndianRupee size={16} />
          Purchase Billing
        </button> */}
        <button
          onClick={() => setActiveTab("delivery")}
          className={`flex items-center gap-2 pb-3 text-sm font-medium border-b-2 transition-colors px-2 cursor-pointer ${
            activeTab === "delivery"
              ? "border-axc-navy text-axc-navy"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          <Truck size={16} />
          Delivery
        </button>
      </div>

      {activeTab === "awb-details" ? (
        <AwbDetailsView id={id} formData={formData} awbData={awbData} invoiceItems={invoiceItems} />
      ) : activeTab === "sales-billing" ? (
        <SalesBillingView
          id={id}
          formData={formData}
          awbData={awbData}
          billingData={billingData}
          paymentData={paymentData}
          remarksData={remarksData}
          refundData={refundData}
        />
      /* : activeTab === "purchase-billing" ? (
        <PurchaseBillingView
          vendorInvoiceData={vendorInvoiceData}
          purchaseBillingData={purchaseBillingData}
          vendorDetailsData={vendorDetailsData}
        />
      ) */
      ) : (
        <DeliveryView id={id} formData={formData} awbData={awbData} deliveryData={deliveryData} />
      )}
    </div>
  );
}