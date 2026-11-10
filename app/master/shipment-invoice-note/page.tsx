"use client";

import React from "react";
import { StandardMasterListPage } from "../_shared/master-page-views";
import { shipmentInvoiceNoteModuleConfig } from "./types";

export default function ShipmentInvoiceNoteMasterPage() {
  return <StandardMasterListPage config={shipmentInvoiceNoteModuleConfig} />;
}

