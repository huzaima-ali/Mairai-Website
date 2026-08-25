import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { getAdminSession } from "@/lib/cms/auth";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: { setup?: string; error?: string; next?: string };
};

function isNextRedirect(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    String((error as { digest?: string }).digest || "").startsWith("NEXT_REDIRECT")
  );
}

export default async function AdminLoginPage({ searchParams }: Props) {
  const configured = isSupabaseConfigured();
  let setupMissing = !configured || searchParams.setup === "1";

  if (configured) {
    try {
      const session = await getAdminSession();
      if (session) {
        redirect(searchParams.next || "/admin");
      }
    } catch (error) {
      if (isNextRedirect(error)) throw error;
      console.error("[admin] login session check failed", error);
      setupMissing = true;
    }
  }

  const authError =
    searchParams.error === "unauthorized"
      ? "This account is not authorized for Site Ops."
      : searchParams.error === "session"
        ? "Session error — try signing in again."
        : null;

  return (
    <div className="flex min-h-dvh items-center bg-[#f4f3f1] px-4 py-10">
      <AdminLoginForm setupMissing={setupMissing} authError={authError} />
    </div>
  );
}
