"use client";

import React from "react";
import { StandardMasterListPage } from "../_shared/master-page-views";
import { districtModuleConfig } from "./types";

export default function DistrictMasterPage() {
  return <StandardMasterListPage config={districtModuleConfig} />;
}

