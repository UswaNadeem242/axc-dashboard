"use client";

import React from "react";
import { StandardMasterCreatePage } from "../../_shared/master-page-views";
import { locationModuleConfig } from "../types";

export default function CreateLocationPage() {
  return <StandardMasterCreatePage config={locationModuleConfig} />;
}

