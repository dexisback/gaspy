import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-guard";
import { AdminSidebar } from "@/components/admin/Sidebar";
import { AdminMobileNav } from "@/components/admin/Sidebar";
import { TopBar } from "@/components/admin/TopBar";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  const user = {
    name: session.user.name ?? "Admin",
    email: session.user.email,
  };

  return (
    <div className="relative flex min-h-screen bg-background text-foreground">
      {/* Subtle hatch texture across the admin canvas */}
      <div aria-hidden className="admin-texture pointer-events-none fixed inset-0 z-0" />

      <AdminSidebar user={user} />

      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <TopBar user={user} />
        <AdminMobileNav />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
