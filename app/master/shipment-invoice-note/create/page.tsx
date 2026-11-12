"use client";

import React from "react";
import { StandardMasterCreatePage } from "../../_shared/master-page-views";
import { shipmentInvoiceNoteModuleConfig } from "../types";

export default function CreateShipmentInvoiceNotePage() {
  return <StandardMasterCreatePage config={shipmentInvoiceNoteModuleConfig} />;
}

