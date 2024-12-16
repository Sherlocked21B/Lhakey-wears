import React from "react";
import { MdMailOutline } from "react-icons/md";
import { FiPhone } from "react-icons/fi";
import { MdOutlineLocationOn } from "react-icons/md";
import Image from "next/image";
import Link from "next/link";
import { footerNav, footerSocial } from "@/lib/mapping";

export default function Footer() {
  return (
    <section className="bg-[#343434] text-white text-base my-container py-10 flex flex-col gap-10 z-40 text-center lg:text-start">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-0 justify-between">
        <div className="flex flex-col gap-3 lg:gap-4">
          <div className="mx-auto lg:mx-0 mb-1">
            <Image
              src={"/logo.png"}
              width={104.7563249}
              height={88}
              alt="lakhey-logo"
              className=""
            />
          </div>
          <div className="flex gap-2 items-center justify-center lg:justify-start">
            <MdOutlineLocationOn className="text-lg" />
            <p>Banasthali, Kathmandu</p>
          </div>
          <div className="flex gap-2 items-center justify-center lg:justify-start">
            <FiPhone className="text-[16px]" />
            <Link href={"tel:+9779849735167"}>(+977) 9849735167</Link>
          </div>
          <div className="flex gap-2 items-center justify-center lg:justify-start">
            <MdMailOutline className="text-lg" />
            <Link href={"mailto:contact@lakheywears.com.np"}>
              contact@lakheywears.com.np
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-4 lg:gap-6">
          <h2 className="text-2xl font-bold">Company</h2>
          <div className="flex flex-col gap-3 lg:gap-4">
            {footerNav.map((item) => (
              <Link key={item.label} href={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4 lg:gap-6">
          <h2 className="text-2xl font-bold">Connect with Us</h2>
          <div className="flex flex-col gap-3 lg:gap-4">
            {footerSocial.map((item) => (
              <Link key={item.label} href={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-4 justify-between">
        <p>&#169; {new Date().getFullYear()}, Lakhey Wears Pvt. Ltd.</p>
        <p className="flex flex-col md:flex-row gap-2">
          <span>Designed & Developed by </span>
          <Link
            className="font-semibold underline underline-offset-4"
            href={"https://www.itsansaar.com.np/"}
            target="_blank">
            I.T. Sansaar Pvt. Ltd.
          </Link>
        </p>
        <div className="flex gap-6">
          <Link href={"/privacy-policy"}>Privacy Policy</Link>
          <Link href={"/terms-and-conditions"}>Terms and Conditions</Link>
        </div>
      </div>
    </section>
  );
}
