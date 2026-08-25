import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminSession } from "@/lib/cms/auth";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminOpsLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured()) {
    redirect("/admin/login?setup=1");
  }

  let session = null;
  try {
    session = await getAdminSession();
  } catch (error) {
    console.error("[admin] session lookup failed", error);
    redirect("/admin/login?error=session");
  }

  if (!session) redirect("/admin/login");

  return <AdminShell email={session.profile.email || session.user.email}>{children}</AdminShell>;
}
