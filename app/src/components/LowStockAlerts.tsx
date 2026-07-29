"use client";
import React from "react";
import { AlertTriangle, Package } from "lucide-react";
interface ProductAlert {
  id: string;
  name: string;
  category: string;
  stock: number;
  max: number;
  restocked?: string;
}
interface AlertGroups {
  critical: ProductAlert[];
  warning: ProductAlert[];
}
export default function LowStockAlerts(): React.JSX.Element {
  const alerts: AlertGroups = {
    critical: [
      { id: "P005", name: "Smart Sensor Array", category: "Electronics", stock: 12, max: 50 },
      { id: "P007", name: "Wireless Mouse Pro", category: "Accessories", stock: 18, max: 75 }
    ],
    warning: [
      { id: "P004", name: "Office Chair Deluxe", category: "Furniture", stock: 34, max: 50, restocked: "2026-02-08" }
    ]
  };
  return (
    <div className="bg-white rounded-xl border border-[#EAEFF5] shadow-sm p-5 w-full h-full flex flex-col">
      <div className="flex items-start gap-3 mb-5">
        <div className="p-2 rounded-xl bg-[#FFF1F2] text-[#EF4444]"><AlertTriangle size={20}/></div>
        <div>
          <h3 className="text-[16px] font-semibold text-[#111827]">Low Stock Alerts</h3>
          <p className="text-[12px] text-[#9CA3AF] mt-1">3 products need restocking</p>
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]"/>
            <h4 className="text-[11px] font-bold uppercase text-[#374151]">Critical</h4>
          </div>
          <div className="space-y-3">
            {alerts.critical.map((product)=>(
              <div key={product.id} className="bg-[#FFF5F5] border border-[#FECACA] rounded-xl p-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-white border border-[#FECACA] flex items-center justify-center text-[#EF4444]"><Package size={16}/></div>
                  <div className="min-w-0">
                    <h5 className="text-[13px] font-semibold text-[#111827] truncate">{product.name}</h5>
                    <p className="text-[11px] text-[#9CA3AF] mt-1">{product.category} • ID: {product.id}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[11px] text-[#9CA3AF]">Stock:<span className="text-[14px] font-bold text-[#DC2626] ml-1">{product.stock}</span> / {product.max}</p>
                  <button className="text-[11px] font-semibold text-[#2563EB] mt-1">Restock Now →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]"/>
            <h4 className="text-[11px] font-bold uppercase text-[#374151]">Warning</h4>
          </div>
          {alerts.warning.map((product)=>(
            <div key={product.id} className="bg-[#FFFDF4] border border-[#FDE68A] rounded-xl p-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white border border-[#FDE68A] flex items-center justify-center text-[#F59E0B]"><Package size={16}/></div>

                <div>
                  <h5 className="text-[13px] font-semibold text-[#111827]">{product.name}</h5>
                  <p className="text-[11px] text-[#9CA3AF] mt-1">{product.category} • ID: {product.id}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-[#9CA3AF]">Stock:<span className="text-[14px] font-bold text-[#D97706] ml-1">{product.stock}</span> / {product.max}</p>
                {product.restocked && <p className="text-[10px] text-[#9CA3AF] mt-1">Last restocked: {product.restocked}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}