"use client";

import React from "react";
import { StandardMasterCreatePage } from "../../_shared/master-page-views";
import { reportMasterModuleConfig } from "../types";

export default function CreateReportMasterPage() {
  return <StandardMasterCreatePage config={reportMasterModuleConfig} />;
}

