"use client";

import React from "react";
import { StandardMasterCreatePage } from "../../_shared/master-page-views";
import { districtModuleConfig } from "../types";

export default function CreateDistrictPage() {
  return <StandardMasterCreatePage config={districtModuleConfig} />;
}

