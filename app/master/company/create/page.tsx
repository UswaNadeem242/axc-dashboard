"use client";

import React from "react";
import { StandardMasterCreatePage } from "../../_shared/master-page-views";
import { companyModuleConfig } from "../types";

export default function CreateCompanyPage() {
  return <StandardMasterCreatePage config={companyModuleConfig} />;
}

