import { AdminDashboardSidebar } from "@/components/dashboard-sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminDashboardSidebar>{children}</AdminDashboardSidebar>;
}
