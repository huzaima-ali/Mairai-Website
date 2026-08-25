import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminSession } from "@/lib/cms/auth";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export default async function AdminOpsLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured()) {
    redirect("/admin/login?setup=1");
  }
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return <AdminShell email={session.profile.email || session.user.email}>{children}</AdminShell>;
}
