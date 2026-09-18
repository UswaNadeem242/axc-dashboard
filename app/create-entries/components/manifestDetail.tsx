"use client";
import React from "react";
import CommonTable from "../../src/common/table";

interface ManifestRow {
  id: number;
  manifestedBy: string;
  awbNumber: string;
  runNumber: string;
  manifestDate: string;
  forwarder: string;
  flightNumber: string;
  masterNumber: string;
  manifestNo: string;
  bagNumber: string;
  originHub: string;
}

const manifestData: ManifestRow[] = [
  {
    id: 1,
    manifestedBy: "PARCEL NUMBER",
    awbNumber: "877045609300",
    runNumber: "AXC SIALKOT RUN 505",
    manifestDate: "13/09/2026",
    forwarder: "",
    flightNumber: "",
    masterNumber: "072 94910992",
    manifestNo: "1413",
    bagNumber: "20",
    originHub: "SIALKOT",
  },
  {
    id: 2,
    manifestedBy: "PARCEL NUMBER",
    awbNumber: "877045609296",
    runNumber: "AXC SIALKOT RUN 505",
    manifestDate: "13/09/2026",
    forwarder: "",
    flightNumber: "",
    masterNumber: "072 94910992",
    manifestNo: "1413",
    bagNumber: "19",
    originHub: "SIALKOT",
  },
  {
    id: 3,
    manifestedBy: "PARCEL NUMBER",
    awbNumber: "877045609285",
    runNumber: "AXC SIALKOT RUN 505",
    manifestDate: "13/09/2026",
    forwarder: "",
    flightNumber: "",
    masterNumber: "072 94910992",
    manifestNo: "1413",
    bagNumber: "18",
    originHub: "SIALKOT",
  },
  {
    id: 4,
    manifestedBy: "PARCEL NUMBER",
    awbNumber: "877045609274",
    runNumber: "AXC SIALKOT RUN 505",
    manifestDate: "13/09/2026",
    forwarder: "",
    flightNumber: "",
    masterNumber: "072 94910992",
    manifestNo: "1413",
    bagNumber: "17",
    originHub: "SIALKOT",
  },
  {
    id: 5,
    manifestedBy: "PARCEL NUMBER",
    awbNumber: "877045609263",
    runNumber: "AXC SIALKOT RUN 505",
    manifestDate: "13/09/2026",
    forwarder: "",
    flightNumber: "",
    masterNumber: "072 94910992",
    manifestNo: "1413",
    bagNumber: "16",
    originHub: "SIALKOT",
  },
  {
    id: 6,
    manifestedBy: "PARCEL NUMBER",
    awbNumber: "877045609252",
    runNumber: "AXC SIALKOT RUN 505",
    manifestDate: "13/09/2026",
    forwarder: "",
    flightNumber: "",
    masterNumber: "072 94910992",
    manifestNo: "1413",
    bagNumber: "15",
    originHub: "SIALKOT",
  },
  {
    id: 7,
    manifestedBy: "PARCEL NUMBER",
    awbNumber: "877045609241",
    runNumber: "AXC SIALKOT RUN 505",
    manifestDate: "13/09/2026",
    forwarder: "",
    flightNumber: "",
    masterNumber: "072 94910992",
    manifestNo: "1413",
    bagNumber: "14",
    originHub: "SIALKOT",
  },
  {
    id: 8,
    manifestedBy: "PARCEL NUMBER",
    awbNumber: "877045609230",
    runNumber: "AXC SIALKOT RUN 505",
    manifestDate: "13/09/2026",
    forwarder: "",
    flightNumber: "",
    masterNumber: "072 94910992",
    manifestNo: "1413",
    bagNumber: "13",
    originHub: "SIALKOT",
  },
  {
    id: 9,
    manifestedBy: "PARCEL NUMBER",
    awbNumber: "877045609220",
    runNumber: "AXC SIALKOT RUN 505",
    manifestDate: "13/09/2026",
    forwarder: "",
    flightNumber: "",
    masterNumber: "072 94910992",
    manifestNo: "1413",
    bagNumber: "12",
    originHub: "SIALKOT",
  },
  {
    id: 10,
    manifestedBy: "PARCEL NUMBER",
    awbNumber: "877045609219",
    runNumber: "AXC SIALKOT RUN 505",
    manifestDate: "13/09/2026",
    forwarder: "",
    flightNumber: "",
    masterNumber: "072 94910992",
    manifestNo: "1413",
    bagNumber: "11",
    originHub: "SIALKOT",
  },
  {
    id: 11,
    manifestedBy: "PARCEL NUMBER",
    awbNumber: "877045609208",
    runNumber: "AXC SIALKOT RUN 505",
    manifestDate: "13/09/2026",
    forwarder: "",
    flightNumber: "",
    masterNumber: "072 94910992",
    manifestNo: "1413",
    bagNumber: "10",
    originHub: "SIALKOT",
  },
];

export default function ManifestDetailTable() {
  const headings = [
    {
      label: "Manifested By",
      key: "manifestedBy",
      align: "center" as const,
      truncate: false,
    },
    {
      label: "AWB/Parcel/Forwording No.",
      key: "awbNumber",
      align: "center" as const,
      truncate: false,
      render: (row: ManifestRow) => (
        <span className="text-axc-blue font-medium cursor-pointer hover:text-black">
          {row.awbNumber}
        </span>
      ),
    },
    {
      label: "Run Number",
      key: "runNumber",
      align: "center" as const,
      truncate: false,
      render: (row: ManifestRow) => (
        <span className="text-axc-blue font-medium cursor-pointer hover:text-black">
          {row.runNumber}
        </span>
      ),
    },
    {
      label: "Manifest Date",
      key: "manifestDate",
      align: "center" as const,
      truncate: false,
    },
    {
      label: "Forwarder",
      key: "forwarder",
      align: "center" as const,
      truncate: false,
    },
    {
      label: "Flight Number",
      key: "flightNumber",
      align: "center" as const,
      truncate: false,
    },
    {
      label: "Master Number",
      key: "masterNumber",
      align: "center" as const,
      truncate: false,
      render: (row: ManifestRow) => (
        <span className="text-axc-blue font-medium cursor-pointer hover:text-black">
          {row.masterNumber}
        </span>
      ),
    },
    {
      label: "Manifest No",
      key: "manifestNo",
      align: "center" as const,
      truncate: false,
    },
    {
      label: "Bag Number",
      key: "bagNumber",
      align: "center" as const,
      truncate: false,
    },
    {
      label: "Origin Hub",
      key: "originHub",
      align: "center" as const,
      truncate: false,
    },
  ];

  return (
    <div className="flex flex-col gap-2 w-full">
      
      <CommonTable
        headings={headings}
        data={manifestData}
        rowKey="id"
        hidePagination={true}
        itemsPerPage={manifestData.length}
        showScroll={false}
      />
    </div>
  );
}