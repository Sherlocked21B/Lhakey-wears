"use client";
import { clientAccountNavItems } from "@/lib/mapping";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import { MdLogout } from "react-icons/md";
import { motion, AnimatePresence, useAnimationControls } from "framer-motion";
import { signOut } from "next-auth/react";

export default function ClientAccountNavbar() {
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
      width: "16rem",
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
        "p-0 h-[calc(100vh-64px)] shadow-lg sticky top-[64px] flex z-10 justify-center",
        sidebarOpen && "w-[13rem]"
      )}>
      <div className="flex flex-col relative gap-6 w-full py-10 h-full justify-center">
        {clientAccountNavItems.map((adminNavItem) => (
          <Link
            href={adminNavItem.path}
            className={cn(
              "group flex gap-6 justify-center p-0 px-4 py-2 rounded-3xl hover:bg-slate-300",
              sidebarOpen && "justify-start mx-10"
            )}
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
                    "flex justify-center items-center overflow-hidden max-h-[46px] line-clamp-1",
                    pathName === adminNavItem.path && "font-bold"
                  )}>
                  {adminNavItem.label}
                </motion.div>
              )}
            </AnimatePresence>
          </Link>
        ))}
        <div
          className={cn(
            "group flex gap-6 justify-center p-0 px-4 text-danger py-2 rounded-3xl hover:bg-danger hover:text-white",
            sidebarOpen && "justify-start mx-10"
          )}
          onClick={() => signOut({ callbackUrl: "/signin" })}>
          <div className="flex justify-center text-lg items-center group-hover:animate-bounce py-1.5">
            <MdLogout />
          </div>
          {sidebarOpen && (
            <div className="flex justify-center items-center">Log Out</div>
          )}
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-4 p-2 rounded-full w-fit text-xl bg-background shadow-lg group -rotate-90">
          <MdOutlineKeyboardDoubleArrowRight
            className={cn(
              "transition-transform duration-500 group-hover:animate-pulse rotate-90",
              sidebarOpen && "-rotate-90"
            )}
          />
        </button>
      </div>
    </motion.nav>
  );
}
