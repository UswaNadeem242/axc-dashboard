"use client";

import React from "react";
import { StandardMasterCreatePage } from "../../_shared/master-page-views";
import { customInvoiceModuleConfig } from "../types";

export default function CreateCustomInvoicePage() {
  return <StandardMasterCreatePage config={customInvoiceModuleConfig} />;
}

