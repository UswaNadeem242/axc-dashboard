"use client";

import React from "react";
import { StandardMasterListPage } from "../_shared/master-page-views";
import { companyModuleConfig } from "./types";

export default function CompanyMasterPage() {
  return <StandardMasterListPage config={companyModuleConfig} />;
}

