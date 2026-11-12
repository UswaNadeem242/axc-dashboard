"use client";

import React from "react";
import { StandardMasterCreatePage } from "../../_shared/master-page-views";
import { companyAddressModuleConfig } from "../types";

export default function CreateCompanyAddressPage() {
  return <StandardMasterCreatePage config={companyAddressModuleConfig} />;
}

