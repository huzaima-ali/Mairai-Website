import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { getAdminSession } from "@/lib/cms/auth";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

type Props = {
  searchParams: { setup?: string; error?: string; next?: string };
};

export default async function AdminLoginPage({ searchParams }: Props) {
  if (isSupabaseConfigured()) {
    const session = await getAdminSession();
    if (session) redirect(searchParams.next || "/admin");
  }

  return (
    <div className="flex min-h-dvh items-center bg-[#f4f3f1] px-4 py-10">
      <AdminLoginForm setupMissing={!isSupabaseConfigured() || searchParams.setup === "1"} />
    </div>
  );
}
