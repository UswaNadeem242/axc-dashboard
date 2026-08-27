"use client";
import React from "react";
import { useBaggingForm } from "./baggingstate";
import AwbDetailsPanel from "./awbdetails";
import BaggingPanel from "./bagging";

export default function BaggingPage() {
  const { awbDetails, ...baggingProps } = useBaggingForm();

  return (
    <div className="flex flex-col gap-4 w-full h-full min-h-0 overflow-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="relative bg-white p-3 rounded-lg border border-gray-200 w-full flex-1 min-h-0 flex flex-col overflow-hidden">
        <div className="flex-1 min-h-0 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 items-start p-1">
            <div className="xl:col-span-3">
              <BaggingPanel {...baggingProps} />
            </div>
            <div className="xl:col-span-2">
              <AwbDetailsPanel awbDetails={awbDetails} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}