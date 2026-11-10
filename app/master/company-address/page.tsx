"use client";

import React from "react";
import { StandardMasterListPage } from "../_shared/master-page-views";
import { companyAddressModuleConfig } from "./types";

export default function CompanyAddressMasterPage() {
  return <StandardMasterListPage config={companyAddressModuleConfig} />;
}

