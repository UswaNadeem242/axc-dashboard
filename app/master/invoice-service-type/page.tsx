"use client";

import React from "react";
import { StandardMasterListPage } from "../_shared/master-page-views";
import { invoiceServiceTypeModuleConfig } from "./types";

export default function InvoiceServiceTypeMasterPage() {
  return <StandardMasterListPage config={invoiceServiceTypeModuleConfig} />;
}

