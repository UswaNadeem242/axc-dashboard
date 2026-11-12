"use client";

import React from "react";
import { StandardMasterListPage } from "../_shared/master-page-views";
import { vendorModuleConfig } from "./types";

export default function VendorMasterPage() {
  return <StandardMasterListPage config={vendorModuleConfig} />;
}

