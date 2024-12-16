import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import MaintenancePage from "@/components/Maintenance";
import { Providers } from "./providers";
import "../scss/custom-style.scss";
import Notification from "@/components/Notification";
import { GlobalProvider } from "@/context";
import { SessionProvider } from "next-auth/react";

const poppins = Poppins({
  weight: "400",

  subsets: ["latin"],
});
export const poppinsBold = Poppins({
  weight: "700",

  subsets: ["latin"],
});
export const poppinsMedium = Poppins({
  weight: "600",

  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lakhey Wears",
  description:
    "LAKHEY has epitomized cutting-edge style. Its intellectual universe seamlessly blends concept, structure, and image, transcending mere trends. LAKHEY endeavors to craft garments that are not only functional but also aesthetically pleasing, all while maintaining affordability. Influential, innovative, and progressive, LAKHEY is spearheading a complete modernization of the fashion landscape.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isMaintenance = false;
  return (
    <html lang="en">
      <body className={`${poppins.className} max-w-[1920px] mx-auto`}>
        <SessionProvider>
          <GlobalProvider>
            <Providers>
              {isMaintenance ? <MaintenancePage /> : <>{children}</>}
            </Providers>
            <Notification />
          </GlobalProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
