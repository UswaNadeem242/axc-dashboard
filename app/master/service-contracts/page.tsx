"use client";

import React from "react";
import { StandardMasterListPage } from "../_shared/master-page-views";
import { serviceContractModuleConfig } from "./types";

export default function ServiceContractsMasterPage() {
  return <StandardMasterListPage config={serviceContractModuleConfig} />;
}

