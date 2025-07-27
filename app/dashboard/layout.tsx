import { SidebarNav } from "@/components/sidebar-nav";



export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <SidebarNav />
      <main className="flex-1 bg-[#15101C] text-white p-8">{children}</main>
    </div>
  );
}
