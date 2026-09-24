"use client";

import { FormEvent, useEffect, useState } from "react";
import { X } from "lucide-react";
import CommonDropdown from "../../src/common/dropdown";

interface CustomChargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, inputsCount: 1 | 2) => void;
}

export default function CustomChargeModal({ isOpen, onClose, onSave }: CustomChargeModalProps) {
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState("");
  const [inputsCount, setInputsCount] = useState<1 | 2>(1);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setName("");
      setInputsCount(1);
      setError("");
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 250);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) {
      setError("Field name is required.");
      return;
    }
    onSave(name.trim(), inputsCount);
    handleClose();
  };

  return (
    <>
      <div className={`fixed inset-0 z-[100] bg-black/40 transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`} onClick={handleClose} />

      <div className={`fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-0 pointer-events-none`}>
        <div
          className={`pointer-events-auto relative w-full max-w-md bg-white rounded-lg shadow-2xl transition-all duration-300 ${visible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
        >
          <div className="flex items-center justify-between border-b border-axc-border px-6 py-4">
            <h2 className="text-[18px] font-semibold text-axc-dark-gray">Add Custom Charge</h2>
            <button type="button" onClick={handleClose} className="rounded-md p-1 transition-colors hover:bg-axc-light-bg cursor-pointer">
              <X className="h-5 w-5 text-axc-gray" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {error && <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-[12px] text-red-600">{error}</div>}

            <div>
              <label className="mb-1.5 block text-[12px] font-medium text-axc-dark-gray">Field Name <span className="ml-1 text-axc-red">*</span></label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
                placeholder="Enter charge name..."
                className="w-full h-10 border border-axc-border rounded-md px-3 text-[12px] text-axc-dark-gray outline-none focus:border-axc-navy focus:ring-1 focus:ring-axc-navy"
                autoFocus
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[12px] font-medium text-axc-dark-gray">Inputs to Show <span className="ml-1 text-axc-red">*</span></label>
              <CommonDropdown
                value={String(inputsCount)}
                onChange={(val) => setInputsCount(Number(val) as 1 | 2)}
                options={[
                  { value: "1", label: "1 Input (Amount only)" },
                  { value: "2", label: "2 Inputs (Value and Amount)" }
                ]}
                className="w-full !py-2 !px-3 !text-[12px] border-axc-border h-10"
              />
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-axc-border">
              <button
                type="button"
                onClick={handleClose}
                className="h-[38px] min-w-[100px] rounded-md border border-axc-border bg-white px-4 text-[12px] font-semibold text-axc-dark-gray hover:bg-axc-light-bg cursor-pointer"
              >
                Cancel
              </button>
              <button type="submit" className="h-[38px] min-w-[100px] rounded-md bg-[#232a76] px-4 text-[12px] font-semibold text-white hover:bg-[#232a76]/90 cursor-pointer">
                Add Charge
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
