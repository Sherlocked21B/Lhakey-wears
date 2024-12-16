import ClientAccountNavbar from "@/components/ClientAccountNavbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex">
      <ClientAccountNavbar />
      <div className="flex-grow w-1 user-container pt-16 h-[calc(100vh-64px)]">
        {children}
      </div>
    </div>
  );
}
