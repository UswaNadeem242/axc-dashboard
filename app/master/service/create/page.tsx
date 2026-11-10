"use client";

import React from "react";
import { StandardMasterCreatePage } from "../../_shared/master-page-views";
import { serviceModuleConfig } from "../types";

export default function CreateServicePage() {
  return <StandardMasterCreatePage config={serviceModuleConfig} />;
}

