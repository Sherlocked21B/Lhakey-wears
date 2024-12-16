import ClientNavbar from "@/components/ClientNavbar";
import Footer from "@/components/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ClientNavbar />
      {children}
      <Footer />
    </>
  );
}
