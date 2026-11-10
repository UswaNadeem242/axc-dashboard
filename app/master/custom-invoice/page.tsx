"use client";

import React from "react";
import { StandardMasterListPage } from "../_shared/master-page-views";
import { customInvoiceModuleConfig } from "./types";

export default function CustomInvoiceMasterPage() {
  return <StandardMasterListPage config={customInvoiceModuleConfig} />;
}

