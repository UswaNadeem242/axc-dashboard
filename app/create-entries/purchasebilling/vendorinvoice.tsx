"use client";
import React from "react";

export default function VendorInvoice() {
  return (
    <div className="flex flex-col w-full bg-white rounded-xl border border-axc-border shadow-sm overflow-hidden mt-6">
      <div className="bg-axc-navy px-4 py-2.5 flex justify-between items-center">
        <h3 className="text-white text-sm font-bold uppercase tracking-wide">Vendor Invoice</h3>
      </div>
      <div className="p-5 flex flex-col gap-3 text-xs">
        
        <div className="flex items-center">
          <div className="w-[180px] shrink-0 text-[11px] font-bold text-gray-700 uppercase">PAST VENDOR INVOICE</div>
          <input type="text" className="w-full border border-gray-300 rounded bg-gray-100/50 px-3 py-1.5 focus:outline-none" disabled />
        </div>

        {[1, 2, 3, 4].map((num) => (
          <div key={num} className="flex items-center gap-4">
            <div className="w-[180px] shrink-0 text-[11px] font-bold text-gray-700 uppercase">VENDOR INVOICE {num}</div>
            <input type="text" className="w-[260px] border border-gray-300 rounded px-3 py-1.5 focus:outline-none" />
            
            <div className="w-[140px] shrink-0 text-[11px] font-bold text-gray-700 uppercase ml-4">INVOICE REMARKS {num}</div>
            <input type="text" className="w-[260px] border border-gray-300 rounded px-3 py-1.5 focus:outline-none" />
          </div>
        ))}

      </div>
    </div>
  );
}
