"use client";
import React from "react";

export default function VendorDetails() {
  return (
    <div className="flex flex-col w-full bg-white rounded-xl border border-axc-border shadow-sm overflow-hidden">
      <div className="bg-axc-navy px-4 py-2.5 flex justify-between items-center">
        <h3 className="text-white text-sm font-bold uppercase tracking-wide">Vendor Details</h3>
        <label className="flex items-center gap-2 text-white text-[11px] font-bold cursor-pointer uppercase">
          <input type="checkbox" className="w-3.5 h-3.5 rounded-sm bg-transparent border-white" />
          EDIT VENDOR DETAILS
        </label>
      </div>
      <div className="p-5 flex flex-col gap-3 text-xs">
        
        {/* Top single fields */}
        {[
          "PRODUCT",
          "SERVICE",
          "VENDOR",
          "ORIGIN ZONE",
          "DESTINATION ZONE",
          "PCS"
        ].map((label) => (
          <div key={label} className="flex items-center">
            <div className="w-[180px] shrink-0 text-[11px] font-bold text-gray-700 uppercase">{label}</div>
            <input type="text" className="flex-1 border border-gray-300 rounded bg-gray-100/50 px-3 py-1.5 focus:outline-none" disabled />
          </div>
        ))}

        {/* Table Header */}
        <div className="grid grid-cols-[100px_60px_60px_60px_130px_130px_80px] gap-2 mt-4 border-b border-gray-200 pb-2">
          <div className="text-[10px] font-bold text-gray-700 uppercase">ACTUAL WT.(KG.)</div>
          <div className="text-[10px] font-bold text-gray-700 uppercase text-center">L(CM)</div>
          <div className="text-[10px] font-bold text-gray-700 uppercase text-center">B(CM)</div>
          <div className="text-[10px] font-bold text-gray-700 uppercase text-center">H(CM)</div>
          <div className="text-[10px] font-bold text-gray-700 uppercase text-center">VOLUMETRIC WT.(KG.)</div>
          <div className="text-[10px] font-bold text-gray-700 uppercase text-center">CHARGEABLE WT.(KG.)</div>
          <div className="text-[10px] font-bold text-gray-700 uppercase text-center">ACTION</div>
        </div>

        {/* Bottom fields */}
        <div className="flex items-center mt-2">
          <div className="w-[180px] shrink-0 text-[11px] font-bold text-gray-700 uppercase">ACTUAL WEIGHT</div>
          <input type="text" className="flex-1 border border-gray-300 rounded bg-gray-100/50 px-3 py-1.5 focus:outline-none" disabled />
        </div>

        <div className="flex items-center gap-4">
          <div className="w-[180px] shrink-0 text-[11px] font-bold text-gray-700 uppercase">CFT CONTRACT</div>
          <div className="text-[11px] font-bold text-gray-700 uppercase shrink-0">CFT ID</div>
          <input type="text" className="flex-1 border border-gray-300 rounded px-3 py-1.5 focus:outline-none" />
          <div className="text-[11px] font-bold text-gray-700 uppercase shrink-0">CFT VALUE</div>
          <input type="text" className="flex-1 border border-gray-300 rounded px-3 py-1.5 focus:outline-none" defaultValue="1" />
        </div>

        <div className="flex items-center gap-4">
          <div className="w-[180px] shrink-0 text-[11px] font-bold text-gray-700 uppercase">VENDOR CONTRACT</div>
          <div className="text-[11px] font-bold text-gray-700 uppercase shrink-0">CONTRACT ID</div>
          <input type="text" className="flex-1 border border-gray-300 rounded px-3 py-1.5 focus:outline-none" />
          <div className="text-[11px] font-bold text-gray-700 uppercase shrink-0">TAT</div>
          <input type="text" className="flex-1 border border-gray-300 rounded px-3 py-1.5 focus:outline-none" />
        </div>

        <div className="flex items-center mt-2">
          <div className="w-[180px] shrink-0 text-[11px] font-bold text-gray-700 uppercase">VOLUME WEIGHT</div>
          <input type="text" className="flex-1 border border-gray-300 rounded bg-gray-100/50 px-3 py-1.5 focus:outline-none" disabled />
        </div>
        
        <div className="flex items-center">
          <div className="w-[180px] shrink-0 text-[11px] font-bold text-gray-700 uppercase">CHARGEABLE WEIGHT</div>
          <input type="text" className="flex-1 border border-gray-300 rounded bg-gray-100/50 px-3 py-1.5 focus:outline-none" defaultValue="0" disabled />
        </div>

      </div>
    </div>
  );
}
