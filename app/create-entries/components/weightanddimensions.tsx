"use client";
import React from "react";
import { AwbFormState } from "./formstate";
import { FieldLabel, PanelHeader, inputClass } from "./form";
interface Props {
  form: AwbFormState;
  setForm: React.Dispatch<React.SetStateAction<AwbFormState>>;
}
export default function WeightsAndDimensions({ form, setForm }: Props) {
  return (
    <div className="xl:sticky xl:top-4 w-full">
      <div className="bg-white rounded-xl border border-axc-border shadow-sm overflow-hidden">
        <PanelHeader title="Weights and Dimensions" />
        <div className="p-5 grid grid-cols-2 gap-3 text-xs">
          <div className="flex flex-col gap-1">
            <FieldLabel>PCS</FieldLabel>
            <input type="number" value={form.pcs} onChange={(e) => setForm({ ...form, pcs: Number(e.target.value) })} className={`${inputClass} bg-gray-50`} />
          </div>
          <div className="flex flex-col gap-1">
            <FieldLabel>Box No.</FieldLabel>
            <input type="text" value={form.boxNo} onChange={(e) => setForm({ ...form, boxNo: e.target.value })} className={inputClass} />
          </div>
          <div className="flex flex-col gap-1">
            <FieldLabel>Actual Weight</FieldLabel>
            <input type="text" value={form.actualWeight} onChange={(e) => setForm({ ...form, actualWeight: e.target.value })} className={inputClass} />
          </div>
          <div className="flex flex-col gap-1">
            <FieldLabel>Volumetric Weight</FieldLabel>
            <input type="text" value={form.volumetricWeight} onChange={(e) => setForm({ ...form, volumetricWeight: e.target.value })} className={inputClass} />
          </div>
          <div className="flex flex-col gap-1">
            <FieldLabel>Consigner Weight</FieldLabel>
            <input type="text" value={form.consignerWeight} onChange={(e) => setForm({ ...form, consignerWeight: e.target.value })} className={inputClass} />
          </div>
          <div className="flex flex-col gap-1">
            <FieldLabel>Add. Weight</FieldLabel>
            <input type="text" value={form.addWeight} onChange={(e) => setForm({ ...form, addWeight: e.target.value })} className={inputClass} />
          </div>
          <div className="flex flex-col gap-1 col-span-2">
            <FieldLabel>Chargeable Weight</FieldLabel>
            <input type="text" value={form.chargeableWeight} onChange={(e) => setForm({ ...form, chargeableWeight: e.target.value })} className={`${inputClass} bg-gray-50`} />
          </div>
          <div className="col-span-2 border-t border-axc-border pt-3 mt-1">
            <p className="text-[10px] font-extrabold text-axc-dark-gray uppercase tracking-wide mb-2">Parcel 1</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <FieldLabel>L (cm)</FieldLabel>
                <input type="text" value={form.parcelL} onChange={(e) => setForm({ ...form, parcelL: e.target.value })} className={inputClass} />
              </div>
              <div className="flex flex-col gap-1">
                <FieldLabel>B (cm)</FieldLabel>
                <input type="text" value={form.parcelB} onChange={(e) => setForm({ ...form, parcelB: e.target.value })} className={inputClass} />
              </div>
              <div className="flex flex-col gap-1">
                <FieldLabel>H (cm)</FieldLabel>
                <input type="text" value={form.parcelH} onChange={(e) => setForm({ ...form, parcelH: e.target.value })} className={inputClass} />
              </div>
              <div className="flex flex-col gap-1">
                <FieldLabel>CTN</FieldLabel>
                <input type="text" value={form.parcelCtn} onChange={(e) => setForm({ ...form, parcelCtn: e.target.value })} className={inputClass} />
              </div>
              <div className="flex flex-col gap-1">
                <FieldLabel>Actual Wt.</FieldLabel>
                <input type="text" value={form.parcelActualWt} onChange={(e) => setForm({ ...form, parcelActualWt: e.target.value })} className={inputClass} />
              </div>
              <div className="flex flex-col gap-1">
                <FieldLabel>Vol. Wt.</FieldLabel>
                <input type="text" value={form.parcelVolumetricWt} onChange={(e) => setForm({ ...form, parcelVolumetricWt: e.target.value })} className={inputClass} />
              </div>
              <div className="flex flex-col gap-1 col-span-2">
                <FieldLabel>Chargeable Wt.</FieldLabel>
                <input type="text" value={form.parcelChargeableWt} onChange={(e) => setForm({ ...form, parcelChargeableWt: e.target.value })} className={inputClass} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}