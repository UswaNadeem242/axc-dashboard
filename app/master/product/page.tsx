"use client";

import React from "react";
import { StandardMasterListPage } from "../_shared/master-page-views";
import { productModuleConfig } from "./types";

export default function ProductMasterPage() {
  return <StandardMasterListPage config={productModuleConfig} />;
}

