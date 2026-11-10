"use client";

import React from "react";
import { StandardMasterCreatePage } from "../../_shared/master-page-views";
import { invoiceServiceTypeModuleConfig } from "../types";

export default function CreateInvoiceServiceTypePage() {
  return <StandardMasterCreatePage config={invoiceServiceTypeModuleConfig} />;
}

