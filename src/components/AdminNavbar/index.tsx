"use client";

import { adminNavItems } from "@/lib/mapping";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import Image from "next/image";
import { MdLogout } from "react-icons/md";
import { motion, AnimatePresence, useAnimationControls } from "framer-motion";
import { signOut } from "next-auth/react";

export default function AdminNavbar() {
  const pathName = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const containerControls = useAnimationControls();

  const containerVariants = {
    close: {
      width: "6rem",
      transition: {
        type: "spring",
        damping: 15,
        duration: 0.5,
      },
    },
    open: {
      width: "15rem",
      transition: {
        type: "spring",
        damping: 15,
        duration: 0.5,
      },
    },
  };

  useEffect(() => {
    if (sidebarOpen) {
      containerControls.start("open");
      // svgControls.start("open")
    } else {
      containerControls.start("close");
      // svgControls.start("close")
    }
  }, [sidebarOpen]);
  useEffect(() => {
    // const handleResize = () => {
    setSidebarOpen(window.innerWidth >= 1024);
    // };

    // handleResize(); // Set initial state
    // window.addEventListener('resize', handleResize); // Update state on window resize

    // return () => {
    //   window.removeEventListener('resize', handleResize);
    // };
  }, []);

  return (
    <motion.nav
      variants={containerVariants}
      animate={containerControls}
      initial="close"
      className={cn(
        "px-1 lg:px-6 h-svh lg:h-lvh bg-slate-300 relative flex items-center z-10 justify-center",
        sidebarOpen && "w-[13rem]"
      )}>
      <div className="flex flex-col gap-6 py-10 h-full">
        <Link href={"/"} className="flex items-center justify-center h-[85px]">
          <Image
            className={cn(
              "w-[50px] h-auto transition-size duration-250 delay-100",
              sidebarOpen && "w-[100px]"
            )}
            src={"/logo.png"}
            width={100}
            height={84.375}
            alt="lakhey-logo"
          />
        </Link>
        {adminNavItems.map((adminNavItem) => (
          <Link
            href={adminNavItem.path}
            className="group flex gap-6 px-6 py-2 rounded-3xl hover:bg-slate-300"
            key={adminNavItem.label}>
            <div className="flex justify-center text-lg items-center group-hover:animate-bounce py-1.5">
              {pathName === adminNavItem.path ? (
                <adminNavItem.filledIcon />
              ) : (
                <adminNavItem.icon />
              )}
            </div>

            <AnimatePresence>
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    transition: { duration: 0.5, delay: 0.1 },
                  }}
                  exit={{ opacity: 0 }}
                  className={cn(
                    "flex justify-center items-center",
                    pathName === adminNavItem.path && "font-bold"
                  )}>
                  {adminNavItem.label}
                </motion.div>
              )}
            </AnimatePresence>
          </Link>
        ))}
        <div
          className="group flex gap-6 px-6 py-2 rounded-3xl hover:bg-slate-300 cursor-pointer text-danger-600"
          onClick={() => signOut({ callbackUrl: "/signin" })}>
          <div className="flex justify-center text-lg items-center group-hover:animate-bounce py-1.5">
            <MdLogout />
          </div>
          {sidebarOpen && (
            <div className="flex justify-center items-center">Log Out</div>
          )}
        </div>
      </div>
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="absolute -right-4 p-2 rounded-full w-fit text-xl bg-slate-300 group">
        <MdOutlineKeyboardDoubleArrowRight
          className={cn(
            "transition-transform duration-500 group-hover:animate-pulse",
            sidebarOpen && "rotate-180"
          )}
        />
      </button>
    </motion.nav>
  );
}
