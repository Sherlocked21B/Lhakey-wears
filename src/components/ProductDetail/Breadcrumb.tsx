"use client";

import React from "react";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import Link from "next/link";

export default function Breadcrumb({
  category,
  name,
}: {
  category: string;
  name: string;
}) {
  return (
    <Breadcrumbs
      separator="/"
      itemClasses={{
        separator: "px-2",
      }}>
      <BreadcrumbItem>
        <Link href="/products">All Products</Link>
      </BreadcrumbItem>
      <BreadcrumbItem className="capitalize">
        <Link href={`/products/${category}`} className="">
          {category}
        </Link>
      </BreadcrumbItem>
      <BreadcrumbItem className="capitalize">{name}</BreadcrumbItem>
    </Breadcrumbs>
  );
}
