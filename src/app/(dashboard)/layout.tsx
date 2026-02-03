import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background md:flex-row">
      {/* Sidebar for Desktop */}
      <div className="hidden border-r bg-sidebar md:block md:w-64 lg:w-72">
        <Sidebar className="h-full" />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
