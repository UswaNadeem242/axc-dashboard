"use client";

import React from "react";
import { StandardMasterCreatePage } from "../../_shared/master-page-views";
import { productModuleConfig } from "../types";

export default function CreateProductPage() {
  return <StandardMasterCreatePage config={productModuleConfig} />;
}

