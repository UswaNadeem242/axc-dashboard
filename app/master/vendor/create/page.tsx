"use client";

import React from "react";
import { StandardMasterCreatePage } from "../../_shared/master-page-views";
import { vendorModuleConfig } from "../types";

export default function CreateVendorPage() {
  return <StandardMasterCreatePage config={vendorModuleConfig} />;
}

