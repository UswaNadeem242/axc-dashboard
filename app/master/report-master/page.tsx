"use client";

import React from "react";
import { StandardMasterListPage } from "../_shared/master-page-views";
import { reportMasterModuleConfig } from "./types";

export default function ReportMasterPage() {
  return <StandardMasterListPage config={reportMasterModuleConfig} />;
}

