"use client";

import React from "react";
import { StandardMasterCreatePage } from "../../_shared/master-page-views";
import { serviceContractModuleConfig } from "../types";

export default function CreateServiceContractPage() {
  return <StandardMasterCreatePage config={serviceContractModuleConfig} />;
}

