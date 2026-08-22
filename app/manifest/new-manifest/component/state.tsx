export interface ManifestFormState {
  manifestNo: string;

  forwarder: string;
  editForwarder: boolean;
  vendor: string;
  editVendor: boolean;

  masterNo: string;
  masterEdiBagNo: string;
  comment: string;

  date: string;
  time: string;

  runNumber: string;
  editRunNumber: boolean;

  flightNo: string;
  editFlightNo: boolean;

  noOfBags: string;
  editNoOfBags: boolean;

  arrivalDate: string;
  arrivalTime: string;

  totalActualWt: string;
  totalVolumetricWt: string;
  totalChargeableWt: string;

  originHub: string;
  destinationHub: string;
  lineHaulVendor: string;
}

export type ManifestFormErrors = Record<string, string>;

export type ManifestTab = "entry" | "billing";

export interface ManifestBagRow {
  id: number;
  selected: boolean;
  bagNo: string;
  ediBagNo: string;
  bagId: string;
  trackBy: "PARCEL NUMBER" | "AWB NUMBER";
  awbNo: string;
  forwarderNo: string;
  bookingDate: string;
  weight: string;
  pcs: string;
  destn: string;
  service: string;
  actionDuty: string;
}

export interface ManifestChargeRow {
  id: number;
  type: string;
  coLoader: string;
  vendor: string;
  company: string;
  charge: string;
  amount: string;
  remark: string;
}

export interface ToastState {
  message: string;
  type: "success" | "info";
}