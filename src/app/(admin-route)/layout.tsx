import AdminNavbar from "@/components/AdminNavbar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex">
      <AdminNavbar />
      <div className="flex-grow z-0">{children}</div>
    </main>
  );
}
