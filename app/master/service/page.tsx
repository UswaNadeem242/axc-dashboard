"use client";

import React from "react";
import { StandardMasterListPage } from "../_shared/master-page-views";
import { serviceModuleConfig } from "./types";

export default function ServiceMasterPage() {
  return <StandardMasterListPage config={serviceModuleConfig} />;
}

