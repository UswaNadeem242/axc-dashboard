"use client";
import React, { useEffect, useState } from "react";
import CommonTable from "../../src/common/table";
import { api } from "../../src/lib/api";

interface ManifestRow {
  id: number;
  // manifestedBy: string;
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
    awbNumber: '14066A',
    // manifestedBy: "PARCEL NUMBER",
    forwarder: "877045609300",
    runNumber: "AXC SIALKOT RUN 505",
    manifestDate: "13/09/2026",
    // forwarder: "",
    flightNumber: "",
    masterNumber: "072 94910992",
    manifestNo: "1413",
    bagNumber: "20",
    originHub: "SIALKOT",
  },
  {
    id: 2,
    awbNumber: '14066A',
    forwarder: "877045609296",
    runNumber: "AXC SIALKOT RUN 505",
    manifestDate: "13/09/2026",
    // forwarder: "",
    flightNumber: "",
    masterNumber: "072 94910992",
    manifestNo: "1413",
    bagNumber: "19",
    originHub: "SIALKOT",
  },
  {
    id: 3,
    // manifestedBy: "PARCEL NUMBER",
    awbNumber: '14066A',
    forwarder: "877045609296",
    runNumber: "AXC SIALKOT RUN 505",
    manifestDate: "13/09/2026",
    // forwarder: "",
    flightNumber: "",
    masterNumber: "072 94910992",
    manifestNo: "1413",
    bagNumber: "18",
    originHub: "SIALKOT",
  },
  {
    id: 4,
    // manifestedBy: "PARCEL NUMBER",
    awbNumber: '14066A',
    forwarder: "877045609296",
    runNumber: "AXC SIALKOT RUN 505",
    manifestDate: "13/09/2026",
    // forwarder: "",
    flightNumber: "",
    masterNumber: "072 94910992",
    manifestNo: "1413",
    bagNumber: "17",
    originHub: "SIALKOT",
  },
  {
    id: 5,
    // manifestedBy: "PARCEL NUMBER",
    awbNumber: '14066A',
    forwarder: "877045609296",
    runNumber: "AXC SIALKOT RUN 505",
    manifestDate: "13/09/2026",
    // forwarder: "",
    flightNumber: "",
    masterNumber: "072 94910992",
    manifestNo: "1413",
    bagNumber: "16",
    originHub: "SIALKOT",
  },
  {
    id: 6,
    // manifestedBy: "PARCEL NUMBER",
    awbNumber: '14066A',
    forwarder: "877045609296",
    runNumber: "AXC SIALKOT RUN 505",
    manifestDate: "13/09/2026",
    // forwarder: "",
    flightNumber: "",
    masterNumber: "072 94910992",
    manifestNo: "1413",
    bagNumber: "15",
    originHub: "SIALKOT",
  },
  {
    id: 7,
    // manifestedBy: "PARCEL NUMBER",
    awbNumber: '14066A',
    forwarder: "877045609296",
    runNumber: "AXC SIALKOT RUN 505",
    manifestDate: "13/09/2026",
    // forwarder: "",
    flightNumber: "",
    masterNumber: "072 94910992",
    manifestNo: "1413",
    bagNumber: "14",
    originHub: "SIALKOT",
  },
  {
    id: 8,
    // manifestedBy: "PARCEL NUMBER",
    awbNumber: '14066A',
    forwarder: "877045609296",
    runNumber: "AXC SIALKOT RUN 505",
    manifestDate: "13/09/2026",
    // forwarder: "",
    flightNumber: "",
    masterNumber: "072 94910992",
    manifestNo: "1413",
    bagNumber: "13",
    originHub: "SIALKOT",
  },
  {
    id: 9,
    // manifestedBy: "PARCEL NUMBER",
    awbNumber: '14066A',
    forwarder: "877045609296",
    runNumber: "AXC SIALKOT RUN 505",
    manifestDate: "13/09/2026",
    // forwarder: "",
    flightNumber: "",
    masterNumber: "072 94910992",
    manifestNo: "1413",
    bagNumber: "12",
    originHub: "SIALKOT",
  },
  {
    id: 10,
    // manifestedBy: "PARCEL NUMBER",
    awbNumber: '14066A',
    forwarder: "877045609296",
    runNumber: "AXC SIALKOT RUN 505",
    manifestDate: "13/09/2026",
    // forwarder: "",
    flightNumber: "",
    masterNumber: "072 94910992",
    manifestNo: "1413",
    bagNumber: "11",
    originHub: "SIALKOT",
  },
  {
    id: 11,
    // manifestedBy: "PARCEL NUMBER",
    awbNumber: '14066A',
    forwarder: "877045609296",
    runNumber: "AXC SIALKOT RUN 505",
    manifestDate: "13/09/2026",
    // forwarder: "",
    flightNumber: "",
    masterNumber: "072 94910992",
    manifestNo: "1413",
    bagNumber: "10",
    originHub: "SIALKOT",
  },
];

export default function ManifestDetailTable({ awbTrackingNo }: { awbTrackingNo?: string }) {
  const [rows, setRows] = useState<ManifestRow[]>(manifestData);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await api.getManifests(awbTrackingNo ? { awb_number: awbTrackingNo, per_page: 50 } : { per_page: 50 });
        const list = res?.data || [];
        if (Array.isArray(list) && list.length > 0 && mounted) {
          const mapped: ManifestRow[] = list.map((m: any, idx: number) => ({
            id: m.srNo || m.id || idx + 1,
            awbNumber: awbTrackingNo || m.bag_rows?.[0]?.awbNo || "14066A",
            forwarder: m.forwarderCode || m.forwarder_code || "-",
            runNumber: m.runNumber || m.run_number || "-",
            manifestDate: m.manifestDate || m.manifest_date || "-",
            flightNumber: m.vehicleNo || m.vehicle_no || "-",
            masterNumber: m.masterEdiBagNo || m.master_edi_bag_no || "-",
            manifestNo: m.manifestNo || m.manifest_no || "-",
            bagNumber: String(m.noOfBags || m.no_of_bags || "1"),
            originHub: m.originHubCode || m.origin_hub_code || "-",
          }));
          setRows(mapped);
        }
      } catch {
        // fallback to static manifestData
      }
    })();
    return () => {
      mounted = false;
    };
  }, [awbTrackingNo]);
  const headings = [
    {
      label: "Awb Number",
      key: "AwbNumber",
      align: "center" as const,
      truncate: false,
      render: (row: ManifestRow) => (
        <span className=" ">
          {row.awbNumber}
        </span>
      ),
    },
    {
      label: "AWB/Parcel/Forwording No.",
      key: "forwarder",
      align: "center" as const,
      truncate: false,
      render: (row: ManifestRow) => (
        <span className=" ">
          {row.forwarder}
        </span>
      ),
    },
    {
      label: "Run Number",
      key: "runNumber",
      align: "center" as const,
      truncate: false,
      render: (row: ManifestRow) => (
        <span className=" ">
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
    // {
    //   label: "Forwarder",
    //   key: "forwarder",
    //   align: "center" as const,
    //   truncate: false,
    // },
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
        <span className=" ">
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
        data={rows}
        rowKey="id"
        hidePagination={true}
        itemsPerPage={rows.length}
        showScroll={false}
      />
    </div>
  );
}