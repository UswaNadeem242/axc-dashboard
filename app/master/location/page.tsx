"use client";

import React from "react";
import { StandardMasterListPage } from "../_shared/master-page-views";
import { locationModuleConfig } from "./types";

export default function LocationMasterPage() {
  return <StandardMasterListPage config={locationModuleConfig} />;
}

