"use client";
import React, { createContext, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";
import { CartType, UserType } from "@/lib/types";
import { usePathname } from "next/navigation";

interface AuthUser {
  token: string;
  user: UserType;
}

interface ComponentLevelLoader {
  loading: boolean;
  id: string;
}

interface GlobalContextProps {
  user: UserType | null;
  authUser: boolean;
  updateForm: any;
  isMobile: boolean;
  pageLevelLoader: boolean;
  componentLevelLoader: ComponentLevelLoader;
  cartItems: CartType[] | [];
  trackPage: string;
  setUser: (user: UserType | null) => void;
  setAuthUser: (authUser: boolean) => void;
  setUpdateForm: (updateForm: any) => void;
  setIsMobile: (isMobile: boolean) => void;
  setPageLevelLoader: (pageLevelLoader: boolean) => void;
  setComponentLevelLoader: (componentLevelLoader: ComponentLevelLoader) => void;
  setCartItems: (cartItems: CartType[] | []) => void;
  setTrackPage: (trackPage: string) => void;
}

export const GlobalContext = createContext<GlobalContextProps | undefined>(
  undefined
);

export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const pathName = usePathname();

  const [user, setUser] = useState<UserType | null>(null);
  const [authUser, setAuthUser] = useState(false);
  const [updateForm, setUpdateForm] = useState(null);
  const [isMobile, setIsMobile] = useState(true);
  const [componentLevelLoader, setComponentLevelLoader] = useState({
    loading: false,
    id: "",
  });
  const [pageLevelLoader, setPageLevelLoader] = useState(true);
  const [cartItems, setCartItems] = useState<CartType[] | []>([]);
  const [trackPage, setTrackPage] = useState(pathName);

  useEffect(() => {
    if (window.innerWidth >= 640) {
      setIsMobile(false);
    }
  }, []);
  useEffect(() => {
    const untrackPath = ["signin, signout"];
    const voucherPath = ["products", "user"];
    const checkPath = (item: string) => {
      return pathName.split("/").includes(item);
    };
    if (!untrackPath.some(checkPath)) {
      setTrackPage(pathName);
    }
    if (!voucherPath.some(checkPath)) {
      localStorage.removeItem("voucher");
    }
  }, [pathName]);

  return (
    <GlobalContext.Provider
      value={{
        user,
        authUser,
        setUser,
        setAuthUser,
        updateForm,
        setUpdateForm,
        isMobile,
        setIsMobile,
        componentLevelLoader,
        setComponentLevelLoader,
        pageLevelLoader,
        setPageLevelLoader,
        cartItems,
        setCartItems,
        trackPage,
        setTrackPage,
      }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an GlobalProvider");
  }
  return context;
};
