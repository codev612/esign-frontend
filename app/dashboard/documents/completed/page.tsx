"use client";

import React from "react";
import { usePathname } from "next/navigation";

import PageMenu from "@/components/layouts/common/pagemenu";
import { siteConfig } from "@/config/site";
import DataTable from "@/components/common/datatable";

export default function Completed() {
  const path = usePathname();

  return (
    <>
      <PageMenu currentPath={path} items={siteConfig.pagemenu.document} />
      <DataTable />
    </>
  );
}
