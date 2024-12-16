"use client";
import React, { useState } from "react";
import Cookies from "js-cookie";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Input,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@nextui-org/react";
import { FiSearch } from "react-icons/fi";
import { clientNavItems } from "@/lib/mapping";
import { GrCart } from "react-icons/gr";
import { LuUser2 } from "react-icons/lu";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";

export default function ClientNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const session = useSession();
  const user = session?.data?.user;

  return (
    <Navbar
      maxWidth="full"
      className="my-container flex justify-between shadow-sm"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent className="md:hidden max-w-6" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
      </NavbarContent>

      <NavbarContent className="md:hidden pr-3" justify="center">
        <NavbarBrand>
          <Link href="/">
            <Image
              src={"/lakhey text logo.png"}
              width={83.987854251}
              height={30}
              alt="lakhey-logo"
            />
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden md:flex grow">
        <NavbarBrand className="max-w-fit">
          <Link href="/">
            <Image
              src={"/lakhey text logo.png"}
              width={83.987854251}
              height={30}
              alt="lakhey-logo"
            />
          </Link>
        </NavbarBrand>
        <NavbarContent className="grow gap-10" justify="center">
          {clientNavItems.map((clientNavItem) => (
            <NavbarItem key={clientNavItem.label}>
              <Link href={clientNavItem.path} className="hover:text-brand">
                {clientNavItem.label}
              </Link>
            </NavbarItem>
          ))}
        </NavbarContent>
      </NavbarContent>

      <NavbarContent as="div" className="items-center max-w-fit" justify="end">
        <Input
          className="hidden sm:block"
          classNames={{
            base: "max-w-[50%] md:max-w-[10rem] h-10",
            mainWrapper: "h-full",
            input: "text-small",
            inputWrapper:
              "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
          }}
          placeholder="Type to search..."
          size="sm"
          startContent={<FiSearch size={18} />}
          type="search"
        />

        <button
          onClick={() => signIn()}
          className={`${
            user ? "hidden" : "block"
          } border-none px-2 py-1 md:py-2 md:px-3 flex gap-2 items-center text-brand hover:text-background hover:bg-brand rounded-md text-sm md-text-base min-w-fit`}>
          <LuUser2 />
          Log In
        </button>

        <NavbarContent
          className={`${user ? "flex" : "hidden"}`}
          justify="center">
          <Link href="/user/cart">
            <GrCart className="text-xl text-brand" />
          </Link>
          <Dropdown className="bg-slate-200 w-8 h-auto" placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform size-20"
                color="success"
                name={user?.name as string}
                size="sm"
                src={(user && user.image) || "/default-avatar.png"}
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="email" className="h-14 gap-2">
                <p className="font-semibold">You are signed in as</p>
                <p className="font-semibold">{user?.email}</p>
              </DropdownItem>
              <DropdownItem key="settings">
                <Link href="/user/profile" className="hover:text-brand">
                  My Profile
                </Link>
              </DropdownItem>
              <DropdownItem key="team_settings">
                <Link href="/user/orders" className="hover:text-brand">
                  My Orders
                </Link>
              </DropdownItem>
              <DropdownItem key="analytics">
                <Link href="/user/cart" className="hover:text-brand">
                  My Cart
                </Link>
              </DropdownItem>
              <DropdownItem key="analytics">
                <Link href="/user/wishlist" className="hover:text-brand">
                  My Wishlist
                </Link>
              </DropdownItem>
              <DropdownItem
                key="logout"
                color="danger"
                onClick={() => signOut()}>
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      </NavbarContent>
      <NavbarMenu>
        {clientNavItems.map((item) => (
          <NavbarMenuItem key={item.label}>
            <Link
              className="w-full hover:text-brand"
              href={item.path}
              size="lg">
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
