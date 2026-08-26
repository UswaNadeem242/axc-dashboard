"use client";
import React from "react";
import { PanelHeader } from "../formfield";

type AwbDetails = {
  contents?: string;
  comments?: string;
  remarks?: string;
  vendorName?: string;
  service?: string;
  shipperName?: string;
  customerName?: string;
  consigneeAddress?: string;
  totalValue?: string;
  pcs?: string;
  boxWeight?: string;
  consigneeName?: string;
  forwardingNo?: string;
};

function DetailRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="grid grid-cols-2 border-b border-axc-border last:border-b-0 text-regular-small">
      <div className="bg-gray-50 px-2 py-1.5 font-medium text-axc-dark-gray border-r border-axc-border">
        {label}
      </div>
      <div className="px-2 py-1.5 text-gray-700">{value || ""}</div>
    </div>
  );
}

export default function AwbDetailsPanel({ awbDetails }: { awbDetails: AwbDetails }) {
  return (
    <div className="flex flex-col gap-4 xl:sticky xl:top-0">
      <div className="bg-white rounded-lg border border-axc-border shadow-sm overflow-hidden">
        <PanelHeader title="AWB Details" />
        <div>
          <DetailRow label="Contents" value={awbDetails.contents} />
          <DetailRow label="Comments" value={awbDetails.comments} />
          <DetailRow label="Remarks" value={awbDetails.remarks} />
          <DetailRow label="Vendor Name" value={awbDetails.vendorName} />
          <DetailRow label="Service" value={awbDetails.service} />
          <DetailRow label="Shipper Name" value={awbDetails.shipperName} />
          <DetailRow label="Customer Name" value={awbDetails.customerName} />
          <DetailRow label="Consignee Address" value={awbDetails.consigneeAddress} />
          <DetailRow label="Total Value" value={awbDetails.totalValue} />
          <DetailRow label="PCS" value={awbDetails.pcs} />
          <DetailRow label="Box Weight" value={awbDetails.boxWeight} />
          <DetailRow label="Consignee Name" value={awbDetails.consigneeName} />
          <DetailRow label="Forwarding No" value={awbDetails.forwardingNo} />
        </div>
      </div>
    </div>
  );
}